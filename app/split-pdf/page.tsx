'use client';

import { useState } from 'react';
import axios from 'axios';
import { PDFDocument } from 'pdf-lib';
import PageContainer from '../components/common/PageContainer';
import PdfOperationForm from '../components/molecules/PdfOperationForm';
import ResultView from '../components/molecules/ResultView';
import Alert from '../components/atoms/Alert';

interface ErrorResponse {
    status: string;
    message: string;
    code: string;
}

export default function SplitPDF() {
    const [fromPage, setFromPage] = useState<number>(1);
    const [toPage, setToPage] = useState<number>(1);
    const [maxPage, setMaxPage] = useState<number>(1);
    const [downloadUrl, setDownloadUrl] = useState<string>('');
    const [showResult, setShowResult] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [tempFromPage, setTempFromPage] = useState<string>('1');
    const [tempToPage, setTempToPage] = useState<string>('1');
    const [isValid, setIsValid] = useState(true);

    const getErrorMessage = (error: unknown): string => {
        if (error && typeof error === 'object' && 'response' in error) {
            const err = error as { response?: { status?: number; data?: ErrorResponse } };
            if (err.response?.data) {
                return err.response.data.message;
            }
            switch (err.response?.status) {
                case 400:
                    return 'Invalid request. Please check your file and page range.';
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
            if (fromPage > toPage) {
                throw new Error('Start page cannot be greater than end page');
            }
            
            const file = Array.isArray(files) ? files[0] : files;
            if (!file) {
                throw new Error('Please select a file');
            }

            const formData = new FormData();
            formData.append('pdf', file);
            formData.append('fromPage', fromPage.toString());
            formData.append('toPage', toPage.toString());

            const response = await axios.post<{ status: string; data: { filePath: string } }>(
                'http://localhost:3001/split-pdf',
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
                throw new Error('Failed to split PDF');
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
        setFromPage(1);
        setToPage(1);
    };

    const validatePageNumbers = () => {
        const fromNum = parseInt(tempFromPage);
        const toNum = parseInt(tempToPage);
        
        const isValidFrom = !isNaN(fromNum) && fromNum >= 1 && fromNum <= maxPage;
        const isValidTo = !isNaN(toNum) && toNum >= 1 && toNum <= maxPage;
        const isValidRange = fromNum < toNum;
        
        setIsValid(isValidFrom && isValidTo && isValidRange);
        return isValidFrom && isValidTo && isValidRange;
    };

    const handleFromPageBlur = () => {
        const num = parseInt(tempFromPage);
        if (!isNaN(num)) {
            const validNum = Math.max(1, Math.min(maxPage, num));
            setFromPage(validNum);
            setTempFromPage(validNum.toString());
        } else {
            setTempFromPage(fromPage.toString());
        }
        validatePageNumbers();
    };

    const handleToPageBlur = () => {
        const num = parseInt(tempToPage);
        if (!isNaN(num)) {
            const validNum = Math.max(1, Math.min(maxPage, num));
            setToPage(validNum);
            setTempToPage(validNum.toString());
        } else {
            setTempToPage(toPage.toString());
        }
        validatePageNumbers();
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
            setMaxPage(pageCount);
            setToPage(pageCount);
            setTempToPage(pageCount.toString());
            setFromPage(1);
            setTempFromPage('1');
            setIsValid(true);
        } catch {
            setError('Failed to read PDF file. Please make sure it is a valid PDF.');
        }
    };

    const PageRangeFields = (
        <div className="mt-6 grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    From Page
                </label>
                <input
                    type="number"
                    min={1}
                    max={maxPage}
                    value={tempFromPage}
                    onChange={(e) => {
                        setTempFromPage(e.target.value);
                        const fromNum = parseInt(e.target.value);
                        const toNum = parseInt(tempToPage);
                        
                        const isValidFrom = !isNaN(fromNum) && fromNum >= 1 && fromNum <= maxPage;
                        const isValidTo = !isNaN(toNum) && toNum >= 1 && toNum <= maxPage;
                        const isValidRange = fromNum < toNum;
                        
                        setIsValid(isValidFrom && isValidTo && isValidRange);
                    }}
                    onBlur={handleFromPageBlur}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    To Page
                </label>
                <input
                    type="number"
                    min={1}
                    max={maxPage}
                    value={tempToPage}
                    onChange={(e) => {
                        setTempToPage(e.target.value);
                        const toNum = parseInt(e.target.value);
                        const fromNum = parseInt(tempFromPage);
                        
                        const isValidFrom = !isNaN(fromNum) && fromNum >= 1 && fromNum <= maxPage;
                        const isValidTo = !isNaN(toNum) && toNum >= 1 && toNum <= maxPage;
                        const isValidRange = fromNum < toNum;
                        
                        setIsValid(isValidFrom && isValidTo && isValidRange);
                    }}
                    onBlur={handleToPageBlur}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                />
            </div>
            <div className="col-span-2 space-y-1">
                <p className="text-sm text-gray-500">
                    This PDF has {maxPage} page{maxPage !== 1 ? 's' : ''}
                </p>
                {!isValid && (
                    <p className="text-sm text-red-500">
                        Please enter valid page numbers between 1 and {maxPage}. End page must be greater than start page.
                    </p>
                )}
            </div>
        </div>
    );

    return (
        <PageContainer
            title="Split PDF"
            description="Extract specific pages from your PDF document."
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
                        operationName="Split PDF"
                        downloadUrl={downloadUrl}
                        onBack={handleBack}
                    />
                ) : (
                    <PdfOperationForm
                        onSubmit={handleSubmit}
                        operationName="Split PDF"
                        maxFileSize={50}
                        additionalFields={PageRangeFields}
                        onComplete={handleComplete}
                        onFileSelect={handleFileSelect}
                        isLoading={isLoading}
                        isValid={isValid}
                    />
                )}

                <div className="mt-8 border-t border-gray-200 pt-8">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        About PDF Splitting
                    </h2>
                    <div className="prose prose-indigo max-w-none">
                        <p>
                            Our tool helps you extract specific pages from your PDF documents. Here&apos;s what you need to know:
                        </p>
                        <ul>
                            <li><strong>Page Range:</strong> Select the start and end pages to extract</li>
                            <li><strong>Preserve Quality:</strong> Your PDF quality remains unchanged</li>
                            <li><strong>Instant Download:</strong> Get your split PDF immediately after processing</li>
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