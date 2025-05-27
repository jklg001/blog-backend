# 📚 第6章：JWT认证机制深度解析

> **从传统认证到现代令牌** - 掌握企业级身份认证与授权体系

## 🎯 章节概述

在前面的章节中，我们已经掌握了API设计的核心理念和实践技巧。现在，我们将深入学习现代Web应用中最重要的安全机制之一：JWT（JSON Web Token）认证。这是构建安全、可扩展的后端系统的关键技术。

### 🏗️ 本章学习路径

```mermaid
graph TD
    A[JWT基础理论] --> B[JWT结构解析]
    B --> C[签名算法详解]
    C --> D[NestJS JWT集成]
    D --> E[认证守卫实现]
    E --> F[权限控制系统]
    F --> G[会话管理策略]
    G --> H[安全最佳实践]
    H --> I[企业级应用]
    
    style A fill:#e1f5fe
    style B fill:#e8f5e8
    style C fill:#fff3e0
    style D fill:#ffebee
    style E fill:#f3e5f5
    style F fill:#e0f2f1
    style G fill:#fce4ec
    style H fill:#f1f8e9
    style I fill:#fff8e1
```

## 🎯 学习目标

通过本章学习，你将能够：

- 🔐 **深度理解JWT机制**：掌握JWT的结构、原理和工作流程
- 🛡️ **实现安全认证系统**：构建完整的用户认证和授权体系
- 👥 **设计权限控制**：建立基于角色的访问控制（RBAC）系统
- 🔄 **管理用户会话**：实现高可用的会话管理和令牌刷新机制
- ⚡ **优化认证性能**：掌握认证系统的性能优化技巧
- 🎯 **应用最佳实践**：遵循企业级安全开发标准

## 🔐 JWT基础理论

### 🎨 什么是JWT？

**JWT**（JSON Web Token）是一种开放标准（RFC 7519），用于在各方之间安全地传输信息。

#### 🏠 生活类比：数字身份证

想象JWT就像一张高科技的数字身份证：

```
🆔 传统身份证（Session）
├── 📋 身份信息（存储在服务器）
├── 🔢 身份证号（Session ID）
├── 🏛️ 发证机关（服务器）
└── ✅ 验证过程（查询数据库）

🎫 数字身份证（JWT）
├── 📋 身份信息（编码在令牌中）
├── 🔐 数字签名（防伪标识）
├── ⏰ 有效期（自动过期）
└── ✅ 验证过程（本地验证签名）
```

#### 🎯 JWT的核心优势

```typescript
// JWT vs 传统Session对比
interface AuthenticationComparison {
  // 传统Session认证
  sessionAuth: {
    storage: '服务器端存储';
    scalability: '难以水平扩展';
    performance: '需要数据库查询';
    stateful: '有状态，服务器需要维护会话';
  };
  
  // JWT认证
  jwtAuth: {
    storage: '客户端存储';
    scalability: '易于水平扩展';
    performance: '无需数据库查询';
    stateless: '无状态，服务器无需维护会话';
  };
}
```

### 📊 JWT的工作流程

```mermaid
sequenceDiagram
    participant C as 客户端
    participant S as 服务器
    participant DB as 数据库
    
    Note over C,DB: 1. 用户登录
    C->>S: POST /auth/login (用户名+密码)
    S->>DB: 验证用户凭据
    DB-->>S: 返回用户信息
    S->>S: 生成JWT令牌
    S-->>C: 返回JWT令牌
    
    Note over C,DB: 2. 访问受保护资源
    C->>S: GET /api/profile (携带JWT)
    S->>S: 验证JWT签名
    S->>S: 检查令牌有效期
    S->>S: 提取用户信息
    S-->>C: 返回用户数据
    
    Note over C,DB: 3. 令牌刷新
    C->>S: POST /auth/refresh (刷新令牌)
    S->>S: 验证刷新令牌
    S->>S: 生成新的访问令牌
    S-->>C: 返回新令牌
```

## 🔍 JWT结构深度解析

### 📝 JWT的三部分结构

JWT由三部分组成，用点（.）分隔：

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c

