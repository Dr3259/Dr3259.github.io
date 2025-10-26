'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, BookOpen, ExternalLink, Code, CheckCircle2, TrendingUp, Sparkles, Zap, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function ContextAPIPage() {
  const coreConcepts = [
    {
      title: 'Context（上下文）',
      what: '一种全局数据传递机制',
      why: '解决 props drilling（层层传递）问题',
      how: 'const MyContext = React.createContext(defaultValue)',
      scenarios: ['跨层级数据共享', '避免 props 层层传递'],
      relations: ['包含 Provider 和 Consumer'],
      code: `import { createContext } from 'react';

// 创建 Context，提供默认值
const ThemeContext = createContext('light');

// 创建带类型的 Context
interface User {
  name: string;
  email: string;
}

const UserContext = createContext<User | null>(null);

export { ThemeContext, UserContext };`,
    },
    {
      title: 'Provider（提供者）',
      what: '提供 context 数据的组件',
      why: '定义数据源，包裹子组件',
      how: '<MyContext.Provider value={data}>...</MyContext.Provider>',
      scenarios: ['提供全局数据', '定义数据源'],
      relations: ['向下传递 value 给所有子组件'],
      code: `import { ThemeContext } from './ThemeContext';
import { useState } from 'react';

function App() {
  const [theme, setTheme] = useState('light');

  return (
    <ThemeContext.Provider value={theme}>
      <Toolbar />
      <button onClick={() => setTheme('dark')}>
        切换主题
      </button>
    </ThemeContext.Provider>
  );
}

// 动态更新 Context
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}`,
    },
    {
      title: 'Consumer（消费者）',
      what: '获取 context 数据的组件',
      why: '在类组件中消费 context',
      how: '<MyContext.Consumer>{value => ...}</MyContext.Consumer>',
      scenarios: ['类组件中使用', '已被 useContext 替代'],
      relations: ['从 Provider 获取 value'],
      code: `import { ThemeContext } from './ThemeContext';

// Consumer 方式（旧方式）
function Toolbar() {
  return (
    <ThemeContext.Consumer>
      {theme => (
        <button className={theme}>
          Click me
        </button>
      )}
    </ThemeContext.Consumer>
  );
}

// 类组件中使用
class Toolbar extends React.Component {
  static contextType = ThemeContext;
  
  render() {
    const theme = this.context;
    return <button className={theme}>Click me</button>;
  }
}`,
    },
    {
      title: 'useContext Hook',
      what: '获取 context 值的 hook',
      why: '函数组件中快速访问上下文',
      how: 'const value = useContext(MyContext)',
      scenarios: ['函数组件消费 Context', '替代 Consumer'],
      relations: ['是 Consumer 的语法糖'],
      code: `import { useContext } from 'react';
import { ThemeContext } from './ThemeContext';

function Toolbar() {
  // ✅ 推荐：使用 useContext
  const theme = useContext(ThemeContext);
  
  return (
    <button className={theme}>
      Click me
    </button>
  );
}

// 使用动态 Context
function ThemeButton() {
  const { theme, setTheme } = useContext(ThemeContext);
  
  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      Current: {theme}
    </button>
  );
}`,
    },
    {
      title: 'Context 嵌套 / 多上下文',
      what: '多个 Context 同时使用',
      why: '管理多维全局状态',
      how: '<UserContext.Provider><ThemeContext.Provider>...',
      scenarios: ['多个独立状态', '避免单一 Context 臃肿'],
      relations: ['多个 Provider 可以嵌套'],
      code: `import { UserContext, ThemeContext } from './contexts';

function App() {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('light');

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <ThemeContext.Provider value={{ theme, setTheme }}>
        <Layout />
      </ThemeContext.Provider>
    </UserContext.Provider>
  );
}

// 使用多个 Context
function Header() {
  const { user } = useContext(UserContext);
  const { theme } = useContext(ThemeContext);
  
  return (
    <header className={theme}>
      Welcome, {user?.name}
    </header>
  );
}`,
    },
  ];

  const advancedPatterns = [
    {
      title: '自定义 Hook 封装',
      what: '抽象 Context 操作逻辑',
      scenarios: ['减少重复调用 useContext', '提供更好的 API'],
      code: `// theme-context.tsx
import { createContext, useContext, useState, ReactNode } from 'react';

interface ThemeContextType {
  theme: string;
  setTheme: (theme: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState('light');

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// ✅ 自定义 Hook
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

// 使用
function Button() {
  const { theme, setTheme } = useTheme();
  return <button onClick={() => setTheme('dark')}>{theme}</button>;
}`,
    },
    {
      title: '性能优化（useMemo）',
      what: '避免 value 对象变化导致重渲染',
      scenarios: ['Provider value 包含对象', '性能敏感场景'],
      code: `import { createContext, useState, useMemo } from 'react';

const UserContext = createContext();

function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  // ✅ 使用 useMemo 避免每次渲染创建新对象
  const value = useMemo(() => ({
    user,
    setUser
  }), [user]);

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

// ❌ 错误：每次渲染都创建新对象
function BadUserProvider({ children }) {
  const [user, setUser] = useState(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}`,
    },
    {
      title: 'useReducer + Context',
      what: '模拟 Redux 流程',
      scenarios: ['复杂状态管理', '小型状态中心'],
      code: `import { createContext, useContext, useReducer } from 'react';

// Reducer
const reducer = (state, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + 1 };
    case 'DECREMENT':
      return { count: state.count - 1 };
    default:
      return state;
  }
};

// Context
const CountContext = createContext();

// Provider
export const CountProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, { count: 0 });

  return (
    <CountContext.Provider value={{ state, dispatch }}>
      {children}
    </CountContext.Provider>
  );
};

// Custom Hook
export const useCount = () => useContext(CountContext);

// 使用
function Counter() {
  const { state, dispatch } = useCount();

  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: 'INCREMENT' })}>+</button>
      <button onClick={() => dispatch({ type: 'DECREMENT' })}>-</button>
    </div>
  );
}`,
    },
    {
      title: '多 Context 聚合（AppProvider）',
      what: '避免多重嵌套',
      scenarios: ['大型应用', '多个 Context 管理'],
      code: `import { UserProvider } from './UserContext';
import { ThemeProvider } from './ThemeContext';
import { AuthProvider } from './AuthContext';

// ✅ 聚合 Provider
export const AppProvider = ({ children }) => {
  return (
    <UserProvider>
      <ThemeProvider>
        <AuthProvider>
          {children}
        </AuthProvider>
      </ThemeProvider>
    </UserProvider>
  );
};

// 使用
function App() {
  return (
    <AppProvider>
      <Layout />
    </AppProvider>
  );
}`,
    },
  ];

  const resources = [
    { name: 'React 官方文档 - Context', url: 'https://react.dev/reference/react/createContext', description: 'Context API 官方文档' },
    { name: 'React 中文文档', url: 'https://zh-hans.react.dev/', description: 'React 官方中文文档' },
    { name: 'useContext Hook', url: 'https://react.dev/reference/react/useContext', description: 'useContext 详细说明' },
    { name: 'React Patterns', url: 'https://reactpatterns.com/', description: 'React 设计模式' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50 to-cyan-50 p-4 sm:p-6">
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
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-2xl shadow-lg mb-4">
            <Code className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-gray-800">
            Context API 完整知识体系
          </h1>
          <p className="text-gray-600">
            掌握 React 官方内置的跨组件状态传递机制
          </p>
        </div>

        {/* Context API 是什么 */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Context API 是什么</h2>
          <p className="text-gray-700 mb-4">
            Context API 是<span className="font-semibold text-teal-600"> React 官方提供的</span>、用于在组件树中共享数据而无需逐层传递 props 的机制。
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">✅ 官方内置</h3>
              <p className="text-sm text-gray-600">无需安装额外依赖</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">🎯 解决 Props Drilling</h3>
              <p className="text-sm text-gray-600">避免层层传递 props</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">🔄 单向数据流</h3>
              <p className="text-sm text-gray-600">Provider → Consumer</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">⚡ 简单高效</h3>
              <p className="text-sm text-gray-600">适合小中型应用</p>
            </div>
          </div>
        </Card>

        {/* 为什么存在 */}
        <Card className="p-6 bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">为什么存在 Context API？</h2>
          <div className="space-y-3">
            <div className="p-3 bg-white rounded-lg">
              <p className="text-sm text-gray-700">
                <span className="font-semibold text-red-600">问题：</span>
                React 原本的状态流是：父组件 → props → 子组件 → props → 孙组件 …
              </p>
            </div>
            <div className="p-3 bg-white rounded-lg">
              <p className="text-sm text-gray-700">
                <span className="font-semibold text-red-600">痛点：</span>
                当状态需要在很多层级共享时（如用户信息、主题、语言），会导致 "props drilling" 问题
              </p>
            </div>
            <div className="p-3 bg-white rounded-lg">
              <p className="text-sm text-gray-700">
                <span className="font-semibold text-green-600">解决：</span>
                Context API 实现跨层级状态共享，不依赖外部库，保持 React 的声明式与组合式哲学
              </p>
            </div>
          </div>
        </Card>

        {/* 核心概念 */}
        <div className="mb-8">
          <Card className="p-6 bg-white/80 backdrop-blur-sm mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="w-6 h-6 text-teal-600" />
              <h2 className="text-2xl font-bold text-gray-800">核心概念</h2>
            </div>
          </Card>

          <div className="space-y-6">
            {coreConcepts.map((concept, idx) => (
              <Card key={idx} id={`section-${idx + 1}`} className="p-6 bg-white/80 backdrop-blur-sm scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <CheckCircle2 className="w-6 h-6 text-teal-600 flex-shrink-0 mt-1" />
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

        {/* 高级模式 */}
        <div className="mb-8">
          <Card className="p-6 bg-white/80 backdrop-blur-sm mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-800">高级模式与优化</h2>
            </div>
          </Card>

          <div className="space-y-6">
            {advancedPatterns.map((pattern, idx) => (
              <Card key={idx} id={`section-${coreConcepts.length + idx + 1}`} className="p-6 bg-white/80 backdrop-blur-sm scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <CheckCircle2 className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{pattern.title}</h3>
                    <p className="text-gray-600">{pattern.what}</p>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-purple-50 border border-purple-200 mb-4">
                  <h4 className="font-semibold text-gray-800 mb-2">📦 使用场景</h4>
                  <ul className="space-y-1">
                    {pattern.scenarios.map((s, i) => (
                      <li key={i} className="text-sm text-gray-700">• {s}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">代码示例</h4>
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{pattern.code}</code>
                  </pre>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* 数据流关系图 */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Context 数据流关系图</h2>
          <div className="p-4 bg-gray-50 rounded-lg">
            <pre className="text-sm text-gray-700 overflow-x-auto whitespace-pre">
{`Provider（提供数据）
   │
   │ context value
   ▼
Component Tree（任意深度）
   │
   ▼
Consumer / useContext（获取数据）

当 Provider 的 value 变化时：
• 所有订阅该 Context 的组件都会重新渲染
• React 使用严格相等比较（Object.is）检测变更`}
            </pre>
          </div>
        </Card>

        {/* 使用场景 */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">典型使用场景</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">✅ 主题切换</h3>
              <p className="text-sm text-gray-600">ThemeContext → 所有组件共享主题样式</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">✅ 用户信息</h3>
              <p className="text-sm text-gray-600">UserContext → 登录信息全局共享</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">✅ 国际化（i18n）</h3>
              <p className="text-sm text-gray-600">LangContext → 多语言切换</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">✅ 认证状态</h3>
              <p className="text-sm text-gray-600">AuthContext → 全局访问权限控制</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">✅ 配置中心</h3>
              <p className="text-sm text-gray-600">ConfigContext → 动态控制页面行为</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-pink-50 to-rose-50 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">✅ UI 状态管理</h3>
              <p className="text-sm text-gray-600">ModalContext → 控制弹窗、全局提示</p>
            </div>
          </div>
        </Card>

        {/* 性能优化建议 */}
        <Card className="p-6 bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-200 mb-8">
          <div className="flex items-start gap-3 mb-4">
            <AlertCircle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">性能优化建议</h2>
            </div>
          </div>
          <div className="space-y-3">
            <div className="p-3 bg-white rounded-lg">
              <p className="text-sm"><span className="font-semibold text-orange-600">问题：</span> 所有子组件重渲染</p>
              <p className="text-sm text-gray-600">原因：Provider value 对象变化</p>
              <p className="text-sm text-green-600">优化：把 value 放进 useMemo</p>
            </div>
            <div className="p-3 bg-white rounded-lg">
              <p className="text-sm"><span className="font-semibold text-orange-600">问题：</span> 多个独立状态</p>
              <p className="text-sm text-gray-600">原因：单 Context 太臃肿</p>
              <p className="text-sm text-green-600">优化：使用多个 Context 拆分状态</p>
            </div>
            <div className="p-3 bg-white rounded-lg">
              <p className="text-sm"><span className="font-semibold text-orange-600">问题：</span> 局部状态频繁变化</p>
              <p className="text-sm text-gray-600">原因：Context 通知范围太广</p>
              <p className="text-sm text-green-600">优化：结合 useReducer 或 Zustand</p>
            </div>
          </div>
        </Card>

        {/* Context API vs 其他方案 */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Context API vs 其他方案</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-300">
                  <th className="text-left p-3 font-semibold text-gray-800">方案</th>
                  <th className="text-left p-3 font-semibold text-gray-800">关系</th>
                  <th className="text-left p-3 font-semibold text-gray-800">区别</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="p-3 font-medium">Redux</td>
                  <td className="p-3 text-gray-600">可基于 Context 实现</td>
                  <td className="p-3 text-gray-600">Redux 内部实际上也是用 Context 做全局状态传播</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-3 font-medium">Zustand</td>
                  <td className="p-3 text-gray-600">替代 Context + useState</td>
                  <td className="p-3 text-gray-600">Zustand 使用 selector 避免全局重渲染，更轻量</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-3 font-medium">Recoil / Jotai</td>
                  <td className="p-3 text-gray-600">Context 的扩展模型</td>
                  <td className="p-3 text-gray-600">它们以 Context 为底层实现响应式依赖管理</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-3 font-medium">React Query</td>
                  <td className="p-3 text-gray-600">独立状态（数据请求）层</td>
                  <td className="p-3 text-gray-600">常结合 Context 形成 "远程 + 本地" 状态管理</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>

        {/* 学习资源 */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm mb-8">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-6 h-6 text-teal-600" />
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
          <Card className="inline-block p-4 bg-gradient-to-r from-white/80 to-teal-50/80 backdrop-blur-sm border border-teal-200/50">
            <p className="text-sm text-gray-700">
              💡 建议：从基础 Context 开始，掌握 useContext，学习性能优化，最后实践自定义 Hook 封装
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
