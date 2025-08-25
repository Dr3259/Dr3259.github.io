
"use client";

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, GitFork, Code, Type, Wind, Framer, Component, Settings, Box, Database, Cloud } from 'lucide-react';
import { cn } from '@/lib/utils';

const translations = {
  'zh-CN': {
    pageTitle: '前端技能树',
    pageSubtitle: '一个现代Web前端开发的学习路径示例。',
    backButton: '返回科技主页',
    fundamentals: '基础',
    frameworks: '框架',
    advanced: '高级概念',
    skills: {
      html: { name: 'HTML', desc: '网页内容的结构。' },
      css: { name: 'CSS', desc: '网页内容的样式。' },
      javascript: { name: 'JavaScript', desc: '实现网页交互性。' },
      typescript: { name: 'TypeScript', desc: '为JS添加静态类型。' },
      react: { name: 'React', desc: '用于构建用户界面的库。' },
      nextjs: { name: 'Next.js', desc: '生产级的React框架。' },
      vue: { name: 'Vue.js', desc: '渐进式JavaScript框架。' },
      angular: { name: 'Angular', desc: 'Web应用平台。' },
      styling: { name: '样式', desc: '如 Tailwind CSS 或 Sass。' },
      tooling: { name: '工具', desc: '如 Vite 或 Webpack。' },
      stateManagement: { name: '状态管理', desc: '如Redux或Zustand。' },
      backend: { name: '后端交互', desc: '与REST/GraphQL API通信。' },
      testing: { name: '测试', desc: '如Jest或Cypress。' },
    },
  },
  'en': {
    pageTitle: 'Frontend Skill Tree',
    pageSubtitle: 'An example learning path for modern web frontend development.',
    backButton: 'Back to Tech Home',
    fundamentals: 'Fundamentals',
    frameworks: 'Frameworks',
    advanced: 'Advanced Concepts',
    skills: {
      html: { name: 'HTML', desc: 'Structure of web content.' },
      css: { name: 'CSS', desc: 'Styling of web content.' },
      javascript: { name: 'JavaScript', desc: 'Enabling interactivity.' },
      typescript: { name: 'TypeScript', desc: 'Adds static typing to JS.' },
      react: { name: 'React', desc: 'A library for user interfaces.' },
      nextjs: { name: 'Next.js', desc: 'The React Framework for Production.' },
      vue: { name: 'Vue.js', desc: 'The Progressive JavaScript Framework.' },
      angular: { name: 'Angular', desc: 'Platform for web applications.' },
      styling: { name: 'Styling', desc: 'e.g., Tailwind CSS or Sass.' },
      tooling: { name: 'Tooling', desc: 'e.g., Vite or Webpack.' },
      stateManagement: { name: 'State Management', desc: 'e.g., Redux or Zustand.' },
      backend: { name: 'Backend Interaction', desc: 'Communicating with REST/GraphQL APIs.' },
      testing: { name: 'Testing', desc: 'e.g., Jest or Cypress.' },
    },
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

        <div className="w-full max-w-lg">
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
      </main>
    </div>
  );
}
