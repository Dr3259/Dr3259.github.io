
"use client";

import React from 'react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { type NewsUpdate } from '@/lib/data';
import { format, formatDistanceToNow } from 'date-fns';
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
  const timeAgo = formatDistanceToNow(new Date(news.date), { addSuffix: true, locale: zhCN });

  return (
    <div className="bg-card border rounded-xl shadow-md hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden h-full">
      <a href={news.link} target="_blank" rel="noopener noreferrer" className="flex flex-col h-full group">
        <div className="relative w-full h-40 bg-muted">
          <Image
            src={news.logo}
            alt={news.title}
            fill
            style={{ objectFit: 'cover' }}
            className="transition-transform duration-300 group-hover:scale-105"
            data-ai-hint="abstract technology"
          />
        </div>
        <div className="p-4 flex flex-col flex-grow">
           <div className="flex items-center gap-2 mb-3">
             <div className="text-sm font-medium text-muted-foreground truncate" title={news.company}>{news.company}</div>
             {news.parentCompany && <div className="text-xs text-muted-foreground/80 truncate">({news.parentCompany})</div>}
          </div>

          <h3 className="text-base font-semibold text-foreground mb-2 flex-grow group-hover:text-primary transition-colors">
            {news.title}
            {news.version && <span className="text-sm font-normal text-muted-foreground ml-1.5">({news.version})</span>}
          </h3>
          
          <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{news.description}</p>
          
          <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t">
            <Badge variant="secondary">{news.category}</Badge>
            <Badge variant="outline" className={getPricingColor(news.pricing)}>
              {news.pricing}
            </Badge>
             <Badge variant="outline">{news.type}</Badge>
          </div>
          <div className="text-xs text-muted-foreground mt-3 text-right" title={formattedDate}>
            {timeAgo}
          </div>
        </div>
      </a>
    </div>
  );
};
