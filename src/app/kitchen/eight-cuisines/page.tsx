
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
            features: <><p><b>技法</b>：擅长清蒸、白灼、烤、煲、炖，追求“鲜活”，烹饪时间短，最大程度保留食材的原味和营养（如“清蒸”要求火候精准，鱼眼突出即熟）. </p><p><b>口味</b>：清、鲜、嫩、滑、爽，极少使用辛辣调料，注重“淡而不寡”，调味以盐、糖、生抽、蚝油为主，部分菜品带微甜（如叉烧肉）. </p><p><b>食材</b>：“凡能食者皆可为菜”，食材极为丰富，涵盖海鲜（鱼、虾、蟹、贝类）、禽畜、野味、蔬果，尤其擅长处理“鲜活”食材（如龙虎斗、白切鸡）. </p></>,
            classicDishes: [
                { name: '白切鸡', description: '粤菜“白灼”代表，将整鸡放入微沸的热水中浸熟，皮爽肉滑，原汁原味，配以姜蓉、葱油蘸料，是检验鸡肉品质的试金石.', imageHint: 'white cut chicken' },
                { name: '清蒸石斑鱼', description: '广府菜的代表，对食材新鲜度要求极高，用葱姜、酱油清蒸，鱼肉鲜嫩，火候精准是关键，是粤菜“鲜”的极致体现.', imageHint: 'steamed grouper fish' },
                { name: '梅菜扣肉', description: '客家菜经典，将五花肉与梅菜干一同蒸制，肉质软烂，梅菜吸收了肉的油腻，咸香下饭.', imageHint: 'pork with preserved vegetable' }
            ]
        },
        su: {
            id: 'su', name: '苏菜 (Jiangsu)', tagline: '精致典雅，平和隽永',
            origin: <><p>苏菜起源于江苏地区，以其精细的刀工、注重火候和强调本味的特点而闻名。苏菜由四大流派组成：</p><ul className="list-disc pl-5 mt-2 space-y-1"><li><b>淮扬菜</b>：以扬州、淮安为中心，刀工精细，口味清淡，是国宴常用菜系。</li><li><b>金陵菜</b>：以南京为中心，擅长炖、焖、煨，口味平和，尤以鸭馔著称。</li><li><b>苏锡菜</b>：以苏州、无锡为中心，口味偏甜，注重选料和时令。</li><li><b>徐海菜</b>：以徐州、连云港为中心，口味偏咸，五味兼蓄。</li></ul></>,
            features: <><p><b>技法</b>：注重“炖、焖、煨、焐”，追求原汁原味，火候精准。刀工精细，形态美观，如“文思豆腐”。</p><p><b>口味</b>：咸甜适中，清淡平和，讲究“鲜”，但不夺主味。</p><p><b>食材</b>：多用江河湖海之鲜，如长江三鲜（刀鱼、鲥鱼、河豚），以及各类时令蔬菜。</p></>
            ,classicDishes: [
                { name: '狮子头', description: '淮扬菜代表，用肥瘦相间的猪肉手工斩制成肉丸，或清炖或红烧，口感松软，入口即化。', imageHint: 'pork meatball soup' },
                { name: '松鼠鳜鱼', description: '苏帮菜的经典之作，将鳜鱼去骨后剞花刀，炸制定型，浇上糖醋芡汁，形似松鼠，酸甜可口。', imageHint: 'sweet and sour fish' },
                { name: '盐水鸭', description: '金陵菜代表，皮白肉嫩，肥而不腻，香鲜味美，具有香、酥、嫩的特点。', imageHint: 'saltwater duck' }
            ]
        },
        zhe: {
            id: 'zhe', name: '浙菜 (Zhejiang)', tagline: '清、香、脆、嫩、爽、鲜',
            origin: <><p>浙菜起源于浙江地区，以选料讲究、烹饪独到、注重本味、制作精细为主要特点。主要由三个流派组成：</p><ul className="list-disc pl-5 mt-2 space-y-1"><li><b>杭州菜</b>：口味清淡，注重原汁原味，如西湖醋鱼。</li><li><b>宁波菜</b>：以海鲜为主，口味咸鲜，擅长蒸、烤、炖。</li><li><b>绍兴菜</b>：富有江南水乡风味，多用霉干菜、酒糟等，口味独特。</li></ul></>,
            features: <><p><b>技法</b>：擅长炒、炸、烩、熘、蒸、烧，小炒技艺尤为精湛。</p><p><b>口味</b>：清鲜爽脆，淡雅细腻，不尚浓油重酱。</p><p><b>食材</b>：四时鲜蔬，江河湖海之鲜，山珍野味，皆入佳肴。</p></>,
            classicDishes: [
                { name: '西湖醋鱼', description: '杭州传统名菜，选用西湖草鱼，烹制时不加一滴油，仅用糖醋调味，鱼肉鲜嫩，酸甜适口。', imageHint: 'west lake fish' },
                { name: '酸菜鱼', description: '起源于宁波，后在川菜中发扬光大，以鲜活草鱼与酸菜一同烹制，鱼片嫩滑，汤汁酸辣可口。', imageHint: 'fish with pickled vegetable' },
                { name: '叫花鸡', description: '杭州名菜，将加工好的鸡用泥土和荷叶包裹，置于火中煨烤而成，肉质酥烂，香味浓郁。', imageHint: 'beggars chicken' }
            ]
        },
        min: {
            id: 'min', name: '闽菜 (Fujian)', tagline: '汤菜之王，海味之冠',
            origin: <><p>闽菜起源于福建地区，以烹制山珍海味而著称，在色香味形俱佳的基础上，尤以“香”、“味”见长。主要流派有：</p><ul className="list-disc pl-5 mt-2 space-y-1"><li><b>福州菜</b>：口味偏甜、酸、淡，尤重“汤”的调制。</li><li><b>闽南菜</b>：口味咸鲜，讲究佐料，擅长使用沙茶、虾油等。</li><li><b>闽西菜</b>：口味偏咸辣，多山珍，富有山区特色。</li></ul></>,
            features: <><p><b>技法</b>：擅长炒、蒸、煨、炖，尤以“煨”和“糟”见长。</p><p><b>口味</b>：清鲜、和醇、荤香、不腻，汤菜居多，味重“鲜、酸、甜”。</p><p><b>食材</b>：以海鲜和山珍为主，如鱼、虾、螺、蚌、香菇、竹笋等。</p></>,
            classicDishes: [
                { name: '佛跳墙', description: '福州首席名菜，集山珍海味于一坛，用鲍鱼、海参、鱼翅、干贝等几十种原料煨制而成，汤浓味厚，香飘四溢。', imageHint: 'abalone soup' },
                { name: '荔枝肉', description: '福州传统名菜，将猪瘦肉剞上十字花刀，切成斜形块，炸后形似荔枝，再用糖醋等调料烧制而成。', imageHint: 'lychee pork' },
                { name: '沙茶面', description: '闽南特色小吃，用沙茶酱熬制的汤头，配以各种自选食材，汤色红亮，口味咸鲜香辣。', imageHint: 'satay noodles' }
            ]
        },
        xiang: {
            id: 'xiang', name: '湘菜 (Hunan)', tagline: '香辣浓郁，腊味十足',
            origin: <><p>湘菜起源于湖南地区，历史悠久，以其香辣、软嫩、香鲜、浓郁的口味而闻名。主要流派：</p><ul className="list-disc pl-5 mt-2 space-y-1"><li><b>湘江流域</b>：以长沙、衡阳、湘潭为中心，口味油重、咸辣。</li><li><b>洞庭湖区</b>：以常德、岳阳为中心，擅长烹制河鲜、家禽。</li><li><b>湘西山区</b>：以湘西、张家界为中心，多用腊、熏、腌制手法。</li></ul></>,
            features: <><p><b>技法</b>：擅长炒、煨、蒸、腊、熏、炖。</p><p><b>口味</b>：香辣、酸辣、咸香，讲究“入味”，注重主味突出。</p><p><b>食材</b>：品类繁多，尤以腊味、辣椒、豆豉、剁椒为特色。</p></>,
            classicDishes: [
                { name: '剁椒鱼头', description: '湘菜代表之一，以大鱼头和湖南特产的剁辣椒一同蒸制，色泽红亮，鱼肉鲜嫩，香辣可口。', imageHint: 'steamed fish head' },
                { name: '红烧肉', description: '毛氏红烧肉为代表，选用半肥半瘦的猪五花，用酱油、糖等慢火煨制，肥而不腻，入口即化。', imageHint: 'braised pork belly' },
                { name: '东安子鸡', description: '湖南传统名菜，以鸡肉为主料，配以辣椒、醋等烹制，肉质鲜嫩，味道酸辣，香气浓郁。', imageHint: 'dong an chicken' }
            ]
        },
        hui: {
            id: 'hui', name: '徽菜 (Anhui)', tagline: '重油、重色、重火功',
            origin: <><p>徽菜起源于古徽州地区（今安徽黄山、江西婺源、浙江淳安一带），以其独特的烹饪技法和浓郁的地方风味而著称。主要流派：</p><ul className="list-disc pl-5 mt-2 space-y-1"><li><b>皖南菜</b>：以徽州地区为代表，擅长烧、炖、蒸，讲究火功。</li><li><b>沿江菜</b>：以合肥、芜湖为代表，擅长烹制河鲜、家禽。</li><li><b>沿淮菜</b>：以蚌埠、宿州为代表，口味咸辣，具有北方风味。</li></ul></>,
            features: <><p><b>技法</b>：擅长烧、炖、蒸，讲究火功，注重“重油、重色”，以保持菜肴的原汁原味。</p><p><b>口味</b>：咸鲜为主，突出本味，讲究“咸中带甜，甜中带鲜”。</p><p><b>食材</b>：多用山珍野味，如石鸡、甲鱼、火腿、竹笋、香菇等，并善于运用火腿提鲜。</p></>
            ,classicDishes: [
                { name: '臭鳜鱼', description: '徽州传统名菜，将新鲜鳜鱼用淡盐水腌渍，肉质醇厚入味，闻起来臭，吃起来香，是徽菜的代表作。', imageHint: 'stinky mandarin fish' },
                { name: '毛豆腐', description: '徽州特色小吃，通过人工发酵，使豆腐表面生长出一层白色茸毛，煎制后外皮酥脆，内部鲜嫩。', imageHint: 'hairy tofu' },
                { name: '符离集烧鸡', description: '安徽宿州名产，属沿淮菜，色泽金黄，肉烂脱骨，肥而不腻，嚼骨而有余香。', imageHint: 'fuliji roast chicken' }
            ]
        }
    },
    'en': {
        lu: {
            id: 'lu', name: 'Lu (Shandong)', tagline: 'Head of Northern Cuisines, Foundation of Imperial Dishes',
            origin: <><p>Lu cuisine is the most historic and technically rich among the Eight Great Cuisines, originating from the states of Qi and Lu (modern Shandong) during the Spring and Autumn Period. It's deeply influenced by the Confucian ideal of "never tire of fine food."</p><ul className="list-disc pl-5 mt-2 space-y-1"><li><b>Jinan Style</b>: Excels in clear soup and milky soup dishes, with a rich and mellow taste.</li><li><b>Jiaodong Style</b>: Focuses on seafood, emphasizing freshness with a light and savory flavor.</li><li><b>Confucius Mansion Style</b>: The epitome of "official" cuisine, elaborate and ceremonial.</li></ul></>,
            features: <><p><b>Techniques</b>: Masterful in 'bao' (quick frying), 'chao' (stir-frying), and 'pa' (braising). Known for its superior soups (clear and milky).</p><p><b>Flavor</b>: Predominantly salty and savory, with a hint of sauce fragrance. It emphasizes the natural taste of ingredients.</p><p><b>Ingredients</b>: Utilizes seafood from the Shandong Peninsula and inland produce like scallions and ginger.</p></>,
            classicDishes: [
                { name: 'Nine-Turn Large Intestine', description: 'A masterpiece of Jinan cuisine, involving multiple complex steps to cook pork intestine, resulting in a dish that is soft, flavorful, and combines sweet, sour, fragrant, spicy, and salty tastes.', imageHint: 'braised pork intestines' },
                { name: 'Braised Sea Cucumber with Scallion', description: 'A Jiaodong classic, this dish slowly braises sea cucumber with scallion-infused oil, making it tender and fragrant.', imageHint: 'braised sea cucumber' },
                { name: 'Dezhou Braised Chicken', description: 'A famous Shandong dish where the chicken is so tender the meat falls off the bone, with a rich, savory flavor.', imageHint: 'braised chicken' }
            ]
        },
        chuan: {
            id: 'chuan', name: 'Chuan (Sichuan)', tagline: 'One Dish, One Style; A Hundred Dishes, A Hundred Flavors',
            origin: <><p>Originating from the ancient Ba and Shu kingdoms (modern Sichuan and Chongqing), Chuan cuisine is famous for its bold flavors, developed to combat the humid climate. It's divided into three main schools:</p><ul className="list-disc pl-5 mt-2 space-y-1"><li><b>Shanghebang (Upper River)</b>: Centered in Chengdu, known for refined, multi-layered flavors.</li><li><b>Xiahebang (Lower River)</b>: Centered in Chongqing, famous for its intense, spicy "river and lake" style dishes like hotpot.</li><li><b>Xiaohebang (Small River)</b>: Centered in Zigong, characterized by fresh spiciness and rich flavors.</li></ul></>,
            features: <><p><b>Techniques</b>: Excels in stir-frying, quick-frying, and pickling. Known as the "king of seasonings."</p><p><b>Flavor</b>: Famous for its diverse flavor profiles, such as 'ma-la' (numbing and spicy), 'yu-xiang' (fish-fragrant), and 'gong-bao' (palace-protected).</p><p><b>Ingredients</b>: Makes extensive use of local ingredients like various chilies, Sichuan peppercorns, and pickled vegetables.</p></>,
            classicDishes: [
                { name: 'Mapo Tofu', description: 'A signature dish featuring soft tofu in a spicy sauce with minced beef, fermented broad beans, and Sichuan peppercorns, creating a numbing and fiery sensation.', imageHint: 'mapo tofu' },
                { name: 'Fish-Flavored Shredded Pork', description: 'A classic example of complex Sichuan flavors. Though it contains no fish, it mimics a traditional fish seasoning with a balance of sweet, sour, savory, and spicy notes.', imageHint: 'fish-flavored pork' },
                { name: 'Sichuan Hotpot', description: 'A communal meal where various ingredients are cooked in a simmering pot of spicy broth, a hallmark of Chongqing-style cuisine.', imageHint: 'sichuan hotpot' }
            ]
        },
        yue: {
            id: 'yue', name: 'Yue (Cantonese)', tagline: 'Eat in Guangzhou, Cook in Shunde',
            origin: <><p>Yue cuisine, from the Lingnan region, is renowned for its emphasis on freshness and natural flavors. It is the most internationally influential of the Eight Cuisines. It comprises three styles:</p><ul className="list-disc pl-5 mt-2 space-y-1"><li><b>Guangfu Style</b>: Light, fresh, and tender, excelling in steaming and poaching.</li><li><b>Chaozhou (Teochew) Style</b>: Known for seafood, delicate knife work, and savory marinades.</li><li><b>Hakka Style</b>: Hearty, savory dishes with an emphasis on the natural flavor of the ingredients.</li></ul></>,
            features: <><p><b>Techniques</b>: Focuses on methods that preserve the original taste of food, such as steaming, poaching, and double-boiling.</p><p><b>Flavor</b>: Emphasizes umami, with a clean, light, and crisp taste. Spices are used sparingly.</p><p><b>Ingredients</b>: Utilizes a vast range of ingredients, from prized seafood to various meats and vegetables, always prioritizing freshness.</p></>
            ,classicDishes: [
                { name: 'White Cut Chicken', description: 'A simple yet elegant dish where a whole chicken is poached in water, resulting in tender meat and smooth skin, served with a ginger-scallion dipping sauce.', imageHint: 'white cut chicken' },
                { name: 'Steamed Grouper', description: 'A testament to Cantonese emphasis on freshness. A live fish is steamed perfectly with ginger, scallions, and soy sauce to highlight its delicate flavor.', imageHint: 'steamed grouper fish' },
                { name: 'Pork with Preserved Mustard Greens', description: 'A classic Hakka dish where pork belly is steamed with preserved greens, resulting in a savory, melt-in-your-mouth texture.', imageHint: 'pork with preserved vegetable' }
            ]
        },
        su: {
            id: 'su', name: 'Su (Jiangsu)', tagline: 'Refined, Elegant, and Harmonious',
            origin: <><p>Su cuisine is known for its artistic presentation, delicate flavors, and emphasis on seasonal ingredients. It includes:</p><ul className="list-disc pl-5 mt-2 space-y-1"><li><b>Huaiyang Style</b>: Famous for its intricate knife work and light, fresh flavors; often served at state banquets.</li><li><b>Jinling Style</b>: Known for its duck dishes and a focus on braising and stewing.</li><li><b>Suxi Style</b>: Sweeter in taste, with an emphasis on seasonal ingredients.</li></ul></>,
            features: <><p><b>Techniques</b>: Excels in stewing, braising, and simmering. Intricate knife skills are a hallmark.</p><p><b>Flavor</b>: Balanced and slightly sweet, focusing on the umami of ingredients.</p><p><b>Ingredients</b>: Features fresh produce from rivers, lakes, and the sea.</p></>,
            classicDishes: [
                { name: 'Lion\'s Head Meatballs', description: 'Large, soft pork meatballs, either braised or steamed, known for their light and delicate texture.', imageHint: 'pork meatball soup' },
                { name: 'Sweet and Sour Mandarin Fish', description: 'A visually stunning dish where the fish is deboned, scored, deep-fried, and served with a sweet and sour sauce.', imageHint: 'sweet and sour fish' },
                { name: 'Salted Duck', description: 'A Nanjing specialty, this duck is brined and cooked to be tender, savory, and not greasy.', imageHint: 'saltwater duck' }
            ]
        },
        zhe: {
            id: 'zhe', name: 'Zhe (Zhejiang)', tagline: 'Fresh, Fragrant, Crisp, Tender',
            origin: <><p>Zhe cuisine is characterized by its fresh ingredients, delicate preparation, and beautiful presentation. It has three main styles:</p><ul className="list-disc pl-5 mt-2 space-y-1"><li><b>Hangzhou Style</b>: Light and refreshing, often with a hint of sweetness.</li><li><b>Ningbo Style</b>: Salty and savory, with a focus on fresh seafood.</li><li><b>Shaoxing Style</b>: Utilizes local ingredients like fermented vegetables and rice wine.</li></ul></>,
            features: <><p><b>Techniques</b>: Known for quick stir-frying, steaming, and braising to retain texture.</p><p><b>Flavor</b>: Emphasizes freshness and a clean, crisp mouthfeel.</p><p><b>Ingredients</b>: Abundant use of seasonal vegetables, freshwater fish, and seafood.</p></>,
            classicDishes: [
                { name: 'West Lake Fish in Vinegar Gravy', description: 'A famous Hangzhou dish, poached fish is served with a delicate sweet and sour black vinegar sauce.', imageHint: 'west lake fish' },
                { name: 'Fish with Pickled Cabbage', description: 'A savory and tangy soup with tender fish fillets and pickled mustard greens.', imageHint: 'fish with pickled vegetable' },
                { name: 'Beggar\'s Chicken', description: 'A whole chicken stuffed, wrapped in lotus leaves and clay, then slow-baked, resulting in extremely tender and aromatic meat.', imageHint: 'beggars chicken' }
            ]
        },
        min: {
            id: 'min', name: 'Min (Fujian)', tagline: 'King of Soups, Pinnacle of Seafood',
            origin: <><p>Min cuisine is known for its emphasis on soups and broths, as well as its precise use of seasonings. The main styles are:</p><ul className="list-disc pl-5 mt-2 space-y-1"><li><b>Fuzhou Style</b>: Sweet and sour, with a focus on umami-rich broths.</li><li><b>Minnan Style</b>: Utilizes a variety of spices and sauces, including satay and shrimp paste.</li><li><b>Minxi Style</b>: Features mountain delicacies with a savory and sometimes spicy flavor.</li></ul></>,
            features: <><p><b>Techniques</b>: Expert in simmering, stewing, and steaming. Known for its "drunken" method using fermented rice wine.</p><p><b>Flavor</b>: A complex blend of sweet, sour, savory, and umami. Soups are a central part of the cuisine.</p><p><b>Ingredients</b>: A wide variety of seafood and mountain ingredients.</p></>,
            classicDishes: [
                { name: 'Buddha Jumps Over the Wall', description: 'A legendary, complex soup made with dozens of high-end ingredients like abalone, sea cucumber, and shark fin, simmered for hours.', imageHint: 'abalone soup' },
                { name: 'Lychee Pork', description: 'Pork pieces are scored and fried to resemble lychee fruit, then coated in a sweet and sour sauce.', imageHint: 'lychee pork' },
                { name: 'Satay Noodles', description: 'A popular street food with noodles served in a rich, spicy satay soup, often with various toppings.', imageHint: 'satay noodles' }
            ]
        },
        xiang: {
            id: 'xiang', name: 'Xiang (Hunan)', tagline: 'Spicy, Aromatic, and Rich with Cured Meats',
            origin: <><p>Xiang cuisine is famous for its hot and spicy flavors, deep colors, and fresh aromas. Its main branches include:</p><ul className="list-disc pl-5 mt-2 space-y-1"><li><b>Xiang River Style</b>: Oily and intensely spicy, typical of Changsha and Hengyang.</li><li><b>Dongting Lake Style</b>: Specializes in freshwater fish and poultry.</li><li><b>Western Hunan Style</b>: Features cured and smoked meats with a unique, savory flavor.</li></ul></>,
            features: <><p><b>Techniques</b>: Skilled in stewing, smoking, curing, and stir-frying.</p><p><b>Flavor</b>: Known for its "gan-la" (dry-spicy) and "suan-la" (sour-spicy) flavor profiles. Dishes are bold and flavorful.</p><p><b>Ingredients</b>: Liberal use of chili peppers, garlic, shallots, and fermented soybeans.</p></>,
            classicDishes: [
                { name: 'Steamed Fish Head with Diced Chili', description: 'A fiery and flavorful dish where a large fish head is steamed and blanketed with a vibrant layer of chopped red and yellow chilies.', imageHint: 'steamed fish head' },
                { name: 'Mao\'s Braised Pork', description: 'A rich, savory pork belly dish braised in soy sauce and spices, famously beloved by Chairman Mao.', imageHint: 'braised pork belly' },
                { name: 'Dong\'an Chicken', description: 'A tangy and spicy chicken dish, poached and then stir-fried with chilies and vinegar.', imageHint: 'dong an chicken' }
            ]
        },
        hui: {
            id: 'hui', name: 'Hui (Anhui)', tagline: 'Heavy Oil, Deep Color, and Mastery of Heat',
            origin: <><p>Hui cuisine originates from the mountainous region of ancient Huizhou, known for its use of wild ingredients and precise control of heat. Styles include:</p><ul className="list-disc pl-5 mt-2 space-y-1"><li><b>Southern Anhui Style</b>: Emphasizes braising, stewing, and the use of local mountain herbs.</li><li><b>Yangtze River Style</b>: Focuses on freshwater fish and poultry.</li><li><b>Huai River Style</b>: Has a saltier, more savory flavor profile.</li></ul></>,
            features: <><p><b>Techniques</b>: Masterful in braising and stewing, with a strong emphasis on "huo-gong" (fire control).</p><p><b>Flavor</b>: Savory and rich, often with complex aromas from fermented ingredients.</p><p><b>Ingredients</b>: Makes extensive use of local mountain delicacies, bamboo shoots, and cured meats like ham to enhance flavor.</p></>
            ,classicDishes: [
                { name: 'Stinky Mandarin Fish', description: 'A famous dish where mandarin fish is lightly fermented before being braised, resulting in a strong aroma but a wonderfully savory and tender meat.', imageHint: 'stinky mandarin fish' },
                { name: 'Hairy Tofu', description: 'A unique local specialty where tofu is fermented until it grows a layer of white, edible mycelium, then pan-fried until golden.', imageHint: 'hairy tofu' },
                { name: 'Fuliji Roast Chicken', description: 'A well-known dish from northern Anhui, where chicken is roasted to perfection, with crispy skin and tender meat.', imageHint: 'fuliji roast chicken' }
            ]
        }
    }
};


