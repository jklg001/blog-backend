# 📚 第5章前置知识：RESTful概念与HTTP协议

> **学习目标**：深入理解RESTful架构风格和HTTP协议，为API设计奠定坚实基础

## 🎯 学习目标

通过本章学习，你将能够：

- 🏗️ **理解RESTful架构风格**：掌握REST的核心原则和设计理念
- 🌐 **深入HTTP协议**：理解HTTP协议的工作机制和最佳实践
- 📝 **API设计基础**：具备设计优雅API接口的基础知识
- 🔧 **实践应用**：能够分析和评估API设计的优劣

## 📖 知识体系概览

```mermaid
mindmap
  root((RESTful & HTTP))
    REST架构风格
      核心原则
        无状态性
        统一接口
        分层系统
        缓存机制
      资源概念
        资源标识
        资源表示
        资源操作
      成熟度模型
        Level 0
        Level 1
        Level 2
        Level 3
    HTTP协议深入
      请求响应模型
        请求结构
        响应结构
        状态码
      HTTP方法
        GET
        POST
        PUT
        DELETE
        PATCH
      HTTP头部
        请求头
        响应头
        自定义头
      内容协商
        Accept
        Content-Type
        编码方式
    API设计原则
      URL设计
        资源命名
        层级结构
        查询参数
      错误处理
        状态码使用
        错误信息格式
        异常处理
      版本控制
        URL版本
        Header版本
        参数版本
      安全考虑
        认证授权
        HTTPS
        CORS
```

## 🏗️ REST架构风格深度解析

### 🎨 什么是REST？

**REST**（Representational State Transfer，表现层状态转移）是一种软件架构风格，由Roy Fielding在2000年的博士论文中提出。

#### 🏠 生活类比：图书馆管理系统

想象一个现代化的图书馆：

```
📚 图书馆（Web服务）
├── 📖 图书（资源）
├── 📋 借阅卡（客户端状态）
├── 👩‍💼 图书管理员（服务器）
└── 📝 借阅规则（HTTP协议）
```

- **图书**就是**资源**（Resource）
- **借阅卡号**就是**资源标识符**（URI）
- **借书、还书、续借**就是**HTTP方法**
- **图书信息卡片**就是**资源表示**（Representation）

### 🎯 REST的六大核心原则

#### 1. 🔄 无状态性（Stateless）

**原则**：服务器不保存客户端的状态信息，每个请求都包含处理该请求所需的全部信息。

```typescript
// ❌ 有状态的设计（违反REST原则）
class UserService {
  private currentUser: User; // 服务器保存状态
  
  login(credentials: LoginDto) {
    this.currentUser = this.validateUser(credentials);
    return { success: true };
  }
  
  getProfile() {
    return this.currentUser; // 依赖服务器状态
  }
}

// ✅ 无状态的设计（符合REST原则）
class UserService {
  login(credentials: LoginDto) {
    const user = this.validateUser(credentials);
    const token = this.generateToken(user);
    return { token, user }; // 返回令牌，客户端保存状态
  }
  
  getProfile(token: string) {
    const user = this.validateToken(token); // 从令牌中获取用户信息
    return user;
  }
}
```

**优势**：
- 🔧 **简化服务器设计**：无需管理会话状态
- 📈 **提高可扩展性**：易于水平扩展
- 🛡️ **增强可靠性**：服务器故障不影响客户端状态

#### 2. 🎯 统一接口（Uniform Interface）

**原则**：使用统一的接口约束，简化和分离架构。

```typescript
// ✅ 统一接口设计
interface ResourceController {
  // 获取资源列表
  findAll(query: QueryDto): Promise<Resource[]>;
  
  // 获取单个资源
  findOne(id: string): Promise<Resource>;
  
  // 创建资源
  create(data: CreateResourceDto): Promise<Resource>;
  
  // 更新资源
  update(id: string, data: UpdateResourceDto): Promise<Resource>;
  
  // 删除资源
  remove(id: string): Promise<void>;
}
```

**四个约束条件**：

1. **资源标识**：每个资源都有唯一的URI
2. **资源表示**：通过表示来操作资源
3. **自描述消息**：消息包含足够的信息来描述如何处理
4. **超媒体驱动**：应用状态通过超媒体链接驱动

#### 3. 🏢 分层系统（Layered System）

**原则**：系统由多个层次组成，每层只能与相邻层交互。

