# 博客系统前端对接 API 文档

## 目录
- [基本信息](#基本信息)
- [认证方式](#认证方式)
- [通用响应格式](#通用响应格式)
- [用户认证 API](#用户认证-api)
- [文章管理 API](#文章管理-api)
- [评论管理 API](#评论管理-api)
- [错误码说明](#错误码说明)
- [示例代码](#示例代码)

## 基本信息

### 接口基础URL
```
开发环境: http://localhost:3000/api
生产环境: https://api.yourdomain.com/api
```

### 版本信息
- 当前版本: v1.0.0
- 更新时间: 2024-01-01

## 认证方式

### JWT Bearer Token
```http
Authorization: Bearer <your-jwt-token>
```

### 获取Token
通过登录接口获取访问令牌，令牌有效期为24小时。

## 通用响应格式

### 成功响应
```json
{
  "success": true,
  "data": {
    // 响应数据
  },
  "message": "操作成功",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 分页响应
```json
{
  "success": true,
  "data": {
    "items": [
      // 数据列表
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "totalPages": 5,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

### 错误响应
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "请求参数验证失败",
    "details": [
      {
        "field": "email",
        "message": "邮箱格式不正确"
      }
    ]
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 用户认证 API

### 用户注册
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "testuser",
  "password": "password123",
  "nickname": "测试用户"
}
```

**响应**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "username": "testuser",
      "nickname": "测试用户",
      "avatar": null,
      "role": "user",
      "status": "active",
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "注册成功"
}
```

### 用户登录
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**响应**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "username": "testuser",
      "nickname": "测试用户",
      "avatar": null,
      "role": "user",
      "status": "active"
    },
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "登录成功"
}
```

### 获取用户信息
```http
GET /auth/profile
Authorization: Bearer <token>
```

**响应**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "username": "testuser",
    "nickname": "测试用户",
    "avatar": null,
    "role": "user",
    "status": "active",
    "bio": "这是我的个人简介",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "lastLoginAt": "2024-01-01T12:00:00.000Z"
  }
}
```

## 文章管理 API

### 获取文章列表
```http
GET /articles?page=1&limit=20&status=published&sortBy=createdAt&sortOrder=DESC
```

**查询参数**
- `page`: 页码（默认: 1）
- `limit`: 每页数量（默认: 20，最大: 100）
- `status`: 文章状态（draft, published, deleted）
- `sortBy`: 排序字段（createdAt, viewCount, likeCount）
- `sortOrder`: 排序方向（ASC, DESC）
- `authorId`: 作者ID（可选）
- `keyword`: 搜索关键词（可选）

**响应**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": 1,
        "title": "我的第一篇文章",
        "summary": "这是文章摘要",
        "coverImage": "https://example.com/image.jpg",
        "status": "published",
        "viewCount": 100,
        "likeCount": 50,
        "commentCount": 10,
        "createdAt": "2024-01-01T00:00:00.000Z",
        "publishedAt": "2024-01-01T00:00:00.000Z",
        "author": {
          "id": 1,
          "username": "testuser",
          "nickname": "测试用户",
          "avatar": null
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "totalPages": 5,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

### 获取文章详情
```http
GET /articles/1
```

**响应**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "我的第一篇文章",
    "content": "# 文章标题\n\n这是文章内容...",
    "summary": "这是文章摘要",
    "coverImage": "https://example.com/image.jpg",
    "status": "published",
    "viewCount": 100,
    "likeCount": 50,
    "commentCount": 10,
    "categoryIds": [1, 2],
    "tagIds": [1, 2, 3],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "publishedAt": "2024-01-01T00:00:00.000Z",
    "author": {
      "id": 1,
      "username": "testuser",
      "nickname": "测试用户",
      "avatar": null,
      "bio": "作者简介"
    }
  }
}
```

### 创建文章
```http
POST /articles
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "新文章标题",
  "content": "# 文章内容\n\n这是文章正文...",
  "summary": "文章摘要",
  "coverImage": "https://example.com/image.jpg",
  "status": "draft",
  "categoryIds": [1, 2],
  "tagIds": [1, 2, 3]
}
```

**响应**
```json
{
  "success": true,
  "data": {
    "id": 2,
    "title": "新文章标题",
    "content": "# 文章内容\n\n这是文章正文...",
    "summary": "文章摘要",
    "coverImage": "https://example.com/image.jpg",
    "status": "draft",
    "viewCount": 0,
    "likeCount": 0,
    "commentCount": 0,
    "authorId": 1,
    "categoryIds": [1, 2],
    "tagIds": [1, 2, 3],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "publishedAt": null
  },
  "message": "文章创建成功"
}
```

### 更新文章
```http
PUT /articles/1
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "更新后的文章标题",
  "content": "更新后的文章内容",
  "summary": "更新后的摘要",
  "status": "published"
}
```

### 删除文章
```http
DELETE /articles/1
Authorization: Bearer <token>
```

**响应**
```json
{
  "success": true,
  "message": "文章删除成功"
}
```

## 评论管理 API

### 创建评论
```http
POST /comments
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "这是一条很棒的文章评论！",
  "articleId": 1,
  "parentId": null
}
```

**响应**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "content": "这是一条很棒的文章评论！",
    "articleId": 1,
    "authorId": 1,
    "parentId": null,
    "status": "published",
    "likeCount": 0,
    "replyCount": 0,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "author": {
      "id": 1,
      "username": "testuser",
      "nickname": "测试用户",
      "avatar": null
    },
    "article": {
      "id": 1,
      "title": "文章标题"
    }
  },
  "message": "评论创建成功"
}
```

### 回复评论
```http
POST /comments
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "这是对评论的回复",
  "articleId": 1,
  "parentId": 1
}
```

### 获取文章评论列表
```http
GET /comments/article/1?page=1&limit=20&sortBy=createdAt&sortOrder=DESC
```

**查询参数**
- `page`: 页码（默认: 1）
- `limit`: 每页数量（默认: 20，最大: 100）
- `sortBy`: 排序字段（createdAt, likeCount）
- `sortOrder`: 排序方向（ASC, DESC）

**响应**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": 1,
        "content": "这是一条很棒的文章评论！",
        "articleId": 1,
        "authorId": 1,
        "parentId": null,
        "status": "published",
        "likeCount": 5,
        "replyCount": 3,
        "createdAt": "2024-01-01T00:00:00.000Z",
        "author": {
          "id": 1,
          "username": "testuser",
          "nickname": "测试用户",
          "avatar": null
        },
        "replies": [
          {
            "id": 2,
            "content": "这是对评论的回复",
            "parentId": 1,
            "likeCount": 2,
            "createdAt": "2024-01-01T01:00:00.000Z",
            "author": {
              "id": 2,
              "username": "otheruser",
              "nickname": "其他用户",
              "avatar": null
            }
          }
        ]
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 50,
      "totalPages": 3,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

### 获取评论回复列表
```http
GET /comments/1/replies?page=1&limit=10
```

**响应结构与文章评论列表类似，但只返回特定评论的回复**

### 获取用户评论列表
```http
GET /comments/user/1?page=1&limit=20
```

### 获取评论详情
```http
GET /comments/1
```

### 更新评论
```http
PUT /comments/1
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "修改后的评论内容"
}
```

**注意**: 只有评论作者可以修改评论，且只能在发布后5分钟内修改。

### 删除评论
```http
DELETE /comments/1
Authorization: Bearer <token>
```

**响应**
```json
{
  "success": true,
  "message": "评论删除成功"
}
```

### 点赞评论
```http
POST /comments/1/like
Authorization: Bearer <token>
```

**响应**
```json
{
  "success": true,
  "data": {
    "message": "点赞成功",
    "likeCount": 6
  }
}
```

### 取消点赞
```http
DELETE /comments/1/like
Authorization: Bearer <token>
```

**响应**
```json
{
  "success": true,
  "data": {
    "message": "取消点赞成功",
    "likeCount": 5
  }
}
```

## 错误码说明

| 错误码 | HTTP状态码 | 说明 |
|--------|------------|------|
| VALIDATION_ERROR | 400 | 请求参数验证失败 |
| UNAUTHORIZED | 401 | 未授权，需要登录 |
| FORBIDDEN | 403 | 禁止访问，权限不足 |
| NOT_FOUND | 404 | 资源不存在 |
| CONFLICT | 409 | 资源冲突（如邮箱已存在） |
| INTERNAL_ERROR | 500 | 服务器内部错误 |

## 示例代码

### JavaScript/TypeScript (Axios)

```javascript
// 配置 Axios 实例
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 10000,
});

// 请求拦截器 - 添加认证头
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 响应拦截器 - 统一处理响应
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // 清除过期token，跳转到登录页
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data || error);
  }
);

// API 封装示例
export const authAPI = {
  // 用户登录
  login: (credentials) => api.post('/auth/login', credentials),
  
  // 用户注册
  register: (userData) => api.post('/auth/register', userData),
  
  // 获取用户信息
  getProfile: () => api.get('/auth/profile'),
};

export const articleAPI = {
  // 获取文章列表
  getArticles: (params) => api.get('/articles', { params }),
  
  // 获取文章详情
  getArticle: (id) => api.get(`/articles/${id}`),
  
  // 创建文章
  createArticle: (data) => api.post('/articles', data),
  
  // 更新文章
  updateArticle: (id, data) => api.put(`/articles/${id}`, data),
  
  // 删除文章
  deleteArticle: (id) => api.delete(`/articles/${id}`),
};

export const commentAPI = {
  // 创建评论
  createComment: (data) => api.post('/comments', data),
  
  // 获取文章评论
  getArticleComments: (articleId, params) => 
    api.get(`/comments/article/${articleId}`, { params }),
  
  // 获取评论回复
  getCommentReplies: (commentId, params) => 
    api.get(`/comments/${commentId}/replies`, { params }),
  
  // 更新评论
  updateComment: (id, data) => api.put(`/comments/${id}`, data),
  
  // 删除评论
  deleteComment: (id) => api.delete(`/comments/${id}`),
  
  // 点赞评论
  likeComment: (id) => api.post(`/comments/${id}/like`),
  
  // 取消点赞
  unlikeComment: (id) => api.delete(`/comments/${id}/like`),
};
```

### React Hook 示例

```jsx
import { useState, useEffect } from 'react';
import { commentAPI } from './api';

// 评论列表 Hook
export function useComments(articleId) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(null);

  const fetchComments = async (page = 1) => {
    try {
      setLoading(true);
      const response = await commentAPI.getArticleComments(articleId, { page });
      setComments(response.data.items);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('获取评论失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const addComment = async (content, parentId = null) => {
    try {
      const response = await commentAPI.createComment({
        content,
        articleId,
        parentId,
      });
      
      // 重新获取评论列表
      fetchComments();
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const deleteComment = async (commentId) => {
    try {
      await commentAPI.deleteComment(commentId);
      // 重新获取评论列表
      fetchComments();
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    if (articleId) {
      fetchComments();
    }
  }, [articleId]);

  return {
    comments,
    loading,
    pagination,
    fetchComments,
    addComment,
    deleteComment,
  };
}

// 评论组件示例
export function CommentList({ articleId }) {
  const { comments, loading, addComment } = useComments(articleId);
  const [newComment, setNewComment] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await addComment(newComment);
      setNewComment('');
    } catch (error) {
      alert('评论发表失败');
    }
  };

  if (loading) return <div>加载中...</div>;

  return (
    <div className="comment-section">
      {/* 评论输入表单 */}
      <form onSubmit={handleSubmit} className="comment-form">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="写下你的评论..."
          rows="3"
        />
        <button type="submit" disabled={!newComment.trim()}>
          发表评论
        </button>
      </form>

      {/* 评论列表 */}
      <div className="comment-list">
        {comments.map((comment) => (
          <div key={comment.id} className="comment-item">
            <div className="comment-header">
              <img src={comment.author.avatar || '/default-avatar.png'} alt="" />
              <span>{comment.author.nickname}</span>
              <span>{new Date(comment.createdAt).toLocaleString()}</span>
            </div>
            <div className="comment-content">{comment.content}</div>
            <div className="comment-actions">
              <button>👍 {comment.likeCount}</button>
              <button>回复</button>
            </div>
            
            {/* 回复列表 */}
            {comment.replies?.map((reply) => (
              <div key={reply.id} className="reply-item">
                <span>{reply.author.nickname}: </span>
                <span>{reply.content}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Vue 3 组合式 API 示例

```vue
<template>
  <div class="comment-section">
    <!-- 评论表单 -->
    <form @submit.prevent="handleSubmit" class="comment-form">
      <textarea
        v-model="newComment"
        placeholder="写下你的评论..."
        rows="3"
      />
      <button type="submit" :disabled="!newComment.trim()">
        发表评论
      </button>
    </form>

    <!-- 评论列表 -->
    <div v-if="loading" class="loading">加载中...</div>
    <div v-else class="comment-list">
      <div
        v-for="comment in comments"
        :key="comment.id"
        class="comment-item"
      >
        <div class="comment-header">
          <img :src="comment.author.avatar || '/default-avatar.png'" alt="" />
          <span>{{ comment.author.nickname }}</span>
          <span>{{ formatDate(comment.createdAt) }}</span>
        </div>
        <div class="comment-content">{{ comment.content }}</div>
        <div class="comment-actions">
          <button @click="likeComment(comment.id)">
            👍 {{ comment.likeCount }}
          </button>
          <button @click="replyToComment(comment.id)">回复</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { commentAPI } from './api';

const props = defineProps({
  articleId: {
    type: Number,
    required: true,
  },
});

const comments = ref([]);
const loading = ref(true);
const newComment = ref('');

const fetchComments = async () => {
  try {
    loading.value = true;
    const response = await commentAPI.getArticleComments(props.articleId);
    comments.value = response.data.items;
  } catch (error) {
    console.error('获取评论失败:', error);
  } finally {
    loading.value = false;
  }
};

const handleSubmit = async () => {
  if (!newComment.value.trim()) return;

  try {
    await commentAPI.createComment({
      content: newComment.value,
      articleId: props.articleId,
    });
    
    newComment.value = '';
    fetchComments();
  } catch (error) {
    alert('评论发表失败');
  }
};

const likeComment = async (commentId) => {
  try {
    await commentAPI.likeComment(commentId);
    fetchComments();
  } catch (error) {
    console.error('点赞失败:', error);
  }
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString();
};

onMounted(() => {
  fetchComments();
});
</script>
```

## 测试建议

### 单元测试
1. 使用 Jest 或 Vitest 进行 API 函数测试
2. Mock API 响应进行组件测试
3. 测试错误处理和边界情况

### 集成测试
1. 使用真实 API 进行端到端测试
2. 测试完整的用户操作流程
3. 验证数据一致性和状态同步

### 性能优化建议
1. 使用适当的缓存策略
2. 实现无限滚动或虚拟滚动
3. 防抖处理搜索和输入
4. 图片懒加载和预加载

## 更新日志

### v1.0.0 (2024-01-01)
- 初始版本发布
- 包含用户认证、文章管理、评论系统完整API
- 支持分页、排序、筛选功能
- 完整的错误处理和响应格式 