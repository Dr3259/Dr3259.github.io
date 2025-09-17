
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Utensils, BookOpen, CookingPot, Flame, Star, Soup, University, ChefHat, Map } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import placeholderImageData from '@/lib/placeholder-images.json';


const translations = {
  'zh-CN': {
    pageTitle: '中华八大菜系',
    backButton: '返回厨房',
    pageDescription: '“南甜北咸，东辣西酸”，探索九州风味，品味华夏千年饮食智慧。',
    originTitle: '起源与流派',
    featuresTitle: '核心特色',
    dishesTitle: '经典菜品',
    summaryTitle: '八大菜系核心差异总结',
    tableHeaders: {
      cuisine: '菜系',
      flavor: '核心风味',
      ingredients: '代表食材',
      technique: '标志性技法',
      label: '文化标签'
    }
  },
  'en': {
    pageTitle: 'Eight Great Cuisines of China',
    backButton: 'Back to Kitchen',
    pageDescription: 'Explore the diverse flavors of China, from sweet south to salty north, spicy east to sour west.',
    originTitle: 'Origin & Schools',
    featuresTitle: 'Core Features',
    dishesTitle: 'Classic Dishes',
    summaryTitle: 'Core Differences of the Eight Cuisines',
    tableHeaders: {
      cuisine: 'Cuisine',
      flavor: 'Core Flavor',
      ingredients: 'Signature Ingredients',
      technique: 'Key Techniques',
      label: 'Cultural Tag'
    }
  }
};

type LanguageKey = keyof typeof translations;

interface ClassicDish {
  name: string;
  description: string;
  imageHint: string;
}

interface Cuisine {
  id: string;
  name: string;
  tagline: string;
  origin: React.ReactNode;
  features: React.ReactNode;
  classicDishes: ClassicDish[];
}

