import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../user/entity/user.entity';

export enum ArticleStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  DELETED = 'deleted',
}

@Entity('blog_articles')
export class Article {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, comment: '文章标题' })
  title: string;

  @Column({ type: 'text', comment: '文章内容（Markdown格式）' })
  content: string;

  @Column({ type: 'varchar', length: 500, nullable: true, comment: '文章摘要' })
  summary: string | null;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: '封面图片URL',
  })
  coverImage: string | null;

  @Column({ type: 'int', comment: '作者ID' })
  authorId: number;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'authorId' })
  author: User;

  @Column({
    type: 'enum',
    enum: ArticleStatus,
    default: ArticleStatus.DRAFT,
    comment: '状态：draft, published, deleted',
  })
  status: ArticleStatus;

  @Column({ type: 'int', default: 0, comment: '阅读次数' })
  viewCount: number;

  @Column({ type: 'int', default: 0, comment: '点赞次数' })
  likeCount: number;

  @Column({ type: 'int', default: 0, comment: '评论数量' })
  commentCount: number;

  @CreateDateColumn({ type: 'timestamp', comment: '创建时间' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', comment: '更新时间' })
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true, comment: '发布时间' })
  publishedAt: Date | null;

  @Column({ type: 'boolean', default: false, comment: '是否删除（软删除）' })
  isDeleted: boolean;

  @Column({ type: 'json', nullable: true, comment: '分类ID数组' })
  categoryIds: number[] | null;

  @Column({ type: 'json', nullable: true, comment: '标签ID数组' })
  tagIds: number[] | null;
}
