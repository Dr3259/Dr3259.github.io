
"use client";

import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Video, Database, Upload, MonitorPlay, Loader2, ExternalLink, Film, Trash2, ListMusic, FileEdit, Sun, Play, Pause, Volume2, VolumeX, Volume1, Maximize, Minimize, Volume } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MovieHeavenViewer } from '@/components/MovieHeavenViewer';
import { saveVideo, getVideos, deleteVideo, type VideoFile } from '@/lib/db';
import { useToast } from '@/hooks/use-toast';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { EditVideoModal } from '@/components/EditVideoModal';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

const translations = {
  'zh-CN': {
    pageTitle: '个人视频库',
    backButton: '返回休闲驿站',
    tabVideo: '视频',
    tabLocalCinema: '本地影院',
    tabMovieHeaven: '电影天堂',
    comingSoon: '敬请期待！此功能正在开发中。',
    selectVideo: "选择视频文件",
    noVideoSelected: "请选择一个本地视频文件进行播放。",
    videoLoading: "正在加载视频...",
    openInNewWindow: '在新窗口中播放',
    importSuccess: "视频已成功添加到播放列表！",
    importError: "添加视频到播放列表失败。",
    deleteSuccess: "视频已从播放列表删除。",
    deleteError: "删除视频失败。",
    playlistTitle: "播放列表",
    noPlaylist: "暂无视频。",
    alreadyInPlaylist: "此视频已在播放列表中。",
    editVideo: "编辑视频名称",
    editVideoModal: {
      title: "编辑视频信息",
      description: "修改视频的显示名称。这不会更改原始文件名。",
      nameLabel: "显示名称",
      originalFilenameLabel: "原始文件名:",
      saveButton: "保存",
      cancelButton: "取消",
    },
    brightness: "亮度",
    volume: "音量",
    fullscreen: "全屏",
    exitFullscreen: "退出全屏",
  },
  'en': {
    pageTitle: 'Personal Video Library',
    backButton: 'Back to Rest Stop',
    tabVideo: 'Video',
    tabLocalCinema: 'Local Cinema',
    tabMovieHeaven: 'Movie Heaven DB',
    comingSoon: 'Coming soon! This feature is under development.',
    selectVideo: "Select Video File",
    noVideoSelected: "Please select a local video file to play.",
    videoLoading: "Loading video...",
    openInNewWindow: 'Open in new window',
    importSuccess: "Video successfully added to playlist!",
    importError: "Failed to add video to playlist.",
    deleteSuccess: "Video removed from playlist.",
    deleteError: "Failed to delete video.",
    playlistTitle: "Playlist",
    noPlaylist: "No videos in playlist yet.",
    alreadyInPlaylist: "This video is already in the playlist.",
    editVideo: "Edit video name",
    editVideoModal: {
      title: "Edit Video Info",
      description: "Modify the display name of the video. This will not change the original file name.",
      nameLabel: "Display Name",
      originalFilenameLabel: "Original filename:",
      saveButton: "Save",
      cancelButton: "Cancel",
    },
    brightness: "Brightness",
    volume: "Volume",
    fullscreen: "Fullscreen",
    exitFullscreen: "Exit Fullscreen",
  }
};

type LanguageKey = keyof typeof translations;

const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds)) return '0:00';
    const floorSeconds = Math.floor(timeInSeconds);
    const minutes = Math.floor(floorSeconds / 60);
    const seconds = floorSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

const VolumeIcon = ({ volume, isMuted }: { volume: number, isMuted: boolean }) => {
    if (isMuted || volume === 0) return <VolumeX className="w-5 h-5" />;
    if (volume < 0.5) return <Volume1 className="w-5 h-5" />;
    return <Volume2 className="w-5 h-5" />;
};


