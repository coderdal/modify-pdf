"use client";

import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import PageContainer from '../components/common/PageContainer';
import PdfOperationForm from '../components/molecules/PdfOperationForm';
import ResultView from '../components/molecules/ResultView';
import RenderPdfPage from '../components/RenderPdfPage';

export default function RemovePDFPages() {
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [pdfPageCount, setPdfPageCount] = useState<number>(0);
    const [removingPages, setRemovingPages] = useState<number[]>([]);
    const [downloadUrl, setDownloadUrl] = useState<string>('');
    const [showResult, setShowResult] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isValid, setIsValid] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const validateSelection = (pages: number[]) => {
        if (pages.length === 0) {
            setError('Please select at least one page to remove');
            setIsValid(false);
            return false;
        }
        if (pages.length === pdfPageCount) {
            setError('Cannot remove all pages from the PDF');
            setIsValid(false);
            return false;
        }
        setError(null);
        setIsValid(true);
        return true;
    };

    const handleSubmit = async (files: File | File[]) => {
        const file = Array.isArray(files) ? files[0] : files;
        
        if (!validateSelection(removingPages)) {
            throw new Error(error || 'Invalid selection');
        }

        setIsLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 500));

            const fileBuffer = await file.arrayBuffer();
            const pdf = await PDFDocument.load(fileBuffer);
            
            [...removingPages].sort((a, b) => b - a).forEach(pageNum => {
                pdf.removePage(pageNum - 1);
            });

            const pdfBytes = await pdf.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            setDownloadUrl(url);

            window.open(url, '_blank');
        } catch {
            throw new Error('Failed to remove pages from PDF. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileSelect = async (files: File | File[]) => {
        const file = Array.isArray(files) ? files[0] : files;
        setPdfFile(file);
        setError(null);
        setIsValid(false);
        setRemovingPages([]);
        
        try {
            const fileBuffer = await file.arrayBuffer();
            const document = await PDFDocument.load(fileBuffer);
            setPdfPageCount(document.getPageCount());
        } catch {
            setPdfPageCount(0);
            throw new Error('Failed to load PDF. Please try again with a valid PDF file.');
        }
    };

    const toggleRemovePage = (pageNumber: number) => {
        setRemovingPages(prev => {
            const newPages = prev.includes(pageNumber)
                ? prev.filter(page => page !== pageNumber)
                : [...prev, pageNumber];
            
            const sorted = newPages.sort((a, b) => a - b);
            validateSelection(sorted);
            return sorted;
        });
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
        setPdfPageCount(0);
        setRemovingPages([]);
        setError(null);
        setIsValid(false);
    };

    const PageSelector = pdfFile && pdfPageCount > 0 ? (
        <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-700">
                    Select Pages to Remove
                </h3>
                {removingPages.length > 0 && (
                    <p className="text-sm text-gray-500">
                        Selected: {removingPages.join(', ')}
                    </p>
                )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {Array.from({ length: pdfPageCount }).map((_, index) => (
                    <div
                        key={index}
                        onClick={() => toggleRemovePage(index + 1)}
                        className={`
                            relative border-2 rounded-lg p-2 cursor-pointer transition-colors
                            ${removingPages.includes(index + 1) 
                                ? 'border-red-500 bg-red-50' 
                                : 'border-gray-300 hover:border-gray-400'
                            }
                        `}
                    >
                        <RenderPdfPage
                            pageNumber={index + 1}
                            pdfFile={pdfFile}
                            width={150}
                            height={200}
                        />
                        <div className="absolute top-1 right-1 bg-white rounded-full w-5 h-5 flex items-center justify-center border border-gray-300">
                            <span className="text-xs">{index + 1}</span>
                        </div>
                    </div>
                ))}
            </div>
            <div className="space-y-2">
                <p className="text-sm text-gray-500">
                    Click on pages to select them for removal. Selected pages will be highlighted in red.
                </p>
                {error && (
                    <p className="text-sm text-red-500">
                        {error}
                    </p>
                )}
            </div>
        </div>
    ) : null;

    return (
        <PageContainer
            title="Remove PDF Pages"
            description="Select and remove specific pages from your PDF document."
        >
            <div className="space-y-8">
                {showResult ? (
                    <ResultView
                        operationName="Remove Pages"
                        downloadUrl={downloadUrl}
                        onBack={handleBack}
                    />
                ) : (
                    <PdfOperationForm
                        onSubmit={handleSubmit}
                        operationName="Remove Pages"
                        maxFileSize={50}
                        additionalFields={PageSelector}
                        onComplete={handleComplete}
                        onFileSelect={handleFileSelect}
                        isValid={isValid}
                        isLoading={isLoading}
                    />
                )}

                <div className="mt-8 border-t border-gray-200 pt-8">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        About PDF Page Removal
                    </h2>
                    <div className="prose prose-indigo max-w-none">
                        <p>
                            Our PDF page removal tool helps you remove unwanted pages from your PDF documents. Here&apos;s what you can do:
                        </p>
                        <ul>
                            <li>Preview all pages before removing</li>
                            <li>Select multiple pages to remove at once</li>
                            <li>Maintain original PDF quality</li>
                            <li>Process files up to 50MB</li>
                            <li>Download the modified PDF instantly</li>
                        </ul>
                        <div className="bg-blue-50 p-4 rounded-md mt-4">
                            <p className="text-sm text-blue-700">
                                <strong>Tip:</strong> Click on any page to select it for removal. 
                                You can select multiple pages, and they will be highlighted in red.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </PageContainer>
    );
}