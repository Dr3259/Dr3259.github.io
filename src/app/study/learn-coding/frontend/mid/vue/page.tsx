'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, BookOpen, ExternalLink, Code, CheckCircle2, TrendingUp, Sparkles, Zap } from 'lucide-react';
import Link from 'next/link';

export default function VuePage() {
  const coreIdeas = [
    {
      title: '声明式渲染',
      what: 'Vue 用模板描述 UI 状态',
      why: '从手动 DOM 操作中解放',
      how: '{{ message }} → 自动更新 DOM',
      scenarios: ['任何动态 UI'],
      relations: ['基于响应式系统实现'],
      code: `<template>
  <div>
    <h1>{{ message }}</h1>
    <p>{{ count * 2 }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const message = ref('Hello Vue!');
const count = ref(10);
</script>`,
    },
    {
      title: '响应式系统 (Reactivity)',
      what: '数据变化驱动视图更新',
      why: '自动追踪依赖，最小化更新',
      how: 'ref(), reactive(), computed()',
      scenarios: ['数据绑定', '状态管理'],
      relations: ['与渲染器和依赖追踪紧密耦合'],
      code: `import { ref, reactive, computed } from 'vue';

// ref - 基本类型
const count = ref(0);
console.log(count.value); // 0

// reactive - 对象
const state = reactive({
  name: 'Alice',
  age: 25
});

// computed - 派生值
const double = computed(() => count.value * 2);`,
    },
    {
      title: '虚拟 DOM (VDOM)',
      what: 'JS 层的 DOM 抽象',
      why: '高效 diff，最小 DOM 操作',
      how: '内部机制',
      scenarios: ['渲染层性能优化'],
      relations: ['响应式数据更新后触发 diff'],
      code: `// Vue 自动管理虚拟 DOM
// 当响应式数据变化时：
// 1. 生成新的虚拟 DOM 树
// 2. 与旧的虚拟 DOM 进行 diff
// 3. 只更新变化的部分到真实 DOM

<template>
  <div>
    <p v-for="item in items" :key="item.id">
      {{ item.name }}
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const items = ref([
  { id: 1, name: 'Item 1' },
  { id: 2, name: 'Item 2' }
]);

// 添加新项时，Vue 只会添加新的 DOM 节点
const addItem = () => {
  items.value.push({ id: 3, name: 'Item 3' });
};
</script>`,
    },
    {
      title: '组件 (Component)',
      what: '可复用、封装的 UI 单元',
      why: '模块化、复用逻辑与视图',
      how: '<MyButton />',
      scenarios: ['所有 Vue 应用的基本结构'],
      relations: ['组件树形成应用'],
      code: `<!-- MyButton.vue -->
<template>
  <button @click="handleClick" :class="type">
    <slot></slot>
  </button>
</template>

<script setup>
defineProps({
  type: {
    type: String,
    default: 'primary'
  }
});

const emit = defineEmits(['click']);

const handleClick = () => {
  emit('click');
};
</script>

<!-- 使用组件 -->
<template>
  <MyButton type="primary" @click="doSomething">
    点击我
  </MyButton>
</template>`,
    },
  ];

  const templateSyntax = [
    {
      title: '插值语法',
      what: '模板绑定数据',
      why: '直观的数据展示',
      how: '{{ msg }}',
      scenarios: ['文本渲染'],
      relations: ['与响应式系统绑定'],
      code: `<template>
  <div>
    <!-- 文本插值 -->
    <p>{{ message }}</p>
    
    <!-- 表达式 -->
    <p>{{ count + 1 }}</p>
    <p>{{ ok ? 'YES' : 'NO' }}</p>
    
    <!-- 方法调用 -->
    <p>{{ formatDate(date) }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const message = ref('Hello');
const count = ref(10);
const ok = ref(true);
const date = ref(new Date());

const formatDate = (d) => d.toLocaleDateString();
</script>`,
    },
    {
      title: 'v-bind',
      what: '绑定属性',
      why: '动态属性值',
      how: ':src="url"',
      scenarios: ['动态样式', '类名'],
      relations: ['结合 reactive() 数据'],
      code: `<template>
  <div>
    <!-- 绑定属性 -->
    <img :src="imageUrl" :alt="imageAlt">
    
    <!-- 绑定 class -->
    <div :class="{ active: isActive, 'text-danger': hasError }">
    <div :class="[activeClass, errorClass]">
    
    <!-- 绑定 style -->
    <div :style="{ color: textColor, fontSize: fontSize + 'px' }">
    
    <!-- 绑定多个属性 -->
    <div v-bind="objectOfAttrs">
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';

const imageUrl = ref('/logo.png');
const isActive = ref(true);
const textColor = ref('red');
const objectOfAttrs = reactive({
  id: 'container',
  class: 'wrapper'
});
</script>`,
    },
    {
      title: 'v-on',
      what: '绑定事件',
      why: '声明事件监听',
      how: '@click="doIt"',
      scenarios: ['按钮点击等'],
      relations: ['响应用户交互'],
      code: `<template>
  <div>
    <!-- 方法处理器 -->
    <button @click="handleClick">点击</button>
    
    <!-- 内联处理器 -->
    <button @click="count++">增加</button>
    
    <!-- 事件修饰符 -->
    <form @submit.prevent="onSubmit">
    <a @click.stop="doThis">
    <input @keyup.enter="submit">
    
    <!-- 多个处理器 -->
    <button @click="one($event), two($event)">
  </div>
</template>

<script setup>
import { ref } from 'vue';

const count = ref(0);

const handleClick = (event) => {
  console.log('点击了', event);
};

const onSubmit = () => {
  console.log('提交表单');
};
</script>`,
    },
    {
      title: 'v-if / v-else / v-show',
      what: '条件渲染',
      why: '控制 DOM 是否渲染或显示',
      how: 'v-if="isShow"',
      scenarios: ['动态切换内容'],
      relations: ['v-if 真正添加/移除节点，v-show 仅切换 display'],
      code: `<template>
  <div>
    <!-- v-if / v-else-if / v-else -->
    <div v-if="type === 'A'">A</div>
    <div v-else-if="type === 'B'">B</div>
    <div v-else>其他</div>
    
    <!-- v-show -->
    <div v-show="isVisible">显示/隐藏</div>
    
    <!-- v-if vs v-show -->
    <!-- v-if: 真正的条件渲染，切换开销高 -->
    <!-- v-show: 仅切换 CSS display，初始渲染开销高 -->
  </div>
</template>

<script setup>
import { ref } from 'vue';

const type = ref('A');
const isVisible = ref(true);
</script>`,
    },
    {
      title: 'v-for',
      what: '列表渲染',
      why: '渲染重复结构',
      how: 'v-for="item in list"',
      scenarios: ['渲染数组', '对象'],
      relations: ['需配合 key 使用'],
      code: `<template>
  <div>
    <!-- 遍历数组 -->
    <li v-for="item in items" :key="item.id">
      {{ item.name }}
    </li>
    
    <!-- 带索引 -->
    <li v-for="(item, index) in items" :key="item.id">
      {{ index }} - {{ item.name }}
    </li>
    
    <!-- 遍历对象 -->
    <div v-for="(value, key) in object" :key="key">
      {{ key }}: {{ value }}
    </div>
    
    <!-- 遍历数字范围 -->
    <span v-for="n in 10" :key="n">{{ n }}</span>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const items = ref([
  { id: 1, name: 'Item 1' },
  { id: 2, name: 'Item 2' }
]);

const object = ref({
  title: 'Vue',
  author: 'Evan You'
});
</script>`,
    },
    {
      title: 'v-model',
      what: '双向绑定',
      why: '简化表单输入同步',
      how: '<input v-model="text">',
      scenarios: ['表单交互'],
      relations: ['底层语法糖 = :value + @input'],
      code: `<template>
  <div>
    <!-- 文本输入 -->
    <input v-model="text">
    
    <!-- 多行文本 -->
    <textarea v-model="message"></textarea>
    
    <!-- 复选框 -->
    <input type="checkbox" v-model="checked">
    
    <!-- 单选按钮 -->
    <input type="radio" value="A" v-model="picked">
    
    <!-- 选择框 -->
    <select v-model="selected">
      <option>A</option>
      <option>B</option>
    </select>
    
    <!-- 修饰符 -->
    <input v-model.lazy="msg">      <!-- 失焦时更新 -->
    <input v-model.number="age">    <!-- 转为数字 -->
    <input v-model.trim="text">     <!-- 去除首尾空格 -->
  </div>
</template>

<script setup>
import { ref } from 'vue';

const text = ref('');
const message = ref('');
const checked = ref(false);
const picked = ref('');
const selected = ref('');
</script>`,
    },
  ];

  const compositionAPI = [
    {
      title: 'ref()',
      what: '创建基本类型的响应式引用',
      why: '对原始值也能追踪变化',
      how: 'const x = ref(0)',
      scenarios: ['基础响应式数据'],
      relations: ['.value 访问'],
      code: `import { ref } from 'vue';

const count = ref(0);
const message = ref('Hello');

// 访问值需要 .value
console.log(count.value); // 0
count.value++;

// 在模板中自动解包，不需要 .value
// <template>{{ count }}</template>`,
    },
    {
      title: 'reactive()',
      what: '创建对象/数组的响应式代理',
      why: '深层追踪',
      how: 'const obj = reactive({a:1})',
      scenarios: ['状态对象'],
      relations: ['ref 与 reactive 可互转'],
      code: `import { reactive } from 'vue';

const state = reactive({
  count: 0,
  user: {
    name: 'Alice',
    age: 25
  }
});

// 直接访问，不需要 .value
state.count++;
state.user.name = 'Bob';

// 数组也可以
const list = reactive([1, 2, 3]);
list.push(4);`,
    },
    {
      title: 'computed()',
      what: '派生响应式值',
      why: '缓存结果',
      how: 'computed(()=>count.value*2)',
      scenarios: ['派生逻辑'],
      relations: ['依赖响应式数据'],
      code: `import { ref, computed } from 'vue';

const count = ref(10);

// 只读计算属性
const double = computed(() => count.value * 2);

// 可写计算属性
const fullName = computed({
  get() {
    return firstName.value + ' ' + lastName.value;
  },
  set(newValue) {
    [firstName.value, lastName.value] = newValue.split(' ');
  }
});`,
    },
    {
      title: 'watch()',
      what: '监听变化',
      why: '副作用处理',
      how: 'watch(source, callback)',
      scenarios: ['数据同步', '请求'],
      relations: ['可替代生命周期钩子'],
      code: `import { ref, watch } from 'vue';

const count = ref(0);
const user = reactive({ name: 'Alice' });

// 监听 ref
watch(count, (newVal, oldVal) => {
  console.log(\`count 从 \${oldVal} 变为 \${newVal}\`);
});

// 监听 reactive 对象的属性
watch(() => user.name, (newName) => {
  console.log('名字变了:', newName);
});

// 监听多个源
watch([count, () => user.name], ([newCount, newName]) => {
  console.log('count 或 name 变了');
});

// 立即执行
watch(count, callback, { immediate: true });`,
    },
    {
      title: 'watchEffect()',
      what: '自动收集依赖并执行副作用',
      why: '简化 watch',
      how: 'watchEffect(()=>console.log(count.value))',
      scenarios: ['轻量响应式观察'],
      relations: ['类似计算属性 + 副作用'],
      code: `import { ref, watchEffect } from 'vue';

const count = ref(0);
const name = ref('Alice');

// 自动追踪依赖
watchEffect(() => {
  console.log(\`count: \${count.value}, name: \${name.value}\`);
});

// 停止监听
const stop = watchEffect(() => {
  console.log(count.value);
});
stop(); // 停止监听`,
    },
    {
      title: '生命周期钩子',
      what: 'onMounted / onUnmounted / onUpdated',
      why: '函数组件中模拟 Options 生命周期',
      how: 'onMounted(()=>{...})',
      scenarios: ['初始化', '清理逻辑'],
      relations: ['对应 mounted、unmounted'],
      code: `import { onMounted, onUnmounted, onUpdated, onBeforeMount } from 'vue';

onBeforeMount(() => {
  console.log('组件挂载前');
});

onMounted(() => {
  console.log('组件已挂载');
  // 初始化操作，如请求数据
});

onUpdated(() => {
  console.log('组件更新了');
});

onUnmounted(() => {
  console.log('组件卸载');
  // 清理操作，如取消订阅
});`,
    },
    {
      title: 'provide / inject',
      what: '跨层级依赖注入',
      why: '避免 props drilling',
      how: 'provide(\'user\', user) / inject(\'user\')',
      scenarios: ['全局状态传递'],
      relations: ['类似 React Context'],
      code: `<!-- 祖先组件 -->
<script setup>
import { provide, ref } from 'vue';

const theme = ref('dark');
const updateTheme = (newTheme) => {
  theme.value = newTheme;
};

provide('theme', theme);
provide('updateTheme', updateTheme);
</script>

<!-- 后代组件 -->
<script setup>
import { inject } from 'vue';

const theme = inject('theme');
const updateTheme = inject('updateTheme');

// 提供默认值
const user = inject('user', { name: 'Guest' });
</script>`,
    },
    {
      title: 'toRefs / toRef',
      what: '将 reactive 对象转为独立 ref',
      why: '避免丢失响应性',
      how: 'toRefs(state)',
      scenarios: ['解构响应式对象'],
      relations: ['reactive 与 ref 桥梁'],
      code: `import { reactive, toRefs, toRef } from 'vue';

const state = reactive({
  count: 0,
  name: 'Alice'
});

// toRefs - 转换所有属性
const { count, name } = toRefs(state);
count.value++; // 保持响应性

// toRef - 转换单个属性
const count = toRef(state, 'count');`,
    },
    {
      title: 'Custom Hooks',
      what: '封装复用逻辑',
      why: '拆分业务逻辑',
      how: 'useMousePosition()',
      scenarios: ['通用行为封装'],
      relations: ['与 Composition 模式一致'],
      code: `// useMousePosition.js
import { ref, onMounted, onUnmounted } from 'vue';

export function useMousePosition() {
  const x = ref(0);
  const y = ref(0);

  const update = (event) => {
    x.value = event.pageX;
    y.value = event.pageY;
  };

  onMounted(() => {
    window.addEventListener('mousemove', update);
  });

  onUnmounted(() => {
    window.removeEventListener('mousemove', update);
  });

  return { x, y };
}

// 使用
<script setup>
import { useMousePosition } from './useMousePosition';

const { x, y } = useMousePosition();
</script>`,
    },
  ];

  const communication = [
    {
      title: 'Props',
      what: '父→子数据传递',
      why: '单向数据流',
      how: 'props: [\'title\']',
      scenarios: ['子组件定制化'],
      relations: ['组件树基础'],
      code: `<!-- 子组件 -->
<script setup>
const props = defineProps({
  title: String,
  count: {
    type: Number,
    default: 0,
    required: true
  },
  user: Object
});

console.log(props.title);
</script>

<!-- 父组件 -->
<template>
  <ChildComponent 
    title="标题" 
    :count="10" 
    :user="userObj" 
  />
</template>`,
    },
    {
      title: 'Emits / $emit',
      what: '子→父事件通知',
      why: '提供双向通信',
      how: 'emit(\'update\', value)',
      scenarios: ['输入框', '表单'],
      relations: ['与 v-model 配合'],
      code: `<!-- 子组件 -->
<script setup>
const emit = defineEmits(['update', 'delete']);

const handleClick = () => {
  emit('update', { id: 1, name: 'New' });
};

const handleDelete = () => {
  emit('delete', 123);
};
</script>

<!-- 父组件 -->
<template>
  <ChildComponent 
    @update="handleUpdate"
    @delete="handleDelete"
  />
</template>

<script setup>
const handleUpdate = (data) => {
  console.log('更新:', data);
};
</script>`,
    },
    {
      title: 'v-model 组件化',
      what: '封装双向绑定组件',
      why: '组件可复用输入逻辑',
      how: 'defineProps + defineEmits([\'update:modelValue\'])',
      scenarios: ['可复用表单组件'],
      relations: ['语法糖封装'],
      code: `<!-- CustomInput.vue -->
<template>
  <input 
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
  >
</template>

<script setup>
defineProps(['modelValue']);
defineEmits(['update:modelValue']);
</script>

<!-- 使用 -->
<template>
  <CustomInput v-model="text" />
  <!-- 等价于 -->
  <CustomInput 
    :modelValue="text"
    @update:modelValue="text = $event"
  />
</template>

<!-- 多个 v-model -->
<CustomComponent 
  v-model:title="title"
  v-model:content="content"
/>`,
    },
  ];

  const advancedConcepts = [
    {
      title: '插槽 (Slot)',
      what: '父组件向子组件传递模板内容',
      why: '提高组件可扩展性',
      how: '<slot />, <template #name>',
      scenarios: ['卡片', '布局组件'],
      relations: ['子组件内部动态渲染'],
      code: `<!-- 子组件 Card.vue -->
<template>
  <div class="card">
    <div class="header">
      <slot name="header"></slot>
    </div>
    <div class="body">
      <slot></slot> <!-- 默认插槽 -->
    </div>
    <div class="footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<!-- 使用 -->
<template>
  <Card>
    <template #header>
      <h1>标题</h1>
    </template>
    
    <p>这是内容</p>
    
    <template #footer>
      <button>确定</button>
    </template>
  </Card>
</template>`,
    },
    {
      title: '作用域插槽',
      what: '子组件向父组件暴露数据',
      why: '提高灵活性',
      how: '<slot :data="x" />',
      scenarios: ['列表模板'],
      relations: ['反向数据传递'],
      code: `<!-- 子组件 List.vue -->
<template>
  <ul>
    <li v-for="item in items" :key="item.id">
      <slot :item="item" :index="index"></slot>
    </li>
  </ul>
</template>

<script setup>
defineProps(['items']);
</script>

<!-- 使用 -->
<template>
  <List :items="users">
    <template #default="{ item, index }">
      <span>{{ index }}. {{ item.name }}</span>
    </template>
  </List>
</template>`,
    },
    {
      title: '动态组件',
      what: '根据变量动态渲染不同组件',
      why: '灵活复用',
      how: '<component :is="current"/>',
      scenarios: ['Tab 页', '切换视图'],
      relations: ['与 Suspense、KeepAlive 兼容'],
      code: `<template>
  <div>
    <button @click="current = 'Home'">首页</button>
    <button @click="current = 'About'">关于</button>
    
    <component :is="current"></component>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Home from './Home.vue';
import About from './About.vue';

const current = ref('Home');
</script>`,
    },
    {
      title: 'KeepAlive',
      what: '缓存动态组件状态',
      why: '避免重复销毁',
      how: '<KeepAlive><component :is="c"/></KeepAlive>',
      scenarios: ['Tab 切换'],
      relations: ['与动态组件协作'],
      code: `<template>
  <div>
    <button @click="current = 'A'">组件A</button>
    <button @click="current = 'B'">组件B</button>
    
    <!-- 缓存组件状态 -->
    <KeepAlive>
      <component :is="current"></component>
    </KeepAlive>
    
    <!-- 指定缓存/排除 -->
    <KeepAlive :include="['A', 'B']" :exclude="['C']">
      <component :is="current"></component>
    </KeepAlive>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const current = ref('A');
</script>`,
    },
    {
      title: 'Teleport',
      what: '将组件内容渲染到 DOM 其他位置',
      why: '模态框、弹层',
      how: '<Teleport to="body">...</Teleport>',
      scenarios: ['全局浮层'],
      relations: ['类似 React Portal'],
      code: `<template>
  <div>
    <button @click="showModal = true">打开模态框</button>
    
    <!-- 渲染到 body -->
    <Teleport to="body">
      <div v-if="showModal" class="modal">
        <div class="modal-content">
          <h2>模态框</h2>
          <button @click="showModal = false">关闭</button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const showModal = ref(false);
</script>`,
    },
    {
      title: 'Transition / TransitionGroup',
      what: '提供过渡动画',
      why: '提升交互体验',
      how: '<Transition name="fade">',
      scenarios: ['动画', '列表切换'],
      relations: ['与 v-if/v-for 搭配'],
      code: `<template>
  <div>
    <button @click="show = !show">切换</button>
    
    <!-- 单元素过渡 -->
    <Transition name="fade">
      <p v-if="show">Hello</p>
    </Transition>
    
    <!-- 列表过渡 -->
    <TransitionGroup name="list" tag="ul">
      <li v-for="item in items" :key="item.id">
        {{ item.text }}
      </li>
    </TransitionGroup>
  </div>
</template>

<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>`,
    },
  ];

  const resources = [
    { name: 'Vue 官方文档', url: 'https://vuejs.org/', description: '最权威的 Vue 学习资源' },
    { name: 'Vue 中文文档', url: 'https://cn.vuejs.org/', description: 'Vue 官方中文文档' },
    { name: 'Vue Router', url: 'https://router.vuejs.org/', description: 'Vue 官方路由库' },
    { name: 'Pinia', url: 'https://pinia.vuejs.org/', description: 'Vue 新一代状态管理' },
    { name: 'Vite', url: 'https://vitejs.dev/', description: 'Vue 官方推荐构建工具' },
    { name: 'Nuxt 3', url: 'https://nuxt.com/', description: 'Vue 全栈框架' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50 p-4 sm:p-6">
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
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl shadow-lg mb-4">
            <Code className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-gray-800">
            Vue 3.x+ 完整知识体系
          </h1>
          <p className="text-gray-600">
            系统掌握 Vue 核心思想、模板语法、Composition API 与组件通信
          </p>
        </div>

        {/* 核心思想 */}
        <div className="mb-8">
          <Card className="p-6 bg-white/80 backdrop-blur-sm mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-800">一、核心思想与架构</h2>
            </div>
          </Card>

          <div className="space-y-6">
            {coreIdeas.map((idea, idx) => (
              <Card key={idx} id={`section-${idx + 1}`} className="p-6 bg-white/80 backdrop-blur-sm scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{idea.title}</h3>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500">
                    <h4 className="font-semibold text-gray-800 mb-2">💡 是什么</h4>
                    <p className="text-sm text-gray-700">{idea.what}</p>
                  </div>

                  <div className="p-4 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500">
                    <h4 className="font-semibold text-gray-800 mb-2">🎯 为什么</h4>
                    <p className="text-sm text-gray-700">{idea.why}</p>
                  </div>

                  <div className="p-4 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 border-l-4 border-purple-500">
                    <h4 className="font-semibold text-gray-800 mb-2">⚡ 怎么用</h4>
                    <code className="text-sm text-gray-700 font-mono">{idea.how}</code>
                  </div>

                  <div className="p-4 rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-500">
                    <h4 className="font-semibold text-gray-800 mb-2">📦 使用场景</h4>
                    <ul className="space-y-1">
                      {idea.scenarios.map((s, i) => (
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
                    {idea.relations.map((r, i) => (
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
                    <code>{idea.code}</code>
                  </pre>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* 模板语法 */}
        <div className="mb-8">
          <Card className="p-6 bg-white/80 backdrop-blur-sm mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Code className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-800">二、模板语法</h2>
            </div>
          </Card>

          <div className="space-y-6">
            {templateSyntax.map((syntax, idx) => (
              <Card key={idx} id={`section-${coreIdeas.length + idx + 1}`} className="p-6 bg-white/80 backdrop-blur-sm scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <CheckCircle2 className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{syntax.title}</h3>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500">
                    <h4 className="font-semibold text-gray-800 mb-2">💡 是什么</h4>
                    <p className="text-sm text-gray-700">{syntax.what}</p>
                  </div>

                  <div className="p-4 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500">
                    <h4 className="font-semibold text-gray-800 mb-2">🎯 为什么</h4>
                    <p className="text-sm text-gray-700">{syntax.why}</p>
                  </div>

                  <div className="p-4 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 border-l-4 border-purple-500">
                    <h4 className="font-semibold text-gray-800 mb-2">⚡ 怎么用</h4>
                    <code className="text-sm text-gray-700 font-mono">{syntax.how}</code>
                  </div>

                  <div className="p-4 rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-500">
                    <h4 className="font-semibold text-gray-800 mb-2">📦 使用场景</h4>
                    <ul className="space-y-1">
                      {syntax.scenarios.map((s, i) => (
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
                    {syntax.relations.map((r, i) => (
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
                    <code>{syntax.code}</code>
                  </pre>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Composition API */}
        <div className="mb-8">
          <Card className="p-6 bg-white/80 backdrop-blur-sm mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-800">三、Composition API 核心函数</h2>
            </div>
          </Card>

          <div className="space-y-6">
            {compositionAPI.map((api, idx) => (
              <Card key={idx} id={`section-${coreIdeas.length + templateSyntax.length + idx + 1}`} className="p-6 bg-white/80 backdrop-blur-sm scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <CheckCircle2 className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{api.title}</h3>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500">
                    <h4 className="font-semibold text-gray-800 mb-2">💡 是什么</h4>
                    <p className="text-sm text-gray-700">{api.what}</p>
                  </div>

                  <div className="p-4 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500">
                    <h4 className="font-semibold text-gray-800 mb-2">🎯 为什么</h4>
                    <p className="text-sm text-gray-700">{api.why}</p>
                  </div>

                  <div className="p-4 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 border-l-4 border-purple-500">
                    <h4 className="font-semibold text-gray-800 mb-2">⚡ 怎么用</h4>
                    <code className="text-sm text-gray-700 font-mono">{api.how}</code>
                  </div>

                  <div className="p-4 rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-500">
                    <h4 className="font-semibold text-gray-800 mb-2">📦 使用场景</h4>
                    <ul className="space-y-1">
                      {api.scenarios.map((s, i) => (
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
                    {api.relations.map((r, i) => (
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
                    <code>{api.code}</code>
                  </pre>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* 组件通信 */}
        <div className="mb-8">
          <Card className="p-6 bg-white/80 backdrop-blur-sm mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="w-6 h-6 text-yellow-600" />
              <h2 className="text-2xl font-bold text-gray-800">四、组件通信机制</h2>
            </div>
          </Card>

          <div className="space-y-6">
            {communication.map((comm, idx) => (
              <Card key={idx} id={`section-${coreIdeas.length + templateSyntax.length + compositionAPI.length + idx + 1}`} className="p-6 bg-white/80 backdrop-blur-sm scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <CheckCircle2 className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{comm.title}</h3>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500">
                    <h4 className="font-semibold text-gray-800 mb-2">💡 是什么</h4>
                    <p className="text-sm text-gray-700">{comm.what}</p>
                  </div>

                  <div className="p-4 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500">
                    <h4 className="font-semibold text-gray-800 mb-2">🎯 为什么</h4>
                    <p className="text-sm text-gray-700">{comm.why}</p>
                  </div>

                  <div className="p-4 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 border-l-4 border-purple-500">
                    <h4 className="font-semibold text-gray-800 mb-2">⚡ 怎么用</h4>
                    <code className="text-sm text-gray-700 font-mono">{comm.how}</code>
                  </div>

                  <div className="p-4 rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-500">
                    <h4 className="font-semibold text-gray-800 mb-2">📦 使用场景</h4>
                    <ul className="space-y-1">
                      {comm.scenarios.map((s, i) => (
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
                    {comm.relations.map((r, i) => (
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
                    <code>{comm.code}</code>
                  </pre>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* 组件进阶 */}
        <div className="mb-8">
          <Card className="p-6 bg-white/80 backdrop-blur-sm mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Code className="w-6 h-6 text-pink-600" />
              <h2 className="text-2xl font-bold text-gray-800">五、组件进阶概念</h2>
            </div>
          </Card>

          <div className="space-y-6">
            {advancedConcepts.map((concept, idx) => (
              <Card key={idx} id={`section-${coreIdeas.length + templateSyntax.length + compositionAPI.length + communication.length + idx + 1}`} className="p-6 bg-white/80 backdrop-blur-sm scroll-mt-20">
                <div className="flex items-start gap-3 mb-4">
                  <CheckCircle2 className="w-6 h-6 text-pink-600 flex-shrink-0 mt-1" />
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

        {/* 关系总图 */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Vue 核心关系图</h2>
          <div className="p-4 bg-gray-50 rounded-lg">
            <pre className="text-sm text-gray-700 overflow-x-auto whitespace-pre">
{`模板 (Template)
 ├─ 指令系统 (v-if, v-for, v-model, v-bind, v-on)
 │    ├─ 驱动响应式系统 (Ref, Reactive, Computed)
 │    │     ├─ Watch/WatchEffect (副作用监听)
 │    │     └─ 生命周期钩子 (onMounted...)
 │    ├─ 组件系统
 │    │     ├─ Props (父→子)
 │    │     ├─ Emit (子→父)
 │    │     ├─ Provide/Inject (祖孙)
 │    │     ├─ Slot/ScopedSlot (模板通信)
 │    │     └─ KeepAlive/Teleport/Transition
 │    └─ Composition API（setup + hooks）
 │          ├─ ref/reactive/computed/watch
 │          └─ 自定义 hooks（逻辑复用）
 └─ 响应式数据 → 触发 VDOM diff → DOM 更新`}
            </pre>
          </div>
        </Card>

        {/* 学习资源 */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm mb-8">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-6 h-6 text-green-600" />
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
          <Card className="inline-block p-4 bg-gradient-to-r from-white/80 to-green-50/80 backdrop-blur-sm border border-green-200/50">
            <p className="text-sm text-gray-700">
              💡 建议：从核心思想开始，掌握模板语法，深入 Composition API，最后学习组件通信与进阶特性
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
