"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Leaf, CookingPot, ChefHat, Star, Utensils, Lightbulb, Scale, BookOpen, ShieldAlert, Globe, Wind, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';

const translations = {
  'zh-CN': {
    pageTitle: '全球香料实用使用指南',
    pageDescription: '探索跨越地域与菜系的“风味密码”。',
    backButton: '返回厨房',
    tabChinese: '中式传统',
    tabEuropean: '欧美草本',
    tabSEA: '东南亚辛香',
    tabMiddleEast: '中东/印度',
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
        principleContent: [
            '浓烈香料（丁香、肉豆蔻、卡宴辣椒）过量易掩盖食材本味：丁香每次≤3粒，肉豆蔻≤1/4颗，卡宴辣椒从1/4茶匙开始尝试。',
            '热性香料（桂皮、草果、孜然、姜黄）夏季需减量，避免上火（例：1kg肉配草果不超过1颗）。'
        ],
        prepTitle: '预处理黄金法则',
        prepContent: [
            '干香料（八角、桂皮、香叶）：温水浸泡10分钟（去浮尘、激发香味），或小火微炒至微黄（勿炒糊，否则发苦）。',
            '新鲜香料（罗勒、薄荷、紫苏）：烹饪前洗净沥干，出锅前加入（避免久煮导致香味流失、颜色变黑）。',
            '带籽香料（草果、豆蔻）：去籽使用（籽味苦，影响口感）；坚硬香料（南姜、桂皮）拍裂/切块，方便出味。'
        ],
        pairingTitle: '搭配逻辑：“功能互补”更出味',
        pairingContent: [
            '重腥膻食材（羊肉、内脏）：祛腥（白芷、南姜）+ 增香（八角、迷迭香）+ 解腻（陈皮、欧芹），三者协同效果最佳。例：炖羊肉 = 白芷（祛膻）+ 八角（增香）+ 陈皮（解腻）。',
            '清淡食材（鱼肉、蔬菜）：选清新香料（紫苏、柠檬叶、百里香），避免用浓郁香料（桂皮、丁香）压味。例：清蒸鱼 = 紫苏叶（祛腥）+ 柠檬片（提鲜）。',
            '卤菜/炖菜“基础公式”：以10斤水为例，八角5颗+桂皮2段+香叶5片+小茴香1小把（祛腥增香基底），可根据食材加草果（牛肉）、黄栀子（调色）。'
        ],
        storageTitle: '储存与替换技巧',
        storageContent: [
            '储存：干香料密封避光，放干燥阴凉处（保质期6-12个月）；新鲜草本（罗勒、香茅）用湿纸包裹冷藏，或插入清水（每周换水，可存1-2周）。',
            '新鲜vs干制替换：新鲜香料与干制香料风味差异大，替换比例约为 3:1（3份新鲜=1份干制），干制香料早加入（耐煮），新鲜香料出锅前加（保清新）。'
        ],
    },
    fusion: {
      title: '跨菜系融合案例 (实操参考)',
      case1Title: '中式卤水 + 东南亚香料',
      case1Desc: '基础卤水（八角+桂皮+香叶）中加入1段香茅+2片柠檬叶，卤出的鸡肉自带柠檬清香，解腻又独特。',
      case2Title: '西式烤鸡 + 中式香料',
      case2Desc: '烤鸡腌料（迷迭香+百里香+橄榄油）中加少许花椒粉，外皮酥脆带微麻，平衡中西风味。',
      case3Title: '泰式冬阴功 + 中式陈皮',
      case3Desc: '冬阴功汤（香茅+南姜+柠檬叶）中加1小块陈皮，中和酸辣感，更适合中国人口味。'
    }
  },
  'en': {
    pageTitle: 'Practical Global Spice Guide',
    pageDescription: 'Explore the "flavor codes" that transcend regions and cuisines.',
    backButton: 'Back to Kitchen',
    tabChinese: 'Chinese',
    tabEuropean: 'European',
    tabSEA: 'Southeast Asian',
    tabMiddleEast: 'Mid-East/Indian',
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
        principleContent: [
            'Strong spices (cloves, nutmeg, cayenne) can overpower dishes: use ≤3 cloves, ≤1/4 nutmeg, start with 1/4 tsp cayenne.',
            'Use warming spices (cassia, caoguo, cumin, turmeric) sparingly in summer (e.g., max 1 caoguo per 1kg meat).'
        ],
        prepTitle: 'Golden Rules for Preprocessing',
        prepContent: [
            "Dry spices (star anise, cassia): Soak in warm water for 10 mins (cleans & awakens flavor) or lightly toast (don't burn).",
            "Fresh herbs (basil, mint): Wash, pat dry, add at the end of cooking.",
            "Seeded spices (caoguo, cardamom): Deseed to reduce bitterness. Hard spices (galangal, cassia): Crush or slice to release flavor."
        ],
        pairingTitle: 'Pairing Logic: Complementary Functions',
        pairingContent: [
            'Strong-flavored meats (lamb, offal): Use a "de-fishing (angelica root/galangal) + aromatizing (star anise/rosemary) + degreasing (chenpi/parsley)" combo. E.g., Lamb stew = Angelica + Star Anise + Chenpi.',
            'Delicate foods (fish, vegetables): Use fresh herbs (perilla, lime leaf, thyme); avoid overpowering spices (cloves). E.g., Steamed fish = Perilla + Lemon.',
            'Braising/Stewing "Base Formula": For 5L water, use 5 star anise, 2 cassia sticks, 5 bay leaves, 1 handful fennel seeds as a base.'
        ],
        storageTitle: 'Storage & Substitution',
        storageContent: [
            'Storage: Store dry spices in a cool, dark, airtight place (6-12 months). Keep fresh herbs in a damp paper towel in the fridge or in water (change weekly, lasts 1-2 weeks).',
            'Fresh vs. Dry: The ratio is roughly 3:1 (fresh:dry). Add dry spices early; add fresh herbs at the end.'
        ],
    },
    fusion: {
      title: 'Cross-Cuisine Fusion Cases (Practical Reference)',
      case1Title: 'Chinese Brine + SEA Spices',
      case1Desc: 'Add 1 lemongrass stalk + 2 lime leaves to a basic brine for a refreshing, unique chicken flavor.',
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
        { name: '八角', features: '甘香微甜，香气醇厚', preprocessing: '整颗使用（碎末易发苦）；卤前用温水浸泡10分钟去浮尘', pairing: '猪肉、牛肉、羊肉、禽类', usage: '1. 卤猪蹄：2-3颗八角+2段桂皮+5片香叶，煮出基础卤香；<br>2. 炖排骨：1颗八角+姜片+葱段，除腥增香', suggestions: '桂皮、香叶、小茴香' },
        { name: '花椒', features: '辛香带麻，层次丰富', preprocessing: '干花椒直接用；突出麻味可热油炝香（六成热下花椒，炸香后捞出留油）', pairing: '川菜、牛肉、羊肉、豆制品', usage: '1. 麻婆豆腐：20粒花椒炝香后，加入豆瓣酱炒红油；<br>2. 烤羊肉串：撒花椒粉+孜然，平衡膻味', suggestions: '辣椒、孜然、生姜' },
        { name: '桂皮', features: '辛香微甜，香味持久', preprocessing: '整段使用（避免切得过碎）；可敲成小块方便出味', pairing: '猪肉、牛肉、卤味、甜品', usage: '1. 卤牛肉：1段桂皮+2颗八角+1粒丁香，中和肉腥；<br>2. 甜汤（桂圆红枣茶）：1小段桂皮，增添暖香', suggestions: '八角、丁香、草果' },
        { name: '香叶', features: '淡辛香，提味不抢镜', preprocessing: '干制香叶直接用（勿清洗，避免香味流失）', pairing: '所有肉类、卤菜、炖菜', usage: '1. 炖牛肉：1片香叶+八角+花椒，提升复合香；<br>2. 卤鸡爪：2片香叶+桂皮+小茴香，祛腥增香', suggestions: '八角、桂皮、花椒' },
        { name: '草果', features: '浓烈辛辣，祛腥力强', preprocessing: '去籽使用（籽味苦）；可拍裂方便出味', pairing: '牛肉、羊肉、内脏', usage: '炖羊肉：1-2颗去籽草果+白芷+生姜，彻底去除羊膻味', suggestions: '白芷、生姜、陈皮' },
        { name: '陈皮', features: '辛苦带果香，解腻增香', preprocessing: '温水泡软（5分钟），刮去内层白瓤（减苦涩），切丝/块', pairing: '鸭肉、牛肉、排骨', usage: '1. 炖羊肉：2-3片陈皮+红枣，解腻祛膻；<br>2. 陈皮红豆沙：陈皮丝与红豆同煮，增香添甜', suggestions: '生姜、红枣、红豆' },
        { name: '孜然（中式）', features: '香辣浓郁，异域感强', preprocessing: '整粒干炒1-2分钟（无油），磨成粉（风味更浓）', pairing: '羊肉、牛肉、烧烤、油炸食品', usage: '1. 烤羊肉：刷油后撒孜然粒（或粉）+辣椒面；<br>2. 孜然牛肉：先炒香孜然粒，再放牛肉翻炒', suggestions: '辣椒、羊肉、洋葱' },
        { name: '紫苏', features: '辛香清新，祛腥解腻', preprocessing: '新鲜紫苏洗净沥干；干紫苏需温水泡软', pairing: '鱼类、螃蟹、田螺、牛肉', usage: '1. 煮鱼：鱼身放几片紫苏+姜片，祛鱼腥；<br>2. 炒田螺：切碎紫苏+辣椒+大蒜，提升风味', suggestions: '辣椒、大蒜、生姜、鱼类' },
        { name: '黄栀子', features: '微苦，天然黄色色素', preprocessing: '整颗敲裂（方便色素析出）；温水浸泡10分钟取液调色', pairing: '卤菜（猪蹄、鸡）、炖菜', usage: '卤猪蹄：2-3颗敲裂黄栀子+八角+桂皮，使卤菜呈金黄色', suggestions: '八角、桂皮、酱油' },
        { name: '罗汉果', features: '味甜，天然甜味剂', preprocessing: '敲开取果肉+果核（果核也带甜），热水冲泡或直接入卤', pairing: '卤菜、甜汤、饮品', usage: '1. 卤菜：1/4个罗汉果替代部分糖，增加自然甜；<br>2. 罗汉果雪梨汤：与雪梨、百合同煮，清热解腻', suggestions: '雪梨、百合、卤料包' },
    ],
    european: [
      { name: '迷迭香', features: '木质香+松针感，微苦', preprocessing: '取嫩枝使用（老枝木质化）；干品用量为新鲜的1/3', pairing: '鸡胸肉、羊排、土豆', usage: '1. 烤羊排：迷迭香嫩枝+橄榄油+大蒜，涂抹后烤制，祛膻增香；<br>2. 烤土豆：迷迭香+盐+黑胡椒，提升薯香', suggestions: '橄榄油、大蒜、黑胡椒、土豆' },
      { name: '百里香', features: '柔和花香+柠檬味', preprocessing: '取叶片（去硬枝）；干品直接使用，耐久煮', pairing: '鳕鱼、牛肉、蘑菇', usage: '1. 鸡汤：新鲜3-4枝（干1茶匙）+洋葱+胡萝卜，提鲜；<br>2. 奶油蘑菇汤：加百里香，平衡奶油厚重感', suggestions: '洋葱、胡萝卜、奶油、蘑菇' },
      { name: '罗勒', features: '甜香带薄荷感（分甜/紫罗勒）', preprocessing: '新鲜罗勒烹饪前切碎（避免氧化变黑）；干品适合炖煮', pairing: '意面青酱、披萨、沙拉', usage: '1. 番茄意面：出锅前加切碎罗勒+帕玛森芝士；<br>2. 煎鸡胸：罗勒+大蒜+橄榄油腌制，增香草香', suggestions: '番茄、大蒜、橄榄油、芝士' },
      { name: '欧芹', features: '清新芹菜香，脆嫩爽口', preprocessing: '不可久煮，避免香味流失', pairing: '三文鱼、牛排、蔬菜', usage: '沙拉点缀、酱汁基底、汤品收尾', suggestions: '三文鱼、牛排、蔬菜' },
      { name: '牛至', features: '辛辣微苦，带茴香感', preprocessing: '干燥品香味比新鲜品浓，100g肉配1小勺，适合重口味料理', pairing: '牛肉、猪肉、豆类', usage: '披萨、意式肉酱、墨西哥塔可', suggestions: '牛肉、猪肉、豆类' },
      { name: '莳萝', features: '甜香带茴香，清爽解腻', preprocessing: '新鲜品易蔫，用湿纸包裹冷藏；干燥品适合腌料', pairing: '三文鱼、虾、黄瓜', usage: '北欧腌三文鱼、俄式冷汤', suggestions: '三文鱼、虾、黄瓜' },
    ],
    southeastAsian: [
      { name: '香茅', features: '浓烈柠檬香+草本涩感', preprocessing: '去除外层老皮，取白色茎部切段拍裂（方便出味）', pairing: '海鲜、鸡肉、椰浆料理', usage: '1. 冬阴功汤：1段香茅+南姜+柠檬叶，奠定酸辣基底；<br>2. 越南河粉：香茅煮汤底，增添清新感', suggestions: '南姜、柠檬叶、椰浆' },
      { name: '南姜', features: '辛辣带柑橘香，比生姜冲', preprocessing: '去皮后切片/拍碎（质地坚硬）；不宜生食', pairing: '泰式咖喱、海鲜（贻贝、鱿鱼）', usage: '1. 红咖喱酱：南姜+香茅+柠檬叶打成基底；<br>2. 烤鱿鱼：南姜碎+鱼露腌制，祛腥增香', suggestions: '香茅、柠檬叶、鱼露' },
      { name: '柠檬叶', features: '强烈柠檬香，微苦', preprocessing: '新鲜叶片需撕碎（叶脉香味最浓）；干品适合做汤', pairing: '椰香鸡汤、叻沙、虾仁', usage: '1. 椰香鸡汤：2片柠檬叶+香茅+南姜，提升清爽感；<br>2. 炒虾仁：柠檬叶碎+蒜末，增香解腻', suggestions: '香茅、南姜、椰浆' },
    ],
    middleEastern: [
        { name: '孜然籽（中东）', features: '辛辣带坚果香，比孜然粉清新', preprocessing: '干炒1-2分钟（无油），研磨成粉（香味更浓）', pairing: '中东烤肉、鹰嘴豆、咖喱', usage: '1. 烤羊肉串：孜然籽粉+小豆蔻+柠檬汁，异域风味；<br>2. 鹰嘴豆泥：撒孜然籽粉+橄榄油，提香', suggestions: '芫荽籽、小豆蔻、柠檬汁' },
        { name: '芫荽籽', features: '温和柑橘香+木质香，微甜', preprocessing: '与孜然籽1:1混合，是咖喱粉核心成分，炒后风味更突出', pairing: '豆类、鸡肉、牛肉', usage: '印度马萨拉、中东蘸料', suggestions: '孜然籽、小豆蔻、柠檬汁' },
        { name: '姜黄', features: '微苦姜香，天然黄色色素', preprocessing: '干姜黄粉直接用；新鲜姜黄去皮切碎/磨泥', pairing: '咖喱、鸡肉、米饭、汤羹', usage: '1. 黄咖喱：1-2茶匙姜黄粉+咖喱块，调色增香；<br>2. 姜黄饭：米饭+姜黄粉+盐，蒸制呈金黄色', suggestions: '咖喱、洋葱、大蒜、椰浆' },
        { name: '小豆蔻', features: '清新花香+柑橘香，微辣', preprocessing: '带壳使用（壳可增香），1杯奶茶配2-3颗，价格较高需省用', pairing: '牛奶、羊肉、蛋糕', usage: '印度奶茶、咖喱、甜点', suggestions: '牛奶、羊肉、蛋糕' },
        { name: '葫芦巴籽', features: '微苦带烟熏香，类似枫糖味', preprocessing: '需提前浸泡去苦味，与姜黄、芫荽籽搭配是经典组合', pairing: '牛肉、豆类、蔬菜', usage: '印度咖喱、中东烤肉腌料', suggestions: '姜黄、芫荽籽' },
    ]
  },
  'en': {
    chinese: [
      { name: 'Star Anise', features: 'Sweet & fragrant, full-bodied', preprocessing: 'Use whole (powder can be bitter); soak in warm water for 10 mins to clean', pairing: 'Pork, beef, lamb, poultry', usage: '1. Braised Pork Knuckle: 2-3 pods for a base aroma.<br>2. Stewed Ribs: 1 pod with ginger & scallion to remove gaminess.', suggestions: 'Cassia, bay leaf, fennel' },
      { name: 'Sichuan Pepper', features: 'Numbing & fragrant, complex', preprocessing: 'Use dry; for more numbing flavor, sizzle in hot oil then remove', pairing: 'Sichuan cuisine, beef, lamb', usage: '1. Mapo Tofu: Sizzle 20 peppercorns before adding sauces.<br>2. Grilled Lamb Skewers: Sprinkle powder with cumin.', suggestions: 'Chili, cumin, ginger' },
      { name: 'Cassia/Cinnamon', features: 'Pungent & sweet, long-lasting', preprocessing: 'Use whole sections; can be broken for more flavor', pairing: 'Pork, beef, braised dishes', usage: '1. Braised Beef: 1 stick with star anise to neutralize gaminess.<br>2. Sweet Tea: A small piece for aroma.', suggestions: 'Star anise, clove, caoguo' },
      { name: 'Bay Leaf', features: 'Mildly pungent, enhances flavor', preprocessing: 'Use dried leaves directly (do not wash to preserve flavor)', pairing: 'All meats, stews', usage: '1. Beef Stew: 1 leaf with star anise & Sichuan pepper.<br>2. Braised Chicken Feet: 2 leaves with cassia & fennel.', suggestions: 'Star anise, cassia, Sichuan pepper' },
      { name: 'Caoguo', features: 'Strongly pungent, de-fishing', preprocessing: 'Remove seeds (bitter); crush to release flavor', pairing: 'Beef, lamb, offal', usage: 'Lamb Stew: 1-2 deseeded caoguo with angelica root and ginger.', suggestions: 'Angelica root, ginger, dried tangerine peel' },
      { name: 'Dried Tangerine Peel', features: 'Bitter & fruity, cuts grease', preprocessing: 'Soften in warm water (5 mins), scrape off white pith (reduces bitterness)', pairing: 'Beef, lamb, poultry, desserts', usage: '1. Lamb Stew: 2-3 pieces with red dates to cut grease.<br>2. Red Bean Soup: Cook with red beans for fragrance.', suggestions: 'Ginger, red dates, red beans' },
      { name: 'Cumin (Chinese)', features: 'Spicy & rich, exotic', preprocessing: 'Dry-toast whole seeds for 1-2 mins, then grind for stronger flavor', pairing: 'Lamb, beef, BBQ, fried foods', usage: '1. Grilled Lamb: Sprinkle seeds/powder with chili flakes.<br>2. Cumin Beef: Stir-fry cumin seeds first, then add beef.', suggestions: 'Chili, lamb, onion' },
      { name: 'Perilla', features: 'Pungent & fresh, anti-fishy', preprocessing: 'Wash and drain fresh leaves; soak dried leaves', pairing: 'Fish, crab, snails, beef', usage: '1. Steamed Fish: Place leaves on fish with ginger to remove fishiness.<br>2. Stir-fried Snails: Minced perilla + chili + garlic.', suggestions: 'Chili, garlic, ginger, fish' },
      { name: 'Gardenia Fruit', features: 'Slightly bitter, natural yellow dye', preprocessing: 'Crack open; soak in warm water for 10 mins to extract color', pairing: 'Braised dishes (pork, chicken)', usage: 'Braised Pork Knuckle: 2-3 fruits for a golden-yellow color.', suggestions: 'Star anise, cassia, soy sauce' },
      { name: 'Monk Fruit', features: 'Sweet, natural sweetener', preprocessing: 'Break open, use pulp and seeds (seeds are also sweet)', pairing: 'Braised dishes, sweet soups, drinks', usage: '1. Braise: 1/4 fruit to replace sugar for a natural sweetness.<br>2. Pear Soup: Cook with pear and lily bulb.', suggestions: 'Pear, lily bulb, master stock' },
    ],
    european: [
      { name: 'Rosemary', features: 'Woody & pine-like, slightly bitter', preprocessing: 'Use tender sprigs (old ones are woody); use 1/3 amount if dried', pairing: 'Lamb, beef, chicken, potatoes', usage: '1. Roast Lamb: Rub with rosemary, olive oil, and garlic.<br>2. Roast Potatoes: Toss with rosemary, salt, and pepper.', suggestions: 'Olive oil, garlic, black pepper, potatoes' },
      { name: 'Thyme', features: 'Mild, floral & lemony', preprocessing: 'Use leaves, discard stems; dried version is good for long cooking', pairing: 'Chicken, fish, stews, cream sauces', usage: '1. Chicken Soup: 3-4 fresh sprigs (or 1 tsp dried) with onion and carrot.<br>2. Mushroom Soup: Balances the richness of cream.', suggestions: 'Onion, carrot, cream, mushrooms' },
      { name: 'Basil', features: 'Sweet & peppery, rich & fresh', preprocessing: 'Chop fresh basil right before use to prevent browning; dried is for stews', pairing: 'Italian dishes, tomatoes, chicken, pizza', usage: '1. Tomato Pasta: Add chopped basil and parmesan at the end.<br>2. Grilled Chicken: Marinate with basil, garlic, and olive oil.', suggestions: 'Tomato, garlic, olive oil, cheese' },
      { name: 'Parsley', features: 'Fresh celery-like flavor, crisp', preprocessing: 'Do not overcook to preserve flavor', pairing: 'Salmon, steak, vegetables', usage: 'Garnish for salads, base for sauces, finish for soups.', suggestions: 'Salmon, steak, vegetables' },
      { name: 'Oregano', features: 'Pungent & slightly bitter, anise-like', preprocessing: 'Dried is more potent than fresh; 1 tsp per 100g meat for bold dishes', pairing: 'Beef, pork, beans', usage: 'Pizza, Italian meat sauces, Mexican tacos.', suggestions: 'Beef, pork, beans' },
      { name: 'Dill', features: 'Sweet & anise-like, refreshing', preprocessing: 'Fresh dill wilts fast, wrap in damp paper towel to store; dried is good for marinades', pairing: 'Salmon, shrimp, cucumber', usage: 'Nordic cured salmon (Gravlax), Russian cold soups.', suggestions: 'Salmon, shrimp, cucumber' },
    ],
    southeastAsian: [
      { name: 'Lemongrass', features: 'Strong lemon aroma, herbal', preprocessing: 'Remove tough outer layers, use the white stalk, and crush it to release flavor', pairing: 'Seafood, chicken, coconut milk dishes', usage: '1. Tom Yum Soup: 1 stalk with galangal and lime leaves for the base.<br>2. Pho Broth: Infuse for a fresh aroma.', suggestions: 'Galangal, kaffir lime leaf, coconut milk' },
      { name: 'Galangal', features: 'Pungent & citrusy, stronger than ginger', preprocessing: 'Peel and slice/crush (it\'s tough); not suitable for raw consumption', pairing: 'Thai curries, seafood (mussels, squid)', usage: '1. Red Curry Paste: Base ingredient with lemongrass and lime leaves.<br>2. Grilled Squid: Marinate with minced galangal and fish sauce.', suggestions: 'Lemongrass, kaffir lime leaf, fish sauce' },
      { name: 'Kaffir Lime Leaf', features: 'Intense lemon scent, slightly bitter', preprocessing: 'Tear fresh leaves to release aroma (vein is most fragrant); dried is suitable for soups', pairing: 'Coconut chicken soup, Laksa, shrimp', usage: '1. Coconut Chicken Soup: 2 leaves with lemongrass and galangal.<br>2. Stir-fried Shrimp: Add minced leaves with garlic.', suggestions: 'Lemongrass, galangal, coconut milk' },
    ],
    middleEastern: [
        { name: 'Cumin Seed', features: 'Pungent & nutty, fresher than powder', preprocessing: 'Dry-toast for 1-2 mins (no oil), then grind for intense flavor', pairing: 'Middle Eastern BBQ, hummus, curries', usage: '1. Lamb Skewers: Ground cumin with cardamom and lemon juice.<br>2. Hummus: Sprinkle on top with olive oil.', suggestions: 'Coriander seed, cardamom, lemon juice' },
        { name: 'Coriander Seed', features: 'Mild citrus & woody aroma, slightly sweet', preprocessing: 'Mix 1:1 with cumin for curry powder base; toasting enhances flavor', pairing: 'Legumes, chicken, beef', usage: 'Indian masalas, Middle Eastern dips.', suggestions: 'Cumin seed, cardamom, lemon juice' },
        { name: 'Turmeric', features: 'Earthy, slightly bitter, natural yellow dye', preprocessing: 'Use dried powder directly; grate fresh turmeric', pairing: 'Curries, chicken, rice, soups', usage: '1. Yellow Curry: 1-2 tsp powder for color and flavor.<br>2. Turmeric Rice: Steam rice with powder and salt for a golden hue.', suggestions: 'Curry, onion, garlic, coconut milk' },
        { name: 'Cardamom', features: 'Fresh floral & citrus aroma, slightly spicy', preprocessing: 'Use whole pods (husk adds aroma); 2-3 pods per cup of chai; expensive, use sparingly', pairing: 'Milk, lamb, cakes', usage: 'Indian chai, curries, desserts.', suggestions: 'Milk, lamb, cakes' },
        { name: 'Fenugreek Seed', features: 'Slightly bitter with a smoky, maple-like flavor', preprocessing: 'Soak to reduce bitterness; classic combo with turmeric and coriander', pairing: 'Beef, legumes, vegetables', usage: 'Indian curries, Middle Eastern BBQ marinades.', suggestions: 'Turmeric, coriander seed' },
    ]
  },
};

