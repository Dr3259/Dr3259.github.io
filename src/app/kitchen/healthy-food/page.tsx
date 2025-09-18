"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Leaf, Brain, Heart, Fish, Wheat } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import placeholderImageData from '@/lib/placeholder-images.json';

const translations = {
  'zh-CN': {
    pageTitle: '健康食物指南',
    pageSubtitle: '探索营养丰富的食材，为您的健康赋能。',
    backButton: '返回厨房',
    superfoods: '超级食物',
    proteins: '优质蛋白',
    fats: '健康脂肪',
    grains: '全谷物',
  },
  'en': {
    pageTitle: 'Healthy Food Guide',
    pageSubtitle: 'Explore nutritious ingredients to power your health.',
    backButton: 'Back to Kitchen',
    superfoods: 'Superfoods',
    proteins: 'Quality Proteins',
    fats: 'Healthy Fats',
    grains: 'Whole Grains',
  }
};

type LanguageKey = keyof typeof translations;

interface FoodItem {
  name: string;
  benefits: string;
  tips: string;
  imageHint: string;
}

const foodData: Record<string, FoodItem[]> = {
  superfoods: [
    { name: '蓝莓', benefits: '富含抗氧化剂，保护大脑', tips: '可加入燕麦、酸奶或直接食用。', imageHint: 'blueberries' },
    { name: '羽衣甘蓝', benefits: '维生素K、C、A的极佳来源', tips: '制作沙拉、冰沙或脆片。', imageHint: 'kale' },
    { name: '三文鱼', benefits: '富含Omega-3脂肪酸，有益心脏', tips: '建议每周食用两次，烤或蒸为佳。', imageHint: 'salmon fillet' },
    { name: '奇亚籽', benefits: '高纤维、高蛋白、高Omega-3', tips: '浸泡后可制成布丁，或撒在食物上。', imageHint: 'chia seeds' },
  ],
  proteins: [
    { name: '鸡胸肉', benefits: '优质低脂蛋白质，增肌首选', tips: '烤、煮或蒸，避免油炸。', imageHint: 'chicken breast' },
    { name: '鸡蛋', benefits: '完整的蛋白质来源，营养全面', tips: '水煮蛋是健康早餐的极佳选择。', imageHint: 'eggs' },
    { name: '豆腐', benefits: '植物蛋白优质来源，适合素食者', tips: '煎、炖、凉拌皆可，可替代部分肉类。', imageHint: 'tofu' },
    { name: '鹰嘴豆', benefits: '富含蛋白质和纤维，增加饱腹感', tips: '可制作鹰嘴豆泥，或加入沙拉和炖菜。', imageHint: 'chickpeas' },
  ],
  fats: [
    { name: '牛油果', benefits: '富含健康的单不饱和脂肪', tips: '可制作鳄梨酱、沙拉或直接食用。', imageHint: 'avocado' },
    { name: '坚果', benefits: '提供健康脂肪、蛋白质和维生素', tips: '每日一小把，作为零食或加入菜肴。', imageHint: 'mixed nuts' },
    { name: '橄榄油', benefits: '富含单不饱和脂肪酸，有益心脏', tips: '选择特级初榨橄榄油用于凉拌。', imageHint: 'olive oil' },
    { name: '亚麻籽', benefits: 'Omega-3和木脂素的优质来源', tips: '磨碎后食用，更易于吸收。', imageHint: 'flax seeds' },
  ],
  grains: [
    { name: '燕麦', benefits: '高纤维，有助于降低胆固醇', tips: '制作燕麦粥，或加入烘焙食品。', imageHint: 'oats' },
    { name: '藜麦', benefits: '完整的植物蛋白，无麸质', tips: '可作为米饭的替代品，或加入沙拉。', imageHint: 'quinoa' },
    { name: '糙米', benefits: '富含纤维、维生素和矿物质', tips: '替代白米，增加营养摄入。', imageHint: 'brown rice' },
    { name: '全麦面包', benefits: '比白面包提供更多纤维和营养', tips: '选择标签上标明“100%全麦”的产品。', imageHint: 'whole wheat bread' },
  ],
};

const categoryIcons: Record<string, React.ElementType> = {
  superfoods: Brain,
  proteins: Heart,
  fats: Fish,
  grains: Wheat,
};

const FoodCard: React.FC<{ item: FoodItem }> = ({ item }) => {
  const imageData = (placeholderImageData as Record<string, { seed: number; hint: string }>)[item.imageHint.replace(/\s/g, '')] || { seed: Math.floor(Math.random() * 1000), hint: 'food' };
  
  return (
    <Card className="flex flex-col h-full bg-card/50 backdrop-blur-sm shadow-lg border-border/20 hover:border-primary/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
      <div className="relative aspect-[16/10] w-full">
        <Image
          src={`https://picsum.photos/seed/${imageData.seed}/600/400`}
          alt={item.name}
          fill
          className="object-cover"
          data-ai-hint={item.imageHint}
        />
      </div>
      <CardHeader>
        <CardTitle className="text-lg font-bold text-foreground">{item.name}</CardTitle>
        <CardDescription>{item.benefits}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-xs text-muted-foreground bg-muted/50 p-2 rounded-md">{item.tips}</p>
      </CardContent>
    </Card>
  );
};

const FoodCategorySection: React.FC<{ title: string; items: FoodItem[]; icon: React.ElementType }> = ({ title, items, icon: Icon }) => (
  <section>
    <h2 className="flex items-center text-2xl font-bold mb-6 text-primary">
      <Icon className="mr-3 h-6 w-6" />
      {title}
    </h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {items.map(item => <FoodCard key={item.name} item={item} />)}
    </div>
  </section>
);


export default function HealthyFoodPage() {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageKey>('en');

  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      const browserLang: LanguageKey = navigator.language.toLowerCase().startsWith('zh') ? 'zh-CN' : 'en';
      setCurrentLanguage(browserLang);
    }
  }, []);

  const t = useMemo(() => translations[currentLanguage], [currentLanguage]);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-background via-green-50/20 to-lime-50/20 text-foreground py-10 px-4 sm:px-8 items-center">
      <header className="w-full max-w-7xl mb-8 self-center">
        <Link href="/kitchen" passHref>
          <Button variant="outline" size="sm" className="bg-background/50 backdrop-blur-sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t.backButton}
          </Button>
        </Link>
      </header>

      <main className="w-full max-w-7xl flex flex-col items-center">
        <div className="text-center mb-12">
            <Leaf className="w-16 h-16 text-primary mb-4 mx-auto" />
            <h1 className="text-3xl sm:text-4xl font-headline font-bold text-primary mb-3">
              {t.pageTitle}
            </h1>
            <p className="text-muted-foreground text-base max-w-2xl">
              {t.pageSubtitle}
            </p>
        </div>
        
        <div className="w-full space-y-16">
            {Object.entries(foodData).map(([key, items]) => (
                <FoodCategorySection key={key} title={t[key as keyof typeof t]} items={items} icon={categoryIcons[key]} />
            ))}
        </div>
      </main>
    </div>
  );
}
