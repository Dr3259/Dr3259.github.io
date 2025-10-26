'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Settings, CheckCircle2, TrendingUp, Sparkles, BookOpen, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function EngineeringPage() {
  const sections = [
    {
      title: '1. CI/CD 管道（持续集成/持续交付）',
      category: '自动化流程',
      what: 'CI（Continuous Integration）自动构建与测试，CD（Continuous Delivery/Deployment）自动发布与上线',
      why: '减少人工操作错误；提高交付效率；保持代码主干始终可用',
      how: '触发条件：Git push → 流水线运行；阶段：Lint → Test → Build → Deploy；工具：GitHub Actions、GitLab CI、Jenkins、CircleCI',
      sugar: 'GitHub Actions',
      scenarios: ['大型项目持续集成', '自动化测试与预发布验证', '零人工上线'],
      relations: ['CI/CD ←→ 测试', 'CI/CD ←→ 构建', 'CI/CD ←→ 部署'],
      code: `// GitHub Actions 配置
// .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout
        uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Lint
        run: npm run lint
      
      - name: Test
        run: npm test
      
      - name: Build
        run: npm run build
        env:
          NODE_ENV: production
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: \${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: \${{ secrets.ORG_ID }}
          vercel-project-id: \${{ secrets.PROJECT_ID }}`,
    },
    {
      title: '2. 自动化部署',
      category: '部署流程',
      what: '代码构建完成后，自动将产物发布到服务器或 CDN',
      why: '避免人工 FTP/SSH 上传；保证一致性和快速回滚',
      how: '常见方式：CI/CD + SSH/FTP/Docker/Vercel CLI；工具：Vercel、Netlify、GitHub Pages、PM2、Ansible',
      sugar: 'vercel deploy',
      scenarios: ['前端构建产物（静态文件）上传 CDN', 'Node SSR 自动发布', '容器化部署'],
      relations: ['自动化部署 ←→ CI/CD', '自动化部署 ←→ Docker', '自动化部署 ←→ 监控'],
      code: `// Vercel 配置
// vercel.json
{
  "builds": [
    { "src": "package.json", "use": "@vercel/node" }
  ],
  "routes": [
    { "src": "/(.*)", "dest": "/index.html" }
  ]
}

// Netlify 配置
// netlify.toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

// PM2 部署配置
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'my-app',
    script: './dist/server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production'
    }
  }],
  deploy: {
    production: {
      user: 'deploy',
      host: 'server.com',
      ref: 'origin/main',
      repo: 'git@github.com:user/repo.git',
      path: '/var/www/app',
      'post-deploy': 'npm ci && npm run build && pm2 reload ecosystem.config.js'
    }
  }
};`,
    },
    {
      title: '3. Monorepo 管理',
      category: '代码组织',
      what: '在一个仓库内管理多个项目/包的代码结构',
      why: '避免多仓库版本地狱；方便依赖共享与统一构建',
      how: '工具：Turborepo、Nx、Lerna、Changesets；核心机制：依赖图、缓存编译、统一版本管理',
      sugar: 'turbo run build',
      scenarios: ['多包共享逻辑（组件库 + 工具库）', '大型前端团队协作', '微前端架构'],
      relations: ['Monorepo ←→ 包管理', 'Monorepo ←→ 构建工具', 'Monorepo ←→ CI/CD'],
      code: `// Turborepo 配置
// turbo.json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": []
    },
    "lint": {
      "outputs": []
    }
  }
}

// 项目结构
my-monorepo/
├── apps/
│   ├── web/          # Next.js 应用
│   └── mobile/       # React Native 应用
├── packages/
│   ├── ui/           # 共享组件库
│   ├── utils/        # 工具函数
│   └── config/       # 共享配置
├── package.json
├── turbo.json
└── pnpm-workspace.yaml

// pnpm-workspace.yaml
packages:
  - 'apps/*'
  - 'packages/*'

// 运行命令
turbo run build --filter=web
turbo run test --filter=ui
turbo run lint

// Nx 配置
// nx.json
{
  "tasksRunnerOptions": {
    "default": {
      "runner": "nx/tasks-runners/default",
      "options": {
        "cacheableOperations": ["build", "test", "lint"]
      }
    }
  }
}`,
    },
    {
      title: '4. Docker 容器化',
      category: '环境管理',
      what: '用容器打包项目环境与依赖，使运行环境一致',
      why: '解决"本地运行正常，线上崩溃"的环境差异问题',
      how: 'Dockerfile 定义镜像；Docker Compose 管理多个容器（前端 + 后端 + DB）',
      sugar: 'docker build',
      scenarios: ['微服务部署', 'CI/CD 环境隔离', '前端 + Nginx 静态资源服务'],
      relations: ['Docker ←→ DevOps', 'Docker ←→ CI/CD', 'Docker ←→ 部署'],
      code: `// Dockerfile（前端静态资源）
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# 生产环境
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

// Dockerfile（Node SSR）
FROM node:20-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["node", "dist/server.js"]

// docker-compose.yml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - API_URL=http://api:8080
    depends_on:
      - api
  
  api:
    image: my-api:latest
    ports:
      - "8080:8080"
  
  db:
    image: postgres:15
    environment:
      POSTGRES_PASSWORD: secret

// 构建和运行
docker build -t my-app .
docker run -p 3000:3000 my-app
docker-compose up -d`,
    },
    {
      title: '5. 模块化开发',
      category: '代码组织',
      what: '将代码按职责拆分为独立模块（ESM/CommonJS）',
      why: '提高可维护性、可复用性',
      how: '现代模块系统：ES Modules (import/export)；构建工具统一打包',
      sugar: 'import/export',
      scenarios: ['大型项目模块拆分', '组件化框架基础', '代码复用'],
      relations: ['模块化 ←→ 打包工具', '模块化 ←→ 组件化', '模块化 ←→ Tree-shaking'],
      code: `// ES Modules
// utils/math.js
export const add = (a, b) => a + b;
export const subtract = (a, b) => a - b;
export default { add, subtract };

// main.js
import { add } from './utils/math.js';
import math from './utils/math.js';

// 动态导入
const module = await import('./utils/math.js');

// CommonJS（Node.js）
// utils/math.js
module.exports = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b
};

// main.js
const { add } = require('./utils/math');

// 模块化项目结构
src/
├── components/      # 组件模块
│   ├── Button/
│   │   ├── index.ts
│   │   ├── Button.tsx
│   │   └── Button.test.tsx
│   └── Input/
├── utils/          # 工具模块
│   ├── format.ts
│   └── validate.ts
├── services/       # 服务模块
│   ├── api.ts
│   └── auth.ts
├── hooks/          # 自定义 Hooks
└── store/          # 状态管理

// 模块导出索引
// components/index.ts
export { Button } from './Button';
export { Input } from './Input';`,
    },
    {
      title: '6. 构建工具体系（打包+编译+优化）',
      category: '构建系统',
      what: '从源码到可运行产物的自动化流程',
      why: '兼容浏览器差异、减少体积、提高加载速度',
      how: '构建：Vite/Webpack/esbuild/Rollup；编译：Babel/SWC/TypeScript；优化：Tree-shaking、Code-splitting、懒加载',
      sugar: 'vite build',
      scenarios: ['前端项目构建', '生产优化', '本地开发热更新'],
      relations: ['构建工具 ←→ 模块化', '构建工具 ←→ 优化', '构建工具 ←→ CI/CD'],
      code: `// Vite 配置
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2015',
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          utils: ['lodash', 'dayjs']
        }
      }
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true
      }
    }
  },
  server: {
    port: 3000,
    proxy: {
      '/api': 'http://localhost:8080'
    }
  }
});

// Webpack 配置
// webpack.config.js
module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js'
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\\\/]node_modules[\\\\/]/,
          name: 'vendors',
          priority: 10
        }
      }
    }
  },
  module: {
    rules: [
      {
        test: /\\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  }
};`,
    },
    {
      title: '7. 代码规范与质量保障',
      category: '质量管理',
      what: '通过统一代码规范与检查工具，确保团队一致性',
      why: '减少差异、提高协作效率、预防潜在错误',
      how: '代码风格：ESLint + Prettier；提交规范：Husky + lint-staged + Commitlint',
      sugar: 'eslint --fix',
      scenarios: ['团队协作', '多人仓库', '提交前自动检测'],
      relations: ['代码规范 ←→ CI', '代码规范 ←→ Git Hooks', '代码规范 ←→ TypeScript'],
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
    'no-unused-vars': 'error'
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

// Husky + lint-staged
// package.json
{
  "scripts": {
    "prepare": "husky install"
  },
  "lint-staged": {
    "*.{ts,tsx,js,jsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,md,css}": [
      "prettier --write"
    ]
  }
}

// .husky/pre-commit
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npx lint-staged

// Commitlint 配置
// commitlint.config.js
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', [
      'feat', 'fix', 'docs', 'style', 
      'refactor', 'test', 'chore'
    ]]
  }
};

