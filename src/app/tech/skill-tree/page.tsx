
"use client";

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, GitFork, Code, Type, Wind, Framer, Component, Settings, Box, Database, Cloud, Users, Target, ClipboardList, TrendingUp, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


const translations = {
  'zh-CN': {
    pageTitle: '技能树',
    pageSubtitle: '探索不同领域的知识体系与成长路径。',
    backButton: '返回科技主页',
    fundamentals: '基础',
    frameworks: '框架',
    advanced: '高级概念',
    frontendTab: '前端开发',
    productTab: '产品管理',
    skills: {
      html: { name: 'HTML', desc: '网页内容的结构。' },
      css: { name: 'CSS', desc: '网页内容的样式。' },
      javascript: { name: 'JavaScript', desc: '实现网页交互性。' },
      typescript: { name: 'TypeScript', desc: '为JS添加静态类型。' },
      react: { name: 'React', desc: '用于构建用户界面的库。' },
      nextjs: { name: 'Next.js', desc: '生产级的React框架。' },
      vue: { name: 'Vue.js', desc: '渐进式JavaScript框架。' },
      angular: { name: 'Angular', desc: 'Web应用平台。' },
      styling: { name: '样式与UI库', desc: '如 Tailwind CSS 或 Sass。' },
      tooling: { name: '构建工具', desc: '如 Vite 或 Webpack。' },
      stateManagement: { name: '状态管理', desc: '如Redux或Zustand。' },
      backend: { name: '后端交互', desc: '与REST/GraphQL API通信。' },
      testing: { name: '测试', desc: '如Jest或Cypress。' },
    },
    productManagement: {
        discovery: '探索与验证',
        strategy: '策略与规划',
        execution: '执行与增长',
        skills: {
            marketResearch: { name: '市场研究', desc: '分析行业趋势与竞争格局。', icon: Globe },
            userPersonas: { name: '用户画像', desc: '定义和理解目标用户群体。', icon: Users },
            problemValidation: { name: '问题验证', desc: '确保你正在解决一个真实存在的问题。', icon: Target },
            roadmapping: { name: '产品路线图', desc: '规划产品的功能与发布节奏。', icon: GitFork },
            prds: { name: '需求文档 (PRD)', desc: '清晰地定义产品功能和需求。', icon: ClipboardList },
            prototyping: { name: '原型设计', desc: '使用工具如 Figma 创建产品原型。', icon: Framer },
            agile: { name: '敏捷开发', desc: '与工程团队高效协作。', icon: Settings },
            dataAnalysis: { name: '数据分析', desc: '使用数据驱动产品决策。', icon: TrendingUp },
            abTesting: { name: 'A/B 测试', desc: '通过实验优化产品功能。', icon: Component },
        }
    }
  },
  'en': {
    pageTitle: 'Skill Trees',
    pageSubtitle: 'Explore knowledge systems and growth paths in different fields.',
    backButton: 'Back to Tech Home',
    fundamentals: 'Fundamentals',
    frameworks: 'Frameworks',
    advanced: 'Advanced Concepts',
    frontendTab: 'Frontend Dev',
    productTab: 'Product Management',
    skills: {
      html: { name: 'HTML', desc: 'Structure of web content.' },
      css: { name: 'CSS', desc: 'Styling of web content.' },
      javascript: { name: 'JavaScript', desc: 'Enabling interactivity.' },
      typescript: { name: 'TypeScript', desc: 'Adds static typing to JS.' },
      react: { name: 'React', desc: 'A library for user interfaces.' },
      nextjs: { name: 'Next.js', desc: 'The React Framework for Production.' },
      vue: { name: 'Vue.js', desc: 'The Progressive JavaScript Framework.' },
      angular: { name: 'Angular', desc: 'Platform for web applications.' },
      styling: { name: 'Styling & UI Libraries', desc: 'e.g., Tailwind CSS or Sass.' },
      tooling: { name: 'Build Tools', desc: 'e.g., Vite or Webpack.' },
      stateManagement: { name: 'State Management', desc: 'e.g., Redux or Zustand.' },
      backend: { name: 'Backend Interaction', desc: 'Communicating with REST/GraphQL APIs.' },
      testing: { name: 'Testing', desc: 'e.g., Jest or Cypress.' },
    },
    productManagement: {
        discovery: 'Discovery & Validation',
        strategy: 'Strategy & Planning',
        execution: 'Execution & Growth',
        skills: {
            marketResearch: { name: 'Market Research', desc: 'Analyze industry trends and competition.', icon: Globe },
            userPersonas: { name: 'User Personas', desc: 'Define and understand the target audience.', icon: Users },
            problemValidation: { name: 'Problem Validation', desc: 'Ensure you are solving a real problem.', icon: Target },
            roadmapping: { name: 'Product Roadmapping', desc: 'Plan product features and release cycles.', icon: GitFork },
            prds: { name: 'PRD Writing', desc: 'Clearly define product features and requirements.', icon: ClipboardList },
            prototyping: { name: 'Prototyping', desc: 'Create product prototypes with tools like Figma.', icon: Framer },
            agile: { name: 'Agile Development', desc: 'Collaborate effectively with engineering teams.', icon: Settings },
            dataAnalysis: { name: 'Data Analysis', desc: 'Use data to drive product decisions.', icon: TrendingUp },
            abTesting: { name: 'A/B Testing', desc: 'Optimize features through experimentation.', icon: Component },
        }
    }
  }
};

