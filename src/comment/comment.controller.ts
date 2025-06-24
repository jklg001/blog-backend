import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  Req,
  UseGuards,
  ParseIntPipe,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { Request } from 'express';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { QueryCommentDto } from './dto/query-comment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

// 扩展Request类型以包含用户信息
interface AuthenticatedRequest extends Request {
  user: {
    id: number;
    email: string;
    username: string;
    role: string;
  };
}

@ApiTags('评论管理')
@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: '创建评论' })
  @ApiResponse({ status: 201, description: '评论创建成功' })
  @ApiResponse({ status: 401, description: '未授权' })
  @ApiResponse({ status: 404, description: '文章不存在' })
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createCommentDto: CreateCommentDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user.id;
    const ipAddress = req.ip;
    const userAgent = req.headers['user-agent'];

    return this.commentService.create(
      createCommentDto,
      userId,
      ipAddress,
      userAgent,
    );
  }

  @Get('article/:articleId')
  @ApiOperation({ summary: '获取文章评论列表' })
  @ApiParam({ name: 'articleId', description: '文章ID' })
  @ApiQuery({ type: QueryCommentDto })
  @ApiResponse({ status: 200, description: '获取成功' })
  @ApiResponse({ status: 404, description: '文章不存在' })
  async findByArticle(
    @Param('articleId', ParseIntPipe) articleId: number,
    @Query() queryDto: QueryCommentDto,
  ) {
    return this.commentService.findByArticle(articleId, queryDto);
  }

  @Get(':id/replies')
  @ApiOperation({ summary: '获取评论回复列表' })
  @ApiParam({ name: 'id', description: '评论ID' })
  @ApiQuery({ type: QueryCommentDto })
  @ApiResponse({ status: 200, description: '获取成功' })
  @ApiResponse({ status: 404, description: '评论不存在' })
  async findReplies(
    @Param('id', ParseIntPipe) id: number,
    @Query() queryDto: QueryCommentDto,
  ) {
    return this.commentService.findReplies(id, queryDto);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: '获取用户评论列表' })
  @ApiParam({ name: 'userId', description: '用户ID' })
  @ApiQuery({ type: QueryCommentDto })
  @ApiResponse({ status: 200, description: '获取成功' })
  async findByUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Query() queryDto: QueryCommentDto,
  ) {
    return this.commentService.findByUser(userId, queryDto);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取评论详情' })
  @ApiParam({ name: 'id', description: '评论ID' })
  @ApiResponse({ status: 200, description: '获取成功' })
  @ApiResponse({ status: 404, description: '评论不存在' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.commentService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: '更新评论' })
  @ApiParam({ name: 'id', description: '评论ID' })
  @ApiResponse({ status: 200, description: '更新成功' })
  @ApiResponse({ status: 401, description: '未授权' })
  @ApiResponse({ status: 403, description: '无权限' })
  @ApiResponse({ status: 404, description: '评论不存在' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCommentDto: UpdateCommentDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user.id;
    return this.commentService.update(id, updateCommentDto, userId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: '删除评论' })
  @ApiParam({ name: 'id', description: '评论ID' })
  @ApiResponse({ status: 200, description: '删除成功' })
  @ApiResponse({ status: 401, description: '未授权' })
  @ApiResponse({ status: 403, description: '无权限' })
  @ApiResponse({ status: 404, description: '评论不存在' })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user.id;
    return this.commentService.remove(id, userId);
  }

  @Post(':id/like')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: '点赞评论' })
  @ApiParam({ name: 'id', description: '评论ID' })
  @ApiResponse({ status: 200, description: '点赞成功' })
  @ApiResponse({ status: 401, description: '未授权' })
  @ApiResponse({ status: 404, description: '评论不存在' })
  async like(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user.id;
    return this.commentService.like(id, userId);
  }

  @Delete(':id/like')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: '取消点赞评论' })
  @ApiParam({ name: 'id', description: '评论ID' })
  @ApiResponse({ status: 200, description: '取消点赞成功' })
  @ApiResponse({ status: 401, description: '未授权' })
  @ApiResponse({ status: 404, description: '评论不存在' })
  async unlike(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user.id;
    return this.commentService.unlike(id, userId);
  }
}
