import { ArticleStatus } from '../entity/article.entity';

export class ArticleResponseDto {
  id: number;
  title: string;
  status: ArticleStatus;
  createdAt: string;
}

export class ArticleDetailResponseDto {
  id: number;
  title: string;
  content: string;
  summary: string;
  coverImage: string;
  author: {
    id: number;
    username: string;
    avatar: string;
    bio: string;
  };
  categories: Array<{
    id: number;
    name: string;
  }>;
  tags: Array<{
    id: number;
    name: string;
  }>;
  viewCount: number;
  commentCount: number;
  likeCount: number;
  liked: boolean;
  saved: boolean;
  status: ArticleStatus;
  createdAt: string;
  publishedAt: string;
  updatedAt: string;
}

export class ArticleListResponseDto {
  list: ArticleResponseDto[];
}
