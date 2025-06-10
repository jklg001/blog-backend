import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: '用户邮箱地址',
    example: 'zhangsan@university.edu.cn',
    format: 'email',
  })
  @IsEmail({}, { message: '请输入有效的邮箱地址' })
  email: string;

  @ApiProperty({
    description: '用户密码',
    example: 'password123',
    minLength: 6,
    maxLength: 50,
  })
  @IsString({ message: '密码必须是字符串' })
  @MinLength(6, { message: '密码至少6位' })
  password: string;
}