Header.Payload.Signature
```

#### 🎯 Header（头部）

```typescript
// JWT Header结构
interface JWTHeader {
  alg: string;  // 签名算法
  typ: string;  // 令牌类型
  kid?: string; // 密钥ID（可选）
}

// 示例Header
const header: JWTHeader = {
  alg: 'HS256',  // HMAC SHA256
  typ: 'JWT'     // JSON Web Token
};

// Base64URL编码后的Header
const encodedHeader = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9';
```

#### 📋 Payload（载荷）

```typescript
// JWT标准声明（Claims）
interface JWTPayload {
  // 标准声明
  iss?: string;  // 发行者 (issuer)
  sub?: string;  // 主题 (subject)
  aud?: string;  // 受众 (audience)
  exp?: number;  // 过期时间 (expiration time)
  nbf?: number;  // 生效时间 (not before)
  iat?: number;  // 签发时间 (issued at)
  jti?: string;  // JWT ID
  
  // 自定义声明
  userId?: string;
  username?: string;
  email?: string;
  roles?: string[];
  permissions?: string[];
}

// 示例Payload
const payload: JWTPayload = {
  sub: '1234567890',
  name: 'John Doe',
  iat: 1516239022,
  exp: 1516242622,
  userId: 'user_123',
  roles: ['user', 'admin']
};

// Base64URL编码后的Payload
const encodedPayload = 'eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ';
```

#### 🔐 Signature（签名）

```typescript
// 签名生成过程
class JWTSignature {
  static generate(
    encodedHeader: string,
    encodedPayload: string,
    secret: string,
    algorithm: string = 'HS256'
  ): string {
    const data = `${encodedHeader}.${encodedPayload}`;
    
    switch (algorithm) {
      case 'HS256':
        return this.hmacSHA256(data, secret);
      case 'RS256':
        return this.rsaSHA256(data, secret);
      default:
        throw new Error(`不支持的算法: ${algorithm}`);
    }
  }
  
  private static hmacSHA256(data: string, secret: string): string {
    const crypto = require('crypto');
    return crypto
      .createHmac('sha256', secret)
      .update(data)
      .digest('base64url');
  }
  
  private static rsaSHA256(data: string, privateKey: string): string {
    const crypto = require('crypto');
    const sign = crypto.createSign('RSA-SHA256');
    sign.update(data);
    return sign.sign(privateKey, 'base64url');
  }
}
```

### 🔧 JWT编码解码实现

```typescript
import * as crypto from 'crypto';

class JWTUtils {
  // Base64URL编码
  static base64urlEncode(data: string | Buffer): string {
    const base64 = Buffer.from(data).toString('base64');
    return base64
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }
  
  // Base64URL解码
  static base64urlDecode(encoded: string): string {
    // 补充填充字符
    let padded = encoded;
    while (padded.length % 4) {
      padded += '=';
    }
    
    // 替换URL安全字符
    const base64 = padded.replace(/-/g, '+').replace(/_/g, '/');
    return Buffer.from(base64, 'base64').toString('utf8');
  }
  
  // 生成JWT
  static generateJWT(
    payload: any,
    secret: string,
    options: {
      algorithm?: string;
      expiresIn?: number;
      issuer?: string;
    } = {}
  ): string {
    const header = {
      alg: options.algorithm || 'HS256',
      typ: 'JWT'
    };
    
    const now = Math.floor(Date.now() / 1000);
    const jwtPayload = {
      ...payload,
      iat: now,
      exp: now + (options.expiresIn || 3600), // 默认1小时
      iss: options.issuer
    };
    
    const encodedHeader = this.base64urlEncode(JSON.stringify(header));
    const encodedPayload = this.base64urlEncode(JSON.stringify(jwtPayload));
    
    const signature = this.generateSignature(
      `${encodedHeader}.${encodedPayload}`,
      secret,
      header.alg
    );
    
    return `${encodedHeader}.${encodedPayload}.${signature}`;
  }
  
  // 验证JWT
  static verifyJWT(token: string, secret: string): {
    valid: boolean;
    payload?: any;
    error?: string;
  } {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        return { valid: false, error: 'JWT格式无效' };
      }
      
