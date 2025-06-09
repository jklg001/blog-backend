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
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';

@ApiTags('博客文章')
@Controller('api/articles')
@UseGuards(JwtAuthGuard)
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: '创建文章' })
  @ApiBearerAuth('jwt') // 添加认证标识
  @ApiResponse({ 
    status: 201, 
    description: '文章创建成功',
    type: CreateArticleDto 
  })
  @ApiResponse({ 
    status: 401, 
    description: '未登录'
  })
  async create(
      @Body() createArticleDto: CreateArticleDto,
      @CurrentUser() user: User,

): Promise<ArticleResponseDto> {
    return await this.articleService.create(createArticleDto, user.id);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: '获取博客全部文章列表' })
  async findAll(): Promise<ArticleListResponseDto> {
    return await this.articleService.findAll();
  }
}
