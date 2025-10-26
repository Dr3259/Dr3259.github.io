'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, BookOpen, ExternalLink, Code, CheckCircle2, TrendingUp, Sparkles, Zap, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function ReduxPage() {
  const coreConcepts = [
    {
      title: 'Store',
      what: '状态树（state tree）',
      why: '提供集中管理与订阅接口',
      how: 'const store = configureStore({ reducer })',
      scenarios: ['全局状态管理', '单一数据源'],
      relations: ['是整个 Redux 应用的根节点'],
      code: `import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import cartReducer from './cartSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    cart: cartReducer
  }
});

export default store;`,
    },
    {
      title: 'Action',
      what: '状态变化的描述对象',
      why: '让状态变化可追踪、可记录',
      how: '{ type: \'user/login\', payload: data }',
      scenarios: ['描述发生了什么', '时间旅行调试'],
      relations: ['触发 Reducer 更新状态'],
      code: `// Action 对象
const loginAction = {
  type: 'user/login',
  payload: {
    username: 'Alice',
    token: 'abc123'
  }
};

// Action Creator（使用 RTK 自动生成）
import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: { username: '', token: '' },
  reducers: {
    login(state, action) {
      state.username = action.payload.username;
      state.token = action.payload.token;
    }
  }
});

export const { login } = userSlice.actions;`,
    },
    {
      title: 'Reducer',
      what: '纯函数，描述状态如何更新',
      why: '保持逻辑可预测',
      how: '(state, action) => newState',
      scenarios: ['状态更新逻辑', '可测试的纯函数'],
      relations: ['接收 Action，返回新状态'],
      code: `// 传统 Reducer 写法
function counterReducer(state = { count: 0 }, action) {
  switch (action.type) {
    case 'INCREMENT':
      return { ...state, count: state.count + 1 };
    case 'DECREMENT':
      return { ...state, count: state.count - 1 };
    default:
      return state;
  }
}

// RTK createSlice 写法（推荐）
import { createSlice } from '@reduxjs/toolkit';

const counterSlice = createSlice({
  name: 'counter',
  initialState: { count: 0 },
  reducers: {
    increment(state) {
      state.count += 1; // Immer 让你可以"直接修改"
    },
    decrement(state) {
      state.count -= 1;
    }
  }
});`,
    },
    {
      title: 'Dispatch',
      what: '分发动作的触发器',
      why: '让组件能触发状态变化',
      how: 'dispatch({ type: \'xxx\' })',
      scenarios: ['组件触发状态更新', '异步操作分发'],
      relations: ['连接组件与 Reducer'],
      code: `import { useDispatch } from 'react-redux';
import { login, logout } from './userSlice';

function LoginButton() {
  const dispatch = useDispatch();

  const handleLogin = () => {
    // 分发同步 action
    dispatch(login({
      username: 'Alice',
      token: 'abc123'
    }));
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div>
      <button onClick={handleLogin}>登录</button>
      <button onClick={handleLogout}>登出</button>
    </div>
  );
}`,
    },
    {
      title: 'Selector',
      what: '从 store 取数据的函数',
      why: '解耦组件与 state 结构',
      how: 'useSelector(state => state.user.name)',
      scenarios: ['读取状态', '计算派生数据'],
      relations: ['连接 Store 与组件'],
      code: `import { useSelector } from 'react-redux';

function UserProfile() {
  // 基础 selector
  const username = useSelector(state => state.user.username);
  const isLoggedIn = useSelector(state => !!state.user.token);

  // 使用 Reselect 创建记忆化 selector
  import { createSelector } from '@reduxjs/toolkit';

  const selectUser = state => state.user;
  const selectUserInfo = createSelector(
    [selectUser],
    (user) => ({
      displayName: user.username.toUpperCase(),
      isAdmin: user.role === 'admin'
    })
  );

  const userInfo = useSelector(selectUserInfo);

  return (
    <div>
      <p>用户名: {username}</p>
      <p>状态: {isLoggedIn ? '已登录' : '未登录'}</p>
    </div>
  );
}`,
    },
  ];

  const rtkFeatures = [
    {
      title: 'configureStore()',
      what: '简化版 createStore，内置中间件（thunk、devTools）',
      why: '避免手动配置 store',
      scenarios: ['构建全局 store', '注册 reducer'],
      relations: ['是整个 Redux 应用的根节点'],
      code: `import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import cartReducer from './cartSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    cart: cartReducer
  },
  // 自动包含 thunk 中间件和 DevTools
  // 可以添加自定义中间件
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(logger)
});

export default store;`,
    },
    {
      title: 'createSlice()',
      what: '集合了 action + reducer 的"切片"',
      why: '避免手动写大量 switch-case',
      scenarios: ['每个模块（如 user、cart）都可以有独立 slice'],
      relations: ['连接 reducer（状态逻辑）与 action（行为定义）'],
      code: `import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    username: '',
    email: '',
    age: 0
  },
  reducers: {
    setUser(state, action) {
      // RTK 内部使用 Immer，可以"直接修改"
      state.username = action.payload.username;
      state.email = action.payload.email;
    },
    updateAge(state, action) {
      state.age = action.payload;
    },
    clearUser(state) {
      // 返回新对象也可以
      return { username: '', email: '', age: 0 };
    }
  }
});

// 自动生成 action creators
export const { setUser, updateAge, clearUser } = userSlice.actions;

// 导出 reducer
export default userSlice.reducer;`,
    },
    {
      title: 'createAsyncThunk()',
      what: '处理异步逻辑（如 API 调用）的语法糖',
      why: '分离副作用逻辑，自动生成 pending/fulfilled/rejected 三种状态',
      scenarios: ['与 slice 一起管理异步请求状态'],
      relations: ['内置异步中间件（thunk）自动分发三类 action'],
      code: `import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// 创建异步 thunk
export const fetchUser = createAsyncThunk(
  'user/fetchUser',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await fetch(\`/api/users/\${userId}\`);
      if (!response.ok) throw new Error('Failed to fetch');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState: {
    data: null,
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});`,
    },
    {
      title: 'useSelector() / useDispatch()',
      what: 'React-Redux 提供的 Hooks',
      why: '替代 connect()，更简洁',
      scenarios: ['组件直接读取或更新状态'],
      relations: ['React 层与 Redux 层的桥梁'],
      code: `import { useSelector, useDispatch } from 'react-redux';
import { increment, decrement } from './counterSlice';

function Counter() {
  // 读取状态
  const count = useSelector(state => state.counter.count);
  const user = useSelector(state => state.user);
  
  // 获取 dispatch 函数
  const dispatch = useDispatch();

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => dispatch(increment())}>+</button>
      <button onClick={() => dispatch(decrement())}>-</button>
      <p>User: {user.username}</p>
    </div>
  );
}`,
    },
    {
      title: 'createEntityAdapter()',
      what: '管理列表/集合类数据的工具',
      why: '规范化 CRUD 操作，减少手写逻辑',
      scenarios: ['常用于用户列表、商品列表'],
      relations: ['简化 reducer 层数据管理逻辑'],
      code: `import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

// 创建 adapter
const usersAdapter = createEntityAdapter({
  selectId: (user) => user.id,
  sortComparer: (a, b) => a.name.localeCompare(b.name)
});

const usersSlice = createSlice({
  name: 'users',
  initialState: usersAdapter.getInitialState(),
  reducers: {
    addUser: usersAdapter.addOne,
    addUsers: usersAdapter.addMany,
    updateUser: usersAdapter.updateOne,
    removeUser: usersAdapter.removeOne,
    setAllUsers: usersAdapter.setAll
  }
});

// 导出 selectors
export const {
  selectAll: selectAllUsers,
  selectById: selectUserById,
  selectIds: selectUserIds
} = usersAdapter.getSelectors(state => state.users);`,
    },
    {
      title: '中间件（Middleware）',
      what: '在 dispatch 与 reducer 之间插入的扩展层',
      why: '用于日志记录、异步请求、错误捕获',
      scenarios: ['横切逻辑层，如调试、监控'],
      relations: ['连接 dispatch → reducer 流程的拦截器链'],
      code: `import { configureStore } from '@reduxjs/toolkit';

// 自定义中间件
const logger = store => next => action => {
  console.log('dispatching', action);
  const result = next(action);
  console.log('next state', store.getState());
  return result;
};

const errorHandler = store => next => action => {
  try {
    return next(action);
  } catch (error) {
    console.error('Error:', error);
    // 可以分发错误 action
    store.dispatch({ type: 'ERROR', payload: error });
  }
};

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(logger)
      .concat(errorHandler)
});`,
    },
    {
      title: 'combineReducers()',
      what: '合并多个 reducer 的工具',
      why: '让应用模块化',
      scenarios: ['分模块管理、统一整合'],
      relations: ['连接多个 slice → store 根'],
      code: `import { combineReducers } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import cartReducer from './cartSlice';
import postsReducer from './postsSlice';

// 手动合并（通常不需要，configureStore 会自动处理）
const rootReducer = combineReducers({
  user: userReducer,
  cart: cartReducer,
  posts: postsReducer
});

// 在 configureStore 中使用
const store = configureStore({
  reducer: rootReducer
});

// 或者直接传对象（推荐）
const store = configureStore({
  reducer: {
    user: userReducer,
    cart: cartReducer,
    posts: postsReducer
  }
});`,
    },
    {
      title: 'DevTools 支持',
      what: 'Redux 开发者工具集成',
      why: '可视化时间旅行、查看每次状态变更',
      scenarios: ['调试状态变化', '回放操作'],
      relations: ['configureStore() 默认集成'],
      code: `// configureStore 自动集成 DevTools
import { configureStore } from '@reduxjs/toolkit';

const store = configureStore({
  reducer: rootReducer,
  // DevTools 默认启用
  devTools: process.env.NODE_ENV !== 'production'
});

// 在浏览器中安装 Redux DevTools Extension
// 可以看到：
// - 每个 action 的详情
// - 状态树的变化
// - 时间旅行调试
// - 导入/导出状态`,
    },
  ];

  const antiPatterns = [
    {
      title: '❌ 在 reducer 中做副作用',
      wrong: `const userSlice = createSlice({
  name: 'user',
  initialState: {},
  reducers: {
    login(state, action) {
      // ❌ 错误：在 reducer 中调用 API
      fetch('/api/login', {
        method: 'POST',
        body: JSON.stringify(action.payload)
      });
      state.user = action.payload;
    }
  }
});`,
      right: `// ✅ 正确：使用 createAsyncThunk
export const login = createAsyncThunk(
  'user/login',
  async (credentials) => {
    const response = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
    return await response.json();
  }
);`,
    },
    {
      title: '❌ 直接修改 state（非 Immer 写法）',
      wrong: `// ❌ 错误：直接修改原始 state
function userReducer(state = initialState, action) {
  switch (action.type) {
    case 'UPDATE_USER':
      state.name = action.payload.name; // 直接修改
      return state;
    default:
      return state;
  }
}`,
      right: `// ✅ 正确：返回新对象
function userReducer(state = initialState, action) {
  switch (action.type) {
    case 'UPDATE_USER':
      return {
        ...state,
        name: action.payload.name
      };
    default:
      return state;
  }
}

// ✅ 或使用 RTK（内置 Immer）
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUser(state, action) {
      state.name = action.payload.name; // Immer 处理
    }
  }
});`,
    },
    {
      title: '❌ 在组件内直接访问 store.getState()',
      wrong: `import store from './store';

function MyComponent() {
  // ❌ 错误：直接访问 store
  const user = store.getState().user;
  
  return <div>{user.name}</div>;
}`,
      right: `import { useSelector } from 'react-redux';

function MyComponent() {
  // ✅ 正确：使用 useSelector
  const user = useSelector(state => state.user);
  
  return <div>{user.name}</div>;
}`,
    },
  ];

  const resources = [
    { name: 'Redux 官方文档', url: 'https://redux.js.org/', description: '最权威的 Redux 学习资源' },
    { name: 'Redux Toolkit 文档', url: 'https://redux-toolkit.js.org/', description: 'RTK 官方文档' },
    { name: 'React-Redux 文档', url: 'https://react-redux.js.org/', description: 'React 绑定库文档' },
    { name: 'Redux DevTools', url: 'https://github.com/reduxjs/redux-devtools', description: '调试工具' },
    { name: 'Redux 中文文档', url: 'https://cn.redux.js.org/', description: 'Redux 中文翻译' },
    { name: 'Redux Essentials', url: 'https://redux.js.org/tutorials/essentials/part-1-overview-concepts', description: '官方教程' },
  ];

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
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg mb-4">
            <Code className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-gray-800">
            Redux 完整知识体系
          </h1>
          <p className="text-gray-600">
            掌握 Redux Toolkit 2.x 现代状态管理，从核心概念到最佳实践
          </p>
        </div>

        {/* Redux 是什么 */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Redux 是什么</h2>
          <p className="text-gray-700 mb-4">
            Redux 是一个<span className="font-semibold text-purple-600">可预测的状态管理容器</span>，用于在复杂应用中集中管理全局状态。
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">单一数据源</h3>
              <p className="text-sm text-gray-600">Single Source of Truth</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">状态不可变</h3>
              <p className="text-sm text-gray-600">Immutability</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">纯函数更新</h3>
              <p className="text-sm text-gray-600">Predictability</p>
            </div>
          </div>
        </Card>

        {/* 为什么需要 Redux */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">为什么需要 Redux</h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-800">组件间状态共享混乱</p>
                <p className="text-sm text-gray-600">→ 用单一全局 store 管理所有状态</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-800">状态修改难追踪</p>
                <p className="text-sm text-gray-600">→ 所有修改都通过 action → reducer 流程</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-800">调试困难</p>
                <p className="text-sm text-gray-600">→ 有时间旅行调试（time-travel）能力</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-800">副作用逻辑混乱</p>
                <p className="text-sm text-gray-600">→ 使用中间件（thunk/saga）分离副作用</p>
              </div>
            </div>
          </div>
        </Card>

        {/* 核心概念 */}
        <div className="mb-8">
          <Card className="p-6 bg-white/80 backdrop-blur-sm mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-800">核心概念（Redux 五大核心）</h2>
            </div>
          </Card>

          <div className="space-y-6">
            {coreConcepts.map((concept, idx) => (
              <Card key={idx} id={`section-${idx + 1}`} className="p-6 bg-white/80 backdrop-blur-sm scroll-mt-20">
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

        {/* Redux Toolkit 特性 */}
        <div className="mb-8">
          <Card className="p-6 bg-white/80 backdrop-blur-sm mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="w-6 h-6 text-yellow-600" />
              <h2 className="text-2xl font-bold text-gray-800">Redux Toolkit (RTK) 现代语法</h2>
            </div>
            <p className="text-gray-600">
              Redux Toolkit 是 Redux 官方的现代语法糖集合，保留了 Redux 哲学，但去掉了繁琐模板代码。
            </p>
          </Card>

          <div className="space-y-6">
            {rtkFeatures.map((feature, idx) => (
              <Card key={idx} id={`section-${coreConcepts.length + idx + 1}`} className="p-6 bg-white/80 backdrop-blur-sm scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <CheckCircle2 className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500">
                    <h4 className="font-semibold text-gray-800 mb-2">💡 是什么</h4>
                    <p className="text-sm text-gray-700">{feature.what}</p>
                  </div>

                  <div className="p-4 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500">
                    <h4 className="font-semibold text-gray-800 mb-2">🎯 为什么</h4>
                    <p className="text-sm text-gray-700">{feature.why}</p>
                  </div>

                  <div className="p-4 rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-500">
                    <h4 className="font-semibold text-gray-800 mb-2">📦 使用场景</h4>
                    <ul className="space-y-1">
                      {feature.scenarios.map((s, i) => (
                        <li key={i} className="text-sm text-gray-700">• {s}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 border-l-4 border-purple-500">
                    <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-purple-600" />
                      关联关系
                    </h4>
                    <ul className="space-y-1">
                      {feature.relations.map((r, i) => (
                        <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                          <span className="text-purple-600 mt-1">→</span>
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
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

        {/* 常见反模式 */}
        <div className="mb-8">
          <Card className="p-6 bg-white/80 backdrop-blur-sm mb-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-red-600" />
              <h2 className="text-2xl font-bold text-gray-800">常见反模式（应避免）</h2>
            </div>
          </Card>

          <div className="space-y-6">
            {antiPatterns.map((pattern, idx) => (
              <Card key={idx} className="p-6 bg-white/80 backdrop-blur-sm">
                <h3 className="text-lg font-bold text-gray-800 mb-4">{pattern.title}</h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-red-600 mb-2">❌ 错误示例</h4>
                    <pre className="bg-red-50 border border-red-200 text-gray-800 p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{pattern.wrong}</code>
                    </pre>
                  </div>

                  <div>
                    <h4 className="font-semibold text-green-600 mb-2">✅ 正确示例</h4>
                    <pre className="bg-green-50 border border-green-200 text-gray-800 p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{pattern.right}</code>
                    </pre>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* 数据流关系图 */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Redux 数据流关系图</h2>
          <div className="p-4 bg-gray-50 rounded-lg">
            <pre className="text-sm text-gray-700 overflow-x-auto whitespace-pre">
{`React Component
   │
   ▼
dispatch(action)
   │
   ▼
Middleware（拦截/异步）
   │
   ▼
Reducer（纯函数更新 state）
   │
   ▼
Store（集中状态树）
   │
   ▼
useSelector() 读取更新后的数据

Redux 的一切变化，都是沿着这条单向数据流进行。`}
            </pre>
          </div>
        </Card>

        {/* 应用场景 */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Redux 应用场景</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">跨组件共享状态</h3>
              <p className="text-sm text-gray-600">用户信息、主题、语言、全局配置</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">复杂数据流管理</h3>
              <p className="text-sm text-gray-600">多接口请求、异步逻辑、批量更新</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">可预测调试</h3>
              <p className="text-sm text-gray-600">状态变更可复现、可回放</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">中大型 React 项目</h3>
              <p className="text-sm text-gray-600">与 RTK Query、React Router、TypeScript 结合</p>
            </div>
          </div>
        </Card>

        {/* 学习资源 */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm mb-8">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-6 h-6 text-purple-600" />
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
          <Card className="inline-block p-4 bg-gradient-to-r from-white/80 to-purple-50/80 backdrop-blur-sm border border-purple-200/50">
            <p className="text-sm text-gray-700">
              💡 建议：从核心概念开始，掌握 Redux Toolkit 现代语法，避免常见反模式
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