      const [encodedHeader, encodedPayload, signature] = parts;
      
      // 解码头部和载荷
      const header = JSON.parse(this.base64urlDecode(encodedHeader));
      const payload = JSON.parse(this.base64urlDecode(encodedPayload));
      
      // 验证签名
      const expectedSignature = this.generateSignature(
        `${encodedHeader}.${encodedPayload}`,
        secret,
        header.alg
      );
      
      if (signature !== expectedSignature) {
        return { valid: false, error: '签名验证失败' };
      }
      
      // 验证过期时间
      const now = Math.floor(Date.now() / 1000);
      if (payload.exp && payload.exp < now) {
        return { valid: false, error: '令牌已过期' };
      }
      
      // 验证生效时间
      if (payload.nbf && payload.nbf > now) {
        return { valid: false, error: '令牌尚未生效' };
      }
      
      return { valid: true, payload };
    } catch (error) {
      return { valid: false, error: '令牌解析失败' };
    }
  }
  
  private static generateSignature(data: string, secret: string, algorithm: string): string {
    switch (algorithm) {
      case 'HS256':
        return crypto
          .createHmac('sha256', secret)
          .update(data)
          .digest('base64url');
      default:
        throw new Error(`不支持的算法: ${algorithm}`);
    }
  }
}
```

## 🔧 NestJS JWT集成

### 📦 安装和配置

```bash
# 安装JWT相关包
npm install @nestjs/jwt @nestjs/passport passport passport-jwt
npm install -D @types/passport-jwt
```

### 🏗️ JWT模块配置

```typescript
// auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN', '1h'),
          issuer: configService.get<string>('JWT_ISSUER', 'blog-api'),
          audience: configService.get<string>('JWT_AUDIENCE', 'blog-users'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
```

### 🔐 JWT策略实现

```typescript
// auth/strategies/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

export interface JwtPayload {
  sub: string;
  username: string;
  email: string;
  roles: string[];
  iat: number;
  exp: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
      issuer: configService.get<string>('JWT_ISSUER'),
      audience: configService.get<string>('JWT_AUDIENCE'),
    });
  }

  async validate(payload: JwtPayload) {
    // 验证用户是否仍然存在且活跃
    const user = await this.authService.validateUserById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('用户不存在或已被禁用');
    }

    // 检查令牌是否在黑名单中
    const isBlacklisted = await this.authService.isTokenBlacklisted(payload);
    if (isBlacklisted) {
      throw new UnauthorizedException('令牌已失效');
    }

    return {
      userId: payload.sub,
      username: payload.username,
      email: payload.email,
      roles: payload.roles,
    };
  }
}
```

### 🛡️ 认证服务实现

```typescript
// auth/auth.service.ts
import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { LoginDto, RegisterDto } from './dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private tokenBlacklist = new Set<string>(); // 生产环境应使用Redis

  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  // 用户注册
  async register(registerDto: RegisterDto) {
    const { username, email, password } = registerDto;

    // 检查用户是否已存在
    const existingUser = await this.userService.findByEmailOrUsername(email, username);
    if (existingUser) {
      throw new BadRequestException('用户名或邮箱已被注册');
    }

    // 创建用户
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await this.userService.create({
      username,
      email,
      password: hashedPassword,
    });

    // 生成令牌
    const tokens = await this.generateTokens(user);

    return {
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  // 用户登录
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // 验证用户凭据
    const user = await this.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('邮箱或密码错误');
    }

    // 生成令牌
    const tokens = await this.generateTokens(user);

    return {
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  // 刷新令牌
  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      const user = await this.userService.findById(payload.sub);
      if (!user) {
        throw new UnauthorizedException('用户不存在');
      }

      const tokens = await this.generateTokens(user);
      return tokens;
    } catch (error) {
      throw new UnauthorizedException('刷新令牌无效');
    }
  }

  // 登出
  async logout(token: string) {
    // 将令牌加入黑名单
    this.tokenBlacklist.add(token);
    return { message: '登出成功' };
  }

  // 验证用户凭据
  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (user && await bcrypt.compare(password, user.password)) {
      return user;
    }
    return null;
  }

  // 根据ID验证用户
  async validateUserById(userId: string) {
    return this.userService.findById(userId);
  }

  // 检查令牌是否在黑名单中
  async isTokenBlacklisted(payload: any): Promise<boolean> {
    // 这里可以检查数据库或Redis中的黑名单
    return this.tokenBlacklist.has(payload.jti);
  }

  // 生成访问令牌和刷新令牌
  private async generateTokens(user: any) {
    const payload = {
      sub: user.id,
      username: user.username,
      email: user.email,
      roles: user.roles || ['user'],
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        expiresIn: '15m', // 访问令牌15分钟
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '7d', // 刷新令牌7天
      }),
    ]);

    return {
      accessToken,
      refreshToken,
      expiresIn: 15 * 60, // 15分钟（秒）
    };
  }

  // 清理用户敏感信息
  private sanitizeUser(user: any) {
    const { password, ...sanitized } = user;
    return sanitized;
  }
}
```

### 🎛️ 认证控制器

```typescript
// auth/auth.controller.ts
import { Controller, Post, Body, UseGuards, Request, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('认证')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: '用户注册' })
  @ApiResponse({ status: 201, description: '注册成功' })
  @ApiResponse({ status: 400, description: '注册失败' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @ApiOperation({ summary: '用户登录' })
  @ApiResponse({ status: 200, description: '登录成功' })
  @ApiResponse({ status: 401, description: '登录失败' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('refresh')
  @ApiOperation({ summary: '刷新令牌' })
  @ApiResponse({ status: 200, description: '刷新成功' })
  @ApiResponse({ status: 401, description: '刷新失败' })
  async refresh(@Body('refreshToken') refreshToken: string) {
    return this.authService.refreshToken(refreshToken);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '用户登出' })
  @ApiResponse({ status: 200, description: '登出成功' })
  async logout(@Request() req) {
    const token = req.headers.authorization?.replace('Bearer ', '');
    return this.authService.logout(token);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取用户信息' })
  @ApiResponse({ status: 200, description: '获取成功' })
  async getProfile(@Request() req) {
    return req.user;
  }
}
```

## 🛡️ 认证守卫实现

### 🔐 JWT认证守卫

```typescript
// auth/guards/jwt-auth.guard.ts
import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    // 检查是否为公开路由
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    if (err || !user) {
      throw err || new UnauthorizedException('访问令牌无效或已过期');
    }
    return user;
  }
}
```

### 🎯 可选认证守卫

```typescript
// auth/guards/optional-auth.guard.ts
import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any) {
    // 即使认证失败也不抛出异常，只是不设置用户信息
    return user || null;
  }
}
```

### 🏷️ 装饰器定义

```typescript
// auth/decorators/public.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

