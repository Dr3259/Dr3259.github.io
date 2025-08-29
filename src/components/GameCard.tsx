
"use client";

import React, { type FC, type ElementType } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface GameCardProps {
  title: string;
  icon: ElementType;
  isSmall?: boolean;
  onClick?: () => void;
  ariaLabel?: string;
}

export const GameCard: FC<GameCardProps> = React.memo(({ title, icon: Icon, isSmall, onClick, ariaLabel }) => {
  return (
    <Card
      className={cn(
        "group w-full cursor-pointer overflow-hidden rounded-xl border-2 border-transparent bg-card shadow-lg transition-all duration-300 ease-in-out hover:border-primary/50 hover:shadow-xl hover:scale-105",
        isSmall ? "h-36" : "h-48"
      )}
      onClick={onClick}
      role="button"
      aria-label={ariaLabel || title}
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick?.();}}
    >
      <CardContent className="flex h-full flex-col items-center justify-center p-4 text-center">
        <div className={cn("mb-3 flex items-center justify-center rounded-full bg-primary/10 transition-colors duration-300 group-hover:bg-primary/20", isSmall ? "h-12 w-12" : "h-16 w-16" )}>
            <Icon className={cn("text-primary transition-transform duration-300 group-hover:scale-110", isSmall ? "h-6 w-6" : "h-8 w-8")} />
        </div>
        <p className={cn("font-medium text-foreground", isSmall ? "text-sm" : "text-base")}>{title}</p>
      </CardContent>
    </Card>
  );
});

GameCard.displayName = 'GameCard';
