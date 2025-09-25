"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardDescription, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Star, TrendingUp, Loader2, GitBranch } from 'lucide-react';
import { type GithubTrendingRepo, type GithubTrendingParams } from '@/ai/flows/github-trending-flow';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


const translations = {
  'zh-CN': {
    pageTitle: 'GitHub 趋势榜',
    pageSubtitle: '洞察开源世界的持久度与潜力股',
    backButton: '返回科技主页',
    language: '语言',
    repository: '项目',
    description: '描述',
    stars: '总 Star 数',
    gainedStars: (timespan: string) => `${timespan}新增`,
    daily: '今日',
    weekly: '本周',
    monthly: '本月',
    loading: '正在加载趋势数据...',
    error: '加载数据失败，请稍后重试。',
    noDescription: '暂无描述',
    viewOnGithub: '在 GitHub 上查看',
  },
  'en': {
    pageTitle: 'GitHub Trending',
    pageSubtitle: 'Insights into open source persistence and potential',
    backButton: 'Back to Tech Home',
    language: 'Language',
    repository: 'Repository',
    description: 'Description',
    stars: 'Total Stars',
    gainedStars: (timespan: string) => `Stars ${timespan}`,
    daily: 'Today',
    weekly: 'This Week',
    monthly: 'This Month',
    loading: 'Loading trending data...',
    error: 'Failed to load data. Please try again later.',
    noDescription: 'No description provided',
    viewOnGithub: 'View on GitHub',
  }
};

type LanguageKey = keyof typeof translations;
type Timespan = GithubTrendingParams['timespan'];

// 模拟数据函数，避免依赖外部API
async function fetchTrendingFromApi(params: GithubTrendingParams): Promise<GithubTrendingRepo[]> {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 返回模拟的GitHub趋势数据
    const mockData: GithubTrendingRepo[] = [
        {
            rank: 1,
            repoName: "microsoft/vscode",
            url: "https://github.com/microsoft/vscode",
            description: "Visual Studio Code - 一个轻量级但功能强大的源代码编辑器",
            language: "TypeScript",
            stars: "162,000",
            starsToday: params.timespan === 'daily' ? "245" : params.timespan === 'weekly' ? "1,234" : "4,567"
        },
        {
            rank: 2,
            repoName: "facebook/react",
            url: "https://github.com/facebook/react",
            description: "用于构建用户界面的 JavaScript 库",
            language: "JavaScript",
            stars: "227,000",
            starsToday: params.timespan === 'daily' ? "189" : params.timespan === 'weekly' ? "987" : "3,456"
        },
        {
            rank: 3,
            repoName: "vercel/next.js",
            url: "https://github.com/vercel/next.js",
            description: "React 框架，用于生产环境",
            language: "JavaScript",
            stars: "125,000",
            starsToday: params.timespan === 'daily' ? "156" : params.timespan === 'weekly' ? "789" : "2,345"
        },
        {
            rank: 4,
            repoName: "tailwindlabs/tailwindcss",
            url: "https://github.com/tailwindlabs/tailwindcss",
            description: "实用优先的 CSS 框架",
            language: "CSS",
            stars: "82,000",
            starsToday: params.timespan === 'daily' ? "134" : params.timespan === 'weekly' ? "678" : "1,890"
        },
        {
            rank: 5,
            repoName: "openai/whisper",
            url: "https://github.com/openai/whisper",
            description: "通过大规模弱监督实现强大的语音识别",
            language: "Python",
            stars: "68,000",
            starsToday: params.timespan === 'daily' ? "123" : params.timespan === 'weekly' ? "567" : "1,678"
        },
        {
            rank: 6,
            repoName: "pytorch/pytorch",
            url: "https://github.com/pytorch/pytorch",
            description: "Python 中的张量和动态神经网络",
            language: "Python",
            stars: "81,000",
            starsToday: params.timespan === 'daily' ? "98" : params.timespan === 'weekly' ? "456" : "1,234"
        },
        {
            rank: 7,
            repoName: "rust-lang/rust",
            url: "https://github.com/rust-lang/rust",
            description: "赋能每个人构建可靠高效软件的编程语言",
            language: "Rust",
            stars: "97,000",
            starsToday: params.timespan === 'daily' ? "87" : params.timespan === 'weekly' ? "398" : "1,123"
        },
        {
            rank: 8,
            repoName: "golang/go",
            url: "https://github.com/golang/go",
            description: "Go 编程语言",
            language: "Go",
            stars: "123,000",
            starsToday: params.timespan === 'daily' ? "76" : params.timespan === 'weekly' ? "345" : "987"
        }
    ];
    
    return mockData;
}