type LanguageKey = keyof typeof translations;

interface SkillNodeProps {
  name: string;
  description: string;
  icon: React.ElementType;
  level: number;
}

const SkillNode: React.FC<SkillNodeProps> = ({ name, description, icon: Icon, level }) => (
  <div className="flex items-center gap-4 group">
    <div className={cn(
        "flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300",
        "group-hover:scale-110 group-hover:bg-primary/20 group-hover:border-primary/50",
        level === 0 ? "bg-primary/10 border-primary/30" : "bg-card border-border"
      )}>
      <Icon className={cn(
          "w-6 h-6 transition-colors",
          level === 0 ? "text-primary" : "text-muted-foreground group-hover:text-primary"
        )} />
    </div>
    <div>
      <h4 className="font-semibold text-foreground">{name}</h4>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  </div>
);

const Section: React.FC<{ title: string; children: React.ReactNode; isFirst?: boolean }> = ({ title, children, isFirst }) => (
  <div className="relative">
    {!isFirst && <div className="absolute left-6 top-[-40px] bottom-4 w-0.5 bg-border -translate-x-1/2" />}
    <div className="flex items-center gap-4 mb-6">
      <div className="w-12 h-1 text-lg font-bold text-primary" />
      <h3 className="text-xl font-bold text-primary tracking-wide">{title}</h3>
    </div>
    <div className="pl-6 ml-[22px] border-l border-dashed border-border/80">
      <div className="space-y-8 py-8">
        {children}
      </div>
    </div>
  </div>
);

