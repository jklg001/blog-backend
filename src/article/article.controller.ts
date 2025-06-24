import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpStatus,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import {
  ArticleResponseDto,
  ArticleListResponseDto,
  ArticleDetailResponseDto,
} from './dto/article-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { User } from '../user/entity/user.entity';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { ArticleStatus } from './entity/article.entity';

@ApiTags('博客文章')
@Controller('api/articles')
@UseGuards(JwtAuthGuard)
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ 
    summary: '创建文章',
    description: '创建一篇新的博客文章，需要登录后才能操作',
  })
  @ApiBearerAuth('jwt')
  @ApiBody({
    description: '文章创建数据',
    type: CreateArticleDto,
  })
  @ApiResponse({ 
    status: 201, 
    description: '文章创建成功',
    type: ArticleResponseDto,
  })
  @ApiResponse({ 
    status: 401, 
    description: '未登录'
  })
  @ApiResponse({
    status: 400,
    description: '请求参数错误',
  })
  async create(
    @Body() createArticleDto: CreateArticleDto,
    @CurrentUser() user: User,
  ): Promise<ArticleResponseDto> {
    return await this.articleService.create(createArticleDto, user.id);
  }

  @Get()
  @Public()
  @ApiOperation({ 
    summary: '获取文章列表',
    description: '获取博客文章列表，支持分页、搜索和筛选',
  })
  @ApiQuery({
    name: 'page',
    description: '页码，从1开始',
    required: false,
    type: Number,
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    description: '每页数量，默认10条，最大100条',
    required: false,
    type: Number,
    example: 10,
  })
  @ApiQuery({
    name: 'search',
    description: '搜索关键词，模糊匹配标题和内容',
    required: false,
    type: String,
    example: 'NestJS',
  })
  @ApiQuery({
    name: 'status',
    description: '文章状态筛选',
    required: false,
    enum: ['published', 'draft'],
    example: 'published',
  })
  @ApiQuery({
    name: 'categoryId',
    description: '分类ID筛选',
    required: false,
    type: Number,
    example: 1,
  })
  @ApiQuery({
    name: 'tagId',
    description: '标签ID筛选',
    required: false,
    type: Number,
    example: 1,
  })
  @ApiQuery({
    name: 'authorId',
    description: '作者ID筛选',
    required: false,
    type: Number,
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: '获取成功',
    type: ArticleListResponseDto,
  })
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('categoryId') categoryId?: number,
    @Query('tagId') tagId?: number,
    @Query('authorId') authorId?: number,
  ): Promise<ArticleListResponseDto> {
    return await this.articleService.findAll({
      page: page || 1,
      limit: Math.min(limit || 10, 100),
      search,
      status,
      categoryId,
      tagId,
      authorId,
    });
  }

  @Get(':id')
  @Public()
  @ApiOperation({
    summary: '根据ID获取文章详情',
    description: '获取指定ID的文章详细信息，包含完整内容、分类、标签等',
  })
  @ApiParam({
    name: 'id',
    description: '文章ID',
    type: 'number',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: '获取成功',
    type: ArticleDetailResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: '文章不存在',
  })
  async findOne(@Param('id') id: string): Promise<ArticleDetailResponseDto> {
    return await this.articleService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: '更新文章',
    description: '更新指定ID的文章信息，只有作者本人可以更新',
  })
  @ApiBearerAuth('jwt')
  @ApiParam({
    name: 'id',
    description: '文章ID',
    type: 'number',
    example: 1,
  })
  @ApiBody({
    description: '文章更新数据',
    type: UpdateArticleDto,
  })
  @ApiResponse({
    status: 200,
    description: '更新成功',
    type: ArticleResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: '未认证',
  })
  @ApiResponse({
    status: 403,
    description: '无权限，只能更新自己的文章',
  })
  @ApiResponse({
    status: 404,
    description: '文章不存在',
  })
  async update(
    @Param('id') id: string,
    @Body() updateArticleDto: UpdateArticleDto,
    @CurrentUser() user: User,
  ): Promise<ArticleResponseDto> {
    return await this.articleService.update(+id, updateArticleDto, user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: '删除文章',
    description: '删除指定ID的文章，只有作者本人可以删除',
  })
  @ApiBearerAuth('jwt')
  @ApiParam({
    name: 'id',
    description: '文章ID',
    type: 'number',
    example: 1,
  })
  @ApiResponse({
    status: 204,
    description: '删除成功',
  })
  @ApiResponse({
    status: 401,
    description: '未认证',
  })
  @ApiResponse({
    status: 403,
    description: '无权限，只能删除自己的文章',
  })
  @ApiResponse({
    status: 404,
    description: '文章不存在',
  })
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<void> {
    await this.articleService.remove(+id, user.id);
  }

  @Patch(':id/publish')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '发布文章',
    description: '将草稿状态的文章发布，只有作者本人可以操作',
  })
  @ApiBearerAuth('jwt')
  @ApiParam({
    name: 'id',
    description: '文章ID',
    type: 'number',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: '发布成功',
    type: ArticleResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: '未认证',
  })
  @ApiResponse({
    status: 403,
    description: '无权限，只能发布自己的文章',
  })
  @ApiResponse({
    status: 404,
    description: '文章不存在',
  })
  @ApiResponse({
    status: 400,
    description: '文章已经是发布状态',
  })
  async publishArticle(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<ArticleResponseDto> {
    return await this.articleService.publishArticle(+id, user.id);
  }

  @Post(':id/like')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '点赞文章',
    description: '给指定文章点赞，如果已点赞则取消点赞',
  })
  @ApiBearerAuth('jwt')
  @ApiParam({
    name: 'id',
    description: '文章ID',
    type: 'number',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: '操作成功',
    schema: {
      type: 'object',
      properties: {
        liked: { type: 'boolean', example: true, description: '是否已点赞' },
        likeCount: { type: 'number', example: 39, description: '总点赞数' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: '未认证',
  })
  @ApiResponse({
    status: 404,
    description: '文章不存在',
  })
  async toggleLike(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ) {
    return await this.articleService.toggleLike(+id, user.id);
  }

  @Post(':id/save')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '收藏文章',
    description: '收藏指定文章，如果已收藏则取消收藏',
  })
  @ApiBearerAuth('jwt')
  @ApiParam({
    name: 'id',
    description: '文章ID',
    type: 'number',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: '操作成功',
    schema: {
      type: 'object',
      properties: {
        saved: { type: 'boolean', example: true, description: '是否已收藏' },
        message: { type: 'string', example: '收藏成功' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: '未认证',
  })
  @ApiResponse({
    status: 404,
    description: '文章不存在',
  })
  async toggleSave(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ) {
    return await this.articleService.toggleSave(+id, user.id);
  }

  @Get('user/:userId')
  @Public()
  @ApiOperation({
    summary: '获取指定用户的文章列表',
    description: '获取指定用户发布的所有文章列表',
  })
  @ApiParam({
    name: 'userId',
    description: '用户ID',
    type: 'number',
    example: 1,
  })
  @ApiQuery({
    name: 'page',
    description: '页码',
    required: false,
    type: Number,
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    description: '每页数量',
    required: false,
    type: Number,
    example: 10,
  })
  @ApiResponse({
    status: 200,
    description: '获取成功',
    type: ArticleListResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: '用户不存在',
  })
  async findByUser(
    @Param('userId') userId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ): Promise<ArticleListResponseDto> {
    return await this.articleService.findByUser(+userId, {
      page: page || 1,
      limit: Math.min(limit || 10, 100),
    });
  }

  @Get('my/articles')
  @ApiOperation({
    summary: '获取我的文章列表',
    description: '获取当前用户的所有文章列表，用于后台管理',
  })
  @ApiBearerAuth('jwt')
  @ApiQuery({
    name: 'page',
    description: '页码',
    required: false,
    type: Number,
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    description: '每页数量',
    required: false,
    type: Number,
    example: 10,
  })
  @ApiQuery({
    name: 'status',
    description: '文章状态筛选',
    required: false,
    enum: ArticleStatus,
    example: ArticleStatus.PUBLISHED,
  })
  @ApiQuery({
    name: 'search',
    description: '搜索关键词，模糊匹配标题',
    required: false,
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: '获取成功',
    type: ArticleListResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: '未认证',
  })
  async getMyArticles(
    @CurrentUser() user: User,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: ArticleStatus,
    @Query('search') search?: string,
  ): Promise<ArticleListResponseDto> {
    return await this.articleService.findByUser(user.id, {
      page: page || 1,
      limit: Math.min(limit || 10, 100),
      status,
      search,
    });
  }

  @Get('my/drafts')
  @ApiOperation({
    summary: '获取我的草稿列表',
    description: '获取当前用户的所有草稿文章',
  })
  @ApiBearerAuth('jwt')
  @ApiQuery({
    name: 'page',
    description: '页码',
    required: false,
    type: Number,
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    description: '每页数量',
    required: false,
    type: Number,
    example: 10,
  })
  @ApiResponse({
    status: 200,
    description: '获取成功',
    type: ArticleListResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: '未认证',
  })
  async getMyDrafts(
    @CurrentUser() user: User,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ): Promise<ArticleListResponseDto> {
    return await this.articleService.findByUser(user.id, {
      page: page || 1,
      limit: Math.min(limit || 10, 100),
      status: 'draft',
    });
  }
}
