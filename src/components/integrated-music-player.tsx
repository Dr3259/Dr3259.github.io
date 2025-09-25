"use client";

// 集成歌单功能的音乐播放器 - 在原有基础上添加歌单区域

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Music, Plus, ListMusic, Play, Pause, SkipForward, SkipBack, Volume2, Volume1, Volume, VolumeX, Trash2, FolderPlus, Trash, Loader2, FileEdit, Repeat, Repeat1, Shuffle, ChevronUp, ChevronDown, Upload } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { EditTrackModal } from '@/components/EditTrackModal';
import { Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useMusicWithPlaylist } from '@/lib/enhanced-music-context';
import type { TrackMetadata } from '@/lib/db';
import { MusicVisualizer } from '@/components/MusicVisualizer';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { getTagColor, getHighContrastTextColor } from '@/lib/utils';

// 导入歌单功能
import { PlaylistGrid } from './playlist-grid';
import { CreatePlaylistModal } from './create-playlist-modal';
import { EditPlaylistModal } from './EditPlaylistModal';
import { DraggableTrackItem } from './draggable-track-item';
import { exportPlaylistToText, downloadTextFile, generateSafeFilename } from '@/lib/playlist-export';
import type { VirtualPlaylist } from '@/lib/playlist-types';

const translations = {
  'zh-CN': {
    pageTitle: 'Self音乐播放',
    backButton: '返回',
    createPlaylist: '创建歌单',
    importMusic: '导入音乐',
    importFile: '导入文件',
    importFolder: '导入文件夹',
    importLimitTitle: '导入提示',
    importLimitDescription: '为确保浏览器稳定运行，建议单次导入的歌曲数量不要超过 50 首。',
    importLimitConfirm: '我明白了',
    deleteAllTracks: '删除所有音乐和歌单',
    deleteAllTracksConfirmationTitle: '确认删除所有音乐和歌单',
    deleteAllTracksConfirmationDescription: '⚠️ 危险操作：此操作将永久删除您的所有本地音乐文件，同时清空所有自定义歌单（包括歌单名称、描述等信息），且无法恢复。只会保留默认的"所有音乐"歌单。您确定要继续吗？',
    confirmClear: '确认',
    cancelClear: '取消',
    playlistTitle: '播放列表',
    totalTracks: (count: number) => `(${count} 首)`,
    nowPlaying: '正在播放',
    nothingPlaying: '暂无播放',
    noTracks: '您的音乐库是空的。',
    importError: '导入失败，请确保文件是 .flac, .mp3, .wav, .ogg 格式。',
    importSuccess: (count: number) => `成功导入 ${count} 首新歌曲。`,
    deleteTrack: '删除歌曲',
    editTrack: '编辑信息',
    deleteConfirmation: (title: string) => `您确定要删除《${title}》吗？`,
    trackDeleted: '歌曲已删除',
    trackExists: (title: string) => `歌曲 "${title}" 已存在，已跳过。`,
    importing: '导入中...',
    loadingLibrary: '正在加载您的音乐库...',
    editTrackModal: {
        title: '编辑歌曲信息',
        description: '在这里修改歌曲的元数据。',
        categoryLabel: '分类',
        categoryPlaceholder: '例如：古典, 摇滚, 学习用',
        saveButton: '保存',
        cancelButton: '取消',
        artistLabel: '艺术家',
        artistPlaceholder: '例如：周杰伦',
        titleLabel: '标题',
        titlePlaceholder: '例如：青花瓷',
    },
    playModes: {
      repeat: "列表循环",
      'repeat-one': "单曲循环",
      shuffle: "随机播放",
    },
    volumeUp: '增大音量',
    volumeDown: '减小音量',
    volumeTooltip: "音量 (可用方向键调节)",
    unmute: '取消静音',
    mute: '静音'
  },
   'en': {
    pageTitle: 'Self Music Player',
    backButton: 'Back',
    createPlaylist: 'Create Playlist',
    importMusic: 'Import Music',
    importFile: 'Import File(s)',
    importFolder: 'Import Folder',
    importLimitTitle: 'Import Tip',
    importLimitDescription: 'To ensure browser stability, it is recommended to import no more than 50 songs at a time.',
    importLimitConfirm: 'I Understand',
    deleteAllTracks: 'Delete All Tracks & Playlists',
    deleteAllTracksConfirmationTitle: 'Confirm Deletion of All Tracks and Playlists',
    deleteAllTracksConfirmationDescription: '⚠️ DANGEROUS ACTION: This will permanently delete all your local music files and clear all custom playlists (including names, descriptions, etc.), and cannot be undone. Only the default "All Music" playlist will remain. Are you sure you want to continue?',
    confirmClear: 'Confirm',
    cancelClear: 'Cancel',
    playlistTitle: 'Playlist',
    totalTracks: (count: number) => `(${count} tracks)`,
    nowPlaying: 'Now Playing',
    nothingPlaying: 'Nothing Playing',
    noTracks: 'Your music library is empty.',
    importError: 'Import failed. Please ensure it is a .flac, .mp3, .wav, or .ogg file.',
    importSuccess: (count: number) => `Successfully imported ${count} new tracks.`,
    deleteTrack: 'Delete track',
    editTrack: 'Edit info',
    deleteConfirmation: (title: string) => `Are you sure you want to delete "${title}"?`,
    trackDeleted: 'Track deleted',
    trackExists: (title: string) => `Track "${title}" already exists. Skipped.`,
    importing: 'Importing...',
    loadingLibrary: 'Loading your music library...',
    editTrackModal: {
        title: 'Edit Track Info',
        description: 'Modify the metadata for this track.',
        categoryLabel: 'Category',
        categoryPlaceholder: 'E.g. Classical, Rock, Study',
        saveButton: 'Save',
        cancelButton: 'Cancel',
        artistLabel: 'Artist',
        artistPlaceholder: 'E.g. Jay Chou',
        titleLabel: 'Title',
        titlePlaceholder: 'E.g. Blue and White Porcelain',
    },
    playModes: {
      repeat: "Repeat All",
      'repeat-one': "Repeat One",
      shuffle: "Shuffle",
    },
    volumeUp: 'Volume Up',
    volumeDown: 'Volume Down',
    volumeTooltip: "Volume (use arrow keys)",
    unmute: 'Unmute',
    mute: 'Mute'
  }
};

