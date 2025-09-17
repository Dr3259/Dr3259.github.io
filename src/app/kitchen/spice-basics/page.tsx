
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, Leaf, Search, Globe } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const translations = {
  'zh-CN': {
    pageTitle: '香料基础',
    backButton: '返回厨房',
    pageDescription: '探索世界各地的香料，为您的烹饪增添风味。',
    searchPlaceholder: '搜索香料...',
    spices: {
      starAnise: { name: '八角', family: '木兰科', description: '带有甘草味的香料，常用于中式炖菜和卤水中。', hint: 'star anise spice' },
      cinnamon: { name: '肉桂', family: '樟科', description: '温暖甜美的香料，可用于甜点和咸味菜肴。', hint: 'cinnamon sticks' },
      cloves: { name: '丁香', family: '桃金娘科', description: '味道浓烈，带有甜味和辛辣味，常用于烘焙和腌料。', hint: 'cloves spice' },
      sichuanPeppercorn: { name: '花椒', family: '芸香科', description: '带来独特的麻感和柑橘香气，是川菜的灵魂。', hint: 'sichuan peppercorn' },
      fennel: { name: '小茴香', family: '伞形科', description: '味道类似甘草，常用于印度和中东菜肴。', hint: 'fennel seeds' },
      turmeric: { name: '姜黄', family: '姜科', description: '赋予菜肴金黄色泽，带有温和的泥土味，是咖喱的主要成分。', hint: 'turmeric powder' },
      cumin: { name: '孜然', family: '伞形科', description: '浓郁的烟熏味，广泛用于墨西哥、印度和中东美食。', hint: 'cumin seeds' },
      coriander: { name: '香菜籽', family: '伞形科', description: '带有柑橘和花香味，常用于咖喱、汤和腌料。', hint: 'coriander seeds' },
      basil: { name: '罗勒', family: '唇形科', description: '甜美略带胡椒味，是意大利菜和东南亚菜的核心。', hint: 'basil leaves' },
      rosemary: { name: '迷迭香', family: '唇形科', description: '松香味浓郁，适合搭配烤肉、面包和土豆。', hint: 'rosemary sprig' },
      thyme: { name: '百里香', family: '唇形科', description: '带有淡淡的薄荷和泥土味，是许多欧洲菜肴的基础。', hint: 'thyme sprigs' },
      cardamom: { name: '豆蔻', family: '姜科', description: '味道复杂，带有薄荷、柑橘和香料味，在甜点和咸味菜肴中均有使用。', hint: 'cardamom pods' },
    }
  },
  'en': {
    pageTitle: 'Spice Basics',
    backButton: 'Back to Kitchen',
    pageDescription: 'Explore spices from around the world to elevate your cooking.',
    searchPlaceholder: 'Search spices...',
    spices: {
      starAnise: { name: 'Star Anise', family: 'Schisandraceae', description: 'Licorice-flavored spice, common in Chinese braised dishes and stocks.', hint: 'star anise spice' },
      cinnamon: { name: 'Cinnamon', family: 'Lauraceae', description: 'Warm, sweet spice used in both desserts and savory dishes.', hint: 'cinnamon sticks' },
      cloves: { name: 'Cloves', family: 'Myrtaceae', description: 'Intense, sweet, and pungent, often used in baking and marinades.', hint: 'cloves spice' },
      sichuanPeppercorn: { name: 'Sichuan Peppercorn', family: 'Rutaceae', description: 'Creates a unique tingling numbness (málà) with a citrus aroma.', hint: 'sichuan peppercorn' },
      fennel: { name: 'Fennel Seeds', family: 'Apiaceae', description: 'Licorice-like flavor, common in Indian and Middle Eastern cuisines.', hint: 'fennel seeds' },
      turmeric: { name: 'Turmeric', family: 'Zingiberaceae', description: 'Gives a golden color and has a mild, earthy flavor; a key curry ingredient.', hint: 'turmeric powder' },
      cumin: { name: 'Cumin', family: 'Apiaceae', description: 'Strong, smoky flavor used widely in Mexican, Indian, and Middle Eastern food.', hint: 'cumin seeds' },
      coriander: { name: 'Coriander Seed', family: 'Apiaceae', description: 'Citrusy, floral flavor used in curries, soups, and pickles.', hint: 'coriander seeds' },
      basil: { name: 'Basil', family: 'Lamiaceae', description: 'Sweet and peppery, essential in Italian and Southeast Asian dishes.', hint: 'basil leaves' },
      rosemary: { name: 'Rosemary', family: 'Lamiaceae', description: 'Pine-like aroma, great with roasted meats, breads, and potatoes.', hint: 'rosemary sprig' },
      thyme: { name: 'Thyme', family: 'Lamiaceae', description: 'Subtle, minty, and earthy, a foundational herb in many European cuisines.', hint: 'thyme sprigs' },
      cardamom: { name: 'Cardamom', family: 'Zingiberaceae', description: 'Complex flavor with hints of mint, citrus, and spice for sweet and savory dishes.', hint: 'cardamom pods' },
    }
  }
};

