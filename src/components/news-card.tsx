
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
      case 'Free':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case '付费':
      case 'Paid':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case '开源':
      case 'Open Source':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const formattedDate = format(new Date(news.date), 'yyyy-MM-dd');
  const timeAgo = formatDistanceToNow(new Date(news.date), { addSuffix: true, locale: zhCN });

  return (
    <div className="bg-card border rounded-xl shadow-md hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden h-full">
      <a href={news.link} target="_blank" rel="noopener noreferrer" className="flex flex-col h-full">
        <div className="relative w-full h-40">
          <Image
            src={news.imageUrl || 'https://placehold.co/600x400.png'}
            alt={news.title}
            fill
            style={{ objectFit: 'cover' }}
            className="transition-transform duration-300 group-hover:scale-105"
            data-ai-hint="abstract technology"
          />
        </div>
        <div className="p-4 flex flex-col flex-grow">
          <div className="flex items-center gap-3 mb-3">
             <Image
                src={news.logo}
                alt={`${news.company} logo`}
                width={24}
                height={24}
                className="rounded-full"
                data-ai-hint="logo"
              />
            <span className="text-sm font-medium text-muted-foreground">{news.company}</span>
          </div>

          <h3 className="text-lg font-semibold text-foreground mb-2 flex-grow">{news.title}</h3>
          
          <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{news.description}</p>
          
          <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t">
            <Badge variant="secondary">{news.category}</Badge>
            <Badge variant="outline" className={getPricingColor(news.pricing)}>
              {news.pricing}
            </Badge>
          </div>
          <div className="text-xs text-muted-foreground mt-3 text-right" title={formattedDate}>
            {timeAgo}
          </div>
        </div>
      </a>
    </div>
  );
};
