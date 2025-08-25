"use client";

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import * as d3 from 'd3';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

// 1. Data Structure (as per your design)
const skillTreeData = {
  name: "全栈开发 + AI",
  description: "全栈开发与人工智能的融合技能路径。",
  unlocked: true,
  children: [
    {
      name: "基础技能",
      unlocked: true,
      children: [
        { name: "HTML/CSS", description: "网页内容的结构与样式。", unlocked: true },
        { name: "JavaScript", description: "实现网页交互的核心语言。", unlocked: true },
        { name: "Python", description: "数据科学与AI开发的首选语言。", unlocked: true },
      ],
    },
    {
      name: "全栈开发分支",
      unlocked: true,
      children: [
        {
          name: "前端框架",
          unlocked: false,
          children: [
            { name: "React 19", description: "用于构建用户界面的JavaScript库。", unlocked: false },
            { name: "Vue.js", description: "渐进式JavaScript框架。", unlocked: false },
          ],
        },
        {
          name: "后端开发",
          unlocked: false,
          children: [
            { name: "Node.js", description: "基于Chrome V8引擎的JavaScript运行环境。", unlocked: false },
            { name: "Django", description: "高级Python Web框架。", unlocked: false },
          ],
        },
        { name: "数据库", description: "学习MongoDB或SQL进行数据存储。", unlocked: false },
        { name: "DevOps", description: "Docker容器化与CI/CD自动化部署。", unlocked: false },
        { name: "无服务器/边缘计算", description: "使用Serverless架构和Edge Computing优化性能。", unlocked: false },
      ],
    },
    {
      name: "AI分支",
      unlocked: false,
      children: [
        { name: "机器学习基础", description: "监督学习、无监督学习等核心概念。", unlocked: false },
        {
          name: "深度学习框架",
          unlocked: false,
          children: [
            { name: "TensorFlow", description: "由Google开发的开源机器学习框架。", unlocked: false },
            { name: "PyTorch", description: "由Facebook开发的开源机器学习库。", unlocked: false },
          ],
        },
        { name: "提示工程 (Prompt Engineering)", description: "与大语言模型高效交互的艺术。", unlocked: false },
        { name: "AI安全与伦理", description: "关注AI发展中的偏见、隐私与安全问题。", unlocked: false },
      ],
    },
    {
        name: "交叉节点",
        unlocked: false,
        children: [
            { name: "AI集成全栈应用", description: "构建AI聊天机器人、ML驱动的UI等。", unlocked: false },
            { name: "WebAssembly (WASM)", description: "在浏览器中高性能运行AI模型。", unlocked: false }
        ]
    }
  ],
};


const translations = {
  'zh-CN': {
    pageTitle: '技能树',
    pageSubtitle: '探索不同领域的知识体系与成长路径。',
    backButton: '返回科技主页',
  },
  'en': {
    pageTitle: 'Skill Tree',
    pageSubtitle: 'Explore knowledge systems and growth paths in different fields.',
    backButton: 'Back to Tech Home',
  }
};

type LanguageKey = keyof typeof translations;

export default function SkillTreePage() {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageKey>('en');
  const d3Container = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      const browserLang: LanguageKey = navigator.language.toLowerCase().startsWith('zh') ? 'zh-CN' : 'en';
      setCurrentLanguage(browserLang);
    }
  }, []);

  const t = useMemo(() => translations[currentLanguage], [currentLanguage]);

  useEffect(() => {
    if (skillTreeData && d3Container.current) {
        const svgElement = d3.select(d3Container.current);
        svgElement.selectAll("*").remove(); // Clear previous renders

        const width = 1200;
        const height = 800;

        const root = d3.hierarchy(skillTreeData);
        const treeLayout = d3.tree().size([height, width - 260]);
        treeLayout(root);

        const g = svgElement.append('g').attr('transform', 'translate(80,0)');

        // Links
        g.append('g')
            .selectAll('.link')
            .data(root.links())
            .enter()
            .append('path')
            .attr('class', 'link')
            .attr('d', d3.linkHorizontal()
                .x(d => d.y)
                .y(d => d.x))
            .style('fill', 'none')
            .style('stroke', '#555')
            .style('stroke-opacity', 0.6)
            .style('stroke-width', 1.5);

        // Nodes
        const node = g.append('g')
            .selectAll('.node')
            .data(root.descendants())
            .enter()
            .append('g')
            .attr('class', 'node')
            .attr('transform', d => `translate(${d.y},${d.x})`);

        const tooltip = d3.select("body").append("div")
            .attr("class", "d3-tooltip")
            .style("position", "absolute")
            .style("z-index", "10")
            .style("visibility", "hidden")
            .style("padding", "10px")
            .style("background", "rgba(0,0,0,0.7)")
            .style("border-radius", "5px")
            .style("color", "#fff")
            .style("font-size", "12px");

        node.append('circle')
            .attr('r', 8)
            .style('fill', d => (d.data as any).unlocked ? '#3b82f6' : '#9ca3af') // blue for unlocked, gray for locked
            .style('stroke', '#ffffff')
            .style('stroke-width', 2)
            .on("mouseover", function(event, d) {
              const data = d.data as any;
              if (data.description) {
                  tooltip.html(`<strong>${data.name}</strong><br/>${data.description}`)
                         .style("visibility", "visible");
              }
            })
            .on("mousemove", function(event) {
                tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");
            })
            .on("mouseout", function() {
                tooltip.style("visibility", "hidden");
            });

        node.append('text')
            .attr('dy', '0.31em')
            .attr('x', d => d.children ? -12 : 12)
            .attr('text-anchor', d => d.children ? 'end' : 'start')
            .text(d => d.data.name)
            .style('font-size', '14px')
            .style('fill', '#E5E7EB');

        // Add zoom and pan
        const zoom = d3.zoom<SVGSVGElement, unknown>()
            .scaleExtent([0.5, 3])
            .on('zoom', (event) => {
                g.attr('transform', event.transform);
            });

        svgElement.call(zoom);
      }
    }, [skillTreeData]);


  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100">
      <header className="p-4 border-b border-gray-700 sticky top-0 bg-gray-900/80 backdrop-blur-sm z-20">
          <div className="container mx-auto flex justify-between items-center">
            <Link href="/tech" passHref>
                <Button variant="outline" className="bg-transparent border-gray-600 hover:bg-gray-800">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t.backButton}
                </Button>
            </Link>
            <div className='text-center'>
                <h1 className="text-xl font-bold text-primary">{t.pageTitle}</h1>
                <p className="text-sm text-muted-foreground">{t.pageSubtitle}</p>
            </div>
            <div className="w-24"></div> {/* Spacer */}
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center overflow-hidden">
        <svg ref={d3Container} width="100%" height="100%"></svg>
      </main>
    </div>
  );
}
