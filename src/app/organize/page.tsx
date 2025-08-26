
"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Bookmark, Folder, PlusCircle, FileText, ChevronRight, FolderOpen } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

const translations = {
  'zh-CN': {
    pageTitle: '整理中心',
    pageDescription: '聚合、整理并快速访问您的数字资产。',
    backButton: '返回主页',
    bookmarksTitle: '浏览器书签助手',
    bookmarksDescription: '导入浏览器书签文件，在这里进行分类、搜索和管理。',
    importBookmarks: '导入书签HTML文件',
    foldersTitle: '本地文件夹快捷方式',
    foldersDescription: '添加常用本地文件夹的快捷方式，以便快速访问。',
    addFolder: '添加文件夹快捷方式',
    comingSoon: '功能即将上线。',
    importSuccess: '书签导入成功！',
    importError: '导入失败，请确保是有效的书签文件。',
    noBookmarksImported: '尚未导入任何书签。',
  },
  'en': {
    pageTitle: 'Organization Hub',
    pageDescription: 'Aggregate, organize, and quickly access your digital assets.',
    backButton: 'Back to Home',
    bookmarksTitle: 'Browser Bookmark Helper',
    bookmarksDescription: 'Import your browser bookmarks file to categorize, search, and manage them here.',
    importBookmarks: 'Import Bookmarks HTML',
    foldersTitle: 'Local Folder Shortcuts',
    foldersDescription: 'Add shortcuts to frequently used local folders for quick access.',
    addFolder: 'Add Folder Shortcut',
    comingSoon: 'Feature coming soon.',
    importSuccess: 'Bookmarks imported successfully!',
    importError: 'Failed to import. Please ensure it is a valid bookmarks file.',
    noBookmarksImported: 'No bookmarks have been imported yet.',
  }
};

type LanguageKey = keyof typeof translations;

interface BookmarkNode {
  type: 'folder' | 'link';
  name: string;
  url?: string;
  children?: BookmarkNode[];
}

// --- Bookmark Parser ---
const parseBookmarks = (htmlString: string): BookmarkNode[] => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    const mainDl = doc.querySelector('DL > P > DL'); // Standard structure for bookmarks file

    if (!mainDl) return [];

    const parseDl = (dlElement: HTMLDListElement): BookmarkNode[] => {
        const nodes: BookmarkNode[] = [];
        const children = Array.from(dlElement.children);

        for (let i = 0; i < children.length; i++) {
            const child = children[i];
            if (child.tagName !== 'DT') continue;

            const content = child.firstElementChild;
            if (!content) continue;

            if (content.tagName === 'H3') { // This is a folder
                const folderName = content.textContent || 'Untitled Folder';
                // The next sibling DT should contain the DL for this folder
                const nextDt = children[i + 1];
                const folderDl = nextDt?.querySelector('DL');
                
                if (folderDl) {
                    nodes.push({
                        type: 'folder',
                        name: folderName,
                        children: parseDl(folderDl),
                    });
                    i++; // Skip the DL element we just processed
                }
            } else if (content.tagName === 'A') { // This is a link
                nodes.push({
                    type: 'link',
                    name: content.textContent || 'Untitled Link',
                    url: (content as HTMLAnchorElement).href,
                });
            }
        }
        return nodes;
    };

    return parseDl(mainDl as HTMLDListElement);
};

