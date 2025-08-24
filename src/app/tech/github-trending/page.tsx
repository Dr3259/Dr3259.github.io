
"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Github, Star, TrendingUp, Loader2 } from 'lucide-react';
import { scrapeGitHubTrending, type GithubTrendingRepo, type GithubTrendingParams } from '@/ai/flows/github-trending-flow';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


const translations = {
  'zh-CN': {
    pageTitle: 'GitHub 趋势榜',
    pageSubtitle: '洞察开源世界的持久度与潜力股',
    backButton: '返回科技主页',
    rank: '排名',
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
  },
  'en': {
    pageTitle: 'GitHub Trending',
    pageSubtitle: 'Insights into open source persistence and potential',
    backButton: 'Back to Tech Home',
    rank: 'Rank',
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
  }
};

type LanguageKey = keyof typeof translations;
type Timespan = GithubTrendingParams['timespan'];

export default function GitHubTrendingPage() {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageKey>('zh-CN');
  const [trendingRepos, setTrendingRepos] = useState<GithubTrendingRepo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Timespan>('daily');

  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      const browserLang: LanguageKey = navigator.language.toLowerCase().startsWith('zh') ? 'zh-CN' : 'en';
      setCurrentLanguage(browserLang);
    }
  }, []);
  
  const t = useMemo(() => translations[currentLanguage], [currentLanguage]);

  const fetchTrendingData = useCallback(async (timespan: Timespan) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await scrapeGitHubTrending({ timespan });
      setTrendingRepos(data);
    } catch (err: any) {
      setError(err.message || t.error);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [t.error]);

  useEffect(() => {
    fetchTrendingData(activeTab);
  }, [activeTab, fetchTrendingData]);

  const handleTabChange = (value: string) => {
    setActiveTab(value as Timespan);
  };
  
  const renderGainedStarsHeader = () => {
    if (activeTab === 'daily') return t.gainedStars(t.daily);
    if (activeTab === 'weekly') return t.gainedStars(t.weekly);
    if (activeTab === 'monthly') return t.gainedStars(t.monthly);
    return 'Gained';
  }

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

        <Card className="w-full shadow-lg">
            <CardHeader>
                <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                    <TabsList className="grid w-full grid-cols-3 max-w-sm mx-auto">
                        <TabsTrigger value="daily">{t.daily}</TabsTrigger>
                        <TabsTrigger value="weekly">{t.weekly}</TabsTrigger>
                        <TabsTrigger value="monthly">{t.monthly}</TabsTrigger>
                    </TabsList>
                </Tabs>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="ml-4 text-muted-foreground">{t.loading}</p>
                    </div>
                ) : error ? (
                    <div className="text-center text-destructive py-10">
                        {error}
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[50px]">#</TableHead>
                                <TableHead>{t.repository}</TableHead>
                                <TableHead className="hidden md:table-cell">{t.description}</TableHead>
                                <TableHead>{t.language}</TableHead>
                                <TableHead className="text-right">{t.stars}</TableHead>
                                <TableHead className="text-right">{renderGainedStarsHeader()}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {trendingRepos.map((repo) => (
                                <TableRow key={repo.rank}>
                                    <TableCell className="font-medium">{repo.rank}</TableCell>
                                    <TableCell className="font-semibold">
                                        <a href={repo.url} target="_blank" rel="noopener noreferrer" className="hover:text-primary hover:underline underline-offset-2">
                                            {repo.repoName}
                                        </a>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell text-muted-foreground text-xs max-w-xs truncate" title={repo.description || t.noDescription}>
                                      {repo.description || <span className="italic">{t.noDescription}</span>}
                                    </TableCell>
                                    <TableCell>{repo.language}</TableCell>
                                    <TableCell className="text-right flex items-center justify-end gap-1">
                                      <Star className="h-3 w-3 text-amber-500"/>
                                      {repo.stars}
                                    </TableCell>
                                    <TableCell className="text-right font-bold text-green-600 flex items-center justify-end gap-1">
                                      <TrendingUp className="h-3 w-3"/>
                                      {repo.starsToday}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
