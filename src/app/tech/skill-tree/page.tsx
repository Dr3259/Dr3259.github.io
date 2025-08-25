
"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import Link from 'next/link';
import * as d3 from 'd3';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

const translations = {
  'zh-CN': {
    pageTitle: '技能树',
    backButton: '返回科技主页',
    pageDescription: '一个动态、可交互的技能树，用于规划和展示学习路径。',
  },
  'en': {
    pageTitle: 'Skill Tree',
    backButton: 'Back to Tech Home',
    pageDescription: 'A dynamic and interactive skill tree for planning and showcasing learning paths.',
  }
};

type LanguageKey = keyof typeof translations;

interface SkillNodeData extends d3.HierarchyNode<any> {
    data: {
        name: string;
        description: string;
        unlocked: boolean;
        children?: SkillNodeData[];
    };
    x: number;
    y: number;
    parent: SkillNodeData | null;
}


const skillTreeData = {
  name: "Web全栈开发",
  description: "成为一名能够独立开发和部署Web应用的工程师。",
  unlocked: true,
  children: [
    {
      name: "前端",
      description: "构建用户直接交互的界面。",
      unlocked: true,
      children: [
        { name: "HTML/CSS", description: "网页的骨架与样式。", unlocked: true, children: [
          { name: "响应式设计", description: "适配不同设备。", unlocked: false }
        ]},
        { name: "JavaScript", description: "实现网页交互逻辑。", unlocked: true, children: [
          { name: "TypeScript", description: "为JS添加类型系统。", unlocked: false },
          { name: "React/Vue", description: "现代前端框架。", unlocked: false }
        ]}
      ]
    },
    {
      name: "后端",
      description: "处理服务器、数据库和应用逻辑。",
      unlocked: false,
      children: [
        { name: "Node.js", description: "用JavaScript编写后端。", unlocked: false, children: [
           { name: "Express", description: "流行的Node.js框架。", unlocked: false }
        ]},
        { name: "数据库", description: "存储和管理数据。", unlocked: false, children: [
           { name: "SQL (Postgres)", description: "关系型数据库。", unlocked: false },
           { name: "NoSQL (MongoDB)", description: "非关系型数据库。", unlocked: false }
        ]},
        { name: "API 设计", description: "定义前后端通信的契约。", unlocked: false }
      ]
    },
    {
      name: "部署与运维",
      description: "将应用发布到线上并维护。",
      unlocked: false,
      children: [
        { name: "Git", description: "版本控制系统。", unlocked: true },
        { name: "Docker", description: "容器化技术。", unlocked: false },
        { name: "CI/CD", description: "持续集成与部署。", unlocked: false }
      ]
    }
  ]
};

export default function SkillTreePage() {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageKey>('en');
  const d3Container = useRef<SVGSVGElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      const browserLang: LanguageKey = navigator.language.toLowerCase().startsWith('zh') ? 'zh-CN' : 'en';
      setCurrentLanguage(browserLang);
    }
  }, []);

  const t = useMemo(() => translations[currentLanguage], [currentLanguage]);

  useEffect(() => {
    if (skillTreeData && d3Container.current) {
        const svg = d3.select(d3Container.current);
        svg.selectAll("*").remove(); // Clear previous renders

        const width = 1000;
        const height = 800;
        const marginTop = 50;
        const marginRight = 20;
        const marginBottom = 100;
        const marginLeft = 20;

        svg.attr('viewBox', [-width / 2, -height + 150, width, height]);
        
        const g = svg.append("g");

        const root = d3.hierarchy(skillTreeData) as SkillNodeData;
        const treeLayout = d3.tree<any>().size([width - marginLeft - marginRight, height - marginTop - marginBottom - 250]);
        
        treeLayout(root);

        // Make it a vertical tree growing upwards
        root.descendants().forEach(d => {
            const {x, y} = d;
            d.x = -y; // Invert y to grow upwards from the bottom
            d.y = x - (width - marginLeft - marginRight)/2; // Center the tree horizontally
        });
        
        const colorScale = d3.scaleLinear<string>()
          .domain([0, root.height])
          .range(["#555", "#bbb"]);

        // Links
        g.append('g')
          .attr('fill', 'none')
          .selectAll('path')
          .data(root.links())
          .join('path')
             // Use d3.linkVertical for elbow connectors
            .attr('d', d3.linkVertical()
                .x(d => (d as any).y)
                .y(d => (d as any).x)
            )
            .attr('stroke', d => d.target.data.unlocked ? '#2563eb' : '#4b5563')
            .attr('stroke-width', d => 5 - d.source.depth * 0.8)
            .attr('stroke-opacity', 0.8);

        // Nodes
        const node = g.append('g')
          .selectAll('g')
          .data(root.descendants())
          .join('g')
            .attr('transform', d => `translate(${d.y},${d.x})`);

        node.append('circle')
            .attr('r', d => 12 - d.depth * 1.5)
            .attr('fill', d => d.data.unlocked ? '#2563eb' : '#4b5563')
            .attr('stroke', d => colorScale(d.depth))
            .attr('stroke-width', 2);
        
        node.append('text')
            .attr('dy', '0.31em')
            .attr('y', d => d.children ? -20 : 20)
            .attr('text-anchor', 'middle')
            .text(d => d.data.name)
            .style('fill', '#f8fafc')
            .style('font-size', d => `${16 - d.depth}px`);

        const tooltip = d3.select(tooltipRef.current);
        
        node.on('mouseover', (event, d) => {
            d3.select(event.currentTarget).select('circle').transition().duration(200).attr('r', d => 16 - d.depth * 1.5);
            tooltip.style('opacity', 1)
                   .html(`<strong>${d.data.name}</strong><p>${d.data.description}</p>`)
                   .style('left', (event.pageX + 15) + 'px')
                   .style('top', (event.pageY - 28) + 'px');
        }).on('mouseout', (event, d) => {
            d3.select(event.currentTarget).select('circle').transition().duration(200).attr('r', d => 12 - d.depth * 1.5);
            tooltip.style('opacity', 0);
        });

        // Zoom functionality
        const zoom = d3.zoom<SVGSVGElement, unknown>().on('zoom', (event) => {
            g.attr('transform', event.transform);
        });
        
        svg.call(zoom);

    }
  }, [currentLanguage]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100 font-sans">
      <header className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Link href="/tech" passHref>
          <Button variant="outline" size="sm" className="bg-gray-800 border-gray-700 hover:bg-gray-700">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t.backButton}
          </Button>
        </Link>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-primary mb-2">{t.pageTitle}</h1>
            <p className="text-lg text-muted-foreground">{t.pageDescription}</p>
        </div>
        <div className="w-full max-w-5xl h-[70vh] bg-gray-800/50 rounded-lg border border-gray-700 shadow-lg overflow-hidden">
            <svg ref={d3Container} className="w-full h-full" />
        </div>
         <div ref={tooltipRef} className="absolute opacity-0 transition-opacity pointer-events-none bg-gray-900 text-white text-sm rounded-md shadow-lg p-2 border border-gray-600 max-w-xs" />
      </main>
    </div>
  );
}
