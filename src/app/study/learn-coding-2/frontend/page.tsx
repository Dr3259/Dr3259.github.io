'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Palette, Sparkles, Zap, Crown, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface LevelModule {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  bgGradient: string;
  description: string;
  duration: string;
  difficulty: string;
  topics: number;
  highlights: string[];
  path: string;
}

export default function FrontendPage() {
  const router = useRouter();
  const [hoveredModule, setHoveredModule] = useState<string | null>(null);

  const modules: LevelModule[] = [
    {
      id: 'junior',
      name: '初级',
      icon: Sparkles,
      color: 'text-green-600',
      bgGradient: 'from-green-400 via-emerald-500 to-teal-600',
      description: '掌握前端开发基础，从零开始构建网页',
      duration: '3-4 个月',
      difficulty: '入门级',
      topics: 8,
      highlights: [
        'HTML5 语义化标签',
        'CSS3 样式与布局',
        'JavaScript 基础语法',
        'DOM 操作与事件',
        '响应式设计',
        'Git 版本控制',
        '开发工具使用',
        '项目实战练习'
      ],
      path: '/study/learn-coding-2/frontend/junior'
    },
    {
      id: 'mid',
      name: '中级',
      icon: Zap,
      color: 'text-blue-600',
      bgGradient: 'from-blue-400 via-indigo-500 to-purple-600',
      description: '深入现代前端框架，构建复杂应用',
      duration: '4-6 个月',
      difficulty: '进阶级',
      topics: 12,
      highlights: [
        'React/Vue 框架',
        'TypeScript 开发',
        '状态管理方案',
        'API 接口调用',
        '前端工程化',
        '性能优化',
        '测试与调试',
        '组件库开发'
      ],
      path: '/study/learn-coding-2/frontend/mid'
    },
    {
      id: 'senior',
      name: '高级',
      icon: Crown,
      color: 'text-purple-600',
      bgGradient: 'from-purple-400 via-pink-500 to-red-500',
      description: '掌握前端架构设计，成为技术专家',
      duration: '6-8 个月',
      difficulty: '专家级',
      topics: 15,
      highlights: [
        '微前端架构',
        '跨平台开发',
        '前端安全',
        '性能监控',
        '工程化实践',
        '团队协作',
        '技术选型',
        '架构设计'
      ],
      path: '/study/learn-coding-2/frontend/senior'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container-responsive py-6">
        {/* 头部导航 */}
        <div className="mb-6">
          <Link href="/study/learn-coding-2">
            <Button variant="outline" size="sm" className="btn-responsive">
              <ArrowLeft className="mr-2 icon-responsive-sm" />
              <span className="hidden xs:inline">返回学习编程 2.0</span>
              <span className="xs:hidden">返回</span>
            </Button>
          </Link>
        </div>

        {/* 页面标题 */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-pink-500 rounded-2xl shadow-lg mb-4">
            <Palette className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-responsive-title font-bold text-gray-800 mb-3">
            前端开发
          </h1>
          <p className="text-responsive-body text-gray-600 max-w-2xl mx-auto">
            从基础到专家的完整前端学习路径 · 现代化 · 系统化 · 实战化
          </p>
        </div>

        {/* 学习路径卡片 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {modules.map((module) => {
            const Icon = module.icon;
            const isHovered = hoveredModule === module.id;
            
            return (
              <Card
                key={module.id}
                className={`group relative overflow-hidden cursor-pointer transition-all duration-500 transform hover:scale-105 hover:shadow-2xl ${
                  isHovered ? 'shadow-2xl scale-105' : 'shadow-lg'
                }`}
                onMouseEnter={() => setHoveredModule(module.id)}
                onMouseLeave={() => setHoveredModule(null)}
                onClick={() => router.push(module.path)}
              >
                {/* 背景渐变 */}
                <div className={`absolute inset-0 bg-gradient-to-br ${module.bgGradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                
                {/* 装饰性元素 */}
                <div className="absolute top-4 right-4 opacity-20">
                  <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${module.bgGradient}`} />
                </div>
                <div className="absolute bottom-4 left-4 opacity-10">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${module.bgGradient}`} />
                </div>

                <div className="relative p-8">
                  {/* 图标和标题 */}
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${module.bgGradient} flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-transform duration-300`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <ChevronRight className={`w-6 h-6 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-2 transition-all duration-300`} />
                  </div>

                  {/* 模块信息 */}
                  <div className="mb-6">
                    <h3 className={`text-2xl font-bold mb-2 group-hover:${module.color} transition-colors duration-300`}>
                      {module.name}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                      {module.description}
                    </p>
                    
                    {/* 统计信息 */}
                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                      <span className="flex items-center gap-1">
                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${module.bgGradient}`} />
                        {module.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${module.bgGradient}`} />
                        {module.difficulty}
                      </span>
                      <span className="flex items-center gap-1">
                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${module.bgGradient}`} />
                        {module.topics} 个主题
                      </span>
                    </div>
                  </div>

                  {/* 核心 */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">核心：</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {module.highlights.slice(0, 6).map((highlight, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 text-xs text-gray-600 group-hover:text-gray-700 transition-colors duration-300"
                        >
                          <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${module.bgGradient} flex-shrink-0`} />
                          <span className="truncate">{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>


                </div>
              </Card>
            );
          })}
        </div>



        {/* 底部提示 */}
        <div className="text-center">
          <Card className="inline-block p-4 bg-gradient-to-r from-white/80 to-orange-50/80 backdrop-blur-sm border border-orange-200/50">
            <p className="text-sm text-gray-700">
              🎯 推荐学习时长：每天 2-3 小时，坚持 6-12 个月成为前端专家
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}