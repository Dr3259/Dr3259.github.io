"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Leaf, Brain, Heart, Fish, Wheat, Sun, Sprout, Wind, Snowflake } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import placeholderImageData from '@/lib/placeholder-images.json';
import { Separator } from '@/components/ui/separator';

const translations = {
  'zh-CN': {
    pageTitle: '健康食物指南',
    pageSubtitle: '探索营养丰富的食材，为您的健康赋能。',
    backButton: '返回',
    superfoods: '超级食物',
    proteins: '优质蛋白',
    fats: '健康脂肪',
    grains: '全谷物',
    seasonalSectionTitle: "应季健康食物",
    seasonalSectionSubtitle: "遵循自然节律，选择农药残留风险相对较低的应季水果、蔬菜和菌菇。",
    spring: '春季',
    summer: '夏季',
    autumn: '秋季',
    winter: '冬季',
    vegetables: '蔬菜',
    fruits: '水果',
    fungi: '菌菇类',
  },
  'en': {
    pageTitle: 'Healthy Food Guide',
    pageSubtitle: 'Explore nutritious ingredients to power your health.',
    backButton: 'Back',
    superfoods: 'Superfoods',
    proteins: 'Quality Proteins',
    fats: 'Healthy Fats',
    grains: 'Whole Grains',
    seasonalSectionTitle: "Seasonal & Healthy Foods",
    seasonalSectionSubtitle: "Follow nature's rhythm by choosing seasonal foods with lower pesticide risk.",
    spring: 'Spring',
    summer: 'Summer',
    autumn: 'Autumn',
    winter: 'Winter',
    vegetables: 'Vegetables',
    fruits: 'Fruits',
    fungi: 'Fungi',
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


interface SeasonalFoodItem {
  name: string;
  description: string;
  dishes?: string;
}

interface SeasonData {
  vegetables: SeasonalFoodItem[];
  fruits: SeasonalFoodItem[];
  fungi: SeasonalFoodItem[];
}

const seasonalData: Record<string, SeasonData> = {
  spring: {
    vegetables: [
      { name: '香椿', description: '气温较低，病虫活动少，自身特殊气味可驱离害虫。', dishes: '凉拌香椿、香椿炒鸡蛋等。' },
      { name: '荠菜', description: '抗病虫害能力强，多为野生或自然生长，生长周期短。', dishes: '蒸荠菜、荠菜猪肉饺子等。' },
      { name: '香菜', description: '生长周期短，香味对虫子有刺激性。', dishes: '香菜饺子、香菜拌牛肉等。' },
      { name: '春笋', description: '自然生长在山林间，在地下生长，可避免很多虫害。', dishes: '油焖、炒腊肉等。' },
      { name: '菠菜', description: '春季的菠菜鲜嫩可口，一般较少受到病虫害的严重侵袭。', dishes: '清炒、做汤或凉拌。' }
    ],
    fruits: [
      { name: '青枣', description: '口感清甜多汁，富含维生素C。', dishes: '可直接食用。' },
      { name: '枇杷', description: '果肉柔软多汁，味道甜美。', dishes: '可直接食用或制作枇杷膏。' },
      { name: '桑葚', description: '具有抗氧化、滋阴补血等功效。', dishes: '可直接食用或酿酒。' }
    ],
    fungi: [
      { name: '香菇', description: '营养丰富，味道鲜美。', dishes: '可炒食、煲汤或做馅料。' },
      { name: '茶树菇', description: '口感脆嫩，有独特的香气。', dishes: '可炒肉丝、煲汤等。' }
    ]
  },
  summer: {
    vegetables: [
      { name: '油麦菜', description: '叶子有天然蜡质，可减少害虫侵害，9月时蜡质更厚。', dishes: '适合蒜蓉清炒、白灼。' },
      { name: '秋葵', description: '果实有细绒毛，黏液让害虫不敢碰。', dishes: '可白灼、清炒或凉拌。' },
      { name: '红薯叶', description: '稍老的叶子有黏液蛋白，虫子难以消化。', dishes: '可清炒或蒜蓉炒。' }
    ],
    fruits: [
      { name: '桃子', description: '品种多样，口感鲜美。', dishes: '可直接食用或制作罐头。' },
      { name: '西瓜', description: '夏季消暑佳品，水分充足。', dishes: '可直接食用。' },
      { name: '荔枝', description: '果肉晶莹剔透，香甜多汁。', dishes: '可直接食用，但不宜过量。' }
    ],
    fungi: [
      { name: '平菇', description: '生长迅速，适应性强，农药残留风险低。', dishes: '可炒食、做汤。' },
      { name: '草菇', description: '味道鲜美，营养丰富。', dishes: '可清炒、煲汤或涮火锅。' }
    ]
  },
  autumn: {
    vegetables: [
      { name: '茼蒿', description: '特殊香味使害虫避而远之。', dishes: '可蒜蓉清炒。' },
      { name: '芋头', description: '叶子含草酸钙针晶，昆虫啃不动，块茎埋在地下。', dishes: '可蒸蘸白糖、炖肉。' },
      { name: '莲藕', description: '水生植物，不易生虫。', dishes: '可清炒、炖汤。' },
      { name: '南瓜', description: '藤蔓和叶子布满毛刺，虫子不敢上去，且不易害病。', dishes: '可蒸食、煮粥。' },
      { name: '山药', description: '藤蔓和叶子有虫子不喜欢的味道。', dishes: '可与肉类煲汤或清炒。' }
    ],
    fruits: [
      { name: '柚子', description: '皮厚，能阻挡大部分农药。', dishes: '可直接食用或做成果酱。' },
      { name: '梨', description: '有生津止渴等功能。', dishes: '可直接食用、榨汁或煮水。' },
      { name: '石榴', description: '果皮厚实，内部颗粒受保护。', dishes: '可直接食用或榨汁。' }
    ],
    fungi: [
      { name: '口蘑', description: '人工培育环境可控，农药残留风险低。', dishes: '可炒食、做汤或烤制。' },
      { name: '黑木耳', description: '具有较高的营养价值。', dishes: '可凉拌、炒食或煲汤。' }
    ]
  },
  winter: {
    vegetables: [
      { name: '芥蓝', description: '冬季常见的蔬菜，比较耐寒，病虫害相对较少。', dishes: '可清炒或白灼。' },
      { name: '西洋菜', description: '生长在水中，环境相对干净，农药使用少。', dishes: '可做汤或清炒。' },
      { name: '胡萝卜', description: '农药残留较少。', dishes: '可炖肉、炒食或榨汁。' }
    ],
    fruits: [
      { name: '柑橘', description: '皮厚且有油脂腺体，能减少农药侵入。', dishes: '可直接食用。' },
      { name: '甘蔗', description: '外皮厚硬，内部蔗茎受污染风险较低。', dishes: '可榨汁或直接嚼食。' }
    ],
    fungi: [
      { name: '香菇', description: '冬季的香菇肉质厚实，味道浓郁。', dishes: '可用于多种菜肴的制作。' },
      { name: '平菇', description: '在冬季的市场上也较为常见，可满足日常烹饪需求。', dishes: '可炒食、做汤。' }
    ]
  }
};

const seasonIcons: Record<string, React.ElementType> = {
  spring: Sprout,
  summer: Sun,
  autumn: Leaf,
  winter: Snowflake
};

const SeasonCard: React.FC<{
  seasonName: string;
  data: SeasonData;
  icon: React.ElementType;
  t: any;
}> = ({ seasonName, data, icon: Icon, t }) => (
  <Card className="shadow-lg bg-card/60 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
    <CardHeader>
      <CardTitle className="flex items-center text-2xl font-bold text-primary">
        <Icon className="mr-3 h-6 w-6" /> {seasonName}
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-6 text-sm text-muted-foreground">
      <div>
        <h4 className="font-semibold text-lg mb-3 text-foreground/90">{t.vegetables}</h4>
        <ul className="space-y-2 list-disc list-inside">
          {data.vegetables.map(item => <li key={item.name}><span className="font-medium text-foreground/80">{item.name}</span>: {item.description} {item.dishes && `(${item.dishes})`}</li>)}
        </ul>
      </div>
      <Separator />
      <div>
        <h4 className="font-semibold text-lg mb-3 text-foreground/90">{t.fruits}</h4>
        <ul className="space-y-2 list-disc list-inside">
          {data.fruits.map(item => <li key={item.name}><span className="font-medium text-foreground/80">{item.name}</span>: {item.description} {item.dishes && `(${item.dishes})`}</li>)}
        </ul>
      </div>
      <Separator />
      <div>
        <h4 className="font-semibold text-lg mb-3 text-foreground/90">{t.fungi}</h4>
        <ul className="space-y-2 list-disc list-inside">
          {data.fungi.map(item => <li key={item.name}><span className="font-medium text-foreground/80">{item.name}</span>: {item.description} {item.dishes && `(${item.dishes})`}</li>)}
        </ul>
      </div>
    </CardContent>
  </Card>
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

        <Separator className="my-16" />

        <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-3">{t.seasonalSectionTitle}</h2>
            <p className="text-muted-foreground text-base max-w-2xl mx-auto">{t.seasonalSectionSubtitle}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
            {Object.entries(seasonalData).map(([key, data]) => (
                <SeasonCard 
                    key={key}
                    seasonName={t[key as keyof typeof t]}
                    data={data}
                    icon={seasonIcons[key]}
                    t={t}
                />
            ))}
        </div>
      </main>
    </div>
  );
}