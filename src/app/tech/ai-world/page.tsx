
"use client";

import React, { useState, useMemo, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Search, Globe } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { newsUpdates, type NewsUpdate } from '@/lib/data';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { NewsCard } from '@/components/news-card';


export default function AiWorldPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('所有国家');
  const [selectedCategory, setSelectedCategory] = useState('所有类别');
  const [selectedPricing, setSelectedPricing] = useState('所有价格');
  const [isFilterStuck, setIsFilterStuck] = useState(false);
  const filterSentinelRef = useRef<HTMLDivElement>(null);


  const { countries, countryCounts } = useMemo(() => {
    const counts = newsUpdates.reduce((acc, update) => {
      acc[update.country] = (acc[update.country] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const sorted = Array.from(new Set(newsUpdates.map(u => u.country)))
      .sort((a, b) => (counts[b] || 0) - (counts[a] || 0));
    
    return { countries: ['所有国家', ...sorted], countryCounts: counts };
  }, []);

  const categories = useMemo(() => ['所有类别', ...Array.from(new Set(newsUpdates.map(u => u.category))).sort()], []);
  const pricings = useMemo(() => ['所有价格', ...Array.from(new Set(newsUpdates.map(u => u.pricing)))], []);

  const filteredAndSortedUpdates = useMemo(() => {
    const lowercasedFilter = searchTerm.toLowerCase();

    const filtered = newsUpdates.filter(update => {
        const releaseYear = new Date(update.date).getFullYear();
        if (releaseYear < 2021) return false;

        const matchesSearchTerm = searchTerm === '' ||
            update.title.toLowerCase().includes(lowercasedFilter) ||
            update.description.toLowerCase().includes(lowercasedFilter) ||
            update.company.toLowerCase().includes(lowercasedFilter);
        
        const matchesCountry = selectedCountry === '所有国家' || update.country === selectedCountry;
        const matchesCategory = selectedCategory === '所有类别' || update.category === selectedCategory;
        const matchesPricing = selectedPricing === '所有价格' || update.pricing === selectedPricing;
        
        return matchesSearchTerm && matchesCountry && matchesCategory && matchesPricing;
    });

    const groupedByCountry = filtered.reduce((acc, update) => {
        (acc[update.country] = acc[update.country] || []).push(update);
        return acc;
    }, {} as Record<string, NewsUpdate[]>);

    const sortedCountryNames = Object.keys(groupedByCountry).sort((a, b) => {
        return groupedByCountry[b].length - groupedByCountry[a].length;
    });

    const finalList: NewsUpdate[] = [];
    sortedCountryNames.forEach(country => {
        const countryUpdates = groupedByCountry[country];

        const groupedByCompany = countryUpdates.reduce((acc, update) => {
            (acc[update.company] = acc[update.company] || []).push(update);
            return acc;
        }, {} as Record<string, NewsUpdate[]>);

        const sortedCompanies = Object.keys(groupedByCompany).sort((a, b) => {
            return groupedByCompany[b].length - groupedByCompany[a].length;
        });

        sortedCompanies.forEach(company => {
            const companyUpdates = groupedByCompany[company];
            companyUpdates.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            finalList.push(...companyUpdates);
        });
    });

    return finalList;
  }, [searchTerm, selectedCountry, selectedCategory, selectedPricing]);

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


  const renderContent = () => {
    if (filteredAndSortedUpdates.length === 0) {
      return (
        <div className="text-center py-24">
          <p className="text-xl font-medium text-foreground">未找到任何模型</p>
          <p className="text-muted-foreground mt-2">请尝试调整您的搜索或筛选条件。</p>
        </div>
      );
    }
    
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

            <div>
                 {filteredAndSortedUpdates.map((update, index) => {
                     const isFirstOfCountry = index === 0 || filteredAndSortedUpdates[index - 1].country !== update.country;
                     const isFirstOfCompany = index === 0 || filteredAndSortedUpdates[index - 1].company !== update.company || isFirstOfCountry;

                     return (
                         <div key={update.id}>
                            {isFirstOfCountry && index > 0 && <Separator className="my-12" />}
                            {isFirstOfCountry && (
                                <div id={`country-anchor-${update.country}`} className="relative flex items-center gap-4 mb-8 pt-4">
                                     <div className="z-10 flex h-10 w-10 items-center justify-center rounded-full bg-card border-2 border-primary/50 shadow-sm">
                                        <Globe className="h-5 w-5 text-primary" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-primary">{update.country}</h2>
                                </div>
                            )}
                             <div className="relative pl-5">
                                <div className="absolute left-5 top-0 h-full w-px bg-border -translate-x-1/2"></div>
                                <div className="relative">
                                    {isFirstOfCompany && (
                                        <div className="absolute left-0 top-1.5 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-lg bg-card border shadow-sm">
                                             <Image src={update.logo} alt={`${update.company} logo`} width={28} height={28} className="rounded-md" data-ai-hint="logo" />
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
          <Image
            src="https://placehold.co/1200x400.png"
            alt="ai 世界 Hero Image"
            fill
            className="object-cover"
            data-ai-hint="abstract technology"
            priority
          />
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
                              <SelectItem key={country} value={country}>{country} ({country === '所有国家' ? newsUpdates.length : countryCounts[country] || 0})</SelectItem>
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
