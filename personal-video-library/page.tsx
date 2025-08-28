
"use client";

import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Video, Database, Upload, MonitorPlay, Loader2, ExternalLink, Film, Trash2, ListMusic, FileEdit, Sun } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MovieHeavenViewer } from '@/components/MovieHeavenViewer';
import { saveVideo, getVideos, deleteVideo, type VideoFile } from '@/lib/db';
import { useToast } from '@/hooks/use-toast';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { EditVideoModal } from '@/components/EditVideoModal';
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
    openInLocalPlayer: '使用本地播放器打开',
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
    openInLocalPlayer: 'Open in Local Player',
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
  }
};

type LanguageKey = keyof typeof translations;

export default function PersonalVideoLibraryPage() {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageKey>('en');
  const videoInputRef = useRef<HTMLInputElement>(null);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [selectedVideoFile, setSelectedVideoFile] = useState<File | null>(null);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [playlist, setPlaylist] = useState<VideoFile[]>([]);
  const { toast } = useToast();
  const currentObjectUrl = useRef<string | null>(null);
  const [editingVideo, setEditingVideo] = useState<VideoFile | null>(null);
  const [brightness, setBrightness] = useState(100);

  useEffect(() => {
    const browserLang: LanguageKey = typeof navigator !== 'undefined' && navigator.language.toLowerCase().startsWith('zh') ? 'zh-CN' : 'en';
    setCurrentLanguage(browserLang);
    
    loadPlaylist();

    return () => {
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
      
      const newVideo: VideoFile = {
          id: `video-${Date.now()}`,
          name: file.name,
          content: file
      };

      setPlaylist(prev => [...prev, newVideo]);
      
      if (currentObjectUrl.current) {
          URL.revokeObjectURL(currentObjectUrl.current);
      }
      setIsVideoLoading(true);
      
      const newSrc = URL.createObjectURL(file);
      currentObjectUrl.current = newSrc;
      setVideoSrc(newSrc);
      setSelectedVideoFile(file);
  
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
    if (currentObjectUrl.current) {
        URL.revokeObjectURL(currentObjectUrl.current);
    }
    setIsVideoLoading(true);

    const newSrc = URL.createObjectURL(video.content);
    currentObjectUrl.current = newSrc;
    setVideoSrc(newSrc);
    const fileLikeObject = new File([video.content], video.name, { type: video.content.type });
    setSelectedVideoFile(fileLikeObject);
  }

  const handleDeleteFromPlaylist = async (videoId: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent card click when deleting
    try {
        await deleteVideo(videoId);
        toast({ title: t.deleteSuccess });
        loadPlaylist();
        if (selectedVideoFile && playlist.find(v => v.id === videoId)?.content.name === selectedVideoFile.name) {
            setVideoSrc(null);
            setSelectedVideoFile(null);
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
  
  const handleOpenInLocalPlayer = () => {
    if (videoSrc) {
      const a = document.createElement('a');
      a.href = videoSrc;
      a.download = selectedVideoFile?.name || 'video.mkv';
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }

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
                        <div className="w-full aspect-video bg-black rounded-lg shadow-lg overflow-hidden flex items-center justify-center text-muted-foreground relative group">
                            {videoSrc ? (
                                <>
                                    <video 
                                        key={videoSrc}
                                        src={videoSrc} 
                                        controls
                                        controlsList="nodownload"
                                        autoPlay
                                        className="w-full h-full block" 
                                        style={{ filter: `brightness(${brightness}%)`}}
                                        onCanPlay={() => setIsVideoLoading(false)}
                                        onError={() => {
                                            setIsVideoLoading(false);
                                            toast({ title: 'Error playing video', variant: 'destructive' });
                                        }}
                                        playsInline 
                                        disablePictureInPicture
                                    />
                                    {isVideoLoading && (
                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white">
                                            <Loader2 className="w-8 h-8 animate-spin text-primary"/>
                                            <p className="text-lg ml-4">{t.videoLoading}</p>
                                        </div>
                                    )}
                                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Sun className="h-5 w-5 text-white" />
                                            <Slider
                                                defaultValue={[100]}
                                                value={[brightness]}
                                                onValueChange={(value) => setBrightness(value[0])}
                                                max={200}
                                                step={1}
                                                className="w-32"
                                            />
                                        </div>
                                         <Button onClick={handleOpenInLocalPlayer} size="sm" variant="secondary" className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm">
                                            <ExternalLink className="mr-2 h-4 w-4"/>
                                            {t.openInLocalPlayer}
                                        </Button>
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
