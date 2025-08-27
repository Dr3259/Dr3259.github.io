
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// This page is deprecated and will redirect to the new modular page.
export default function DeprecatedPersonalCinemaPage() {
    const router = useRouter();
    useEffect(() => {
        router.replace('/personal-video-library');
    }, [router]);

    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground py-8 sm:py-12 px-4 items-center justify-center">
            <p className="text-muted-foreground">Redirecting...</p>
        </div>
    );
}
