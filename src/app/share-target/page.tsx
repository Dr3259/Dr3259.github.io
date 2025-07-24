
"use client";

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const LOCAL_STORAGE_KEY_SHARE_TARGET = 'weekGlanceShareTarget_v1';

export default function ShareTargetPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const title = searchParams.get('title');
      const text = searchParams.get('text');
      const url = searchParams.get('url');

      if (title || text || url) {
        const shareData = {
          title: title || '',
          text: text || '',
          url: url || '',
          receivedAt: new Date().toISOString(),
        };
        // Store the data in localStorage to be picked up by the main page
        localStorage.setItem(LOCAL_STORAGE_KEY_SHARE_TARGET, JSON.stringify(shareData));
        
        // Redirect to the main page
        router.replace('/');
      } else {
         // If no share data, just go to the main page
         router.replace('/');
      }
    }
  }, [router, searchParams]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <p className="text-muted-foreground">Processing share...</p>
    </div>
  );
}
