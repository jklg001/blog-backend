import { Controller, Post, Body, HttpCode, HttpStatus, Get, UseGuards } from '@nestjs/common';
import { AuthService, LoginResponse } from './auth.service';
import { LoginDto } from './dto/login.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from '../user/entity/user.entity';

@ApiTags('用户认证')
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '用户登录',
    description: '用户使用邮箱和密码登录系统，成功后返回JWT访问令牌',
  })
  @ApiBody({
    description: '登录凭据',
    type: LoginDto
  })
  @ApiResponse({
    status: 200,
    description: '登录成功',
    schema: {
      type: 'object',
      properties: {
        access_token: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          description: 'JWT访问令牌',
        },
        user: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            username: { type: 'string', example: 'zhangsan2024' },
            email: { type: 'string', example: 'zhangsan@university.edu.cn' },
            nickname: { type: 'string', example: '张三' },
            role: { type: 'string', example: 'user' },
          },
        },
        expires_in: {
          type: 'number',
          example: 3600,
          description: '令牌过期时间（秒）',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: '请求参数错误',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: {
          type: 'array',
          items: { type: 'string' },
          example: ['请输入有效的邮箱地址', '密码至少6位'],
        },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: '认证失败',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: '邮箱或密码错误' },
        error: { type: 'string', example: 'Unauthorized' },
      },
    },
  })
  async login(@Body() loginDto: LoginDto): Promise<LoginResponse> {
    return await this.authService.login(loginDto);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '用户登出',
    description: '用户主动登出系统，使当前令牌失效',
  })
  @ApiResponse({
    status: 200,
    description: '登出成功',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: '登出成功' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: '未认证',
  })
  async logout(@CurrentUser() user: User) {
    return await this.authService.logout(user.id);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt')
  @ApiOperation({
    summary: '获取当前登录用户信息',
    description: '通过JWT令牌获取当前登录用户的基本信息',
  })
  @ApiResponse({
    status: 200,
    description: '获取成功',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        username: { type: 'string', example: 'zhangsan2024' },
        email: { type: 'string', example: 'zhangsan@university.edu.cn' },
        nickname: { type: 'string', example: '张三' },
        role: { type: 'string', example: 'user' },
        status: { type: 'string', example: 'active' },
        createdAt: { type: 'string', example: '2023-12-01T10:30:00.000Z' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: '未认证',
  })
  async getCurrentUser(@CurrentUser() user: User) {
    return user;
  }

  @Post('refresh')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '刷新访问令牌',
    description: '使用当前有效的JWT令牌获取新的访问令牌',
  })
  @ApiResponse({
    status: 200,
    description: '刷新成功',
    schema: {
      type: 'object',
      properties: {
        access_token: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          description: '新的JWT访问令牌',
        },
        expires_in: {
          type: 'number',
          example: 3600,
          description: '令牌过期时间（秒）',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: '未认证',
  })
  async refreshToken(@CurrentUser() user: User) {
    return await this.authService.refreshToken(user.id);
  }
}
