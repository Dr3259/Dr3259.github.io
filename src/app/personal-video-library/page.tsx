
"use client";

import React, { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileVideo, Download, PlayCircle, PlusCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';


const translations = {
  'zh-CN': {
    pageTitle: '个人视频库',
    backButton: '返回休闲驿站',
    localVideosTitle: '本地视频',
    localVideosDescription: '管理和播放您的本地视频文件。',
    importLocalButton: '导入本地视频',
    resourceAcquisitionTitle: '资源获取下载',
    resourceAcquisitionDescription: '发现和获取新的视频资源。',
    searchPlaceholder: '输入视频名称或链接...',
    searchButton: '获取资源',
    comingSoon: '此功能正在开发中，敬请期待！',
    emptyLibrary: '您的视频库是空的。',
  },
  'en': {
    pageTitle: 'Personal Video Library',
    backButton: 'Back to Rest Stop',
    localVideosTitle: 'Local Videos',
    localVideosDescription: 'Manage and play your local video files.',
    importLocalButton: 'Import Local Videos',
    resourceAcquisitionTitle: 'Resource Acquisition & Download',
    resourceAcquisitionDescription: 'Discover and acquire new video resources.',
    searchPlaceholder: 'Enter video name or link...',
    searchButton: 'Acquire Resource',
    comingSoon: 'This feature is under development, coming soon!',
    emptyLibrary: 'Your video library is empty.',
  }
};

type LanguageKey = keyof typeof translations;

export default function PersonalVideoLibraryPage() {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageKey>('en');
  const [localFiles, setLocalFiles] = useState<File[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const browserLang: LanguageKey = navigator.language.toLowerCase().startsWith('zh') ? 'zh-CN' : 'en';
    setCurrentLanguage(browserLang);
  }, []);

  const t = useMemo(() => translations[currentLanguage], [currentLanguage]);

  const handleComingSoon = () => {
    toast({
      description: t.comingSoon,
      duration: 3000,
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground py-8 sm:py-12 px-4 items-center">
        <header className="w-full max-w-5xl mb-6 sm:mb-8">
            <Link href="/rest" passHref>
                <Button variant="outline" size="sm">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    {t.backButton}
                </Button>
            </Link>
        </header>

        <main className="w-full max-w-5xl flex flex-col items-center">
            <div className="text-center mb-8">
                <h1 className="text-3xl sm:text-4xl font-headline font-semibold text-primary">
                    {t.pageTitle}
                </h1>
            </div>

            <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Local Videos Module */}
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                           <FileVideo className="h-6 w-6 text-primary/80" />
                           {t.localVideosTitle}
                        </CardTitle>
                        <CardDescription>{t.localVideosDescription}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                       <Button className="w-full" onClick={handleComingSoon}>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            {t.importLocalButton}
                       </Button>
                       <div className="h-64 flex items-center justify-center bg-muted rounded-md">
                           <p className="text-muted-foreground">{t.emptyLibrary}</p>
                       </div>
                    </CardContent>
                </Card>

                {/* Resource Acquisition Module */}
                <Card className="shadow-lg">
                     <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                           <Download className="h-6 w-6 text-primary/80" />
                           {t.resourceAcquisitionTitle}
                        </CardTitle>
                        <CardDescription>{t.resourceAcquisitionDescription}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex gap-2">
                            <Input
                                placeholder={t.searchPlaceholder}
                                className="h-10"
                                onFocus={handleComingSoon}
                            />
                            <Button className="h-10" onClick={handleComingSoon}>{t.searchButton}</Button>
                        </div>
                        <div className="h-64 flex items-center justify-center bg-muted rounded-md">
                           <p className="text-muted-foreground">{t.comingSoon}</p>
                       </div>
                    </CardContent>
                </Card>
            </div>
        </main>
    </div>
  );
}
