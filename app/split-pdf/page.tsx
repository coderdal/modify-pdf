'use client';

import { useState } from 'react';
import axios from 'axios';
import PageContainer from '../components/common/PageContainer';
import PdfOperationForm from '../components/molecules/PdfOperationForm';
import ResultView from '../components/molecules/ResultView';

export default function SplitPDF() {
    const [fromPage, setFromPage] = useState('');
    const [toPage, setToPage] = useState('');
    const [downloadUrl, setDownloadUrl] = useState<string>('');
    const [showResult, setShowResult] = useState(false);

    const handleSubmit = async (file: File) => {
        if (!fromPage || !toPage) {
            throw new Error('Please enter both from and to page numbers');
        }

        const fromPageNum = parseInt(fromPage);
        const toPageNum = parseInt(toPage);

        if (isNaN(fromPageNum) || isNaN(toPageNum)) {
            throw new Error('Please enter valid page numbers');
        }

        if (fromPageNum < 1) {
            throw new Error('From page must be at least 1');
        }

        if (fromPageNum > toPageNum) {
            throw new Error('From page cannot be greater than to page');
        }

        const formData = new FormData();
        formData.append('pdf', file);
        formData.append('fromPage', fromPage);
        formData.append('toPage', toPage);

        const response = await axios.post<{ status: string; data: { filePath: string } }>(
            'http://localhost:3001/split-pdf',
            formData,
            {
                headers: { 'Content-Type': 'multipart/form-data' },
            }
        );

        if (response.data.status !== 'success') {
            throw new Error('Failed to split PDF');
        }

        setDownloadUrl(response.data.data.filePath);
        // Automatically open download in new tab
        window.open(response.data.data.filePath, '_blank');
    };

    const handleComplete = (success: boolean) => {
        if (success) {
            setShowResult(true);
        }
    };

    const handleBack = () => {
        setShowResult(false);
        setDownloadUrl('');
        setFromPage('');
        setToPage('');
    };

    const PageRangeSelector = (
        <div className="mt-6 space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        From Page
                    </label>
                    <input
                        type="number"
                        min="1"
                        value={fromPage}
                        onChange={(e) => setFromPage(e.target.value)}
                        placeholder="1"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        To Page
                    </label>
                    <input
                        type="number"
                        min="1"
                        value={toPage}
                        onChange={(e) => setToPage(e.target.value)}
                        placeholder="e.g., 5"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
            </div>
            <p className="text-sm text-gray-500">
                Enter the range of pages you want to extract. For example, entering 1 and 5 will create a new PDF with pages 1 to 5.
            </p>
        </div>
    );

    return (
        <PageContainer
            title="Split PDF"
            description="Extract specific pages from your PDF document by selecting a page range."
        >
            <div className="space-y-8">
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
                        additionalFields={PageRangeSelector}
                        onComplete={handleComplete}
                    />
                )}

                <div className="mt-8 border-t border-gray-200 pt-8">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        About PDF Splitting
                    </h2>
                    <div className="prose prose-indigo max-w-none">
                        <p>
                            Our PDF splitting tool allows you to extract specific pages from your PDF documents. Here&apos;s what you can do:
                        </p>
                        <ul>
                            <li>Extract any range of pages from your PDF</li>
                            <li>Create a new PDF with only the pages you need</li>
                            <li>Maintain original formatting and quality</li>
                            <li>Process files up to 50MB</li>
                            <li>Download the split PDF instantly</li>
                        </ul>
                        <div className="bg-blue-50 p-4 rounded-md mt-4">
                            <p className="text-sm text-blue-700">
                                <strong>Tip:</strong> Make sure to enter valid page numbers that exist in your PDF. 
                                The tool will automatically validate your input to prevent errors.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </PageContainer>
    );
} 