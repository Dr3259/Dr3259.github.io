
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Leaf, CookingPot, ChefHat, Star, Utensils, Lightbulb, Scale, BookOpen, ShieldAlert, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

const translations = {
  'zh-CN': {
    pageTitle: '全球香料实用使用指南',
    pageDescription: '探索跨越地域与菜系的“风味密码”。',
    backButton: '返回厨房',
    tabChinese: '中式传统',
    tabInternational: '国际经典',
    tabTips: '通用技巧',
    tabFusion: '融合案例',
    cardLabels: {
        features: '核心特点',
        preprocessing: '预处理技巧',
        pairing: '适配食材',
        usage: '经典用法示例',
        suggestions: '搭配建议',
    },
    tips: {
        title: '通用使用技巧与避坑指南',
        principleTitle: '用量原则：“浓味香料”宜少不宜多',
        principleContent: '浓烈香料（如丁香、肉豆蔻）过量易掩盖食材本味。热性香料（如桂皮、草果）夏季需减量。',
        prepTitle: '预处理黄金法则',
        prepContent: '干香料温水浸泡或小火微炒可激发香味；新鲜香料出锅前加入保持风味。带籽香料（如草果）去籽可减苦涩。',
        pairingTitle: '搭配逻辑：“功能互补”更出味',
        pairingContent: '重腥膻食材（羊肉）用“祛腥+增香+解腻”组合；清淡食材（鱼肉）选清新香料（如紫苏、百里香）。',
        storageTitle: '储存与替换技巧',
        storageContent: '干香料密封避光储存；新鲜草本用湿纸包裹冷藏。鲜/干香料替换比例约为3:1（鲜:干）。',
    },
    fusion: {
      title: '跨菜系融合案例 (实操参考)',
      case1Title: '中式卤水 + 东南亚香料',
      case1Desc: '基础卤水中加入1段香茅+2片柠檬叶，卤出的鸡肉自带清新柠檬香，解腻又独特。',
      case2Title: '西式烤鸡 + 中式香料',
      case2Desc: '烤鸡腌料中加入少许花椒粉，外皮酥脆带微麻，中西风味平衡。',
      case3Title: '泰式冬阴功 + 中式陈皮',
      case3Desc: '冬阴功汤中加入1小块陈皮，中和酸辣感，更适合中国人口味。'
    }
  },
  'en': {
    pageTitle: 'Practical Global Spice Guide',
    pageDescription: 'Explore the "flavor codes" that transcend regions and cuisines.',
    backButton: 'Back to Kitchen',
    tabChinese: 'Chinese Traditional',
    tabInternational: 'International Classics',
    tabTips: 'General Tips',
    tabFusion: 'Fusion Cases',
    cardLabels: {
        features: 'Core Features',
        preprocessing: 'Preprocessing',
        pairing: 'Pairs With',
        usage: 'Usage Examples',
        suggestions: 'Pairing Suggestions',
    },
    tips: {
        title: 'General Tips & Pitfalls',
        principleTitle: 'Dosage Principle: Less is More for Strong Spices',
        principleContent: 'Strong spices (like cloves, nutmeg) can overpower dishes. Use warming spices (like cassia, caoguo) sparingly in summer.',
        prepTitle: 'Golden Rules for Preprocessing',
        prepContent: 'Soak or lightly toast dry spices to awaken flavor. Add fresh herbs at the end of cooking. Remove seeds from spices like caoguo to reduce bitterness.',
        pairingTitle: 'Pairing Logic: Complementary Functions',
        pairingContent: 'For strong-flavored meats (e.g., lamb), use a "de-fishing + aromatizing + degreasing" combo. For delicate foods (e.g., fish), choose fresh, light herbs.',
        storageTitle: 'Storage & Substitution',
        storageContent: 'Store dry spices in a cool, dark, airtight place. Wrap fresh herbs in a damp paper towel. The fresh-to-dry ratio is roughly 3:1.',
    },
    fusion: {
      title: 'Cross-Cuisine Fusion Cases (Practical Reference)',
      case1Title: 'Chinese Brine + SEA Spices',
      case1Desc: 'Add lemongrass and lime leaves to a basic brine for a refreshing, unique chicken flavor.',
      case2Title: 'Western Roast Chicken + Chinese Spices',
      case2Desc: 'Add a pinch of Sichuan peppercorn powder to the marinade for a crispy skin with a numbing tingle.',
      case3Title: 'Thai Tom Yum + Chinese Chenpi',
      case3Desc: 'A small piece of dried tangerine peel can balance the sourness and spiciness, suiting more palates.'
    },
  }
};

