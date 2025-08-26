
"use client";

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ArrowLeft, Rss, Loader2, Sparkles, Link as LinkIcon, Send, ClipboardPaste, Trash2, History, Copy } from 'lucide-react';
import { researchTopic, type ResearchTopicOutput } from '@/ai/flows/info-hub-flow';
import { useLocalStorage } from '@/hooks/use-local-storage';
import type { HistoryItem } from '@/lib/types';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { enUS, zhCN } from 'date-fns/locale';
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
} from "@/components/ui/alert-dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from '@/hooks/use-toast';


const translations = {
  'zh-CN': {
    pageTitle: '聚合信息',
    backButton: '返回休闲驿站',
    inputPlaceholder: '输入话题或粘贴链接...',
    generateButton: '生成摘要',
    generating: 'AI 思考中...',
    summaryTitle: 'AI 生成的摘要',
    sourcesTitle: '信息来源',
    errorTitle: '出错了',
    errorDescription: '生成报告时遇到问题，请稍后重试。',
    initialPrompt: '对什么好奇？让 AI 为您探索。',
    pasteAndSearch: '粘贴并搜索',
    historyTitle: '历史记录',
    clearHistory: '清空历史',
    clearHistoryConfirmTitle: '确定要清空所有历史记录吗？',
    clearHistoryConfirmDesc: '此操作无法撤销。',
    confirm: '确认',
    cancel: '取消',
    copySummary: '复制摘要',
    summaryCopied: '摘要已复制',
  },
  'en': {
    pageTitle: 'Info Hub',
    backButton: 'Back to Rest Stop',
    inputPlaceholder: 'Enter topic or paste link...',
    generateButton: 'Generate Summary',
    generating: 'AI is thinking...',
    summaryTitle: 'AI Generated Summary',
    sourcesTitle: 'Sources',
    errorTitle: 'An Error Occurred',
    errorDescription: 'There was a problem generating the report. Please try again later.',
    initialPrompt: 'What are you curious about? Let the AI explore for you.',
    pasteAndSearch: 'Paste & Search',
    historyTitle: 'History',
    clearHistory: 'Clear History',
    clearHistoryConfirmTitle: 'Are you sure you want to clear all history?',
    clearHistoryConfirmDesc: 'This action cannot be undone.',
    confirm: 'Confirm',
    cancel: 'Cancel',
    copySummary: 'Copy Summary',
    summaryCopied: 'Summary copied to clipboard',
  }
};

type LanguageKey = keyof typeof translations;

