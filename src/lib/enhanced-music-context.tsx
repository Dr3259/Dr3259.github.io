
// 歌单功能扩展 - 作为现有MusicContext的补充
"use client";

import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useMusic } from '@/context/MusicContext'; // 导入原有的MusicContext
import type { Playlist, VirtualPlaylist, FolderPlaylist, AllMusicPlaylist, PlaylistTrackRef } from './playlist-types';
import type { TrackMetadata } from '@/lib/db';
import { PlaylistDB, FolderScanner } from './playlist-db';

// 歌单专用的Context，与原有MusicContext并存
interface PlaylistContextType {
  // 歌单相关状态
  playlists: Playlist[];
  currentPlaylist: Playlist | null;
  isLoadingPlaylists: boolean;
  showPlaylistSidebar: boolean;
  
  // 歌单操作方法
  createVirtualPlaylist: (name: string, description?: string) => Promise<void>;
  editVirtualPlaylist: (id: string, updates: { name: string; description?: string }) => Promise<void>;
  deletePlaylist: (id: string) => Promise<void>;
  addTrackToPlaylist: (trackId: string, playlistId: string) => Promise<void>;
  removeTrackFromPlaylist: (trackId: string, playlistId: string) => Promise<void>;
  
  // 文件夹歌单操作
  importFolderAsPlaylist: () => Promise<void>;
  refreshFolderPlaylist: (playlistId: string) => Promise<void>;
  
  // 清理操作
  clearAllPlaylists: () => Promise<void>;
  
  // UI控制
  togglePlaylistSidebar: () => void;
  playPlaylist: (playlistId: string) => Promise<void>;
  selectPlaylist: (playlistId: string) => void;
  
  // 拖拽支持
  handleTrackDrop: (trackId: string, targetPlaylistId: string) => Promise<void>;
}

const PlaylistContext = createContext<PlaylistContextType | undefined>(undefined);

export const usePlaylist = () => {
  const context = useContext(PlaylistContext);
  if (!context) {
    throw new Error('usePlaylist must be used within a PlaylistProvider');
  }
  return context;
};

// 组合Hook：同时使用原有音乐功能和新的歌单功能
export const useMusicWithPlaylist = () => {
  const musicContext = useMusic();
  const playlistContext = usePlaylist();
  
  return {
    ...musicContext,
    ...playlistContext,
  };
};

