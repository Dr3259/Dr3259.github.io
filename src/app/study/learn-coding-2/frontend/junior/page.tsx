'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, ChevronRight, BookOpen, Code, Target } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface Topic {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: 'easy' | 'medium';
  keyPoints: string[];
  projects: string[];
  tools: string[];
  slug: string;
}

export default function FrontendJuniorPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>('roadmap');

  const topics: Topic[] = [
    {
      id: '1',
      title: 'Html',
      description: '学习现代 HTML5 语义化标签和最佳实践',
      duration: '1-2 周',
      difficulty: 'easy',
      keyPoints: [
        '发展史',
        '设计美学',
        '学习资源',
        '按功能分类',
        '按显示类型分类',
        '按内容模型分类',
        '按使用频率分类',
        '按HTML版本分类',
        '按设计用途分类',
        '学习路线图',
        '使用建议'
      ],
      projects: [
        '个人简历页面',
        '博客文章页面',
        '产品展示页面'
      ],
      tools: ['VS Code', 'Live Server', 'HTML Validator'],
      slug: 'html5-basics'
    },
    {
      id: '2',
      title: 'Css',
      description: '掌握现代 CSS3 样式技术、布局方法和响应式设计',
      duration: '3-4 周',
      difficulty: 'easy',
      keyPoints: [
        'CSS基础语法',
        '选择器详解',
        '盒模型与布局',
        'Flexbox布局',
        'Grid网格布局',
        '响应式设计',
        'CSS3动画',
        '预处理器',
        '最佳实践'
      ],
      projects: [
        '响应式导航栏',
        '卡片布局页面',
        '动画效果展示',
        '响应式作品集',
        '移动端商城页面'
      ],
      tools: ['CSS Grid Generator', 'Flexbox Froggy', 'Can I Use', 'Bootstrap', 'Responsive Design Checker'],
      slug: 'css3-styling'
    },
    {
      id: '3',
      title: 'JavaScript',
      description: '学习 JavaScript 核心语法、编程概念和 DOM 操作',
      duration: '4-5 周',
      difficulty: 'medium',
      keyPoints: [
        'JavaScript基础语法',
        '数据类型与变量',
        '函数与作用域',
        '数组与对象',
        '条件与循环',
        'DOM操作',
        '事件处理',
        '异步编程',
        '错误处理'
      ],
      projects: [
        '计算器应用',
        '待办事项列表',
        '简单游戏开发',
        '交互式表单',
        '图片轮播组件',
        '模态框组件'
      ],
      tools: ['Chrome DevTools', 'Node.js', 'ESLint', 'jQuery (可选)', 'Event Listener', 'Form Validation'],
      slug: 'javascript-basics'
    },
    {
      id: '4',
      title: '开发工具与环境',
      description: '配置高效的前端开发环境',
      duration: '1 周',
      difficulty: 'easy',
      keyPoints: [
        'VS Code配置',
        '浏览器开发者工具',
        'Git版本控制',
        'npm包管理',
        '代码格式化',
        '调试技巧',
        '构建工具',
        '性能优化'
      ],
      projects: [
        '开发环境搭建',
        '代码片段库',
        '自动化工作流'
      ],
      tools: ['VS Code', 'Chrome DevTools', 'npm', 'Prettier', 'ESLint'],
      slug: 'dev-tools'
    },

  ];



  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
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



        {/* 标签页导航 */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <div className="flex bg-white/80 backdrop-blur-sm rounded-lg p-1 shadow-sm w-full max-w-md sm:w-auto">
            <button
              onClick={() => setActiveTab('roadmap')}
              className={`flex-1 sm:flex-none px-2 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'roadmap'
                  ? 'bg-green-500 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 inline" />
              <span className="hidden xs:inline">学习</span>
              <span className="xs:hidden">学</span>
            </button>
            <button
              onClick={() => setActiveTab('projects')}
              className={`flex-1 sm:flex-none px-2 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'projects'
                  ? 'bg-green-500 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Code className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 inline" />
              <span className="hidden xs:inline">项目实战</span>
              <span className="xs:hidden">项目</span>
            </button>
            <button
              onClick={() => setActiveTab('resources')}
              className={`flex-1 sm:flex-none px-2 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'resources'
                  ? 'bg-green-500 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Target className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 inline" />
              <span className="hidden xs:inline">学习资源</span>
              <span className="xs:hidden">资源</span>
            </button>
          </div>
        </div>

        {/* 学习路线内容 */}
        {activeTab === 'roadmap' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {topics.map((topic, index) => (
                <Card
                  key={topic.id}
                  className={`group p-4 sm:p-6 cursor-pointer hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm ${
                    topic.title === 'Html' ? 'sm:col-span-1 md:col-span-2 lg:col-span-2 xl:col-span-1' : ''
                  }`}
                  onClick={() => router.push(`/study/learn-coding-2/frontend/junior/${topic.slug}`)}
                >
                  {/* 顶部信息 */}
                  <div className="flex items-start justify-between mb-3 sm:mb-4">
                    <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs sm:text-sm font-bold flex items-center justify-center flex-shrink-0">
                        {index + 1}
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-gray-800 group-hover:text-green-600 transition-colors">
                        {topic.title}
                      </h3>
                    </div>
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-green-500 group-hover:translate-x-1 transition-all flex-shrink-0" />
                  </div>

                  {/* 主要内容 */}
                  <div className="mb-3 sm:mb-4">
                    <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3 line-clamp-2">
                      {topic.description}
                    </p>
                  </div>

                  {/* 关键点 */}
                  <div>
                    <h4 className="text-xs font-semibold text-gray-700 mb-1 sm:mb-2">核心模块：</h4>
                    <div className="space-y-0.5 sm:space-y-1">
                      {(topic.title === 'Html' ? topic.keyPoints : topic.keyPoints.slice(0, 3)).map((point, i) => (
                        <div key={i} className="text-xs text-gray-600 flex items-start gap-1.5 sm:gap-2">
                          <div className="w-1 h-1 bg-green-500 rounded-full flex-shrink-0 mt-1.5" />
                          {topic.title === 'Html' ? (
                            <Link 
                              href={`/study/learn-coding-2/frontend/junior/${topic.slug}#${encodeURIComponent(point)}`}
                              className="hover:text-green-600 hover:underline transition-colors cursor-pointer leading-tight"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {point}
                            </Link>
                          ) : (
                            <span className="leading-tight">{point}</span>
                          )}
                        </div>
                      ))}
                      {topic.title === 'Html' && (
                        <div className="text-xs text-gray-500 italic mt-1 sm:mt-2 text-center">
                          共 {topic.keyPoints.length} 个学习模块
                        </div>
                      )}
                    </div>
                  </div>


                </Card>
              ))}
            </div>
          </div>
        )}

        {/* 项目实战内容 */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            <Card className="p-6 bg-white/80 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">实战项目列表</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {[
                  {
                    title: '个人作品集网站',
                    description: '展示个人技能和项目的响应式网站',
                    tech: ['HTML5', 'CSS3', 'JavaScript'],
                    difficulty: '中等',
                    time: '2-3 周'
                  },
                  {
                    title: '在线简历生成器',
                    description: '可以在线编辑和生成PDF简历的工具',
                    tech: ['DOM操作', '表单处理', 'CSS布局'],
                    difficulty: '中等',
                    time: '2 周'
                  },
                  {
                    title: '企业官网',
                    description: '包含多个页面的企业展示网站',
                    tech: ['响应式设计', 'CSS动画', 'JavaScript交互'],
                    difficulty: '简单',
                    time: '1-2 周'
                  }
                ].map((project, idx) => (
                  <Card key={idx} className="p-4 bg-gradient-to-br from-white to-green-50 border border-green-200">
                    <h3 className="font-bold text-gray-800 mb-2">{project.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{project.description}</p>
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-1">
                        {project.tech.map((tech, i) => (
                          <span key={i} className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
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
          </div>
        )}

        {/* 学习资源内容 */}
        {activeTab === 'resources' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <Card className="p-6 bg-white/80 backdrop-blur-sm">
                <h3 className="text-xl font-bold text-gray-800 mb-4">推荐教程</h3>
                <div className="space-y-3">
                  {[
                    { name: 'MDN Web Docs', desc: '权威的Web技术文档', url: 'https://developer.mozilla.org/' },
                    { name: 'freeCodeCamp', desc: '免费的编程学习平台', url: 'https://www.freecodecamp.org/' },
                    { name: 'W3Schools', desc: '在线Web技术教程', url: 'https://www.w3schools.com/' }
                  ].map((resource, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div>
                        <h4 className="font-semibold text-gray-800">{resource.name}</h4>
                        <p className="text-sm text-gray-600">{resource.desc}</p>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => window.open(resource.url, '_blank')}
                        className="bg-green-500 hover:bg-green-600"
                      >
                        访问
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6 bg-white/80 backdrop-blur-sm">
                <h3 className="text-xl font-bold text-gray-800 mb-4">开发工具</h3>
                <div className="space-y-3">
                  {[
                    { name: 'Visual Studio Code', desc: '强大的代码编辑器', url: 'https://code.visualstudio.com/' },
                    { name: 'Chrome DevTools', desc: '浏览器开发者工具', url: 'https://developers.google.com/web/tools/chrome-devtools' },
                    { name: 'Figma', desc: '界面设计工具', url: 'https://www.figma.com/' }
                  ].map((tool, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div>
                        <h4 className="font-semibold text-gray-800">{tool.name}</h4>
                        <p className="text-sm text-gray-600">{tool.desc}</p>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => window.open(tool.url, '_blank')}
                        className="bg-green-500 hover:bg-green-600"
                      >
                        下载
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        )}


      </div>
    </div>
  );
}