// .husky/commit-msg
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npx --no -- commitlint --edit "$1"`,
    },
    {
      title: '8. 环境与配置管理',
      category: '配置管理',
      what: '通过多环境配置文件（.env）控制不同运行模式',
      why: '避免硬编码、支持多环境构建',
      how: '.env.development、.env.production；import.meta.env（Vite）',
      sugar: '.env',
      scenarios: ['环境变量切换（API_BASE_URL）', '构建配置动态调整', '多环境部署'],
      relations: ['环境配置 ←→ 部署', '环境配置 ←→ CI/CD', '环境配置 ←→ 构建工具'],
      code: `// 环境变量文件
// .env.development
VITE_API_URL=http://localhost:8080
VITE_APP_TITLE=My App (Dev)
NODE_ENV=development

// .env.production
VITE_API_URL=https://api.example.com
VITE_APP_TITLE=My App
NODE_ENV=production

// .env.test
VITE_API_URL=http://test-api.example.com
NODE_ENV=test

// 使用环境变量（Vite）
const apiUrl = import.meta.env.VITE_API_URL;
const isDev = import.meta.env.DEV;
const isProd = import.meta.env.PROD;

// 使用环境变量（Webpack/CRA）
const apiUrl = process.env.REACT_APP_API_URL;
const nodeEnv = process.env.NODE_ENV;

