'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Clipboard, Users, Target, Calendar, BarChart, CheckCircle, Lightbulb, Settings } from 'lucide-react';
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

export default function ProjectManagementPage() {
  const router = useRouter();
  const [hoveredModule, setHoveredModule] = useState<string | null>(null);

  const modules: LevelModule[] = [
    {
      id: 'basics',
      name: '项目管理基础',
      icon: Target,
      color: 'text-green-600',
      bgGradient: 'from-green-400 via-emerald-500 to-teal-600',
      description: '掌握项目管理核心概念和基础方法论',
      duration: '2-3 个月',
      difficulty: '入门级',
      topics: 8,
      highlights: [
        '项目管理概念',
        '项目生命周期',
        '需求分析方法',
        '时间管理技巧',
        '风险识别评估',
        '团队沟通协作'
      ],
      path: '/study/learn-coding-2/project-management/basics'
    },
    {
      id: 'agile',
      name: '敏捷项目管理',
      icon: CheckCircle,
      color: 'text-blue-600',
      bgGradient: 'from-blue-400 via-indigo-500 to-purple-600',
      description: '深入学习敏捷开发和Scrum框架',
      duration: '3-4 个月',
      difficulty: '进阶级',
      topics: 10,
      highlights: [
        'Scrum框架',
        '敏捷开发流程',
        'Sprint规划',
        '用户故事编写',
        '回顾会议',
        '持续改进'
      ],
      path: '/study/learn-coding-2/project-management/agile'
    },
    {
      id: 'advanced',
      name: '高级项目管理',
      icon: BarChart,
      color: 'text-purple-600',
      bgGradient: 'from-purple-400 via-pink-500 to-red-500',
      description: '掌握复杂项目管理和领导力技能',
      duration: '4-6 个月',
      difficulty: '专家级',
      topics: 12,
      highlights: [
        '多项目管理',
        '项目组合管理',
        '变更管理',
        '干系人管理',
        '领导力发展',
        '战略规划'
      ],
      path: '/study/learn-coding-2/project-management/advanced'
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
            <Clipboard className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-responsive-title font-bold text-gray-800 mb-3">
            项目管理
          </h1>
          <p className="text-responsive-body text-gray-600 max-w-2xl mx-auto">
            从基础到专家的完整项目管理学习路径 · 敏捷开发 · 团队协作 · 领导力
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
                      {module.highlights.map((highlight, idx) => (
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

        {/* 项目管理工具 */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">常用项目管理工具</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Calendar,
                name: 'Jira',
                desc: '敏捷项目管理',
                color: 'from-blue-500 to-indigo-500'
              },
              {
                icon: Users,
                name: 'Trello',
                desc: '看板式管理',
                color: 'from-green-500 to-teal-500'
              },
              {
                icon: Settings,
                name: 'Asana',
                desc: '团队协作平台',
                color: 'from-purple-500 to-pink-500'
              },
              {
                icon: Lightbulb,
                name: 'Notion',
                desc: '全能工作空间',
                color: 'from-orange-500 to-red-500'
              }
            ].map((tool, idx) => (
              <Card key={idx} className="p-4 text-center hover:shadow-lg transition-all duration-300">
                <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-r ${tool.color} flex items-center justify-center`}>
                  <tool.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-gray-800 mb-1">{tool.name}</h3>
                <p className="text-sm text-gray-600">{tool.desc}</p>
              </Card>
            ))}
          </div>
        </Card>

        {/* 底部提示 */}
        <div className="text-center">
          <Card className="inline-block p-4 bg-gradient-to-r from-white/80 to-orange-50/80 backdrop-blur-sm border border-orange-200/50">
            <p className="text-sm text-gray-700">
              📋 项目管理技能：技术 + 管理 + 沟通 = 优秀的项目经理
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}