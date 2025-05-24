import {
  Controller,
  Get,
  Post,
  Body,
  HttpStatus,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import {
  ArticleResponseDto,
  ArticleListResponseDto,
} from './dto/article-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { User } from '../user/entity/user.entity';

@Controller('api/articles')
@UseGuards(JwtAuthGuard)
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createArticleDto: CreateArticleDto,
    @CurrentUser() user: User,
  ): Promise<ArticleResponseDto> {
    return await this.articleService.create(createArticleDto, user.id);
  }

  @Get()
  @Public()
  async findAll(): Promise<ArticleListResponseDto> {
    return await this.articleService.findAll();
  }
}
