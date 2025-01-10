'use client';

import { useState, useCallback } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { PDFDocument } from 'pdf-lib';
import PageContainer from '../components/common/PageContainer';
import PdfOperationForm from '../components/molecules/PdfOperationForm';
import ResultView from '../components/molecules/ResultView';
import RenderPdfPage from '../components/RenderPdfPage';

type DragItem = {
    type: string;
    id: number;
    index: number;
};

const ItemTypes = {
    PAGE: 'page',
};

interface DraggablePageProps {
    id: number;
    index: number;
    moveCard: (dragIndex: number, hoverIndex: number) => void;
    pdfFile: File;
}

function DraggablePage({ id, index, moveCard, pdfFile }: DraggablePageProps) {
    const [{ isDragging }, drag] = useDrag({
        type: ItemTypes.PAGE,
        item: { type: ItemTypes.PAGE, id, index },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const [, drop] = useDrop({
        accept: ItemTypes.PAGE,
        hover(item: DragItem) {
            if (item.index === index) {
                return;
            }
            moveCard(item.index, index);
            item.index = index;
        },
    });

    const ref = useCallback((node: HTMLDivElement | null) => {
        drag(drop(node));
    }, [drag, drop]);

    return (
        <div
            ref={ref}
            className={`
                relative border-2 rounded-lg p-2 cursor-move transition-all
                ${isDragging ? 'opacity-50' : 'opacity-100'}
                border-gray-300 hover:border-blue-400
            `}
        >
            <RenderPdfPage
                pageNumber={id + 1}
                pdfFile={pdfFile}
                width={150}
                height={200}
            />
            <div className="absolute top-1 right-1 bg-white rounded-full w-5 h-5 flex items-center justify-center border border-gray-300">
                <span className="text-xs">{id + 1}</span>
            </div>
        </div>
    );
}

export default function ReorderPDFPages() {
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [pageOrder, setPageOrder] = useState<number[]>([]);
    const [downloadUrl, setDownloadUrl] = useState<string>('');
    const [showResult, setShowResult] = useState(false);

    const handleFileSelect = async (files: File | File[]) => {
        const file = Array.isArray(files) ? files[0] : files;
        setPdfFile(file);
        
        try {
            const fileBuffer = await file.arrayBuffer();
            const document = await PDFDocument.load(fileBuffer);
            const pageCount = document.getPageCount();
            setPageOrder(Array.from({ length: pageCount }, (_, i) => i));
        } catch {
            throw new Error('Failed to load PDF. Please try again with a valid PDF file.');
        }
    };

    const moveCard = useCallback((dragIndex: number, hoverIndex: number) => {
        setPageOrder(prevOrder => {
            const newOrder = [...prevOrder];
            const [removed] = newOrder.splice(dragIndex, 1);
            newOrder.splice(hoverIndex, 0, removed);
            return newOrder;
        });
    }, []);

    const handleSubmit = async (files: File | File[]) => {
        const file = Array.isArray(files) ? files[0] : files;
        
        try {
            const fileBuffer = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(fileBuffer);
            const newPdf = await PDFDocument.create();
            
            // Copy pages in the new order
            for (const pageIndex of pageOrder) {
                const [page] = await newPdf.copyPages(pdfDoc, [pageIndex]);
                newPdf.addPage(page);
            }

            const pdfBytes = await newPdf.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            setDownloadUrl(url);

            // Automatically open download in new tab
            window.open(url, '_blank');
        } catch {
            throw new Error('Failed to reorder PDF pages. Please try again.');
        }
    };

    const handleComplete = (success: boolean) => {
        if (success) {
            setShowResult(true);
        }
    };

    const handleBack = () => {
        setShowResult(false);
        if (downloadUrl) {
            URL.revokeObjectURL(downloadUrl);
        }
        setDownloadUrl('');
        setPdfFile(null);
        setPageOrder([]);
    };

    const PageReorderer = pdfFile && pageOrder.length > 0 ? (
        <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-700">
                    Drag and Drop Pages to Reorder
                </h3>
            </div>
            <DndProvider backend={HTML5Backend}>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {pageOrder.map((pageNum, index) => (
                        <DraggablePage
                            key={pageNum}
                            id={pageNum}
                            index={index}
                            moveCard={moveCard}
                            pdfFile={pdfFile}
                        />
                    ))}
                </div>
            </DndProvider>
            <p className="text-sm text-gray-500 mt-2">
                Drag and drop pages to rearrange their order. The final PDF will follow this arrangement.
            </p>
        </div>
    ) : null;

    return (
        <PageContainer
            title="Reorder PDF Pages"
            description="Rearrange the pages in your PDF document using our intuitive drag-and-drop interface."
        >
            <div className="space-y-8">
                {showResult ? (
                    <ResultView
                        operationName="Reorder Pages"
                        downloadUrl={downloadUrl}
                        onBack={handleBack}
                    />
                ) : (
                    <PdfOperationForm
                        onSubmit={handleSubmit}
                        operationName="Reorder Pages"
                        maxFileSize={50}
                        additionalFields={PageReorderer}
                        onComplete={handleComplete}
                        onFileSelect={handleFileSelect}
                    />
                )}

                <div className="mt-8 border-t border-gray-200 pt-8">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        About PDF Page Reordering
                    </h2>
                    <div className="prose prose-indigo max-w-none">
                        <p>
                            Our PDF page reordering tool helps you rearrange pages in your PDF documents. Here&apos;s what you can do:
                        </p>
                        <ul>
                            <li>Preview all pages before reordering</li>
                            <li>Drag and drop pages to rearrange them</li>
                            <li>Maintain original PDF quality</li>
                            <li>Process files up to 50MB</li>
                            <li>Download the modified PDF instantly</li>
                        </ul>
                        <div className="bg-blue-50 p-4 rounded-md mt-4">
                            <p className="text-sm text-blue-700">
                                <strong>Tip:</strong> Click and drag a page to move it to a new position. 
                                The pages will automatically reorder as you drag.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </PageContainer>
    );
} 