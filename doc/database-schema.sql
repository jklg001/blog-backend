-- 博客系统数据库结构
-- 请根据实际情况调整数据库名称和字符集

-- 创建数据库
CREATE DATABASE IF NOT EXISTS blog_system 
DEFAULT CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE blog_system;

-- 用户表
CREATE TABLE blog_user_accounts (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT '用户ID',
    username VARCHAR(50) NOT NULL COMMENT '用户名',
    nickname VARCHAR(50) NULL COMMENT '昵称',
    email VARCHAR(100) NOT NULL UNIQUE COMMENT '邮箱',
    phone VARCHAR(20) NULL UNIQUE COMMENT '手机号',
    password VARCHAR(100) NOT NULL COMMENT '密码',
    avatar VARCHAR(255) NULL COMMENT '头像URL',
    role ENUM('admin', 'user') DEFAULT 'user' COMMENT '用户角色',
    status ENUM('active', 'inactive', 'banned') DEFAULT 'active' COMMENT '用户状态',
    bio TEXT NULL COMMENT '个人简介',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    last_login_at TIMESTAMP NULL COMMENT '最后登录时间',
    
    INDEX idx_email (email),
    INDEX idx_username (username),
    INDEX idx_status (status)
) ENGINE=InnoDB COMMENT='用户账户表';

-- 文章表
CREATE TABLE blog_articles (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT '文章ID',
    title VARCHAR(100) NOT NULL COMMENT '文章标题',
    content TEXT NOT NULL COMMENT '文章内容（Markdown格式）',
    summary VARCHAR(500) NULL COMMENT '文章摘要',
    cover_image VARCHAR(255) NULL COMMENT '封面图片URL',
    author_id INT NOT NULL COMMENT '作者ID',
    status ENUM('draft', 'published', 'deleted') DEFAULT 'draft' COMMENT '状态：draft, published, deleted',
    view_count INT DEFAULT 0 COMMENT '阅读次数',
    like_count INT DEFAULT 0 COMMENT '点赞次数',
    comment_count INT DEFAULT 0 COMMENT '评论数量',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    published_at TIMESTAMP NULL COMMENT '发布时间',
    is_deleted BOOLEAN DEFAULT FALSE COMMENT '是否删除（软删除）',
    category_ids JSON NULL COMMENT '分类ID数组',
    tag_ids JSON NULL COMMENT '标签ID数组',
    
    FOREIGN KEY (author_id) REFERENCES blog_user_accounts(id),
    INDEX idx_author_id (author_id),
    INDEX idx_status (status),
    INDEX idx_published_at (published_at),
    INDEX idx_view_count (view_count),
    INDEX idx_like_count (like_count),
    FULLTEXT INDEX idx_content_search (title, content)
) ENGINE=InnoDB COMMENT='文章表';

-- 评论表
CREATE TABLE blog_comments (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT '评论ID',
    content TEXT NOT NULL COMMENT '评论内容',
    article_id INT NOT NULL COMMENT '文章ID',
    author_id INT NOT NULL COMMENT '评论作者ID',
    parent_id INT NULL COMMENT '父评论ID',
    status ENUM('published', 'pending', 'hidden', 'deleted') DEFAULT 'published' COMMENT '评论状态',
    like_count INT DEFAULT 0 COMMENT '点赞次数',
    reply_count INT DEFAULT 0 COMMENT '回复次数',
    ip_address VARCHAR(45) NULL COMMENT 'IP地址',
    user_agent VARCHAR(500) NULL COMMENT '用户代理',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    
    FOREIGN KEY (article_id) REFERENCES blog_articles(id) ON DELETE CASCADE,
    FOREIGN KEY (author_id) REFERENCES blog_user_accounts(id),
    FOREIGN KEY (parent_id) REFERENCES blog_comments(id) ON DELETE CASCADE,
    
    INDEX idx_article_status (article_id, status),
    INDEX idx_author_id (author_id),
    INDEX idx_parent_id (parent_id),
    INDEX idx_created_at (created_at DESC)
) ENGINE=InnoDB COMMENT='评论表';

