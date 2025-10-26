'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Globe, CheckCircle2, TrendingUp, Cpu, Shield, Zap } from 'lucide-react';
import Link from 'next/link';

export default function BrowserPage() {
  const sections = [
    {
      title: '1. 浏览器整体架构',
      icon: Globe,
      concept: '浏览器整体架构定义了浏览器的组成部分及其协作方式。现代浏览器采用模块化设计，将用户界面、渲染引擎、JavaScript 引擎、网络栈等分离成独立模块。这种架构让浏览器更稳定、可扩展，每个模块可以独立优化和更新。',
      evolution: '一体化处理 → 模块化隔离',
      components: [
        '用户界面（UI）：地址栏、标签页、菜单',
        '浏览器引擎：协调 UI、渲染和网络',
        '渲染引擎：Blink (Chrome)、Gecko (Firefox)、WebKit (Safari)',
        '辅助组件：网络栈、存储、插件进程',
        '数据持久化：缓存、Cookie、localStorage',
      ],
      connection: 'UI 触发导航，浏览器引擎协调网络加载资源，渲染引擎处理内容并反馈给 UI',
      evolution_path: '从早期单进程（如 IE6）到当代多引擎分离，提升稳定性和扩展性；2025 年强调 AI 集成',
      diagram: `[用户界面]
    ↓
[浏览器引擎] ←→ [网络栈]
    ↓
[渲染引擎] ←→ [JS 引擎]
    ↓
[数据持久化]`,
    },
    {
      title: '2. 多进程模型',
      icon: Cpu,
      concept: '多进程模型是现代浏览器的核心安全和稳定性保障。每个标签页运行在独立的进程中，一个页面崩溃不会影响其他页面。进程间通过 IPC（进程间通信）协作，同时实现了沙箱隔离，防止恶意代码访问系统资源。这是浏览器从单进程演进到多进程的重大突破。',
      evolution: '共享资源 → 沙箱隔离',
      components: [
        '浏览器进程：管理 UI、协调整体',
        '渲染进程：每个标签/站点一个，运行渲染引擎和 JS 引擎',
        'GPU 进程：处理图形加速',
        '网络进程：处理请求、DNS、缓存',
        '实用进程：音频、扩展等辅助服务',
      ],
      connection: '浏览器进程生成渲染进程，渲染进程通过 IPC 请求网络/GPU；进程隔离防止崩溃传播',
      evolution_path: '从单进程易崩溃到当代站点隔离（Site Isolation），Chromium 领导，Gecko/WebKit 跟进',
      stats: '平均使用 5-10 个进程/浏览器实例',
    },
    {
      title: '3. 网络和资源加载',
      icon: Zap,
      concept: '网络和资源加载决定了网页内容如何从服务器传输到浏览器。现代浏览器使用 HTTP/3 多路复用技术并行加载资源，并通过 DNS 预取、资源优先级排序等优化机制加速页面加载。Service Worker 和浏览器缓存进一步提升了重复访问的速度。',
      evolution: '顺序加载 → 智能预取',
      components: [
        'URL 解析和请求：HTTP/3 多路复用、TLS 握手',
        '资源获取：并行加载 CSS/JS/图像，优先级排序',
        '优化机制：DNS 预取、Early Hints、预渲染 API',
        '缓存：浏览器缓存、Service Worker',
      ],
      connection: '网络进程处理请求，流式传输到渲染进程；优化机制加速关键路径',
      evolution_path: '从 HTTP/1.1 串行到 HTTP/3 并行，提升加载速度；2025 年 AI 预测加载常见资源',
    },
    {
      title: '4. 解析过程',
      icon: CheckCircle2,
      concept: '解析过程将 HTML、CSS、JavaScript 文本转换为浏览器可以理解的数据结构。HTML 解析构建 DOM 树，CSS 解析创建 CSSOM 树，JavaScript 则可以动态修改这些结构。现代浏览器采用流式解析和增量渲染，让页面内容可以边下载边显示，减少白屏时间。',
      evolution: '阻塞式 → 并行异步',
      components: [
        'HTML 解析：构建 DOM 树，容忍错误',
        'CSS 解析：创建 CSSOM，应用级联/继承',
        'JS 解析：同步阻塞，async/defer 非阻塞',
        '渲染阻塞：CSS/同步 JS 暂停 DOM 构建',
        '模块加载：ES 模块依赖图，动态 import()',
      ],
      connection: 'HTML/CSS 并行解析合并成渲染树；JS 修改 DOM 触发重新解析',
      evolution_path: '从线性解析到流式/增量，减少白屏时间；2025 年 import maps 标准化',
    },
    {
      title: '5. 渲染管道',
      icon: Globe,
      concept: '渲染管道是将 DOM 和 CSS 转换为屏幕像素的完整流程，包括样式计算、布局、绘画和合成。关键渲染路径决定了首屏显示速度。现代浏览器使用 GPU 加速合成层，让动画和滚动更流畅。理解渲染管道对于优化页面性能至关重要。',
      evolution: '同步渲染 → 异步合成',
      components: [
        '样式计算：合并 DOM/CSSOM，计算最终样式',
        '布局（Reflow）：计算位置/大小，支持 flex/grid',
        '绘画（Paint）：生成绘制命令，分层处理',
        '合成（Composite）：组装层，使用 GPU 加速',
        '关键渲染路径：DOM+CSSOM → 渲染树 → 布局 → 绘画 → 合成',
      ],
      connection: '变化从上游传播，触发局部/全重绘；GPU 处理合成独立于主线程',
      evolution_path: '从 CPU 主导到 GPU 加速，Gecko 的 WebRender 直接 GPU 渲染；2025 年 CSS Houdini',
      pipeline: '渲染管道涉及 6-8 个主要步骤',
    },
    {
      title: '6. JavaScript 执行引擎',
      icon: Cpu,
      concept: 'JavaScript 执行引擎负责解析和运行 JavaScript 代码。现代引擎（如 V8）使用多层 JIT（即时编译）技术，将热代码编译为机器码以提升性能。引擎还包括垃圾回收器管理内存，以及与 DOM API 的绑定。WebAssembly 的集成让浏览器可以运行接近原生速度的代码。',
      evolution: '慢启动 → 动态优化',
      components: [
        '引擎：V8 (Chromium)、SpiderMonkey (Gecko)、JavaScriptCore (WebKit)',
        '解析/执行：AST → 字节码 → JIT（基线/优化层级）',
        '内存管理：分代 GC、增量/并发',
        '集成：绑定 DOM API，模块评估',
        '优化：类型反馈、热代码 JIT、去优化',
      ],
      connection: 'JS 引擎执行脚本修改 DOM，触发渲染更新；模块加载与解析集成',
      evolution_path: '从解释器到多层 JIT，V8 领先性能；2025 年 WebAssembly 集成高性能计算',
      stats: 'JIT 层级达 3-4 层',
    },
    {
      title: '7. 安全机制',
      icon: Shield,
      concept: '安全机制保护用户免受恶意网站攻击。沙箱技术限制渲染进程的系统访问权限，站点隔离确保不同源的内容运行在独立进程中。同源策略、CORS、CSP 等机制控制跨域访问。这些多层防护让浏览器成为相对安全的应用平台。',
      evolution: '共享内存 → 进程边界',
      components: [
        '沙箱：限制渲染进程访问，使用 OS 机制（如 seccomp）',
        '站点隔离：跨源 iframe 单独进程，防 Spectre',
        '权限控制：通过浏览器进程，用户提示',
        '其他：CORB（跨源读取阻塞）、Safe Browsing',
      ],
      connection: '多进程基础沙箱，隔离增强防护；IPC 安全路由请求',
      evolution_path: '从同源策略到严格隔离，所有引擎默认启用；2025 年内存安全重写（如 Rust in Gecko）',
    },
    {
      title: '8. 优化技术',
      icon: Zap,
      concept: '优化技术贯穿浏览器的各个环节，目标是提升页面加载速度和运行性能。包括资源预加载、代码拆分、CSS 动画优化、虚拟 DOM 等。浏览器通过脏节点标记、批处理更新等机制减少不必要的重绘和重排。开发者工具可以帮助识别性能瓶颈。',
      evolution: '全重绘 → 局部更新',
      components: [
        '性能：预加载、代码拆分、虚拟 DOM',
        '动画：CSS 优先，GPU 合成',
        '资源管理：批处理更新、脏节点标记',
        '工具：DevTools 监控 reflow/repaint',
      ],
      connection: '优化贯穿管道，减少阻塞和重计算',
      evolution_path: '从手动优化到自动化，框架如 React 辅助；2025 年 AI 驱动优化',
    },
  ];

  const engines = [
    {
      name: 'Chromium (Blink/V8)',
      share: '70%+',
      features: ['多进程丰富', 'V8 性能强', '创新领先', 'Site Isolation'],
      color: 'from-blue-500 to-cyan-500',
    },
    {
      name: 'Gecko (SpiderMonkey)',
      share: '10-15%',
      features: ['Rust 安全', 'WebRender GPU 渲染', '少进程默认', '隐私优先'],
      color: 'from-orange-500 to-red-500',
    },
    {
      name: 'WebKit (JavaScriptCore)',
      share: '10-15%',
      features: ['iOS 强制', 'CALayer 合成', '四层 JIT', '能效优化'],
      color: 'from-purple-500 to-pink-500',
    },
  ];

  const resources = [
    { name: '浏览器工作原理', url: 'https://web.dev/howbrowserswork/', description: 'Google 官方详解' },
    { name: 'Inside look at modern web browser', url: 'https://developer.chrome.com/blog/inside-browser-part1/', description: 'Chrome 团队系列文章' },
    { name: 'MDN 浏览器引擎', url: 'https://developer.mozilla.org/zh-CN/docs/Glossary/Engine', description: 'MDN 浏览器引擎介绍' },
    { name: 'V8 官方文档', url: 'https://v8.dev/', description: 'V8 引擎深度解析' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-blue-50 p-4 sm:p-6">
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
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl shadow-lg mb-4">
            <Globe className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-gray-800">
            浏览器原理
          </h1>
          <p className="text-gray-600">
            深入理解当代浏览器的工作机制，从架构到优化
          </p>
        </div>

        {/* 内容区域 */}
        <div className="space-y-6 mb-8">
          {sections.map((section, idx) => {
            const Icon = section.icon;
            return (
              <Card key={idx} id={`section-${idx + 1}`} className="p-6 bg-white/80 backdrop-blur-sm scroll-mt-20">
                {/* 标题 */}
                <div className="flex items-start gap-3 mb-4">
                  <Icon className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">{section.title}</h2>
                    <div className="flex items-center gap-2 text-sm">
                      <TrendingUp className="w-4 h-4 text-indigo-600" />
                      <span className="text-indigo-600 font-medium">演进路径：{section.evolution}</span>
                    </div>
                  </div>
                </div>

                {/* 概念解释 */}
                {section.concept && (
                  <div className="p-4 rounded-lg bg-gradient-to-r from-cyan-50 to-blue-50 border-l-4 border-cyan-500 mb-4">
                    <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      <span className="text-cyan-600">💡</span>
                      什么是{section.title.replace(/^\d+\.\s*/, '')}？
                    </h3>
                    <p className="text-sm text-gray-700 leading-relaxed">{section.concept}</p>
                  </div>
                )}

                {/* 核心组件 */}
                <div className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 mb-4">
                  <h3 className="font-semibold text-gray-800 mb-3">核心组件</h3>
                  <ul className="space-y-2">
                    {section.components.map((component, i) => (
                      <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="text-blue-600 mt-1">✓</span>
                        <span>{component}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 逻辑连接 */}
                <div className="p-4 rounded-lg bg-purple-50 border border-purple-200 mb-4">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold text-purple-700">连接：</span>
                    {section.connection}
                  </p>
                </div>

                {/* 演进路径 */}
                <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold text-green-700">演进：</span>
                    {section.evolution_path}
                  </p>
                  {section.stats && (
                    <p className="text-xs text-gray-600 mt-2">📊 {section.stats}</p>
                  )}
                  {section.pipeline && (
                    <p className="text-xs text-gray-600 mt-2">⚙️ {section.pipeline}</p>
                  )}
                </div>

                {/* 图示 */}
                {section.diagram && (
                  <div className="mt-4">
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm">
                      <code>{section.diagram}</code>
                    </pre>
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {/* 引擎比较 */}
        <Card id="section-9" className="p-6 bg-white/80 backdrop-blur-sm mb-8 scroll-mt-20">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Cpu className="w-6 h-6 text-blue-600" />
            9. 三大引擎比较
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {engines.map((engine, idx) => (
              <div key={idx} className={`p-4 rounded-lg bg-gradient-to-br ${engine.color} text-white`}>
                <h3 className="font-bold text-lg mb-2">{engine.name}</h3>
                <p className="text-sm mb-3 opacity-90">市场份额：{engine.share}</p>
                <ul className="space-y-1">
                  {engine.features.map((feature, i) => (
                    <li key={i} className="text-sm flex items-start gap-2">
                      <span>•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-700">
              <span className="font-semibold text-blue-700">演进：</span>
              从 WebKit 分叉 Blink/Gecko，逻辑路径是"统一引擎 → 多样竞争"，保持 Web 标准平衡；2025 年 Blink 主导但 Gecko/WebKit 防垄断
            </p>
          </div>
        </Card>

        {/* 学习资源 */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Globe className="w-6 h-6 text-blue-600" />
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
                  <TrendingUp className="w-5 h-5 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
                <p className="text-sm text-gray-600">{resource.description}</p>
              </a>
            ))}
          </div>
        </Card>

        {/* 总结 */}
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">总体概览与演进趋势</h2>
          <div className="space-y-3">
            <div className="p-4 bg-white rounded-lg">
              <p className="text-sm text-gray-700">
                <span className="font-semibold text-blue-700">总体概览：</span>
                当代浏览器原理聚焦多进程隔离、渲染优化和安全，三大引擎互补，确保 Web 生态健康
              </p>
            </div>
            <div className="p-4 bg-white rounded-lg">
              <p className="text-sm text-gray-700">
                <span className="font-semibold text-indigo-700">演进趋势（2025）：</span>
                AI 预加载、WebGPU 扩展、内存安全强化，推动更快、更安全的浏览体验
              </p>
            </div>
            <div className="p-4 bg-white rounded-lg">
              <p className="text-sm text-gray-700">
                <span className="font-semibold text-purple-700">使用建议：</span>
                开发者关注关键路径优化；用户选择引擎基于需求（性能 vs 隐私）
              </p>
            </div>
          </div>
        </Card>

        {/* 底部提示 */}
        <div className="text-center">
          <Card className="inline-block p-4 bg-gradient-to-r from-white/80 to-blue-50/80 backdrop-blur-sm border border-blue-200/50">
            <p className="text-sm text-gray-700">
              💡 重点：理解渲染管道和多进程模型，优化 Web 应用性能
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
