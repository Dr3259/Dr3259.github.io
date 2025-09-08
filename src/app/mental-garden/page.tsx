"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Sparkles, Heart, Stars, Waves, Flower } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from "@/lib/utils";

// 导入各种神秘视觉效果组件
import { GeometricMandalaAnimation } from '@/components/visual-effects/GeometricMandalaAnimation';
import { ParticleGalaxyAnimation } from '@/components/visual-effects/ParticleGalaxyAnimation';
import { QuantumFieldAnimation } from '@/components/visual-effects/QuantumFieldAnimation';
import { CrystalFormationAnimation } from '@/components/visual-effects/CrystalFormationAnimation';
import { EtherealAuroraAnimation } from '@/components/visual-effects/EtherealAuroraAnimation';
import { SacredGeometryAnimation } from '@/components/visual-effects/SacredGeometryAnimation';
import { Pikachu3DAnimation } from '@/components/visual-effects/Pikachu3DAnimation';
import { VanGoghStarryNightAnimation } from '@/components/visual-effects/VanGoghStarryNightAnimation';
import { BlueCrystalRoseAnimation } from '@/components/visual-effects/BlueCrystalRoseAnimation';
import { SolarSystemAnimation } from '@/components/visual-effects/SolarSystemAnimation';
import { EarthAnimation } from '@/components/visual-effects/EarthAnimation';
import { HiganbanaAnimation } from '@/components/visual-effects/HiganbanaAnimation';
import { MonaLisaAnimation } from '@/components/visual-effects/MonaLisaAnimation';

const translations = {
  'zh-CN': {
    backButton: '返回休息区',
    pageTitle: '精神花园',
    pageDescription: '在这里静心观赏美丽的视觉效果，让心灵得到平静与放松。',
    currentEffect: '当前效果',
    selectEffect: '选择效果',
    effects: {
      geometricMandala: { title: '几何曼陀罗', description: '观赏神圣几何的无限循环' },
      particleGalaxy: { title: '粒子星系', description: '探索宇宙深处的星系奥秘' },
      quantumField: { title: '量子场域', description: '感受量子世界的神秘波动' },
      crystalFormation: { title: '水晶生长', description: '见证水晶结构的优雅形成' },
      etherealAurora: { title: '幻境极光', description: '沉浸在超现实的极光之中' },
      sacredGeometry: { title: '神圣几何', description: '探索宇宙的数学之美' },
      pikachu3D: { title: '3D皮卡丘', description: '与可爱的立体皮卡丘一起放松' },
      vanGoghStarryNight: { title: '梵高星夜', description: '沉浸在梵高笔下的浪漫星空' },
      blueCrystalRose: { title: '蓝色水晶妖姬', description: '观赏神秘优雅的水晶玫瑰绽放' },
      solarSystem: { title: '太阳系漫游', description: '探索浩瀚宇宙中的行星奇迹' },
      earth: { title: '地球家园', description: '观赏我们美丽的蓝色家园星球' },
      higanbana: { title: '彼岸花', description: '神秘的彼岸花在幽深中绿放' },
      monaLisa: { title: '蒙娜丽莎', description: '永恒的神秘微笑与文艺复兴之美' }
    }
  },
  'en': {
    backButton: 'Back to Rest',
    pageTitle: 'Mental Garden',
    pageDescription: 'Find peace and relaxation by watching beautiful visual effects.',
    currentEffect: 'Current Effect',
    selectEffect: 'Select Effect',
    effects: {
      geometricMandala: { title: 'Geometric Mandala', description: 'Witness the infinite cycles of sacred geometry' },
      particleGalaxy: { title: 'Particle Galaxy', description: 'Explore the mysteries of distant galaxies' },
      quantumField: { title: 'Quantum Field', description: 'Feel the mysterious fluctuations of quantum realm' },
      crystalFormation: { title: 'Crystal Formation', description: 'Witness the elegant formation of crystal structures' },
      etherealAurora: { title: 'Ethereal Aurora', description: 'Immerse in surreal aurora phenomena' },
      sacredGeometry: { title: 'Sacred Geometry', description: 'Explore the mathematical beauty of universe' },
      pikachu3D: { title: '3D Pikachu', description: 'Relax with adorable 3D Pikachu companion' },
      vanGoghStarryNight: { title: 'Van Gogh Starry Night', description: 'Immerse in Van Gogh\'s romantic starry sky' },
      blueCrystalRose: { title: 'Blue Crystal Rose', description: 'Watch the mysterious and elegant crystal rose bloom' },
      solarSystem: { title: 'Solar System', description: 'Explore the wonders of planets in the vast universe' },
      earth: { title: 'Earth Home', description: 'Admire our beautiful blue home planet' },
      higanbana: { title: 'Higanbana', description: 'Mysterious spider lilies blooming in the ethereal realm' },
      monaLisa: { title: 'Mona Lisa', description: 'The eternal mysterious smile and Renaissance beauty' }
    }
  }
};

