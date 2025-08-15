
"use client";

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import type { PDFDocumentProxy, PDFPageProxy } from 'pdfjs-dist';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Settings, Sun, Moon, Maximize, Minimize, Loader2, Library, CaseSensitive, ChevronLeft, ChevronRight, BookOpen, Book, StretchVertical, StretchHorizontal, Bookmark, PanelLeft, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getBookContent, saveBook, type BookWithContent } from '@/lib/db';
import { BookmarkPanel } from '@/components/BookmarkPanel';
import { useToast } from '@/hooks/use-toast';
import copy from 'copy-to-clipboard';
import type { TextItem } from 'pdfjs-dist/types/src/display/api';
import { Input } from '@/components/ui/input';


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

const PdfViewer = dynamic(() => import('@/components/PdfViewer'), {
    ssr: false,
    loading: () => (
        <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    )
});

const PRESET_FONT_SIZES = [14, 16, 18, 20];


export default function BookReaderPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const bookId = typeof params.id === 'string' ? params.id : null;

  const [currentLanguage, setCurrentLanguage] = useState<LanguageKey>('en');
  const [book, setBook] = useState<BookWithContent | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState<ReadingSettings>({ fontSize: 16, theme: 'light', pdfScaleMode: 'fitHeight', pageLayout: 'single' });
  const [isMounted, setIsMounted] = useState(false);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isBookmarkPanelOpen, setIsBookmarkPanelOpen] = useState(false);
  
  const [pdfDoc, setPdfDoc] = useState<PDFDocumentProxy | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [currentScale, setCurrentScale] = useState<number>(1.0);
  const [isCalculatingScale, setIsCalculatingScale] = useState(false);
  const [bookmarks, setBookmarks] = useState<number[]>([]);

  const [isJumpingToPage, setIsJumpingToPage] = useState(false);
  const [jumpToPageInput, setJumpToPageInput] = useState('');
  
  const readerContainerRef = useRef<HTMLDivElement>(null);
  const pdfViewerWrapperRef = useRef<HTMLDivElement>(null);
  const settingsPanelRef = useRef<HTMLDivElement>(null);

  const t = useMemo(() => translations[currentLanguage], [currentLanguage]);

  useEffect(() => {
    setIsMounted(true);
    if (typeof navigator !== 'undefined') {
      const browserLang: LanguageKey = navigator.language.toLowerCase().startsWith('zh') ? 'zh-CN' : 'en';
      setCurrentLanguage(browserLang);
    }

    try {
      const savedSettings = localStorage.getItem(LOCAL_STORAGE_SETTINGS_KEY);
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(prev => ({ ...prev, ...parsedSettings }));
      } else {
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        setSettings(prev => ({ ...prev, theme: prefersDark ? 'dark' : 'light' }));
      }
    } catch (e) { console.error("Failed to load settings", e); }

    if (bookId) {
      getBookContent(bookId).then(bookContent => {
        if (bookContent) {
            setBook(bookContent);
            setBookmarks(bookContent.bookmarks || []);
        }
        else setError(t.bookNotFound);
      }).catch(err => {
        console.error("Failed to load book content from IndexedDB", err);
        setError(t.bookNotFound);
      });
    } else {
      setError(t.bookNotFound);
    }
  }, [bookId, t.bookNotFound]);

  useEffect(() => {
    if (isMounted) localStorage.setItem(LOCAL_STORAGE_SETTINGS_KEY, JSON.stringify(settings));
  }, [settings, isMounted]);

  const handleFullscreenChange = useCallback(() => setIsFullscreen(!!document.fullscreenElement), []);

  useEffect(() => {
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [handleFullscreenChange]);

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

  const toggleFullscreen = () => {
    const element = readerContainerRef.current;
    if (!element) return;
    if (!document.fullscreenElement) element.requestFullscreen().catch(err => console.error(`Fullscreen error: ${err.message}`));
    else document.exitFullscreen();
  };
  
  const onDocumentLoadSuccess = (doc: PDFDocumentProxy) => {
    setPdfDoc(doc);
    setNumPages(doc.numPages);
    setPageNumber(1);
  };

  const calculateAndSetFitWidthScale = useCallback(async () => {
    if (!pdfDoc || !pdfViewerWrapperRef.current || !numPages) return;
    setIsCalculatingScale(true);

    const page: PDFPageProxy = await pdfDoc.getPage(pageNumber);
    let pageViewport = page.getViewport({ scale: 1 });
    let totalWidth = pageViewport.width;

    if (settings.pageLayout === 'double' && pageNumber < numPages) {
      try {
        const nextPage: PDFPageProxy = await pdfDoc.getPage(pageNumber + 1);
        const nextPageViewport = nextPage.getViewport({ scale: 1 });
        totalWidth += nextPageViewport.width;
      } catch(e) {
        console.warn("Could not get next page for double layout scale calculation.", e);
      }
    }
    
    const containerWidth = pdfViewerWrapperRef.current.clientWidth;
    const horizontalPadding = 32;
    const scale = (containerWidth - horizontalPadding) / totalWidth;

    setCurrentScale(scale);
    setIsCalculatingScale(false);

  }, [pdfDoc, pageNumber, numPages, settings.pageLayout]);
    
  const calculateAndSetFitHeightScale = useCallback(async () => {
      if (!pdfDoc || !pdfViewerWrapperRef.current) return;
      setIsCalculatingScale(true);
      
      const page: PDFPageProxy = await pdfDoc.getPage(pageNumber);
      const pageViewport = page.getViewport({ scale: 1 });
      const containerHeight = pdfViewerWrapperRef.current.clientHeight;

      const verticalPadding = 32;
      const scaleY = (containerHeight - verticalPadding) / pageViewport.height;
      const resultingWidth = pageViewport.width * scaleY;

      if (resultingWidth > pdfViewerWrapperRef.current.clientWidth) {
         await calculateAndSetFitWidthScale();
      } else {
         setCurrentScale(scaleY);
      }
      setIsCalculatingScale(false);
  }, [pdfDoc, pageNumber, calculateAndSetFitWidthScale]);

  
  useEffect(() => {
    if(!isMounted || !pdfDoc) return;

    const calculateScale = async () => {
        if(settings.pdfScaleMode === 'fitHeight') {
            await calculateAndSetFitHeightScale();
        } else if (settings.pdfScaleMode === 'fitWidth') {
            await calculateAndSetFitWidthScale();
        }
    };
    calculateScale();

  }, [settings.pdfScaleMode, calculateAndSetFitHeightScale, calculateAndSetFitWidthScale, isMounted, pdfDoc, pageNumber, settings.pageLayout]);


  const goToNextPage = useCallback(() => {
    if (!numPages) return;
    const increment = settings.pageLayout === 'double' ? 2 : 1;
    setPageNumber(prev => Math.min(prev + increment, numPages));
  }, [numPages, settings.pageLayout]);

  const goToPrevPage = useCallback(() => {
    const increment = settings.pageLayout === 'double' ? 2 : 1;
    setPageNumber(prev => Math.max(prev - increment, 1));
  }, [settings.pageLayout]);

  const goToPage = useCallback((pageNum: number) => {
    if (!numPages) return;
    setPageNumber(Math.max(1, Math.min(pageNum, numPages)));
  }, [numPages]);

  useEffect(() => {
    if (!isMounted || !book || !pdfDoc || !numPages) return;
    
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isJumpingToPage) return; // Don't interfere with page jump input
      const activeElement = document.activeElement;
      if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA' || activeElement.isContentEditable)) {
        return;
      }
      
      switch(event.key) {
        case 'ArrowLeft':
          goToPrevPage();
          break;
        case 'ArrowRight':
          goToNextPage();
          break;
        case 'ArrowUp':
          if (pdfViewerWrapperRef.current) {
            pdfViewerWrapperRef.current.scrollBy({ top: -50, behavior: 'smooth' });
          }
          break;
        case 'ArrowDown':
          if (pdfViewerWrapperRef.current) {
            pdfViewerWrapperRef.current.scrollBy({ top: 50, behavior: 'smooth' });
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMounted, book, goToPrevPage, goToNextPage, numPages, settings.pageLayout, pdfDoc, isJumpingToPage]);

  const toggleBookmark = async () => {
    if (!book) return;
    const currentPage = pageNumber;
    let newBookmarks;
    if (bookmarks.includes(currentPage)) {
        newBookmarks = bookmarks.filter(b => b !== currentPage);
    } else {
        newBookmarks = [...bookmarks, currentPage].sort((a,b) => a - b);
    }
    setBookmarks(newBookmarks);
    const updatedBook = { ...book, bookmarks: newBookmarks };
    await saveBook(updatedBook);
    setBook(updatedBook);
  };
  
  const removeBookmark = async (pageNum: number) => {
    if(!book) return;
    const newBookmarks = bookmarks.filter(b => b !== pageNum);
    setBookmarks(newBookmarks);
    const updatedBook = { ...book, bookmarks: newBookmarks };
    await saveBook(updatedBook);
    setBook(updatedBook);
  };

  const extractTextAsMarkdownFromPage = async (page: PDFPageProxy): Promise<string> => {
    const content = await page.getTextContent();
    const items = content.items as (TextItem & { fontName: string })[];

    if (!items || items.length === 0) return '';
    
    let lines: { text: string; y: number; x: number; isBold: boolean; isItalic: boolean; size: number }[] = [];
    
    for (const item of items) {
        if (!item.str.trim()) continue;

        const y = item.transform[5];
        const x = item.transform[4];
        const fontName = item.fontName;
        const size = item.transform[3];
        
        const isBold = fontName.toLowerCase().includes('bold') || fontName.toLowerCase().includes('semibold') || fontName.toLowerCase().includes('black');
        const isItalic = fontName.toLowerCase().includes('italic') || fontName.toLowerCase().includes('oblique');

        let line = lines.find(l => Math.abs(l.y - y) < 5);
        
        if (!line) {
            line = { text: item.str, y, x, isBold, isItalic, size };
            lines.push(line);
        } else {
            line.text += ' ' + item.str;
        }
    }
    
    lines.sort((a, b) => b.y - a.y);
    const fontSizes: number[] = lines.map(line => line.size);
    const mostCommonFontSize = fontSizes.sort((a,b) =>
          fontSizes.filter(v => v===a).length
        - fontSizes.filter(v => v===b).length
    ).pop();
    
    return lines.map(line => {
      let text = line.text;
      
      if(mostCommonFontSize) {
        if(line.size > mostCommonFontSize * 1.5) text = `# ${text}`;
        else if(line.size > mostCommonFontSize * 1.2) text = `## ${text}`;
      }
      
      if(line.isBold && line.isItalic) text = `***${text}***`;
      else if(line.isBold) text = `**${text}**`;
      else if(line.isItalic) text = `*${text}*`;

      return text;
    }).join('\n');
  };

  const handleCopyPageText = async () => {
    if (!pdfDoc || !numPages) return;
    
    try {
        let fullText = '';
        const page1 = await pdfDoc.getPage(pageNumber);
        fullText += await extractTextAsMarkdownFromPage(page1);

        if (settings.pageLayout === 'double' && pageNumber < numPages) {
            const page2 = await pdfDoc.getPage(pageNumber + 1);
            const page2Text = await extractTextAsMarkdownFromPage(page2);
            fullText += '\n\n---\n\n' + page2Text;
        }
        
        if (fullText.trim()) {
            copy(fullText);
            toast({ title: t.pageTextCopied });
        }
    } catch (err) {
        console.error("Failed to copy page text:", err);
        toast({ title: "Error copying text", variant: 'destructive' });
    }
  };
  
  const handleJumpToPage = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
        const targetPage = parseInt(jumpToPageInput, 10);
        if (!isNaN(targetPage)) {
            goToPage(targetPage);
        }
        setIsJumpingToPage(false);
        setJumpToPageInput('');
    } else if (e.key === 'Escape') {
        setIsJumpingToPage(false);
        setJumpToPageInput('');
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
              <ArrowLeft className="mr-2 h-4 w-4" />{t.backButton}
            </Button>
          </div>
        </div>
      );
    }
    
    if (!book) return <div className="flex-1 flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /><p className="ml-2 text-muted-foreground">{t.loadingBook}</p></div>;

    if (book.type === 'txt') {
      const textContent = atob(book.content.substring(book.content.indexOf(',') + 1));
      return (
        <div className="flex-1 flex flex-col min-h-0"><div ref={pdfViewerWrapperRef} className="flex-1 p-6 md:p-8 lg:p-12 overflow-y-auto"><p className="whitespace-pre-wrap leading-relaxed max-w-3xl mx-auto" style={{ fontSize: `${settings.fontSize}px` }}>{textContent}</p></div></div>
      );
    }

    if (book.type === 'pdf') {
      return <PdfViewer file={book.content} theme={settings.theme} scale={currentScale} isCalculatingScale={isCalculatingScale} pageNumber={pageNumber} pageLayout={settings.pageLayout} numPages={numPages} onDocumentLoadSuccess={onDocumentLoadSuccess} wrapperRef={pdfViewerWrapperRef} translations={{ pdfError: t.pdfError, pdfLoading: t.pdfLoading }} />;
    }

    return null;
  };
  
  const renderSettingsContent = () => {
    if (book?.type === 'pdf') {
      return (
        <>
          <div className="space-y-2">
            <h4 className="font-medium leading-none flex items-center text-sm"><BookOpen className="mr-2 h-4 w-4"/>{t.pageLayout}</h4>
            <div className="grid grid-cols-2 gap-2">
              <Button key="single" variant={settings.pageLayout === 'single' ? 'secondary' : 'outline'} size="sm" onClick={() => updateSettings({ pageLayout: 'single' })} className="text-xs h-7"><Book className="mr-1.5 h-3.5 w-3.5"/>{t.singlePage}</Button>
              <Button key="double" variant={settings.pageLayout === 'double' ? 'secondary' : 'outline'} size="sm" onClick={() => updateSettings({ pageLayout: 'double' })} className="text-xs h-7"><BookOpen className="mr-1.5 h-3.5 w-3.5"/>{t.doublePage}</Button>
            </div>
          </div>
           <div className="space-y-2">
              <h4 className="font-medium leading-none flex items-center text-sm"><StretchVertical className="mr-2 h-4 w-4"/>{t.scaleMode}</h4>
              <div className="grid grid-cols-2 gap-2">
                 <Button variant={settings.pdfScaleMode === 'fitHeight' ? 'secondary' : 'outline'} size="sm" onClick={() => updateSettings({ pdfScaleMode: 'fitHeight' })} className="w-full text-xs h-7"><StretchVertical className="mr-1.5 h-3.5 w-3.5"/>{t.fitHeight}</Button>
                 <Button variant={settings.pdfScaleMode === 'fitWidth' ? 'secondary' : 'outline'} size="sm" onClick={() => updateSettings({ pdfScaleMode: 'fitWidth' })} className="w-full text-xs h-7"><StretchHorizontal className="mr-1.5 h-3.5 w-3.5"/>{t.fitWidth}</Button>
              </div>
          </div>
        </>
      );
    }
    return (
      <div className="space-y-2">
        <h4 className="font-medium leading-none flex items-center text-sm"><CaseSensitive className="mr-2 h-4 w-4"/>{t.fontSize}</h4>
        <div className="grid grid-cols-4 gap-2">
          {PRESET_FONT_SIZES.map(sizeValue => <Button key={sizeValue} variant={settings.fontSize === sizeValue ? 'secondary' : 'outline'} size="sm" onClick={() => updateSettings({ fontSize: sizeValue })} className="text-xs h-7">{sizeValue}px</Button>)}
        </div>
      </div>
    );
  };

  const readingBgClass = settings.theme === 'light' ? 'bg-[--background]' : 'bg-gray-800';
  const readingFgClass = settings.theme === 'light' ? 'text-gray-800' : 'text-gray-200';
  const isCurrentPageBookmarked = useMemo(() => {
    if (!book || !bookmarks) return false;
    return bookmarks.includes(pageNumber);
  }, [book, bookmarks, pageNumber]);

  return (
    <div ref={readerContainerRef} className={cn("flex flex-col h-screen", readingBgClass, readingFgClass)} style={{ '--background': settings.theme === 'light' ? 'hsl(var(--reading-background))' : '#1f2937' } as React.CSSProperties}>
      <Button variant="outline" size="icon" onClick={() => router.push('/personal-library')} className="fixed bottom-4 left-4 z-50 h-11 w-11 rounded-full shadow-lg bg-background/80 backdrop-blur-sm border-border text-foreground" title={t.backButton}><ArrowLeft className="h-5 w-5" /></Button>
      <Button variant="outline" size="icon" onClick={() => setIsBookmarkPanelOpen(true)} className="fixed top-4 right-4 z-50 h-11 w-11 rounded-full shadow-lg bg-background/80 backdrop-blur-sm border-border text-foreground" title={t.bookmarks}><PanelLeft className="h-5 w-5" /></Button>

      <main className="flex-1 flex flex-col min-h-0">{renderContent()}</main>
      
      <div id="reading-controls" className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
         {isSettingsOpen && (
          <div ref={settingsPanelRef} className="w-64 mb-1 p-4 bg-popover text-popover-foreground border rounded-lg shadow-lg transition-all animate-in fade-in-50 slide-in-from-bottom-2">
            <div className="grid gap-4">
              {renderSettingsContent()}
              <div className="space-y-2">
                <h4 className="font-medium leading-none text-sm">{t.theme}</h4>
                <div className="grid grid-cols-2 gap-2">
                  <Button size="sm" className="h-8" variant={settings.theme === 'light' ? 'secondary' : 'outline'} onClick={() => updateSettings({ theme: 'light' })}><Sun className="mr-2 h-4 w-4"/>{t.lightTheme}</Button>
                  <Button size="sm" className="h-8" variant={settings.theme === 'dark' ? 'secondary' : 'outline'} onClick={() => updateSettings({ theme: 'dark' })}><Moon className="mr-2 h-4 w-4"/>{t.darkTheme}</Button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-end gap-2 p-1.5 bg-background/80 border rounded-full shadow-lg backdrop-blur-sm text-foreground">
          {book?.type === 'pdf' && numPages && (
          <>
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full" onClick={goToPrevPage} disabled={pageNumber <= 1}><ChevronLeft className="h-5 w-5" /></Button>
            
            {!isJumpingToPage ? (
                <Button 
                    variant="ghost" 
                    className="text-sm font-medium text-muted-foreground tabular-nums px-2 h-9 rounded-full"
                    onClick={() => {
                        setJumpToPageInput(String(pageNumber));
                        setIsJumpingToPage(true);
                    }}
                >
                    {`${pageNumber} / ${numPages}`}
                </Button>
            ) : (
                <Input
                    type="number"
                    value={jumpToPageInput}
                    onChange={(e) => setJumpToPageInput(e.target.value)}
                    onKeyDown={handleJumpToPage}
                    onBlur={() => setIsJumpingToPage(false)}
                    className="w-20 h-8 text-center bg-input"
                    autoFocus
                    placeholder={t.jumpToPage}
                />
            )}
            
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full" onClick={goToNextPage} disabled={(settings.pageLayout === 'single' ? pageNumber >= numPages : pageNumber >= numPages - 1)}><ChevronRight className="h-5 w-5" /></Button>
          </>)}
          {book?.type === 'pdf' && <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full" onClick={toggleBookmark} title={isCurrentPageBookmarked ? t.removeBookmark : t.addBookmark}><Bookmark className={cn("h-5 w-5", isCurrentPageBookmarked && "fill-current text-primary")} /></Button>}
          {book?.type === 'pdf' && <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full" onClick={handleCopyPageText} title={t.copyPageTextAsMarkdown}><Copy className="h-5 w-5" /></Button>}
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full" onClick={() => setIsSettingsOpen(prev => !prev)} disabled={!book}><Settings className="h-5 w-5" /></Button>
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full" onClick={toggleFullscreen} title={isFullscreen ? t.exitFullscreen : t.fullscreen}>{isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}</Button>
        </div>
      </div>
      <BookmarkPanel 
        isOpen={isBookmarkPanelOpen}
        onClose={() => setIsBookmarkPanelOpen(false)}
        bookmarks={bookmarks}
        onGoToPage={goToPage}
        onRemoveBookmark={removeBookmark}
        translations={{title: t.bookmarks}}
       />
    </div>
  );
}

    