// 配置文件
// config/index.ts
const config = {
  development: {
    apiUrl: 'http://localhost:8080',
    debug: true
  },
  production: {
    apiUrl: 'https://api.example.com',
    debug: false
  },
  test: {
    apiUrl: 'http://test-api.example.com',
    debug: true
  }
};

export default config[import.meta.env.MODE];

// package.json
{
  "scripts": {
    "dev": "vite --mode development",
    "build": "vite build --mode production",
    "build:test": "vite build --mode test"
  }
}`,
    },
    {
      title: '9. 依赖管理与版本控制',
      category: '包管理',
      what: '通过包管理器管理依赖版本、缓存和锁定',
      why: '确保不同环境一致性；减少冲突',
      how: '工具：pnpm/npm/yarn；锁文件：package-lock.json/pnpm-lock.yaml',
      sugar: 'pnpm install',
      scenarios: ['Monorepo 项目', 'CI 构建缓存', '依赖版本锁定'],
      relations: ['依赖管理 ←→ Monorepo', '依赖管理 ←→ CI/CD', '依赖管理 ←→ 构建'],
      code: `// package.json
{
  "name": "my-app",
  "version": "1.0.0",
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "vite": "^5.0.0",
    "typescript": "^5.0.0"
  },
  "engines": {
    "node": ">=18.0.0",
    "pnpm": ">=8.0.0"
  }
}

// pnpm 工作区
// pnpm-workspace.yaml
packages:
  - 'apps/*'
  - 'packages/*'

