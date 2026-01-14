
"use client";

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import dynamic from 'next/dynamic';
import type { PDFDocumentProxy, PDFPageProxy } from 'pdfjs-dist';
import type { TextItem } from 'pdfjs-dist/types/src/display/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, ChevronLeft, ChevronRight, Bookmark, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import copy from 'copy-to-clipboard';
import type { Bookmark as BookmarkType } from '@/lib/db';

const PdfViewerComponent = dynamic(() => import('@/components/PdfViewer'), {
    ssr: false,
    loading: () => (
        <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    )
});

interface PdfReaderProps {
    file: string;
    theme: 'light' | 'dark';
    pageLayout: 'single' | 'double';
    scaleMode: 'fitHeight' | 'fitWidth';
    bookmarks: BookmarkType[];
    onBookmarkToggle: (page: number, title: string) => Promise<void>;
    onAddBookmark: (page: number, title: string) => Promise<void>;
    onRemoveBookmark: (page: number) => Promise<void>;
    onOpenAddBookmarkDialog: (page: number, suggestedTitle: string) => void;
    translations: any; // Simplified for brevity
}

export const PdfReader: React.FC<PdfReaderProps> = ({
    file,
    theme,
    pageLayout,
    scaleMode,
    bookmarks,
    onRemoveBookmark,
    onOpenAddBookmarkDialog,
    translations
}) => {
    const [pdfDoc, setPdfDoc] = useState<PDFDocumentProxy | null>(null);
    const [numPages, setNumPages] = useState<number | null>(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [currentScale, setCurrentScale] = useState<number>(1.0);
    const [isCalculatingScale, setIsCalculatingScale] = useState(false);
    const [isJumpingToPage, setIsJumpingToPage] = useState(false);
    const [jumpToPageInput, setJumpToPageInput] = useState('');

    const pdfViewerWrapperRef = useRef<HTMLDivElement>(null);
    const { toast } = useToast();

    const onDocumentLoadSuccess = (doc: PDFDocumentProxy) => {
        setPdfDoc(doc);
        setNumPages(doc.numPages);
        setPageNumber(1);
    };

    const extractTextAsMarkdownFromPage = useCallback(async (page: PDFPageProxy, lineLimit?: number): Promise<string> => {
        const content = await page.getTextContent();
        const items = content.items as (TextItem & { fontName: string })[];

        if (!items || items.length === 0) return '';
        
        let lines: { y: number, text: string, isBold: boolean, isItalic: boolean, size: number, items: { x: number, str: string }[] }[] = [];
        
        items.forEach(item => {
            if (!item.str.trim()) return;
            const y = item.transform[5];
            const x = item.transform[4];
            const fontName = item.fontName || 'unknown';
            const size = item.transform[3];
            const isBold = fontName.toLowerCase().includes('bold') || fontName.toLowerCase().includes('semibold') || fontName.toLowerCase().includes('black');
            const isItalic = fontName.toLowerCase().includes('italic') || fontName.toLowerCase().includes('oblique');

            let line = lines.find(l => Math.abs(l.y - y) < 5);
            if (!line) {
                lines.push({ y, text: '', isBold, isItalic, size, items: [{x, str: item.str}] });
            } else {
                line.items.push({x, str: item.str});
                if (isBold) line.isBold = true;
                if (isItalic) line.isItalic = true;
            }
        });

        lines.sort((a, b) => b.y - a.y);
        if (lineLimit) lines = lines.slice(0, lineLimit);
        
        lines.forEach(line => {
            line.items.sort((a,b) => a.x - b.x);
            line.text = line.items.map(i => i.str).join(' ');
        });
        
        const fontSizes: number[] = lines.map(line => line.size).filter(size => size > 0);
        const mostCommonFontSize = fontSizes.length > 0 ? fontSizes.sort((a,b) =>
              fontSizes.filter(v => v===a).length
            - fontSizes.filter(v => v===b).length
        ).pop() : null;
        
        return lines.map(line => {
          let text = line.text.trim();
          if(mostCommonFontSize && !lineLimit) {
            if(line.size > mostCommonFontSize * 1.5) text = `# ${text}`;
            else if(line.size > mostCommonFontSize * 1.2) text = `## ${text}`;
          }
          if(line.isBold && line.isItalic) text = `***${text}***`;
          else if(line.isBold) text = `**${text}**`;
          else if(line.isItalic) text = `*${text}*`;
          return text;
        }).join('\n');
    }, []);

    const calculateAndSetFitWidthScale = useCallback(async () => {
        if (!pdfDoc || !pdfViewerWrapperRef.current || !numPages) return;
        setIsCalculatingScale(true);
        const page: PDFPageProxy = await pdfDoc.getPage(pageNumber);
        let pageViewport = page.getViewport({ scale: 1 });
        let totalWidth = pageViewport.width;
        if (pageLayout === 'double' && pageNumber < numPages) {
          try {
            const nextPage: PDFPageProxy = await pdfDoc.getPage(pageNumber + 1);
            const nextPageViewport = nextPage.getViewport({ scale: 1 });
            totalWidth += nextPageViewport.width;
          } catch(e) { console.warn("Could not get next page for double layout scale calculation.", e); }
        }
        const containerWidth = pdfViewerWrapperRef.current.clientWidth;
        const horizontalPadding = 32;
        setCurrentScale((containerWidth - horizontalPadding) / totalWidth);
        setIsCalculatingScale(false);
    }, [pdfDoc, pageNumber, numPages, pageLayout]);
        
    const calculateAndSetFitHeightScale = useCallback(async () => {
        if (!pdfDoc || !pdfViewerWrapperRef.current) return;
        setIsCalculatingScale(true);
        const page: PDFPageProxy = await pdfDoc.getPage(pageNumber);
        const pageViewport = page.getViewport({ scale: 1 });
        const containerHeight = pdfViewerWrapperRef.current.clientHeight;
        const verticalPadding = 32;
        const scaleY = (containerHeight - verticalPadding) / pageViewport.height;
        const resultingWidth = pageViewport.width * scaleY;
        if (resultingWidth > pdfViewerWrapperRef.current.clientWidth) {
           await calculateAndSetFitWidthScale();
        } else {
           setCurrentScale(scaleY);
        }
        setIsCalculatingScale(false);
    }, [pdfDoc, pageNumber, calculateAndSetFitWidthScale]);

    useEffect(() => {
        if(!pdfDoc) return;
        const calculateScale = async () => {
            if(scaleMode === 'fitHeight') await calculateAndSetFitHeightScale();
            else if (scaleMode === 'fitWidth') await calculateAndSetFitWidthScale();
        };
        calculateScale();
    }, [scaleMode, calculateAndSetFitHeightScale, calculateAndSetFitWidthScale, pdfDoc, pageNumber, pageLayout]);

    const goToPage = useCallback((pageNum: number) => {
        if (!numPages) return;
        setPageNumber(Math.max(1, Math.min(pageNum, numPages)));
    }, [numPages]);
    
    const goToNextPage = useCallback(() => {
        if (!numPages) return;
        const increment = pageLayout === 'double' ? 2 : 1;
        setPageNumber(prev => Math.min(prev + increment, numPages));
    }, [numPages, pageLayout]);
    
    const goToPrevPage = useCallback(() => {
        const increment = pageLayout === 'double' ? 2 : 1;
        setPageNumber(prev => Math.max(prev - increment, 1));
    }, [pageLayout]);

    useEffect(() => {
        if (!pdfDoc) return;
        const handleKeyDown = (event: KeyboardEvent) => {
          if (isJumpingToPage) return;
          const activeElement = document.activeElement;
          if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA' || (activeElement as HTMLElement).isContentEditable)) return;
          switch(event.key) {
            case 'ArrowLeft': goToPrevPage(); break;
            case 'ArrowRight': goToNextPage(); break;
            case 'ArrowUp': if (pdfViewerWrapperRef.current) pdfViewerWrapperRef.current.scrollBy({ top: -50, behavior: 'smooth' }); break;
            case 'ArrowDown': if (pdfViewerWrapperRef.current) pdfViewerWrapperRef.current.scrollBy({ top: 50, behavior: 'smooth' }); break;
          }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [goToPrevPage, goToNextPage, pdfDoc, isJumpingToPage]);
    
    const handleToggleBookmark = async () => {
      if (!pdfDoc) return;
      const isBookmarked = bookmarks.some(b => b.page === pageNumber);
      if (isBookmarked) {
        onRemoveBookmark(pageNumber);
      } else {
        try {
          const page = await pdfDoc.getPage(pageNumber);
          const title = await extractTextAsMarkdownFromPage(page, 1);
          onOpenAddBookmarkDialog(pageNumber, title || `Page ${pageNumber}`);
        } catch (error) {
          console.error("Error generating bookmark title", error);
          onOpenAddBookmarkDialog(pageNumber, `Page ${pageNumber}`);
        }
      }
    };
    
    const handleCopyPageText = async () => {
        if (!pdfDoc || !numPages) return;
        try {
            let fullText = '';
            const page1 = await pdfDoc.getPage(pageNumber);
            fullText += await extractTextAsMarkdownFromPage(page1);
            if (pageLayout === 'double' && pageNumber < numPages) {
                const page2 = await pdfDoc.getPage(pageNumber + 1);
                fullText += '\n\n---\n\n' + await extractTextAsMarkdownFromPage(page2);
            }
            if (fullText.trim()) {
                copy(fullText);
                toast({ title: translations.pageTextCopied });
            }
        } catch (err) {
            console.error("Failed to copy page text:", err);
            toast({ title: "Error copying text", variant: 'destructive' });
        }
    };
    
    const handleJumpToPageSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            const targetPage = parseInt(jumpToPageInput, 10);
            setIsJumpingToPage(false);
            setJumpToPageInput('');
            if (!isNaN(targetPage)) goToPage(targetPage);
        } else if (e.key === 'Escape') {
            setIsJumpingToPage(false);
            setJumpToPageInput('');
        }
    };
    
    const isCurrentPageBookmarked = useMemo(() => {
        return bookmarks.some(b => b.page === pageNumber);
    }, [bookmarks, pageNumber]);

    return (
        <div className="flex-1 flex flex-col min-h-0">
            <PdfViewerComponent 
                file={file} 
                theme={theme} 
                scale={currentScale} 
                isCalculatingScale={isCalculatingScale} 
                pageNumber={pageNumber} 
                pageLayout={pageLayout} 
                numPages={numPages} 
                onDocumentLoadSuccess={onDocumentLoadSuccess} 
                wrapperRef={pdfViewerWrapperRef} 
                translations={{ pdfError: translations.pdfError, pdfLoading: translations.pdfLoading }} 
            />
            <div id="reading-controls-pdf" className="fixed bottom-4 right-4 z-50 flex items-center justify-end gap-2 p-1.5 bg-background/80 border rounded-full shadow-lg backdrop-blur-sm text-foreground">
              {numPages && (
                <>
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full" onClick={goToPrevPage} disabled={pageNumber <= 1}><ChevronLeft className="h-5 w-5" /></Button>
                  {!isJumpingToPage ? (
                      <Button variant="ghost" className="text-sm font-medium text-muted-foreground tabular-nums px-2 h-9 rounded-full" onClick={() => { setJumpToPageInput(String(pageNumber)); setIsJumpingToPage(true); }}>
                          {`${pageNumber} / ${numPages}`}
                      </Button>
                  ) : (
                      <Input type="number" value={jumpToPageInput} onChange={(e) => setJumpToPageInput(e.target.value)} onKeyDown={handleJumpToPageSubmit} onBlur={() => setIsJumpingToPage(false)} className="w-20 h-8 text-center bg-input" autoFocus placeholder={translations.jumpToPage} />
                  )}
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full" onClick={goToNextPage} disabled={(pageLayout === 'single' ? pageNumber >= numPages : pageNumber >= numPages - 1)}><ChevronRight className="h-5 w-5" /></Button>
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full" onClick={handleToggleBookmark} title={isCurrentPageBookmarked ? translations.removeBookmark : translations.addBookmark}><Bookmark className={cn("h-5 w-5", isCurrentPageBookmarked && "fill-current text-primary")} /></Button>
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full" onClick={handleCopyPageText} title={translations.copyPageTextAsMarkdown}><Copy className="h-5 w-5" /></Button>
                </>
              )}
            </div>
        </div>
    );
};
