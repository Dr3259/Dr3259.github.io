
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Leaf, Search, Info, ChefHat, Star, Heart, Brain, CookingPot, ExternalLink, Lightbulb, Scale } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';


const translations = {
  'zh-CN': {
    pageTitle: '全球经典香料全攻略',
    pageDescription: '探索跨越地域与菜系的“风味密码”。',
    backButton: '返回厨房',
    searchPlaceholder: '搜索香料...',
    tabChinese: '中式传统',
    tabEuroAmerican: '欧美草本',
    tabSEA: '东南亚辛香',
    tabMidEastIndian: '中东/印度',
    tabGeneralTips: '通用技巧',
    cardLabels: {
        features: '核心特点',
        usage: '经典用途',
        pairing: '适配食材',
        tips: '使用提示',
    },
    universalTips: {
      title: '全球香料通用技巧',
      basicFormulaTitle: '基础搭配公式',
      basicFormulaDesc: '中西融合也适用',
      roastFormula: '烧烤通用公式',
      roastFormulaDesc: '风味核心（孜然/辣椒粉）+ 提香（花椒/迷迭香）+ 解腻（柠檬汁/陈皮碎）',
      braiseFormula: '炖肉通用公式',
      braiseFormulaDesc: '祛腥（白芷/南姜）+ 增香（八角/迷迭香）+ 解腻（陈皮/欧芹）',
      freshVsDryTitle: '“新鲜vs干燥”香料替换原则',
      freshVsDryContent: '新鲜草本（如罗勒）香味清新，替换比例约为 3:1（鲜:干），适合出锅前加入。干燥香料（如八角）香味浓缩，替换比例约为 1:3（干:鲜），适合烹饪初期加入。',
      storageTitle: '储存与预处理技巧',
      storageDesc: '新鲜草本用湿纸包裹冷藏；干燥香料密封避光。干香料使用前小火微炒或温水浸泡可激发香味。',
    },
    fusionCases: {
      title: '跨菜系融合案例',
      case1: '中式卤水 + 东南亚香料：基础卤水中加入1段香茅+2片柠檬叶，卤出的鸡肉自带清新柠檬香，解腻又独特。',
      case2: '西式烤鸡 + 中式香料：烤鸡腌料中加入少许花椒粉，外皮酥脆带微麻，中西风味平衡。',
      case3: '泰式冬阴功 + 中式陈皮：冬阴功汤中加入1小块陈皮，中和酸辣感，更适合中国人口味。'
    },
  },
  'en': {
    pageTitle: 'Global Spice Guide',
    pageDescription: 'Explore the "flavor codes" that transcend regions and cuisines.',
    backButton: 'Back to Kitchen',
    searchPlaceholder: 'Search spices...',
    tabChinese: 'Chinese Traditional',
    tabEuroAmerican: 'Euro-American Herbs',
    tabSEA: 'Southeast Asian',
    tabMidEastIndian: 'Mid-East/Indian',
    tabGeneralTips: 'Universal Tips',
    cardLabels: {
        features: 'Core Features',
        usage: 'Classic Uses',
        pairing: 'Pairs With',
        tips: 'Usage Tips',
    },
     universalTips: {
      title: 'Universal Spice Techniques',
      basicFormulaTitle: 'Basic Pairing Formulas',
      basicFormulaDesc: 'Applicable for cross-cuisine fusion',
      roastFormula: 'Roast Formula',
      roastFormulaDesc: 'Flavor Core (Cumin/Chili) + Aroma (Sichuan Pepper/Rosemary) + Acidity (Lemon/Citrus Peel)',
      braiseFormula: 'Braise Formula',
      braiseFormulaDesc: 'De-Fishing (Angelica/Galangal) + Aroma (Star Anise/Rosemary) + Degreasing (Orange Peel/Parsley)',
      freshVsDryTitle: 'Fresh vs. Dry Replacement Principle',
      freshVsDryContent: 'Fresh herbs (like basil) have a delicate aroma; use a 3:1 ratio (fresh:dry) and add at the end. Dried spices (like star anise) are concentrated; use a 1:3 ratio (dry:fresh) and add at the beginning.',
      storageTitle: 'Storage & Prep',
      storageDesc: 'Wrap fresh herbs in damp paper and refrigerate; store dry spices sealed from light. Toasting or soaking dry spices before use enhances flavor.',
    },
    fusionCases: {
      title: 'Cross-Cuisine Fusion Cases',
      case1: 'Chinese Brine + SEA Spices: Add lemongrass and lime leaves to a basic brine for a refreshing, unique chicken.',
      case2: 'Western Roast Chicken + Chinese Spices: Add a pinch of Sichuan peppercorn powder to the marinade for a crispy skin with a numbing tingle.',
      case3: 'Thai Tom Yum + Chinese Chenpi: A small piece of dried tangerine peel can balance the sourness and spiciness, suiting more palates.'
    },
  }
};

