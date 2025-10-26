'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Code2, Sparkles, Zap, Crown, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

interface Skill {
  title: string;
  items: string[];
  slug: string;
}

interface Level {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  skills: Skill[];
  tools: string[];
  practices: string[];
}

export default function FrontendPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeLevel, setActiveLevel] = useState<string>('junior');

  // 从 URL 参数中读取级别
  useEffect(() => {
    const level = searchParams.get('level');
    if (level && ['junior', 'mid', 'senior'].includes(level)) {
      setActiveLevel(level);
    }
  }, [searchParams]);

  // 工具与框架的 URL 映射
  const toolUrls: Record<string, string> = {
    // 初级工具
    'HTML 原生': 'https://developer.mozilla.org/zh-CN/docs/Web/HTML',
    'CSS 原生': 'https://developer.mozilla.org/zh-CN/docs/Web/CSS',
    'JS 原生': 'https://developer.mozilla.org/zh-CN/docs/Web/JavaScript',
    'jQuery': 'https://jquery.com/',
    'Bootstrap': 'https://getbootstrap.com/',
    'Tailwind CSS': 'https://tailwindcss.com/',
    'VS Code': 'https://code.visualstudio.com/',
    'Chrome DevTools': 'https://developer.chrome.com/docs/devtools/',
    // 中级工具
    'React': 'https://react.dev/',
    'Vue': 'https://cn.vuejs.org/',
    'Angular': 'https://angular.io/',
    'Webpack': 'https://webpack.js.org/',
    'Vite': 'https://vitejs.dev/',
    'TypeScript': 'https://www.typescriptlang.org/',
    'Jest': 'https://jestjs.io/',
    'Enzyme': 'https://enzymejs.github.io/enzyme/',
    'Ant Design': 'https://ant.design/',
    'Material-UI': 'https://mui.com/',
    'ESLint': 'https://eslint.org/',
    'Prettier': 'https://prettier.io/',
    // 高级工具
    'Next.js': 'https://nextjs.org/',
    'Nuxt.js': 'https://nuxt.com/',
    'Svelte': 'https://svelte.dev/',
    '高级 TypeScript': 'https://www.typescriptlang.org/docs/handbook/intro.html',
    'Sentry': 'https://sentry.io/',
    'New Relic': 'https://newrelic.com/',
    'Docker': 'https://www.docker.com/',
    'Kubernetes': 'https://kubernetes.io/',
    'Three.js': 'https://threejs.org/',
    'D3.js': 'https://d3js.org/',
    'Nx': 'https://nx.dev/',
    'Turborepo': 'https://turbo.build/',
  };

  // 实践经验的练习平台映射
  const practiceUrls: Record<string, string> = {
    '构建静态页面': 'https://www.freecodecamp.org/',
    '简单交互网站': 'https://www.freecodecamp.org/',
    '基础调试（console.log）': 'https://developer.chrome.com/docs/devtools/',
    'Git 版本控制基础': 'https://learngitbranching.js.org/',
    '代码可读性（DRY 原则）': 'https://refactoring.guru/',
    '开发单页应用（SPA）': 'https://react.dev/learn',
    '代码审查与重构': 'https://refactoring.guru/',
    '集成后端 API（CRUD）': 'https://jsonplaceholder.typicode.com/',
    'Lighthouse 性能优化': 'https://web.dev/measure/',
    'Git 分支管理': 'https://learngitbranching.js.org/',
    '团队协作（PR）': 'https://github.com/',
    '领导项目架构': 'https://github.com/topics/architecture',
    '性能瓶颈诊断': 'https://web.dev/vitals/',
    '编写组件库': 'https://storybook.js.org/',
    '大规模应用优化': 'https://web.dev/',
    '开源贡献': 'https://github.com/explore',
    '技术选型与决策': 'https://stackshare.io/',
  };

  const handleToolClick = (tool: string) => {
    const url = toolUrls[tool] || 'https://www.google.com/search?q=' + encodeURIComponent(tool);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handlePracticeClick = (practice: string) => {
    const url = practiceUrls[practice] || 'https://www.google.com/search?q=' + encodeURIComponent(practice + ' 教程');
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const levels: Level[] = [
    {
      id: 'junior',
      name: '初级',
      icon: Sparkles,
      color: 'text-green-600',
      bgColor: 'from-green-500 to-emerald-500',
      skills: [
        {
          title: 'HTML5 基础',
          items: ['标记与结构', '多媒体支持', '图形与绘制', '表单功能', 'API 与交互', '数据存储', '性能优化', '可访问性', '离线与应用', '扩展技术', 'CSS 集成'],
          slug: 'html5',
        },
        {
          title: 'CSS 基础',
          items: ['选择器', '盒模型', '视觉格式模型', '颜色和背景', '文本和字体', '边框', '表格', '列表', '生成内容', '分页媒体', '媒体查询', '动画与过渡', '变换', 'Flexbox 和 Grid'],
          slug: 'css',
        },
        {
          title: 'JavaScript 基础',
          items: ['核心语法', '数据类型', '函数', '对象', '数组', 'DOM 操作', '事件处理', 'BOM'],
          slug: 'javascript',
        },
        {
          title: '浏览器原理',
          items: ['整体架构', '多进程模型', '网络加载', '解析过程', '渲染管道', 'JS 引擎', '安全机制', '优化技术', '引擎比较'],
          slug: 'browser',
        },
      ],
      tools: ['HTML 原生', 'CSS 原生', 'JS 原生', 'jQuery', 'Bootstrap', 'Tailwind CSS', 'VS Code', 'Chrome DevTools'],
      practices: ['构建静态页面', '简单交互网站', '基础调试（console.log）', 'Git 版本控制基础', '代码可读性（DRY 原则）'],
    },
    {
      id: 'mid',
      name: '中级',
      icon: Zap,
      color: 'text-blue-600',
      bgColor: 'from-blue-500 to-cyan-500',
      skills: [
        {
          title: 'ES6+ 特性',
          items: [
            'let 与 const',
            '箭头函数',
            '默认参数、剩余参数、展开运算符',
            '解构赋值',
            '对象字面量增强',
            '对象与数组方法增强',
            'class / extends / super',
            '类私有字段 / 静态块',
            '模块化 import/export',
            'Promise / async / await',
            '迭代器与生成器',
            '异步迭代器 for await...of',
            '模板字符串',
            '新数据类型与集合结构',
            '可选链 ?. 与 空值合并 ??',
            '逻辑赋值运算符',
            'Proxy 与 Reflect',
            '顶层 await',
            '指数运算符 **',
            '正则增强',
          ],
          slug: 'es6',
        },
        {
          title: 'React 开发',
          items: [
            '组件 (Component)',
            'JSX',
            'Props',
            'State',
            '虚拟 DOM',
            '单向数据流',
            '事件系统',
            'useState',
            'useEffect',
            'useMemo',
            'useCallback',
            'useRef',
            'useContext',
            'useReducer',
            'useLayoutEffect',
            'useImperativeHandle',
            'useId',
            'useTransition',
            'useDeferredValue',
            'Context',
            'React.memo',
            'Portals',
            'ForwardRef',
            'Suspense',
            'ErrorBoundary',
            'Fragments',
            '受控组件',
            '非受控组件',
            '复合组件模式',
            'Render Props',
            '自定义 Hooks',
            '高阶组件 (HOC)',
          ],
          slug: 'react',
        },
        {
          title: 'Vue 开发',
          items: [
            '声明式渲染',
            '响应式系统',
            '虚拟 DOM',
            '组件',
            '插值语法',
            'v-bind',
            'v-on',
            'v-if / v-else / v-show',
            'v-for',
            'v-model',
            'ref()',
            'reactive()',
            'computed()',
            'watch()',
            'watchEffect()',
            '生命周期钩子',
            'provide / inject',
            'toRefs / toRef',
            'Custom Hooks',
            'Props',
            'Emits / $emit',
            'v-model 组件化',
            '插槽 (Slot)',
            '作用域插槽',
            '动态组件',
            'KeepAlive',
            'Teleport',
            'Transition / TransitionGroup',
          ],
          slug: 'vue',
        },
        {
          title: 'Redux',
          items: [
            'Store',
            'Action',
            'Reducer',
            'Dispatch',
            'Selector',
            'configureStore()',
            'createSlice()',
            'createAsyncThunk()',
            'useSelector() / useDispatch()',
            'createEntityAdapter()',
            '中间件（Middleware）',
            'combineReducers()',
            'DevTools 支持',
          ],
          slug: 'redux',
        },
        {
          title: 'Context API',
          items: [
            'Context（上下文）',
            'Provider（提供者）',
            'Consumer（消费者）',
            'useContext Hook',
            'Context 嵌套 / 多上下文',
            '自定义 Hook 封装',
            '性能优化（useMemo）',
            'useReducer + Context',
            '多 Context 聚合',
          ],
          slug: 'context-api',
        },
        {
          title: 'Zustand',
          items: [
            'Store（状态仓库）',
            'set / get',
            'Selector（选择器）',
            'Action（状态动作）',
            'persist（持久化）',
            'devtools（开发工具）',
            'immer（不可变更新）',
            '中间件组合',
            '状态切片（Slices）',
            'TypeScript 支持',
            'Subscribe（订阅）',
          ],
          slug: 'zustand',
        },
        {
          title: 'MobX',
          items: [
            'observable（可观察状态）',
            'computed（派生值）',
            'action（状态修改逻辑）',
            'reaction（副作用响应）',
            'autorun（自动执行追踪函数）',
            'observer（React 组件装饰器）',
            'makeAutoObservable（推荐）',
            'Domain Store 模式',
            'mobx-react-lite（推荐）',
          ],
          slug: 'mobx',
        },
        {
          title: 'Pinia',
          items: [
            'Store',
            'State',
            'Getter',
            'Action',
            '创建 Store（defineStore）',
            '组合式语法（Setup Store）',
            'storeToRefs',
            '插件机制（Plugin）',
            '订阅与持久化',
            'TypeScript 支持',
            'DevTools 支持',
          ],
          slug: 'pinia',
        },
        {
          title: 'Vuex',
          items: [
            'Store（仓库）',
            'State（状态）',
            'Getters（计算属性）',
            'Mutations（同步修改）',
            'Actions（异步逻辑）',
            'Modules（模块化）',
            'mapState',
            'mapGetters',
            'mapMutations',
            'mapActions',
          ],
          slug: 'vuex',
        },
        {
          title: 'TypeScript',
          items: [
            '基础类型系统',
            'any / unknown / never / void',
            '联合类型与交叉类型',
            '字面量类型',
            '接口（Interface）',
            '类型别名（Type Alias）',
            '函数类型',
            '函数重载',
            '类（Class）',
            '类继承与实现',
            '泛型基础',
            '泛型约束',
            '类型推断',
            '类型断言',
            '类型守卫',
            'keyof 操作符',
            'typeof 操作符',
            '索引访问类型',
            '映射类型',
            '条件类型',
            'infer 关键字',
            '模板字面量类型',
            'satisfies 操作符',
            'Partial & Required',
            'Pick & Omit',
            'Record',
            'Extract & Exclude',
            'ReturnType & Parameters',
            'NonNullable & Awaited',
            '严格模式配置',
          ],
          slug: 'typescript',
        },
        {
          title: '网络与 API',
          items: ['RESTful API', 'GraphQL 基础', '错误处理', 'Token 认证'],
          slug: 'api',
        },
        {
          title: '性能优化',
          items: [
            '代码分割（Code Splitting）',
            '懒加载（Lazy Loading）',
            '预加载与预取',
            '压缩与混淆',
            '缓存策略',
            'SSR / SSG',
            'Critical CSS',
            '减少重排与重绘',
            '虚拟列表',
            'GPU 加速',
            '异步渲染',
            '骨架屏',
            'requestAnimationFrame',
            '事件节流与防抖',
            'Web Worker',
            'Passive Event Listener',
            '预渲染',
            '响应优先队列',
            'CDN 加速',
            'HTTP/2 & HTTP/3',
            '图片优化',
            '字体优化',
            'DNS 预解析',
            '资源合并',
            'Tree-shaking',
            '按环境构建',
            '代码分块',
            '依赖分析',
            '懒编译',
            'Bundleless 架构',
            '内存泄漏检测',
            '对象池',
            '长任务拆分',
            '缓存计算结果',
            '懒初始化',
          ],
          slug: 'performance',
        },
      ],
      tools: ['React', 'Vue', 'Angular', 'Webpack', 'Vite', 'TypeScript', 'Jest', 'Enzyme', 'Ant Design', 'Material-UI', 'ESLint', 'Prettier'],
      practices: ['开发单页应用（SPA）', '代码审查与重构', '集成后端 API（CRUD）', 'Lighthouse 性能优化', 'Git 分支管理', '团队协作（PR）'],
    },
    {
      id: 'senior',
      name: '高级',
      icon: Crown,
      color: 'text-yellow-600',
      bgColor: 'from-yellow-400 to-amber-500',
      skills: [
        {
          title: '架构设计',
          items: [
            '项目结构设计',
            '模块化设计',
            '组件化设计',
            '状态管理架构',
            '数据层设计',
            '路由系统设计',
            '构建与部署',
            '可观测性设计',
            'MVC 架构模式',
            'MVVM 架构模式',
            'Flux/Redux 架构',
            '微前端架构',
            'BFF 架构',
            'SSR/SSG/ISR 架构',
            '依赖注入模式',
          ],
          slug: 'architecture',
        },
        {
          title: '高级性能优化',
          items: [
            'LCP（Largest Contentful Paint）',
            'FID/INP（First Input Delay / Interaction to Next Paint）',
            'CLS（Cumulative Layout Shift）',
            'TTFB（Time to First Byte）',
            '内存泄漏检测',
            'Tree Shaking 原理',
            '首屏优化策略',
            'CDN 策略设计',
          ],
          slug: 'advanced-performance',
        },
        {
          title: 'Web 安全',
          items: [
            'XSS（跨站脚本攻击）',
            'CSRF（跨站请求伪造）',
            'HTTPS + HSTS',
            'CSP（Content Security Policy）',
            'Cookie 安全策略',
            'JWT / Token 认证安全',
            'CORS（跨域资源共享）',
            'SQL 注入与输入验证',
            '包依赖与供应链安全',
            'SRI（Subresource Integrity）',
          ],
          slug: 'security',
        },
        {
          title: '测试与质量',
          items: [
            'TDD（Test-Driven Development）',
            'BDD（Behavior-Driven Development）',
            '单元测试（Unit Test）',
            '集成测试（Integration Test）',
            'E2E 测试（End-to-End）',
            '静态检查（Lint & Type Check）',
            'Mock / Stub / Spy（测试替身）',
            '快照测试（Snapshot Test）',
            '覆盖率分析（Coverage）',
            'CI/CD 集成',
          ],
          slug: 'testing',
        },
        {
          title: '工程化',
          items: [
            'CI/CD 管道（持续集成/持续交付）',
            '自动化部署',
            'Monorepo 管理',
            'Docker 容器化',
            '模块化开发',
            '构建工具体系（打包+编译+优化）',
            '代码规范与质量保障',
            '环境与配置管理',
            '依赖管理与版本控制',
            '脚手架与自动生成',
            '持续监控与分析（性能+错误）',
          ],
          slug: 'engineering',
        },
        {
          title: '跨平台与新技术',
          items: [
            'PWA（Progressive Web App）',
            'WebAssembly（WASM）',
            'WebGPU（取代 WebGL）',
            'WebXR（AR/VR）',
            'Web3 / DApp',
            'AI 前端集成（Web ML / Edge AI）',
            '跨平台框架',
            'Edge Runtime / Edge Functions',
          ],
          slug: 'cross-platform',
        },
      ],
      tools: ['Next.js', 'Nuxt.js', 'Svelte', '高级 TypeScript', 'Sentry', 'New Relic', 'Docker', 'Kubernetes', 'Three.js', 'D3.js', 'Nx', 'Turborepo'],
      practices: ['领导项目架构', '性能瓶颈诊断', '编写组件库', '大规模应用优化', '开源贡献', '技术选型与决策'],
    },
  ];

  const currentLevel = levels.find((l) => l.id === activeLevel) || levels[0];
  const Icon = currentLevel.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Link href="/study/learn-coding" passHref>
            <Button variant="outline" size="sm" className="hover:bg-white/80 shadow-sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              返回学习编程
            </Button>
          </Link>
        </div>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl shadow-lg mb-3">
            <Code2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-gray-900">
            前端开发技术栈
          </h1>
          <p className="text-sm text-gray-600">
            从初级到高级，系统掌握前端开发技能
          </p>
        </div>

        {/* 级别选择器 */}
        <div className="flex justify-center gap-3 mb-8">
          {levels.map((level) => {
            const LevelIcon = level.icon;
            return (
              <Button
                key={level.id}
                variant={activeLevel === level.id ? 'default' : 'outline'}
                onClick={() => {
                  setActiveLevel(level.id);
                  // 使用 replaceState 只更新 URL，不触发页面导航
                  window.history.replaceState(
                    null,
                    '',
                    `/study/learn-coding/frontend?level=${level.id}`
                  );
                }}
                className={`${
                  activeLevel === level.id
                    ? `bg-gradient-to-r ${level.bgColor} text-white hover:opacity-90`
                    : 'hover:bg-gray-100'
                }`}
              >
                <LevelIcon className="w-4 h-4 mr-2" />
                {level.name}
              </Button>
            );
          })}
        </div>

        {/* 内容区域 */}
        <div className="space-y-6">
          {/* 核心技能 */}
          <Card className="p-6 bg-white/80 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-4">
              <Icon className={`w-6 h-6 ${currentLevel.color}`} />
              <h2 className="text-2xl font-bold text-gray-800">核心技能</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
              {currentLevel.skills.map((skill, idx) => (
                <Card 
                  key={idx} 
                  className="group p-4 bg-gradient-to-br from-white to-gray-50 border border-gray-200 hover:shadow-lg hover:border-primary/30 transition-all duration-300 cursor-pointer h-fit"
                  onClick={() => router.push(`/study/learn-coding/frontend/${activeLevel}/${skill.slug}`)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-gray-800 flex items-center gap-2 group-hover:text-primary transition-colors">
                      <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${currentLevel.bgColor}`} />
                      {skill.title}
                    </h3>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
                  </div>
                  <ul className="space-y-1.5">
                    {skill.items.map((item, i) => (
                      <li 
                        key={i} 
                        className="text-sm text-gray-600 flex items-start gap-2 hover:text-primary transition-colors cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/study/learn-coding/frontend/${activeLevel}/${skill.slug}#section-${i + 1}`);
                        }}
                      >
                        <span className="text-gray-400 flex-shrink-0 mt-0.5">•</span>
                        <span className="flex-1">{item}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>
          </Card>

          {/* 工具与框架 */}
          <Card className="p-6 bg-white/80 backdrop-blur-sm">
            <h2 className="text-xl font-bold text-gray-800 mb-4">常用工具与框架</h2>
            <div className="flex flex-wrap gap-2">
              {currentLevel.tools.map((tool, idx) => (
                <button
                  key={idx}
                  onClick={() => handleToolClick(tool)}
                  className={`px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r ${currentLevel.bgColor} text-white shadow-sm hover:opacity-90 hover:scale-105 transition-all cursor-pointer`}
                >
                  {tool}
                </button>
              ))}
            </div>
          </Card>

          {/* 实践经验 */}
          <Card className="p-6 bg-white/80 backdrop-blur-sm">
            <h2 className="text-xl font-bold text-gray-800 mb-4">实践经验与最佳实践</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {currentLevel.practices.map((practice, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePracticeClick(practice)}
                  className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 hover:shadow-md transition-all cursor-pointer text-left"
                >
                  <span className={`w-6 h-6 rounded-full bg-gradient-to-r ${currentLevel.bgColor} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                    {idx + 1}
                  </span>
                  <span className="text-sm text-gray-700">{practice}</span>
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* 底部提示 */}
        <div className="mt-8 text-center">
          <Card className="inline-block p-4 bg-gradient-to-r from-white/80 to-blue-50/80 backdrop-blur-sm border border-blue-200/50">
            <p className="text-sm text-gray-700">
              💡 提示：点击任意技能卡片，查看详细学习内容和资源
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
