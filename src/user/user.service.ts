/*
 * @Author: 李嘉明 lijiaming@shuidi-inc.com
 * @Date: 2025-05-13 11:08:26
 * @LastEditors: 李嘉明 lijiaming@shuidi-inc.com
 * @LastEditTime: 2025-05-13 21:00:04
 * @FilePath: /blog-backend/src/user/user.service.ts
 */
import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './entity/user.entity';
import { RegisterDto } from './dto/register.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto, UserProfileResponseDto } from './dto/user-response.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async register(registerDto: RegisterDto): Promise<UserResponseDto> {
    // 检查邮箱是否已存在
    const existingEmailUser = await this.userRepository.findOne({
      where: { email: registerDto.email },
    });

    if (existingEmailUser) {
      throw new ConflictException('邮箱已被注册');
    }

    // 检查用户名是否已存在
    const existingUsernameUser = await this.userRepository.findOne({
      where: { username: registerDto.username },
    });

    if (existingUsernameUser) {
      throw new ConflictException('用户名已被使用');
    }

    // 加密密码
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(registerDto.password, saltRounds);

    // 创建用户实例
    const user = this.userRepository.create({
      username: registerDto.username,
      nickname: registerDto.name, // 将name映射到nickname
      email: registerDto.email,
      password: hashedPassword,
      role: 'user',
      status: 'active',
    });

    // 保存到数据库
    const savedUser = await this.userRepository.save(user);
    
    return this.transformToResponseDto(savedUser);
  }

  async getProfile(userId: number): Promise<UserProfileResponseDto> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    return this.transformToProfileResponseDto(user);
  }

  async updateProfile(
    userId: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UserProfileResponseDto> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    // 更新字段
    if (updateUserDto.nickname !== undefined) {
      user.nickname = updateUserDto.nickname;
    }
    if (updateUserDto.avatar !== undefined) {
      user.avatar = updateUserDto.avatar;
    }
    if (updateUserDto.bio !== undefined) {
      user.bio = updateUserDto.bio;
    }

    const savedUser = await this.userRepository.save(user);
    return this.transformToProfileResponseDto(savedUser);
  }

  async findOne(userId: number): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    return this.transformToResponseDto(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
    });
  }

  async findById(userId: number): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id: userId },
    });
  }

  private transformToResponseDto(user: User): UserResponseDto {
    return {
      id: user.id,
      username: user.username,
      nickname: user.nickname,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt,
    };
  }

  private transformToProfileResponseDto(user: User): UserProfileResponseDto {
    return {
      id: user.id,
      username: user.username,
      nickname: user.nickname,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt,
      name: user.nickname, // 返回nickname作为name
      phone: user.phone,
      bio: user.bio,
      lastLoginAt: user.lastLoginAt,
      updatedAt: user.updatedAt,
    };
  }
}