const cuisineData: Record<string, Record<string, Cuisine>> = {
    'zh-CN': {
        lu: {
            id: 'lu', name: '鲁菜 (Shandong)', tagline: '北方菜系之首，宫廷菜的基石',
            origin: <>济南菜（清汤、奶汤）、胶东菜（海鲜、鲜活）、孔府菜（官府菜、礼仪）。<br/>起源于春秋战国，受儒家“食不厌精”思想影响深远。</>,
            features: <><b>技法：</b>擅长爆、炒、烧、扒，尤重“吊汤”。<br/><b>口味：</b>咸鲜为主，酱香醇厚。<br/><b>食材：</b>海参、鲍鱼、大葱等。</>,
            classicDishes: [
                { name: '九转大肠', description: '多道工序烹制，融合甜、酸、香、辣、咸，口感软糯。', imageHint: 'braised pork intestines' },
                { name: '葱烧海参', description: '海参软糯Q弹，葱香浓郁，是“山珍海味”的典范。', imageHint: 'braised sea cucumber' },
                { name: '德州扒鸡', description: '肉质酥烂脱骨，卤香浓郁，被誉为“天下第一鸡”。', imageHint: 'braised chicken' }
            ]
        },
        chuan: {
            id: 'chuan', name: '川菜 (Sichuan)', tagline: '一菜一格，百菜百味',
            origin: <>上河帮（成都，温和）、下河帮（重庆，浓烈）、小河帮（自贡，鲜辣）。<br/>为适应潮湿气候而生，以“驱寒祛湿”为特色。</>,
            features: <><b>技法：</b>擅长炒、爆、煸、烧，被誉为“调味之王”。<br/><b>口味：</b>麻辣、鱼香、宫保等“百菜百味”。<br/><b>食材：</b>辣椒、花椒、泡菜、兔肉。</>,
            classicDishes: [
                { name: '麻婆豆腐', description: '麻辣鲜香，豆腐嫩滑，汤汁红亮，下饭神器。', imageHint: 'mapo tofu' },
                { name: '鱼香肉丝', description: '无鱼而有鱼香，酸甜咸鲜平衡，肉丝滑嫩。', imageHint: 'fish-flavored pork' },
                { name: '四川火锅', description: '牛油锅底，麻辣过瘾，是社交美食的代表。', imageHint: 'sichuan hotpot' }
            ]
        },
        yue: {
            id: 'yue', name: '粤菜 (Cantonese)', tagline: '食在广州，厨出凤城',
            origin: <>广府菜（清淡鲜爽）、潮汕菜（海鲜卤味）、客家菜（咸香质朴）。<br/>兼容并蓄，注重鲜活，海外影响力最大。</>,
            features: <><b>技法：</b>擅长清蒸、白灼、烤、煲，追求食材原味。<br/><b>口味：</b>清、鲜、嫩、滑、爽，淡而不寡。<br/><b>食材：</b>海鲜、禽畜、野味，食材极为丰富。</>,
            classicDishes: [
                { name: '白切鸡', description: '皮脆肉嫩，蘸姜蓉食用，突出鸡肉的原始鲜香。', imageHint: 'white cut chicken' },
                { name: '清蒸石斑鱼', description: '鱼肉嫩滑，汤汁鲜美，完美诠释粤菜“鲜”的核心。', imageHint: 'steamed grouper fish' },
                { name: '梅菜扣肉', description: '肉质酥烂，肥而不腻，梅菜吸饱肉香，咸香下饭。', imageHint: 'pork with preserved vegetable' }
            ]
        },
        su: {
            id: 'su', name: '苏菜 (Jiangsu)', tagline: '文人菜的代表，精细雅致',
            origin: <>淮扬菜（核心，清鲜平和）、金陵菜（醇和）、苏锡菜（偏甜）。<br/>受江南水乡和文人审美影响，与浙菜并称“江南菜系”。</>,
            features: <><b>技法：</b>擅长炖、焖、蒸、煨，刀工极为精细。<br/><b>口味：</b>清鲜平和，咸甜适中，注重本味。<br/><b>食材：</b>河鲜（鳜鱼、鲈鱼）、蔬果（茭白、莲藕）。</>,
            classicDishes: [
                { name: '清炖狮子头', description: '肉质酥烂，汤汁清鲜，肥而不腻，“细做粗菜”的典范。', imageHint: 'pork meatball soup' },
                { name: '松鼠鳜鱼', description: '外酥里嫩，酸甜可口，造型逼真，兼具口感与观赏性。', imageHint: 'sweet and sour fish' },
                { name: '盐水鸭', description: '鸭肉细嫩，皮白油润，鲜咸适口，又称“桂花鸭”。', imageHint: 'saltwater duck' }
            ]
        },
        zhe: {
            id: 'zhe', name: '浙菜 (Zhejiang)', tagline: '秀色可餐，鲜爽清雅',
            origin: <>杭帮菜（西湖风味）、甬帮菜（海鲜咸鲜）、绍帮菜（黄酒入味）。<br/>融合山区、沿海、平原特色，讲究“不时不食”。</>,
            features: <><b>技法：</b>擅长蒸、炒、烩、炖，注重“鲜活”和“本味”。<br/><b>口味：</b>清鲜、爽脆、嫩滑。<br/><b>食材：</b>西湖水产、沿海海鲜、山区笋菇。</>,
            classicDishes: [
                { name: '西湖醋鱼', description: '鱼肉嫩滑，酸甜适口，带有蟹肉般的鲜味。', imageHint: 'west lake fish' },
                { name: '雪菜大汤黄鱼', description: '鱼肉鲜嫩，汤汁乳白，雪菜的咸鲜与鱼的鲜美融合。', imageHint: 'fish with pickled vegetable' },
                { name: '叫花鸡', description: '荷叶包裹，泥土焖烤，原汁原味，风味独特。', imageHint: 'beggars chicken' }
            ]
        },
        min: {
            id: 'min', name: '闽菜 (Fujian)', tagline: '山珍海味，酸甜鲜香',
            origin: <>福州菜（酸甜，红糟）、闽南菜（鲜淡）、闽西菜（咸香）。<br/>融合山珍与海味，受东南亚饮食文化影响。</>,
            features: <><b>技法：</b>擅长炖、煨、蒸、炒，尤重“汤”的熬制。<br/><b>口味：</b>酸甜、鲜香、清淡，善用红糟调味。<br/><b>食材：</b>海鲜、山珍、红糟、沙茶酱。</>,
            classicDishes: [
                { name: '佛跳墙', description: '十余种名贵食材慢火煨炖，汤汁浓稠，鲜香浓郁。', imageHint: 'buddha jumps over the wall' },
                { name: '荔枝肉', description: '猪肉形似荔枝，外酥里嫩，酸甜可口。', imageHint: 'lychee pork' },
                { name: '沙茶面', description: '沙茶酱汤底，搭配丰富食材，鲜香微辣。', imageHint: 'satay noodles' }
            ]
        },
        xiang: {
            id: 'xiang', name: '湘菜 (Hunan)', tagline: '无辣不欢，香辣醇厚',
            origin: <>湘江流域（香辣）、洞庭湖区（鲜辣）、湘西（酸辣）。<br/>以“辣”驱寒祛湿，与川菜并称“麻辣双雄”。</>,
            features: <><b>技法：</b>擅长炒、爆、煨、炖，讲究“急火快炒”。<br/><b>口味：</b>香辣、酸辣，突出辣椒的“香”与“鲜”。<br/><b>食材：</b>河鲜、腊味、辣椒、紫苏。</>,
            classicDishes: [
                { name: '剁椒鱼头', description: '鱼头鲜嫩，剁椒香辣渗透，鲜辣过瘾。', imageHint: 'steamed fish head' },
                { name: '毛氏红烧肉', description: '色泽红亮，甜中带咸，香而不腻，兼具家常与历史意义。', imageHint: 'braised pork belly' },
                { name: '东安鸡', description: '鸡肉细嫩，酸辣鲜香，是湘菜“酸辣”口味的典范。', imageHint: 'dong an chicken' }
            ]
        },
        hui: {
            id: 'hui', name: '徽菜 (Anhui)', tagline: '山珍为主，醇厚咸香',
            origin: <>皖南菜（山珍，醇厚）、沿江菜（河鲜，鲜淡）、沿淮菜（咸鲜）。<br/>依托皖南山珍，受徽商文化影响，是“山野风味”的代表。</>,
            features: <><b>技法：</b>擅长烧、炖、蒸、熏，注重“火功”，善用腌制发酵。<br/><b>口味：</b>醇厚、咸香、微辣。<br/><b>食材：</b>山珍、腌腊、发酵食材（臭鳜鱼、毛豆腐）。</>,
            classicDishes: [
                { name: '臭鳜鱼', description: '“臭”中带鲜，鱼肉紧实弹嫩，越吃越香。', imageHint: 'stinky mandarin fish' },
                { name: '毛豆腐', description: '豆腐发酵长出白毛，煎后外酥内嫩，风味独特。', imageHint: 'hairy tofu' },
                { name: '符离集烧鸡', description: '酥烂脱骨，卤香浓郁，与德州扒鸡、道口烧鸡齐名。', imageHint: 'fuliji roast chicken' }
            ]
        },
    },
    'en': {
        lu: {
            id: 'lu', name: 'Lu Cuisine (Shandong)', tagline: 'Leader of Northern Cuisines, Foundation of Imperial Dishes',
            origin: <>Jinan Style (clear/milky soups), Jiaodong Style (seafood), Confucius Family Mansion Style (elaborate official dishes).<br/>Originating in the Spring and Autumn Period, deeply influenced by Confucian philosophy.</>,
            features: <><b>Techniques:</b> Excels at quick-frying, stir-frying, braising, and stewing, with an emphasis on soup stocks.<br/><b>Flavor:</b> Salty and fresh, with a rich sauce aroma.<br/><b>Ingredients:</b> Sea cucumber, abalone, scallions.</>,
            classicDishes: [
                { name: 'Braised Intestines in Brown Sauce', description: 'A multi-step dish with sweet, sour, fragrant, spicy, and salty notes.', imageHint: 'braised pork intestines' },
                { name: 'Braised Sea Cucumber with Scallion', description: 'Soft and springy sea cucumber with a rich scallion aroma.', imageHint: 'braised sea cucumber' },
                { name: 'Dezhou Braised Chicken', description: 'Tender meat falling off the bone with a rich, spiced flavor.', imageHint: 'braised chicken' }
            ]
        },
        chuan: {
            id: 'chuan', name: 'Chuan Cuisine (Sichuan)', tagline: 'One Dish, One Style; A Hundred Dishes, A Hundred Flavors',
            origin: <>Shanghebang (Chengdu, milder), Xiahebang (Chongqing, stronger), Xiaohebang (Zigong, fresh & spicy).<br/>Developed to combat humidity with "heat-dispelling" dishes.</>,
            features: <><b>Techniques:</b> Excels at stir-frying, quick-frying, and marinating. Known as the "king of seasoning".<br/><b>Flavor:</b> Famous for mala (numbing & spicy), yuxiang (fish-fragrant), and many other complex flavors.<br/><b>Ingredients:</b> Chili peppers, Sichuan peppercorns, pickles, rabbit.</>,
            classicDishes: [
                { name: 'Mapo Tofu', description: 'Numbing, spicy, and savory, with tender tofu in a bright red sauce.', imageHint: 'mapo tofu' },
                { name: 'Fish-Flavored Shredded Pork', description: 'A balanced sweet, sour, and savory flavor without any fish.', imageHint: 'fish-flavored pork' },
                { name: 'Sichuan Hotpot', description: 'A communal meal with a spicy broth for dipping various ingredients.', imageHint: 'sichuan hotpot' }
            ]
        },
        yue: {
            id: 'yue', name: 'Yue Cuisine (Cantonese)', tagline: 'Eat in Guangzhou, Chefs from Shunde',
            origin: <>Guangfu (light & fresh), Chaoshan (seafood & braised dishes), Hakka (salty & savory).<br/>Known for its fresh ingredients and international influence.</>,
            features: <><b>Techniques:</b> Excels at steaming, blanching, roasting, and braising to preserve original flavors.<br/><b>Flavor:</b> Light, fresh, tender, and smooth.<br/><b>Ingredients:</b> A wide variety, especially fresh seafood and poultry.</>,
            classicDishes: [
                { name: 'White Cut Chicken', description: 'Tender and juicy chicken served with a ginger dipping sauce.', imageHint: 'white cut chicken' },
                { name: 'Steamed Grouper', description: 'Delicate fish steamed to perfection, highlighting its freshness.', imageHint: 'steamed grouper fish' },
                { name: 'Pork with Preserved Mustard Greens', description: 'Rich, fatty pork belly balanced by savory preserved vegetables.', imageHint: 'pork with preserved vegetable' }
            ]
        },
        su: {
            id: 'su', name: 'Su Cuisine (Jiangsu)', tagline: 'A Representation of Literati Dishes, Delicate and Elegant',
            origin: <>Huaiyang (core, light & fresh), Jinling (mellow), Suxi (sweeter).<br/>Influenced by the literati of the Jiangnan region, known for its artistry.</>,
            features: <><b>Techniques:</b> Excels at stewing, braising, and steaming, with meticulous knife skills.<br/><b>Flavor:</b> Fresh, mild, with a balance of saltiness and sweetness.<br/><b>Ingredients:</b> River fish, aquatic vegetables.</>,
            classicDishes: [
                { name: 'Lion\'s Head Meatballs', description: 'Large, tender pork meatballs stewed in a light, clear broth.', imageHint: 'pork meatball soup' },
                { name: 'Squirrel-Shaped Mandarin Fish', description: 'A visually stunning dish with a crispy exterior and a sweet and sour sauce.', imageHint: 'sweet and sour fish' },
                { name: 'Nanjing Salted Duck', description: 'Tender duck with a delicate salty flavor, a famous local specialty.', imageHint: 'saltwater duck' }
            ]
        },
        zhe: {
            id: 'zhe', name: 'Zhe Cuisine (Zhejiang)', tagline: 'Visually Appealing, Fresh and Elegant',
            origin: <>Hangbang (Hangzhou, West Lake), Ningbang (Ningbo, seafood), Shaobang (Shaoxing, uses yellow wine).<br/>Emphasizes seasonal ingredients.</>,
            features: <><b>Techniques:</b> Excels at stir-frying, steaming, and braising, highlighting freshness.<br/><b>Flavor:</b> Fresh, crisp, and tender.<br/><b>Ingredients:</b> West Lake fish, coastal seafood, bamboo shoots.</>,
            classicDishes: [
                { name: 'West Lake Vinegar Fish', description: 'Tender fish in a balanced sweet and sour sauce.', imageHint: 'west lake fish' },
                { name: 'Yellow Croaker Soup with Pickled Cabbage', description: 'A savory and fresh soup combining fish with pickled greens.', imageHint: 'fish with pickled vegetable' },
                { name: 'Beggar\'s Chicken', description: 'Chicken slow-cooked in mud and lotus leaves, resulting in tender, aromatic meat.', imageHint: 'beggars chicken' }
            ]
        },
        min: {
            id: 'min', name: 'Min Cuisine (Fujian)', tagline: 'Treasures from Mountain and Sea, Sweet and Sour',
            origin: <>Fuzhou (sweet & sour), Minnan (light & fresh), Minxi (salty & savory).<br/>Combines mountain delicacies with seafood, influenced by Southeast Asia.</>,
            features: <><b>Techniques:</b> Excels at stewing, braising, and steaming. Known for its soups and use of red fermented rice wine.<br/><b>Flavor:</b> Sweet and sour, savory, and light.<br/><b>Ingredients:</b> Seafood, mountain mushrooms, red fermented rice wine.</>,
            classicDishes: [
                { name: 'Buddha Jumps Over the Wall', description: 'An elaborate soup with numerous high-end ingredients, known for its rich flavor.', imageHint: 'buddha jumps over the wall' },
                { name: 'Lychee Pork', description: 'Pork pieces shaped and colored to resemble lychees, with a sweet and sour taste.', imageHint: 'lychee pork' },
                { name: 'Satay Noodles', description: 'A popular street food with a rich, spicy peanut-based broth.', imageHint: 'satay noodles' }
            ]
        },
        xiang: {
            id: 'xiang', name: 'Xiang Cuisine (Hunan)', tagline: 'No Spice, No Joy; Fragrantly Spicy and Rich',
            origin: <>Xiangjiang River (fragrant & spicy), Dongting Lake (fresh & spicy), Western Hunan (sour & spicy).<br/>Known for its liberal use of chili peppers.</>,
            features: <><b>Techniques:</b> Excels at stir-frying, stewing, and curing.<br/><b>Flavor:</b> Fragrantly spicy, sour and spicy.<br/><b>Ingredients:</b> Chili peppers, river fish, cured meats.</>,
            classicDishes: [
                { name: 'Steamed Fish Head with Diced Hot Red Peppers', description: 'A fiery and flavorful dish featuring a large fish head covered in chili.', imageHint: 'steamed fish head' },
                { name: 'Mao\'s Braised Pork', description: 'A rich, savory, and slightly sweet braised pork belly dish.', imageHint: 'braised pork belly' },
                { name: 'Dong\'an Chicken', description: 'A sour and spicy chicken dish, a classic of the region.', imageHint: 'dong an chicken' }
            ]
        },
        hui: {
            id: 'hui', name: 'Hui Cuisine (Anhui)', tagline: 'Mountain Delicacies, Rich and Savory',
            origin: <>Southern Anhui (mountain delicacies), Yanjiang (river fish), Yanhuai (salty & savory).<br/>Characterized by its use of wild ingredients from the mountains.</>,
            features: <><b>Techniques:</b> Excels at braising, stewing, and smoking. Known for its precise control of heat.<br/><b>Flavor:</b> Rich, savory, and sometimes spicy.<br/><b>Ingredients:</b> Bamboo shoots, mushrooms, cured meats, fermented ingredients.</>,
            classicDishes: [
                { name: 'Stinky Mandarin Fish', description: 'A uniquely aromatic dish where fish is fermented before being cooked.', imageHint: 'stinky mandarin fish' },
                { name: 'Hairy Tofu', description: 'A local specialty of fermented tofu that develops a hairy texture, pan-fried until golden.', imageHint: 'hairy tofu' },
                { name: 'Fuliji Roast Chicken', description: 'A famous roast chicken known for its tender meat and rich flavor.', imageHint: 'fuliji roast chicken' }
            ]
        },
    }
}

