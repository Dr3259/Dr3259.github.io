
"use client";

import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Video, Database, Upload, MonitorPlay, Loader2, ExternalLink, Film } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MovieHeavenViewer } from '@/components/MovieHeavenViewer';


const translations = {
  'zh-CN': {
    pageTitle: '个人视频库',
    backButton: '返回休闲驿站',
    tabLocalCinema: '本地影院',
    tabVideo: '视频',
    tabMovieHeaven: '电影天堂',
    comingSoon: '敬请期待！此功能正在开发中。',
    videoPlayerTitle: "本地视频播放器",
    selectVideo: "选择视频文件",
    noVideoSelected: "请选择一个本地视频文件进行播放。",
    videoLoading: "正在加载视频...",
    openInLocalPlayer: '使用本地播放器打开',
  },
  'en': {
    pageTitle: 'Personal Video Library',
    backButton: 'Back to Rest Stop',
    tabLocalCinema: 'Local Cinema',
    tabVideo: 'Video',
    tabMovieHeaven: 'Movie Heaven DB',
    comingSoon: 'Coming soon! This feature is under development.',
    videoPlayerTitle: "Local Video Player",
    selectVideo: "Select Video File",
    noVideoSelected: "Please select a local video file to play.",
    videoLoading: "Loading video...",
    openInLocalPlayer: 'Open in Local Player',
  }
};

type LanguageKey = keyof typeof translations;

export default function PersonalVideoLibraryPage() {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageKey>('en');
  const videoInputRef = useRef<HTMLInputElement>(null);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [selectedVideoFile, setSelectedVideoFile] = useState<File | null>(null);
  const [isVideoLoading, setIsVideoLoading] = useState(false);

  useEffect(() => {
    const browserLang: LanguageKey = navigator.language.toLowerCase().startsWith('zh') ? 'zh-CN' : 'en';
    setCurrentLanguage(browserLang);
    
    return () => {
      if (videoSrc) {
        URL.revokeObjectURL(videoSrc);
      }
    };
  }, [videoSrc]); 

  const t = useMemo(() => translations[currentLanguage], [currentLanguage]);

  const handleVideoSelectClick = () => {
    videoInputRef.current?.click();
  }

  const handleVideoFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (videoSrc) {
          URL.revokeObjectURL(videoSrc);
      }
      setIsVideoLoading(true);
      const newSrc = URL.createObjectURL(file);
      setVideoSrc(newSrc);
      setSelectedVideoFile(file);
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
                      <TabsTrigger value="local_cinema"><Film className="mr-2 h-4 w-4"/>{t.tabLocalCinema}</TabsTrigger>
                      <TabsTrigger value="video"><Video className="mr-2 h-4 w-4"/>{t.tabVideo}</TabsTrigger>
                      <TabsTrigger value="movie_heaven"><Database className="mr-2 h-4 w-4"/>{t.tabMovieHeaven}</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="video">
                      <div className="text-center py-24 text-muted-foreground">
                          <Video className="w-20 h-20 mx-auto mb-4" />
                          <p className="text-xl">{t.comingSoon}</p>
                      </div>
                  </TabsContent>

                  <TabsContent value="local_cinema">
                    <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-6">
                        <h2 className="text-2xl font-semibold">{t.videoPlayerTitle}</h2>
                        <div className="w-full aspect-video bg-black rounded-lg shadow-lg overflow-hidden flex items-center justify-center text-muted-foreground">
                            {isVideoLoading && (
                                <div className="text-center p-8 flex items-center gap-4">
                                    <Loader2 className="w-8 h-8 animate-spin text-primary"/>
                                    <p className="text-lg">{t.videoLoading}</p>
                                </div>
                            )}
                            {videoSrc ? (
                                <video 
                                  src={videoSrc} 
                                  controls 
                                  className={`w-full h-full ${isVideoLoading ? 'hidden' : 'block'}`} 
                                  onCanPlay={() => setIsVideoLoading(false)}
                                />
                            ) : (
                                !isVideoLoading && (
                                    <div className="text-center p-8">
                                        <MonitorPlay className="w-16 h-16 mx-auto mb-4"/>
                                        <p>{t.noVideoSelected}</p>
                                    </div>
                                )
                            )}
                        </div>
                        <div className="flex items-center gap-4">
                           <Button onClick={handleVideoSelectClick} size="lg">
                            <Upload className="mr-2 h-5 w-5"/>
                             {t.selectVideo}
                           </Button>
                           {selectedVideoFile && (
                            <Button onClick={handleOpenInLocalPlayer} size="lg" variant="outline">
                                <ExternalLink className="mr-2 h-5 w-5"/>
                                {t.openInLocalPlayer}
                            </Button>
                           )}
                        </div>
                         {selectedVideoFile && <p className="text-sm text-muted-foreground mt-2">Now playing: {selectedVideoFile.name}</p>}
                    </div>
                  </TabsContent>

                  <TabsContent value="movie_heaven">
                       <MovieHeavenViewer />
                  </TabsContent>
              </Tabs>
          </main>
      </div>
    </>
  );
}
