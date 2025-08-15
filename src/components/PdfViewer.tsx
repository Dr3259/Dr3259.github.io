
"use client";

import React, { useEffect, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import type { PDFDocumentProxy } from 'pdfjs-dist';
import { Loader2 } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import { cn } from '@/lib/utils';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

type PageLayout = 'single' | 'double';

interface PdfViewerProps {
    file: string; 
    theme: 'light' | 'dark';
    scale?: number;
    pageNumber: number;
    pageLayout: PageLayout;
    numPages: number | null;
    onDocumentLoadSuccess: ({ numPages }: PDFDocumentProxy) => void;
    translations: {
        pdfError: string;
        pdfLoading: string;
    }
}

const PdfViewer: React.FC<PdfViewerProps> = ({ 
    file, 
    theme, 
    scale = 1.0, 
    pageNumber, 
    pageLayout,
    numPages,
    onDocumentLoadSuccess, 
    translations 
}) => {
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    // Reset scroll position when page or file changes
    useEffect(() => {
        if (scrollAreaRef.current) {
           const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
           if(viewport) {
             viewport.scrollTop = 0;
           }
        }
    }, [pageNumber, file]);

    const renderPages = () => {
        // Always render single page if layout is single, no pages are loaded, or it's the first page
        if (pageLayout === 'single' || !numPages || pageNumber === 1) {
            return (
                <Page 
                    key={`page_${pageNumber}`}
                    pageNumber={pageNumber} 
                    scale={scale}
                    renderAnnotationLayer={false}
                    renderTextLayer={true}
                />
            );
        }

        // Double page layout for page numbers > 1
        const firstPageOfPair = pageNumber % 2 === 0 ? pageNumber : pageNumber - 1;
        
        // Ensure firstPageOfPair is at least 2 if it's not the first page, to avoid showing 1-2
        const startPage = Math.max(2, firstPageOfPair);
        const secondPageOfPair = startPage + 1;
        
        return (
            <div className="flex justify-center items-start gap-x-2">
                <Page 
                    key={`page_${startPage}`}
                    pageNumber={startPage} 
                    scale={scale}
                    renderAnnotationLayer={false}
                    renderTextLayer={true}
                    className="shadow-md"
                />
                 {secondPageOfPair <= numPages && (
                    <Page 
                        key={`page_${secondPageOfPair}`}
                        pageNumber={secondPageOfPair} 
                        scale={scale}
                        renderAnnotationLayer={false}
                        renderTextLayer={true}
                        className="shadow-md"
                    />
                 )}
            </div>
        );
    }

    return (
        <ScrollArea className="flex-1 flex justify-center items-start p-4" ref={scrollAreaRef}>
            <div className={cn("flex justify-center", theme === 'dark' && 'invert-[0.9] hue-rotate-[180deg]')}>
                <Document
                    file={file}
                    onLoadSuccess={onDocumentLoadSuccess}
                    loading={
                        <div className="flex items-center justify-center p-10 h-screen">
                            <Loader2 className="h-6 w-6 animate-spin mr-2" /> 
                            {translations.pdfLoading}
                        </div>
                    }
                    error={
                        <div className="flex items-center justify-center p-10 text-destructive h-screen">
                            {translations.pdfError}
                        </div>
                    }
                    className="shadow-lg"
                >
                    {renderPages()}
                </Document>
            </div>
        </ScrollArea>
    );
};

export default PdfViewer;