type LanguageKey = keyof typeof translations;
type EffectKey = keyof (typeof translations)['en']['effects'];

const effectIcons = {
  geometricMandala: Sparkles,
  particleGalaxy: Stars,
  quantumField: Waves,
  crystalFormation: Heart,
  etherealAurora: Flower,
  sacredGeometry: Sparkles,
  pikachu3D: Heart,
  vanGoghStarryNight: Stars,
  blueCrystalRose: Heart,
  solarSystem: Stars,
  earth: Heart,
  higanbana: Flower,
  monaLisa: Heart
};

const effectComponents = {
  geometricMandala: GeometricMandalaAnimation,
  particleGalaxy: ParticleGalaxyAnimation,
  quantumField: QuantumFieldAnimation,
  crystalFormation: CrystalFormationAnimation,
  etherealAurora: EtherealAuroraAnimation,
  sacredGeometry: SacredGeometryAnimation,
  pikachu3D: Pikachu3DAnimation,
  vanGoghStarryNight: VanGoghStarryNightAnimation,
  blueCrystalRose: BlueCrystalRoseAnimation,
  solarSystem: SolarSystemAnimation,
  earth: EarthAnimation,
  higanbana: HiganbanaAnimation,
  monaLisa: MonaLisaAnimation
};

export default function MentalGardenPage() {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageKey>('zh-CN');
  const [currentEffect, setCurrentEffect] = useState<EffectKey>('geometricMandala');
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const browserLang: LanguageKey = navigator.language.toLowerCase().startsWith('en') ? 'en' : 'zh-CN';
      setCurrentLanguage(browserLang);
    }
  }, []);

  const t = translations[currentLanguage];
  const CurrentEffectComponent = effectComponents[currentEffect];

  const handleEffectChange = (effect: EffectKey) => {
    setCurrentEffect(effect);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* 头部导航 */}
      {!isFullscreen && (
        <header className="w-full p-4 sm:p-8">
          <div className="max-w-6xl mx-auto">
            <Link href="/rest" passHref>
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t.backButton}
              </Button>
            </Link>
          </div>
        </header>
      )}

      <main className="flex-1 flex flex-col">
        {/* 标题区域 */}
        {!isFullscreen && (
          <div className="text-center mb-8 px-4">
            <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
              {t.pageTitle}
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t.pageDescription}
            </p>
          </div>
        )}

        {/* 主要内容区域 */}
        <div className="flex-1 flex flex-col lg:flex-row gap-6 px-4 pb-8">
          {/* 效果选择面板 */}
          {!isFullscreen && (
            <div className="lg:w-80 flex-shrink-0">
              <Card className="h-full">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">{t.selectEffect}</h3>
                  <div className="space-y-3">
                    {(Object.keys(t.effects) as EffectKey[]).map((effect) => {
                      const Icon = effectIcons[effect];
                      const effectInfo = t.effects[effect];
                      return (
                        <button
                          key={effect}
                          onClick={() => handleEffectChange(effect)}
                          className={cn(
                            "w-full p-4 rounded-lg border-2 transition-all duration-200 text-left",
                            "hover:bg-accent hover:border-primary/50",
                            currentEffect === effect
                              ? "bg-primary/10 border-primary text-primary"
                              : "bg-card border-border"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <Icon className="h-5 w-5" />
                            <div>
                              <div className="font-medium">{effectInfo.title}</div>
                              <div className="text-sm text-muted-foreground">
                                {effectInfo.description}
                              </div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  
                  <Button
                    onClick={toggleFullscreen}
                    className="w-full mt-6"
                    variant="outline"
                  >
                    全屏观赏
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* 视觉效果显示区域 */}
          <div className="flex-1 relative">
            <Card className={cn(
              "h-full min-h-[500px] overflow-hidden",
              isFullscreen && "fixed inset-0 z-50 rounded-none border-0"
            )}>
              <CardContent className="p-0 h-full relative">
                {/* 当前效果显示 */}
                {!isFullscreen && (
                  <div className="absolute top-4 left-4 z-10 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                    {t.currentEffect}: {t.effects[currentEffect].title}
                  </div>
                )}
                
                {/* 全屏模式下的控制按钮 */}
                {isFullscreen && (
                  <div className="absolute top-4 right-4 z-10 flex gap-2">
                    <Button
                      onClick={toggleFullscreen}
                      variant="outline"
                      size="sm"
                      className="bg-black/50 border-white/20 text-white hover:bg-black/70"
                    >
                      退出全屏
                    </Button>
                  </div>
                )}
                
                {/* 视觉效果组件 */}
                <div className="w-full h-full">
                  <CurrentEffectComponent />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}