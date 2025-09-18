
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, Sun, Leaf, Sprout, Wind, Snowflake } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const translations = {
  'zh-CN': {
    pageTitle: '应季健康食物指南',
    backButton: '返回厨房',
    pageDescription: '遵循自然节律，选择农药残留风险相对较低的应季水果、蔬菜和菌菇。',
    spring: '春季',
    summer: '夏季',
    autumn: '秋季',
    winter: '冬季',
    vegetables: '蔬菜',
    fruits: '水果',
    fungi: '菌菇类',
  },
  'en': {
    pageTitle: 'Seasonal & Healthy Food Guide',
    backButton: 'Back to Kitchen',
    pageDescription: 'Follow the rhythm of nature by choosing seasonal fruits, vegetables, and fungi with a lower risk of pesticide residue.',
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
  description: string;
  dishes?: string;
}

interface SeasonData {
  vegetables: FoodItem[];
  fruits: FoodItem[];
  fungi: FoodItem[];
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
  season: string;
  seasonName: string;
  data: SeasonData;
  icon: React.ElementType;
  t: any;
}> = ({ season, seasonName, data, icon: Icon, t }) => (
  <Card className="shadow-lg bg-card/60 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
    <CardHeader>
      <CardTitle className="flex items-center text-2xl font-bold text-primary">
        <Icon className="mr-3 h-6 w-6" /> {seasonName}
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-6">
      <div>
        <h4 className="font-semibold text-lg mb-3 text-foreground/90">{t.vegetables}</h4>
        <ul className="space-y-2 list-disc list-inside">
          {data.vegetables.map(item => <li key={item.name}><span className="font-medium">{item.name}</span>: {item.description} {item.dishes && `(${item.dishes})`}</li>)}
        </ul>
      </div>
      <Separator />
      <div>
        <h4 className="font-semibold text-lg mb-3 text-foreground/90">{t.fruits}</h4>
        <ul className="space-y-2 list-disc list-inside">
          {data.fruits.map(item => <li key={item.name}><span className="font-medium">{item.name}</span>: {item.description} {item.dishes && `(${item.dishes})`}</li>)}
        </ul>
      </div>
      <Separator />
      <div>
        <h4 className="font-semibold text-lg mb-3 text-foreground/90">{t.fungi}</h4>
        <ul className="space-y-2 list-disc list-inside">
          {data.fungi.map(item => <li key={item.name}><span className="font-medium">{item.name}</span>: {item.description} {item.dishes && `(${item.dishes})`}</li>)}
        </ul>
      </div>
    </CardContent>
  </Card>
);

export default function SeasonalFoodPage() {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageKey>('en');

  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      const browserLang: LanguageKey = navigator.language.toLowerCase().startsWith('zh') ? 'zh-CN' : 'en';
      setCurrentLanguage(browserLang);
    }
  }, []);

  const t = useMemo(() => translations[currentLanguage], [currentLanguage]);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-background via-lime-50/20 to-teal-50/20 text-foreground py-10 px-4 sm:px-8 items-center">
      <header className="w-full max-w-5xl mb-8 self-center">
        <Link href="/kitchen" passHref>
          <Button variant="outline" size="sm" className="bg-background/50 backdrop-blur-sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t.backButton}
          </Button>
        </Link>
      </header>

      <main className="w-full max-w-5xl flex flex-col items-center">
        <div className="text-center mb-12">
            <Wind className="w-16 h-16 text-primary mb-4 mx-auto" />
            <h1 className="text-3xl sm:text-4xl font-headline font-bold text-primary mb-3">
              {t.pageTitle}
            </h1>
            <p className="text-muted-foreground text-base max-w-2xl">
              {t.pageDescription}
            </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
            {Object.entries(seasonalData).map(([key, data]) => (
                <SeasonCard 
                    key={key}
                    season={key}
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
