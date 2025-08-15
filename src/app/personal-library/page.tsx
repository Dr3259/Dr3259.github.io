
"use client";

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Library, Plus, Trash2, Book, Bookmark } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { saveBook, getBooksMetadata, deleteBookContent, type BookMetadata, type BookWithContent } from '@/lib/db';


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
    importSuccess: '书籍导入成功！',
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
    importSuccess: 'Book imported successfully!',
    readBook: 'Read this book',
  }
};

type LanguageKey = keyof typeof translations;

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
    
    getBooksMetadata().then(metadata => {
        setBooks(metadata);
    }).catch(error => {
        console.error("Failed to load book metadata from DB", error);
    });

    setIsMounted(true);
  }, []);

  const t = useMemo(() => translations[currentLanguage], [currentLanguage]);

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileType = file.name.endsWith('.pdf') ? 'pdf' : file.name.endsWith('.txt') ? 'txt' : null;

    if (!fileType) {
      toast({ title: t.importError, variant: 'destructive' });
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const content = e.target?.result as string;
      const bookId = `book-${Date.now()}`;
      
      const newBook: BookWithContent = {
        id: bookId,
        title: file.name.replace(/\.(txt|pdf)$/, ''),
        type: fileType,
        content: content,
        bookmarks: [],
      };

      try {
        await saveBook(newBook);
        setBooks(prevBooks => [...prevBooks, { id: newBook.id, title: newBook.title, type: newBook.type, bookmarks: [] }]);
        toast({ title: t.importSuccess });
      } catch (error) {
        console.error("Failed to save book to IndexedDB", error);
        toast({ title: "Error saving book", variant: 'destructive' });
      }
      
      // Navigate to the reader page immediately after import
      router.push(`/personal-library/${bookId}`);
    };
    reader.onerror = () => {
        toast({ title: t.importError, variant: 'destructive' });
    }

    reader.readAsDataURL(file);
    
    event.target.value = '';
  };
  
  const handleBookSelect = (bookId: string) => {
      router.push(`/personal-library/${bookId}`);
  }

  const deleteBook = async (bookId: string) => {
    const bookToDelete = books.find(b => b.id === bookId);
    if (!bookToDelete) return;

    if (window.confirm(t.deleteConfirmation(bookToDelete.title))) {
        try {
            await deleteBookContent(bookId);
            setBooks(prev => prev.filter(b => b.id !== bookId));
            toast({ title: t.bookDeleted });
        } catch (error) {
            console.error("Failed to delete book", error);
            toast({ title: "Error deleting book", variant: 'destructive' });
        }
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
                                    <div className='flex items-center space-x-2 mt-2'>
                                      <p className="text-xs text-muted-foreground uppercase bg-primary/10 px-2 py-0.5 rounded-full">{book.type}</p>
                                       {book.bookmarks && book.bookmarks.length > 0 && (
                                        <div className='flex items-center text-xs text-muted-foreground bg-amber-400/10 px-2 py-0.5 rounded-full'>
                                          <Bookmark className="h-3 w-3 mr-1 text-amber-500"/>
                                          <span>{book.bookmarks.length}</span>
                                        </div>
                                      )}
                                    </div>
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
