
"use client";

import { useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from './use-local-storage';

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

const LOCAL_STORAGE_MOVIES_KEY = 'weekglance_personal_video_library_v1';

export const useMovies = () => {
  const [movies, setMovies] = useLocalStorage<Movie[]>(LOCAL_STORAGE_MOVIES_KEY, []);

  const addMovie = useCallback((newMovie: Omit<Movie, 'status'>): boolean => {
    if (movies.some(movie => movie.id === newMovie.id)) {
      return false; // Movie already exists
    }
    const movieWithStatus: Movie = { ...newMovie, status: 'want_to_watch' };
    setMovies(prev => [...prev, movieWithStatus]);
    return true;
  }, [movies, setMovies]);

  const updateMovieStatus = useCallback((id: string, status: MovieStatus) => {
    setMovies(prev =>
      prev.map(movie =>
        movie.id === id ? { ...movie, status } : movie
      )
    );
  }, [setMovies]);

  const updateMovieRating = useCallback((id: string, rating: number) => {
    setMovies(prev =>
      prev.map(movie =>
        movie.id === id ? { ...movie, rating } : movie
      )
    );
  }, [setMovies]);

  const updateMovieReview = useCallback((id: string, review: string) => {
    setMovies(prev =>
      prev.map(movie =>
        movie.id === id ? { ...movie, review } : movie
      )
    );
  }, [setMovies]);

  const deleteMovie = useCallback((id: string) => {
    setMovies(prev => prev.filter(movie => movie.id !== id));
  }, [setMovies]);

  return {
    movies,
    setMovies, // Exposing setMovies for direct manipulation like import
    addMovie,
    updateMovieStatus,
    updateMovieRating,
    updateMovieReview,
    deleteMovie,
  };
};
