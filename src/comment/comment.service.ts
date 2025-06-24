import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment, CommentStatus } from './entity/comment.entity';
import { Article } from '../article/entity/article.entity';
import { User } from '../user/entity/user.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { QueryCommentDto } from './dto/query-comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * 创建评论
   */
  async create(
    createCommentDto: CreateCommentDto,
    userId: number,
    ipAddress?: string,
    userAgent?: string,
  ) {
    const { articleId, parentId, content } = createCommentDto;

    // 验证文章是否存在且可评论
    const article = await this.articleRepository.findOne({
      where: { id: articleId, isDeleted: false },
    });

    if (!article) {
      throw new NotFoundException('文章不存在');
    }

    // 验证用户是否存在
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    // 验证父评论（如果是回复）
    let parent = null;
    if (parentId) {
      parent = await this.commentRepository.findOne({
        where: { 
          id: parentId, 
          articleId: articleId,
          status: CommentStatus.PUBLISHED 
        },
      });

      if (!parent) {
        throw new NotFoundException('父评论不存在或不可回复');
      }
    }

    // 创建评论
    const comment = this.commentRepository.create({
      content,
      articleId,
      authorId: userId,
      parentId,
      ipAddress,
      userAgent,
      status: CommentStatus.PUBLISHED,
    });

    const savedComment = await this.commentRepository.save(comment);

    // 更新文章评论数
    await this.articleRepository.increment({ id: articleId }, 'commentCount', 1);

    // 更新父评论回复数
    if (parent) {
      await this.commentRepository.increment({ id: parentId }, 'replyCount', 1);
    }

    // 返回完整的评论信息
    return this.findOne(savedComment.id);
  }

  /**
   * 获取文章的评论列表（分页）
   */
  async findByArticle(articleId: number, queryDto: QueryCommentDto) {
    const { page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'DESC' } = queryDto;

    // 验证文章是否存在
    const article = await this.articleRepository.findOne({
      where: { id: articleId, isDeleted: false },
    });

    if (!article) {
      throw new NotFoundException('文章不存在');
    }

    const queryBuilder = this.commentRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.author', 'author')
      .leftJoinAndSelect('comment.replies', 'replies')
      .leftJoinAndSelect('replies.author', 'repliesAuthor')
      .where('comment.articleId = :articleId', { articleId })
      .andWhere('comment.status = :status', { status: CommentStatus.PUBLISHED })
      .andWhere('comment.parentId IS NULL') // 只获取顶级评论
      .orderBy(`comment.${sortBy}`, sortOrder);

    // 添加回复的排序
    queryBuilder.addOrderBy('replies.createdAt', 'ASC');

    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    const [items, total] = await queryBuilder.getManyAndCount();

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    };
  }

  /**
   * 获取评论的回复列表
   */
  async findReplies(commentId: number, queryDto: QueryCommentDto) {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'ASC' } = queryDto;

    // 验证父评论是否存在
    const parentComment = await this.commentRepository.findOne({
      where: { id: commentId, status: CommentStatus.PUBLISHED },
    });

    if (!parentComment) {
      throw new NotFoundException('评论不存在');
    }

    const queryBuilder = this.commentRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.author', 'author')
      .where('comment.parentId = :commentId', { commentId })
      .andWhere('comment.status = :status', { status: CommentStatus.PUBLISHED })
      .orderBy(`comment.${sortBy}`, sortOrder);

    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    const [items, total] = await queryBuilder.getManyAndCount();

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    };
  }

  /**
   * 获取单个评论详情
   */
  async findOne(id: number) {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ['author', 'article'],
    });

    if (!comment) {
      throw new NotFoundException('评论不存在');
    }

    return comment;
  }

  /**
   * 更新评论
   */
  async update(id: number, updateCommentDto: UpdateCommentDto, userId: number) {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ['author'],
    });

    if (!comment) {
      throw new NotFoundException('评论不存在');
    }

    // 权限检查：只有评论作者可以修改
    if (comment.authorId !== userId) {
      throw new ForbiddenException('无权限修改此评论');
    }

    // 检查评论状态
    if (comment.status !== CommentStatus.PUBLISHED) {
      throw new BadRequestException('只能修改已发布的评论');
    }

    // 检查修改时间限制（发布后5分钟内可修改）
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    if (comment.createdAt < fiveMinutesAgo) {
      throw new BadRequestException('评论发布超过5分钟后不能修改');
    }

    // 更新评论
    Object.assign(comment, updateCommentDto);
    const updatedComment = await this.commentRepository.save(comment);

    return this.findOne(updatedComment.id);
  }

  /**
   * 删除评论（软删除）
   */
  async remove(id: number, userId: number) {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ['author'],
    });

    if (!comment) {
      throw new NotFoundException('评论不存在');
    }

    // 权限检查：只有评论作者可以删除
    if (comment.authorId !== userId) {
      throw new ForbiddenException('无权限删除此评论');
    }

    // 软删除
    comment.status = CommentStatus.DELETED;
    await this.commentRepository.save(comment);

    // 更新文章评论数
    await this.articleRepository.decrement(
      { id: comment.articleId },
      'commentCount',
      1,
    );

    // 更新父评论回复数
    if (comment.parentId) {
      await this.commentRepository.decrement(
        { id: comment.parentId },
        'replyCount',
        1,
      );
    }

    return { message: '评论删除成功' };
  }

  /**
   * 点赞评论
   */
  async like(id: number, userId: number) {
    const comment = await this.commentRepository.findOne({
      where: { id, status: CommentStatus.PUBLISHED },
    });

    if (!comment) {
      throw new NotFoundException('评论不存在');
    }

    // 这里简化处理，实际项目中应该有专门的点赞表来记录用户点赞状态
    // 避免重复点赞
    await this.commentRepository.increment({ id }, 'likeCount', 1);

    return { message: '点赞成功', likeCount: comment.likeCount + 1 };
  }

  /**
   * 取消点赞
   */
  async unlike(id: number, userId: number) {
    const comment = await this.commentRepository.findOne({
      where: { id, status: CommentStatus.PUBLISHED },
    });

    if (!comment) {
      throw new NotFoundException('评论不存在');
    }

    if (comment.likeCount > 0) {
      await this.commentRepository.decrement({ id }, 'likeCount', 1);
    }

    return { message: '取消点赞成功', likeCount: Math.max(0, comment.likeCount - 1) };
  }

  /**
   * 获取用户的评论列表
   */
  async findByUser(userId: number, queryDto: QueryCommentDto) {
    const { page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'DESC' } = queryDto;

    const queryBuilder = this.commentRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.article', 'article')
      .where('comment.authorId = :userId', { userId })
      .andWhere('comment.status = :status', { status: CommentStatus.PUBLISHED })
      .orderBy(`comment.${sortBy}`, sortOrder);

    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    const [items, total] = await queryBuilder.getManyAndCount();

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    };
  }
} 