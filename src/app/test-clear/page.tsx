// 测试清空功能的页面
"use client";

import React from 'react';
import { MusicProvider } from '@/context/MusicContext';
import { PlaylistProvider } from '@/lib/enhanced-music-context';

const TestContent: React.FC = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">清空功能测试</h1>
      
      <div className="space-y-4">
        <div className="p-4 border rounded">
          <h2 className="text-lg font-semibold mb-2">功能说明</h2>
          <div className="space-y-2 text-sm">
            <p><strong>清空播放列表：</strong>只清空当前播放状态，不删除音乐文件，歌单中的音乐不受影响</p>
            <p><strong>删除所有音乐：</strong>永久删除所有音乐文件，包括歌单中的音乐</p>
          </div>
        </div>
        
        <div className="p-4 border rounded">
          <h2 className="text-lg font-semibold mb-2">测试步骤</h2>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>导入一些音乐文件</li>
            <li>创建一个歌单并添加音乐</li>
            <li>使用"清空播放列表"功能</li>
            <li>检查歌单中的音乐是否还在</li>
            <li>从歌单中播放音乐，验证功能正常</li>
            <li>使用"删除所有音乐"功能</li>
            <li>检查所有音乐文件和歌单是否都被清空</li>
          </ol>
        </div>
        
        <div className="p-4 border rounded bg-red-50 border-red-200">
          <h2 className="text-lg font-semibold mb-2 text-red-800">⚠️ 重要提醒</h2>
          <div className="space-y-2 text-sm text-red-700">
            <p><strong>删除所有音乐和歌单：</strong>这是一个危险操作，会同时删除：</p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>所有音乐文件</li>
              <li>所有自定义歌单（名称、描述等信息）</li>
              <li>只保留默认的"所有音乐"歌单</li>
            </ul>
            <p className="font-medium">此操作无法恢复，请谨慎使用！</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function TestClearPage() {
  return (
    <MusicProvider>
      <PlaylistProvider>
        <TestContent />
      </PlaylistProvider>
    </MusicProvider>
  );
}