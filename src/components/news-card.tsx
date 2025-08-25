
"use client";

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { type NewsUpdate } from '@/lib/data';
import { format } from 'date-fns';

export const NewsCard: React.FC<{ news: NewsUpdate }> = ({ news }) => {
  const getPricingColor = (pricing: string) => {
    switch (pricing) {
      case '免费':
      case '免费增值':
      case 'Free':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case '付费':
      case '商业':
      case 'Paid':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case '开源':
      case 'Open Source':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case '研究':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const formattedDate = format(new Date(news.date), 'yyyy-MM-dd');

  return (
    <a 
      href={news.link} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="bg-card border rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden h-full group p-5 hover:-translate-y-1"
    >
      <div className="flex-grow flex flex-col">
        <header className="mb-3">
          <div className="flex justify-between items-baseline gap-4">
              <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                {news.title}
              </h3>
              <p className="text-xs text-muted-foreground font-mono shrink-0" title={formattedDate}>{formattedDate}</p>
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <p className="text-sm font-medium text-muted-foreground" title={news.company}>{news.company}</p>
            {news.version && <span className="text-xs font-normal text-primary/80">({news.version})</span>}
          </div>
        </header>
        
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-4 flex-grow">{news.description}</p>
      </div>

      <footer className="flex flex-wrap gap-2 mt-auto">
        <Badge variant="secondary">{news.category}</Badge>
        <Badge variant="outline" className={getPricingColor(news.pricing)}>
          {news.pricing}
          {news.price && <span className="ml-1.5 font-normal opacity-80">({news.price})</span>}
        </Badge>
         <Badge variant="outline">{news.type}</Badge>
      </footer>
    </a>
  );
};

    