
"use client";

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Settings, Sun, Moon, Maximize, Minimize, Loader2, Library } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

const translations = {
  'zh-CN': {
    backButton: '返回书架',
    loadingBook: '正在加载书籍...',
    bookNotFound: '找不到书籍内容',
    bookNotFoundDescription: '这本书的内容没有在当前会话中找到。请返回书架重新导入。',
    settings: '阅读设置',
    fontSize: '字号',
    theme: '主题',
    lightTheme: '浅色',
    darkTheme: '深色',
    page: (current: number, total: number) => `第 ${current} / ${total} 页`,
    pdfError: '加载PDF失败。请确保文件未损坏。',
    pdfLoading: '正在加载 PDF...',
    fullscreen: '全屏',
    exitFullscreen: '退出全屏',
  },
  'en': {
    backButton: 'Back to Bookshelf',
    loadingBook: 'Loading book...',
    bookNotFound: 'Book Content Not Found',
    bookNotFoundDescription: 'The content for this book was not found in the current session. Please return to the bookshelf to access it again.',
    settings: 'Reading Settings',
    fontSize: 'Font Size',
    theme: 'Theme',
    lightTheme: 'Light',
    darkTheme: 'Dark',
    page: (current: number, total: number) => `Page ${current} of ${total}`,
    pdfError: 'Failed to load PDF. Please ensure the file is not corrupted.',
    pdfLoading: 'Loading PDF...',
    fullscreen: 'Fullscreen',
    exitFullscreen: 'Exit Fullscreen',
  }
};

type LanguageKey = keyof typeof translations;

interface BookWithContent {
  id: string;
  title: string;
  type: 'txt' | 'pdf';
  content: string; // Data URI for both txt and pdf
}

interface ReadingSettings {
  fontSize: number;
  theme: 'light' | 'dark';
}

const LOCAL_STORAGE_SETTINGS_KEY = 'personal_library_settings_v2';
const SESSION_STORAGE_BOOK_CONTENT_PREFIX = 'personal_library_content_';

const PdfViewer = dynamic(() => import('@/components/PdfViewer'), {
    ssr: false,
    loading: () => (
        <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    )
});

