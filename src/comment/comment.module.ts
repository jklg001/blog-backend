import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { Comment } from './entity/comment.entity';
import { Article } from '../article/entity/article.entity';
import { User } from '../user/entity/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, Article, User])],
  controllers: [CommentController],
  providers: [CommentService],
  exports: [CommentService],
})
export class CommentModule {} 