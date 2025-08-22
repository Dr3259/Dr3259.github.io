
"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Music, Plus, ListMusic, Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Trash2, FolderPlus, Trash, Loader2, FileEdit, Repeat, Repeat1, Shuffle } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { saveTrack, getTracksMetadata, deleteTrack, getTrackContent, type TrackMetadata, type TrackWithContent } from '@/lib/db';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Slider } from "@/components/ui/slider";
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
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
    nowPlaying: '正在播放',
    nothingPlaying: '暂无播放',
    noTracks: '您的音乐库是空的。',
    importError: '导入失败，请确保文件是 .flac, .mp3, .wav, .ogg 格式。',
    importSuccess: (title: string) => `成功导入: ${title}`,
    deleteTrack: '删除歌曲',
    editTrack: '编辑信息',
    deleteConfirmation: (title: string) => `您确定要删除《${title}》吗？`,
    trackDeleted: '歌曲已删除',
    trackExists: (title: string) => `歌曲 "${title}" 已存在，已跳过。`,
    importing: '导入中...',
    loadingLibrary: '正在加载您的音乐库...',
    editTrackModal: {
        title: '编辑歌曲信息',
        description: '在这里修改歌曲的分类。',
        categoryLabel: '分类',
        categoryPlaceholder: '例如：古典, 摇滚, 学习用',
        saveButton: '保存',
        cancelButton: '取消',
    },
    playModes: {
      repeat: "列表循环",
      'repeat-one': "单曲循环",
      shuffle: "随机播放",
    }
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
    nowPlaying: 'Now Playing',
    nothingPlaying: 'Nothing Playing',
    noTracks: 'Your music library is empty.',
    importError: 'Import failed. Please ensure it is a .flac, .mp3, .wav, or .ogg file.',
    importSuccess: (title: string) => `Successfully imported: ${title}`,
    deleteTrack: 'Delete track',
    editTrack: 'Edit info',
    deleteConfirmation: (title: string) => `Are you sure you want to delete "${title}"?`,
    trackDeleted: 'Track deleted',
    trackExists: (title: string) => `Track "${title}" already exists. Skipped.`,
    importing: 'Importing...',
    loadingLibrary: 'Loading your music library...',
    editTrackModal: {
        title: 'Edit Track Info',
        description: 'Modify the category for this track.',
        categoryLabel: 'Category',
        categoryPlaceholder: 'E.g. Classical, Rock, Study',
        saveButton: 'Save',
        cancelButton: 'Cancel',
    },
    playModes: {
      repeat: "Repeat All",
      'repeat-one': "Repeat One",
      shuffle: "Shuffle",
    }
  }
};

type LanguageKey = keyof typeof translations;
type PlayMode = 'repeat' | 'repeat-one' | 'shuffle';

const LOCAL_STORAGE_PLAY_MODE_KEY = 'weekglance_play_mode_v1';

const formatDuration = (seconds: number | undefined) => {
    if (seconds === undefined || isNaN(seconds)) return '0:00';
    const floorSeconds = Math.floor(seconds);
    const min = Math.floor(floorSeconds / 60);
    const sec = floorSeconds % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
};