const summaryData = [
  { cuisine: '鲁菜', flavor: '咸鲜醇厚', ingredients: '海鲜、禽畜、葱姜', technique: '吊汤、爆、扒', label: '宫廷菜、北方菜系之首' },
  { cuisine: '川菜', flavor: '麻辣鲜香、复合味', ingredients: '辣椒、花椒、兔肉、河鲜', technique: '炒、爆、调味', label: '江湖菜、调味之王' },
  { cuisine: '粤菜', flavor: '清鲜爽嫩', ingredients: '海鲜、鲜活禽畜、蔬果', technique: '清蒸、白灼、煲', label: '食在广州、海外影响力大' },
  { cuisine: '苏菜', flavor: '清鲜平和、甜咸适中', ingredients: '河鲜、蔬果、禽畜', technique: '炖、焖、精细刀工', label: '文人菜、雅致精细' },
  { cuisine: '浙菜', flavor: '清鲜爽脆', ingredients: '西湖水产、海鲜、笋菇', technique: '蒸、炒、煨', label: '秀色可餐、不时不食' },
  { cuisine: '闽菜', flavor: '酸甜鲜香', ingredients: '海鲜、山珍、红糟', technique: '炖、煨、红糟调味', label: '佛跳墙、东南亚风味融合' },
  { cuisine: '湘菜', flavor: '香辣醇厚', ingredients: '辣椒、河鲜、禽畜、腊味', technique: '炒、爆、煨', label: '无辣不欢、江湖气' },
  { cuisine: '徽菜', flavor: '醇厚咸香', ingredients: '山珍、腌腊、发酵食材', technique: '烧、炖、腌制发酵', label: '山野风味、徽商文化' }
];

