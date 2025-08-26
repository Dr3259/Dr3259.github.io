
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Bookmark, Folder, PlusCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

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
  }
};

type LanguageKey = keyof typeof translations;

export default function OrganizePage() {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageKey>('en');

  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      const browserLang: LanguageKey = navigator.language.toLowerCase().startsWith('zh') ? 'zh-CN' : 'en';
      setCurrentLanguage(browserLang);
    }
  }, []);

  const t = useMemo(() => translations[currentLanguage], [currentLanguage]);
  
  const handleImportClick = () => {
      // Placeholder for file input logic
      alert('Bookmark import functionality will be implemented here.');
  }
  
  const handleAddFolderClick = () => {
      // Placeholder for folder picker logic
      alert('Add folder shortcut functionality will be implemented here.');
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
                    <div className="flex items-center gap-3 mb-2">
                        <Bookmark className="w-6 h-6 text-primary"/>
                        <CardTitle className="text-xl">{t.bookmarksTitle}</CardTitle>
                    </div>
                    <CardDescription>{t.bookmarksDescription}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-48 flex flex-col items-center justify-center bg-muted/50 rounded-lg p-4 text-center">
                        <p className="text-sm text-muted-foreground mb-4">{t.comingSoon}</p>
                        <Button onClick={handleImportClick}>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            {t.importBookmarks}
                        </Button>
                    </div>
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
                    <div className="h-48 flex flex-col items-center justify-center bg-muted/50 rounded-lg p-4 text-center">
                         <p className="text-sm text-muted-foreground mb-4">{t.comingSoon}</p>
                        <Button onClick={handleAddFolderClick}>
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
