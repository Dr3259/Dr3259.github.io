
"use client";

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Settings, Sun, Moon, Maximize, Minimize, Loader2, Library, CaseSensitive, BookOpen, Book, StretchVertical, StretchHorizontal, PanelLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getBookContent, saveBook, type BookWithContent, type Bookmark } from '@/lib/db';
import { BookmarkPanel } from '@/components/BookmarkPanel';
import { AddBookmarkDialog } from '@/components/AddBookmarkDialog';
import { PdfReader } from '@/components/PdfReader';


const translations = {
  'zh-CN': {
    backButton: '返回书架',
    loadingBook: '正在加载书籍...',
    bookNotFound: '找不到书籍内容',
    bookNotFoundDescription: '这本书的内容没有在数据库中找到。请返回书架重新选择。',
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
    pageLayout: '页面布局',
    singlePage: '单页',
    doublePage: '双页',
    scaleMode: '缩放模式',
    fitHeight: '适应高度',
    fitWidth: '适应宽度',
    addBookmark: '添加书签',
    removeBookmark: '移除书签',
    bookmarks: '书签列表',
    copyPageTextAsMarkdown: '复制为 Markdown',
    pageTextCopied: 'Markdown 内容已复制',
    jumpToPage: '跳至页面...',
    addBookmarkDialog: {
        title: '添加新书签',
        description: '为当前页面添加一个描述性的标题。',
        label: '书签标题',
        placeholder: '例如：第一章重点',
        save: '保存书签',
        cancel: '取消',
    }
  },
  'en': {
    backButton: 'Back to Bookshelf',
    loadingBook: 'Loading book...',
    bookNotFound: 'Book Content Not Found',
    bookNotFoundDescription: 'The content for this book was not found in the database. Please return to the bookshelf and select it again.',
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
    pageLayout: 'Page Layout',
    singlePage: 'Single',
    doublePage: 'Double',
    scaleMode: 'Scale Mode',
    fitHeight: 'Fit Height',
    fitWidth: 'Fit Width',
    addBookmark: 'Add Bookmark',
    removeBookmark: 'Remove Bookmark',
    bookmarks: 'Bookmarks',
    copyPageTextAsMarkdown: 'Copy as Markdown',
    pageTextCopied: 'Markdown content copied to clipboard',
    jumpToPage: 'Jump to page...',
    addBookmarkDialog: {
        title: 'Add New Bookmark',
        description: 'Add a descriptive title for the current page.',
        label: 'Bookmark Title',
        placeholder: 'E.g., Chapter 1 Key Points',
        save: 'Save Bookmark',
        cancel: 'Cancel',
    }
  }
};

type LanguageKey = keyof typeof translations;
type PageLayout = 'single' | 'double';
type ScaleMode = 'fitHeight' | 'fitWidth';

interface ReadingSettings {
  fontSize: number;
  theme: 'light' | 'dark';
  pdfScaleMode: ScaleMode;
  pageLayout: PageLayout;
}

const LOCAL_STORAGE_SETTINGS_KEY = 'personal_library_settings_v6';
const PRESET_FONT_SIZES = [14, 16, 18, 20];


