'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Binary, Sparkles, Zap, Crown, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

interface Skill {
  title: string;
  items: string[];
  slug: string;
}

interface Level {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  skills: Skill[];
  tools: string[];
  practices: string[];
}

export default function AlgorithmPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeLevel, setActiveLevel] = useState<string>('junior');

  useEffect(() => {
    const level = searchParams.get('level');
    if (level && ['junior', 'mid', 'senior'].includes(level)) {
      setActiveLevel(level);
    }
  }, [searchParams]);

  const toolUrls: Record<string, string> = {
    // 初级工具
    'LeetCode': 'https://leetcode.com/',
    'VisuAlgo': 'https://visualgo.net/',
    'Big-O Cheat Sheet': 'https://www.bigocheatsheet.com/',
    // 中级工具
    'HackerRank': 'https://www.hackerrank.com/',
    'GeeksforGeeks': 'https://www.geeksforgeeks.org/',
    'Princeton Algorithms': 'https://algs4.cs.princeton.edu/',
    // 高级工具
    'Codeforces': 'https://codeforces.com/',
    'AtCoder': 'https://atcoder.jp/',
    'TopCoder': 'https://www.topcoder.com/',
    'CP-Algorithms': 'https://cp-algorithms.com/',
    'Google Benchmark': 'https://github.com/google/benchmark',
  };

  const handleToolClick = (tool: string) => {
    const url = toolUrls[tool] || 'https://www.google.com/search?q=' + encodeURIComponent(tool);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handlePracticeClick = (practice: string) => {
    const url = 'https://www.google.com/search?q=' + encodeURIComponent(practice + ' 算法');
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const levels: Level[] = [
    {
      id: 'junior',
      name: '初级（基础算法与数据结构）',
      icon: Sparkles,
      color: 'text-green-600',
      bgColor: 'from-green-500 to-emerald-500',
      skills: [
        {
          title: '基础数据结构',
          items: ['数组（Array）', '链表（Linked List）', '栈（Stack）', '队列（Queue）', '哈希表基础'],
          slug: 'basic-data-structures',
        },
        {
          title: '基础排序算法',
          items: ['冒泡排序', '选择排序', '插入排序', '排序算法比较', '稳定性分析'],
          slug: 'basic-sorting',
        },
        {
          title: '查找算法',
          items: ['线性查找', '二分查找', '查找算法复杂度', '边界条件处理'],
          slug: 'search-algorithms',
        },
        {
          title: '时间复杂度分析',
          items: ['Big O 表示法', '时间复杂度计算', '空间复杂度', '最好/最坏/平均情况'],
          slug: 'complexity-analysis',
        },
        {
          title: '递归基础',
          items: ['递归原理', '递归与迭代', '递归树', '尾递归优化'],
          slug: 'recursion-basics',
        },
      ],
      tools: ['LeetCode', 'VisuAlgo', 'Big-O Cheat Sheet'],
      practices: ['LeetCode Easy 题目', '数组操作练习', '链表基础题', '简单排序实现', '二分查找应用'],
    },
    {
      id: 'mid',
      name: '中级（进阶算法与复合结构）',
      icon: Zap,
      color: 'text-blue-600',
      bgColor: 'from-blue-500 to-cyan-500',
      skills: [
        {
          title: '树结构',
          items: ['二叉树遍历', '二叉搜索树（BST）', 'AVL 树', '红黑树', '树的应用'],
          slug: 'tree-structures',
        },
        {
          title: '图论基础',
          items: ['图的表示', '深度优先搜索（DFS）', '广度优先搜索（BFS）', '拓扑排序', '连通性'],
          slug: 'graph-theory',
        },
        {
          title: '堆与优先队列',
          items: ['最小堆', '最大堆', '堆排序', '优先队列应用', '堆的实现'],
          slug: 'heap-priority-queue',
        },
        {
          title: '哈希表进阶',
          items: ['HashMap 实现', '哈希函数设计', '冲突处理', '负载因子', '一致性哈希'],
          slug: 'advanced-hashing',
        },
        {
          title: '高级排序',
          items: ['归并排序', '快速排序', '堆排序', '计数排序', '基数排序'],
          slug: 'advanced-sorting',
        },
        {
          title: '动态规划入门',
          items: ['背包问题', '最长公共子序列', '最长递增子序列', '状态转移方程', 'DP 优化'],
          slug: 'dynamic-programming',
        },
        {
          title: '贪心算法',
          items: ['区间调度', '哈夫曼编码', '最优子结构', '贪心选择性质', '贪心证明'],
          slug: 'greedy-algorithms',
        },
        {
          title: '分治算法',
          items: ['分治思想', '递归树分析', '主定理', '分治应用', '归并与快排'],
          slug: 'divide-conquer',
        },
      ],
      tools: ['HackerRank', 'GeeksforGeeks', 'Princeton Algorithms'],
      practices: ['LeetCode Medium 题目', '树的遍历实现', '图算法应用', 'DP 经典题', '每日一题训练'],
    },
    {
      id: 'senior',
      name: '高级（复杂算法与工程应用）',
      icon: Crown,
      color: 'text-yellow-600',
      bgColor: 'from-yellow-400 to-amber-500',
      skills: [
        {
          title: '高级图算法',
          items: ['Dijkstra 最短路径', 'Floyd-Warshall', 'A* 搜索', '最小生成树（Kruskal/Prim）', '网络流'],
          slug: 'advanced-graph',
        },
        {
          title: '动态规划进阶',
          items: ['状态压缩 DP', '区间 DP', '树形 DP', '数位 DP', 'DP 优化技巧'],
          slug: 'advanced-dp',
        },
        {
          title: '字符串算法',
          items: ['KMP 算法', 'Rabin-Karp', 'Trie 树', '后缀数组', 'AC 自动机'],
          slug: 'string-algorithms',
        },
        {
          title: '高级数据结构',
          items: ['线段树（Segment Tree）', '树状数组（Fenwick Tree）', '并查集（Union-Find）', 'LCA 最近公共祖先', '平衡树'],
          slug: 'advanced-structures',
        },
        {
          title: '数学与数论',
          items: ['快速幂', '矩阵快速幂', '欧拉筛', '扩展欧几里得', '组合数学'],
          slug: 'math-number-theory',
        },
        {
          title: '高级算法范式',
          items: ['回溯算法', '剪枝优化', '位运算技巧', '双指针', '滑动窗口'],
          slug: 'advanced-paradigms',
        },
        {
          title: '算法理论',
          items: ['摊还分析', '随机算法', 'NP 完全问题', '近似算法', '算法复杂度理论'],
          slug: 'algorithm-theory',
        },
        {
          title: '工程实践',
          items: ['算法性能测试', 'Benchmark 工具', '算法优化', '缓存友好', '并行算法'],
          slug: 'engineering-practice',
        },
      ],
      tools: ['Codeforces', 'AtCoder', 'TopCoder', 'CP-Algorithms', 'Google Benchmark'],
      practices: ['LeetCode Hard 题目', '算法竞赛', '复杂数据结构实现', '性能优化', '开源项目贡献'],
    },
  ];

  const currentLevel = levels.find((l) => l.id === activeLevel) || levels[0];
  const Icon = currentLevel.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Link href="/study/learn-coding" passHref>
            <Button variant="outline" size="sm" className="hover:bg-white/80 shadow-sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              返回学习编程
            </Button>
          </Link>
        </div>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl shadow-lg mb-3">
            <Binary className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-gray-900">
            算法与数据结构
          </h1>
          <p className="text-sm text-gray-600">
            从基础到竞赛，系统掌握算法思维与数据结构设计
          </p>
        </div>

        {/* 级别选择器 */}
        <div className="flex justify-center gap-3 mb-8">
          {levels.map((level) => {
            const LevelIcon = level.icon;
            return (
              <Button
                key={level.id}
                variant={activeLevel === level.id ? 'default' : 'outline'}
                onClick={() => {
                  setActiveLevel(level.id);
                  window.history.replaceState(
                    null,
                    '',
                    `/study/learn-coding/algorithm?level=${level.id}`
                  );
                }}
                className={`${activeLevel === level.id
                  ? `bg-gradient-to-r ${level.bgColor} text-white hover:opacity-90`
                  : 'hover:bg-gray-100'
                  }`}
              >
                <LevelIcon className="w-4 h-4 mr-2" />
                {level.name}
              </Button>
            );
          })}
        </div>

        {/* 内容区域 */}
        <div className="space-y-6">
          {/* 核心技能 */}
          <Card className="p-6 bg-white/80 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-4">
              <Icon className={`w-6 h-6 ${currentLevel.color}`} />
              <h2 className="text-2xl font-bold text-gray-800">核心技能</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
              {currentLevel.skills.map((skill, idx) => (
                <Card
                  key={idx}
                  className="group p-4 bg-gradient-to-br from-white to-gray-50 border border-gray-200 hover:shadow-lg hover:border-primary/30 transition-all duration-300 cursor-pointer h-fit"
                  onClick={() => router.push(`/study/learn-coding/algorithm/${activeLevel}/${skill.slug}`)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-gray-800 flex items-center gap-2 group-hover:text-primary transition-colors">
                      <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${currentLevel.bgColor}`} />
                      {skill.title}
                    </h3>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
                  </div>
                  <ul className="space-y-1.5">
                    {skill.items.map((item, i) => (
                      <li
                        key={i}
                        className="text-sm text-gray-600 flex items-start gap-2 hover:text-primary transition-colors cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/study/learn-coding/algorithm/${activeLevel}/${skill.slug}#section-${i + 1}`);
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

          {/* 工具与平台 */}
          <Card className="p-6 bg-white/80 backdrop-blur-sm">
            <h2 className="text-xl font-bold text-gray-800 mb-4">学习平台与工具</h2>
            <div className="flex flex-wrap gap-2">
              {currentLevel.tools.map((tool, idx) => (
                <button
                  key={idx}
                  onClick={() => handleToolClick(tool)}
                  className={`px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r ${currentLevel.bgColor} text-white shadow-sm hover:opacity-90 hover:scale-105 transition-all cursor-pointer`}
                >
                  {tool}
                </button>
              ))}
            </div>
          </Card>

          {/* 实践经验 */}
          <Card className="p-6 bg-white/80 backdrop-blur-sm">
            <h2 className="text-xl font-bold text-gray-800 mb-4">实践项目与刷题建议</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {currentLevel.practices.map((practice, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePracticeClick(practice)}
                  className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 hover:shadow-md transition-all cursor-pointer text-left"
                >
                  <span className={`w-6 h-6 rounded-full bg-gradient-to-r ${currentLevel.bgColor} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                    {idx + 1}
                  </span>
                  <span className="text-sm text-gray-700">{practice}</span>
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* 底部提示 */}
        <div className="mt-8 text-center">
          <Card className="inline-block p-4 bg-gradient-to-r from-white/80 to-blue-50/80 backdrop-blur-sm border border-blue-200/50">
            <p className="text-sm text-gray-700">
              💡 学习路径：初级掌握基础 → 中级系统学习树图DP → 高级研究算法设计与竞赛
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