```mermaid
graph TD
    A[客户端] --> B[负载均衡器]
    B --> C[API网关]
    C --> D[应用服务器]
    D --> E[数据库]
    
    style A fill:#e1f5fe
    style B fill:#e8f5e8
    style C fill:#fff3e0
    style D fill:#ffebee
    style E fill:#f3e5f5
```

**层次结构示例**：
```typescript
// 表现层（Presentation Layer）
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}
  
  @Get()
  async findAll() {
    return this.userService.findAll();
  }
}

// 业务逻辑层（Business Logic Layer）
@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}
  
  async findAll() {
    return this.userRepository.findAll();
  }
}

// 数据访问层（Data Access Layer）
@Injectable()
export class UserRepository {
  async findAll() {
    // 数据库操作
  }
}
```

#### 4. 💾 缓存机制（Cache）

**原则**：响应数据可以被标记为可缓存或不可缓存。

```typescript
// HTTP缓存头示例
@Controller('articles')
export class ArticleController {
  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    const article = await this.articleService.findOne(id);
    
    // 设置缓存头
    res.set({
      'Cache-Control': 'public, max-age=3600', // 缓存1小时
      'ETag': `"${article.updatedAt.getTime()}"`, // 实体标签
      'Last-Modified': article.updatedAt.toUTCString()
    });
    
    return res.json(article);
  }
}
```

#### 5. 📱 客户端-服务器分离（Client-Server）

**原则**：客户端和服务器分离，各自独立演化。

```typescript
// 服务器端：只负责数据和业务逻辑
@Controller('api/v1/users')
export class UserController {
  @Get()
  async getUsers(): Promise<UserDto[]> {
    return this.userService.findAll();
  }
}

// 客户端：负责用户界面和用户体验
class UserClient {
  async fetchUsers(): Promise<User[]> {
    const response = await fetch('/api/v1/users');
    return response.json();
  }
  
  renderUserList(users: User[]) {
    // 渲染用户界面
  }
}
```

#### 6. 📝 按需代码（Code on Demand）- 可选

**原则**：服务器可以向客户端发送可执行代码。

```typescript
// 示例：动态表单验证规则
@Get('validation-rules')
async getValidationRules() {
  return {
    userForm: {
      email: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        validator: `function(value) { 
          return value.includes('@') && value.length > 5; 
        }`
      }
    }
  };
}
```

### 📊 Richardson成熟度模型

REST API的成熟度可以分为4个级别：

```mermaid
graph LR
    A[Level 0<br/>HTTP作为传输] --> B[Level 1<br/>引入资源概念]
    B --> C[Level 2<br/>使用HTTP动词]
    C --> D[Level 3<br/>超媒体控制]
    
    style A fill:#ffcdd2
    style B fill:#fff3e0
    style C fill:#e8f5e8
    style D fill:#e1f5fe
```

#### Level 0：HTTP作为传输协议

```typescript
// ❌ Level 0 - 所有操作都通过POST
@Post('user-service')
async handleUserOperation(@Body() request: any) {
  switch (request.action) {
    case 'getUser':
      return this.userService.findOne(request.userId);
    case 'createUser':
      return this.userService.create(request.userData);
    case 'updateUser':
      return this.userService.update(request.userId, request.userData);
  }
}
```

#### Level 1：引入资源概念

```typescript
// ✅ Level 1 - 使用不同的URL表示不同资源
@Controller('users')
export class UserController {
  @Post('getUser')
  async getUser(@Body() request: { id: string }) {
    return this.userService.findOne(request.id);
  }
  
  @Post('createUser')
  async createUser(@Body() userData: CreateUserDto) {
    return this.userService.create(userData);
  }
}
```

#### Level 2：使用HTTP动词

```typescript
// ✅ Level 2 - 正确使用HTTP方法
@Controller('users')
export class UserController {
  @Get(':id')
  async getUser(@Param('id') id: string) {
    return this.userService.findOne(id);
  }
  
  @Post()
  async createUser(@Body() userData: CreateUserDto) {
    return this.userService.create(userData);
  }
  
  @Put(':id')
  async updateUser(@Param('id') id: string, @Body() userData: UpdateUserDto) {
    return this.userService.update(id, userData);
  }
  
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
```

#### Level 3：超媒体控制（HATEOAS）

