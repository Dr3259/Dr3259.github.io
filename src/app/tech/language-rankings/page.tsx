
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, BarChart3, TrendingUp, TrendingDown, Minus, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

const translations = {
  'zh-CN': {
    pageTitle: '开发语言排行榜',
    pageSubtitle: '2025 年 8 月',
    backButton: '返回科技主页',
    hotNewsTitle: '热点新闻',
    hotNewsContent: '由于 AI 代码助手（如 Copilot、Gemini Code Assist）在流行语言上的效率提升，大量开发者更倾向学习如 Python 这样的语言，从而进一步巩固了其领先地位。',
    rank: '排名',
    language: '语言',
    rating: '评分',
    change: '变动 (年)',
    dataSource: '数据来源: TIOBE Index',
  },
  'en': {
    pageTitle: 'Language Rankings',
    pageSubtitle: 'August 2025',
    backButton: 'Back to Tech Home',
    hotNewsTitle: 'Hot News',
    hotNewsContent: 'AI code assistants (like Copilot, Gemini Code Assist) are boosting efficiency in popular languages, driving more developers to learn languages like Python and solidifying its top position.',
    rank: 'Rank',
    language: 'Language',
    rating: 'Rating',
    change: 'Change (YoY)',
    dataSource: 'Data source: TIOBE Index',
  }
};

type LanguageKey = keyof typeof translations;

interface RankingData {
  rank: number;
  language: string;
  rating: string;
  change: string;
}

const rankingData: RankingData[] = [
  { rank: 1, language: 'Python', rating: '26.14%', change: '+8.10%' },
  { rank: 2, language: 'C++', rating: '9.18%', change: '–0.86%' },
  { rank: 3, language: 'C', rating: '9.03%', change: '–0.15%' },
  { rank: 4, language: 'Java', rating: '8.59%', change: '–0.58%' },
  { rank: 5, language: 'C#', rating: '5.52%', change: '–0.87%' },
  { rank: 6, language: 'JavaScript', rating: '3.15%', change: '–0.76%' },
  { rank: 7, language: 'Visual Basic', rating: '2.33%', change: '+0.15%' },
  { rank: 8, language: 'Go', rating: '2.11%', change: '+0.08%' },
  { rank: 9, language: 'Perl', rating: '2.08%', change: '+1.17%' },
  { rank: 10, language: 'Delphi/Object Pascal', rating: '1.82%', change: '+0.19%' },
];

const ChangeIndicator: React.FC<{ change: string }> = ({ change }) => {
  if (change.startsWith('+')) {
    return <span className="flex items-center text-green-600"><TrendingUp className="mr-1 h-4 w-4" /> {change}</span>;
  }
  if (change.startsWith('–') || change.startsWith('-')) {
    return <span className="flex items-center text-red-600"><TrendingDown className="mr-1 h-4 w-4" /> {change}</span>;
  }
  return <span className="flex items-center text-muted-foreground"><Minus className="mr-1 h-4 w-4" /> {change}</span>;
};

export default function LanguageRankingsPage() {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageKey>('en');

  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      const browserLang: LanguageKey = navigator.language.toLowerCase().startsWith('zh') ? 'zh-CN' : 'en';
      setCurrentLanguage(browserLang);
    }
  }, []);

  const t = useMemo(() => translations[currentLanguage], [currentLanguage]);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground py-8 sm:py-12 px-4 items-center">
      <header className="w-full max-w-4xl mb-6 sm:mb-8 self-center">
        <Link href="/tech" passHref>
            <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t.backButton}
            </Button>
        </Link>
      </header>

      <main className="w-full max-w-4xl flex flex-col items-center">
        <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-headline font-semibold text-primary mb-1">
            {t.pageTitle}
            </h1>
            <p className="text-muted-foreground">{t.pageSubtitle}</p>
            <a href="https://www.tiobe.com/tiobe-index/" target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-primary transition-colors mt-2 block">
                {t.dataSource}
            </a>
        </div>
        
        <Card className="w-full shadow-lg mb-8">
            <CardHeader>
                <CardTitle className="flex items-center">
                    <Info className="mr-3 h-5 w-5 text-primary/80" />
                    {t.hotNewsTitle}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-foreground/90 leading-relaxed">{t.hotNewsContent}</p>
            </CardContent>
        </Card>
        
        <Card className="w-full shadow-lg">
            <CardHeader>
                <CardTitle className="flex items-center">
                    <BarChart3 className="mr-3 h-5 w-5 text-primary/80" />
                    Top 10 Programming Languages
                </CardTitle>
                <CardDescription>
                  {t.pageSubtitle}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[80px]">{t.rank}</TableHead>
                            <TableHead>{t.language}</TableHead>
                            <TableHead>{t.rating}</TableHead>
                            <TableHead className="text-right">{t.change}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {rankingData.map((item) => (
                            <TableRow key={item.rank}>
                                <TableCell className="font-medium">{item.rank}</TableCell>
                                <TableCell className={cn(item.language === 'Python' && 'font-bold text-primary')}>{item.language}</TableCell>
                                <TableCell>{item.rating}</TableCell>
                                <TableCell className="text-right">
                                    <ChangeIndicator change={item.change} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
