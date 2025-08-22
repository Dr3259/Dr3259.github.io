
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
    handleVolumeChange: (value: number[]) => void;
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
        if (savedPlayMode) {
            setPlayMode(savedPlayMode);
        }
        
        getTracksMetadata()
            .then(setTracks)
            .catch(console.error)
            .finally(() => setIsLoading(false));
        
        // This creates a single audio element for the entire app
        if (!audioRef.current) {
            (audioRef as React.MutableRefObject<HTMLAudioElement>).current = new Audio();
        }

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
            if (trackWithContent && audioRef.current) {
                const blob = trackWithContent.content;
                const objectUrl = URL.createObjectURL(blob);
                currentObjectUrl.current = objectUrl;

                setCurrentTrack(trackMeta);
                setCurrentTrackIndex(index);
                
                if(playMode === 'shuffle' && (playHistory.length === 0 || playHistory[playHistory.length - 1] !== index)) {
                    setPlayHistory(prev => [...prev, index]);
                }

                audioRef.current.src = objectUrl;
                audioRef.current.play().then(() => {
                    setIsPlaying(true);
                }).catch(e => {
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
    }, [currentTrackIndex, tracks, playTrack, playMode]);
  
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
            toast({ title: `Track "${fileName}" already exists. Skipped.`, variant: 'default', duration: 3000 });
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

            const trackId = `track-${Date.now()}-${Math.random()}`;
            const newTrack: TrackWithContent = {
                id: trackId,
                title: title,
                artist: artist,
                type: file.type,
                duration: duration,
                content: file, // Store the Blob/File directly
                category: null,
            };

            await saveTrack(newTrack);
            setTracks(prev => [...prev, { id: newTrack.id, title: newTrack.title, artist: newTrack.artist, type: newTrack.type, duration: newTrack.duration, category: newTrack.category }]);
            toast({ title: `Successfully imported: ${fileName}`, duration: 2000 });

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
        Array.from(files).forEach(processAndSaveFile);
        event.target.value = '';
    };
  
    const handleFolderImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files) return;
        Array.from(files).forEach(processAndSaveFile);
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
        const newMuted = !isMuted;
        audioRef.current.muted = newMuted;
        setIsMuted(newMuted);
    }
    
    const handleSaveTrackMeta = async (trackId: string, meta: { title: string, artist: string | undefined, category: string | null }) => {
        const trackToUpdate = await getTrackContent(trackId);
        if (!trackToUpdate) return;
        
        const updatedTrack: TrackWithContent = { ...trackToUpdate, ...meta };
        await saveTrack(updatedTrack);
        
        const updatedMetadata = { ...updatedTrack, content: undefined } as unknown as TrackMetadata;
        setTracks(prev => prev.map(t => (t.id === trackId ? updatedMetadata : t)));
        
        if (currentTrack?.id === trackId) {
          setCurrentTrack(updatedMetadata);
        }
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
        if (currentObjectUrl.current) {
            URL.revokeObjectURL(currentObjectUrl.current);
            currentObjectUrl.current = null;
        }
        setIsPlaying(false);
        setCurrentTrack(null);
        setCurrentTrackIndex(-1);
    }

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;
        
        const updateProgress = () => {
            if(audio.duration > 0) {
                setProgress((audio.currentTime / audio.duration) * 100);
            }
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
        
        return () => {
            audio.removeEventListener('timeupdate', updateProgress);
            audio.removeEventListener('ended', onEnded);
            audio.removeEventListener('play', () => setIsPlaying(true));
            audio.removeEventListener('pause', () => setIsPlaying(false));
        };
    }, [handleNextTrack, playMode]);

    const value = {
        tracks,
        currentTrack,
        currentTrackIndex,
        isPlaying,
        progress,
        volume,
        isMuted,
        playMode,
        isLoading,
        importingTracks,
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
        closePlayer,
    };

    return <MusicContext.Provider value={value}>{children}</MusicContext.Provider>;
};
