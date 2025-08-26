
"use client";

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileVideo, Download, Clapperboard } from 'lucide-react';
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
    movieParadiseTitle: '电影天堂 资源查看器',
    movieParadiseDescription: '直接浏览和搜索电影天堂的资源。',
    comingSoon: '此功能正在开发中，敬请期待！',
    emptyLibrary: '您的视频库是空的。',
  },
  'en': {
    pageTitle: 'Personal Video Library',
    backButton: 'Back to Rest Stop',
    localVideosTitle: 'Local Videos',
    localVideosDescription: 'Manage and play your local video files.',
    importLocalButton: 'Import Local Videos',
    resourceAcquisitionTitle: 'Resource Acquisition',
    resourceAcquisitionDescription: 'Discover and acquire new video resources.',
    searchPlaceholder: 'Enter video name or link...',
    searchButton: 'Acquire',
    movieParadiseTitle: 'Movie Paradise Viewer',
    movieParadiseDescription: 'Directly browse and search resources from Movie Paradise.',
    comingSoon: 'This feature is under development, coming soon!',
    emptyLibrary: 'Your video library is empty.',
  }
};

type LanguageKey = keyof typeof translations;

export default function PersonalVideoLibraryPage() {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageKey>('en');
  const { toast } = useToast();

  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      const browserLang: LanguageKey = navigator.language.toLowerCase().startsWith('zh') ? 'zh-CN' : 'en';
      setCurrentLanguage(browserLang);
    }
  }, []);

  const t = useMemo(() => translations[currentLanguage], [currentLanguage]);

  const handleComingSoon = () => {
    toast({
      description: t.comingSoon,
      duration: 3000,
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground py-10 px-4 sm:px-8 items-center">
        <header className="w-full max-w-6xl mb-8 self-center">
            <Link href="/rest" passHref>
                <Button variant="outline" size="sm">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    {t.backButton}
                </Button>
            </Link>
        </header>

        <main className="w-full max-w-6xl flex flex-col items-center">
            <div className="text-center mb-10">
                <h1 className="text-3xl sm:text-4xl font-headline font-semibold text-primary">
                    {t.pageTitle}
                </h1>
            </div>

            <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Local Videos Module */}
                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3 text-xl">
                           <FileVideo className="h-6 w-6 text-primary/80" />
                           {t.localVideosTitle}
                        </CardTitle>
                        <CardDescription>{t.localVideosDescription}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 flex-grow flex flex-col">
                       <Button className="w-full h-11 text-base" onClick={handleComingSoon}>
                            {t.importLocalButton}
                       </Button>
                       <div className="flex-grow flex items-center justify-center bg-muted/50 rounded-lg border border-dashed">
                           <p className="text-muted-foreground">{t.emptyLibrary}</p>
                       </div>
                    </CardContent>
                </Card>

                {/* Resource Acquisition Module */}
                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
                     <CardHeader>
                        <CardTitle className="flex items-center gap-3 text-xl">
                           <Download className="h-6 w-6 text-primary/80" />
                           {t.resourceAcquisitionTitle}
                        </CardTitle>
                        <CardDescription>{t.resourceAcquisitionDescription}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 flex-grow flex flex-col">
                        <div className="flex gap-2">
                            <Input
                                placeholder={t.searchPlaceholder}
                                className="h-11 text-base flex-grow"
                                onFocus={handleComingSoon}
                            />
                            <Button className="h-11 px-6" onClick={handleComingSoon}>{t.searchButton}</Button>
                        </div>
                        <div className="flex-grow flex items-center justify-center bg-muted/50 rounded-lg border border-dashed">
                           <p className="text-muted-foreground">{t.comingSoon}</p>
                       </div>
                    </CardContent>
                </Card>

                {/* Movie Paradise Module */}
                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
                     <CardHeader>
                        <CardTitle className="flex items-center gap-3 text-xl">
                           <Clapperboard className="h-6 w-6 text-primary/80" />
                           {t.movieParadiseTitle}
                        </CardTitle>
                        <CardDescription>{t.movieParadiseDescription}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 flex-grow flex flex-col">
                        <div className="flex-grow flex items-center justify-center bg-muted/50 rounded-lg border border-dashed">
                           <p className="text-muted-foreground">{t.comingSoon}</p>
                       </div>
                    </CardContent>
                </Card>
            </div>
        </main>
    </div>
  );
}
