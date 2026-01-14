// 增强版音乐播放器页面 - 在原有功能基础上添加歌单功能
"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ListMusic, Sidebar } from 'lucide-react';
import { cn } from '@/lib/utils';

// 导入原有的音乐播放器页面组件
import OriginalMusicPlayerPage from '@/app/private-music-player/page';

// 导入新的歌单功能
import { PlaylistProvider, usePlaylist } from '@/lib/enhanced-music-context';
import { PlaylistGrid } from './playlist-grid';
import { CreatePlaylistModal } from './create-playlist-modal';

// 内部组件：带歌单功能的播放器
const EnhancedPlayerContent: React.FC = () => {
  const {
    playlists,
    currentPlaylist,
    isLoadingPlaylists,
    createVirtualPlaylist,
    importFolderAsPlaylist,
    playPlaylist,
    refreshFolderPlaylist,
    deletePlaylist,
    handleTrackDrop,
  } = usePlaylist();

  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleCreatePlaylist = async (name: string, description?: string) => {
    await createVirtualPlaylist(name, description);
    setShowCreateModal(false);
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* 原有的音乐播放器内容 - 修改为嵌入式 */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0 relative">
        {/* 左侧：播放列表区域 */}
        <div className="w-full md:w-1/3 border-r p-4 flex flex-col z-[2] bg-background/50 md:bg-transparent backdrop-blur-sm md:backdrop-blur-none">
          {/* 这里会放置原有的播放列表内容 */}
          <OriginalMusicPlayerPage />
        </div>
        
        {/* 右侧：可视化和控制区域 */}
        <div className="w-full md:w-2/3 flex flex-col justify-between p-6 bg-transparent z-[2]">
          {/* 歌单网格 - 放在播放控制区域上方 */}
          <div className="flex-1 mb-6">
            <PlaylistGrid
              playlists={playlists}
              currentPlaylist={currentPlaylist}
              isLoadingPlaylists={isLoadingPlaylists}
              isPlaying={false}
              onPlayPlaylist={playPlaylist}
              onSelectPlaylist={playPlaylist}
              onEditPlaylist={() => {}}
              onDownloadPlaylist={() => {}}
              onRefreshFolderPlaylist={refreshFolderPlaylist}
              onDeletePlaylist={deletePlaylist}
              onTrackDrop={handleTrackDrop}
              onChangePlaylistImage={() => {}}
              onUploadPlaylistImage={() => {}}
              onResetImage={() => {}}
            />
          </div>
          
          {/* 播放控制区域 - 保持在底部 */}
          <div className="shrink-0 space-y-3 p-4 rounded-lg bg-background/60 backdrop-blur-md border border-border/50 shadow-lg">
            {/* 这里会放置原有的播放控制内容 */}
            <div className="text-center text-muted-foreground">
              <p>播放控制区域</p>
              <p className="text-xs">原有的播放控制界面会在这里</p>
            </div>
          </div>
        </div>
      </div>

      {/* 创建歌单模态框 */}
      <CreatePlaylistModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onConfirm={handleCreatePlaylist}
      />
    </div>
  );
};

// 主组件：包装原有功能
const EnhancedMusicPlayerPage: React.FC = () => {
  return (
    <PlaylistProvider>
      <EnhancedPlayerContent />
    </PlaylistProvider>
  );
};

export default EnhancedMusicPlayerPage;
