
"use client";

import React from 'react';
import Image from 'next/image';
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Mail, MessageCircle, Coffee } from "lucide-react";

interface PageFooterProps {
    translations: any;
    currentYear: number;
}

export const PageFooter: React.FC<PageFooterProps> = ({ translations: t, currentYear }) => {
    return (
        <footer className="mt-auto pt-10 pb-6 w-full max-w-4xl">
            <div className="border-t border-border pt-8">
            <div className="text-center md:flex md:items-center md:justify-between">
                <div className="md:order-1">
                {currentYear && (
                    <p className="text-sm text-muted-foreground">
                        <span>© {currentYear} </span>
                        <span className="font-thin">
                            <span>Week</span>
                            <span className="ml-1">Glance</span>
                        </span>
                        .
                        <span className="mx-1">·</span>
                        <a href="mailto:your-email@example.com?subject=Week Glance User Feedback" className="hover:text-primary transition-colors" aria-label={t.emailAria}>
                            {t.mitLicenseLinkText}
                        </a>
                    </p>
                )}
                </div>
                <div className="flex items-center justify-center space-x-4 mt-4 md:space-x-6 md:mt-0 md:order-2">
                <a href="https://github.com/Dr3259/Dr3259.github.io" target="_blank" rel="noopener noreferrer" aria-label={t.githubAria} className="text-muted-foreground hover:text-primary transition-colors">
                    <svg role="img" viewBox="0 0 24 24" className="h-5 w-5 fill-current"><title>GitHub</title><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
                </a>
                <Popover>
                    <PopoverTrigger asChild>
                        <button aria-label={t.wechatAria} className="text-muted-foreground hover:text-primary transition-colors">
                            <MessageCircle className="h-5 w-5" />
                        </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-2">
                        <Image 
                            src="https://placehold.co/200x200.png"
                            width={200}
                            height={200}
                            alt="WeChat QR Code"
                            data-ai-hint="wechat qr code"
                            className="rounded-sm"
                        />
                    </PopoverContent>
                </Popover>
                <a href="mailto:your-email@example.com?subject=Week Glance User Feedback" aria-label={t.emailAria} className="text-muted-foreground hover:text-primary transition-colors">
                    <Mail className="h-5 w-5" />
                </a>
                <a href="#" aria-label={t.donateAria} className="text-muted-foreground hover:text-primary transition-colors">
                    <Coffee className="h-5 w-5" />
                </a>
                </div>
            </div>
            </div>
      </footer>
    );
};
