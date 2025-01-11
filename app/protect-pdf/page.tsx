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

export default function ProtectPDF() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
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

    const validatePasswords = () => {
        if (password.length < 6) {
            throw new Error('Password must be at least 6 characters long');
        }
        if (password !== confirmPassword) {
            throw new Error('Passwords do not match');
        }
    };

    const handleSubmit = async (files: File | File[]) => {
        setError(null);
        
        try {
            validatePasswords();
            
            const file = Array.isArray(files) ? files[0] : files;
            if (!file) {
                throw new Error('Please select a file');
            }

            const formData = new FormData();
            formData.append('pdf', file);
            formData.append('password', password);

            const response = await axios.post<{ status: string; data: { filePath: string } }>(
                'http://localhost:3001/protect-pdf',
                formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                }
            );

            if (response.data.status === 'success') {
                setDownloadUrl(response.data.data.filePath);
                window.open(response.data.data.filePath, '_blank');
            } else {
                throw new Error('Failed to protect PDF');
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
        setConfirmPassword('');
    };

    const PasswordFields = (
        <div className="mt-6 space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                </label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter password"
                    minLength={6}
                    required
                />
                <p className="mt-1 text-sm text-gray-500">
                    Must be at least 6 characters long
                </p>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                </label>
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Confirm password"
                    minLength={6}
                    required
                />
            </div>
        </div>
    );

    return (
        <PageContainer
            title="Protect PDF"
            description="Add password protection to your PDF files with strong encryption."
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
                        operationName="Protect PDF"
                        downloadUrl={downloadUrl}
                        onBack={handleBack}
                    />
                ) : (
                    <PdfOperationForm
                        onSubmit={handleSubmit}
                        operationName="Protect PDF"
                        maxFileSize={50}
                        additionalFields={PasswordFields}
                        onComplete={handleComplete}
                    />
                )}

                <div className="mt-8 border-t border-gray-200 pt-8">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        About PDF Protection
                    </h2>
                    <div className="prose prose-indigo max-w-none">
                        <p>
                            Our PDF protection tool allows you to secure your PDF files with password encryption. Features include:
                        </p>
                        <ul>
                            <li><strong>Strong Encryption:</strong> Uses AES-256 encryption for maximum security</li>
                            <li><strong>Password Protection:</strong> Prevent unauthorized access to your documents</li>
                            <li><strong>Secure Process:</strong> Your files are processed securely and deleted after download</li>
                        </ul>
                        <div className="bg-yellow-50 p-4 rounded-md mt-4">
                            <p className="text-sm text-yellow-700">
                                <strong>Important:</strong> Please remember your password! There is no way to recover the PDF if you forget it.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </PageContainer>
    );
} 