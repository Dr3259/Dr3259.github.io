
"use client";

import type { FC, ElementType } from 'react';
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface GameCardProps {
  title: string;
  icon: ElementType;
  isSmall?: boolean;
  onClick?: () => void;
  ariaLabel?: string;
}

export const GameCard: FC<GameCardProps> = ({ title, icon: Icon, isSmall, onClick, ariaLabel }) => {
  return (
    <Card
      className={cn(
        "flex flex-col items-center justify-center text-center p-3 sm:p-4 rounded-xl shadow-lg hover:shadow-xl hover:bg-accent/30 cursor-pointer transition-all duration-200 ease-in-out transform hover:scale-105",
        isSmall ? "h-28 w-28 sm:h-32 sm:w-32" : "h-36 w-full sm:h-40",
      )}
      onClick={onClick}
      role="button"
      aria-label={ariaLabel || title}
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick?.();}}
    >
      <Icon className={cn("mb-2 text-primary", isSmall ? "w-10 h-10 sm:w-12 sm:h-12" : "w-12 h-12 sm:w-16 sm:h-16")} />
      <p className={cn("font-medium text-foreground", isSmall ? "text-xs sm:text-sm" : "text-sm sm:text-base")}>{title}</p>
    </Card>
  );
};
