
"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Library, Plus, Trash2, FileText, Settings, Type, Sun, Moon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const translations = {
  'zh-CN': {
    pageTitle: '个人图书馆',
    backButton: '返回休闲驿站',
    bookshelfTitle: '我的书架',
    importBook: '导入书籍',
    noBooks: '您的书架是空的。',
    readingAreaPrompt: '请从书架选择一本书开始阅读。',
    deleteBook: '删除书籍',
    deleteConfirmation: (title: string) => `您确定要删除《${title}》吗？`,
    bookDeleted: '书籍已删除',
    importError: '导入书籍失败，请确保文件是 .txt 格式。',
    settings: '阅读设置',
    fontSize: '字号',
    theme: '主题',
    lightTheme: '浅色',
    darkTheme: '深色',
  },
  'en': {
    pageTitle: 'Personal Library',
    backButton: 'Back to Rest Stop',
    bookshelfTitle: 'My Bookshelf',
    importBook: 'Import Book',
    noBooks: 'Your bookshelf is empty.',
    readingAreaPrompt: 'Select a book from your shelf to start reading.',
    deleteBook: 'Delete Book',
    deleteConfirmation: (title: string) => `Are you sure you want to delete "${title}"?`,
    bookDeleted: 'Book has been deleted.',
    importError: 'Failed to import book. Please ensure it is a .txt file.',
    settings: 'Reading Settings',
    fontSize: 'Font Size',
    theme: 'Theme',
    lightTheme: 'Light',
    darkTheme: 'Dark',
  }
};

type LanguageKey = keyof typeof translations;

interface Book {
  id: string;
  title: string;
  content: string;
}

interface ReadingSettings {
  fontSize: number;
  theme: 'light' | 'dark';
}

const LOCAL_STORAGE_BOOKS_KEY = 'personal_library_books';
const LOCAL_STORAGE_SETTINGS_KEY = 'personal_library_settings';

