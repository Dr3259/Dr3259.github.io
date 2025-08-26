
"use client";

import React, { useState, useEffect, useMemo, useRef, type DragEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Bookmark, Folder, PlusCircle, Trash2, ChevronRight, FolderOpen, Link as LinkIcon, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Input } from '@/components/ui/input';

const translations = {
  'zh-CN': {
    pageTitle: '整理中心',
    pageDescription: '管理您的书签和数字资产。',
    backButton: '返回主页',
    bookmarksTitle: '书签管理助手',
    importBookmarks: '导入HTML文件',
    addFolderBtn: '添加文件夹',
    addItemNamePlaceholder: '名称...',
    addItemUrlPlaceholder: '链接 (可选, 留空则为文件夹)',
    addItemBtn: '新增',
    guideTitle: '从导入或新增开始',
    guideDescription: '您可以导入一个浏览器书签HTML文件，或者手动添加新的书签和文件夹。',
    deleteConfirmation: '您确定要删除这个项目吗？'
  },
  'en': {
    pageTitle: 'Organization Hub',
    pageDescription: 'Manage your bookmarks and digital assets.',
    backButton: 'Back to Home',
    bookmarksTitle: 'Bookmark Manager',
    importBookmarks: 'Import HTML File',
    addFolderBtn: 'Add Folder',
    addItemNamePlaceholder: 'Name...',
    addItemUrlPlaceholder: 'URL (optional, creates folder)',
    addItemBtn: 'Add',
    guideTitle: 'Start by Importing or Adding',
    guideDescription: 'You can import a browser bookmarks HTML file, or manually add new bookmarks and folders.',
    deleteConfirmation: 'Are you sure you want to delete this item?'
  }
};

type LanguageKey = keyof typeof translations;

interface BookmarkNodeData {
  id: string;
  type: 'folder' | 'bookmark';
  name: string;
  url?: string;
  children?: BookmarkNodeData[];
}

// Robust parser based on user feedback and correct HTML structure understanding.
const parseBookmarks = (htmlString: string): BookmarkNodeData[] => {
    if (typeof window === 'undefined') return [];
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    const firstDl = doc.body.querySelector('dl');

    if (!firstDl) {
        console.warn("No <DL> tag found in the document body.");
        return [];
    }

    const parseDl = (dlElement: HTMLDListElement): BookmarkNodeData[] => {
        const items: BookmarkNodeData[] = [];
        // Directly iterate over children to be more robust
        const children = Array.from(dlElement.children);

        for (let i = 0; i < children.length; i++) {
            const child = children[i];
            if (child.tagName !== 'DT') continue;

            const childNode = child.firstElementChild;
            if (!childNode) continue;

            const id = `item-${Date.now()}-${Math.random()}`;

            if (childNode.tagName === 'H3') {
                const nextElement = children[i + 1];
                let nestedChildren: BookmarkNodeData[] = [];

                if (nextElement && nextElement.tagName === 'DL') {
                    nestedChildren = parseDl(nextElement as HTMLDListElement);
                    i++; // Crucially, skip the next element as it has been processed
                }
                
                items.push({
                    id,
                    type: 'folder',
                    name: childNode.textContent?.trim() || 'Untitled Folder',
                    children: nestedChildren,
                });
            } else if (childNode.tagName === 'A') {
                items.push({
                    id,
                    type: 'bookmark',
                    name: childNode.textContent?.trim() || 'Untitled Link',
                    url: (childNode as HTMLAnchorElement).href,
                });
            }
        }
        return items;
    };

    return parseDl(firstDl);
};


