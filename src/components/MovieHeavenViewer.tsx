
"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ServerCrash, Download, Film, ChevronLeft, ChevronRight, Star, Clock, User, Languages, Calendar, MapPin, Subtitles } from 'lucide-react';
import { movieHeavenData, type MovieHeavenItem } from '@/lib/data/movie-heaven-data';
import copy from 'copy-to-clipboard';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

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
    imdb: 'IMDb',
    douban: '豆瓣',
    director: '导演',
    actors: '主演',
    country: '国家/地区',
    language: '语言',
    releaseDate: '上映日期',
    duration: '片长',
    subtitles: '字幕',
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
    imdb: 'IMDb',
    douban: 'Douban',
    director: 'Director',
    actors: 'Actors',
    country: 'Country/Region',
    language: 'Language',
    releaseDate: 'Release Date',
    duration: 'Duration',
    subtitles: 'Subtitles',
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
                const yearA = a.year ? parseInt(a.year, 10) : getYearFromTitle(a.title);
                const yearB = b.year ? parseInt(b.year, 10) : getYearFromTitle(b.title);
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
            copy(links.join('\\n'));
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

    const InfoRow: React.FC<{ icon: React.ElementType, label: string, value?: string | null, className?: string }> = ({ icon: Icon, label, value, className }) => {
        if (!value) return null;
        return (
            <div className={cn("flex items-start text-sm", className)}>
                <Icon className="w-4 h-4 mr-2 mt-0.5 shrink-0 text-muted-foreground" />
                <div className="flex flex-wrap items-baseline">
                  <strong className="mr-1.5 shrink-0 text-foreground/80">{label}:</strong>
                  <span className="text-muted-foreground">{value}</span>
                </div>
            </div>
        );
    };
    
    if (!allMovies || allMovies.length === 0) {
        return (
            <div className="text-center py-10 text-muted-foreground flex flex-col items-center justify-center gap-4">
                <ServerCrash className="h-10 w-10" />
                <p>{t.noData}</p>
            </div>
        );
    }
    
    return (
        <Card className="w-full max-w-4xl mx-auto shadow-lg bg-transparent border-none">
            <CardHeader className="px-0">
                <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl">
                    <Film className="text-primary"/>
                    {t.movieHeavenTitle}
                </CardTitle>
            </CardHeader>
            <CardContent className="px-0">
                <div className="space-y-6">
                    {currentMovies.map((movie, index) => (
                        <Card key={`${movie.title}-${index}`} className="bg-card/80 backdrop-blur-sm shadow-md">
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold flex items-center gap-3">
                                  <span>{movie.title}</span>
                                  {movie.year && <Badge variant="outline" className="text-base">{movie.year}</Badge>}
                                </CardTitle>
                            </CardHeader>
                             <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3">
                                    <div className="flex items-center gap-2 text-sm col-span-1">
                                        <Star className="w-4 h-4 text-amber-400 shrink-0"/>
                                        <strong className="mr-1 shrink-0">{t.rating}:</strong>
                                        <div className="flex flex-wrap gap-2">
                                            {movie.imdb_score && <Badge variant="secondary">{t.imdb} {movie.imdb_score}</Badge>}
                                            {movie.douban_score && <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">{t.douban} {movie.douban_score}</Badge>}
                                            {!movie.imdb_score && !movie.douban_score && <span className="text-sm text-muted-foreground">N/A</span>}
                                        </div>
                                    </div>
                                    <InfoRow icon={Calendar} label={t.releaseDate} value={movie.release_date} />
                                    <InfoRow icon={Clock} label={t.duration} value={movie.duration} />
                                    <InfoRow icon={User} label={t.director} value={movie.director} />
                                    <InfoRow icon={MapPin} label={t.country} value={movie.country} />
                                    <InfoRow icon={Languages} label={t.language} value={movie.language} />
                                    <InfoRow icon={Subtitles} label={t.subtitles} value={movie.subtitles} />
                                    <InfoRow icon={User} label={t.actors} value={movie.actors} className="col-span-full" />
                                </div>
                                
                                <Separator className="my-4" />
                                
                                <div>
                                    <strong className="text-sm text-foreground/80 flex items-center mb-2">
                                        <Download className="w-4 h-4 mr-2" />
                                        {t.intro}
                                    </strong>
                                    <p className="text-sm text-muted-foreground pt-1">{movie.content}</p>
                                </div>
                            </CardContent>
                            <CardFooter>
                                 <Button onClick={() => handleCopy(movie.download_links)} disabled={!movie.download_links || movie.download_links.length === 0}>
                                    <Download className="mr-2 h-4 w-4" />
                                    {t.copyLink}
                                </Button>
                            </CardFooter>
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
