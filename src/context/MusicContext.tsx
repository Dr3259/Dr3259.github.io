

"use client";

import React, { createContext, useContext, useState, useRef, useEffect, useCallback, type ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import { saveTrack, getTracksMetadata, deleteTrack, getTrackContent, type TrackMetadata, type TrackWithContent } from '@/lib/db';

type PlayMode = 'repeat' | 'repeat-one' | 'shuffle';

interface MusicContextType {
    tracks: TrackMetadata[];
    currentTrack: TrackMetadata | null;
    currentTrackIndex: number;
    isPlaying: boolean;
    progress: number;
    volume: number;
    isMuted: boolean;
    playMode: PlayMode;
    isLoading: boolean;
    importingTracks: string[];
    audioRef: React.RefObject<HTMLAudioElement>;

    playTrack: (index: number) => void;
    handlePlayPause: () => void;
    handleNextTrack: () => void;
    handlePrevTrack: () => void;
    handleProgressChange: (value: number[]) => void;
    handleVolumeAdjust: (amount: number) => void;
    toggleMute: () => void;
    handleFileImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleFolderImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleDeleteTrack: (trackId: string, trackTitle: string) => Promise<void>;
    handleClearPlaylist: () => Promise<void>;
    handleDeleteAllTracks: () => Promise<void>;
    handleSaveTrackMeta: (trackId: string, meta: { title: string, artist: string | undefined, category: string | null }) => void;
    cyclePlayMode: () => void;
    closePlayer: () => void;
    
    // 播放范围控制
    setPlaybackScope: (scopeTracks: TrackMetadata[]) => void;
    playbackScope: TrackMetadata[] | null;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const useMusic = () => {
    const context = useContext(MusicContext);
    if (!context) {
        throw new Error('useMusic must be used within a MusicProvider');
    }
    return context;
};

const LOCAL_STORAGE_PLAY_MODE_KEY = 'weekglance_play_mode_v1';
const LOCAL_STORAGE_VOLUME_KEY = 'weekglance_volume_v1';

export const MusicProvider = ({ children }: { children: ReactNode }) => {
    const [tracks, setTracks] = useState<TrackMetadata[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentTrack, setCurrentTrack] = useState<TrackMetadata | null>(null);
    const [currentTrackIndex, setCurrentTrackIndex] = useState(-1);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [volume, setVolume] = useState(0.75);
    const [isMuted, setIsMuted] = useState(false);
    const [importingTracks, setImportingTracks] = useState<string[]>([]);
    const [playMode, setPlayMode] = useState<PlayMode>('repeat');
    const [playHistory, setPlayHistory] = useState<number[]>([]);
    const [playbackScope, setPlaybackScope] = useState<TrackMetadata[] | null>(null);

    const { toast } = useToast();
    const audioRef = useRef<HTMLAudioElement>(null);
    const currentObjectUrl = useRef<string | null>(null);

    // Initial load
    useEffect(() => {
        const savedPlayMode = localStorage.getItem(LOCAL_STORAGE_PLAY_MODE_KEY) as PlayMode;
        if (savedPlayMode) setPlayMode(savedPlayMode);
        
        const savedVolume = localStorage.getItem(LOCAL_STORAGE_VOLUME_KEY);
        if (savedVolume) setVolume(parseFloat(savedVolume));
        
        getTracksMetadata()
            .then(setTracks)
            .catch(() => {})
            .finally(() => setIsLoading(false));
        
        if (!audioRef.current) {
            (audioRef as React.MutableRefObject<HTMLAudioElement>).current = new Audio();
        }

        return () => {
            const audio = audioRef.current;
            if (audio) {
                audio.pause();
                audio.src = '';
            }
            if (currentObjectUrl.current) URL.revokeObjectURL(currentObjectUrl.current);
        }
    }, []);
    
    // Set audio element volume when component loads or volume state changes
    useEffect(() => {
        if(audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);
    
    const playTrack = useCallback(async (index: number) => {
        if (currentObjectUrl.current) URL.revokeObjectURL(currentObjectUrl.current);

        if (index < 0 || index >= tracks.length) {
            setCurrentTrack(null);
            setCurrentTrackIndex(-1);
            setIsPlaying(false);
            return;
        }

        const trackMeta = tracks[index];
        try {
            const trackWithContent = await getTrackContent(trackMeta.id);
            if (trackWithContent && audioRef.current) {
                const blob = new Blob([trackWithContent.content], { type: trackWithContent.type });
                const objectUrl = URL.createObjectURL(blob);
                currentObjectUrl.current = objectUrl;

                setCurrentTrack(trackMeta);
                setCurrentTrackIndex(index);
                
                if(playMode === 'shuffle' && (playHistory.length === 0 || playHistory[playHistory.length - 1] !== index)) {
                    setPlayHistory(prev => [...prev, index]);
                }

                audioRef.current.src = objectUrl;
                audioRef.current.play().catch(() => {
                    setIsPlaying(false);
                });
            }
        } catch (e) {
            // Silently fail
        }
    }, [tracks, playMode, playHistory]);

    const handlePlayPause = useCallback(() => {
        if (!currentTrack || !audioRef.current) {
            if(tracks.length > 0) playTrack(0);
            return;
        };
        
        if (isPlaying) audioRef.current.pause();
        else audioRef.current.play().catch(() => {});
    }, [currentTrack, isPlaying, playTrack, tracks]);

    const handleNextTrack = useCallback(() => {
        // 使用播放范围或全局tracks
        const effectiveTracks = playbackScope || tracks;
        if (effectiveTracks.length === 0) return;

        if (playMode === 'repeat-one') {
            // Repeat the current track
            if (currentTrack) {
                playTrack(currentTrackIndex);
            }
            return;
        }

        if (playMode === 'shuffle') {
            if (effectiveTracks.length <= 1) {
                // 如果播放范围内只有一首歌，重复播放
                if (currentTrack) {
                    playTrack(currentTrackIndex);
                }
                return;
            }

            // 在播放范围内随机选择下一首歌
            const scopeTrackIds = effectiveTracks.map(t => t.id);
            const availableIndices = tracks
                .map((track, index) => ({ track, index }))
                .filter(({ track, index }) => 
                    scopeTrackIds.includes(track.id) && 
                    index !== currentTrackIndex
                )
                .map(({ index }) => index);

            if (availableIndices.length > 0) {
                const randomIndex = Math.floor(Math.random() * availableIndices.length);
                playTrack(availableIndices[randomIndex]);
            } else {
                // 如果没有其他可播放的歌曲，重复当前歌曲
                playTrack(currentTrackIndex);
            }
            return;
        }

        // Default 'repeat' logic - 在播放范围内循环
        const scopeTrackIds = effectiveTracks.map(t => t.id);
        const scopeIndices = tracks
            .map((track, index) => ({ track, index }))
            .filter(({ track }) => scopeTrackIds.includes(track.id))
            .map(({ index }) => index)
            .sort((a, b) => a - b); // 保持原始顺序
        
        if (scopeIndices.length === 0) return;
        
        const currentScopeIndex = scopeIndices.indexOf(currentTrackIndex);
        if (currentScopeIndex === -1) {
            // 当前歌曲不在播放范围内，播放范围内的第一首
            playTrack(scopeIndices[0]);
        } else {
            // 播放范围内的下一首
            const nextScopeIndex = (currentScopeIndex + 1) % scopeIndices.length;
            playTrack(scopeIndices[nextScopeIndex]);
        }
    }, [currentTrackIndex, tracks, playTrack, playMode, currentTrack, playbackScope]);
  
    const handlePrevTrack = useCallback(() => {
        // 使用播放范围或全局tracks
        const effectiveTracks = playbackScope || tracks;
        if (effectiveTracks.length === 0) return;

        if (playMode === 'shuffle') {
            if (playHistory.length > 1) {
                const newHistory = [...playHistory];
                newHistory.pop();
                const prevIndex = newHistory.pop();
                setPlayHistory(newHistory);
                if(prevIndex !== undefined) playTrack(prevIndex);
            }
            return;
        }

        // 在播放范围内循环到上一首
        const scopeTrackIds = effectiveTracks.map(t => t.id);
        const scopeIndices = tracks
            .map((track, index) => ({ track, index }))
            .filter(({ track }) => scopeTrackIds.includes(track.id))
            .map(({ index }) => index)
            .sort((a, b) => a - b); // 保持原始顺序
        
        if (scopeIndices.length === 0) return;
        
        const currentScopeIndex = scopeIndices.indexOf(currentTrackIndex);
        if (currentScopeIndex === -1) {
            // 当前歌曲不在播放范围内，播放范围内的最后一首
            playTrack(scopeIndices[scopeIndices.length - 1]);
        } else {
            // 播放范围内的上一首
            const prevScopeIndex = (currentScopeIndex - 1 + scopeIndices.length) % scopeIndices.length;
            playTrack(scopeIndices[prevScopeIndex]);
        }
    }, [currentTrackIndex, tracks, playTrack, playMode, playHistory, playbackScope]);

    const processFiles = async (files: FileList) => {
        setImportingTracks(['loading']); // Show a generic loading indicator
        
        const processFile = (file: File, order: number): Promise<TrackWithContent | null> => {
            return new Promise(async (resolve) => {
                const supportedTypes = ['audio/flac', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/mpeg'];
                if (!supportedTypes.some(type => file.type.startsWith(type.split('/')[0]))) {
                    resolve(null);
                    return;
                }

                const fileName = file.name.replace(/\.[^/.]+$/, "");
                let title = fileName, artist: string | undefined = undefined;
                const parts = fileName.split(' - ');
                if (parts.length > 1) {
                    artist = parts[0].trim();
                    title = parts.slice(1).join(' - ').trim();
                }

                if (tracks.some(track => track.title === title && track.artist === artist)) {
                    toast({ title: `歌曲 "${fileName}" 已存在，已跳过。`, variant: 'default', duration: 3000 });
                    resolve(null);
                    return;
                }

                try {
                    const tempAudioForDuration = document.createElement('audio');
                    const tempUrl = URL.createObjectURL(file);
                    tempAudioForDuration.src = tempUrl;

                    const duration = await new Promise<number>((res, rej) => {
                        tempAudioForDuration.onloadedmetadata = () => res(tempAudioForDuration.duration);
                        tempAudioForDuration.onerror = () => rej(new Error("无法加载音频元数据。"));
                    }).finally(() => URL.revokeObjectURL(tempUrl));

                    const arrayBuffer = await file.arrayBuffer();
                    const blobContent = new Blob([arrayBuffer], { type: file.type });
                    const trackId = `track-${Date.now()}-${Math.random()}`;
                    
                    resolve({
                        id: trackId, title, artist, type: file.type, duration, content: blobContent, category: null, createdAt: new Date(), order
                    });

                } catch (error) {
                    toast({ title: `导入 ${fileName} 时出错`, variant: 'destructive' });
                    resolve(null);
                }
            });
        };

        const currentTrackCount = tracks.length;
        const newTracksPromises = Array.from(files).map((file, index) => processFile(file, currentTrackCount + index));
        const newTracks = (await Promise.all(newTracksPromises)).filter((track): track is TrackWithContent => track !== null);

        if (newTracks.length > 0) {
            for (const track of newTracks) {
                await saveTrack(track);
            }
            const newMetadata = newTracks.map(({ id, title, artist, type, duration, category, createdAt, order }) => ({ id, title, artist, type, duration, category, createdAt, order }));
            setTracks(prev => [...prev, ...newMetadata].sort((a,b) => (a.order ?? 0) - (b.order ?? 0)));
            toast({ title: `成功导入 ${newTracks.length} 首新歌曲。`, duration: 3000 });
        }
        
        setImportingTracks([]); // Clear loading indicator
    };
    
    const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files) return;
        processFiles(files);
        event.target.value = '';
    };
  
    const handleFolderImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files) return;
        processFiles(files);
        event.target.value = '';
    };

    const handleDeleteTrack = async (trackId: string, trackTitle: string) => {
        if (window.confirm(`您确定要删除《${trackTitle}》吗？`)) {
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
                } else {
                    const newCurrentIndex = newTracks.findIndex(t => t.id === currentTrack?.id);
                    setCurrentTrackIndex(newCurrentIndex);
                }
                toast({ title: "歌曲已删除" });
            } catch (error) {
                // Silently fail in production
            }
        }
    };

    const handleClearPlaylist = async () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.src = "";
        }
        if (currentObjectUrl.current) URL.revokeObjectURL(currentObjectUrl.current);
        setIsPlaying(false);
        setCurrentTrack(null);
        setCurrentTrackIndex(-1);

        // 只清空播放列表状态，不删除实际的音乐文件
        // 这样歌单中的音乐不会受影响
        setTracks([]);
        toast({ title: "播放列表已清空", duration: 2000 });
    };

    const handleDeleteAllTracks = async () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.src = "";
        }
        if (currentObjectUrl.current) URL.revokeObjectURL(currentObjectUrl.current);
        setIsPlaying(false);
        setCurrentTrack(null);
        setCurrentTrackIndex(-1);

        try {
            // 真正删除所有音乐文件
            await Promise.all(tracks.map(track => deleteTrack(track.id)));
            setTracks([]);
            toast({ title: "所有音乐已删除", duration: 2000 });
        } catch (error) {
            toast({ title: "删除音乐时出错", variant: "destructive" });
        }
    };
  
    const handleProgressChange = (value: number[]) => {
        if(audioRef.current && currentTrack?.duration) {
            audioRef.current.currentTime = (value[0] / 100) * currentTrack.duration;
        }
    }

    const handleVolumeAdjust = useCallback((amount: number) => {
        if (!audioRef.current) return;
        const newVolume = Math.max(0, Math.min(1, audioRef.current.volume + amount));
        audioRef.current.volume = newVolume;
        setVolume(newVolume);
        localStorage.setItem(LOCAL_STORAGE_VOLUME_KEY, String(newVolume));
        if (newVolume > 0 && isMuted) setIsMuted(false);
        if (newVolume === 0 && !isMuted) setIsMuted(true);
    }, [isMuted]);
  
    const toggleMute = () => {
        if(!audioRef.current) return;
        const newMuted = !audioRef.current.muted;
        audioRef.current.muted = newMuted;
        setIsMuted(newMuted);
    }
    
    const handleSaveTrackMeta = async (trackId: string, meta: { title: string, artist: string | undefined, category: string | null }) => {
        const trackToUpdate = await getTrackContent(trackId);
        if (!trackToUpdate) return;
        
        const updatedTrack: TrackWithContent = { ...trackToUpdate, ...meta };
        await saveTrack(updatedTrack);
        
        const updatedMetadata: TrackMetadata = { 
            id: updatedTrack.id, 
            title: updatedTrack.title, 
            artist: updatedTrack.artist, 
            type: updatedTrack.type, 
            duration: updatedTrack.duration, 
            category: updatedTrack.category, 
            createdAt: updatedTrack.createdAt,
            order: updatedTrack.order 
        };
        setTracks(prev => prev.map(t => (t.id === trackId ? updatedMetadata : t)));
        
        if (currentTrack?.id === trackId) setCurrentTrack(updatedMetadata);
    };
  
    const cyclePlayMode = () => {
        const modes: PlayMode[] = ['repeat', 'repeat-one', 'shuffle'];
        const currentIndex = modes.indexOf(playMode);
        const nextIndex = (currentIndex + 1) % modes.length;
        const newMode = modes[nextIndex];
        setPlayMode(newMode);
        localStorage.setItem(LOCAL_STORAGE_PLAY_MODE_KEY, newMode);
    };

    const closePlayer = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.src = '';
        }
        if (currentObjectUrl.current) URL.revokeObjectURL(currentObjectUrl.current);
        setIsPlaying(false);
        setCurrentTrack(null);
        setCurrentTrackIndex(-1);
    }

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;
        
        const updateProgress = () => {
            if(audio.duration > 0) setProgress((audio.currentTime / audio.duration) * 100);
        };
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
        audio.addEventListener('play', () => setIsPlaying(true));
        audio.addEventListener('pause', () => setIsPlaying(false));
        audio.addEventListener('volumechange', () => {
            if (audioRef.current) {
                setVolume(audioRef.current.volume);
                setIsMuted(audioRef.current.muted);
            }
        });
        
        return () => {
            audio.removeEventListener('timeupdate', updateProgress);
            audio.removeEventListener('ended', onEnded);
            audio.removeEventListener('play', () => setIsPlaying(true));
            audio.removeEventListener('pause', () => setIsPlaying(false));
            audio.removeEventListener('volumechange', () => {});
        };
    }, [handleNextTrack, playMode]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
          const activeElement = document.activeElement;
          const isTextInput = activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA' || (activeElement as HTMLElement).isContentEditable);
          const isVideoPlayerVisible = document.querySelector('video') !== null;
          
          if (isTextInput) {
            return;
          }
    
          switch (event.key) {
            case ' ':
              if (isVideoPlayerVisible && document.body.contains(activeElement) && activeElement?.tagName !== 'BUTTON') {
                return;
              }
              event.preventDefault();
              handlePlayPause();
              break;
            case 'ArrowRight':
              if (isPlaying) handleNextTrack();
              break;
            case 'ArrowLeft':
              if (isPlaying) handlePrevTrack();
              break;
            case 'ArrowUp':
              if (isPlaying) {
                event.preventDefault();
                handleVolumeAdjust(0.05);
              }
              break;
            case 'ArrowDown':
              if (isPlaying) {
                event.preventDefault();
                handleVolumeAdjust(-0.05);
              }
              break;
            default:
              break;
          }
        };
    
        window.addEventListener('keydown', handleKeyDown);
    
        return () => {
          window.removeEventListener('keydown', handleKeyDown);
        };
      }, [isPlaying, handlePlayPause, handleNextTrack, handlePrevTrack, handleVolumeAdjust]);

    const value = {
        tracks, currentTrack, currentTrackIndex, isPlaying, progress, volume, isMuted, playMode,
        isLoading, importingTracks, audioRef, playTrack, handlePlayPause, handleNextTrack,
        handlePrevTrack, handleProgressChange, handleVolumeAdjust, toggleMute, handleFileImport,
        handleFolderImport, handleDeleteTrack, handleClearPlaylist, handleDeleteAllTracks, handleSaveTrackMeta,
        cyclePlayMode, closePlayer, setPlaybackScope, playbackScope,
    };

    return <MusicContext.Provider value={value}>{children}</MusicContext.Provider>;
};
