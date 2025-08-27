
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
    loadLocalDataMessage: '按“1”键可加载本地JSON文件更新列表。',
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
    loadLocalDataMessage: 'Press the "1" key to load a local JSON file to update the list.',
    page: 'Page',
    of: 'of',
    jumpTo: 'Jump',
  }
};

type LanguageKey = keyof typeof translations;

const LOCAL_STORAGE_MOVIE_HEAVEN_KEY = 'weekglance_movie_heaven_data_v1';
const ITEMS_PER_PAGE = 10;

export const MovieHeavenViewer = () => {
    const [currentLanguage, setCurrentLanguage] = useState<LanguageKey>('en');
    const [allMovies, setAllMovies] = useState<MovieHeavenItem[]>([]);
    const { toast } = useToast();
    
    const [currentPage, setCurrentPage] = useState(1);
    const [jumpToPage, setJumpToPage] = useState('');

    useEffect(() => {
        const browserLang: LanguageKey = typeof navigator !== 'undefined' && navigator.language.toLowerCase().startsWith('zh') ? 'zh-CN' : 'en';
        setCurrentLanguage(browserLang);

        const loadMovies = () => {
             try {
                const localData = localStorage.getItem(LOCAL_STORAGE_MOVIE_HEAVEN_KEY);
                if (localData) {
                    const parsedData = JSON.parse(localData).map((item: any) => ({
                        title: item.title,
                        downloadUrl: (item.download_links && item.download_links[0]) || 'N/A',
                        rating: item.imdb_score || '暂无评分',
                        tags: item.category || '未知',
                        shortIntro: item.content || '暂无简介'
                    }));
                    setAllMovies(parsedData);
                } else {
                    setAllMovies(movieHeavenData);
                }
            } catch(e) {
                console.error("Failed to load movie data from localStorage, falling back to default.", e);
                setAllMovies(movieHeavenData);
            }
        };

        loadMovies();
        
        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === LOCAL_STORAGE_MOVIE_HEAVEN_KEY || event.type === 'local-storage') {
                loadMovies();
                setCurrentPage(1); // Reset to first page on new data
            }
        };

        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('local-storage', handleStorageChange); // For changes within the same tab

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('local-storage', handleStorageChange);
        };
        
    }, []);
    
    const t = useMemo(() => translations[currentLanguage], [currentLanguage]);

    const totalPages = Math.ceil(allMovies.length / ITEMS_PER_PAGE);
    const currentMovies = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;
        return allMovies.slice(start, end);
    }, [allMovies, currentPage]);

    const handleCopy = (url: string) => {
        copy(url);
        toast({ title: t.linkCopied, duration: 2000 });
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
                    {currentMovies.map((movie, index) => (
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
