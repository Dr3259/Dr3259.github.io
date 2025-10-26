'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Shield, CheckCircle2, TrendingUp, Sparkles, BookOpen, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function SecurityPage() {
  const sections = [
    {
      title: '1. XSS（跨站脚本攻击）',
      category: '应用层安全',
      what: '攻击者向网页注入恶意 JS，使其在用户浏览器中执行，可盗取 Token / Cookie / DOM 操作',
      why: '用户输入未过滤直接渲染；DOM 动态拼接字符串；innerHTML、document.write 滥用',
      how: '输入永远不信任用户输入进行 HTML Encode；使用安全模板（Vue/React 自动转义）；启用 CSP Header 限制脚本来源；HTTP-only Cookie 防止 JS 读取',
      sugar: '内容安全策略',
      scenarios: ['用户输入评论区', '富文本编辑器', '用户上传头像（防 SVG 注入）', '表单提交'],
      relations: ['XSS ←→ CSP', 'XSS ←→ 输入校验', 'XSS ←→ Token 保护'],
      code: `// 防御 XSS 攻击
// 1. React 自动转义
function Comment({ text }) {
  return <div>{text}</div>; // 自动转义
}

// 2. 避免危险的 API
// ❌ 危险
element.innerHTML = userInput;
document.write(userInput);

// ✅ 安全
element.textContent = userInput;

// 3. DOMPurify 清理 HTML
import DOMPurify from 'dompurify';
const clean = DOMPurify.sanitize(dirtyHTML);
element.innerHTML = clean;

// 4. HTTP-only Cookie
Set-Cookie: token=abc; HttpOnly; Secure; SameSite=Strict`,
    },
    {
      title: '2. CSRF（跨站请求伪造）',
      category: '应用层安全',
      what: '攻击者诱导受害者访问恶意链接，利用浏览器自动携带 Cookie 向可信站点发起请求',
      why: '浏览器自动附带 Cookie，服务端无法区分"用户主动操作"和"第三方恶意发起"',
      how: 'CSRF Token 校验每次请求携带不可预测的 token；SameSite Cookie 限制跨站点自动携带；Referer/Origin 校验拦截非本站来源请求；使用 JWT 避免 Cookie 依赖性',
      sugar: 'SameSite Cookie',
      scenarios: ['表单提交', '支付操作', '用户设置修改', '敏感操作'],
      relations: ['CSRF ←→ Token', 'CSRF ←→ SameSite', 'CSRF ←→ 身份验证'],
      code: `// 防御 CSRF 攻击
// 1. SameSite Cookie
Set-Cookie: session=abc; SameSite=Strict; Secure; HttpOnly

// 2. CSRF Token
const csrfToken = generateRandomToken();
res.cookie('XSRF-TOKEN', csrfToken);

// 前端携带
axios.defaults.headers.common['X-CSRF-TOKEN'] = getCookie('XSRF-TOKEN');

// 3. 验证 Referer/Origin
app.use((req, res, next) => {
  const origin = req.get('origin');
  if (!isValidOrigin(origin)) {
    return res.status(403).send('Invalid origin');
  }
  next();
});`,
    },
    {
      title: '3. HTTPS + HSTS',
      category: '网络层安全',
      what: '加密通信协议，防止数据中途被窃听或篡改；HSTS 强制客户端始终使用 HTTPS',
      why: '防止中间人攻击；保证数据完整性；搜索引擎优先索引 HTTPS',
      how: '启用 HTTPS 使用免费证书（Let\'s Encrypt）；HSTS 头部强制客户端始终使用 HTTPS；禁止混合内容所有资源都使用 https://',
      sugar: 'HSTS Header',
      scenarios: ['所有生产环境网站', '敏感数据传输', 'API 接口', '用户登录'],
      relations: ['HTTPS ←→ HSTS', 'HTTPS ←→ Cookie Secure', 'HTTPS ←→ 混合内容'],
      code: `// HTTPS + HSTS 配置
// 1. HSTS Header
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload

// 2. Nginx 配置
server {
  listen 443 ssl http2;
  ssl_certificate /path/to/cert.pem;
  ssl_certificate_key /path/to/key.pem;
  
  add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
}

// 3. 自动重定向到 HTTPS
server {
  listen 80;
  return 301 https://$server_name$request_uri;
}`,
    },
    {
      title: '4. CSP（Content Security Policy）',
      category: '应用层安全',
      what: '浏览器级安全白名单机制：限制哪些资源可以加载或执行',
      why: '防止 XSS；控制外部脚本加载；阻止内联脚本执行',
      how: '配置 CSP Header 限制资源来源；使用 nonce 或 hash 允许特定内联脚本；report-uri 收集违规报告',
      sugar: 'CSP Header',
      scenarios: ['高安全等级页面', '金融后台', '管理端', '线上可视化编辑器'],
      relations: ['CSP ←→ XSS 防御', 'CSP ←→ 内联脚本', 'CSP ←→ 第三方资源'],
      code: `// CSP 配置
// 1. 基础配置
Content-Security-Policy: default-src 'self'; 
                         script-src 'self' https://cdn.jsdelivr.net;

// 2. 使用 nonce
const nonce = generateNonce();
res.setHeader('Content-Security-Policy', "script-src 'nonce-" + nonce + "'");

// 3. Next.js 配置
module.exports = {
  async headers() {
    return [{
      source: '/:path*',
      headers: [{
        key: 'Content-Security-Policy',
        value: "default-src 'self';"
      }]
    }];
  }
};`,
    },
    {
      title: '5. Cookie 安全策略',
      category: '应用层安全',
      what: '限制 Cookie 的访问、传输和使用行为',
      why: '防止 Cookie 被 JS 访问或被盗取；防止跨站请求伪造',
      how: 'HttpOnly 防止 JS 访问；Secure 仅 HTTPS 传输；SameSite 限制跨域发送；设置合理的过期时间和 Domain',
      sugar: 'Cookie 属性',
      scenarios: ['用户登录态', 'Session 管理', '身份认证', '敏感信息存储'],
      relations: ['Cookie ←→ XSS', 'Cookie ←→ CSRF', 'Cookie ←→ HTTPS'],
      code: `// Cookie 安全配置
// 1. 完整的安全 Cookie
Set-Cookie: token=abc123; 
            HttpOnly; 
            Secure; 
            SameSite=Strict; 
            Max-Age=3600;

// 2. Express 设置
res.cookie('session', sessionId, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 3600000
});`,
    },
    {
      title: '6. JWT / Token 认证安全',
      category: '身份层安全',
      what: '基于 Token 的无状态认证机制',
      why: '减少 Cookie 依赖；服务可横向扩展；RESTful / GraphQL API 常用',
      how: 'Token 加密不在本地存储明文；短生命周期 + Refresh Token；服务端校验 HS256 / RS256 签名；HTTPS 防止被中途窃听',
      sugar: 'JWT',
      scenarios: ['前后端分离', 'RESTful API', 'GraphQL', '微服务认证'],
      relations: ['JWT ←→ HTTPS', 'JWT ←→ Refresh Token', 'JWT ←→ 签名验证'],
      code: `// JWT 安全实践
// 1. 生成 JWT
const jwt = require('jsonwebtoken');
const token = jwt.sign(
  { userId: 123, role: 'admin' },
  process.env.JWT_SECRET,
  { expiresIn: '15m', algorithm: 'HS256' }
);

// 2. 验证 JWT
const decoded = jwt.verify(token, process.env.JWT_SECRET);

// 3. Refresh Token 机制
const accessToken = jwt.sign(payload, secret, { expiresIn: '15m' });
const refreshToken = jwt.sign(payload, refreshSecret, { expiresIn: '7d' });`,
    },
    {
      title: '7. CORS（跨域资源共享）',
      category: '网络层安全',
      what: '浏览器基于同源策略限制跨域请求',
      why: '防止恶意网站读取受保护资源',
      how: '配置响应头控制跨域白名单；预检请求验证；凭证模式配置',
      sugar: 'CORS Header',
      scenarios: ['前后端分离', '接口通信', '第三方 API', '微服务'],
      relations: ['CORS ←→ 同源策略', 'CORS ←→ Cookie', 'CORS ←→ 预检请求'],
      code: `// CORS 配置
// 1. 基础配置
Access-Control-Allow-Origin: https://trust.com
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Credentials: true

// 2. Express 配置
const cors = require('cors');
app.use(cors({
  origin: 'https://trust.com',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));`,
    },
    {
      title: '8. SQL 注入与输入验证',
      category: '数据层安全',
      what: '攻击者通过拼接恶意 SQL 操作数据库',
      why: '输入未过滤，拼接字符串执行 SQL',
      how: '预编译语句（Prepared Statements）；输入白名单验证；ORM 框架自动参数化；最小权限原则',
      sugar: '参数化查询',
      scenarios: ['后端接口层', '数据库操作', '用户输入处理', '搜索功能'],
      relations: ['SQL 注入 ←→ 输入验证', 'SQL 注入 ←→ ORM', 'SQL 注入 ←→ 权限控制'],
      code: `// SQL 注入防御
// 1. 参数化查询（安全）
const query = 'SELECT * FROM users WHERE id = ?';
db.query(query, [userId]);

// 2. ORM 框架
const user = await User.findOne({
  where: { email: userEmail }
});

// 3. 输入验证
function validateUserId(id) {
  if (!/^[0-9]+$/.test(id)) {
    throw new Error('Invalid user ID');
  }
  return id;
}`,
    },
    {
      title: '9. 包依赖与供应链安全',
      category: '供应链层安全',
      what: '攻击者通过恶意 npm 包 / typosquatting 植入后门',
      why: 'npm、PyPI、Docker Hub 攻击激增；开发者常安装未知依赖',
      how: '锁定版本 package-lock.json；使用可信源 npm audit / Snyk；代码签名验证 Sigstore / npm provenance',
      sugar: '依赖审计',
      scenarios: ['npm/yarn 环境', '第三方库使用', 'CI/CD 流程', '生产部署'],
      relations: ['供应链 ←→ 版本锁定', '供应链 ←→ 审计工具', '供应链 ←→ 代码签名'],
      code: `// 包依赖安全
// 1. 锁定版本
{
  "dependencies": {
    "react": "18.2.0",
    "axios": "1.4.0"
  }
}

// 2. npm audit 检查漏洞
npm audit
npm audit fix

// 3. 使用 Snyk
npm install -g snyk
snyk test`,
    },
    {
      title: '10. SRI（Subresource Integrity）',
      category: '供应链层安全',
      what: '通过校验资源哈希值防止 CDN 资源被篡改',
      why: '防 CDN 劫持；第三方脚本安全加载',
      how: '为外部资源添加 integrity 属性；使用 sha256/sha384/sha512 哈希；配合 crossorigin 属性',
      sugar: 'integrity 属性',
      scenarios: ['静态资源加载', 'CDN 使用', '第三方库', '公共资源'],
      relations: ['SRI ←→ CDN', 'SRI ←→ 哈希验证', 'SRI ←→ CORS'],
      code: `// SRI 配置
// 1. 基础用法
<script src="https://cdn.com/lib.js"
  integrity="sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K"
  crossorigin="anonymous"></script>

// 2. 生成 SRI 哈希
openssl dgst -sha384 -binary lib.js | openssl base64 -A

// 3. Webpack 自动生成
const SriPlugin = require('webpack-subresource-integrity');
module.exports = {
  plugins: [
    new SriPlugin({
      hashFuncNames: ['sha256', 'sha384']
    })
  ]
};`,
    },
  ];

  const securityLayers = [
    { name: '网络层', desc: 'HTTPS、HSTS、CORS', icon: '🌐' },
    { name: '应用层', desc: 'XSS、CSRF、CSP、Cookie', icon: '🛡️' },
    { name: '身份层', desc: 'Token、JWT、OAuth', icon: '🔐' },
    { name: '数据层', desc: '输入校验、SQL防注入', icon: '💾' },
    { name: '供应链层', desc: '依赖安全、SRI验证', icon: '📦' },
  ];

  const securityRelations = [
    'XSS ←→ CSP ←→ Cookie 安全',
    'CSRF ←→ Token / SameSite',
    'HTTPS ←→ HSTS ←→ CORS',
    '输入验证 ←→ SQL 防注入',
    'SRI ←→ 依赖安全',
  ];

  const resources = [
    { name: 'OWASP Top 10', url: 'https://owasp.org/www-project-top-ten/', description: 'Web 应用安全风险排行榜' },
    { name: 'MDN Web Security', url: 'https://developer.mozilla.org/zh-CN/docs/Web/Security', description: 'MDN Web 安全指南' },
    { name: 'Content Security Policy', url: 'https://content-security-policy.com/', description: 'CSP 完整参考指南' },
    { name: 'Web.dev Security', url: 'https://web.dev/secure/', description: 'Google Web 安全最佳实践' },
    { name: 'PortSwigger Web Security', url: 'https://portswigger.net/web-security', description: '深入的 Web 安全学习资源' },
    { name: 'OWASP Cheat Sheet', url: 'https://cheatsheetseries.owasp.org/', description: 'OWASP 安全速查表系列' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <Link href="/study/learn-coding/frontend?level=senior" passHref>
            <Button variant="outline" size="sm" className="hover:bg-white/80 shadow-sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              返回前端开发
            </Button>
          </Link>
        </div>

        {/* 页面标题 */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl shadow-lg mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-gray-800">
            Web 安全（Web Security）
          </h1>
          <p className="text-gray-600">
            系统掌握 Web 安全核心知识，防止数据被窃取、用户身份被冒用、代码被注入执行
          </p>
        </div>

        {/* 安全层级总览 */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-800">安全层级总览</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {securityLayers.map((layer, index) => (
              <div key={index} className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 border border-gray-200">
                <div className="text-3xl mb-2">{layer.icon}</div>
                <div className="font-semibold text-gray-800 mb-1">{layer.name}</div>
                <div className="text-sm text-gray-600">{layer.desc}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* 安全关系图谱 */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm mb-8">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-6 h-6 text-green-600" />
            <h2 className="text-2xl font-bold text-gray-800">安全关系图谱</h2>
          </div>
          <div className="space-y-2">
            {securityRelations.map((relation, index) => (
              <div key={index} className="flex items-center gap-2 text-gray-700">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="font-mono text-sm">{relation}</span>
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-6">
          {sections.map((section, index) => (
            <Card key={index} id={`section-${index + 1}`} className="p-6 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow scroll-mt-20">
              <div className="flex items-start gap-3 mb-4">
                <CheckCircle2 className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-800">{section.title}</h3>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                      {section.category}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                  <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                    <span className="text-lg">📌</span>
                    是什么（点）
                  </h4>
                  <p className="text-gray-700">{section.what}</p>
                </div>

                <div className="bg-amber-50 p-4 rounded-lg border-l-4 border-amber-500">
                  <h4 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
                    <span className="text-lg">💡</span>
                    为什么
                  </h4>
                  <p className="text-gray-700">{section.why}</p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                  <h4 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                    <span className="text-lg">✅</span>
                    怎么样（防御）
                  </h4>
                  <p className="text-gray-700">{section.how}</p>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full font-medium">
                    语法糖：{section.sugar}
                  </span>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <span className="text-lg">🎯</span>
                    使用场景（面）
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {section.scenarios.map((scenario, idx) => (
                      <span key={idx} className="px-3 py-1 bg-white border border-gray-300 rounded-full text-sm text-gray-700">
                        {scenario}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-indigo-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-indigo-900 mb-2 flex items-center gap-2">
                    <span className="text-lg">🔗</span>
                    关系（线）
                  </h4>
                  <div className="space-y-1">
                    {section.relations.map((relation, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-gray-700">
                        <CheckCircle2 className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                        <span className="text-sm font-mono">{relation}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-900 p-4 rounded-lg overflow-x-auto">
                  <pre className="text-sm text-gray-100 font-mono whitespace-pre-wrap">
                    {section.code}
                  </pre>
                </div>
              </div>
            </Card>
          ))}
        </div>

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

        {/* 底部提示 */}
        <div className="text-center">
          <Card className="inline-block p-4 bg-gradient-to-r from-white/80 to-blue-50/80 backdrop-blur-sm border border-blue-200/50">
            <p className="text-sm text-gray-700">
              💡 建议：从基础的 XSS/CSRF 防护开始，逐步掌握完整的 Web 安全体系
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