// --- Bookmark Tree Renderer ---
const BookmarkTree: React.FC<{ 
    nodes: BookmarkNodeData[];
    onDelete: (id: string) => void;
    t: any;
}> = ({ nodes, onDelete, t }) => {

  const [openFolders, setOpenFolders] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Automatically expand the top-level folders upon initial load
    const topLevelFolderIds = nodes
      .filter(node => node.type === 'folder')
      .map(node => node.id);
    setOpenFolders(new Set(topLevelFolderIds));
  }, [nodes]);

  const toggleFolder = (id: string) => {
    setOpenFolders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const renderNode = (node: BookmarkNodeData): JSX.Element | null => {
    const isOpen = openFolders.has(node.id);

    if (node.type === 'folder') {
      return (
        <li key={node.id} data-id={node.id} data-type="folder" className="my-1.5">
          <div className="flex items-center gap-1 p-2 rounded-md hover:bg-muted/60 group">
             <button onClick={() => toggleFolder(node.id)} className="flex items-center gap-2 flex-grow min-w-0">
                <ChevronRight className={cn("h-4 w-4 shrink-0 transition-transform", isOpen && "rotate-90")} />
                {isOpen ? <FolderOpen className="h-5 w-5 text-primary" /> : <Folder className="h-5 w-5 text-primary" />}
                <span className="font-semibold text-sm truncate">{node.name}</span>
            </button>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100" onClick={() => { if(window.confirm(t.deleteConfirmation)) onDelete(node.id) }}>
                <Trash2 className="h-4 w-4"/>
            </Button>
          </div>
          {isOpen && node.children && (
            <ul className="pl-6 border-l-2 ml-3 border-dashed border-border">
                {node.children.map(child => renderNode(child))}
            </ul>
          )}
        </li>
      );
    }

    if (node.type === 'bookmark') {
      return (
         <li key={node.id} data-id={node.id} data-type="bookmark" className="my-1.5 list-none ml-2">
            <div className="flex items-center gap-1 p-2 rounded-md hover:bg-muted/60 group">
                <a 
                    href={node.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 flex-grow min-w-0"
                >
                  <Image src={`https://www.google.com/s2/favicons?domain=${node.url}&sz=32`} alt="" width={16} height={16} className="shrink-0"/>
                  <span className="text-sm truncate text-foreground/80 hover:text-foreground">{node.name}</span>
                </a>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100" onClick={() => { if(window.confirm(t.deleteConfirmation)) onDelete(node.id) }}>
                    <Trash2 className="h-4 w-4"/>
                </Button>
            </div>
        </li>
      );
    }
    return null;
  };

  return <ul className="space-y-1">{nodes.map(node => renderNode(node))}</ul>;
};

// --- Main Page Component ---
export default function OrganizePage() {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageKey>('en');
  const [bookmarks, setBookmarks] = useState<BookmarkNodeData[]>([]);
  const [newItemName, setNewItemName] = useState('');
  const [newItemUrl, setNewItemUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const browserLang: LanguageKey = navigator.language.toLowerCase().startsWith('zh') ? 'zh-CN' : 'en';
    setCurrentLanguage(browserLang);
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
        if (!content) {
            toast({ title: "Import error", variant: 'destructive', description: "File is empty or could not be read." });
            return;
        }
        const parsedBookmarks = parseBookmarks(content);
        if (parsedBookmarks.length === 0) {
           toast({ title: "Import failed", variant: 'destructive', description: "No valid bookmarks found. The file might be empty or in an unsupported format." });
           return;
        }
        setBookmarks(parsedBookmarks);
        toast({ title: "Bookmarks imported successfully!" });
      } catch (error) {
        console.error("Bookmark parsing error:", error);
        toast({ title: "Import error", variant: 'destructive', description: "An error occurred while parsing the file."});
      }
    };
    reader.onerror = () => {
        toast({ title: "File read error", variant: "destructive" });
    }

    reader.readAsText(file);
    event.target.value = '';
  };

  const handleAddItem = () => {
    if (!newItemName.trim()) return;
    
    const isFolder = !newItemUrl.trim();
    const newItem: BookmarkNodeData = {
        id: `manual-${Date.now()}`,
        type: isFolder ? 'folder' : 'bookmark',
        name: newItemName.trim(),
        url: isFolder ? undefined : newItemUrl.trim(),
        children: isFolder ? [] : undefined
    };

    setBookmarks(prev => [...prev, newItem]);
    setNewItemName('');
    setNewItemUrl('');
  }

  const findAndDelete = (nodes: BookmarkNodeData[], id: string): BookmarkNodeData[] => {
    return nodes.filter(node => {
        if (node.id === id) return false;
        if (node.children) {
            node.children = findAndDelete(node.children, id);
        }
        return true;
    });
  }

  const handleDeleteItem = (id: string) => {
    setBookmarks(prev => findAndDelete([...prev], id));
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
        
        <Card className="shadow-lg w-full">
            <CardHeader>
                <div className="flex items-center justify-between gap-3 mb-2 flex-wrap">
                    <div className="flex items-center gap-3">
                       <Bookmark className="w-6 h-6 text-primary"/>
                       <CardTitle className="text-xl">{t.bookmarksTitle}</CardTitle>
                    </div>
                     <Button onClick={handleImportClick} size="sm" variant="outline">
                         <PlusCircle className="mr-2 h-4 w-4" />
                         {t.importBookmarks}
                     </Button>
                </div>
                <div className="flex gap-2 items-center flex-wrap pt-4 border-t">
                    <Input value={newItemName} onChange={e => setNewItemName(e.target.value)} placeholder={t.addItemNamePlaceholder} className="h-9 flex-grow min-w-[150px]"/>
                    <Input value={newItemUrl} onChange={e => setNewItemUrl(e.target.value)} placeholder={t.addItemUrlPlaceholder} className="h-9 flex-grow min-w-[150px]"/>
                    <Button onClick={handleAddItem} size="sm" className="h-9">{t.addItemBtn}</Button>
                </div>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[32rem] rounded-lg border bg-muted/20 p-3">
                  {bookmarks.length > 0 ? (
                    <BookmarkTree nodes={bookmarks} onDelete={handleDeleteItem} t={t} />
                  ) : (
                    <div className="flex items-center justify-center h-full text-center text-muted-foreground">
                        <div>
                            <h3 className="font-semibold text-lg text-foreground">{t.guideTitle}</h3>
                            <p className="mt-1">{t.guideDescription}</p>
                        </div>
                    </div>
                  )}
                </ScrollArea>
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