// .npmrc
shamefully-hoist=true
strict-peer-dependencies=false
auto-install-peers=true

// 常用命令
pnpm install              # 安装依赖
pnpm add react            # 添加依赖
pnpm add -D vite          # 添加开发依赖
pnpm update               # 更新依赖
pnpm why react            # 查看依赖原因

// Monorepo 依赖管理
// apps/web/package.json
{
  "dependencies": {
    "@my-org/ui": "workspace:*",
    "@my-org/utils": "workspace:*"
  }
}

// 版本管理（Changesets）
// .changeset/config.json
{
  "changelog": "@changesets/cli/changelog",
  "commit": false,
  "linked": [],
  "access": "public",
  "baseBranch": "main"
}

// 发布流程
pnpm changeset           # 创建变更集
pnpm changeset version   # 更新版本
pnpm changeset publish   # 发布包`,
    },
    {
      title: '10. 脚手架与自动生成',
      category: '开发工具',
      what: '通过命令行生成模板或项目结构',
      why: '统一项目结构，提高开发速度',
      how: '工具：Vue CLI/create-react-app/Vite/Plop.js',
      sugar: 'npm create vite',
      scenarios: ['项目初始化', '模板代码自动生成', '组件脚手架'],
      relations: ['脚手架 ←→ 规范化', '脚手架 ←→ 构建流程', '脚手架 ←→ 模板'],
      code: `// 创建项目
npm create vite@latest my-app -- --template react-ts
npm create next-app@latest
npm create vue@latest

// Plop.js 自动生成
// plopfile.js
module.exports = function (plop) {
  plop.setGenerator('component', {
    description: '创建 React 组件',
    prompts: [{
      type: 'input',
      name: 'name',
      message: '组件名称：'
    }],
    actions: [{
      type: 'add',
      path: 'src/components/{{pascalCase name}}/{{pascalCase name}}.tsx',
      templateFile: 'templates/component.hbs'
    }, {
      type: 'add',
      path: 'src/components/{{pascalCase name}}/index.ts',
      templateFile: 'templates/index.hbs'
    }]
  });
};

// 组件模板
// templates/component.hbs
import React from 'react';

interface {{pascalCase name}}Props {
  // props
}

export const {{pascalCase name}}: React.FC<{{pascalCase name}}Props> = (props) => {
  return (
    <div>
      {{pascalCase name}}
    </div>
  );
};

// 使用
npm run plop component

// 自定义 CLI
// cli.js
#!/usr/bin/env node
const { program } = require('commander');

program
  .command('create <name>')
  .description('创建新组件')
  .action((name) => {
    // 生成代码逻辑
  });

program.parse();`,
    },
    {
      title: '11. 持续监控与分析（性能+错误）',
      category: '监控反馈',
      what: '对前端运行时进行性能监控与错误上报',
      why: '发现问题、量化质量、持续优化',
      how: 'Sentry/Datadog/Lighthouse CI；监控指标：FCP、LCP、CLS、JS Error',
      sugar: 'Sentry.captureException',
      scenarios: ['线上异常分析', '性能优化与回归对比', '用户体验监控'],
      relations: ['监控 ←→ CI/CD', '监控 ←→ 部署', '监控 ←→ 性能优化'],
      code: `// Sentry 错误监控
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: 'https://xxx@sentry.io/xxx',
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
  integrations: [
    new Sentry.BrowserTracing(),
    new Sentry.Replay()
  ]
});

// 捕获错误
try {
  // 代码
} catch (error) {
  Sentry.captureException(error);
}

// 性能监控
Sentry.startTransaction({
  name: 'page-load',
  op: 'navigation'
});

// Web Vitals 监控
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric) {
  const body = JSON.stringify(metric);
  navigator.sendBeacon('/analytics', body);
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);

// Lighthouse CI 配置
// lighthouserc.js
module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:3000'],
      numberOfRuns: 3
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.9 }]
      }
    },
    upload: {
      target: 'temporary-public-storage'
    }
  }
};

// 自定义监控
class PerformanceMonitor {
  static trackPageLoad() {
    window.addEventListener('load', () => {
      const perfData = performance.getEntriesByType('navigation')[0];
      this.send({
        type: 'page-load',
        duration: perfData.loadEventEnd - perfData.fetchStart
      });
    });
  }
  
  static send(data) {
    fetch('/api/metrics', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }
}`,
    },
  ];

  const engineeringLayers = [
    { name: '构建层', desc: 'Vite、Webpack', icon: '🔨', value: '产物可上线' },
    { name: '管理层', desc: 'pnpm、Nx、Turborepo', icon: '📦', value: '保证一致性' },
    { name: '规范层', desc: 'ESLint、Husky', icon: '✅', value: '提升协作质量' },
    { name: '部署层', desc: 'CI/CD、Docker', icon: '🚀', value: '高效交付' },
    { name: '监控层', desc: 'Sentry、Lighthouse', icon: '📊', value: '反馈优化' },
  ];

  const engineeringRelations = [
    '模块化 ←→ 构建系统 ←→ 打包优化',
    '依赖管理 ←→ Monorepo ←→ 版本控制',
    '代码规范 ←→ Git Hooks ←→ CI/CD',
    '环境配置 ←→ 构建 ←→ 部署',
    'CI/CD ←→ 自动化部署 ←→ 监控反馈',
  ];

  const deprecatedTools = [
    { name: 'Gulp / Grunt', status: '⚠️ 基本被取代', reason: '手动任务流，难以维护，被打包工具取代' },
    { name: 'Bower', status: '❌ 废弃', reason: '被 npm/yarn 替代' },
    { name: 'JSPM / RequireJS', status: '⚠️ 过时', reason: '不兼容现代 ESM' },
    { name: 'Webpack 4 及旧版', status: '⚠️ 建议升级', reason: 'Vite/Webpack 5 体积与速度落后' },
    { name: 'FTP 手动部署', status: '❌ 废弃', reason: '无版本控制、安全性差' },
    { name: 'Travis CI', status: '⚠️ 使用减少', reason: '社区转向 GitHub Actions/GitLab CI' },
  ];

  const resources = [
    { name: 'Vite 官方文档', url: 'https://vitejs.dev/', description: '下一代前端构建工具' },
    { name: 'Turborepo', url: 'https://turbo.build/', description: 'Monorepo 构建系统' },
    { name: 'GitHub Actions', url: 'https://docs.github.com/actions', description: 'CI/CD 自动化平台' },
    { name: 'Docker 文档', url: 'https://docs.docker.com/', description: '容器化平台' },
    { name: 'Sentry', url: 'https://sentry.io/', description: '错误监控与性能追踪' },
    { name: 'pnpm', url: 'https://pnpm.io/', description: '快速、节省磁盘空间的包管理器' },
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
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg mb-4">
            <Settings className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-gray-800">
            前端工程化
          </h1>
          <p className="text-gray-600">
            从"写页面"到"构建产品"，掌握自动化、模块化、规范化的完整工程体系
          </p>
        </div>

        {/* 工程化体系总览 */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-800">工程化体系总览</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {engineeringLayers.map((layer, index) => (
              <div key={index} className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 border border-gray-200">
                <div className="text-3xl mb-2">{layer.icon}</div>
                <div className="font-semibold text-gray-800 mb-1">{layer.name}</div>
                <div className="text-sm text-gray-600 mb-2">{layer.desc}</div>
                <div className="text-xs text-blue-600 font-medium">{layer.value}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* 工程化关系图谱 */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm mb-6">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-6 h-6 text-green-600" />
            <h2 className="text-2xl font-bold text-gray-800">工程化关系图谱</h2>
          </div>
          <div className="space-y-2">
            {engineeringRelations.map((relation, index) => (
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
              💡 建议：从构建工具和模块化开始，逐步建立完整的 CI/CD 流程和监控体系
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
