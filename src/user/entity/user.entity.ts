import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity('blog_user_accounts')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, comment: '用户名' })
  username: string;

  @Column({ length: 50, comment: '昵称', nullable: true })
  nickname: string;

  @Column({ length: 100, unique: true, comment: '邮箱' })
  email: string;

  @Column({ length: 20, unique: true, nullable: true, comment: '手机号' })
  phone: string;

  @Column({ length: 100, comment: '密码' })
  password: string;

  @Column({ length: 255, nullable: true, comment: '头像URL' })
  avatar: string;

  @Column({
    type: 'enum',
    enum: ['admin', 'user'],
    default: 'user',
    comment: '用户角色',
  })
  role: 'admin' | 'user';

  @Column({
    type: 'enum',
    enum: ['active', 'inactive', 'banned'],
    default: 'active',
    comment: '用户状态',
  })
  status: 'active' | 'inactive' | 'banned';

  @Column({ type: 'text', nullable: true, comment: '个人简介' })
  bio: string;

  @CreateDateColumn({ type: 'timestamp', comment: '创建时间' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', comment: '更新时间' })
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true, comment: '最后登录时间' })
  lastLoginAt: Date;

  // 一对多关系：一个用户可以有多篇文章
  @OneToMany('Article', 'author')
  articles: any[];
}
