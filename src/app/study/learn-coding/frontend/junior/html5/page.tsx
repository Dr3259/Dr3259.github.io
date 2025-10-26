'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, BookOpen, ExternalLink, Code, CheckCircle2, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function HTML5Page() {
  const sections = [
    {
      title: '1. 标记与结构',
      description: 'HTML 到 HTML5 的语义化演进',
      concept: '标记与结构是 HTML 的核心，用于定义网页内容的组织方式。HTML5 引入了语义化标签，让标签本身就能表达内容的含义，而不仅仅是样式容器。这使得搜索引擎、屏幕阅读器等工具能更好地理解页面结构。',
      evolution: '通用布局 → 语义结构',
      htmlFeatures: ['基础标签：<div>、<span>、<p>、<h1-h6>', '<table>、<ul>、<a>、<img>', '简单内容布局和链接'],
      html5Features: ['语义化标签：<header>、<footer>、<article>', '<section>、<nav>、<aside>、<main>', '明确结构语义，提升可读性'],
      comparison: 'HTML 使用通用 <div> 堆叠导致结构模糊；HTML5 的语义标签提供明确语义，便于 SEO 和无障碍优化',
      code: `<!-- HTML 传统方式 -->
<div id="header">
  <div id="nav">...</div>
</div>

<!-- HTML5 语义化 -->
<header>
  <nav>...</nav>
</header>
<main>
  <article>...</article>
  <aside>...</aside>
</main>
<footer>...</footer>`,
    },
    {
      title: '2. 多媒体支持',
      description: '从插件依赖到原生播放',
      concept: '多媒体支持指浏览器直接播放音频和视频的能力。HTML5 之前需要 Flash 等插件，HTML5 提供了原生的 <audio> 和 <video> 标签，让多媒体播放变得简单、安全且跨平台兼容。',
      evolution: '插件依赖 → 原生播放',
      htmlFeatures: ['通过 <object> 或 <embed> 嵌入', '依赖 Flash 等插件', '兼容性差'],
      html5Features: ['<audio> 支持 MP3、WAV', '<video> 支持 MP4、WebM', '<track> 字幕支持', '无需第三方插件'],
      comparison: 'HTML 插件依赖导致兼容性差；HTML5 原生支持简化集成，提升跨设备兼容',
      code: `<!-- HTML5 音频 -->
<audio controls>
  <source src="audio.mp3" type="audio/mpeg">
</audio>

<!-- HTML5 视频 -->
<video controls width="640">
  <source src="video.mp4" type="video/mp4">
  <track src="subtitles.vtt" kind="subtitles">
</video>`,
    },
    {
      title: '3. 图形与绘制',
      description: '从静态图像到动态渲染',
      concept: '图形与绘制是指在网页上动态创建和渲染图形的能力。HTML5 的 <canvas> 元素提供了一个画布，配合 JavaScript 可以实时绘制 2D 图形、动画和游戏。结合 WebGL 还能实现 3D 渲染，无需插件即可创建复杂的可视化效果。',
      evolution: '静态显示 → 实时绘制',
      htmlFeatures: ['静态 <img> 标签', '依赖插件实现简单图形', '无动态绘图能力'],
      html5Features: ['<canvas> 用于 2D 绘图', '结合 WebGL（3D 渲染）', 'WebGPU（高性能图形计算）', '支持交互图形'],
      comparison: 'HTML 缺乏动态绘图；HTML5 提供 canvas API，连接游戏和数据可视化',
      code: `<canvas id="myCanvas" width="400" height="300"></canvas>

<script>
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
ctx.fillStyle = 'blue';
ctx.fillRect(10, 10, 100, 100);
</script>`,
    },
    {
      title: '4. 表单功能',
      description: '从基本采集到验证优化',
      concept: '表单功能用于收集用户输入数据。HTML5 增强了表单验证能力，提供了 email、date、number 等新输入类型，以及 required、pattern 等验证属性，让表单验证可以在浏览器端完成，无需依赖 JavaScript，提升用户体验和开发效率。',
      evolution: '基本采集 → 验证优化',
      htmlFeatures: ['基本输入：text、password', '<select>、<textarea>', '验证依赖 JavaScript'],
      html5Features: ['增强输入：email、date、range、color', '原生验证：required、pattern、placeholder', '减少代码量，提升用户体验'],
      comparison: 'HTML 验证依赖 JS；HTML5 原生验证减少服务器负载',
      code: `<form>
  <input type="email" required 
         placeholder="请输入邮箱">
  <input type="date" min="2025-01-01">
  <input type="range" min="0" max="100">
  <input type="color" value="#ff0000">
  <input type="tel" pattern="[0-9]{11}">
  <button type="submit">提交</button>
</form>`,
    },
    {
      title: '5. API 与交互',
      description: '从事件响应到实时交互',
      concept: 'API 与交互是指浏览器提供的编程接口，让网页能够实现丰富的交互功能。HTML5 引入了拖放 API、地理定位、WebSocket 实时通信、WebRTC 音视频通信等强大接口，使网页应用能够媲美原生应用的交互体验。',
      evolution: '事件响应 → 实时交互',
      htmlFeatures: ['基本 DOM 操作', 'document.getElementById', '简单事件处理'],
      html5Features: ['拖放 API（dragstart、drop）', 'Geolocation（地理定位）', 'WebSocket（实时通信）', 'WebRTC（音视频通信）', 'History API（路由管理）'],
      comparison: 'HTML 交互有限；HTML5 API 丰富，连接聊天和地图应用',
      code: `<!-- 拖放 API -->
<div draggable="true" 
     ondragstart="drag(event)">拖我</div>

<!-- Geolocation -->
<script>
navigator.geolocation.getCurrentPosition(
  (position) => {
    console.log(position.coords.latitude);
  }
);
</script>`,
    },
    {
      title: '6. 数据存储',
      description: '从临时存储到持久管理',
      concept: '数据存储是指在用户浏览器中保存数据的能力。HTML5 提供了 localStorage（持久存储）、sessionStorage（会话存储）和 IndexedDB（客户端数据库），容量从 Cookie 的 4KB 扩展到 5MB 以上，让网页应用能够离线工作和保存用户数据。',
      evolution: '临时存储 → 持久管理',
      htmlFeatures: ['依赖 Cookie', '4KB 限制', '每次请求都发送'],
      html5Features: ['localStorage（5MB+，持久）', 'sessionStorage（会话级）', 'IndexedDB（客户端数据库）', '提升隐私和性能'],
      comparison: 'HTML 存储容量小；HTML5 支持复杂数据，连接离线应用',
      code: `// localStorage
localStorage.setItem('user', 'John');
const user = localStorage.getItem('user');

// sessionStorage
sessionStorage.setItem('token', 'abc123');

// IndexedDB
const request = indexedDB.open('myDB', 1);
request.onsuccess = (e) => {
  const db = e.target.result;
  // 数据库操作
};`,
    },
    {
      title: '7. 性能优化',
      description: '从同步执行到异步并行',
      concept: '性能优化是指提升网页加载和运行速度的技术。HTML5 提供了 async/defer 脚本属性、资源预加载（preload）、自定义数据属性（data-*）等特性，让开发者能够控制资源加载顺序，避免阻塞渲染，提升页面响应速度。',
      evolution: '同步执行 → 异步并行',
      htmlFeatures: ['同步 <script> 加载', '易阻塞渲染', '性能差'],
      html5Features: ['async/defer 脚本优化', 'data-* 自定义属性', '<link rel="preload"> 资源预加载', '优化移动端体验'],
      comparison: 'HTML 加载慢；HTML5 提供异步机制，连接页面速度提升',
      code: `<!-- 异步加载 -->
<script src="app.js" async></script>

<!-- 延迟执行 -->
<script src="app.js" defer></script>

<!-- 资源预加载 -->
<link rel="preload" href="font.woff2" as="font">

<!-- 自定义属性 -->
<div data-user-id="123" data-role="admin"></div>`,
    },
    {
      title: '8. 可访问性',
      description: '从基本兼容到语义增强',
      concept: '可访问性（Accessibility）是指让所有人（包括残障人士）都能使用网页的能力。HTML5 通过语义化标签和 ARIA 角色属性，让屏幕阅读器等辅助技术能够更好地理解页面结构，帮助视障用户浏览网页，体现了 Web 的包容性。',
      evolution: '基本兼容 → 语义增强',
      htmlFeatures: ['基本 alt 属性', '支持有限', '手动优化'],
      html5Features: ['ARIA 角色（role="navigation"）', '语义标签内置支持', '表单验证反馈', '连接屏幕阅读器优化'],
      comparison: 'HTML 无障碍弱；HTML5 内置支持，提升包容性',
      code: `<!-- ARIA 角色 -->
<nav role="navigation">
  <ul role="menubar">
    <li role="menuitem">首页</li>
  </ul>
</nav>

<!-- 语义化增强 -->
<button aria-label="关闭对话框">×</button>
<input aria-required="true" aria-invalid="false">`,
    },
    {
      title: '9. 离线与应用',
      description: '从服务器渲染到客户端缓存',
      concept: '离线与应用功能让网页能够像原生应用一样工作。通过 Service Worker 和 Web App Manifest，HTML5 应用可以离线访问、安装到桌面、接收推送通知，这就是渐进式 Web 应用（PWA）的基础，模糊了网页和应用的界限。',
      evolution: '服务器渲染 → 客户端缓存',
      htmlFeatures: ['仅限在线页面', '无离线支持', '依赖服务器'],
      html5Features: ['Service Worker（离线缓存）', 'Web App Manifest（PWA 安装）', '提升用户留存'],
      comparison: 'HTML 无离线支持；HTML5 启用 PWA，连接移动应用',
      code: `<!-- manifest.json -->
{
  "name": "我的应用",
  "short_name": "App",
  "start_url": "/",
  "display": "standalone",
  "icons": [...]
}

<!-- Service Worker -->
<script>
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}
</script>`,
    },
    {
      title: '10. 扩展技术',
      description: '从第三方依赖到浏览器内置',
      concept: '扩展技术是指超越传统 Web 能力的前沿技术。WebAssembly 让 C/C++/Rust 等语言编译后在浏览器中高速运行，WebGPU 提供了强大的图形计算能力，这些技术让浏览器能够运行游戏、AI 模型等高性能应用，不再依赖 Flash 等插件。',
      evolution: '第三方依赖 → 浏览器内置',
      htmlFeatures: ['依赖 Flash 插件', '扩展有限', '安全风险'],
      html5Features: ['WebAssembly（高性能计算）', 'WebGPU（图形计算）', 'PWA 集成', '连接 AI 和游戏'],
      comparison: 'HTML 扩展有限；HTML5 支持前沿计算，如前端 ML 模型',
      code: `<!-- WebAssembly -->
<script>
WebAssembly.instantiateStreaming(
  fetch('module.wasm')
).then(result => {
  const add = result.instance.exports.add;
  console.log(add(1, 2)); // 3
});
</script>`,
    },
    {
      title: '11. CSS 集成',
      description: '从固定布局到灵活响应',
      concept: 'CSS 集成是指 HTML5 与 CSS3 的深度配合。HTML5 的语义化标签配合 CSS3 的 Flexbox、Grid 布局、媒体查询等特性，让网页能够自适应不同屏幕尺寸，实现真正的响应式设计，一套代码适配手机、平板和桌面。',
      evolution: '固定布局 → 灵活响应',
      htmlFeatures: ['与 CSS2 配合', '浮动布局', '简单定位'],
      html5Features: ['与 CSS3 整合', 'Flexbox、Grid 布局', '过渡/动画', '媒体查询（响应式）'],
      comparison: 'HTML 布局基础；HTML5 增强动态样式，连接移动适配',
      code: `<!-- Flexbox 布局 -->
<div style="display: flex; gap: 10px;">
  <div>项目1</div>
  <div>项目2</div>
</div>

<!-- Grid 布局 -->
<div style="display: grid; grid-template-columns: 1fr 1fr;">
  <div>列1</div>
  <div>列2</div>
</div>

<!-- 媒体查询 -->
<style>
@media (max-width: 768px) {
  .container { flex-direction: column; }
}
</style>`,
    },
  ];

  const resources = [
    { name: 'MDN HTML 教程', url: 'https://developer.mozilla.org/zh-CN/docs/Web/HTML', description: '最权威的 HTML 文档' },
    { name: 'W3Schools HTML', url: 'https://www.w3schools.com/html/', description: '交互式 HTML 教程' },
    { name: 'HTML5 Doctor', url: 'http://html5doctor.com/', description: 'HTML5 语义化标签指南' },
    { name: 'Can I Use', url: 'https://caniuse.com/', description: '检查浏览器兼容性' },
    { name: 'Web.dev', url: 'https://web.dev/', description: 'Google 的 Web 开发最佳实践' },
    { name: 'HTML Living Standard', url: 'https://html.spec.whatwg.org/', description: 'HTML 最新标准规范' },
  ];

  const summary = {
    htmlCoverage: '约 30% 现代功能覆盖',
    html5Coverage: '约 70% 扩展功能',
    trend: 'HTML5 与 JS 框架（如 React）整合，推动 PWA 和 WebAssembly 应用',
    suggestion: '新项目优先 HTML5；遗留系统可渐进升级语义和 API',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <Link href="/study/learn-coding/frontend?level=junior" passHref>
            <Button variant="outline" size="sm" className="hover:bg-white/80 shadow-sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              返回前端开发
            </Button>
          </Link>
        </div>

        {/* 页面标题 */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl shadow-lg mb-4">
            <Code className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-gray-800">
            HTML5 基础
          </h1>
          <p className="text-gray-600">
            掌握 HTML5 的核心概念和语义化标签，构建结构清晰的网页
          </p>
        </div>

        {/* 内容区域 */}
        <div className="space-y-6 mb-8">
          {sections.map((section, idx) => (
            <Card key={idx} id={`section-${idx + 1}`} className="p-6 bg-white/80 backdrop-blur-sm scroll-mt-20">
              {/* 标题和描述 */}
              <div className="flex items-start gap-3 mb-4">
                <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">{section.title}</h2>
                  <p className="text-gray-600 mb-2">{section.description}</p>
                  <div className="flex items-center gap-2 text-sm">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                    <span className="text-blue-600 font-medium">演进路径：{section.evolution}</span>
                  </div>
                </div>
              </div>

              {/* 概念解释 */}
              {section.concept && (
                <div className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 mb-4">
                  <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <span className="text-blue-600">💡</span>
                    什么是{section.title.replace(/^\d+\.\s*/, '')}？
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed">{section.concept}</p>
                </div>
              )}

              {/* HTML vs HTML5 对比 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <span className="px-2 py-1 bg-gray-600 text-white text-xs rounded">HTML</span>
                    传统方式
                  </h3>
                  <ul className="space-y-2">
                    {section.htmlFeatures.map((feature, i) => (
                      <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="text-gray-400 mt-1">•</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <span className="px-2 py-1 bg-green-600 text-white text-xs rounded">HTML5</span>
                    现代方式
                  </h3>
                  <ul className="space-y-2">
                    {section.html5Features.map((feature, i) => (
                      <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="text-green-600 mt-1">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* 对比总结 */}
              <div className="p-4 rounded-lg bg-blue-50 border border-blue-200 mb-4">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold text-blue-700">对比：</span>
                  {section.comparison}
                </p>
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

        {/* 总结对比 */}
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">总体对比与演进趋势</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="p-4 bg-white rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">HTML（传统）</h3>
              <p className="text-sm text-gray-600">{summary.htmlCoverage}</p>
              <p className="text-sm text-gray-600 mt-2">适合基础静态站点</p>
            </div>
            <div className="p-4 bg-white rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">HTML5（现代）</h3>
              <p className="text-sm text-gray-600">{summary.html5Coverage}</p>
              <p className="text-sm text-gray-600 mt-2">覆盖动态、交互和性能优化</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="p-4 bg-white rounded-lg">
              <p className="text-sm text-gray-700">
                <span className="font-semibold text-blue-700">演进趋势（2025）：</span>
                {summary.trend}
              </p>
            </div>
            <div className="p-4 bg-white rounded-lg">
              <p className="text-sm text-gray-700">
                <span className="font-semibold text-green-700">使用建议：</span>
                {summary.suggestion}
              </p>
            </div>
          </div>
        </Card>

        {/* 底部提示 */}
        <div className="text-center">
          <Card className="inline-block p-4 bg-gradient-to-r from-white/80 to-green-50/80 backdrop-blur-sm border border-green-200/50">
            <p className="text-sm text-gray-700">
              💡 建议：从基础 HTML 开始，逐步掌握 HTML5 的 11 大核心范畴
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
