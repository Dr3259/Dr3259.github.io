'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, AlertCircle, CheckCircle2, TrendingUp, Sparkles, BookOpen, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function ErrorHandlingPage() {
  const resources = [
    { name: 'MDN Error 对象', url: 'https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Error', description: 'JavaScript Error 对象完整文档' },
    { name: 'Sentry', url: 'https://sentry.io/', description: '错误监控和追踪平台' },
    { name: 'React Error Boundary', url: 'https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary', description: 'React 错误边界文档' },
    { name: 'Axios 拦截器', url: 'https://axios-http.com/docs/interceptors', description: 'Axios 请求和响应拦截器' },
    { name: 'LogRocket', url: 'https://logrocket.com/', description: '前端错误监控和会话重放' },
    { name: 'Error Handling Best Practices', url: 'https://www.joyent.com/node-js/production/design/errors', description: 'Node.js 错误处理最佳实践' },
  ];

  const sections = [
    {
      title: '1. Error（错误对象）',
      category: '核心概念',
      what: '语言提供的错误类型实例，描述程序运行中发生的异常状态',
      why: '统一错误信息，支持堆栈追踪、类型区分与统一捕获',
      how: 'const err = new Error("Something went wrong"); throw err;',
      sugar: '内置多种错误类型',
      scenarios: ['异常抛出', '错误分类', '堆栈追踪', '调试定位'],
      relations: ['是错误处理的基础', '与 throw 配合使用'],
      code: `// 创建错误对象
const err = new Error("Something went wrong");
console.log(err.message);  // "Something went wrong"
console.log(err.name);     // "Error"
console.log(err.stack);    // 堆栈信息

// 常见内置错误类型
// TypeError - 类型错误
const num = 123;
num.toUpperCase();  // TypeError: num.toUpperCase is not a function

// ReferenceError - 未定义引用
console.log(undefinedVar);  // ReferenceError: undefinedVar is not defined

// SyntaxError - 语法错误
eval('const x = ;');  // SyntaxError: Unexpected token ';'

// RangeError - 超出有效范围
const arr = new Array(-1);  // RangeError: Invalid array length

// URIError - URI 编码错误
decodeURIComponent('%');  // URIError: URI malformed

// 错误对象属性
const error = new Error("Custom error");
error.name = "CustomError";
error.code = "ERR_CUSTOM";
error.statusCode = 400;

throw error;`,
    },
    {
      title: '2. throw（抛出错误）',
      category: '核心概念',
      what: '中断当前执行流并抛出一个错误对象',
      why: '将异常传递到上层调用方',
      how: 'throw new Error("Invalid input");',
      sugar: '可以抛出任何值（但推荐抛出 Error 实例）',
      scenarios: ['参数验证', '业务逻辑错误', '中断执行', '错误传播'],
      relations: ['与 try/catch 配合', '触发错误捕获机制'],
      code: `// 抛出 Error 实例（推荐）
function divide(a, b) {
  if (b === 0) {
    throw new Error("Division by zero");
  }
  return a / b;
}

// 抛出自定义错误
function validateEmail(email) {
  if (!email.includes('@')) {
    throw new Error("Invalid email format");
  }
  return true;
}

// 可以抛出任何值（不推荐）
throw "Error string";
throw 404;
throw { code: 'ERR_001', message: 'Error' };

// 但推荐抛出 Error 实例
// 因为它包含堆栈信息
throw new Error("Recommended way");

// 在异步函数中抛出
async function fetchData() {
  const response = await fetch('/api/data');
  if (!response.ok) {
    throw new Error(\`HTTP error! status: \${response.status}\`);
  }
  return response.json();
}`,
    },
    {
      title: '3. try / catch / finally',
      category: '核心概念',
      what: '同步错误捕获与处理机制',
      why: '防止错误导致程序崩溃，提供恢复机会',
      how: 'try { ... } catch (err) { ... } finally { ... }',
      sugar: 'ES2019+ catch 参数可选',
      scenarios: ['同步代码错误捕获', '资源清理', '错误恢复'],
      relations: ['与 throw 配合', '是错误处理的基础语法'],
      code: `// 基础用法
try {
  const result = riskyOperation();
  console.log(result);
} catch (err) {
  console.error('Error:', err.message);
} finally {
  console.log('Cleanup');
}

// catch 参数可选（ES2019+）
try {
  throw new Error("oops");
} catch {
  console.log("Error occurred");
}

// 嵌套 try/catch
try {
  try {
    throw new Error("Inner error");
  } catch (innerErr) {
    console.log("Caught inner:", innerErr.message);
    throw new Error("Outer error");
  }
} catch (outerErr) {
  console.log("Caught outer:", outerErr.message);
}

// finally 总是执行
function processFile() {
  const file = openFile();
  try {
    return processData(file);
  } catch (err) {
    console.error("Processing failed:", err);
    return null;
  } finally {
    file.close();  // 无论成功失败都关闭文件
  }
}`,
    },
    {
      title: '4. Promise 异常（异步错误）',
      category: '异步错误',
      what: '异步操作的错误封装机制',
      why: '异步操作不能用同步 try/catch 捕获',
      how: 'promise.then().catch(err => handle(err))',
      sugar: 'Promise.finally() 用于清理',
      scenarios: ['网络请求', '异步操作', '错误链传播'],
      relations: ['与 async/await 配合', '支持错误链式传播'],
      code: `// Promise 错误捕获
fetchData()
  .then(data => processData(data))
  .then(result => console.log(result))
  .catch(err => console.error('Error:', err))
  .finally(() => console.log('Cleanup'));

// Promise 错误传播
Promise.resolve()
  .then(() => {
    throw new Error("Step 1 failed");
  })
  .then(() => {
    console.log("This won't run");
  })
  .catch(err => {
    console.error("Caught:", err.message);
  });

// Promise.reject
Promise.reject(new Error("Rejected"))
  .catch(err => console.error(err));

// 多个 Promise 错误处理
Promise.all([
  fetch('/api/users'),
  fetch('/api/posts'),
])
  .then(([users, posts]) => {
    // 处理数据
  })
  .catch(err => {
    // 任何一个失败都会进入这里
    console.error('One of the requests failed:', err);
  });

// Promise.allSettled（不会因为一个失败而中断）
Promise.allSettled([
  fetch('/api/users'),
  fetch('/api/posts'),
])
  .then(results => {
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        console.log(\`Request \${index} succeeded\`);
      } else {
        console.error(\`Request \${index} failed:\`, result.reason);
      }
    });
  });`,
    },
    {
      title: '5. async / await 错误捕获',
      category: '异步错误',
      what: 'Promise 的语法糖，支持同步写法捕获异步错误',
      why: '简化异步错误捕获，避免回调地狱',
      how: 'try { await fetchData(); } catch (err) { ... }',
      sugar: '异步代码同步化',
      scenarios: ['异步函数', 'API 调用', '数据库操作'],
      relations: ['是 Promise 的语法糖', '与 try/catch 配合'],
      code: `// 基础用法
async function loadData() {
  try {
    const data = await fetchData();
    const processed = await processData(data);
    return processed;
  } catch (err) {
    console.error('Error:', err);
    return null;
  }
}

// 多个 await
async function loadMultiple() {
  try {
    const users = await fetch('/api/users').then(r => r.json());
    const posts = await fetch('/api/posts').then(r => r.json());
    return { users, posts };
  } catch (err) {
    console.error('Failed to load data:', err);
    throw err;  // 重新抛出
  }
}

// 并行请求
async function loadParallel() {
  try {
    const [users, posts] = await Promise.all([
      fetch('/api/users').then(r => r.json()),
      fetch('/api/posts').then(r => r.json()),
    ]);
    return { users, posts };
  } catch (err) {
    console.error('One of the requests failed:', err);
  }
}

// 不使用 try/catch（返回错误）
async function loadDataSafe() {
  const data = await fetchData().catch(err => {
    console.error('Error:', err);
    return null;  // 返回默认值
  });
  return data;
}`,
    },
    {
      title: '6. 全局错误捕获',
      category: '全局处理',
      what: '防止未捕获错误导致程序崩溃',
      why: '作为最后的防线，记录和处理未捕获的错误',
      how: 'window.onerror、window.onunhandledrejection',
      sugar: '全局兜底机制',
      scenarios: ['生产环境监控', '错误上报', '防止崩溃'],
      relations: ['是错误处理的最后防线', '与监控系统配合'],
      code: `// 浏览器：捕获同步错误
window.onerror = function(message, source, lineno, colno, error) {
  console.error('Global error:', {
    message,
    source,
    lineno,
    colno,
    error
  });
  
  // 上报到监控系统
  reportError(error);
  
  // 返回 true 阻止默认错误处理
  return true;
};

// 浏览器：捕获 Promise 错误
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  
  // 上报错误
  reportError(event.reason);
  
  // 阻止默认处理
  event.preventDefault();
});

// Node.js：捕获同步未处理异常
process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
  // 记录日志
  logger.error(err);
  // 优雅退出
  process.exit(1);
});

// Node.js：捕获异步未处理异常
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled rejection at:', promise, 'reason:', reason);
  // 记录日志
  logger.error(reason);
});

// React：错误边界
class ErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    console.error('React error:', error, errorInfo);
    reportError(error);
  }
  
  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}`,
    },
    {
      title: '7. 自定义错误类',
      category: '高级技巧',
      what: '继承 Error 的业务化错误类型',
      why: '便于区分不同业务错误，提供更多上下文信息',
      how: 'class ValidationError extends Error { ... }',
      sugar: '类型化错误',
      scenarios: ['业务错误分类', '错误类型判断', '统一错误处理'],
      relations: ['继承 Error 类', '支持 instanceof 判断'],
      code: `// 自定义错误类
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
  }
}

class NetworkError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.name = "NetworkError";
    this.statusCode = statusCode;
  }
}

class AuthenticationError extends Error {
  constructor(message) {
    super(message);
    this.name = "AuthenticationError";
  }
}

// 使用自定义错误
function validateUser(user) {
  if (!user.email) {
    throw new ValidationError("Email is required");
  }
  if (!user.email.includes('@')) {
    throw new ValidationError("Invalid email format");
  }
}

// 错误类型判断
try {
  validateUser({ email: 'invalid' });
} catch (err) {
  if (err instanceof ValidationError) {
    console.log("Validation failed:", err.message);
  } else if (err instanceof NetworkError) {
    console.log("Network error:", err.statusCode);
  } else {
    console.log("Unknown error:", err);
  }
}`,
    },
    {
      title: '8. HTTP 状态码错误处理',
      category: '实战应用',
      what: '根据 HTTP 状态码进行错误分类和处理',
      why: '提供清晰的错误反馈，便于客户端处理',
      how: 'if (!response.ok) throw new Error()',
      sugar: 'axios 拦截器自动处理',
      scenarios: ['API 调用', '网络请求', '错误分类'],
      relations: ['与 RESTful API 配合', '支持统一错误处理'],
      code: `// fetch 错误处理
async function fetchWithErrorHandling(url) {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      switch (response.status) {
        case 400:
          throw new Error('请求参数错误');
        case 401:
          throw new AuthenticationError('请先登录');
        case 403:
          throw new Error('无权限访问');
        case 404:
          throw new Error('资源不存在');
        case 500:
          throw new Error('服务器错误');
        default:
          throw new Error(\`请求失败: \${response.status}\`);
      }
    }
    
    return await response.json();
  } catch (err) {
    console.error('请求失败:', err);
    throw err;
  }
}

// axios 拦截器
import axios from 'axios';

axios.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // 跳转登录
          window.location.href = '/login';
          break;
        case 403:
          message.error('无权限访问');
          break;
        case 404:
          message.error('资源不存在');
          break;
        case 500:
          message.error('服务器错误');
          break;
      }
    }
    
    return Promise.reject(error);
  }
);`,
    },
    {
      title: '9. 错误重试机制',
      category: '实战应用',
      what: '请求失败后自动重试',
      why: '提高请求成功率，应对网络波动',
      how: '循环 + 延迟 + 指数退避',
      sugar: '自动恢复机制',
      scenarios: ['网络请求', '不稳定服务', '临时故障'],
      relations: ['与错误恢复配合', '需要设置重试次数限制'],
      code: `// 基础重试
async function fetchWithRetry(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(\`HTTP \${response.status}\`);
      return await response.json();
    } catch (err) {
      if (i === retries - 1) throw err;
      console.log(\`Retry \${i + 1}/\${retries}\`);
      // 等待后重试
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
}

// 指数退避重试
async function fetchWithExponentialBackoff(url, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fetch(url).then(r => r.json());
    } catch (err) {
      if (i === maxRetries - 1) throw err;
      
      // 指数退避：1s, 2s, 4s, 8s...
      const delay = Math.pow(2, i) * 1000;
      console.log(\`Retrying in \${delay}ms...\`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

// 带条件的重试（只重试特定错误）
async function fetchWithConditionalRetry(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        // 只重试 5xx 错误
        if (response.status >= 500 && i < retries - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          continue;
        }
        throw new Error(\`HTTP \${response.status}\`);
      }
      return await response.json();
    } catch (err) {
      if (i === retries - 1) throw err;
    }
  }
}`,
    },
    {
      title: '10. 错误监控与上报',
      category: '生产实践',
      what: '记录和追踪错误的来源与频率',
      why: '生产环境诊断必备，快速定位问题',
      how: '集成 Sentry、LogRocket 等监控工具',
      sugar: '自动化错误追踪',
      scenarios: ['生产环境', '错误追踪', '性能监控', '用户行为分析'],
      relations: ['与全局错误捕获配合', '支持错误聚合和报警'],
      code: `// Sentry 集成
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "your-dsn-here",
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});

// 手动上报错误
try {
  riskyOperation();
} catch (err) {
  Sentry.captureException(err);
  throw err;
}

// 添加上下文信息
Sentry.setUser({
  id: user.id,
  email: user.email,
});

Sentry.setContext("custom", {
  action: "checkout",
  amount: 100,
});

// 自定义错误上报函数
function reportError(error, context = {}) {
  // 开发环境只打印
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', error, context);
    return;
  }
  
  // 生产环境上报
  Sentry.captureException(error, {
    extra: context,
    tags: {
      component: context.component,
      action: context.action,
    },
  });
  
  // 也可以上报到自己的服务器
  fetch('/api/errors', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
    }),
  }).catch(console.error);
}`,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <Link href="/study/learn-coding/frontend/mid/api" passHref>
            <Button variant="outline" size="sm" className="hover:bg-white/80 shadow-sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              返回网络与 API
            </Button>
          </Link>
        </div>

        {/* 页面标题 */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl shadow-lg mb-4">
            <AlertCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-gray-800">
            错误处理
          </h1>
          <p className="text-gray-600">
            系统弹性的核心机制 —— 从抛出到捕获、传播、恢复、记录形成完整闭环
          </p>
        </div>

        {/* 核心理念 */}
        <Card className="p-6 bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">核心理念</h2>
          <div className="space-y-3">
            <div className="p-4 bg-white rounded-lg">
              <p className="text-sm text-gray-700">
                <span className="font-semibold text-orange-700">定义：</span>
                错误处理指在程序执行过程中检测、捕获、报告并恢复错误的机制
              </p>
            </div>
            <div className="p-4 bg-white rounded-lg">
              <p className="text-sm text-gray-700">
                <span className="font-semibold text-red-700">目标：</span>
                防止错误导致程序崩溃，提供恢复机会，记录错误信息用于诊断
              </p>
            </div>
            <div className="p-4 bg-white rounded-lg">
              <p className="text-sm text-gray-700">
                <span className="font-semibold text-blue-700">原则：</span>
                Fail Fast（尽早暴露）、Graceful Degradation（优雅降级）、Observable（可观察）
              </p>
            </div>
          </div>
        </Card>

        {/* 内容区域 */}
        <div className="space-y-6 mb-8">
          {sections.map((section, idx) => (
            <Card key={idx} id={`section-${idx + 1}`} className="p-6 bg-white/80 backdrop-blur-sm scroll-mt-20">
              <div className="flex items-start gap-3 mb-4">
                <CheckCircle2 className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-2xl font-bold text-gray-800">{section.title}</h2>
                    <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs rounded-full font-medium">
                      {section.category}
                    </span>
                  </div>
                </div>
              </div>

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

              <div className="p-4 rounded-lg bg-orange-50 border border-orange-200 mb-4">
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-orange-600" />
                  使用场景
                </h3>
                <ul className="space-y-1">
                  {section.scenarios.map((scenario, i) => (
                    <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="text-orange-600 mt-1">✓</span>
                      <span>{scenario}</span>
                    </li>
                  ))}
                </ul>
              </div>

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

              <div>
                <h3 className="font-semibold text-gray-800 mb-2">代码示例</h3>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{section.code}</code>
                </pre>
              </div>
            </Card>
          ))}
        </div>

        {/* 错误类型对比 */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">常见错误类型</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-300">
                  <th className="text-left p-3 bg-gray-50">错误类型</th>
                  <th className="text-left p-3 bg-gray-50">含义</th>
                  <th className="text-left p-3 bg-gray-50">示例</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="p-3 font-medium">Error</td>
                  <td className="p-3 text-gray-600">通用错误类型</td>
                  <td className="p-3"><code className="text-xs">new Error("message")</code></td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-3 font-medium">TypeError</td>
                  <td className="p-3 text-gray-600">类型错误</td>
                  <td className="p-3"><code className="text-xs">null.toString()</code></td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-3 font-medium">ReferenceError</td>
                  <td className="p-3 text-gray-600">未定义引用</td>
                  <td className="p-3"><code className="text-xs">undefinedVar</code></td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-3 font-medium">SyntaxError</td>
                  <td className="p-3 text-gray-600">语法错误</td>
                  <td className="p-3"><code className="text-xs">eval("const x =")</code></td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-3 font-medium">RangeError</td>
                  <td className="p-3 text-gray-600">超出有效范围</td>
                  <td className="p-3"><code className="text-xs">new Array(-1)</code></td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-3 font-medium">URIError</td>
                  <td className="p-3 text-gray-600">URI 编码错误</td>
                  <td className="p-3"><code className="text-xs">decodeURIComponent("%")</code></td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>

        {/* 错误处理体系图 */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">错误处理体系</h2>
          <div className="p-4 bg-gray-50 rounded-lg">
            <pre className="text-sm text-gray-700 overflow-x-auto whitespace-pre">
{`┌────────────────────────────────────────────┐
│        错误处理体系（Error Handling）       │
├────────────────────────────────────────────┤
│ 抛出层：throw / reject                     │
│ 捕获层：try-catch / .catch() / error hooks │
│ 传播层：同步冒泡 / Promise 链传递          │
│ 恢复层：默认值 / 重试 / fallback           │
│ 记录层：日志 / 监控 / 报警                │
│ 展示层：UI 提示 / API 错误响应             │
└────────────────────────────────────────────┘

逻辑链：
异常出现 → 抛出错误 → 捕获错误 → 传播决策 
→ 记录错误 → 用户提示 → 恢复或终止`}
            </pre>
          </div>
        </Card>

        {/* 错误处理原则 */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">错误处理原则</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { principle: 'Fail Fast', desc: '尽早暴露错误，防止错误扩散' },
              { principle: 'Graceful Degradation', desc: '出错时不崩溃，提供部分功能' },
              { principle: 'Observable', desc: '错误应可被监控与追踪' },
              { principle: 'Typed Error', desc: '用类型区分错误源（语法、业务、网络）' },
              { principle: 'Recovery Path', desc: '给用户留后路，比如"重试"按钮' },
              { principle: 'Consistency', desc: '同一类型错误用统一结构返回' },
            ].map((item, idx) => (
              <div key={idx} className="p-4 bg-gradient-to-br from-white to-gray-50 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-2">{item.principle}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* 学习资源 */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm mb-8">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-6 h-6 text-orange-600" />
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

        {/* 最佳实践 */}
        <Card className="p-6 bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">错误处理最佳实践</h2>
          <div className="space-y-3">
            {[
              '✅ 使用 try/catch 包裹可能出错的代码',
              '✅ 抛出 Error 实例而不是字符串',
              '✅ 创建自定义错误类区分业务错误',
              '✅ 使用 finally 进行资源清理',
              '✅ Promise 链末尾添加 .catch()',
              '✅ async/await 使用 try/catch 捕获',
              '✅ 设置全局错误捕获作为兜底',
              '✅ 实现错误重试机制（指数退避）',
              '✅ 集成错误监控系统（Sentry）',
              '✅ 提供友好的错误提示给用户',
            ].map((practice, idx) => (
              <div key={idx} className="p-3 bg-white rounded-lg">
                <p className="text-sm text-gray-700">{practice}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* 底部提示 */}
        <div className="text-center">
          <Card className="inline-block p-4 bg-gradient-to-r from-white/80 to-orange-50/80 backdrop-blur-sm border border-orange-200/50">
            <p className="text-sm text-gray-700 mb-2">
              💡 <span className="font-semibold">错误处理是系统弹性的核心机制</span>
            </p>
            <p className="text-sm text-gray-600">
              从抛出到捕获、传播、恢复、记录形成完整闭环
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
