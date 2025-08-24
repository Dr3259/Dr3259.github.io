"use client";

import React, { createContext, useContext } from 'react';
import { cn } from '@/lib/utils';
import { ScrollArea } from './scroll-area';

interface SidebarContextProps {
  // You can add shared state/functions here if needed
}

const SidebarContext = createContext<SidebarContextProps | null>(null);

export const useSidebarPro = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebarPro must be used within a SidebarProvider');
  }
  return context;
};

export const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarContext.Provider value={{}}>
      {children}
    </SidebarContext.Provider>
  );
};

export const Sidebar = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ className, children, ...props }, ref) => {
  return (
    <aside
      ref={ref}
      className={cn('hidden md:flex h-screen flex-col', className)}
      {...props}
    >
      {children}
    </aside>
  );
});
Sidebar.displayName = 'Sidebar';


export const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('border-b p-2', className)}
      {...props}
    />
  );
});
SidebarHeader.displayName = 'SidebarHeader';

export const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('flex-1 overflow-y-auto', className)}
      {...props}
    />
  );
});
SidebarContent.displayName = 'SidebarContent';


export const SidebarSection = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
      <div ref={ref} className={cn('py-4 space-y-2 border-b', className)} {...props} />
  )
})
SidebarSection.displayName = "SidebarSection";


export const SidebarItem = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { isActive?: boolean }
>(({ className, isActive, ...props }, ref) => {
    return (
        <button
            ref={ref}
            className={cn(
                'w-full flex items-center justify-between text-sm px-3 py-2 rounded-md transition-colors',
                isActive ? 'bg-secondary text-secondary-foreground font-semibold' : 'hover:bg-muted/50'
            )}
            {...props}
        />
    )
})
SidebarItem.displayName = "SidebarItem";

export const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('border-t p-2 mt-auto', className)}
      {...props}
    />
  );
});
SidebarFooter.displayName = 'SidebarFooter';
