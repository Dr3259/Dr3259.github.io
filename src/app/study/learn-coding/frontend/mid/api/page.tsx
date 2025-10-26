'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Network, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function APIPage() {
  const router = useRouter();

  const modules = [
    {
      title: 'RESTful API',
      items: [
        '资源（Resource）',
        '表现层（Representation）',
        '状态转移（State Transfer）',
        'HTTP 方法（操作语义）',
        'URI 设计规范',
        'HTTP 状态码',
        '超媒体（HATEOAS）',
        '缓存控制',
        '认证与授权',
        '分页与过滤',
      ],
      slug: 'restful',
    },
    {
      title: 'GraphQL 基础',
      items: [
        'Schema（模式定义）',
        'Query（查询）',
        'Mutation（变更）',
        'Subscription（订阅）',
        'Type System（类型系统）',
        'Resolver（解析器）',
        'Variables（变量）',
        'Directives（指令）',
        'Fragments（片段）',
        'Introspection（自省）',
      ],
      slug: 'graphql',
    },
    {
      title: '错误处理',
      items: [
        'Error（错误对象）',
        'throw（抛出错误）',
        'try / catch / finally',
        'Promise 异常（异步错误）',
        'async / await 错误捕获',
        '全局错误捕获',
        '自定义错误类',
        'HTTP 状态码错误处理',
        '错误重试机制',
        '错误监控与上报',
      ],
      slug: 'error-handling',
    },
    {
      title: 'Token 认证',
      items: [
        'Token 认证基础',
        'JWT（JSON Web Token）',
        'Access Token 与 Refresh Token',
        'Token 存储方案',
        'Token 验证中间件',
        '前端 Token 自动注入',
        'OAuth 2.0 授权流程',
        'Token 安全最佳实践',
        '单点登录（SSO）',
        'OpenID Connect（OIDC）',
      ],
      slug: 'token-auth',
    },
  ];

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

        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl shadow-lg mb-4">
            <Network className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-gray-800">
            网络与 API
          </h1>
          <p className="text-gray-600">
            掌握前端与后端数据交互的核心技术
          </p>
        </div>

        <Card className="p-6 bg-white/80 backdrop-blur-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {modules.map((module, idx) => (
              <Card
                key={idx}
                className="group p-4 bg-gradient-to-br from-white to-gray-50 border border-gray-200 hover:shadow-lg hover:border-primary/30 transition-all duration-300 cursor-pointer"
                onClick={() => router.push(`/study/learn-coding/frontend/mid/api/${module.slug}`)}
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-gray-800 flex items-center gap-2 group-hover:text-primary transition-colors">
                    <span className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500" />
                    {module.title}
                  </h3>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
                </div>
                <ul className="space-y-1.5">
                  {module.items.map((item, i) => (
                    <li
                      key={i}
                      className="text-sm text-gray-600 flex items-start gap-2 hover:text-primary transition-colors cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/study/learn-coding/frontend/mid/api/${module.slug}#section-${i + 1}`);
                      }}
                    >
                      <span className="text-gray-400 flex-shrink-0 mt-0.5">•</span>
                      <span className="flex-1">{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
