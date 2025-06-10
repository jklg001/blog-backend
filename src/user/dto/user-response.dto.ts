import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({
    description: '用户ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: '用户名',
    example: 'zhangsan2024',
  })
  username: string;

  @ApiProperty({
    description: '用户昵称',
    example: '张三',
  })
  nickname: string;

  @ApiProperty({
    description: '邮箱地址',
    example: 'zhangsan@example.com',
  })
  email: string;

  @ApiPropertyOptional({
    description: '头像URL',
    example: 'https://example.com/avatar.jpg',
  })
  avatar?: string;

  @ApiProperty({
    description: '用户角色',
    enum: ['admin', 'user'],
    example: 'user',
  })
  role: 'admin' | 'user';

  @ApiProperty({
    description: '用户状态',
    enum: ['active', 'inactive', 'banned'],
    example: 'active',
  })
  status: 'active' | 'inactive' | 'banned';

  @ApiProperty({
    description: '创建时间',
    example: '2023-12-01T10:30:00.000Z',
  })
  createdAt: Date;
}

export class UserProfileResponseDto extends UserResponseDto {
  @ApiProperty({
    description: '姓名',
    example: '张三',
  })
  name: string;

  @ApiPropertyOptional({
    description: '手机号',
    example: '13800138000',
  })
  phone?: string;

  @ApiPropertyOptional({
    description: '个人简介',
    example: '这是我的个人简介',
  })
  bio?: string;

  @ApiPropertyOptional({
    description: '最后登录时间',
    example: '2023-12-01T10:30:00.000Z',
  })
  lastLoginAt?: Date;

  @ApiProperty({
    description: '更新时间',
    example: '2023-12-01T10:30:00.000Z',
  })
  updatedAt: Date;
} 