
"use client";

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Rss, Loader2, Sparkles, Link as LinkIcon, Send, ClipboardPaste, Trash2, History, PanelLeft, X } from 'lucide-react';
import { researchTopic, type ResearchTopicOutput } from '@/ai/flows/info-hub-flow';
import { useLocalStorage } from '@/hooks/use-local-storage';
import type { HistoryItem } from '@/lib/types';
import { format, isToday, isYesterday, isWithinInterval, subDays } from 'date-fns';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const translations = {
  'zh-CN': {
    pageTitle: '聚合信息',
    pageSubtitle: '输入话题或粘贴链接，AI 为您生成摘要报告。',
    backButton: '返回休闲驿站',
    inputPlaceholder: '例如：最新的AI技术进展 或 https://...',
    generateButton: '生成报告',
    generating: '正在生成中...',
    summaryTitle: 'AI 生成的摘要',
    sourcesTitle: '信息来源',
    errorTitle: '出错了',
    errorDescription: '生成报告时遇到问题，请稍后重试。',
    initialPrompt: '对什么好奇？让 AI 为您探索。',
    pasteFromClipboard: '从剪贴板粘贴',
    historyTitle: '历史记录',
    clearHistory: '清空历史',
    clearHistoryConfirmTitle: '确定要清空所有历史记录吗？',
    clearHistoryConfirmDesc: '此操作无法撤销。',
    today: '今天',
    yesterday: '昨天',
    previous7Days: '过去7天',
    older: '更早',
    confirm: '确认',
    cancel: '取消',
  },
  'en': {
    pageTitle: 'Info Hub',
    pageSubtitle: 'Enter a topic or paste a link, and the AI will generate a summary report.',
    backButton: 'Back to Rest Stop',
    inputPlaceholder: 'e.g., Latest advancements in AI or https://...',
    generateButton: 'Generate Report',
    generating: 'Generating...',
    summaryTitle: 'AI Generated Summary',
    sourcesTitle: 'Sources',
    errorTitle: 'An Error Occurred',
    errorDescription: 'There was a problem generating the report. Please try again later.',
    initialPrompt: 'What are you curious about? Let the AI explore for you.',
    pasteFromClipboard: 'Paste from Clipboard',
    historyTitle: 'History',
    clearHistory: 'Clear History',
    clearHistoryConfirmTitle: 'Are you sure you want to clear all history?',
    clearHistoryConfirmDesc: 'This action cannot be undone.',
    today: 'Today',
    yesterday: 'Yesterday',
    previous7Days: 'Previous 7 Days',
    older: 'Older',
    confirm: 'Confirm',
    cancel: 'Cancel',
  }
};

type LanguageKey = keyof typeof translations;

