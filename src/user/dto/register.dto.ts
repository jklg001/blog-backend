import { IsEmail, Length, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    description: '学生姓名',
    example: '张三',
    minLength: 2,
    maxLength: 20,
  })
  @Length(2, 20, { message: '姓名长度必须在2-20个字符之间' })
  @IsString({ message: '姓名必须是字符串' })
  name: string;

  @ApiProperty({
    description: '学校邮箱地址',
    example: 'zhangsan@university.edu.cn',
    format: 'email',
  })
  @IsEmail({}, { message: '请输入有效的邮箱地址' })
  email: string;

  @ApiProperty({
    description: '校园系统密码',
    example: 'password123',
    minLength: 6,
    maxLength: 20,
  })
  @Length(6, 20, { message: '密码长度必须在6-20个字符之间' })
  @IsString({ message: '密码必须是字符串' })
  password: string;

  @ApiProperty({
    description: '用户名（唯一标识）',
    example: 'zhangsan2024',
    minLength: 3,
    maxLength: 30,
  })
  @Length(3, 30, { message: '用户名长度必须在3-30个字符之间' })
  @IsString({ message: '用户名必须是字符串' })
  username: string;
}
