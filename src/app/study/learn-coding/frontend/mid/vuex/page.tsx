'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, BookOpen, ExternalLink, Code, CheckCircle2, TrendingUp, Sparkles, Zap, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function VuexPage() {
  const coreConcepts = [
    {
      title: 'Store（仓库）',
      what: 'Vuex 的核心对象，集中式状态树',
      why: '统一存储应用所有状态，保证可预测性',
      how: 'new Vuex.Store({ state, mutations, actions, getters, modules })',
      scenarios: ['全局状态管理', '单一数据源'],
      relations: ['包含 state、mutations、actions、getters、modules'],
      code: `import { createStore } from 'vuex';

export default createStore({
  state: {
    count: 0,
    user: null
  },
  getters: {
    doubleCount: state => state.count * 2
  },
  mutations: {
    increment(state) {
      state.count++;
    }
  },
  actions: {
    asyncIncrement({ commit }) {
      setTimeout(() => commit('increment'), 1000);
    }
  },
  modules: {
    // 子模块
  }
});`,
    },
    {
      title: 'State（状态）',
      what: '全局共享数据源',
      why: '跨组件共享数据',
      how: 'store.state.count、mapState([\'count\'])',
      scenarios: ['用户信息', '主题配置', '购物车数据'],
      relations: ['被 Getters 计算', '被 Mutations 修改'],
      code: `// 定义 state
const store = createStore({
  state: {
    count: 0,
    user: {
      name: 'Alice',
      email: 'alice@example.com'
    },
    todos: []
  }
});

// 在组件中访问
<script setup>
import { useStore } from 'vuex';
import { computed } from 'vue';

const store = useStore();
const count = computed(() => store.state.count);
const user = computed(() => store.state.user);
</script>

// 使用 mapState
<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState(['count', 'user']),
    ...mapState({
      userCount: state => state.count
    })
  }
};
</script>`,
    },
    {
      title: 'Getters（计算属性）',
      what: '基于 state 的派生状态',
      why: '逻辑复用与缓存性能优化',
      how: 'getters: { double: state => state.count * 2 }',
      scenarios: ['计算派生数据', '过滤列表', '格式化显示'],
      relations: ['依赖 State', '类似 Vue 的 computed'],
      code: `const store = createStore({
  state: {
    count: 0,
    todos: [
      { id: 1, text: 'Learn Vue', done: true },
      { id: 2, text: 'Learn Vuex', done: false }
    ]
  },
  getters: {
    // 基础 getter
    doubleCount: state => state.count * 2,
    
    // 访问其他 getter
    tripleCount: (state, getters) => {
      return getters.doubleCount * 1.5;
    },
    
    // 返回函数（可传参）
    getTodoById: state => id => {
      return state.todos.find(todo => todo.id === id);
    },
    
    // 过滤数据
    doneTodos: state => {
      return state.todos.filter(todo => todo.done);
    },
    
    doneTodosCount: (state, getters) => {
      return getters.doneTodos.length;
    }
  }
});

// 使用
const double = computed(() => store.getters.doubleCount);
const todo = computed(() => store.getters.getTodoById(2));`,
    },
    {
      title: 'Mutations（同步修改）',
      what: '唯一能直接修改 state 的方式',
      why: '确保状态变更可追踪（devtools 可记录）',
      how: 'commit(\'increment\')',
      scenarios: ['同步更新状态', '可追踪的状态变更'],
      relations: ['被 Actions 调用', '直接修改 State'],
      code: `const store = createStore({
  state: {
    count: 0,
    user: null
  },
  mutations: {
    // 基础 mutation
    increment(state) {
      state.count++;
    },
    
    // 带参数的 mutation
    incrementBy(state, payload) {
      state.count += payload.amount;
    },
    
    // 对象风格提交
    setUser(state, user) {
      state.user = user;
    },
    
    // 使用常量
    [SOME_MUTATION](state) {
      // ...
    }
  }
});

// 提交 mutation
store.commit('increment');
store.commit('incrementBy', { amount: 10 });

// 对象风格提交
store.commit({
  type: 'incrementBy',
  amount: 10
});

// 在组件中
<script setup>
const store = useStore();

function handleClick() {
  store.commit('increment');
}
</script>`,
    },
    {
      title: 'Actions（异步逻辑）',
      what: '包含异步操作的函数',
      why: '将异步从 mutation 分离，保持状态更新纯净',
      how: 'dispatch(\'fetchData\')',
      scenarios: ['API 请求', '异步操作', '复杂业务逻辑'],
      relations: ['调用 Mutations', '可以包含异步操作'],
      code: `const store = createStore({
  state: {
    user: null,
    loading: false,
    error: null
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    setLoading(state, loading) {
      state.loading = loading;
    },
    setError(state, error) {
      state.error = error;
    }
  },
  actions: {
    // 异步 action
    async fetchUser({ commit }, userId) {
      commit('setLoading', true);
      try {
        const response = await fetch(\`/api/users/\${userId}\`);
        const user = await response.json();
        commit('setUser', user);
      } catch (error) {
        commit('setError', error.message);
      } finally {
        commit('setLoading', false);
      }
    },
    
    // 组合 actions
    async loginAndFetchData({ dispatch }, credentials) {
      await dispatch('login', credentials);
      await dispatch('fetchUserData');
    },
    
    // 返回 Promise
    actionA({ commit }) {
      return new Promise((resolve) => {
        setTimeout(() => {
          commit('someMutation');
          resolve();
        }, 1000);
      });
    }
  }
});

// 分发 action
store.dispatch('fetchUser', 123);

// 使用 Promise
store.dispatch('actionA').then(() => {
  // ...
});`,
    },
    {
      title: 'Modules（模块化）',
      what: '将 store 拆分为子模块',
      why: '管理大型应用的状态结构',
      how: 'modules: { user: {...}, cart: {...} }',
      scenarios: ['大型项目', '分区状态管理', '团队协作'],
      relations: ['包含独立的 state、getters、mutations、actions'],
      code: `// user 模块
const user = {
  namespaced: true,
  state: () => ({
    name: 'Ray',
    email: 'ray@example.com'
  }),
  getters: {
    fullInfo: state => \`\${state.name} <\${state.email}>\`
  },
  mutations: {
    setName(state, name) {
      state.name = name;
    }
  },
  actions: {
    async updateName({ commit }, name) {
      // 异步操作
      commit('setName', name);
    }
  }
};

// cart 模块
const cart = {
  namespaced: true,
  state: () => ({
    items: []
  }),
  mutations: {
    addItem(state, item) {
      state.items.push(item);
    }
  }
};

// 根 store
const store = createStore({
  modules: {
    user,
    cart
  }
});

// 使用命名空间
store.state.user.name;
store.getters['user/fullInfo'];
store.commit('user/setName', 'Tom');
store.dispatch('user/updateName', 'Alice');`,
    },
  ];

  const helperFunctions = [
    {
      title: 'mapState',
      what: '快速在组件 computed 中引入 state',
      scenarios: ['映射状态到组件'],
      code: `import { mapState } from 'vuex';

export default {
  computed: {
    // 数组形式
    ...mapState(['count', 'user']),
    
    // 对象形式（重命名）
    ...mapState({
      userCount: state => state.count,
      userName: state => state.user.name
    }),
    
    // 模块化
    ...mapState('user', ['name', 'email'])
  }
};

// Composition API
<script setup>
import { useStore } from 'vuex';
import { computed } from 'vue';

const store = useStore();
const count = computed(() => store.state.count);
</script>`,
    },
    {
      title: 'mapGetters',
      what: '减少重复计算',
      scenarios: ['映射 getters 到组件'],
      code: `import { mapGetters } from 'vuex';

export default {
  computed: {
    // 数组形式
    ...mapGetters(['doubleCount', 'doneTodos']),
    
    // 对象形式（重命名）
    ...mapGetters({
      doneCount: 'doneTodosCount'
    }),
    
    // 模块化
    ...mapGetters('user', ['fullInfo'])
  }
};`,
    },
    {
      title: 'mapMutations',
      what: '自动生成函数简化调用',
      scenarios: ['映射 mutations 到方法'],
      code: `import { mapMutations } from 'vuex';

export default {
  methods: {
    // 数组形式
    ...mapMutations(['increment', 'setUser']),
    
    // 对象形式（重命名）
    ...mapMutations({
      add: 'increment'
    }),
    
    // 模块化
    ...mapMutations('user', ['setName'])
  }
};

// 使用
<button @click="increment">增加</button>`,
    },
    {
      title: 'mapActions',
      what: '快速绑定方法',
      scenarios: ['映射 actions 到方法'],
      code: `import { mapActions } from 'vuex';

export default {
  methods: {
    // 数组形式
    ...mapActions(['fetchUser', 'login']),
    
    // 对象形式（重命名）
    ...mapActions({
      getUser: 'fetchUser'
    }),
    
    // 模块化
    ...mapActions('user', ['updateName'])
  }
};

// 使用
<button @click="fetchUser(123)">获取用户</button>`,
    },
  ];

  const resources = [
    { name: 'Vuex 官方文档', url: 'https://vuex.vuejs.org/', description: '最权威的 Vuex 学习资源' },
    { name: 'Vuex 中文文档', url: 'https://vuex.vuejs.org/zh/', description: 'Vuex 官方中文文档' },
    { name: 'Vue 官方文档', url: 'https://cn.vuejs.org/', description: 'Vue 3 官方文档' },
    { name: 'Vue DevTools', url: 'https://devtools.vuejs.org/', description: 'Vue 开发者工具' },
    { name: 'Pinia', url: 'https://pinia.vuejs.org/', description: 'Vue 官方推荐的新状态管理库' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 p-4 sm:p-6">
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
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl shadow-lg mb-4">
            <Code className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-gray-800">
            Vuex 完整知识体系
          </h1>
          <p className="text-gray-600">
            掌握 Vue 全家桶的状态管理核心，可预测的状态容器
          </p>
        </div>

        {/* 重要提示 */}
        <Card className="p-4 bg-yellow-50 border-yellow-200 mb-8">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-gray-700">
                <span className="font-semibold">注意：</span>
                Vuex 仍然维护中（Vue 2/3 可用），但 <span className="font-semibold text-yellow-700">Pinia 是官方推荐的新一代状态管理库</span>。
                Vuex 没有废弃，适合维护现有项目。新项目建议使用 Pinia。
              </p>
            </div>
          </div>
        </Card>

        {/* Vuex 是什么 */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Vuex 是什么</h2>
          <p className="text-gray-700 mb-4">
            Vuex 是一个为 Vue 设计的<span className="font-semibold text-indigo-600">可预测状态容器</span>，使用单向数据流与严格的修改规范，让复杂应用的状态管理清晰、可调试、可维护。
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">状态一致性</h3>
              <p className="text-sm text-gray-600">所有状态集中存储</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">变更可追踪</h3>
              <p className="text-sm text-gray-600">通过 mutation 记录每次更改</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">逻辑可维护</h3>
              <p className="text-sm text-gray-600">异步逻辑统一由 action 管理</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">调试方便</h3>
              <p className="text-sm text-gray-600">支持时间旅行与 devtools 调试</p>
            </div>
          </div>
        </Card>

        {/* 类比说明 */}
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">📦 类比：Vuex 像是"公司财务中心"</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3 bg-white rounded-lg">
              <p className="text-sm"><span className="font-semibold text-indigo-600">state</span> = 账本</p>
            </div>
            <div className="p-3 bg-white rounded-lg">
              <p className="text-sm"><span className="font-semibold text-green-600">mutations</span> = 记账员（只能按规则修改）</p>
            </div>
            <div className="p-3 bg-white rounded-lg">
              <p className="text-sm"><span className="font-semibold text-purple-600">actions</span> = 经理（安排异步任务）</p>
            </div>
            <div className="p-3 bg-white rounded-lg">
              <p className="text-sm"><span className="font-semibold text-yellow-600">getters</span> = 报表（派生结果）</p>
            </div>
            <div className="p-3 bg-white rounded-lg">
              <p className="text-sm"><span className="font-semibold text-blue-600">modules</span> = 分公司</p>
            </div>
          </div>
        </Card>

        {/* 核心概念 */}
        <div className="mb-8">
          <Card className="p-6 bg-white/80 backdrop-blur-sm mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="w-6 h-6 text-indigo-600" />
              <h2 className="text-2xl font-bold text-gray-800">核心概念</h2>
            </div>
          </Card>

          <div className="space-y-6">
            {coreConcepts.map((concept, idx) => (
              <Card key={idx} id={`section-${idx + 1}`} className="p-6 bg-white/80 backdrop-blur-sm scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <CheckCircle2 className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-1" />
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

        {/* 辅助函数 */}
        <div className="mb-8">
          <Card className="p-6 bg-white/80 backdrop-blur-sm mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-800">辅助函数（语法糖）</h2>
            </div>
          </Card>

          <div className="space-y-6">
            {helperFunctions.map((helper, idx) => (
              <Card key={idx} id={`section-${coreConcepts.length + idx + 1}`} className="p-6 bg-white/80 backdrop-blur-sm scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <CheckCircle2 className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{helper.title}</h3>
                    <p className="text-gray-600">{helper.what}</p>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-purple-50 border border-purple-200 mb-4">
                  <h4 className="font-semibold text-gray-800 mb-2">📦 使用场景</h4>
                  <ul className="space-y-1">
                    {helper.scenarios.map((s, i) => (
                      <li key={i} className="text-sm text-gray-700">• {s}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">代码示例</h4>
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{helper.code}</code>
                  </pre>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* 数据流关系图 */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Vuex 数据流关系图（单向数据流）</h2>
          <div className="p-4 bg-gray-50 rounded-lg">
            <pre className="text-sm text-gray-700 overflow-x-auto whitespace-pre">
{`组件 (dispatch)
   ↓
Actions （异步逻辑，例如请求接口）
   ↓ commit
Mutations （同步修改）
   ↓
State （全局数据）
   ↓
Getters / 组件计算属性

Vuex 的状态流是严格单向的，保证可预测性和调试性。`}
            </pre>
          </div>
        </Card>

        {/* 使用场景 */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">典型使用场景</h2>
          <div className="space-y-3">
            <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">用户登录信息共享</h3>
              <p className="text-sm text-gray-600">state.user + actions.login → 所有组件可用用户数据</p>
            </div>
            <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">多组件共享状态</h3>
              <p className="text-sm text-gray-600">使用 Vuex 替代 props/event → 降低组件耦合</p>
            </div>
            <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">复杂异步流程</h3>
              <p className="text-sm text-gray-600">放入 actions 管理 → 避免组件逻辑臃肿</p>
            </div>
            <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">表单或购物车数据</h3>
              <p className="text-sm text-gray-600">state.cart + mutations.addItem → 保证修改路径统一</p>
            </div>
            <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">多模块协同</h3>
              <p className="text-sm text-gray-600">modules + 命名空间 → 结构清晰，易扩展</p>
            </div>
          </div>
        </Card>

        {/* 与 Vue 生态的关系 */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">与 Vue 生态的关系</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-300">
                  <th className="text-left p-3 font-semibold text-gray-800">生态模块</th>
                  <th className="text-left p-3 font-semibold text-gray-800">关系</th>
                  <th className="text-left p-3 font-semibold text-gray-800">举例</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="p-3 font-medium">Vue Router</td>
                  <td className="p-3 text-gray-600">状态与路由联动</td>
                  <td className="p-3 text-gray-600">登录后保存 user 状态并重定向</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-3 font-medium">Axios</td>
                  <td className="p-3 text-gray-600">异步请求放入 actions</td>
                  <td className="p-3 text-gray-600">dispatch('fetchUser') 内发请求</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-3 font-medium">Composition API</td>
                  <td className="p-3 text-gray-600">与 useStore() 配合</td>
                  <td className="p-3 text-gray-600">通过 computed 订阅状态</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-3 font-medium">Vue Devtools</td>
                  <td className="p-3 text-gray-600">调试工具</td>
                  <td className="p-3 text-gray-600">实时查看 state / mutation log</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>

        {/* 学习资源 */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm mb-8">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-6 h-6 text-indigo-600" />
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
          <Card className="inline-block p-4 bg-gradient-to-r from-white/80 to-indigo-50/80 backdrop-blur-sm border border-indigo-200/50">
            <p className="text-sm text-gray-700">
              💡 建议：理解单向数据流，掌握 state、mutations、actions、getters 的职责划分，新项目推荐使用 Pinia
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