// auth/decorators/user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    return data ? user?.[data] : user;
  },
);

// auth/decorators/roles.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
```

## 👥 权限控制系统

### 🎯 基于角色的访问控制（RBAC）

```typescript
// auth/guards/roles.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    
    if (!user || !user.roles) {
      return false;
    }

    return requiredRoles.some((role) => user.roles?.includes(role));
  }
}
```

### 🔧 权限管理服务

```typescript
// auth/permission.service.ts
import { Injectable } from '@nestjs/common';

export interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
  description?: string;
}

export interface Role {
  id: string;
  name: string;
  permissions: Permission[];
  description?: string;
}

@Injectable()
export class PermissionService {
  private permissions: Permission[] = [
    { id: '1', name: 'read_users', resource: 'user', action: 'read' },
    { id: '2', name: 'write_users', resource: 'user', action: 'write' },
    { id: '3', name: 'delete_users', resource: 'user', action: 'delete' },
    { id: '4', name: 'read_articles', resource: 'article', action: 'read' },
    { id: '5', name: 'write_articles', resource: 'article', action: 'write' },
    { id: '6', name: 'delete_articles', resource: 'article', action: 'delete' },
  ];

  private roles: Role[] = [
    {
      id: '1',
      name: 'admin',
      permissions: this.permissions, // 管理员拥有所有权限
    },
    {
      id: '2',
      name: 'editor',
      permissions: this.permissions.filter(p => 
        p.resource === 'article' || (p.resource === 'user' && p.action === 'read')
      ),
    },
    {
      id: '3',
      name: 'user',
      permissions: this.permissions.filter(p => p.action === 'read'),
    },
  ];

