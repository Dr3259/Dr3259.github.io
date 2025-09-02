
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
    movies: Record<string, Movie>;
    addMovie: (newMovie: Omit<Movie, 'status'>) => boolean;
    updateMovieStatus: (id: string, status: MovieStatus) => void;
    updateMovieRating: (id: string, rating: number) => void;
    updateMovieReview: (id: string, review: string) => void;
    deleteMovie: (id: string) => void;
    setMovies: (movies: Record<string, Movie>) => void;
}

const LOCAL_STORAGE_MOVIES_KEY = 'weekglance_personal_video_library_v2_flat';

export const useMovies = create<MovieState>()(
  persist(
    (set, get) => ({
      movies: {},
      addMovie: (newMovie) => {
        const { movies } = get();
        if (movies[newMovie.id]) {
          return false; // Movie already exists
        }
        const movieWithStatus: Movie = { ...newMovie, status: 'want_to_watch' };
        set((state) => ({
            movies: {
                ...state.movies,
                [newMovie.id]: movieWithStatus,
            }
        }));
        return true;
      },
      updateMovieStatus: (id, status) => {
        set((state) => {
          if (!state.movies[id]) return state;
          return {
            movies: {
              ...state.movies,
              [id]: { ...state.movies[id], status },
            },
          };
        });
      },
      updateMovieRating: (id, rating) => {
        set((state) => {
          if (!state.movies[id]) return state;
          return {
            movies: {
              ...state.movies,
              [id]: { ...state.movies[id], rating },
            },
          };
        });
      },
      updateMovieReview: (id, review) => {
        set((state) => {
          if (!state.movies[id]) return state;
          return {
            movies: {
              ...state.movies,
              [id]: { ...state.movies[id], review },
            },
          };
        });
      },
      deleteMovie: (id) => {
        set((state) => {
          const newMovies = { ...state.movies };
          delete newMovies[id];
          return { movies: newMovies };
        });
      },
      setMovies: (movies) => set({ movies }),
    }),
    {
      name: LOCAL_STORAGE_MOVIES_KEY,
      storage: createJSONStorage(() => localStorage),
       // Custom migration logic if needed to convert from array to record
      migrate: (persistedState, version) => {
        if (version === 0 && Array.isArray((persistedState as any).movies)) {
          const flatMovies: Record<string, Movie> = {};
          ((persistedState as any).movies as Movie[]).forEach(movie => {
            flatMovies[movie.id] = movie;
          });
          return { ...(persistedState as any), movies: flatMovies };
        }
        return persistedState as MovieState;
      },
      version: 1,
    }
  )
);