```typescript
// ✅ Level 3 - 包含超媒体链接
@Get(':id')
async getUser(@Param('id') id: string, @Req() req: Request) {
  const user = await this.userService.findOne(id);
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  
  return {
    ...user,
    _links: {
      self: { href: `${baseUrl}/users/${id}` },
      edit: { href: `${baseUrl}/users/${id}`, method: 'PUT' },
      delete: { href: `${baseUrl}/users/${id}`, method: 'DELETE' },
      articles: { href: `${baseUrl}/users/${id}/articles` }
    }
  };
}
```

## 🌐 HTTP协议深度解析

### 📋 HTTP请求响应模型

#### 🔄 请求-响应循环

```mermaid
sequenceDiagram
    participant C as 客户端
    participant S as 服务器
    
    C->>S: HTTP请求
    Note over C,S: 1. 建立TCP连接
    Note over S: 2. 处理请求
    S->>C: HTTP响应
    Note over C,S: 3. 关闭连接（HTTP/1.1可复用）
```

#### 📝 HTTP请求结构

```http
POST /api/v1/users HTTP/1.1
Host: api.example.com
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Length: 85

{
  "name": "张三",
  "email": "zhangsan@example.com",
  "age": 25
}
```

**请求组成部分**：
1. **请求行**：方法 + URL + HTTP版本
2. **请求头**：元数据信息
3. **空行**：分隔头部和主体
4. **请求主体**：实际数据（可选）

#### 📤 HTTP响应结构

```http
HTTP/1.1 201 Created
Content-Type: application/json
Location: /api/v1/users/123
Cache-Control: no-cache
Content-Length: 156

{
  "id": "123",
  "name": "张三",
  "email": "zhangsan@example.com",
  "age": 25,
  "createdAt": "2024-01-15T10:30:00Z"
}
```

**响应组成部分**：
1. **状态行**：HTTP版本 + 状态码 + 状态描述
2. **响应头**：元数据信息
3. **空行**：分隔头部和主体
4. **响应主体**：实际数据

### 🔧 HTTP方法详解

#### 📖 GET - 获取资源

```typescript
// 获取用户列表
@Get()
async findAll(@Query() query: QueryUserDto) {
  return this.userService.findAll(query);
}

// 获取单个用户
@Get(':id')
async findOne(@Param('id') id: string) {
  return this.userService.findOne(id);
}
```

**特点**：
- ✅ **安全性**：不会修改服务器状态
- ✅ **幂等性**：多次调用结果相同
- ✅ **可缓存**：响应可以被缓存

#### ➕ POST - 创建资源

```typescript
@Post()
async create(@Body() createUserDto: CreateUserDto) {
  return this.userService.create(createUserDto);
}

// 非幂等操作示例
@Post('send-email')
async sendEmail(@Body() emailDto: SendEmailDto) {
  return this.emailService.send(emailDto);
}
```

**特点**：
- ❌ **非安全**：会修改服务器状态
- ❌ **非幂等**：多次调用可能产生不同结果
- ❌ **不可缓存**：响应通常不被缓存

#### 🔄 PUT - 完整更新资源

```typescript
@Put(':id')
async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  // PUT要求提供完整的资源表示
  const completeUser = {
    name: updateUserDto.name,
    email: updateUserDto.email,
    age: updateUserDto.age,
    // 所有字段都必须提供
  };
  
  return this.userService.update(id, completeUser);
}
```

**特点**：
- ❌ **非安全**：会修改服务器状态
- ✅ **幂等性**：多次调用结果相同
- ❌ **不可缓存**：响应通常不被缓存

#### 🔧 PATCH - 部分更新资源

```typescript
@Patch(':id')
async partialUpdate(@Param('id') id: string, @Body() patchUserDto: PatchUserDto) {
  // PATCH只更新提供的字段
  return this.userService.partialUpdate(id, patchUserDto);
}

// JSON Patch格式示例
@Patch(':id/json-patch')
async jsonPatch(@Param('id') id: string, @Body() patches: JsonPatchDto[]) {
  // [
  //   { "op": "replace", "path": "/name", "value": "新名字" },
  //   { "op": "add", "path": "/tags/-", "value": "新标签" }
  // ]
  return this.userService.applyPatches(id, patches);
}
```

#### 🗑️ DELETE - 删除资源

