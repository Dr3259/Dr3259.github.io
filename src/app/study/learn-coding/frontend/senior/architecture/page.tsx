'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Layers, CheckCircle2, TrendingUp, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function ArchitecturePage() {
  const sections = [
    {
      title: '1. 项目结构设计',
      category: '结构规范',
      what: '按功能（feature）或领域（domain）划分目录，区分 components/、pages/、hooks/、store/、utils/、api/ 等层次',
      why: '清晰的目录结构降低认知负担，新人快速上手，避免文件混乱',
      how: '采用模块化分层，按业务领域划分，遵循高内聚低耦合原则',
      sugar: '约定优于配置',
      scenarios: ['中大型项目', '多人协作', '长期维护项目', '微前端应用'],
      relations: ['是架构的骨架', '影响模块化设计', '决定代码组织方式'],
      code: `// 推荐的项目结构
src/
├── modules/              # 业务模块（按领域划分）
│   ├── user/
│   │   ├── components/   # 用户模块组件
│   │   ├── services/     # 用户相关 API
│   │   ├── store/        # 用户状态管理
│   │   ├── hooks/        # 用户相关 Hooks
│   │   └── types/        # 用户类型定义
│   ├── product/
│   └── order/
├── shared/               # 共享资源
│   ├── components/       # 通用组件
│   ├── hooks/            # 通用 Hooks
│   ├── utils/            # 工具函数
│   └── constants/        # 常量定义
├── core/                 # 核心层
│   ├── api/              # API 封装
│   ├── router/           # 路由配置
│   ├── store/            # 全局状态
│   └── config/           # 配置文件
├── assets/               # 静态资源
├── styles/               # 全局样式
└── app.tsx               # 应用入口

// 模块内部结构示例
modules/user/
├── components/
│   ├── UserProfile.tsx
│   └── UserList.tsx
├── services/
│   └── userApi.ts
├── store/
│   └── userStore.ts
├── hooks/
│   └── useUser.ts
└── index.ts              # 模块导出`,
    },
    {
      title: '2. 模块化设计',
      category: '结构规范',
      what: '将代码拆分为独立功能单元，使用 ESM 或 CommonJS 进行模块导入导出',
      why: '提高代码复用性，降低耦合度，便于单元测试和维护',
      how: '使用 import/export 语法，遵循单一职责原则，明确模块边界',
      sugar: 'ES Modules',
      scenarios: ['工具函数封装', '业务逻辑抽离', '第三方库集成', '代码复用'],
      relations: ['与组件化互补', '支持 Tree-shaking', '影响打包体积'],
      code: `// 模块化示例
// utils/request.ts - 请求模块
import axios from 'axios';

export const request = axios.create({
  baseURL: '/api',
  timeout: 10000
});

export const get = (url: string, params?: any) => 
  request.get(url, { params });

export const post = (url: string, data?: any) => 
  request.post(url, data);

// services/userService.ts - 用户服务模块
import { get, post } from '@/utils/request';

export const userService = {
  getUser: (id: string) => get(\`/users/\${id}\`),
  updateUser: (id: string, data: any) => post(\`/users/\${id}\`, data),
  deleteUser: (id: string) => post(\`/users/\${id}/delete\`)
};

// 使用
import { userService } from '@/services/userService';

const user = await userService.getUser('123');

// 动态导入（按需加载）
const module = await import('./heavyModule');
module.doSomething();`,
    },
    {
      title: '3. 组件化设计',
      category: '结构规范',
      what: 'UI 拆分成可复用的视图单元，每个组件负责独立的功能',
      why: '提高 UI 复用性，降低维护成本，便于测试和迭代',
      how: '遵循单一职责、高内聚低耦合，使用 Props 传递数据，Events 传递行为',
      sugar: 'React/Vue 组件',
      scenarios: ['UI 组件库', '业务组件', '布局组件', '容器组件'],
      relations: ['与模块化配合', '支持组合模式', '影响代码组织'],
      code: `// 原子组件（Atomic Component）
// components/Button.tsx
interface ButtonProps {
  type?: 'primary' | 'secondary';
  onClick?: () => void;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  type = 'primary', 
  onClick, 
  children 
}) => (
  <button className={\`btn btn-\${type}\`} onClick={onClick}>
    {children}
  </button>
);

// 组合组件（Composite Component）
// components/UserCard.tsx
import { Button } from './Button';
import { Avatar } from './Avatar';

interface UserCardProps {
  user: User;
  onEdit: () => void;
}

export const UserCard: React.FC<UserCardProps> = ({ user, onEdit }) => (
  <div className="user-card">
    <Avatar src={user.avatar} />
    <h3>{user.name}</h3>
    <p>{user.email}</p>
    <Button onClick={onEdit}>编辑</Button>
  </div>
);

// 容器组件（Container Component）
// containers/UserListContainer.tsx
import { UserCard } from '@/components/UserCard';
import { useUsers } from '@/hooks/useUsers';

export const UserListContainer = () => {
  const { users, loading } = useUsers();
  
  if (loading) return <Loading />;
  
  return (
    <div>
      {users.map(user => (
        <UserCard key={user.id} user={user} onEdit={() => {}} />
      ))}
    </div>
  );
};`,
    },
    {
      title: '4. 状态管理架构',
      category: '状态管理',
      what: '管理应用的数据状态，包括局部状态、全局状态、服务器状态',
      why: '统一数据流向，便于追踪和调试，避免状态混乱',
      how: '局部用组件 state，全局用 Redux/Zustand，服务器用 React Query',
      sugar: 'Hooks/Store',
      scenarios: ['用户信息', '主题配置', '购物车', '表单数据'],
      relations: ['与组件解耦', '支持时间旅行', '影响性能'],
      code: `// 1. 局部状态（组件内部）
function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}

// 2. 全局状态（Zustand）
// store/userStore.ts
import { create } from 'zustand';

interface UserState {
  user: User | null;
  setUser: (user: User) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null })
}));

// 使用
const user = useUserStore(state => state.user);
const setUser = useUserStore(state => state.setUser);

// 3. 服务器状态（React Query）
import { useQuery, useMutation } from '@tanstack/react-query';

function UserProfile({ id }: { id: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ['user', id],
    queryFn: () => fetchUser(id)
  });
  
  const mutation = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    }
  });
  
  if (isLoading) return <Loading />;
  return <div>{data.name}</div>;
}`,
    },
    {
      title: '5. 数据层设计',
      category: '数据管理',
      what: '抽象 API 请求层，统一处理错误、鉴权、缓存，支持多数据源',
      why: '解耦业务逻辑与数据获取，便于切换数据源和测试',
      how: '封装 API 模块，使用 Axios/Fetch，配置拦截器',
      sugar: 'API 封装',
      scenarios: ['RESTful API', 'GraphQL', 'WebSocket', '本地存储'],
      relations: ['与状态管理配合', '支持缓存策略', '影响性能'],
      code: `// core/api/request.ts - 请求封装
import axios from 'axios';

const request = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000
});

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = \`Bearer \${token}\`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器
request.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // 跳转登录
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export { request };

// services/api.ts - API 定义
import { request } from '@/core/api/request';

export const api = {
  // 用户相关
  user: {
    getList: (params: any) => request.get('/users', { params }),
    getById: (id: string) => request.get(\`/users/\${id}\`),
    create: (data: any) => request.post('/users', data),
    update: (id: string, data: any) => request.put(\`/users/\${id}\`, data),
    delete: (id: string) => request.delete(\`/users/\${id}\`)
  },
  // 产品相关
  product: {
    getList: (params: any) => request.get('/products', { params }),
    getById: (id: string) => request.get(\`/products/\${id}\`)
  }
};

// 使用
const users = await api.user.getList({ page: 1, size: 10 });`,
    },
    {
      title: '6. 路由系统设计',
      category: '路由管理',
      what: '管理页面跳转、权限控制、动态加载，支持客户端路由和微前端',
      why: '提升用户体验，实现按需加载，支持权限控制',
      how: '使用 React Router/Vue Router，配置路由守卫和懒加载',
      sugar: '声明式路由',
      scenarios: ['页面导航', '权限控制', '懒加载', '微前端'],
      relations: ['与代码分割配合', '支持权限系统', '影响首屏性能'],
      code: `// React Router 配置
// router/index.tsx
import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';

// 懒加载页面
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const UserList = lazy(() => import('@/pages/UserList'));
const UserDetail = lazy(() => import('@/pages/UserDetail'));

// 路由守卫
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuth = useAuth();
  if (!isAuth) return <Navigate to="/login" />;
  return <>{children}</>;
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<Loading />}>
            <Dashboard />
          </Suspense>
        )
      },
      {
        path: 'users',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<Loading />}>
              <UserList />
            </Suspense>
          </ProtectedRoute>
        )
      },
      {
        path: 'users/:id',
        element: <UserDetail />
      }
    ]
  },
  {
    path: '/login',
    element: <Login />
  }
]);

// Vue Router 配置
// router/index.ts
import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import('@/pages/Dashboard.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'users',
        name: 'UserList',
        component: () => import('@/pages/UserList.vue'),
        meta: { requiresAuth: true, roles: ['admin'] }
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// 路由守卫
router.beforeEach((to, from, next) => {
  const isAuth = checkAuth();
  
  if (to.meta.requiresAuth && !isAuth) {
    next('/login');
  } else if (to.meta.roles && !hasRole(to.meta.roles)) {
    next('/403');
  } else {
    next();
  }
});

export default router;`,
    },
    {
      title: '7. 构建与部署',
      category: '工程化',
      what: '使用构建工具打包代码，配置 CI/CD 自动化部署，环境隔离',
      why: '提升开发效率，保证代码质量，实现快速交付',
      how: '使用 Vite/Webpack 构建，GitHub Actions/Jenkins 部署',
      sugar: '自动化流程',
      scenarios: ['开发环境', '测试环境', '生产环境', '灰度发布'],
      relations: ['与性能优化配合', '支持多环境', '影响交付速度'],
      code: `// vite.config.ts - Vite 配置
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  
  build: {
    outDir: 'dist',
    sourcemap: mode === 'development',
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['antd', '@ant-design/icons']
        }
      }
    }
  },
  
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  }
}));

// .env.development - 开发环境
VITE_API_URL=http://localhost:8080/api
VITE_APP_TITLE=开发环境

// .env.production - 生产环境
VITE_API_URL=https://api.example.com
VITE_APP_TITLE=生产环境

// .github/workflows/deploy.yml - CI/CD 配置
name: Deploy

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: npm test
        
      - name: Build
        run: npm run build
        
      - name: Deploy
        run: |
          # 部署到服务器
          scp -r dist/* user@server:/var/www/html/`,
    },
    {
      title: '8. 可观测性设计',
      category: '监控运维',
      what: '日志系统、性能追踪、用户行为分析、错误监控与报警',
      why: '快速定位问题，优化用户体验，支撑数据驱动决策',
      how: '集成 Sentry、Web Vitals、埋点系统',
      sugar: '监控平台',
      scenarios: ['错误追踪', '性能监控', '用户行为', '业务指标'],
      relations: ['与性能优化配合', '支持问题排查', '影响用户体验'],
      code: `// 错误监控 - Sentry
// core/monitoring/sentry.ts
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
  integrations: [
    new Sentry.BrowserTracing(),
    new Sentry.Replay()
  ],
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0
});

// 手动上报错误
try {
  // 业务逻辑
} catch (error) {
  Sentry.captureException(error);
}

// 性能监控 - Web Vitals
// core/monitoring/performance.ts
import { onCLS, onFID, onLCP, onFCP, onTTFB } from 'web-vitals';

function sendToAnalytics(metric: any) {
  // 发送到分析平台
  fetch('/api/analytics', {
    method: 'POST',
    body: JSON.stringify(metric)
  });
}

onCLS(sendToAnalytics);
onFID(sendToAnalytics);
onLCP(sendToAnalytics);
onFCP(sendToAnalytics);
onTTFB(sendToAnalytics);

// 用户行为埋点
// core/monitoring/tracker.ts
class Tracker {
  track(event: string, data?: any) {
    const payload = {
      event,
      data,
      timestamp: Date.now(),
      userId: this.getUserId(),
      page: window.location.pathname
    };
    
    // 发送埋点数据
    navigator.sendBeacon('/api/track', JSON.stringify(payload));
  }
  
  trackPageView() {
    this.track('page_view', {
      url: window.location.href,
      referrer: document.referrer
    });
  }
  
  trackClick(element: string) {
    this.track('click', { element });
  }
}

export const tracker = new Tracker();

// 使用
tracker.trackPageView();
tracker.trackClick('buy-button');`,
    },
    {
      title: '9. MVC 架构模式',
      category: '架构模式',
      what: 'Model-View-Controller，将应用分为数据模型、视图、控制器三层',
      why: '分离关注点，降低耦合，便于维护和测试',
      how: 'Model 管理数据，View 展示界面，Controller 处理逻辑',
      sugar: '传统分层',
      scenarios: ['传统 Web 应用', '后台管理系统', 'jQuery 时代'],
      relations: ['是最传统的模式', '演化出 MVVM', '适合服务端渲染'],
      code: `// MVC 模式示例
// Model - 数据模型
class UserModel {
  constructor(private data: User) {}
  
  getData() {
    return this.data;
  }
  
  setData(data: User) {
    this.data = data;
  }
  
  async fetch(id: string) {
    const response = await fetch(\`/api/users/\${id}\`);
    this.data = await response.json();
    return this.data;
  }
}

// View - 视图
class UserView {
  render(user: User) {
    return \`
      <div class="user-card">
        <h3>\${user.name}</h3>
        <p>\${user.email}</p>
        <button id="edit-btn">编辑</button>
      </div>
    \`;
  }
  
  bindEditButton(handler: () => void) {
    document.getElementById('edit-btn')?.addEventListener('click', handler);
  }
}

// Controller - 控制器
class UserController {
  constructor(
    private model: UserModel,
    private view: UserView
  ) {}
  
  async init(id: string) {
    const user = await this.model.fetch(id);
    const html = this.view.render(user);
    document.getElementById('app')!.innerHTML = html;
    
    this.view.bindEditButton(() => this.handleEdit());
  }
  
  handleEdit() {
    // 处理编辑逻辑
    console.log('编辑用户');
  }
}

// 使用
const model = new UserModel({} as User);
const view = new UserView();
const controller = new UserController(model, view);
controller.init('123');`,
    },
    {
      title: '10. MVVM 架构模式',
      category: '架构模式',
      what: 'Model-View-ViewModel，通过数据绑定实现 View 和 Model 的自动同步',
      why: '减少手动 DOM 操作，提升开发效率，Vue/React 的核心思想',
      how: 'ViewModel 作为中间层，实现双向数据绑定或单向数据流',
      sugar: '数据驱动',
      scenarios: ['React 应用', 'Vue 应用', '现代前端框架'],
      relations: ['从 MVC 演化而来', '是主流模式', '支持响应式'],
      code: `// MVVM 模式示例（Vue）
// Model - 数据模型
interface User {
  id: string;
  name: string;
  email: string;
}

// ViewModel - 视图模型
import { ref, computed } from 'vue';

export function useUserViewModel(userId: string) {
  // 状态
  const user = ref<User | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);
  
  // 计算属性
  const displayName = computed(() => 
    user.value ? \`\${user.value.name} (\${user.value.email})\` : ''
  );
  
  // 方法
  const fetchUser = async () => {
    loading.value = true;
    try {
      const response = await fetch(\`/api/users/\${userId}\`);
      user.value = await response.json();
    } catch (e) {
      error.value = '加载失败';
    } finally {
      loading.value = false;
    }
  };
  
  const updateUser = async (data: Partial<User>) => {
    await fetch(\`/api/users/\${userId}\`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    await fetchUser();
  };
  
  return {
    user,
    loading,
    error,
    displayName,
    fetchUser,
    updateUser
  };
}

// View - 视图
<template>
  <div v-if="loading">加载中...</div>
  <div v-else-if="error">{{ error }}</div>
  <div v-else-if="user">
    <h3>{{ displayName }}</h3>
    <button @click="handleEdit">编辑</button>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useUserViewModel } from './useUserViewModel';

const props = defineProps<{ userId: string }>();
const { user, loading, error, displayName, fetchUser, updateUser } = 
  useUserViewModel(props.userId);

onMounted(() => {
  fetchUser();
});

const handleEdit = () => {
  updateUser({ name: '新名字' });
};
</script>`,
    },
    {
      title: '11. Flux/Redux 架构',
      category: '架构模式',
      what: '单向数据流架构，通过 Action → Dispatcher → Store → View 的流程管理状态',
      why: '状态可预测、可追踪、可回溯，适合复杂状态管理',
      how: '使用 Redux/Zustand，定义 Action、Reducer、Store',
      sugar: '单向数据流',
      scenarios: ['复杂状态管理', '时间旅行调试', '状态持久化'],
      relations: ['与 MVVM 互补', '支持中间件', '适合大型应用'],
      code: `// Flux/Redux 架构示例
// 1. Action Types
const ActionTypes = {
  FETCH_USER_REQUEST: 'FETCH_USER_REQUEST',
  FETCH_USER_SUCCESS: 'FETCH_USER_SUCCESS',
  FETCH_USER_FAILURE: 'FETCH_USER_FAILURE',
  UPDATE_USER: 'UPDATE_USER'
} as const;

// 2. Action Creators
const userActions = {
  fetchUserRequest: () => ({
    type: ActionTypes.FETCH_USER_REQUEST
  }),
  
  fetchUserSuccess: (user: User) => ({
    type: ActionTypes.FETCH_USER_SUCCESS,
    payload: user
  }),
  
  fetchUserFailure: (error: string) => ({
    type: ActionTypes.FETCH_USER_FAILURE,
    payload: error
  }),
  
  updateUser: (user: User) => ({
    type: ActionTypes.UPDATE_USER,
    payload: user
  })
};

// 3. Reducer
interface UserState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  loading: false,
  error: null
};

function userReducer(state = initialState, action: any): UserState {
  switch (action.type) {
    case ActionTypes.FETCH_USER_REQUEST:
      return { ...state, loading: true, error: null };
      
    case ActionTypes.FETCH_USER_SUCCESS:
      return { ...state, loading: false, user: action.payload };
      
    case ActionTypes.FETCH_USER_FAILURE:
      return { ...state, loading: false, error: action.payload };
      
    case ActionTypes.UPDATE_USER:
      return { ...state, user: action.payload };
      
    default:
      return state;
  }
}

// 4. Async Action (Thunk)
const fetchUser = (id: string) => async (dispatch: any) => {
  dispatch(userActions.fetchUserRequest());
  try {
    const response = await fetch(\`/api/users/\${id}\`);
    const user = await response.json();
    dispatch(userActions.fetchUserSuccess(user));
  } catch (error) {
    dispatch(userActions.fetchUserFailure('加载失败'));
  }
};

// 5. Store
import { configureStore } from '@reduxjs/toolkit';

const store = configureStore({
  reducer: {
    user: userReducer
  }
});

// 6. 使用
import { useDispatch, useSelector } from 'react-redux';

function UserProfile({ id }: { id: string }) {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state: any) => state.user);
  
  useEffect(() => {
    dispatch(fetchUser(id));
  }, [id]);
  
  if (loading) return <div>加载中...</div>;
  if (error) return <div>{error}</div>;
  return <div>{user?.name}</div>;
}`,
    },
    {
      title: '12. 微前端架构',
      category: '架构模式',
      what: '将大型应用拆分为多个独立的子应用，各自开发、部署、运行',
      why: '支持多团队协作，技术栈无关，独立部署，降低复杂度',
      how: '使用 qiankun、single-spa、Module Federation',
      sugar: '应用拆分',
      scenarios: ['大型企业应用', '多团队协作', '遗留系统改造', '技术栈迁移'],
      relations: ['与模块化配合', '支持独立部署', '增加通信复杂度'],
      code: `// 微前端架构示例（qiankun）
// 主应用 - main-app/src/main.ts
import { registerMicroApps, start } from 'qiankun';

// 注册子应用
registerMicroApps([
  {
    name: 'user-app',
    entry: '//localhost:8081',
    container: '#subapp-container',
    activeRule: '/user',
    props: {
      // 传递给子应用的数据
      token: localStorage.getItem('token')
    }
  },
  {
    name: 'product-app',
    entry: '//localhost:8082',
    container: '#subapp-container',
    activeRule: '/product'
  }
]);

// 启动 qiankun
start({
  prefetch: true,
  sandbox: { strictStyleIsolation: true }
});

// 子应用 - user-app/src/main.ts
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

let app: any = null;

// 导出生命周期函数
export async function bootstrap() {
  console.log('user-app bootstraped');
}

export async function mount(props: any) {
  console.log('user-app mounted', props);
  app = createApp(App);
  app.use(router);
  app.mount(props.container?.querySelector('#app') || '#app');
}

export async function unmount() {
  console.log('user-app unmounted');
  app?.unmount();
  app = null;
}

// 独立运行
if (!(window as any).__POWERED_BY_QIANKUN__) {
  mount({});
}

// 应用间通信
import { initGlobalState } from 'qiankun';

const actions = initGlobalState({
  user: null,
  token: ''
});

// 监听状态变化
actions.onGlobalStateChange((state, prev) => {
  console.log('状态变化', state, prev);
});

// 修改状态
actions.setGlobalState({ user: { name: 'Alice' } });`,
    },
    {
      title: '13. BFF 架构',
      category: '架构模式',
      what: 'Backend for Frontend，为前端提供专属的 API 层，聚合和转换后端数据',
      why: '减少前端复杂度，优化网络请求，适配不同端的需求',
      how: '在前后端之间增加 BFF 层，使用 Node.js/GraphQL',
      sugar: 'API 聚合',
      scenarios: ['多端应用', 'API 聚合', '数据转换', '权限控制'],
      relations: ['与微服务配合', '减少前端请求', '增加中间层'],
      code: `// BFF 架构示例（Node.js + Express）
// bff-server/src/index.ts
import express from 'express';
import axios from 'axios';

const app = express();

// 用户服务
const userService = axios.create({
  baseURL: 'http://user-service:8080'
});

// 订单服务
const orderService = axios.create({
  baseURL: 'http://order-service:8081'
});

// BFF API - 聚合用户和订单数据
app.get('/api/user-profile/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // 并行请求多个服务
    const [userRes, ordersRes] = await Promise.all([
      userService.get(\`/users/\${id}\`),
      orderService.get(\`/orders?userId=\${id}\`)
    ]);
    
    // 数据聚合和转换
    const profile = {
      user: userRes.data,
      orders: ordersRes.data,
      orderCount: ordersRes.data.length,
      totalAmount: ordersRes.data.reduce((sum: number, order: any) => 
        sum + order.amount, 0
      )
    };
    
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: '获取用户信息失败' });
  }
});

// BFF API - 数据转换
app.get('/api/dashboard', async (req, res) => {
  try {
    // 请求多个后端服务
    const [users, orders, products] = await Promise.all([
      userService.get('/users/stats'),
      orderService.get('/orders/stats'),
      axios.get('http://product-service:8082/products/stats')
    ]);
    
    // 转换为前端需要的格式
    const dashboard = {
      userStats: {
        total: users.data.total,
        active: users.data.active,
        growth: users.data.growth
      },
      orderStats: {
        total: orders.data.total,
        revenue: orders.data.revenue,
        trend: orders.data.trend
      },
      productStats: {
        total: products.data.total,
        categories: products.data.categories
      }
    };
    
    res.json(dashboard);
  } catch (error) {
    res.status(500).json({ error: '获取仪表盘数据失败' });
  }
});

app.listen(3000, () => {
  console.log('BFF server running on port 3000');
});

// 前端使用
const profile = await fetch('/api/user-profile/123').then(r => r.json());
console.log(profile.user, profile.orders, profile.orderCount);`,
    },
    {
      title: '14. SSR/SSG/ISR 架构',
      category: '架构模式',
      what: 'SSR 服务端渲染、SSG 静态生成、ISR 增量静态再生',
      why: '提升首屏性能，改善 SEO，支持动态和静态内容',
      how: '使用 Next.js/Nuxt.js，配置渲染策略',
      sugar: '渲染策略',
      scenarios: ['SEO 优化', '首屏性能', '内容网站', '电商平台'],
      relations: ['与 CSR 对比', '影响性能', '需要服务器支持'],
      code: `// Next.js 渲染策略
// 1. SSR - 服务端渲染（每次请求都渲染）
// pages/user/[id].tsx
export async function getServerSideProps(context: any) {
  const { id } = context.params;
  const res = await fetch(\`https://api.example.com/users/\${id}\`);
  const user = await res.json();
  
  return {
    props: { user }
  };
}

export default function UserPage({ user }: { user: User }) {
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}

// 2. SSG - 静态生成（构建时生成）
// pages/posts/[slug].tsx
export async function getStaticPaths() {
  const res = await fetch('https://api.example.com/posts');
  const posts = await res.json();
  
  const paths = posts.map((post: any) => ({
    params: { slug: post.slug }
  }));
  
  return { paths, fallback: false };
}

export async function getStaticProps({ params }: any) {
  const res = await fetch(\`https://api.example.com/posts/\${params.slug}\`);
  const post = await res.json();
  
  return {
    props: { post }
  };
}

export default function PostPage({ post }: { post: Post }) {
  return (
    <article>
      <h1>{post.title}</h1>
      <div>{post.content}</div>
    </article>
  );
}

// 3. ISR - 增量静态再生（定时重新生成）
export async function getStaticProps() {
  const res = await fetch('https://api.example.com/posts');
  const posts = await res.json();
  
  return {
    props: { posts },
    revalidate: 60 // 60 秒后重新生成
  };
}

// 4. CSR - 客户端渲染（传统 SPA）
import { useEffect, useState } from 'react';

export default function ClientPage() {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    fetch('/api/data')
      .then(r => r.json())
      .then(setData);
  }, []);
  
  if (!data) return <div>加载中...</div>;
  return <div>{JSON.stringify(data)}</div>;
}`,
    },
    {
      title: '15. 依赖注入模式',
      category: '设计模式',
      what: '通过外部注入依赖，而不是在内部创建，降低耦合度',
      why: '提高可测试性，便于替换实现，支持多态',
      how: '使用构造函数注入、属性注入、接口注入',
      sugar: 'DI 容器',
      scenarios: ['服务层', '测试替换', '插件系统', '配置管理'],
      relations: ['与 IoC 配合', '支持单元测试', '降低耦合'],
      code: `// 依赖注入示例
// 1. 不使用依赖注入（紧耦合）
class UserService {
  private api = new ApiClient(); // 硬编码依赖
  
  async getUser(id: string) {
    return this.api.get(\`/users/\${id}\`);
  }
}

// 2. 使用依赖注入（松耦合）
interface IApiClient {
  get(url: string): Promise<any>;
  post(url: string, data: any): Promise<any>;
}

class UserService {
  constructor(private api: IApiClient) {} // 注入依赖
  
  async getUser(id: string) {
    return this.api.get(\`/users/\${id}\`);
  }
}

// 真实实现
class ApiClient implements IApiClient {
  async get(url: string) {
    return fetch(url).then(r => r.json());
  }
  
  async post(url: string, data: any) {
    return fetch(url, {
      method: 'POST',
      body: JSON.stringify(data)
    }).then(r => r.json());
  }
}

// Mock 实现（用于测试）
class MockApiClient implements IApiClient {
  async get(url: string) {
    return { id: '123', name: 'Test User' };
  }
  
  async post(url: string, data: any) {
    return { success: true };
  }
}

// 使用
const apiClient = new ApiClient();
const userService = new UserService(apiClient);

// 测试时使用 Mock
const mockClient = new MockApiClient();
const testService = new UserService(mockClient);

// 3. 使用 DI 容器（InversifyJS）
import { Container, injectable, inject } from 'inversify';

const TYPES = {
  ApiClient: Symbol.for('ApiClient'),
  UserService: Symbol.for('UserService')
};

@injectable()
class ApiClient implements IApiClient {
  async get(url: string) {
    return fetch(url).then(r => r.json());
  }
  
  async post(url: string, data: any) {
    return fetch(url, {
      method: 'POST',
      body: JSON.stringify(data)
    }).then(r => r.json());
  }
}

@injectable()
class UserService {
  constructor(
    @inject(TYPES.ApiClient) private api: IApiClient
  ) {}
  
  async getUser(id: string) {
    return this.api.get(\`/users/\${id}\`);
  }
}

// 配置容器
const container = new Container();
container.bind<IApiClient>(TYPES.ApiClient).to(ApiClient);
container.bind<UserService>(TYPES.UserService).to(UserService);

// 获取实例
const service = container.get<UserService>(TYPES.UserService);`,
    },
  ];

  const architecturePatterns = [
    { name: 'MVC', desc: 'Model-View-Controller', use: '传统 Web 应用' },
    { name: 'MVVM', desc: 'Model-View-ViewModel', use: 'React/Vue 应用' },
    { name: 'Flux/Redux', desc: '单向数据流', use: '复杂状态管理' },
    { name: '微前端', desc: '应用拆分', use: '多团队协作' },
    { name: 'BFF', desc: 'Backend for Frontend', use: 'API 聚合' },
    { name: 'SSR/SSG/ISR', desc: '渲染策略', use: 'SEO 和性能优化' },
  ];

  const designDimensions = [
    { name: '项目结构', desc: '目录规范化', icon: '📁' },
    { name: '模块化', desc: '代码拆分', icon: '🧩' },
    { name: '组件化', desc: 'UI 复用', icon: '🎨' },
    { name: '状态管理', desc: '数据流控制', icon: '🔄' },
    { name: '数据层', desc: 'API 封装', icon: '🌐' },
    { name: '路由系统', desc: '页面导航', icon: '🗺️' },
    { name: '构建部署', desc: '工程化', icon: '🚀' },
    { name: '可观测性', desc: '监控运维', icon: '📊' },
  ];

  const resources = [
    { name: 'Clean Architecture', url: 'https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html', description: '整洁架构理念' },
    { name: 'Micro Frontends', url: 'https://micro-frontends.org/', description: '微前端官方文档' },
    { name: 'qiankun', url: 'https://qiankun.umijs.org/', description: '微前端框架' },
    { name: 'Next.js', url: 'https://nextjs.org/', description: 'React SSR 框架' },
    { name: 'Nuxt.js', url: 'https://nuxt.com/', description: 'Vue SSR 框架' },
    { name: 'Martin Fowler', url: 'https://martinfowler.com/', description: '架构设计大师博客' },
  ];

  const summary = {
    philosophy: '架构设计 = 系统化规划 + 模块边界 + 数据流 + 可扩展性 + 可维护性',
    core: '解决复杂性，支撑项目长期健康演进',
    suggestion: '先理解业务需求，再选择合适的架构模式，持续重构优化',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50 to-orange-50 p-4 sm:p-6">
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
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-600 to-orange-600 rounded-2xl shadow-lg mb-4">
            <Layers className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-gray-800">
            前端架构设计
          </h1>
          <p className="text-gray-600">
            系统掌握前端架构设计思想，支撑项目长期健康演进
          </p>
        </div>

        {/* 核心理念卡片 */}
        <Card className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">架构设计核心理念</h2>
          <div className="space-y-3">
            <div className="p-4 bg-white rounded-lg">
              <p className="text-sm text-gray-700">
                <span className="font-semibold text-amber-700">一句话定义：</span>
                {summary.philosophy}
              </p>
            </div>
            <div className="p-4 bg-white rounded-lg">
              <p className="text-sm text-gray-700">
                <span className="font-semibold text-orange-700">核心目标：</span>
                {summary.core}
              </p>
            </div>
            <div className="p-4 bg-white rounded-lg">
              <p className="text-sm text-gray-700">
                <span className="font-semibold text-red-700">设计建议：</span>
                {summary.suggestion}
              </p>
            </div>
          </div>
        </Card>

        {/* 七大设计维度 */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-amber-600" />
            七大设计维度
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {designDimensions.map((dimension, idx) => (
              <div key={idx} className="p-4 rounded-lg bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200">
                <div className="text-3xl mb-2">{dimension.icon}</div>
                <h3 className="font-semibold text-gray-800 mb-1">{dimension.name}</h3>
                <p className="text-sm text-gray-600">{dimension.desc}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* 架构模式 */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">典型架构模式</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {architecturePatterns.map((pattern, idx) => (
              <div key={idx} className="p-4 rounded-lg bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200">
                <h3 className="font-semibold text-gray-800 mb-1">{pattern.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{pattern.desc}</p>
                <span className="text-xs text-amber-600 font-medium">适用: {pattern.use}</span>
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
                <CheckCircle2 className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-2xl font-bold text-gray-800">{section.title}</h2>
                    <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs rounded-full font-medium">
                      {section.category}
                    </span>
                  </div>
                </div>
              </div>

              {/* 核心信息卡片 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="p-4 rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-500">
                  <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <span className="text-amber-600">💡</span>
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

                <div className="p-4 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 border-l-4 border-purple-500">
                  <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <span className="text-purple-600">🍬</span>
                    语法糖
                  </h3>
                  <p className="text-sm text-gray-700">{section.sugar}</p>
                </div>
              </div>

              {/* 使用场景 */}
              <div className="mb-4">
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  使用场景
                </h3>
                <div className="flex flex-wrap gap-2">
                  {section.scenarios.map((scenario, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-amber-100 text-amber-700 text-xs rounded-full"
                    >
                      {scenario}
                    </span>
                  ))}
                </div>
              </div>

              {/* 关联关系 */}
              <div className="mb-4">
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <span className="text-orange-600">🔗</span>
                  关联关系
                </h3>
                <ul className="space-y-1">
                  {section.relations.map((relation, i) => (
                    <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                      <span className="text-orange-400 flex-shrink-0 mt-0.5">•</span>
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
                className="p-4 rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 hover:shadow-lg transition-all group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 group-hover:text-amber-600 transition-colors mb-1">
                      {resource.name}
                    </h3>
                    <p className="text-sm text-gray-600">{resource.description}</p>
                  </div>
                  <span className="text-amber-400 group-hover:text-amber-600 transition-colors">→</span>
                </div>
              </a>
            ))}
          </div>
        </Card>

        {/* 架构关系图谱 */}
        <Card className="p-6 bg-gradient-to-br from-amber-100 to-orange-100 border-2 border-amber-300">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">架构关系图谱</h2>
          <div className="bg-white p-6 rounded-lg">
            <pre className="text-sm text-gray-700 overflow-x-auto">
{`┌────────────────────────────────────────────┐
│            前端架构设计                     │
├────────────────────────────────────────────┤
│ 项目结构 → 组件系统 → 状态管理 → 数据层    │
│    ↓          ↓          ↓         ↓       │
│ 构建部署 ← 工程化工具 ← 监控 ← 性能优化    │
└────────────────────────────────────────────┘

关系说明：
• 项目结构 决定模块划分和职责边界
• 组件系统 与 状态管理 是逻辑与视图的核心
• 数据层 连接前端与后端
• 构建部署 决定交付质量
• 可观测性 支撑系统维护与优化
• 工程化工具链 联通所有环节形成闭环`}
            </pre>
          </div>
        </Card>
      </div>
    </div>
  );
}
