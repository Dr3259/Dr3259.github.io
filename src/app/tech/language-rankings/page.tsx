
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, BarChart3, Loader2, AlertTriangle } from 'lucide-react';
import { scrapeTiobe, type TiobeIndexEntry } from '@/ai/flows/scrape-tiobe-flow';

const translations = {
  'zh-CN': {
    pageTitle: '开发语言排行榜',
    backButton: '返回科技主页',
    loading: '正在从 TIOBE 官网拉取实时数据...',
    error: '加载排行榜失败',
    errorDescription: '无法从 TIOBE 网站获取数据，请稍后再试。这可能是由于网络问题或对方网站结构变更。',
    rank: '排名',
    language: '语言',
    rating: '评级',
    dataSource: '数据来源: TIOBE Index',
  },
  'en': {
    pageTitle: 'Language Rankings',
    backButton: 'Back to Tech Home',
    loading: 'Fetching real-time data from TIOBE...',
    error: 'Failed to Load Rankings',
    errorDescription: 'Could not fetch data from the TIOBE website. Please try again later. This might be due to a network issue or a change in the website structure.',
    rank: 'Rank',
    language: 'Language',
    rating: 'Rating',
    dataSource: 'Data source: TIOBE Index',
  }
};

type LanguageKey = keyof typeof translations;

export default function LanguageRankingsPage() {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageKey>('en');
  const [rankings, setRankings] = useState<TiobeIndexEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      const browserLang: LanguageKey = navigator.language.toLowerCase().startsWith('zh') ? 'zh-CN' : 'en';
      setCurrentLanguage(browserLang);
    }
    
    const fetchRankings = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await scrapeTiobe();
        setRankings(data);
      } catch (e: any) {
        console.error(e);
        setError(e.message || 'An unknown error occurred.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRankings();
  }, []);

  const t = useMemo(() => translations[currentLanguage], [currentLanguage]);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground py-8 sm:py-12 px-4 items-center">
      <header className="w-full max-w-2xl mb-6 sm:mb-8 self-center">
        <Link href="/tech" passHref>
            <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t.backButton}
            </Button>
        </Link>
      </header>

      <main className="w-full max-w-2xl flex flex-col items-center">
        <h1 className="text-3xl sm:text-4xl font-headline font-semibold text-primary mb-2 text-center">
          {t.pageTitle}
        </h1>
        <a href="https://www.tiobe.com/tiobe-index/" target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-primary transition-colors mb-8">
            {t.dataSource}
        </a>
        
        <Card className="w-full shadow-lg">
            <CardHeader>
                <CardTitle className="flex items-center">
                    <BarChart3 className="mr-3 h-5 w-5 text-primary/80" />
                    Top 20 Programming Languages
                </CardTitle>
            </CardHeader>
            <CardContent>
                {isLoading && (
                    <div className="flex flex-col items-center justify-center p-10 text-center">
                        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                        <p className="text-muted-foreground">{t.loading}</p>
                    </div>
                )}
                {error && (
                    <div className="flex flex-col items-center justify-center p-10 text-center text-destructive bg-destructive/10 rounded-lg">
                        <AlertTriangle className="h-10 w-10 mb-4" />
                        <h3 className="text-lg font-semibold">{t.error}</h3>
                        <p className="text-sm mt-2">{t.errorDescription}</p>
                    </div>
                )}
                {!isLoading && !error && (
                     <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[80px] text-center">{t.rank}</TableHead>
                                    <TableHead>{t.language}</TableHead>
                                    <TableHead className="text-right">{t.rating}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {rankings.map((lang) => (
                                <TableRow key={lang.rank}>
                                    <TableCell className="font-medium text-center">{lang.rank}</TableCell>
                                    <TableCell>{lang.language}</TableCell>
                                    <TableCell className="text-right">{lang.rating}</TableCell>
                                </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
