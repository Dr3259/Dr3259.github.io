
"use client";

import React, { useState, useMemo, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Search, Globe, Filter, Building, Briefcase } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { newsUpdates, type NewsUpdate } from '@/lib/data';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { format, formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { NewsCard } from '@/components/news-card';


export default function AiWorldPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('所有国家');
  const [selectedCategory, setSelectedCategory] = useState('所有类别');
  const [selectedPricing, setSelectedPricing] = useState('所有价格');
  const [isFilterStuck, setIsFilterStuck] = useState(false);
  const filterSentinelRef = useRef<HTMLDivElement>(null);


  const { countries, countryCounts } = useMemo(() => {
    const countryCounts = newsUpdates.reduce((acc, update) => {
      acc[update.country] = (acc[update.country] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const sortedCountries = Array.from(new Set(newsUpdates.map(u => u.country)))
      .sort((a, b) => countryCounts[b] - countryCounts[a]);
    
    return { countries: ['所有国家', ...sortedCountries], countryCounts };
  }, []);

  const categories = useMemo(() => ['所有类别', ...Array.from(new Set(newsUpdates.map(u => u.category))).sort()], []);
  const pricings = useMemo(() => ['所有价格', ...Array.from(new Set(newsUpdates.map(u => u.pricing)))], []);

  const filteredUpdates = useMemo(() => {
    const lowercasedFilter = searchTerm.toLowerCase();
    
    return newsUpdates.filter(update => {
      const matchesSearchTerm = searchTerm === '' ||
        update.title.toLowerCase().includes(lowercasedFilter) ||
        update.description.toLowerCase().includes(lowercasedFilter) ||
        update.company.toLowerCase().includes(lowercasedFilter);
      
      const matchesCountry = selectedCountry === '所有国家' || update.country === selectedCountry;
      const matchesCategory = selectedCategory === '所有类别' || update.category === selectedCategory;
      const matchesPricing = selectedPricing === '所有价格' || update.pricing === selectedPricing;
      
      return matchesSearchTerm && matchesCountry && matchesCategory && matchesPricing;
    });
  }, [searchTerm, selectedCountry, selectedCategory, selectedPricing]);

  useEffect(() => {
    const observer = new IntersectionObserver(
        ([e]) => setIsFilterStuck(e.intersectionRatio < 1),
        { threshold: [1], rootMargin: "-1px 0px 0px 0px" } // trigger when the sentinel is just scrolled past
    );

    if (filterSentinelRef.current) {
        observer.observe(filterSentinelRef.current);
    }

    return () => {
        if (filterSentinelRef.current) {
            observer.unobserve(filterSentinelRef.current);
        }
    };
  }, []);


  const renderContent = () => {
    if (filteredUpdates.length === 0) {
      return (
        <div className="text-center py-24">
          <p className="text-xl font-medium text-foreground">未找到任何模型</p>
          <p className="text-muted-foreground mt-2">请尝试调整您的搜索或筛选条件。</p>
        </div>
      );
    }
    
    const updatesByDate = filteredUpdates.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const countryBadges = countries.filter(c => c !== '所有国家');

    return (
        <div className="space-y-8">
            <div className="text-center">
                <p className="text-muted-foreground mb-4">快速导航至国家/地区</p>
                <div className="flex flex-wrap gap-2 justify-center">
                    {countryBadges.map(country => (
                        <a key={country} href={`#country-anchor-${country}`}>
                            <Badge variant="secondary" className="text-sm px-3 py-1 cursor-pointer hover:bg-primary/20 transition-colors">
                                {country} ({countryCounts[country] || 0})
                            </Badge>
                        </a>
                    ))}
                </div>
            </div>

            <div className="relative">
                 {updatesByDate.map((update, index) => {
                     const isFirstOfCountry = index === 0 || updatesByDate[index - 1].country !== update.country;
                     return (
                         <div key={update.id} className="relative pl-12 pb-12">
                             {isFirstOfCountry && (
                                <div id={`country-anchor-${update.country}`} className="absolute -top-24"></div>
                             )}
                             <div className="absolute left-0 top-0 flex flex-col items-center">
                                 <div className="w-10 h-10 rounded-lg bg-card border shadow-sm flex items-center justify-center">
                                     <Image src={update.logo} alt={`${update.company} logo`} width={28} height={28} className="rounded-md" data-ai-hint="logo" />
                                 </div>
                                 <div className="w-px h-full bg-border mt-2"></div>
                             </div>
                             <div className="ml-4">
                                {isFirstOfCountry && (
                                     <h2 className="text-2xl font-bold text-primary mb-6 pt-1">{update.country}</h2>
                                )}
                                <NewsCard news={update} />
                             </div>
                         </div>
                     )
                 })}
            </div>
        </div>
    );
  };


  return (
    <div className="min-h-screen bg-background text-foreground font-body">
      <header className="relative py-28 sm:py-40 text-center text-white bg-slate-900 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://placehold.co/1200x400.png"
            alt="ai 世界 Hero Image"
            fill
            className="object-cover"
            data-ai-hint="abstract technology"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/40 to-slate-900/20"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            ai 世界
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto mt-6">
            探索全球AI模型、产品与公司，抹平全球AI信息差。
          </p>
        </div>
      </header>
      
      <div ref={filterSentinelRef} className="h-px"></div>
      <div className={cn(
          "sticky top-0 z-40 transition-shadow bg-background/80 backdrop-blur-sm border-b",
          isFilterStuck ? "shadow-lg" : "shadow-none"
      )}>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="filters" className="border-b-0">
              <div className="container mx-auto px-4">
                 <AccordionTrigger className="h-14 hover:no-underline">
                   <div className="flex items-center gap-2 text-muted-foreground">
                      <Filter className="h-4 w-4" />
                      <span>搜索或筛选</span>
                   </div>
                 </AccordionTrigger>
              </div>
              <AccordionContent>
                <div className="border-t">
                  <div className="container mx-auto px-4 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="relative md:col-span-2">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="按关键字、公司、描述搜索..."
                                className="w-full pl-10 h-11 text-base rounded-lg bg-background"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                            <SelectTrigger className="h-11 text-base rounded-lg bg-background w-full">
                                <SelectValue placeholder="所有国家" />
                            </SelectTrigger>
                            <SelectContent>
                                {countries.map(country => (
                                    <SelectItem key={country} value={country}>{country} ({country === '所有国家' ? newsUpdates.length : countryCounts[country] || 0})</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                            <SelectTrigger className="h-11 text-base rounded-lg bg-background w-full">
                                <SelectValue placeholder="所有类别" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map(category => (
                                    <SelectItem key={category} value={category}>{category}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
      </div>
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
            {renderContent()}
        </div>
      </main>
    </div>
  )
}
