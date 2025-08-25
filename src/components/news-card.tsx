
"use client";

import React from 'react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { type NewsUpdate } from '@/lib/data';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

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
      className="bg-card border rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden h-full group p-4"
    >
      <div className="flex justify-between items-start gap-4">
          <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground font-mono" title={formattedDate}>{formattedDate}</p>
              <h3 className="text-base font-semibold text-foreground mt-1 group-hover:text-primary transition-colors">
                {news.title}
                {news.version && <span className="text-sm font-normal text-muted-foreground ml-1.5">({news.version})</span>}
              </h3>
              <p className="text-sm font-medium text-muted-foreground truncate mt-0.5" title={news.company}>{news.company}</p>
          </div>
      </div>
      
      <p className="text-sm text-muted-foreground mt-2 line-clamp-2 flex-grow">{news.description}</p>
      
      <div className="flex flex-wrap gap-2 mt-3">
        <Badge variant="secondary">{news.category}</Badge>
        <Badge variant="outline" className={getPricingColor(news.pricing)}>
          {news.pricing}
        </Badge>
         <Badge variant="outline">{news.type}</Badge>
      </div>
    </a>
  );
};