export default function PrivateMusicPlayerPage() {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageKey>('en');
  const [tracks, setTracks] = useState<TrackMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTrack, setCurrentTrack] = useState<TrackMetadata | null>(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.75);
  const [isMuted, setIsMuted] = useState(false);
  const [isClearAlertOpen, setIsClearAlertOpen] = useState(false);
  const [importingTracks, setImportingTracks] = useState<string[]>([]);
  const [editingTrack, setEditingTrack] = useState<TrackMetadata | null>(null);
  const [playMode, setPlayMode] = useState<PlayMode>('repeat');
  const [playHistory, setPlayHistory] = useState<number[]>([]);

  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const currentObjectUrl = useRef<string | null>(null);

  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      const browserLang: LanguageKey = navigator.language.toLowerCase().startsWith('zh') ? 'zh-CN' : 'en';
      setCurrentLanguage(browserLang);
      
      const savedPlayMode = localStorage.getItem(LOCAL_STORAGE_PLAY_MODE_KEY) as PlayMode;
      if (savedPlayMode) {
        setPlayMode(savedPlayMode);
      }
    }
    getTracksMetadata()
      .then(setTracks)
      .catch(console.error)
      .finally(() => setIsLoading(false));

    return () => {
        const audio = audioRef.current;
        if (audio) {
            audio.pause();
            audio.src = '';
        }
        if (currentObjectUrl.current) {
            URL.revokeObjectURL(currentObjectUrl.current);
        }
    }
  }, []);

  const t = useMemo(() => translations[currentLanguage], [currentLanguage]);
  
  const playTrack = useCallback(async (index: number) => {
    if (currentObjectUrl.current) {
        URL.revokeObjectURL(currentObjectUrl.current);
        currentObjectUrl.current = null;
    }

    if (index < 0 || index >= tracks.length) {
      setCurrentTrack(null);
      setCurrentTrackIndex(-1);
      setIsPlaying(false);
      return;
    }

    const trackMeta = tracks[index];
    try {
        const trackWithContent = await getTrackContent(trackMeta.id);
        if (trackWithContent) {
            const blob = new Blob([trackWithContent.content], { type: trackWithContent.type });
            const objectUrl = URL.createObjectURL(blob);
            currentObjectUrl.current = objectUrl;

            setCurrentTrack(trackMeta);
            setCurrentTrackIndex(index);
            
            if(playMode === 'shuffle' && (playHistory.length === 0 || playHistory[playHistory.length -1] !== index)) {
                setPlayHistory(prev => [...prev, index]);
            }

            if(audioRef.current) {
                audioRef.current.src = objectUrl;
                audioRef.current.play().then(() => {
                  setIsPlaying(true);
                }).catch(e => {
                  console.error("Audio play failed:", e)
                  setIsPlaying(false);
                });
            }
        }
    } catch (e) {
        console.error("Failed to play track", e);
    }
  }, [tracks, playMode, playHistory]);

  const handlePlayPause = useCallback(() => {
      if (!currentTrack || !audioRef.current) {
          if(tracks.length > 0) playTrack(0);
          return;
      };
      
      if (isPlaying) {
          audioRef.current.pause();
          setIsPlaying(false);
      } else {
          audioRef.current.play().catch(e => console.error("Audio play failed:", e));
          setIsPlaying(true);
      }
  }, [currentTrack, isPlaying, playTrack, tracks]);

  const handleNextTrack = useCallback(() => {
    if (tracks.length === 0) return;

    if (playMode === 'shuffle') {
        let nextIndex;
        if (tracks.length === 1) {
            nextIndex = 0;
        } else {
            do {
                nextIndex = Math.floor(Math.random() * tracks.length);
            } while (nextIndex === currentTrackIndex);
        }
        playTrack(nextIndex);
        return;
    }

    const nextIndex = (currentTrackIndex + 1) % tracks.length;
    playTrack(nextIndex);
  }, [currentTrackIndex, tracks.length, playTrack, playMode]);
  
  const handlePrevTrack = useCallback(() => {
      if (tracks.length === 0) return;

      if (playMode === 'shuffle') {
        if (playHistory.length > 1) { // Check if there's a history to go back to
          const newHistory = [...playHistory];
          newHistory.pop(); // Remove current track
          const prevIndex = newHistory.pop(); // Get previous track
          setPlayHistory(newHistory);
          if(prevIndex !== undefined) playTrack(prevIndex);
        }
        return;
      }

      const prevIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
      playTrack(prevIndex);
  }, [currentTrackIndex, tracks.length, playTrack, playMode, playHistory]);

  const processAndSaveFile = async (file: File) => {
    const supportedTypes = ['audio/flac', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/mpeg'];
    const fileExtensionMatch = file.name.match(/\.(flac|mp3|wav|ogg)$/i);
    
    const isSupported = supportedTypes.includes(file.type) || fileExtensionMatch;

    if (!isSupported) {
      console.warn(`Unsupported file type: ${file.name} (${file.type})`);
      return;
    }
  
    const fileName = file.name.replace(/\.[^/.]+$/, "");
    let title = fileName;
    let artist: string | undefined = undefined;

    const parts = fileName.split(' - ');
    if (parts.length > 1) {
        artist = parts[0].trim();
        title = parts.slice(1).join(' - ').trim();
    }
    
    if (tracks.some(track => track.title === title && track.artist === artist)) {
      toast({ title: t.trackExists(fileName), variant: 'default', duration: 3000 });
      return;
    }
  
    setImportingTracks(prev => [...prev, fileName]);
  
    try {
      const tempAudioForDuration = document.createElement('audio');
      const tempUrl = URL.createObjectURL(file);
      tempAudioForDuration.src = tempUrl;

      const duration = await new Promise<number>((resolve, reject) => {
          tempAudioForDuration.onloadedmetadata = () => {
              resolve(tempAudioForDuration.duration);
              URL.revokeObjectURL(tempUrl); 
          };
          tempAudioForDuration.onerror = () => {
              reject(new Error("Failed to load audio metadata."));
              URL.revokeObjectURL(tempUrl);
          };
      });

      const arrayBuffer = await file.arrayBuffer();

      const trackId = `track-${Date.now()}-${Math.random()}`;
      const newTrack: TrackWithContent = {
        id: trackId,
        title: title,
        artist: artist,
        type: file.type,
        duration: duration,
        content: arrayBuffer,
        category: null,
      };

      await saveTrack(newTrack);
      setTracks(prev => [...prev, { id: newTrack.id, title: newTrack.title, artist: newTrack.artist, type: newTrack.type, duration: newTrack.duration, category: newTrack.category }]);
      toast({ title: t.importSuccess(fileName), duration: 2000 });

    } catch (error) {
      console.error("Failed to process or save track", error);
      toast({ title: `Error importing ${fileName}`, variant: 'destructive' });
    } finally {
      setImportingTracks(prev => prev.filter(t => t !== fileName));
    }
  };


  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    for (let i = 0; i < files.length; i++) {
        processAndSaveFile(files[i]);
    }
    
    if(fileInputRef.current) fileInputRef.current.value = '';
  };
  
  const handleFolderImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    for (let i = 0; i < files.length; i++) {
        processAndSaveFile(files[i]);
    }

    if(folderInputRef.current) folderInputRef.current.value = '';
  };

  const handleDeleteTrack = async (trackId: string, trackTitle: string) => {
    if (window.confirm(t.deleteConfirmation(trackTitle))) {
        try {
            await deleteTrack(trackId);
            const newTracks = tracks.filter(t => t.id !== trackId);
            setTracks(newTracks);

            if (currentTrack?.id === trackId) {
                if (audioRef.current) audioRef.current.pause();
                const nextIndexToPlay = currentTrackIndex;
                if (newTracks.length === 0) {
                     setCurrentTrack(null);
                     setCurrentTrackIndex(-1);
                     setIsPlaying(false);
                } else if(nextIndexToPlay >= newTracks.length) {
                    playTrack(0);
                } else {
                    playTrack(nextIndexToPlay);
                }
            } else if (currentTrackIndex > newTracks.findIndex(t => t.id === currentTrack?.id)) {
                setCurrentTrackIndex(currentTrackIndex - 1);
            }
            toast({ title: t.trackDeleted });
        } catch (error) {
            console.error("Failed to delete track", error);
        }
    }
  };

  const handleClearPlaylist = async () => {
    if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
    }
    if (currentObjectUrl.current) {
        URL.revokeObjectURL(currentObjectUrl.current);
        currentObjectUrl.current = null;
    }
    setIsPlaying(false);
    setCurrentTrack(null);
    setCurrentTrackIndex(-1);

    try {
        await Promise.all(tracks.map(track => deleteTrack(track.id)));
        setTracks([]);
        toast({ title: t.playlistCleared, duration: 2000 });
    } catch (error) {
        console.error("Failed to clear playlist", error);
        toast({ title: "Error clearing playlist", variant: "destructive" });
    }
  };
  
  const handleProgressChange = (value: number[]) => {
      if(audioRef.current && currentTrack?.duration) {
          audioRef.current.currentTime = (value[0] / 100) * currentTrack.duration;
          setProgress(value[0]);
      }
  }

  const handleVolumeChange = (value: number[]) => {
      if(audioRef.current) {
          const newVolume = value[0] / 100;
          audioRef.current.volume = newVolume;
          setVolume(newVolume);
          if (newVolume > 0 && isMuted) setIsMuted(false);
          if (newVolume === 0 && !isMuted) setIsMuted(true);
      }
  }
  
  const toggleMute = () => {
      if(!audioRef.current) return;
      if(isMuted) {
          audioRef.current.volume = volume > 0 ? volume : 0.5;
          setVolume(volume > 0 ? volume : 0.5);
          setIsMuted(false);
      } else {
          audioRef.current.volume = 0;
          setIsMuted(true);
      }
  }

  const handleVolumeAdjust = useCallback((amount: number) => {
    if (!audioRef.current) return;
    const newVolume = Math.max(0, Math.min(1, audioRef.current.volume + amount));
    audioRef.current.volume = newVolume;
    setVolume(newVolume);
    if (newVolume > 0 && isMuted) {
        setIsMuted(false);
    }
    if (newVolume === 0 && !isMuted) {
        setIsMuted(true);
    }
  }, [isMuted]);

  const handleSaveTrackCategory = async (trackId: string, newCategory: string | null) => {
    const trackToUpdate = tracks.find(t => t.id === trackId);
    if (!trackToUpdate) return;
    
    // We need to fetch the content to re-save it
    const trackWithContent = await getTrackContent(trackId);
    if (!trackWithContent) {
        console.error("Could not find track content to update category.");
        return;
    }
    
    const updatedTrack: TrackWithContent = {
        ...trackWithContent,
        category: newCategory
    };
    await saveTrack(updatedTrack);
    
    const updatedMetadata = { ...trackToUpdate, category: newCategory };
    setTracks(prev => prev.map(t => (t.id === trackId ? updatedMetadata : t)));
    
    if (currentTrack?.id === trackId) {
      setCurrentTrack(updatedMetadata);
    }
    
    setEditingTrack(null);
  };
  
  const cyclePlayMode = () => {
    const modes: PlayMode[] = ['repeat', 'repeat-one', 'shuffle'];
    const currentIndex = modes.indexOf(playMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    const newMode = modes[nextIndex];
    setPlayMode(newMode);
    localStorage.setItem(LOCAL_STORAGE_PLAY_MODE_KEY, newMode);
  };


  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const updateProgress = () => setProgress((audio.currentTime / audio.duration) * 100);
    
    const onEnded = () => {
        if (playMode === 'repeat-one') {
            audio.currentTime = 0;
            audio.play();
        } else {
            handleNextTrack();
        }
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', onEnded);
    
    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', onEnded);
    };
  }, [handleNextTrack, playMode]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const activeElement = document.activeElement;
      if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA' || activeElement.isContentEditable)) {
        return;
      }

      switch (event.key) {
        case ' ':
          event.preventDefault();
          handlePlayPause();
          break;
        case 'ArrowRight':
          handleNextTrack();
          break;
        case 'ArrowLeft':
          handlePrevTrack();
          break;
        case 'ArrowUp':
          event.preventDefault();
          handleVolumeAdjust(0.05);
          break;
        case 'ArrowDown':
          event.preventDefault();
          handleVolumeAdjust(-0.05);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handlePlayPause, handleNextTrack, handlePrevTrack, handleVolumeAdjust]);


  return (
    <>
    <TooltipProvider>
      <div className="flex flex-col h-screen bg-background text-foreground">
        <header className="w-full p-4 border-b flex justify-between items-center shrink-0">
          <Link href="/rest" passHref>
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t.backButton}
            </Button>
          </Link>
          <h1 className="text-xl font-headline font-semibold text-primary">{t.pageTitle}</h1>
          <div>
            <input type="file" accept="audio/flac,audio/mp3,audio/wav,audio/ogg" ref={fileInputRef} onChange={handleFileImport} className="hidden" multiple />
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

        <main className="flex-1 flex flex-col md:flex-row min-h-0">
          <div className="w-full md:w-1/3 border-r p-4 flex flex-col">
            <h2 className="text-lg font-semibold mb-4 flex items-center"><ListMusic className="mr-2 h-5 w-5" /> {t.playlistTitle}</h2>
            <ScrollArea className="flex-1 -mx-4">
              <div className="px-4">
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
                  <ul className="space-y-2">
                    {tracks.map((track, index) => (
                      <li key={track.id} 
                          onClick={() => playTrack(index)} 
                          className={cn("p-3 rounded-md flex justify-between items-center cursor-pointer transition-colors group", currentTrack?.id === track.id ? "bg-primary/20" : "hover:bg-accent/50")}>
                        <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate" title={track.title}>{track.title}</p>
                            <p className="text-xs text-muted-foreground truncate" title={track.artist}>{track.artist}</p>
                            <div className='flex items-center space-x-2 mt-1'>
                                <p className="text-xs text-muted-foreground">{formatDuration(track.duration)}</p>
                                {track.category && <Badge variant="secondary" className="h-4 px-1.5 text-xs">{track.category}</Badge>}
                            </div>
                        </div>
                        <div className="flex items-center gap-1 mr-[-8px]">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary opacity-0 group-hover:opacity-100" onClick={(e) => {e.stopPropagation(); setEditingTrack(track);}}>
                                        <FileEdit className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent><p>{t.editTrack}</p></TooltipContent>
                            </Tooltip>
                             <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100" onClick={(e) => {e.stopPropagation(); handleDeleteTrack(track.id, track.title);}}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent><p>{t.deleteTrack}</p></TooltipContent>
                            </Tooltip>
                        </div>
                      </li>
                    ))}
                    {importingTracks.map(title => (
                       <li key={title} className="p-3 rounded-md flex justify-between items-center opacity-60">
                         <div>
                            <p className="font-medium text-sm truncate" title={title}>{title}</p>
                            <p className="text-xs text-muted-foreground">{t.importing}</p>
                         </div>
                         <Loader2 className="h-4 w-4 animate-spin" />
                       </li>
                    ))}
                  </ul>
                )}
              </div>
            </ScrollArea>
          </div>
          <div className="w-full md:w-2/3 flex flex-col justify-between p-6 bg-muted/20">
              <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                      <Music className={cn("h-48 w-48 text-primary/20 transition-all", isPlaying && "text-primary/40 animate-pulse")} />
                  </div>
              </div>
              <div className="shrink-0 space-y-4">
                  <div className="text-center">
                      <h3 className="text-xl font-semibold truncate" title={currentTrack?.title}>{currentTrack ? currentTrack.title : t.nothingPlaying}</h3>
                      {currentTrack?.artist && <p className="text-sm text-muted-foreground mt-1" title={currentTrack.artist}>{currentTrack.artist}</p>}
                      {currentTrack?.category && <p className="text-sm text-muted-foreground mt-1">{currentTrack.category}</p>}
                  </div>
                  <div className="space-y-2">
                      <Slider value={[progress]} onValueChange={handleProgressChange} max={100} step={1} disabled={!currentTrack}/>
                      <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{formatDuration(audioRef.current?.currentTime)}</span>
                          <span>{formatDuration(currentTrack?.duration)}</span>
                      </div>
                  </div>
                  <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2 w-1/3">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" onClick={toggleMute}>{isMuted ? <VolumeX className="h-5 w-5"/> : <Volume2 className="h-5 w-5"/>}</Button>
                            </TooltipTrigger>
                            <TooltipContent><p>{isMuted ? "Unmute" : "Mute"}</p></TooltipContent>
                        </Tooltip>
                        <Slider value={[isMuted ? 0 : volume * 100]} onValueChange={handleVolumeChange} max={100} step={1} className="w-24"/>
                      </div>
                      <div className="flex items-center justify-center gap-4">
                          <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full" onClick={handlePrevTrack} disabled={tracks.length < 2}><SkipBack className="h-6 w-6" /></Button>
                          <Button size="icon" className="h-16 w-16 rounded-full" onClick={handlePlayPause}>
                            {isPlaying ? <Pause className="h-8 w-8"/> : <Play className="h-8 w-8"/>}
                          </Button>
                          <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full" onClick={handleNextTrack} disabled={tracks.length < 2}><SkipForward className="h-6 w-6"/></Button>
                      </div>
                      <div className="w-1/3 flex justify-end">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" onClick={cyclePlayMode}>
                                    {playMode === 'repeat-one' && <Repeat1 className="h-5 w-5" />}
                                    {playMode === 'shuffle' && <Shuffle className="h-5 w-5" />}
                                    {playMode === 'repeat' && <Repeat className="h-5 w-5" />}
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent><p>{t.playModes[playMode]}</p></TooltipContent>
                        </Tooltip>
                      </div>
                  </div>
              </div>
          </div>
        </main>
        <audio ref={audioRef} />
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
        onSave={handleSaveTrackCategory}
        track={editingTrack}
        translations={t.editTrackModal}
       />
    </>
  );
}