  // 检查用户是否有特定权限
  hasPermission(userRoles: string[], resource: string, action: string): boolean {
    const userPermissions = this.getUserPermissions(userRoles);
    return userPermissions.some(p => p.resource === resource && p.action === action);
  }

  // 获取用户的所有权限
  getUserPermissions(userRoles: string[]): Permission[] {
    const permissions: Permission[] = [];
    
    for (const roleName of userRoles) {
      const role = this.roles.find(r => r.name === roleName);
      if (role) {
        permissions.push(...role.permissions);
      }
    }

    // 去重
    return permissions.filter((permission, index, self) =>
      index === self.findIndex(p => p.id === permission.id)
    );
  }

  // 获取所有角色
  getAllRoles(): Role[] {
    return this.roles;
  }

  // 获取所有权限
  getAllPermissions(): Permission[] {
    return this.permissions;
  }
}
```

### 🎯 权限装饰器和守卫

```typescript
// auth/decorators/permissions.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const PERMISSIONS_KEY = 'permissions';
export const RequirePermissions = (...permissions: string[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);

// auth/guards/permissions.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { PermissionService } from '../permission.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private permissionService: PermissionService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    
    if (!user || !user.roles) {
      return false;
    }

    return requiredPermissions.every(permission => {
      const [resource, action] = permission.split(':');
      return this.permissionService.hasPermission(user.roles, resource, action);
    });
  }
}
```

### 🎛️ 使用示例

```typescript
// user/user.controller.ts
import { Controller, Get, Post, Put, Delete, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { CurrentUser } from '../auth/decorators/user.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  @Get()
  @UseGuards(RolesGuard)
  @Roles('admin', 'editor')
  async findAll() {
    return this.userService.findAll();
  }

  @Get('profile')
  async getProfile(@CurrentUser() user: any) {
    return this.userService.findById(user.userId);
  }

  @Post()
  @UseGuards(PermissionsGuard)
  @RequirePermissions('user:write')
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
```

## 🔄 会话管理策略

### 🎫 令牌管理服务

```typescript
// auth/token.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface RefreshTokenPayload {
  sub: string;
  tokenId: string;
  iat: number;
  exp: number;
}

@Injectable()
export class TokenService {
  private refreshTokens = new Map<string, RefreshTokenPayload>(); // 生产环境使用Redis

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  // 生成令牌对
  async generateTokenPair(user: any): Promise<TokenPair> {
    const tokenId = this.generateTokenId();
    
    const payload = {
      sub: user.id,
      username: user.username,
      email: user.email,
      roles: user.roles || ['user'],
    };

    const refreshPayload = {
      sub: user.id,
      tokenId,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        expiresIn: this.configService.get('JWT_ACCESS_EXPIRES_IN', '15m'),
      }),
      this.jwtService.signAsync(refreshPayload, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN', '7d'),
      }),
    ]);

    // 存储刷新令牌
    const refreshTokenPayload = this.jwtService.decode(refreshToken) as RefreshTokenPayload;
    this.refreshTokens.set(tokenId, refreshTokenPayload);

    return {
      accessToken,
      refreshToken,
      expiresIn: 15 * 60, // 15分钟
    };
  }

  // 刷新访问令牌
  async refreshAccessToken(refreshToken: string): Promise<TokenPair> {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      }) as RefreshTokenPayload;

      // 检查刷新令牌是否存在
      const storedToken = this.refreshTokens.get(payload.tokenId);
      if (!storedToken) {
        throw new Error('刷新令牌不存在');
      }

      // 获取用户信息
      const user = await this.getUserById(payload.sub);
      if (!user) {
        throw new Error('用户不存在');
      }

      // 撤销旧的刷新令牌
      this.refreshTokens.delete(payload.tokenId);

      // 生成新的令牌对
      return this.generateTokenPair(user);
    } catch (error) {
      throw new Error('刷新令牌无效');
    }
  }

  // 撤销刷新令牌
  revokeRefreshToken(tokenId: string): boolean {
    return this.refreshTokens.delete(tokenId);
  }

  // 撤销用户的所有刷新令牌
  revokeAllUserTokens(userId: string): void {
    for (const [tokenId, payload] of this.refreshTokens.entries()) {
      if (payload.sub === userId) {
        this.refreshTokens.delete(tokenId);
      }
    }
  }

  // 清理过期的刷新令牌
  cleanupExpiredTokens(): void {
    const now = Math.floor(Date.now() / 1000);
    
    for (const [tokenId, payload] of this.refreshTokens.entries()) {
      if (payload.exp < now) {
        this.refreshTokens.delete(tokenId);
      }
    }
  }

  private generateTokenId(): string {
    return require('crypto').randomBytes(16).toString('hex');
  }

  private async getUserById(userId: string): Promise<any> {
    // 这里应该调用用户服务获取用户信息
    // return this.userService.findById(userId);
    return { id: userId, username: 'test', roles: ['user'] };
  }
}
```

### 🔐 令牌黑名单管理

```typescript
// auth/blacklist.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export interface BlacklistedToken {
  jti: string;
  exp: number;
  reason: string;
}

