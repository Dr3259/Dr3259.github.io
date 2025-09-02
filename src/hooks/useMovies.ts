
"use client";

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type MovieStatus = 'want_to_watch' | 'watched';

export interface Movie {
  id: string; // e.g., tmdb-12345
  title: string;
  poster_path: string;
  poster_path_en?: string; // Optional English poster
  release_date: string;
  overview: string;
  status: MovieStatus;
  rating?: number; // 0-5
  review?: string;
}

interface MovieState {
    movies: Movie[];
    addMovie: (newMovie: Omit<Movie, 'status'>) => boolean;
    updateMovieStatus: (id: string, status: MovieStatus) => void;
    updateMovieRating: (id: string, rating: number) => void;
    updateMovieReview: (id: string, review: string) => void;
    deleteMovie: (id: string) => void;
    setMovies: (movies: Movie[]) => void;
}

const LOCAL_STORAGE_MOVIES_KEY = 'weekglance_personal_video_library_v1';

export const useMovies = create<MovieState>()(
  persist(
    (set, get) => ({
      movies: [],
      addMovie: (newMovie) => {
        const { movies } = get();
        if (movies.some(movie => movie.id === newMovie.id)) {
          return false; // Movie already exists
        }
        const movieWithStatus: Movie = { ...newMovie, status: 'want_to_watch' };
        set({ movies: [...movies, movieWithStatus] });
        return true;
      },
      updateMovieStatus: (id, status) => {
        set((state) => ({
          movies: state.movies.map(movie =>
            movie.id === id ? { ...movie, status } : movie
          )
        }));
      },
      updateMovieRating: (id, rating) => {
        set((state) => ({
          movies: state.movies.map(movie =>
            movie.id === id ? { ...movie, rating } : movie
          )
        }));
      },
      updateMovieReview: (id, review) => {
        set((state) => ({
          movies: state.movies.map(movie =>
            movie.id === id ? { ...movie, review } : movie
          )
        }));
      },
      deleteMovie: (id) => {
        set((state) => ({
          movies: state.movies.filter(movie => movie.id !== id)
        }));
      },
      setMovies: (movies) => set({ movies }),
    }),
    {
      name: LOCAL_STORAGE_MOVIES_KEY,
      storage: createJSONStorage(() => localStorage),
    }
  )
);
