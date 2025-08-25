
"use client";

import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { Search, Globe } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { newsUpdates, companyUrls, type NewsUpdate } from '@/lib/data';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { NewsCard } from '@/components/news-card';
import { getLogoUrl } from '@/lib/utils';


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

interface GroupedNews {
    [country: string]: {
        [company: string]: NewsUpdate[];
    };
}

const applyFilters = (
    updates: NewsUpdate[],
    searchTerm: string,
    country: string,
    category: string,
    pricing: string
): NewsUpdate[] => {
    const lowercasedFilter = searchTerm.toLowerCase();
    return updates.filter(update => {
        const matchesSearchTerm = searchTerm === '' ||
            update.title.toLowerCase().includes(lowercasedFilter) ||
            update.description.toLowerCase().includes(lowercasedFilter) ||
            update.company.toLowerCase().includes(lowercasedFilter);
        
        const matchesCountry = country === '所有国家' || update.country === country;
        const matchesCategory = category === '所有类别' || update.category === category;
        const matchesPricing = pricing === '所有价格' || update.pricing === pricing;
        
        return matchesSearchTerm && matchesCountry && matchesCategory && matchesPricing;
    });
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
    // Only run on the client-side
    setHeroImage('https://placehold.co/1200x400');
  }, []);

  const { countries, countryCounts } = useMemo(() => {
    const filteredForCounts = applyFilters(newsUpdates, searchTerm, '所有国家', selectedCategory, selectedPricing);
    const counts = filteredForCounts.reduce((acc, update) => {
        acc[update.country] = (acc[update.country] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
  
    const sorted = Array.from(new Set(filteredForCounts.map(u => u.country)))
      .sort((a, b) => (counts[b] || 0) - (counts[a] || 0));
    
    const totalCount = filteredForCounts.length;

    return { 
        countries: [{name: '所有国家', count: totalCount}, ...sorted.map(c => ({name: c, count: counts[c] || 0}))], 
        countryCounts: counts 
    };
  }, [searchTerm, selectedCategory, selectedPricing]);

  const categories = useMemo(() => ['所有类别', ...Array.from(new Set(newsUpdates.map(u => u.category))).sort()], []);
  const pricings = useMemo(() => ['所有价格', ...Array.from(new Set(newsUpdates.map(u => u.pricing)))], []);

  const groupedAndSortedUpdates = useMemo(() => {
    const filteredUpdates = applyFilters(newsUpdates, searchTerm, selectedCountry, selectedCategory, selectedPricing);

    const grouped: GroupedNews = {};
    filteredUpdates.forEach(update => {
        if (!grouped[update.country]) {
            grouped[update.country] = {};
        }
        if (!grouped[update.country][update.company]) {
            grouped[update.country][update.company] = [];
        }
        grouped[update.country][update.company].push(update);
    });

    const sortedCountries = Object.keys(grouped).sort((a, b) => {
        const countA = Object.values(grouped[a]).flat().length;
        const countB = Object.values(grouped[b]).flat().length;
        return countB - countA;
    });

    const finalGrouped: GroupedNews = {};
    sortedCountries.forEach(country => {
        const companies = grouped[country];
        const sortedCompanies = Object.keys(companies).sort((a, b) => {
            return companies[b].length - companies[a].length;
        });
        finalGrouped[country] = {};
        sortedCompanies.forEach(company => {
            finalGrouped[country][company] = companies[company].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        });
    });

    return finalGrouped;

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

  const handleCountryBadgeClick = (country: string) => {
    setSelectedCountry(country);
    setSearchTerm(''); 
    const anchor = document.getElementById(`country-anchor-${country}`);
    if (anchor) {
      const yOffset = -120; // Adjust for sticky header
      const y = anchor.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({top: y, behavior: 'smooth'});
    }
  };


  const renderContent = () => {
    const countriesWithContent = Object.keys(groupedAndSortedUpdates);
    if (countriesWithContent.length === 0) {
      return (
        <div className="text-center py-24">
          <p className="text-xl font-medium text-foreground">未找到任何模型</p>
          <p className="text-muted-foreground mt-2">请尝试调整您的搜索或筛选条件。</p>
        </div>
      );
    }
    
    const countryBadges = countries
      .filter(c => c.name !== '所有国家' && countryCounts[c.name] > 0)
      .map(c => ({ name: c.name, count: countryCounts[c.name] || 0 }));


    return (
        <div className="space-y-8">
            {countryBadges.length > 1 && (
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
            )}

            <div className="relative pl-6">
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border -translate-x-1/2"></div>
                
                {countriesWithContent.map((country, countryIndex) => (
                    <div key={country} className="relative">
                        <div id={`country-anchor-${country}`} className="absolute top-0 -left-6 -translate-x-1/2 z-10">
                             <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-card border-2 border-primary/50 shadow-sm text-3xl">
                                {countryFlags[country] || '🌐'}
                            </div>
                        </div>

                        <div className="pt-2 pl-12 space-y-8">
                            {Object.entries(groupedAndSortedUpdates[country]).map(([company, updates], companyIndex) => (
                                <div key={company} className="relative">
                                    <div className="absolute top-8 -left-12 -translate-x-1/2 z-10">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-card border-2 border-primary/20 shadow-sm p-1.5 ring-4 ring-background">
                                            <Image 
                                                src={getLogoUrl(companyUrls[company] || updates[0].link)}
                                                alt={`${company} logo`}
                                                width={36}
                                                height={36}
                                                className="rounded-full"
                                                data-ai-hint="logo"
                                            />
                                        </div>
                                    </div>
                                    <div className="pl-6 space-y-4">
                                        {updates.map(update => (
                                            <NewsCard key={update.id} news={update} />
                                        ))}
                                    </div>
                                     {companyIndex < Object.keys(groupedAndSortedUpdates[country]).length - 1 && (
                                        <Separator className="my-12 w-2/3 mx-auto" />
                                     )}
                                </div>
                            ))}
                        </div>
                         {countryIndex < countriesWithContent.length - 1 && (
                            <div className="my-12">
                                <Separator />
                            </div>
                         )}
                    </div>
                ))}
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
              data-ai-hint="technology abstract"
            />
          )}
          <div className="absolute inset-0 bg-black/50 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight" style={{textShadow: '2px 2px 8px rgba(0,0,0,0.7)'}}>
            ai 世界
          </h1>
          <p className="text-lg md:text-xl text-slate-200 max-w-3xl mx-auto mt-6" style={{textShadow: '1px 1px 4px rgba(0,0,0,0.7)'}}>
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

    