export default function PersonalVideoLibraryPage() {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageKey>('en');
  const videoInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [selectedVideoFile, setSelectedVideoFile] = useState<File | null>(null);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [playlist, setPlaylist] = useState<VideoFile[]>([]);
  const { toast } = useToast();
  const currentObjectUrl = useRef<string | null>(null);
  const [editingVideo, setEditingVideo] = useState<VideoFile | null>(null);
  
  // Player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.75);
  const [isMuted, setIsMuted] = useState(false);
  const [brightness, setBrightness] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const browserLang: LanguageKey = typeof navigator !== 'undefined' && navigator.language.toLowerCase().startsWith('zh') ? 'zh-CN' : 'en';
    setCurrentLanguage(browserLang);
    
    loadPlaylist();

    const handleFullscreenChange = () => {
        setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      if (currentObjectUrl.current) {
        URL.revokeObjectURL(currentObjectUrl.current);
      }
    };
  }, []); 

  const t = useMemo(() => translations[currentLanguage], [currentLanguage]);

  const loadPlaylist = async () => {
      try {
        const videoPlaylist = await getVideos();
        setPlaylist(videoPlaylist);
      } catch (error) {
        console.error("Failed to load video playlist:", error);
      }
  };

  const handleVideoSelectClick = () => {
    videoInputRef.current?.click();
  }

  const handleVideoFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const isDuplicate = playlist.some(video => video.content.name === file.name && video.content.size === file.size);
      if (isDuplicate) {
          toast({ title: t.alreadyInPlaylist });
          return;
      }
  
      if (currentObjectUrl.current) URL.revokeObjectURL(currentObjectUrl.current);
      setIsVideoLoading(true);
      
      const newSrc = URL.createObjectURL(file);
      currentObjectUrl.current = newSrc;
      setVideoSrc(newSrc);
      setSelectedVideoFile(file);
      
      const newVideo: VideoFile = { id: `video-${Date.now()}`, name: file.name, content: file };
      setPlaylist(prev => [...prev, newVideo]);
  
      try {
          await saveVideo(newVideo);
          toast({ title: t.importSuccess });
      } catch (error) {
          toast({ title: t.importError, variant: 'destructive' });
          console.error("Error saving video:", error);
          setPlaylist(prev => prev.filter(v => v.id !== newVideo.id));
      }
    }
  };

  const playVideoFromPlaylist = (video: VideoFile) => {
    if (currentObjectUrl.current) URL.revokeObjectURL(currentObjectUrl.current);
    
    setIsVideoLoading(true);
    const newSrc = URL.createObjectURL(video.content);
    currentObjectUrl.current = newSrc;
    setVideoSrc(newSrc);
    const fileLikeObject = new File([video.content], video.name, { type: video.content.type });
    setSelectedVideoFile(fileLikeObject);
  }

  const handleDeleteFromPlaylist = async (videoId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    try {
        await deleteVideo(videoId);
        toast({ title: t.deleteSuccess });
        loadPlaylist();
        if (selectedVideoFile && playlist.find(v => v.id === videoId)?.content.name === selectedVideoFile.name) {
            setVideoSrc(null);
            setSelectedVideoFile(null);
            setIsPlaying(false);
            setProgress(0);
        }
    } catch(e) {
        toast({ title: t.deleteError, variant: 'destructive' });
    }
  }

  const handleEditVideo = (video: VideoFile, event: React.MouseEvent) => {
    event.stopPropagation();
    setEditingVideo(video);
  };

  const handleSaveVideoName = async (video: VideoFile, newName: string) => {
    try {
        const updatedVideo = { ...video, name: newName };
        await saveVideo(updatedVideo);
        toast({ title: "Video name updated!" });
        loadPlaylist();
        if (selectedVideoFile && video.content.name === selectedVideoFile.name) {
             const updatedFile = new File([video.content], newName, { type: video.content.type });
            setSelectedVideoFile(updatedFile);
        }
    } catch (e) {
        toast({ title: "Error updating video name", variant: 'destructive' });
    }
  };
  
  const handleOpenInNewWindow = () => {
    if (videoSrc) {
      window.open(videoSrc, '_blank');
    }
  }

  const handlePlayPause = () => {
      if (videoRef.current) {
          if (isPlaying) videoRef.current.pause();
          else videoRef.current.play();
          setIsPlaying(!isPlaying);
      }
  };

  const handleTimeUpdate = () => {
      if (videoRef.current) {
          setCurrentTime(videoRef.current.currentTime);
          setProgress((videoRef.current.currentTime / videoRef.current.duration) * 100);
      }
  };
  
  const handleLoadedMetadata = () => {
      if (videoRef.current) {
          setDuration(videoRef.current.duration);
          videoRef.current.volume = volume;
      }
  };

  const handleProgressSeek = (value: number[]) => {
      if (videoRef.current) {
          const newTime = (value[0] / 100) * duration;
          videoRef.current.currentTime = newTime;
          setCurrentTime(newTime);
          setProgress(value[0]);
      }
  };
  
  const handleVolumeChange = (value: number[]) => {
      const newVolume = value[0] / 100;
      if (videoRef.current) {
          videoRef.current.volume = newVolume;
      }
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
  };
  
  const toggleMute = () => {
      if (videoRef.current) {
          videoRef.current.muted = !isMuted;
          setIsMuted(!isMuted);
      }
  };
  
  const toggleFullscreen = () => {
      if (playerContainerRef.current) {
          if (!document.fullscreenElement) {
              playerContainerRef.current.requestFullscreen();
          } else {
              document.exitFullscreen();
          }
      }
  };

  return (
    <>
       <input 
        type="file"
        ref={videoInputRef}
        onChange={handleVideoFileChange}
        className="hidden"
        accept=".mkv,.mp4,.webm,video/*"
      />
      <div className="flex flex-col min-h-screen bg-background text-foreground py-8 sm:py-12 px-4 items-center">
          <header className="w-full max-w-6xl mb-6 sm:mb-8">
              <Link href="/rest" passHref>
                  <Button variant="outline" size="sm">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      {t.backButton}
                  </Button>
              </Link>
          </header>

          <main className="w-full max-w-6xl flex flex-col items-center">
              <div className="text-center mb-8">
                  <h1 className="text-3xl sm:text-4xl font-headline font-semibold text-primary">
                      {t.pageTitle}
                  </h1>
              </div>

              <Tabs defaultValue="local_cinema" className="w-full">
                   <TabsList className="grid w-full grid-cols-3 max-w-2xl mx-auto mb-8">
                      <TabsTrigger value="video"><Video className="mr-2 h-4 w-4"/>{t.tabVideo}</TabsTrigger>
                      <TabsTrigger value="local_cinema"><Film className="mr-2 h-4 w-4"/>{t.tabLocalCinema}</TabsTrigger>
                      <TabsTrigger value="movie_heaven"><Database className="mr-2 h-4 w-4"/>{t.tabMovieHeaven}</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="video">
                      <div className="text-center py-24 text-muted-foreground">
                          <Video className="w-20 h-20 mx-auto mb-4" />
                          <p className="text-xl">{t.comingSoon}</p>
                      </div>
                  </TabsContent>

                  <TabsContent value="local_cinema" className="space-y-10">
                    <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-6">
                        <div ref={playerContainerRef} className="w-full aspect-video bg-black rounded-lg shadow-lg overflow-hidden flex items-center justify-center text-muted-foreground relative group/player">
                            {videoSrc ? (
                                <>
                                    <video 
                                        ref={videoRef}
                                        src={videoSrc} 
                                        autoPlay
                                        onCanPlay={() => setIsVideoLoading(false)}
                                        onLoadedMetadata={handleLoadedMetadata}
                                        onTimeUpdate={handleTimeUpdate}
                                        onPlay={() => setIsPlaying(true)}
                                        onPause={() => setIsPlaying(false)}
                                        onClick={handlePlayPause}
                                        onDoubleClick={toggleFullscreen}
                                        className="w-full h-full block cursor-pointer" 
                                        style={{ filter: `brightness(${brightness}%)`}}
                                    />
                                    {isVideoLoading && (
                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white">
                                            <Loader2 className="w-8 h-8 animate-spin text-primary"/>
                                            <p className="text-lg ml-4">{t.videoLoading}</p>
                                        </div>
                                    )}
                                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover/player:opacity-100 transition-opacity duration-300 space-y-2">
                                        <Slider value={[progress]} onValueChange={handleProgressSeek} max={100} step={0.1} className="w-full h-2 group" />
                                        <div className="flex items-center justify-between text-white">
                                            <div className="flex items-center gap-2">
                                                <Button variant="ghost" size="icon" className="h-9 w-9 text-white" onClick={handlePlayPause}>
                                                    {isPlaying ? <Pause className="w-5 h-5"/> : <Play className="w-5 h-5" />}
                                                </Button>
                                                <div className="flex items-center gap-2 group/volume">
                                                    <Button variant="ghost" size="icon" className="h-9 w-9 text-white" onClick={toggleMute}>
                                                       <VolumeIcon volume={volume} isMuted={isMuted} />
                                                    </Button>
                                                    <div className="w-24 opacity-0 group-hover/volume:opacity-100 transition-opacity">
                                                        <Slider value={[isMuted ? 0 : volume * 100]} onValueChange={handleVolumeChange} max={100} step={1} />
                                                    </div>
                                                </div>
                                                <span className="text-xs font-mono ml-2">{formatTime(currentTime)} / {formatTime(duration)}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                 <div className="flex items-center gap-1 group/brightness">
                                                    <Button variant="ghost" size="icon" className="h-9 w-9 text-white" >
                                                        <Sun className="w-5 h-5" />
                                                    </Button>
                                                     <div className="w-24 opacity-0 group-hover/brightness:opacity-100 transition-opacity">
                                                        <Slider defaultValue={[100]} value={[brightness]} onValueChange={(v) => setBrightness(v[0])} max={200} step={1} />
                                                     </div>
                                                </div>
                                                <Button variant="ghost" size="icon" className="h-9 w-9 text-white" onClick={handleOpenInNewWindow}>
                                                    <ExternalLink className="w-5 h-5"/>
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-9 w-9 text-white" onClick={toggleFullscreen}>
                                                    {isFullscreen ? <Minimize className="w-5 h-5"/> : <Maximize className="w-5 h-5"/>}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center p-8">
                                    <MonitorPlay className="w-16 h-16 mx-auto mb-4"/>
                                    <p>{t.noVideoSelected}</p>
                                </div>
                            )}
                        </div>
                        <div className="flex items-center gap-4">
                           <Button onClick={handleVideoSelectClick} size="lg">
                            <Upload className="mr-2 h-5 w-5"/>
                             {t.selectVideo}
                           </Button>
                        </div>
                         {selectedVideoFile && !isVideoLoading && <p className="text-sm text-muted-foreground mt-2">Now playing: {selectedVideoFile.name}</p>}
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><ListMusic className="h-5 w-5" />{t.playlistTitle}</CardTitle>
                        </CardHeader>
                        <CardContent>
                             {playlist.length > 0 ? (
                                <ScrollArea className="h-64">
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {playlist.map(video => (
                                    <div key={video.id} onClick={() => playVideoFromPlaylist(video)} className="group relative p-3 rounded-lg border bg-card hover:bg-accent cursor-pointer transition-colors flex flex-col justify-between h-full">
                                       <div className="flex flex-col items-center justify-center text-center flex-grow">
                                          <Film className="w-10 h-10 mb-2 text-primary/80" />
                                          <p className="text-sm font-semibold line-clamp-2" title={video.name}>{video.name}</p>
                                       </div>
                                       <p className="text-xs text-muted-foreground mt-2 truncate text-center" title={video.content.name}>({video.content.name})</p>
                                       <div className="absolute top-1 right-1 flex opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-primary" title={t.editVideo} onClick={(e) => handleEditVideo(video, e)}>
                                                <FileEdit className="h-4 w-4"/>
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={(e) => handleDeleteFromPlaylist(video.id, e)}>
                                                <Trash2 className="h-4 w-4"/>
                                            </Button>
                                       </div>
                                    </div>
                                ))}
                                </div>
                                </ScrollArea>
                            ) : (
                                <div className="text-center py-10 text-muted-foreground">{t.noPlaylist}</div>
                            )}
                        </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="movie_heaven">
                       <MovieHeavenViewer />
                  </TabsContent>
              </Tabs>
          </main>
      </div>
      <EditVideoModal
        isOpen={!!editingVideo}
        onClose={() => setEditingVideo(null)}
        onSave={handleSaveVideoName}
        video={editingVideo}
        translations={t.editVideoModal}
      />
    </>
  );
}