```typescript
@Delete(':id')
async remove(@Param('id') id: string) {
  await this.userService.remove(id);
  return { message: '用户删除成功' };
}

// 软删除示例
@Delete(':id/soft')
async softDelete(@Param('id') id: string) {
  return this.userService.softDelete(id);
}
```

**特点**：
- ❌ **非安全**：会修改服务器状态
- ✅ **幂等性**：多次删除同一资源结果相同
- ❌ **不可缓存**：响应通常不被缓存

### 📊 HTTP状态码详解

#### 2xx 成功状态码

```typescript
// 200 OK - 请求成功
@Get(':id')
async findOne(@Param('id') id: string) {
  const user = await this.userService.findOne(id);
  return user; // 默认返回200
}

// 201 Created - 资源创建成功
@Post()
@HttpCode(201)
async create(@Body() createUserDto: CreateUserDto) {
  return this.userService.create(createUserDto);
}

// 204 No Content - 成功但无返回内容
@Delete(':id')
@HttpCode(204)
async remove(@Param('id') id: string) {
  await this.userService.remove(id);
  // 不返回任何内容
}
```

#### 4xx 客户端错误

```typescript
// 400 Bad Request - 请求参数错误
@Post()
async create(@Body() createUserDto: CreateUserDto) {
  if (!createUserDto.email) {
    throw new BadRequestException('邮箱不能为空');
  }
  return this.userService.create(createUserDto);
}

// 401 Unauthorized - 未认证
@Get('profile')
@UseGuards(AuthGuard)
async getProfile(@Request() req) {
  return req.user;
}

// 403 Forbidden - 无权限
@Delete(':id')
@UseGuards(AuthGuard, AdminGuard)
async remove(@Param('id') id: string) {
  return this.userService.remove(id);
}

// 404 Not Found - 资源不存在
@Get(':id')
async findOne(@Param('id') id: string) {
  const user = await this.userService.findOne(id);
  if (!user) {
    throw new NotFoundException('用户不存在');
  }
  return user;
}
```

#### 5xx 服务器错误

```typescript
// 500 Internal Server Error - 服务器内部错误
@Get()
async findAll() {
  try {
    return await this.userService.findAll();
  } catch (error) {
    throw new InternalServerErrorException('服务器内部错误');
  }
}

// 503 Service Unavailable - 服务不可用
@Get()
async findAll() {
  if (!this.databaseService.isConnected()) {
    throw new ServiceUnavailableException('数据库连接不可用');
  }
  return this.userService.findAll();
}
```

### 📋 HTTP头部详解

#### 🔍 请求头

```typescript
@Get()
async findAll(@Headers() headers: any, @Req() req: Request) {
  // Accept - 客户端可接受的内容类型
  const acceptType = headers.accept; // application/json
  
  // Authorization - 认证信息
  const authHeader = headers.authorization; // Bearer token
  
  // User-Agent - 客户端信息
  const userAgent = headers['user-agent'];
  
  // Accept-Language - 语言偏好
  const language = headers['accept-language']; // zh-CN,zh;q=0.9,en;q=0.8
  
  return this.userService.findAll();
}
```

#### 📤 响应头

```typescript
@Get(':id')
async findOne(@Param('id') id: string, @Res() res: Response) {
  const user = await this.userService.findOne(id);
  
  // 设置响应头
  res.set({
    'Content-Type': 'application/json',
    'Cache-Control': 'public, max-age=3600',
    'ETag': `"${user.version}"`,
    'Last-Modified': user.updatedAt.toUTCString(),
    'X-Total-Count': '1',
    'X-API-Version': 'v1'
  });
  
  return res.json(user);
}
```

#### 🔧 自定义头部

```typescript
// 自定义请求头
@Get()
async findAll(@Headers('x-client-version') clientVersion: string) {
  if (clientVersion && this.isVersionSupported(clientVersion)) {
    return this.userService.findAll();
  }
  throw new BadRequestException('客户端版本不支持');
}

// 自定义响应头
@Get()
async findAll(@Res() res: Response) {
  const users = await this.userService.findAll();
  
  res.set({
    'X-Total-Count': users.length.toString(),
    'X-Page-Size': '20',
    'X-Current-Page': '1'
  });
  
  return res.json(users);
}
```

## 🎨 API设计最佳实践

### 🏷️ URL设计原则

#### 📝 资源命名规范

