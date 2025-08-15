
"use client";

import React, { useEffect, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import type { PDFDocumentProxy } from 'pdfjs-dist';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

type PageLayout = 'single' | 'double';
type ScaleMode = 'fitHeight' | number;

interface PdfViewerProps {
    file: string; 
    theme: 'light' | 'dark';
    scale?: ScaleMode;
    pageNumber: number;
    pageLayout: PageLayout;
    numPages: number | null;
    onDocumentLoadSuccess: ({ numPages }: PDFDocumentProxy) => void;
    wrapperRef: React.RefObject<HTMLDivElement>;
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
    wrapperRef,
    translations 
}) => {
    useEffect(() => {
        if (wrapperRef.current) {
           wrapperRef.current.scrollTop = 0;
        }
    }, [pageNumber, file, wrapperRef]);
    
    const actualScale = typeof scale === 'number' ? scale : 1.0;

    const renderPages = () => {
        const isSinglePageLayout = pageLayout === 'single' || !numPages || pageNumber === 1;

        if (isSinglePageLayout) {
            return (
                <Page 
                    key={`page_${pageNumber}`}
                    pageNumber={pageNumber} 
                    scale={actualScale}
                    renderAnnotationLayer={false}
                    renderTextLayer={true}
                    className="shadow-md"
                />
            );
        }

        const startPage = pageNumber % 2 === 0 ? pageNumber -1 : pageNumber;
        if(startPage === 0) return null;
        
        const firstPageOfPair = Math.max(1, startPage);
        const secondPageOfPair = firstPageOfPair + 1;
        
        return (
            <div className="flex justify-center items-start gap-x-2">
                <Page 
                    key={`page_${firstPageOfPair}`}
                    pageNumber={firstPageOfPair} 
                    scale={actualScale}
                    renderAnnotationLayer={false}
                    renderTextLayer={true}
                    className="shadow-md"
                />
                 {secondPageOfPair <= numPages && (
                    <Page 
                        key={`page_${secondPageOfPair}`}
                        pageNumber={secondPageOfPair} 
                        scale={actualScale}
                        renderAnnotationLayer={false}
                        renderTextLayer={true}
                        className="shadow-md"
                    />
                 )}
            </div>
        );
    }

    return (
        <div ref={wrapperRef} className="flex-1 flex justify-center items-start p-4 overflow-y-auto">
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
        </div>
    );
};

export default PdfViewer;