const spiceData = {
  'zh-CN': {
    chinese: [
      { name: '八角', features: '甘香微甜，香气醇厚', preprocessing: '整颗使用；卤前用温水浸泡10分钟', pairing: '猪肉、牛肉、羊肉、禽类', usage: '1. 卤猪蹄：2-3颗八角+2段桂皮+5片香叶\n2. 炖排骨：1颗八角+姜片+葱段', suggestions: '桂皮、香叶、小茴香' },
      { name: '花椒', features: '辛香带麻，层次丰富', preprocessing: '干花椒直接用；热油炝香后捞出留油', pairing: '川菜、牛肉、羊肉、豆制品', usage: '1. 麻婆豆腐：20粒花椒炝香后炒红油\n2. 烤羊肉串：撒花椒粉+孜然', suggestions: '辣椒、孜然、生姜' },
      { name: '桂皮', features: '辛香微甜，香味持久', preprocessing: '整段使用；可敲成小块方便出味', pairing: '猪肉、牛肉、卤味、甜品', usage: '1. 卤牛肉：1段桂皮+2颗八角+1粒丁香\n2. 桂圆红枣茶：1小段桂皮增香', suggestions: '八角、丁香、草果' },
      { name: '香叶', features: '淡辛香，提味不抢镜', preprocessing: '干制香叶直接用，勿清洗', pairing: '所有肉类、卤菜、炖菜', usage: '1. 炖牛肉：1片香叶+八角+花椒\n2. 卤鸡爪：2片香叶+桂皮+小茴香', suggestions: '八角、桂皮、花椒' },
      { name: '草果', features: '浓烈辛辣，祛腥力强', preprocessing: '去籽使用（籽味苦）；拍裂出味', pairing: '牛肉、羊肉、内脏', usage: '炖羊肉：1-2颗去籽草果+白芷+生姜', suggestions: '白芷、生姜、陈皮' },
      { name: '陈皮', features: '辛苦带果香，解腻增香', preprocessing: '温水泡软，刮去内层白瓤', pairing: '牛肉、羊肉、禽类、甜品', usage: '1. 炖羊肉：2-3片陈皮+红枣\n2. 陈皮红豆沙：与红豆同煮', suggestions: '生姜、红枣、红豆' },
      { name: '孜然（中式）', features: '香辣浓郁，异域感强', preprocessing: '整粒干炒1-2分钟，磨成粉', pairing: '羊肉、牛肉、烧烤、油炸', usage: '1. 烤羊肉：刷油后撒孜然粒+辣椒面\n2. 孜然牛肉：先炒香孜然粒再炒肉', suggestions: '辣椒、羊肉、洋葱' },
      { name: '紫苏', features: '辛香清新，祛腥解腻', preprocessing: '新鲜紫苏洗净沥干', pairing: '鱼类、螃蟹、田螺、牛肉', usage: '1. 煮鱼：放几片紫苏+姜片祛腥\n2. 炒田螺：切碎紫苏+辣椒+大蒜', suggestions: '辣椒、大蒜、生姜、鱼类' },
      { name: '黄栀子', features: '微苦，天然黄色色素', preprocessing: '整颗敲裂，温水浸泡取液', pairing: '卤菜（猪蹄、鸡）、炖菜', usage: '卤猪蹄：2-3颗敲裂黄栀子，使卤菜呈金黄色', suggestions: '八角、桂皮、酱油' },
      { name: '罗汉果', features: '味甜，天然甜味剂', preprocessing: '敲开取果肉+果核', pairing: '卤菜、甜汤、饮品', usage: '1. 卤菜：1/4个罗汉果替代部分糖\n2. 罗汉果雪梨汤：与雪梨同煮', suggestions: '雪梨、百合、卤料包' },
    ],
    international: [
      { name: '迷迭香（欧美）', features: '木质香+松针感，微苦', preprocessing: '取嫩枝使用', pairing: '羊肉、牛肉、鸡肉、土豆', usage: '1. 烤羊排：迷迭香嫩枝+橄榄油+大蒜\n2. 烤土豆：迷迭香+盐+黑胡椒', suggestions: '橄榄油、大蒜、黑胡椒、土豆' },
      { name: '罗勒（欧美）', features: '甜香带薄荷感，清新浓郁', preprocessing: '烹饪前切碎', pairing: '意大利菜、番茄、鸡肉、披萨', usage: '1. 番茄意面：出锅前加切碎罗勒\n2. 煎鸡胸：罗勒+大蒜腌制', suggestions: '番茄、大蒜、橄榄油、芝士' },
      { name: '百里香（欧美）', features: '柔和花香+柠檬味', preprocessing: '取叶片，去硬枝', pairing: '鸡肉、鱼肉、炖菜、奶油酱', usage: '1. 鸡汤：3-4枝+洋葱+胡萝卜\n2. 奶油蘑菇汤：加入平衡厚重感', suggestions: '洋葱、胡萝卜、奶油、蘑菇' },
      { name: '香茅（东南亚）', features: '浓烈柠檬香+草本涩感', preprocessing: '去外层老皮，取白色茎部拍裂', pairing: '海鲜、鸡肉、椰浆料理', usage: '1. 冬阴功汤：1段香茅+南姜+柠檬叶\n2. 越南河粉：香茅煮汤底', suggestions: '南姜、柠檬叶、椰浆' },
      { name: '南姜（东南亚）', features: '辛辣带柑橘香，比生姜冲', preprocessing: '去皮后切片/拍碎', pairing: '泰式咖喱、海鲜', usage: '1. 红咖喱酱：南姜+香茅+柠檬叶\n2. 烤鱿鱼：南姜碎+鱼露腌制', suggestions: '香茅、柠檬叶、鱼露' },
      { name: '柠檬叶（东南亚）', features: '强烈柠檬香，微苦', preprocessing: '新鲜叶片撕碎', pairing: '椰香鸡汤、叻沙、虾仁', usage: '1. 椰香鸡汤：2片柠檬叶+香茅+南姜\n2. 炒虾仁：柠檬叶碎+蒜末', suggestions: '香茅、南姜、椰浆' },
      { name: '孜然籽（中东）', features: '辛辣带坚果香，比孜然粉清新', preprocessing: '干炒1-2分钟，研磨成粉', pairing: '中东烤肉、鹰嘴豆、咖喱', usage: '1. 烤羊肉串：孜然籽粉+小豆蔻+柠檬汁\n2. 鹰嘴豆泥：撒孜然籽粉+橄榄油', suggestions: '芫荽籽、小豆蔻、柠檬汁' },
      { name: '姜黄（中东/印度）', features: '微苦姜香，天然黄色色素', preprocessing: '干姜黄粉直接用', pairing: '咖喱、鸡肉、米饭、汤羹', usage: '1. 黄咖喱：1-2茶匙姜黄粉+咖喱块\n2. 姜黄饭：与米饭同蒸呈金黄色', suggestions: '咖喱、洋葱、大蒜、椰浆' },
    ],
  },
  'en': {
    chinese: [
        { name: 'Star Anise', features: 'Sweet & fragrant, full-bodied', preprocessing: 'Use whole; soak in warm water for 10 mins before braising', pairing: 'Pork, beef, lamb, poultry', usage: '1. Braised Pork Knuckle: 2-3 pods + cassia + bay leaves\n2. Stewed Ribs: 1 pod + ginger + scallion', suggestions: 'Cassia, bay leaf, fennel' },
        { name: 'Sichuan Pepper', features: 'Numbing & fragrant, complex', preprocessing: 'Use dry; sizzle in hot oil to infuse flavor', pairing: 'Sichuan cuisine, beef, lamb, tofu', usage: '1. Mapo Tofu: Sizzle 20 peppercorns, then add bean paste\n2. Grilled Lamb Skewers: Sprinkle with ground pepper + cumin', suggestions: 'Chili, cumin, ginger' },
        { name: 'Cassia/Cinnamon', features: 'Pungent & sweet, long-lasting', preprocessing: 'Use whole sections; can be broken into smaller pieces', pairing: 'Pork, beef, braised dishes, desserts', usage: '1. Braised Beef: 1 stick + 2 star anise + 1 clove\n2. Sweet Tea: A small piece for aroma', suggestions: 'Star anise, clove, caoguo' },
        { name: 'Bay Leaf', features: 'Mildly pungent, enhances flavor', preprocessing: 'Use dried leaves directly, do not wash', pairing: 'All meats, braised dishes, stews', usage: '1. Beef Stew: 1 leaf + star anise + Sichuan pepper\n2. Braised Chicken Feet: 2 leaves + cassia + fennel', suggestions: 'Star anise, cassia, Sichuan pepper' },
        { name: 'Caoguo', features: 'Strongly pungent, de-fishing', preprocessing: 'Remove seeds (bitter); crush to release flavor', pairing: 'Beef, lamb, offal', usage: 'Lamb Stew: 1-2 deseeded caoguo + angelica root + ginger', suggestions: 'Angelica root, ginger, dried tangerine peel' },
        { name: 'Dried Tangerine Peel', features: 'Bitter & fruity, cuts grease', preprocessing: 'Soften in warm water, scrape off white pith', pairing: 'Beef, lamb, poultry, desserts', usage: '1. Lamb Stew: 2-3 pieces + red dates\n2. Red Bean Soup: Cook with red beans', suggestions: 'Ginger, red dates, red beans' },
        { name: 'Cumin (Chinese)', features: 'Spicy & rich, exotic', preprocessing: 'Dry-toast whole seeds for 1-2 mins, then grind', pairing: 'Lamb, beef, BBQ, fried foods', usage: '1. Grilled Lamb: Brush with oil, sprinkle cumin + chili flakes\n2. Cumin Beef: Stir-fry cumin seeds first, then beef', suggestions: 'Chili, lamb, onion' },
        { name: 'Perilla', features: 'Pungent & fresh, anti-fishy', preprocessing: 'Wash and drain fresh leaves', pairing: 'Fish, crab, snails, beef', usage: '1. Steamed Fish: Place leaves on fish with ginger\n2. Stir-fried Snails: Minced perilla + chili + garlic', suggestions: 'Chili, garlic, ginger, fish' },
        { name: 'Gardenia Fruit', features: 'Slightly bitter, natural yellow dye', preprocessing: 'Crack open, soak in warm water to extract color', pairing: 'Braised dishes (pork, chicken)', usage: 'Braised Pork Knuckle: 2-3 cracked fruits for golden color', suggestions: 'Star anise, cassia, soy sauce' },
        { name: 'Monk Fruit', features: 'Sweet, natural sweetener', preprocessing: 'Break open, use pulp and seeds', pairing: 'Braised dishes, sweet soups, drinks', usage: '1. Braise: 1/4 fruit to replace some sugar\n2. Pear Soup: Cook with pear for a soothing drink', suggestions: 'Pear, lily bulb, master stock' },
    ],
    international: [
      { name: 'Rosemary (EU/US)', features: 'Woody & pine-like, slightly bitter', preprocessing: 'Use tender sprigs', pairing: 'Lamb, beef, chicken, potatoes', usage: '1. Roast Lamb: Sprigs + olive oil + garlic\n2. Roast Potatoes: Rosemary + salt + black pepper', suggestions: 'Olive oil, garlic, black pepper, potatoes' },
      { name: 'Basil (EU/US)', features: 'Sweet & peppery, fresh & intense', preprocessing: 'Chop just before use', pairing: 'Italian food, tomatoes, chicken, pizza', usage: '1. Tomato Pasta: Add chopped basil before serving\n2. Grilled Chicken: Marinate with basil + garlic', suggestions: 'Tomato, garlic, olive oil, cheese' },
      { name: 'Thyme (EU/US)', features: 'Mild, floral & lemony', preprocessing: 'Use leaves, discard stems', pairing: 'Chicken, fish, stews, cream sauces', usage: '1. Chicken Soup: 3-4 sprigs + onion + carrot\n2. Mushroom Soup: Balances creaminess', suggestions: 'Onion, carrot, cream, mushrooms' },
      { name: 'Lemongrass (SEA)', features: 'Strong lemon aroma, herbal', preprocessing: 'Remove outer layer, use bruised white stalk', pairing: 'Seafood, chicken, coconut dishes', usage: '1. Tom Yum Soup: 1 stalk + galangal + lime leaves\n2. Pho Broth: Infuse for freshness', suggestions: 'Galangal, kaffir lime leaf, coconut milk' },
      { name: 'Galangal (SEA)', features: 'Pungent & citrusy, stronger than ginger', preprocessing: 'Peel and slice/crush', pairing: 'Thai curries, seafood', usage: '1. Red Curry Paste: Base ingredient\n2. Grilled Squid: Marinate with minced galangal + fish sauce', suggestions: 'Lemongrass, kaffir lime leaf, fish sauce' },
      { name: 'Kaffir Lime Leaf (SEA)', features: 'Intense lemon scent, slightly bitter', preprocessing: 'Tear fresh leaves to release aroma', pairing: 'Coconut chicken soup, laksa, shrimp', usage: '1. Coconut Chicken Soup: 2 leaves + lemongrass\n2. Stir-fried Shrimp: Minced leaves + garlic', suggestions: 'Lemongrass, galangal, coconut milk' },
      { name: 'Cumin Seed (Mid-East)', features: 'Pungent & nutty, fresher than powder', preprocessing: 'Dry-toast and grind for best flavor', pairing: 'Middle Eastern BBQ, hummus, curries', usage: '1. Lamb Skewers: Ground cumin + cardamom + lemon juice\n2. Hummus: Sprinkle ground cumin + olive oil', suggestions: 'Coriander seed, cardamom, lemon juice' },
      { name: 'Turmeric (Mid-East/India)', features: 'Earthy, slightly bitter, natural yellow dye', preprocessing: 'Use dried powder directly', pairing: 'Curries, chicken, rice, soups', usage: '1. Yellow Curry: 1-2 tsp turmeric powder\n2. Turmeric Rice: Steam with rice for color', suggestions: 'Curry, onion, garlic, coconut milk' },
    ],
  },
};