```typescript
// ✅ 好的URL设计
/api/v1/users              // 用户集合
/api/v1/users/123          // 特定用户
/api/v1/users/123/articles // 用户的文章
/api/v1/articles           // 文章集合
/api/v1/articles/456       // 特定文章
/api/v1/articles/456/comments // 文章的评论

// ❌ 不好的URL设计
/api/v1/getUsers           // 动词不应该出现在URL中
/api/v1/user/123           // 应该使用复数形式
/api/v1/users-list         // 不需要额外的描述词
/api/v1/users/123/getArticles // 动词不应该出现
```

#### 🔍 查询参数设计

```typescript
@Get()
async findAll(@Query() query: QueryUserDto) {
  // 分页参数
  const page = query.page || 1;
  const limit = query.limit || 20;
  
  // 排序参数
  const sort = query.sort || 'createdAt';
  const order = query.order || 'DESC';
  
  // 过滤参数
  const filters = {
    name: query.name,
    email: query.email,
    status: query.status
  };
  
  // 字段选择
  const fields = query.fields?.split(',');
  
  return this.userService.findAll({
    page,
    limit,
    sort,
    order,
    filters,
    fields
  });
}

// URL示例：
// GET /api/v1/users?page=2&limit=10&sort=name&order=ASC&status=active&fields=id,name,email
```

### ⚠️ 错误处理设计

#### 📋 统一错误格式

```typescript
// 错误响应格式
interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: any;
    timestamp: string;
    path: string;
  };
}

// 全局异常过滤器
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    
    let status = 500;
    let message = '内部服务器错误';
    let code = 'INTERNAL_SERVER_ERROR';
    
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        message = (exceptionResponse as any).message || message;
        code = (exceptionResponse as any).code || code;
      }
    }
    
    const errorResponse: ErrorResponse = {
      error: {
        code,
        message,
        timestamp: new Date().toISOString(),
        path: request.url
      }
    };
    
    response.status(status).json(errorResponse);
  }
}
```

#### 🔍 具体错误处理示例

```typescript
// 业务异常类
export class BusinessException extends HttpException {
  constructor(code: string, message: string, statusCode = 400) {
    super({ code, message }, statusCode);
  }
}

// 使用示例
@Post()
async create(@Body() createUserDto: CreateUserDto) {
  // 验证邮箱是否已存在
  const existingUser = await this.userService.findByEmail(createUserDto.email);
  if (existingUser) {
    throw new BusinessException(
      'EMAIL_ALREADY_EXISTS',
      '该邮箱已被注册',
      409
    );
  }
  
  try {
    return await this.userService.create(createUserDto);
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      throw new BusinessException(
        'DUPLICATE_ENTRY',
        '数据重复',
        409
      );
    }
    throw new InternalServerErrorException('创建用户失败');
  }
}
```

### 🔄 API版本控制

#### 📝 URL版本控制

```typescript
// v1版本
@Controller('api/v1/users')
export class UserV1Controller {
  @Get()
  async findAll() {
    return this.userService.findAllV1();
  }
}

// v2版本
@Controller('api/v2/users')
export class UserV2Controller {
  @Get()
  async findAll() {
    return this.userService.findAllV2();
  }
}
```

#### 📋 Header版本控制

```typescript
@Controller('api/users')
export class UserController {
  @Get()
  async findAll(@Headers('api-version') version: string = 'v1') {
    switch (version) {
      case 'v1':
        return this.userService.findAllV1();
      case 'v2':
        return this.userService.findAllV2();
      default:
        throw new BadRequestException('不支持的API版本');
    }
  }
}
```

## 🧪 实践练习

### 📝 练习1：设计博客API

设计一个博客系统的RESTful API，包含以下资源：
- 用户（Users）
- 文章（Articles）
- 评论（Comments）
- 标签（Tags）

**要求**：
1. 设计合理的URL结构
2. 使用正确的HTTP方法
3. 定义适当的状态码
4. 考虑资源之间的关系

