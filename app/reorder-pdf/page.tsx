'use client';

import { useState } from 'react';
import axios from 'axios';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import PageContainer from '../components/common/PageContainer';
import PdfOperationForm from '../components/molecules/PdfOperationForm';
import ResultView from '../components/molecules/ResultView';
import Alert from '../components/atoms/Alert';
import DraggablePageList from '../components/molecules/DraggablePageList';
import { PDFDocument } from 'pdf-lib';

interface ErrorResponse {
    status: string;
    message: string;
    code: string;
}

export default function ReorderPDF() {
    const [pages, setPages] = useState<number[]>([]);
    const [downloadUrl, setDownloadUrl] = useState<string>('');
    const [showResult, setShowResult] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const getErrorMessage = (error: unknown): string => {
        if (error && typeof error === 'object' && 'response' in error) {
            const err = error as { response?: { status?: number; data?: ErrorResponse } };
            if (err.response?.data) {
                return err.response.data.message;
            }
            switch (err.response?.status) {
                case 400:
                    return 'Invalid request. Please check your file and page order.';
                case 413:
                    return 'File size is too large. Please try a smaller file.';
                case 415:
                    return 'Invalid file type. Please upload a PDF file.';
                case 429:
                    return 'Too many requests. Please try again later.';
                case 500:
                    return 'Server error. Please try again later.';
                default:
                    return 'An error occurred while processing your request.';
            }
        }
        return 'An unexpected error occurred.';
    };

    const handleSubmit = async (files: File | File[]): Promise<void> => {
        setError(null);
        setIsLoading(true);
        
        try {
            if (pages.length === 0) {
                throw new Error('Please select pages to reorder');
            }
            
            const file = Array.isArray(files) ? files[0] : files;
            if (!file) {
                throw new Error('Please select a file');
            }

            const formData = new FormData();
            formData.append('pdf', file);
            formData.append('pageOrder', pages.join(','));

            const response = await axios.post<{ status: string; data: { filePath: string } }>(
                'http://localhost:3001/reorder-pdf',
                formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                }
            );

            if (response.data.status === 'success') {
                setDownloadUrl(response.data.data.filePath);
                window.open(response.data.data.filePath, '_blank');
                setShowResult(true);
            } else {
                throw new Error('Failed to reorder PDF pages');
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : getErrorMessage(err);
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleComplete = (success: boolean) => {
        if (success) {
            setShowResult(true);
        }
    };

    const handleBack = () => {
        setShowResult(false);
        setDownloadUrl('');
        setError(null);
        setPages([]);
    };

    const handleFileSelect = async (files: File | File[]): Promise<void> => {
        setError(null);
        try {
            const file = Array.isArray(files) ? files[0] : files;
            if (!file) {
                throw new Error('Please select a file');
            }

            const fileBuffer = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(fileBuffer);
            const pageCount = pdfDoc.getPageCount();
            setPages(Array.from({ length: pageCount }, (_, i) => i + 1));
        } catch (error) {
            setError('Failed to read PDF file. Please make sure it is a valid PDF.');
        }
    };

    const PageOrderField = (
        <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Page Order
            </label>
            <DndProvider backend={HTML5Backend}>
                <DraggablePageList
                    pages={pages}
                    onReorder={setPages}
                />
            </DndProvider>
            <p className="mt-1 text-sm text-gray-500">
                Drag and drop pages to reorder them
            </p>
        </div>
    );

    return (
        <PageContainer
            title="Reorder PDF Pages"
            description="Rearrange the pages in your PDF document easily."
        >
            <div className="space-y-8">
                {error && (
                    <Alert
                        type="error"
                        message={error}
                        onClose={() => setError(null)}
                    />
                )}

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
                        additionalFields={PageOrderField}
                        onComplete={handleComplete}
                        onFileSelect={handleFileSelect}
                        isLoading={isLoading}
                    />
                )}

                <div className="mt-8 border-t border-gray-200 pt-8">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        About PDF Page Reordering
                    </h2>
                    <div className="prose prose-indigo max-w-none">
                        <p>
                            Our tool helps you rearrange pages in your PDF documents easily. Here&apos;s what you need to know:
                        </p>
                        <ul>
                            <li><strong>Simple Interface:</strong> Drag and drop pages to reorder them</li>
                            <li><strong>Preserve Quality:</strong> Your PDF quality remains unchanged</li>
                            <li><strong>Instant Download:</strong> Get your reordered PDF immediately after processing</li>
                        </ul>
                        <div className="bg-blue-50 p-4 rounded-md mt-4">
                            <p className="text-sm text-blue-700">
                                <strong>Note:</strong> This tool works best with PDFs that are not password protected. If your PDF is protected, please remove the protection first.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </PageContainer>
    );
} 