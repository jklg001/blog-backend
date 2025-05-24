/*
 * @Author: 李嘉明 lijiaming@shuidi-inc.com
 * @Date: 2025-05-13 11:08:26
 * @LastEditors: 李嘉明 lijiaming@shuidi-inc.com
 * @LastEditTime: 2025-05-13 21:00:04
 * @FilePath: /blog-backend/src/user/user.service.ts
 */
import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './entity/user.entity';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async register(registerDto: RegisterDto) {
    // 检查邮箱是否已存在
    const existingUser = await this.userRepository.findOne({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new ConflictException('邮箱已被注册');
    }

    // 加密密码
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(registerDto.password, saltRounds);

    // 创建用户实例
    const user = this.userRepository.create({
      username: registerDto.username,
      email: registerDto.email,
      password: hashedPassword,
      role: 'user',
      status: 'active',
    });

    // 保存到数据库
    return this.userRepository.save(user);
  }
}
