'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Code, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Category {
  id: string;
  title: string;
  icon: string;
  description: string;
  color: string;
  path: string;
}

export default function LearnCodingPage() {
  const router = useRouter();

  const categories: Category[] = [
    {
      id: 'frontend',
      title: '前端开发',
      icon: '🎨',
      description: 'HTML、CSS、JavaScript、React、Vue 等前端技术',
      color: 'from-pink-500 to-rose-500',
      path: '/study/learn-coding/frontend',
    },
    {
      id: 'mobile',
      title: '移动端开发',
      icon: '📱',
      description: 'iOS、Android、Flutter、React Native 跨平台开发',
      color: 'from-blue-500 to-cyan-500',
      path: '/study/learn-coding/mobile',
    },
    {
      id: 'backend',
      title: '后端开发',
      icon: '⚙️',
      description: 'Node.js、Java、Python、Go 等后端技术栈',
      color: 'from-green-500 to-emerald-500',
      path: '/study/learn-coding/backend',
    },
    {
      id: 'database',
      title: '数据库',
      icon: '🗄️',
      description: 'MySQL、PostgreSQL、MongoDB、Redis 数据存储',
      color: 'from-orange-500 to-amber-500',
      path: '/study/learn-coding/database',
    },
    {
      id: 'os',
      title: '操作系统',
      icon: '💻',
      description: 'Linux、Windows、网络编程、系统原理',
      color: 'from-purple-500 to-violet-500',
      path: '/study/learn-coding/os',
    },
    {
      id: 'algorithm',
      title: '算法与数据结构',
      icon: '🧮',
      description: '算法基础、数据结构、LeetCode 刷题',
      color: 'from-red-500 to-pink-500',
      path: '/study/learn-coding/algorithm',
    },
    {
      id: 'ai',
      title: '人工智能',
      icon: '🤖',
      description: '机器学习、深度学习、自然语言处理',
      color: 'from-indigo-500 to-blue-500',
      path: '/study/learn-coding/ai',
    },
  ];

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* 返回按钮 */}
        <div className="mb-8">
          <Link href="/study" passHref>
            <Button variant="outline" size="sm" className="hover:bg-white/80 shadow-sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              返回学习
            </Button>
          </Link>
        </div>

        {/* 页面标题 */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg mb-4">
            <Code className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            学习编程
          </h1>
          <p className="text-sm sm:text-base text-gray-600 max-w-xl mx-auto">
            选择你感兴趣的方向，开启编程学习之旅 🚀
          </p>
        </div>

        {/* 分类卡片网格 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-12">
          {categories.map((category, idx) => (
            <Card
              key={category.id}
              className="group relative overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-gray-200 hover:border-transparent bg-white animate-in fade-in slide-in-from-bottom-4"
              style={{ animationDelay: `${idx * 50}ms` }}
              onClick={() => handleNavigate(category.path)}
            >
              {/* 背景渐变效果 */}
              <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
              
              {/* 卡片内容 */}
              <div className="relative p-6">
                {/* 图标和箭头 */}
                <div className="flex items-start justify-between mb-4">
                  <div className={`flex items-center justify-center w-16 h-16 bg-gradient-to-br ${category.color} rounded-2xl shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                    <span className="text-3xl">{category.icon}</span>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1">
                    <ChevronRight className="w-6 h-6 text-gray-400" />
                  </div>
                </div>
                
                {/* 标题 */}
                <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text transition-all duration-300"
                    style={{ 
                      backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))`,
                    }}>
                  {category.title}
                </h3>
                
                {/* 描述 */}
                <p className="text-sm text-gray-600 leading-relaxed">
                  {category.description}
                </p>
              </div>

              {/* 底部渐变条 */}
              <div className={`absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r ${category.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`} />
            </Card>
          ))}
        </div>

        {/* 底部提示 */}
        <div className="text-center">
          <Card className="inline-block p-6 bg-gradient-to-r from-white/80 to-blue-50/80 backdrop-blur-sm border border-blue-200/50 shadow-lg">
            <div className="flex items-center gap-3">
              <span className="text-2xl">💡</span>
              <p className="text-sm text-gray-700 font-medium">
                点击任意分类卡片，查看该方向的详细学习资源
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
