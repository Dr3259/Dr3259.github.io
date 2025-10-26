'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Globe, CheckCircle2, TrendingUp, Sparkles, BookOpen, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function RESTfulAPIPage() {
  const resources = [
    { name: 'RESTful API 设计指南', url: 'https://restfulapi.net/', description: 'REST API 设计最佳实践和规范' },
    { name: 'MDN HTTP 文档', url: 'https://developer.mozilla.org/zh-CN/docs/Web/HTTP', description: 'HTTP 协议完整文档' },
    { name: 'HTTP 状态码参考', url: 'https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status', description: '所有 HTTP 状态码说明' },
    { name: 'REST API Tutorial', url: 'https://www.restapitutorial.com/', description: 'RESTful API 教程和示例' },
    { name: 'GitHub REST API', url: 'https://docs.github.com/en/rest', description: 'GitHub 的 REST API 文档示例' },
    { name: 'Postman', url: 'https://www.postman.com/', description: 'API 测试和调试工具' },
  ];

  const sections = [
    {
      title: '1. 资源（Resource）',
      category: '核心概念',
      what: '系统中被操作的对象（如用户、文章、订单），用 URL 唯一标识',
      why: '让接口语义直观、统一、可预测',
      how: 'GET /users/123 表示访问 id 为 123 的用户',
      sugar: '所有操作围绕资源，而不是动作',
      scenarios: ['用户管理', '文章系统', '订单处理', '商品目录'],
      relations: ['与 URI 设计紧密相关', '是 RESTful 的核心抽象'],
      code: `// ✅ 正确：资源导向
GET    /users          // 获取用户列表
GET    /users/123      // 获取特定用户
POST   /users          // 创建用户
PUT    /users/123      // 更新用户
DELETE /users/123      // 删除用户

// ❌ 错误：动作导向
GET    /getUsers
POST   /createUser
POST   /updateUser
POST   /deleteUser

// 资源的层级关系
GET /users/123/posts           // 用户的文章
GET /users/123/posts/456       // 用户的特定文章
GET /posts/456/comments        // 文章的评论`,
    },
    {
      title: '2. 表现层（Representation）',
      category: '核心概念',
      what: '资源的数据格式，如 JSON、XML、HTML',
      why: '同一资源可有不同表现形式，客户端与服务端可协商格式',
      how: 'Accept: application/json',
      sugar: '通过 HTTP 头进行内容协商',
      scenarios: ['API 响应格式', '多端适配', '版本兼容'],
      relations: ['与 HTTP 头配合', '支持内容协商'],
      code: `// 请求头指定期望的格式
GET /users/1
Accept: application/json

// 服务端返回 JSON
{
  "id": 1,
  "name": "Alice",
  "email": "alice@example.com"
}

// 同一资源，不同表现形式
GET /users/1
Accept: application/xml

<?xml version="1.0"?>
<user>
  <id>1</id>
  <name>Alice</name>
  <email>alice@example.com</email>
</user>

// Content-Type 指定发送的格式
POST /users
Content-Type: application/json

{
  "name": "Bob",
  "email": "bob@example.com"
}`,
    },
    {
      title: '3. 状态转移（State Transfer）',
      category: '核心概念',
      what: '客户端通过 HTTP 方法改变资源状态，服务器无状态',
      why: '服务器不保存客户端上下文，便于扩展与缓存',
      how: '每个请求携带所有必要信息（如 Token）',
      sugar: '无状态通信',
      scenarios: ['移动端应用', '小程序', '前后端分离', '微服务'],
      relations: ['与 JWT 认证配合', '支持水平扩展'],
      code: `// 无状态请求示例
// 每个请求都携带完整的认证信息
GET /users/123
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

// 服务器不需要记住客户端状态
// 每次请求都是独立的

// ❌ 有状态（不推荐）
// 服务器需要维护 session
GET /users/123
Cookie: sessionId=abc123

// ✅ 无状态（推荐）
// 客户端携带所有必要信息
GET /users/123
Authorization: Bearer <token>

// 状态转移示例
// 1. 获取资源当前状态
GET /orders/123
{ "status": "pending" }

// 2. 改变资源状态
PATCH /orders/123
{ "status": "paid" }

// 3. 确认状态已改变
GET /orders/123
{ "status": "paid" }`,
    },
    {
      title: '4. HTTP 方法（操作语义）',
      category: '核心概念',
      what: 'RESTful 使用标准 HTTP 方法表达操作动作',
      why: '语义清晰，符合 HTTP 协议规范',
      how: 'GET 获取、POST 创建、PUT 更新、DELETE 删除',
      sugar: 'PATCH 用于部分更新，PUT 用于全量替换',
      scenarios: ['CRUD 操作', 'API 设计', '资源管理'],
      relations: ['与资源 URI 配合', '决定操作语义'],
      code: `// GET - 获取资源（安全、幂等、可缓存）
GET /users              // 获取用户列表
GET /users/123          // 获取特定用户

// POST - 创建资源（非幂等）
POST /users
{
  "name": "Alice",
  "email": "alice@example.com"
}
// 返回 201 Created + Location: /users/124

// PUT - 完整更新资源（幂等）
PUT /users/123
{
  "name": "Alice Updated",
  "email": "alice@example.com",
  "age": 25
}
// 必须提供完整的资源数据

// PATCH - 部分更新资源
PATCH /users/123
{
  "name": "Alice Updated"
}
// 只更新指定字段

// DELETE - 删除资源（幂等）
DELETE /users/123
// 返回 204 No Content

// HEAD - 获取资源元信息（不返回 body）
HEAD /users/123

// OPTIONS - 获取资源支持的方法
OPTIONS /users
// 返回 Allow: GET, POST, PUT, DELETE`,
    },
    {
      title: '5. URI 设计规范',
      category: 'API 设计',
      what: 'RESTful API 的 URL 设计规范和最佳实践',
      why: '统一的命名规范提高 API 可读性和可维护性',
      how: '使用名词、复数形式、层级结构',
      sugar: '约定优于配置',
      scenarios: ['API 设计', '接口规范', '团队协作'],
      relations: ['与资源概念配合', '影响 API 可用性'],
      code: `// ✅ 正确的 URI 设计
GET    /users                    // 资源用名词
GET    /users/123                // 使用 ID 标识
GET    /users/123/posts          // 层级关系
GET    /users?role=admin         // 查询参数过滤
GET    /users?page=2&limit=10    // 分页参数

// ❌ 错误的 URI 设计
GET    /getUsers                 // 不要用动词
GET    /user/123                 // 使用复数
GET    /users/getPosts           // 不要混用动词
GET    /users_posts              // 不要用下划线

// 复杂查询示例
GET /users?role=admin&status=active&sort=created_at&order=desc

// 搜索
GET /users/search?q=alice

// 版本控制
GET /v1/users
GET /v2/users

// 或使用 Header
GET /users
Accept: application/vnd.api.v2+json`,
    },
    {
      title: '6. HTTP 状态码',
      category: 'API 设计',
      what: '使用标准 HTTP 状态码表达请求结果',
      why: '提供统一的错误处理机制，客户端可根据状态码做出响应',
      how: '2xx 成功、4xx 客户端错误、5xx 服务器错误',
      sugar: '用状态码替代响应体中的 success 字段',
      scenarios: ['错误处理', '结果反馈', '客户端逻辑'],
      relations: ['与 HTTP 协议配合', '影响错误处理'],
      code: `// 2xx 成功
200 OK                  // GET 请求成功
201 Created             // POST 创建成功
202 Accepted            // 请求已接受，但未完成
204 No Content          // DELETE 成功，无返回内容

// 3xx 重定向
301 Moved Permanently   // 资源永久移动
302 Found               // 资源临时移动
304 Not Modified        // 资源未修改（缓存）

// 4xx 客户端错误
400 Bad Request         // 请求参数错误
401 Unauthorized        // 未认证
403 Forbidden           // 无权限
404 Not Found           // 资源不存在
405 Method Not Allowed  // 方法不允许
409 Conflict            // 资源冲突
422 Unprocessable Entity // 验证失败
429 Too Many Requests   // 请求过多

// 5xx 服务器错误
500 Internal Server Error // 服务器内部错误
502 Bad Gateway          // 网关错误
503 Service Unavailable  // 服务不可用
504 Gateway Timeout      // 网关超时

// ❌ 不推荐
{
  "success": false,
  "code": 1001,
  "message": "用户不存在"
}

// ✅ 推荐
HTTP 404 Not Found
{
  "error": "User not found",
  "message": "用户不存在"
}`,
    },
    {
      title: '7. 超媒体（HATEOAS）',
      category: '高级特性',
      what: '响应中包含可操作链接，客户端可根据链接发现下一步操作',
      why: '让 API 自描述，客户端无需硬编码 URL',
      how: '在响应中添加 _links 字段',
      sugar: 'Hypermedia as the Engine of Application State',
      scenarios: ['复杂业务流程', '工作流系统', '自描述 API'],
      relations: ['RESTful 的最高成熟度', '提高 API 可发现性'],
      code: `// 基础响应
GET /users/1
{
  "id": 1,
  "name": "Alice",
  "email": "alice@example.com"
}

// HATEOAS 响应
GET /users/1
{
  "id": 1,
  "name": "Alice",
  "email": "alice@example.com",
  "_links": {
    "self": {
      "href": "/users/1"
    },
    "posts": {
      "href": "/users/1/posts"
    },
    "friends": {
      "href": "/users/1/friends"
    },
    "edit": {
      "href": "/users/1",
      "method": "PUT"
    },
    "delete": {
      "href": "/users/1",
      "method": "DELETE"
    }
  }
}

// 订单状态流转示例
GET /orders/123
{
  "id": 123,
  "status": "pending",
  "amount": 100,
  "_links": {
    "self": { "href": "/orders/123" },
    "pay": { "href": "/orders/123/pay", "method": "POST" },
    "cancel": { "href": "/orders/123/cancel", "method": "POST" }
  }
}

// 支付后
GET /orders/123
{
  "id": 123,
  "status": "paid",
  "amount": 100,
  "_links": {
    "self": { "href": "/orders/123" },
    "refund": { "href": "/orders/123/refund", "method": "POST" }
  }
}`,
    },
    {
      title: '8. 缓存控制',
      category: '高级特性',
      what: '通过 HTTP 头控制资源缓存策略',
      why: '提升性能、减轻服务器负担',
      how: 'Cache-Control、ETag、Last-Modified',
      sugar: 'HTTP 原生缓存机制',
      scenarios: ['静态资源', '频繁访问的数据', '性能优化'],
      relations: ['与 HTTP 协议配合', '支持条件请求'],
      code: `// Cache-Control 缓存控制
GET /users/123
Cache-Control: max-age=3600, public

// 响应
HTTP/1.1 200 OK
Cache-Control: max-age=3600
{
  "id": 123,
  "name": "Alice"
}

// ETag 强验证
GET /users/123
HTTP/1.1 200 OK
ETag: "user-123-v2"
{
  "id": 123,
  "name": "Alice"
}

// 条件请求
GET /users/123
If-None-Match: "user-123-v2"

// 如果未修改
HTTP/1.1 304 Not Modified

// Last-Modified 弱验证
GET /users/123
HTTP/1.1 200 OK
Last-Modified: Wed, 21 Oct 2024 07:28:00 GMT

// 条件请求
GET /users/123
If-Modified-Since: Wed, 21 Oct 2024 07:28:00 GMT

// 缓存策略
Cache-Control: no-cache          // 每次都验证
Cache-Control: no-store          // 不缓存
Cache-Control: private           // 仅客户端缓存
Cache-Control: public            // 可被代理缓存
Cache-Control: max-age=3600      // 缓存 1 小时`,
    },
    {
      title: '9. 认证与授权',
      category: '安全',
      what: '身份验证（Authentication）和权限验证（Authorization）',
      why: 'REST API 多用于跨平台通信，安全尤为关键',
      how: 'JWT、OAuth 2.0、API Key',
      sugar: '无状态认证',
      scenarios: ['用户登录', 'API 鉴权', '第三方授权'],
      relations: ['与无状态原则配合', '支持跨域认证'],
      code: `// JWT 认证
POST /auth/login
{
  "username": "alice",
  "password": "password123"
}

// 响应
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 3600
}

// 使用 Token
GET /users/123
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

// API Key 认证
GET /users/123
X-API-Key: your-api-key-here

// OAuth 2.0 授权码流程
// 1. 获取授权码
GET /oauth/authorize?client_id=xxx&redirect_uri=xxx&response_type=code

// 2. 用授权码换取 Token
POST /oauth/token
{
  "grant_type": "authorization_code",
  "code": "auth_code",
  "client_id": "xxx",
  "client_secret": "xxx"
}

// 3. 使用 Access Token
GET /api/users/me
Authorization: Bearer access_token

// 权限验证
GET /admin/users
Authorization: Bearer token
// 返回 403 Forbidden（无权限）`,
    },
    {
      title: '10. 分页与过滤',
      category: '实战技巧',
      what: '处理大量数据的查询、过滤、排序、分页',
      why: '优化性能，提升用户体验',
      how: '使用查询参数',
      sugar: '约定式参数命名',
      scenarios: ['列表查询', '数据筛选', '搜索功能'],
      relations: ['与 URI 设计配合', '影响性能'],
      code: `// 分页
GET /users?page=2&limit=10

// 响应
{
  "data": [...],
  "pagination": {
    "page": 2,
    "limit": 10,
    "total": 100,
    "totalPages": 10,
    "hasNext": true,
    "hasPrev": true
  }
}

// 游标分页（更高效）
GET /users?cursor=eyJpZCI6MTIzfQ&limit=10

{
  "data": [...],
  "nextCursor": "eyJpZCI6MTMzfQ",
  "hasMore": true
}

// 过滤
GET /users?role=admin&status=active

// 排序
GET /users?sort=created_at&order=desc
GET /users?sort=-created_at  // 降序简写

// 字段选择
GET /users?fields=id,name,email

// 搜索
GET /users?q=alice

// 组合查询
GET /users?role=admin&status=active&sort=-created_at&page=1&limit=20

// 范围查询
GET /orders?created_at_gte=2024-01-01&created_at_lte=2024-12-31
GET /products?price_min=100&price_max=500`,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <Link href="/study/learn-coding/frontend/mid/api" passHref>
            <Button variant="outline" size="sm" className="hover:bg-white/80 shadow-sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              返回网络与 API
            </Button>
          </Link>
        </div>

        {/* 页面标题 */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl shadow-lg mb-4">
            <Globe className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-gray-800">
            RESTful API
          </h1>
          <p className="text-gray-600">
            Web 世界的通用语言 —— 让 API 具备语义一致、架构清晰、交互自描述的特质
          </p>
        </div>

        {/* 核心理念 */}
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">核心理念</h2>
          <div className="space-y-3">
            <div className="p-4 bg-white rounded-lg">
              <p className="text-sm text-gray-700">
                <span className="font-semibold text-blue-700">定义：</span>
                REST（Representational State Transfer）是一种 Web API 的架构风格，不是协议、不是标准，而是一套设计理念与约束条件
              </p>
            </div>
            <div className="p-4 bg-white rounded-lg">
              <p className="text-sm text-gray-700">
                <span className="font-semibold text-green-700">目标：</span>
                让网络接口简洁、可扩展、可缓存、易维护
              </p>
            </div>
            <div className="p-4 bg-white rounded-lg">
              <p className="text-sm text-gray-700">
                <span className="font-semibold text-purple-700">特质：</span>
                语义一致、架构清晰、交互自描述、系统易扩展
              </p>
            </div>
          </div>
        </Card>

        {/* 内容区域 */}
        <div className="space-y-6 mb-8">
          {sections.map((section, idx) => (
            <Card key={idx} id={`section-${idx + 1}`} className="p-6 bg-white/80 backdrop-blur-sm scroll-mt-20">
              {/* 标题和分类 */}
              <div className="flex items-start gap-3 mb-4">
                <CheckCircle2 className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-2xl font-bold text-gray-800">{section.title}</h2>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                      {section.category}
                    </span>
                  </div>
                </div>
              </div>

              {/* 核心信息卡片 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500">
                  <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <span className="text-blue-600">💡</span>
                    是什么
                  </h3>
                  <p className="text-sm text-gray-700">{section.what}</p>
                </div>

                <div className="p-4 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500">
                  <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <span className="text-green-600">🎯</span>
                    为什么
                  </h3>
                  <p className="text-sm text-gray-700">{section.why}</p>
                </div>

                <div className="p-4 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 border-l-4 border-purple-500">
                  <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <span className="text-purple-600">⚡</span>
                    怎么用
                  </h3>
                  <code className="text-sm text-gray-700 font-mono">{section.how}</code>
                </div>

                <div className="p-4 rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-500">
                  <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <span className="text-yellow-600">🍬</span>
                    语法糖
                  </h3>
                  <p className="text-sm text-gray-700">{section.sugar}</p>
                </div>
              </div>

              {/* 使用场景 */}
              <div className="p-4 rounded-lg bg-blue-50 border border-blue-200 mb-4">
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  使用场景
                </h3>
                <ul className="space-y-1">
                  {section.scenarios.map((scenario, i) => (
                    <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="text-blue-600 mt-1">✓</span>
                      <span>{scenario}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 关联关系 */}
              <div className="p-4 rounded-lg bg-green-50 border border-green-200 mb-4">
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  关联关系
                </h3>
                <ul className="space-y-1">
                  {section.relations.map((relation, i) => (
                    <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="text-green-600 mt-1">→</span>
                      <span>{relation}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 代码示例 */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">代码示例</h3>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{section.code}</code>
                </pre>
              </div>
            </Card>
          ))}
        </div>

        {/* HTTP 方法对比表 */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">HTTP 方法对比</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-300">
                  <th className="text-left p-3 bg-gray-50">方法</th>
                  <th className="text-left p-3 bg-gray-50">含义</th>
                  <th className="text-left p-3 bg-gray-50">示例</th>
                  <th className="text-left p-3 bg-gray-50">特点</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="p-3 font-medium">GET</td>
                  <td className="p-3 text-gray-600">获取资源</td>
                  <td className="p-3"><code className="text-xs">GET /users</code></td>
                  <td className="p-3 text-gray-600">安全、幂等、可缓存</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-3 font-medium">POST</td>
                  <td className="p-3 text-gray-600">创建资源</td>
                  <td className="p-3"><code className="text-xs">POST /users</code></td>
                  <td className="p-3 text-gray-600">非幂等，返回新资源</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-3 font-medium">PUT</td>
                  <td className="p-3 text-gray-600">更新资源（整体）</td>
                  <td className="p-3"><code className="text-xs">PUT /users/1</code></td>
                  <td className="p-3 text-gray-600">幂等，全量替换</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-3 font-medium">PATCH</td>
                  <td className="p-3 text-gray-600">更新资源（部分）</td>
                  <td className="p-3"><code className="text-xs">PATCH /users/1</code></td>
                  <td className="p-3 text-gray-600">更灵活，部分更新</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-3 font-medium">DELETE</td>
                  <td className="p-3 text-gray-600">删除资源</td>
                  <td className="p-3"><code className="text-xs">DELETE /users/1</code></td>
                  <td className="p-3 text-gray-600">幂等</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>

        {/* REST vs GraphQL vs gRPC */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">REST vs GraphQL vs gRPC</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-300">
                  <th className="text-left p-3 bg-gray-50">特性</th>
                  <th className="text-left p-3 bg-blue-50">REST</th>
                  <th className="text-left p-3 bg-purple-50">GraphQL</th>
                  <th className="text-left p-3 bg-green-50">gRPC</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="p-3 font-medium">数据结构</td>
                  <td className="p-3 text-gray-600">固定（服务端定义）</td>
                  <td className="p-3 text-gray-600">客户端自定义</td>
                  <td className="p-3 text-gray-600">Proto 定义</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-3 font-medium">传输协议</td>
                  <td className="p-3 text-gray-600">HTTP</td>
                  <td className="p-3 text-gray-600">HTTP</td>
                  <td className="p-3 text-gray-600">HTTP/2</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-3 font-medium">优势</td>
                  <td className="p-3 text-gray-600">简单、直观</td>
                  <td className="p-3 text-gray-600">请求灵活、减少冗余</td>
                  <td className="p-3 text-gray-600">高性能、强类型</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-3 font-medium">劣势</td>
                  <td className="p-3 text-gray-600">可能过多请求</td>
                  <td className="p-3 text-gray-600">复杂性较高</td>
                  <td className="p-3 text-gray-600">不适合浏览器</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-3 font-medium">是否无状态</td>
                  <td className="p-3 text-green-600">✅</td>
                  <td className="p-3 text-green-600">✅</td>
                  <td className="p-3 text-green-600">✅</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>

        {/* 架构体系图 */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">RESTful API 架构体系</h2>
          <div className="p-4 bg-gray-50 rounded-lg">
            <pre className="text-sm text-gray-700 overflow-x-auto whitespace-pre">
{`┌────────────────────────────────────┐
│      RESTful API 架构体系          │
├────────────────────────────────────┤
│ 资源（Resource） ←→ URI 设计        │
│  ↓                                  │
│ 表现层（Representation） ←→ JSON/XML │
│  ↓                                  │
│ 状态转移（State Transfer） ←→ HTTP方法 │
│  ↓                                  │
│ 状态码 ←→ 请求结果语义              │
│  ↓                                  │
│ 无状态通信 ←→ JWT / Token           │
│  ↓                                  │
│ 缓存机制 ←→ HTTP 头（ETag、Cache）  │
│  ↓                                  │
│ 安全机制 ←→ OAuth2 / HTTPS          │
└────────────────────────────────────┘

核心逻辑线：
客户端 → 发出请求（HTTP 方法）→ 资源 URI 
       → 返回表现层（JSON）→ 根据状态码决定下一步`}
            </pre>
          </div>
        </Card>

        {/* 学习资源 */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm mb-8">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-800">推荐学习资源</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {resources.map((resource, idx) => (
              <a
                key={idx}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-4 rounded-lg bg-gradient-to-br from-white to-gray-50 border border-gray-200 hover:border-primary hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-800 group-hover:text-primary transition-colors">
                    {resource.name}
                  </h3>
                  <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
                <p className="text-sm text-gray-600">{resource.description}</p>
              </a>
            ))}
          </div>
        </Card>

        {/* 最佳实践 */}
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">RESTful API 最佳实践</h2>
          <div className="space-y-3">
            {[
              '✅ 使用名词表示资源，避免动词',
              '✅ 使用复数形式命名资源（/users 而不是 /user）',
              '✅ 使用标准 HTTP 方法表达操作',
              '✅ 返回标准 HTTP 状态码',
              '✅ 使用 JSON 作为默认数据格式',
              '✅ 提供分页、过滤、排序功能',
              '✅ 使用 HTTPS 保证安全',
              '✅ 实现 API 版本控制',
              '✅ 提供清晰的错误信息',
              '✅ 使用 JWT 或 OAuth 2.0 进行认证',
            ].map((practice, idx) => (
              <div key={idx} className="p-3 bg-white rounded-lg">
                <p className="text-sm text-gray-700">{practice}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* 底部提示 */}
        <div className="text-center">
          <Card className="inline-block p-4 bg-gradient-to-r from-white/80 to-blue-50/80 backdrop-blur-sm border border-blue-200/50">
            <p className="text-sm text-gray-700 mb-2">
              💡 <span className="font-semibold">RESTful 是 Web 世界的通用语言</span>
            </p>
            <p className="text-sm text-gray-600">
              它不是语法，而是一种「理念 + 约定式语法糖」的集合
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
