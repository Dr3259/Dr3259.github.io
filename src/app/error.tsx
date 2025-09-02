
"use client";

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RotateCw } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground p-8">
      <div className="text-center">
        <AlertTriangle className="mx-auto h-16 w-16 text-destructive mb-6" />
        <h1 className="text-3xl font-bold tracking-tight text-destructive sm:text-4xl">
          糟糕，出错了！
        </h1>
        <p className="mt-4 text-base text-muted-foreground">
          应用遇到了一些意料之外的问题，很抱歉给您带来不便。
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          (Oops, something went wrong!)
        </p>

        <div className="mt-10">
          <Button onClick={() => reset()} size="lg">
            <RotateCw className="mr-2 h-4 w-4" />
            再试一次 (Try Again)
          </Button>
        </div>
        
        {process.env.NODE_ENV === 'development' && (
            <details className="mt-8 text-left">
                <summary className="cursor-pointer text-muted-foreground">Error Details</summary>
                <pre className="mt-2 whitespace-pre-wrap rounded-md bg-muted p-4 text-xs text-muted-foreground">
                    {error.stack}
                </pre>
            </details>
        )}
      </div>
    </main>
  );
}
