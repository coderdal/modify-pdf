'use client';

import { useState } from 'react';
import axios from 'axios';
import PageContainer from '../components/common/PageContainer';
import PdfOperationForm from '../components/molecules/PdfOperationForm';
import ResultView from '../components/molecules/ResultView';
import Alert from '../components/atoms/Alert';

const EXPORT_FORMATS = {
    docx: { label: 'Word Document (DOCX)', value: 'docx' },
    jpeg: { label: 'JPEG Images (ZIP)', value: 'jpeg' },
    png: { label: 'PNG Images (ZIP)', value: 'png' }
} as const;

interface ErrorResponse {
    status: string;
    message: string;
    code: string;
}

export default function ConvertPDF() {
    const [exportFormat, setExportFormat] = useState<keyof typeof EXPORT_FORMATS>('docx');
    const [downloadUrl, setDownloadUrl] = useState<string>('');
    const [showResult, setShowResult] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getErrorMessage = (error: unknown): string => {
        if (error && typeof error === 'object' && 'response' in error) {
            const err = error as { response?: { status?: number; data?: ErrorResponse } };
            if (err.response?.data) {
                return err.response.data.message;
            }
            switch (err.response?.status) {
                case 400:
                    return 'Invalid request. Please check your file and try again.';
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

    const handleSubmit = async (files: File | File[]) => {
        setError(null);
        
        const file = Array.isArray(files) ? files[0] : files;
        if (!file) {
            throw new Error('Please select a file');
        }

        const formData = new FormData();
        formData.append('pdf', file);
        formData.append('exportFormat', exportFormat);

        try {
            const response = await axios.post<{ status: string; data: { filePath: string; extension: string } }>(
                'http://localhost:3001/convert-pdf',
                formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                }
            );

            if (response.data.status === 'success') {
                setDownloadUrl(response.data.data.filePath);
                window.open(response.data.data.filePath, '_blank');
            } else {
                throw new Error('Failed to convert PDF');
            }
        } catch (err) {
            const errorMessage = getErrorMessage(err);
            throw new Error(errorMessage);
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
    };

    const FormatSelector = (
        <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Export Format
            </label>
            <select
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value as keyof typeof EXPORT_FORMATS)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
                {Object.entries(EXPORT_FORMATS).map(([key, format]) => (
                    <option key={key} value={format.value}>
                        {format.label}
                    </option>
                ))}
            </select>
        </div>
    );

    return (
        <PageContainer
            title="Convert PDF"
            description="Convert your PDF files to various formats while maintaining quality. Choose from Word documents or image formats."
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
                        operationName="Convert PDF"
                        downloadUrl={downloadUrl}
                        onBack={handleBack}
                    />
                ) : (
                    <PdfOperationForm
                        onSubmit={handleSubmit}
                        operationName="Convert PDF"
                        maxFileSize={50}
                        additionalFields={FormatSelector}
                        onComplete={handleComplete}
                    />
                )}

                <div className="mt-8 border-t border-gray-200 pt-8">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        About PDF Conversion
                    </h2>
                    <div className="prose prose-indigo max-w-none">
                        <p>
                            Our PDF conversion tool allows you to convert your PDF files to various formats while maintaining the highest quality possible. Here&apos;s what you can do:
                        </p>
                        <ul>
                            <li><strong>Convert to Word (DOCX)</strong> - Perfect for editing text and content</li>
                            <li><strong>Convert to Images (JPEG/PNG)</strong> - Great for sharing on social media or using in presentations</li>
                        </ul>
                        <div className="bg-blue-50 p-4 rounded-md mt-4">
                            <p className="text-sm text-blue-700">
                                <strong>Note:</strong> When converting to images, you&apos;ll receive a ZIP file containing all pages as separate image files.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </PageContainer>
    );
} 