export default function InfoHubPage() {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageKey>('en');
  const [topic, setTopic] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeResult, setActiveResult] = useState<HistoryItem | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useLocalStorage<HistoryItem[]>('infoHubHistory_v2', []);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      const browserLang: LanguageKey = navigator.language.toLowerCase().startsWith('zh') ? 'zh-CN' : 'en';
      setCurrentLanguage(browserLang);
    }
    const handleResize = () => {
        if (window.innerWidth < 768) {
            setIsSidebarOpen(false);
        }
    };
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const t = useMemo(() => translations[currentLanguage], [currentLanguage]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!topic.trim() || isLoading) return;

    setIsLoading(true);
    setActiveResult(null);
    setError(null);

    try {
      const response = await researchTopic({ topic });
      const newHistoryItem: HistoryItem = {
        id: Date.now().toString(),
        topic: topic,
        result: response,
        timestamp: new Date().toISOString(),
      };
      setHistory(prev => [newHistoryItem, ...prev]);
      setActiveResult(newHistoryItem);
      setTopic('');
    } catch (err: any) {
      console.error("Error researching topic:", err);
      setError(err.message || t.errorDescription);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handlePasteFromClipboard = useCallback(async () => {
    try {
        if (navigator.clipboard?.readText) {
            const text = await navigator.clipboard.readText();
            if (text) setTopic(text);
        }
    } catch (err) {
        console.error('Failed to read clipboard contents: ', err);
    }
  }, []);
  
  const handleSelectHistory = (item: HistoryItem) => {
    setActiveResult(item);
    setError(null);
    setIsLoading(false);
    if (window.innerWidth < 768) setIsSidebarOpen(false);
  };
  
  const groupedHistory = useMemo(() => {
    const now = new Date();
    const groups: { [key: string]: HistoryItem[] } = {
        [t.today]: [], [t.yesterday]: [], [t.previous7Days]: [], [t.older]: []
    };

    history.forEach(item => {
        const itemDate = new Date(item.timestamp);
        if (isToday(itemDate)) groups[t.today].push(item);
        else if (isYesterday(itemDate)) groups[t.yesterday].push(item);
        else if (isWithinInterval(itemDate, { start: subDays(now, 7), end: now })) groups[t.previous7Days].push(item);
        else groups[t.older].push(item);
    });

    return groups;
  }, [history, t]);

  const MainContent = () => (
    <div className="flex-1 flex flex-col items-center gap-6 p-4 sm:p-8">
        <div className="w-full space-y-3">
            <form onSubmit={handleSubmit} className="w-full flex items-center gap-2">
                <Input 
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder={t.inputPlaceholder}
                    className="flex-grow h-12 text-base"
                    disabled={isLoading}
                />
                <Button type="submit" size="lg" className="h-12 px-5" disabled={isLoading || !topic.trim()}>
                    {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                    <span className="hidden sm:inline">{t.generateButton}</span>
                </Button>
            </form>
            <div className="flex justify-end">
                <Button variant="ghost" size="sm" onClick={handlePasteFromClipboard} className="text-muted-foreground hover:text-primary">
                    <ClipboardPaste className="mr-2 h-4 w-4"/>
                    {t.pasteFromClipboard}
                </Button>
            </div>
        </div>

        <div className="w-full">
            {isLoading && (
                 <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-full py-20 bg-card rounded-xl">
                    <Sparkles className="h-16 w-16 mb-4 text-primary animate-pulse" />
                    <p className="text-lg">{t.generating}</p>
                </div>
            )}
            {error && (
                <Card className="w-full bg-destructive/10 border-destructive/30">
                    <CardHeader><CardTitle className="text-destructive">{t.errorTitle}</CardTitle></CardHeader>
                    <CardContent><p>{error}</p></CardContent>
                </Card>
            )}

            {!isLoading && !activeResult && !error && (
                 <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-full py-20 bg-card/50 rounded-xl border border-dashed">
                    <Rss className="h-16 w-16 mb-4 text-primary/50" />
                    <p className="max-w-xs text-lg">{t.initialPrompt}</p>
                </div>
            )}

            {activeResult && !isLoading && !error && (
                <div className="space-y-6 animate-in fade-in-50">
                    {activeResult.result.metadata?.title && (
                        <h2 className="text-2xl font-semibold text-primary">{activeResult.result.metadata.title}</h2>
                    )}
                    <Card>
                        <CardHeader><CardTitle>{t.summaryTitle}</CardTitle></CardHeader>
                        <CardContent className="prose prose-sm dark:prose-invert max-w-none leading-relaxed">
                            {activeResult.result.summary.split('\n').map((line, i) => <p key={i} className="my-2">{line}</p>)}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader><CardTitle>{t.sourcesTitle}</CardTitle></CardHeader>
                        <CardContent>
                            <ul className="space-y-3">
                                {activeResult.result.sources.map((source, index) => (
                                    <li key={index} className="text-sm">
                                        <a href={source.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary hover:underline underline-offset-4 break-all">
                                           <LinkIcon className="h-4 w-4 shrink-0"/>
                                           <span className='truncate' title={source.title}>{source.title}</span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="w-full py-4 px-4 sm:px-8 flex justify-between items-center border-b">
        <Link href="/rest" passHref>
            <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t.backButton}
            </Button>
        </Link>
        <h1 className="text-xl sm:text-2xl font-headline font-semibold text-primary hidden sm:block">
            {t.pageTitle}
        </h1>
        <Button variant="ghost" size="icon" className="sm:hidden" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <History className="h-5 w-5" />
        </Button>
      </header>
      
      <div className="flex flex-1 overflow-hidden">
        <aside className={cn(
            "flex-col w-full md:w-80 border-r bg-card/50 overflow-y-auto transition-transform duration-300 ease-in-out md:flex",
            isSidebarOpen ? "translate-x-0" : "-translate-x-full",
            "absolute md:relative z-10 md:z-0 h-full"
        )}>
            <div className="p-4 border-b flex justify-between items-center">
                <h2 className="text-lg font-semibold flex items-center gap-2"><History className="h-5 w-5"/>{t.historyTitle}</h2>
                <div className="flex items-center">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8" disabled={history.length === 0}><Trash2 className="h-4 w-4"/></Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>{t.clearHistoryConfirmTitle}</AlertDialogTitle>
                          <AlertDialogDescription>{t.clearHistoryConfirmDesc}</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
                          <AlertDialogAction onClick={() => setHistory([])}>{t.confirm}</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    <Button variant="ghost" size="icon" className="h-8 w-8 md:hidden" onClick={() => setIsSidebarOpen(false)}><X className="h-4 w-4"/></Button>
                </div>
            </div>
            <ScrollArea className="flex-1">
                <div className="p-2">
                {Object.entries(groupedHistory).map(([groupName, items]) => (
                    items.length > 0 && (
                        <div key={groupName} className="mb-4">
                            <h3 className="text-sm font-semibold text-muted-foreground px-2 py-1">{groupName}</h3>
                            <ul className="space-y-1">
                                {items.map(item => (
                                    <li key={item.id}>
                                        <button 
                                            onClick={() => handleSelectHistory(item)}
                                            className={cn(
                                                "w-full text-left p-2 rounded-md text-sm truncate",
                                                activeResult?.id === item.id ? "bg-primary/20 text-primary-foreground" : "hover:bg-accent"
                                            )}
                                            title={item.topic}
                                        >
                                           {item.result.metadata?.title || item.topic}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )
                ))}
                </div>
            </ScrollArea>
        </aside>
        
        <main className="flex-1 overflow-y-auto">
            <MainContent />
        </main>
      </div>
    </div>
  );
}
