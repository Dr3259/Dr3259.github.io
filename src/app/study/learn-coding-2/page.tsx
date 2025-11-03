'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Code2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LearnCoding2Page() {
  const router = useRouter();

  const modules = [
    {
      id: 1,
      title: '前端',
      description: 'HTML、CSS、JavaScript、React、Vue',
      icon: '🎨',
      path: '/study/learn-coding-2/frontend'
    },
    {
      id: 2,
      title: '移动端',
      description: 'Android、iOS、Flutter、React Native',
      icon: '📱',
      path: '/study/learn-coding-2/mobile'
    },
    {
      id: 3,
      title: '后端',
      description: 'Java、Python、Node.js、微服务',
      icon: '⚙️',
      path: '/study/learn-coding-2/backend'
    },
    {
      id: 4,
      title: '数据库',
      description: 'MySQL、Redis、MongoDB、SQL优化',
      icon: '💾',
      path: '/study/learn-coding-2/database'
    },
    {
      id: 5,
      title: '操作系统',
      description: 'Linux、进程、内存、网络',
      icon: '🖥️',
      path: '/study/learn-coding-2/os'
    },
    {
      id: 6,
      title: '算法与数据结构',
      description: '排序、搜索、动态规划、图论',
      icon: '🧮',
      path: '/study/learn-coding-2/algorithm'
    },
    {
      id: 7,
      title: '人工智能',
      description: '机器学习、深度学习、LLM应用',
      icon: '🤖',
      path: '/study/learn-coding-2/ai'
    },
    {
      id: 8,
      title: '项目管理',
      description: 'Scrum、敏捷开发、团队协作、产品管理',
      icon: '📋',
      path: '/study/learn-coding-2/project-management'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-3 sm:p-4 lg:p-6">
      <div className="container-responsive max-w-6xl">
        <div className="mb-4 sm:mb-6">
          <Link href="/study">
            <Button variant="outline" size="sm" className="text-xs sm:text-sm">
              <ArrowLeft className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">返回学习</span>
              <span className="xs:hidden">返回</span>
            </Button>
          </Link>
        </div>

        <div className="text-center mb-8 sm:mb-10 lg:mb-12 px-4">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl sm:rounded-2xl shadow-lg mb-3 sm:mb-4">
            <Code2 className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>
          <h1 className="text-responsive-title font-bold text-gray-800 mb-2 sm:mb-3">
            学习编程 2.0
          </h1>
          <p className="text-responsive-body lg:text-lg text-gray-600">
            全新升级的编程学习体验 · 更系统 · 更深入
          </p>
        </div>

        <div className="grid-responsive-cards px-4">
          {modules.map((module) => (
            <Card
              key={module.id}
              className="group cursor-pointer hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm"
              onClick={() => router.push(module.path)}
            >
              <div className="card-padding-responsive">
                <div className="flex items-start justify-between mb-3 sm:mb-4">
                  <div className="text-2xl sm:text-3xl lg:text-4xl">{module.icon}</div>
                  <div className={`w-2 h-2 rounded-full ${module.color}`} />
                </div>
                <h3 className="text-responsive-subtitle font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                  {module.title}
                </h3>
                <p className="text-responsive-body text-gray-600 line-clamp-2">
                  {module.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
