
"use client";

import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import type { PDFDocumentProxy } from 'pdfjs-dist';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';

// Setup pdf.js worker from a stable CDN to ensure version consistency.
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfViewerProps {
    file: string; // data URI
    title: string;
    theme: 'light' | 'dark';
    translations: {
        page: (current: number, total: number) => string;
        pdfError: string;
        pdfLoading: string;
    }
}

const PdfViewer: React.FC<PdfViewerProps> = ({ file, title, theme, translations }) => {
    const [numPages, setNumPages] = useState<number | null>(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    // Reset page number when file changes
    useEffect(() => {
        setPageNumber(1);
        setNumPages(null);
    }, [file]);

    function onDocumentLoadSuccess({ numPages: nextNumPages }: PDFDocumentProxy) {
        setNumPages(nextNumPages);
    }

    function goToNextPage() {
        if (pageNumber && numPages && pageNumber < numPages) {
            setPageNumber(pageNumber + 1);
        }
    }

    function goToPrevPage() {
        if (pageNumber && pageNumber > 1) {
            setPageNumber(pageNumber - 1);
        }
    }
    
    // Defer rendering of Document component until client-side to avoid SSR issues.
    if (!isClient) {
        return (
            <div className="flex items-center justify-center p-10">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                {translations.pdfLoading}
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col min-h-0">
             <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center justify-end gap-2 p-2 bg-background/80 border rounded-lg shadow-lg backdrop-blur-sm">
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={goToPrevPage} disabled={!numPages || pageNumber <= 1}>
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium text-muted-foreground tabular-nums px-2">
                    {numPages ? translations.page(pageNumber, numPages) : '...'}
                </span>
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={goToNextPage} disabled={!numPages || pageNumber >= numPages}>
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>

             <ScrollArea className="flex-1 flex justify-center items-start p-4">
                <div className="flex justify-center">
                    <Document
                        file={file}
                        onLoadSuccess={onDocumentLoadSuccess}
                        loading={
                            <div className="flex items-center justify-center p-10">
                                <Loader2 className="h-6 w-6 animate-spin mr-2" /> 
                                {translations.pdfLoading}
                            </div>
                        }
                        error={
                            <div className="flex items-center justify-center p-10 text-destructive">
                                {translations.pdfError}
                            </div>
                        }
                        className="shadow-lg"
                    >
                        <Page pageNumber={pageNumber} />
                    </Document>
                </div>
            </ScrollArea>
        </div>
    );
};

export default PdfViewer;
