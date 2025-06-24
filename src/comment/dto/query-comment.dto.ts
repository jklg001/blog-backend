import {
  IsOptional,
  IsNumber,
  IsString,
  IsEnum,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { CommentStatus } from '../entity/comment.entity';

export class QueryCommentDto {
  @ApiProperty({ 
    description: '页码', 
    example: 1, 
    default: 1,
    required: false 
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: '页码必须是数字' })
  @Min(1, { message: '页码不能小于1' })
  page?: number = 1;

  @ApiProperty({ 
    description: '每页数量', 
    example: 20, 
    default: 20,
    required: false 
  })
  @IsOptional()
  @Type(() => Number)  
  @IsNumber({}, { message: '每页数量必须是数字' })
  @Min(1, { message: '每页数量不能小于1' })
  @Max(100, { message: '每页数量不能超过100' })
  limit?: number = 20;

  @ApiProperty({ 
    description: '排序字段', 
    example: 'createdAt',
    enum: ['createdAt', 'likeCount'],
    default: 'createdAt',
    required: false 
  })
  @IsOptional()
  @IsString()
  @IsEnum(['createdAt', 'likeCount'], { message: '排序字段只能是createdAt或likeCount' })
  sortBy?: string = 'createdAt';

  @ApiProperty({ 
    description: '排序方向', 
    example: 'DESC',
    enum: ['ASC', 'DESC'],
    default: 'DESC',
    required: false 
  })
  @IsOptional()
  @IsString()
  @IsEnum(['ASC', 'DESC'], { message: '排序方向只能是ASC或DESC' })
  sortOrder?: 'ASC' | 'DESC' = 'DESC';

  @ApiProperty({ 
    description: '评论状态过滤', 
    enum: CommentStatus,
    required: false 
  })
  @IsOptional()
  @IsEnum(CommentStatus, { message: '评论状态不正确' })
  status?: CommentStatus;
} 