
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
    backButton: '返回',
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
    backButton: 'Back',
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
            origin: <><p>鲁菜是中国八大菜系中历史最悠久、技法最丰富的菜系，起源于春秋战国时期的齐国和鲁国（今山东地区），受儒家“食不厌精，脍不厌细”的饮食思想影响深远.</p><p>主要分为三大流派：</p><ul className="list-disc pl-5 mt-2 space-y-1"><li><b>济南菜</b>：以清汤、奶汤菜见长，口味醇厚，注重火候.</li><li><b>胶东菜</b>（福山菜）：以海鲜为主，讲究鲜活，口味清淡鲜爽，擅长蒸、炸、扒.</li><li><b>孔府菜</b>：源于曲阜孔府，是“官府菜”的代表，讲究礼仪和排场，用料奢华，工艺复杂.</li></ul></>,
            features: <><p><b>技法</b>：擅长爆、炒、烧、扒、熘，尤其重视“吊汤”（清汤、奶汤），汤清而鲜、浓而不腻，是鲁菜的灵魂（如“清汤燕菜”“奶汤蒲菜”）. </p><p><b>口味</b>：咸鲜为主，略带酱香，口感醇厚，不尚辛辣，注重突出食材本味.</p><p><b>食材</b>：依托山东半岛的海鲜资源（如海参、鲍鱼、对虾）和内陆的禽畜、蔬菜（如章丘大葱、莱芜生姜）. </p></>,
            classicDishes: [
                { name: '九转大肠', description: '鲁菜“爆菜”代表，将猪大肠经煮、炸、烧等多道工序烹制，调味融合甜、酸、香、辣、咸，口感软糯入味，因“九道工序”得名，体现鲁菜的精细.', imageHint: 'braised pork intestines' },
                { name: '葱烧海参', description: '胶东菜经典，以大连或烟台海参为主料，搭配章丘大葱，用葱油慢烧，海参软糯Q弹，葱香浓郁，咸鲜适口，是“山珍海味”的典范.', imageHint: 'braised sea cucumber' },
                { name: '德州扒鸡', description: '山东名吃，属鲁菜“扒”法代表，鸡皮完整，肉质酥烂脱骨，卤香浓郁，冷热食均可，被誉为“天下第一鸡”.', imageHint: 'braised chicken' }
            ]
        },
        chuan: {
            id: 'chuan', name: '川菜 (Sichuan)', tagline: '一菜一格，百菜百味',
            origin: <><p>川菜起源于古代巴国和蜀国（今四川、重庆地区），受巴蜀文化影响，结合了当地潮湿气候对“驱寒祛湿”的饮食需求，在明清时期形成规模，现分为<b>川味菜肴</b>和<b>川味小吃</b>两大体系，核心流派为：</p><ul className="list-disc pl-5 mt-2 space-y-1"><li><b>上河帮</b>（成都、乐山菜）：口味温和，注重调味的层次感，擅长做鱼和小吃（如乐山钵钵鸡、成都夫妻肺片）.</li><li><b>下河帮</b>（重庆、万州菜）：口味浓烈，以麻辣鲜香为主，擅长江湖菜（如重庆火锅、万州烤鱼）.</li><li><b>小河帮</b>（自贡、内江菜）：以“鲜辣”“味厚”为特色，擅长做兔肉和河鲜（如冷吃兔、鲜锅兔）.</li></ul></>,
            features: <><p><b>技法</b>：擅长炒、爆、煸、烧、腌，尤其重视“调味”，被誉为“调味之王”，常用辣椒、花椒、姜、蒜、豆瓣酱、泡椒、醪糟等调料.</p><p><b>口味</b>：“百菜百味”是核心，以麻辣、鱼香、宫保、酸辣、椒麻、怪味等口味著称，同一食材可通过不同调味呈现完全不同的风味.</p><p><b>食材</b>：善用四川本地食材，如辣椒（二荆条、小米辣）、花椒（汉源花椒）、豆瓣、泡菜、兔肉、鳝鱼、竹笋等.</p></>,
            classicDishes: [
                { name: '麻婆豆腐', description: '川菜“麻辣”代表，由清代陈麻婆创制，用嫩豆腐、牛肉末、豆瓣酱、花椒粉烹制，麻辣鲜香，豆腐嫩滑，汤汁红亮，下饭神器.', imageHint: 'mapo tofu' },
                { name: '鱼香肉丝', description: '川菜“复合味”代表，虽无鱼却有鱼香，用泡辣椒、葱姜蒜、糖、醋调出“鱼香”味，肉丝滑嫩，配菜（木耳、胡萝卜、莴笋）爽脆，酸甜咸鲜平衡.', imageHint: 'fish-flavored pork' },
                { name: '四川火锅', description: '下河帮代表，以牛油或清油为锅底，搭配大量辣椒、花椒、香料，涮烫毛肚、鸭肠、黄喉等食材，讲究“七上八下”的涮煮节奏，麻辣过瘾，是社交美食的代表.', imageHint: 'sichuan hotpot' }
            ]
        },
        yue: {
            id: 'yue', name: '粤菜 (Cantonese)', tagline: '食在广州，厨出凤城（顺德）',
            origin: <><p>粤菜起源于岭南地区（今广东、广西东部、海南），受中原文化、海外贸易（如东南亚、欧美）影响，形成了“兼容并蓄、注重鲜活”的特点，是中国八大菜系中<b>海外影响力最大</b>的菜系.</p><ul className="list-disc pl-5 mt-2 space-y-1"><li><b>广府菜</b>（广州、佛山菜）：以清淡、鲜爽为主，擅长清蒸、白灼，注重食材本味（如清蒸石斑鱼、白灼虾）.</li><li><b>潮汕菜</b>（潮州、汕头菜）：以海鲜和卤味见长，刀工精细，口味鲜香，擅长腌制和砂锅菜（如潮汕牛肉火锅、卤鹅）.</li><li><b>客家菜</b>（梅州、惠州菜）：源于中原移民，口味偏咸香，擅长炖、煲、酿，注重食材的“质朴本味”（如客家酿豆腐、梅菜扣肉）.</li></ul></>,
            features: <><p><b>技法</b>：擅长清蒸、白灼、烤、煲、炖，追求“鲜活”，烹饪时间短，最大程度保留食材的原味和营养（如“清蒸”要求火候精准，鱼眼突出即熟）. </p><p><b>口味</b>：清、鲜、嫩、滑、爽，极少使用辛辣调料，注重“淡而不寡”，调味以盐、糖、生抽、蚝油为主，部分菜品带微甜（如叉烧肉）. </p><p><b>食材</b>：“凡能食者皆可为菜”，食材极为丰富，涵盖海鲜（鱼、虾、蟹、贝类）、禽畜、野味、蔬果，尤其擅长处理“鲜活”食材（如龙虎斗、白切鸡）. </p></>