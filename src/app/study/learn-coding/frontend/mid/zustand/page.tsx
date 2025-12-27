'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, BookOpen, ExternalLink, Code, CheckCircle2, TrendingUp, Sparkles, Zap } from 'lucide-react';
import Link from 'next/link';

export default function ZustandPage() {
  const coreConcepts = [
    {
      title: 'Store（状态仓库）',
      what: '一个由 create() 创建的全局状态容器',
      why: '用最小成本替代 React Context + useReducer',
      how: 'const useStore = create(set => ({ count: 0 }))',
      scenarios: ['全局状态管理', '跨组件共享数据'],
      relations: ['包含 state 和 actions'],
      code: `import { create } from 'zustand';

const useStore = create((set) => ({
  count: 0,
  user: null,
  inc: () => set((state) => ({ count: state.count + 1 })),
  dec: () => set((state) => ({ count: state.count - 1 })),
  setUser: (user) => set({ user })
}));

export default useStore;`,
    },
    {
      title: 'set / get',
      what: '修改或获取 state 的函数',
      why: '提供简洁的可控状态更新方式',
      how: '(set, get) => ({ count: 0, inc: () => set({ count: get().count + 1 }) })',
      scenarios: ['状态更新', '获取当前状态'],
      relations: ['set 用于更新状态', 'get 用于读取状态'],
      code: `const useStore = create((set, get) => ({
  count: 0,
  
  // 使用 set 更新状态
  increment: () => set({ count: get().count + 1 }),
  
  // 函数式更新
  incrementBy: (amount) => set((state) => ({ 
    count: state.count + amount 
  })),
  
  // 使用 get 获取当前状态
  reset: () => set({ count: 0 }),
  
  // 复杂逻辑
  doubleAndIncrement: () => {
    const current = get().count;
    set({ count: current * 2 + 1 });
  }
}));`,
    },
    {
      title: 'Selector（选择器）',
      what: '只订阅部分 state',
      why: '提高性能，避免不必要的组件重渲染',
      how: 'useStore(state => state.count)',
      scenarios: ['性能优化', '精准订阅'],
      relations: ['避免全局重渲染'],
      code: `import useStore from './store';

function Counter() {
  // ✅ 只订阅 count，count 变化时才重渲染
  const count = useStore((state) => state.count);
  const inc = useStore((state) => state.inc);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={inc}>增加</button>
    </div>
  );
}

// ❌ 错误：订阅整个 store，任何变化都会重渲染
function BadCounter() {
  const store = useStore();
  return <p>{store.count}</p>;
}

// ✅ 使用 shallow 比较对象
import { shallow } from 'zustand/shallow';

function UserProfile() {
  const { name, email } = useStore(
    (state) => ({ name: state.user.name, email: state.user.email }),
    shallow
  );
  
  return <div>{name} - {email}</div>;
}`,
    },
    {
      title: 'Action（状态动作）',
      what: '改变状态的逻辑函数',
      why: '用于封装状态修改逻辑',
      how: 'inc: () => set(state => ({ count: state.count + 1 }))',
      scenarios: ['业务逻辑封装', '状态更新'],
      relations: ['使用 set 修改状态'],
      code: `const useStore = create((set, get) => ({
  todos: [],
  
  // 同步 action
  addTodo: (title) => set((state) => ({
    todos: [...state.todos, { id: Date.now(), title, done: false }]
  })),
  
  toggleTodo: (id) => set((state) => ({
    todos: state.todos.map(todo =>
      todo.id === id ? { ...todo, done: !todo.done } : todo
    )
  })),
  
  // 异步 action
  fetchTodos: async () => {
    const response = await fetch('/api/todos');
    const todos = await response.json();
    set({ todos });
  },
  
  // 复杂逻辑
  clearCompleted: () => set((state) => ({
    todos: state.todos.filter(todo => !todo.done)
  }))
}));`,
    },
  ];

  const middleware = [
    {
      title: 'persist（持久化）',
      what: '自动将状态存储到 localStorage/sessionStorage',
      scenarios: ['状态持久化', '离线缓存'],
      code: `import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(
  persist(
    (set) => ({
      user: null,
      token: '',
      login: (user, token) => set({ user, token }),
      logout: () => set({ user: null, token: '' })
    }),
    {
      name: 'auth-storage', // localStorage key
      // 可选：使用 sessionStorage
      // storage: createJSONStorage(() => sessionStorage)
    }
  )
);`,
    },
    {
      title: 'devtools（开发工具）',
      what: '连接 Redux DevTools 调试',
      scenarios: ['调试状态变化', '时间旅行'],
      code: `import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

const useStore = create(
  devtools(
    (set) => ({
      count: 0,
      inc: () => set((state) => ({ count: state.count + 1 }), false, 'inc'),
      dec: () => set((state) => ({ count: state.count - 1 }), false, 'dec')
    }),
    { name: 'CounterStore' }
  )
);`,
    },
    {
      title: 'immer（不可变更新）',
      what: '使用 set(produce(...)) 直接可变写法',
      scenarios: ['简化复杂状态更新'],
      code: `import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

const useStore = create(
  immer((set) => ({
    todos: [],
    
    // 使用 immer，可以直接"修改"状态
    addTodo: (title) => set((state) => {
      state.todos.push({ id: Date.now(), title, done: false });
    }),
    
    toggleTodo: (id) => set((state) => {
      const todo = state.todos.find(t => t.id === id);
      if (todo) todo.done = !todo.done;
    })
  }))
);`,
    },
    {
      title: '中间件组合',
      what: '层层增强 store',
      scenarios: ['同时使用多个中间件'],
      code: `import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

const useStore = create(
  devtools(
    persist(
      immer((set) => ({
        todos: [],
        addTodo: (title) => set((state) => {
          state.todos.push({ id: Date.now(), title, done: false });
        })
      })),
      { name: 'todo-storage' }
    ),
    { name: 'TodoStore' }
  )
);`,
    },
  ];

  const advancedFeatures = [
    {
      title: '状态切片（Slices）',
      what: '将 store 拆分为多个模块',
      scenarios: ['大型项目模块化'],
      code: `// userSlice.ts
const createUserSlice = (set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null })
});

// cartSlice.ts
const createCartSlice = (set) => ({
  cart: [],
  addToCart: (item) => set((state) => ({ 
    cart: [...state.cart, item] 
  })),
  clearCart: () => set({ cart: [] })
});

// store.ts
import { create } from 'zustand';

const useStore = create((...a) => ({
  ...createUserSlice(...a),
  ...createCartSlice(...a)
}));

export default useStore;`,
    },
    {
      title: 'TypeScript 支持',
      what: '完整的类型推导',
      scenarios: ['类型安全', '代码提示'],
      code: `import { create } from 'zustand';

interface User {
  id: number;
  name: string;
  email: string;
}

interface StoreState {
  user: User | null;
  count: number;
  setUser: (user: User) => void;
  increment: () => void;
}

const useStore = create<StoreState>()((set) => ({
  user: null,
  count: 0,
  setUser: (user) => set({ user }),
  increment: () => set((state) => ({ count: state.count + 1 }))
}));

// 使用时有完整类型提示
function Component() {
  const user = useStore((state) => state.user);
  const setUser = useStore((state) => state.setUser);
  
  return <div>{user?.name}</div>;
}`,
    },
    {
      title: 'Subscribe（订阅）',
      what: '监听状态变化',
      scenarios: ['副作用处理', '日志记录'],
      code: `const useStore = create((set) => ({
  count: 0,
  inc: () => set((state) => ({ count: state.count + 1 }))
}));

// 订阅所有变化
const unsubscribe = useStore.subscribe((state, prevState) => {
  console.log('State changed:', state);
});

// 订阅特定字段
const unsubscribe = useStore.subscribe(
  (state) => state.count,
  (count, prevCount) => {
    console.log('Count changed from', prevCount, 'to', count);
  }
);

// 取消订阅
unsubscribe();`,
    },
  ];

  const resources = [
    { name: 'Zustand 官方文档', url: 'https://zustand-demo.pmnd.rs/', description: '最权威的 Zustand 学习资源' },
    { name: 'Zustand GitHub', url: 'https://github.com/pmndrs/zustand', description: 'Zustand 源码仓库' },
    { name: 'React 官方文档', url: 'https://react.dev/', description: 'React 官方文档' },
    { name: 'Redux DevTools', url: 'https://github.com/reduxjs/redux-devtools', description: '调试工具' },
    { name: 'Immer', url: 'https://immerjs.github.io/immer/', description: '不可变数据处理' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50 p-4 sm:p-6">
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
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl shadow-lg mb-4">
            <Code className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-gray-800">
            Zustand 完整知识体系
          </h1>
          <p className="text-gray-600">
            掌握 React 生态中极简又强大的状态管理库
          </p>
        </div>

        {/* Zustand 是什么 */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Zustand 是什么</h2>
          <p className="text-gray-700 mb-4">
            Zustand 是一个<span className="font-semibold text-orange-600">轻量级但功能强大</span>的 React 状态管理库，由 Jotai 和 Valtio 同团队（pmndrs）开发。
          </p>
          <p className="text-gray-700 mb-4">
            设计理念：<span className="font-semibold">最小抽象、直接操作、无模板化的状态管理</span>
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">✨ 简洁</h3>
              <p className="text-sm text-gray-600">无需 Provider、dispatch、reducer</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">⚡ 高性能</h3>
              <p className="text-sm text-gray-600">自动选择性渲染</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">🎯 TypeScript 友好</h3>
              <p className="text-sm text-gray-600">完整的类型推导</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">🔌 可扩展</h3>
              <p className="text-sm text-gray-600">丰富的中间件系统</p>
            </div>
          </div>
        </Card>

        {/* 对比表格 */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Zustand vs 其他方案</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-300">
                  <th className="text-left p-3 font-semibold text-gray-800">对比项</th>
                  <th className="text-left p-3 font-semibold text-gray-800">React 原生</th>
                  <th className="text-left p-3 font-semibold text-gray-800">Redux</th>
                  <th className="text-left p-3 font-semibold text-gray-800">Zustand</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="p-3 font-medium">共享状态</td>
                  <td className="p-3 text-gray-600">Context 重渲染多</td>
                  <td className="p-3 text-gray-600">复杂模板</td>
                  <td className="p-3 text-green-600">✨ 简洁</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-3 font-medium">异步支持</td>
                  <td className="p-3 text-gray-600">useEffect 必写逻辑</td>
                  <td className="p-3 text-gray-600">需中间件</td>
                  <td className="p-3 text-green-600">✅ 原生支持</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-3 font-medium">类型支持</td>
                  <td className="p-3 text-gray-600">需泛型包裹</td>
                  <td className="p-3 text-gray-600">冗长</td>
                  <td className="p-3 text-green-600">✅ TS 一等公民</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-3 font-medium">性能</td>
                  <td className="p-3 text-gray-600">Provider 全局渲染</td>
                  <td className="p-3 text-gray-600">复杂优化</td>
                  <td className="p-3 text-green-600">✅ 自动选择性渲染</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-3 font-medium">使用体验</td>
                  <td className="p-3 text-gray-600">写很多样板</td>
                  <td className="p-3 text-gray-600">必须 actions/reducers</td>
                  <td className="p-3 text-green-600">✅ 直接函数式更新</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>

        {/* 核心概念 */}
        <div className="mb-8">
          <Card className="p-6 bg-white/80 backdrop-blur-sm mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="w-6 h-6 text-orange-600" />
              <h2 className="text-2xl font-bold text-gray-800">核心概念</h2>
            </div>
          </Card>

          <div className="space-y-6">
            {coreConcepts.map((concept, idx) => (
              <Card key={idx} id={`section-${idx + 1}`} className="p-6 bg-white/80 backdrop-blur-sm scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <CheckCircle2 className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{concept.title}</h3>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500">
                    <h4 className="font-semibold text-gray-800 mb-2">💡 是什么</h4>
                    <p className="text-sm text-gray-700">{concept.what}</p>
                  </div>

                  <div className="p-4 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500">
                    <h4 className="font-semibold text-gray-800 mb-2">🎯 为什么</h4>
                    <p className="text-sm text-gray-700">{concept.why}</p>
                  </div>

                  <div className="p-4 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 border-l-4 border-purple-500">
                    <h4 className="font-semibold text-gray-800 mb-2">⚡ 怎么用</h4>
                    <code className="text-sm text-gray-700 font-mono">{concept.how}</code>
                  </div>

                  <div className="p-4 rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-500">
                    <h4 className="font-semibold text-gray-800 mb-2">📦 使用场景</h4>
                    <ul className="space-y-1">
                      {concept.scenarios.map((s, i) => (
                        <li key={i} className="text-sm text-gray-700">• {s}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-green-50 border border-green-200 mb-4">
                  <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    关联关系
                  </h4>
                  <ul className="space-y-1">
                    {concept.relations.map((r, i) => (
                      <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="text-green-600 mt-1">→</span>
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">代码示例</h4>
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{concept.code}</code>
                  </pre>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* 中间件 */}
        <div className="mb-8">
          <Card className="p-6 bg-white/80 backdrop-blur-sm mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-800">中间件系统</h2>
            </div>
          </Card>

          <div className="space-y-6">
            {middleware.map((mw, idx) => (
              <Card key={idx} id={`section-${coreConcepts.length + idx + 1}`} className="p-6 bg-white/80 backdrop-blur-sm scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <CheckCircle2 className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{mw.title}</h3>
                    <p className="text-gray-600">{mw.what}</p>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-blue-50 border border-blue-200 mb-4">
                  <h4 className="font-semibold text-gray-800 mb-2">📦 使用场景</h4>
                  <ul className="space-y-1">
                    {mw.scenarios.map((s, i) => (
                      <li key={i} className="text-sm text-gray-700">• {s}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">代码示例</h4>
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{mw.code}</code>
                  </pre>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* 高级特性 */}
        <div className="mb-8">
          <Card className="p-6 bg-white/80 backdrop-blur-sm mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Code className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-800">高级特性</h2>
            </div>
          </Card>

          <div className="space-y-6">
            {advancedFeatures.map((feature, idx) => (
              <Card key={idx} id={`section-${coreConcepts.length + middleware.length + idx + 1}`} className="p-6 bg-white/80 backdrop-blur-sm scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <CheckCircle2 className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.what}</p>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-purple-50 border border-purple-200 mb-4">
                  <h4 className="font-semibold text-gray-800 mb-2">📦 使用场景</h4>
                  <ul className="space-y-1">
                    {feature.scenarios.map((s, i) => (
                      <li key={i} className="text-sm text-gray-700">• {s}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">代码示例</h4>
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{feature.code}</code>
                  </pre>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* 数据流关系图 */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Zustand 数据流关系图</h2>
          <div className="p-4 bg-gray-50 rounded-lg">
            <pre className="text-sm text-gray-700 overflow-x-auto whitespace-pre">
{`组件调用 useStore(selector)
          │
          ▼
  Zustand Store （由 create() 生成）
          │
          ├─ set() —— 修改状态
          ├─ get() —— 获取状态
          ├─ subscribe() —— 监听变化
          ▼
组件仅在 selector 对应值变化时重新渲染

数据流特点：
• 单向（state → component）
• 无 dispatch / reducer 强制约束
• 每个组件只订阅"所需状态片段"`}
            </pre>
          </div>
        </Card>

        {/* 最佳实践 */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">最佳实践</h2>
          <div className="space-y-3">
            <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">✅ Selector 优化</h3>
              <p className="text-sm text-gray-600">避免整 store 重渲染 → useStore(s =&gt; s.count)</p>
            </div>
            <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">✅ 浅比较</h3>
              <p className="text-sm text-gray-600">提升性能 → useStore(selector, shallow)</p>
            </div>
            <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">✅ 拆分 slice</h3>
              <p className="text-sm text-gray-600">模块化状态管理 → combine(userSlice, cartSlice)</p>
            </div>
            <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">✅ 中间件组合</h3>
              <p className="text-sm text-gray-600">可层层增强 store → devtools(persist(...))</p>
            </div>
            <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">✅ TS 类型自动推导</h3>
              <p className="text-sm text-gray-600">函数式定义天然支持 → create&lt;State&gt;()(set =&gt; (...))</p>
            </div>
          </div>
        </Card>

        {/* 学习资源 */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm mb-8">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-6 h-6 text-orange-600" />
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
          <Card className="inline-block p-4 bg-gradient-to-r from-white/80 to-orange-50/80 backdrop-blur-sm border border-orange-200/50">
            <p className="text-sm text-gray-700">
              💡 建议：从基础 Store 开始，掌握 Selector 优化，学习中间件组合，最后实践状态切片
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
