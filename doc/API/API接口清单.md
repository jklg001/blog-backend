# API接口清单

## 基础信息

- **基础URL**: http://localhost:3002
- **API版本**: v1 (暂未显式定义)
- **响应格式**: JSON

## 用户模块接口

### 用户注册

- **URL**: `/users/register`
- **方法**: POST
- **描述**: 创建新用户账号
- **请求体**:
  ```json
  {
    "name": "张三", // 学生姓名，长度2-20
    "email": "zhangsan@example.com", // 学校邮箱，必须是有效的邮箱格式
    "password": "password123", // 校园系统密码，长度6-20
    "username": "zhangsan" // 用户名
  }
  ```
- **响应**: 成功创建的用户对象
  ```json
  {
    "id": 1,
    "username": "zhangsan",
    "email": "zhangsan@example.com",
    "role": "user",
    "status": "active",
    "createdAt": "2023-05-13T10:30:00Z",
    "updatedAt": "2023-05-13T10:30:00Z"
  }
  ```
- **状态码**:
  - `201`: 用户创建成功
  - `400`: 请求数据无效
  - `409`: 用户名或邮箱已存在

## 待实现的API接口

以下是系统未来可能需要实现的API接口：

### 用户认证

- **登录**: POST `/auth/login`
- **登出**: POST `/auth/logout`
- **刷新令牌**: POST `/auth/refresh-token`
- **修改密码**: PATCH `/users/password`

### 用户管理

- **获取用户信息**: GET `/users/profile`
- **更新用户信息**: PATCH `/users/profile`
- **获取用户列表** (管理员): GET `/users`
- **获取单个用户** (管理员): GET `/users/{id}`
- **删除用户** (管理员): DELETE `/users/{id}`

### 博客文章

- **创建文章**: POST `/articles`
- **获取文章列表**: GET `/articles`
- **获取单篇文章**: GET `/articles/{id}`
- **更新文章**: PUT `/articles/{id}`
- **删除文章**: DELETE `/articles/{id}`

### 评论

- **添加评论**: POST `/articles/{id}/comments`
- **获取评论列表**: GET `/articles/{id}/comments`
- **删除评论**: DELETE `/comments/{id}`

### 分类与标签

- **创建分类**: POST `/categories`
- **获取分类列表**: GET `/categories`
- **创建标签**: POST `/tags`
- **获取标签列表**: GET `/tags` 