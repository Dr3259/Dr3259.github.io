"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Leaf, CookingPot, ChefHat, Star, Utensils, Lightbulb, Scale, BookOpen, ShieldAlert, Globe, Wind, Sun, Sprout, HeartHandshake } from 'lucide-react';
import { cn } from '@/lib/utils';
import placeholderImageData from '@/lib/placeholder-images.json';
import { Badge } from '@/components/ui/badge';

const translations = {
  'zh-CN': {
    pageTitle: '全球香料实用使用指南',
    pageDescription: '探索香料的“风味密码”，兼顾调味艺术与“药食同源”的智慧。',
    backButton: '返回厨房',
    tabChinese: '中式传统',
    tabEuropean: '欧美草本',
    tabSoutheastAsian: '东南亚辛香',
    tabMiddleEastern: '中东/印度',
    tabTips: '核心注意',
    tabFusion: '融合案例',
    cardLabels: {
        features: '核心特点',
        preprocessing: '预处理与用法',
        compatibleFood: '适配食材',
        pairingSuggestion: '搭配建议',
        efficacy: '中药功效 (药食同源)',
        contraindications: '忌口人群 (症状)',
    },
    tips: {
        title: '核心注意事项 (药食同源通用原则)',
        principle1Title: '“热性香料”控量',
        principle1Content: '桂皮、草果、孜然、南姜等性热/大热香料，秋冬可适量用（适合虚寒体质），夏季或上火时需减量，避免加重口干、咽痛、便秘等症状。',
        principle2Title: '“活血香料”避风险',
        principle2Content: '姜黄、白芷等有轻微活血作用，孕妇、经期量多者、有出血倾向（如胃溃疡出血）者需慎用或禁用。',
        principle3Title: '“药食同源”不替代药物',
        principle3Content: '香料调理仅针对“轻微不适”（如偶发胃寒腹胀、风寒感冒初期），若症状持续（如长期胃痛、咳嗽），需及时就医，不可依赖香料治疗。',
        principle4Title: '过敏与体质适配',
        principle4Content: '首次尝试国际香料（如迷迭香、罗勒）时，先少量试用，观察是否出现皮肤瘙痒、肠胃不适等过敏反应；过敏体质者需格外注意。',
        principle5Title: '特殊人群咨询专业人士',
        principle5Content: '慢性病患者（高血压、糖尿病、肾病）、孕妇、哺乳期女性、儿童使用任何带药性的香料前，建议咨询医生或中医师。'
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
    pageTitle: 'Global Spice Guide',
    pageDescription: 'Explore flavor codes, blending culinary art with the wisdom of food as medicine.',
    backButton: 'Back to Kitchen',
    tabChinese: 'Chinese Classics',
    tabEuropean: 'European Herbs',
    tabSoutheastAsian: 'Southeast Asian',
    tabMiddleEastern: 'Mid-East/Indian',
    tabTips: 'Core Precautions',
    tabFusion: 'Fusion Cases',
    cardLabels: {
        features: 'Core Features',
        preprocessing: 'Prep & Usage',
        compatibleFood: 'Compatible Foods',
        pairingSuggestion: 'Pairing Suggestions',
        efficacy: 'Medicinal Properties',
        contraindications: 'Contraindications',
    },
    tips: {
        title: 'Core Precautions (Food as Medicine Principles)',
        principle1Title: 'Control "Warming" Spices',
        principle1Content: 'Spices like Cassia, Caoguo, Cumin, and Galangal are warming. Use moderately in autumn/winter, but reduce in summer or if you have "heat" symptoms to avoid aggravation.',
        principle2Title: 'Avoid Risks with "Blood-Activating" Spices',
        principle2Content: 'Turmeric, Angelica root, etc., have mild blood-activating effects. Pregnant women, those with heavy periods, or bleeding tendencies should use with caution or avoid.',
        principle3Title: 'Food as Medicine Is Not a Substitute for Drugs',
        principle3Content: 'Spices are for mild discomforts. For persistent symptoms (chronic stomach pain, cough), see a doctor. Do not rely on spices for treatment.',
        principle4Title: 'Allergies & Body Constitution',
        principle4Content: 'When trying new herbs, test a small amount first. Watch for allergic reactions. Those with allergic constitutions should be extra cautious.',
        principle5Title: 'Consult Professionals for Special Groups',
        principle5Content: 'Individuals with chronic diseases, pregnant or breastfeeding women, and children should consult a doctor before using medicinal spices.'
    },
    fusion: {
      title: 'Cross-Cuisine Fusion Cases',
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
        { id: 'starAnise', name: '八角', features: '甘香微甜，香气醇厚', preprocessing: '整颗用，卤前温水泡10分钟', compatibleFood: '猪肉、牛肉、羊肉、禽类', pairingSuggestion: '桂皮、香叶、小茴香', efficacy: '性温，归肝、肾、脾经；温中散寒、理气止痛、和胃止呕；可辅助缓解胃寒呕吐、脘腹冷痛', contraindications: '阴虚火旺者（口干舌燥、手足心热）忌用；风热感冒、发烧者慎用' },
        { id: 'sichuanPepper', name: '花椒', features: '辛香带麻，层次丰富', preprocessing: '干用或炝油（六成热油温）', compatibleFood: '川菜、牛肉、羊肉、豆制品', pairingSuggestion: '辣椒、孜然、生姜', efficacy: '性温，归脾、胃、肾经；温中止痛、杀虫止痒、除湿；可辅助缓解寒湿泄泻、胃寒腹痛', contraindications: '阴虚火旺者（牙龈肿痛、便秘）忌用；孕妇慎用（过量可能刺激子宫）；热性皮肤病（湿疹、痤疮）患者慎用' },
        { id: 'cassia', name: '桂皮', features: '辛香微甜，香味持久', preprocessing: '整段用，敲碎易出味', compatibleFood: '猪肉、牛肉、卤味、甜品', pairingSuggestion: '八角、丁香、草果', efficacy: '性大热，归肾、脾、心、肝经；补火助阳、散寒止痛、温经通脉；可辅助缓解肾阳不足、腰膝冷痛', contraindications: '阴虚火旺者（潮热盗汗、口干咽燥）忌用；孕妇忌用（易致胎动不安）；高血压、上火者（口舌生疮）慎用' },
        { id: 'bayLeaf', name: '香叶', features: '淡辛香，提味不抢镜', preprocessing: '直接用，1-2片即可', compatibleFood: '所有肉类、卤菜、炖菜', pairingSuggestion: '八角、桂皮、花椒', efficacy: '性温，归肺、脾、肝经；祛风除湿、行气止痛、散寒；可辅助缓解风湿痹痛、脘腹胀痛', contraindications: '阴虚火旺者慎用；气虚体弱、易疲劳者不宜过量' },
        { id: 'caoguo', name: '草果', features: '浓烈辛辣，祛腥力强', preprocessing: '去籽用，拍裂出味', compatibleFood: '牛肉、羊肉、内脏', pairingSuggestion: '白芷、生姜、陈皮', efficacy: '性热，归脾、胃经；燥湿温中、截疟除痰；可辅助缓解寒湿内阻、脘腹胀痛、疟疾', contraindications: '阴虚火旺者（口干、便秘）忌用；孕妇慎用；热性咳嗽（黄痰、咽痛）患者忌用' },
        { id: 'chenpi', name: '陈皮', features: '辛苦带果香，解腻增香', preprocessing: '泡软刮白瓤', compatibleFood: '炖肉、甜品', pairingSuggestion: '生姜、红枣、红豆', efficacy: '性温，归肺、脾经；理气健脾、燥湿化痰；可辅助缓解脾胃气滞（腹胀、食欲不振）、湿痰咳嗽', contraindications: '阴虚燥咳者（干咳无痰、咽干口燥）慎用；舌红少津、内有实热（发烧、便秘）者不宜过量' },
        { id: 'cuminChinese', name: '孜然（中式）', features: '香辣浓郁，异域感强', preprocessing: '炒香磨粉', compatibleFood: '烧烤、羊肉', pairingSuggestion: '辣椒、羊肉、洋葱', efficacy: '性热，归肝、胃经；散寒止痛、理气和胃；可辅助缓解胃寒腹痛、消化不良、风湿痹痛', contraindications: '阴虚火旺者（口干、长痘）忌用；夏季炎热时慎用；便秘、痔疮患者慎用' },
        { id: 'perilla', name: '紫苏', features: '辛香清新，祛腥解腻', preprocessing: '鲜用或干泡', compatibleFood: '鱼类、螃蟹、田螺', pairingSuggestion: '辣椒、大蒜、生姜', efficacy: '性温，归肺、脾经；解表散寒、行气和胃、安胎；可辅助缓解风寒感冒、妊娠呕吐、鱼蟹中毒', contraindications: '风热感冒者（发热、黄痰）忌用；气虚表虚者（易出汗、乏力）慎用' },
        { id: 'mint', name: '薄荷', features: '辛香清凉，提神解腻', preprocessing: '鲜用或泡水', compatibleFood: '饮品、甜肴', pairingSuggestion: '柠檬、青柠、巧克力', efficacy: '性凉，归肺、肝经；疏散风热、清利头目、利咽；可辅助缓解风热感冒、头痛、咽喉肿痛', contraindications: '脾胃虚寒者（腹泻、怕冷）忌用；孕妇慎用；气虚自汗者（一动就出汗）慎用' },
        { id: 'gardenia', name: '黄栀子', features: '微苦，天然黄色色素', preprocessing: '敲裂泡水调色', compatibleFood: '卤菜、炖菜', pairingSuggestion: '八角、桂皮、酱油', efficacy: '性寒，归心、肝、肺、胃、三焦经；泻火除烦、清热利湿、凉血解毒；可辅助缓解热病心烦、湿热黄疸', contraindications: '脾胃虚寒者（腹痛、腹泻）忌用；阳虚体质者（怕冷、手脚冰凉）慎用' },
        { id: 'monkFruit', name: '罗汉果', features: '味甜，天然甜味剂', preprocessing: '敲开煮水', compatibleFood: '卤菜、甜汤', pairingSuggestion: '雪梨、百合、卤料包', efficacy: '性凉，归肺、大肠经；清热润肺、利咽开音、滑肠通便；可辅助缓解肺热燥咳、咽痛失声、便秘', contraindications: '脾胃虚寒者（腹泻、便溏）忌用；风寒感冒咳嗽者（白痰、怕冷）慎用' },
        { id: 'licorice', name: '甘草', features: '味甜，调和卤味口感', preprocessing: '切片用', compatibleFood: '卤水、腌制品', pairingSuggestion: '八角、桂皮、陈皮', efficacy: '性平，归心、肺、脾、胃经；补脾益气、清热解毒、调和诸药；可辅助缓解脾胃虚弱、心悸气短', contraindications: '湿盛胀满者（腹胀、舌苔厚腻）忌用；长期过量食用可能导致水钠潴留（水肿、血压升高）；糖尿病患者慎用' },
        { id: 'angelica', name: '白芷', features: '苦香辛凉，祛腥力强', preprocessing: '切片用', compatibleFood: '羊肉、鱼类', pairingSuggestion: '草果、生姜、花椒', efficacy: '性温，归胃、大肠、肺经；解表散寒、祛风止痛、宣通鼻窍；可辅助缓解风寒感冒、头痛、鼻塞', contraindications: '阴虚血热者（口干、牙龈出血）忌用；阴虚火旺者慎用；有光敏反应者（易晒黑、长斑）慎用' },
        { id: 'cardamomBlack', name: '砂仁', features: '浓烈芳香，增香解腻', preprocessing: '整粒用', compatibleFood: '荤菜、豆制品', pairingSuggestion: '草果、白芷、丁香', efficacy: '性温，归脾、胃、肾经；化湿开胃、温脾止泻、理气安胎；可辅助缓解湿浊中阻、脘腹胀满、妊娠呕吐', contraindications: '阴虚火旺者（口干、便秘）忌用；实热积滞者（腹痛、口臭）慎用' },
    ],
    european: [
      { id: 'rosemary', name: '迷迭香', features: '木质香+松针感，微苦', preprocessing: '取嫩枝烤用', compatibleFood: '羊肉、牛肉、鸡肉、土豆', pairingSuggestion: '橄榄油、大蒜、黑胡椒', efficacy: '性温，归肺、脾经；辅助提神醒脑、缓解疲劳；外用可辅助改善皮肤循环（需稀释）', contraindications: '高血压患者慎用（可能轻微升高血压）；孕妇慎用（传统认为可能刺激子宫）；过敏体质者（接触后皮肤发红）忌用' },
      { id: 'thyme', name: '百里香', features: '柔和花香+柠檬味', preprocessing: '取叶炖用', compatibleFood: '鸡肉、鱼肉、炖菜、奶油酱', pairingSuggestion: '洋葱、胡萝卜、奶油', efficacy: '性温，归肺、脾经；辅助解表散寒、止咳化痰；可缓解轻微风寒感冒、咳嗽痰多', contraindications: '阴虚火旺者（口干、咽痛）慎用；过敏体质者（接触后皮肤瘙痒）忌用' },
      { id: 'basil', name: '罗勒', features: '甜香带薄荷感，清新浓郁', preprocessing: '鲜用出锅前加', compatibleFood: '意大利菜、番茄、鸡肉、披萨', pairingSuggestion: '番茄、大蒜、橄榄油', efficacy: '性温，归肺、胃经；辅助理气和胃、缓解消化不良；可缓解轻微腹胀、食欲不振', contraindications: '脾胃虚寒者（腹泻、怕冷）慎用；过量可能导致失眠（含少量兴奋成分）' },
      { id: 'parsley', name: '欧芹', features: '清新芹菜香，脆嫩爽口', preprocessing: '不可久煮；适配沙拉、酱汁', compatibleFood: '沙拉、酱汁、海鲜、汤', pairingSuggestion: '柠檬、大蒜、黄油', efficacy: null, contraindications: null },
      { id: 'oregano', name: '牛至', features: '辛辣微苦，带茴香感', preprocessing: '干品香味更浓；适配重口味料理', compatibleFood: '披萨、意面、烤肉、番茄酱', pairingSuggestion: '番茄、大蒜、辣椒', efficacy: null, contraindications: null },
      { id: 'dill', name: '莳萝', features: '甜香带茴香，清爽解腻', preprocessing: '鲜用易蔫；适配腌三文鱼', compatibleFood: '三文鱼、黄瓜、酸奶酱、土豆', pairingSuggestion: '柠檬、酸奶、黄瓜', efficacy: null, contraindications: null },
    ],
    southeastAsian: [
      { id: 'lemongrass', name: '香茅', features: '浓烈柠檬香+草本涩感', preprocessing: '切段拍裂', compatibleFood: '海鲜、鸡肉、椰浆料理', pairingSuggestion: '南姜、柠檬叶、椰浆', efficacy: '性温，归肺、胃经；辅助祛风除湿、散寒止痛、开胃消食；可缓解轻微风湿痛、胃寒腹胀', contraindications: '阴虚火旺者（口干、便秘）慎用；皮肤敏感者（接触后可能刺激）忌用' },
      { id: 'galangal', name: '南姜', features: '辛辣带柑橘香，比生姜冲', preprocessing: '切片用；质地坚硬', compatibleFood: '泰式咖喱、海鲜', pairingSuggestion: '香茅、柠檬叶、鱼露', efficacy: '性温，归脾、胃经；辅助温中散寒、祛风止痛；可缓解轻微胃寒腹痛、风寒感冒', contraindications: '阴虚火旺者（口干、长痘）忌用；热性胃病患者（胃痛、反酸）慎用' },
      { id: 'kaffirLime', name: '柠檬叶', features: '强烈柠檬香，微苦', preprocessing: '撕碎用（叶脉香味浓）', compatibleFood: '椰香鸡汤、叻沙、虾仁', pairingSuggestion: '香茅、南姜、椰浆', efficacy: '性凉，归肺、胃经；辅助清热解暑、理气和胃；可缓解轻微暑热口渴、腹胀', contraindications: '脾胃虚寒者（腹泻、怕冷）慎用；过量可能导致肠胃不适' },
      { id: 'galangalAlt', name: '高良姜', features: '辛辣微甜，带樟木香气', preprocessing: '可替代部分生姜', compatibleFood: '沙爹、辣椒蟹', pairingSuggestion: '香茅、黄姜、辣椒', efficacy: null, contraindications: null },
      { id: 'pandan', name: '香兰叶', features: '清甜椰香，自带绿色', preprocessing: '包裹食材蒸煮或榨汁', compatibleFood: '甜品、米饭', pairingSuggestion: '椰浆、糯米、鸡肉', efficacy: null, contraindications: null },
    ],
    middleEastern: [
      { id: 'cuminMiddleEast', name: '孜然籽', features: '辛辣带坚果香，清新', preprocessing: '炒香研磨', compatibleFood: '中东烤肉、鹰嘴豆、咖喱', pairingSuggestion: '芫荽籽、小豆蔻、柠檬汁', efficacy: '性热，归肝、胃经；辅助散寒止痛、理气和胃；可缓解轻微胃寒腹痛、消化不良', contraindications: '阴虚火旺者（口干、便秘）忌用；夏季慎用；痔疮患者慎用' },
      { id: 'corianderSeed', name: '芫荽籽', features: '温和柑橘香+木质香', preprocessing: '与孜然是咖喱核心', compatibleFood: '豆类、鸡肉、咖喱', pairingSuggestion: '孜然、姜黄、辣椒', efficacy: null, contraindications: null },
      { id: 'turmeric', name: '姜黄', features: '微苦姜香，天然黄色色素', preprocessing: '粉用或鲜磨', compatibleFood: '咖喱、米饭、汤羹', pairingSuggestion: '黑胡椒、生姜、椰奶', efficacy: '性温，归肝、脾经；辅助行气活血、通经止痛；现代研究提示可辅助改善循环（需遵医嘱）', contraindications: '孕妇忌用（有活血作用，可能致胎动不安）；有出血倾向者（如凝血功能障碍）慎用；胆结石患者慎用' },
      { id: 'cardamom', name: '小豆蔻', features: '清新花香+柑橘香', preprocessing: '带壳使用', compatibleFood: '奶茶、甜点、米饭', pairingSuggestion: '肉桂、丁香、藏红花', efficacy: null, contraindications: null },
      { id: 'fenugreek', name: '葫芦巴籽', features: '微苦带烟熏香，类似枫糖味', preprocessing: '需提前浸泡去苦', compatibleFood: '咖喱、烤肉、面包', pairingSuggestion: '姜黄、孜然、芥末籽', efficacy: null, contraindications: null },
    ]
  },
  'en': {
    chinese: [
        { id: 'starAnise', name: 'Star Anise', features: 'Sweet & fragrant, full-bodied', preprocessing: 'Use whole, soak in warm water', compatibleFood: 'Pork, Beef, Lamb, Poultry', pairingSuggestion: 'Cassia, Bay Leaf, Fennel', efficacy: 'Warm; benefits liver, kidney, spleen; warms middle-jiao, dispels cold, regulates qi, stops pain.', contraindications: 'Avoid if yin-deficient with fire; caution during febrile colds.' },
        { id: 'sichuanPepper', name: 'Sichuan Pepper', features: 'Numbing & fragrant, complex', preprocessing: 'Use dry or infuse in hot oil', compatibleFood: 'Sichuan cuisine, Beef, Lamb, Tofu', pairingSuggestion: 'Chili, Cumin, Ginger', efficacy: 'Warm; benefits spleen, stomach, kidney; warms middle-jiao to stop pain, kills parasites, dispels dampness.', contraindications: 'Avoid if yin-deficient with fire; caution for pregnant women; caution for "hot" skin conditions.' },
        { id: 'cassia', name: 'Cassia / Cinnamon', features: 'Pungent & sweet, long-lasting', preprocessing: 'Use whole sticks, crush for flavor', compatibleFood: 'Pork, Beef, Braises, Desserts', pairingSuggestion: 'Star Anise, Cloves, Caoguo', efficacy: 'Very hot; benefits kidney, spleen, heart, liver; tonifies fire, assists yang, dispels cold, stops pain.', contraindications: 'Forbidden for pregnant women; caution for hypertension or "heat" symptoms.' },
        { id: 'bayLeaf', name: 'Bay Leaf', features: 'Mildly pungent, enhances flavor', preprocessing: 'Use dry, 1-2 leaves suffice', compatibleFood: 'All meats, Braises, Stews', pairingSuggestion: 'Star Anise, Cassia, Sichuan Pepper', efficacy: 'Warm; benefits lung, spleen, liver; dispels wind-damp, moves qi, stops pain.', contraindications: 'Caution for yin-deficient fire; not for excess use by those with qi deficiency.' },
        { id: 'caoguo', name: 'Caoguo (Black Cardamom)', features: 'Strongly pungent, de-fishing', preprocessing: 'Deseed, crush for flavor', compatibleFood: 'Beef, Lamb, Offal', pairingSuggestion: 'Angelica Root, Ginger, Chenpi', efficacy: 'Hot; benefits spleen, stomach; dries dampness, warms middle-jiao, checks malaria.', contraindications: 'Avoid if yin-deficient with fire; caution for pregnant women; avoid with "hot" cough.' },
        { id: 'chenpi', name: 'Dried Tangerine Peel', features: 'Bitter, fruity, cuts grease', preprocessing: 'Soak to soften, scrape pith', compatibleFood: 'Stews, Desserts', pairingSuggestion: 'Ginger, Jujube, Red Bean', efficacy: 'Warm; benefits lung, spleen; regulates qi, strengthens spleen, dries dampness, resolves phlegm.', contraindications: 'Caution for yin-deficient dry cough; not for excess use if you have internal heat.' },
        { id: 'cuminChinese', name: 'Cumin (Chinese)', features: 'Spicy & rich, exotic', preprocessing: 'Toast and grind', compatibleFood: 'BBQ, Lamb', pairingSuggestion: 'Chili, Lamb, Onion', efficacy: 'Hot; benefits liver, stomach; dispels cold, stops pain, regulates qi.', contraindications: 'Avoid if yin-deficient with fire; use with caution in summer; caution for constipation, hemorrhoids.' },
        { id: 'perilla', name: 'Perilla', features: 'Pungent & fresh, anti-fishy', preprocessing: 'Use fresh or soaked dry leaves', compatibleFood: 'Fish, Crab, Snails', pairingSuggestion: 'Chili, Garlic, Ginger', efficacy: 'Warm; benefits lung, spleen; releases exterior, dispels cold, moves qi, harmonizes stomach, calms fetus.', contraindications: 'Avoid with wind-heat cold; caution for qi-deficient exterior.' },
        { id: 'mint', name: 'Mint', features: 'Pungent & cooling, refreshing', preprocessing: 'Use fresh or in tea', compatibleFood: 'Drinks, Desserts', pairingSuggestion: 'Lemon, Lime, Chocolate', efficacy: 'Cool; benefits lung, liver; disperses wind-heat, clears head and eyes, benefits throat.', contraindications: 'Avoid if spleen/stomach are cold-deficient; caution for pregnant women; caution for qi-deficient spontaneous sweating.' },
        { id: 'gardenia', name: 'Gardenia Fruit', features: 'Slightly bitter, natural yellow dye', preprocessing: 'Crush and soak for color', compatibleFood: 'Braises, Stews', pairingSuggestion: 'Star Anise, Cassia, Soy Sauce', efficacy: 'Cold; benefits heart, liver, lung, stomach, triple-jiao; purges fire, clears heat, resolves dampness, cools blood.', contraindications: 'Avoid if spleen/stomach are cold-deficient; caution for yang-deficient constitution.' },
        { id: 'monkFruit', name: 'Monk Fruit', features: 'Sweet, natural sweetener', preprocessing: 'Break open and boil', compatibleFood: 'Braises, Soups', pairingSuggestion: 'Pear, Lily Bulb, Master Stock', efficacy: 'Cool; benefits lung, large intestine; clears heat, moistens lung, soothes throat, moves bowels.', contraindications: 'Avoid if spleen/stomach are cold-deficient; caution with wind-cold cough.' },
        { id: 'licorice', name: 'Licorice', features: 'Sweet, harmonizes flavors', preprocessing: 'Use slices', compatibleFood: 'Master stocks, Pickles', pairingSuggestion: 'Star Anise, Cassia, Chenpi', efficacy: 'Neutral; benefits heart, lung, spleen, stomach; tonifies spleen qi, clears heat, detoxifies, harmonizes other herbs.', contraindications: 'Avoid with severe dampness; long-term excess use may cause sodium/water retention; caution for diabetics.' },
        { id: 'angelica', name: 'Angelica Root', features: 'Bitter, pungent, cooling, anti-fishy', preprocessing: 'Use slices', compatibleFood: 'Lamb, Fish', pairingSuggestion: 'Caoguo, Ginger, Sichuan Pepper', efficacy: 'Warm; benefits stomach, large intestine, lung; releases exterior, dispels cold, relieves pain, opens nasal passages.', contraindications: 'Avoid if yin-deficient with blood-heat; caution if yin-deficient with fire; caution for photosensitivity.' },
        { id: 'cardamomBlack', name: 'Black Cardamom', features: 'Strongly aromatic, cuts grease', preprocessing: 'Use whole', compatibleFood: 'Rich meats, Beans', pairingSuggestion: 'Caoguo, Angelica Root, Cloves', efficacy: 'Warm; benefits spleen, stomach, kidney; transforms dampness, opens appetite, warms spleen, stops diarrhea, regulates qi, calms fetus.', contraindications: 'Avoid if yin-deficient with fire; caution with heat accumulation.' },
    ],
    european: [
      { id: 'rosemary', name: 'Rosemary', features: 'Woody, pine-like, slightly bitter', preprocessing: 'Use tender sprigs for roasting', compatibleFood: 'Lamb, Beef, Chicken, Potatoes', pairingSuggestion: 'Olive Oil, Garlic, Black Pepper', efficacy: '(Reference) Warm; benefits lung, spleen; may help improve focus, relieve fatigue; topical use may improve skin circulation (diluted).', contraindications: 'Caution for hypertension (may slightly raise blood pressure); caution for pregnant women; avoid if allergic (skin redness).' },
      { id: 'thyme', name: 'Thyme', features: 'Mild, floral & lemony', preprocessing: 'Use leaves in stews', compatibleFood: 'Chicken, Fish, Stews, Cream Sauces', pairingSuggestion: 'Onion, Carrot, Cream', efficacy: '(Reference) Warm; benefits lung, spleen; may help release exterior, stop cough, resolve phlegm for mild wind-cold conditions.', contraindications: 'Caution for yin-deficient fire (dry mouth, sore throat); avoid if allergic (skin itching).' },
      { id: 'basil', name: 'Basil', features: 'Sweet, peppery, fresh, rich', preprocessing: 'Add fresh leaves at the end', compatibleFood: 'Italian, Tomato, Chicken, Pizza', pairingSuggestion: 'Tomato, Garlic, Olive Oil', efficacy: '(Reference) Warm; benefits lung, stomach; may aid digestion, relieve bloating.', contraindications: 'Caution for those with cold-deficient spleen/stomach (diarrhea); excess may cause sleeplessness (contains mild stimulants).' },
      { id: 'parsley', name: 'Parsley', features: 'Fresh, grassy flavor', preprocessing: 'Add fresh at the end of cooking', compatibleFood: 'Salads, Sauces, Seafood, Soups', pairingSuggestion: 'Lemon, Garlic, Butter', efficacy: null, contraindications: null },
      { id: 'oregano', name: 'Oregano', features: 'Pungent & peppery', preprocessing: 'Dried is more potent', compatibleFood: 'Pizza, Pasta, Grilled Meats, Tomato Sauces', pairingSuggestion: 'Tomato, Garlic, Chili', efficacy: null, contraindications: null },
      { id: 'dill', name: 'Dill', features: 'Sweet, with a hint of anise', preprocessing: 'Fresh is best', compatibleFood: 'Salmon, Cucumbers, Yogurt Dips, Potatoes', pairingSuggestion: 'Lemon, Yogurt, Cucumber', efficacy: null, contraindications: null },
    ],
    southeastAsian: [
      { id: 'lemongrass', name: 'Lemongrass', features: 'Strong lemon aroma, herbal', preprocessing: 'Crush white stalk', compatibleFood: 'Seafood, Chicken, Coconut dishes', pairingSuggestion: 'Galangal, Kaffir Lime, Coconut Milk', efficacy: '(Reference) Warm; benefits lung, stomach; may help dispel wind-damp, relieve pain, promote digestion.', contraindications: 'Caution for yin-deficient fire (dry mouth, constipation); avoid if skin is sensitive.' },
      { id: 'galangal', name: 'Galangal', features: 'Pungent & citrusy, stronger than ginger', preprocessing: 'Slice; tough texture', compatibleFood: 'Thai Curries, Seafood', pairingSuggestion: 'Lemongrass, Kaffir Lime, Fish Sauce', efficacy: '(Reference) Warm; benefits spleen, stomach; may help warm middle-jiao, dispel cold for mild stomach cold-pain.', contraindications: 'Avoid if yin-deficient with fire (dry mouth, acne); caution for "hot" stomach conditions (acid reflux).' },
      { id: 'kaffirLime', name: 'Kaffir Lime Leaf', features: 'Intense lemon scent, slightly bitter', preprocessing: 'Tear fresh leaves', compatibleFood: 'Coconut Soups, Laksa, Shrimp', pairingSuggestion: 'Lemongrass, Galangal, Coconut Milk', efficacy: '(Reference) Cool; benefits lung, stomach; may help clear summer-heat, regulate qi.', contraindications: 'Caution for cold-deficient spleen/stomach (diarrhea); excess may cause stomach discomfort.' },
      { id: 'galangalAlt', name: 'Greater Galangal', features: 'Spicy, sweet, piney', preprocessing: 'Substitute for ginger', compatibleFood: 'Satay, Chili Crab', pairingSuggestion: 'Lemongrass, Turmeric, Chili', efficacy: null, contraindications: null },
      { id: 'pandan', name: 'Pandan Leaf', features: 'Sweet, coconut-like aroma', preprocessing: 'Wrap food or juice it', compatibleFood: 'Desserts, Rice', pairingSuggestion: 'Coconut Milk, Sticky Rice, Chicken', efficacy: null, contraindications: null },
    ],
    middleEastern: [
      { id: 'cuminMiddleEast', name: 'Cumin Seed', features: 'Pungent & nutty, fresher than powder', preprocessing: 'Toast and grind', compatibleFood: 'Middle Eastern BBQ, Hummus, Curries', pairingSuggestion: 'Coriander Seed, Cardamom, Lemon Juice', efficacy: '(Reference) Hot; benefits liver, stomach; may help dispel cold, stop pain, aid digestion.', contraindications: 'Avoid if yin-deficient with fire (dry mouth, constipation); use with caution in summer; caution for hemorrhoids.' },
      { id: 'corianderSeed', name: 'Coriander Seed', features: 'Mild citrus & woody flavor', preprocessing: 'Core of curry with cumin', compatibleFood: 'Beans, Chicken, Curries', pairingSuggestion: 'Cumin, Turmeric, Chili', efficacy: null, contraindications: null },
      { id: 'turmeric', name: 'Turmeric', features: 'Earthy, slightly bitter, yellow dye', preprocessing: 'Use powder or grate fresh', compatibleFood: 'Curries, Rice, Soups', pairingSuggestion: 'Black Pepper, Ginger, Coconut Milk', efficacy: '(Reference) Warm; benefits liver, spleen; may help move qi and blood, relieve pain. Modern studies suggest circulatory benefits (consult doctor).', contraindications: 'Forbidden for pregnant women (activates blood); caution for bleeding tendencies; caution for gallstones.' },
      { id: 'cardamom', name: 'Cardamom', features: 'Fresh, floral & citrusy', preprocessing: 'Use whole pods', compatibleFood: 'Chai, Desserts, Rice', pairingSuggestion: 'Cinnamon, Cloves, Saffron', efficacy: null, contraindications: null },
      { id: 'fenugreek', name: 'Fenugreek Seed', features: 'Bitter, smoky, maple-like', preprocessing: 'Soak to reduce bitterness', compatibleFood: 'Curries, Pickles, Breads', pairingSuggestion: 'Turmeric, Cumin, Mustard Seed', efficacy: null, contraindications: null },
    ]
  },
};

type LanguageKey = keyof typeof translations;
type SpiceCategoryKey = keyof typeof spiceData['en'];
type Spice = (typeof spiceData)['en']['chinese'][0] & { 
    compatibleFood: string;
    pairingSuggestion: string;
    efficacy?: string | null; 
    contraindications?: string | null 
};

const categoryIcons: Record<string, React.ElementType> = {
  chinese: CookingPot,
  european: Globe,
  southeastAsian: Leaf,
  middleEastern: Wind,
  tips: Lightbulb,
  fusion: Utensils,
};

const InfoRow: React.FC<{ icon: React.ElementType, label: string, content?: string | React.ReactNode, isUsage?: boolean }> = ({ icon: Icon, label, content }) => {
    if (!content) return null;

    const renderContent = () => {
        if (typeof content !== 'string') {
            return content;
        }
        if (content.includes('；')) {
            return content.split('；').map((part, index) => (
                <p key={index} className="[&:not(:first-child)]:mt-1.5">
                    {part.trim().replace(/（/g, ' (').replace(/）/g, ')')}
                </p>
            ));
        }
        return <p dangerouslySetInnerHTML={{ __html: content.replace(/（/g, ' (').replace(/）/g, ')').replace(/<br>/g, '') }} />;
    };

    return (
        <div>
            <h4 className="flex items-center text-sm font-semibold text-primary/80 mb-1.5">
                <Icon className="w-4 h-4 mr-2" />
                {label}
            </h4>
            <div className="text-xs text-muted-foreground pl-6 space-y-1">
              {renderContent()}
            </div>
        </div>
    );
};

const SpiceCard: React.FC<{ spice: Spice, labels: any }> = ({ spice, labels }) => {
    const {spices} = placeholderImageData as any;
    const imageData = spices[spice.id as keyof typeof spices];
    const imageUrl = `https://picsum.photos/seed/${imageData?.seed || 'spice'}/600/400`;

    return (
        <Card className="flex flex-col h-full bg-card/50 backdrop-blur-sm shadow-lg border-border/20 hover:border-primary/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
            <div className="relative aspect-[16/9] w-full">
                <Image
                    src={imageUrl}
                    alt={spice.name}
                    fill
                    className="object-cover"
                    data-ai-hint={imageData?.hint || 'spice'}
                />
            </div>
            <CardHeader>
                <CardTitle className="text-lg font-bold text-foreground">{spice.name}</CardTitle>
                <CardDescription>{spice.features}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow space-y-4 text-sm">
                <InfoRow icon={ChefHat} label={labels.preprocessing} content={spice.preprocessing} />
                <InfoRow 
                    icon={Sprout} 
                    label={labels.compatibleFood} 
                    content={<div className="flex flex-wrap gap-1.5">{spice.compatibleFood.split('、').map(food => <Badge key={food} variant="secondary">{food}</Badge>)}</div>}
                />
                <InfoRow 
                    icon={HeartHandshake}
                    label={labels.pairingSuggestion}
                    content={<div className="flex flex-wrap gap-1.5">{spice.pairingSuggestion.split('、').map(item => <Badge key={item} variant="outline">{item}</Badge>)}</div>}
                />
                {spice.efficacy && <InfoRow icon={BookOpen} label={labels.efficacy} content={spice.efficacy} />}
                {spice.contraindications && <InfoRow icon={ShieldAlert} label={labels.contraindications} content={spice.contraindications} />}
            </CardContent>
        </Card>
    );
}

const TipCard: React.FC<{ icon: React.ElementType; title: string; content: string; }> = ({ icon: Icon, title, content }) => (
    <Card className="bg-card/50 backdrop-blur-sm">
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
            <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6 mb-8 bg-card/60 backdrop-blur-md">
                <TabsTrigger value="chinese" className="flex items-center gap-2"><CookingPot className="w-4 h-4"/>{t.tabChinese}</TabsTrigger>
                <TabsTrigger value="european" className="flex items-center gap-2"><Globe className="w-4 h-4"/>{t.tabEuropean}</TabsTrigger>
                <TabsTrigger value="southeastAsian" className="flex items-center gap-2"><Leaf className="w-4 h-4"/>{t.tabSoutheastAsian}</TabsTrigger>
                <TabsTrigger value="middleEastern" className="flex items-center gap-2"><Wind className="w-4 h-4"/>{t.tabMiddleEastern}</TabsTrigger>
                <TabsTrigger value="tips" className="flex items-center gap-2"><Lightbulb className="w-4 h-4"/>{t.tabTips}</TabsTrigger>
                <TabsTrigger value="fusion" className="flex items-center gap-2"><Utensils className="w-4 h-4"/>{t.tabFusion}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="chinese">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {spiceData[currentLanguage].chinese.map((spice) => (
                     <SpiceCard key={spice.id} spice={spice as Spice} labels={t.cardLabels}/>
                  ))}
              </div>
            </TabsContent>
            
            <TabsContent value="european">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {spiceData[currentLanguage].european.map((spice) => (
                     <SpiceCard key={spice.id} spice={spice as Spice} labels={t.cardLabels}/>
                  ))}
              </div>
            </TabsContent>
            
            <TabsContent value="southeastAsian">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {spiceData[currentLanguage].southeastAsian.map((spice) => (
                     <SpiceCard key={spice.id} spice={spice as Spice} labels={t.cardLabels}/>
                  ))}
              </div>
            </TabsContent>
            
            <TabsContent value="middleEastern">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {spiceData[currentLanguage].middleEastern.map((spice) => (
                     <SpiceCard key={spice.id} spice={spice as Spice} labels={t.cardLabels}/>
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="tips">
                <Card className="bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-xl"><Lightbulb className="w-5 h-5 text-primary"/>{t.tips.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <TipCard icon={Scale} title={t.tips.principle1Title} content={t.tips.principle1Content} />
                        <TipCard icon={ShieldAlert} title={t.tips.principle2Title} content={t.tips.principle2Content} />
                        <TipCard icon={BookOpen} title={t.tips.principle3Title} content={t.tips.principle3Content} />
                        <TipCard icon={ChefHat} title={t.tips.principle4Title} content={t.tips.principle4Content} />
                        <TipCard icon={Star} title={t.tips.principle5Title} content={t.tips.principle5Content} />
                    </CardContent>
                </Card>
            </TabsContent>
            
            <TabsContent value="fusion">
                <Card className="bg-card/50 backdrop-blur-sm">
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
