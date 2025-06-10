import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article, ArticleStatus } from './entity/article.entity';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import {
  ArticleResponseDto,
  ArticleListResponseDto,
  ArticleDetailResponseDto,
} from './dto/article-response.dto';
import { User } from '../user/entity/user.entity';

interface FindAllQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  categoryId?: number;
  tagId?: number;
  authorId?: number;
}

interface FindByUserQuery {
  page?: number;
  limit?: number;
  status?: string;
}

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(
    createArticleDto: CreateArticleDto,
    userId: number,
  ): Promise<ArticleResponseDto> {
    // 验证用户是否存在
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new BadRequestException(`用户ID ${userId} 不存在`);
    }

    const article = new Article();
    article.title = createArticleDto.title;
    article.content = createArticleDto.content;
    article.summary = createArticleDto.summary || null;
    article.coverImage = createArticleDto.coverImage || null;
    article.authorId = userId;
    article.categoryIds = createArticleDto.categoryIds;
    article.tagIds = createArticleDto.tagIds || null;
    article.status = createArticleDto.status;

    // 如果状态是已发布，设置发布时间
    if (createArticleDto.status === ArticleStatus.PUBLISHED) {
      article.publishedAt = new Date();
    }

    const savedArticle = await this.articleRepository.save(article);

    // 重新查询以获取关联数据
    const articleWithAuthor = await this.articleRepository.findOne({
      where: { id: savedArticle.id },
      relations: ['author'],
    });

    if (!articleWithAuthor) {
      throw new BadRequestException('创建文章失败');
    }

    return this.transformToResponseDto(articleWithAuthor);
  }

  async findAll(query: FindAllQuery = {}): Promise<ArticleListResponseDto> {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      categoryId,
      tagId,
      authorId,
    } = query;

    const queryBuilder = this.articleRepository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.author', 'author')
      .where('article.isDeleted = :isDeleted', { isDeleted: false });

    // 搜索功能
    if (search) {
      queryBuilder.andWhere(
        '(article.title LIKE :search OR article.content LIKE :search)',
        { search: `%${search}%` },
      );
    }

    // 状态筛选
    if (status) {
      queryBuilder.andWhere('article.status = :status', { status });
    }

    // 分类筛选
    if (categoryId) {
      queryBuilder.andWhere(
        'JSON_CONTAINS(article.categoryIds, :categoryId)',
        { categoryId: categoryId.toString() },
      );
    }

    // 标签筛选
    if (tagId) {
      queryBuilder.andWhere(
        'JSON_CONTAINS(article.tagIds, :tagId)',
        { tagId: tagId.toString() },
      );
    }

    // 作者筛选
    if (authorId) {
      queryBuilder.andWhere('article.authorId = :authorId', { authorId });
    }

    // 排序
    queryBuilder.orderBy('article.createdAt', 'DESC');

    // 分页
    const [articles, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    const totalPages = Math.ceil(total / limit);

    return {
      list: articles.map((article) => this.transformToResponseDto(article)),
      meta: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  async findOne(id: number): Promise<ArticleDetailResponseDto> {
    const article = await this.articleRepository.findOne({
      where: { id, isDeleted: false },
      relations: ['author'],
    });

    if (!article) {
      throw new NotFoundException('文章不存在');
    }

    // 增加阅读量
    await this.articleRepository.increment({ id }, 'viewCount', 1);
    article.viewCount += 1;

    return this.transformToDetailResponseDto(article);
  }

  async update(
    id: number,
    updateArticleDto: UpdateArticleDto,
    userId: number,
  ): Promise<ArticleResponseDto> {
    const article = await this.articleRepository.findOne({
      where: { id, isDeleted: false },
      relations: ['author'],
    });

    if (!article) {
      throw new NotFoundException('文章不存在');
    }

    // 检查权限：只有作者可以更新
    if (article.authorId !== userId) {
      throw new ForbiddenException('只能更新自己的文章');
    }

    // 更新字段
    if (updateArticleDto.title !== undefined) {
      article.title = updateArticleDto.title;
    }
    if (updateArticleDto.content !== undefined) {
      article.content = updateArticleDto.content;
    }
    if (updateArticleDto.summary !== undefined) {
      article.summary = updateArticleDto.summary;
    }
    if (updateArticleDto.coverImage !== undefined) {
      article.coverImage = updateArticleDto.coverImage;
    }
    if (updateArticleDto.categoryIds !== undefined) {
      article.categoryIds = updateArticleDto.categoryIds;
    }
    if (updateArticleDto.tagIds !== undefined) {
      article.tagIds = updateArticleDto.tagIds;
    }
    if (updateArticleDto.status !== undefined) {
      const oldStatus = article.status;
      article.status = updateArticleDto.status;
      
      // 如果从草稿变为发布，设置发布时间
      if (oldStatus === ArticleStatus.DRAFT && updateArticleDto.status === ArticleStatus.PUBLISHED) {
        article.publishedAt = new Date();
      }
    }

    const savedArticle = await this.articleRepository.save(article);
    return this.transformToResponseDto(savedArticle);
  }

  async remove(id: number, userId: number): Promise<void> {
    const article = await this.articleRepository.findOne({
      where: { id, isDeleted: false },
    });

    if (!article) {
      throw new NotFoundException('文章不存在');
    }

    // 检查权限：只有作者可以删除
    if (article.authorId !== userId) {
      throw new ForbiddenException('只能删除自己的文章');
    }

    // 软删除
    article.isDeleted = true;
    await this.articleRepository.save(article);
  }

  async toggleLike(id: number, userId: number) {
    const article = await this.articleRepository.findOne({
      where: { id, isDeleted: false },
    });

    if (!article) {
      throw new NotFoundException('文章不存在');
    }

    // 这里应该有一个用户点赞表，为了简化，我们直接操作点赞数
    // 实际项目中应该创建一个UserArticleLike表来记录用户点赞关系
    
    // 模拟点赞逻辑（实际应该查询点赞表）
    const liked = false; // 这里应该查询用户是否已点赞
    
    if (liked) {
      // 取消点赞
      await this.articleRepository.decrement({ id }, 'likeCount', 1);
      return { liked: false, likeCount: article.likeCount - 1 };
    } else {
      // 点赞
      await this.articleRepository.increment({ id }, 'likeCount', 1);
      return { liked: true, likeCount: article.likeCount + 1 };
    }
  }

  async toggleSave(id: number, userId: number) {
    const article = await this.articleRepository.findOne({
      where: { id, isDeleted: false },
    });

    if (!article) {
      throw new NotFoundException('文章不存在');
    }

    // 这里应该有一个用户收藏表，为了简化，我们返回模拟数据
    // 实际项目中应该创建一个UserArticleSave表来记录用户收藏关系
    
    const saved = false; // 这里应该查询用户是否已收藏
    
    return {
      saved: !saved,
      message: saved ? '取消收藏成功' : '收藏成功',
    };
  }

  async findByUser(
    userId: number,
    query: FindByUserQuery = {},
  ): Promise<ArticleListResponseDto> {
    const { page = 1, limit = 10, status } = query;

    // 验证用户是否存在
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    const queryBuilder = this.articleRepository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.author', 'author')
      .where('article.authorId = :userId', { userId })
      .andWhere('article.isDeleted = :isDeleted', { isDeleted: false });

    // 状态筛选
    if (status) {
      queryBuilder.andWhere('article.status = :status', { status });
    }

    // 排序
    queryBuilder.orderBy('article.createdAt', 'DESC');

    // 分页
    const [articles, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    const totalPages = Math.ceil(total / limit);

    return {
      list: articles.map((article) => this.transformToResponseDto(article)),
      meta: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  async findById(id: number): Promise<Article> {
    const article = await this.articleRepository.findOne({
      where: { id, isDeleted: false },
      relations: ['author'],
    });

    if (!article) {
      throw new NotFoundException('文章不存在');
    }

    return article;
  }

  private transformToResponseDto(article: Article): ArticleResponseDto {
    return {
      id: article.id,
      title: article.title,
      status: article.status,
      createdAt: article.createdAt.toISOString(),
      summary: article.summary || undefined,
      coverImage: article.coverImage || undefined,
      viewCount: article.viewCount,
      likeCount: article.likeCount,
      commentCount: article.commentCount,
      author: {
        id: article.author.id,
        username: article.author.username,
        avatar: article.author.avatar || undefined,
        bio: article.author.bio || undefined,
      },
    };
  }

  private transformToDetailResponseDto(article: Article): ArticleDetailResponseDto {
    return {
      id: article.id,
      title: article.title,
      content: article.content,
      status: article.status,
      createdAt: article.createdAt.toISOString(),
      summary: article.summary || undefined,
      coverImage: article.coverImage || undefined,
      viewCount: article.viewCount,
      likeCount: article.likeCount,
      commentCount: article.commentCount,
      author: {
        id: article.author.id,
        username: article.author.username,
        avatar: article.author.avatar || undefined,
        bio: article.author.bio || undefined,
      },
      categories: [], // 这里应该根据categoryIds查询分类信息
      tags: [], // 这里应该根据tagIds查询标签信息
      liked: false, // 这里应该查询当前用户是否点赞
      saved: false, // 这里应该查询当前用户是否收藏
      publishedAt: article.publishedAt ? article.publishedAt.toISOString() : undefined,
      updatedAt: article.updatedAt.toISOString(),
    };
  }
}
