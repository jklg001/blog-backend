import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Put,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterDto } from './dto/register.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from './entity/user.entity';
import {
  UserResponseDto,
  UserProfileResponseDto,
} from './dto/user-response.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('用户管理')
@Controller('api/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: '用户注册',
    description: '创建新的用户账户，需要提供姓名、邮箱、密码和用户名',
  })
  @ApiBody({
    description: '用户注册信息',
    type: RegisterDto,
  })
  @ApiResponse({
    status: 201,
    description: '注册成功',
    type: UserResponseDto,
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
          example: ['邮箱格式不正确', '密码至少6位'],
        },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: '邮箱或用户名已存在',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 409 },
        message: { type: 'string', example: '邮箱已被注册' },
        error: { type: 'string', example: 'Conflict' },
      },
    },
  })
  async register(@Body() registerDto: RegisterDto): Promise<UserResponseDto> {
    return this.userService.register(registerDto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt')
  @ApiOperation({
    summary: '获取当前用户信息',
    description: '获取当前登录用户的详细个人信息',
  })
  @ApiResponse({
    status: 200,
    description: '获取成功',
    type: UserProfileResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: '未认证，请先登录',
  })
  async getProfile(@CurrentUser() user: User): Promise<UserProfileResponseDto> {
    return this.userService.getProfile(user.id);
  }

  @Put('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt')
  @ApiOperation({
    summary: '更新用户信息',
    description: '更新当前登录用户的个人信息',
  })
  @ApiBody({
    description: '用户更新信息',
    type: UpdateUserDto,
  })
  @ApiResponse({
    status: 200,
    description: '更新成功',
    type: UserProfileResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: '未认证，请先登录',
  })
  @ApiResponse({
    status: 400,
    description: '请求参数错误',
  })
  async updateProfile(
    @CurrentUser() user: User,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserProfileResponseDto> {
    return this.userService.updateProfile(user.id, updateUserDto);
  }

  @Get(':id')
  @ApiOperation({
    summary: '根据ID获取用户信息',
    description: '获取指定用户的公开信息',
  })
  @ApiParam({
    name: 'id',
    description: '用户ID',
    type: 'number',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: '获取成功',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: '用户不存在',
  })
  async findOne(@Param('id') id: string): Promise<UserResponseDto> {
    return this.userService.findOne(+id);
  }
}
