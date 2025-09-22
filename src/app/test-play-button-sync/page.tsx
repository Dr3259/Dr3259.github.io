// 测试播放按钮状态同步的页面
"use client";

import React from 'react';

export default function TestPlayButtonSyncPage() {
  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">播放按钮状态同步测试</h1>
      
      <div className="space-y-4">
        <div className="p-4 border rounded bg-blue-50 border-blue-200">
          <h2 className="text-lg font-semibold mb-2 text-blue-800">🎯 功能说明</h2>
          <div className="space-y-1 text-sm text-blue-700">
            <p>• <strong>状态同步：</strong>歌单卡片上的播放按钮与下方播放控制区域的按钮状态保持一致</p>
            <p>• <strong>播放状态：</strong>当音乐正在播放时，歌单按钮显示暂停图标 ⏸️</p>
            <p>• <strong>暂停状态：</strong>当音乐暂停时，歌单按钮显示播放图标 ▶️</p>
            <p>• <strong>智能切换：</strong>点击当前播放歌单的按钮会暂停/继续播放</p>
          </div>
        </div>

        <div className="p-4 border rounded">
          <h2 className="text-lg font-semibold mb-2">测试步骤</h2>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>导入一些音乐文件</li>
            <li>创建一个虚拟歌单并添加音乐</li>
            <li>点击歌单的播放按钮开始播放</li>
            <li>观察歌单按钮变为暂停图标 ⏸️</li>
            <li>点击下方的暂停按钮</li>
            <li>观察歌单按钮变回播放图标 ▶️</li>
            <li>再次点击歌单按钮，应该继续播放当前歌曲</li>
            <li>点击其他歌单的播放按钮，应该切换到新歌单</li>
          </ol>
        </div>

        <div className="p-4 border rounded bg-green-50 border-green-200">
          <h2 className="text-lg font-semibold mb-2 text-green-800">✨ 交互逻辑</h2>
          <div className="space-y-1 text-sm text-green-700">
            <p>• <strong>点击当前播放歌单：</strong>切换播放/暂停状态</p>
            <p>• <strong>点击其他歌单：</strong>切换到该歌单并开始播放</p>
            <p>• <strong>按钮图标：</strong>根据播放状态动态显示播放或暂停图标</p>
            <p>• <strong>视觉一致性：</strong>所有播放控制按钮状态保持同步</p>
          </div>
        </div>

        <div className="p-4 border rounded bg-yellow-50 border-yellow-200">
          <h2 className="text-lg font-semibold mb-2 text-yellow-800">🔧 技术实现</h2>
          <div className="space-y-1 text-sm text-yellow-700">
            <p>• <strong>状态传递：</strong>通过 isPlaying 属性传递播放状态</p>
            <p>• <strong>条件渲染：</strong>根据 isActive && isPlaying 显示不同图标</p>
            <p>• <strong>智能处理：</strong>handlePlaylistPlayPause 函数处理不同场景</p>
            <p>• <strong>状态同步：</strong>所有组件共享同一个播放状态</p>
          </div>
        </div>

        <div className="p-4 border rounded bg-purple-50 border-purple-200">
          <h2 className="text-lg font-semibold mb-2 text-purple-800">🎵 用户体验</h2>
          <div className="space-y-1 text-sm text-purple-700">
            <p>• <strong>直观反馈：</strong>用户一眼就能看出哪个歌单正在播放</p>
            <p>• <strong>便捷控制：</strong>可以直接从歌单卡片控制播放/暂停</p>
            <p>• <strong>状态清晰：</strong>所有播放控制按钮状态一致，避免混淆</p>
            <p>• <strong>操作流畅：</strong>点击行为符合用户直觉</p>
          </div>
        </div>
      </div>
    </div>
  );
}