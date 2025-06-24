import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Article, ArticleStatus } from '../src/article/entity/article.entity';
import { User } from '../src/user/entity/user.entity';
import { AuthService } from '../src/auth/auth.service';

describe('ArticleController (e2e)', () => {
  let app: INestApplication;
  let authService: AuthService;
  let userToken: string;
  let testUserId: number;
  let testArticleId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // 获取认证服务
    authService = moduleFixture.get<AuthService>(AuthService);

    // 创建测试用户
    const userRepository = moduleFixture.get(getRepositoryToken(User));
    const testUser = await userRepository.save({
      username: 'testuser',
      email: 'test@example.com',
      password: await authService.hashPassword('password123'),
      role: 'user',
      status: 'active',
    });
    testUserId = testUser.id;

    // 获取用户令牌
    const loginResult = await authService.validateUser('test@example.com', 'password123');
    userToken = await authService.generateToken(loginResult);

    // 创建测试文章
    const articleRepository = moduleFixture.get(getRepositoryToken(Article));
    const testArticle = await articleRepository.save({
      title: '测试文章',
      content: '这是一篇测试文章',
      authorId: testUserId,
      status: ArticleStatus.PUBLISHED,
      categoryIds: [1],
      tagIds: [1, 2],
    });
    testArticleId = testArticle.id;

    // 创建测试草稿
    await articleRepository.save({
      title: '测试草稿',
      content: '这是一篇测试草稿',
      authorId: testUserId,
      status: ArticleStatus.DRAFT,
      categoryIds: [1],
      tagIds: [1],
    });
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /api/articles/my/articles', () => {
    it('应该返回当前用户的所有文章列表', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/articles/my/articles')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('list');
      expect(response.body).toHaveProperty('meta');
      expect(response.body.list).toBeInstanceOf(Array);
      expect(response.body.list.length).toBeGreaterThanOrEqual(2);
      expect(response.body.list[0]).toHaveProperty('id');
      expect(response.body.list[0]).toHaveProperty('title');
      expect(response.body.list[0]).toHaveProperty('status');
    });

    it('应该返回当前用户的已发布文章列表', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/articles/my/articles?status=published')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.list).toBeInstanceOf(Array);
      expect(response.body.list.length).toBeGreaterThanOrEqual(1);
      expect(response.body.list.every(article => article.status === 'published')).toBeTruthy();
    });

    it('应该返回当前用户的草稿文章列表', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/articles/my/articles?status=draft')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.list).toBeInstanceOf(Array);
      expect(response.body.list.length).toBeGreaterThanOrEqual(1);
      expect(response.body.list.every(article => article.status === 'draft')).toBeTruthy();
    });

    it('应该根据标题搜索文章', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/articles/my/articles?search=测试文章')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.list).toBeInstanceOf(Array);
      expect(response.body.list.length).toBeGreaterThanOrEqual(1);
      expect(response.body.list[0].title).toContain('测试文章');
    });

    it('未认证用户应该返回401错误', async () => {
      await request(app.getHttpServer())
        .get('/api/articles/my/articles')
        .expect(401);
    });
  });
}); 