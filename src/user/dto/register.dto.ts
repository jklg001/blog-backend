import { IsEmail, Length } from 'class-validator';

export class RegisterDto {
  @Length(2, 20)
  name: string; // 学生姓名

  @IsEmail()
  email: string; // 学校邮箱

  @Length(6, 20)
  password: string; // 校园系统密码
}