export default function SkillTreePage() {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageKey>('en');

  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      const browserLang: LanguageKey = navigator.language.toLowerCase().startsWith('zh') ? 'zh-CN' : 'en';
      setCurrentLanguage(browserLang);
    }
  }, []);

  const t = useMemo(() => translations[currentLanguage], [currentLanguage]);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground py-10 px-4 sm:px-8 items-center">
      <header className="w-full max-w-4xl mb-8 self-center">
        <Link href="/tech" passHref>
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t.backButton}
          </Button>
        </Link>
      </header>

      <main className="w-full max-w-4xl flex flex-col items-center">
        <div className="text-center mb-12">
            <GitFork className="w-16 h-16 text-primary mb-4 mx-auto" />
            <h1 className="text-3xl sm:text-4xl font-headline font-bold text-primary mb-3">
            {t.pageTitle}
            </h1>
            <p className="text-muted-foreground text-base max-w-xl">
            {t.pageSubtitle}
            </p>
        </div>

        <Tabs defaultValue="frontend" className="w-full max-w-2xl">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="frontend">{t.frontendTab}</TabsTrigger>
                <TabsTrigger value="product">{t.productTab}</TabsTrigger>
            </TabsList>
            <TabsContent value="frontend" className="mt-8">
                 <div className="w-full">
                    <Section title={t.fundamentals} isFirst>
                        <SkillNode name={t.skills.html.name} description={t.skills.html.desc} icon={Code} level={0} />
                        <SkillNode name={t.skills.css.name} description={t.skills.css.desc} icon={Code} level={0} />
                        <SkillNode name={t.skills.javascript.name} description={t.skills.javascript.desc} icon={Code} level={0} />
                        <SkillNode name={t.skills.typescript.name} description={t.skills.typescript.desc} icon={Type} level={0} />
                    </Section>

                    <Section title={t.frameworks}>
                        <SkillNode name={t.skills.react.name} description={t.skills.react.desc} icon={Framer} level={1} />
                        <SkillNode name={t.skills.nextjs.name} description={t.skills.nextjs.desc} icon={Framer} level={1} />
                        <SkillNode name={t.skills.vue.name} description={t.skills.vue.desc} icon={Framer} level={1} />
                        <SkillNode name={t.skills.angular.name} description={t.skills.angular.desc} icon={Framer} level={1} />
                    </Section>
                    
                    <Section title={t.advanced}>
                        <SkillNode name={t.skills.styling.name} description={t.skills.styling.desc} icon={Wind} level={2} />
                        <SkillNode name={t.skills.tooling.name} description={t.skills.tooling.desc} icon={Settings} level={2} />
                        <SkillNode name={t.skills.stateManagement.name} description={t.skills.stateManagement.desc} icon={Box} level={2} />
                        <SkillNode name={t.skills.backend.name} description={t.skills.backend.desc} icon={Database} level={2} />
                        <SkillNode name={t.skills.testing.name} description={t.skills.testing.desc} icon={Component} level={2} />
                    </Section>
                </div>
            </TabsContent>
            <TabsContent value="product" className="mt-8">
                 <div className="w-full">
                    <Section title={t.productManagement.discovery} isFirst>
                        <SkillNode name={t.productManagement.skills.marketResearch.name} description={t.productManagement.skills.marketResearch.desc} icon={t.productManagement.skills.marketResearch.icon} level={0} />
                        <SkillNode name={t.productManagement.skills.userPersonas.name} description={t.productManagement.skills.userPersonas.desc} icon={t.productManagement.skills.userPersonas.icon} level={0} />
                        <SkillNode name={t.productManagement.skills.problemValidation.name} description={t.productManagement.skills.problemValidation.desc} icon={t.productManagement.skills.problemValidation.icon} level={0} />
                    </Section>
                     <Section title={t.productManagement.strategy}>
                        <SkillNode name={t.productManagement.skills.roadmapping.name} description={t.productManagement.skills.roadmapping.desc} icon={t.productManagement.skills.roadmapping.icon} level={1} />
                        <SkillNode name={t.productManagement.skills.prds.name} description={t.productManagement.skills.prds.desc} icon={t.productManagement.skills.prds.icon} level={1} />
                        <SkillNode name={t.productManagement.skills.prototyping.name} description={t.productManagement.skills.prototyping.desc} icon={t.productManagement.skills.prototyping.icon} level={1} />
                    </Section>
                     <Section title={t.productManagement.execution}>
                        <SkillNode name={t.productManagement.skills.agile.name} description={t.productManagement.skills.agile.desc} icon={t.productManagement.skills.agile.icon} level={2} />
                        <SkillNode name={t.productManagement.skills.dataAnalysis.name} description={t.productManagement.skills.dataAnalysis.desc} icon={t.productManagement.skills.dataAnalysis.icon} level={2} />
                        <SkillNode name={t.productManagement.skills.abTesting.name} description={t.productManagement.skills.abTesting.desc} icon={t.productManagement.skills.abTesting.icon} level={2} />
                    </Section>
                 </div>
            </TabsContent>
        </Tabs>

      </main>
    </div>
  );
}
