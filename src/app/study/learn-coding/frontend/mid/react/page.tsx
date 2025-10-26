'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, BookOpen, ExternalLink, Code, CheckCircle2, TrendingUp, Sparkles, Zap } from 'lucide-react';
import Link from 'next/link';

export default function ReactPage() {
  const coreConcepts = [
    {
      title: '组件 (Component)',
      what: 'React 的最小可复用单元，表示 UI 的一部分',
      why: '将复杂 UI 拆成小模块，可复用、可组合',
      how: 'function Button() { return <button>OK</button> }',
      scenarios: ['所有 React 应用的基本单位'],
      relations: ['与 状态（state）、属性（props）紧密相关', '组件间通过 props 通信'],
      code: `// 函数组件
function Button({ text, onClick }) {
  return <button onClick={onClick}>{text}</button>;
}

// 使用组件
function App() {
  return (
    <div>
      <Button text="点击我" onClick={() => alert('Hello')} />
    </div>
  );
}`,
    },
    {
      title: 'JSX',
      what: '一种语法扩展，让 JS 中能写类似 HTML 的结构',
      why: '提高声明式可读性，替代手写 React.createElement()',
      how: '<div className="box">{msg}</div>',
      scenarios: ['UI 结构声明'],
      relations: ['JSX 最终编译为 React.createElement()', '与组件一一对应'],
      code: `// JSX 语法
const element = <h1 className="title">Hello, {name}!</h1>;

// 等价于
const element = React.createElement(
  'h1',
  { className: 'title' },
  'Hello, ',
  name,
  '!'
);

// JSX 中嵌入表达式
const user = { name: 'Alice', age: 25 };
const greeting = (
  <div>
    <h1>Hello, {user.name}</h1>
    <p>Age: {user.age}</p>
  </div>
);`,
    },
    {
      title: 'Props',
      what: '组件对外传入的参数',
      why: '提高复用性，可配置组件',
      how: '<Card title="Hello" /> → function Card({title}){...}',
      scenarios: ['父→子数据传递'],
      relations: ['单向数据流基础', '与 state 区分'],
      code: `// 定义接收 props 的组件
function Card({ title, content, author }) {
  return (
    <div className="card">
      <h2>{title}</h2>
      <p>{content}</p>
      <small>作者: {author}</small>
    </div>
  );
}

// 使用组件并传递 props
function App() {
  return (
    <Card 
      title="React 入门" 
      content="学习 React 基础知识"
      author="Alice"
    />
  );
}`,
    },
    {
      title: 'State',
      what: '组件内部的可变数据',
      why: '让组件能响应用户交互或异步结果',
      how: 'const [count, setCount] = useState(0)',
      scenarios: ['动态数据场景'],
      relations: ['state 改变 → 触发组件重新渲染'],
      code: `import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>当前计数: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        增加
      </button>
      <button onClick={() => setCount(count - 1)}>
        减少
      </button>
    </div>
  );
}`,
    },
    {
      title: '虚拟 DOM (VDOM)',
      what: '内存中的 UI 树描述对象',
      why: '提高更新性能，减少直接操作真实 DOM',
      how: 'React 自动维护',
      scenarios: ['diff 算法优化渲染'],
      relations: ['state 更新 → diff → 实 DOM 更新'],
      code: `// React 自动管理虚拟 DOM
// 当 state 改变时，React 会：
// 1. 创建新的虚拟 DOM 树
// 2. 与旧的虚拟 DOM 树进行 diff
// 3. 只更新变化的部分到真实 DOM

function App() {
  const [items, setItems] = useState(['A', 'B', 'C']);
  
  // 添加新项时，React 只会添加新的 DOM 节点
  // 而不是重新渲染整个列表
  const addItem = () => {
    setItems([...items, 'New']);
  };
  
  return (
    <div>
      {items.map((item, i) => <div key={i}>{item}</div>)}
      <button onClick={addItem}>添加</button>
    </div>
  );
}`,
    },
    {
      title: '单向数据流',
      what: '数据自顶向下流动',
      why: '保持可预测性和调试性',
      how: 'props → 子组件',
      scenarios: ['复杂组件层级中'],
      relations: ['和 Flux/Redux 思想一致'],
      code: `// 单向数据流示例
function Parent() {
  const [data, setData] = useState('Hello');
  
  return (
    <div>
      <Child data={data} />
      <button onClick={() => setData('World')}>
        改变数据
      </button>
    </div>
  );
}

function Child({ data }) {
  // 子组件只能读取 props，不能直接修改
  return <p>接收到的数据: {data}</p>;
}`,
    },
    {
      title: '事件系统',
      what: 'React 的合成事件机制',
      why: '屏蔽浏览器差异，保持一致事件模型',
      how: 'onClick={() => ...}',
      scenarios: ['所有交互事件'],
      relations: ['React 统一分发、冒泡机制'],
      code: `function EventDemo() {
  const handleClick = (e) => {
    // e 是合成事件对象
    e.preventDefault();
    console.log('点击事件', e.target);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('表单提交');
  };

  return (
    <form onSubmit={handleSubmit}>
      <button onClick={handleClick}>点击</button>
      <input onChange={(e) => console.log(e.target.value)} />
    </form>
  );
}`,
    },
  ];

  const hooks = [
    {
      title: 'useState',
      what: '保存组件局部状态',
      why: '函数组件无 this.state',
      how: 'const [x, setX] = useState(0)',
      scenarios: ['计数器', '切换状态'],
      relations: ['与渲染周期强绑定'],
      code: `import { useState } from 'react';

function Toggle() {
  const [isOn, setIsOn] = useState(false);

  return (
    <button onClick={() => setIsOn(!isOn)}>
      {isOn ? '开' : '关'}
    </button>
  );
}

// 多个状态
function Form() {
  const [name, setName] = useState('');
  const [age, setAge] = useState(0);
  
  return (
    <div>
      <input value={name} onChange={e => setName(e.target.value)} />
      <input type="number" value={age} onChange={e => setAge(+e.target.value)} />
    </div>
  );
}`,
    },
    {
      title: 'useEffect',
      what: '处理副作用（订阅、请求、DOM 操作）',
      why: '替代生命周期函数',
      how: 'useEffect(()=>{ fetch() }, [])',
      scenarios: ['异步请求', '订阅', '动画'],
      relations: ['类比 componentDidMount 等'],
      code: `import { useState, useEffect } from 'react';

function DataFetcher() {
  const [data, setData] = useState(null);

  useEffect(() => {
    // 组件挂载时执行
    fetch('/api/data')
      .then(res => res.json())
      .then(setData);

    // 清理函数（组件卸载时执行）
    return () => {
      console.log('清理');
    };
  }, []); // 空数组表示只执行一次

  return <div>{data ? JSON.stringify(data) : '加载中...'}</div>;
}

// 依赖项变化时重新执行
function SearchResults({ query }) {
  const [results, setResults] = useState([]);

  useEffect(() => {
    fetch(\`/api/search?q=\${query}\`)
      .then(res => res.json())
      .then(setResults);
  }, [query]); // query 变化时重新执行

  return <ul>{results.map(r => <li key={r.id}>{r.name}</li>)}</ul>;
}`,
    },
    {
      title: 'useMemo',
      what: '缓存计算结果',
      why: '避免重复计算性能浪费',
      how: 'useMemo(()=>expensive(x), [x])',
      scenarios: ['重计算逻辑场景'],
      relations: ['与性能优化相关'],
      code: `import { useState, useMemo } from 'react';

function ExpensiveComponent({ items }) {
  // 只有 items 变化时才重新计算
  const total = useMemo(() => {
    console.log('计算总和...');
    return items.reduce((sum, item) => sum + item.price, 0);
  }, [items]);

  return <div>总价: {total}</div>;
}`,
    },
    {
      title: 'useCallback',
      what: '缓存函数引用',
      why: '避免子组件重复渲染',
      how: 'useCallback(()=>doSomething(), [])',
      scenarios: ['子组件 props 稳定性'],
      relations: ['常与 React.memo() 搭配'],
      code: `import { useState, useCallback, memo } from 'react';

// 子组件使用 memo 优化
const Child = memo(({ onClick }) => {
  console.log('Child 渲染');
  return <button onClick={onClick}>点击</button>;
});

function Parent() {
  const [count, setCount] = useState(0);

  // 使用 useCallback 缓存函数
  const handleClick = useCallback(() => {
    console.log('点击了');
  }, []); // 空数组表示函数永不变化

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>增加</button>
      <Child onClick={handleClick} />
    </div>
  );
}`,
    },
    {
      title: 'useRef',
      what: '存储跨渲染持久引用',
      why: '不触发重渲染的可变引用',
      how: 'const inputRef = useRef()',
      scenarios: ['获取 DOM 或存值'],
      relations: ['类似类组件的 createRef'],
      code: `import { useRef, useEffect } from 'react';

function FocusInput() {
  const inputRef = useRef(null);

  useEffect(() => {
    // 自动聚焦
    inputRef.current.focus();
  }, []);

  return <input ref={inputRef} />;
}

// 存储不触发渲染的值
function Timer() {
  const countRef = useRef(0);

  const handleClick = () => {
    countRef.current += 1;
    console.log(countRef.current); // 不会触发重渲染
  };

  return <button onClick={handleClick}>点击</button>;
}`,
    },
    {
      title: 'useContext',
      what: '获取上下文值',
      why: '避免多层 props 传递',
      how: 'const theme = useContext(ThemeContext)',
      scenarios: ['主题/语言全局配置'],
      relations: ['与 Context API 配合'],
      code: `import { createContext, useContext, useState } from 'react';

// 创建 Context
const ThemeContext = createContext('light');

function App() {
  const [theme, setTheme] = useState('light');

  return (
    <ThemeContext.Provider value={theme}>
      <Toolbar />
      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        切换主题
      </button>
    </ThemeContext.Provider>
  );
}

function Toolbar() {
  return <ThemedButton />;
}

function ThemedButton() {
  // 使用 useContext 获取值
  const theme = useContext(ThemeContext);
  return <button className={theme}>按钮</button>;
}`,
    },
    {
      title: 'useReducer',
      what: '用于复杂状态逻辑管理',
      why: '多状态相互关联',
      how: 'useReducer(reducer, init)',
      scenarios: ['表单', '业务逻辑多分支'],
      relations: ['可替代 Redux 小型场景'],
      code: `import { useReducer } from 'react';

// 定义 reducer
function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    case 'reset':
      return { count: 0 };
    default:
      return state;
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, { count: 0 });

  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
      <button onClick={() => dispatch({ type: 'reset' })}>重置</button>
    </div>
  );
}`,
    },
    {
      title: 'useLayoutEffect',
      what: '在 DOM 更新后同步执行副作用',
      why: '精确控制 DOM 布局操作',
      how: '类似 useEffect，但同步',
      scenarios: ['测量 DOM 尺寸'],
      relations: ['优先级高于 useEffect'],
      code: `import { useLayoutEffect, useRef, useState } from 'react';

function MeasureElement() {
  const ref = useRef(null);
  const [height, setHeight] = useState(0);

  useLayoutEffect(() => {
    // 在浏览器绘制前同步执行
    const rect = ref.current.getBoundingClientRect();
    setHeight(rect.height);
  }, []);

  return (
    <div>
      <div ref={ref}>测量这个元素</div>
      <p>高度: {height}px</p>
    </div>
  );
}`,
    },
    {
      title: 'useImperativeHandle',
      what: '向父组件暴露特定方法',
      why: '控制 ref 的访问接口',
      how: 'useImperativeHandle(ref, ()=>({...}))',
      scenarios: ['定制组件 API'],
      relations: ['与 forwardRef 配合'],
      code: `import { forwardRef, useImperativeHandle, useRef } from 'react';

const CustomInput = forwardRef((props, ref) => {
  const inputRef = useRef();

  useImperativeHandle(ref, () => ({
    // 只暴露这些方法
    focus: () => inputRef.current.focus(),
    clear: () => inputRef.current.value = ''
  }));

  return <input ref={inputRef} />;
});

function Parent() {
  const ref = useRef();

  return (
    <div>
      <CustomInput ref={ref} />
      <button onClick={() => ref.current.focus()}>聚焦</button>
      <button onClick={() => ref.current.clear()}>清空</button>
    </div>
  );
}`,
    },
    {
      title: 'useId',
      what: '生成稳定的唯一 ID',
      why: 'SSR + 客户端一致性问题',
      how: 'const id = useId()',
      scenarios: ['表单 label-for 关联'],
      relations: ['React 18 新增'],
      code: `import { useId } from 'react';

function FormField({ label }) {
  const id = useId();

  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input id={id} />
    </div>
  );
}`,
    },
    {
      title: 'useTransition',
      what: '延迟状态更新，提高交互体验',
      why: '避免阻塞 UI',
      how: 'const [isPending, start] = useTransition()',
      scenarios: ['复杂渲染交互'],
      relations: ['React 18 并发特性'],
      code: `import { useState, useTransition } from 'react';

function SearchResults() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isPending, startTransition] = useTransition();

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    // 将耗时的更新标记为过渡
    startTransition(() => {
      // 模拟复杂计算
      const filtered = heavyFilter(value);
      setResults(filtered);
    });
  };

  return (
    <div>
      <input value={query} onChange={handleChange} />
      {isPending && <p>搜索中...</p>}
      <ul>{results.map(r => <li key={r}>{r}</li>)}</ul>
    </div>
  );
}`,
    },
    {
      title: 'useDeferredValue',
      what: '延迟某值更新',
      why: '与 useTransition 类似',
      how: 'const deferred = useDeferredValue(value)',
      scenarios: ['输入搜索防抖'],
      relations: ['并发渲染优化'],
      code: `import { useState, useDeferredValue } from 'react';

function SearchList({ query }) {
  // 延迟 query 的更新
  const deferredQuery = useDeferredValue(query);

  // 使用延迟的值进行过滤
  const results = useMemo(() => {
    return heavyFilter(deferredQuery);
  }, [deferredQuery]);

  return (
    <ul>
      {results.map(r => <li key={r}>{r}</li>)}
    </ul>
  );
}

function App() {
  const [query, setQuery] = useState('');

  return (
    <div>
      <input value={query} onChange={e => setQuery(e.target.value)} />
      <SearchList query={query} />
    </div>
  );
}`,
    },
  ];

  const advancedConcepts = [
    {
      title: 'Context',
      what: '全局共享状态机制',
      why: '避免 props drilling',
      how: 'const Ctx = createContext()',
      scenarios: ['主题', '语言', '用户信息'],
      relations: ['Provider → Consumer'],
      code: `import { createContext, useContext, useState } from 'react';

const UserContext = createContext(null);

function App() {
  const [user, setUser] = useState({ name: 'Alice', role: 'admin' });

  return (
    <UserContext.Provider value={user}>
      <Header />
      <Content />
    </UserContext.Provider>
  );
}

function Header() {
  const user = useContext(UserContext);
  return <h1>欢迎, {user.name}</h1>;
}

function Content() {
  const user = useContext(UserContext);
  return <p>角色: {user.role}</p>;
}`,
    },
    {
      title: 'React.memo',
      what: '缓存组件输出',
      why: '避免重复渲染',
      how: 'export default memo(MyComp)',
      scenarios: ['性能优化'],
      relations: ['与 useCallback、useMemo 协作'],
      code: `import { memo, useState } from 'react';

// 使用 memo 包裹组件
const ExpensiveComponent = memo(({ data }) => {
  console.log('ExpensiveComponent 渲染');
  return <div>{data}</div>;
});

// 自定义比较函数
const CustomMemo = memo(
  ({ user }) => <div>{user.name}</div>,
  (prevProps, nextProps) => {
    // 返回 true 表示不重新渲染
    return prevProps.user.id === nextProps.user.id;
  }
);`,
    },
    {
      title: 'Portals',
      what: '在 DOM 树外渲染组件',
      why: '模态框、浮层等不受父容器影响',
      how: 'createPortal(child, container)',
      scenarios: ['Modal', 'Tooltip'],
      relations: ['与 DOM 层结构分离'],
      code: `import { createPortal } from 'react-dom';
import { useState } from 'react';

function Modal({ children, onClose }) {
  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        {children}
        <button onClick={onClose}>关闭</button>
      </div>
    </div>,
    document.body // 渲染到 body 下
  );
}

function App() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      <button onClick={() => setShowModal(true)}>打开模态框</button>
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <h2>模态框内容</h2>
        </Modal>
      )}
    </div>
  );
}`,
    },
    {
      title: 'ForwardRef',
      what: '转发 ref 到子组件',
      why: '让父组件能访问子组件 DOM',
      how: 'forwardRef((props, ref)=>...)',
      scenarios: ['自定义输入组件'],
      relations: ['与 useImperativeHandle 配合'],
      code: `import { forwardRef, useRef } from 'react';

// 使用 forwardRef 包裹组件
const FancyInput = forwardRef((props, ref) => {
  return <input ref={ref} className="fancy" {...props} />;
});

function Parent() {
  const inputRef = useRef();

  const handleClick = () => {
    inputRef.current.focus();
  };

  return (
    <div>
      <FancyInput ref={inputRef} />
      <button onClick={handleClick}>聚焦输入框</button>
    </div>
  );
}`,
    },
    {
      title: 'Suspense',
      what: '异步加载边界',
      why: '优雅处理组件异步加载',
      how: '<Suspense fallback={<Loading/>}>...</Suspense>',
      scenarios: ['懒加载', '数据加载等待'],
      relations: ['与 lazy()/use() 搭配'],
      code: `import { Suspense, lazy } from 'react';

// 懒加载组件
const LazyComponent = lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <div>
      <h1>我的应用</h1>
      <Suspense fallback={<div>加载中...</div>}>
        <LazyComponent />
      </Suspense>
    </div>
  );
}

// React 18: 数据获取
function ProfilePage({ userId }) {
  return (
    <Suspense fallback={<h2>加载用户信息...</h2>}>
      <ProfileDetails userId={userId} />
    </Suspense>
  );
}`,
    },
    {
      title: 'ErrorBoundary',
      what: '错误捕获边界',
      why: '防止子组件崩溃影响整体',
      how: 'componentDidCatch(err, info)',
      scenarios: ['稳定性保障'],
      relations: ['与 Suspense 类似"边界"思路'],
      code: `import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('错误:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>出错了！</h1>;
    }
    return this.props.children;
  }
}

// 使用
function App() {
  return (
    <ErrorBoundary>
      <MyComponent />
    </ErrorBoundary>
  );
}`,
    },
    {
      title: 'Fragments',
      what: '不产生额外 DOM 包裹',
      why: '保持结构简洁',
      how: '<></> 或 <Fragment></Fragment>',
      scenarios: ['列表多元素返回'],
      relations: ['渲染语法优化'],
      code: `import { Fragment } from 'react';

function List() {
  return (
    <>
      <li>项目 1</li>
      <li>项目 2</li>
      <li>项目 3</li>
    </>
  );
}

// 需要 key 时使用完整语法
function Glossary({ items }) {
  return (
    <dl>
      {items.map(item => (
        <Fragment key={item.id}>
          <dt>{item.term}</dt>
          <dd>{item.description}</dd>
        </Fragment>
      ))}
    </dl>
  );
}`,
    },
  ];

  const patterns = [
    {
      title: '受控组件',
      why: '状态由 React 管理',
      scenarios: ['表单元素'],
      code: `function ControlledInput() {
  const [value, setValue] = useState('');

  return (
    <input 
      value={value} 
      onChange={e => setValue(e.target.value)} 
    />
  );
}`,
    },
    {
      title: '非受控组件',
      why: '由 DOM 自身管理状态',
      scenarios: ['简单表单', '性能优先'],
      code: `function UncontrolledInput() {
  const inputRef = useRef();

  const handleSubmit = () => {
    console.log(inputRef.current.value);
  };

  return (
    <div>
      <input ref={inputRef} defaultValue="初始值" />
      <button onClick={handleSubmit}>提交</button>
    </div>
  );
}`,
    },
    {
      title: '复合组件模式',
      why: '组件内部组合子组件共享状态',
      scenarios: ['复杂组件封装'],
      code: `const TabsContext = createContext();

function Tabs({ children, defaultTab }) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="tabs">{children}</div>
    </TabsContext.Provider>
  );
}

function TabList({ children }) {
  return <div className="tab-list">{children}</div>;
}

function Tab({ id, children }) {
  const { activeTab, setActiveTab } = useContext(TabsContext);
  return (
    <button 
      className={activeTab === id ? 'active' : ''}
      onClick={() => setActiveTab(id)}
    >
      {children}
    </button>
  );
}

function TabPanel({ id, children }) {
  const { activeTab } = useContext(TabsContext);
  return activeTab === id ? <div>{children}</div> : null;
}

// 使用
<Tabs defaultTab="tab1">
  <TabList>
    <Tab id="tab1">标签1</Tab>
    <Tab id="tab2">标签2</Tab>
  </TabList>
  <TabPanel id="tab1">内容1</TabPanel>
  <TabPanel id="tab2">内容2</TabPanel>
</Tabs>`,
    },
    {
      title: 'Render Props',
      why: '用函数作为子组件渲染逻辑',
      scenarios: ['逻辑复用'],
      code: `function DataProvider({ render }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(setData);
  }, []);

  return render(data);
}

// 使用
<DataProvider 
  render={data => (
    data ? <div>{data.name}</div> : <div>加载中...</div>
  )} 
/>`,
    },
    {
      title: '自定义 Hooks',
      why: '复用逻辑而非 UI',
      scenarios: ['公共逻辑抽离'],
      code: `// 自定义 Hook
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, [url]);

  return { data, loading, error };
}

// 使用自定义 Hook
function UserProfile({ userId }) {
  const { data, loading, error } = useFetch(\`/api/users/\${userId}\`);

  if (loading) return <div>加载中...</div>;
  if (error) return <div>错误: {error.message}</div>;
  return <div>{data.name}</div>;
}`,
    },
    {
      title: '高阶组件 (HOC)',
      why: '函数组件包装',
      scenarios: ['逻辑增强'],
      code: `// 高阶组件
function withAuth(Component) {
  return function AuthComponent(props) {
    const [isAuth, setIsAuth] = useState(false);

    useEffect(() => {
      // 检查认证
      checkAuth().then(setIsAuth);
    }, []);

    if (!isAuth) {
      return <div>请先登录</div>;
    }

    return <Component {...props} />;
  };
}

// 使用
const ProtectedPage = withAuth(function Page() {
  return <div>受保护的内容</div>;
});`,
    },
  ];

  const resources = [
    { name: 'React 官方文档', url: 'https://react.dev/', description: '最权威的 React 学习资源' },
    { name: 'React 中文文档', url: 'https://zh-hans.react.dev/', description: 'React 官方中文文档' },
    { name: 'React Hooks 指南', url: 'https://react.dev/reference/react', description: '完整的 Hooks API 参考' },
    { name: 'React Router', url: 'https://reactrouter.com/', description: 'React 路由库' },
    { name: 'React Patterns', url: 'https://reactpatterns.com/', description: 'React 设计模式集合' },
    { name: 'Awesome React', url: 'https://github.com/enaqx/awesome-react', description: 'React 资源大全' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6">
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
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl shadow-lg mb-4">
            <Code className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-gray-800">
            React 18+ 完整知识体系
          </h1>
          <p className="text-gray-600">
            系统掌握 React 核心概念、Hooks、进阶模式与最佳实践
          </p>
        </div>

        {/* 核心概念 */}
        <div className="mb-8">
          <Card className="p-6 bg-white/80 backdrop-blur-sm mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-800">一、核心概念</h2>
            </div>
          </Card>

          <div className="space-y-6">
            {coreConcepts.map((concept, idx) => (
              <Card key={idx} id={`section-${idx + 1}`} className="p-6 bg-white/80 backdrop-blur-sm scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <CheckCircle2 className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
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

        {/* Hooks */}
        <div className="mb-8">
          <Card className="p-6 bg-white/80 backdrop-blur-sm mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="w-6 h-6 text-yellow-600" />
              <h2 className="text-2xl font-bold text-gray-800">二、核心 Hooks</h2>
            </div>
          </Card>

          <div className="space-y-6">
            {hooks.map((hook, idx) => (
              <Card key={idx} id={`section-${coreConcepts.length + idx + 1}`} className="p-6 bg-white/80 backdrop-blur-sm scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <CheckCircle2 className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{hook.title}</h3>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500">
                    <h4 className="font-semibold text-gray-800 mb-2">💡 是什么</h4>
                    <p className="text-sm text-gray-700">{hook.what}</p>
                  </div>

                  <div className="p-4 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500">
                    <h4 className="font-semibold text-gray-800 mb-2">🎯 为什么</h4>
                    <p className="text-sm text-gray-700">{hook.why}</p>
                  </div>

                  <div className="p-4 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 border-l-4 border-purple-500">
                    <h4 className="font-semibold text-gray-800 mb-2">⚡ 怎么用</h4>
                    <code className="text-sm text-gray-700 font-mono">{hook.how}</code>
                  </div>

                  <div className="p-4 rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-500">
                    <h4 className="font-semibold text-gray-800 mb-2">📦 使用场景</h4>
                    <ul className="space-y-1">
                      {hook.scenarios.map((s, i) => (
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
                    {hook.relations.map((r, i) => (
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
                    <code>{hook.code}</code>
                  </pre>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* 进阶概念 */}
        <div className="mb-8">
          <Card className="p-6 bg-white/80 backdrop-blur-sm mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Code className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-800">三、组件进阶概念</h2>
            </div>
          </Card>

          <div className="space-y-6">
            {advancedConcepts.map((concept, idx) => (
              <Card key={idx} id={`section-${coreConcepts.length + hooks.length + idx + 1}`} className="p-6 bg-white/80 backdrop-blur-sm scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <CheckCircle2 className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
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

        {/* 现代模式 */}
        <div className="mb-8">
          <Card className="p-6 bg-white/80 backdrop-blur-sm mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-800">四、现代开发模式</h2>
            </div>
          </Card>

          <div className="space-y-6">
            {patterns.map((pattern, idx) => (
              <Card key={idx} id={`section-${coreConcepts.length + hooks.length + advancedConcepts.length + idx + 1}`} className="p-6 bg-white/80 backdrop-blur-sm scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{pattern.title}</h3>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="p-4 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500">
                    <h4 className="font-semibold text-gray-800 mb-2">🎯 为什么重要</h4>
                    <p className="text-sm text-gray-700">{pattern.why}</p>
                  </div>

                  <div className="p-4 rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-500">
                    <h4 className="font-semibold text-gray-800 mb-2">📦 使用场景</h4>
                    <ul className="space-y-1">
                      {pattern.scenarios.map((s, i) => (
                        <li key={i} className="text-sm text-gray-700">• {s}</li>
                      ))}
                    </ul>
                  </div>
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

        {/* 关系总图 */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">React 知识关系图</h2>
          <div className="p-4 bg-gray-50 rounded-lg">
            <pre className="text-sm text-gray-700 overflow-x-auto whitespace-pre">
{`JSX
 └─ Component（函数/类）
     ├─ Props → 单向数据流（父→子）
     ├─ State → 驱动渲染
     ├─ Hooks（useState, useEffect, useMemo...）
     │     ├─ 自定义Hooks（逻辑复用）
     │     ├─ 与生命周期、渲染周期相关
     │     └─ 与性能优化相关（memo, callback）
     ├─ Context（全局共享）
     ├─ Suspense / Lazy / ErrorBoundary（异步与容错）
     └─ DOM交互（Ref, ForwardRef, Portals）`}
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

        {/* 底部提示 */}
        <div className="text-center">
          <Card className="inline-block p-4 bg-gradient-to-r from-white/80 to-cyan-50/80 backdrop-blur-sm border border-cyan-200/50">
            <p className="text-sm text-gray-700">
              💡 建议：从核心概念开始，逐步掌握 Hooks，最后学习进阶模式和性能优化
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
