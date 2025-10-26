'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, BookOpen, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface Platform {
  name: string;
  url: string;
  logo: string;
  color: string;
  description: string;
}

interface Category {
  title: string;
  icon: string;
  platforms: Platform[];
}

export default function KnowledgeBasePage() {
  const categories: Category[] = [
    {
      title: '笔记 & 知识管理',
      icon: '📝',
      platforms: [
        {
          name: 'Notion',
          url: 'https://www.notion.so/login',
          logo: '📝',
          color: 'from-gray-600 to-gray-800',
          description: '全能笔记工具',
        },
        {
          name: '语雀',
          url: 'https://www.yuque.com/login',
          logo: '📚',
          color: 'from-green-500 to-green-700',
          description: '专业云端知识库',
        },
        {
          name: 'Obsidian',
          url: 'https://obsidian.md',
          logo: '💎',
          color: 'from-purple-600 to-purple-800',
          description: '本地优先笔记',
        },
        {
          name: 'Evernote',
          url: 'https://www.evernote.com/Login.action',
          logo: '🐘',
          color: 'from-green-600 to-green-800',
          description: '经典笔记应用',
        },
        {
          name: 'OneNote',
          url: 'https://www.onenote.com',
          logo: '📓',
          color: 'from-purple-500 to-purple-700',
          description: '微软笔记工具',
        },
        {
          name: '印象笔记',
          url: 'https://www.yinxiang.com',
          logo: '🐘',
          color: 'from-teal-600 to-teal-800',
          description: 'Evernote 中国版',
        },
      ],
    },
    {
      title: '在线学习平台',
      icon: '🎓',
      platforms: [
        {
          name: 'Bilibili',
          url: 'https://www.bilibili.com',
          logo: '📺',
          color: 'from-pink-500 to-pink-700',
          description: '视频学习社区',
        },
        {
          name: 'Coursera',
          url: 'https://www.coursera.org',
          logo: '🎓',
          color: 'from-blue-600 to-blue-800',
          description: '全球在线课程',
        },
        {
          name: '中国大学MOOC',
          url: 'https://www.icourse163.org',
          logo: '🏫',
          color: 'from-red-500 to-red-700',
          description: '国内优质课程',
        },
        {
          name: 'Khan Academy',
          url: 'https://www.khanacademy.org',
          logo: '🌳',
          color: 'from-green-600 to-green-800',
          description: '免费教育资源',
        },
        {
          name: '网易云课堂',
          url: 'https://study.163.com',
          logo: '☁️',
          color: 'from-red-600 to-red-800',
          description: '实用技能学习',
        },
        {
          name: '腾讯课堂',
          url: 'https://ke.qq.com',
          logo: '🎯',
          color: 'from-blue-500 to-blue-700',
          description: '在线职业教育',
        },
      ],
    },
    {
      title: '编程 & 技术学习',
      icon: '💻',
      platforms: [
        {
          name: 'GitHub',
          url: 'https://github.com/login',
          logo: '🐙',
          color: 'from-gray-700 to-gray-900',
          description: '代码托管平台',
        },
        {
          name: 'LeetCode',
          url: 'https://leetcode.cn',
          logo: '🔢',
          color: 'from-orange-500 to-orange-700',
          description: '算法刷题平台',
        },
        {
          name: 'Stack Overflow',
          url: 'https://stackoverflow.com',
          logo: '📚',
          color: 'from-orange-600 to-orange-800',
          description: '技术问答社区',
        },
        {
          name: '掘金',
          url: 'https://juejin.cn',
          logo: '⛏️',
          color: 'from-blue-500 to-blue-700',
          description: '技术分享社区',
        },
        {
          name: 'freeCodeCamp',
          url: 'https://www.freecodecamp.org',
          logo: '🔥',
          color: 'from-green-500 to-green-700',
          description: '免费编程学习',
        },
        {
          name: 'Codecademy',
          url: 'https://www.codecademy.com',
          logo: '💻',
          color: 'from-indigo-600 to-indigo-800',
          description: '交互式编程课',
        },
      ],
    },
    {
      title: '文档 & 协作',
      icon: '📄',
      platforms: [
        {
          name: '飞书文档',
          url: 'https://www.feishu.cn',
          logo: '🚀',
          color: 'from-blue-600 to-blue-800',
          description: '团队协作平台',
        },
        {
          name: '腾讯文档',
          url: 'https://docs.qq.com',
          logo: '📝',
          color: 'from-blue-500 to-blue-700',
          description: '在线文档协作',
        },
        {
          name: 'Google Docs',
          url: 'https://docs.google.com',
          logo: '📄',
          color: 'from-blue-600 to-blue-800',
          description: '谷歌在线文档',
        },
        {
          name: '石墨文档',
          url: 'https://shimo.im',
          logo: '📋',
          color: 'from-gray-600 to-gray-800',
          description: '轻量级协作',
        },
      ],
    },
    {
      title: '阅读 & 资讯',
      icon: '📖',
      platforms: [
        {
          name: '知乎',
          url: 'https://www.zhihu.com',
          logo: '🔵',
          color: 'from-blue-600 to-blue-800',
          description: '问答社区',
        },
        {
          name: 'Medium',
          url: 'https://medium.com',
          logo: '📰',
          color: 'from-gray-700 to-gray-900',
          description: '优质文章平台',
        },
        {
          name: '少数派',
          url: 'https://sspai.com',
          logo: '🔺',
          color: 'from-red-600 to-red-800',
          description: '数字生活指南',
        },
        {
          name: '微信读书',
          url: 'https://weread.qq.com',
          logo: '📚',
          color: 'from-green-600 to-green-800',
          description: '电子书阅读',
        },
      ],
    },
  ];

  const handleLogin = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Link href="/study" passHref>
            <Button variant="outline" size="sm" className="hover:bg-white/80">
              <ArrowLeft className="mr-2 h-4 w-4" />
              返回学习
            </Button>
          </Link>
        </div>

        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-xl mb-6 border border-gray-100">
            <BookOpen className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            知识库
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            汇集优质学习和知识管理平台，助力你的学习之旅
          </p>
        </div>

        <div className="space-y-10">
          {categories.map((category, idx) => (
            <section
              key={category.title}
              className="animate-in fade-in slide-in-from-bottom-4 duration-500"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="flex items-center justify-center w-12 h-12 bg-white rounded-xl shadow-md">
                  <span className="text-2xl">{category.icon}</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">{category.title}</h2>
                <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent ml-4" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {category.platforms.map((platform) => (
                  <Card
                    key={platform.name}
                    className="group relative overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-primary/20 bg-white/80 backdrop-blur-sm"
                    onClick={() => handleLogin(platform.url)}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity duration-300" 
                         style={{ 
                           backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))`,
                         }} 
                    />
                    <div className="relative p-5">
                      <div className="flex items-start gap-4">
                        <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-sm group-hover:scale-110 transition-transform duration-300">
                          <span className="text-3xl">{platform.logo}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-800 mb-1 group-hover:text-primary transition-colors">
                            {platform.name}
                          </h3>
                          <p className="text-sm text-gray-500 line-clamp-2">{platform.description}</p>
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-primary/10 hover:text-primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLogin(platform.url);
                          }}
                        >
                          <ExternalLink className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                         style={{
                           backgroundImage: `linear-gradient(to right, ${platform.color.replace('from-', 'var(--').replace('to-', 'var(--')})`,
                         }}
                    />
                  </Card>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Card className="inline-block p-6 bg-white/60 backdrop-blur-sm border-2 border-primary/10">
            <p className="text-sm text-gray-600">
              💡 提示：点击任意卡片即可在新标签页中打开对应平台
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