-- 插入测试数据
-- 创建测试用户
INSERT INTO blog_user_accounts (username, nickname, email, password, role, status, bio) VALUES
('admin', '管理员', 'admin@example.com', '$2b$10$hash1', 'admin', 'active', '系统管理员'),
('testuser', '测试用户', 'test@example.com', '$2b$10$hash2', 'user', 'active', '这是一个测试用户'),
('author1', '作者一号', 'author1@example.com', '$2b$10$hash3', 'user', 'active', '喜欢写技术文章的程序员'),
('reader1', '读者小王', 'reader1@example.com', '$2b$10$hash4', 'user', 'active', '热爱阅读的技术爱好者');

-- 创建测试文章
INSERT INTO blog_articles (title, content, summary, author_id, status, view_count, like_count, published_at) VALUES
('NestJS 入门指南', '# NestJS 入门指南\n\n## 什么是 NestJS\n\nNestJS 是一个用于构建高效、可扩展的 Node.js 服务器端应用程序的框架...', 'NestJS 是一个现代化的 Node.js 框架，本文将介绍如何快速上手', 3, 'published', 150, 25, NOW()),
('TypeScript 最佳实践', '# TypeScript 最佳实践\n\n## 为什么使用 TypeScript\n\nTypeScript 为 JavaScript 增加了静态类型检查...', '分享一些 TypeScript 开发中的最佳实践和技巧', 3, 'published', 200, 35, NOW()),
('前端性能优化技巧', '# 前端性能优化技巧\n\n## 性能优化的重要性\n\n网页性能直接影响用户体验...', '总结一些常用的前端性能优化方法和工具', 3, 'published', 300, 50, NOW());

-- 创建测试评论
INSERT INTO blog_comments (content, article_id, author_id, status, like_count) VALUES
('很棒的文章！对新手很友好，讲解得很清楚。', 1, 2, 'published', 5),
('感谢分享，学到了很多新知识。', 1, 4, 'published', 3),
('文章写得不错，但是希望能有更多实例代码。', 1, 4, 'published', 2),
('TypeScript 确实能大大提高开发效率和代码质量。', 2, 2, 'published', 8),
('有没有更详细的配置说明？', 2, 4, 'published', 1),
('性能优化是个永恒的话题，感谢总结！', 3, 2, 'published', 10),
('建议补充一些工具推荐。', 3, 4, 'published', 4);

-- 创建测试回复评论
INSERT INTO blog_comments (content, article_id, author_id, parent_id, status, like_count) VALUES
('谢谢您的建议！我会在后续文章中增加更多代码示例。', 1, 3, 3, 'published', 1),
('同意！TypeScript 的类型检查确实能减少很多运行时错误。', 2, 3, 4, 'published', 2),
('好的，我会整理一个工具清单发布出来。', 3, 3, 7, 'published', 1);

-- 更新文章的评论数量
UPDATE blog_articles SET comment_count = (
    SELECT COUNT(*) FROM blog_comments 
    WHERE blog_comments.article_id = blog_articles.id 
    AND blog_comments.status = 'published'
);

-- 更新父评论的回复数量
UPDATE blog_comments SET reply_count = (
    SELECT COUNT(*) FROM blog_comments AS replies 
    WHERE replies.parent_id = blog_comments.id 
    AND replies.status = 'published'
) WHERE parent_id IS NULL;

-- 创建视图：文章统计信息
CREATE VIEW article_stats AS
SELECT 
    a.id,
    a.title,
    a.author_id,
    u.username as author_name,
    a.view_count,
    a.like_count,
    a.comment_count,
    a.status,
    a.created_at,
    a.published_at
FROM blog_articles a
LEFT JOIN blog_user_accounts u ON a.author_id = u.id
WHERE a.is_deleted = FALSE;

-- 创建视图：评论树形结构
CREATE VIEW comment_tree AS
SELECT 
    c.id,
    c.content,
    c.article_id,
    c.author_id,
    u.username as author_name,
    u.nickname as author_nickname,
    u.avatar as author_avatar,
    c.parent_id,
    c.like_count,
    c.reply_count,
    c.created_at,
    c.status,
    CASE 
        WHEN c.parent_id IS NULL THEN 0
        ELSE 1 
    END as level
FROM blog_comments c
LEFT JOIN blog_user_accounts u ON c.author_id = u.id
WHERE c.status = 'published'
ORDER BY 
    CASE WHEN c.parent_id IS NULL THEN c.id ELSE c.parent_id END,
    c.parent_id IS NOT NULL,
    c.created_at;

-- 显示表结构
SHOW TABLES;
DESCRIBE blog_user_accounts;
DESCRIBE blog_articles;
DESCRIBE blog_comments; 