
"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Music, Plus, ListMusic, Play, Pause, SkipForward, SkipBack, Volume2, Volume1, Volume, VolumeX, Trash2, FolderPlus, Trash, Loader2, FileEdit, Repeat, Repeat1, Shuffle, ChevronUp, ChevronDown } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn, getTagColor, getHighContrastTextColor } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { EditTrackModal } from '@/components/EditTrackModal';
import { Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useMusic } from '@/context/MusicContext';
import type { TrackMetadata } from '@/lib/db';
import { MusicVisualizer } from '@/components/MusicVisualizer';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';


const translations = {
  'zh-CN': {
    pageTitle: '私人音乐播放器',
    backButton: '返回休闲驿站',
    importMusic: '导入音乐',
    importFile: '导入文件',
    importFolder: '导入文件夹',
    clearPlaylist: '清空列表',
    clearPlaylistConfirmationTitle: '确认清空',
    clearPlaylistConfirmationDescription: '此操作将永久删除您的所有本地音乐，且无法恢复。您确定要继续吗？',
    confirmClear: '确认',
    cancelClear: '取消',
    playlistCleared: '播放列表已清空',
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
  },
  'en': {
    pageTitle: 'Private Music Player',
    backButton: 'Back to Rest Stop',
    importMusic: 'Import Music',
    importFile: 'Import File(s)',
    importFolder: 'Import Folder',
    clearPlaylist: 'Clear Playlist',
    clearPlaylistConfirmationTitle: 'Confirm Clear',
    clearPlaylistConfirmationDescription: 'This will permanently delete all your local music and cannot be undone. Are you sure you want to continue?',
    confirmClear: 'Confirm',
    cancelClear: 'Cancel',
    playlistCleared: 'Playlist cleared',
    playlistTitle: 'Playlist',
    totalTracks: (count: number) => `(${count})`,
    nowPlaying: 'Now Playing',
    nothingPlaying: 'Nothing Playing',
    noTracks: 'Your music library is empty.',
    importError: 'Import failed. Please ensure it is a .flac, .mp3, .wav, or .ogg file.',
    importSuccess: (count: number) => `Successfully imported ${count} new track(s).`,
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
        artistPlaceholder: 'E.g. John Doe',
        titleLabel: 'Title',
        titlePlaceholder: 'E.g. My Great Song',
    },
    playModes: {
      repeat: "Repeat All",
      'repeat-one': "Repeat One",
      shuffle: "Shuffle",
    },
    volumeUp: 'Volume Up',
    volumeDown: 'Volume Down',
    volumeTooltip: "Volume (Use arrow keys to adjust)",
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


export default function PrivateMusicPlayerPage() {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageKey>('en');
  const [isClearAlertOpen, setIsClearAlertOpen] = useState(false);
  const [editingTrack, setEditingTrack] = useState<TrackMetadata | null>(null);

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
    handleVolumeChange,
    toggleMute,
    handleFileImport,
    handleFolderImport,
    handleDeleteTrack,
    handleClearPlaylist,
    handleSaveTrackMeta,
    cyclePlayMode,
    handleVolumeAdjust,
  } = useMusic();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      const browserLang: LanguageKey = navigator.language.toLowerCase().startsWith('zh') ? 'zh-CN' : 'en';
      setCurrentLanguage(browserLang);
    }
  }, []);

  const t = useMemo(() => translations[currentLanguage], [currentLanguage]);

  useEffect(() => {
    if (currentTrack && scrollAreaRef.current) {
        const trackElement = document.getElementById(`track-item-${currentTrack.id}`);
        const scrollContainer = scrollAreaRef.current;
        
        if(trackElement && scrollContainer) {
            const trackRect = trackElement.getBoundingClientRect();
            const containerRect = scrollContainer.getBoundingClientRect();
            
            const isVisible = trackRect.top >= containerRect.top && trackRect.bottom <= containerRect.bottom;

            if (!isVisible) {
                trackElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }
        }
    }
  }, [currentTrack]);


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
          <div>
            <input type="file" accept="audio/*" ref={fileInputRef} onChange={handleFileImport} className="hidden" multiple />
            <input type="file" ref={folderInputRef} onChange={handleFolderImport} className="hidden" {...{webkitdirectory: "", directory: ""}} />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button><Plus className="mr-2 h-4 w-4" />{t.importMusic}</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => fileInputRef.current?.click()}>
                      <Music className="mr-2 h-4 w-4" />
                      <span>{t.importFile}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => folderInputRef.current?.click()}>
                      <FolderPlus className="mr-2 h-4 w-4" />
                      <span>{t.importFolder}</span>
                  </DropdownMenuItem>
                  {tracks.length > 0 && (
                    <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setIsClearAlertOpen(true)} className="text-destructive focus:text-destructive">
                           <Trash className="mr-2 h-4 w-4" />
                           <span>{t.clearPlaylist}</span>
                        </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 flex flex-col md:flex-row min-h-0 relative">
          <MusicVisualizer isPlaying={isPlaying} category={currentTrack?.category || null} />
          <div className="w-full md:w-1/3 border-r p-4 flex flex-col z-[2] bg-background/50 md:bg-transparent backdrop-blur-sm md:backdrop-blur-none">
            <h2 className="flex items-center mb-4 text-lg font-semibold leading-none">
              <ListMusic className="h-5 w-5 mr-2 shrink-0" />
              <span>
                {t.playlistTitle}
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  {t.totalTracks(tracks.length)}
                </span>
              </span>
            </h2>
            <ScrollArea className="flex-1 -mx-4" ref={scrollAreaRef}>
                <ul className="space-y-2 p-px px-4">
                  {isLoading ? (
                    <div className="text-center text-muted-foreground py-20 flex flex-col items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin mb-4" />
                      <p>{t.loadingLibrary}</p>
                    </div>
                  ) : tracks.length === 0 && importingTracks.length === 0 ? (
                    <div className="text-center text-muted-foreground py-20">
                      <Music className="h-12 w-12 mx-auto mb-4" />
                      <p>{t.noTracks}</p>
                    </div>
                  ) : (
                    <>
                      {tracks.map((track, index) => (
                        <li key={track.id}
                            id={`track-item-${track.id}`}
                            onClick={() => playTrack(index)} 
                            className={cn("p-3 rounded-md flex justify-between items-center cursor-pointer transition-colors group", currentTrack?.id === track.id ? "bg-primary/20" : "hover:bg-accent/50")}>
                          <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate" title={track.title}>{track.title}</p>
                              <p className="text-xs text-muted-foreground truncate" title={track.artist}>{track.artist}</p>
                              <div className='flex items-center space-x-2 mt-1.5 flex-wrap gap-y-1'>
                                  <p className="text-xs text-muted-foreground">{formatDuration(track.duration)}</p>
                                  {track.category?.split(',').map(cat => cat.trim()).filter(Boolean).map(cat => {
                                      const bgColor = getTagColor(cat);
                                      const textColor = getHighContrastTextColor(bgColor);
                                      return (
                                          <Badge
                                              key={cat}
                                              variant="secondary"
                                              className="border-transparent"
                                              style={{ backgroundColor: bgColor, color: textColor }}
                                          >
                                              {cat}
                                          </Badge>
                                      )
                                  })}
                              </div>
                          </div>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity" style={{ marginRight: '-8px' }}>
                              <Tooltip>
                                  <TooltipTrigger asChild>
                                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={(e) => {e.stopPropagation(); setEditingTrack(track);}}>
                                          <FileEdit className="h-4 w-4" />
                                      </Button>
                                  </TooltipTrigger>
                                  <TooltipContent><p>{t.editTrack}</p></TooltipContent>
                              </Tooltip>
                          </div>
                        </li>
                      ))}
                      {importingTracks.length > 0 && (
                         <li className="p-3 rounded-md flex justify-between items-center opacity-60">
                           <div>
                              <p className="font-medium text-sm truncate">{t.importing}</p>
                           </div>
                           <Loader2 className="h-4 w-4 animate-spin" />
                         </li>
                      )}
                    </>
                  )}
                </ul>
            </ScrollArea>
          </div>
          <div className="w-full md:w-2/3 flex flex-col justify-end p-6 bg-transparent z-[2]">
              <div className="shrink-0 space-y-3 p-4 rounded-lg bg-background/60 backdrop-blur-md border border-border/50 shadow-lg">
                <div className="w-full px-2 flex items-center gap-4">
                    <div className='flex-1 space-y-2'>
                        <Slider value={[progress || 0]} onValueChange={handleProgressChange} max={100} step={0.1} disabled={!currentTrack}/>
                        <div className="flex justify-between text-xs text-muted-foreground font-mono">
                            <span>{formatDuration(audioRef.current?.currentTime)}</span>
                            <span>{formatDuration(currentTrack?.duration)}</span>
                        </div>
                    </div>
                     <Popover>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <PopoverTrigger asChild>
                                     <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full" onClick={toggleMute}>
                                        <VolumeIcon volume={volume} isMuted={isMuted} />
                                     </Button>
                                </PopoverTrigger>
                            </TooltipTrigger>
                            <TooltipContent><p>{t.volumeTooltip}</p></TooltipContent>
                        </Tooltip>
                        <PopoverContent className="w-56 p-2">
                           <Slider value={[isMuted ? 0 : volume * 100]} onValueChange={handleVolumeChange} max={100} step={1} />
                        </PopoverContent>
                    </Popover>
                </div>
                  
                <div className="flex justify-center items-center gap-2">
                  <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full" onClick={handlePrevTrack} disabled={tracks.length < 2}><SkipBack className="h-6 w-6" /></Button>
                  <Button size="icon" className="h-16 w-16 rounded-full" onClick={handlePlayPause}>
                    {isPlaying ? <Pause className="h-8 w-8"/> : <Play className="h-8 w-8"/>}
                  </Button>
                  <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full" onClick={handleNextTrack} disabled={tracks.length < 2}><SkipForward className="h-6 w-6"/></Button>
                  <Tooltip>
                      <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full" onClick={cyclePlayMode}>
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
        </main>
      </div>
      </TooltipProvider>
      <AlertDialog open={isClearAlertOpen} onOpenChange={setIsClearAlertOpen}>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>{t.clearPlaylistConfirmationTitle}</AlertDialogTitle>
            <AlertDialogDescription>
                {t.clearPlaylistConfirmationDescription}
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel>{t.cancelClear}</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
                handleClearPlaylist();
                setIsClearAlertOpen(false);
            }}>
                {t.confirmClear}
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
    </>
  );
}
