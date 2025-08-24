
"use client";

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { Search, Globe, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { NewsCard } from '@/components/news-card';
import { newsUpdates, type NewsUpdate } from '@/lib/data';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';

export default function AiWorldPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
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

  const groupedAndSortedUpdates = useMemo(() => {
    const sorted = [...filteredUpdates].sort((a, b) => {
      switch (sortBy) {
        case 'category':
          return a.category.localeCompare(b.category);
        case 'date':
        default:
          return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });

    const groupedByCountry = sorted.reduce((acc, update) => {
      const country = update.country;
      if (!acc[country]) {
        acc[country] = [];
      }
      acc[country].push(update);
      return acc;
    }, {} as Record<string, NewsUpdate[]>);

    const countryUpdateCounts = Object.keys(groupedByCountry).reduce((acc, country) => {
        acc[country] = groupedByCountry[country].length;
        return acc;
    }, {} as Record<string, number>);

    const sortedCountries = Object.keys(groupedByCountry).sort((a, b) => {
        return countryUpdateCounts[b] - countryUpdateCounts[a];
    });

    return sortedCountries.map(country => {
      const countryUpdates = groupedByCountry[country];
      
      const groupedByCompany = countryUpdates.reduce((acc, update) => {
        const company = update.company;
        if (!acc[company]) {
          acc[company] = [];
        }
        acc[company].push(update);
        return acc;
      }, {} as Record<string, NewsUpdate[]>);

      const sortedCompanies = Object.keys(groupedByCompany).sort((a, b) => {
          const countA = groupedByCompany[a].length;
          const countB = groupedByCompany[b].length;
          if(countB !== countA) return countB - countA;
          // If counts are equal, sort by company name
          return a.localeCompare(b);
      });

      const companies = sortedCompanies.map(company => {
        const updates = groupedByCompany[company];
        // Sort updates within each company by date
        updates.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        return { company, updates };
      });

      return { country, companies, count: countryUpdates.length };
    });
  }, [filteredUpdates, sortBy]);

  return (
    <div className="min-h-screen bg-background text-foreground font-body">
      <header className="relative border-b py-20 sm:py-28 text-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://storage.googleapis.com/aif-st-images-dev/v1/9a41922c-a2cb-4560-b6e9-27b2e3e1d1f0"
            alt="Blue mountains background"
            fill
            style={{ objectFit: 'cover' }}
            data-ai-hint="mountains landscape"
            priority
          />
          <div className="absolute inset-0 bg-slate-900/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex justify-center items-center gap-4 mb-4">
            <div className="p-3 bg-primary/10 rounded-full border border-primary/20">
              <Globe className="w-10 h-10 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground tracking-tight">
            全球AI观察
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mt-6">
            探索全球AI模型、产品与公司，抹平全球AI信息差。
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="mb-8 md:mb-12">
          <Accordion type="single" collapsible className="w-full bg-card rounded-xl border shadow-sm">
            <AccordionItem value="item-1" className="border-b-0">
              <AccordionTrigger className="p-6 text-lg font-medium hover:no-underline data-[state=open]:border-b">
                <div className="flex items-center gap-3">
                  <Filter className="h-5 w-5 text-muted-foreground" />
                  <span>搜索、筛选与视图切换</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-6 p-6 pt-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="按关键字、公司、描述搜索..."
                      className="w-full pl-10 h-11 text-base rounded-lg"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  <Separator />
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-full sm:w-[180px] h-11 text-base rounded-lg">
                          <SelectValue placeholder="排序方式" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="date">按发布日期排序</SelectItem>
                          <SelectItem value="category">按类别排序</SelectItem>
                        </SelectContent>
                      </Select>
                      <Link href="/compare" passHref>
                        <Button variant="outline" className="w-full sm:w-auto h-11 text-base rounded-lg shadow-sm whitespace-nowrap">
                          切换到维度对比视图
                        </Button>
                      </Link>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        
        {groupedAndSortedUpdates.length > 0 ? (
          <div className="space-y-16">
            {groupedAndSortedUpdates.map(({ country, companies, count }) => (
              <div key={country}>
                <h2 className="text-4xl font-bold mb-8 pb-3 border-b-2 border-primary">
                  {country} ({count})
                </h2>
                <div className="space-y-12">
                  {companies.map(({ company, updates }) => (
                    <section key={company}>
                      <h3 className="text-2xl font-semibold mb-6 pb-2 border-b border-border">
                        {company}
                      </h3>
                      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {updates.map((update) => (
                          <NewsCard key={update.id} news={update} />
                        ))}
                      </div>
                    </section>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-xl font-medium text-foreground">未找到任何模型</p>
            <p className="text-muted-foreground">请尝试调整您的搜索或筛选条件。</p>
          </div>
        )}
      </main>
      
      <footer className="text-center py-6 text-sm text-muted-foreground border-t bg-card mt-16">
          <p>&copy; {new Date().getFullYear()} 全球AI观察. 版权所有.</p>
      </footer>
    </div>
  );
}

    