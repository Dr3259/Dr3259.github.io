
"use client";

import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import type { PDFDocumentProxy } from 'pdfjs-dist';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';

// Setup pdf.js worker. This is required for react-pdf to work.
// Use a stable CDN link to ensure version consistency.
if (typeof window !== 'undefined') {
    pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
}

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

    return (
        <div className="flex-1 flex flex-col min-h-0">
            <div className="p-4 border-b text-center shrink-0 flex justify-between items-center"
              style={{
                backgroundColor: theme === 'dark' ? 'hsl(222, 12%, 18%)' : 'hsl(0, 0%, 98%)',
                borderColor: theme === 'dark' ? 'hsl(222, 12%, 25%)' : 'hsl(0, 0%, 93%)',
              }}
            >
                <div className="w-1/4"></div>
                <h3 className="font-semibold text-lg truncate w-1/2" title={title}>{title}</h3>
                <div className="w-1/4 text-right">
                    {numPages && (
                         <div className="flex items-center justify-end gap-2">
                            <Button variant="outline" size="icon" className="h-8 w-8" onClick={goToPrevPage} disabled={pageNumber <= 1}>
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <span className="text-sm font-medium text-muted-foreground tabular-nums">
                                {translations.page(pageNumber, numPages)}
                            </span>
                            <Button variant="outline" size="icon" className="h-8 w-8" onClick={goToNextPage} disabled={pageNumber >= numPages}>
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    )}
                </div>
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
