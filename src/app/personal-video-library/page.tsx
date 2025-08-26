
"use client";

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clapperboard, PlusCircle, Search, Star, MessageSquare } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MovieCard } from '@/components/MovieCard';
import { useMovies, type Movie } from '@/hooks/useMovies';
import type { MovieStatus } from '@/hooks/useMovies';


const translations = {
  'zh-CN': {
    pageTitle: '个人视频库',
    backButton: '返回休闲驿站',
    searchPlaceholder: '搜索视频...',
    tabWantToWatch: '想看',
    tabWatched: '已看',
    noMoviesWantToWatch: '您的“想看”列表是空的。',
    noMoviesWatched: '您还没有标记任何视频为“已看”。',
    addSuccess: (title: string) => `已将《${title}》添加到您的“想看”列表。`,
    addError: (title: string) => `《${title}》已经在您的列表中了。`,
    searchResult: '搜索结果',
    searchInProgress: '正在搜索...',
    noResults: '未找到结果。',
    searchInstruction: '搜索视频并添加到您的收藏中。'
  },
  'en': {
    pageTitle: 'Personal Video Library',
    backButton: 'Back to Rest Stop',
    searchPlaceholder: 'Search for a video...',
    tabWantToWatch: 'Want to Watch',
    tabWatched: 'Watched',
    noMoviesWantToWatch: 'Your "Want to Watch" list is empty.',
    noMoviesWatched: 'You haven\'t marked any videos as "Watched" yet.',
    addSuccess: (title: string) => `Added "${title}" to your "Want to Watch" list.`,
    addError: (title: string) => `"${title}" is already in your list.`,
    searchResult: 'Search Result',
    searchInProgress: 'Searching...',
    noResults: 'No results found.',
    searchInstruction: 'Search for videos to add to your collection.'
  }
};

type LanguageKey = keyof typeof translations;

// --- Mock Search Data ---
const mockSearchResults: Movie[] = [
    { id: 'tmdb-299534', title: 'Avengers: Endgame', poster_path: '/or06FN3Dka5tukK1e9sl16pB3iy.jpg', release_date: '2019-04-24', overview: 'After the devastating events of Avengers: Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more in order to reverse Thanos\' actions and restore balance to the universe.', status: 'want_to_watch' },
    { id: 'tmdb-27205', title: 'Inception', poster_path_en: '/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg', poster_path: '/edv5CZvWj09upOsy2Y6ama2apoE.jpg', release_date: '2010-07-15', overview: 'Cobb, a skilled thief who commits corporate espionage by infiltrating the subconscious of his targets, is offered a chance to regain his old life as payment for a task considered to be impossible: "inception", the implantation of another person\'s idea into a target\'s subconscious.', status: 'want_to_watch' },
    { id: 'tmdb-155', title: 'The Dark Knight', poster_path: '/qJ2tW6WMUDux911r6m7haRef0WH.jpg', release_date: '2008-07-16', overview: 'Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations that plague the streets. The partnership proves to be effective, but they soon find themselves prey to a reign of chaos unleashed by a rising criminal mastermind known to the terrified citizens of Gotham as the Joker.', status: 'want_to_watch' },
    { id: 'tmdb-680', title: 'Pulp Fiction', poster_path: '/d5iIlFn5s0ImszYzrKYO7G9B9A1.jpg', release_date: '1994-09-10', overview: 'A burger-loving hit man, his philosophical partner, a drug-addled gangster\'s moll and a washed-up boxer converge in this sprawling, comedic crime caper. Their adventures unfurl in three stories that ingeniously trip over each other.', status: 'want_to_watch' },
];


export default function PersonalVideoLibraryPage() {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageKey>('en');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { movies, addMovie, updateMovieStatus, updateMovieRating, updateMovieReview } = useMovies();

  useEffect(() => {
    const browserLang: LanguageKey = navigator.language.toLowerCase().startsWith('zh') ? 'zh-CN' : 'en';
    setCurrentLanguage(browserLang);
  }, []);

  const t = useMemo(() => translations[currentLanguage], [currentLanguage]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
        setSearchResults([]);
        setIsSearching(false);
        return;
    }

    setIsSearching(true);
    const timer = setTimeout(() => {
        // Mock search logic
        const results = mockSearchResults.filter(movie =>
            movie.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setSearchResults(results);
        setIsSearching(false);
    }, 500); // Simulate network delay

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleAddMovie = (movie: Movie) => {
    const success = addMovie(movie);
    // You can add toast notifications here based on success
    if (success) {
        console.log(t.addSuccess(movie.title));
        setSearchTerm(''); // Clear search after adding
    } else {
        console.warn(t.addError(movie.title));
    }
  };

  const wantToWatchMovies = useMemo(() => movies.filter(m => m.status === 'want_to_watch'), [movies]);
  const watchedMovies = useMemo(() => movies.filter(m => m.status === 'watched'), [movies]);

  const renderMovieList = (movieList: Movie[], emptyMessage: string) => {
    if (movieList.length === 0) {
        return (
            <div className="text-center py-16 text-muted-foreground">
                <Clapperboard className="w-16 h-16 mx-auto mb-4" />
                <p>{emptyMessage}</p>
            </div>
        );
    }
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {movieList.map(movie => (
                <MovieCard
                    key={movie.id}
                    movie={movie}
                    onStatusChange={(id, status) => updateMovieStatus(id, status)}
                    onRatingChange={(id, rating) => updateMovieRating(id, rating)}
                    onReviewChange={(id, review) => updateMovieReview(id, review)}
                />
            ))}
        </div>
    );
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

            {/* Search Section */}
            <div className="w-full max-w-2xl mb-8 relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder={t.searchPlaceholder}
                    className="w-full pl-12 h-12 text-lg rounded-full shadow-lg"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                    <div className="absolute top-full mt-2 w-full bg-card border rounded-lg shadow-xl z-10 max-h-96 overflow-y-auto">
                        {isSearching ? (
                             <p className="p-4 text-center text-muted-foreground">{t.searchInProgress}</p>
                        ) : searchResults.length > 0 ? (
                            <ul>
                                {searchResults.map(movie => (
                                    <li key={movie.id} className="flex items-center justify-between p-3 hover:bg-accent">
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold truncate">{movie.title}</p>
                                            <p className="text-sm text-muted-foreground">{movie.release_date.substring(0, 4)}</p>
                                        </div>
                                        <Button size="sm" variant="ghost" onClick={() => handleAddMovie(movie)}>
                                            <PlusCircle className="mr-2 h-4 w-4" />
                                            Add
                                        </Button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="p-4 text-center text-muted-foreground">{t.noResults}</p>
                        )}
                    </div>
                )}
            </div>

            {/* Tabs and Content */}
            <Tabs defaultValue="want_to_watch" className="w-full">
                <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-8">
                    <TabsTrigger value="want_to_watch">{t.tabWantToWatch} ({wantToWatchMovies.length})</TabsTrigger>
                    <TabsTrigger value="watched">{t.tabWatched} ({watchedMovies.length})</TabsTrigger>
                </TabsList>
                <TabsContent value="want_to_watch">
                    {renderMovieList(wantToWatchMovies, t.noMoviesWantToWatch)}
                </TabsContent>
                <TabsContent value="watched">
                    {renderMovieList(watchedMovies, t.noMoviesWatched)}
                </TabsContent>
            </Tabs>

        </main>
    </div>
  );
}

    
