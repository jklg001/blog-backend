import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserEntity } from './entity/user.entity'
import { RegisterDto } from './dto/register.dto'
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(@InjectRepository(UserEntity) private userRepository: Repository<UserEntity>) {}

    async register(registerDto: RegisterDto): Promise<UserEntity> {
        const existingUser = await this.userRepository.findOne({
            where: { email: registerDto.email.toLowerCase() },
        })

        if (existingUser) {
            throw new ConflictException("User already exists");
        }

        const hashedPassword = await bcrypt.hash(registerDto.password, 10);

        const newUser = this.userRepository.create({
            name: registerDto.name,
            email: registerDto.email.toLowerCase(),
            password: hashedPassword,
        })

        return this.userRepository.save(newUser)
    }
}