**参考答案**：
```typescript
// 用户相关API
GET    /api/v1/users           // 获取用户列表
GET    /api/v1/users/:id       // 获取特定用户
POST   /api/v1/users           // 创建用户
PUT    /api/v1/users/:id       // 更新用户
DELETE /api/v1/users/:id       // 删除用户

// 文章相关API
GET    /api/v1/articles        // 获取文章列表
GET    /api/v1/articles/:id    // 获取特定文章
POST   /api/v1/articles        // 创建文章
PUT    /api/v1/articles/:id    // 更新文章
DELETE /api/v1/articles/:id    // 删除文章

// 用户文章关系
GET    /api/v1/users/:id/articles // 获取用户的文章

// 评论相关API
GET    /api/v1/articles/:id/comments // 获取文章评论
POST   /api/v1/articles/:id/comments // 创建评论
PUT    /api/v1/comments/:id          // 更新评论
DELETE /api/v1/comments/:id          // 删除评论

// 标签相关API
GET    /api/v1/tags            // 获取标签列表
GET    /api/v1/articles/:id/tags // 获取文章标签
POST   /api/v1/articles/:id/tags // 为文章添加标签
```

### 📝 练习2：HTTP状态码选择

为以下场景选择合适的HTTP状态码：

1. 用户成功登录 → **200 OK**
2. 创建新文章成功 → **201 Created**
3. 删除文章成功 → **204 No Content**
4. 请求的文章不存在 → **404 Not Found**
5. 用户无权限删除文章 → **403 Forbidden**
6. 请求参数格式错误 → **400 Bad Request**
7. 服务器数据库连接失败 → **500 Internal Server Error**
8. 邮箱已被注册 → **409 Conflict**

### 📝 练习3：设计错误响应

设计一个统一的错误响应格式，并为以下错误场景提供具体的错误信息：

```typescript
// 统一错误响应格式
interface ApiError {
  error: {
    code: string;
    message: string;
    details?: any;
    timestamp: string;
    path: string;
  };
}

// 示例错误响应
{
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "请求参数验证失败",
    "details": {
      "email": ["邮箱格式不正确"],
      "password": ["密码长度至少8位"]
    },
    "timestamp": "2024-01-15T10:30:00Z",
    "path": "/api/v1/users"
  }
}
```

## 🔍 自我检测

### 📋 知识点检查清单

- [ ] 我能解释REST的六大核心原则
- [ ] 我理解Richardson成熟度模型的四个级别
- [ ] 我知道何时使用不同的HTTP方法
- [ ] 我能设计合理的URL结构
- [ ] 我了解常用HTTP状态码的含义
- [ ] 我能设计统一的错误处理机制
- [ ] 我理解API版本控制的不同策略
- [ ] 我能分析API设计的优劣

### 🎯 理解程度测试

**初级水平**（能回答60%以上）：
1. REST是什么的缩写？
2. HTTP的GET和POST方法有什么区别？
3. 404状态码表示什么意思？
4. 什么是幂等性？
5. URL中应该使用单数还是复数形式？

**中级水平**（能回答70%以上）：
1. 解释REST的无状态原则及其优势
2. 什么是HATEOAS？
3. PUT和PATCH方法的区别是什么？
4. 如何设计API的版本控制？
5. 什么情况下使用409状态码？

**高级水平**（能回答80%以上）：
1. 如何设计支持HATEOAS的API？
2. 解释HTTP缓存机制及相关头部
3. 如何处理API的向后兼容性？
4. 设计一个完整的错误处理体系
5. 如何优化API的性能？

## 📚 扩展阅读

### 📖 推荐资源

1. **官方文档**
   - [HTTP/1.1 规范](https://tools.ietf.org/html/rfc7231)
   - [REST架构风格](https://www.ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm)

2. **经典书籍**
   - 《RESTful Web APIs》- Leonard Richardson
   - 《HTTP权威指南》- David Gourley
   - 《Web API设计》- Brian Mulloy

3. **在线资源**
   - [REST API Tutorial](https://restfulapi.net/)
   - [HTTP Status Codes](https://httpstatuses.com/)
   - [API Design Guide](https://cloud.google.com/apis/design)

### 🎯 下一步学习

完成本章学习后，你已经具备了：
- ✅ RESTful架构风格的深度理解
- ✅ HTTP协议的全面掌握
- ✅ API设计的基础能力
- ✅ 错误处理的最佳实践

**准备好进入第5章：API设计哲学与实践了吗？** 🚀

在下一章中，我们将：
- 🎨 深入学习API设计的哲学思想
- 🔧 掌握NestJS中的API实现技巧
- 📝 学习接口文档的自动生成
- 🧪 建立完善的API测试体系

让我们继续这个精彩的学习之旅！ 