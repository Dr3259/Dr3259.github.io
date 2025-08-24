
"use client";

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { Search, Globe, Filter, Building, ChevronDown, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { NewsCard } from '@/components/news-card';
import { newsUpdates, type NewsUpdate } from '@/lib/data';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function AiWorldPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('所有国家');
  const [selectedCategory, setSelectedCategory] = useState('所有类别');
  const [selectedPricing, setSelectedPricing] = useState('所有价格');

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
    const grouped = filteredUpdates.reduce((acc, update) => {
      if (!acc[update.country]) {
        acc[update.country] = {};
      }
      if (!acc[update.country][update.company]) {
        acc[update.country][update.company] = [];
      }
      acc[update.country][update.company].push(update);
      return acc;
    }, {} as Record<string, Record<string, NewsUpdate[]>>);

    for(const country in grouped) {
        for(const company in grouped[country]) {
            grouped[country][company].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        }
    }
    return grouped;

  }, [filteredUpdates]);
  
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
        ? Object.keys(groupedByCountryAndCompany).sort((a,b) => Object.values(groupedByCountryAndCompany[b]).flat().length - Object.values(groupedByCountryAndCompany[a]).flat().length) 
        : [selectedCountry];

    return (
        <div className="space-y-20">
        {countriesToRender.map(country => (
            <div key={country}>
              <h2 className="text-3xl font-bold mb-10 pb-4 border-b-2 border-primary flex items-center">
                  {country} <span className="text-lg text-muted-foreground ml-3">({Object.values(groupedByCountryAndCompany[country]).flat().length})</span>
              </h2>
              <div className="space-y-12">
                {Object.keys(groupedByCountryAndCompany[country]).sort((a,b) => groupedByCountryAndCompany[country][b].length - groupedByCountryAndCompany[country][a].length).map(company => (
                  <section key={company}>
                    <h3 className="text-2xl font-semibold mb-6 pb-2 border-b border-border/80 flex items-center">
                      <Building className="mr-3 h-5 w-5 text-muted-foreground"/> {company}
                    </h3>
                    <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {groupedByCountryAndCompany[country][company].map((update) => (
                        <NewsCard key={update.id} news={update} />
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            </div>
        ))}
        </div>
    );
  };


  return (
    <div className="min-h-screen bg-background text-foreground font-body">
      <div className="relative w-full">
         <header className="sticky top-0 z-40 w-full border-b bg-background/90 backdrop-blur-sm">
            <div className="container mx-auto flex h-16 items-center px-4">
                <Link href="/tech" className="mr-6 flex items-center space-x-2">
                    <Globe className="h-6 w-6 text-primary" />
                    <span className="font-bold hidden sm:inline-block">全球AI观察</span>
                </Link>
                <nav className="flex-1">
                    {/* Add nav items here if needed */}
                </nav>
                 <Link href="/compare" passHref>
                    <Button variant="outline" className="hidden sm:flex">
                      维度对比
                    </Button>
                </Link>
            </div>
         </header>
        
        <main className="container mx-auto px-4">
            <section className="py-20 text-center">
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-blue-400 text-transparent bg-clip-text">
                    全球AI观察
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mt-6">
                    探索全球AI模型、产品与公司，抹平全球AI信息差。
                </p>
            </section>
            
            <div className="sticky top-[65px] z-30 bg-background/80 backdrop-blur-md py-6 mb-12">
                 <div className="space-y-4 max-w-5xl mx-auto">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                          type="search"
                          placeholder="按关键字、公司、描述搜索..."
                          className="w-full pl-10 h-12 text-base rounded-lg shadow-sm"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                          <SelectTrigger className="h-11 text-base rounded-lg">
                            <SelectValue placeholder="所有国家" />
                          </SelectTrigger>
                          <SelectContent>
                            {countries.map(country => (
                              <SelectItem key={country} value={country}>{country} ({country === '所有国家' ? newsUpdates.length : countryCounts[country] || 0})</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                          <SelectTrigger className="h-11 text-base rounded-lg">
                            <SelectValue placeholder="所有类别" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map(category => (
                              <SelectItem key={category} value={category}>{category}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Select value={selectedPricing} onValueChange={setSelectedPricing}>
                          <SelectTrigger className="h-11 text-base rounded-lg">
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

            <div className="max-w-7xl mx-auto">
              {renderContent()}
            </div>
        </main>
      </div>
      
      <footer className="text-center py-8 text-sm text-muted-foreground border-t bg-card mt-16">
          <p>&copy; {new Date().getFullYear()} 全球AI观察. 版权所有.</p>
      </footer>
    </div>
  );
}