// Create a separate component that is a Server Component to perform the fetch.
// This is a common pattern for mixing client and server components.
const TrendingList: React.FC<{ timespan: Timespan, t: any }> = ({ timespan, t }) => {
    const [data, setData] = useState<GithubTrendingRepo[] | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await fetchTrendingFromApi({ timespan });
                setData(result);
            } catch (err: any) {
                setError(err.message || t.error);
                console.error(err);
            }
        };
        fetchData();
    }, [timespan, t.error]);
    
    const renderGainedStarsLabel = () => {
        if (timespan === 'daily') return t.gainedStars(t.daily);
        if (timespan === 'weekly') return t.gainedStars(t.weekly);
        if (timespan === 'monthly') return t.gainedStars(t.monthly);
        return 'Gained';
    }

    if (error) {
        return <div className="text-center text-destructive py-10">{error}</div>;
    }

    if (data === null) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="ml-4 text-muted-foreground">{t.loading}</p>
            </div>
        );
    }
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data.map((repo) => (
          <Card key={repo.rank} className="flex flex-col justify-between hover:shadow-lg transition-shadow duration-300 bg-card/60 backdrop-blur-lg">
             <a href={repo.url} target="_blank" rel="noopener noreferrer" className="flex flex-col h-full">
                <CardHeader>
                    <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                            <CardDescription>#{repo.rank}</CardDescription>
                            <CardTitle className="text-xl hover:text-primary hover:underline underline-offset-2">
                               {repo.repoName}
                            </CardTitle>
                        </div>
                        {repo.language !== 'N/A' && (
                             <div className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-md">{repo.language}</div>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="flex-grow">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        {repo.description || <span className="italic">{t.noDescription}</span>}
                    </p>
                </CardContent>
                <div className="p-6 pt-4 mt-auto">
                   <div className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Star className="h-4 w-4 text-amber-500"/>
                            <span className="font-semibold text-foreground">{repo.stars}</span>
                            <span>{t.stars}</span>
                        </div>
                        <div className="flex items-center gap-2 text-green-600 font-semibold">
                            <TrendingUp className="h-4 w-4"/>
                            <span>{repo.starsToday}</span>
                            <span>{renderGainedStarsLabel()}</span>
                        </div>
                   </div>
                </div>
            </a>
          </Card>
        ))}
      </div>
    );
};


export default function GitHubTrendingPage() {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageKey>('zh-CN');
  const [activeTab, setActiveTab] = useState<Timespan>('daily');

  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      const browserLang: LanguageKey = navigator.language.toLowerCase().startsWith('zh') ? 'zh-CN' : 'en';
      setCurrentLanguage(browserLang);
    }
  }, []);
  
  const t = useMemo(() => translations[currentLanguage], [currentLanguage]);

  const handleTabChange = (value: string) => {
    setActiveTab(value as Timespan);
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground py-8 sm:py-12 px-4 items-center">
      <header className="w-full max-w-5xl mb-6 sm:mb-8 self-center">
        <Link href="/tech" passHref>
            <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t.backButton}
            </Button>
        </Link>
      </header>

      <main className="w-full max-w-5xl flex flex-col items-center gap-8">
        <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-headline font-semibold text-primary mb-1">
            {t.pageTitle}
            </h1>
            <p className="text-muted-foreground">{t.pageSubtitle}</p>
        </div>

        <div className="w-full">
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                <TabsList className="grid w-full grid-cols-3 max-w-sm mx-auto mb-8">
                    <TabsTrigger value="daily">{t.daily}</TabsTrigger>
                    <TabsTrigger value="weekly">{t.weekly}</TabsTrigger>
                    <TabsTrigger value="monthly">{t.monthly}</TabsTrigger>
                </TabsList>
            </Tabs>
            <TrendingList timespan={activeTab} t={t} />
        </div>
      </main>
    </div>
  );
}