type LanguageKey = keyof typeof translations;
type SpiceCategory = keyof typeof spiceData['en'];
type Spice = typeof spiceData['en']['chinese'][0];

const categoryIcons: Record<string, React.ElementType> = {
  chinese: CookingPot,
  international: Globe,
  tips: Lightbulb,
  fusion: Utensils,
};

const InfoRow: React.FC<{ icon: React.ElementType, label: string, content: string | React.ReactNode, isUsage?: boolean }> = ({ icon: Icon, label, content, isUsage }) => (
    <div>
        <h4 className="flex items-center text-sm font-semibold text-primary/80 mb-1.5">
            <Icon className="w-4 h-4 mr-2" />
            {label}
        </h4>
        {isUsage ? (
          <div className="text-xs text-muted-foreground pl-6 space-y-1 whitespace-pre-wrap">{content}</div>
        ) : (
          <p className="text-xs text-muted-foreground pl-6">{content}</p>
        )}
    </div>
);

const SpiceCard: React.FC<{ spice: Spice, labels: any }> = ({ spice, labels }) => (
    <Card className="flex flex-col h-full bg-card/50 backdrop-blur-sm shadow-lg border-border/20 hover:border-primary/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        <CardHeader>
            <CardTitle className="text-lg font-bold text-foreground">{spice.name}</CardTitle>
            <CardDescription>{spice.features}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow space-y-4 text-sm">
            <InfoRow icon={ChefHat} label={labels.preprocessing} content={spice.preprocessing} />
            <InfoRow icon={BookOpen} label={labels.usage} content={spice.usage} isUsage />
            <InfoRow icon={Star} label={labels.suggestions} content={spice.suggestions} />
        </CardContent>
    </Card>
);

