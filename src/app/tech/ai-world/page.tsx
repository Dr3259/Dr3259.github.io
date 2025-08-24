
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, BrainCircuit } from 'lucide-react';
import Image from 'next/image';

const translations = {
  'zh-CN': {
    pageTitle: 'AI 世界',
    pageSubtitle: '探索全球顶尖AI公司的旗舰产品',
    backButton: '返回科技主页',
    productsBy: (company: string) => `${company} 的产品`,
    companies: {
        google: {
            name: 'Google',
            products: [
                { name: 'Gemini Family', description: '谷歌最强大的多模态大模型家族，包括Pro、Flash和Advanced版本。' },
                { name: 'Gemma', description: '基于Gemini研究和技术构建的轻量级、一流的开放模型系列。' },
                { name: 'Vertex AI', description: '一个统一的AI平台，用于构建、部署和扩展机器学习模型。' },
            ]
        },
        openai: {
            name: 'OpenAI',
            products: [
                { name: 'GPT Series (3.5, 4, 4o)', description: '业界领先的语言模型，驱动了ChatGPT和众多API应用。' },
                { name: 'Sora', description: '一个能够根据文本指令创建逼真和富有想象力场景的AI模型。' },
                { name: 'DALL·E 3', description: '先进的图像生成模型，能够理解复杂的提示词并生成高质量图片。' },
            ]
        },
        anthropic: {
            name: 'Anthropic',
            products: [
                { name: 'Claude 3 Family', description: '一系列模型（Haiku, Sonnet, Opus），在性能、速度和成本之间取得平衡。' },
                { name: 'Constitutional AI', description: '一种训练方法，旨在使AI系统更有帮助、更无害、更诚实。' },
            ]
        },
    }
  },
  'en': {
    pageTitle: 'AI World',
    pageSubtitle: 'Explore flagship products from top global AI companies',
    backButton: 'Back to Tech Home',
    productsBy: (company: string) => `Products by ${company}`,
     companies: {
        google: {
            name: 'Google',
            products: [
                { name: 'Gemini Family', description: 'Google\'s most capable multimodal models, including Pro, Flash, and Advanced.' },
                { name: 'Gemma', description: 'A family of lightweight, state-of-the-art open models built from Gemini research.' },
                { name: 'Vertex AI', description: 'A unified AI platform to build, deploy, and scale machine learning models.' },
            ]
        },
        openai: {
            name: 'OpenAI',
            products: [
                { name: 'GPT Series (3.5, 4, 4o)', description: 'Industry-leading language models that power ChatGPT and numerous API applications.' },
                { name: 'Sora', description: 'An AI model that can create realistic and imaginative scenes from text instructions.' },
                { name: 'DALL·E 3', description: 'An advanced image generation model that understands complex prompts to create high-quality pictures.' },
            ]
        },
        anthropic: {
            name: 'Anthropic',
            products: [
                { name: 'Claude 3 Family', description: 'A series of models (Haiku, Sonnet, Opus) balancing intelligence, speed, and cost.' },
                { name: 'Constitutional AI', description: 'A training approach to make AI systems helpful, harmless, and honest.' },
            ]
        },
    }
  }
};

type LanguageKey = keyof typeof translations;

export default function AiWorldPage() {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageKey>('zh-CN');

  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      const browserLang: LanguageKey = navigator.language.toLowerCase().startsWith('zh') ? 'zh-CN' : 'en';
      setCurrentLanguage(browserLang);
    }
  }, []);
  
  const t = useMemo(() => translations[currentLanguage], [currentLanguage]);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground py-8 sm:py-12 px-4 items-center">
      <header className="w-full max-w-4xl mb-6 sm:mb-8 self-center">
        <Link href="/tech" passHref>
            <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t.backButton}
            </Button>
        </Link>
      </header>

      <main className="w-full max-w-4xl flex flex-col items-center gap-8">
        <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-headline font-semibold text-primary mb-1">
            {t.pageTitle}
            </h1>
            <p className="text-muted-foreground">{t.pageSubtitle}</p>
        </div>

        <div className="w-full space-y-12">
           {Object.values(t.companies).map((company) => (
             <section key={company.name}>
                <h2 className="flex items-center text-2xl font-semibold text-foreground mb-4">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center mr-3 text-lg font-bold text-foreground">
                        {company.name.charAt(0)}
                    </div>
                    {t.productsBy(company.name)}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {company.products.map((product) => (
                        <Card key={product.name} className="flex flex-col bg-card/60 backdrop-blur-lg hover:shadow-xl transition-shadow duration-300">
                           <CardHeader>
                             <CardTitle className="flex items-center text-lg">
                                <BrainCircuit className="h-5 w-5 mr-3 text-primary/80 shrink-0" />
                                <span className="flex-1">{product.name}</span>
                             </CardTitle>
                           </CardHeader>
                           <CardContent className="flex-grow">
                             <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>
                           </CardContent>
                        </Card>
                    ))}
                </div>
             </section>
           ))}
        </div>
      </main>
    </div>
  );
}
