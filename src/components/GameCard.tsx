
"use client";

import React, { type FC, type ElementType } from 'react'; // Import React
import { Card } from "@/components/ui/card";
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
        "flex flex-col items-center justify-center text-center p-3 sm:p-4 rounded-xl shadow-lg hover:shadow-xl hover:bg-accent/30 cursor-pointer transition-all duration-200 ease-in-out transform hover:scale-105",
        "h-36 w-full",
      )}
      onClick={onClick}
      role="button"
      aria-label={ariaLabel || title}
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick?.();}}
    >
      <Icon className={cn("mb-2 text-primary w-12 h-12")} />
      <p className={cn("font-medium text-foreground text-sm")}>{title}</p>
    </Card>
  );
});

GameCard.displayName = 'GameCard';
