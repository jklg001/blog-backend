import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { IsEmail, Length } from "class-validator";

@Entity({
    name: 'user_entity',
    engine: 'InnoDB'
})
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @Length(2, 20, { message: '姓名需2-20个字符' })
    name: string;

    @Column({ unique: true })
    @IsEmail({}, { message: '邮箱格式不正确' })
    email: string;

    @Column()
    password: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date; // 注册时间
}
