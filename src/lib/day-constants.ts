import { Smile, Meh, Frown } from 'lucide-react';

export type RatingType = 'excellent' | 'terrible' | 'average' | null;

export const RATING_ICONS: Record<Exclude<RatingType, null>, React.ElementType> = {
  excellent: Smile,
  average: Meh,
  terrible: Frown,
};
