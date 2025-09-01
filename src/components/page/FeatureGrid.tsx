
"use client";

import React from 'react';
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { LayoutGrid } from "lucide-react";
import { useIsMobile } from '@/hooks/use-mobile';
import { MainFeatureGridContent } from './MainFeatureGridContent';

export const FeatureGrid: React.FC = () => {
    const isMobile = useIsMobile();

    if (!isMobile) {
        // On desktop, this component renders nothing, as the logic is in MainHeader.
        return null;
    }
    
    // On mobile, render the floating action button with a Popover.
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" size="icon" className="h-9 w-9 fixed bottom-4 right-4 z-50 shadow-lg md:hidden">
                    <LayoutGrid className="h-4 w-4" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-2 w-64" align="end">
                 <MainFeatureGridContent />
            </PopoverContent>
        </Popover>
    );
};
