
"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ServerCrash, Download, Film, ChevronLeft, ChevronRight } from 'lucide-react';
import { movieHeavenData, type MovieHeavenItem } from '@/lib/data/movie-heaven-data';
import copy from 'copy-to-clipboard';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';

const translations = {
  'zh-CN': {
    movieHeavenTitle: '电影天堂数据库',
    copyLink: '复制下载链接',
    linkCopied: '链接已复制！',
    rating: '评分',
    tags: '标签',
    intro: '简介',
    noData: '暂无电影数据。',
    page: '页',
    of: '/',
    jumpTo: '跳转',
  },
  'en': {
    movieHeavenTitle: 'Movie Heaven Database',
    copyLink: 'Copy Download Link',
    linkCopied: 'Link copied!',
    rating: 'Rating',
    tags: 'Tags',
    intro: 'Intro',
    noData: 'No movie data available.',
    page: 'Page',
    of: 'of',
    jumpTo: 'Jump',
  }
};

type LanguageKey = keyof typeof translations;

const ITEMS_PER_PAGE = 10;

const getYearFromTitle = (title: string): number => {
    const match = title.match(/\b(20\d{2})\b/);
    return match ? parseInt(match[1], 10) : 0;
}

export const MovieHeavenViewer: React.FC = () => {
    const [currentLanguage, setCurrentLanguage] = useState<LanguageKey>('en');
    const [allMovies, setAllMovies] = useState<MovieHeavenItem[]>([]);
    const { toast } = useToast();
    
    const [currentPage, setCurrentPage] = useState(1);
    const [jumpToPage, setJumpToPage] = useState('');

    useEffect(() => {
        const browserLang: LanguageKey = typeof navigator !== 'undefined' && navigator.language.toLowerCase().startsWith('zh') ? 'zh-CN' : 'en';
        setCurrentLanguage(browserLang);
    }, []);

    useEffect(() => {
        const loadMovies = () => {
            let moviesToLoad: MovieHeavenItem[] = movieHeavenData;
            
            moviesToLoad.sort((a, b) => {
                const yearA = getYearFromTitle(a.title);
                const yearB = getYearFromTitle(b.title);
                return yearB - yearA;
            });
            
            setAllMovies(moviesToLoad);
            setCurrentPage(1); 
        };
        loadMovies();
    }, []);
    
    const t = useMemo(() => translations[currentLanguage], [currentLanguage]);

    const totalPages = Math.ceil(allMovies.length / ITEMS_PER_PAGE);
    const currentMovies = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;
        return allMovies.slice(start, end);
    }, [allMovies, currentPage]);

    const handleCopy = (links: string[]) => {
        if (links && links.length > 0) {
            copy(links[0]);
            toast({ title: t.linkCopied, duration: 2000 });
        }
    }

    const handlePrevPage = () => {
        setCurrentPage(prev => Math.max(prev - 1, 1));
    };

    const handleNextPage = () => {
        setCurrentPage(prev => Math.min(prev + 1, totalPages));
    };
    
    const handleJumpToPageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setJumpToPage(e.target.value);
    }
    
    const handleJumpToPageSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            const pageNum = parseInt(jumpToPage, 10);
            if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
                setCurrentPage(pageNum);
            }
            setJumpToPage('');
        }
    }
    
    if (!allMovies || allMovies.length === 0) {
        return (
            <div className="text-center py-10 text-muted-foreground flex flex-col items-center justify-center gap-4">
                <ServerCrash className="h-10 w-10" />
                <p>{t.noData}</p>
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
                    {currentMovies.map((movie, index) => (
                        <Card key={`${movie.title}-${index}`} className="bg-card/80 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="text-lg">{movie.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm">
                                {movie.imdb_score && <div className="flex items-center gap-2"><strong>{t.rating}:</strong> <Badge variant="secondary">{movie.imdb_score}</Badge></div>}
                                {movie.category && <div className="flex items-center gap-2"><strong>{t.tags}:</strong> {movie.category}</div>}
                                {movie.content && <p className="text-muted-foreground"><strong>{t.intro}:</strong> {movie.content}</p>}
                            </CardContent>
                            <div className="p-6 pt-0">
                                 <Button onClick={() => handleCopy(movie.download_links)} disabled={!movie.download_links || movie.download_links.length === 0}>
                                    <Download className="mr-2 h-4 w-4" />
                                    {t.copyLink}
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
                 {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-4 mt-8">
                        <Button variant="outline" size="sm" onClick={handlePrevPage} disabled={currentPage === 1}>
                            <ChevronLeft className="h-4 w-4" />
                            {currentLanguage === 'zh-CN' ? '上一页' : 'Prev'}
                        </Button>
                        <div className="flex items-center gap-2 text-sm">
                            <span>{t.page}</span>
                            <Input 
                                type="number" 
                                className="w-16 h-8 text-center" 
                                value={jumpToPage || currentPage}
                                onChange={handleJumpToPageChange}
                                onKeyDown={handleJumpToPageSubmit}
                                onFocus={(e) => e.target.select()}
                            />
                            <span>{t.of} {totalPages}</span>
                        </div>
                        <Button variant="outline" size="sm" onClick={handleNextPage} disabled={currentPage === totalPages}>
                            {currentLanguage === 'zh-CN' ? '下一页' : 'Next'}
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
