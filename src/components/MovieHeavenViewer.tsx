
"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ServerCrash, Download, Film, UploadCloud } from 'lucide-react';
import { movieHeavenData as defaultMovieData, type MovieHeavenItem } from '@/lib/data/movie-heaven-data';
import copy from 'copy-to-clipboard';
import { useToast } from '@/hooks/use-toast';

const translations = {
  'zh-CN': {
    movieHeavenTitle: '电影天堂数据库',
    copyLink: '复制下载链接',
    linkCopied: '链接已复制！',
    rating: '评分',
    tags: '标签',
    intro: '简介',
    noData: '暂无电影数据。',
    noLocalData: '未找到本地上传的数据，已加载默认列表。',
    loadLocalDataMessage: '按“1”键可加载本地JSON文件更新列表。',
  },
  'en': {
    movieHeavenTitle: 'Movie Heaven Database',
    copyLink: 'Copy Download Link',
    linkCopied: 'Link copied!',
    rating: 'Rating',
    tags: 'Tags',
    intro: 'Intro',
    noData: 'No movie data available.',
    noLocalData: 'No locally uploaded data found. Loaded default list.',
    loadLocalDataMessage: 'Press the "1" key to load a local JSON file to update the list.',
  }
};

type LanguageKey = keyof typeof translations;

const LOCAL_STORAGE_MOVIE_HEAVEN_KEY = 'weekglance_movie_heaven_data_v1';

export const MovieHeavenViewer = () => {
    const [currentLanguage, setCurrentLanguage] = useState<LanguageKey>('en');
    const [movies, setMovies] = useState<MovieHeavenItem[]>([]);
    const { toast } = useToast();
    
    useEffect(() => {
        if (typeof navigator !== 'undefined') {
          const browserLang: LanguageKey = navigator.language.toLowerCase().startsWith('zh') ? 'zh-CN' : 'en';
          setCurrentLanguage(browserLang);
        }

        try {
            const localData = localStorage.getItem(LOCAL_STORAGE_MOVIE_HEAVEN_KEY);
            if (localData) {
                setMovies(JSON.parse(localData));
            } else {
                setMovies(defaultMovieData);
                toast({
                    title: translations[currentLanguage].noLocalData,
                    description: translations[currentLanguage].loadLocalDataMessage,
                    duration: 5000,
                });
            }
        } catch(e) {
            console.error("Failed to load movie data from localStorage, falling back to default.", e);
            setMovies(defaultMovieData);
        }
    }, [currentLanguage]); // Dependency on currentLanguage to re-evaluate toast messages if needed
    
    const t = useMemo(() => translations[currentLanguage], [currentLanguage]);

    const handleCopy = (url: string) => {
        copy(url);
        toast({ title: t.linkCopied, duration: 2000 });
    }
    
    if (!movies || movies.length === 0) {
        return (
            <div className="text-center py-10 text-muted-foreground flex flex-col items-center justify-center gap-4">
                <ServerCrash className="h-10 w-10" />
                <p>{t.noData}</p>
                <p className="text-sm">{t.loadLocalDataMessage}</p>
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
                    {movies.map((movie, index) => (
                        <Card key={`${movie.title}-${index}`} className="bg-card/80 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="text-lg">{movie.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm">
                                {movie.rating && <div className="flex items-center gap-2"><strong>{t.rating}:</strong> <Badge variant="secondary">{movie.rating}</Badge></div>}
                                {movie.tags && <div className="flex items-center gap-2"><strong>{t.tags}:</strong> {movie.tags}</div>}
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
