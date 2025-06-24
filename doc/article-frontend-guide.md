# 文章模块前端接入文档

本文档描述了博客系统文章模块的前端接入方式，包括接口定义、参数说明和示例代码。

## 接口基本信息

- 基础路径: `/api/articles`
- 认证方式: JWT Bearer Token 认证
- 内容类型: `application/json`

## 接口列表

### 1. 创建文章

**请求方式**: POST  
**URL**: `/api/articles`  
**认证要求**: 需要登录  
**功能描述**: 创建一篇新的博客文章，可以是草稿或直接发布  

**请求参数**:

```json
{
  "title": "NestJS最佳实践",
  "content": "本文详细讲解NestJS的核心功能...",
  "summary": "本文总结了NestJS框架的十大核心特性",
  "coverImage": "https://example.com/cover.jpg",
  "categoryIds": [1, 3],
  "tagIds": [5, 7],
  "status": "published" // 或 "draft"
}
```

**参数说明**:

| 参数名 | 类型 | 必填 | 说明 |
|-------|------|------|------|
| title | string | 是 | 文章标题，1-100字符 |
| content | string | 是 | 文章内容，Markdown格式 |
| summary | string | 否 | 文章摘要，最多500字符 |
| coverImage | string | 否 | 封面图片URL |
| categoryIds | number[] | 是 | 分类ID数组，最多5个 |
| tagIds | number[] | 否 | 标签ID数组，最多20个 |
| status | string | 是 | 文章状态：`draft`(草稿) 或 `published`(已发布) |

**响应示例**:

```json
{
  "id": 1,
  "title": "NestJS最佳实践",
  "summary": "本文总结了NestJS框架的十大核心特性",
  "coverImage": "https://example.com/cover.jpg",
  "status": "published",
  "viewCount": 0,
  "likeCount": 0,
  "commentCount": 0,
  "createdAt": "2023-06-01T12:00:00.000Z",
  "updatedAt": "2023-06-01T12:00:00.000Z",
  "publishedAt": "2023-06-01T12:00:00.000Z",
  "author": {
    "id": 1,
    "username": "admin",
    "nickname": "管理员",
    "avatar": "https://example.com/avatar.jpg"
  },
  "categoryIds": [1, 3],
  "tagIds": [5, 7]
}
```

### 2. 获取文章列表

**请求方式**: GET  
**URL**: `/api/articles`  
**认证要求**: 无需登录  
**功能描述**: 获取博客文章列表，支持分页、搜索和筛选  

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|-------|------|------|------|
| page | number | 否 | 页码，默认1 |
| limit | number | 否 | 每页数量，默认10，最大100 |
| search | string | 否 | 搜索关键词，模糊匹配标题和内容 |
| status | string | 否 | 文章状态筛选：`published`(已发布) |
| categoryId | number | 否 | 分类ID筛选 |
| tagId | number | 否 | 标签ID筛选 |
| authorId | number | 否 | 作者ID筛选 |

**响应示例**:

