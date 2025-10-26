'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Zap, CheckCircle2, TrendingUp, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function AdvancedPerformancePage() {
  const sections = [
    {
      title: '1. LCP（Largest Contentful Paint）',
      category: 'Web Vitals',
      what: '最大内容渲染时间，衡量页面主要内容加载速度，通常是最大的图片或文本块',
      why: '直接影响用户感知的加载速度，是 Google 核心性能指标之一',
      how: '优化图片加载、减少 render-blocking 资源、使用 CDN、预加载关键资源',
      sugar: '加载速度指标',
      scenarios: ['首屏优化', 'SEO 优化', '用户体验提升', '性能监控'],
      relations: ['影响 SEO 排名', '与首屏优化配合', '需要持续监控'],
      code: `// 监测 LCP
import { onLCP } from 'web-vitals';

onLCP((metric) => {
  console.log('LCP:', metric.value);
  sendToAnalytics({
    name: 'LCP',
    value: metric.value,
    rating: metric.rating,
  });
});

// 优化图片
<img 
  src="hero.jpg" 
  loading="eager"
  fetchpriority="high"
  alt="Hero"
/>`,
    },
    {
      title: '2. FID/INP（First Input Delay / Interaction to Next Paint）',
      category: 'Web Vitals',
      what: 'FID 衡量首次交互延迟，INP 衡量所有交互的响应延迟（新标准）',
      why: '直接影响用户交互体验，卡顿会导致用户流失',
      how: '减少主线程任务、拆分长任务、使用 Web Worker、优化 JavaScript 执行',
      sugar: '交互响应指标',
      scenarios: ['交互密集应用', '表单输入', '按钮点击', '滚动优化'],
      relations: ['与 JavaScript 执行相关', '需要代码分割', '影响用户留存'],
      code: `// 监测 FID 和 INP
import { onFID, onINP } from 'web-vitals';

onFID((metric) => {
  console.log('FID:', metric.value);
});

onINP((metric) => {
  console.log('INP:', metric.value);
});

// 拆分长任务
function processLargeData(data) {
  const chunkSize = 100;
  let index = 0;
  
  function processChunk() {
    const end = Math.min(index + chunkSize, data.length);
    for (; index < end; index++) {
      processItem(data[index]);
    }
    if (index < data.length) {
      setTimeout(processChunk, 0);
    }
  }
  processChunk();
}`,
    },
    {
      title: '3. CLS（Cumulative Layout Shift）',
      category: 'Web Vitals',
      what: '累积布局偏移，衡量页面视觉稳定性，避免内容突然跳动',
      why: '布局跳动会导致误点击，严重影响用户体验',
      how: '固定元素尺寸、避免动态插入内容、使用 transform 代替 top/left',
      sugar: '视觉稳定性指标',
      scenarios: ['广告加载', '图片加载', '字体加载', '动态内容'],
      relations: ['与布局设计相关', '影响用户体验', '需要前端规范'],
      code: `// 监测 CLS
import { onCLS } from 'web-vitals';

onCLS((metric) => {
  console.log('CLS:', metric.value);
});

// 固定图片尺寸
<img 
  src="photo.jpg" 
  width="800" 
  height="600" 
  alt="Photo"
>

// 使用 aspect-ratio
<img 
  src="photo.jpg" 
  style={{ aspectRatio: '16/9', width: '100%' }}
  alt="Photo"
>`,
    },
    {
      title: '4. TTFB（Time to First Byte）',
      category: 'Web Vitals',
      what: '首字节时间，衡量服务器响应速度',
      why: '服务器响应慢会延迟整个页面加载',
      how: '优化服务器性能、使用 CDN、启用缓存、减少重定向',
      sugar: '服务器响应指标',
      scenarios: ['API 优化', 'SSR 优化', 'CDN 配置', '缓存策略'],
      relations: ['影响所有指标', '与后端性能相关', '需要服务器优化'],
      code: `// 监测 TTFB
import { onTTFB } from 'web-vitals';

onTTFB((metric) => {
  console.log('TTFB:', metric.value);
});

// 使用 CDN
module.exports = {
  assetPrefix: 'https://cdn.example.com',
  images: {
    domains: ['cdn.example.com']
  }
};`,
    },
    {
      title: '5. 内存泄漏检测',
      category: '内存分析',
      what: '检测和修复不再使用但未被释放的内存，避免内存持续增长',
      why: '长时间运行后页面变卡、崩溃，影响用户体验',
      how: '使用 Chrome DevTools 分析，清理定时器、事件监听、闭包引用',
      sugar: 'Memory Profiler',
      scenarios: ['SPA 应用', '长时间运行页面', '复杂交互', '数据可视化'],
      relations: ['影响长期稳定性', '需要代码规范', '与生命周期相关'],
      code: `// 正确清理定时器
function Component() {
  useEffect(() => {
    const timer = setInterval(() => {
      console.log('tick');
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
}

// 正确清理事件监听
function Component() {
  useEffect(() => {
    const handler = () => console.log('scroll');
    window.addEventListener('scroll', handler);
    
    return () => window.removeEventListener('scroll', handler);
  }, []);
}`,
    },
    {
      title: '6. Tree Shaking 原理',
      category: '构建优化',
      what: '在打包阶段自动删除未使用的代码（Dead Code Elimination）',
      why: '减少打包体积，提升加载速度',
      how: '使用 ES Module 静态结构，配置构建工具',
      sugar: '代码摇树',
      scenarios: ['第三方库优化', '工具函数', '组件库', '打包优化'],
      relations: ['需要 ESM', '与构建工具配合', '影响包体积'],
      code: `// utils.js - 导出多个函数
export function used() {
  console.log('This is used');
}

export function unused() {
  console.log('This is NOT used');
}

// index.js - 只导入使用的函数
import { used } from './utils';
used(); // unused 会被移除

// package.json 配置
{
  "sideEffects": false,
}

// Webpack 配置
module.exports = {
  mode: 'production',
  optimization: {
    usedExports: true,
    minimize: true,
  }
};`,
    },
    {
      title: '7. 首屏优化策略',
      category: '首屏优化',
      what: '优化用户首次打开页面时的渲染时间（FCP/LCP/TTI）',
      why: '首屏慢是用户流失的首要原因，直接影响转化率',
      how: '资源优化、渲染优化、网络优化、感知优化',
      sugar: '加载体验',
      scenarios: ['电商首页', '内容门户', '营销页面', 'SEO 页面'],
      relations: ['影响所有指标', '需要全方位优化', '与 SEO 相关'],
      code: `// 关键资源预加载
<head>
  <link rel="preload" href="/fonts/main.woff2" as="font" crossorigin>
  <link rel="preload" href="/hero.jpg" as="image">
</head>

// 代码分割与懒加载
import { lazy, Suspense } from 'react';

const HeavyComponent = lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <HeavyComponent />
    </Suspense>
  );
}`,
    },
    {
      title: '8. CDN 策略设计',
      category: 'CDN 优化',
      what: '将静态资源分发到全球边缘节点，用户就近访问',
      why: '缩短网络传输距离，提升资源加载速度与稳定性',
      how: '使用 CDN 服务、配置缓存策略、文件名带 hash',
      sugar: '全球加速',
      scenarios: ['静态资源加速', '视频/图片分发', '跨国业务', '大型应用'],
      relations: ['与缓存策略配合', '影响 TTFB', '需要域名配置'],
      code: `// 缓存策略
location /static/ {
  expires 30d;
  add_header Cache-Control "public, max-age=2592000, immutable";
}

// 文件名 Hash 策略
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name].[hash].js',
      }
    }
  }
});

// Next.js CDN 配置
module.exports = {
  assetPrefix: 'https://cdn.example.com',
};`,
    },
  ];

  const performanceMetrics = [
    { name: 'LCP', desc: '最大内容渲染', target: '< 2.5s' },
    { name: 'FID', desc: '首次输入延迟', target: '< 100ms' },
    { name: 'INP', desc: '交互响应延迟', target: '< 200ms' },
    { name: 'CLS', desc: '累积布局偏移', target: '< 0.1' },
    { name: 'TTFB', desc: '首字节时间', target: '< 600ms' },
    { name: 'FCP', desc: '首次内容绘制', target: '< 1.8s' },
  ];

  const optimizationDimensions = [
    { name: 'Web Vitals', desc: '性能指标监控', icon: '📊' },
    { name: '内存分析', desc: '泄漏检测修复', icon: '🧠' },
    { name: '构建优化', desc: 'Tree Shaking', icon: '🌳' },
    { name: '首屏优化', desc: '加载体验提升', icon: '⚡' },
    { name: 'CDN 策略', desc: '全球加速分发', icon: '🌐' },
    { name: '代码分割', desc: '按需加载', icon: '✂️' },
    { name: '缓存策略', desc: '资源复用', icon: '💾' },
    { name: '监控告警', desc: '持续改进', icon: '🔔' },
  ];

  const resources = [
    { name: 'web-vitals', url: 'https://github.com/GoogleChrome/web-vitals', description: 'Google Web Vitals 官方库' },
    { name: 'Lighthouse', url: 'https://developers.google.com/web/tools/lighthouse', description: '性能审计工具' },
    { name: 'Chrome DevTools', url: 'https://developer.chrome.com/docs/devtools/', description: '浏览器开发者工具' },
    { name: 'web.dev', url: 'https://web.dev/vitals/', description: 'Google 性能优化指南' },
    { name: 'Webpack', url: 'https://webpack.js.org/', description: '模块打包工具' },
    { name: 'Vite', url: 'https://vitejs.dev/', description: '现代前端构建工具' },
  ];

  const summary = {
    philosophy: '性能优化 = 监控指标 + 诊断分析 + 优化实施 + 持续改进',
    core: '提升用户体验，降低流失率，支撑业务增长',
    suggestion: '先建立监控体系，再针对性优化，持续迭代改进',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50 p-4 sm:p-6">
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
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl shadow-lg mb-4">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-gray-800">
            高级性能优化
          </h1>
          <p className="text-gray-600">
            系统掌握前端性能优化技术，构建高性能 Web 应用
          </p>
        </div>

        {/* 核心理念卡片 */}
        <Card className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">性能优化核心理念</h2>
          <div className="space-y-3">
            <div className="p-4 bg-white rounded-lg">
              <p className="text-sm text-gray-700">
                <span className="font-semibold text-purple-700">一句话定义：</span>
                {summary.philosophy}
              </p>
            </div>
            <div className="p-4 bg-white rounded-lg">
              <p className="text-sm text-gray-700">
                <span className="font-semibold text-blue-700">核心目标：</span>
                {summary.core}
              </p>
            </div>
            <div className="p-4 bg-white rounded-lg">
              <p className="text-sm text-gray-700">
                <span className="font-semibold text-indigo-700">优化建议：</span>
                {summary.suggestion}
              </p>
            </div>
          </div>
        </Card>

        {/* 八大优化维度 */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-purple-600" />
            八大优化维度
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {optimizationDimensions.map((dimension, idx) => (
              <div key={idx} className="p-4 rounded-lg bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200">
                <div className="text-3xl mb-2">{dimension.icon}</div>
                <h3 className="font-semibold text-gray-800 mb-1">{dimension.name}</h3>
                <p className="text-sm text-gray-600">{dimension.desc}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* 性能指标 */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">核心性能指标</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {performanceMetrics.map((metric, idx) => (
              <div key={idx} className="p-4 rounded-lg bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200">
                <h3 className="font-semibold text-gray-800 mb-1">{metric.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{metric.desc}</p>
                <span className="text-xs text-purple-600 font-medium">目标: {metric.target}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* 内容区域 */}
        <div className="space-y-6 mb-8">
          {sections.map((section, idx) => (
            <Card key={idx} id={`section-${idx + 1}`} className="p-6 bg-white/80 backdrop-blur-sm scroll-mt-20">
              {/* 标题和分类 */}
              <div className="flex items-start gap-3 mb-4">
                <CheckCircle2 className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">{section.title}</h2>
                  <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">
                    {section.category}
                  </span>
                </div>
              </div>

              {/* 核心信息卡片 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="p-4 rounded-lg bg-gradient-to-r from-purple-50 to-blue-50 border-l-4 border-purple-500">
                  <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <span className="text-purple-600">💡</span>
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

                <div className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 border-l-4 border-blue-500">
                  <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <span className="text-blue-600">⚙️</span>
                    怎么做
                  </h3>
                  <p className="text-sm text-gray-700">{section.how}</p>
                </div>

                <div className="p-4 rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-500">
                  <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <span className="text-amber-600">🍬</span>
                    语法糖
                  </h3>
                  <p className="text-sm text-gray-700">{section.sugar}</p>
                </div>
              </div>

              {/* 使用场景 */}
              <div className="mb-4">
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  使用场景
                </h3>
                <div className="flex flex-wrap gap-2">
                  {section.scenarios.map((scenario, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"
                    >
                      {scenario}
                    </span>
                  ))}
                </div>
              </div>

              {/* 关联关系 */}
              <div className="mb-4">
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <span className="text-blue-600">🔗</span>
                  关联关系
                </h3>
                <ul className="space-y-1">
                  {section.relations.map((relation, i) => (
                    <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                      <span className="text-blue-400 flex-shrink-0 mt-0.5">•</span>
                      <span>{relation}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 代码示例 */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <span className="text-indigo-600">💻</span>
                  代码示例
                </h3>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{section.code}</code>
                </pre>
              </div>
            </Card>
          ))}
        </div>

        {/* 学习资源 */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">学习资源</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {resources.map((resource, idx) => (
              <a
                key={idx}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-lg bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 hover:shadow-lg transition-all group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 group-hover:text-purple-600 transition-colors mb-1">
                      {resource.name}
                    </h3>
                    <p className="text-sm text-gray-600">{resource.description}</p>
                  </div>
                  <span className="text-purple-400 group-hover:text-purple-600 transition-colors">→</span>
                </div>
              </a>
            ))}
          </div>
        </Card>

        {/* 性能优化体系图 */}
        <Card className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">性能优化体系关系图</h2>
          <div className="bg-white rounded-lg p-6">
            <pre className="text-sm text-gray-700 overflow-x-auto">
{`┌────────────────────────────────────────────┐
│         高级性能优化体系图谱               │
├────────────────────────────────────────────┤
│  Web Vitals ←→ 首屏优化 ←→ CDN 策略        │
│         ↑             ↓                   │
│   内存泄漏分析 ←→ Tree Shaking ←→ 构建优化 │
└────────────────────────────────────────────┘`}
            </pre>
          </div>
          <div className="mt-4 space-y-2 text-sm text-gray-700">
            <p>• <strong>Web Vitals</strong> 是性能指标体系，用于监控和衡量</p>
            <p>• <strong>首屏优化</strong> 和 <strong>CDN 策略</strong> 是用户体验优化</p>
            <p>• <strong>Tree Shaking</strong> 是构建体积优化</p>
            <p>• <strong>内存泄漏分析</strong> 是运行时稳定性优化</p>
            <p>• 它们共同支撑"性能监控 → 诊断 → 优化 → 持续改进"的闭环</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