// --- Bookmark Renderer Component ---
const BookmarkTree: React.FC<{ nodes: BookmarkNode[] }> = ({ nodes }) => {
  const [openFolders, setOpenFolders] = useState<Set<string>>(new Set());

  const toggleFolder = (path: string) => {
    setOpenFolders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(path)) {
        newSet.delete(path);
      } else {
        newSet.add(path);
      }
      return newSet;
    });
  };

  const renderNode = (node: BookmarkNode, path: string) => {
    if (node.type === 'folder') {
      const isOpen = openFolders.has(path);
      return (
        <div key={path}>
          <div 
            className="flex items-center gap-2 p-1.5 rounded-md hover:bg-muted cursor-pointer"
            onClick={() => toggleFolder(path)}
          >
            <ChevronRight className={cn("h-4 w-4 shrink-0 transition-transform", isOpen && "rotate-90")} />
            {isOpen ? <FolderOpen className="h-4 w-4 text-primary" /> : <Folder className="h-4 w-4 text-primary" />}
            <span className="font-medium text-sm truncate">{node.name}</span>
          </div>
          {isOpen && (
            <div className="pl-6 border-l ml-4">
              <BookmarkTree nodes={node.children || []} />
            </div>
          )}
        </div>
      );
    }

    if (node.type === 'link') {
      return (
        <a 
            key={node.url} 
            href={node.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 p-1.5 rounded-md hover:bg-muted ml-2"
        >
          <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
          <span className="text-sm truncate text-foreground/80 hover:text-foreground">{node.name}</span>
        </a>
      );
    }
    return null;
  };

  return <div className="space-y-1">{nodes.map((node, i) => renderNode(node, `${i}`))}</div>;
};

export default function OrganizePage() {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageKey>('en');
  const [bookmarks, setBookmarks] = useState<BookmarkNode[] | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      const browserLang: LanguageKey = navigator.language.toLowerCase().startsWith('zh') ? 'zh-CN' : 'en';
      setCurrentLanguage(browserLang);
    }
  }, []);

  const t = useMemo(() => translations[currentLanguage], [currentLanguage]);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsedBookmarks = parseBookmarks(content);
        setBookmarks(parsedBookmarks);
        toast({ title: t.importSuccess });
      } catch (error) {
        console.error("Bookmark parsing error:", error);
        toast({ title: t.importError, variant: 'destructive' });
      }
    };
    reader.readAsText(file);
    
    // Reset file input to allow importing the same file again
    event.target.value = '';
  };
  
  const handleAddFolderClick = () => {
      alert(t.comingSoon);
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground py-10 px-4 sm:px-8 items-center">
      <header className="w-full max-w-4xl mb-8 self-center">
        <Link href="/" passHref>
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t.backButton}
          </Button>
        </Link>
      </header>
      <input
        type="file"
        accept=".html"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      <main className="w-full max-w-4xl flex flex-col items-center flex-grow">
         <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl font-headline font-bold text-primary mb-3">
            {t.pageTitle}
            </h1>
            <p className="text-muted-foreground text-base max-w-2xl">
            {t.pageDescription}
            </p>
        </div>
        
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Bookmarks Section */}
            <Card className="shadow-lg">
                <CardHeader>
                    <div className="flex items-center justify-between gap-3 mb-2">
                        <div className="flex items-center gap-3">
                           <Bookmark className="w-6 h-6 text-primary"/>
                           <CardTitle className="text-xl">{t.bookmarksTitle}</CardTitle>
                        </div>
                        <Button onClick={handleImportClick} size="sm">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            {t.importBookmarks}
                        </Button>
                    </div>
                    <CardDescription>{t.bookmarksDescription}</CardDescription>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-72 rounded-lg border bg-muted/30 p-3">
                      {bookmarks ? (
                        <BookmarkTree nodes={bookmarks} />
                      ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground">
                            <p>{t.noBookmarksImported}</p>
                        </div>
                      )}
                    </ScrollArea>
                </CardContent>
            </Card>

            {/* Local Folders Section */}
            <Card className="shadow-lg">
                <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                        <Folder className="w-6 h-6 text-primary"/>
                        <CardTitle className="text-xl">{t.foldersTitle}</CardTitle>
                    </div>
                    <CardDescription>{t.foldersDescription}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-72 flex flex-col items-center justify-center bg-muted/30 rounded-lg p-4 text-center">
                         <p className="text-sm text-muted-foreground mb-4">{t.comingSoon}</p>
                        <Button onClick={handleAddFolderClick} disabled>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            {t.addFolder}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
      </main>
    </div>
  );
}
