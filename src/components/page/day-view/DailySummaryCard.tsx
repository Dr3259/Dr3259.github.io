
"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { RATING_ICONS } from '@/app/day/[dayName]/page';
import type { RatingType } from '@/app/day/[dayName]/page';

type DailyNoteDisplayMode = 'read' | 'edit' | 'pending';

interface DailySummaryCardProps {
    translations: any;
    dateKey: string;
    dayNameForDisplay: string;
    dailyNote: string;
    rating: RatingType | null;
    isPastDay: boolean;
    isViewingCurrentDay: boolean;
    isClientAfter6PM: boolean;
    onDailyNoteChange: (newNote: string) => void;
    onRatingChange: (newRating: RatingType | null) => void;
}

const MAX_DAILY_NOTE_LENGTH = 1000;
const RATING_ORDER: RatingType[] = ['excellent', 'average', 'terrible'];

export const DailySummaryCard: React.FC<DailySummaryCardProps> = ({
    translations: t,
    dayNameForDisplay,
    dailyNote,
    rating,
    isPastDay,
    isViewingCurrentDay,
    isClientAfter6PM,
    onDailyNoteChange,
    onRatingChange,
}) => {
    
    const dailyNoteDisplayMode: DailyNoteDisplayMode = React.useMemo(() => {
        if (isPastDay) return 'read';
        if (!isViewingCurrentDay) return 'edit';
        return isClientAfter6PM ? 'edit' : 'pending';
    }, [isPastDay, isViewingCurrentDay, isClientAfter6PM]);
    
    const isFutureDay = !isPastDay && !isViewingCurrentDay;

    const showRatingControls = (isPastDay || (isViewingCurrentDay && isClientAfter6PM)) && !isFutureDay;

    if (dailyNoteDisplayMode === 'pending' || isFutureDay) {
        return null; // Don't render the card if it's a future day or summary is not yet available
    }

    return (
        <>
            <h1 className="text-3xl font-headline font-semibold text-primary mb-6">
                {t.dayDetailsTitle(dayNameForDisplay)}
            </h1>
            <Card className="p-6 rounded-lg shadow-lg mb-8">
                <CardContent className="p-0 space-y-4">
                    <div>
                        <h2 className="text-xl font-medium text-foreground mb-2">{t.notesLabel}</h2>
                        {dailyNoteDisplayMode === 'read' ? (
                            <div className="p-3 border rounded-md min-h-[100px] bg-background/50">
                                {dailyNote ? (
                                    <p className="text-sm text-foreground whitespace-pre-wrap">{dailyNote}</p>
                                ) : (
                                    <p className="text-muted-foreground italic">{t.noData}</p>
                                )}
                            </div>
                        ) : (
                            <div>
                                <Textarea
                                    value={dailyNote}
                                    onChange={(e) => onDailyNoteChange(e.target.value)}
                                    placeholder={t.notesPlaceholder}
                                    className="min-h-[100px] bg-background/50 text-sm"
                                    maxLength={MAX_DAILY_NOTE_LENGTH}
                                    disabled={isPastDay}
                                    autoComplete="off"
                                />
                                <div className="text-xs text-muted-foreground text-right mt-1 pr-1">
                                    {dailyNote.length}/{MAX_DAILY_NOTE_LENGTH}
                                </div>
                            </div>
                        )}
                    </div>
                    <div>
                        <h2 className="text-xl font-medium text-foreground mb-2">{t.ratingLabel}</h2>
                        <div className={cn("p-3 border rounded-md bg-background/50", !showRatingControls && "flex items-center")}>
                            {!showRatingControls ? (
                                <p className="text-muted-foreground">{rating ? t.ratingUiLabels[rating] : t.noData}</p>
                            ) : (
                                <div className="flex justify-around w-full">
                                    {RATING_ORDER.map((type) => {
                                        if(!type) return null;
                                        const Icon = RATING_ICONS[type];
                                        const label = t.ratingUiLabels[type];
                                        return (
                                            <button
                                                key={type}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onRatingChange(rating === type ? null : type);
                                                }}
                                                className={cn(
                                                    "p-1 rounded-full focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                                                    "hover:bg-accent/50",
                                                    rating === type ? "text-primary" : "text-muted-foreground hover:text-foreground"
                                                )}
                                                aria-label={label}
                                                aria-pressed={rating === type}
                                            >
                                                <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </>
    );
};
