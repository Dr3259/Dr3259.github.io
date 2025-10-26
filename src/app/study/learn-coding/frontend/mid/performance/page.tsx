'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Zap, CheckCircle2, TrendingUp, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function PerformancePage() {
  const sections = [
    {
      title: '1. 代码分割（Code Splitting）',
      category: '加载性能',
      what: '将代码拆分成多个小块，按需加载，而不是一次性加载所有代码',
      why: '减少首屏加载体积，提升首次内容绘制（FCP）速度，用户更快看到页面',
      how: '使用动态 import() 语法，Webpack/Vite 自动分割代码块',
      sugar: '按需加载，用到才下载',
      scenarios: ['路由懒加载', '大型组件延迟加载', '第三方库按需引入', '条件加载功能模块'],
      relations: ['与懒加载配合', '影响 LCP 指标', '减少 JS 主线程阻塞'],
      code: `// React 路由懒加载
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('./Dashboard'));
const Profile = lazy(() => import('./Profile'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Dashboard />
    </Suspense>
  );
}

// Vue 路由懒加载
const routes = [
  {
    path: '/dashboard',
    component: () => import('./Dashboard.vue')
  }
];

// Webpack 魔法注释
import(/* webpackChunkName: "lodash" */ 'lodash');`,
    },
    {
      title: '2. 懒加载（Lazy Loading）',
      category: '加载性能',
      what: '延迟加载非关键资源，如图片、视频、组件等，直到需要时才加载',
      why: '减少初始加载量，节省带宽，提升首屏速度',
      how: '图片使用 loading="lazy"，组件使用 React.lazy() 或 Vue defineAsyncComponent',
      sugar: '看得见才加载',
      scenarios: ['长列表图片', '折叠内容', '标签页切换', '模态框组件'],
      relations: ['与代码分割互补', '配合 Intersection Observer', '优化 LCP'],
      code: `// 图片懒加载
<img src="image.jpg" loading="lazy" alt="描述" />

// React 组件懒加载
const HeavyComponent = lazy(() => import('./HeavyComponent'));

// Vue 组件懒加载
const AsyncComp = defineAsyncComponent(() => 
  import('./AsyncComponent.vue')
);

// Intersection Observer 自定义懒加载
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      observer.unobserve(img);
    }
  });
});`,
    },
    {
      title: '3. 预加载与预取（Preload & Prefetch）',
      category: '加载性能',
      what: 'Preload 提前加载关键资源，Prefetch 预取未来可能需要的资源',
      why: '优化关键渲染路径，提升用户体验，减少等待时间',
      how: '<link rel="preload"> 用于当前页面，<link rel="prefetch"> 用于下一页面',
      sugar: '提前准备，用时即得',
      scenarios: ['关键字体文件', '首屏图片', '下一页面资源', 'Critical CSS'],
      relations: ['与资源优先级配合', '影响 FCP/LCP', '需要权衡带宽'],
      code: `<!-- Preload 关键资源 -->
<link rel="preload" href="font.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="hero.jpg" as="image">
<link rel="preload" href="critical.css" as="style">

<!-- Prefetch 未来资源 -->
<link rel="prefetch" href="/next-page.js">

<!-- DNS 预解析 -->
<link rel="dns-prefetch" href="https://api.example.com">

<!-- Preconnect 预连接 -->
<link rel="preconnect" href="https://cdn.example.com">

// Next.js 自动预取
<Link href="/about" prefetch={true}>About</Link>`,
    },
    {
      title: '4. 压缩与混淆',
      category: '加载性能',
      what: '减少代码体积，移除空格、注释、缩短变量名，使用 Gzip/Brotli 压缩传输',
      why: '减少网络传输时间，降低带宽成本，加快下载速度',
      how: '构建工具自动压缩（Terser/esbuild），服务器启用 Gzip/Brotli',
      sugar: '瘦身传输',
      scenarios: ['生产环境构建', 'CDN 分发', '移动端优化'],
      relations: ['与构建优化配合', '影响 TTFB', '需要服务器支持'],
      code: `// Vite 配置压缩
import { defineConfig } from 'vite';
import compression from 'vite-plugin-compression';

export default defineConfig({
  plugins: [
    compression({
      algorithm: 'brotliCompress',
      ext: '.br'
    })
  ],
  build: {
    minify: 'esbuild', // 或 'terser'
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  }
});

// Nginx 启用 Gzip
gzip on;
gzip_types text/plain text/css application/json application/javascript;
gzip_min_length 1000;`,
    },
    {
      title: '5. 缓存策略',
      category: '加载性能',
      what: '利用浏览器缓存和 HTTP 缓存头，避免重复下载资源',
      why: '二次访问极速加载，减少服务器压力，节省带宽',
      how: 'Cache-Control 强缓存，ETag 协商缓存，Service Worker 离线缓存',
      sugar: '用过的不再下载',
      scenarios: ['静态资源', 'API 响应', 'PWA 离线', 'CDN 分发'],
      relations: ['与版本管理配合', '影响回访速度', '需要缓存失效策略'],
      code: `// HTTP 缓存头
Cache-Control: public, max-age=31536000, immutable  // 强缓存一年
Cache-Control: no-cache  // 协商缓存
ETag: "33a64df551425fcc55e4d42a148795d9f25f89d4"

// Service Worker 缓存
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('v1').then((cache) => {
      return cache.addAll([
        '/',
        '/styles.css',
        '/script.js'
      ]);
    })
  );
});

// Next.js 静态资源缓存
module.exports = {
  async headers() {
    return [
      {
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};`,
    },
    {
      title: '6. SSR / SSG（服务端渲染 / 静态生成）',
      category: '加载性能',
      what: 'SSR 服务端渲染 HTML，SSG 构建时生成静态页面',
      why: '提升首屏速度，改善 SEO，减少白屏时间',
      how: 'Next.js getServerSideProps/getStaticProps，Nuxt asyncData',
      sugar: '服务器先渲染好',
      scenarios: ['SEO 要求高的页面', '内容型网站', '首屏性能优化', '博客文档'],
      relations: ['与 CSR 对比', '影响 FCP/LCP', '需要服务器支持'],
      code: `// Next.js SSR
export async function getServerSideProps() {
  const res = await fetch('https://api.example.com/data');
  const data = await res.json();
  return { props: { data } };
}

// Next.js SSG
export async function getStaticProps() {
  const res = await fetch('https://api.example.com/posts');
  const posts = await res.json();
  return {
    props: { posts },
    revalidate: 60 // ISR 增量静态再生
  };
}

// Nuxt SSR
export default {
  async asyncData({ $axios }) {
    const data = await $axios.$get('/api/data');
    return { data };
  }
};`,
    },
    {
      title: '7. Critical CSS',
      category: '加载性能',
      what: '提取首屏关键 CSS 内联到 HTML，其余 CSS 异步加载',
      why: '避免 CSS 阻塞渲染，加快首屏显示',
      how: '工具提取关键 CSS（Critical/Critters），内联到 <head>',
      sugar: '关键样式先行',
      scenarios: ['首屏优化', '移动端', '低带宽环境'],
      relations: ['与懒加载配合', '影响 FCP', '需要构建工具支持'],
      code: `<!-- 内联关键 CSS -->
<head>
  <style>
    /* 首屏关键样式 */
    .header { background: #fff; }
    .hero { height: 100vh; }
  </style>
  
  <!-- 异步加载完整 CSS -->
  <link rel="preload" href="styles.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
  <noscript><link rel="stylesheet" href="styles.css"></noscript>
</head>

// Vite 插件
import { defineConfig } from 'vite';
import { ViteCritical } from 'vite-plugin-critical';

export default defineConfig({
  plugins: [
    ViteCritical({
      inline: true,
      minify: true
    })
  ]
});`,
    },
    {
      title: '8. 减少重排与重绘',
      category: '渲染性能',
      what: '重排（Reflow）重新计算布局，重绘（Repaint）重新绘制样式',
      why: '重排重绘消耗性能，导致页面卡顿',
      how: '批量修改 DOM，使用 transform/opacity，避免频繁读写样式',
      sugar: '一次性改完',
      scenarios: ['动画优化', '列表渲染', '样式切换', '滚动优化'],
      relations: ['与 GPU 加速配合', '影响 FPS', '需要理解渲染流程'],
      code: `// ❌ 触发多次重排
element.style.width = '100px';
element.style.height = '100px';
element.style.margin = '10px';

// ✅ 批量修改（一次重排）
element.classList.add('new-style');

// ✅ 使用 transform（不触发重排）
element.style.transform = 'translateX(100px)';

// ✅ 读写分离
const width = element.offsetWidth; // 读
element.style.width = width + 10 + 'px'; // 写

// ✅ 使用 DocumentFragment
const fragment = document.createDocumentFragment();
for (let i = 0; i < 100; i++) {
  const div = document.createElement('div');
  fragment.appendChild(div);
}
document.body.appendChild(fragment); // 一次性插入`,
    },
    {
      title: '9. 虚拟列表（Virtual List）',
      category: '渲染性能',
      what: '只渲染可见区域的列表项，滚动时动态更新',
      why: '渲染上千条数据时避免 DOM 过多导致卡顿',
      how: '计算可见区域，只渲染可见项，使用 react-window/vue-virtual-scroller',
      sugar: '只画看得见的',
      scenarios: ['长列表', '表格数据', '聊天记录', '无限滚动'],
      relations: ['与懒加载配合', '影响滚动性能', '需要固定高度或动态计算'],
      code: `// React 虚拟列表
import { FixedSizeList } from 'react-window';

function VirtualList({ items }) {
  const Row = ({ index, style }) => (
    <div style={style}>{items[index]}</div>
  );

  return (
    <FixedSizeList
      height={600}
      itemCount={items.length}
      itemSize={50}
      width="100%"
    >
      {Row}
    </FixedSizeList>
  );
}

// Vue 虚拟列表
<template>
  <RecycleScroller
    :items="items"
    :item-size="50"
    key-field="id"
  >
    <template #default="{ item }">
      <div>{{ item.name }}</div>
    </template>
  </RecycleScroller>
</template>`,
    },
    {
      title: '10. GPU 加速',
      category: '渲染性能',
      what: '利用 GPU 处理 transform、opacity 等属性，避免主线程阻塞',
      why: 'GPU 并行计算能力强，动画更流畅',
      how: '使用 transform/opacity，添加 will-change 提示',
      sugar: '让显卡干活',
      scenarios: ['动画效果', '滚动优化', '视差效果', '游戏渲染'],
      relations: ['与重排重绘配合', '影响 FPS', '需要注意内存占用'],
      code: `// ✅ GPU 加速属性
.element {
  transform: translateZ(0); /* 开启 GPU 加速 */
  will-change: transform; /* 提示浏览器 */
}

// ❌ 触发重排
.element {
  left: 100px; /* 使用 left/top 会触发重排 */
}

// ✅ 使用 transform
.element {
  transform: translateX(100px); /* GPU 加速 */
}

// 动画优化
@keyframes slide {
  from { transform: translateX(0); }
  to { transform: translateX(100px); }
}

.animated {
  animation: slide 1s ease-in-out;
  will-change: transform; /* 动画前提示 */
}`,
    },
    {
      title: '11. 异步渲染',
      category: '渲染性能',
      what: 'React Fiber 将渲染任务拆分，Vue 异步更新队列批量处理',
      why: '避免长任务阻塞主线程，保持页面响应',
      how: 'React 自动分片，Vue nextTick 批量更新',
      sugar: '分批处理不卡顿',
      scenarios: ['复杂组件树', '大量数据更新', '动画与交互并行'],
      relations: ['与时间切片配合', '影响交互响应', '框架内置优化'],
      code: `// React Concurrent Mode
import { startTransition } from 'react';

function handleClick() {
  startTransition(() => {
    // 低优先级更新
    setData(newData);
  });
}

// Vue 异步更新
this.message = 'updated';
console.log(this.$el.textContent); // 还是旧值
this.$nextTick(() => {
  console.log(this.$el.textContent); // 新值
});

// 手动时间切片
function processLargeArray(array) {
  let index = 0;
  function chunk() {
    const end = Math.min(index + 100, array.length);
    for (; index < end; index++) {
      // 处理数据
    }
    if (index < array.length) {
      setTimeout(chunk, 0); // 让出主线程
    }
  }
  chunk();
}`,
    },
    {
      title: '12. 骨架屏（Skeleton Screen）',
      category: '渲染性能',
      what: '在内容加载前显示占位结构，提升感知性能',
      why: '减少白屏时间，让用户感觉更快',
      how: '使用 CSS 或组件库实现占位效果',
      sugar: '先画个轮廓',
      scenarios: ['列表加载', '详情页', '图片加载', '首屏优化'],
      relations: ['与懒加载配合', '影响用户体验', '不影响实际性能'],
      code: `// React 骨架屏
function SkeletonCard() {
  return (
    <div className="skeleton">
      <div className="skeleton-avatar"></div>
      <div className="skeleton-line"></div>
      <div className="skeleton-line short"></div>
    </div>
  );
}

// CSS 实现
.skeleton {
  background: linear-gradient(
    90deg,
    #f0f0f0 25%,
    #e0e0e0 50%,
    #f0f0f0 75%
  );
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

// Ant Design
import { Skeleton } from 'antd';
<Skeleton active loading={loading}>
  <Content />
</Skeleton>`,
    },
    {
      title: '13. requestAnimationFrame',
      category: '渲染性能',
      what: '在浏览器下一次重绘前执行动画，保持 60fps',
      why: '与浏览器刷新率同步，避免掉帧',
      how: '使用 requestAnimationFrame 替代 setInterval',
      sugar: '跟着屏幕刷新走',
      scenarios: ['动画效果', '滚动监听', '游戏循环', '数据可视化'],
      relations: ['与 GPU 加速配合', '影响 FPS', '自动节流'],
      code: `// ❌ 使用 setInterval（可能掉帧）
setInterval(() => {
  element.style.left = left + 'px';
  left += 1;
}, 16);

// ✅ 使用 requestAnimationFrame
function animate() {
  element.style.transform = \`translateX(\${left}px)\`;
  left += 1;
  if (left < 500) {
    requestAnimationFrame(animate);
  }
}
requestAnimationFrame(animate);

// 滚动优化
let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      handleScroll();
      ticking = false;
    });
    ticking = true;
  }
});`,
    },
    {
      title: '14. 事件节流与防抖',
      category: '交互性能',
      what: '节流（Throttle）限制执行频率，防抖（Debounce）延迟执行',
      why: '减少高频事件触发带来的性能开销',
      how: '使用 lodash 或自己实现节流防抖函数',
      sugar: '少干点活',
      scenarios: ['滚动监听', '输入搜索', '窗口 resize', '按钮点击'],
      relations: ['与事件监听配合', '影响交互响应', '需要权衡延迟'],
      code: `// 防抖：最后一次触发后执行
function debounce(fn, delay) {
  let timer = null;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

// 节流：固定时间间隔执行
function throttle(fn, delay) {
  let last = 0;
  return function(...args) {
    const now = Date.now();
    if (now - last >= delay) {
      fn.apply(this, args);
      last = now;
    }
  };
}

// 使用
const handleSearch = debounce((value) => {
  console.log('搜索:', value);
}, 300);

const handleScroll = throttle(() => {
  console.log('滚动位置:', window.scrollY);
}, 100);`,
    },
    {
      title: '15. Web Worker',
      category: '交互性能',
      what: '在后台线程执行 JS，不阻塞主线程',
      why: '复杂计算不影响 UI 响应',
      how: '创建 Worker 实例，通过 postMessage 通信',
      sugar: '开个后台线程',
      scenarios: ['大数据处理', '图像处理', '加密解密', '复杂计算'],
      relations: ['与主线程隔离', '影响交互响应', '需要序列化通信'],
      code: `// 主线程
const worker = new Worker('worker.js');

worker.postMessage({ data: largeArray });

worker.onmessage = (e) => {
  console.log('结果:', e.data);
};

// worker.js
self.onmessage = (e) => {
  const result = processData(e.data);
  self.postMessage(result);
};

function processData(data) {
  // 复杂计算
  return data.map(item => item * 2);
}

// React 中使用
import { useEffect, useState } from 'react';

function useWorker(workerFn) {
  const [result, setResult] = useState(null);
  
  useEffect(() => {
    const worker = new Worker(
      URL.createObjectURL(new Blob([workerFn.toString()]))
    );
    worker.onmessage = (e) => setResult(e.data);
    return () => worker.terminate();
  }, []);
  
  return result;
}`,
    },
    {
      title: '16. Passive Event Listener',
      category: '交互性能',
      what: '标记事件监听器不会调用 preventDefault()，优化滚动性能',
      why: '浏览器可以立即滚动，不用等待事件处理完成',
      how: 'addEventListener 第三个参数设置 { passive: true }',
      sugar: '告诉浏览器我不拦截',
      scenarios: ['滚动监听', '触摸事件', '鼠标滚轮'],
      relations: ['与滚动优化配合', '影响滚动流畅度', 'Chrome 默认 passive'],
      code: `// ✅ Passive 监听器
document.addEventListener('scroll', handleScroll, {
  passive: true // 不会调用 preventDefault
});

document.addEventListener('touchstart', handleTouch, {
  passive: true
});

// ❌ 非 Passive（会阻塞滚动）
document.addEventListener('touchstart', (e) => {
  e.preventDefault(); // 阻止默认行为
  // 处理逻辑
});

// React 中使用
useEffect(() => {
  const handleScroll = () => {
    console.log('scrolling');
  };
  
  window.addEventListener('scroll', handleScroll, {
    passive: true
  });
  
  return () => {
    window.removeEventListener('scroll', handleScroll);
  };
}, []);`,
    },
    {
      title: '17. 预渲染（Prerender）',
      category: '交互性能',
      what: '提前渲染用户可能访问的页面，切换时即时显示',
      why: '页面跳转瞬间完成，提升用户体验',
      how: '使用 <link rel="prerender"> 或 SPA 预加载',
      sugar: '提前画好下一页',
      scenarios: ['SPA 路由切换', '搜索结果预览', '分页导航'],
      relations: ['与预取配合', '影响跳转速度', '需要权衡资源'],
      code: `<!-- 预渲染下一页 -->
<link rel="prerender" href="/next-page">

// React Router 预加载
import { useEffect } from 'react';
import { useRouter } from 'next/router';

function Link({ href, children }) {
  const router = useRouter();
  
  const handleMouseEnter = () => {
    router.prefetch(href); // 鼠标悬停时预加载
  };
  
  return (
    <a href={href} onMouseEnter={handleMouseEnter}>
      {children}
    </a>
  );
}

// Vue Router 预加载
router.beforeEach((to, from, next) => {
  // 预加载下一个路由组件
  if (to.matched.length) {
    to.matched.forEach(record => {
      if (record.components.default) {
        record.components.default();
      }
    });
  }
  next();
});`,
    },
    {
      title: '18. 响应优先队列',
      category: '交互性能',
      what: '区分任务优先级，高优先级任务先执行',
      why: '避免低优先级任务阻塞用户交互',
      how: 'React Scheduler、requestIdleCallback',
      sugar: '重要的先做',
      scenarios: ['用户输入', '动画效果', '数据更新', '后台任务'],
      relations: ['与时间切片配合', '影响交互响应', '框架内置支持'],
      code: `// React 优先级调度
import { startTransition, useDeferredValue } from 'react';

function SearchResults({ query }) {
  // 高优先级：立即更新输入框
  const [input, setInput] = useState('');
  
  // 低优先级：延迟更新搜索结果
  const deferredQuery = useDeferredValue(query);
  
  const handleChange = (e) => {
    setInput(e.target.value);
    startTransition(() => {
      setQuery(e.target.value); // 低优先级
    });
  };
  
  return <input value={input} onChange={handleChange} />;
}

// requestIdleCallback
function backgroundTask() {
  requestIdleCallback((deadline) => {
    while (deadline.timeRemaining() > 0 && tasks.length > 0) {
      const task = tasks.shift();
      task();
    }
    if (tasks.length > 0) {
      backgroundTask(); // 继续处理
    }
  });
}`,
    },
    {
      title: '19. CDN 加速',
      category: '网络性能',
      what: '将静态资源部署到全球边缘节点，就近访问',
      why: '减少网络延迟，提升下载速度',
      how: '使用 Cloudflare、阿里云 CDN 等服务',
      sugar: '离用户更近',
      scenarios: ['静态资源', '图片视频', 'JS/CSS 文件', '字体文件'],
      relations: ['与缓存策略配合', '影响 TTFB', '需要域名配置'],
      code: `<!-- 使用 CDN -->
<script src="https://cdn.jsdelivr.net/npm/react@18/umd/react.production.min.js"></script>
<link href="https://cdn.example.com/styles.css" rel="stylesheet">

// Next.js CDN 配置
module.exports = {
  assetPrefix: 'https://cdn.example.com',
  images: {
    domains: ['cdn.example.com'],
  },
};

// Vite CDN 配置
export default defineConfig({
  base: 'https://cdn.example.com/',
  build: {
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        }
      }
    }
  }
});`,
    },
    {
      title: '20. HTTP/2 & HTTP/3',
      category: '网络性能',
      what: 'HTTP/2 多路复用、头压缩，HTTP/3 基于 QUIC 协议',
      why: '减少连接开销，提升并发性能，降低延迟',
      how: '服务器启用 HTTP/2/3 支持，浏览器自动使用',
      sugar: '更快的网络协议',
      scenarios: ['所有 HTTPS 网站', '高并发请求', '移动网络'],
      relations: ['与资源合并互补', '影响加载速度', '需要 HTTPS'],
      code: `// Nginx 启用 HTTP/2
server {
  listen 443 ssl http2;
  ssl_certificate /path/to/cert.pem;
  ssl_certificate_key /path/to/key.pem;
}

// HTTP/2 Server Push
Link: </styles.css>; rel=preload; as=style
Link: </script.js>; rel=preload; as=script

// Node.js HTTP/2
const http2 = require('http2');
const fs = require('fs');

const server = http2.createSecureServer({
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
});

server.on('stream', (stream, headers) => {
  stream.respond({
    'content-type': 'text/html',
    ':status': 200
  });
  stream.end('<h1>Hello HTTP/2</h1>');
});`,
    },
    {
      title: '21. 图片优化',
      category: '网络性能',
      what: '使用现代格式（WebP/AVIF）、懒加载、响应式图像',
      why: '图片通常占页面体积 50% 以上，优化效果显著',
      how: '<picture> 标签、srcset 属性、图片压缩工具',
      sugar: '图片瘦身',
      scenarios: ['产品图片', '背景图', '头像', '图标'],
      relations: ['与懒加载配合', '影响 LCP', '需要构建工具支持'],
      code: `<!-- 响应式图片 -->
<img 
  srcset="small.jpg 480w, medium.jpg 800w, large.jpg 1200w"
  sizes="(max-width: 600px) 480px, (max-width: 900px) 800px, 1200px"
  src="large.jpg"
  alt="描述"
  loading="lazy"
>

<!-- 现代格式降级 -->
<picture>
  <source srcset="image.avif" type="image/avif">
  <source srcset="image.webp" type="image/webp">
  <img src="image.jpg" alt="描述">
</picture>

// Next.js Image 组件
import Image from 'next/image';

<Image
  src="/photo.jpg"
  width={800}
  height={600}
  alt="描述"
  loading="lazy"
  placeholder="blur"
/>

// 图片压缩（构建时）
import imagemin from 'imagemin';
import imageminWebp from 'imagemin-webp';

await imagemin(['images/*.{jpg,png}'], {
  destination: 'dist/images',
  plugins: [imageminWebp({ quality: 80 })]
});`,
    },
    {
      title: '22. 字体优化',
      category: '网络性能',
      what: '使用 font-display、子集化、预加载字体',
      why: '避免 FOIT（不可见文本闪烁）和 FOUT（无样式文本闪烁）',
      how: 'font-display: swap，preload 字体文件',
      sugar: '字体快速显示',
      scenarios: ['自定义字体', '图标字体', '多语言网站'],
      relations: ['与预加载配合', '影响 FCP', '需要权衡体验'],
      code: `/* font-display 策略 */
@font-face {
  font-family: 'CustomFont';
  src: url('/fonts/custom.woff2') format('woff2');
  font-display: swap; /* 立即显示备用字体 */
}

/* 其他选项 */
font-display: auto;    /* 浏览器默认 */
font-display: block;   /* 短暂阻塞，然后交换 */
font-display: swap;    /* 立即显示备用，加载后交换 */
font-display: fallback; /* 极短阻塞，超时则放弃 */
font-display: optional; /* 极短阻塞，网络慢则放弃 */

<!-- 预加载字体 -->
<link 
  rel="preload" 
  href="/fonts/custom.woff2" 
  as="font" 
  type="font/woff2" 
  crossorigin
>

// 字体子集化（只包含需要的字符）
// 使用 fonttools 或在线工具
pyftsubset font.ttf --text="需要的文字" --output-file=subset.woff2`,
    },
    {
      title: '23. DNS 预解析',
      category: '网络性能',
      what: '提前解析域名，减少 DNS 查询时间',
      why: 'DNS 查询可能耗时 20-120ms',
      how: '<link rel="dns-prefetch">',
      sugar: '提前查 IP',
      scenarios: ['第三方资源', 'API 域名', 'CDN 域名'],
      relations: ['与预连接配合', '影响 TTFB', '轻量级优化'],
      code: `<!-- DNS 预解析 -->
<link rel="dns-prefetch" href="https://api.example.com">
<link rel="dns-prefetch" href="https://cdn.example.com">

<!-- 预连接（DNS + TCP + TLS） -->
<link rel="preconnect" href="https://api.example.com">

<!-- 预取资源 -->
<link rel="prefetch" href="/next-page.js">

// Next.js 自动处理
// 会自动为外部链接添加 dns-prefetch

// 动态添加
const link = document.createElement('link');
link.rel = 'dns-prefetch';
link.href = 'https://api.example.com';
document.head.appendChild(link);`,
    },
    {
      title: '24. 资源合并',
      category: '网络性能',
      what: '合并多个小文件为一个大文件，减少请求数',
      why: 'HTTP/1.1 并发连接有限，减少请求数可提升速度',
      how: 'Webpack/Vite 自动打包，CSS Sprites 合并图片',
      sugar: '多个文件打包成一个',
      scenarios: ['HTTP/1.1 环境', '小文件过多', '图标合并'],
      relations: ['与 HTTP/2 互补', '影响缓存粒度', '需要权衡'],
      code: `// Webpack 合并
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: 10
        }
      }
    }
  }
};

// CSS Sprites
.icon {
  background: url('sprites.png') no-repeat;
}
.icon-home { background-position: 0 0; }
.icon-user { background-position: -32px 0; }

// SVG Sprites
<svg style="display: none;">
  <symbol id="icon-home" viewBox="0 0 24 24">
    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
  </symbol>
</svg>

<svg><use href="#icon-home"/></svg>`,
    },
    {
      title: '25. Tree-shaking',
      category: '构建性能',
      what: '删除未使用的代码，减少打包体积',
      why: '避免引入用不到的代码',
      how: '使用 ES Module，Webpack/Rollup 自动 tree-shake',
      sugar: '摇掉没用的代码',
      scenarios: ['第三方库', '工具函数', '组件库'],
      relations: ['与代码分割配合', '影响包体积', '需要 ESM'],
      code: `// ✅ 支持 Tree-shaking（ESM）
import { debounce } from 'lodash-es';

// ❌ 不支持 Tree-shaking（CommonJS）
const _ = require('lodash');

// package.json 标记副作用
{
  "sideEffects": false, // 所有文件都可 tree-shake
  // 或指定有副作用的文件
  "sideEffects": ["*.css", "*.scss"]
}

// Webpack 配置
module.exports = {
  mode: 'production', // 自动启用 tree-shaking
  optimization: {
    usedExports: true, // 标记未使用导出
    minimize: true // 删除死代码
  }
};

// Vite 默认支持
// 无需配置`,
    },
    {
      title: '26. 按环境构建',
      category: '构建性能',
      what: '开发环境和生产环境使用不同的构建配置',
      why: '开发环境需要调试信息，生产环境需要优化',
      how: 'process.env.NODE_ENV 区分环境',
      sugar: '开发和生产分开',
      scenarios: ['所有项目', '日志输出', '错误提示'],
      relations: ['与压缩配合', '影响包体积', '框架内置支持'],
      code: `// 环境变量
if (process.env.NODE_ENV === 'development') {
  console.log('开发模式');
} else {
  // 生产环境代码会被移除
}

// Vite 环境变量
import.meta.env.MODE // 'development' | 'production'
import.meta.env.PROD // boolean
import.meta.env.DEV // boolean

// .env 文件
VITE_API_URL=https://api.example.com

// 使用
const apiUrl = import.meta.env.VITE_API_URL;

// Webpack DefinePlugin
new webpack.DefinePlugin({
  'process.env.NODE_ENV': JSON.stringify('production'),
  'API_URL': JSON.stringify('https://api.example.com')
});`,
    },
    {
      title: '27. 代码分块（Chunk Split）',
      category: '构建性能',
      what: '将代码拆分为 Vendor、Runtime、业务代码等块',
      why: '提升缓存命中率，减少重复下载',
      how: 'Webpack splitChunks 配置',
      sugar: '分类打包',
      scenarios: ['第三方库', '公共代码', '路由分块'],
      relations: ['与缓存策略配合', '影响加载速度', '需要权衡粒度'],
      code: `// Webpack splitChunks
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        // 第三方库
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: 10
        },
        // 公共代码
        common: {
          minChunks: 2,
          name: 'common',
          priority: 5
        },
        // React 相关
        react: {
          test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
          name: 'react',
          priority: 20
        }
      }
    },
    runtimeChunk: 'single' // 提取 runtime
  }
};

// Vite 手动分块
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'ui-vendor': ['antd', '@ant-design/icons']
        }
      }
    }
  }
});`,
    },
    {
      title: '28. 依赖分析',
      category: '构建性能',
      what: '分析打包体积，找出大包和重复包',
      why: '定位优化目标，避免引入过大依赖',
      how: 'webpack-bundle-analyzer、vite-plugin-visualizer',
      sugar: '看看包有多大',
      scenarios: ['性能优化', '包体积分析', '依赖审查'],
      relations: ['与 tree-shaking 配合', '指导优化方向'],
      code: `// Webpack Bundle Analyzer
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
      reportFilename: 'bundle-report.html'
    })
  ]
};

// Vite Visualizer
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true
    })
  ]
});

// 命令行分析
npm run build -- --report

// 查看包大小
npx bundlephobia <package-name>`,
    },
    {
      title: '29. 懒编译',
      category: '构建性能',
      what: 'Vite 按需编译，只编译访问的文件',
      why: '提升开发服务器启动速度和热更新速度',
      how: 'Vite 默认支持，Webpack 5 实验性支持',
      sugar: '用到才编译',
      scenarios: ['大型项目', '开发环境', '微前端'],
      relations: ['与 HMR 配合', '影响开发体验'],
      code: `// Vite 默认懒编译
// 无需配置，开箱即用

// Webpack 5 实验性懒编译
module.exports = {
  experiments: {
    lazyCompilation: {
      entries: false, // 入口不懒编译
      imports: true, // 动态 import 懒编译
    }
  }
};

// 开发服务器配置
export default defineConfig({
  server: {
    hmr: true, // 热更新
    fs: {
      strict: false // 允许访问工作区外文件
    }
  }
});`,
    },
    {
      title: '30. Bundleless 架构',
      category: '构建性能',
      what: '直接使用 ESM，不打包，浏览器原生加载',
      why: '极快的冷启动和热更新',
      how: 'Vite、Snowpack 等工具',
      sugar: '不打包直接用',
      scenarios: ['开发环境', '现代浏览器', '小型项目'],
      relations: ['与 ESM 配合', '影响开发速度', '生产环境仍需打包'],
      code: `// Vite 开发模式（Bundleless）
// 浏览器直接加载 ESM
import { createApp } from 'vue';
import App from './App.vue';

createApp(App).mount('#app');

// 生产模式（打包）
vite build

// package.json type
{
  "type": "module" // 使用 ESM
}

// 原生 ESM
<script type="module">
  import { add } from './utils.js';
  console.log(add(1, 2));
</script>

// Import Maps
<script type="importmap">
{
  "imports": {
    "vue": "https://cdn.jsdelivr.net/npm/vue@3/dist/vue.esm-browser.js"
  }
}
</script>`,
    },
    {
      title: '31. 内存泄漏检测',
      category: '运行性能',
      what: '检测和修复内存泄漏，避免内存持续增长',
      why: '长时间运行后页面变卡、崩溃',
      how: 'Chrome Performance 工具、Heap Snapshot',
      sugar: '找出内存漏洞',
      scenarios: ['SPA 应用', '长时间运行页面', '复杂交互'],
      relations: ['与事件监听配合', '影响长期稳定性'],
      code: `// ❌ 常见内存泄漏
// 1. 未清理的定时器
const timer = setInterval(() => {}, 1000);
// 忘记 clearInterval(timer)

// 2. 未移除的事件监听
element.addEventListener('click', handler);
// 忘记 removeEventListener

// 3. 闭包引用
function createClosure() {
  const largeData = new Array(1000000);
  return function() {
    console.log(largeData.length);
  };
}

// ✅ 正确清理
useEffect(() => {
  const timer = setInterval(() => {}, 1000);
  const handler = () => {};
  element.addEventListener('click', handler);
  
  return () => {
    clearInterval(timer);
    element.removeEventListener('click', handler);
  };
}, []);

// Chrome DevTools 检测
// 1. Performance -> Memory
// 2. Heap Snapshot -> 对比快照
// 3. Allocation Timeline`,
    },
    {
      title: '32. 对象池',
      category: '运行性能',
      what: '复用频繁创建的对象，避免重复分配内存',
      why: '减少 GC 压力，提升性能',
      how: '维护对象池，取用时从池中获取，用完归还',
      sugar: '对象回收再利用',
      scenarios: ['游戏开发', 'Canvas 动画', '粒子系统', '高频创建对象'],
      relations: ['与内存管理配合', '影响 GC 频率'],
      code: `// 对象池实现
class ObjectPool {
  constructor(createFn, resetFn) {
    this.createFn = createFn;
    this.resetFn = resetFn;
    this.pool = [];
  }
  
  acquire() {
    return this.pool.length > 0
      ? this.pool.pop()
      : this.createFn();
  }
  
  release(obj) {
    this.resetFn(obj);
    this.pool.push(obj);
  }
}

// 使用示例
const particlePool = new ObjectPool(
  () => ({ x: 0, y: 0, vx: 0, vy: 0 }),
  (p) => { p.x = 0; p.y = 0; p.vx = 0; p.vy = 0; }
);

// 获取对象
const particle = particlePool.acquire();
particle.x = 100;

// 归还对象
particlePool.release(particle);`,
    },
    {
      title: '33. 长任务拆分',
      category: '运行性能',
      what: '将长时间运行的任务拆分成小块，避免阻塞主线程',
      why: '保持页面响应，避免卡顿',
      how: 'setTimeout、requestIdleCallback、Web Worker',
      sugar: '分批处理',
      scenarios: ['大数据处理', '复杂计算', '批量 DOM 操作'],
      relations: ['与时间切片配合', '影响交互响应'],
      code: `// ❌ 长任务阻塞
function processLargeArray(array) {
  for (let i = 0; i < array.length; i++) {
    // 处理数据（可能耗时很长）
  }
}

// ✅ 拆分任务
function processLargeArray(array, chunkSize = 100) {
  let index = 0;
  
  function processChunk() {
    const end = Math.min(index + chunkSize, array.length);
    
    for (; index < end; index++) {
      // 处理数据
    }
    
    if (index < array.length) {
      setTimeout(processChunk, 0); // 让出主线程
    }
  }
  
  processChunk();
}

// 使用 requestIdleCallback
function processWhenIdle(tasks) {
  function work(deadline) {
    while (deadline.timeRemaining() > 0 && tasks.length > 0) {
      const task = tasks.shift();
      task();
    }
    
    if (tasks.length > 0) {
      requestIdleCallback(work);
    }
  }
  
  requestIdleCallback(work);
}`,
    },
    {
      title: '34. 缓存计算结果（Memoization）',
      category: '运行性能',
      what: '缓存函数计算结果，相同输入直接返回缓存',
      why: '避免重复计算，提升性能',
      how: 'React.memo、useMemo、Vue computed',
      sugar: '算过的不再算',
      scenarios: ['复杂计算', '派生数据', '组件渲染优化'],
      relations: ['与纯函数配合', '影响计算性能'],
      code: `// React useMemo
import { useMemo } from 'react';

function ExpensiveComponent({ data }) {
  const result = useMemo(() => {
    // 复杂计算
    return data.map(item => item * 2).filter(item => item > 10);
  }, [data]); // 依赖 data
  
  return <div>{result.length}</div>;
}

// React.memo 组件缓存
const MemoizedComponent = React.memo(({ value }) => {
  return <div>{value}</div>;
});

// Vue computed
export default {
  computed: {
    filteredList() {
      return this.list.filter(item => item.active);
    }
  }
};

// 手动实现 memoize
function memoize(fn) {
  const cache = new Map();
  return function(...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}`,
    },
    {
      title: '35. 懒初始化',
      category: '运行性能',
      what: '延迟资源创建，首次使用时才初始化',
      why: '减少初始化开销，提升启动速度',
      how: '使用 getter、useState 惰性初始化',
      sugar: '用到才创建',
      scenarios: ['大型对象', '图表库', '编辑器', '复杂组件'],
      relations: ['与懒加载配合', '影响启动性能'],
      code: `// React 惰性初始化
import { useState } from 'react';

function Component() {
  // ❌ 每次渲染都执行
  const [state, setState] = useState(expensiveComputation());
  
  // ✅ 只在首次渲染执行
  const [state, setState] = useState(() => expensiveComputation());
}

// 懒初始化类
class Chart {
  constructor() {
    this._instance = null;
  }
  
  get instance() {
    if (!this._instance) {
      this._instance = new ExpensiveChart();
    }
    return this._instance;
  }
}

// Vue 懒加载组件
export default {
  components: {
    HeavyChart: () => import('./HeavyChart.vue')
  }
};

// 单例模式
let instance = null;
export function getInstance() {
  if (!instance) {
    instance = createExpensiveObject();
  }
  return instance;
}`,
    },
  ];

  const metrics = [
    {
      name: 'FCP (First Contentful Paint)',
      desc: '首次内容绘制',
      target: '< 1.8s',
      tool: 'Lighthouse',
    },
    {
      name: 'LCP (Largest Contentful Paint)',
      desc: '最大内容绘制',
      target: '< 2.5s',
      tool: 'Web Vitals',
    },
    {
      name: 'FID (First Input Delay)',
      desc: '首次交互延迟',
      target: '< 100ms',
      tool: 'Web Vitals',
    },
    {
      name: 'CLS (Cumulative Layout Shift)',
      desc: '累积布局偏移',
      target: '< 0.1',
      tool: 'Web Vitals',
    },
    {
      name: 'TTFB (Time to First Byte)',
      desc: '首字节时间',
      target: '< 600ms',
      tool: 'DevTools',
    },
    {
      name: 'FPS (Frame Per Second)',
      desc: '帧率',
      target: '60 fps',
      tool: 'Performance',
    },
  ];

  const resources = [
    { name: 'Web Vitals', url: 'https://web.dev/vitals/', description: 'Google 核心性能指标' },
    { name: 'Lighthouse', url: 'https://developers.google.com/web/tools/lighthouse', description: '性能审计工具' },
    { name: 'Chrome DevTools', url: 'https://developer.chrome.com/docs/devtools/', description: '浏览器开发工具' },
    { name: 'webpack-bundle-analyzer', url: 'https://github.com/webpack-contrib/webpack-bundle-analyzer', description: '包体积分析' },
    { name: 'react-window', url: 'https://github.com/bvaughn/react-window', description: 'React 虚拟列表' },
    { name: 'Workbox', url: 'https://developers.google.com/web/tools/workbox', description: 'PWA 缓存工具' },
  ];

  const summary = {
    philosophy: '性能优化 = 让页面加载更快 + 交互更流畅 + 体验更丝滑 + 能耗更低',
    core: '贯穿构建、传输、渲染、交互全阶段的系统工程',
    suggestion: '先测量后优化，关注核心指标（Core Web Vitals），持续监控',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 p-4 sm:p-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <Link href="/study/learn-coding/frontend?level=mid" passHref>
            <Button variant="outline" size="sm" className="hover:bg-white/80 shadow-sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              返回前端开发
            </Button>
          </Link>
        </div>

        {/* 页面标题 */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl shadow-lg mb-4">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-gray-800">
            前端性能优化
          </h1>
          <p className="text-gray-600">
            系统掌握 2025 年前端性能优化全景图谱，打造极致用户体验
          </p>
        </div>

        {/* 核心理念卡片 */}
        <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 mb-8">
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
                <span className="font-semibold text-pink-700">核心目标：</span>
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

        {/* 性能指标 */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-purple-600" />
            核心性能指标
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {metrics.map((metric, idx) => (
              <div key={idx} className="p-4 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200">
                <h3 className="font-semibold text-gray-800 mb-1">{metric.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{metric.desc}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-green-600 font-medium">目标: {metric.target}</span>
                  <span className="text-gray-500">{metric.tool}</span>
                </div>
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
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-2xl font-bold text-gray-800">{section.title}</h2>
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">
                      {section.category}
                    </span>
                  </div>
                </div>
              </div>

              {/* 核心信息卡片 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="p-4 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 border-l-4 border-purple-500">
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
                  <span className="text-pink-600">🔗</span>
                  关联关系
                </h3>
                <ul className="space-y-1">
                  {section.relations.map((relation, i) => (
                    <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                      <span className="text-pink-400 flex-shrink-0 mt-0.5">•</span>
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
                className="p-4 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 hover:shadow-lg transition-all group"
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

        {/* 总结 */}
        <Card className="p-6 bg-gradient-to-br from-purple-100 to-pink-100 border-2 border-purple-300">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">优化流程建议</h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">1</span>
              <div>
                <h3 className="font-semibold text-gray-800">测量基线</h3>
                <p className="text-sm text-gray-700">使用 Lighthouse、Web Vitals 测量当前性能</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">2</span>
              <div>
                <h3 className="font-semibold text-gray-800">定位瓶颈</h3>
                <p className="text-sm text-gray-700">找出影响最大的性能问题（80/20 原则）</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">3</span>
              <div>
                <h3 className="font-semibold text-gray-800">针对优化</h3>
                <p className="text-sm text-gray-700">应用本文档中的优化技术</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">4</span>
              <div>
                <h3 className="font-semibold text-gray-800">验证效果</h3>
                <p className="text-sm text-gray-700">重新测量，对比优化前后数据</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">5</span>
              <div>
                <h3 className="font-semibold text-gray-800">持续监控</h3>
                <p className="text-sm text-gray-700">建立性能监控体系，防止性能退化</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
