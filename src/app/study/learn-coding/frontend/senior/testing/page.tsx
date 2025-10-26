'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, TestTube2, CheckCircle2, TrendingUp, Sparkles, BookOpen, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function TestingPage() {
  const sections = [
    {
      title: '1. TDD（Test-Driven Development）',
      category: '开发方法论',
      what: '测试驱动开发，一种开发方法论。先写测试、后写实现',
      why: '保证开发过程中逻辑的正确性；降低回归风险；促进可维护性',
      how: '写一个失败的测试（Red）→ 写代码让测试通过（Green）→ 重构（Refactor）',
      sugar: 'Red-Green-Refactor',
      scenarios: ['核心逻辑开发', '高复用库', '组件函数', '追求稳定性与持续迭代的项目'],
      relations: ['TDD ←→ BDD', 'TDD ←→ CI/CD', 'TDD ←→ 单元测试'],
      code: `// TDD 开发流程示例
// 1. 先写测试（Red）
test('sum adds two numbers', () => {
  expect(sum(1, 2)).toBe(3);
});

// 2. 写实现让测试通过（Green）
function sum(a, b) {
  return a + b;
}

// 3. 重构优化
function sum(a, b) {
  // 添加类型检查
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new Error('Parameters must be numbers');
  }
  return a + b;
}

// Jest / Vitest 配置
// vitest.config.ts
export default {
  test: {
    globals: true,
    environment: 'jsdom',
  }
};`,
    },
    {
      title: '2. BDD（Behavior-Driven Development）',
      category: '开发方法论',
      what: '行为驱动开发，关注业务行为和用户期望，而非实现细节',
      why: '促进前后端、QA、PM 协作；让测试语言贴近用户故事',
      how: '使用 Given-When-Then 格式；框架：Cucumber.js / Jasmine / Mocha + Chai',
      sugar: 'Given-When-Then',
      scenarios: ['用户故事驱动的项目', '电商系统', '后台管理系统', '业务流程测试'],
      relations: ['BDD ←→ TDD', 'BDD ←→ 用户故事', 'BDD ←→ E2E 测试'],
      code: `// BDD 测试示例
// Given-When-Then 格式
describe('用户登录流程', () => {
  test('成功登录后跳转到首页', () => {
    // Given: 用户已在登录页
    render(<LoginPage />);
    
    // When: 输入正确的用户名和密码并点击登录
    fireEvent.change(screen.getByLabelText('用户名'), {
      target: { value: 'admin' }
    });
    fireEvent.change(screen.getByLabelText('密码'), {
      target: { value: '123456' }
    });
    fireEvent.click(screen.getByText('登录'));
    
    // Then: 应该跳转到首页
    await waitFor(() => {
      expect(window.location.pathname).toBe('/dashboard');
    });
  });
});

// Cucumber.js 风格
Given('用户已登录', async () => {
  await login('admin', '123456');
});

When('点击退出按钮', async () => {
  await clickLogout();
});

Then('应跳转至登录页', () => {
  expect(getCurrentUrl()).toBe('/login');
});`,
    },
    {
      title: '3. 单元测试（Unit Test）',
      category: '测试类型',
      what: '对最小可测试单元（函数、组件）进行验证',
      why: '防止单个逻辑出错，降低调试成本',
      how: '使用 Jest / Vitest / Mocha 对输入输出进行断言',
      sugar: 'expect().toBe()',
      scenarios: ['组件逻辑', '工具函数', '状态管理逻辑', '每次提交代码时自动执行'],
      relations: ['单元测试 ←→ TDD', '单元测试 ←→ Mock', '单元测试 ←→ CI/CD'],
      code: `// 单元测试示例
// 1. 函数测试
test('sum adds numbers', () => {
  expect(sum(1, 2)).toBe(3);
  expect(sum(-1, 1)).toBe(0);
  expect(sum(0, 0)).toBe(0);
});

// 2. 组件测试
import { render, screen } from '@testing-library/react';

test('Button renders with correct text', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByText('Click me')).toBeInTheDocument();
});

// 3. 异步测试
test('fetches user data', async () => {
  const user = await fetchUser(1);
  expect(user.name).toBe('Alice');
});

// 4. 状态管理测试
test('counter increments', () => {
  const { result } = renderHook(() => useCounter());
  
  act(() => {
    result.current.increment();
  });
  
  expect(result.current.count).toBe(1);
});`,
    },
    {
      title: '4. 集成测试（Integration Test）',
      category: '测试类型',
      what: '测试模块之间交互是否正确（如组件 + API）',
      why: '验证数据流和模块协作是否正常',
      how: '使用 Jest + Testing Library；Mock API 请求；检查 DOM 渲染和状态变化',
      sugar: 'Mock + Integration',
      scenarios: ['验证组件组合', 'React Hooks', 'Vue 组合式逻辑', '数据流测试'],
      relations: ['集成测试 ←→ 单元测试', '集成测试 ←→ E2E 测试', '集成测试 ←→ Mock'],
      code: `// 集成测试示例
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

test('用户列表加载和搜索', async () => {
  // Mock API
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve([
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' }
      ])
    })
  );

  render(<UserList />);

  // 等待数据加载
  await waitFor(() => {
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });

  // 测试搜索功能
  const searchInput = screen.getByPlaceholderText('搜索用户');
  await userEvent.type(searchInput, 'Alice');

  expect(screen.getByText('Alice')).toBeInTheDocument();
  expect(screen.queryByText('Bob')).not.toBeInTheDocument();
});

// 测试组件间通信
test('父子组件数据传递', () => {
  const handleChange = jest.fn();
  render(<Parent onChange={handleChange} />);
  
  const button = screen.getByRole('button');
  fireEvent.click(button);
  
  expect(handleChange).toHaveBeenCalledWith('new value');
});`,
    },
    {
      title: '5. E2E 测试（End-to-End）',
      category: '测试类型',
      what: '模拟真实用户从入口到退出的全流程操作测试',
      why: '防止系统级错误；验证整体业务流程',
      how: '工具：Cypress / Playwright / Puppeteer；运行真实浏览器，点击、输入、断言结果',
      sugar: 'cy.visit().get().click()',
      scenarios: ['用户核心流程（登录、下单、支付）', '回归测试', '跨浏览器测试'],
      relations: ['E2E ←→ 集成测试', 'E2E ←→ CI/CD', 'E2E ←→ BDD'],
      code: `// Cypress E2E 测试
describe('电商购物流程', () => {
  it('完整购物流程', () => {
    // 访问首页
    cy.visit('/');
    
    // 搜索商品
    cy.get('input[name=search]').type('iPhone');
    cy.get('button[type=submit]').click();
    
    // 选择商品
    cy.contains('iPhone 15').click();
    
    // 加入购物车
    cy.get('.add-to-cart').click();
    cy.contains('已加入购物车').should('be.visible');
    
    // 去结算
    cy.get('.cart-icon').click();
    cy.contains('去结算').click();
    
    // 填写地址
    cy.get('input[name=address]').type('北京市朝阳区');
    
    // 提交订单
    cy.get('.submit-order').click();
    
    // 验证成功
    cy.url().should('include', '/order/success');
    cy.contains('订单提交成功').should('be.visible');
  });
});

// Playwright 示例
import { test, expect } from '@playwright/test';

test('用户登录', async ({ page }) => {
  await page.goto('/login');
  
  await page.fill('input[name=username]', 'admin');
  await page.fill('input[name=password]', '123456');
  await page.click('button[type=submit]');
  
  await expect(page).toHaveURL('/dashboard');
  await expect(page.locator('h1')).toContainText('欢迎');
});`,
    },
    {
      title: '6. 静态检查（Lint & Type Check）',
      category: '质量保障',
      what: '通过规则检测潜在问题，而非执行代码',
      why: '提前发现语法、风格、类型错误',
      how: 'ESLint + Prettier；TypeScript 类型检查（tsc --noEmit）',
      sugar: 'eslint --fix',
      scenarios: ['开发阶段实时提示', '提交代码时（pre-commit hook）', 'CI/CD 流程'],
      relations: ['静态检查 ←→ TypeScript', '静态检查 ←→ CI/CD', '静态检查 ←→ 代码规范'],
      code: `// ESLint 配置
// .eslintrc.js
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier'
  ],
  rules: {
    'no-console': 'warn',
    'no-unused-vars': 'error',
    '@typescript-eslint/no-explicit-any': 'warn'
  }
};

// Prettier 配置
// .prettierrc
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5"
}

// TypeScript 类型检查
// package.json
{
  "scripts": {
    "type-check": "tsc --noEmit",
    "lint": "eslint . --ext .ts,.tsx",
    "format": "prettier --write \"src/**/*.{ts,tsx}\""
  }
}

// Husky + lint-staged
// .husky/pre-commit
npm run lint-staged

// lint-staged.config.js
module.exports = {
  '*.{ts,tsx}': ['eslint --fix', 'prettier --write'],
  '*.{json,md}': ['prettier --write']
};`,
    },
    {
      title: '7. Mock / Stub / Spy（测试替身）',
      category: '测试技术',
      what: '在测试中用假的函数、接口或模块替换真实依赖',
      why: '控制环境、避免真实请求、隔离外部副作用',
      how: 'jest.fn()、vi.spyOn()、sinon.stub()；Mock API 请求返回数据',
      sugar: 'jest.mock()',
      scenarios: ['组件测试（隔离网络请求）', '状态管理逻辑测试', '第三方库隔离'],
      relations: ['Mock ←→ 单元测试', 'Mock ←→ 集成测试', 'Mock ←→ 依赖注入'],
      code: `// Mock 示例
// 1. Mock 函数
const mockFn = jest.fn();
mockFn('hello');
expect(mockFn).toHaveBeenCalledWith('hello');

// 2. Mock 模块
jest.mock('./api', () => ({
  fetchUser: jest.fn(() => Promise.resolve({ name: 'Alice' }))
}));

test('loads user data', async () => {
  const user = await fetchUser(1);
  expect(user.name).toBe('Alice');
});

// 3. Spy 监听
const obj = {
  method: () => 'original'
};

const spy = jest.spyOn(obj, 'method');
obj.method();
expect(spy).toHaveBeenCalled();

// 4. Mock API 请求
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ data: 'mocked' })
  })
);

// 5. Mock 时间
jest.useFakeTimers();
setTimeout(() => console.log('done'), 1000);
jest.advanceTimersByTime(1000);

// 6. Vitest Mock
import { vi } from 'vitest';

const mockCallback = vi.fn();
mockCallback('test');
expect(mockCallback).toHaveBeenCalledWith('test');`,
    },
    {
      title: '8. 快照测试（Snapshot Test）',
      category: '测试技术',
      what: '对渲染结果（HTML、对象）生成快照文件，后续对比',
      why: '快速发现 UI 变化或意外修改',
      how: 'expect(tree).toMatchSnapshot()；生成 .snap 文件',
      sugar: 'toMatchSnapshot()',
      scenarios: ['UI 组件', '模板渲染检查', '静态结构变动'],
      relations: ['快照测试 ←→ 单元测试', '快照测试 ←→ 回归测试', '快照测试 ←→ UI 组件'],
      code: `// 快照测试示例
import renderer from 'react-test-renderer';

test('Button renders correctly', () => {
  const tree = renderer
    .create(<Button label="Click me" onClick={() => {}} />)
    .toJSON();
  
  expect(tree).toMatchSnapshot();
});

// 生成的快照文件 __snapshots__/Button.test.tsx.snap
exports[\`Button renders correctly 1\`] = \`
<button
  className="btn"
  onClick={[Function]}
>
  Click me
</button>
\`;

// 内联快照
test('renders inline', () => {
  const data = { name: 'Alice', age: 25 };
  expect(data).toMatchInlineSnapshot(\`
    {
      "age": 25,
      "name": "Alice",
    }
  \`);
});

// 更新快照
// npm test -- -u

// 属性匹配器
test('user object', () => {
  const user = {
    id: Math.random(),
    name: 'Alice',
    createdAt: new Date()
  };
  
  expect(user).toMatchSnapshot({
    id: expect.any(Number),
    createdAt: expect.any(Date)
  });
});`,
    },
    {
      title: '9. 覆盖率分析（Coverage）',
      category: '质量度量',
      what: '统计测试执行了多少代码',
      why: '衡量测试全面性，避免漏测',
      how: 'jest --coverage 查看函数、语句、分支覆盖率',
      sugar: '--coverage',
      scenarios: ['回归测试', '持续集成', '质量门槛'],
      relations: ['覆盖率 ←→ 所有测试类型', '覆盖率 ←→ CI/CD', '覆盖率 ←→ 质量门槛'],
      code: `// 运行覆盖率测试
npm test -- --coverage

// 覆盖率报告示例
----------------------|---------|----------|---------|---------|
File                  | % Stmts | % Branch | % Funcs | % Lines |
----------------------|---------|----------|---------|---------|
All files             |   85.5  |   78.2   |   90.1  |   85.3  |
 components/          |   92.3  |   85.6   |   95.2  |   92.1  |
  Button.tsx          |   100   |   100    |   100   |   100   |
  Input.tsx           |   87.5  |   75.0   |   90.0  |   87.5  |
 utils/               |   78.9  |   70.5   |   85.0  |   78.7  |
  helpers.ts          |   80.0  |   66.7   |   85.7  |   80.0  |
----------------------|---------|----------|---------|---------|

// Jest 配置
// jest.config.js
module.exports = {
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.tsx'
  ]
};

// 查看详细报告
open coverage/lcov-report/index.html`,
    },
    {
      title: '10. CI/CD 集成',
      category: '自动化流程',
      what: '自动化测试与部署管道',
      why: '保证每次提交都经过验证，避免线上回归',
      how: 'GitHub Actions / GitLab CI / Jenkins 执行测试命令 + 构建部署',
      sugar: 'GitHub Actions',
      scenarios: ['企业级团队协作', '自动化部署', '持续集成'],
      relations: ['CI/CD ←→ 所有测试类型', 'CI/CD ←→ 覆盖率', 'CI/CD ←→ 质量门槛'],
      code: `// GitHub Actions 配置
// .github/workflows/test.yml
name: Test

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linter
        run: npm run lint
      
      - name: Run type check
        run: npm run type-check
      
      - name: Run tests
        run: npm test -- --coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
      
      - name: Build
        run: npm run build

// GitLab CI 配置
// .gitlab-ci.yml
stages:
  - test
  - build
  - deploy

test:
  stage: test
  script:
    - npm ci
    - npm run lint
    - npm test -- --coverage
  coverage: '/All files[^|]*\\|[^|]*\\s+([\\d\\.]+)/'

build:
  stage: build
  script:
    - npm run build
  artifacts:
    paths:
      - dist/`,
    },
  ];

  const testingLayers = [
    { name: '开发方法论', desc: 'TDD、BDD', icon: '🎯' },
    { name: '测试类型', desc: '单元、集成、E2E', icon: '🧪' },
    { name: '测试技术', desc: 'Mock、快照', icon: '🔧' },
    { name: '质量保障', desc: '静态检查、覆盖率', icon: '✅' },
    { name: '自动化', desc: 'CI/CD', icon: '🤖' },
  ];

  const testingRelations = [
    'TDD ←→ 单元测试 ←→ Mock',
    'BDD ←→ E2E 测试 ←→ 用户故事',
    '单元测试 ←→ 集成测试 ←→ E2E 测试',
    '静态检查 ←→ TypeScript ←→ ESLint',
    'CI/CD ←→ 覆盖率 ←→ 质量门槛',
  ];

  const deprecatedTools = [
    { name: 'Karma + PhantomJS', status: '❌ 过时', reason: '依赖老旧浏览器环境' },
    { name: 'Selenium', status: '⚠️ 被取代', reason: '被 Cypress/Playwright 取代，维护复杂、运行慢' },
    { name: 'Mocha + Chai + Enzyme', status: '⚠️ 部分弃用', reason: '旧版 React 测试工具' },
    { name: 'Tape / QUnit', status: '⚠️ 经典但老旧', reason: '仍能用，但社区冷却' },
    { name: 'PhantomJS', status: '❌ 废弃', reason: '官方停止维护' },
  ];

  const resources = [
    { name: 'Jest 官方文档', url: 'https://jestjs.io/', description: '最流行的 JavaScript 测试框架' },
    { name: 'Vitest', url: 'https://vitest.dev/', description: '基于 Vite 的现代测试框架' },
    { name: 'Testing Library', url: 'https://testing-library.com/', description: 'React/Vue 组件测试库' },
    { name: 'Cypress', url: 'https://www.cypress.io/', description: '现代 E2E 测试框架' },
    { name: 'Playwright', url: 'https://playwright.dev/', description: 'Microsoft 出品的 E2E 测试工具' },
    { name: 'ESLint', url: 'https://eslint.org/', description: 'JavaScript 代码检查工具' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6">
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
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl shadow-lg mb-4">
            <TestTube2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-gray-800">
            前端测试与质量
          </h1>
          <p className="text-gray-600">
            系统掌握前端测试体系，从 TDD 到 CI/CD 的完整质量保障链路
          </p>
        </div>

        {/* 测试体系总览 */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-800">测试体系总览</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {testingLayers.map((layer, index) => (
              <div key={index} className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 border border-gray-200">
                <div className="text-3xl mb-2">{layer.icon}</div>
                <div className="font-semibold text-gray-800 mb-1">{layer.name}</div>
                <div className="text-sm text-gray-600">{layer.desc}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* 测试关系图谱 */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm mb-6">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-6 h-6 text-green-600" />
            <h2 className="text-2xl font-bold text-gray-800">测试关系图谱</h2>
          </div>
          <div className="space-y-2">
            {testingRelations.map((relation, index) => (
              <div key={index} className="flex items-center gap-2 text-gray-700">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="font-mono text-sm">{relation}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* 过时/废弃工具 */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm mb-8">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-2xl font-bold text-gray-800">⚠️ 过时 / 不推荐的工具</h2>
          </div>
          <div className="space-y-3">
            {deprecatedTools.map((tool, index) => (
              <div key={index} className="p-4 rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-800">{tool.name}</h3>
                  <span className="px-3 py-1 bg-white rounded-full text-sm font-medium">{tool.status}</span>
                </div>
                <p className="text-sm text-gray-600">{tool.reason}</p>
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-6">
          {sections.map((section, index) => (
            <Card key={index} id={`section-${index + 1}`} className="p-6 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow scroll-mt-20">
              <div className="flex items-start gap-3 mb-4">
                <CheckCircle2 className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-800">{section.title}</h3>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                      {section.category}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                  <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                    <span className="text-lg">📌</span>
                    是什么（点）
                  </h4>
                  <p className="text-gray-700">{section.what}</p>
                </div>

                <div className="bg-amber-50 p-4 rounded-lg border-l-4 border-amber-500">
                  <h4 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
                    <span className="text-lg">💡</span>
                    为什么
                  </h4>
                  <p className="text-gray-700">{section.why}</p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                  <h4 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                    <span className="text-lg">✅</span>
                    怎么样
                  </h4>
                  <p className="text-gray-700">{section.how}</p>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full font-medium">
                    语法糖：{section.sugar}
                  </span>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <span className="text-lg">🎯</span>
                    使用场景（面）
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {section.scenarios.map((scenario, idx) => (
                      <span key={idx} className="px-3 py-1 bg-white border border-gray-300 rounded-full text-sm text-gray-700">
                        {scenario}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-indigo-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-indigo-900 mb-2 flex items-center gap-2">
                    <span className="text-lg">🔗</span>
                    关系（线）
                  </h4>
                  <div className="space-y-1">
                    {section.relations.map((relation, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-gray-700">
                        <CheckCircle2 className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                        <span className="text-sm font-mono">{relation}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-900 p-4 rounded-lg overflow-x-auto">
                  <pre className="text-sm text-gray-100 font-mono whitespace-pre-wrap">
                    {section.code}
                  </pre>
                </div>
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

        {/* 底部提示 */}
        <div className="text-center">
          <Card className="inline-block p-4 bg-gradient-to-r from-white/80 to-blue-50/80 backdrop-blur-sm border border-blue-200/50">
            <p className="text-sm text-gray-700">
              💡 建议：从单元测试开始，逐步掌握 TDD 方法论，最后建立完整的 CI/CD 流程
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