@Injectable()
export class BlacklistService {
  private blacklist = new Map<string, BlacklistedToken>(); // 生产环境使用Redis

  constructor(private jwtService: JwtService) {}

  // 将令牌加入黑名单
  blacklistToken(token: string, reason: string = 'logout'): void {
    try {
      const payload = this.jwtService.decode(token) as any;
      if (payload && payload.jti && payload.exp) {
        this.blacklist.set(payload.jti, {
          jti: payload.jti,
          exp: payload.exp,
          reason,
        });
      }
    } catch (error) {
      // 忽略无效令牌
    }
  }

  // 检查令牌是否在黑名单中
  isTokenBlacklisted(token: string): boolean {
    try {
      const payload = this.jwtService.decode(token) as any;
      if (payload && payload.jti) {
        return this.blacklist.has(payload.jti);
      }
    } catch (error) {
      // 无效令牌视为已黑名单
      return true;
    }
    return false;
  }

  // 清理过期的黑名单令牌
  cleanupExpiredTokens(): void {
    const now = Math.floor(Date.now() / 1000);
    
    for (const [jti, tokenInfo] of this.blacklist.entries()) {
      if (tokenInfo.exp < now) {
        this.blacklist.delete(jti);
      }
    }
  }

  // 获取黑名单统计信息
  getBlacklistStats(): {
    total: number;
    expired: number;
    active: number;
  } {
    const now = Math.floor(Date.now() / 1000);
    let expired = 0;
    let active = 0;

    for (const tokenInfo of this.blacklist.values()) {
      if (tokenInfo.exp < now) {
        expired++;
      } else {
        active++;
      }
    }

    return {
      total: this.blacklist.size,
      expired,
      active,
    };
  }
}
```

### ⏰ 定时任务清理

```typescript
// auth/cleanup.service.ts
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TokenService } from './token.service';
import { BlacklistService } from './blacklist.service';

@Injectable()
export class CleanupService {
  constructor(
    private tokenService: TokenService,
    private blacklistService: BlacklistService,
  ) {}

  // 每小时清理一次过期令牌
  @Cron(CronExpression.EVERY_HOUR)
  async cleanupExpiredTokens() {
    console.log('开始清理过期令牌...');
    
    // 清理过期的刷新令牌
    this.tokenService.cleanupExpiredTokens();
    
    // 清理过期的黑名单令牌
    this.blacklistService.cleanupExpiredTokens();
    
    console.log('过期令牌清理完成');
  }

  // 每天凌晨2点生成清理报告
  @Cron('0 2 * * *')
  async generateCleanupReport() {
    const stats = this.blacklistService.getBlacklistStats();
    console.log('令牌清理报告:', {
      timestamp: new Date().toISOString(),
      blacklistStats: stats,
    });
  }
} 