export default function BookReaderPage() {
  const params = useParams();
  const router = useRouter();
  const bookId = typeof params.id === 'string' ? params.id : null;

  const [currentLanguage, setCurrentLanguage] = useState<LanguageKey>('en');
  const [book, setBook] = useState<BookWithContent | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState<ReadingSettings>({ fontSize: 16, theme: 'light' });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  const readerContainerRef = useRef<HTMLDivElement>(null);
  const t = useMemo(() => translations[currentLanguage], [currentLanguage]);

  useEffect(() => {
    setIsMounted(true);
    if (typeof navigator !== 'undefined') {
      const browserLang: LanguageKey = navigator.language.toLowerCase().startsWith('zh') ? 'zh-CN' : 'en';
      setCurrentLanguage(browserLang);
    }

    try {
      const savedSettings = localStorage.getItem(LOCAL_STORAGE_SETTINGS_KEY);
      if (savedSettings) setSettings(JSON.parse(savedSettings));
    } catch (e) {
      console.error("Failed to load settings", e);
    }

    if (bookId) {
      try {
        const bookContentJSON = sessionStorage.getItem(`${SESSION_STORAGE_BOOK_CONTENT_PREFIX}${bookId}`);
        if (bookContentJSON) {
          setBook(JSON.parse(bookContentJSON));
        } else {
          // This is the fallback case: content is not in session storage.
          setError(t.bookNotFound);
        }
      } catch (e) {
        console.error("Failed to load book content from sessionStorage", e);
        setError(t.bookNotFound);
      }
    }
  }, [bookId, t.bookNotFound]);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem(LOCAL_STORAGE_SETTINGS_KEY, JSON.stringify(settings));
    }
  }, [settings, isMounted]);

  const handleFullscreenChange = useCallback(() => {
    setIsFullscreen(!!document.fullscreenElement);
  }, []);

  useEffect(() => {
      document.addEventListener('fullscreenchange', handleFullscreenChange);
      return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [handleFullscreenChange]);

  const updateSettings = (newSettings: Partial<ReadingSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const toggleFullscreen = () => {
    const element = readerContainerRef.current;
    if (!element) return;
    if (!document.fullscreenElement) {
      element.requestFullscreen().catch(err => console.error(`Fullscreen error: ${err.message}`));
    } else {
      document.exitFullscreen();
    }
  };

  const renderContent = () => {
    if (error) {
      return (
        <div className="flex-1 flex items-center justify-center text-center p-4">
            <div>
                <Library className="h-16 w-16 text-destructive mx-auto mb-4" />
                <h2 className="text-xl font-bold text-destructive">{t.bookNotFound}</h2>
                <p className="text-muted-foreground max-w-sm mt-2">{t.bookNotFoundDescription}</p>
                <Button onClick={() => router.push('/personal-library')} className="mt-6">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    {t.backButton}
                </Button>
            </div>
        </div>
      );
    }
    
    if (!book) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="ml-2 text-muted-foreground">{t.loadingBook}</p>
            </div>
        );
    }

    if (book.type === 'txt') {
        const textContent = atob(book.content.substring(book.content.indexOf(',') + 1));
        return (
            <div className="flex-1 flex flex-col min-h-0">
                <ScrollArea className="flex-1 p-6 md:p-8 lg:p-12">
                    <p className="whitespace-pre-wrap leading-relaxed" style={{ fontSize: `${settings.fontSize}px` }}>
                        {textContent}
                    </p>
                </ScrollArea>
            </div>
        )
    }

    if (book.type === 'pdf') {
        return (
            <PdfViewer
                file={book.content}
                title={book.title}
                theme={settings.theme}
                translations={{
                    page: t.page,
                    pdfError: t.pdfError,
                    pdfLoading: t.pdfLoading,
                }}
            />
        )
    }

    return null;
  }

  return (
    <div ref={readerContainerRef} className={cn("flex flex-col h-screen", settings.theme === 'dark' ? 'dark bg-gray-800 text-gray-200' : 'bg-white text-gray-800')}>
        <header className={cn("flex items-center justify-between p-4 border-b shrink-0", isFullscreen && "hidden", settings.theme === 'dark' ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-gray-50')}>
            <Button variant="outline" size="sm" onClick={() => router.push('/personal-library')}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t.backButton}
            </Button>
            <h1 className="text-lg font-semibold text-primary truncate px-4" title={book?.title}>
                {book?.title || '...'}
            </h1>
            <div className="flex items-center gap-2">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" size="sm" disabled={!book || book?.type === 'pdf'}>
                            <Settings className="mr-2 h-4 w-4" />
                            <span className="hidden sm:inline">{t.settings}</span>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64">
                        <div className="grid gap-4">
                            <div className="space-y-2">
                                <h4 className="font-medium leading-none">{t.fontSize}</h4>
                                <Slider defaultValue={[settings.fontSize]} min={12} max={24} step={1} onValueChange={(v) => updateSettings({ fontSize: v[0] })} />
                            </div>
                            <div className="space-y-2">
                                <h4 className="font-medium leading-none">{t.theme}</h4>
                                <div className="grid grid-cols-2 gap-2">
                                    <Button variant={settings.theme === 'light' ? 'secondary' : 'outline'} onClick={() => updateSettings({ theme: 'light' })}>
                                        <Sun className="mr-2 h-4 w-4"/> {t.lightTheme}
                                    </Button>
                                    <Button variant={settings.theme === 'dark' ? 'secondary' : 'outline'} onClick={() => updateSettings({ theme: 'dark' })}>
                                        <Moon className="mr-2 h-4 w-4"/> {t.darkTheme}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>
                <Button variant="outline" size="icon" className="h-9 w-9" onClick={toggleFullscreen} title={isFullscreen ? t.exitFullscreen : t.fullscreen}>
                    {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                </Button>
            </div>
        </header>

        <main className="flex-1 flex flex-col min-h-0">
          {renderContent()}
        </main>
    </div>
  )
}
