// 测试歌单功能的简单页面
"use client";

import React from 'react';
import { MusicProvider } from '@/context/MusicContext';
import { PlaylistProvider, usePlaylist, useMusicWithPlaylist } from './enhanced-music-context';
import { Button } from '@/components/ui/button';

const TestPlaylistContent: React.FC = () => {
  const { 
    playlists, 
    createVirtualPlaylist, 
    isLoadingPlaylists 
  } = usePlaylist();
  
  const { tracks } = useMusicWithPlaylist();

  const handleCreateTest = async () => {
    await createVirtualPlaylist('测试歌单', '这是一个测试歌单');
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">歌单功能测试</h1>
      
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">当前歌单数量: {playlists.length}</h2>
          <p>音乐库歌曲数量: {tracks.length}</p>
          <p>加载状态: {isLoadingPlaylists ? '加载中...' : '已加载'}</p>
        </div>
        
        <Button onClick={handleCreateTest}>
          创建测试歌单
        </Button>
        
        <div>
          <h3 className="font-semibold">歌单列表:</h3>
          {playlists.length === 0 ? (
            <p className="text-muted-foreground">暂无歌单</p>
          ) : (
            <ul className="space-y-2">
              {playlists.map(playlist => (
                <li key={playlist.id} className="p-2 border rounded">
                  <div className="font-medium">{playlist.name}</div>
                  <div className="text-sm text-muted-foreground">
                    类型: {playlist.type} | 歌曲数: {playlist.trackCount}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

const TestPlaylistPage: React.FC = () => {
  return (
    <MusicProvider>
      <PlaylistProvider>
        <TestPlaylistContent />
      </PlaylistProvider>
    </MusicProvider>
  );
};

export default TestPlaylistPage;