
"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Eye, Star, Trash2, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Movie, MovieStatus } from '@/hooks/useMovies';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from './ui/textarea';

interface MovieCardProps {
  movie: Movie;
  onStatusChange: (id: string, status: MovieStatus) => void;
  onRatingChange: (id: string, rating: number) => void;
  onReviewChange: (id: string, review: string) => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie, onStatusChange, onRatingChange, onReviewChange }) => {
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [reviewText, setReviewText] = useState(movie.review || '');

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://placehold.co/500x750?text=No+Image';
    
  const handleStarClick = (newRating: number) => {
    onRatingChange(movie.id, movie.rating === newRating ? 0 : newRating);
  };
  
  const handleSaveReview = () => {
    onReviewChange(movie.id, reviewText);
    setIsReviewDialogOpen(false);
  }

  return (
    <Card className="overflow-hidden flex flex-col group relative">
      <CardHeader className="p-0">
        <div className="aspect-[2/3] relative">
          <Image
            src={posterUrl}
            alt={movie.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            {movie.status === 'want_to_watch' ? (
                <Button onClick={() => onStatusChange(movie.id, 'watched')} variant="secondary" size="sm">
                    <Check className="mr-2 h-4 w-4" /> Mark as Watched
                </Button>
            ) : (
                <Button onClick={() => onStatusChange(movie.id, 'want_to_watch')} variant="secondary" size="sm">
                    <Eye className="mr-2 h-4 w-4" /> Move to Want to Watch
                </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-3 flex-grow">
        <CardTitle className="text-base font-semibold line-clamp-1" title={movie.title}>{movie.title}</CardTitle>
        <p className="text-sm text-muted-foreground">{movie.release_date.substring(0, 4)}</p>
      </CardContent>
      {movie.status === 'watched' && (
        <CardFooter className="p-3 pt-0 flex justify-between items-center">
            <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                    <Star
                        key={i}
                        className={cn(
                            "h-5 w-5 cursor-pointer transition-colors",
                            movie.rating && i < movie.rating
                                ? "text-amber-400 fill-amber-400"
                                : "text-muted-foreground/50 hover:text-amber-400"
                        )}
                        onClick={() => handleStarClick(i + 1)}
                    />
                ))}
            </div>
            <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" title={movie.review ? "Edit Review" : "Add Review"}>
                    <MessageSquare className={cn("h-4 w-4", movie.review && "fill-primary/20 text-primary")} />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Review for {movie.title}</DialogTitle>
                  <DialogDescription>
                    Write down your thoughts about this movie.
                  </DialogDescription>
                </DialogHeader>
                <Textarea 
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="What did you think?"
                  className="min-h-[120px]"
                />
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsReviewDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleSaveReview}>Save Review</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
        </CardFooter>
      )}
    </Card>
  );
};

    