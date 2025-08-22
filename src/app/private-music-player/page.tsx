
"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Music, Plus, ListMusic, Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Trash2, FolderPlus, Trash } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { saveTrack, getTracksMetadata, deleteTrack, getTrackContent, type TrackMetadata, type TrackWithContent } from '@/lib/db';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Slider } from "@/components/ui/slider";
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
} from "@/components/ui/alert-dialog";


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
    deleteConfirmation: (title: string) => `您确定要删除《${title}》吗？`,
    trackDeleted: '歌曲已删除',
    trackExists: (title: string) => `歌曲 "${title}" 已存在，已跳过。`,
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
    deleteConfirmation: (title: string) => `Are you sure you want to delete "${title}"?`,
    trackDeleted: 'Track deleted',
    trackExists: (title: string) => `Track "${title}" already exists. Skipped.`,
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

export default function PrivateMusicPlayerPage() {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageKey>('en');
  const [tracks, setTracks] = useState<TrackMetadata[]>([]);
  const [currentTrack, setCurrentTrack] = useState<TrackWithContent | null>(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.75);
  const [isMuted, setIsMuted] = useState(false);
  const [isClearAlertOpen, setIsClearAlertOpen] = useState(false);

  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      const browserLang: LanguageKey = navigator.language.toLowerCase().startsWith('zh') ? 'zh-CN' : 'en';
      setCurrentLanguage(browserLang);
    }
    getTracksMetadata().then(setTracks).catch(console.error);
  }, []);

  const t = useMemo(() => translations[currentLanguage], [currentLanguage]);
  
  const playTrack = useCallback(async (index: number) => {
    if (index < 0 || index >= tracks.length) {
      setCurrentTrack(null);
      setCurrentTrackIndex(-1);
      setIsPlaying(false);
      return;
    }
    const trackMeta = tracks[index];
    try {
        const trackContent = await getTrackContent(trackMeta.id);
        if (trackContent) {
            setCurrentTrack(trackContent);
            setCurrentTrackIndex(index);
            setIsPlaying(true);
            if(audioRef.current) {
                audioRef.current.src = trackContent.content;
                audioRef.current.play().catch(e => console.error("Audio play failed:", e));
            }
        }
    } catch (e) {
        console.error("Failed to play track", e);
    }
  }, [tracks]);

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
      const nextIndex = currentTrackIndex + 1;
      if(nextIndex < tracks.length) {
          playTrack(nextIndex);
      } else {
          // loop back to the beginning
          playTrack(0);
      }
  }, [currentTrackIndex, tracks.length, playTrack]);
  
  const handlePrevTrack = useCallback(() => {
      const prevIndex = currentTrackIndex - 1;
      if (prevIndex >= 0) {
          playTrack(prevIndex);
      } else {
          // loop to the end
          playTrack(tracks.length - 1);
      }
  }, [currentTrackIndex, tracks.length, playTrack]);

  const processAndSaveFile = (file: File) => {
    const supportedTypes = ['audio/flac', 'audio/mp3', 'audio/wav', 'audio/ogg'];
    if (!supportedTypes.includes(file.type) && !file.name.match(/\.(flac|mp3|wav|ogg)$/i)) {
      return;
    }

    const trackTitle = file.name.replace(/\.[^/.]+$/, "");
    const isDuplicate = tracks.some(track => track.title === trackTitle);

    if (isDuplicate) {
        toast({ title: t.trackExists(trackTitle), variant: 'default', duration: 3000 });
        return;
    }
    
    const reader = new FileReader();
    reader.onload = async (e) => {
        const content = e.target?.result as string;
        
        const tempAudio = document.createElement('audio');
        tempAudio.src = content;
        tempAudio.onloadedmetadata = async () => {
            const trackId = `track-${Date.now()}-${Math.random()}`; // Add random to avoid collision in fast loops
            const newTrack: TrackWithContent = {
              id: trackId,
              title: trackTitle,
              type: file.type,
              duration: tempAudio.duration,
              content: content,
            };

            try {
              await saveTrack(newTrack);
              setTracks(prev => [...prev, { id: newTrack.id, title: newTrack.title, type: newTrack.type, duration: newTrack.duration }]);
              toast({ title: t.importSuccess(newTrack.title), duration: 2000 });
            } catch (error) {
              console.error("Failed to save track", error);
              toast({ title: `Error saving ${newTrack.title}`, variant: 'destructive' });
            }
        }
    };
    reader.onerror = () => {
        toast({ title: t.importError, variant: 'destructive' });
    }
    reader.readAsDataURL(file);
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

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const updateProgress = () => setProgress((audio.currentTime / audio.duration) * 100);
    const onEnded = () => handleNextTrack();

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', onEnded);
    
    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', onEnded);
    };
  }, [handleNextTrack]);

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
                {tracks.length > 0 ? (
                  <ul className="space-y-2">
                    {tracks.map((track, index) => (
                      <li key={track.id} 
                          onClick={() => playTrack(index)} 
                          className={cn("p-3 rounded-md flex justify-between items-center cursor-pointer transition-colors group", currentTrack?.id === track.id ? "bg-primary/20" : "hover:bg-accent/50")}>
                        <div>
                            <p className="font-medium text-sm truncate" title={track.title}>{track.title}</p>
                            <p className="text-xs text-muted-foreground">{formatDuration(track.duration)}</p>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100" onClick={(e) => {e.stopPropagation(); handleDeleteTrack(track.id, track.title);}}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center text-muted-foreground py-20">
                    <Music className="h-12 w-12 mx-auto mb-4" />
                    <p>{t.noTracks}</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
          <div className="w-full md:w-2/3 flex flex-col justify-between p-6">
              <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                      <Music className={cn("h-48 w-48 text-primary/20 transition-all", isPlaying && "text-primary/40 animate-pulse")} />
                  </div>
              </div>
              <div className="shrink-0 space-y-4">
                  <div className="text-center">
                      <h3 className="text-xl font-semibold">{currentTrack ? currentTrack.title : t.nothingPlaying}</h3>
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
                        <Button variant="ghost" size="icon" onClick={toggleMute}>{isMuted ? <VolumeX className="h-5 w-5"/> : <Volume2 className="h-5 w-5"/>}</Button>
                        <Slider value={[isMuted ? 0 : volume * 100]} onValueChange={handleVolumeChange} max={100} step={1} className="w-24"/>
                      </div>
                      <div className="flex items-center justify-center gap-4">
                          <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full" onClick={handlePrevTrack} disabled={tracks.length < 2}><SkipBack className="h-6 w-6" /></Button>
                          <Button size="icon" className="h-16 w-16 rounded-full" onClick={handlePlayPause}>
                            {isPlaying ? <Pause className="h-8 w-8"/> : <Play className="h-8 w-8"/>}
                          </Button>
                          <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full" onClick={handleNextTrack} disabled={tracks.length < 2}><SkipForward className="h-6 w-6"/></Button>
                      </div>
                      <div className="w-1/3"></div>
                  </div>
              </div>
          </div>
        </main>
        <audio ref={audioRef} />
      </div>
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
    </>
  );
}
