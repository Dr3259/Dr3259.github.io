
"use client";

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Library, Plus, Trash2, FileText, Book } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';


const translations = {
  'zh-CN': {
    pageTitle: '个人图书馆',
    backButton: '返回休闲驿站',
    bookshelfTitle: '我的书架',
    importBook: '导入书籍',
    noBooks: '您的书架是空的。点击“导入书籍”来添加您的第一本书吧！',
    deleteBook: '删除书籍',
    deleteConfirmation: (title: string) => `您确定要删除《${title}》吗？`,
    bookDeleted: '书籍已删除',
    importError: '导入书籍失败，请确保文件是 .txt 或 .pdf 格式。',
    readBook: '阅读这本书',
  },
  'en': {
    pageTitle: 'Personal Library',
    backButton: 'Back to Rest Stop',
    bookshelfTitle: 'My Bookshelf',
    importBook: 'Import Book',
    noBooks: 'Your bookshelf is empty. Click "Import Book" to add your first one!',
    deleteBook: 'Delete Book',
    deleteConfirmation: (title: string) => `Are you sure you want to delete "${title}"?`,
    bookDeleted: 'Book has been deleted.',
    importError: 'Failed to import book. Please ensure it is a .txt or .pdf file.',
    readBook: 'Read this book',
  }
};

type LanguageKey = keyof typeof translations;

interface BookMetadata {
  id: string;
  title: string;
  type: 'txt' | 'pdf';
}

interface BookWithContent extends BookMetadata {
  content: string; // Data URI for both txt and pdf
}

const LOCAL_STORAGE_BOOKS_KEY = 'personal_library_books_v4_meta';
const SESSION_STORAGE_BOOK_CONTENT_PREFIX = 'personal_library_content_';


export default function PersonalLibraryListPage() {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageKey>('en');
  const [books, setBooks] = useState<BookMetadata[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const { toast } = useToast();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const router = useRouter();


  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      const browserLang: LanguageKey = navigator.language.toLowerCase().startsWith('zh') ? 'zh-CN' : 'en';
      setCurrentLanguage(browserLang);
    }
    
    try {
      const savedBooksMeta = localStorage.getItem(LOCAL_STORAGE_BOOKS_KEY);
      if (savedBooksMeta) {
        setBooks(JSON.parse(savedBooksMeta));
      }
    } catch (error) {
      console.error("Failed to load book metadata from localStorage", error);
    }
    setIsMounted(true);
  }, []);

  const t = useMemo(() => translations[currentLanguage], [currentLanguage]);

  useEffect(() => {
    if (isMounted) {
      try {
        localStorage.setItem(LOCAL_STORAGE_BOOKS_KEY, JSON.stringify(books));
      } catch (error) {
          console.error("Could not save book metadata to localStorage", error);
          toast({
              title: "Error",
              description: "Could not save book list.",
              variant: "destructive"
          });
      }
    }
  }, [books, isMounted, toast]);

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileType = file.name.endsWith('.pdf') ? 'pdf' : file.name.endsWith('.txt') ? 'txt' : null;

    if (!fileType) {
      toast({ title: t.importError, variant: 'destructive' });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const bookId = `book-${Date.now()}`;
      
      const newBookMeta: BookMetadata = {
        id: bookId,
        title: file.name.replace(/\.(txt|pdf)$/, ''),
        type: fileType,
      };

      const bookWithContent: BookWithContent = { ...newBookMeta, content };

      try {
        // Save full content to sessionStorage for immediate use
        sessionStorage.setItem(`${SESSION_STORAGE_BOOK_CONTENT_PREFIX}${bookId}`, JSON.stringify(bookWithContent));
      } catch (error) {
        console.error("Session storage error:", error);
        toast({
            title: "Could not store book content",
            description: "The book is too large to be stored in the session.",
            variant: "destructive"
        });
        return;
      }

      setBooks(prevBooks => [...prevBooks, newBookMeta]);
      
      // Navigate to the reader page immediately after import
      router.push(`/personal-library/${bookId}`);
    };
    reader.onerror = () => {
        toast({ title: t.importError, variant: 'destructive' });
    }

    // Reading as Data URL works for both text and binary files like PDF
    reader.readAsDataURL(file);
    
    // Reset file input to allow re-importing the same file
    event.target.value = '';
  };
  
  const handleBookSelect = (bookId: string) => {
      router.push(`/personal-library/${bookId}`);
  }

  const deleteBook = (bookId: string) => {
    const bookToDelete = books.find(b => b.id === bookId);
    if (!bookToDelete) return;

    if (window.confirm(t.deleteConfirmation(bookToDelete.title))) {
        setBooks(prev => prev.filter(b => b.id !== bookId));
        // Also remove from session storage if it exists
        sessionStorage.removeItem(`${SESSION_STORAGE_BOOK_CONTENT_PREFIX}${bookId}`);
        toast({ title: t.bookDeleted });
    }
  };

  if (!isMounted) {
      return (
          <div className="flex flex-col min-h-screen bg-background text-foreground py-8 sm:py-12 px-4 items-center justify-center">
            <p className="text-muted-foreground">Loading Library...</p>
          </div>
      );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground py-8 sm:py-12 px-4 items-center">
        <header className="w-full max-w-4xl mb-8 self-center flex justify-between items-center">
            <Link href="/rest" passHref>
                <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t.backButton}
                </Button>
            </Link>
            <h1 className="text-2xl font-headline font-semibold text-primary">
            {t.pageTitle}
            </h1>
            <div className="w-24"></div>
        </header>

        <main className="w-full max-w-4xl flex flex-col items-center flex-grow">
            <div className="w-full p-4 border-b mb-6 flex justify-between items-center">
                <h2 className="text-xl font-semibold">{t.bookshelfTitle}</h2>
                <input
                    type="file"
                    accept=".txt,.pdf"
                    ref={fileInputRef}
                    onChange={handleFileImport}
                    className="hidden"
                />
                <Button className="w-auto" onClick={() => fileInputRef.current?.click()}>
                    <Plus className="mr-2 h-4 w-4"/>
                    {t.importBook}
                </Button>
            </div>
            
            <ScrollArea className="w-full flex-1">
                {books.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
                        {books.map(book => (
                            <Card 
                                key={book.id}
                                className={cn("p-3 group hover:bg-accent transition-colors flex flex-col")}
                            >
                                <div 
                                    className="flex-grow flex flex-col items-center justify-center text-center cursor-pointer p-4"
                                    onClick={() => handleBookSelect(book.id)}
                                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleBookSelect(book.id); }}
                                    role="button"
                                    tabIndex={0}
                                    aria-label={`${t.readBook}: ${book.title}`}
                                >
                                    <Book className="h-16 w-16 text-primary/70 mb-4"/>
                                    <p className="font-semibold text-base leading-tight break-words" title={book.title}>{book.title}</p>
                                    <p className="text-xs text-muted-foreground mt-1 uppercase bg-primary/10 px-2 py-0.5 rounded-full">{book.type}</p>
                                </div>
                                <div className="border-t pt-2 mt-2 flex justify-end">
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                        onClick={(e) => { e.stopPropagation(); deleteBook(book.id); }}
                                        aria-label={t.deleteBook}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-full py-20">
                        <Library className="h-20 w-20 mb-6" />
                        <p className="max-w-xs">{t.noBooks}</p>
                    </div>
                )}
            </ScrollArea>
        </main>
    </div>
  );
}
