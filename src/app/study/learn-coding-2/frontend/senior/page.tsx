'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Crown, ChevronRight, BookOpen, Code, Target, Trophy, Shield, Zap, Layers, Settings, Users, BarChart } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface Topic {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: 'hard' | 'expert';
  keyPoints: string[];
  projects: string[];
  tools: string[];
  slug: string;
}

export default function FrontendSeniorPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>('roadmap');

  const topics: Topic[] = [
    {
      id: '1',
      title: '微前端架构',
      description: '掌握大型应用的微前端架构设计与实现',
      duration: '4-6 周',
      difficulty: 'expert',
      keyPoints: [
        'Module Federation',
        '应用拆分策略',
        '跨应用通信',
        '共享依赖管理',
        '部署和监控'
      ],
      projects: [
        '企业级微前端平台',
        '多团队协作系统',
        '插件化架构设计'
      ],
      tools: ['Webpack 5', 'Single-SPA', 'qiankun', 'Nx'],
      slug: 'micro-frontend'
    },
    {
      id: '2',
      title: '跨平台开发',
      description: '学习 React Native、Electron 等跨平台技术',
      duration: '3-5 周',
      difficulty: 'hard',
      keyPoints: [
        'React Native 开发',
        'Electron 桌面应用',
        'PWA 渐进式应用',
        '原生模块集成',
        '性能优化策略'
      ],
      projects: [
        '跨平台移动应用',
        '桌面端工具软件',
        'PWA 应用开发'
      ],
      tools: ['React Native', 'Electron', 'Capacitor', 'Tauri'],
      slug: 'cross-platform'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-red-50">
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
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-lg mb-4">
            <Crown className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-responsive-title font-bold text-gray-800 mb-3">
            高级前端开发
          </h1>
          <p className="text-responsive-body text-gray-600 max-w-2xl mx-auto">
            掌握前端架构设计 · 微前端、跨平台、性能优化、团队协作
          </p>
        </div>

        {/* 标签页导航 */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-white/80 backdrop-blur-sm rounded-lg p-1 shadow-sm overflow-x-auto">
            <button
              onClick={() => setActiveTab('roadmap')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === 'roadmap'
                  ? 'bg-purple-500 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <BookOpen className="w-4 h-4 mr-2 inline" />
              学习路线
            </button>
            <button
              onClick={() => setActiveTab('architecture')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === 'architecture'
                  ? 'bg-purple-500 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Layers className="w-4 h-4 mr-2 inline" />
              架构设计
            </button>
            <button
              onClick={() => setActiveTab('leadership')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === 'leadership'
                  ? 'bg-purple-500 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Users className="w-4 h-4 mr-2 inline" />
              技术领导
            </button>
            <button
              onClick={() => setActiveTab('projects')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === 'projects'
                  ? 'bg-purple-500 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Code className="w-4 h-4 mr-2 inline" />
              企业项目
            </button>
          </div>
        </div>

        {/* 学习路线内容 */}
        {activeTab === 'roadmap' && (
          <div className="space-y-8">
            {/* 专家技能矩阵 */}
            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">专家技能矩阵</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    icon: Layers,
                    title: '架构设计',
                    desc: '微前端、模块化',
                    color: 'from-purple-500 to-indigo-500',
                    skills: ['微前端', '模块联邦', '架构模式', '设计原则']
                  },
                  {
                    icon: Zap,
                    title: '性能优化',
                    desc: '极致性能体验',
                    color: 'from-indigo-500 to-blue-500',
                    skills: ['性能监控', '代码分割', '缓存策略', '渲染优化']
                  },
                  {
                    icon: Shield,
                    title: '安全防护',
                    desc: '前端安全体系',
                    color: 'from-blue-500 to-cyan-500',
                    skills: ['XSS防护', 'CSRF防护', '内容安全', '权限控制']
                  },
                  {
                    icon: Settings,
                    title: '工程化',
                    desc: '自动化流程',
                    color: 'from-cyan-500 to-teal-500',
                    skills: ['CI/CD', '自动化测试', '代码质量', '部署策略']
                  }
                ].map((skill, idx) => (
                  <Card key={idx} className="p-4 hover:shadow-lg transition-all duration-300 group cursor-pointer">
                    <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-r ${skill.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <skill.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-800 mb-1 text-center">{skill.title}</h3>
                    <p className="text-sm text-gray-600 text-center mb-3">{skill.desc}</p>
                    <div className="space-y-1">
                      {skill.skills.map((item, i) => (
                        <div key={i} className="text-xs text-gray-600 flex items-center gap-2">
                          <div className={`w-1 h-1 rounded-full bg-gradient-to-r ${skill.color}`} />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            </Card>

            {/* 核心学习主题 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {topics.map((topic, index) => (
                <Card
                  key={topic.id}
                  className="group p-6 cursor-pointer hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm"
                  onClick={() => router.push(`/study/learn-coding-2/frontend/senior/${topic.slug}`)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-bold flex items-center justify-center">
                        {index + 1}
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        topic.difficulty === 'expert' 
                          ? 'bg-red-100 text-red-700' 
                          : 'bg-orange-100 text-orange-700'
                      }`}>
                        {topic.difficulty === 'expert' ? '专家级' : '高级'}
                      </span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-purple-500 group-hover:translate-x-1 transition-all" />
                  </div>

                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-purple-600 transition-colors">
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

                  <div className="space-y-1 mb-4">
                    {topic.keyPoints.slice(0, 4).map((point, i) => (
                      <div key={i} className="text-xs text-gray-600 flex items-center gap-2">
                        <div className="w-1 h-1 bg-purple-500 rounded-full flex-shrink-0" />
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Trophy className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-500">{topic.projects.length} 个项目</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Settings className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-500">{topic.tools.length} 个工具</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* 架构设计内容 */}
        {activeTab === 'architecture' && (
          <div className="space-y-6">
            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">前端架构设计原则</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    title: '可扩展性',
                    description: '设计能够随业务增长而扩展的架构',
                    principles: ['模块化设计', '松耦合架构', '插件化系统', '微服务前端']
                  },
                  {
                    title: '可维护性',
                    description: '确保代码易于理解、修改和维护',
                    principles: ['代码规范', '文档完善', '测试覆盖', '重构策略']
                  },
                  {
                    title: '性能优化',
                    description: '构建高性能的用户体验',
                    principles: ['懒加载', '代码分割', '缓存策略', '渲染优化']
                  },
                  {
                    title: '安全性',
                    description: '建立完善的前端安全防护体系',
                    principles: ['输入验证', 'XSS防护', 'CSRF防护', '权限控制']
                  },
                  {
                    title: '可测试性',
                    description: '设计易于测试的代码结构',
                    principles: ['单元测试', '集成测试', 'E2E测试', '测试驱动']
                  },
                  {
                    title: '可监控性',
                    description: '建立完善的监控和错误追踪',
                    principles: ['性能监控', '错误追踪', '用户行为', '业务指标']
                  }
                ].map((principle, idx) => (
                  <Card key={idx} className="p-4 bg-gradient-to-br from-white to-purple-50 border border-purple-200">
                    <h3 className="font-bold text-gray-800 mb-2">{principle.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{principle.description}</p>
                    <div className="space-y-1">
                      {principle.principles.map((item, i) => (
                        <div key={i} className="text-xs text-gray-600 flex items-center gap-2">
                          <div className="w-1 h-1 bg-purple-500 rounded-full flex-shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* 技术领导内容 */}
        {activeTab === 'leadership' && (
          <div className="space-y-6">
            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">技术领导力发展</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    icon: Users,
                    title: '团队管理',
                    skills: ['代码审查', '技术指导', '团队协作', '知识分享'],
                    description: '建立高效的前端团队协作机制'
                  },
                  {
                    icon: BarChart,
                    title: '技术决策',
                    skills: ['技术选型', '架构设计', '性能优化', '风险评估'],
                    description: '做出正确的技术决策和架构选择'
                  },
                  {
                    icon: Target,
                    title: '项目管理',
                    skills: ['需求分析', '进度管理', '质量控制', '风险管控'],
                    description: '确保项目按时按质完成交付'
                  },
                  {
                    icon: Trophy,
                    title: '技术影响力',
                    skills: ['技术分享', '开源贡献', '社区建设', '标准制定'],
                    description: '在技术社区建立影响力和声誉'
                  }
                ].map((area, idx) => (
                  <Card key={idx} className="p-6 bg-gradient-to-br from-white to-purple-50 border border-purple-200">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center">
                        <area.icon className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-800">{area.title}</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">{area.description}</p>
                    <div className="grid grid-cols-2 gap-2">
                      {area.skills.map((skill, i) => (
                        <div key={i} className="text-xs text-gray-600 flex items-center gap-2">
                          <div className="w-1 h-1 bg-purple-500 rounded-full flex-shrink-0" />
                          <span>{skill}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* 企业项目内容 */}
        {activeTab === 'projects' && (
          <Card className="p-6 bg-white/80 backdrop-blur-sm">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">企业级项目实战</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: '大型电商平台前端',
                  description: '支持千万级用户的电商平台前端架构',
                  tech: ['微前端', '性能优化', '监控体系', 'A/B测试'],
                  complexity: '极高',
                  duration: '6-12 个月',
                  team: '10-20 人'
                },
                {
                  title: '企业级管理系统',
                  description: '复杂业务逻辑的企业内部管理平台',
                  tech: ['权限系统', '数据可视化', '工作流', '多租户'],
                  complexity: '高',
                  duration: '4-8 个月',
                  team: '5-10 人'
                },
                {
                  title: '跨平台协作工具',
                  description: '支持多平台的实时协作工具',
                  tech: ['实时通信', '跨平台', '离线同步', '插件系统'],
                  complexity: '高',
                  duration: '6-10 个月',
                  team: '8-15 人'
                },
                {
                  title: '金融交易平台',
                  description: '高并发、高可用的金融交易系统前端',
                  tech: ['实时数据', '安全防护', '性能监控', '容灾备份'],
                  complexity: '极高',
                  duration: '8-15 个月',
                  team: '15-25 人'
                }
              ].map((project, idx) => (
                <Card key={idx} className="p-6 bg-gradient-to-br from-white to-purple-50 border border-purple-200">
                  <h3 className="font-bold text-gray-800 mb-2">{project.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{project.description}</p>
                  
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-xs font-semibold text-gray-700 mb-1">核心技术：</h4>
                      <div className="flex flex-wrap gap-1">
                        {project.tech.map((tech, i) => (
                          <span key={i} className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 text-xs text-gray-600">
                      <div>
                        <span className="font-semibold">复杂度:</span>
                        <br />
                        {project.complexity}
                      </div>
                      <div>
                        <span className="font-semibold">周期:</span>
                        <br />
                        {project.duration}
                      </div>
                      <div>
                        <span className="font-semibold">团队:</span>
                        <br />
                        {project.team}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        )}

        {/* 底部提示 */}
        <div className="mt-8 text-center">
          <Card className="inline-block p-4 bg-gradient-to-r from-white/80 to-purple-50/80 backdrop-blur-sm border border-purple-200/50">
            <p className="text-sm text-gray-700">
              👑 高级前端工程师：技术深度 + 架构思维 + 团队领导 = 技术专家
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}