export const PlaylistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [currentPlaylist, setCurrentPlaylist] = useState<Playlist | null>(null);
  const [isLoadingPlaylists, setIsLoadingPlaylists] = useState(true);
  const [showPlaylistSidebar, setShowPlaylistSidebar] = useState(false);
  
  const { toast } = useToast();
  
  // 获取原有的音乐功能，但不修改它们
  const { tracks, playTrack, setPlaybackScope, currentTrack, isPlaying } = useMusic();
  
  // 数据库实例 - 使用useMemo确保只创建一次
  const playlistDB = useMemo(() => new PlaylistDB(), []);
  
  // 检查File System Access API支持
  const isFileSystemAccessSupported = typeof window !== 'undefined' && 'showDirectoryPicker' in window;
  
  // 创建默认的"所有音乐"歌单
  const createAllMusicPlaylist = useCallback((): AllMusicPlaylist => {
    return {
      id: 'all-music',
      name: '所有音乐',
      type: 'all',
      isDefault: true,
      trackCount: tracks.length,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }, [tracks.length]);

  // 初始化加载歌单
  useEffect(() => {
    const loadPlaylists = async () => {
        try {
            setIsLoadingPlaylists(true);
            const userPlaylists = await playlistDB.getAllPlaylists();
            const allMusicPlaylist = createAllMusicPlaylist();

            const allPlaylists = [allMusicPlaylist, ...userPlaylists];
            setPlaylists(allPlaylists);

            if (!currentPlaylist) {
                setCurrentPlaylist(allMusicPlaylist);
            }
        } catch (error) {
            console.error('Failed to load playlists:', error);
        } finally {
            setIsLoadingPlaylists(false);
        }
    };

    loadPlaylists();
  }, []); // 依赖项为空，只在首次加载时运行


  // 当音乐库变化时，更新"所有音乐"歌单的trackCount
  useEffect(() => {
    setPlaylists(prevPlaylists => {
        const hasAllMusic = prevPlaylists.some(p => p.id === 'all-music');
        const updatedPlaylists = prevPlaylists.map(playlist => 
          playlist.id === 'all-music' 
            ? { ...playlist, trackCount: tracks.length, updatedAt: new Date() }
            : playlist
        );
        if (!hasAllMusic) {
            return [createAllMusicPlaylist(), ...updatedPlaylists];
        }
        return updatedPlaylists;
    });
  }, [tracks.length, createAllMusicPlaylist]);

  // 更新当前播放歌曲到歌单的 lastPlayedTrackId
  useEffect(() => {
    if (currentTrack && currentPlaylist) {
        setPlaylists(prev => prev.map(p => 
            p.id === currentPlaylist.id ? { ...p, lastPlayedTrackId: currentTrack.id } : p
        ));
    }
  }, [currentTrack, currentPlaylist]);
  
  // 创建虚拟歌单
  const createVirtualPlaylist = useCallback(async (name: string, description?: string) => {
    // 检查是否存在同名歌单
    if (playlists.some(p => p.name === name.trim())) {
      toast({ title: `歌单 "${name.trim()}" 已存在`, variant: 'destructive' });
      return;
    }
    
    try {
      const newPlaylist = await playlistDB.createVirtualPlaylist(name, description);
      setPlaylists(prev => [...prev, newPlaylist]);
      toast({ title: `歌单 "${name}" 创建成功` });
    } catch (error) {
      console.error('Failed to create playlist:', error);
      toast({ title: '创建歌单失败', variant: 'destructive' });
    }
  }, [toast, playlistDB, playlists]);

  // 编辑虚拟歌单
  const editVirtualPlaylist = useCallback(async (id: string, updates: { name: string; description?: string }) => {
    if (id === 'all-music') {
      toast({ title: '不能编辑默认歌单', variant: 'destructive' });
      return;
    }

    try {
      await playlistDB.updateVirtualPlaylist(id, updates);
      
      setPlaylists(prev => prev.map(p => 
        p.id === id 
          ? { ...p, ...updates, updatedAt: new Date() }
          : p
      ));
      
      // 如果当前选中的是被编辑的歌单，也要更新
      if (currentPlaylist?.id === id) {
        setCurrentPlaylist(prev => prev ? { ...prev, ...updates, updatedAt: new Date() } : null);
      }
      
      toast({ title: `歌单 "${updates.name}" 更新成功` });
    } catch (error) {
      console.error('Failed to edit playlist:', error);
      toast({ title: '更新歌单失败', variant: 'destructive' });
    }
  }, [toast, playlistDB, currentPlaylist]);
  
  // 导入文件夹作为歌单
  const importFolderAsPlaylist = useCallback(async () => {
    if (!isFileSystemAccessSupported) {
      toast({ 
        title: '不支持文件夹导入', 
        description: '您的浏览器不支持文件夹访问功能',
        variant: 'destructive' 
      });
      return;
    }
    
    try {
      setIsLoadingPlaylists(true);
      
      // 让用户选择文件夹
      const dirHandle = await window.showDirectoryPicker();
      
      // 扫描文件夹
      const scanner = new FolderScanner();
      const { tracks: scannedTracks, totalFiles } = await scanner.scanFolder(dirHandle);
      
      // 创建文件夹歌单
      const folderPlaylist: FolderPlaylist = {
        id: `folder-${Date.now()}`,
        name: dirHandle.name,
        type: 'folder',
        folderPath: dirHandle.name,
        folderHandle: dirHandle,
        lastScanTime: new Date(),
        autoRefresh: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        trackCount: scannedTracks.length,
      };
      
      setPlaylists(prev => [...prev, folderPlaylist]);
      
      toast({ 
        title: `文件夹歌单创建成功`,
        description: `从 "${dirHandle.name}" 中发现 ${scannedTracks.length} 首歌曲（共 ${totalFiles} 个文件）`
      });
      
    } catch (error) {
      if (error instanceof DOMException && error.name !== 'AbortError') {
        toast({ title: '导入文件夹失败', variant: 'destructive' });
      }
    } finally {
      setIsLoadingPlaylists(false);
    }
  }, [isFileSystemAccessSupported, toast]);
  
  // 刷新文件夹歌单
  const refreshFolderPlaylist = useCallback(async (playlistId: string) => {
    const playlist = playlists.find(p => p.id === playlistId);
    if (!playlist || playlist.type !== 'folder') return;
    
    try {
      setIsLoadingPlaylists(true);
      
      const folderPlaylist = playlist as FolderPlaylist;
      if (!folderPlaylist.folderHandle) {
        toast({ title: '无法访问文件夹', variant: 'destructive' });
        return;
      }
      
      // 重新扫描文件夹
      const scanner = new FolderScanner();
      const { tracks: scannedTracks } = await scanner.scanFolder(folderPlaylist.folderHandle);
      
      // 更新歌单信息
      const updatedPlaylist: FolderPlaylist = {
        ...folderPlaylist,
        trackCount: scannedTracks.length,
        lastScanTime: new Date(),
        updatedAt: new Date(),
      };
      
      setPlaylists(prev => prev.map(p => p.id === playlistId ? updatedPlaylist : p));
      
      toast({ 
        title: `歌单已刷新`,
        description: `发现 ${scannedTracks.length} 首歌曲`
      });
      
    } catch (error) {
      toast({ title: '刷新歌单失败', variant: 'destructive' });
    } finally {
      setIsLoadingPlaylists(false);
    }
  }, [playlists, toast]);
  
  // 添加歌曲到虚拟歌单
  const addTrackToPlaylist = useCallback(async (trackId: string, playlistId: string) => {
    const playlist = playlists.find(p => p.id === playlistId);
    if (!playlist || playlist.type !== 'virtual') {
      toast({ title: '只能添加到虚拟歌单', variant: 'destructive' });
      return;
    }
    
    const virtualPlaylist = playlist as VirtualPlaylist;
    const trackExists = virtualPlaylist.tracks.some(ref => ref.trackId === trackId);
    
    if (trackExists) {
      toast({ title: '歌曲已在歌单中' });
      return;
    }
    
    try {
      await playlistDB.addTrackToVirtualPlaylist(trackId, playlistId);
      
      // 更新本地状态
      const updatedPlaylist: VirtualPlaylist = {
        ...virtualPlaylist,
        tracks: [...virtualPlaylist.tracks, { trackId, addedAt: new Date(), order: virtualPlaylist.tracks.length }],
        trackCount: virtualPlaylist.trackCount + 1,
        updatedAt: new Date(),
      };
      
      setPlaylists(prev => prev.map(p => p.id === playlistId ? updatedPlaylist : p));
      toast({ title: '已添加到歌单' });
    } catch (error) {
      console.error('Failed to add track to playlist:', error);
      toast({ title: '添加失败', variant: 'destructive' });
    }
  }, [playlists, toast, playlistDB]);
  
  // 拖拽处理
  const handleTrackDrop = useCallback(async (trackId: string, targetPlaylistId: string) => {
    await addTrackToPlaylist(trackId, targetPlaylistId);
  }, [addTrackToPlaylist]);
  
  // 播放歌单 - 与原有播放功能集成
  const playPlaylist = useCallback(async (playlistId: string) => {
    const playlist = playlists.find(p => p.id === playlistId);
    if (!playlist) return;

    // 智能切换逻辑：如果是切换到"所有音乐"，并且当前有歌曲在播放，则保持当前歌曲继续播放
    if (playlist.id === 'all-music' && currentTrack && isPlaying) {
      setCurrentPlaylist(playlist);
      setPlaybackScope(tracks); // 将播放范围扩大到所有音乐
      // 不改变当前播放的歌曲
      return;
    }

    setCurrentPlaylist(playlist);
    
    let tracksToPlay: TrackMetadata[] = [];
    if (playlist.type === 'all') {
        tracksToPlay = tracks;
    } else if (playlist.type === 'virtual') {
        tracksToPlay = (playlist as VirtualPlaylist).tracks
            .map(ref => tracks.find(t => t.id === ref.trackId))
            .filter((t): t is TrackMetadata => !!t);
    } else if (playlist.type === 'folder') {
        toast({ title: '文件夹歌单播放尚未实现', variant: 'destructive' });
        return;
    }
    
    if (tracksToPlay.length > 0) {
        setPlaybackScope(tracksToPlay);
        const lastPlayedId = playlist.lastPlayedTrackId;
        let trackToPlayIndex = tracks.findIndex(t => t.id === lastPlayedId);

        if (trackToPlayIndex === -1 || !tracksToPlay.some(t => t.id === lastPlayedId)) {
            const firstTrackId = tracksToPlay[0].id;
            trackToPlayIndex = tracks.findIndex(t => t.id === firstTrackId);
        }

        if (trackToPlayIndex !== -1) {
            playTrack(trackToPlayIndex);
        }

    } else {
        toast({ title: '歌单为空', variant: 'destructive' });
        setPlaybackScope([]);
    }
  }, [playlists, tracks, playTrack, toast, setPlaybackScope, currentTrack, isPlaying]);
  
  // 切换歌单侧边栏显示
  const togglePlaylistSidebar = useCallback(() => {
    setShowPlaylistSidebar(prev => !prev);
  }, []);

  // 选择歌单（不播放，只是选中显示）
  const selectPlaylist = useCallback((playlistId: string) => {
    const playlist = playlists.find(p => p.id === playlistId);
    if (playlist) {
      setCurrentPlaylist(playlist);
      let tracksToShow: TrackMetadata[] = [];
      if (playlist.type === 'all') {
          tracksToShow = tracks;
      } else if (playlist.type === 'virtual') {
          tracksToShow = (playlist as VirtualPlaylist).tracks
              .map(ref => tracks.find(t => t.id === ref.trackId))
              .filter((t): t is TrackMetadata => !!t);
      }
      setPlaybackScope(tracksToShow);
    }
  }, [playlists, tracks, setPlaybackScope]);
  
  const value: PlaylistContextType = {
    playlists,
    currentPlaylist,
    isLoadingPlaylists,
    showPlaylistSidebar,
    
    createVirtualPlaylist,
    editVirtualPlaylist,
    deletePlaylist: async (id: string) => {
      // 不能删除"所有音乐"歌单
      if (id === 'all-music') {
        toast({ title: '不能删除默认歌单', variant: 'destructive' });
        return;
      }
      
      try {
        const playlistToDelete = playlists.find(p => p.id === id);
        if (playlistToDelete?.type === 'virtual') {
            await playlistDB.deleteVirtualPlaylist(id);
        }

        setPlaylists(prev => prev.filter(p => p.id !== id));
        if (currentPlaylist?.id === id) {
          setCurrentPlaylist(null);
        }
        toast({ title: '歌单已删除' });
      } catch (error) {
        console.error('Failed to delete playlist:', error);
        toast({ title: '删除失败', variant: 'destructive' });
      }
    },
    addTrackToPlaylist,
    removeTrackFromPlaylist: async (trackId: string, playlistId: string) => {
      try {
        await playlistDB.removeTrackFromVirtualPlaylist(trackId, playlistId);
        
        // 更新本地状态
        setPlaylists(prev => prev.map(p => {
          if (p.id === playlistId && p.type === 'virtual') {
            const virtualPlaylist = p as VirtualPlaylist;
            return {
              ...virtualPlaylist,
              tracks: virtualPlaylist.tracks.filter(ref => ref.trackId !== trackId),
              trackCount: virtualPlaylist.trackCount - 1,
              updatedAt: new Date(),
            };
          }
          return p;
        }));
        
        toast({ title: '已从歌单中移除' });
      } catch (error) {
        console.error('Failed to remove track from playlist:', error);
        toast({ title: '移除失败', variant: 'destructive' });
      }
    },
    importFolderAsPlaylist,
    refreshFolderPlaylist,
    clearAllPlaylists: async () => {
      try {
        // 删除所有虚拟歌单（除了"所有音乐"歌单）
        const virtualPlaylists = playlists.filter(p => p.type === 'virtual' && p.id !== 'all-music');
        await Promise.all(virtualPlaylists.map(p => playlistDB.deleteVirtualPlaylist(p.id)));
        
        // 重置歌单状态，只保留"所有音乐"歌单
        const allMusicPlaylist = createAllMusicPlaylist();
        setPlaylists([allMusicPlaylist]);
        setCurrentPlaylist(null);
        
        toast({ title: '所有歌单已清空' });
      } catch (error) {
        console.error('Failed to clear all playlists:', error);
        toast({ title: '清空歌单失败', variant: 'destructive' });
      }
    },
    togglePlaylistSidebar,
    playPlaylist,
    selectPlaylist,
    handleTrackDrop,
  };
  
  return (
    <PlaylistContext.Provider value={value}>
      {children}
    </PlaylistContext.Provider>
  );
};