const Section: React.FC<{ title: string; icon: React.ElementType; children: React.ReactNode }> = ({ title, icon: Icon, children }) => (
    <div>
        <h4 className="flex items-center text-lg font-semibold mb-3 text-primary/90">
            <Icon className="mr-2 h-5 w-5"/>
            {title}
        </h4>
        <div className="text-sm text-muted-foreground pl-7 space-y-2 prose prose-sm dark:prose-invert max-w-none">
            {children}
        </div>
    </div>
);


const CuisineCard: React.FC<{ cuisine: Cuisine, t: any }> = ({ cuisine, t }) => {
    const featureIcons = {
        '技法': ChefHat,
        '口味': Flame,
        '食材': Map
    }
    return (
        <Card className="shadow-lg bg-card/60 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <CardHeader>
                <CardTitle className="flex items-center text-2xl font-bold text-primary">
                    <Utensils className="mr-3 h-6 w-6" />{cuisine.name}
                </CardTitle>
                <CardDescription>{cuisine.tagline}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                 <Section title={t.originTitle} icon={University}>
                    <p>{cuisine.origin}</p>
                 </Section>
                 <Separator />
                 <Section title={t.featuresTitle} icon={Star}>
                    {(cuisine.features as React.ReactElement).props.children.filter((c: any) => c.type === 'b').map((feature: any, index: number) => {
                        const Icon = featureIcons[feature.props.children as keyof typeof featureIcons] || Star;
                        return (
                        <div key={index} className="flex items-start">
                            <Icon className="h-4 w-4 mt-1 mr-2 text-primary/70 shrink-0"/>
                            <div>{(cuisine.features as React.ReactElement).props.children[index*2+1]}</div>
                        </div>
                        )
                    })}
                 </Section>
                 <Separator />
                 <Section title={t.dishesTitle} icon={CookingPot}>
                    <div className="space-y-4">
                        {cuisine.classicDishes.map((dish, index) => {
                            const imageData = (placeholderImageData as Record<string, { seed: number; hint: string }>)[dish.imageHint.replace(/\s/g, '')] || { seed: Math.floor(Math.random() * 1000), hint: 'food' };
                            return (
                            <div key={index} className="flex flex-col sm:flex-row items-start gap-4 p-2 rounded-lg hover:bg-muted/50">
                                <div className="w-full sm:w-32 h-24 sm:h-20 relative shrink-0 rounded-md overflow-hidden">
                                    <Image
                                        src={`https://picsum.photos/seed/${imageData.seed}/400/300`}
                                        alt={dish.name}
                                        fill
                                        className="object-cover"
                                        data-ai-hint={dish.imageHint}
                                    />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-sm text-foreground">{dish.name}</h4>
                                    <p className="text-xs text-muted-foreground mt-1">{dish.description}</p>
                                </div>
                            </div>
                        )})}
                    </div>
                 </Section>
            </CardContent>
        </Card>
    );
}

