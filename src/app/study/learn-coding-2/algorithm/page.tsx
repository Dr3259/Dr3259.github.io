'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Binary, Sparkles, Zap, Crown, ChevronRight, BookOpen, Target, Trophy } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface Topic {
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: string;
  keyPoints: string[];
  slug: string;
}

interface LearningPath {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  description: string;
  topics: Topic[];
  totalTime: string;
  prerequisites: string[];
}

export default function AlgorithmPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>('overview');

  const learningPaths: LearningPath[] = [
    {
      id: 'foundation',
      name: '算法基础',
      icon: Sparkles,
      color: 'text-green-600',
      bgColor: 'from-green-500 to-emerald-500',
      description: '掌握基础数据结构和算法思维',
      totalTime: '4-6 周',
      prerequisites: ['基础编程语言（Java/Python/C++）', '数学基础'],
      topics: [
        {
          title: '时间复杂度与空间复杂度',
          description: '理解算法效率分析的基础概念',
          difficulty: 'easy',
          estimatedTime: '3-5 天',
          keyPoints: ['Big O 表示法', '最好/最坏/平均情况', '空间复杂度分析', '复杂度比较'],
          slug: 'complexity-analysis'
        },
        {
          title: '数组与字符串',
          description: '最基础的数据结构操作',
          difficulty: 'easy',
          estimatedTime: '5-7 天',
          keyPoints: ['数组遍历', '双指针技巧', '字符串处理', '滑动窗口'],
          slug: 'array-string'
        },
        {
          title: '链表',
          description: '动态数据结构的入门',
          difficulty: 'easy',
          estimatedTime: '4-6 天',
          keyPoints: ['单链表操作', '双链表', '链表反转', '快慢指针'],
          slug: 'linked-list'
        },
        {
          title: '栈与队列',
          description: 'LIFO 和 FIFO 数据结构',
          difficulty: 'easy',
          estimatedTime: '3-5 天',
          keyPoints: ['栈的应用', '队列实现', '单调栈', '优先队列'],
          slug: 'stack-queue'
        },
        {
          title: '递归与分治',
          description: '分而治之的算法思想',
          difficulty: 'medium',
          estimatedTime: '5-7 天',
          keyPoints: ['递归原理', '递归树', '分治算法', '主定理'],
          slug: 'recursion-divide'
        }
      ]
    },
    {
      id: 'intermediate',
      name: '进阶算法',
      icon: Zap,
      color: 'text-blue-600',
      bgColor: 'from-blue-500 to-cyan-500',
      description: '深入学习树、图和动态规划',
      totalTime: '6-8 周',
      prerequisites: ['算法基础', '数据结构基础'],
      topics: [
        {
          title: '二叉树',
          description: '树形数据结构的核心',
          difficulty: 'medium',
          estimatedTime: '7-10 天',
          keyPoints: ['树的遍历', '二叉搜索树', '平衡树', '树的构造'],
          slug: 'binary-tree'
        },
        {
          title: '图论基础',
          description: '图的表示和基本算法',
          difficulty: 'medium',
          estimatedTime: '8-12 天',
          keyPoints: ['图的表示', 'DFS/BFS', '拓扑排序', '连通性'],
          slug: 'graph-basics'
        },
        {
          title: '动态规划入门',
          description: '最优化问题的解决方案',
          difficulty: 'medium',
          estimatedTime: '10-14 天',
          keyPoints: ['状态定义', '状态转移', '背包问题', 'LCS/LIS'],
          slug: 'dp-intro'
        },
        {
          title: '贪心算法',
          description: '局部最优到全局最优',
          difficulty: 'medium',
          estimatedTime: '5-7 天',
          keyPoints: ['贪心策略', '区间调度', '最优子结构', '贪心证明'],
          slug: 'greedy'
        },
        {
          title: '排序算法',
          description: '各种排序方法的实现与分析',
          difficulty: 'medium',
          estimatedTime: '6-8 天',
          keyPoints: ['快速排序', '归并排序', '堆排序', '排序应用'],
          slug: 'sorting'
        }
      ]
    },
    {
      id: 'advanced',
      name: '高级算法',
      icon: Crown,
      color: 'text-purple-600',
      bgColor: 'from-purple-500 to-pink-500',
      description: '竞赛级别的算法与数据结构',
      totalTime: '8-12 周',
      prerequisites: ['进阶算法', '数学基础', '编程竞赛经验'],
      topics: [
        {
          title: '高级数据结构',
          description: '线段树、树状数组等高级结构',
          difficulty: 'hard',
          estimatedTime: '10-14 天',
          keyPoints: ['线段树', '树状数组', '并查集', '平衡树'],
          slug: 'advanced-structures'
        },
        {
          title: '图论进阶',
          description: '最短路径、最小生成树、网络流',
          difficulty: 'hard',
          estimatedTime: '12-16 天',
          keyPoints: ['Dijkstra', 'Floyd', 'Kruskal', '网络流'],
          slug: 'advanced-graph'
        },
        {
          title: '动态规划进阶',
          description: '状态压缩、区间DP、树形DP',
          difficulty: 'hard',
          estimatedTime: '14-18 天',
          keyPoints: ['状态压缩', '区间DP', '树形DP', 'DP优化'],
          slug: 'advanced-dp'
        },
        {
          title: '字符串算法',
          description: 'KMP、字典树、后缀数组',
          difficulty: 'hard',
          estimatedTime: '10-14 天',
          keyPoints: ['KMP算法', 'Trie树', '后缀数组', 'AC自动机'],
          slug: 'string-algorithms'
        },
        {
          title: '数学与数论',
          description: '算法竞赛中的数学知识',
          difficulty: 'hard',
          estimatedTime: '8-12 天',
          keyPoints: ['快速幂', '欧拉筛', '扩展欧几里得', '组合数学'],
          slug: 'math-theory'
        }
      ]
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '基础';
      case 'medium': return '进阶';
      case 'hard': return '高级';
      default: return '未知';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-3 sm:p-4 lg:p-6">
      <div className="container-responsive">
        <div className="mb-4 sm:mb-6">
          <Link href="/study/learn-coding-2">
            <Button variant="outline" size="sm" className="text-xs sm:text-sm">
              <ArrowLeft className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">返回学习编程 2.0</span>
              <span className="xs:hidden">返回</span>
            </Button>
          </Link>
        </div>

        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl sm:rounded-2xl shadow-lg mb-3 sm:mb-4">
            <Binary className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>
          <h1 className="text-responsive-title font-bold text-gray-800 mb-2 sm:mb-3 px-4">
            算法与数据结构
          </h1>
          <p className="text-responsive-body lg:text-lg text-gray-600 px-4">
            系统化学习路径 · 从零基础到竞赛水平
          </p>
        </div>

        {/* 标签页导航 */}
        <div className="flex justify-center mb-6 sm:mb-8 px-4">
          <div className="flex bg-white/80 backdrop-blur-sm rounded-lg p-1 shadow-sm w-full max-w-md overflow-x-auto">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex-1 min-w-0 px-3 sm:px-6 py-2 rounded-md text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'overview'
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 inline" />
              <span className="hidden sm:inline">学习路径</span>
              <span className="sm:hidden">路径</span>
            </button>
            <button
              onClick={() => setActiveTab('practice')}
              className={`flex-1 min-w-0 px-3 sm:px-6 py-2 rounded-md text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'practice'
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Target className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 inline" />
              <span className="hidden sm:inline">实战练习</span>
              <span className="sm:hidden">练习</span>
            </button>
            <button
              onClick={() => setActiveTab('competition')}
              className={`flex-1 min-w-0 px-3 sm:px-6 py-2 rounded-md text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'competition'
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Trophy className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 inline" />
              <span className="hidden sm:inline">竞赛准备</span>
              <span className="sm:hidden">竞赛</span>
            </button>
          </div>
        </div>

        {/* 学习路径内容 */}
        {activeTab === 'overview' && (
          <div className="space-y-6 sm:space-y-8 px-4">
            {learningPaths.map((path) => {
              const Icon = path.icon;
              return (
                <Card key={path.id} className="p-4 sm:p-6 bg-white/80 backdrop-blur-sm">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 sm:mb-6">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-r ${path.bgColor} flex items-center justify-center shadow-lg flex-shrink-0`}>
                        <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1">{path.name}</h2>
                        <p className="text-sm sm:text-base text-gray-600 mb-2">{path.description}</p>
                        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500">
                          <span>⏱️ {path.totalTime}</span>
                          <span>📚 {path.topics.length} 个主题</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 前置要求 */}
                  <div className="mb-4 sm:mb-6">
                    <h3 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">前置要求：</h3>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {path.prerequisites.map((prereq, idx) => (
                        <span key={idx} className="px-2 sm:px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                          {prereq}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* 学习主题 */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {path.topics.map((topic, idx) => (
                      <Card
                        key={idx}
                        className="group p-3 sm:p-4 bg-gradient-to-br from-white to-gray-50 border border-gray-200 hover:shadow-lg hover:border-primary/30 transition-all duration-300 cursor-pointer"
                        onClick={() => router.push(`/study/learn-coding-2/algorithm/${path.id}/${topic.slug}`)}
                      >
                        <div className="flex items-start justify-between mb-2 sm:mb-3">
                          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                            <span className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-r ${path.bgColor} text-white text-xs font-bold flex items-center justify-center flex-shrink-0`}>
                              {idx + 1}
                            </span>
                            <span className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium ${getDifficultyColor(topic.difficulty)}`}>
                              {getDifficultyText(topic.difficulty)}
                            </span>
                          </div>
                          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
                        </div>
                        
                        <h3 className="font-semibold text-sm sm:text-base text-gray-800 mb-1 sm:mb-2 group-hover:text-primary transition-colors line-clamp-2">
                          {topic.title}
                        </h3>
                        
                        <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3 line-clamp-2">
                          {topic.description}
                        </p>
                        
                        <div className="text-xs text-gray-500 mb-2 sm:mb-3">
                          ⏱️ {topic.estimatedTime}
                        </div>
                        
                        <div className="space-y-0.5 sm:space-y-1">
                          {/* 在小屏幕显示2个，大屏幕显示3个 */}
                          <div className="block sm:hidden">
                            {topic.keyPoints.slice(0, 2).map((point, i) => (
                              <div key={i} className="text-xs text-gray-600 flex items-start gap-1.5">
                                <span className="w-1 h-1 bg-gray-400 rounded-full mt-1.5 flex-shrink-0"></span>
                                <span className="line-clamp-1">{point}</span>
                              </div>
                            ))}
                            {topic.keyPoints.length > 2 && (
                              <div className="text-xs text-gray-500">
                                +{topic.keyPoints.length - 2} 更多...
                              </div>
                            )}
                          </div>
                          <div className="hidden sm:block">
                            {topic.keyPoints.slice(0, 3).map((point, i) => (
                              <div key={i} className="text-xs text-gray-600 flex items-start gap-1.5">
                                <span className="w-1 h-1 bg-gray-400 rounded-full mt-1.5 flex-shrink-0"></span>
                                <span className="line-clamp-1">{point}</span>
                              </div>
                            ))}
                            {topic.keyPoints.length > 3 && (
                              <div className="text-xs text-gray-500">
                                +{topic.keyPoints.length - 3} 更多...
                              </div>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* 实战练习内容 */}
        {activeTab === 'practice' && (
          <div className="px-4">
            <Card className="p-4 sm:p-6 bg-white/80 backdrop-blur-sm">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">实战练习平台</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {[
                  {
                    name: 'LeetCode',
                    description: '最受欢迎的算法练习平台',
                    features: ['2000+ 题目', '多种语言支持', '讨论区', '模拟面试'],
                    url: 'https://leetcode.com/',
                    color: 'from-orange-500 to-red-500'
                  },
                  {
                    name: 'Codeforces',
                    description: '竞赛编程的顶级平台',
                    features: ['定期比赛', 'Rating 系统', '题目质量高', '社区活跃'],
                    url: 'https://codeforces.com/',
                    color: 'from-blue-500 to-purple-500'
                  },
                  {
                    name: 'AtCoder',
                    description: '日本的高质量竞赛平台',
                    features: ['周赛', '题目分级', '详细题解', '初学者友好'],
                    url: 'https://atcoder.jp/',
                    color: 'from-green-500 to-teal-500'
                  }
                ].map((platform, idx) => (
                  <Card
                    key={idx}
                    className="group p-4 sm:p-6 cursor-pointer hover:shadow-lg transition-all duration-300"
                    onClick={() => window.open(platform.url, '_blank')}
                  >
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-r ${platform.color} flex items-center justify-center mb-3 sm:mb-4`}>
                      <Target className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 group-hover:text-primary transition-colors">
                      {platform.name}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">{platform.description}</p>
                    <ul className="space-y-1.5 sm:space-y-2">
                      {platform.features.map((feature, i) => (
                        <li key={i} className="text-xs sm:text-sm text-gray-600 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0"></span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* 竞赛准备内容 */}
        {activeTab === 'competition' && (
          <div className="px-4">
            <Card className="p-4 sm:p-6 bg-white/80 backdrop-blur-sm">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">竞赛准备指南</h2>
              <div className="space-y-4 sm:space-y-6">
                {[
                  {
                    title: 'ICPC 国际大学生程序设计竞赛',
                    description: '世界上最权威的大学生程序设计竞赛',
                    requirements: ['团队合作', '算法基础扎实', '编程速度快', '心理素质好'],
                    timeline: '每年 9-12 月区域赛，次年 4-6 月世界总决赛'
                  },
                  {
                    title: 'NOI 全国青少年信息学奥林匹克竞赛',
                    description: '中国最高水平的青少年程序设计竞赛',
                    requirements: ['数学基础', '算法思维', '代码实现能力', '竞赛经验'],
                    timeline: '每年 7-8 月举办，需要通过省选'
                  },
                  {
                    title: 'Google Code Jam',
                    description: 'Google 举办的全球编程竞赛',
                    requirements: ['算法能力', '快速解题', '多语言支持', '在线竞赛经验'],
                    timeline: '每年 3-8 月，分多轮进行'
                  }
                ].map((competition, idx) => (
                  <Card key={idx} className="p-4 sm:p-6 bg-gradient-to-br from-white to-gray-50">
                    <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center flex-shrink-0">
                        <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">{competition.title}</h3>
                        <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">{competition.description}</p>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                          <div>
                            <h4 className="font-semibold text-sm sm:text-base text-gray-700 mb-2">能力要求：</h4>
                            <ul className="space-y-1">
                              {competition.requirements.map((req, i) => (
                                <li key={i} className="text-xs sm:text-sm text-gray-600 flex items-start gap-2">
                                  <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-1.5 flex-shrink-0"></span>
                                  <span>{req}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold text-sm sm:text-base text-gray-700 mb-2">时间安排：</h4>
                            <p className="text-xs sm:text-sm text-gray-600">{competition.timeline}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* 底部提示 */}
        <div className="mt-6 sm:mt-8 text-center px-4">
          <Card className="inline-block p-3 sm:p-4 bg-gradient-to-r from-white/80 to-purple-50/80 backdrop-blur-sm border border-purple-200/50 max-w-full">
            <p className="text-xs sm:text-sm text-gray-700">
              🎯 建议学习顺序：算法基础 → 进阶算法 → 高级算法 → 竞赛实战
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}