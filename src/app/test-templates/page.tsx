// 测试歌单模板功能的页面
"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { playlistTemplates, templateCategories } from '@/lib/playlist-templates';

export default function TestTemplatesPage() {
  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold">歌单模板测试</h1>
      
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">模板分类 ({templateCategories.length})</h2>
        {templateCategories.map(category => (
          <div key={category.id} className="p-4 border rounded">
            <h3 className="font-medium">{category.icon} {category.name}</h3>
            <p className="text-sm text-muted-foreground">
              {playlistTemplates.filter(t => t.category === category.id).length} 个模板
            </p>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">所有模板 ({playlistTemplates.length})</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {playlistTemplates.slice(0, 6).map(template => (
            <div key={template.id} className="p-4 border rounded">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{template.icon}</span>
                <h3 className="font-medium text-sm">{template.name}</h3>
              </div>
              <p className="text-xs text-muted-foreground mb-2">
                {template.description}
              </p>
              <div className="flex flex-wrap gap-1">
                {template.tags.slice(0, 3).map(tag => (
                  <span key={tag} className="text-xs bg-muted px-2 py-1 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}