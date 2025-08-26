
"use client";

import { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RotateCw, Eye, Grid } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const translations = {
  'zh-CN': {
    pageTitle: '散光放松练习',
    backButton: '返回护眼专栏',
    astigmatismChartTitle: '放射状图表放松',
    instruction: '注视中心点，观察所有线条。如果某些线条看起来比其他线条更粗、更黑或更模糊，这可能表明存在散光。',
    instruction_2: '尝试慢慢转动头部，看看线条的清晰度是否发生变化。这个练习可以帮助放松您的眼部肌肉。',
    rotateButton: '旋转图表',
    figureEightTitle: '8字形运目放松',
    figureEightInstruction: '请保持头部不动，用您的眼睛平稳地跟随引导点，沿“8”字形轨迹运动。',
    dotMatrixTitle: '点阵移动放松',
    dotMatrixInstruction: '保持目光稳定，观察白色小球的运动。这个练习有助于训练眼部聚焦和追踪能力。',
  },
  'en': {
    pageTitle: 'Astigmatism Relaxation Exercise',
    backButton: 'Back to Eye Care',
    astigmatismChartTitle: 'Radial Chart Relaxation',
    instruction: 'Focus on the center dot. Observe all the lines. If some lines appear darker, thicker, or blurrier than others, it may indicate astigmatism.',
    instruction_2: 'Try slowly rotating your head to see if the clarity of the lines changes. This exercise can help relax your eye muscles.',
    rotateButton: 'Rotate Chart',
    figureEightTitle: 'Figure-Eight Eye Relaxation',
    figureEightInstruction: 'Keep your head still and smoothly follow the guide dot with your eyes along the figure-eight path.',
    dotMatrixTitle: 'Dot Matrix Relaxation',
    dotMatrixInstruction: 'Keep your gaze steady and observe the movement of the white dots. This exercise helps train eye focusing and tracking.',
  }
};

type LanguageKey = keyof typeof translations;

const AstigmatismChart: React.FC<{ rotation: number }> = ({ rotation }) => {
  const lines = Array.from({ length: 12 }, (_, i) => i * 15); // 12 lines every 15 degrees

  return (
    <div className="w-64 h-64 sm:w-80 sm:h-80 bg-white rounded-full flex items-center justify-center relative shadow-lg border-4 border-gray-200">
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full transition-transform duration-500 ease-in-out"
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        {lines.map((angle) => (
          <line
            key={angle}
            x1="50"
            y1="50"
            x2="50"
            y2="5"
            stroke="black"
            strokeWidth="1"
            transform={`rotate(${angle} 50 50)`}
          />
        ))}
        <circle cx="50" cy="50" r="2" fill="red" />
      </svg>
    </div>
  );
};

const FigureEightExercise: React.FC = () => {
    const animationPath = "M25,50 a25,25 0 1,0 50,0 a25,25 0 1,0 -50,0";

    return (
        <div className="relative w-full max-w-sm h-48 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full" style={{ overflow: 'visible' }}>
                <path
                    d={animationPath}
                    stroke="hsl(var(--primary) / 0.3)"
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray="4 4"
                />
                <g>
                    <circle cx="0" cy="0" r="6" fill="hsl(var(--primary))">
                        <animateMotion
                            dur="12s"
                            repeatCount="indefinite"
                            path={animationPath}
                            rotate="auto"
                        />
                    </circle>
                </g>
            </svg>
        </div>
    );
};

const DotMatrixExercise: React.FC = () => {
  const horizontal_dots = 60;
  const vertical_dots = 40;
  const [dots, setDots] = useState<{ id: number; delay: number }[]>([]);

  useEffect(() => {
    const newDots = Array.from({ length: horizontal_dots * vertical_dots }).map((_, i) => ({
      id: i,
      delay: Math.random() * -6,
    }));
    setDots(newDots);
  }, []);

  if (dots.length === 0) {
    return <div className="w-full h-80 bg-black rounded-lg" />;
  }

  return (
      <div 
        className="w-full h-80 bg-black rounded-lg overflow-hidden"
      >
        <div 
            className="grid gap-2 w-full h-full"
            style={{gridTemplateColumns: `repeat(${horizontal_dots}, 1fr)`, gridTemplateRows: `repeat(${vertical_dots}, 1fr)`}}
        >
            {dots.map((dot) => (
              <div
                key={dot.id}
                className="bg-white rounded-full w-[6px] h-[6px] m-auto"
              />
            ))}
        </div>
      </div>
  );
};


export default function AstigmatismExercisePage() {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageKey>('en');
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      const browserLang: LanguageKey = navigator.language.toLowerCase().startsWith('zh') ? 'zh-CN' : 'en';
      setCurrentLanguage(browserLang);
    }
  }, []);

  const t = useMemo(() => translations[currentLanguage], [currentLanguage]);

  const handleRotate = () => {
    setRotation(prev => (prev + 15) % 360);
  };

  return (
    <div className="flex flex-col min-h-screen w-full items-center bg-gray-50 dark:bg-gray-900 text-foreground p-4 sm:p-8">
      <header className="w-full max-w-4xl self-center mb-8">
        <Link href="/health/eye-care" passHref>
          <Button variant="outline" size="sm" className="bg-background/50 backdrop-blur-sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t.backButton}
          </Button>
        </Link>
      </header>

      <main className="flex flex-col items-center w-full max-w-4xl space-y-12">
        <h1 className="text-2xl sm:text-3xl font-headline font-semibold text-primary mb-0 text-center">
          {t.pageTitle}
        </h1>
        
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-3">
                    <RotateCw className="w-6 h-6 text-primary/80"/>
                    {t.astigmatismChartTitle}
                </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col md:flex-row items-center gap-8">
                <AstigmatismChart rotation={rotation} />
                <div className="flex-1 space-y-4">
                     <p className="text-muted-foreground">{t.instruction}</p>
                     <p className="text-muted-foreground">{t.instruction_2}</p>
                     <Button onClick={handleRotate} className="mt-4">
                        <RotateCw className="mr-2 h-4 w-4" />
                        {t.rotateButton}
                    </Button>
                </div>
            </CardContent>
        </Card>

         <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-3">
                    <Eye className="w-6 h-6 text-primary/80"/>
                    {t.figureEightTitle}
                </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-6">
                <FigureEightExercise />
                <p className="text-muted-foreground text-center max-w-md">{t.figureEightInstruction}</p>
            </CardContent>
        </Card>
        
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-3">
                    <Grid className="w-6 h-6 text-primary/80"/>
                    {t.dotMatrixTitle}
                </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-6">
                <DotMatrixExercise />
                <p className="text-muted-foreground text-center max-w-md">{t.dotMatrixInstruction}</p>
            </CardContent>
        </Card>

      </main>
    </div>
  );
}
