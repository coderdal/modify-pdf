'use client';

import { useState } from 'react';
import axios from 'axios';
import PageContainer from '../components/common/PageContainer';
import PdfOperationForm from '../components/molecules/PdfOperationForm';
import ResultView from '../components/molecules/ResultView';

export default function ProtectPDF() {
    const [password, setPassword] = useState('');
    const [downloadUrl, setDownloadUrl] = useState<string>('');
    const [showResult, setShowResult] = useState(false);

    const handleSubmit = async (file: File) => {
        if (!password || password.length < 6) {
            throw new Error('Password must be at least 6 characters long');
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

        if (response.data.status !== 'success') {
            throw new Error('Failed to protect PDF');
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
                Password
            </label>
            <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password to protect PDF"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                minLength={6}
            />
            <p className="mt-1 text-sm text-gray-500">
                Password must be at least 6 characters long
            </p>
        </div>
    );

    return (
        <PageContainer
            title="Protect PDF with Password"
            description="Add password protection to your PDF files. Keep your documents secure and control who can access them."
        >
            <div className="space-y-8">
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
                        additionalFields={PasswordInput}
                        onComplete={handleComplete}
                    />
                )}

                <div className="mt-8 border-t border-gray-200 pt-8">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        About PDF Protection
                    </h2>
                    <div className="prose prose-indigo max-w-none">
                        <p>
                            Our PDF protection tool helps you secure your documents with password encryption. Here&apos;s what you need to know:
                        </p>
                        <ul>
                            <li>Strong password protection using industry-standard encryption</li>
                            <li>Prevents unauthorized access to your documents</li>
                            <li>Password required to open the protected PDF</li>
                            <li>Works with all PDF readers that support encryption</li>
                            <li>Process files up to 50MB</li>
                        </ul>
                        <div className="bg-yellow-50 p-4 rounded-md mt-4">
                            <p className="text-sm text-yellow-700">
                                <strong>Important:</strong> Make sure to save your password in a secure place. 
                                If you lose the password, you won&apos;t be able to open the protected PDF.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </PageContainer>
    );
} 