type LanguageKey = keyof typeof translations;

const formatDuration = (seconds: number | undefined) => {
    if (seconds === undefined || isNaN(seconds)) return '0:00';
    const floorSeconds = Math.floor(seconds);
    const min = Math.floor(floorSeconds / 60);
    const sec = floorSeconds % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
};

// A new component to dynamically render the volume icon
const VolumeIcon = ({ volume, isMuted }: { volume: number; isMuted: boolean }) => {
    if (isMuted || volume === 0) {
        return <VolumeX className="h-6 w-6" />;
    }
    if (volume < 0.33) {
        return <Volume className="h-6 w-6" />;
    }
    if (volume < 0.66) {
        return <Volume1 className="h-6 w-6" />;
    }
    return <Volume2 className="h-6 w-6" />;
};

export default function IntegratedMusicPlayerPage() {
  const { toast } = useToast();
  const [currentLanguage, setCurrentLanguage] = useState<LanguageKey>('zh-CN');
  const [isDeleteAllAlertOpen, setIsDeleteAllAlertOpen] = useState(false);
  const [isImportFileAlertOpen, setIsImportFileAlertOpen] = useState(false);
  const [isImportFolderAlertOpen, setIsImportFolderAlertOpen] = useState(false);
  const [isImportDropdownOpen, setIsImportDropdownOpen] = useState(false);
  const [editingTrack, setEditingTrack] = useState<TrackMetadata | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPlaylist, setEditingPlaylist] = useState<VirtualPlaylist | null>(null);

  // 音乐和歌单功能
  const {
    tracks,
    currentTrack,
    isPlaying,
    progress,
    volume,
    isMuted,
    isLoading,
    importingTracks,
    playMode,
    audioRef,
    playTrack,
    handlePlayPause,
    handleNextTrack,
    handlePrevTrack,
    handleProgressChange,
    handleVolumeAdjust,
    toggleMute,
    handleFileImport,
    handleFolderImport,
    handleDeleteTrack,
    handleDeleteAllTracks,
    handleSaveTrackMeta,
    cyclePlayMode,
    closePlayer,
    setPlaybackScope,
    playlists,
    currentPlaylist,
    isLoadingPlaylists,
    createVirtualPlaylist,
    editVirtualPlaylist,
    updatePlaylistImageSeed,
    playPlaylist,
    selectPlaylist,
    refreshFolderPlaylist,
    deletePlaylist,
    clearAllPlaylists,
    handleTrackDrop,
    removeTrackFromPlaylist,
  } = useMusicWithPlaylist();

  // 根据当前选中的歌单获取要显示的歌曲列表
  const displayTracks = useMemo(() => {
    console.log('displayTracks useMemo recalculating...');
    console.log('currentPlaylist:', currentPlaylist);
    
    if (!currentPlaylist) {
      console.log('No current playlist, returning all tracks:', tracks.length);
      return tracks;
    }
    if (currentPlaylist.type === 'all') {
      console.log('All music playlist, returning all tracks:', tracks.length);
      return tracks;
    }
    if (currentPlaylist.type === 'virtual') {
      const virtualPlaylist = currentPlaylist as VirtualPlaylist;
      const result = virtualPlaylist.tracks
        .map(ref => tracks.find(t => t.id === ref.trackId))
        .filter((track): track is TrackMetadata => track !== undefined);
      console.log('Virtual playlist tracks:', virtualPlaylist.tracks.length, 'found tracks:', result.length);
      return result;
    }
    console.log('Unknown playlist type, returning empty array');
    return [];
  }, [currentPlaylist, tracks]);

  useEffect(() => {
    setPlaybackScope(displayTracks);
  }, [displayTracks, setPlaybackScope]);

  const handlePlayTrack = useCallback((displayIndex: number) => {
    const trackToPlay = displayTracks[displayIndex];
    if (trackToPlay) {
      const originalIndex = tracks.findIndex(t => t.id === trackToPlay.id);
      if (originalIndex >= 0) {
        playTrack(originalIndex);
      }
    }
  }, [displayTracks, tracks, playTrack]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const t = useMemo(() => translations[currentLanguage], [currentLanguage]);

  // 滚动到当前播放歌曲的逻辑
  const scrollToCurrentTrack = useCallback(() => {
    if (currentTrack && scrollAreaRef.current) {
        const timer = setTimeout(() => {
            const trackElement = document.getElementById(`track-item-${currentTrack.id}`);
            const scrollContainer = scrollAreaRef.current;
            
            if (trackElement && scrollContainer) {
                const trackRect = trackElement.getBoundingClientRect();
                const containerRect = scrollContainer.getBoundingClientRect();
                
                // 检查元素是否在可视区域内
                const isVisible = trackRect.top >= containerRect.top && 
                                trackRect.bottom <= containerRect.bottom;

                if (!isVisible) {
                    trackElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center',
                        inline: 'nearest'
                    });
                }
            }
        }, 100);
        
        return () => clearTimeout(timer);
    }
  }, [currentTrack]);

  // 当前播放歌曲变化时滚动
  useEffect(() => {
    const cleanup = scrollToCurrentTrack();
    return cleanup;
  }, [scrollToCurrentTrack]);

  // 当切换到"所有音乐"歌单时也滚动到当前播放歌曲
  useEffect(() => {
    if (currentPlaylist?.type === 'all' && currentTrack) {
        const cleanup = scrollToCurrentTrack();
        return cleanup;
    }
  }, [currentPlaylist, scrollToCurrentTrack]);

  const handleCreatePlaylist = async (name: string, description?: string) => {
    await createVirtualPlaylist(name, description);
    setShowCreateModal(false);
  };

  const handleEditPlaylist = (playlistId: string) => {
    const playlist = playlists.find(p => p.id === playlistId);
    if (playlist && playlist.type === 'virtual') {
      setEditingPlaylist(playlist as VirtualPlaylist);
    }
  };

  const handleUpdatePlaylist = async (name: string, description?: string) => {
    if (editingPlaylist) {
      await editVirtualPlaylist(editingPlaylist.id, { name, description });
      setEditingPlaylist(null);
    }
  };

  const handleDeleteAllTracksAndPlaylists = async () => {
    try {
      await handleDeleteAllTracks();
      await clearAllPlaylists();
    } catch (error) {
      console.error('Failed to delete all tracks and playlists:', error);
    }
  };

  const handleRemoveTrackFromPlaylist = useCallback(async (trackId: string) => {
    console.log('=== handleRemoveTrackFromPlaylist called ===');
    console.log('trackId:', trackId);
    console.log('currentPlaylist:', currentPlaylist);
    
    if (!currentPlaylist || currentPlaylist.type !== 'virtual') {
      console.log('Not in virtual playlist, cannot remove');
      return;
    }

    const track = tracks.find(t => t.id === trackId);
    if (!track) {
      console.log('Track not found');
      return;
    }

    // 检查是否正在移除当前播放的歌曲
    const isRemovingCurrentTrack = currentTrack?.id === trackId;
    console.log('Is removing current track:', isRemovingCurrentTrack);

    try {
      console.log('Removing track from playlist...');
      console.log('Calling removeTrackFromPlaylist with:', { trackId, playlistId: currentPlaylist.id });
      
      await removeTrackFromPlaylist(trackId, currentPlaylist.id);
      
      console.log('Successfully removed track from playlist');
      console.log('Current playlist after removal:', currentPlaylist);
      console.log('Display tracks length should update now');
      
      // 如果移除的是当前播放的歌曲，需要处理播放状态
      if (isRemovingCurrentTrack) {
        console.log('Removed track was currently playing, handling playback...');
        
        // 获取更新后的歌单歌曲列表
        const updatedPlaylist = currentPlaylist as VirtualPlaylist;
        const remainingTracks = updatedPlaylist.tracks
          .filter(ref => ref.trackId !== trackId)
          .map(ref => tracks.find(t => t.id === ref.trackId))
          .filter((t): t is TrackMetadata => t !== undefined);
        
        if (remainingTracks.length > 0) {
          // 如果歌单还有其他歌曲，播放第一首
          console.log('Playing first remaining track in playlist');
          const firstTrackIndex = tracks.findIndex(t => t.id === remainingTracks[0].id);
          if (firstTrackIndex >= 0) {
            playTrack(firstTrackIndex);
          }
        } else {
          // 如果歌单已空，停止播放
          console.log('Playlist is now empty, stopping playback');
          closePlayer();
        }
      }
      
      toast({ title: `已从歌单中移除《${track.title}》` });
    } catch (error) {
      console.error('Failed to remove track from playlist:', error);
      console.error('Error details:', error);
      toast({ title: '移除失败', variant: 'destructive' });
    }
  }, [currentPlaylist, tracks, removeTrackFromPlaylist, toast, currentTrack, playTrack, closePlayer]);

  const handleDownloadPlaylist = (playlistId: string) => {
    const playlist = playlists.find(p => p.id === playlistId);
    if (!playlist) {
      toast({ title: '歌单不存在', variant: 'destructive' });
      return;
    }

    try {
      const textContent = exportPlaylistToText(playlist, tracks);
      const filename = generateSafeFilename(playlist.name);
      downloadTextFile(textContent, filename);
      toast({ title: `歌单信息已导出: ${filename}` });
    } catch (error) {
      console.error('Failed to download playlist:', error);
      toast({ title: '导出失败', variant: 'destructive' });
    }
  };

  const handlePlaylistPlayPause = async (playlistId: string) => {
    if (currentPlaylist?.id === playlistId && currentTrack) {
      handlePlayPause();
    } else {
      await playPlaylist(playlistId);
    }
  };

  const handleChangePlaylistImage = (playlistId: string) => {
    updatePlaylistImageSeed(playlistId);
  };

  const handleResetPlaylistImage = (playlistId: string) => {
    const playlist = playlists.find(p => p.id === playlistId);
    if (!playlist || (playlist.type !== 'virtual' && playlist.type !== 'all')) {
      toast({ title: '只能重置虚拟歌单和所有音乐歌单的图片', variant: 'destructive' });
      return;
    }

    try {
      // 清除自定义封面图片，恢复到随机生成的图片
      if (playlist.type === 'virtual') {
        editVirtualPlaylist(playlistId, { 
          name: playlist.name, 
          description: (playlist as VirtualPlaylist).description,
          coverImage: undefined 
        });
      } else if (playlist.type === 'all') {
        // 对于"所有音乐"歌单，清除localStorage中的图片
        localStorage.removeItem('all-music-playlist-coverImage');
        // 刷新页面来重新加载歌单状态
        window.location.reload();
      }
      
      toast({ title: '歌单图片已重置' });
    } catch (error) {
      console.error('Failed to reset playlist image:', error);
      toast({ title: '重置图片失败', variant: 'destructive' });
    }
  };

  const handleUploadPlaylistImage = (playlistId: string) => {
    const playlist = playlists.find(p => p.id === playlistId);
    if (!playlist || (playlist.type !== 'virtual' && playlist.type !== 'all')) {
      toast({ title: '只能为虚拟歌单和所有音乐歌单上传图片', variant: 'destructive' });
      return;
    }

    // 创建文件输入元素
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.style.display = 'none';
    
    input.onchange = async (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      // 检查文件大小（限制为 5MB）
      if (file.size > 5 * 1024 * 1024) {
        toast({ title: '图片文件过大，请选择小于 5MB 的图片', variant: 'destructive' });
        return;
      }
      
      // 检查文件类型
      if (!file.type.startsWith('image/')) {
        toast({ title: '请选择有效的图片文件', variant: 'destructive' });
        return;
      }
      
      try {
        // 将图片转换为 base64
        const reader = new FileReader();
        reader.onload = async (e) => {
          const base64Image = e.target?.result as string;
          
          try {
            // 更新歌单的封面图片
            if (playlist.type === 'virtual') {
              await editVirtualPlaylist(playlistId, { 
                name: playlist.name, 
                description: (playlist as VirtualPlaylist).description,
                coverImage: base64Image 
              });
            } else if (playlist.type === 'all') {
              // 对于"所有音乐"歌单，使用localStorage保存
              localStorage.setItem('all-music-playlist-coverImage', base64Image);
              // 刷新页面来重新加载歌单状态
              window.location.reload();
            }
            
            toast({ title: '歌单图片上传成功' });
          } catch (error) {
            console.error('Failed to update playlist image:', error);
            toast({ title: '上传图片失败', variant: 'destructive' });
          }
        };
        
        reader.onerror = () => {
          toast({ title: '读取图片文件失败', variant: 'destructive' });
        };
        
        reader.readAsDataURL(file);
      } catch (error) {
        console.error('Failed to process image:', error);
        toast({ title: '处理图片失败', variant: 'destructive' });
      }
    };
    
    // 触发文件选择
    document.body.appendChild(input);
    input.click();
    document.body.removeChild(input);
  };



  const currentTrackOriginalIndex = useMemo(() => {
    if (!currentTrack) return -1;
    return tracks.findIndex(t => t.id === currentTrack.id);
  }, [currentTrack, tracks]);


  return (
    <>
    <TooltipProvider>
      <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden">
        <header className="w-full p-4 border-b flex justify-between items-center shrink-0 z-20 bg-background/80 backdrop-blur-sm">
          <Link href="/rest" passHref>
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t.backButton}
            </Button>
          </Link>
          <h1 className="text-xl font-headline font-semibold text-primary">{t.pageTitle}</h1>
          <div className="flex items-center gap-3">
              <Button 
                variant="outline"
                className="border-border/50 hover:border-border/80"
                onClick={() => setShowCreateModal(true)}
              >
                  <Plus className="mr-2 h-4 w-4" />{t.createPlaylist}
              </Button>

              <DropdownMenu open={isImportDropdownOpen} onOpenChange={setIsImportDropdownOpen}>
                  <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="border-border/50 hover:border-border/80">
                          <Upload className="mr-2 h-4 w-4" />{t.importMusic}
                      </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                      <AlertDialog open={isImportFileAlertOpen} onOpenChange={setIsImportFileAlertOpen}>
                          <AlertDialogTrigger asChild>
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                  <Music className="mr-2 h-4 w-4" />
                                  <span>{t.importFile}</span>
                              </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                              <AlertDialogHeader>
                                  <AlertDialogTitle>{t.importLimitTitle}</AlertDialogTitle>
                                  <AlertDialogDescription>{t.importLimitDescription}</AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                  <AlertDialogCancel>取消</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => {
                                    fileInputRef.current?.click();
                                    setIsImportFileAlertOpen(false);
                                    setIsImportDropdownOpen(false);
                                  }}>{t.importLimitConfirm}</AlertDialogAction>
                              </AlertDialogFooter>
                          </AlertDialogContent>
                      </AlertDialog>
                      <AlertDialog open={isImportFolderAlertOpen} onOpenChange={setIsImportFolderAlertOpen}>
                          <AlertDialogTrigger asChild>
                             <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                  <FolderPlus className="mr-2 h-4 w-4" />
                                  <span>{t.importFolder}</span>
                              </DropdownMenuItem>
                          </AlertDialogTrigger>
                           <AlertDialogContent>
                              <AlertDialogHeader>
                                  <AlertDialogTitle>{t.importLimitTitle}</AlertDialogTitle>
                                  <AlertDialogDescription>{t.importLimitDescription}</AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                  <AlertDialogCancel>取消</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => {
                                    folderInputRef.current?.click();
                                    setIsImportFolderAlertOpen(false);
                                    setIsImportDropdownOpen(false);
                                  }}>{t.importLimitConfirm}</AlertDialogAction>
                              </AlertDialogFooter>
                          </AlertDialogContent>
                      </AlertDialog>
                    {tracks.length > 0 && (
                      <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => setIsDeleteAllAlertOpen(true)} className="text-destructive focus:text-destructive">
                             <Trash2 className="mr-2 h-4 w-4" />
                             <span>{t.deleteAllTracks}</span>
                          </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
              </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 flex flex-col md:flex-row min-h-0 relative">
          <MusicVisualizer isPlaying={isPlaying} category={currentTrack?.category || null} />
          
          <div className="w-full md:w-1/4 border-r p-4 flex flex-col z-[2] bg-background/50 md:bg-transparent backdrop-blur-sm md:backdrop-blur-none">
            <h2 className="flex items-center mb-4 text-lg font-semibold leading-none">
              <ListMusic className="h-5 w-5 mr-2 shrink-0" />
              <span>
                {currentPlaylist ? currentPlaylist.name : t.playlistTitle}
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  {t.totalTracks(displayTracks.length)}
                </span>
              </span>
              {importingTracks.length > 0 && (
                <div className="ml-3 flex items-center text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  <span className="text-sm">{t.importing}</span>
                </div>
              )}
            </h2>
            <ScrollArea className="flex-1 -mx-4" ref={scrollAreaRef}>
                <ul className="space-y-2 p-px px-4">
                  {isLoading ? (
                    <div className="text-center text-muted-foreground py-20 flex flex-col items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin mb-4" />
                      <p>{t.loadingLibrary}</p>
                    </div>
                  ) : displayTracks.length === 0 && importingTracks.length === 0 ? (
                    <div className="text-center text-muted-foreground py-20">
                      <Music className="h-12 w-12 mx-auto mb-4" />
                      <p>{currentPlaylist ? `歌单"${currentPlaylist.name}"是空的` : t.noTracks}</p>
                    </div>
                  ) : (
                    <>
                      {displayTracks.map((track, index) => (
                        <DraggableTrackItem
                          key={track.id}
                          track={track}
                          index={index}
                          allPlaylists={playlists}
                          isCurrentTrack={currentTrack?.id === track.id}
                          isInVirtualPlaylist={currentPlaylist?.type === 'virtual'}
                          onPlay={() => handlePlayTrack(index)}
                          onEdit={() => setEditingTrack(track)}
                          onDelete={() => handleDeleteTrack(track.id, track.title)}
                          onRemoveFromPlaylist={
                            currentPlaylist?.type === 'virtual' 
                              ? () => handleRemoveTrackFromPlaylist(track.id, currentPlaylist.id)
                              : undefined
                          }
                        />
                      ))}
                    </>
                  )}
                </ul>
            </ScrollArea>
          </div>
          
          <div className="w-full md:w-3/4 flex flex-col p-6 bg-transparent z-[2] min-h-0">
              <div className="flex-1 mb-6 overflow-y-auto">
                <PlaylistGrid
                  playlists={playlists}
                  currentPlaylist={currentPlaylist}
                  isLoadingPlaylists={isLoadingPlaylists}
                  isPlaying={isPlaying}
                  onPlayPlaylist={handlePlaylistPlayPause}
                  onSelectPlaylist={selectPlaylist}
                  onEditPlaylist={handleEditPlaylist}
                  onDownloadPlaylist={handleDownloadPlaylist}
                  onRefreshFolderPlaylist={refreshFolderPlaylist}
                  onDeletePlaylist={deletePlaylist}
                  onTrackDrop={handleTrackDrop}
                  onChangePlaylistImage={handleChangePlaylistImage}
                  onUploadPlaylistImage={handleUploadPlaylistImage}
                  onResetImage={handleResetPlaylistImage}
                />
              </div>
              
              <div className="shrink-0 space-y-3 p-4 rounded-lg bg-background/60 backdrop-blur-md border border-border/50 shadow-lg">
                <div className="space-y-2">
                    <Slider value={[progress || 0]} onValueChange={handleProgressChange} max={100} step={0.1} disabled={!currentTrack}/>
                    <div className="flex justify-between text-xs text-muted-foreground font-mono">
                        <span>{formatDuration(audioRef.current?.currentTime)}</span>
                        <span>{formatDuration(currentTrack?.duration)}</span>
                    </div>
                </div>
                  
                <div className="flex justify-between items-center gap-4">
                    <div className="flex items-center gap-1 w-1/3">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" onClick={toggleMute} className="h-10 w-10">
                                    <VolumeIcon volume={volume} isMuted={isMuted} />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent><p>{isMuted ? t.unmute : t.mute}</p></TooltipContent>
                        </Tooltip>
                        <div className="flex flex-col items-center">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-5 w-5 rounded-sm hover:bg-accent" onClick={() => handleVolumeAdjust(0.1)} aria-label={t.volumeUp}>
                                        <ChevronUp className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent><p>{t.volumeUp}</p></TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-5 w-5 rounded-sm hover:bg-accent" onClick={() => handleVolumeAdjust(-0.1)} aria-label={t.volumeDown}>
                                        <ChevronDown className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent><p>{t.volumeDown}</p></TooltipContent>
                            </Tooltip>
                        </div>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                        <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full hover:bg-accent" onClick={handlePrevTrack} disabled={tracks.length < 2}><SkipBack className="h-6 w-6" /></Button>
                        <Button size="icon" className="h-16 w-16 rounded-full" onClick={handlePlayPause}>
                          {isPlaying ? <Pause className="h-8 w-8"/> : <Play className="h-8 w-8"/>}
                        </Button>
                        <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full hover:bg-accent" onClick={handleNextTrack} disabled={tracks.length < 2}><SkipForward className="h-6 w-6"/></Button>
                    </div>
                    <div className="w-1/3 flex justify-end">
                      <Tooltip>
                          <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full hover:bg-accent" onClick={cyclePlayMode}>
                                  {playMode === 'repeat-one' && <Repeat1 className="h-6 w-6" />}
                                  {playMode === 'shuffle' && <Shuffle className="h-6 w-6" />}
                                  {playMode === 'repeat' && <Repeat className="h-6 w-6" />}
                              </Button>
                          </TooltipTrigger>
                          <TooltipContent><p>{t.playModes[playMode]}</p></TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
              </div>
          </div>
        </main>
      </div>
      </TooltipProvider>

      <input type="file" accept="audio/flac,audio/mp3,audio/wav,audio/ogg" ref={fileInputRef} onChange={handleFileImport} className="hidden" multiple />
      <input type="file" ref={folderInputRef} onChange={handleFolderImport} className="hidden" {...({webkitdirectory: "", directory: ""} as any)} />

      <AlertDialog open={isDeleteAllAlertOpen} onOpenChange={setIsDeleteAllAlertOpen}>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>{t.deleteAllTracksConfirmationTitle}</AlertDialogTitle>
            <AlertDialogDescription>
                {t.deleteAllTracksConfirmationDescription}
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel>{t.cancelClear}</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                handleDeleteAllTracksAndPlaylists();
                setIsDeleteAllAlertOpen(false);
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
                {t.deleteAllTracks}
            </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <EditTrackModal
        isOpen={!!editingTrack}
        onClose={() => setEditingTrack(null)}
        onSave={handleSaveTrackMeta}
        onDelete={handleDeleteTrack}
        track={editingTrack}
        translations={t.editTrackModal}
       />

      <CreatePlaylistModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onConfirm={handleCreatePlaylist}
      />

      <EditPlaylistModal
        isOpen={!!editingPlaylist}
        onClose={() => setEditingPlaylist(null)}
        onConfirm={handleUpdatePlaylist}
        onDelete={editingPlaylist ? () => deletePlaylist(editingPlaylist.id) : undefined}
        playlist={editingPlaylist}
      />
    </>
  );
}