const spiceData = {
  'zh-CN': {
    chinese: [
      { name: '八角', features: '甘香微甜，香气醇厚', usage: '卤水基底、红烧、五香粉', pairing: '猪肉、牛肉、禽类', tips: '性温，1kg肉配3-5颗，避免与丁香过量同用' },
      { name: '花椒', features: '辛香带麻，层次丰富', usage: '川菜炒菜、火锅、卤菜', pairing: '五花肉、鸡肉、豆制品', tips: '分青红花椒（青花椒更麻），可提前炒香制成花椒油' },
      { name: '桂皮', features: '辛香微甜，香味持久', usage: '卤水、红烧、炖菜', pairing: '羊肉、牛肉、猪蹄', tips: '性大热，1kg肉配2-3段，夏季需减量，避免上火' },
      { name: '香叶', features: '淡辛香，提味不抢镜', usage: '炖煮、卤制、腌肉', pairing: '各类禽畜肉、海鲜', tips: '味道较桂皮淡，10斤卤水配5-8片，易煮烂需用纱布包' },
      { name: '草果', features: '浓烈辛辣，祛腥力强', usage: '炖牛羊肉、卤野味', pairing: '牛肉、羊肉、内脏', tips: '性热燥火，需去籽使用（籽味苦），1kg肉配1-2颗' },
      { name: '陈皮', features: '辛苦带果香，解腻增香', usage: '烧菜、卤菜、煲汤', pairing: '鸭肉、牛肉、排骨', tips: '越陈越香，炖肉时加入可中和油腻，搭配山楂更解腻' },
      { name: '孜然', features: '香辣浓郁，异域感强', usage: '烧烤、新疆菜、炒肉', pairing: '羊肉、鸡肉、土豆', tips: '性热，多与辣椒搭配，炒前干煸可激发香味' },
    ],
    euroAmerican: [
      { name: '迷迭香', features: '木质香+松针感，微苦', usage: '西式烤鸡、烤羊排、面包', pairing: '鸡胸肉、羊排、土豆', tips: '新鲜品用1小枝/100g肉，干燥品减半，适合长时间烤制' },
      { name: '百里香', features: '柔和花香+柠檬味', usage: '法式炖菜、海鲜、浓汤', pairing: '鳕鱼、牛肉、蘑菇', tips: '与迷迭香是“烤物黄金搭档”，耐煮，可全程加入' },
      { name: '罗勒', features: '甜香带薄荷感', usage: '意面青酱、披萨、沙拉', pairing: '番茄、奶酪、虾仁', tips: '新鲜品不耐热，出锅前加入；紫罗勒多用于摆盘增色' },
      { name: '欧芹', features: '清新芹菜香，脆嫩爽口', usage: '沙拉点缀、酱汁基底、汤品收尾', pairing: '三文鱼、牛排、蔬菜', tips: '分平叶/卷叶（卷叶更香），不可久煮，避免香味流失' },
      { name: '牛至', features: '辛辣微苦，带茴香感', usage: '披萨、意式肉酱、墨西哥塔可', pairing: '牛肉、猪肉、豆类', tips: '干燥品香味比新鲜品浓，100g肉配1小勺，适合重口味料理' },
      { name: '莳萝', features: '甜香带茴香，清爽解腻', usage: '北欧腌三文鱼、俄式冷汤', pairing: '三文鱼、虾、黄瓜', tips: '新鲜品易蔫，用湿纸包裹冷藏；干燥品适合腌料' },
    ],
    sea: [
      { name: '香茅', features: '浓烈柠檬香+草本涩感', usage: '泰式冬阴功汤、越南河粉', pairing: '海鲜、鸡肉、椰浆', tips: '取白色茎部切段拍裂（易出味），避免用老皮（纤维粗）' },
      { name: '南姜', features: '辛辣带柑橘香，比生姜冲', usage: '泰式咖喱、海鲜料理', pairing: '贻贝、鱿鱼、牛肉', tips: '质地坚硬，需去皮切片，不宜生食，高温烹煮后更柔和' },
      { name: '柠檬叶', features: '强烈柠檬香，微苦', usage: '椰香鸡汤、马来西亚叻沙', pairing: '鸡肉、虾、米粉', tips: '新鲜叶片需撕碎（叶脉香味最浓），干燥品适合做汤' },
      { name: '高良姜', features: '辛辣微甜，带樟木香气', usage: '印尼沙爹、新加坡辣椒蟹', pairing: '羊肉串、螃蟹、牛肉', tips: '可替代部分生姜，搭配椰浆、鱼露风味更佳' },
      { name: '香兰叶', features: '清甜椰香，自带绿色', usage: '东南亚甜品、炒饭、椰浆菜', pairing: '米饭、蛋糕、椰浆汤', tips: '多用作包裹食材蒸煮（如香兰叶包鸡），或榨汁调色' },
    ],
    midEastIndian: [
      { name: '孜然籽', features: '辛辣带坚果香，比孜然粉清新', usage: '中东烤肉、鹰嘴豆泥、咖喱', pairing: '羊肉串、鹰嘴豆、羊肉', tips: '需干炒后研磨使用（香味更浓），避免久炒糊锅' },
      { name: '芫荽籽', features: '温和柑橘香+木质香，微甜', usage: '印度马萨拉、中东蘸料', pairing: '豆类、鸡肉、牛肉', tips: '与孜然籽1:1混合，是咖喱粉核心成分，炒后风味更突出' },
      { name: '姜黄', features: '微苦姜香，天然黄色色素', usage: '印度黄咖喱、黄金奶、烤物', pairing: '鸡胸肉、米饭、土豆', tips: '本身味淡，需与其他香料搭配；过量易导致舌苔发黄（无害）' },
      { name: '小豆蔻', features: '清新花香+柑橘香，微辣', usage: '印度奶茶、咖喱、甜点', pairing: '牛奶、羊肉、蛋糕', tips: '带壳使用（壳可增香），1杯奶茶配2-3颗，价格较高需省用' },
      { name: '葫芦巴籽', features: '微苦带烟熏香，类似枫糖味', usage: '印度咖喱、中东烤肉腌料', pairing: '牛肉、豆类、蔬菜', tips: '需提前浸泡去苦味，与姜黄、芫荽籽搭配是经典组合' },
    ],
  },
  'en': {
    chinese: [
      { name: 'Star Anise', features: 'Sweet & fragrant, full-bodied', usage: 'Brine base, red cooking, five-spice', pairing: 'Pork, beef, poultry', tips: 'Warm nature, use 3-5 pods per kg of meat.' },
      { name: 'Sichuan Pepper', features: 'Numbing & fragrant, complex', usage: 'Sichuan stir-fries, hot pot, brine', pairing: 'Pork belly, chicken, tofu', tips: 'Green is more numbing than red; toast before use for oil.' },
      { name: 'Cassia/Cinnamon', features: 'Pungent & sweet, long-lasting', usage: 'Brine, red cooking, stews', pairing: 'Lamb, beef, pork knuckle', tips: 'Very hot nature, use 2-3 pieces per kg of meat; reduce in summer.' },
      { name: 'Bay Leaf', features: 'Mildly pungent, enhances flavor', usage: 'Stews, brines, marinades', pairing: 'All meats, seafood', tips: 'Milder than cassia; use a pouch for easy removal.' },
      { name: 'Cao Guo', features: 'Strongly pungent, de-fishing', usage: 'Beef/lamb stews, gamey meats', pairing: 'Beef, lamb, offal', tips: 'Hot nature; remove seeds to avoid bitterness.' },
      { name: 'Dried Tangerine Peel', features: 'Bitter & fruity, cuts grease', usage: 'Stews, brines, soups', pairing: 'Duck, beef, ribs', tips: 'Aged is better; balances fatty meats, great with hawthorn.' },
      { name: 'Cumin', features: 'Spicy & rich, exotic', usage: 'BBQ, Xinjiang cuisine, stir-fries', pairing: 'Lamb, chicken, potatoes', tips: 'Hot nature; often paired with chili; toast to release aroma.' },
    ],
    euroAmerican: [
      { name: 'Rosemary', features: 'Woody & pine-like, slightly bitter', usage: 'Roast chicken/lamb, bread', pairing: 'Chicken breast, lamb chops, potatoes', tips: 'Fresh: 1 sprig/100g meat; dried: half. Good for long roasts.' },
      { name: 'Thyme', features: 'Mild, floral & lemony', usage: 'French stews, seafood, soups', pairing: 'Cod, beef, mushrooms', tips: 'Golden partner with rosemary for roasts; can be cooked long.' },
      { name: 'Basil', features: 'Sweet & peppery (sweet/purple)', usage: 'Pesto, pizza, salads', pairing: 'Tomatoes, cheese, shrimp', tips: 'Fresh is not heat-tolerant, add at the end; purple for garnish.' },
      { name: 'Parsley', features: 'Fresh & celery-like, crisp', usage: 'Salad garnish, sauce base, soup finish', pairing: 'Salmon, steak, vegetables', tips: 'Curly is more aromatic; do not overcook.' },
      { name: 'Oregano', features: 'Pungent & bitter, anise notes', usage: 'Pizza, bolognese, tacos', pairing: 'Beef, pork, legumes', tips: 'Dried is more potent than fresh; 1 tsp per 100g meat.' },
      { name: 'Dill', features: 'Sweet & anise-like, refreshing', usage: 'Cured salmon (gravlax), cold soups', pairing: 'Salmon, shrimp, cucumber', tips: 'Fresh wilts easily; store in damp paper. Dried is good for marinades.' },
    ],
    sea: [
      { name: 'Lemongrass', features: 'Strong lemon aroma, herbal', usage: 'Tom Yum soup, Pho', pairing: 'Seafood, chicken, coconut milk', tips: 'Use white stalk, bruised to release flavor.' },
      { name: 'Galangal', features: 'Pungent & citrusy, stronger than ginger', usage: 'Thai curries, seafood dishes', pairing: 'Mussels, squid, beef', tips: 'Hard texture, peel and slice. Not for raw use.' },
      { name: 'Kaffir Lime Leaf', features: 'Intense lemon scent, slightly bitter', usage: 'Coconut chicken soup, Laksa', pairing: 'Chicken, shrimp, rice noodles', tips: 'Tear fresh leaves to release aroma from veins.' },
      { name: 'Greater Galangal', features: 'Spicy & sweet, camphor notes', usage: 'Indonesian satay, chili crab', pairing: 'Lamb skewers, crab, beef', tips: 'Can replace some ginger; pairs well with coconut milk.' },
      { name: 'Pandan Leaf', features: 'Sweet coconut aroma, green color', usage: 'Desserts, rice, coconut dishes', pairing: 'Rice, cakes, coconut soup', tips: 'Often used to wrap food for steaming (e.g., Pandan chicken).' },
    ],
     midEastIndian: [
      { name: 'Cumin Seed', features: 'Pungent & nutty, fresher than powder', usage: 'Middle Eastern BBQ, hummus, curries', pairing: 'Lamb skewers, chickpeas, mutton', tips: 'Toast and grind for best flavor; avoid burning.' },
      { name: 'Coriander Seed', features: 'Mild citrus & woody, slightly sweet', usage: 'Masalas, Middle Eastern dips', pairing: 'Legumes, chicken, beef', tips: '1:1 with cumin is a curry base; toasting enhances flavor.' },
      { name: 'Turmeric', features: 'Earthy, slightly bitter, natural yellow color', usage: 'Indian yellow curries, golden milk', pairing: 'Chicken breast, rice, potatoes', tips: 'Mild flavor, needs other spices; can stain.' },
      { name: 'Cardamom', features: 'Floral, citrusy & spicy', usage: 'Chai, curries, desserts', pairing: 'Milk, lamb, cakes', tips: 'Use pods for more aroma; 2-3 pods per cup of tea.' },
      { name: 'Fenugreek Seed', features: 'Bitter & smoky, maple-like notes', usage: 'Curries, BBQ marinades', pairing: 'Beef, legumes, vegetables', tips: 'Soak to reduce bitterness; classic combo with turmeric.' },
    ],
  }
};


