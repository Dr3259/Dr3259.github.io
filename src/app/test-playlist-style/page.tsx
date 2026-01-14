// 测试歌单卡片样式的页面
"use client";

import React, { useState } from 'react';
import { PlaylistCard } from '@/components/playlist-card';
import type { VirtualPlaylist, AllMusicPlaylist } from '@/lib/playlist-types';

export default function TestPlaylistStylePage() {
  const [selectedPlaylist, setSelectedPlaylist] = useState<string>('playlist-1');

  // 模拟歌单数据
  const mockPlaylists = [
    {
      id: 'all-music',
      name: '所有音乐',
      type: 'all' as const,
      isDefault: true,
      trackCount: 25,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-15')
    } as AllMusicPlaylist,
    {
      id: 'playlist-1',
      name: '我的最爱',
      description: '收藏的经典歌曲',
      type: 'virtual' as const,
      trackCount: 12,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-20'),
      tracks: []
    } as VirtualPlaylist,
    {
      id: 'playlist-2',
      name: '学习专用',
      description: '专注学习时听的轻音乐',
      type: 'virtual' as const,
      trackCount: 8,
      createdAt: new Date('2024-02-01'),
      updatedAt: new Date('2024-02-05'),
      tracks: []
    } as VirtualPlaylist,
    {
      id: 'playlist-3',
      name: '运动节拍',
      description: '健身时的动感音乐',
      type: 'virtual' as const,
      trackCount: 15,
      createdAt: new Date('2024-02-10'),
      updatedAt: new Date('2024-02-12'),
      tracks: []
    } as VirtualPlaylist,
    {
      id: 'folder-1',
      name: '下载音乐',
      type: 'folder' as const,
      trackCount: 20,
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-01-21'),
      folderPath: '/downloads/music',
      lastScanTime: new Date('2024-01-21'),
      autoRefresh: false
    }
  ];

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">歌单卡片样式测试</h1>
      
      <div className="space-y-4">
        <div className="p-4 border rounded">
          <h2 className="text-lg font-semibold mb-2">选中状态改进</h2>
          <div className="space-y-2 text-sm">
            <p><strong>简洁的选中效果：</strong></p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>更大的阴影和轻微放大效果</li>
              <li>渐变边框和背景增强</li>
              <li>图标和文字颜色变化</li>
              <li>播放按钮始终可见</li>
              <li>背景光晕效果</li>
              <li>移除了左上角的指示器，保持简洁</li>
            </ul>
          </div>
        </div>

        <div className="flex gap-4 mb-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">选中歌单：</label>
            <select 
              value={selectedPlaylist} 
              onChange={(e) => setSelectedPlaylist(e.target.value)}
              className="px-3 py-1 border rounded text-sm"
            >
              {mockPlaylists.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">歌单卡片展示</h2>
          <p className="text-sm text-muted-foreground">点击卡片查看选中状态效果</p>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {mockPlaylists.map((playlist) => (
              <PlaylistCard
                key={playlist.id}
                playlist={playlist}
                isActive={selectedPlaylist === playlist.id}
                onSelect={() => setSelectedPlaylist(playlist.id)}
                onPlay={() => console.log('播放歌单:', playlist.name)}
                onEdit={playlist.type === 'virtual' ? () => console.log('编辑歌单:', playlist.name) : undefined}
                onDownload={playlist.type === 'virtual' ? () => console.log('下载歌单:', playlist.name) : undefined}
                onRefresh={playlist.type === 'folder' ? () => console.log('刷新歌单:', playlist.name) : undefined}
                onDelete={() => console.log('删除歌单:', playlist.name)}
              />
            ))}
            
            {/* 创建歌单卡片 */}
            <PlaylistCard
              isCreateCard
              onCreate={() => console.log('创建虚拟歌单')}
              onImportFolder={() => console.log('导入文件夹歌单')}
            />
          </div>
        </div>

        <div className="p-4 border rounded bg-green-50 border-green-200">
          <h2 className="text-lg font-semibold mb-2 text-green-800">✨ 视觉改进</h2>
          <div className="space-y-1 text-sm text-green-700">
            <p>• <strong>选中状态：</strong>更明显的视觉反馈，包括阴影、缩放和颜色变化</p>
            <p>• <strong>动画效果：</strong>平滑的过渡动画，提升用户体验</p>
            <p>• <strong>层次感：</strong>通过阴影和光晕创造深度感</p>
            <p>• <strong>一致性：</strong>不同类型歌单保持统一的设计语言</p>
          </div>
        </div>

        <div className="p-4 border rounded bg-blue-50 border-blue-200">
          <h2 className="text-lg font-semibold mb-2 text-blue-800">🎨 设计细节</h2>
          <div className="space-y-1 text-sm text-blue-700">
            <p>• <strong>背景光晕：</strong>卡片周围的模糊光效</p>
            <p>• <strong>渐变增强：</strong>选中时背景渐变更加鲜艳</p>
            <p>• <strong>播放按钮：</strong>选中时始终显示，带有特殊光效</p>
            <p>• <strong>简洁设计：</strong>移除了左上角指示器，保持界面整洁</p>
            <p>• <strong>缩放效果：</strong>选中时轻微放大，增强视觉反馈</p>
          </div>
        </div>
      </div>
    </div>
  );
}
