
"use client";

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Rss, Loader2, Sparkles, Link as LinkIcon, Send, ClipboardPaste } from 'lucide-react';
import { researchTopic, type ResearchTopicOutput } from '@/ai/flows/info-hub-flow';

const translations = {
  'zh-CN': {
    pageTitle: '聚合信息',
    pageSubtitle: '输入一个话题或粘贴一个链接，AI 将为您搜索并生成一份摘要报告。',
    backButton: '返回休闲驿站',
    inputPlaceholder: '例如：最新的 AI 技术进展 或 https://...',
    generateButton: '生成报告',
    generating: '正在生成中...',
    summaryTitle: 'AI 生成的摘要',
    sourcesTitle: '信息来源',
    errorTitle: '出错了',
    errorDescription: '生成报告时遇到问题，请稍后重试。',
    initialPrompt: '对什么好奇？让 AI 为您探索。',
    pasteFromClipboard: '从剪贴板粘贴'
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
    pasteFromClipboard: 'Paste from Clipboard'
  }
};

type LanguageKey = keyof typeof translations;

export default function InfoHubPage() {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageKey>('en');
  const [topic, setTopic] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ResearchTopicOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      const browserLang: LanguageKey = navigator.language.toLowerCase().startsWith('zh') ? 'zh-CN' : 'en';
      setCurrentLanguage(browserLang);
    }
  }, []);

  const t = useMemo(() => translations[currentLanguage], [currentLanguage]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!topic.trim() || isLoading) return;

    setIsLoading(true);
    setResult(null);
    setError(null);

    try {
      const response = await researchTopic({ topic });
      setResult(response);
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
            if (text) {
                setTopic(text);
            }
        }
    } catch (err) {
        console.error('Failed to read clipboard contents: ', err);
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground py-8 sm:py-12 px-4 items-center">
      <header className="w-full max-w-2xl mb-6 sm:mb-8">
        <Link href="/rest" passHref>
            <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t.backButton}
            </Button>
        </Link>
      </header>

      <main className="w-full max-w-2xl flex flex-col items-center flex-grow gap-8">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl font-headline font-semibold text-primary mb-2">
            {t.pageTitle}
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">{t.pageSubtitle}</p>
        </div>

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
                    {isLoading ? (
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    ) : (
                        <Send className="mr-2 h-5 w-5" />
                    )}
                    {t.generateButton}
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
                    <CardHeader>
                        <CardTitle className="text-destructive">{t.errorTitle}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>{t.errorDescription}</p>
                        <p className="text-xs mt-2 text-destructive/80">{error}</p>
                    </CardContent>
                </Card>
            )}

            {!isLoading && !result && !error && (
                 <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-full py-20 bg-card/50 rounded-xl border border-dashed">
                    <Rss className="h-16 w-16 mb-4 text-primary/50" />
                    <p className="max-w-xs text-lg">{t.initialPrompt}</p>
                </div>
            )}

            {result && (
                <div className="space-y-6 animate-in fade-in-50">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t.summaryTitle}</CardTitle>
                        </CardHeader>
                        <CardContent className="prose prose-sm dark:prose-invert max-w-none leading-relaxed">
                            {result.summary.split('\n').map((line, i) => <p key={i} className="my-2">{line}</p>)}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>{t.sourcesTitle}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-3">
                                {result.sources.map((source, index) => (
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
      </main>
    </div>
  );
}
