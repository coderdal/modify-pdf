import React, { useRef, useEffect, useState } from 'react';
import * as PDFJS from 'pdfjs-dist/legacy/build/pdf.mjs';

PDFJS.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
).toString();

interface RenderPdfPageProps {
    pageNumber: number;
    pdfFile: File;
    width: number;
    height: number;
}

const RenderPdfPage: React.FC<RenderPdfPageProps> = ({ pageNumber, pdfFile, width, height }) => {
    const pdfViewerRef = useRef<HTMLCanvasElement>(null);
    const [pdfDocument, setPdfDocument] = useState<PDFJS.PDFDocumentProxy | null>(null);
    const [isMounted, setIsMounted] = useState<boolean>(true);

    useEffect(() => {
        setIsMounted(true);

        const loadPdf = async () => {
            const arrayBuffer = await pdfFile.arrayBuffer();

            const pdf = await PDFJS.getDocument({ data: arrayBuffer }).promise;
            if (isMounted) {
                setPdfDocument(pdf);
            }
        };

        loadPdf();

        return () => {
            setIsMounted(false);
            if (pdfDocument) {
                pdfDocument.destroy();
            }
        };
        // eslint-disable-next-line
    }, [pdfFile]);

    useEffect(() => {
        if (!pdfDocument) return;

        let renderTask: PDFJS.RenderTask | null = null;

        const renderPage = async () => {
            const pdfViewer = pdfViewerRef.current;
            if (!pdfViewer) return;

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
            try {
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
            setIsMounted(false);
            if (renderTask) {
                renderTask.cancel();
            }
        };
    }, [pdfDocument, pageNumber, width, height]);

    return (
        <div style={{ width: `${width}px`, height: `${height}px`, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <canvas ref={pdfViewerRef}></canvas>
        </div>
    );
}

export default RenderPdfPage;
