import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { Article } from './entity/article.entity';
import { User } from '../user/entity/user.entity';
import { CoreModule } from '../core/core.module';

@Module({
  imports: [TypeOrmModule.forFeature([Article, User]), CoreModule], // 仅保留CoreModule导入
  controllers: [ArticleController],
  providers: [ArticleService],
})
export class ArticleModule {}
