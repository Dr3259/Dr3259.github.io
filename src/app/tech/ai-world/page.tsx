
"use client";

import { useState, useMemo, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Search, Globe, Filter, Building, Briefcase } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { newsUpdates, type NewsUpdate } from '@/lib/data';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export default function AiWorldPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('所有国家');
  const [selectedCategory, setSelectedCategory] = useState('所有类别');
  const [selectedPricing, setSelectedPricing] = useState('所有价格');
  const [isHeaderStuck, setIsHeaderStuck] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);


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

  const groupedByCountryAndCompany = useMemo(() => {
    const activeUpdates = filteredUpdates.filter(update => update.status !== 'Deprecated');
    
    const grouped = activeUpdates.reduce((acc, update) => {
      if (!acc[update.country]) {
        acc[update.country] = {};
      }
      if (!acc[update.country][update.company]) {
        acc[update.country][update.company] = {
            updates: [],
            parentCompany: update.parentCompany || undefined,
            logo: update.logo,
        };
      }
      acc[update.country][update.company].updates.push(update);
      return acc;
    }, {} as Record<string, Record<string, { updates: NewsUpdate[], parentCompany?: string, logo: string }>>);

    for(const country in grouped) {
        for(const company in grouped[country]) {
            grouped[country][company].updates.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        }
    }
    return grouped;

  }, [filteredUpdates]);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
        ([e]) => setIsHeaderStuck(e.intersectionRatio < 1),
        { threshold: [1] }
    );

    if (sentinelRef.current) {
        observer.observe(sentinelRef.current);
    }

    return () => {
        if (sentinelRef.current) {
            observer.unobserve(sentinelRef.current);
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
    
    const countriesToRender = selectedCountry === '所有国家' 
        ? Object.keys(groupedByCountryAndCompany).sort((a,b) => Object.values(groupedByCountryAndCompany[b]).flatMap(c => c.updates).length - Object.values(groupedByCountryAndCompany[a]).flatMap(c => c.updates).length) 
        : (groupedByCountryAndCompany[selectedCountry] ? [selectedCountry] : []);

    return (
        <div className="space-y-20">
            {countriesToRender.map(country => (
                <div key={country}>
                    <h2 className="text-4xl font-bold mb-12 pb-4 border-b-2 border-primary flex items-center">
                        {country} 
                        <span className="text-lg text-muted-foreground ml-3">
                            ({Object.values(groupedByCountryAndCompany[country]).flatMap(c => c.updates).length})
                        </span>
                    </h2>
                    <div className="space-y-12">
                        {Object.keys(groupedByCountryAndCompany[country]).sort((a,b) => groupedByCountryAndCompany[country][b].updates.length - groupedByCountryAndCompany[country][a].updates.length).map((company, companyIndex) => {
                            const companyData = groupedByCountryAndCompany[country][company];
                            const isLastCompany = companyIndex === Object.keys(groupedByCountryAndCompany[country]).length - 1;
                            return (
                                <div key={company} className="flex gap-8 relative">
                                    <div className="flex flex-col items-center">
                                        <div className="flex-shrink-0 w-16 h-16 rounded-lg bg-card border shadow-sm flex items-center justify-center">
                                           <Image src={companyData.logo} alt={`${company} logo`} width={40} height={40} className="rounded-md" data-ai-hint="logo" />
                                        </div>
                                        {!isLastCompany && <div className="w-px h-full bg-border mt-4"></div>}
                                    </div>
                                    <div className="flex-1 pb-12">
                                        <h3 className="text-2xl font-semibold mb-2 flex items-center">
                                            {company}
                                            {companyData.parentCompany && <span className="text-sm text-muted-foreground ml-2">({companyData.parentCompany})</span>}
                                        </h3>
                                        <div className="space-y-4">
                                            {companyData.updates.map(update => (
                                                <a key={update.id} href={update.link} target="_blank" rel="noopener noreferrer" className="block p-4 rounded-lg bg-card/50 hover:bg-card/90 border border-transparent hover:border-border transition-all group">
                                                    <div className="flex justify-between items-start">
                                                        <h4 className="font-medium text-foreground group-hover:text-primary">{update.title} {update.version && <span className="text-sm text-muted-foreground">({update.version})</span>}</h4>
                                                        <p className="text-xs text-muted-foreground whitespace-nowrap">{format(new Date(update.date), 'yyyy-MM-dd')}</p>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground mt-1.5">{update.description}</p>
                                                    <div className="flex gap-2 mt-3">
                                                        <Badge variant="secondary">{update.category}</Badge>
                                                        <Badge variant="outline">{update.pricing}</Badge>
                                                        <Badge variant="outline">{update.type}</Badge>
                                                    </div>
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
  };


  return (
    <div className="min-h-screen bg-background text-foreground font-body">
      <header className="py-20 sm:py-28 text-center bg-background">
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-br from-primary to-foreground/80 bg-clip-text text-transparent">
            ai 世界
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mt-6">
            探索全球AI模型、产品与公司，抹平全球AI信息差。
          </p>
        </div>
      </header>
      
      <div ref={sentinelRef} className="h-px"></div>
      <div className={cn(
          "sticky top-0 z-40 transition-shadow",
          isHeaderStuck && "shadow-lg"
      )}>
          <div className="bg-background/80 backdrop-blur-sm">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row items-center gap-4 py-4">
                    <div className="relative w-full md:flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="按关键字、公司、描述搜索..."
                            className="w-full pl-10 h-11 text-base rounded-lg bg-background/70"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 md:flex-initial gap-4 w-full md:w-auto">
                        <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                            <SelectTrigger className="h-11 text-base rounded-lg bg-background/70 w-full">
                                <SelectValue placeholder="所有国家" />
                            </SelectTrigger>
                            <SelectContent>
                                {countries.map(country => (
                                    <SelectItem key={country} value={country}>{country} ({country === '所有国家' ? newsUpdates.length : countryCounts[country] || 0})</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                            <SelectTrigger className="h-11 text-base rounded-lg bg-background/70 w-full">
                                <SelectValue placeholder="所有类别" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map(category => (
                                    <SelectItem key={category} value={category}>{category}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select value={selectedPricing} onValueChange={setSelectedPricing}>
                            <SelectTrigger className="h-11 text-base rounded-lg bg-background/70 w-full">
                                <SelectValue placeholder="所有价格" />
                            </SelectTrigger>
                            <SelectContent>
                                {pricings.map(pricing => (
                                    <SelectItem key={pricing} value={pricing}>{pricing}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>
          </div>
      </div>
        
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
            {renderContent()}
        </div>
      </main>
      
      <footer className="text-center py-8 text-sm text-muted-foreground border-t bg-card mt-16">
          <p>&copy; {new Date().getFullYear()} ai 世界. 版权所有.</p>
      </footer>
    </div>
  );
}

