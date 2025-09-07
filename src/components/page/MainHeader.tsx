
"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Languages, Sun, Moon, Settings, Check, LayoutGrid, User, LogOut, LogIn } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent, DropdownMenuPortal } from "@/components/ui/dropdown-menu";
import type { LanguageKey, Theme } from '@/lib/page-types';
import { MainFeatureGridContent } from './MainFeatureGridContent';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/context/AuthContext';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';


interface MainHeaderProps {
  translations: any;
  currentLanguage: LanguageKey;
  onLanguageChange: (lang: LanguageKey) => void;
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
}

export const MainHeader: React.FC<MainHeaderProps> = ({
  translations: t,
  currentLanguage,
  onLanguageChange,
  theme,
  onThemeChange,
}) => {
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
      try {
          // 添加一个短暂的延迟，让UI有时间平滑过渡
          await new Promise(resolve => setTimeout(resolve, 100));
          await signOut(auth);
          // router.push('/login'); // Optional: redirect to login page after logout
      } catch (error) {
          console.error("Error signing out: ", error);
      }
  };

  return (
    <header className="mb-8 sm:mb-12 w-full flex justify-between items-center relative">
      <div className="flex-1">
        <h1 className="text-2xl sm:text-3xl font-thin text-primary">
            <span>Week</span><span className="ml-2">Glance</span>
        </h1>
        <p className="text-muted-foreground mt-1 text-sm sm:text-base">{t.pageSubtitle}</p>
      </div>
      <div className="flex items-center gap-2 absolute right-0 top-0">
          <div className="hidden md:block">
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="outline" size="icon" className="h-9 w-9">
                        <LayoutGrid className="h-4 w-4" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="p-2 w-80" align="end">
                    <MainFeatureGridContent />
                </PopoverContent>
            </Popover>
          </div>
          <DropdownMenu>
              <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="h-9 w-9">
                      <Settings className="h-4 w-4" />
                      <span className="sr-only">{t.settingsMenuTitle}</span>
                  </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                  <DropdownMenuLabel>{t.settingsMenuTitle}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuSub>
                      <DropdownMenuSubTrigger>
                          <Languages className="mr-2 h-4 w-4" />
                          <span>{t.languageButtonText}</span>
                      </DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                          <DropdownMenuSubContent>
                              <DropdownMenuItem onClick={() => onLanguageChange('zh-CN')}>
                                  {currentLanguage === 'zh-CN' && <Check className="mr-2 h-4 w-4" />}
                                  <span>中文</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => onLanguageChange('en')}>
                                  {currentLanguage === 'en' && <Check className="mr-2 h-4 w-4" />}
                                  <span>English</span>
                              </DropdownMenuItem>
                          </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                  </DropdownMenuSub>
                  <DropdownMenuItem onClick={() => onThemeChange(theme === 'light' ? 'dark' : 'light')}>
                      {theme === 'light' ? <Moon className="mr-2 h-4 w-4" /> : <Sun className="mr-2 h-4 w-4" />}
                      <span>{t.themeButtonText}</span>
                  </DropdownMenuItem>
              </DropdownMenuContent>
          </DropdownMenu>

          <div className="relative w-9 h-9">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button 
                        variant="outline" 
                        size="icon" 
                        className={`h-9 w-9 absolute inset-0 transition-opacity duration-200 ${user ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                    >
                        <User className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>{user?.email}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>退出</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            
            <Button 
                variant="outline" 
                size="icon" 
                className={`h-9 w-9 absolute inset-0 transition-opacity duration-200 ${!user ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={() => router.push('/login')}
            >
                <LogIn className="h-4 w-4" />
                <span className="sr-only">Login / Register</span>
            </Button>
          </div>
      </div>
    </header>
  );
};
