'use client';

import { useState } from 'react';
import axios from 'axios';
import PageContainer from '../components/common/PageContainer';
import PdfOperationForm from '../components/molecules/PdfOperationForm';
import ResultView from '../components/molecules/ResultView';
import Alert from '../components/atoms/Alert';

interface ErrorResponse {
    status: string;
    message: string;
    code: string;
}

export default function RemoveProtectionPDF() {
    const [password, setPassword] = useState('');
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
                    return 'Invalid request. Please check your file and password.';
                case 401:
                    return 'Incorrect password. Please try again.';
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
        
        try {
            if (!password) {
                throw new Error('Please enter the PDF password');
            }
            
            const file = Array.isArray(files) ? files[0] : files;
            if (!file) {
                throw new Error('Please select a file');
            }

            const formData = new FormData();
            formData.append('pdf', file);
            formData.append('password', password);

            const response = await axios.post<{ status: string; data: { filePath: string } }>(
                'http://localhost:3001/remove-pdf-protection',
                formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                }
            );

            if (response.data.status === 'success') {
                setDownloadUrl(response.data.data.filePath);
                window.open(response.data.data.filePath, '_blank');
            } else {
                throw new Error('Failed to remove PDF protection');
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : getErrorMessage(err);
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
        setPassword('');
    };

    const PasswordField = (
        <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
                PDF Password
            </label>
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter the PDF password"
                required
            />
            <p className="mt-1 text-sm text-gray-500">
                Enter the password used to protect the PDF
            </p>
        </div>
    );

    return (
        <PageContainer
            title="Remove PDF Protection"
            description="Remove password protection from your PDF files securely."
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
                        operationName="Remove Protection"
                        downloadUrl={downloadUrl}
                        onBack={handleBack}
                    />
                ) : (
                    <PdfOperationForm
                        onSubmit={handleSubmit}
                        operationName="Remove Protection"
                        maxFileSize={50}
                        additionalFields={PasswordField}
                        onComplete={handleComplete}
                    />
                )}

                <div className="mt-8 border-t border-gray-200 pt-8">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        About Removing PDF Protection
                    </h2>
                    <div className="prose prose-indigo max-w-none">
                        <p>
                            Our tool helps you remove password protection from your PDF files securely. Here&apos;s what you need to know:
                        </p>
                        <ul>
                            <li><strong>Original Password Required:</strong> You must know the current password to remove protection</li>
                            <li><strong>Secure Process:</strong> Your files and passwords are processed securely</li>
                            <li><strong>Instant Download:</strong> Get your unprotected PDF immediately after processing</li>
                        </ul>
                        <div className="bg-blue-50 p-4 rounded-md mt-4">
                            <p className="text-sm text-blue-700">
                                <strong>Note:</strong> This tool can only remove protection if you have the correct password. If you&apos;ve forgotten the password, it cannot be recovered.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </PageContainer>
    );
} 