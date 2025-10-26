'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, BookOpen, ExternalLink, Code, CheckCircle2, TrendingUp, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function ES6Page() {
  const sections = [
    {
      title: '1. let 与 const',
      category: '变量与作用域',
      what: '块级作用域变量声明方式，替代 var',
      why: 'var 存在变量提升与全局污染问题',
      how: 'let count = 10; const PI = 3.14;',
      sugar: '无，但更接近其他语言的作用域模型',
      scenarios: ['模块内部变量定义', '防止变量污染与重复声明'],
      relations: ['与解构赋值、TDZ（暂时性死区）相关', '块级作用域是基础'],
      code: `// var 的问题
var x = 1;
if (true) {
  var x = 2; // 污染外层
}
console.log(x); // 2

// let/const 解决方案
let y = 1;
if (true) {
  let y = 2; // 块级作用域
}
console.log(y); // 1

const PI = 3.14;
// PI = 3; // 报错：不可重新赋值`,
    },
    {
      title: '2. 箭头函数 =>',
      category: '函数增强',
      what: '简化函数定义，并自动绑定外层 this',
      why: '传统函数 this 取决于调用方式，容易混淆',
      how: 'const add = (a, b) => a + b;',
      sugar: 'function + bind(this) 的简写',
      scenarios: ['回调函数', 'React/Vue 事件绑定', '数组迭代方法'],
      relations: ['与 this 行为绑定', '与 Promise、async/await 共用频繁'],
      code: `// 传统函数
function add(a, b) {
  return a + b;
}

// 箭头函数
const add = (a, b) => a + b;

// this 绑定
const obj = {
  name: 'Alice',
  greet: function() {
    setTimeout(() => {
      console.log(this.name); // 'Alice'
    }, 1000);
  }
};`,
    },
    {
      title: '3. 默认参数、剩余参数、展开运算符',
      category: '函数增强',
      what: '统一的函数参数增强语法',
      why: '简化函数参数判断与传参方式',
      how: 'function greet(name = "Guest") {...}',
      sugar: '默认参数：省去显式判断；剩余参数：替代 arguments；展开运算符：数组/对象解构合并简写',
      scenarios: ['传参灵活', 'React props', '解构合并'],
      relations: ['与解构赋值、Promise.all 常组合'],
      code: `// 默认参数
function greet(name = "Guest") {
  console.log(\`Hello, \${name}\`);
}

// 剩余参数
function sum(...nums) {
  return nums.reduce((a,b)=>a+b,0);
}
console.log(sum(1,2,3,4)); // 10

// 展开运算符
const arr = [1,2,3];
console.log(...arr); // 1 2 3
const obj = {a:1, ...{b:2}}; // {a:1, b:2}`,
    },
    {
      title: '4. 解构赋值',
      category: '对象与数组结构增强',
      what: '从数组或对象中批量提取变量',
      why: '避免重复访问属性或索引',
      how: 'const [x,y] = [1,2]; const {name, age} = obj;',
      sugar: '多行赋值的简写',
      scenarios: ['函数参数解包', 'React props/state', 'API 数据解析'],
      relations: ['与默认参数、const/let 一起使用', '模式匹配思想的起点'],
      code: `// 数组解构
const [x, y] = [1, 2];
const [first, ...rest] = [1,2,3,4]; // first=1, rest=[2,3,4]

// 对象解构
const {name, age} = {name:'Alice', age:25};
const {name: userName, age: userAge = 18} = user;

// 函数参数解构
function greet({name, age}) {
  console.log(\`\${name} is \${age}\`);
}`,
    },
    {
      title: '5. 对象字面量增强',
      category: '对象与数组结构增强',
      what: '支持属性简写与计算属性名',
      why: '提升可读性与动态性',
      how: 'const user = { name, [\'user_\'+1]: \'Alice\' };',
      sugar: 'name: name 的简写',
      scenarios: ['Vue/React 状态', '动态配置对象'],
      relations: ['与模块导出、解构搭配高频'],
      code: `const name = 'Bob';
const age = 25;

// 属性简写
const user = { name, age }; // {name: 'Bob', age: 25}

// 计算属性名
const key = 'user';
const obj = {
  [key + '_1']: 'Alice',
  [key + '_2']: 'Bob'
};

// 方法简写
const obj = {
  greet() { console.log('Hi'); }
};`,
    },
    {
      title: '6. 对象与数组方法增强',
      category: '对象与数组结构增强',
      what: 'ES2016+ 对原生对象的功能性扩展',
      why: '常用操作原本要用 Object.keys + map 等组合实现',
      how: '[1,2,3].includes(2); Object.entries(obj);',
      sugar: '简化常见数据操作',
      scenarios: ['判断存在性', '转换对象与数组', '数据重组'],
      relations: ['与解构、Map 结合自然', '在异步数据处理中高频'],
      code: `// Array 方法
[1,2,3].includes(2); // true
[1,[2,[3]]].flat(2); // [1,2,3]
[1,2,3].flatMap(x => [x, x*2]); // [1,2,2,4,3,6]

// Object 方法
Object.entries({a:1, b:2}); // [['a',1], ['b',2]]
Object.values({a:1, b:2}); // [1, 2]
Object.fromEntries([['a',1]]); // {a:1}`,
    },
    {
      title: '7. class / extends / super',
      category: '类与模块化',
      what: '基于原型的语法糖，支持继承与封装',
      why: '让 JS 类风格与主流语言统一',
      how: 'class Animal { constructor(name){...} }',
      sugar: '对 prototype 继承封装',
      scenarios: ['面向对象开发', '框架基类', '数据模型封装'],
      relations: ['与模块化、super、私有字段结合紧密'],
      code: `class Animal {
  constructor(name) {
    this.name = name;
  }
  speak() {
    console.log(this.name + ' makes a noise');
  }
}

class Dog extends Animal {
  speak() {
    super.speak();
    console.log(this.name + ' barks');
  }
}

const dog = new Dog('Rex');
dog.speak();`,
    },
    {
      title: '8. 类私有字段 / 静态块',
      category: '类与模块化',
      what: '为类引入真正的私有成员和静态初始化逻辑',
      why: '传统 _name 不是真正私有',
      how: 'class Counter { #count = 0; }',
      sugar: '封装与安全层面的语法糖',
      scenarios: ['封装内部状态', '复杂初始化逻辑'],
      relations: ['与 Proxy、Reflect 搭配实现封装'],
      code: `class Counter {
  #count = 0; // 私有字段
  
  static {
    console.log('Counter class initialized');
  }
  
  inc() {
    this.#count++;
  }
  
  getCount() {
    return this.#count;
  }
}

const c = new Counter();
c.inc();
console.log(c.getCount()); // 1
// console.log(c.#count); // 报错`,
    },
    {
      title: '9. 模块化 import/export',
      category: '类与模块化',
      what: '官方模块系统，替代 CommonJS',
      why: '统一作用域与依赖管理',
      how: 'export const add = (a,b)=>a+b; import { add } from \'./math\';',
      sugar: '标准化的模块语法',
      scenarios: ['现代前端模块', 'Tree-shaking', '模块分层设计'],
      relations: ['与 class、const、顶层 await 共用'],
      code: `// math.js
export const add = (a, b) => a + b;
export const PI = 3.14;
export default function multiply(a, b) {
  return a * b;
}

// main.js
import multiply, { add, PI } from './math.js';
import * as math from './math.js';

console.log(add(1, 2));
console.log(multiply(2, 3));`,
    },
    {
      title: '10. Promise / async / await',
      category: '异步与迭代',
      what: '统一异步控制机制',
      why: '回调地狱太难维护',
      how: 'async function load(){ const data = await fetch(\'/api\'); }',
      sugar: 'async/await = Promise.then() 的语法糖',
      scenarios: ['网络请求', '文件 I/O', '异步链式调用'],
      relations: ['与 for...of、顶层 await、Generator 相关'],
      code: `// Promise
fetch('/api/data')
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));

// async/await
async function loadData() {
  try {
    const res = await fetch('/api/data');
    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err);
  }
}`,
    },
    {
      title: '11. 迭代器与生成器',
      category: '异步与迭代',
      what: '自定义可迭代对象协议（Symbol.iterator）',
      why: '统一数据遍历标准',
      how: 'function* gen(){ yield 1; yield 2; }',
      sugar: 'for...of 是对迭代器协议的封装',
      scenarios: ['惰性计算', '数据流控制', '自定义集合'],
      relations: ['与 Symbol.iterator', '与 async 迭代（for await...of）衔接'],
      code: `// 生成器
function* gen() {
  yield 1;
  yield 2;
  yield 3;
}

for (const v of gen()) {
  console.log(v); // 1, 2, 3
}

// 自定义迭代器
const obj = {
  [Symbol.iterator]() {
    let i = 0;
    return {
      next() {
        return i < 3 ? {value: i++, done: false} : {done: true};
      }
    };
  }
};`,
    },
    {
      title: '12. 异步迭代器 for await...of',
      category: '异步与迭代',
      what: '支持异步可迭代对象的语法',
      why: '简化异步流（如 fetch 流、文件流）的遍历',
      how: 'for await (const item of asyncGenerator()) {...}',
      sugar: '异步迭代的语法糖',
      scenarios: ['网络流', '异步批处理'],
      relations: ['与 async/await、Generator、Promise 联动'],
      code: `// 异步生成器
async function* asyncGen() {
  yield await Promise.resolve(1);
  yield await Promise.resolve(2);
  yield await Promise.resolve(3);
}

// 使用 for await...of
async function process() {
  for await (const item of asyncGen()) {
    console.log(item); // 1, 2, 3
  }
}`,
    },
    {
      title: '13. 模板字符串',
      category: '语法糖与新数据结构',
      what: '多行字符串 + 插值表达式',
      why: '解决拼接繁琐问题',
      how: 'const msg = \`Hello, ${user.name}!\`;',
      sugar: '取代 \'Hello \' + user.name',
      scenarios: ['动态文本', '模板输出', '日志拼接'],
      relations: ['与解构、模块导入路径常搭配'],
      code: `const name = 'Alice';
const age = 25;

// 模板字符串
const msg = \`Hello, \${name}! You are \${age} years old.\`;

// 多行字符串
const html = \`
  <div>
    <h1>\${name}</h1>
    <p>Age: \${age}</p>
  </div>
\`;

// 标签模板
function tag(strings, ...values) {
  return strings[0] + values.join('');
}
const result = tag\`Hello \${name}\`;`,
    },
    {
      title: '14. 新数据类型与集合结构',
      category: '语法糖与新数据结构',
      what: 'Symbol、Set、Map、WeakMap、WeakSet、BigInt',
      why: '解决键冲突、大数溢出等问题',
      how: 'const sym = Symbol(\'id\'); const set = new Set([1,2,2]);',
      sugar: '提供更强大的数据结构',
      scenarios: ['唯一标识', '去重', '缓存', '大整数计算'],
      relations: ['与 Proxy/Reflect、迭代协议结合'],
      code: `// Symbol
const sym = Symbol('id');
const obj = { [sym]: 'unique' };

// Set（去重）
const set = new Set([1,2,2,3]); // Set {1,2,3}

// Map（键值对）
const map = new Map([['a',1], ['b',2]]);
map.set('c', 3);

// BigInt（大整数）
const big = 9007199254740991n + 1n;`,
    },
    {
      title: '15. 可选链 ?. 与 空值合并 ??',
      category: '语法糖与新数据结构',
      what: '安全访问与默认值语法',
      why: '减少 undefined 判断',
      how: 'const username = user?.profile?.name ?? \'Guest\';',
      sugar: '简化 user && user.profile && user.profile.name || \'Guest\'',
      scenarios: ['深层嵌套对象', '接口数据安全访问'],
      relations: ['与模板字符串、解构赋值常用'],
      code: `// 可选链
const user = { profile: { name: 'Alice' } };
const name = user?.profile?.name; // 'Alice'
const age = user?.profile?.age; // undefined

// 空值合并
const username = user?.name ?? 'Guest';
const port = config?.port ?? 8080;

// 组合使用
const value = obj?.prop?.nested ?? 'default';`,
    },
    {
      title: '16. 逻辑赋值运算符 &&=, ||=, ??=',
      category: '语法糖与新数据结构',
      what: '逻辑运算 + 赋值的组合语法',
      why: '常见的条件赋值场景太多',
      how: 'config.port ||= 8080; user.name &&= \'Anonymous\';',
      sugar: '简化条件赋值',
      scenarios: ['初始化配置', '条件更新'],
      relations: ['与空值合并、默认参数互补'],
      code: `// ||= (逻辑或赋值)
let port = null;
port ||= 8080; // port = 8080

// &&= (逻辑与赋值)
let user = { name: 'Alice' };
user.name &&= 'Anonymous'; // user.name = 'Anonymous'

// ??= (空值合并赋值)
let timeout = null;
timeout ??= 1000; // timeout = 1000`,
    },
    {
      title: '17. Proxy 与 Reflect',
      category: '语法糖与新数据结构',
      what: '对象行为拦截与反射机制',
      why: '提供元编程能力',
      how: 'const proxy = new Proxy(obj, { get(t, p){...} });',
      sugar: '无，但构建高级特性底层依赖',
      scenarios: ['Vue3 响应式', 'API 调试', '数据验证'],
      relations: ['与 Reflect 搭配', '与类私有字段、响应式密切相关'],
      code: `// Proxy
const obj = { name: 'Alice' };
const proxy = new Proxy(obj, {
  get(target, prop) {
    console.log(\`Getting \${prop}\`);
    return prop in target ? target[prop] : 'not found';
  },
  set(target, prop, value) {
    console.log(\`Setting \${prop} = \${value}\`);
    target[prop] = value;
    return true;
  }
});

// Reflect
Reflect.get(obj, 'name'); // 'Alice'
Reflect.set(obj, 'age', 25);`,
    },
    {
      title: '18. 顶层 await',
      category: '语法糖与新数据结构',
      what: '允许在模块顶层使用 await',
      why: '简化模块初始化异步逻辑',
      how: 'const config = await fetch(\'/config.json\').then(r=>r.json());',
      sugar: '模块级异步初始化',
      scenarios: ['动态配置', '预加载模块依赖'],
      relations: ['与 import/export、async/await 同步发展'],
      code: `// 顶层 await（模块顶层）
const config = await fetch('/config.json').then(r => r.json());

// 动态导入
const module = await import('./module.js');

// 条件加载
const data = await (
  condition 
    ? import('./data-a.js') 
    : import('./data-b.js')
);`,
    },
    {
      title: '19. 指数运算符 **',
      category: '其他增强语法',
      what: 'Math.pow() 的语法糖',
      why: '简化幂运算',
      how: '2 ** 3 === 8',
      sugar: 'Math.pow(2, 3) 的简写',
      scenarios: ['数学计算', '算法实现'],
      relations: ['与其他数学运算符一致'],
      code: `// 指数运算符
console.log(2 ** 3); // 8
console.log(2 ** 10); // 1024

// 等价于
console.log(Math.pow(2, 3)); // 8

// 组合使用
let x = 2;
x **= 3; // x = 8`,
    },
    {
      title: '20. 正则增强',
      category: '其他增强语法',
      what: '命名捕获组、后行断言、dotAll 模式',
      why: '提升正则表达力',
      how: 'const regex = /(?<user>\\w+)@(?<domain>\\w+)/;',
      sugar: '增强正则功能',
      scenarios: ['复杂字符串解析', '数据提取'],
      relations: ['与字符串方法结合'],
      code: `// 命名捕获组
const regex = /(?<user>\\w+)@(?<domain>\\w+)/;
const match = 'alice@example.com'.match(regex);
console.log(match.groups.user); // 'alice'

// 后行断言
const price = /(?<=\\$)\\d+/.exec('$100'); // ['100']

// dotAll 模式（s 标志）
const text = 'line1\\nline2';
/line1.line2/s.test(text); // true`,
    },
  ];

  const resources = [
    { name: 'MDN JavaScript 教程', url: 'https://developer.mozilla.org/zh-CN/docs/Web/JavaScript', description: '最权威的 JavaScript 文档' },
    { name: 'ES6 入门教程', url: 'https://es6.ruanyifeng.com/', description: '阮一峰的 ES6 系统教程' },
    { name: 'JavaScript.info', url: 'https://javascript.info/', description: '现代 JavaScript 教程' },
    { name: 'TypeScript 官方文档', url: 'https://www.typescriptlang.org/', description: 'TypeScript 与 ES6+ 结合' },
    { name: 'Can I Use', url: 'https://caniuse.com/', description: '检查浏览器兼容性' },
    { name: 'Babel', url: 'https://babeljs.io/', description: 'ES6+ 转译工具' },
  ];

  const summary = {
    coverage: 'ES2015~ES2025 所有已标准化且常用语法',
    trend: 'ES6+ 与 TypeScript、框架深度整合，推动现代前端开发',
    suggestion: '优先掌握 let/const、箭头函数、Promise、模块化等核心特性',
  };

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
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl shadow-lg mb-4">
            <Code className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-gray-800">
            ES6+ 特性大全
          </h1>
          <p className="text-gray-600">
            系统掌握 ES2015~ES2025 的核心语法特性，提升现代 JavaScript 开发能力
          </p>
        </div>

        {/* 内容区域 */}
        <div className="space-y-6 mb-8">
          {sections.map((section, idx) => (
            <Card key={idx} id={`section-${idx + 1}`} className="p-6 bg-white/80 backdrop-blur-sm scroll-mt-20">
              {/* 标题和分类 */}
              <div className="flex items-start gap-3 mb-4">
                <CheckCircle2 className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-2xl font-bold text-gray-800">{section.title}</h2>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                      {section.category}
                    </span>
                  </div>
                </div>
              </div>

              {/* 核心信息卡片 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500">
                  <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <span className="text-blue-600">💡</span>
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

                <div className="p-4 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 border-l-4 border-purple-500">
                  <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <span className="text-purple-600">⚡</span>
                    怎么用
                  </h3>
                  <code className="text-sm text-gray-700 font-mono">{section.how}</code>
                </div>

                <div className="p-4 rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-500">
                  <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <span className="text-yellow-600">🍬</span>
                    语法糖
                  </h3>
                  <p className="text-sm text-gray-700">{section.sugar}</p>
                </div>
              </div>

              {/* 使用场景 */}
              <div className="p-4 rounded-lg bg-blue-50 border border-blue-200 mb-4">
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  使用场景
                </h3>
                <ul className="space-y-1">
                  {section.scenarios.map((scenario, i) => (
                    <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="text-blue-600 mt-1">✓</span>
                      <span>{scenario}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 关联关系 */}
              <div className="p-4 rounded-lg bg-green-50 border border-green-200 mb-4">
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  关联关系
                </h3>
                <ul className="space-y-1">
                  {section.relations.map((relation, i) => (
                    <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="text-green-600 mt-1">→</span>
                      <span>{relation}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 代码示例 */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">代码示例</h3>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{section.code}</code>
                </pre>
              </div>
            </Card>
          ))}
        </div>

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

        {/* 总结对比 */}
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">ES6+ 特性总结</h2>
          <div className="space-y-3">
            <div className="p-4 bg-white rounded-lg">
              <p className="text-sm text-gray-700">
                <span className="font-semibold text-blue-700">覆盖范围：</span>
                {summary.coverage}
              </p>
            </div>
            <div className="p-4 bg-white rounded-lg">
              <p className="text-sm text-gray-700">
                <span className="font-semibold text-green-700">演进趋势：</span>
                {summary.trend}
              </p>
            </div>
            <div className="p-4 bg-white rounded-lg">
              <p className="text-sm text-gray-700">
                <span className="font-semibold text-purple-700">学习建议：</span>
                {summary.suggestion}
              </p>
            </div>
          </div>
        </Card>

        {/* 特性关系图 */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">全局语法关系图</h2>
          <div className="p-4 bg-gray-50 rounded-lg">
            <pre className="text-sm text-gray-700 overflow-x-auto whitespace-pre">
{`let/const → 解构 → 默认/剩余参数
     ↘
      class → extends/super → 模块化(import/export)
                   ↘
                    async/await → Promise → for...of / for await...of
       ↘
        Proxy/Reflect → 响应式/元编程
            ↘
             可选链/空值合并 → 模板字符串

Set/Map/Symbol/BigInt → 迭代协议 → for...of

逻辑赋值 &&= ||= ??= → 默认参数互补`}
            </pre>
          </div>
        </Card>

        {/* 一句话记忆表 */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">一句话记忆表</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { feature: 'let/const', memory: '安全的块级变量声明' },
              { feature: '箭头函数', memory: '自动绑定 this 的函数糖' },
              { feature: '解构赋值', memory: '拆包神器' },
              { feature: '默认/展开', memory: '万能传参糖' },
              { feature: 'class', memory: '面向对象语法糖' },
              { feature: '模块化', memory: '官方 import/export' },
              { feature: 'Promise/async', memory: '异步核心' },
              { feature: 'for...of', memory: '可迭代协议入口' },
              { feature: '模板字符串', memory: '多行 + 插值' },
              { feature: 'Symbol/Set/Map', memory: '唯一键与集合' },
              { feature: 'BigInt', memory: '安全大整数' },
              { feature: '可选链/空值合并', memory: '防错简写' },
              { feature: 'Proxy/Reflect', memory: '元编程核心' },
              { feature: '顶层 await', memory: '异步模块初始化' },
              { feature: 'includes/flat', memory: '数组增强' },
              { feature: 'Object.entries', memory: '对象增强' },
              { feature: '私有字段', memory: '真正封装' },
              { feature: '逻辑赋值', memory: '条件赋值简写' },
              { feature: '正则增强', memory: '语义捕获与匹配提升' },
            ].map((item, idx) => (
              <div key={idx} className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-800">{item.feature}</span>
                  <span className="text-sm text-gray-600">{item.memory}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* 底部提示 */}
        <div className="text-center">
          <Card className="inline-block p-4 bg-gradient-to-r from-white/80 to-blue-50/80 backdrop-blur-sm border border-blue-200/50">
            <p className="text-sm text-gray-700">
              💡 建议：按「点 → 面 → 线」的顺序学习，先掌握单个特性，再理解使用场景，最后建立特性间的关联
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
