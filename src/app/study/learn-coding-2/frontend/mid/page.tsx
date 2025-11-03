'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Zap, ChevronRight, BookOpen, Code, Target, Layers, Cpu, Database } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface Topic {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: 'medium' | 'hard';
  keyPoints: string[];
  projects: string[];
  tools: string[];
  slug: string;
}

export default function FrontendMidPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>('roadmap');

  const topics: Topic[] = [
    {
      id: '1',
      title: 'React 框架基础',
      description: '掌握 React 组件化开发和现代前端架构',
      duration: '3-4 周',
      difficulty: 'medium',
      keyPoints: [
        'JSX 语法和组件',
        'Props 和 State',
        '生命周期方法',
        'Hooks 使用',
        '事件处理机制'
      ],
      projects: [
        'Todo 应用',
        '天气查询应用',
        '博客系统前端'
      ],
      tools: ['Create React App', 'React DevTools', 'Babel'],
      slug: 'react-basics'
    },
    {
      id: '2',
      title: 'Vue.js 开发',
      description: '学习 Vue.js 渐进式框架和生态系统',
      duration: '3-4 周',
      difficulty: 'medium',
      keyPoints: [
        'Vue 实例和模板',
        '组件通信',
        '指令系统',
        'Composition API',
        '路由管理'
      ],
      projects: [
        '电商购物车',
        '音乐播放器',
        '管理后台界面'
      ],
      tools: ['Vue CLI', 'Vue DevTools', 'Vite'],
      slug: 'vue-development'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container-responsive py-6">
        {/* 头部导航 */}
        <div className="mb-6">
          <Link href="/study/learn-coding-2/frontend">
            <Button variant="outline" size="sm" className="btn-responsive">
              <ArrowLeft className="mr-2 icon-responsive-sm" />
              <span className="hidden xs:inline">返回前端开发</span>
              <span className="xs:hidden">返回</span>
            </Button>
          </Link>
        </div>

        {/* 页面标题 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg mb-4">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-responsive-title font-bold text-gray-800 mb-3">
            中级前端开发
          </h1>
          <p className="text-responsive-body text-gray-600 max-w-2xl mx-auto">
            深入现代前端框架 · 掌握 React/Vue、TypeScript、工程化
          </p>
        </div>

        {/* 标签页导航 */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-white/80 backdrop-blur-sm rounded-lg p-1 shadow-sm">
            <button
              onClick={() => setActiveTab('roadmap')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === 'roadmap'
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <BookOpen className="w-4 h-4 mr-2 inline" />
              学习路线
            </button>
            <button
              onClick={() => setActiveTab('frameworks')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === 'frameworks'
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Layers className="w-4 h-4 mr-2 inline" />
              框架对比
            </button>
            <button
              onClick={() => setActiveTab('projects')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === 'projects'
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Code className="w-4 h-4 mr-2 inline" />
              实战项目
            </button>
          </div>
        </div>

        {/* 学习路线内容 */}
        {activeTab === 'roadmap' && (
          <div className="space-y-8">
            {/* 核心技术栈 */}
            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">核心技术栈</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    icon: Layers,
                    title: 'React/Vue',
                    desc: '现代前端框架',
                    color: 'from-blue-500 to-cyan-500'
                  },
                  {
                    icon: Code,
                    title: 'TypeScript',
                    desc: '类型安全开发',
                    color: 'from-indigo-500 to-purple-500'
                  },
                  {
                    icon: Database,
                    title: '状态管理',
                    desc: 'Redux/Vuex/Zustand',
                    color: 'from-purple-500 to-pink-500'
                  },
                  {
                    icon: Cpu,
                    title: '工程化',
                    desc: 'Webpack/Vite构建',
                    color: 'from-pink-500 to-red-500'
                  }
                ].map((tech, idx) => (
                  <Card key={idx} className="p-4 text-center hover:shadow-lg transition-all duration-300">
                    <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-r ${tech.color} flex items-center justify-center`}>
                      <tech.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-800 mb-1">{tech.title}</h3>
                    <p className="text-sm text-gray-600">{tech.desc}</p>
                  </Card>
                ))}
              </div>
            </Card>

            {/* 学习主题 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {topics.map((topic, index) => (
                <Card
                  key={topic.id}
                  className="group p-6 cursor-pointer hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm"
                  onClick={() => router.push(`/study/learn-coding-2/frontend/mid/${topic.slug}`)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-bold flex items-center justify-center">
                        {index + 1}
                      </div>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                        进阶
                      </span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                  </div>

                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                      {topic.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      {topic.description}
                    </p>
                    <div className="text-xs text-gray-500 flex items-center gap-2">
                      <Target className="w-3 h-3" />
                      {topic.duration}
                    </div>
                  </div>

                  <div className="space-y-1">
                    {topic.keyPoints.slice(0, 3).map((point, i) => (
                      <div key={i} className="text-xs text-gray-600 flex items-center gap-2">
                        <div className="w-1 h-1 bg-blue-500 rounded-full flex-shrink-0" />
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* 框架对比内容 */}
        {activeTab === 'frameworks' && (
          <Card className="p-6 bg-white/80 backdrop-blur-sm">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">React vs Vue 对比</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
                    <Code className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">React</h3>
                </div>
                <div className="space-y-3">
                  <div className="text-sm">
                    <h4 className="font-semibold text-gray-700 mb-1">优势：</h4>
                    <ul className="space-y-1 text-gray-600">
                      <li>• 生态系统丰富</li>
                      <li>• 就业机会多</li>
                      <li>• 灵活性高</li>
                      <li>• 社区活跃</li>
                    </ul>
                  </div>
                  <div className="text-sm">
                    <h4 className="font-semibold text-gray-700 mb-1">适合场景：</h4>
                    <p className="text-gray-600">大型应用、复杂交互、团队协作</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center">
                    <Layers className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Vue.js</h3>
                </div>
                <div className="space-y-3">
                  <div className="text-sm">
                    <h4 className="font-semibold text-gray-700 mb-1">优势：</h4>
                    <ul className="space-y-1 text-gray-600">
                      <li>• 学习曲线平缓</li>
                      <li>• 文档详细</li>
                      <li>• 渐进式框架</li>
                      <li>• 开发效率高</li>
                    </ul>
                  </div>
                  <div className="text-sm">
                    <h4 className="font-semibold text-gray-700 mb-1">适合场景：</h4>
                    <p className="text-gray-600">中小型项目、快速开发、个人项目</p>
                  </div>
                </div>
              </Card>
            </div>
          </Card>
        )}

        {/* 实战项目内容 */}
        {activeTab === 'projects' && (
          <Card className="p-6 bg-white/80 backdrop-blur-sm">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">中级实战项目</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: '社交媒体应用',
                  description: '包含用户认证、发布动态、点赞评论等功能',
                  tech: ['React/Vue', 'Redux/Vuex', 'API集成'],
                  difficulty: '中等',
                  time: '4-6 周'
                },
                {
                  title: '电商管理系统',
                  description: '商品管理、订单处理、数据可视化',
                  tech: ['TypeScript', '状态管理', '图表库'],
                  difficulty: '较难',
                  time: '6-8 周'
                },
                {
                  title: '在线协作工具',
                  description: '实时编辑、多人协作、文件管理',
                  tech: ['WebSocket', '实时通信', '文件上传'],
                  difficulty: '较难',
                  time: '8-10 周'
                }
              ].map((project, idx) => (
                <Card key={idx} className="p-4 bg-gradient-to-br from-white to-blue-50 border border-blue-200">
                  <h3 className="font-bold text-gray-800 mb-2">{project.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{project.description}</p>
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-1">
                      {project.tech.map((tech, i) => (
                        <span key={i} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                          {tech}
                        </span>
                      ))}
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>难度: {project.difficulty}</span>
                      <span>时长: {project.time}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        )}

        {/* 底部提示 */}
        <div className="mt-8 text-center">
          <Card className="inline-block p-4 bg-gradient-to-r from-white/80 to-blue-50/80 backdrop-blur-sm border border-blue-200/50">
            <p className="text-sm text-gray-700">
              🚀 建议学习节奏：每天 3-4 小时，4-6 个月掌握中级前端技能
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}