const HistoryPanel: React.FC<{
    history: HistoryItem[];
    activeResultId: string | null;
    onSelectHistory: (item: HistoryItem) => void;
    onClearHistory: () => void;
    t: (typeof translations)['zh-CN'];
    locale: Locale;
}> = ({ history, activeResultId, onSelectHistory, onClearHistory, t, locale }) => {
    return (
        <div className="flex flex-col h-full bg-card/80 backdrop-blur-sm rounded-xl border">
            <div className="p-4 border-b flex justify-between items-center">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                    <History className="h-5 w-5"/>{t.historyTitle}
                </h2>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8" disabled={history.length === 0} title={t.clearHistory}>
                            <Trash2 className="h-4 w-4"/>
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>{t.clearHistoryConfirmTitle}</AlertDialogTitle>
                            <AlertDialogDescription>{t.clearHistoryConfirmDesc}</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
                            <AlertDialogAction onClick={onClearHistory}>{t.confirm}</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
            <ScrollArea className="flex-1">
                <div className="p-2">
                    {history.length > 0 ? (
                        <ul className="space-y-1">
                            {history.map(item => (
                                <li key={item.id}>
                                    <button 
                                        onClick={() => onSelectHistory(item)}
                                        className={cn(
                                            "w-full text-left p-2.5 rounded-md text-sm transition-colors",
                                            activeResultId === item.id ? "bg-primary/20 text-primary-foreground font-semibold" : "hover:bg-accent"
                                        )}
                                        title={item.topic}
                                    >
                                        <p className="truncate font-medium">{item.result.metadata?.title || item.topic}</p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {formatDistanceToNow(parseISO(item.timestamp), { addSuffix: true, locale })}
                                        </p>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                         <div className="text-center py-16 text-muted-foreground">
                            <p className="text-sm">No history yet.</p>
                        </div>
                    )}
                </div>
            </ScrollArea>
        </div>
    );
};


export default function InfoHubPage() {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageKey>('en');
  const [topic, setTopic] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeResult, setActiveResult] = useState<HistoryItem | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useLocalStorage<HistoryItem[]>('infoHubHistory_v3', []);
  const { toast } = useToast();

  const t = useMemo(() => translations[currentLanguage], [currentLanguage]);
  const dateLocale = useMemo(() => currentLanguage === 'zh-CN' ? zhCN : enUS, [currentLanguage]);

  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      const browserLang: LanguageKey = navigator.language.toLowerCase().startsWith('zh') ? 'zh-CN' : 'en';
      setCurrentLanguage(browserLang);
    }
  }, []);
  
  const performResearch = useCallback(async (researchTopicText: string) => {
    if (!researchTopicText.trim() || isLoading) return;

    setIsLoading(true);
    setActiveResult(null);
    setError(null);
    setTopic('');

    try {
      const response = await researchTopic({ topic: researchTopicText });
      const newHistoryItem: HistoryItem = {
        id: Date.now().toString(),
        topic: researchTopicText,
        result: response,
        timestamp: new Date().toISOString(),
      };
      setHistory(prev => [newHistoryItem, ...prev]);
      setActiveResult(newHistoryItem);
    } catch (err: any) {
      console.error("Error researching topic:", err);
      setError(err.message || t.errorDescription);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, setHistory, t.errorDescription]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    performResearch(topic);
  };
  
  const handlePasteAndSearch = useCallback(async () => {
    try {
        if (navigator.clipboard?.readText) {
            const text = await navigator.clipboard.readText();
            if (text) {
                setTopic(text);
                await performResearch(text);
            }
        }
    } catch (err) {
        console.error('Failed to read clipboard contents: ', err);
    }
  }, [performResearch]);
  
  const handleSelectHistory = (item: HistoryItem) => {
    setActiveResult(item);
    setError(null);
    setIsLoading(false);
  };

  const handleCopySummary = () => {
    if (activeResult?.result.summary) {
        navigator.clipboard.writeText(activeResult.result.summary);
        toast({ title: t.summaryCopied, duration: 2000 });
    }
  }

  const MainContent = () => (
    <div className="w-full h-full flex flex-col">
        <div className="w-full max-w-2xl mx-auto mt-auto mb-6 px-4">
            <form onSubmit={handleSubmit} className="w-full flex items-center gap-2">
                <Input 
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder={t.inputPlaceholder}
                    className="flex-grow h-14 text-lg rounded-full shadow-lg"
                    disabled={isLoading}
                    autoComplete="off"
                />
                <Button type="submit" size="icon" className="h-14 w-14 rounded-full shadow-lg" disabled={isLoading || !topic.trim()}>
                    {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : <Send className="h-6 w-6" />}
                    <span className="sr-only">{t.generateButton}</span>
                </Button>
            </form>
            <div className="flex justify-end mt-2">
                <Button variant="ghost" size="sm" onClick={handlePasteAndSearch} className="text-muted-foreground hover:text-primary">
                    <ClipboardPaste className="mr-2 h-4 w-4"/>
                    {t.pasteAndSearch}
                </Button>
            </div>
        </div>
        
        <ScrollArea className="flex-1 w-full">
            <div className="max-w-4xl mx-auto px-4 pb-8 space-y-6">
                {isLoading && (
                     <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-full py-20">
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
                     <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-full py-20">
                        <Rss className="h-16 w-16 mb-4 text-primary/50" />
                        <p className="max-w-xs text-lg">{t.initialPrompt}</p>
                    </div>
                )}

                {activeResult && !isLoading && !error && (
                    <div className="space-y-6 animate-in fade-in-50 duration-500">
                        {activeResult.result.metadata?.title && (
                            <h2 className="text-3xl font-bold text-primary text-center">{activeResult.result.metadata.title}</h2>
                        )}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>{t.summaryTitle}</CardTitle>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleCopySummary}>
                                            <Copy className="h-4 w-4"/>
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent><p>{t.copySummary}</p></TooltipContent>
                                </Tooltip>
                            </CardHeader>
                            <CardContent className="prose prose-sm dark:prose-invert max-w-none leading-relaxed">
                                {activeResult.result.summary.split('\n').map((line, i) => <p key={i} className="my-2">{line}</p>)}
                            </CardContent>
                        </Card>
                        {activeResult.result.sources && activeResult.result.sources.length > 0 && (
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
                        )}
                    </div>
                )}
            </div>
        </ScrollArea>
    </div>
  );

  return (
    <TooltipProvider>
    <div className="flex flex-col h-screen bg-gradient-to-br from-background to-muted/30 text-foreground">
      <header className="w-full p-4 flex justify-between items-center shrink-0">
        <Link href="/rest" passHref>
            <Button variant="outline" size="sm" className="bg-background/50 backdrop-blur-sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t.backButton}
            </Button>
        </Link>
        <h1 className="text-xl sm:text-2xl font-headline font-semibold text-primary hidden sm:block">
            {t.pageTitle}
        </h1>
        {/* Mobile History Button */}
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="sm:hidden bg-background/50 backdrop-blur-sm">
                    <History className="h-5 w-5" />
                </Button>
            </SheetTrigger>
            <SheetContent>
                <HistoryPanel 
                    history={history}
                    activeResultId={activeResult?.id || null}
                    onSelectHistory={(item) => { handleSelectHistory(item); }}
                    onClearHistory={() => setHistory([])}
                    t={t}
                    locale={dateLocale}
                />
            </SheetContent>
        </Sheet>
      </header>
      
      <div className="flex-1 flex overflow-hidden relative">
        {/* Desktop History Panel */}
        <aside className="hidden sm:block absolute top-0 left-4 bottom-4 w-80">
            <HistoryPanel 
                history={history}
                activeResultId={activeResult?.id || null}
                onSelectHistory={handleSelectHistory}
                onClearHistory={() => setHistory([])}
                t={t}
                locale={dateLocale}
            />
        </aside>
        
        <main className="flex-1 flex flex-col overflow-hidden sm:ml-[calc(20rem+2rem)]">
            <MainContent />
        </main>
      </div>
    </div>
    </TooltipProvider>
  );
}