export default function EightCuisinesPage() {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageKey>('zh-CN');

  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      const browserLang: LanguageKey = navigator.language.toLowerCase().startsWith('zh') ? 'zh-CN' : 'en';
      setCurrentLanguage(browserLang);
    }
  }, []);

  const t = useMemo(() => translations[currentLanguage], [currentLanguage]);
  const currentCuisineData = useMemo(() => Object.values(cuisineData[currentLanguage]), [currentLanguage]);

  const allClassicDishes = useMemo(() => currentCuisineData.flatMap(c => c.classicDishes), [currentCuisineData]);
  
  const getImageData = (imageHint: string) => {
    return (placeholderImageData as Record<string, { seed: number; hint: string }>)[imageHint.replace(/\s+/g, '')] || { seed: Math.floor(Math.random() * 1000), hint: 'food' };
  };

  const getSummaryData = () => {
    return currentCuisineData.map(c => {
        let flavor, ingredients, technique, label;
        if (c.id === 'lu') { flavor = '咸鲜醇厚'; ingredients = '海鲜、葱、姜'; technique = '爆、扒、烧'; label = '官府气派'; }
        else if (c.id === 'chuan') { flavor = '麻辣多变'; ingredients = '辣椒、花椒、豆瓣'; technique = '炒、煸、腌'; label = '百菜百味'; }
        else if (c.id === 'yue') { flavor = '清鲜嫩滑'; ingredients = '海鲜、禽类、时蔬'; technique = '蒸、灼、烤'; label = '食不厌精'; }
        else if (c.id === 'su') { flavor = '咸甜适中'; ingredients = '河鲜、湖鲜、时蔬'; technique = '炖、焖、煨'; label = '文人雅致'; }
        else if (c.id === 'zhe') { flavor = '清鲜爽脆'; ingredients = '海鲜、竹笋、禽类'; technique = '炒、炸、烩'; label = '清新淡雅'; }
        else if (c.id === 'min') { flavor = '酸甜鲜香'; ingredients = '海鲜、山珍、红糟'; technique = '煨、糟、蒸'; label = '汤菜之王'; }
        else if (c.id === 'xiang') { flavor = '香辣腊味'; ingredients = '辣椒、腊肉、豆豉'; technique = '煨、炒、腊'; label = '火辣奔放'; }
        else if (c.id === 'hui') { flavor = '咸鲜重火'; ingredients = '山珍、火腿、笋'; technique = '烧、炖、熏'; label = '山野本味'; }
        
        return { cuisine: c.name.split(' ')[0], flavor, ingredients, technique, label };
    });
  };

  const summaryData = getSummaryData();

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground py-10 px-4 sm:px-8 items-center">
      <header className="w-full max-w-6xl mb-8 self-center">
        <Link href="/kitchen" passHref>
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t.backButton}
          </Button>
        </Link>
      </header>
      
      <main className="w-full max-w-6xl flex flex-col items-center">
        <div className="text-center mb-12">
            <ChefHat className="w-16 h-16 text-primary mb-4 mx-auto" />
            <h1 className="text-3xl sm:text-4xl font-headline font-bold text-primary mb-3">
              {t.pageTitle}
            </h1>
            <p className="text-muted-foreground text-base max-w-2xl">
              {t.pageDescription}
            </p>
        </div>

        <div className="w-full space-y-20">
            {currentCuisineData.map((cuisine, index) => (
                <div key={cuisine.id} className="space-y-8">
                   <Card className="shadow-lg bg-card/60 backdrop-blur-sm">
                       <CardHeader>
                            <CardTitle className="flex items-center text-3xl font-bold text-primary">
                                <Utensils className="mr-4 h-8 w-8"/>{cuisine.name}
                            </CardTitle>
                            <CardDescription className="text-lg italic text-muted-foreground">{cuisine.tagline}</CardDescription>
                       </CardHeader>
                       <CardContent className="space-y-6 text-base leading-relaxed">
                           <div>
                               <h3 className="flex items-center text-xl font-semibold mb-3"><BookOpen className="mr-2 h-5 w-5 text-primary/80"/>{t.originTitle}</h3>
                               <div className="prose prose-sm dark:prose-invert max-w-none text-foreground/90">{cuisine.origin}</div>
                           </div>
                           <Separator/>
                           <div>
                               <h3 className="flex items-center text-xl font-semibold mb-3"><Flame className="mr-2 h-5 w-5 text-primary/80"/>{t.featuresTitle}</h3>
                               <div className="prose prose-sm dark:prose-invert max-w-none text-foreground/90">{cuisine.features}</div>
                           </div>
                       </CardContent>
                   </Card>
                   
                   <div className="space-y-4">
                        <h3 className="text-center text-xl font-semibold flex items-center justify-center"><Star className="mr-2 h-5 w-5 text-amber-500"/>{t.dishesTitle}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {cuisine.classicDishes.map(dish => {
                                const imageData = getImageData(dish.imageHint);
                                return (
                                <Card key={dish.name} className="flex flex-col h-full overflow-hidden shadow-md hover:shadow-xl transition-shadow">
                                    <div className="relative aspect-video w-full">
                                        <Image src={`https://picsum.photos/seed/${imageData.seed}/600/400`} alt={dish.name} fill className="object-cover" data-ai-hint={imageData.hint}/>
                                    </div>
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-lg">{dish.name}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex-grow">
                                        <p className="text-sm text-muted-foreground">{dish.description}</p>
                                    </CardContent>
                                </Card>
                            )})}
                        </div>
                   </div>
                   {index < currentCuisineData.length - 1 && <Separator className="my-20 !mt-20" />}
                </div>
            ))}
            
            <Separator className="my-20" />

            <div className="space-y-8">
                <h2 className="text-center text-3xl font-bold text-primary flex items-center justify-center"><Map className="mr-4 h-8 w-8"/>{t.summaryTitle}</h2>
                <Card className="shadow-lg">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{t.tableHeaders.cuisine}</TableHead>
                                <TableHead>{t.tableHeaders.flavor}</TableHead>
                                <TableHead className="hidden sm:table-cell">{t.tableHeaders.ingredients}</TableHead>
                                <TableHead className="hidden md:table-cell">{t.tableHeaders.technique}</TableHead>
                                <TableHead className="text-right">{t.tableHeaders.label}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {summaryData.map(item => (
                                <TableRow key={item.cuisine}>
                                    <TableCell className="font-semibold">{item.cuisine}</TableCell>
                                    <TableCell>{item.flavor}</TableCell>
                                    <TableCell className="hidden sm:table-cell">{item.ingredients}</TableCell>
                                    <TableCell className="hidden md:table-cell">{item.technique}</TableCell>
                                    <TableCell className="text-right">{item.label}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>
            </div>
        </div>
      </main>
    </div>
  );
}