```json
{
  "list": [
    {
      "id": 1,
      "title": "NestJS最佳实践",
      "summary": "本文总结了NestJS框架的十大核心特性",
      "coverImage": "https://example.com/cover.jpg",
      "status": "published",
      "viewCount": 10,
      "likeCount": 5,
      "commentCount": 3,
      "createdAt": "2023-06-01T12:00:00.000Z",
      "updatedAt": "2023-06-01T12:00:00.000Z",
      "publishedAt": "2023-06-01T12:00:00.000Z",
      "author": {
        "id": 1,
        "username": "admin",
        "nickname": "管理员",
        "avatar": "https://example.com/avatar.jpg"
      },
      "categoryIds": [1, 3],
      "tagIds": [5, 7]
    }
    // 更多文章...
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

### 3. 获取文章详情

**请求方式**: GET  
**URL**: `/api/articles/:id`  
**认证要求**: 无需登录  
**功能描述**: 获取指定ID的文章详细信息，包含完整内容、分类、标签等  

**URL参数**:

| 参数名 | 类型 | 必填 | 说明 |
|-------|------|------|------|
| id | number | 是 | 文章ID |

**响应示例**:

```json
{
  "id": 1,
  "title": "NestJS最佳实践",
  "content": "本文详细讲解NestJS的核心功能...",
  "summary": "本文总结了NestJS框架的十大核心特性",
  "coverImage": "https://example.com/cover.jpg",
  "status": "published",
  "viewCount": 11,
  "likeCount": 5,
  "commentCount": 3,
  "createdAt": "2023-06-01T12:00:00.000Z",
  "updatedAt": "2023-06-01T12:00:00.000Z",
  "publishedAt": "2023-06-01T12:00:00.000Z",
  "author": {
    "id": 1,
    "username": "admin",
    "nickname": "管理员",
    "avatar": "https://example.com/avatar.jpg"
  },
  "categoryIds": [1, 3],
  "tagIds": [5, 7],
  "isLiked": false,
  "isSaved": false
}
```

### 4. 更新文章

**请求方式**: PATCH  
**URL**: `/api/articles/:id`  
**认证要求**: 需要登录，且只能更新自己的文章  
**功能描述**: 更新指定ID的文章信息  

**URL参数**:

| 参数名 | 类型 | 必填 | 说明 |
|-------|------|------|------|
| id | number | 是 | 文章ID |

**请求参数**:

```json
{
  "title": "NestJS最佳实践（更新版）",
  "content": "更新后的内容...",
  "summary": "更新后的摘要",
  "coverImage": "https://example.com/new-cover.jpg",
  "categoryIds": [1, 4],
  "tagIds": [5, 8],
  "status": "published"
}
```

**参数说明**:

| 参数名 | 类型 | 必填 | 说明 |
|-------|------|------|------|
| title | string | 否 | 文章标题，1-100字符 |
| content | string | 否 | 文章内容，Markdown格式 |
| summary | string | 否 | 文章摘要，最多500字符 |
| coverImage | string | 否 | 封面图片URL |
| categoryIds | number[] | 否 | 分类ID数组，最多5个 |
| tagIds | number[] | 否 | 标签ID数组，最多20个 |
| status | string | 否 | 文章状态：`draft`(草稿) 或 `published`(已发布) |

**响应示例**: 与创建文章响应格式相同

### 5. 删除文章

**请求方式**: DELETE  
**URL**: `/api/articles/:id`  
**认证要求**: 需要登录，且只能删除自己的文章  
**功能描述**: 删除指定ID的文章  

**URL参数**:

| 参数名 | 类型 | 必填 | 说明 |
|-------|------|------|------|
| id | number | 是 | 文章ID |

**响应**: 成功返回状态码204，无响应体

### 6. 发布文章

**请求方式**: PATCH  
**URL**: `/api/articles/:id/publish`  
**认证要求**: 需要登录，且只能发布自己的文章  
**功能描述**: 将草稿状态的文章发布  

**URL参数**:

| 参数名 | 类型 | 必填 | 说明 |
|-------|------|------|------|
| id | number | 是 | 文章ID |

**响应示例**: 与创建文章响应格式相同，但状态会变为`published`，并设置`publishedAt`时间

### 7. 文章点赞/取消点赞

**请求方式**: POST  
**URL**: `/api/articles/:id/like`  
**认证要求**: 需要登录  
**功能描述**: 对文章进行点赞或取消点赞（再次调用会取消点赞）  

**URL参数**:

| 参数名 | 类型 | 必填 | 说明 |
|-------|------|------|------|
| id | number | 是 | 文章ID |

**响应示例**:

```json
{
  "liked": true,
  "likeCount": 6
}
```

### 8. 收藏/取消收藏文章

**请求方式**: POST  
**URL**: `/api/articles/:id/save`  
**认证要求**: 需要登录  
**功能描述**: 收藏或取消收藏文章（再次调用会取消收藏）  

**URL参数**:

| 参数名 | 类型 | 必填 | 说明 |
|-------|------|------|------|
| id | number | 是 | 文章ID |

**响应示例**:

```json
{
  "saved": true
}
```

### 9. 获取用户的文章列表

**请求方式**: GET  
**URL**: `/api/articles/user/:userId`  
**认证要求**: 无需登录  
**功能描述**: 获取指定用户发布的文章列表  

**URL参数**:

| 参数名 | 类型 | 必填 | 说明 |
|-------|------|------|------|
| userId | number | 是 | 用户ID |

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|-------|------|------|------|
| page | number | 否 | 页码，默认1 |
| limit | number | 否 | 每页数量，默认10，最大100 |

**响应示例**: 与获取文章列表响应格式相同

### 10. 获取我的文章列表

**请求方式**: GET  
**URL**: `/api/articles/my/articles`  
**认证要求**: 需要登录  
**功能描述**: 获取当前登录用户的所有文章列表，用于后台管理  

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|-------|------|------|------|
| page | number | 否 | 页码，默认1 |
| limit | number | 否 | 每页数量，默认10，最大100 |
| status | string | 否 | 文章状态筛选：`draft`(草稿) 或 `published`(已发布) |
| search | string | 否 | 搜索关键词，模糊匹配标题 |

**响应示例**:

```json
{
  "list": [
    {
      "id": 1,
      "title": "NestJS最佳实践",
      "summary": "本文总结了NestJS框架的十大核心特性",
      "coverImage": "https://example.com/cover.jpg",
      "status": "published",
      "viewCount": 120,
      "likeCount": 35,
      "commentCount": 18,
      "createdAt": "2023-06-01T12:00:00.000Z",
      "updatedAt": "2023-06-01T12:00:00.000Z",
      "publishedAt": "2023-06-01T12:00:00.000Z",
      "author": {
        "id": 1,
        "username": "admin",
        "nickname": "管理员",
        "avatar": "https://example.com/avatar.jpg"
      },
      "categoryIds": [1, 3],
      "tagIds": [5, 7]
    },
    // 更多文章...
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

### 11. 获取我的草稿箱

**请求方式**: GET  
**URL**: `/api/articles/drafts`  
**认证要求**: 需要登录  
**功能描述**: 获取当前登录用户的草稿文章列表  

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|-------|------|------|------|
| page | number | 否 | 页码，默认1 |
| limit | number | 否 | 每页数量，默认10，最大100 |

**响应示例**: 与获取文章列表响应格式相同，但只包含草稿状态的文章

## 前端调用示例

### 使用 Axios 调用创建文章接口

```javascript
import axios from 'axios';

const API_BASE_URL = 'http://your-api-domain/api';
const token = localStorage.getItem('token'); // 从本地存储获取JWT令牌

// 创建文章
async function createArticle(articleData) {
  try {
    const response = await axios.post(`${API_BASE_URL}/articles`, articleData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('创建文章失败:', error);
    throw error;
  }
}

// 发布草稿文章
async function publishArticle(articleId) {
  try {
    const response = await axios.patch(`${API_BASE_URL}/articles/${articleId}/publish`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('发布文章失败:', error);
    throw error;
  }
}

// 使用示例
const newArticle = {
  title: "NestJS最佳实践",
  content: "本文详细讲解NestJS的核心功能...",
  summary: "本文总结了NestJS框架的十大核心特性",
  coverImage: "https://example.com/cover.jpg",
  categoryIds: [1, 3],
  tagIds: [5, 7],
  status: "draft" // 先创建为草稿
};

// 创建文章并发布
async function createAndPublishArticle() {
  try {
    // 1. 创建草稿
    const article = await createArticle(newArticle);
    console.log('草稿创建成功:', article);
    
    // 2. 发布文章
    const publishedArticle = await publishArticle(article.id);
    console.log('文章发布成功:', publishedArticle);
  } catch (error) {
    console.error('操作失败:', error);
  }
}

createAndPublishArticle();
```

### 使用 Fetch API 获取文章列表

```javascript
const API_BASE_URL = 'http://your-api-domain/api';

// 获取文章列表
async function getArticles(page = 1, limit = 10) {
  try {
    const response = await fetch(`${API_BASE_URL}/articles?page=${page}&limit=${limit}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('获取文章列表失败:', error);
    throw error;
  }
}

// 使用示例
getArticles()
  .then(data => {
    console.log('文章列表:', data.list);
    console.log('分页信息:', data.meta);
  })
  .catch(error => {
    console.error('获取文章失败:', error);
  });
```

## 错误处理

API可能返回以下错误状态码：

| 状态码 | 说明 |
|-------|------|
| 400 | 请求参数错误 |
| 401 | 未认证或认证失败 |
| 403 | 权限不足 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

错误响应格式：

```json
{
  "statusCode": 400,
  "message": "请求参数错误",
  "error": "Bad Request"
}
``` 