export default function BookReaderPage() {
  const params = useParams();
  const router = useRouter();
  const bookId = typeof params.id === 'string' ? params.id : null;

  const [currentLanguage, setCurrentLanguage] = useState<LanguageKey>('en');
  const [book, setBook] = useState<BookWithContent | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState<ReadingSettings>({ fontSize: 16, theme: 'light', pdfScaleMode: 'fitHeight', pageLayout: 'single' });
  const [isMounted, setIsMounted] = useState(false);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isBookmarkPanelOpen, setIsBookmarkPanelOpen] = useState(false);
  
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [isAddBookmarkDialogOpen, setIsAddBookmarkDialogOpen] = useState(false);
  const [bookmarkInfo, setBookmarkInfo] = useState<{ page: number; suggestedTitle: string } | null>(null);
  
  const readerContainerRef = useRef<HTMLDivElement>(null);
  const settingsPanelRef = useRef<HTMLDivElement>(null);
  const txtContentRef = useRef<HTMLDivElement>(null);
  const t = useMemo(() => translations[currentLanguage], [currentLanguage]);

  useEffect(() => {
    setIsMounted(true);
    const browserLang: LanguageKey = navigator.language.toLowerCase().startsWith('zh') ? 'zh-CN' : 'en';
    setCurrentLanguage(browserLang);
    try {
      const savedSettings = localStorage.getItem(LOCAL_STORAGE_SETTINGS_KEY);
      if (savedSettings) setSettings(prev => ({ ...prev, ...JSON.parse(savedSettings) }));
      else {
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        setSettings(prev => ({ ...prev, theme: prefersDark ? 'dark' : 'light' }));
      }
    } catch (e) { console.error("Failed to load settings", e); }

    if (bookId) {
      getBookContent(bookId).then(bookContent => {
        if (bookContent) { setBook(bookContent); setBookmarks(bookContent.bookmarks || []); }
        else setError(t.bookNotFound);
      }).catch(err => { console.error("Failed to load book content", err); setError(t.bookNotFound); });
    } else { setError(t.bookNotFound); }
  }, [bookId, t.bookNotFound]);

  useEffect(() => { if (isMounted) localStorage.setItem(LOCAL_STORAGE_SETTINGS_KEY, JSON.stringify(settings)); }, [settings, isMounted]);
  const handleFullscreenChange = useCallback(() => setIsFullscreen(!!document.fullscreenElement), []);
  useEffect(() => { document.addEventListener('fullscreenchange', handleFullscreenChange); return () => document.removeEventListener('fullscreenchange', handleFullscreenChange); }, [handleFullscreenChange]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (settingsPanelRef.current && !settingsPanelRef.current.contains(event.target as Node)) {
        const controlPanel = document.getElementById('reading-controls');
        if (controlPanel && !controlPanel.contains(event.target as Node)) setIsSettingsOpen(false);
      }
    };
    if (isSettingsOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSettingsOpen]);

  const updateSettings = (newSettings: Partial<ReadingSettings>) => setSettings(prev => ({ ...prev, ...newSettings }));
  const toggleFullscreen = () => { if (readerContainerRef.current) { if (!document.fullscreenElement) readerContainerRef.current.requestFullscreen(); else document.exitFullscreen(); }};
  
  const addBookmark = async (page: number, title: string) => {
    if (!book) return;
    const newBookmark: Bookmark = { page, title };
    const newBookmarks = [...bookmarks, newBookmark].sort((a, b) => a.page - b.page);
    setBookmarks(newBookmarks);
    const updatedBook = { ...book, bookmarks: newBookmarks };
    await saveBook(updatedBook);
    setBook(updatedBook);
  };
  
  const removeBookmark = async (page: number) => {
    if(!book) return;
    const newBookmarks = bookmarks.filter(b => b.page !== page);
    setBookmarks(newBookmarks);
    const updatedBook = { ...book, bookmarks: newBookmarks };
    await saveBook(updatedBook);
    setBook(updatedBook);
  };

  const handleOpenAddBookmarkDialog = (page: number, suggestedTitle: string) => {
    setBookmarkInfo({ page, suggestedTitle });
    setIsAddBookmarkDialogOpen(true);
  };

  const handleSaveBookmark = async (title: string) => {
    if (bookmarkInfo) {
      await addBookmark(bookmarkInfo.page, title);
    }
    setIsAddBookmarkDialogOpen(false);
    setBookmarkInfo(null);
  };

  const handleGoToPage = (pageNum: number) => {
    if (book?.type === 'txt' && txtContentRef.current) {
        // Simple scroll to top for TXT
        txtContentRef.current.scrollTop = 0;
    }
    // PDF handling is inside PdfReader component, but we can manage bookmarks here
    setIsBookmarkPanelOpen(false);
  }

  const renderContent = () => {
    if (error) {
      return <div className="flex-1 flex items-center justify-center text-center p-4"><div><Library className="h-16 w-16 text-destructive mx-auto mb-4" /><h2 className="text-xl font-bold text-destructive">{t.bookNotFound}</h2><p className="text-muted-foreground max-w-sm mt-2">{t.bookNotFoundDescription}</p><Button onClick={() => router.push('/personal-library')} className="mt-6"><ArrowLeft className="mr-2 h-4 w-4" />{t.backButton}</Button></div></div>;
    }
    if (!book) return <div className="flex-1 flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /><p className="ml-2 text-muted-foreground">{t.loadingBook}</p></div>;
    if (book.type === 'txt') {
      const textContent = atob(book.content.substring(book.content.indexOf(',') + 1));
      return <div ref={txtContentRef} className="flex-1 p-6 md:p-8 lg:p-12 overflow-y-auto"><p className="whitespace-pre-wrap leading-relaxed max-w-3xl mx-auto" style={{ fontSize: `${settings.fontSize}px` }}>{textContent}</p></div>;
    }
    if (book.type === 'pdf') {
      return <PdfReader file={book.content} theme={settings.theme} pageLayout={settings.pageLayout} scaleMode={settings.pdfScaleMode} bookmarks={bookmarks} onBookmarkToggle={async () => {}} onAddBookmark={addBookmark} onOpenAddBookmarkDialog={handleOpenAddBookmarkDialog} onRemoveBookmark={removeBookmark} translations={t} />;
    }
    return null;
  };
  
  const renderSettingsContent = () => {
    if (book?.type === 'pdf') {
      return <>
        <div className="space-y-2"><h4 className="font-medium leading-none flex items-center text-sm"><BookOpen className="mr-2 h-4 w-4"/>{t.pageLayout}</h4><div className="grid grid-cols-2 gap-2"><Button variant={settings.pageLayout === 'single' ? 'secondary' : 'outline'} size="sm" onClick={() => updateSettings({ pageLayout: 'single' })} className="text-xs h-7"><Book className="mr-1.5 h-3.5 w-3.5"/>{t.singlePage}</Button><Button variant={settings.pageLayout === 'double' ? 'secondary' : 'outline'} size="sm" onClick={() => updateSettings({ pageLayout: 'double' })} className="text-xs h-7"><BookOpen className="mr-1.5 h-3.5 w-3.5"/>{t.doublePage}</Button></div></div>
        <div className="space-y-2"><h4 className="font-medium leading-none flex items-center text-sm"><StretchVertical className="mr-2 h-4 w-4"/>{t.scaleMode}</h4><div className="grid grid-cols-2 gap-2"><Button variant={settings.pdfScaleMode === 'fitHeight' ? 'secondary' : 'outline'} size="sm" onClick={() => updateSettings({ pdfScaleMode: 'fitHeight' })} className="w-full text-xs h-7"><StretchVertical className="mr-1.5 h-3.5 w-3.5"/>{t.fitHeight}</Button><Button variant={settings.pdfScaleMode === 'fitWidth' ? 'secondary' : 'outline'} size="sm" onClick={() => updateSettings({ pdfScaleMode: 'fitWidth' })} className="w-full text-xs h-7"><StretchHorizontal className="mr-1.5 h-3.5 w-3.5"/>{t.fitWidth}</Button></div></div>
      </>;
    }
    return <div className="space-y-2"><h4 className="font-medium leading-none flex items-center text-sm"><CaseSensitive className="mr-2 h-4 w-4"/>{t.fontSize}</h4><div className="grid grid-cols-4 gap-2">{PRESET_FONT_SIZES.map(size => <Button key={size} variant={settings.fontSize === size ? 'secondary' : 'outline'} size="sm" onClick={() => updateSettings({ fontSize: size })} className="text-xs h-7">{size}px</Button>)}</div></div>;
  };

  const readingBgClass = settings.theme === 'light' ? 'bg-[--background]' : 'bg-gray-800';
  const readingFgClass = settings.theme === 'light' ? 'text-gray-800' : 'text-gray-200';
  
  return (
    <div ref={readerContainerRef} className={cn("flex flex-col h-screen", readingBgClass, readingFgClass)} style={{ '--background': settings.theme === 'light' ? 'hsl(var(--reading-background))' : '#1f2937' } as React.CSSProperties}>
      <Button variant="outline" size="icon" onClick={() => router.push('/personal-library')} className="fixed bottom-4 left-4 z-50 h-11 w-11 rounded-full shadow-lg bg-background/80 backdrop-blur-sm border-border text-foreground" title={t.backButton}><ArrowLeft className="h-5 w-5" /></Button>
      <Button variant="outline" size="icon" onClick={() => setIsBookmarkPanelOpen(true)} className="fixed top-4 right-4 z-50 h-11 w-11 rounded-full shadow-lg bg-background/80 backdrop-blur-sm border-border text-foreground" title={t.bookmarks}><PanelLeft className="h-5 w-5" /></Button>
      <main className="flex-1 flex flex-col min-h-0">{renderContent()}</main>
      <div id="reading-controls" className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
        {isSettingsOpen && (
          <div ref={settingsPanelRef} className="w-64 mb-1 p-4 bg-popover text-popover-foreground border rounded-lg shadow-lg transition-all animate-in fade-in-50 slide-in-from-bottom-2">
            <div className="grid gap-4">{renderSettingsContent()}<div className="space-y-2"><h4 className="font-medium leading-none text-sm">{t.theme}</h4><div className="grid grid-cols-2 gap-2"><Button size="sm" className="h-8" variant={settings.theme === 'light' ? 'secondary' : 'outline'} onClick={() => updateSettings({ theme: 'light' })}><Sun className="mr-2 h-4 w-4"/>{t.lightTheme}</Button><Button size="sm" className="h-8" variant={settings.theme === 'dark' ? 'secondary' : 'outline'} onClick={() => updateSettings({ theme: 'dark' })}><Moon className="mr-2 h-4 w-4"/>{t.darkTheme}</Button></div></div></div>
          </div>
        )}
        <div className="flex items-center gap-2">
          { book?.type !== 'pdf' && (
            <div className="flex items-center justify-end gap-2 p-1.5 bg-background/80 border rounded-full shadow-lg backdrop-blur-sm text-foreground">
               <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full" onClick={() => setIsSettingsOpen(prev => !prev)} disabled={!book}><Settings className="h-5 w-5" /></Button>
               <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full" onClick={toggleFullscreen} title={isFullscreen ? t.exitFullscreen : t.fullscreen}>{isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}</Button>
            </div>
          )}
          { book?.type === 'pdf' && (
            <div className="flex items-center justify-end gap-2 p-1.5 bg-background/80 border rounded-full shadow-lg backdrop-blur-sm text-foreground">
               <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full" onClick={() => setIsSettingsOpen(prev => !prev)} disabled={!book}><Settings className="h-5 w-5" /></Button>
               <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full" onClick={toggleFullscreen} title={isFullscreen ? t.exitFullscreen : t.fullscreen}>{isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}</Button>
            </div>
          )}
        </div>
      </div>
      <AddBookmarkDialog isOpen={isAddBookmarkDialogOpen} onClose={() => setIsAddBookmarkDialogOpen(false)} onSave={handleSaveBookmark} suggestedTitle={bookmarkInfo?.suggestedTitle || ''} translations={t.addBookmarkDialog} />
      <BookmarkPanel isOpen={isBookmarkPanelOpen} onClose={() => setIsBookmarkPanelOpen(false)} bookmarks={bookmarks} onGoToPage={handleGoToPage} onRemoveBookmark={removeBookmark} translations={{ title: t.bookmarks, noBookmarks: "No bookmarks added yet.", pageLabel: "Page" }} />
    </div>
  );
}
