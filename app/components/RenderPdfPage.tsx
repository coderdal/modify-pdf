'use client';

import React, { useRef, useEffect, useState } from 'react';
import * as pdfJS from 'pdfjs-dist';


pdfJS.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

interface RenderPdfPageProps {
    pageNumber: number;
    pdfFile: File;
    width: number;
    height: number;
}

const RenderPdfPage: React.FC<RenderPdfPageProps> = ({ pageNumber, pdfFile, width, height }) => {
    const pdfViewerRef = useRef<HTMLCanvasElement>(null);
    const [pdfDocument, setPdfDocument] = useState<pdfJS.PDFDocumentProxy | null>(null);
    const [isMounted, setIsMounted] = useState<boolean>(true);

    useEffect(() => {
        setIsMounted(true);

        const loadPdf = async () => {
            try {
                const arrayBuffer = await pdfFile.arrayBuffer();
                const pdf = await pdfJS.getDocument({ data: arrayBuffer }).promise;
                if (isMounted) {
                    setPdfDocument(pdf);
                }
            } catch (error) {
                console.error('Error loading PDF:', error);
            }
        };

        loadPdf();

        return () => {
            setIsMounted(false);
            if (pdfDocument) {
                pdfDocument.destroy();
            }
        };
    }, [pdfFile]);

    useEffect(() => {
        if (!pdfDocument || !isMounted) return;

        let renderTask: pdfJS.RenderTask | null = null;

        const renderPage = async () => {
            const pdfViewer = pdfViewerRef.current;
            if (!pdfViewer) return;

            try {
                const page = await pdfDocument.getPage(pageNumber);
                const viewport = page.getViewport({ scale: 1 });
                const scale = Math.min(width / viewport.width, height / viewport.height);
                const scaledViewport = page.getViewport({ scale });

                pdfViewer.width = scaledViewport.width;
                pdfViewer.height = scaledViewport.height;

                const context = pdfViewer.getContext('2d');
                if (!context) return;

                const renderContext = {
                    canvasContext: context,
                    viewport: scaledViewport
                };

                if (renderTask) {
                    renderTask.cancel();
                }

                renderTask = page.render(renderContext);
                await renderTask.promise;
            } catch (error) {
                if (error instanceof Error && error.name === 'RenderingCancelledException') {
                    console.log('Rendering cancelled');
                } else {
                    console.error('Rendering error:', error);
                }
            }
        };

        renderPage();

        return () => {
            if (renderTask) {
                renderTask.cancel();
            }
        };
    }, [pdfDocument, pageNumber, width, height, isMounted]);

    return (
        <div style={{ width: `${width}px`, height: `${height}px`, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <canvas ref={pdfViewerRef}></canvas>
        </div>
    );
}

export default RenderPdfPage;
