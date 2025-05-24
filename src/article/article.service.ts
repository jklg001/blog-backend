import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article, ArticleStatus } from './entity/article.entity';
import { CreateArticleDto } from './dto/create-article.dto';
import {
  ArticleResponseDto,
  ArticleListResponseDto,
} from './dto/article-response.dto';
import { User } from '../user/entity/user.entity';

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

    return {
      id: savedArticle.id,
      title: savedArticle.title,
      status: savedArticle.status,
      createdAt: savedArticle.createdAt.toISOString(),
    };
  }

  async findAll(): Promise<ArticleListResponseDto> {
    const articles = await this.articleRepository.find({
      where: { isDeleted: false },
      relations: ['author'],
    });
    return {
      list: articles.map((article) => ({
        id: article.id,
        title: article.title,
        status: article.status,
        createdAt: article.createdAt.toISOString(),
      })),
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
}
