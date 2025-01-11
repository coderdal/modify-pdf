'use client';

import { useState } from 'react';
import axios from 'axios';
import PageContainer from '../components/common/PageContainer';
import PdfOperationForm from '../components/molecules/PdfOperationForm';
import ResultView from '../components/molecules/ResultView';
import Alert from '../components/atoms/Alert';

const COMPRESSION_LEVELS = {
    LOW: { label: 'Low (Better Quality)', value: 'LOW' },
    MEDIUM: { label: 'Medium (Balanced)', value: 'MEDIUM' },
    HIGH: { label: 'High (Smallest Size)', value: 'HIGH' }
} as const;

interface ErrorResponse {
    status: string;
    message: string;
    code: string;
}

export default function CompressPDF() {
    const [compressionLevel, setCompressionLevel] = useState<keyof typeof COMPRESSION_LEVELS>('MEDIUM');
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
        formData.append('compressionLevel', compressionLevel);

        try {
            const response = await axios.post<{ status: string; data: { filePath: string } }>(
                'http://localhost:3001/compress-pdf',
                formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                }
            );

            if (response.data.status === 'success') {
                setDownloadUrl(response.data.data.filePath);
                window.open(response.data.data.filePath, '_blank');
            } else {
                throw new Error('Failed to compress PDF');
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

    const CompressionSelector = (
        <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Compression Level
            </label>
            <select
                value={compressionLevel}
                onChange={(e) => setCompressionLevel(e.target.value as keyof typeof COMPRESSION_LEVELS)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
                {Object.entries(COMPRESSION_LEVELS).map(([key, level]) => (
                    <option key={key} value={level.value}>
                        {level.label}
                    </option>
                ))}
            </select>
        </div>
    );

    return (
        <PageContainer
            title="Compress PDF"
            description="Reduce your PDF file size while maintaining quality. Our tool ensures the best balance between size and quality."
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
                        operationName="Compress PDF"
                        downloadUrl={downloadUrl}
                        onBack={handleBack}
                    />
                ) : (
                    <PdfOperationForm
                        onSubmit={handleSubmit}
                        operationName="Compress PDF"
                        maxFileSize={50}
                        additionalFields={CompressionSelector}
                        onComplete={handleComplete}
                    />
                )}

                <div className="mt-8 border-t border-gray-200 pt-8">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        About PDF Compression
                    </h2>
                    <div className="prose prose-indigo max-w-none">
                        <p>
                            Our PDF compression tool helps you reduce file sizes while maintaining the best possible quality. Choose from different compression levels:
                        </p>
                        <ul>
                            <li><strong>Low Compression:</strong> Best for documents with high-quality images</li>
                            <li><strong>Medium Compression:</strong> Balanced option for most PDFs</li>
                            <li><strong>High Compression:</strong> Maximum size reduction, suitable for basic documents</li>
                        </ul>
                        <p className="text-sm text-gray-500 mt-4">
                            Note: The actual compression ratio depends on the content of your PDF.
                        </p>
                    </div>
                </div>
            </div>
        </PageContainer>
    );
} 