type LanguageKey = keyof typeof translations;
type SpiceKey = keyof (typeof translations)['en']['spices'];

export default function SpiceBasicsPage() {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageKey>('en');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      const browserLang: LanguageKey = navigator.language.toLowerCase().startsWith('zh') ? 'zh-CN' : 'en';
      setCurrentLanguage(browserLang);
    }
  }, []);

  const t = useMemo(() => translations[currentLanguage], [currentLanguage]);

  const filteredSpices = useMemo(() => {
    const lowercasedFilter = searchTerm.toLowerCase();
    return Object.keys(t.spices).filter(key => {
      const spice = t.spices[key as SpiceKey];
      return spice.name.toLowerCase().includes(lowercasedFilter) || 
             spice.description.toLowerCase().includes(lowercasedFilter) ||
             spice.family.toLowerCase().includes(lowercasedFilter);
    }) as SpiceKey[];
  }, [searchTerm, t.spices]);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground py-10 px-4 sm:px-8 items-center">
      <header className="w-full max-w-5xl mb-8 self-center">
        <Link href="/kitchen" passHref>
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t.backButton}
          </Button>
        </Link>
      </header>

      <main className="w-full max-w-5xl flex flex-col items-center flex-grow">
        <div className="text-center mb-10">
            <Leaf className="w-16 h-16 text-primary mb-4 mx-auto" />
            <h1 className="text-3xl sm:text-4xl font-headline font-bold text-primary mb-3">
              {t.pageTitle}
            </h1>
            <p className="text-muted-foreground text-base max-w-2xl">
              {t.pageDescription}
            </p>
        </div>

        <div className="w-full max-w-lg mb-8">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                    type="search"
                    placeholder={t.searchPlaceholder}
                    className="w-full pl-10 h-12 text-base rounded-full shadow-lg"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>

        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSpices.map(key => {
                const spice = t.spices[key];
                return (
                    <Card key={key} className="group overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                        <CardHeader className="flex flex-row items-start gap-4 p-4 bg-muted/30">
                             <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                                <Image
                                    src={`https://picsum.photos/seed/${key}/200/200`}
                                    alt={spice.name}
                                    width={80}
                                    height={80}
                                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                                    data-ai-hint={spice.hint}
                                />
                            </div>
                            <div className="flex-1">
                                <CardTitle className="text-lg text-primary">{spice.name}</CardTitle>
                                <CardDescription className="text-xs text-muted-foreground mt-1">{spice.family}</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent className="p-4 pt-2">
                           <p className="text-sm text-foreground/90">{spice.description}</p>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
        {filteredSpices.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
                <p>No spices found for "{searchTerm}".</p>
            </div>
        )}
      </main>
    </div>
  );
}

