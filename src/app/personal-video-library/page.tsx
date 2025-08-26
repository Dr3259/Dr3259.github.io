
"use client";

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileVideo, Download, Clapperboard, Loader2, Star, Tag, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { scrapeMovieHeaven, type MovieHeavenItem } from '@/ai/flows/movie-heaven-scraper-flow';
import { ScrollArea } from '@/components/ui/scroll-area';


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
    loadingMovies: '正在加载最新电影...',
    loadError: '加载失败，请稍后再试。'
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
    loadingMovies: 'Loading latest movies...',
    loadError: 'Failed to load, please try again later.'
  }
};

type LanguageKey = keyof typeof translations;

const MovieParadiseViewer = ({ t }: { t: (typeof translations)['zh-CN'] }) => {
    const [movies, setMovies] = useState<MovieHeavenItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const results = await scrapeMovieHeaven();
                setMovies(results);
            } catch (err) {
                console.error("Failed to scrape Movie Heaven:", err);
                setError(t.loadError);
            } finally {
                setIsLoading(false);
            }
        };
        fetchMovies();
    }, [t.loadError]);

    return (
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
            <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl">
                   <Clapperboard className="h-6 w-6 text-primary/80" />
                   {t.movieParadiseTitle}
                </CardTitle>
                <CardDescription>{t.movieParadiseDescription}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex-grow flex flex-col">
                <div className="flex-grow bg-muted/20 rounded-lg border flex items-center justify-center">
                    {isLoading ? (
                        <div className="flex flex-col items-center gap-2 text-muted-foreground p-4">
                            <Loader2 className="w-8 h-8 animate-spin" />
                            <p>{t.loadingMovies}</p>
                        </div>
                    ) : error ? (
                        <p className="text-destructive p-4">{error}</p>
                    ) : (
                        <ScrollArea className="h-72 w-full">
                            <ul className="p-3 space-y-4">
                                {movies.map((movie, index) => (
                                    <li key={index} className="text-sm p-3 rounded-md border bg-background/50 hover:bg-accent/50 transition-colors">
                                        <h4 className="font-semibold text-foreground mb-1.5" title={movie.title}>{movie.title}</h4>
                                        {movie.shortIntro && (
                                            <p className="text-xs text-muted-foreground mb-2 line-clamp-2" title={movie.shortIntro}>{movie.shortIntro}</p>
                                        )}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                                {movie.rating && <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 text-amber-500"/> {movie.rating}</span>}
                                                {movie.tags && <span className="flex items-center gap-1"><Tag className="h-3.5 w-3.5"/> {movie.tags}</span>}
                                            </div>
                                            <Button asChild size="sm" variant="ghost" className="h-8" onClick={(e) => e.stopPropagation()}>
                                                <a href={movie.downloadUrl} target="_blank" rel="noopener noreferrer">
                                                    <Download className="h-4 w-4" />
                                                </a>
                                            </Button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </ScrollArea>
                    )}
               </div>
            </CardContent>
        </Card>
    )
}

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

                <MovieParadiseViewer t={t} />
            </div>
        </main>
    </div>
  );
}