export default function EightCuisinesPage() {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageKey>('en');

  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      const browserLang: LanguageKey = navigator.language.toLowerCase().startsWith('zh') ? 'zh-CN' : 'en';
      setCurrentLanguage(browserLang);
    }
  }, []);

  const t = useMemo(() => translations[currentLanguage], [currentLanguage]);
  const cuisines = useMemo(() => Object.values(cuisineData[currentLanguage] || cuisineData['en']), [currentLanguage]);
  
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-background via-amber-50/20 to-green-50/20 text-foreground py-10 px-4 sm:px-8 items-center">
      <header className="w-full max-w-5xl mb-8 self-center">
        <Link href="/kitchen" passHref>
            <Button variant="outline" size="sm" className="bg-background/50 backdrop-blur-sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t.backButton}
            </Button>
        </Link>
      </header>

      <main className="w-full max-w-5xl flex flex-col items-center">
        <div className="text-center mb-10">
            <BookOpen className="w-16 h-16 text-primary mb-4 mx-auto" />
            <h1 className="text-3xl sm:text-4xl font-headline font-bold text-primary mb-3">
              {t.pageTitle}
            </h1>
            <p className="text-muted-foreground text-base max-w-2xl">
              {t.pageDescription}
            </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
            {cuisines.map(cuisine => (
                <CuisineCard key={cuisine.id} cuisine={cuisine} t={t} />
            ))}
        </div>
        
        <div className="w-full mt-16">
             <h2 className="text-2xl font-bold text-center mb-8 text-primary">{t.summaryTitle}</h2>
             <Card className="shadow-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="font-semibold">{t.tableHeaders.cuisine}</TableHead>
                            <TableHead className="font-semibold">{t.tableHeaders.flavor}</TableHead>
                            <TableHead className="font-semibold hidden md:table-cell">{t.tableHeaders.ingredients}</TableHead>
                            <TableHead className="font-semibold hidden lg:table-cell">{t.tableHeaders.technique}</TableHead>
                            <TableHead className="font-semibold">{t.tableHeaders.label}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {summaryData.map((item) => (
                            <TableRow key={item.cuisine}>
                                <TableCell className="font-medium">{item.cuisine}</TableCell>
                                <TableCell>{item.flavor}</TableCell>
                                <TableCell className="hidden md:table-cell">{item.ingredients}</TableCell>
                                <TableCell className="hidden lg:table-cell">{item.technique}</TableCell>
                                <TableCell>{item.label}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
             </Card>
        </div>

      </main>
    </div>
  );
}

