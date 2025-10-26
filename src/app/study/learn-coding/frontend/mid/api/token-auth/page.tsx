'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Shield, CheckCircle2, TrendingUp, Sparkles, BookOpen, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function TokenAuthPage() {
  const resources = [
    { name: 'JWT.io', url: 'https://jwt.io/', description: 'JWT 调试和解码工具' },
    { name: 'OAuth 2.0', url: 'https://oauth.net/2/', description: 'OAuth 2.0 官方文档' },
    { name: 'OpenID Connect', url: 'https://openid.net/connect/', description: 'OIDC 身份认证协议' },
    { name: 'Auth0 文档', url: 'https://auth0.com/docs', description: '完整的认证解决方案文档' },
    { name: 'Passport.js', url: 'http://www.passportjs.org/', description: 'Node.js 认证中间件' },
    { name: 'OWASP 认证指南', url: 'https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html', description: '认证安全最佳实践' },
  ];

  const sections = [
    {
      title: '1. Token 认证基础',
      category: '核心概念',
      what: '用令牌（Token）代替用户会话（Session）来验证身份的机制',
      why: '服务器不保存用户状态，而是颁发签名令牌，由客户端保存并携带',
      how: 'Authorization: Bearer <token>',
      sugar: '无状态认证',
      scenarios: ['前后端分离', '移动端应用', '微服务', '第三方授权'],
      relations: ['是 Session 的替代方案', '与 JWT 配合使用'],
      code: `// Token 认证流程
// 1. 用户登录
POST /api/auth/login
{
  "username": "alice",
  "password": "password123"
}

// 2. 服务器验证并返回 Token
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 3600
}

// 3. 客户端保存 Token
localStorage.setItem('accessToken', token);

// 4. 后续请求携带 Token
GET /api/user/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

// 5. 服务器验证 Token
// - 验证签名
// - 检查过期时间
// - 提取用户信息
// - 返回受保护资源`,
    },
    {
      title: '2. JWT（JSON Web Token）',
      category: '核心概念',
      what: '最常见的 Token 格式，由 Header、Payload、Signature 三部分组成',
      why: '轻量、可验证签名、自包含用户信息',
      how: 'Header.Payload.Signature',
      sugar: '自包含的身份信息',
      scenarios: ['API 认证', '单点登录', '信息交换'],
      relations: ['是 Token 的实现格式', '与 OAuth 2.0 配合'],
      code: `// JWT 结构
// Header.Payload.Signature
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJ1c2VySWQiOjEyMywiZXhwIjoxNzAwMDAwMDB9.
j6s7f7s8a8F-safF0f9s8as7D...

// Header（头部）- 算法和类型
{
  "alg": "HS256",  // 签名算法
  "typ": "JWT"     // 类型
}

// Payload（载荷）- 用户数据
{
  "userId": 123,
  "username": "alice",
  "role": "admin",
  "iat": 1700000000,  // 签发时间
  "exp": 1700003600   // 过期时间
}

// Signature（签名）- 防篡改
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  secret
)

// 标准声明（Claims）
{
  "iss": "issuer",        // 签发者
  "sub": "subject",       // 主题
  "aud": "audience",      // 受众
  "exp": 1700003600,      // 过期时间
  "nbf": 1700000000,      // 生效时间
  "iat": 1700000000,      // 签发时间
  "jti": "unique-id"      // JWT ID
}`,
    },
    {
      title: '3. Access Token 与 Refresh Token',
      category: '核心概念',
      what: 'Access Token 用于访问资源（短期），Refresh Token 用于刷新（长期）',
      why: '平衡安全性和用户体验，避免频繁登录',
      how: '双令牌机制',
      sugar: '自动刷新机制',
      scenarios: ['长期登录', '安全认证', '无感刷新'],
      relations: ['Access Token 短效', 'Refresh Token 长效'],
      code: `// 登录时获取两个 Token
POST /api/auth/login
{
  "username": "alice",
  "password": "password123"
}

// 响应
{
  "accessToken": "eyJ...",   // 短期（15分钟 - 1小时）
  "refreshToken": "eyJ...",  // 长期（7天 - 30天）
  "expiresIn": 3600
}

// 存储
localStorage.setItem('accessToken', accessToken);
localStorage.setItem('refreshToken', refreshToken);

// Access Token 过期时刷新
POST /api/auth/refresh
Authorization: Bearer <refreshToken>

// 响应新的 Access Token
{
  "accessToken": "eyJ...",
  "expiresIn": 3600
}

// 自动刷新示例
async function fetchWithAuth(url) {
  let token = localStorage.getItem('accessToken');
  
  let response = await fetch(url, {
    headers: { 'Authorization': \`Bearer \${token}\` }
  });
  
  // Token 过期，尝试刷新
  if (response.status === 401) {
    const newToken = await refreshAccessToken();
    response = await fetch(url, {
      headers: { 'Authorization': \`Bearer \${newToken}\` }
    });
  }
  
  return response.json();
}`,
    },
    {
      title: '4. Token 存储方案',
      category: '实战应用',
      what: 'Token 可以存储在 localStorage、sessionStorage、Cookie 或内存中',
      why: '不同存储方式有不同的安全性和便利性',
      how: 'localStorage.setItem() 或 httpOnly Cookie',
      sugar: '根据场景选择存储方式',
      scenarios: ['Web 应用', '移动应用', '安全要求高的场景'],
      relations: ['与 XSS/CSRF 防护相关', '影响安全性'],
      code: `// 1. localStorage（常用但有 XSS 风险）
localStorage.setItem('token', token);
const token = localStorage.getItem('token');
localStorage.removeItem('token');

// 优点：简单易用，容量大（5-10MB）
// 缺点：容易受 XSS 攻击

// 2. sessionStorage（标签页关闭后清除）
sessionStorage.setItem('token', token);

// 优点：标签页关闭后自动清除
// 缺点：不能跨标签页共享

// 3. httpOnly Cookie（最安全）
// 服务端设置
res.cookie('token', token, {
  httpOnly: true,      // 防止 JavaScript 访问
  secure: true,        // 仅 HTTPS 传输
  sameSite: 'strict',  // 防止 CSRF
  maxAge: 3600000      // 1小时
});

// 优点：防止 XSS，自动携带
// 缺点：需要后端配合，容量小（4KB）

// 4. 内存存储（最安全但刷新丢失）
let token = null;

function setToken(newToken) {
  token = newToken;
}

function getToken() {
  return token;
}

// 优点：最安全，刷新页面自动清除
// 缺点：用户体验差，需要重新登录

// 推荐方案：httpOnly Cookie + CSRF Token
// 或 localStorage + 短期 Token + 刷新机制`,
    },
    {
      title: '5. Token 验证中间件',
      category: '服务端实现',
      what: '服务端验证 Token 的中间件函数',
      why: '统一处理认证逻辑，保护受保护的路由',
      how: 'jwt.verify(token, secret)',
      sugar: '中间件模式',
      scenarios: ['API 保护', '权限验证', '用户识别'],
      relations: ['与路由配合', '支持权限控制'],
      code: `// Node.js + Express + jsonwebtoken
import jwt from 'jsonwebtoken';

// 认证中间件
function authenticateToken(req, res, next) {
  // 从 Header 获取 Token
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  // 验证 Token
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    
    // 将用户信息附加到请求对象
    req.user = user;
    next();
  });
}

// 使用中间件保护路由
app.get('/api/profile', authenticateToken, (req, res) => {
  res.json({
    userId: req.user.userId,
    username: req.user.username
  });
});

// 权限验证中间件
function requireRole(role) {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
}

// 使用
app.delete('/api/users/:id', 
  authenticateToken, 
  requireRole('admin'), 
  (req, res) => {
    // 只有 admin 可以删除用户
  }
);`,
    },
    {
      title: '6. 前端 Token 自动注入',
      category: '客户端实现',
      what: '使用拦截器自动在请求头中添加 Token',
      why: '避免每次请求都手动添加 Token',
      how: 'axios.interceptors.request.use()',
      sugar: '拦截器模式',
      scenarios: ['前端应用', 'API 调用', '统一认证'],
      relations: ['与 axios/fetch 配合', '支持自动刷新'],
      code: `// axios 请求拦截器
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

// 请求拦截器 - 自动添加 Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = \`Bearer \${token}\`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器 - 自动刷新 Token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Token 过期，尝试刷新
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post('/api/auth/refresh', {
          refreshToken
        });
        
        const { accessToken } = response.data;
        localStorage.setItem('accessToken', accessToken);
        
        // 重试原请求
        originalRequest.headers.Authorization = \`Bearer \${accessToken}\`;
        return api(originalRequest);
      } catch (err) {
        // 刷新失败，跳转登录
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(err);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;`,
    },
    {
      title: '7. OAuth 2.0 授权流程',
      category: '高级特性',
      what: 'OAuth 2.0 是一个授权框架，定义了获取和使用 Token 的标准流程',
      why: '支持第三方授权登录，如 GitHub、Google、微信',
      how: '授权码流程（Authorization Code Flow）',
      sugar: '标准化的授权协议',
      scenarios: ['第三方登录', '开放平台', 'API 授权'],
      relations: ['是 Token 的授权框架', '与 OpenID Connect 配合'],
      code: `// OAuth 2.0 授权码流程
// 1. 用户点击"使用 GitHub 登录"
// 跳转到授权页面
window.location.href = 
  'https://github.com/login/oauth/authorize?' +
  'client_id=YOUR_CLIENT_ID&' +
  'redirect_uri=http://localhost:3000/callback&' +
  'scope=user:email&' +
  'state=random_string';

// 2. 用户授权后，GitHub 重定向回你的应用
// http://localhost:3000/callback?code=AUTH_CODE&state=random_string

// 3. 用授权码换取 Access Token
POST https://github.com/login/oauth/access_token
{
  "client_id": "YOUR_CLIENT_ID",
  "client_secret": "YOUR_CLIENT_SECRET",
  "code": "AUTH_CODE",
  "redirect_uri": "http://localhost:3000/callback"
}

// 响应
{
  "access_token": "gho_xxxxxxxxxxxx",
  "token_type": "bearer",
  "scope": "user:email"
}

// 4. 使用 Access Token 访问 API
GET https://api.github.com/user
Authorization: Bearer gho_xxxxxxxxxxxx

// OAuth 2.0 四种授权模式
// 1. 授权码模式（Authorization Code）- 最安全，适合 Web 应用
// 2. 隐式模式（Implicit）- 已废弃，不推荐
// 3. 密码模式（Password）- 适合可信应用
// 4. 客户端模式（Client Credentials）- 适合服务间调用`,
    },
    {
      title: '8. Token 安全最佳实践',
      category: '安全',
      what: 'Token 的安全存储、传输和使用的最佳实践',
      why: '防止 XSS、CSRF、Token 泄露等安全问题',
      how: 'HTTPS + httpOnly Cookie + CSRF Token',
      sugar: '多层安全防护',
      scenarios: ['生产环境', '敏感数据', '金融应用'],
      relations: ['与 Web 安全配合', '需要全栈配合'],
      code: `// Token 安全最佳实践

// 1. 使用 HTTPS
// 确保 Token 在传输过程中加密

// 2. Token 存储
// ✅ 推荐：httpOnly Cookie
res.cookie('token', token, {
  httpOnly: true,      // 防止 JavaScript 访问
  secure: true,        // 仅 HTTPS
  sameSite: 'strict',  // 防止 CSRF
  maxAge: 3600000
});

// ❌ 不推荐：localStorage（易受 XSS 攻击）

// 3. Token 过期时间
// Access Token: 15分钟 - 1小时
// Refresh Token: 7天 - 30天

// 4. CSRF 防护
// 使用 CSRF Token
const csrfToken = generateCSRFToken();
res.cookie('csrf-token', csrfToken);

// 验证
if (req.body.csrfToken !== req.cookies['csrf-token']) {
  return res.status(403).json({ error: 'CSRF token mismatch' });
}

// 5. Token 撤销
// 维护黑名单或使用短期 Token
const blacklist = new Set();

function revokeToken(token) {
  blacklist.add(token);
}

function isTokenRevoked(token) {
  return blacklist.has(token);
}

// 6. 敏感操作二次验证
// 删除账户、修改密码等操作要求重新输入密码

// 7. 监控异常登录
// 记录登录 IP、设备、时间
// 异常登录时发送通知

// 8. 定期更换密钥
// 后端定期更换 JWT 签名密钥

// 9. 限制 Token 使用范围
// 使用 scope 限制权限
{
  "userId": 123,
  "scope": ["read:profile", "write:posts"]
}

// 10. 防止暴力破解
// 登录失败次数限制
// 使用验证码`,
    },
    {
      title: '9. 单点登录（SSO）',
      category: '高级特性',
      what: '一次登录，多个应用共享认证状态',
      why: '提升用户体验，统一认证管理',
      how: '中央认证服务 + Token 共享',
      sugar: '统一认证中心',
      scenarios: ['企业应用', '多系统集成', '微服务'],
      relations: ['基于 OAuth 2.0/OIDC', '需要认证中心'],
      code: `// SSO 流程
// 1. 用户访问应用 A
// 应用 A 检查是否有 Token

// 2. 没有 Token，重定向到认证中心
window.location.href = 
  'https://sso.example.com/login?' +
  'redirect_uri=https://app-a.example.com/callback';

// 3. 用户在认证中心登录
// 认证中心验证身份并生成 Token

// 4. 重定向回应用 A，携带 Token
// https://app-a.example.com/callback?token=xxx

// 5. 应用 A 保存 Token

// 6. 用户访问应用 B
// 应用 B 检查是否有 Token

// 7. 重定向到认证中心
// 认证中心发现用户已登录，直接返回 Token

// 8. 应用 B 获得 Token，用户无需再次登录

// 实现示例（简化版）
// 认证中心
app.post('/sso/login', (req, res) => {
  const { username, password } = req.body;
  
  // 验证用户
  const user = validateUser(username, password);
  
  // 生成 Token
  const token = jwt.sign(user, SECRET);
  
  // 设置 Cookie（跨域共享）
  res.cookie('sso-token', token, {
    domain: '.example.com',  // 所有子域名共享
    httpOnly: true,
    secure: true
  });
  
  res.json({ token });
});

// 应用 A/B 验证
app.get('/verify', (req, res) => {
  const token = req.cookies['sso-token'];
  
  if (!token) {
    return res.redirect('https://sso.example.com/login');
  }
  
  jwt.verify(token, SECRET, (err, user) => {
    if (err) {
      return res.redirect('https://sso.example.com/login');
    }
    res.json({ user });
  });
});`,
    },
    {
      title: '10. OpenID Connect（OIDC）',
      category: '高级特性',
      what: 'OAuth 2.0 的身份层扩展，提供用户身份信息',
      why: 'OAuth 2.0 只提供授权，OIDC 提供认证和用户信息',
      how: 'ID Token + UserInfo Endpoint',
      sugar: '标准化的身份认证',
      scenarios: ['用户登录', '身份验证', '用户信息获取'],
      relations: ['基于 OAuth 2.0', '提供 ID Token'],
      code: `// OpenID Connect 流程
// 1. 授权请求（增加 openid scope）
window.location.href = 
  'https://auth.example.com/authorize?' +
  'client_id=YOUR_CLIENT_ID&' +
  'redirect_uri=http://localhost:3000/callback&' +
  'response_type=code&' +
  'scope=openid profile email&' +  // 包含 openid
  'state=random_string';

// 2. 用授权码换取 Token
POST https://auth.example.com/token
{
  "grant_type": "authorization_code",
  "code": "AUTH_CODE",
  "redirect_uri": "http://localhost:3000/callback",
  "client_id": "YOUR_CLIENT_ID",
  "client_secret": "YOUR_CLIENT_SECRET"
}

// 响应（包含 ID Token）
{
  "access_token": "xxx",
  "token_type": "Bearer",
  "expires_in": 3600,
  "id_token": "eyJ...",  // ID Token（JWT 格式）
  "refresh_token": "yyy"
}

// 3. ID Token 包含用户信息
// 解码 ID Token
{
  "iss": "https://auth.example.com",
  "sub": "user-123",
  "aud": "YOUR_CLIENT_ID",
  "exp": 1700003600,
  "iat": 1700000000,
  "name": "Alice",
  "email": "alice@example.com",
  "picture": "https://example.com/avatar.jpg"
}

// 4. 获取更多用户信息
GET https://auth.example.com/userinfo
Authorization: Bearer <access_token>

// 响应
{
  "sub": "user-123",
  "name": "Alice",
  "email": "alice@example.com",
  "email_verified": true,
  "picture": "https://example.com/avatar.jpg"
}

// OIDC 标准声明
// - sub: 用户唯一标识
// - name: 用户姓名
// - email: 邮箱
// - picture: 头像
// - profile: 个人资料页面`,
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
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl shadow-lg mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-gray-800">
            Token 认证
          </h1>
          <p className="text-gray-600">
            无状态认证机制 —— 服务器不保存状态，由客户端携带签名令牌
          </p>
        </div>

        {/* 核心理念 */}
        <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">核心理念</h2>
          <div className="space-y-3">
            <div className="p-4 bg-white rounded-lg">
              <p className="text-sm text-gray-700">
                <span className="font-semibold text-green-700">定义：</span>
                Token 认证是用令牌代替用户会话来验证身份的机制
              </p>
            </div>
            <div className="p-4 bg-white rounded-lg">
              <p className="text-sm text-gray-700">
                <span className="font-semibold text-emerald-700">核心思想：</span>
                服务器不保存用户状态，而是颁发签名令牌，由客户端保存并在每次请求中携带
              </p>
            </div>
            <div className="p-4 bg-white rounded-lg">
              <p className="text-sm text-gray-700">
                <span className="font-semibold text-blue-700">优势：</span>
                无状态（Stateless）、跨平台、跨域、安全、易扩展
              </p>
            </div>
          </div>
        </Card>

        {/* 内容区域 */}
        <div className="space-y-6 mb-8">
          {sections.map((section, idx) => (
            <Card key={idx} id={`section-${idx + 1}`} className="p-6 bg-white/80 backdrop-blur-sm scroll-mt-20">
              <div className="flex items-start gap-3 mb-4">
                <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-2xl font-bold text-gray-800">{section.title}</h2>
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                      {section.category}
                    </span>
                  </div>
                </div>
              </div>

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

              <div className="p-4 rounded-lg bg-green-50 border border-green-200 mb-4">
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-green-600" />
                  使用场景
                </h3>
                <ul className="space-y-1">
                  {section.scenarios.map((scenario, i) => (
                    <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="text-green-600 mt-1">✓</span>
                      <span>{scenario}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-lg bg-blue-50 border border-blue-200 mb-4">
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  关联关系
                </h3>
                <ul className="space-y-1">
                  {section.relations.map((relation, i) => (
                    <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="text-blue-600 mt-1">→</span>
                      <span>{relation}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-2">代码示例</h3>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{section.code}</code>
                </pre>
              </div>
            </Card>
          ))}
        </div>

        {/* Session vs Token 对比 */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Session vs Token 对比</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-300">
                  <th className="text-left p-3 bg-gray-50">特性</th>
                  <th className="text-left p-3 bg-orange-50">Session</th>
                  <th className="text-left p-3 bg-green-50">Token</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="p-3 font-medium">存储位置</td>
                  <td className="p-3 text-gray-600">服务器</td>
                  <td className="p-3 text-gray-600">客户端</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-3 font-medium">状态</td>
                  <td className="p-3 text-gray-600">有状态</td>
                  <td className="p-3 text-gray-600">无状态</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-3 font-medium">扩展性</td>
                  <td className="p-3 text-gray-600">难（需要共享 Session）</td>
                  <td className="p-3 text-gray-600">易（无需共享状态）</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-3 font-medium">跨域</td>
                  <td className="p-3 text-gray-600">困难（Cookie 同源限制）</td>
                  <td className="p-3 text-gray-600">容易（Header 传递）</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-3 font-medium">移动端</td>
                  <td className="p-3 text-gray-600">不便</td>
                  <td className="p-3 text-gray-600">友好</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-3 font-medium">性能</td>
                  <td className="p-3 text-gray-600">需要查询存储</td>
                  <td className="p-3 text-gray-600">只需验证签名</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>

        {/* Token 认证流程图 */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Token 认证流程</h2>
          <div className="p-4 bg-gray-50 rounded-lg">
            <pre className="text-sm text-gray-700 overflow-x-auto whitespace-pre">
{`[客户端] → 登录凭证（账号密码）
    ↓
[认证服务器] → 验证身份
    ↓
颁发 Token（Access + Refresh）
    ↓
客户端保存 Token（LocalStorage / Cookie / Memory）
    ↓
每次请求时附带 Header：
Authorization: Bearer <AccessToken>
    ↓
[API 服务器] 验证 Token 签名与过期时间
    ↓
通过则返回受保护资源`}
            </pre>
          </div>
        </Card>

        {/* 学习资源 */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm mb-8">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-6 h-6 text-green-600" />
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
        <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Token 认证最佳实践</h2>
          <div className="space-y-3">
            {[
              '✅ 使用 HTTPS 传输 Token',
              '✅ Token 存储优先使用 httpOnly Cookie',
              '✅ 实现 Access Token + Refresh Token 双令牌机制',
              '✅ Access Token 设置短期过期时间（15分钟 - 1小时）',
              '✅ 使用强签名算法（HS256 或 RS256）',
              '✅ 实现 Token 自动刷新机制',
              '✅ 敏感操作需要二次验证',
              '✅ 监控异常登录行为',
              '✅ 实现 Token 撤销机制',
              '✅ 定期更换签名密钥',
            ].map((practice, idx) => (
              <div key={idx} className="p-3 bg-white rounded-lg">
                <p className="text-sm text-gray-700">{practice}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* 底部提示 */}
        <div className="text-center">
          <Card className="inline-block p-4 bg-gradient-to-r from-white/80 to-green-50/80 backdrop-blur-sm border border-green-200/50">
            <p className="text-sm text-gray-700 mb-2">
              💡 <span className="font-semibold">Token 认证是前后端分离架构的核心</span>
            </p>
            <p className="text-sm text-gray-600">
              无状态、跨平台、易扩展的现代认证方案
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
