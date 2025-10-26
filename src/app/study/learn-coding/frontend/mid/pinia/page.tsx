'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, BookOpen, ExternalLink, Code, CheckCircle2, TrendingUp, Sparkles, Zap } from 'lucide-react';
import Link from 'next/link';

export default function PiniaPage() {
  const coreConcepts = [
    {
      title: 'Store',
      what: '独立的状态容器（模块）',
      why: '管理模块化全局状态',
      how: 'const userStore = useUserStore()',
      scenarios: ['模块化状态管理', '独立业务逻辑'],
      relations: ['包含 state、getter、action 三要素'],
      code: `import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    username: '',
    email: '',
    isLoggedIn: false
  }),
  getters: {
    displayName: (state) => state.username || 'Guest'
  },
  actions: {
    login(username, email) {
      this.username = username;
      this.email = email;
      this.isLoggedIn = true;
    },
    logout() {
      this.username = '';
      this.email = '';
      this.isLoggedIn = false;
    }
  }
});`,
    },
    {
      title: 'State',
      what: '响应式数据',
      why: '储存全局可共享状态',
      how: 'state: () => ({ count: 0 })',
      scenarios: ['管理用户信息', '主题', '购物车', '登录状态'],
      relations: ['和 getter、action 构成 store 三要素'],
      code: `import { defineStore } from 'pinia';

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [],
    total: 0
  }),
  actions: {
    addItem(item) {
      this.items.push(item);
      this.total += item.price;
    }
  }
});

// 在组件中使用
<script setup>
import { useCartStore } from '@/stores/cart';

const cart = useCartStore();
console.log(cart.items); // 响应式数据
</script>`,
    },
    {
      title: 'Getter',
      what: '计算派生状态',
      why: '减少重复计算、保持性能',
      how: 'getters: { double: (s) => s.count * 2 }',
      scenarios: ['计算属性', '派生数据', '格式化显示'],
      relations: ['类似 Vue 的 computed', '可访问其他 getter'],
      code: `import { defineStore } from 'pinia';

export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0,
    firstName: 'John',
    lastName: 'Doe'
  }),
  getters: {
    // 基础 getter
    double: (state) => state.count * 2,
    
    // 访问其他 getter
    triple() {
      return this.double * 1.5;
    },
    
    // 组合多个 state
    fullName: (state) => \`\${state.firstName} \${state.lastName}\`,
    
    // 返回函数（可传参）
    getUserById: (state) => {
      return (userId) => state.users.find(u => u.id === userId);
    }
  }
});`,
    },
    {
      title: 'Action',
      what: '修改 state 的函数',
      why: '集中封装逻辑，支持异步',
      how: 'actions: { increment() { this.count++ } }',
      scenarios: ['业务逻辑', '异步请求', '状态更新'],
      relations: ['可调用其他 store', '支持异步操作'],
      code: `import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    loading: false,
    error: null
  }),
  actions: {
    // 同步 action
    setUser(user) {
      this.user = user;
    },
    
    // 异步 action
    async fetchUser(userId) {
      this.loading = true;
      this.error = null;
      try {
        const response = await fetch(\`/api/users/\${userId}\`);
        const data = await response.json();
        this.user = data;
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
    
    // 调用其他 store
    async loginAndFetchCart(credentials) {
      await this.login(credentials);
      const cartStore = useCartStore();
      await cartStore.fetchCart();
    }
  }
});`,
    },
  ];

  const piniaFeatures = [
    {
      title: '创建 Store（defineStore）',
      what: '定义一个 Pinia store',
      why: '模块化管理状态',
      scenarios: ['创建独立的状态模块'],
      relations: ['返回可在任何组件中使用的响应式 store 实例'],
      code: `import { defineStore } from 'pinia';

// Options API 风格
export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0,
    name: 'Pinia'
  }),
  getters: {
    double: (state) => state.count * 2
  },
  actions: {
    increment() {
      this.count++;
    }
  }
});

// 在组件中使用
<script setup>
import { useCounterStore } from '@/stores/counter';

const counter = useCounterStore();
counter.increment();
console.log(counter.double);
</script>`,
    },
    {
      title: '组合式语法（Setup Store）',
      what: '基于 Composition API 的 store 定义方式',
      why: '更灵活、直观，与 Vue setup 函数共用语法',
      scenarios: ['Vue3 新项目', '复杂逻辑封装'],
      relations: ['推荐在 Vue3 新项目中使用'],
      code: `import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useCounterStore = defineStore('counter', () => {
  // state
  const count = ref(0);
  const name = ref('Pinia');
  
  // getters
  const double = computed(() => count.value * 2);
  
  // actions
  function increment() {
    count.value++;
  }
  
  async function fetchData() {
    const data = await fetch('/api/data').then(r => r.json());
    count.value = data.value;
  }
  
  return { count, name, double, increment, fetchData };
});`,
    },
    {
      title: 'storeToRefs',
      what: '自动把 store 中的 state 转成 ref',
      why: '解构时保持响应性',
      scenarios: ['解构 store 状态', '保持响应式'],
      relations: ['避免失去响应性'],
      code: `import { storeToRefs } from 'pinia';
import { useCounterStore } from '@/stores/counter';

<script setup>
const counter = useCounterStore();

// ❌ 错误：直接解构会失去响应性
const { count, double } = counter;

// ✅ 正确：使用 storeToRefs
const { count, double } = storeToRefs(counter);

// actions 可以直接解构（不需要 storeToRefs）
const { increment } = counter;
</script>

<template>
  <div>
    <p>Count: {{ count }}</p>
    <p>Double: {{ double }}</p>
    <button @click="increment">增加</button>
  </div>
</template>`,
    },
    {
      title: '插件机制（Plugin）',
      what: 'store 的扩展 API',
      why: '添加持久化、日志、追踪等功能',
      scenarios: ['数据持久化', '日志记录', '性能分析'],
      relations: ['扩展 store 功能'],
      code: `import { createPinia } from 'pinia';

const pinia = createPinia();

// 自定义插件
pinia.use(({ store }) => {
  // 订阅状态变化
  store.$subscribe((mutation, state) => {
    console.log('State changed:', state);
  });
  
  // 订阅 action
  store.$onAction(({ name, store, args, after, onError }) => {
    console.log(\`Action "\${name}" called\`);
    
    after((result) => {
      console.log('Action completed');
    });
    
    onError((error) => {
      console.error('Action error:', error);
    });
  });
});

// 使用持久化插件
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
pinia.use(piniaPluginPersistedstate);

export default pinia;`,
    },
    {
      title: '订阅与持久化',
      what: '监听 store 变化并持久化数据',
      why: '实现状态持久化、日志记录',
      scenarios: ['保存到 localStorage', '状态追踪'],
      relations: ['与插件机制配合'],
      code: `import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    username: '',
    token: ''
  }),
  actions: {
    login(username, token) {
      this.username = username;
      this.token = token;
    }
  },
  // 使用持久化插件
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'user',
        storage: localStorage
      }
    ]
  }
});

// 在组件中订阅
<script setup>
const userStore = useUserStore();

// 订阅状态变化
userStore.$subscribe((mutation, state) => {
  console.log('User state changed:', state);
  // 可以在这里保存到 localStorage
  localStorage.setItem('user', JSON.stringify(state));
});

// 订阅 action
userStore.$onAction(({ name, args }) => {
  console.log(\`Action \${name} called with:\`, args);
});
</script>`,
    },
    {
      title: 'TypeScript 支持',
      what: '原生 TypeScript 友好',
      why: '自动推断类型、getter/action 参数',
      scenarios: ['类型安全', '代码提示'],
      relations: ['Pinia 原生支持 TypeScript'],
      code: `import { defineStore } from 'pinia';

interface User {
  id: number;
  name: string;
  email: string;
}

interface UserState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    user: null,
    loading: false,
    error: null
  }),
  getters: {
    isLoggedIn: (state): boolean => !!state.user,
    userName: (state): string => state.user?.name || 'Guest'
  },
  actions: {
    async fetchUser(userId: number): Promise<void> {
      this.loading = true;
      try {
        const response = await fetch(\`/api/users/\${userId}\`);
        this.user = await response.json();
      } catch (error) {
        this.error = (error as Error).message;
      } finally {
        this.loading = false;
      }
    }
  }
});`,
    },
    {
      title: 'DevTools 支持',
      what: 'Vue DevTools 自动集成',
      why: '可视化调试 store 状态',
      scenarios: ['调试状态变化', '时间旅行'],
      relations: ['自动集成到 Vue DevTools'],
      code: `// Pinia 自动集成到 Vue DevTools
// 无需额外配置

// 在 DevTools 中可以看到：
// - 所有 store 的状态
// - 每个 action 的调用记录
// - 状态变化的时间线
// - 可以手动修改状态进行测试

import { createPinia } from 'pinia';

const pinia = createPinia();

// DevTools 会自动检测并显示所有 store
export default pinia;`,
    },
  ];

  const resources = [
    { name: 'Pinia 官方文档', url: 'https://pinia.vuejs.org/', description: '最权威的 Pinia 学习资源' },
    { name: 'Pinia 中文文档', url: 'https://pinia.vuejs.org/zh/', description: 'Pinia 官方中文文档' },
    { name: 'Vue 官方文档', url: 'https://cn.vuejs.org/', description: 'Vue 3 官方文档' },
    { name: 'pinia-plugin-persistedstate', url: 'https://github.com/prazdevs/pinia-plugin-persistedstate', description: '状态持久化插件' },
    { name: 'Nuxt 3', url: 'https://nuxt.com/', description: 'Pinia 与 Nuxt 3 集成' },
    { name: 'Vue DevTools', url: 'https://devtools.vuejs.org/', description: 'Vue 开发者工具' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-yellow-50 to-amber-50 p-4 sm:p-6">
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
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-500 to-amber-500 rounded-2xl shadow-lg mb-4">
            <Code className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-gray-800">
            Pinia 完整知识体系
          </h1>
          <p className="text-gray-600">
            掌握 Vue 官方推荐的状态管理库，轻量优雅的 Vuex 替代方案
          </p>
        </div>

        {/* Pinia 是什么 */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Pinia 是什么</h2>
          <p className="text-gray-700 mb-4">
            Pinia 是<span className="font-semibold text-yellow-600"> Vue 官方推荐的状态管理库</span>，是 Vuex 的演化与替代品，基于 Composition API 设计。
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">💡 单一数据源</h3>
              <p className="text-sm text-gray-600">Single Source of Truth</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">🔄 响应式状态</h3>
              <p className="text-sm text-gray-600">Reactive State</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">🚀 模块化与类型友好</h3>
              <p className="text-sm text-gray-600">TypeScript first</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">🧩 零模板代码</h3>
              <p className="text-sm text-gray-600">轻量优雅</p>
            </div>
          </div>
        </Card>

        {/* 为什么需要 Pinia */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">为什么需要 Pinia</h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-800">Vuex 写法繁琐、模板多</p>
                <p className="text-sm text-gray-600">→ 用函数式 store 直接操作状态</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-800">状态共享困难</p>
                <p className="text-sm text-gray-600">→ 通过 useXxxStore() 即可共享响应式状态</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-800">TypeScript 兼容性差</p>
                <p className="text-sm text-gray-600">→ Pinia 原生 TypeScript 友好</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-800">多 store 组合复杂</p>
                <p className="text-sm text-gray-600">→ 可模块化拆分多个独立 store</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-800">难以在 Composition API 中使用</p>
                <p className="text-sm text-gray-600">→ Pinia 完全兼容 setup 语法</p>
              </div>
            </div>
          </div>
        </Card>

        {/* 核心概念 */}
        <div className="mb-8">
          <Card className="p-6 bg-white/80 backdrop-blur-sm mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="w-6 h-6 text-yellow-600" />
              <h2 className="text-2xl font-bold text-gray-800">核心概念</h2>
            </div>
          </Card>

          <div className="space-y-6">
            {coreConcepts.map((concept, idx) => (
              <Card key={idx} id={`section-${idx + 1}`} className="p-6 bg-white/80 backdrop-blur-sm scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <CheckCircle2 className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
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

        {/* Pinia 特性 */}
        <div className="mb-8">
          <Card className="p-6 bg-white/80 backdrop-blur-sm mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-800">Pinia 核心特性</h2>
            </div>
          </Card>

          <div className="space-y-6">
            {piniaFeatures.map((feature, idx) => (
              <Card key={idx} id={`section-${coreConcepts.length + idx + 1}`} className="p-6 bg-white/80 backdrop-blur-sm scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <CheckCircle2 className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
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

        {/* 数据流关系图 */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Pinia 数据流关系图</h2>
          <div className="p-4 bg-gray-50 rounded-lg">
            <pre className="text-sm text-gray-700 overflow-x-auto whitespace-pre">
{`Vue Component
   │
   ▼
useStore() —— 调用 ——> Pinia Store
   │                    │
   │                    ├── state（响应式数据）
   │                    ├── getter（计算派生）
   │                    └── action（逻辑操作）
   │
   ▼
storeToRefs() ——> 响应式数据绑定模板

数据流动方向：
组件调用 action → 修改 state → 触发 getter → 响应视图更新
是单向响应式的数据流动。`}
            </pre>
          </div>
        </Card>

        {/* Pinia vs Vuex */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Pinia vs Vuex 对比</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-300">
                  <th className="text-left p-3 font-semibold text-gray-800">对比点</th>
                  <th className="text-left p-3 font-semibold text-gray-800">Vuex</th>
                  <th className="text-left p-3 font-semibold text-gray-800">Pinia</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="p-3 font-medium">写法</td>
                  <td className="p-3 text-gray-600">模块化、mutation/action 分离</td>
                  <td className="p-3 text-green-600">函数式定义，简洁直观</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-3 font-medium">类型支持</td>
                  <td className="p-3 text-gray-600">一般</td>
                  <td className="p-3 text-green-600">原生支持 TypeScript</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-3 font-medium">Composition API</td>
                  <td className="p-3 text-gray-600">兼容性较差</td>
                  <td className="p-3 text-green-600">完美集成</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-3 font-medium">插件体系</td>
                  <td className="p-3 text-gray-600">独立插件</td>
                  <td className="p-3 text-green-600">简化且统一</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-3 font-medium">性能</td>
                  <td className="p-3 text-gray-600">中等</td>
                  <td className="p-3 text-green-600">更轻量、更快</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-3 font-medium">官方推荐度</td>
                  <td className="p-3 text-gray-600">过渡阶段</td>
                  <td className="p-3 text-green-600">✅ Vue3 官方标准方案</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>

        {/* 学习资源 */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm mb-8">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-6 h-6 text-yellow-600" />
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
          <Card className="inline-block p-4 bg-gradient-to-r from-white/80 to-yellow-50/80 backdrop-blur-sm border border-yellow-200/50">
            <p className="text-sm text-gray-700">
              💡 建议：从核心概念开始，掌握 defineStore 和 Setup Store 语法，理解与 Vuex 的区别
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
