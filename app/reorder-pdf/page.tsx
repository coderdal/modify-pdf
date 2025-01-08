'use client';

import React, { useState, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import UploadButton from '../components/UploadButton';
import RenderPdfPage from '../components/RenderPdfPage';

interface DragItem {
    type: string;
    id: string;
    index: number;
}

interface PageCardProps {
    id: number;
    index: number;
    pageNum: number;
    moveCard: (dragIndex: number, hoverIndex: number) => void;
    pdfFile: File;
}

const ItemTypes = {
    CARD: 'card',
};

const PageCard: React.FC<PageCardProps> = ({ id, index, pageNum, moveCard, pdfFile }) => {
    const ref = React.useRef<HTMLDivElement>(null);

    const [{ isDragging }, drag] = useDrag({
        type: ItemTypes.CARD,
        item: { type: ItemTypes.CARD, id: id.toString(), index },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const [, drop] = useDrop({
        accept: ItemTypes.CARD,
        hover(item: DragItem) {
            if (!ref.current) {
                return;
            }
            const dragIndex = item.index;
            const hoverIndex = index;

            if (dragIndex === hoverIndex) {
                return;
            }

            moveCard(dragIndex, hoverIndex);
            item.index = hoverIndex;
        },
    });

    drag(drop(ref));

    return (
        <div
            ref={ref}
            style={{ opacity: isDragging ? 0.5 : 1 }}
            className="border rounded-lg p-2 bg-gray-50 cursor-move"
        >
            <div className="text-center text-sm font-medium mb-2">
                Page {pageNum}
            </div>
            <RenderPdfPage
                pageNumber={pageNum}
                pdfFile={pdfFile}
                width={150}
                height={200}
            />
        </div>
    );
};

const ReorderPDF = () => {
    const [file, setFile] = useState<File | null>(null);
    const [pageCount, setPageCount] = useState(0);
    const [pageOrder, setPageOrder] = useState<number[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [resultUrl, setResultUrl] = useState('');

    useEffect(() => {
        if (file) {
            const getPageCount = async () => {
                const arrayBuffer = await file.arrayBuffer();
                const pdf = await import('pdfjs-dist/legacy/build/pdf.mjs').then(
                    module => module.getDocument({ data: arrayBuffer }).promise
                );
                const count = pdf.numPages;
                setPageCount(count);
                setPageOrder(Array.from({ length: count }, (_, i) => i + 1));
            };
            getPageCount();
        }
    }, [file]);

    const handleFileUpload = (files: FileList) => {
        if (files.length > 0) {
            setFile(files[0]);
            setError('');
            setResultUrl('');
        }
    };

    const moveCard = (dragIndex: number, hoverIndex: number) => {
        const newOrder = [...pageOrder];
        const [draggedItem] = newOrder.splice(dragIndex, 1);
        newOrder.splice(hoverIndex, 0, draggedItem);
        setPageOrder(newOrder);
    };

    const handleReverse = () => {
        setPageOrder([...pageOrder].reverse());
    };

    const handleSubmit = async () => {
        if (!file) {
            setError('Please select a PDF file');
            return;
        }

        const formData = new FormData();
        formData.append('pdf', file);
        formData.append('pageOrder', pageOrder.join(','));

        try {
            setLoading(true);
            setError('');
            const response = await fetch('http://localhost:3001/reorder-pdf', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to reorder PDF');
            }

            const data = await response.json();
            setResultUrl(data.filePath);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An error occurred while reordering the PDF');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <main className="min-h-screen p-8">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold mb-8">Reorder PDF Pages</h1>
                    
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <div className="mb-6">
                            <UploadButton onFileUpload={handleFileUpload} />
                            {file && (
                                <p className="mt-2 text-sm text-gray-600">
                                    Selected file: {file.name}
                                </p>
                            )}
                        </div>

                        {pageCount > 0 && (
                            <div className="space-y-6">
                                <div className="flex justify-end">
                                    <button
                                        onClick={handleReverse}
                                        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                                    >
                                        Reverse Order
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {pageOrder.map((pageNum, index) => (
                                        <PageCard
                                            key={pageNum}
                                            id={pageNum}
                                            index={index}
                                            pageNum={pageNum}
                                            moveCard={moveCard}
                                            pdfFile={file!}
                                        />
                                    ))}
                                </div>

                                {error && (
                                    <div className="text-red-500 text-sm mt-2">{error}</div>
                                )}

                                <button
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                                >
                                    {loading ? 'Processing...' : 'Reorder PDF'}
                                </button>

                                {resultUrl && (
                                    <div className="mt-4">
                                        <a
                                            href={resultUrl}
                                            className="text-blue-500 hover:text-blue-600"
                                            download
                                        >
                                            Download Reordered PDF
                                        </a>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </DndProvider>
    );
};

export default ReorderPDF; 