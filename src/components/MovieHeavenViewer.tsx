
"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ServerCrash, Download, Film } from 'lucide-react';
import { movieHeavenData, type MovieHeavenItem } from '@/lib/data/movie-heaven-data';
import copy from 'copy-to-clipboard';
import { useToast } from '@/hooks/use-toast';

const translations = {
  'zh-CN': {
    movieHeavenTitle: '电影天堂资源查看器',
    errorHeaven: '加载电影天堂资源失败。',
    copyLink: '复制下载链接',
    linkCopied: '链接已复制！',
    rating: '评分',
    tags: '标签',
    intro: '简介',
    noData: '暂无电影数据。请在 src/lib/data/movie-heaven-data.ts 中提供数据。'
  },
  'en': {
    movieHeavenTitle: 'Movie Heaven Viewer',
    errorHeaven: 'Failed to load resources from Movie Heaven.',
    copyLink: 'Copy Download Link',
    linkCopied: 'Link copied!',
    rating: 'Rating',
    tags: 'Tags',
    intro: 'Intro',
    noData: 'No movie data available. Please provide data in src/lib/data/movie-heaven-data.ts.'
  }
};

type LanguageKey = keyof typeof translations;

export const MovieHeavenViewer = () => {
    const [currentLanguage, setCurrentLanguage] = useState<LanguageKey>('en');
    const { toast } = useToast();
    
    useEffect(() => {
        if (typeof navigator !== 'undefined') {
          const browserLang: LanguageKey = navigator.language.toLowerCase().startsWith('zh') ? 'zh-CN' : 'en';
          setCurrentLanguage(browserLang);
        }
    }, []);
    
    const t = useMemo(() => translations[currentLanguage], [currentLanguage]);

    const handleCopy = (url: string) => {
        copy(url);
        toast({ title: t.linkCopied, duration: 2000 });
    }
    
    if (!movieHeavenData || movieHeavenData.length === 0) {
        return (
            <div className="text-center py-10 text-muted-foreground flex items-center justify-center">
                <ServerCrash className="mr-2 h-5 w-5" />
                {t.noData}
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
                    {movieHeavenData.map((movie, index) => (
                        <Card key={`${movie.title}-${index}`} className="bg-card/80 backdrop-blur-sm">
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