type LanguageKey = keyof typeof translations;
type SpiceCategory = keyof typeof spiceData['en'];
type Spice = typeof spiceData['en']['chinese'][0];

const categoryIcons: Record<SpiceCategory, React.ElementType> = {
  chinese: CookingPot,
  euroAmerican: ChefHat,
  sea: Leaf,
  midEastIndian: Star,
}

const InfoRow: React.FC<{ icon: React.ElementType, label: string, content: string }> = ({ icon: Icon, label, content }) => (
    <div>
        <h4 className="flex items-center text-sm font-semibold text-primary/80 mb-1">
            <Icon className="w-4 h-4 mr-2" />
            {label}
        </h4>
        <p className="text-xs text-muted-foreground pl-6">{content}</p>
    </div>
);

const SpiceCard: React.FC<{ spice: Spice, labels: any }> = ({ spice, labels }) => (
    <Card className="flex flex-col h-full bg-card/50 backdrop-blur-sm shadow-lg border-border/20 hover:border-primary/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        <CardHeader>
            <CardTitle className="text-lg font-bold text-foreground">{spice.name}</CardTitle>
            <CardDescription>{spice.features}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow space-y-3 text-sm">
            <InfoRow icon={CookingPot} label={labels.usage} content={spice.usage} />
            <InfoRow icon={Heart} label={labels.pairing} content={spice.pairing} />
            <InfoRow icon={Lightbulb} label={labels.tips} content={spice.tips} />
        </CardContent>
    </Card>
);

