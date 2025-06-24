import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../user/entity/user.entity';
import { Article } from '../../article/entity/article.entity';

export enum CommentStatus {
  PUBLISHED = 'published',
  PENDING = 'pending',
  HIDDEN = 'hidden',
  DELETED = 'deleted',
}

@Entity('blog_comments')
@Index(['articleId', 'status'])
@Index(['authorId'])
@Index(['parentId'])
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', comment: '评论内容' })
  content: string;

  @Column({ type: 'int', comment: '文章ID' })
  articleId: number;

  @Column({ type: 'int', comment: '评论作者ID' })
  authorId: number;

  @Column({ type: 'int', nullable: true, comment: '父评论ID' })
  parentId?: number;

  @Column({
    type: 'enum',
    enum: CommentStatus,
    default: CommentStatus.PUBLISHED,
    comment: '评论状态',
  })
  status: CommentStatus;

  @Column({ type: 'int', default: 0, comment: '点赞次数' })
  likeCount: number;

  @Column({ type: 'int', default: 0, comment: '回复次数' })
  replyCount: number;

  @Column({ type: 'varchar', length: 45, nullable: true, comment: 'IP地址' })
  ipAddress?: string;

  @Column({ type: 'varchar', length: 500, nullable: true, comment: '用户代理' })
  userAgent?: string;

  @CreateDateColumn({ type: 'timestamp', comment: '创建时间' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', comment: '更新时间' })
  updatedAt: Date;

  // 关联关系
  @ManyToOne(() => Article, { nullable: false })
  @JoinColumn({ name: 'articleId' })
  article: Article;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'authorId' })
  author: User;

  @ManyToOne(() => Comment, { nullable: true })
  @JoinColumn({ name: 'parentId' })
  parent?: Comment;

  @OneToMany(() => Comment, (comment) => comment.parent)
  replies: Comment[];

  // 业务方法
  isPublished(): boolean {
    return this.status === CommentStatus.PUBLISHED;
  }

  canBeReplied(): boolean {
    return this.status === CommentStatus.PUBLISHED;
  }

  hide(): void {
    this.status = CommentStatus.HIDDEN;
  }

  publish(): void {
    this.status = CommentStatus.PUBLISHED;
  }

  delete(): void {
    this.status = CommentStatus.DELETED;
  }
}