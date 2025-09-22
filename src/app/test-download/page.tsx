// 测试歌单下载功能的页面
"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { exportPlaylistToText, downloadTextFile, generateSafeFilename } from '@/lib/playlist-export';
import type { VirtualPlaylist, AllMusicPlaylist } from '@/lib/playlist-types';
import type { TrackMetadata } from '@/lib/db';

export default function TestDownloadPage() {
  // 模拟歌单数据
  const mockPlaylist: VirtualPlaylist = {
    id: 'test-playlist',
    name: '我的测试歌单',
    description: '这是一个用于测试下载功能的歌单',
    type: 'virtual',
    trackCount: 3,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
    tracks: [
      { trackId: 'track1', addedAt: new Date('2024-01-01') },
      { trackId: 'track2', addedAt: new Date('2024-01-02') },
      { trackId: 'track3', addedAt: new Date('2024-01-03') }
    ]
  };

  // 模拟音乐数据
  const mockTracks: TrackMetadata[] = [
    {
      id: 'track1',
      title: '青花瓷',
      artist: '周杰伦',
      category: '古风',
      duration: 240,
      createdAt: new Date('2024-01-01')
    },
    {
      id: 'track2',
      title: '夜曲',
      artist: '周杰伦',
      category: '流行',
      duration: 210,
      createdAt: new Date('2024-01-02')
    },
    {
      id: 'track3',
      title: '稻香',
      artist: '周杰伦',
      category: '治愈',
      duration: 220,
      createdAt: new Date('2024-01-03')
    }
  ];

  const handleTestDownload = () => {
    try {
      // 导出歌单信息为文本
      const textContent = exportPlaylistToText(mockPlaylist, mockTracks);
      
      // 生成文件名
      const filename = generateSafeFilename(mockPlaylist.name);
      
      // 下载文件
      downloadTextFile(textContent, filename);
      
      console.log('下载成功:', filename);
    } catch (error) {
      console.error('下载失败:', error);
    }
  };

  const handleTestAllMusicDownload = () => {
    const allMusicPlaylist: AllMusicPlaylist = {
      id: 'all-music',
      name: '所有音乐',
      type: 'all',
      trackCount: mockTracks.length,
      createdAt: new Date('2024-01-01')
    };

    try {
      const textContent = exportPlaylistToText(allMusicPlaylist, mockTracks);
      const filename = generateSafeFilename(allMusicPlaylist.name);
      downloadTextFile(textContent, filename);
      console.log('下载成功:', filename);
    } catch (error) {
      console.error('下载失败:', error);
    }
  };

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">歌单下载功能测试</h1>
      
      <div className="space-y-4">
        <div className="p-4 border rounded">
          <h2 className="text-lg font-semibold mb-2">功能说明</h2>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>下载歌单信息为txt文件</li>
            <li>包含歌单名称、描述、创建时间等信息</li>
            <li>按顺序列出所有歌曲的标题、作者、分类</li>
            <li>自动生成安全的文件名</li>
          </ul>
        </div>

        <div className="p-4 border rounded">
          <h2 className="text-lg font-semibold mb-4">测试数据</h2>
          <div className="space-y-2 text-sm">
            <p><strong>歌单名称:</strong> {mockPlaylist.name}</p>
            <p><strong>描述:</strong> {mockPlaylist.description}</p>
            <p><strong>歌曲数量:</strong> {mockPlaylist.trackCount} 首</p>
            <div>
              <strong>歌曲列表:</strong>
              <ul className="list-disc list-inside ml-4 mt-1">
                {mockTracks.map((track, index) => (
                  <li key={track.id}>
                    {index + 1}. {track.title} - {track.artist} [{track.category}]
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="space-x-4">
          <Button onClick={handleTestDownload}>
            下载虚拟歌单信息
          </Button>
          <Button onClick={handleTestAllMusicDownload} variant="outline">
            下载"所有音乐"歌单信息
          </Button>
        </div>

        <div className="p-4 border rounded bg-blue-50 border-blue-200">
          <h2 className="text-lg font-semibold mb-2 text-blue-800">💡 使用提示</h2>
          <div className="space-y-1 text-sm text-blue-700">
            <p>• 点击按钮后会自动下载txt文件到默认下载目录</p>
            <p>• 文件名格式: 歌单_歌单名称_日期.txt</p>
            <p>• 文件内容包含完整的歌单信息和歌曲列表</p>
            <p>• 支持中文字符，使用UTF-8编码</p>
          </div>
        </div>
      </div>
    </div>
  );
}