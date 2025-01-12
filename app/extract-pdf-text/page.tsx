"use client";

import { useState } from 'react';
import * as PDFJS from 'pdfjs-dist/legacy/build/pdf.mjs';
import type { TextItem } from 'pdfjs-dist/types/src/display/api';
import PageContainer from '../components/common/PageContainer';
import PdfOperationForm from '../components/molecules/PdfOperationForm';

PDFJS.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
).toString();

export default function ExtractPDFText() {
    const [extractedText, setExtractedText] = useState<string>('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const handleSubmit = async (files: File | File[]) => {
        const file = Array.isArray(files) ? files[0] : files;
        setIsProcessing(true);
        setExtractedText('');
        
        try {
            const fileBuffer = await file.arrayBuffer();
            const pdf = await PDFJS.getDocument(fileBuffer).promise;
            const numPages = pdf.numPages;
            setTotalPages(numPages);
            
            let fullText = '';

            for (let i = 1; i <= numPages; i++) {
                setCurrentPage(i);
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();

                const pageText = textContent.items
                    .filter((item): item is TextItem => 'str' in item)
                    .map((item) => item.str)
                    .join('') + '\n\n';

                fullText += `Page ${i}:\n${pageText}`;
            }

            setExtractedText(fullText);
        } catch {
            throw new Error('Failed to extract text from PDF. Please try again.');
        } finally {
            setIsProcessing(false);
            setCurrentPage(0);
        }
    };

    const handleCopyText = () => {
        navigator.clipboard.writeText(extractedText);
    };

    const handleDownloadText = () => {
        const blob = new Blob([extractedText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'extracted-text.txt';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const ProgressInfo = isProcessing && (
        <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${(currentPage / totalPages) * 100}%` }}
                />
            </div>
            <p className="text-sm text-gray-600 mt-2 text-center">
                Processing page {currentPage} of {totalPages}
            </p>
        </div>
    );

    const ExtractedContent = extractedText && (
        <div className="mt-6 space-y-4">
            <div className="flex justify-end space-x-4 mb-2">
                <button
                    onClick={handleCopyText}
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Copy Text
                </button>
                <button
                    onClick={handleDownloadText}
                    className="px-4 py-2 text-sm font-medium text-indigo-700 bg-indigo-100 rounded-md hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Download as TXT
                </button>
            </div>
            <div className="relative">
                <textarea
                    value={extractedText}
                    readOnly
                    className="w-full h-[400px] p-4 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm"
                />
            </div>
        </div>
    );

    return (
        <PageContainer
            title="Extract PDF Text"
            description="Extract and copy text content from your PDF documents."
        >
            <div className="space-y-8">
                <PdfOperationForm
                    onSubmit={handleSubmit}
                    operationName="Extract Text"
                    maxFileSize={50}
                    additionalFields={ProgressInfo}
                    isLoading={isProcessing}
                />

                {ExtractedContent}

                <div className="mt-8 border-t border-gray-200 pt-8">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        About PDF Text Extraction
                    </h2>
                    <div className="prose prose-indigo max-w-none">
                        <p>
                            Our PDF text extraction tool helps you extract text content from your PDF documents. Here&apos;s what you can do:
                        </p>
                        <ul>
                            <li>Extract text from any PDF document</li>
                            <li>Maintain text formatting with page breaks</li>
                            <li>Copy extracted text to clipboard</li>
                            <li>Download text as a TXT file</li>
                            <li>Process files up to 50MB</li>
                        </ul>
                        <div className="bg-blue-50 p-4 rounded-md mt-4">
                            <p className="text-sm text-blue-700">
                                <strong>Note:</strong> The quality of text extraction depends on how the PDF was created. 
                                Scanned documents or PDFs with complex layouts might not extract perfectly.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </PageContainer>
    );
}