const TipCard: React.FC<{ icon: React.ElementType; title: string; content: string; }> = ({ icon: Icon, title, content }) => (
    <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base"><Icon className="w-5 h-5 text-primary"/>{title}</CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-sm text-muted-foreground">{content}</p>
        </CardContent>
    </Card>
);


const FusionCard: React.FC<{ title: string; description: string; }> = ({ title, description }) => (
  <div className="p-4 border-l-4 border-primary bg-primary/5 rounded-r-lg">
      <h4 className="font-semibold text-foreground/90">{title}</h4>
      <p className="text-sm text-muted-foreground mt-1">{description}</p>
  </div>
);


export default function SpiceBasicsPage() {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageKey>('en');

  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      const browserLang: LanguageKey = navigator.language.toLowerCase().startsWith('zh') ? 'zh-CN' : 'en';
      setCurrentLanguage(browserLang);
    }
  }, []);

  const t = useMemo(() => translations[currentLanguage], [currentLanguage]);

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

        <Tabs defaultValue="chinese" className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 mb-8 bg-card/60 backdrop-blur-md">
                <TabsTrigger value="chinese" className="flex items-center gap-2"><CookingPot className="w-4 h-4"/>{t.tabChinese}</TabsTrigger>
                <TabsTrigger value="international" className="flex items-center gap-2"><Globe className="w-4 h-4"/>{t.tabInternational}</TabsTrigger>
                <TabsTrigger value="tips" className="flex items-center gap-2"><Lightbulb className="w-4 h-4"/>{t.tabTips}</TabsTrigger>
                <TabsTrigger value="fusion" className="flex items-center gap-2"><Utensils className="w-4 h-4"/>{t.tabFusion}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="chinese">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {spiceData[currentLanguage].chinese.map((spice, index) => (
                     <SpiceCard key={index} spice={spice} labels={t.cardLabels}/>
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="international">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {spiceData[currentLanguage].international.map((spice, index) => (
                     <SpiceCard key={index} spice={spice} labels={t.cardLabels}/>
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="tips">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <TipCard icon={ShieldAlert} title={t.tips.principleTitle} content={t.tips.principleContent} />
                    <TipCard icon={ChefHat} title={t.tips.prepTitle} content={t.tips.prepContent} />
                    <TipCard icon={Scale} title={t.tips.pairingTitle} content={t.tips.pairingContent} />
                    <TipCard icon={BookOpen} title={t.tips.storageTitle} content={t.tips.storageContent} />
                </div>
            </TabsContent>
            
            <TabsContent value="fusion">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-xl"><Utensils className="w-5 h-5 text-primary"/>{t.fusion.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <FusionCard title={t.fusion.case1Title} description={t.fusion.case1Desc} />
                        <FusionCard title={t.fusion.case2Title} description={t.fusion.case2Desc} />
                        <FusionCard title={t.fusion.case3Title} description={t.fusion.case3Desc} />
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

