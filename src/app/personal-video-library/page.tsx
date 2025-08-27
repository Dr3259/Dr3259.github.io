
"use client";

import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clapperboard, PlusCircle, Search, Film, Video, Database } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MovieCard } from '@/components/MovieCard';
import { useMovies, type Movie } from '@/hooks/useMovies';
import { MovieHeavenViewer } from '@/components/MovieHeavenViewer';
import { useToast } from '@/hooks/use-toast';


const translations = {
  'zh-CN': {
    pageTitle: '个人视频库',
    backButton: '返回休闲驿站',
    searchPlaceholder: '搜索电影...',
    tabLocalCinema: '本地影院',
    tabShortVideo: '短视频',
    tabMovieHeaven: '电影天堂',
    tabWantToWatch: '想看',
    tabWatched: '已看',
    noMoviesWantToWatch: '您的“想看”列表是空的。',
    noMoviesWatched: '您还没有标记任何电影为“已看”。',
    addSuccess: (title: string) => `已将《${title}》添加到您的“想看”列表。`,
    addError: (title: string) => `《${title}》已经在您的列表中了。`,
    searchResult: '搜索结果',
    searchInProgress: '正在搜索...',
    noResults: '未找到结果。',
    searchInstruction: '搜索电影并添加到您的收藏中。',
    comingSoon: '敬请期待！此功能正在开发中。',
    jsonImportSuccess: '电影天堂数据已成功加载！',
    jsonImportError: '加载JSON文件失败，请检查文件格式。'
  },
  'en': {
    pageTitle: 'Personal Video Library',
    backButton: 'Back to Rest Stop',
    searchPlaceholder: 'Search for a movie...',
    tabLocalCinema: 'Local Cinema',
    tabShortVideo: 'Shorts',
    tabMovieHeaven: 'Movie Heaven DB',
    tabWantToWatch: 'Want to Watch',
    tabWatched: 'Watched',
    noMoviesWantToWatch: 'Your "Want to Watch" list is empty.',
    noMoviesWatched: 'You haven\'t marked any movies as "Watched" yet.',
    addSuccess: (title: string) => `Added "${title}" to your "Want to Watch" list.`,
    addError: (title: string) => `"${title}" is already in your list.`,
    searchResult: 'Search Result',
    searchInProgress: 'Searching...',
    noResults: 'No results found.',
    searchInstruction: 'Search for movies to add to your collection.',
    comingSoon: 'Coming soon! This feature is under development.',
    jsonImportSuccess: 'Successfully loaded Movie Heaven data!',
    jsonImportError: 'Failed to load JSON file. Please check the format.'
  }
};

type LanguageKey = keyof typeof translations;
const LOCAL_STORAGE_MOVIE_HEAVEN_KEY = 'weekglance_movie_heaven_data_v1';

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleJsonImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const content = e.target?.result as string;
            if (!content) {
                toast({ title: t.jsonImportError, variant: 'destructive' });
                return;
            }
            const parsedData = JSON.parse(content);
            if (!Array.isArray(parsedData)) {
                throw new Error("JSON is not an array");
            }
            localStorage.setItem(LOCAL_STORAGE_MOVIE_HEAVEN_KEY, content);
            toast({ title: t.jsonImportSuccess });
            window.dispatchEvent(new Event('local-storage')); // Notify other components of the change
        } catch (error) {
            console.error("JSON parsing error:", error);
            toast({ title: t.jsonImportError, variant: 'destructive' });
        }
    };
    reader.readAsText(file);
    event.target.value = '';
  };
  
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
        if(event.key === '1') {
            fileInputRef.current?.click();
        }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
        window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

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
        const results = mockSearchResults.filter(movie =>
            movie.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setSearchResults(results);
        setIsSearching(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleAddMovie = (movie: Movie) => {
    const success = addMovie(movie);
    if (success) {
        setSearchTerm('');
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
    <>
      <input
        type="file"
        accept=".json"
        ref={fileInputRef}
        onChange={handleJsonImport}
        className="hidden"
      />
      <div className="flex flex-col min-h-screen bg-background text-foreground py-8 sm:py-12 px-4 items-center">
          <header className="w-full max-w-6xl mb-6 sm:mb-8">
              <Link href="/rest" passHref>
                  <Button variant="outline" size="sm">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      {t.backButton}
                  </Button>
              </Link>
          </header>

          <main className="w-full max-w-6xl flex flex-col items-center">
              <div className="text-center mb-8">
                  <h1 className="text-3xl sm:text-4xl font-headline font-semibold text-primary">
                      {t.pageTitle}
                  </h1>
              </div>

              <Tabs defaultValue="local_cinema" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 max-w-2xl mx-auto mb-8">
                      <TabsTrigger value="local_cinema"><Film className="mr-2 h-4 w-4"/>{t.tabLocalCinema}</TabsTrigger>
                      <TabsTrigger value="short_video"><Video className="mr-2 h-4 w-4"/>{t.tabShortVideo}</TabsTrigger>
                      <TabsTrigger value="movie_heaven"><Database className="mr-2 h-4 w-4"/>{t.tabMovieHeaven}</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="local_cinema">
                      {/* Search Section */}
                      <div className="w-full max-w-2xl mb-8 relative mx-auto">
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
                  </TabsContent>
                  
                  <TabsContent value="short_video">
                      <div className="text-center py-24 text-muted-foreground">
                          <Video className="w-20 h-20 mx-auto mb-4" />
                          <p className="text-xl">{t.comingSoon}</p>
                      </div>
                  </TabsContent>

                  <TabsContent value="movie_heaven">
                       <MovieHeavenViewer />
                  </TabsContent>
              </Tabs>
          </main>
      </div>
    </>
  );
}
