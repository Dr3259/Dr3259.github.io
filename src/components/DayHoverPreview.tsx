
"use client";

import type { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getHuangliData, type HuangliData } from '@/lib/utils';
import { motion } from 'framer-motion';

interface DayHoverPreviewProps {
  date: Date;
  onMouseEnterPreview?: () => void;
  onMouseLeavePreview?: () => void;
  onClickPreview?: () => void;
}

const YiJiList: FC<{ title: string; items: string[]; className?: string }> = ({ title, items, className }) => (
  <div>
    <div className="flex items-center justify-center mb-3">
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-background border shadow-inner">
        <span className="text-xl font-serif">{title}</span>
      </div>
    </div>
    <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-center text-sm text-foreground/80">
      {items.map((item, index) => (
        <span key={index}>{item}</span>
      ))}
    </div>
  </div>
);


export const DayHoverPreview: FC<DayHoverPreviewProps> = ({
  date,
  onMouseEnterPreview,
  onMouseLeavePreview,
  onClickPreview,
}) => {
  const huangliData = getHuangliData(date);
  const day = date.getDate();

  return (
    <motion.div
        initial={{ opacity: 0.8, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-80 cursor-pointer"
        onMouseEnter={onMouseEnterPreview}
        onMouseLeave={onMouseLeavePreview}
        onClick={onClickPreview}
    >
        <Card 
        className="w-full bg-card/80 backdrop-blur-lg shadow-2xl border-2 border-amber-200/50 dark:border-amber-900/50"
        style={{
            fontFamily: "'Noto Serif SC', serif",
            background: `
                radial-gradient(circle at 100% 100%, hsla(39, 20%, 95%, 0.5) 0%, hsla(39, 20%, 95%, 0) 40%),
                radial-gradient(circle at 0% 0%, hsla(39, 10%, 90%, 0.5) 0%, hsla(39, 10%, 90%, 0) 30%),
                hsl(var(--card))
            `,
            '--tw-shadow': '0 25px 50px -12px rgba(212, 175, 55, 0.25)',
            '--tw-shadow-colored': '0 25px 50px -12px var(--tw-shadow-color)',
        } as React.CSSProperties}
        >
            <CardContent className="p-5">
                <div className="text-center pb-4">
                <div className="text-7xl font-extrabold text-amber-800/80 dark:text-amber-200/80 tracking-tighter" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.05)' }}>
                    {day < 10 ? `0${day}` : day}
                </div>
                <p className="text-sm font-medium text-amber-700/70 dark:text-amber-300/70">{huangliData.GanzhiDay} | {huangliData.zodiac}</p>
                <p className="text-xs text-muted-foreground/80">{huangliData.lunarDateStr}</p>
                </div>
                
                <Separator className="bg-amber-300/50 dark:bg-amber-800/50" />

                <div className="py-4 space-y-4">
                    <YiJiList title="宜" items={huangliData.good} />
                    <Separator variant="dashed" className="border-amber-200/50 dark:border-amber-900/50 my-3" />
                    <YiJiList title="忌" items={huangliData.bad} />
                </div>
                
                 <Separator className="bg-amber-300/50 dark:bg-amber-800/50" />
                
                <div className="text-center pt-3">
                    <p className="text-xs text-muted-foreground">{huangliData.term || ' '}</p>
                </div>

            </CardContent>
        </Card>
    </motion.div>
  );
};
