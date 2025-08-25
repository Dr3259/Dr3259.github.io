
"use client";

import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { Search, Globe } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { newsUpdates, type NewsUpdate } from '@/lib/data';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { NewsCard } from '@/components/news-card';

const countryFlags: Record<string, string> = {
  '美国': '🇺🇸',
  '中国': '🇨🇳',
  '英国': '🇬🇧',
  '法国': '🇫🇷',
  '加拿大': '🇨🇦',
  '德国': '🇩🇪',
  '俄罗斯': '🇷🇺',
  '日本': '🇯🇵',
  '韩国': '🇰🇷',
  '印度': '🇮🇳',
};


export default function AiWorldPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('所有国家');
  const [selectedCategory, setSelectedCategory] = useState('所有类别');
  const [selectedPricing, setSelectedPricing] = useState('所有价格');
  const [isFilterStuck, setIsFilterStuck] = useState(false);
  const filterSentinelRef = useRef<HTMLDivElement>(null);
  const [heroImage, setHeroImage] = useState<string | null>(null);

  useEffect(() => {
    // Set image on client-side to prevent hydration mismatch
    setHeroImage('https://picsum.photos/1200/400');
  }, []);


  const { countries, countryCounts } = useMemo(() => {
    const counts = newsUpdates.reduce((acc, update) => {
      const releaseYear = new Date(update.date).getFullYear();
      if (releaseYear >= 2021) {
        acc[update.country] = (acc[update.country] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);
  
    const sorted = Array.from(new Set(newsUpdates.map(u => u.country)))
      .sort((a, b) => (counts[b] || 0) - (counts[a] || 0));
    
    const totalCount = Object.values(counts).reduce((sum, count) => sum + count, 0);

    return { countries: [{name: '所有国家', count: totalCount}, ...sorted.map(c => ({name: c, count: counts[c] || 0}))], countryCounts: counts };
  }, []);

  const categories = useMemo(() => ['所有类别', ...Array.from(new Set(newsUpdates.map(u => u.category))).sort()], []);
  const pricings = useMemo(() => ['所有价格', ...Array.from(new Set(newsUpdates.map(u => u.pricing)))], []);

  const filteredAndSortedUpdates = useMemo(() => {
    let updates = newsUpdates.filter(update => new Date(update.date).getFullYear() >= 2021);

    const countryOrder = [...countries]
        .filter(c => c.name !== '所有国家')
        .sort((a, b) => b.count - a.count)
        .map(c => c.name);

    updates.sort((a, b) => {
        const countryIndexA = countryOrder.indexOf(a.country);
        const countryIndexB = countryOrder.indexOf(b.country);
        if (countryIndexA !== countryIndexB) {
            return countryIndexA - countryIndexB;
        }

        // Within the same country, sort by company product count
        const companyACount = updates.filter(u => u.country === a.country && u.company === a.company).length;
        const companyBCount = updates.filter(u => u.country === b.country && u.company === b.company).length;
        if (companyACount !== companyBCount) {
            return companyBCount - companyACount;
        }

        // Finally, sort by date
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
    
    const lowercasedFilter = searchTerm.toLowerCase();

    return updates.filter(update => {
        const matchesSearchTerm = searchTerm === '' ||
            update.title.toLowerCase().includes(lowercasedFilter) ||
            update.description.toLowerCase().includes(lowercasedFilter) ||
            update.company.toLowerCase().includes(lowercasedFilter);
        
        const matchesCountry = selectedCountry === '所有国家' || update.country === selectedCountry;
        const matchesCategory = selectedCategory === '所有类别' || update.category === selectedCategory;
        const matchesPricing = selectedPricing === '所有价格' || update.pricing === selectedPricing;
        
        return matchesSearchTerm && matchesCountry && matchesCategory && matchesPricing;
    });

  }, [searchTerm, selectedCountry, selectedCategory, selectedPricing, countries]);

  useEffect(() => {
    const observer = new IntersectionObserver(
        ([e]) => setIsFilterStuck(e.intersectionRatio < 1),
        { threshold: [1], rootMargin: "-1px 0px 0px 0px" } 
    );

    const currentRef = filterSentinelRef.current;
    if (currentRef) {
        observer.observe(currentRef);
    }

    return () => {
        if (currentRef) {
            observer.unobserve(currentRef);
        }
    };
  }, []);

  const handleCountryBadgeClick = (country: string) => {
    setSelectedCountry(country);
    setSearchTerm(''); 
    const anchor = document.getElementById(`country-anchor-${country}`);
    if (anchor) {
      anchor.scrollIntoView({ behavior: 'smooth' });
    }
  };


  const renderContent = () => {
    if (filteredAndSortedUpdates.length === 0) {
      return (
        <div className="text-center py-24">
          <p className="text-xl font-medium text-foreground">未找到任何模型</p>
          <p className="text-muted-foreground mt-2">请尝试调整您的搜索或筛选条件。</p>
        </div>
      );
    }
    
    const countryBadges = countries.filter(c => c.name !== '所有国家');

    return (
        <div className="space-y-8">
            <div className="text-center">
                <p className="text-muted-foreground mb-4">快速导航至国家/地区</p>
                <div className="flex flex-wrap gap-2 justify-center">
                    {countryBadges.map(country => (
                        <Badge 
                            key={country.name} 
                            variant={selectedCountry === country.name ? "default" : "secondary"}
                            className="text-sm px-3 py-1 cursor-pointer hover:bg-primary/20 transition-colors"
                            onClick={() => handleCountryBadgeClick(country.name)}
                            >
                                {country.name} ({country.count})
                        </Badge>
                    ))}
                </div>
            </div>

            <div>
                 {filteredAndSortedUpdates.map((update, index) => {
                     const isFirstOfCountry = index === 0 || filteredAndSortedUpdates[index - 1].country !== update.country;
                     
                     return (
                         <div key={update.id}>
                            {isFirstOfCountry && index > 0 && <Separator className="my-12" />}
                            <div className="relative pl-6">
                                <div className={cn("absolute left-0 top-0 h-full w-px bg-border", isFirstOfCountry ? "mt-12" : "")}></div>
                                <div className="relative">
                                    {isFirstOfCountry && (
                                        <div id={`country-anchor-${update.country}`} className="absolute left-0 top-0 flex items-center gap-4 -translate-x-1/2 pt-4">
                                            <div className="z-10 flex h-12 w-12 items-center justify-center rounded-full bg-card border-2 border-primary/50 shadow-sm text-3xl">
                                               {countryFlags[update.country] || '🌐'}
                                           </div>
                                        </div>
                                    )}
                                    <div className="pl-12 pb-10">
                                        <NewsCard news={update} />
                                    </div>
                                </div>
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
          {heroImage && (
            <Image
              src={heroImage}
              alt="ai 世界 Hero Image"
              fill
              className="object-cover transition-opacity duration-1000 opacity-0"
              onLoad={(e) => e.currentTarget.classList.remove('opacity-0')}
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
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
      
      <div className="container mx-auto px-4 relative z-20 -mt-8">
        <div ref={filterSentinelRef} className="h-px"></div>
         <div className={cn(
            "sticky top-4 z-40 transition-all duration-300",
            isFilterStuck && "pt-4"
        )}>
          <div className={cn(
            "p-3 rounded-xl transition-all duration-300",
            isFilterStuck ? "bg-background/80 backdrop-blur-sm shadow-lg border" : "bg-card shadow-md"
          )}>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
                  <div className="relative md:col-span-2">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                          type="search"
                          placeholder="按关键字、公司、描述搜索..."
                          className="w-full pl-10 h-11 text-base rounded-lg bg-background/50 focus:bg-background"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                      />
                  </div>
                  <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                      <SelectTrigger className="h-11 text-base rounded-lg bg-background/50 focus:bg-background w-full">
                          <SelectValue placeholder="所有国家" />
                      </SelectTrigger>
                      <SelectContent>
                          {countries.map(country => (
                              <SelectItem key={country.name} value={country.name}>{country.name} ({country.count})</SelectItem>
                          ))}
                      </SelectContent>
                  </Select>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="h-11 text-base rounded-lg bg-background/50 focus:bg-background w-full">
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
        
        <main className="pt-12">
          <div className="max-w-4xl mx-auto">
              {renderContent()}
          </div>
        </main>
      </div>
    </div>
  )
}