export default function PersonalLibraryPage() {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageKey>('en');
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const [settings, setSettings] = useState<ReadingSettings>({ fontSize: 16, theme: 'light' });
  const [isMounted, setIsMounted] = useState(false);
  const { toast } = useToast();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      const browserLang: LanguageKey = navigator.language.toLowerCase().startsWith('zh') ? 'zh-CN' : 'en';
      setCurrentLanguage(browserLang);
    }
    
    // Load data from localStorage
    try {
      const savedBooks = localStorage.getItem(LOCAL_STORAGE_BOOKS_KEY);
      if (savedBooks) setBooks(JSON.parse(savedBooks));

      const savedSettings = localStorage.getItem(LOCAL_STORAGE_SETTINGS_KEY);
      if (savedSettings) setSettings(JSON.parse(savedSettings));
    } catch (error) {
      console.error("Failed to load data from localStorage", error);
    }
    setIsMounted(true);
  }, []);

  const t = useMemo(() => translations[currentLanguage], [currentLanguage]);

  // Save books to localStorage whenever they change
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem(LOCAL_STORAGE_BOOKS_KEY, JSON.stringify(books));
    }
  }, [books, isMounted]);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem(LOCAL_STORAGE_SETTINGS_KEY, JSON.stringify(settings));
    }
  }, [settings, isMounted]);


  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !file.name.endsWith('.txt')) {
      toast({ title: t.importError, variant: 'destructive' });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const newBook: Book = {
        id: `book-${Date.now()}`,
        title: file.name.replace('.txt', ''),
        content: content,
      };
      setBooks(prevBooks => [...prevBooks, newBook]);
      setSelectedBookId(newBook.id);
    };
    reader.onerror = () => {
        toast({ title: t.importError, variant: 'destructive' });
    }
    reader.readAsText(file, 'UTF-8');
  };

  const deleteBook = (bookId: string) => {
    const bookToDelete = books.find(b => b.id === bookId);
    if (!bookToDelete) return;

    if (window.confirm(t.deleteConfirmation(bookToDelete.title))) {
        setBooks(prev => prev.filter(b => b.id !== bookId));
        if (selectedBookId === bookId) {
            setSelectedBookId(null);
        }
        toast({ title: t.bookDeleted });
    }
  };
  
  const updateSettings = (newSettings: Partial<ReadingSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const selectedBook = useMemo(() => books.find(b => b.id === selectedBookId), [books, selectedBookId]);

  if (!isMounted) {
      return (
          <div className="flex flex-col min-h-screen bg-background text-foreground py-8 sm:py-12 px-4 items-center justify-center">
            <p className="text-muted-foreground">Loading Library...</p>
          </div>
      );
  }

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <header className="flex items-center justify-between p-4 border-b shrink-0">
        <div className="flex items-center gap-4">
            <Link href="/rest" passHref>
                <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t.backButton}
                </Button>
            </Link>
            <h1 className="text-xl font-headline font-semibold text-primary hidden sm:block">
            {t.pageTitle}
            </h1>
        </div>
        
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                    <Settings className="mr-2 h-4 w-4" />
                    {t.settings}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64">
                <div className="grid gap-4">
                    <div className="space-y-2">
                        <h4 className="font-medium leading-none">{t.fontSize}</h4>
                        <Slider
                            defaultValue={[settings.fontSize]}
                            min={12}
                            max={24}
                            step={1}
                            onValueChange={(value) => updateSettings({ fontSize: value[0] })}
                        />
                    </div>
                     <div className="space-y-2">
                        <h4 className="font-medium leading-none">{t.theme}</h4>
                        <div className="grid grid-cols-2 gap-2">
                            <Button variant={settings.theme === 'light' ? 'default' : 'outline'} onClick={() => updateSettings({ theme: 'light' })}>
                                <Sun className="mr-2 h-4 w-4"/> {t.lightTheme}
                            </Button>
                             <Button variant={settings.theme === 'dark' ? 'default' : 'outline'} onClick={() => updateSettings({ theme: 'dark' })}>
                                <Moon className="mr-2 h-4 w-4"/> {t.darkTheme}
                            </Button>
                        </div>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
      </header>

      <div className="flex flex-1 min-h-0">
        {/* Bookshelf Panel */}
        <aside className="w-1/3 max-w-xs min-w-[250px] border-r flex flex-col">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">{t.bookshelfTitle}</h2>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-2">
              {books.length > 0 ? (
                books.map(book => (
                  <Card 
                    key={book.id}
                    className={cn(
                        "p-3 cursor-pointer group hover:bg-accent transition-colors",
                        selectedBookId === book.id && "bg-accent border-primary"
                    )}
                    onClick={() => setSelectedBookId(book.id)}
                  >
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-muted-foreground"/>
                            <p className="font-medium text-sm truncate" title={book.title}>{book.title}</p>
                        </div>
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive"
                            onClick={(e) => { e.stopPropagation(); deleteBook(book.id); }}
                            aria-label={t.deleteBook}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                  </Card>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">{t.noBooks}</p>
              )}
            </div>
          </ScrollArea>
          <div className="p-4 border-t">
            <input
                type="file"
                accept=".txt"
                ref={fileInputRef}
                onChange={handleFileImport}
                className="hidden"
            />
            <Button className="w-full" onClick={() => fileInputRef.current?.click()}>
              <Plus className="mr-2 h-4 w-4"/>
              {t.importBook}
            </Button>
          </div>
        </aside>

        {/* Reading Panel */}
        <main className={cn(
            "flex-1 flex flex-col transition-colors",
            settings.theme === 'dark' ? 'bg-gray-800 text-gray-200' : 'bg-gray-50 text-gray-800'
        )}>
          {selectedBook ? (
            <div className="flex-1 flex flex-col min-h-0">
                <div className="p-4 border-b text-center shrink-0"
                  style={{
                    backgroundColor: settings.theme === 'dark' ? 'hsl(222, 12%, 18%)' : 'hsl(0, 0%, 98%)',
                    borderColor: settings.theme === 'dark' ? 'hsl(222, 12%, 25%)' : 'hsl(0, 0%, 93%)',
                  }}
                >
                    <h3 className="font-semibold text-lg truncate" title={selectedBook.title}>{selectedBook.title}</h3>
                </div>
                <ScrollArea className="flex-1 p-6 md:p-8 lg:p-12">
                    <p 
                        className="whitespace-pre-wrap leading-relaxed"
                        style={{ fontSize: `${settings.fontSize}px` }}
                    >
                        {selectedBook.content}
                    </p>
                </ScrollArea>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <Library className="mx-auto h-12 w-12 mb-4" />
                <p>{t.readingAreaPrompt}</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
