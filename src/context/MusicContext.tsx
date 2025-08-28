
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
    handleSaveTrackMeta: (trackId: string, meta: { title: string, artist: string | undefined, category: string | null }) => void;
    cyclePlayMode: () => void;
    closePlayer: () => void;
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
            .catch(console.error)
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
                audioRef.current.play().catch(e => {
                    console.error("Audio play failed:", e)
                    setIsPlaying(false);
                });
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
        
        if (isPlaying) audioRef.current.pause();
        else audioRef.current.play().catch(e => console.error("Audio play failed:", e));
    }, [currentTrack, isPlaying, playTrack, tracks]);

    const handleNextTrack = useCallback(() => {
        if (tracks.length === 0) return;

        if (playMode === 'shuffle') {
            if (tracks.length <= 1) {
                playTrack(0);
                return;
            }

            const currentArtist = currentTrack?.artist;
            
            // Create a list of potential next tracks (different artist, not the current song)
            const potentialNextTracks = tracks.map((track, index) => ({ track, index }))
                .filter(({ track, index }) => {
                    // Always exclude the current track
                    if (index === currentTrackIndex) return false;
                    // If the current track has no artist, any other track is valid
                    if (!currentArtist) return true;
                    // Otherwise, the artists must be different
                    return track.artist !== currentArtist;
                });

            let trackToPlayIndex: number;

            if (potentialNextTracks.length > 0) {
                // If we found tracks from other artists, pick one randomly
                const randomIndex = Math.floor(Math.random() * potentialNextTracks.length);
                trackToPlayIndex = potentialNextTracks[randomIndex].index;
            } else {
                // Fallback: If all other songs are from the same artist, or there's only one artist.
                // Just pick a random song that is not the current one.
                const fallbackTracks = tracks
                    .map((track, index) => index)
                    .filter(index => index !== currentTrackIndex);

                if (fallbackTracks.length > 0) {
                    const randomIndex = Math.floor(Math.random() * fallbackTracks.length);
                    trackToPlayIndex = fallbackTracks[randomIndex];
                } else {
                    // This should only happen if there's only one song total, handled at the start.
                    trackToPlayIndex = currentTrackIndex; 
                }
            }

            playTrack(trackToPlayIndex);
            return;
        }

        // Default 'repeat' logic
        const nextIndex = (currentTrackIndex + 1) % tracks.length;
        playTrack(nextIndex);
    }, [currentTrackIndex, tracks, playTrack, playMode, currentTrack]);
  
    const handlePrevTrack = useCallback(() => {
        if (tracks.length === 0) return;

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

        const prevIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
        playTrack(prevIndex);
    }, [currentTrackIndex, tracks, playTrack, playMode, playHistory]);

    const processFiles = async (files: FileList) => {
        setImportingTracks(['loading']); // Show a generic loading indicator
        
        const processFile = (file: File): Promise<TrackWithContent | null> => {
            return new Promise(async (resolve) => {
                const supportedTypes = ['audio/flac', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/mpeg'];
                if (!supportedTypes.some(type => file.type.startsWith(type.split('/')[0]))) {
                    console.warn(`Unsupported file type: ${file.name} (${file.type})`);
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
                    toast({ title: `Track "${fileName}" already exists. Skipped.`, variant: 'default', duration: 3000 });
                    resolve(null);
                    return;
                }

                try {
                    const tempAudioForDuration = document.createElement('audio');
                    const tempUrl = URL.createObjectURL(file);
                    tempAudioForDuration.src = tempUrl;

                    const duration = await new Promise<number>((res, rej) => {
                        tempAudioForDuration.onloadedmetadata = () => res(tempAudioForDuration.duration);
                        tempAudioForDuration.onerror = () => rej(new Error("Failed to load audio metadata."));
                    }).finally(() => URL.revokeObjectURL(tempUrl));

                    const arrayBuffer = await file.arrayBuffer();
                    const blobContent = new Blob([arrayBuffer], { type: file.type });
                    const trackId = `track-${Date.now()}-${Math.random()}`;
                    
                    resolve({
                        id: trackId, title, artist, type: file.type, duration, content: blobContent, category: null,
                    });

                } catch (error) {
                    console.error(`Failed to process or save track: ${fileName}`, error);
                    toast({ title: `Error importing ${fileName}`, variant: 'destructive' });
                    resolve(null);
                }
            });
        };

        const newTracksPromises = Array.from(files).map(processFile);
        const newTracks = (await Promise.all(newTracksPromises)).filter((track): track is TrackWithContent => track !== null);

        if (newTracks.length > 0) {
            for (const track of newTracks) {
                await saveTrack(track);
            }
            const newMetadata = newTracks.map(({ id, title, artist, type, duration, category }) => ({ id, title, artist, type, duration, category }));
            setTracks(prev => [...prev, ...newMetadata]);
            toast({ title: `Successfully imported ${newTracks.length} new track(s).`, duration: 3000 });
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
        if (window.confirm(`Are you sure you want to delete "${trackTitle}"?`)) {
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
                toast({ title: "Track deleted" });
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
        if (currentObjectUrl.current) URL.revokeObjectURL(currentObjectUrl.current);
        setIsPlaying(false);
        setCurrentTrack(null);
        setCurrentTrackIndex(-1);

        try {
            await Promise.all(tracks.map(track => deleteTrack(track.id)));
            setTracks([]);
            toast({ title: "Playlist cleared", duration: 2000 });
        } catch (error) {
            console.error("Failed to clear playlist", error);
            toast({ title: "Error clearing playlist", variant: "destructive" });
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
        
        const updatedMetadata: TrackMetadata = { id: updatedTrack.id, title: updatedTrack.title, artist: updatedTrack.artist, type: updatedTrack.type, duration: updatedTrack.duration, category: updatedTrack.category };
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
                // If a video player is visible and the focus is not on a button, let the video player handle it.
                return;
              }
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

    const value = {
        tracks, currentTrack, currentTrackIndex, isPlaying, progress, volume, isMuted, playMode,
        isLoading, importingTracks, audioRef, playTrack, handlePlayPause, handleNextTrack,
        handlePrevTrack, handleProgressChange, handleVolumeAdjust, toggleMute, handleFileImport,
        handleFolderImport, handleDeleteTrack, handleClearPlaylist, handleSaveTrackMeta,
        cyclePlayMode, closePlayer,
    };

    return <MusicContext.Provider value={value}>{children}</MusicContext.Provider>;
};
