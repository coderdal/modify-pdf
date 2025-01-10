'use client';

import { useState } from 'react';
import axios from 'axios';
import PageContainer from '../components/common/PageContainer';
import PdfOperationForm from '../components/molecules/PdfOperationForm';
import ResultView from '../components/molecules/ResultView';

export default function RemovePDFProtection() {
    const [password, setPassword] = useState('');
    const [downloadUrl, setDownloadUrl] = useState<string>('');
    const [showResult, setShowResult] = useState(false);

    const handleSubmit = async (files: File | File[]) => {
        const file = Array.isArray(files) ? files[0] : files;
        
        if (!password) {
            throw new Error('Please enter the PDF password');
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

        if (response.data.status !== 'success') {
            throw new Error('Failed to remove PDF protection. Please check if the password is correct.');
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
        setPassword('');
    };

    const PasswordInput = (
        <div className="mt-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                PDF Password
            </label>
            <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter the PDF password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            <p className="mt-1 text-sm text-gray-500">
                Enter the password that was used to protect the PDF file
            </p>
            <div className="bg-yellow-50 p-4 rounded-md mt-4">
                <p className="text-sm text-yellow-700">
                    <strong>Note:</strong> This tool can only remove protection from PDFs where you know the password. 
                    We cannot bypass or crack PDF passwords.
                </p>
            </div>
        </div>
    );

    return (
        <PageContainer
            title="Remove PDF Protection"
            description="Remove password protection and restrictions from your PDF files."
        >
            <div className="space-y-8">
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
                        additionalFields={PasswordInput}
                        onComplete={handleComplete}
                    />
                )}

                <div className="mt-8 border-t border-gray-200 pt-8">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        About PDF Protection Removal
                    </h2>
                    <div className="prose prose-indigo max-w-none">
                        <p>
                            Our PDF protection removal tool helps you remove password protection and restrictions from your PDF files. Here&apos;s what you need to know:
                        </p>
                        <ul>
                            <li>Remove password protection from PDF files</li>
                            <li>Remove restrictions on printing, copying, and editing</li>
                            <li>Maintain original PDF quality and formatting</li>
                            <li>Process files up to 50MB</li>
                            <li>Secure and private processing</li>
                        </ul>
                        <div className="bg-blue-50 p-4 rounded-md mt-4">
                            <p className="text-sm text-blue-700">
                                <strong>Important:</strong> You must have the correct password to remove protection from a PDF file. 
                                This tool cannot bypass or crack PDF passwords.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </PageContainer>
    );
} 