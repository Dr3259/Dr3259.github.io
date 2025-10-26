'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, BookOpen, ExternalLink, Code, CheckCircle2, TrendingUp, Sparkles, Zap } from 'lucide-react';
import Link from 'next/link';

export default function MobXPage() {
  const coreConcepts = [
    {
      title: 'observable（可观察状态）',
      what: '让普通对象变为响应式状态',
      why: '自动追踪状态变化',
      how: 'makeAutoObservable(obj) / observable.box(value)',
      scenarios: ['响应式状态', '自动更新'],
      relations: ['被 computed 和 reaction 追踪'],
      code: `import { makeObservable, observable, makeAutoObservable } from 'mobx';

// 方式1：makeAutoObservable（推荐）
class TodoStore {
  todos = [];
  filter = '';

  constructor() {
    makeAutoObservable(this); // 自动推断所有属性
  }
}

// 方式2：手动声明
class CounterStore {
  count = 0;

  constructor() {
    makeObservable(this, {
      count: observable
    });
  }
}

// 方式3：observable.box（基本类型）
import { observable } from 'mobx';
const count = observable.box(0);
console.log(count.get()); // 0
count.set(1);`,
    },
    {
      title: 'computed（派生值）',
      what: '基于 state 自动计算结果并缓存',
      why: '避免重复计算，自动更新',
      how: 'computed(() => totalPrice)',
      scenarios: ['派生数据', '计算属性'],
      relations: ['依赖 observable', '自动缓存结果'],
      code: `import { makeAutoObservable, computed } from 'mobx';

class CartStore {
  items = [
    { name: 'Apple', price: 10, quantity: 2 },
    { name: 'Banana', price: 5, quantity: 3 }
  ];

  constructor() {
    makeAutoObservable(this);
  }

  // getter 自动识别为 computed
  get totalPrice() {
    return this.items.reduce((sum, item) => 
      sum + item.price * item.quantity, 0
    );
  }

  get itemCount() {
    return this.items.length;
  }
}

// 独立 computed
const cart = new CartStore();
const total = computed(() => cart.totalPrice * 1.1); // 加税
console.log(total.get());`,
    },
    {
      title: 'action（状态修改逻辑）',
      what: '保证状态修改有组织，且触发反应',
      why: '集中管理状态变更，批量更新',
      how: 'action(() => { count++ })',
      scenarios: ['状态更新', '业务逻辑'],
      relations: ['修改 observable', '触发 reaction'],
      code: `import { makeAutoObservable, action } from 'mobx';

class TodoStore {
  todos = [];

  constructor() {
    makeAutoObservable(this);
  }

  // 方法自动识别为 action
  addTodo(title) {
    this.todos.push({
      id: Date.now(),
      title,
      done: false
    });
  }

  toggleTodo(id) {
    const todo = this.todos.find(t => t.id === id);
    if (todo) todo.done = !todo.done;
  }

  // 异步 action
  async fetchTodos() {
    const response = await fetch('/api/todos');
    const data = await response.json();
    // 使用 runInAction 包裹异步后的状态修改
    runInAction(() => {
      this.todos = data;
    });
  }
}`,
    },
    {
      title: 'reaction（副作用响应）',
      what: '在状态变化时执行副作用',
      why: '处理非渲染逻辑',
      how: 'reaction(() => expr, value => doSomething())',
      scenarios: ['数据同步', '日志记录'],
      relations: ['监听 observable 变化'],
      code: `import { reaction, makeAutoObservable } from 'mobx';

class UserStore {
  user = null;

  constructor() {
    makeAutoObservable(this);

    // 当 user 变化时，保存到 localStorage
    reaction(
      () => this.user,
      (user) => {
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
        } else {
          localStorage.removeItem('user');
        }
      }
    );
  }

  setUser(user) {
    this.user = user;
  }
}

// 使用 reaction 监听特定值
const store = new UserStore();
reaction(
  () => store.user?.name,
  (name) => {
    console.log('User name changed to:', name);
  }
);`,
    },
    {
      title: 'autorun（自动执行追踪函数）',
      what: '依赖变化即自动执行',
      why: '简化副作用管理',
      how: 'autorun(() => console.log(store.count))',
      scenarios: ['调试', '自动同步'],
      relations: ['自动追踪所有 observable'],
      code: `import { autorun, makeAutoObservable } from 'mobx';

class CounterStore {
  count = 0;

  constructor() {
    makeAutoObservable(this);
  }

  increment() {
    this.count++;
  }
}

const store = new CounterStore();

// autorun 会立即执行一次，并在依赖变化时重新执行
const dispose = autorun(() => {
  console.log('Count is:', store.count);
  // 自动追踪 store.count
});

store.increment(); // 触发 autorun
store.increment(); // 再次触发

// 停止追踪
dispose();`,
    },
    {
      title: 'observer（React 组件装饰器）',
      what: '将组件与状态响应绑定',
      why: '自动重渲染',
      how: 'observer(() => <div>{store.count}</div>)',
      scenarios: ['React 组件', '自动更新 UI'],
      relations: ['订阅 observable', '精确更新'],
      code: `import { observer } from 'mobx-react-lite';
import { makeAutoObservable } from 'mobx';

class CounterStore {
  count = 0;

  constructor() {
    makeAutoObservable(this);
  }

  increment() {
    this.count++;
  }
}

const store = new CounterStore();

// ✅ 使用 observer 包裹组件
const Counter = observer(() => {
  return (
    <div>
      <p>Count: {store.count}</p>
      <button onClick={() => store.increment()}>
        增加
      </button>
    </div>
  );
});

// ❌ 不使用 observer，组件不会自动更新
const BadCounter = () => {
  return <p>Count: {store.count}</p>;
};`,
    },
  ];

  const bestPractices = [
    {
      title: 'makeAutoObservable（推荐）',
      what: '自动推断 observable/computed/action',
      scenarios: ['现代 MobX 写法', '减少模板代码'],
      code: `import { makeAutoObservable } from 'mobx';

class TodoStore {
  todos = [];
  filter = '';

  constructor() {
    // ✅ 自动识别：
    // - 普通属性 → observable
    // - getter → computed
    // - 方法 → action
    makeAutoObservable(this);
  }

  get filteredTodos() {
    return this.todos.filter(todo => 
      todo.title.includes(this.filter)
    );
  }

  addTodo(title) {
    this.todos.push({ id: Date.now(), title, done: false });
  }

  setFilter(filter) {
    this.filter = filter;
  }
}`,
    },
    {
      title: 'Domain Store 模式',
      what: '每个领域独立一个 store',
      scenarios: ['大型项目', '模块化管理'],
      code: `// stores/UserStore.js
import { makeAutoObservable } from 'mobx';

class UserStore {
  user = null;
  loading = false;

  constructor() {
    makeAutoObservable(this);
  }

  async login(credentials) {
    this.loading = true;
    try {
      const user = await api.login(credentials);
      this.user = user;
    } finally {
      this.loading = false;
    }
  }
}

export const userStore = new UserStore();

// stores/CartStore.js
class CartStore {
  items = [];

  constructor() {
    makeAutoObservable(this);
  }

  addItem(item) {
    this.items.push(item);
  }
}

export const cartStore = new CartStore();

// stores/index.js
export { userStore } from './UserStore';
export { cartStore } from './CartStore';`,
    },
    {
      title: 'mobx-react-lite（推荐）',
      what: '使用函数式组件，性能更好',
      scenarios: ['React 集成', '现代 React'],
      code: `import { observer } from 'mobx-react-lite';
import { userStore, cartStore } from './stores';

// ✅ 函数式组件 + observer
const UserProfile = observer(() => {
  const { user, loading } = userStore;

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please login</div>;

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
});

// ✅ 多个 store
const Dashboard = observer(() => {
  return (
    <div>
      <UserProfile />
      <p>Cart items: {cartStore.items.length}</p>
    </div>
  );
});`,
    },
  ];

  const resources = [
    { name: 'MobX 官方文档', url: 'https://mobx.js.org/', description: '最权威的 MobX 学习资源' },
    { name: 'MobX 中文文档', url: 'https://zh.mobx.js.org/', description: 'MobX 官方中文文档' },
    { name: 'mobx-react-lite', url: 'https://github.com/mobxjs/mobx-react-lite', description: 'React 轻量级绑定' },
    { name: 'MobX State Tree', url: 'https://mobx-state-tree.js.org/', description: 'MobX 的状态树方案' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-rose-50 to-pink-50 p-4 sm:p-6">
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
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-rose-500 to-pink-500 rounded-2xl shadow-lg mb-4">
            <Code className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-gray-800">
            MobX 完整知识体系
          </h1>
          <p className="text-gray-600">
            掌握响应式状态管理库，让数据变化像 Excel 表格一样自动更新
          </p>
        </div>

        {/* MobX 是什么 */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">MobX 是什么</h2>
          <p className="text-gray-700 mb-4">
            MobX 是一个<span className="font-semibold text-rose-600">响应式状态管理库</span>，用于让应用状态和 UI 自动保持同步。
          </p>
          <p className="text-gray-700 mb-4">
            核心思想：<span className="font-semibold">可观察状态（state） + 自动追踪依赖（derivation） + 响应式更新（reaction）</span>
          </p>
          <div className="p-4 bg-gradient-to-r from-rose-50 to-pink-50 rounded-lg border-l-4 border-rose-500">
            <p className="text-gray-800 font-semibold">
              💡 一句话版本：MobX 让数据变化像 Excel 表格一样自动更新结果
            </p>
          </div>
        </Card>

        {/* 为什么使用 MobX */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">为什么使用 MobX</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-300">
                  <th className="text-left p-3 font-semibold text-gray-800">问题</th>
                  <th className="text-left p-3 font-semibold text-gray-800">传统方式</th>
                  <th className="text-left p-3 font-semibold text-gray-800">MobX 解决方式</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="p-3 font-medium">状态修改需要手动通知</td>
                  <td className="p-3 text-gray-600">繁琐、模板化（如 Redux dispatch）</td>
                  <td className="p-3 text-green-600">自动追踪依赖，修改即更新</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-3 font-medium">组件重渲染过多或过少</td>
                  <td className="p-3 text-gray-600">需要优化 memo/useMemo</td>
                  <td className="p-3 text-green-600">精确追踪依赖数据，局部更新</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-3 font-medium">面向对象状态管理</td>
                  <td className="p-3 text-gray-600">Redux 要求纯函数</td>
                  <td className="p-3 text-green-600">支持类 + 装饰器，天然 OOP 风格</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-3 font-medium">全局状态与局部状态界限模糊</td>
                  <td className="p-3 text-gray-600">Redux/Context 都需设计层次</td>
                  <td className="p-3 text-green-600">任意粒度状态共享皆可</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
            <p className="text-gray-800">
              <span className="font-semibold text-blue-700">简言之：</span>
              MobX 追求的是<span className="font-semibold">"自动化与直觉化的状态响应"</span>，而不是手动维护流程。
            </p>
          </div>
        </Card>

        {/* 核心概念 */}
        <div className="mb-8">
          <Card className="p-6 bg-white/80 backdrop-blur-sm mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="w-6 h-6 text-rose-600" />
              <h2 className="text-2xl font-bold text-gray-800">核心概念（6 大机制）</h2>
            </div>
          </Card>

          <div className="space-y-6">
            {coreConcepts.map((concept, idx) => (
              <Card key={idx} id={`section-${idx + 1}`} className="p-6 bg-white/80 backdrop-blur-sm scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <CheckCircle2 className="w-6 h-6 text-rose-600 flex-shrink-0 mt-1" />
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

        {/* 最佳实践 */}
        <div className="mb-8">
          <Card className="p-6 bg-white/80 backdrop-blur-sm mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-800">现代最佳实践</h2>
            </div>
          </Card>

          <div className="space-y-6">
            {bestPractices.map((practice, idx) => (
              <Card key={idx} id={`section-${coreConcepts.length + idx + 1}`} className="p-6 bg-white/80 backdrop-blur-sm scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <CheckCircle2 className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{practice.title}</h3>
                    <p className="text-gray-600">{practice.what}</p>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-purple-50 border border-purple-200 mb-4">
                  <h4 className="font-semibold text-gray-800 mb-2">📦 使用场景</h4>
                  <ul className="space-y-1">
                    {practice.scenarios.map((s, i) => (
                      <li key={i} className="text-sm text-gray-700">• {s}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">代码示例</h4>
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{practice.code}</code>
                  </pre>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* 响应链路图 */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">MobX 响应链路</h2>
          <div className="p-4 bg-gray-50 rounded-lg">
            <pre className="text-sm text-gray-700 overflow-x-auto whitespace-pre">
{`┌────────────────────────────────────────────┐
│            MobX 响应链路                   │
├────────────────────────────────────────────┤
│ observable（状态）                         │
│      ↓                                      │
│ computed（派生值）                         │
│      ↓                                      │
│ reaction / autorun / observer（副作用）     │
│      ↓                                      │
│ React 组件渲染更新                         │
└────────────────────────────────────────────┘

或类比为：
数据（observable） → 计算（computed） → 行为（action） → 视图（observer）

MobX 自动建立了这条依赖链，开发者只需专注于数据逻辑。`}
            </pre>
          </div>
        </Card>

        {/* 使用场景 */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">典型使用场景</h2>
          <div className="space-y-3">
            <div className="p-4 bg-gradient-to-r from-rose-50 to-pink-50 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">复杂表单状态</h3>
              <p className="text-sm text-gray-600">输入联动、实时计算、表单验证 → 多个字段联动显示、动态验证</p>
            </div>
            <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">电商购物车 / 库存</h3>
              <p className="text-sm text-gray-600">数据随计算结果自动刷新 → 价格汇总、库存变化联动</p>
            </div>
            <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">实时数据仪表盘</h3>
              <p className="text-sm text-gray-600">自动更新 UI，无需手动刷新 → 股票价格、传感器数据</p>
            </div>
            <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">中小型 React 项目</h3>
              <p className="text-sm text-gray-600">不想写模板化 Redux 代码 → 逻辑集中在类或 store</p>
            </div>
            <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">游戏或模拟类 UI</h3>
              <p className="text-sm text-gray-600">状态频繁变化 → 游戏状态、角色属性系统</p>
            </div>
          </div>
        </Card>

        {/* MobX vs 其他方案 */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">MobX vs 其他状态管理方案</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-300">
                  <th className="text-left p-3 font-semibold text-gray-800">对比项</th>
                  <th className="text-left p-3 font-semibold text-gray-800">Redux</th>
                  <th className="text-left p-3 font-semibold text-gray-800">MobX</th>
                  <th className="text-left p-3 font-semibold text-gray-800">Zustand</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="p-3 font-medium">核心范式</td>
                  <td className="p-3 text-gray-600">Flux（纯函数）</td>
                  <td className="p-3 text-green-600">响应式（可观察）</td>
                  <td className="p-3 text-gray-600">Hook 驱动</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-3 font-medium">代码风格</td>
                  <td className="p-3 text-gray-600">模板化，函数式</td>
                  <td className="p-3 text-green-600">自然，面向对象</td>
                  <td className="p-3 text-gray-600">极简 Hook</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-3 font-medium">状态更新</td>
                  <td className="p-3 text-gray-600">dispatch(action)</td>
                  <td className="p-3 text-green-600">直接修改属性</td>
                  <td className="p-3 text-gray-600">setter 函数</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-3 font-medium">依赖追踪</td>
                  <td className="p-3 text-gray-600">手动订阅</td>
                  <td className="p-3 text-green-600">自动依赖追踪</td>
                  <td className="p-3 text-gray-600">手动读取</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-3 font-medium">使用场景</td>
                  <td className="p-3 text-gray-600">大型项目</td>
                  <td className="p-3 text-green-600">中大型或中型</td>
                  <td className="p-3 text-gray-600">中小项目</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-3 font-medium">学习曲线</td>
                  <td className="p-3 text-gray-600">稍陡</td>
                  <td className="p-3 text-green-600">平缓</td>
                  <td className="p-3 text-gray-600">极平缓</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-4 p-4 bg-gradient-to-r from-rose-50 to-pink-50 rounded-lg">
            <p className="text-gray-800">
              <span className="font-semibold text-rose-700">定位：</span>
              MobX 是介于 Redux 严格性与 Zustand 灵活性之间的折中方案
            </p>
          </div>
        </Card>

        {/* 最佳实践清单 */}
        <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">✅ MobX 现代最佳实践清单</h2>
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-700">使用 makeAutoObservable，避免手动声明 observable/action</p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-700">使用 mobx-react-lite + 函数式组件（性能更好）</p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-700">每个领域独立一个 store（domain store 模式）</p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-700">避免在 action 外部直接修改状态</p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-700">用 computed 代替手动 derived 状态</p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-700">用 reaction 管理副作用（而非组件里滥用 useEffect）</p>
            </div>
          </div>
        </Card>

        {/* 学习资源 */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm mb-8">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-6 h-6 text-rose-600" />
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
          <Card className="inline-block p-4 bg-gradient-to-r from-white/80 to-rose-50/80 backdrop-blur-sm border border-rose-200/50">
            <p className="text-sm text-gray-700">
              💡 建议：从 makeAutoObservable 开始，掌握 observable/computed/action，学习 observer 组件，最后实践 Domain Store 模式
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
