<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# 博客系统后端 API

基于 NestJS 框架构建的企业级博客系统后端，提供完整的用户管理、文章管理和评论系统功能。

## ✨ 功能特性

### 🔐 用户认证系统
- JWT 身份认证
- 用户注册/登录
- 密码加密存储
- 用户信息管理

### 📝 文章管理系统
- 文章 CRUD 操作
- Markdown 格式支持
- 文章分类和标签
- 文章状态管理（草稿/发布/删除）
- 阅读量统计

### 💬 评论系统（新增）
- ✅ 多层级评论回复
- ✅ 评论点赞功能
- ✅ 评论内容管理
- ✅ 用户权限控制
- ✅ 评论状态管理
- ✅ IP 地址记录
- ✅ 时间限制编辑

### 🛠️ 技术特性
- RESTful API 设计
- TypeScript 类型安全
- MySQL 数据库
- TypeORM 数据访问
- Swagger API 文档
- 参数验证和错误处理
- 分页查询支持

## 📋 项目结构

```
src/
├── auth/           # 认证模块
├── user/           # 用户管理模块
├── article/        # 文章管理模块
├── comment/        # 评论系统模块 ⭐ 新增
├── common/         # 通用组件
├── core/           # 核心功能
└── health/         # 健康检查
```

## 🚀 快速开始

### 环境要求
- Node.js >= 16.0.0
- MySQL >= 8.0
- Redis >= 6.0（可选）

### 安装依赖
```bash
$ yarn install
```

### 环境配置
复制 `.env.example` 为 `.env` 并配置数据库连接：
```env
# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_DATABASE=blog_system

# JWT 配置
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=24h

# 服务器配置
PORT=3000
```

### 数据库初始化
```bash
# 创建数据库和表结构
mysql -u root -p < doc/database-schema.sql
```

### 运行应用

```bash
# 开发模式
$ yarn run start:dev

# 生产模式
$ yarn run start:prod

# 调试模式
$ yarn run start:debug
```

应用启动后访问：
- API 服务：http://localhost:3000
- Swagger 文档：http://localhost:3000/api

## 📖 API 文档

### 在线文档
启动服务后访问 [http://localhost:3000/api](http://localhost:3000/api) 查看完整的 Swagger API 文档。

### 文档文件
- [前端对接API文档](./doc/frontend-api.md) - 详细的前端对接指南
- [API测试文件](./doc/api-test.http) - HTTP 测试用例
- [数据库结构](./doc/database-schema.sql) - 完整的数据库结构

### 主要接口一览

#### 用户认证
```http
POST /auth/register    # 用户注册
POST /auth/login       # 用户登录
GET  /auth/profile     # 获取用户信息
```

#### 文章管理
```http
GET    /articles       # 获取文章列表
POST   /articles       # 创建文章
GET    /articles/:id   # 获取文章详情
PUT    /articles/:id   # 更新文章
DELETE /articles/:id   # 删除文章
```

#### 评论系统 ⭐
```http
GET    /comments/article/:id     # 获取文章评论
POST   /comments                 # 创建评论/回复
PUT    /comments/:id             # 更新评论
DELETE /comments/:id             # 删除评论
POST   /comments/:id/like        # 点赞评论
DELETE /comments/:id/like        # 取消点赞
GET    /comments/:id/replies     # 获取评论回复
GET    /comments/user/:id        # 获取用户评论
```

## 🧪 测试

```bash
# 单元测试
$ yarn run test

# e2e 测试
$ yarn run test:e2e

# 测试覆盖率
$ yarn run test:cov
```

### API 测试
使用 VS Code 的 REST Client 插件，打开 `doc/api-test.http` 文件进行接口测试。

## 📊 数据库设计

### 主要表结构

#### 用户表 (blog_user_accounts)
- 用户基本信息
- 角色权限管理
- 账户状态控制

#### 文章表 (blog_articles)
- 文章内容存储
- 状态管理
- 统计信息

#### 评论表 (blog_comments) ⭐
- 支持多层级回复
- 评论状态管理
- 点赞和统计
- IP 和用户代理记录

### 关系设计
- 用户 ← 一对多 → 文章
- 用户 ← 一对多 → 评论
- 文章 ← 一对多 → 评论
- 评论 ← 一对多 → 子评论（自关联）

## 🔧 开发指南

### 代码规范
```bash
# 代码格式化
$ yarn format

# 代码检查
$ yarn lint

# 自动修复
$ yarn lint --fix
```

### 目录说明
- `src/comment/entity/` - 评论实体定义
- `src/comment/dto/` - 数据传输对象
- `src/comment/comment.service.ts` - 评论业务逻辑
- `src/comment/comment.controller.ts` - 评论接口控制器

### 新增功能
1. 评论创建和回复
2. 评论编辑（5分钟时间限制）
3. 评论删除（软删除）
4. 评论点赞/取消点赞
5. 评论列表分页查询
6. 用户评论历史
7. 权限控制和安全验证

## 🌟 特色功能

### 评论系统亮点
1. **多层级回复**：支持无限层级的评论回复
2. **时间限制编辑**：发布后5分钟内可编辑
3. **权限控制**：只有作者可以编辑/删除自己的评论
4. **软删除**：删除评论不会影响数据库完整性
5. **实时统计**：自动更新文章评论数和评论点赞数
6. **安全记录**：记录用户IP地址和User Agent
7. **状态管理**：支持发布、待审核、隐藏、删除等状态

### 性能优化
- 数据库索引优化
- 分页查询减少数据传输
- 关联查询减少请求次数
- 软删除保持数据完整性

## 📈 监控和日志

### 健康检查
```http
GET /health
```

### 日志配置
- 开发环境：控制台输出详细日志
- 生产环境：文件存储和错误追踪

## 🤝 贡献指南

1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📝 更新日志

### v1.1.0 (2024-01-01) ⭐ 最新
- ✅ 新增完整评论系统
- ✅ 支持多层级评论回复
- ✅ 评论点赞功能
- ✅ 评论权限控制
- ✅ 详细的前端对接文档
- ✅ API 测试用例

### v1.0.0 (2023-12-01)
- 用户认证系统
- 文章管理功能
- 基础 CRUD 操作

## 📄 许可证

Nest is [MIT licensed](LICENSE).

## 🔗 相关链接

- [NestJS 官方文档](https://docs.nestjs.com/)
- [TypeORM 文档](https://typeorm.io/)
- [Swagger 文档](https://swagger.io/)

## 💡 技术支持

如有问题或建议，请：
1. 查看文档：`doc/frontend-api.md`
2. 提交 Issue
3. 参与讨论

---

**开发团队**: 博客系统开发组  
**最后更新**: 2024-01-01  
**当前版本**: v1.1.0 ⭐