type LanguageKey = keyof typeof translations;
type SpiceCategoryKey = keyof typeof spiceData['en'];
type Spice = (typeof spiceData)['en']['chinese'][0];

const categoryIcons: Record<string, React.ElementType> = {
  chinese: CookingPot,
  european: Leaf,
  southeastAsian: Wind,
  middleEastern: Sun,
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
          <div className="text-xs text-muted-foreground pl-6 space-y-1" dangerouslySetInnerHTML={{ __html: content as string }} />
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

const TipCard: React.FC<{ icon: React.ElementType; title: string; content: string[]; }> = ({ icon: Icon, title, content }) => (
    <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base"><Icon className="w-5 h-5 text-primary"/>{title}</CardTitle>
        </CardHeader>
        <CardContent>
            <ul className="space-y-3">
              {content.map((item, index) => (
                <li key={index} className="flex items-start text-sm text-muted-foreground">
                  <span className="mr-2 mt-1">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
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
            <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6 mb-8 bg-card/60 backdrop-blur-md">
                <TabsTrigger value="chinese" className="flex items-center gap-2"><CookingPot className="w-4 h-4"/>{t.tabChinese}</TabsTrigger>
                <TabsTrigger value="european" className="flex items-center gap-2"><Leaf className="w-4 h-4"/>{t.tabEuropean}</TabsTrigger>
                <TabsTrigger value="southeastAsian" className="flex items-center gap-2"><Wind className="w-4 h-4"/>{t.tabSEA}</TabsTrigger>
                <TabsTrigger value="middleEastern" className="flex items-center gap-2"><Sun className="w-4 h-4"/>{t.tabMiddleEast}</TabsTrigger>
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

            <TabsContent value="european">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {spiceData[currentLanguage].european.map((spice, index) => (
                     <SpiceCard key={index} spice={spice} labels={t.cardLabels}/>
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="southeastAsian">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {spiceData[currentLanguage].southeastAsian.map((spice, index) => (
                     <SpiceCard key={index} spice={spice} labels={t.cardLabels}/>
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="middleEastern">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {spiceData[currentLanguage].middleEastern.map((spice, index) => (
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