const UniversalTipsSection: React.FC<{ t: any }> = ({ t }) => (
     <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Brain className="w-5 h-5 text-primary"/>{t.universalTips.basicFormulaTitle}</CardTitle>
                <CardDescription>{t.universalTips.basicFormulaDesc}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
                <div>
                    <h4 className="font-semibold">{t.universalTips.braiseFormula}</h4>
                    <p className="text-xs text-muted-foreground">{t.universalTips.braiseFormulaDesc}</p>
                </div>
                <div>
                    <h4 className="font-semibold">{t.universalTips.roastFormula}</h4>
                    <p className="text-xs text-muted-foreground">{t.universalTips.roastFormulaDesc}</p>
                </div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Scale className="w-5 h-5 text-primary"/>{t.universalTips.freshVsDryTitle}</CardTitle>
            </CardHeader>
            <CardContent>
                 <p className="text-sm text-muted-foreground">{t.universalTips.freshVsDryContent}</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                 <CardTitle className="flex items-center gap-2"><Lightbulb className="w-5 h-5 text-primary"/>{t.universalTips.storageTitle}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">{t.universalTips.storageDesc}</p>
            </CardContent>
        </Card>
        <Card className="md:col-span-2 lg:col-span-3">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><ExternalLink className="w-5 h-5 text-primary"/>{t.fusionCases.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>1. {t.fusionCases.case1}</p>
                <p>2. {t.fusionCases.case2}</p>
                <p>3. {t.fusionCases.case3}</p>
            </CardContent>
        </Card>
    </div>
);


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

  const filteredData = useMemo(() => {
    if (!searchTerm) {
        return spiceData[currentLanguage];
    }
    const lowercasedFilter = searchTerm.toLowerCase();
    const filtered: Record<string, Spice[]> = {};
    Object.entries(spiceData[currentLanguage]).forEach(([category, spices]) => {
        const filteredSpices = spices.filter(spice => 
            Object.values(spice).some(value => 
                String(value).toLowerCase().includes(lowercasedFilter)
            )
        );
        if (filteredSpices.length > 0) {
            filtered[category] = filteredSpices;
        }
    });
    return filtered as typeof spiceData['en'];
  }, [searchTerm, currentLanguage]);


  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-background via-amber-50/20 to-green-50/20 text-foreground py-10 px-4 sm:px-8 items-center">
      <header className="w-full max-w-6xl mb-8 self-center">
        <Link href="/kitchen" passHref>
          <Button variant="outline" size="sm" className="bg-background/50 backdrop-blur-sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t.backButton}
          </Button>
        </Link>
      </header>

      <main className="w-full max-w-6xl flex flex-col items-center flex-grow">
        <div className="text-center mb-10">
            <Leaf className="w-16 h-16 text-primary mb-4 mx-auto" />
            <h1 className="text-3xl sm:text-4xl font-headline font-bold text-primary mb-3">
              {t.pageTitle}
            </h1>
            <p className="text-muted-foreground text-base max-w-2xl">
              {t.pageDescription}
            </p>
        </div>
        
        <div className="w-full max-w-lg mb-8 sticky top-4 z-10">
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                    type="search"
                    placeholder={t.searchPlaceholder}
                    className="w-full pl-12 h-12 text-base rounded-full shadow-lg bg-background/80 backdrop-blur-md"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>

        <Tabs defaultValue="chinese" className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5 mb-8 bg-card/60 backdrop-blur-md">
                {(Object.keys(spiceData.en) as SpiceCategory[]).map(key => (
                     <TabsTrigger key={key} value={key} className="flex items-center gap-2">
                        {React.createElement(categoryIcons[key], {className: "w-4 h-4"})}
                        {t[`tab${key.charAt(0).toUpperCase() + key.slice(1)}` as keyof typeof t]}
                    </TabsTrigger>
                ))}
                <TabsTrigger value="tips">{t.tabGeneralTips}</TabsTrigger>
            </TabsList>
            
            {(Object.keys(filteredData) as SpiceCategory[]).map(categoryKey => (
                 <TabsContent key={categoryKey} value={categoryKey}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredData[categoryKey].map((spice, index) => (
                           <SpiceCard key={index} spice={spice} labels={t.cardLabels}/>
                        ))}
                    </div>
                </TabsContent>
            ))}

            <TabsContent value="tips">
                <UniversalTipsSection t={t} />
            </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
