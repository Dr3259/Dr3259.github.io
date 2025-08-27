
"use client";

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, ServerCrash, Download, Film } from 'lucide-react';
import { scrapeMovieHeaven, type MovieHeavenItem } from '@/ai/flows/movie-heaven-scraper-flow';
import copy from 'copy-to-clipboard';
import { useToast } from '@/hooks/use-toast';

const translations = {
  'zh-CN': {
    movieHeavenTitle: '电影天堂资源查看器',
    loadingHeaven: '正在加载电影天堂最新资源...',
    errorHeaven: '加载电影天堂资源失败，请稍后重试。',
    copyLink: '复制下载链接',
    linkCopied: '链接已复制！',
    rating: '评分',
    tags: '标签',
    intro: '简介',
  },
  'en': {
    movieHeavenTitle: 'Movie Heaven Viewer',
    loadingHeaven: 'Loading latest movies from Movie Heaven...',
    errorHeaven: 'Failed to load resources from Movie Heaven. Please try again later.',
    copyLink: 'Copy Download Link',
    linkCopied: 'Link copied!',
    rating: 'Rating',
    tags: 'Tags',
    intro: 'Intro',
  }
};

type LanguageKey = keyof typeof translations;

export const MovieHeavenViewer = () => {
    const [currentLanguage, setCurrentLanguage] = useState<LanguageKey>('en');
    const [movies, setMovies] = useState<MovieHeavenItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();
    
    useEffect(() => {
        if (typeof navigator !== 'undefined') {
          const browserLang: LanguageKey = navigator.language.toLowerCase().startsWith('zh') ? 'zh-CN' : 'en';
          setCurrentLanguage(browserLang);
        }
    }, []);
    
    const t = useMemo(() => translations[currentLanguage], [currentLanguage]);

    useEffect(() => {
        const fetchMovies = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const results = await scrapeMovieHeaven();
                setMovies(results);
            } catch (err: any) {
                setError(err.message || t.errorHeaven);
            } finally {
                setIsLoading(false);
            }
        };
        fetchMovies();
    }, [t.errorHeaven]);

    const handleCopy = (url: string) => {
        copy(url);
        toast({ title: t.linkCopied, duration: 2000 });
    }

    if (isLoading) {
        return (
            <div className="text-center py-10 text-muted-foreground flex items-center justify-center">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                {t.loadingHeaven}
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-10 text-destructive flex items-center justify-center">
                 <ServerCrash className="mr-2 h-5 w-5" />
                {error}
            </div>
        );
    }
    
    return (
        <Card className="w-full max-w-4xl mx-auto shadow-lg">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                    <Film className="text-primary"/>
                    {t.movieHeavenTitle}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {movies.map(movie => (
                        <Card key={movie.title} className="bg-card/80 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="text-lg">{movie.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm">
                                {movie.rating && <p><strong>{t.rating}:</strong> <Badge variant="secondary">{movie.rating}</Badge></p>}
                                {movie.tags && <p><strong>{t.tags}:</strong> {movie.tags}</p>}
                                {movie.shortIntro && <p className="text-muted-foreground"><strong>{t.intro}:</strong> {movie.shortIntro}</p>}
                            </CardContent>
                            <div className="p-6 pt-0">
                                 <Button onClick={() => handleCopy(movie.downloadUrl)}>
                                    <Download className="mr-2 h-4 w-4" />
                                    {t.copyLink}
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};
