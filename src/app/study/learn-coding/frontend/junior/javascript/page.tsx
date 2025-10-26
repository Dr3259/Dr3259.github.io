'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Code, CheckCircle2, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function JavaScriptPage() {
  const sections = [
    {
      title: '1. 核心语法',
      description: '从自由声明到受控执行',
      concept: '核心语法是 JavaScript 编程的基础，包括变量声明、运算符、控制结构等。它定义了如何编写有效的 JavaScript 代码。ES5 引入的严格模式（"use strict"）帮助开发者避免常见错误，如未声明变量就使用，让代码更加规范和可靠。',
      evolution: '自由声明 → 受控执行',
      features: [
        'var 声明变量（函数级作用域）',
        '运算符：算术、比较、逻辑',
        '控制结构：if/else、switch、for/while',
        '异常处理：try/catch/finally',
        '严格模式："use strict"（ES5）',
      ],
      connection: '变量和运算符构成程序逻辑基础，控制结构组织执行流，严格模式提升代码规范',
      evolution_path: '从 ES3 的松散语法（易变量泄漏）到 ES5 的严格模式，减少错误',
      code: `// 变量声明
var x = 10;
var name = "John";

// 严格模式（ES5）
"use strict";
// x = 10; // 错误：未声明变量

// 控制结构
if (x > 5) {
  console.log("大于5");
} else {
  console.log("小于等于5");
}

// 循环
for (var i = 0; i < 5; i++) {
  console.log(i);
}

// 异常处理
try {
  throw new Error("错误");
} catch (e) {
  console.log(e.message);
}`,
    },
    {
      title: '2. 数据类型',
      description: '从松散类型到明确检测',
      concept: 'JavaScript 是动态类型语言，变量可以存储任何类型的数据。基本类型包括数字、字符串、布尔值等。理解类型转换和检测对于避免运行时错误至关重要。typeof 和 instanceof 是检测数据类型的主要工具，帮助开发者编写更健壮的代码。',
      evolution: '松散类型 → 明确检测',
      features: [
        '基本类型：undefined、null、boolean、number、string',
        '类型转换：parseInt()、parseFloat()、String()、Number()',
        '类型检测：typeof、instanceof',
        '隐式转换处理',
      ],
      connection: '基本类型支持数据操作，类型转换处理混合运算，检测确保逻辑正确',
      evolution_path: '从 ES3 的类型混淆到 ES5 的规范化，连接动态数据处理',
      code: `// 基本类型
var num = 42;
var str = "Hello";
var bool = true;
var nothing = null;
var undef = undefined;

// 类型检测
typeof num;        // "number"
typeof str;        // "string"
typeof bool;       // "boolean"
typeof nothing;    // "object" (历史遗留)
typeof undef;      // "undefined"

// 类型转换
parseInt("123");   // 123
parseFloat("12.34"); // 12.34
String(123);       // "123"
Number("123");     // 123

// 隐式转换
5 + "5";          // "55" (字符串)
"5" - 2;          // 3 (数字)`,
    },
    {
      title: '3. 函数',
      description: '从代码复用到作用域隔离',
      concept: '函数是 JavaScript 的一等公民，既可以封装可复用的代码逻辑，也是创建作用域的主要方式。闭包是 JavaScript 的强大特性，让函数可以"记住"其创建时的环境，常用于数据封装和状态管理。IIFE（立即执行函数）则用于创建独立的作用域，避免变量污染。',
      evolution: '代码复用 → 作用域隔离',
      features: [
        '函数声明和函数表达式',
        'arguments 对象',
        '函数作用域和变量提升',
        '闭包（状态持久化）',
        'IIFE（立即执行函数）',
      ],
      connection: '函数封装逻辑，闭包和 IIFE 管理作用域，参数处理动态输入',
      evolution_path: '从 ES3 的基础函数到 ES5 的闭包优化，连接模块化开发',
      code: `// 函数声明
function add(a, b) {
  return a + b;
}

// 函数表达式
var multiply = function(a, b) {
  return a * b;
};

// 闭包示例（计数器）
function createCounter() {
  var count = 0;
  return function() {
    count++;
    return count;
  };
}
var counter = createCounter();
counter(); // 1
counter(); // 2

// IIFE（隔离作用域）
(function() {
  var private = "私有变量";
  console.log(private);
})();

// arguments 对象
function sum() {
  var total = 0;
  for (var i = 0; i < arguments.length; i++) {
    total += arguments[i];
  }
  return total;
}
sum(1, 2, 3, 4); // 10`,
    },
    {
      title: '4. 对象',
      description: '从静态数据到动态继承',
      concept: '对象是 JavaScript 中组织数据和功能的核心方式。通过对象字面量或构造函数可以创建对象，通过原型链实现继承。ES5 的 Object.create() 和 Object.defineProperty() 提供了更精细的对象控制能力，让开发者可以定义属性的可写性、可枚举性等特性。',
      evolution: '静态数据 → 动态继承',
      features: [
        '对象字面量和构造函数',
        '属性操作：点号、方括号、delete',
        '原型链：prototype',
        'Object.create()（ES5）',
        'Object.defineProperty()（ES5）',
      ],
      connection: '对象组织数据和行为，原型实现继承，属性描述增强控制',
      evolution_path: '从 ES3 的简单对象到 ES5 的原型和属性管理，连接面向对象编程',
      code: `// 对象字面量
var person = {
  name: "John",
  age: 30,
  say: function() {
    return "Hello, " + this.name;
  }
};

// 构造函数
function Person(name, age) {
  this.name = name;
  this.age = age;
}
Person.prototype.say = function() {
  return "Hello, " + this.name;
};
var john = new Person("John", 30);

// Object.create()（ES5）
var proto = { greet: function() { return "Hi"; } };
var obj = Object.create(proto);

// Object.defineProperty()（ES5）
Object.defineProperty(person, "id", {
  value: 123,
  writable: false,
  enumerable: false
});`,
    },
    {
      title: '5. 数组',
      description: '从手动循环到函数式遍历',
      concept: '数组用于存储有序的数据集合。JavaScript 提供了丰富的数组方法来操作数据，如添加、删除、排序、连接等。ES5 引入的 forEach() 等迭代方法让数组遍历更加简洁，为后续的函数式编程风格（map、filter、reduce）奠定了基础。',
      evolution: '手动循环 → 函数式遍历',
      features: [
        '数组创建：字面量、构造函数',
        '操作方法：push、pop、shift、unshift、splice、slice',
        '其他方法：concat、join、reverse、sort',
        'forEach()（ES5）',
        'length 属性',
      ],
      connection: '数组存储序列数据，方法支持增删改查，迭代简化遍历',
      evolution_path: '从 ES3 的基础操作到 ES5 的迭代方法，连接数据处理',
      code: `// 数组创建
var arr = [1, 2, 3];
var arr2 = new Array(3);

// 操作方法
arr.push(4);       // [1, 2, 3, 4]
arr.pop();         // [1, 2, 3]
arr.shift();       // [2, 3]
arr.unshift(0);    // [0, 2, 3]

// 其他方法
arr.concat([4, 5]); // [0, 2, 3, 4, 5]
arr.join("-");      // "0-2-3"
arr.reverse();      // [3, 2, 0]

// forEach（ES5）
arr.forEach(function(item, index) {
  console.log(index + ": " + item);
});

// 传统 for 循环
for (var i = 0; i < arr.length; i++) {
  console.log(arr[i]);
}`,
    },
    {
      title: '6. DOM 操作',
      description: '从逐个查找到批量选择',
      concept: 'DOM（文档对象模型）是 JavaScript 操作 HTML 的桥梁。通过 DOM API，JavaScript 可以查找、修改、创建和删除页面元素，实现动态交互。ES5 引入的 querySelector 和 querySelectorAll 让元素选择变得像 CSS 选择器一样简单，大大提升了开发效率。',
      evolution: '逐个查找 → 批量选择',
      features: [
        '访问：getElementById、getElementsByTagName、getElementsByClassName',
        '修改：innerHTML、style、setAttribute',
        '创建/删除：createElement、appendChild、removeChild',
        'querySelector、querySelectorAll（ES5）',
      ],
      connection: 'DOM 访问和修改实现页面交互，查询方法提升选择效率',
      evolution_path: '从 ES3 的冗长遍历到 ES5 的选择器 API，连接动态页面',
      code: `// 访问元素
var elem = document.getElementById("myId");
var elems = document.getElementsByClassName("myClass");

// querySelector（ES5）
var first = document.querySelector(".myClass");
var all = document.querySelectorAll(".myClass");

// 修改元素
elem.innerHTML = "新内容";
elem.style.color = "red";
elem.setAttribute("data-id", "123");

// 创建和添加
var newDiv = document.createElement("div");
newDiv.textContent = "新元素";
document.body.appendChild(newDiv);

// 删除元素
var parent = elem.parentNode;
parent.removeChild(elem);`,
    },
    {
      title: '7. 事件处理',
      description: '从硬编码到动态绑定',
      concept: '事件处理让网页能够响应用户操作（点击、输入、滚动等）。addEventListener 是现代事件绑定的标准方式，支持同一元素绑定多个处理函数。事件冒泡和捕获机制让开发者可以在父元素上统一处理子元素的事件，这是事件委托的基础。',
      evolution: '硬编码 → 动态绑定',
      features: [
        '绑定方式：内联、DOM 属性、addEventListener（ES5）',
        '事件类型：click、mouseover、keydown、load、submit',
        '事件对象：event.target、event.type',
        '阻止默认：event.preventDefault()',
        '冒泡/捕获控制',
      ],
      connection: '事件绑定触发交互，事件对象提供上下文，冒泡/捕获控制传播',
      evolution_path: '从 ES3 的内联事件到 ES5 的监听器模型，连接复杂交互',
      code: `// DOM 属性绑定
elem.onclick = function() {
  alert("点击了");
};

// addEventListener（ES5 推荐）
elem.addEventListener("click", function(event) {
  console.log("点击了", event.target);
  event.preventDefault(); // 阻止默认行为
});

// 事件冒泡
parent.addEventListener("click", function() {
  console.log("父元素点击");
}, false); // false = 冒泡阶段

// 事件捕获
parent.addEventListener("click", function() {
  console.log("父元素点击（捕获）");
}, true); // true = 捕获阶段

// 移除事件
function handler() { }
elem.addEventListener("click", handler);
elem.removeEventListener("click", handler);`,
    },
    {
      title: '8. BOM（浏览器对象模型）',
      description: '从浏览器控制到客户端持久化',
      concept: 'BOM 提供了与浏览器窗口交互的接口，包括弹窗、导航、计时器等功能。ES5 引入的 localStorage 和 sessionStorage 让网页可以在客户端存储数据，容量远超 Cookie，且不会在每次请求时发送到服务器，为离线应用和性能优化提供了基础。',
      evolution: '浏览器控制 → 客户端持久化',
      features: [
        '窗口：window.alert()、confirm()、prompt()',
        '导航：window.location、location.href、location.reload()',
        '计时器：setTimeout()、setInterval()、clearTimeout()',
        '屏幕：window.screen、window.history',
        '存储：localStorage、sessionStorage（ES5）',
      ],
      connection: 'BOM 控制浏览器行为，计时器和存储支持动态功能',
      evolution_path: '从 ES3 的窗口操作到 ES5 的存储支持，连接 PWA 雏形',
      code: `// 窗口对话框
window.alert("提示");
var result = window.confirm("确认吗？");
var input = window.prompt("请输入：");

// 导航
window.location.href = "https://example.com";
window.location.reload();

// 计时器
var timer = setTimeout(function() {
  console.log("延迟执行");
}, 1000);
clearTimeout(timer);

var interval = setInterval(function() {
  console.log("重复执行");
}, 1000);
clearInterval(interval);

// 存储（ES5）
localStorage.setItem("key", "value");
var value = localStorage.getItem("key");
localStorage.removeItem("key");

sessionStorage.setItem("temp", "data");`,
    },
  ];

  const resources = [
    { name: 'MDN JavaScript 教程', url: 'https://developer.mozilla.org/zh-CN/docs/Web/JavaScript', description: '最权威的 JavaScript 文档' },
    { name: 'JavaScript.info', url: 'https://javascript.info', description: '现代 JavaScript 教程' },
    { name: 'Eloquent JavaScript', url: 'https://eloquentjavascript.net/', description: '深入理解 JavaScript' },
    { name: 'You Don\'t Know JS', url: 'https://github.com/getify/You-Dont-Know-JS', description: 'JavaScript 深度系列' },
  ];

  const summary = {
    coverage: '约 80% 为现代 JS 根基',
    trend: 'ES5 仍为兼容性基石，与 HTML5 配合支持 PWA 和动态 UI',
    suggestion: '掌握闭包（状态管理）、DOM 操作（动态 UI）后，渐进学习 ES6+',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-yellow-50 to-orange-50 p-4 sm:p-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <Link href="/study/learn-coding/frontend?level=junior" passHref>
            <Button variant="outline" size="sm" className="hover:bg-white/80 shadow-sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              返回前端开发
            </Button>
          </Link>
        </div>

        {/* 页面标题 */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl shadow-lg mb-4">
            <Code className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-gray-800">
            JavaScript 基础
          </h1>
          <p className="text-gray-600">
            掌握 ES5 及更早版本的核心功能，构建动态 Web 应用基础
          </p>
        </div>

        {/* 内容区域 */}
        <div className="space-y-6 mb-8">
          {sections.map((section, idx) => (
            <Card key={idx} id={`section-${idx + 1}`} className="p-6 bg-white/80 backdrop-blur-sm scroll-mt-20">
              {/* 标题和描述 */}
              <div className="flex items-start gap-3 mb-4">
                <CheckCircle2 className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">{section.title}</h2>
                  <p className="text-gray-600 mb-2">{section.description}</p>
                  <div className="flex items-center gap-2 text-sm">
                    <TrendingUp className="w-4 h-4 text-orange-600" />
                    <span className="text-orange-600 font-medium">演进路径：{section.evolution}</span>
                  </div>
                </div>
              </div>

              {/* 概念解释 */}
              {section.concept && (
                <div className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 mb-4">
                  <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <span className="text-blue-600">💡</span>
                    什么是{section.title.replace(/^\d+\.\s*/, '')}？
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed">{section.concept}</p>
                </div>
              )}

              {/* 核心功能 */}
              <div className="p-4 rounded-lg bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 mb-4">
                <h3 className="font-semibold text-gray-800 mb-3">核心功能</h3>
                <ul className="space-y-2">
                  {section.features.map((feature, i) => (
                    <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="text-yellow-600 mt-1">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 逻辑连接 */}
              <div className="p-4 rounded-lg bg-blue-50 border border-blue-200 mb-4">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold text-blue-700">连接：</span>
                  {section.connection}
                </p>
              </div>

              {/* 演进路径 */}
              <div className="p-4 rounded-lg bg-purple-50 border border-purple-200 mb-4">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold text-purple-700">演进：</span>
                  {section.evolution_path}
                </p>
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
            <Code className="w-6 h-6 text-yellow-600" />
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
                  <TrendingUp className="w-5 h-5 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
                <p className="text-sm text-gray-600">{resource.description}</p>
              </a>
            ))}
          </div>
        </Card>

        {/* 总结 */}
        <Card className="p-6 bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">总体概览与使用建议</h2>
          <div className="space-y-3">
            <div className="p-4 bg-white rounded-lg">
              <p className="text-sm text-gray-700">
                <span className="font-semibold text-yellow-700">覆盖范围：</span>
                {summary.coverage}，适用于简单动态页面和遗留项目
              </p>
            </div>
            <div className="p-4 bg-white rounded-lg">
              <p className="text-sm text-gray-700">
                <span className="font-semibold text-orange-700">演进趋势（2025）：</span>
                {summary.trend}
              </p>
            </div>
            <div className="p-4 bg-white rounded-lg">
              <p className="text-sm text-gray-700">
                <span className="font-semibold text-blue-700">使用建议：</span>
                {summary.suggestion}
              </p>
            </div>
          </div>
        </Card>

        {/* 底部提示 */}
        <div className="text-center">
          <Card className="inline-block p-4 bg-gradient-to-r from-white/80 to-yellow-50/80 backdrop-blur-sm border border-yellow-200/50">
            <p className="text-sm text-gray-700">
              💡 重点：掌握闭包和 DOM 操作，为学习 ES6+ 打下坚实基础
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
