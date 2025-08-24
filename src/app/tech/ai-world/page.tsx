"use client";

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { Search, Globe, Filter, Building, ChevronDown, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { NewsCard } from '@/components/news-card';
import { newsUpdates, type NewsUpdate } from '@/lib/data';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';
import { Sidebar, SidebarContent, SidebarHeader, SidebarProvider, SidebarSection, SidebarItem } from '@/components/ui/sidebar-pro';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';


export default function AiWorldPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [selectedCountry, setSelectedCountry] = useState('所有国家');
  const [selectedCategory, setSelectedCategory] = useState('所有类别');
  const [selectedPricing, setSelectedPricing] = useState('所有价格');
  const [open, setOpen] = useState(false);

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
  
  const companiesInSelectedCountry = useMemo(() => {
      if(selectedCountry === '所有国家') return [];
      return Object.keys(groupedByCountryAndCompany[selectedCountry] || {}).sort();
  }, [selectedCountry, groupedByCountryAndCompany]);

  const renderContent = () => {
    if (filteredUpdates.length === 0) {
      return (
        <div className="text-center py-16">
          <p className="text-xl font-medium text-foreground">未找到任何模型</p>
          <p className="text-muted-foreground">请尝试调整您的搜索或筛选条件。</p>
        </div>
      );
    }
    
    const countriesToRender = selectedCountry === '所有国家' 
        ? Object.keys(groupedByCountryAndCompany).sort((a,b) => Object.values(groupedByCountryAndCompany[b]).flat().length - Object.values(groupedByCountryAndCompany[a]).flat().length) 
        : [selectedCountry];

    return (
        <div className="space-y-16">
        {countriesToRender.map(country => (
            <div key={country}>
            <h2 className="text-3xl font-bold mb-8 pb-3 border-b-2 border-primary flex items-center">
                {country} <span className="text-lg text-muted-foreground ml-2">({Object.values(groupedByCountryAndCompany[country]).flat().length})</span>
            </h2>
            <div className="space-y-12">
              {Object.keys(groupedByCountryAndCompany[country]).sort((a,b) => groupedByCountryAndCompany[country][b].length - groupedByCountryAndCompany[country][a].length).map(company => (
                <section key={company}>
                  <h3 className="text-2xl font-semibold mb-6 pb-2 border-b border-border flex items-center">
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
    <SidebarProvider>
        <div className="min-h-screen bg-background text-foreground font-body flex">
            <Sidebar className="w-72 border-r">
                <SidebarHeader>
                    <div className="p-4 flex items-center gap-3">
                         <div className="p-2 bg-primary/10 rounded-lg border border-primary/20">
                            <Globe className="w-6 h-6 text-primary" />
                        </div>
                        <h1 className="text-xl font-semibold">全球AI观察</h1>
                    </div>
                </SidebarHeader>
                <SidebarContent className="p-4">
                     <div className="space-y-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                            type="search"
                            placeholder="搜索..."
                            className="w-full pl-9 h-10 text-sm rounded-lg"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                            <SelectTrigger className="h-10 text-sm rounded-lg">
                                <SelectValue placeholder="所有类别" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map(category => (
                                <SelectItem key={category} value={category}>{category}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select value={selectedPricing} onValueChange={setSelectedPricing}>
                            <SelectTrigger className="h-10 text-sm rounded-lg">
                                <SelectValue placeholder="所有价格" />
                            </SelectTrigger>
                            <SelectContent>
                                {pricings.map(pricing => (
                                <SelectItem key={pricing} value={pricing}>{pricing}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <Separator className="my-6" />

                    <h2 className="text-sm font-semibold text-muted-foreground px-2 mb-2">国家/地区</h2>
                    <ScrollArea className="h-[calc(100vh-320px)]">
                        <nav className="space-y-1 pr-2">
                        {countries.map(country => (
                            <Button
                            key={country}
                            variant={selectedCountry === country ? 'secondary' : 'ghost'}
                            className="w-full justify-start h-9"
                            onClick={() => setSelectedCountry(country)}
                            >
                            <span className="flex-1 truncate text-left">{country}</span>
                            <span className="text-xs text-muted-foreground">
                                {country === '所有国家' ? newsUpdates.length : countryCounts[country] || 0}
                            </span>
                            </Button>
                        ))}
                        </nav>
                    </ScrollArea>
                </SidebarContent>
            </Sidebar>

            <main className="flex-1 overflow-y-auto">
                 <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b p-4">
                    <div className="container mx-auto flex items-center justify-between">
                         <div className="text-lg font-medium">
                            {selectedCountry === '所有国家' ? '所有国家' : selectedCountry}
                         </div>
                    </div>
                </header>
                <div className="container mx-auto px-4 py-8 md:py-12">
                    {renderContent()}
                </div>
                 <footer className="text-center py-6 text-sm text-muted-foreground border-t bg-card mt-16">
                    <p>&copy; {new Date().getFullYear()} 全球AI观察. 版权所有.</p>
                </footer>
            </main>
        </div>
    </SidebarProvider>
  );
}

// A new component for the sidebar UI. I've named it sidebar-pro to avoid conflicts.
const SidebarPro = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <aside className={cn('w-72 flex-col border-r', className)}>
      {children}
    </aside>
  );
};
