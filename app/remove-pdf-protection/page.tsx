'use client';

import { useState } from 'react';
import axios from 'axios';
import UploadButton from '../components/UploadButton';

interface RemoveProtectionResponse {
    filePath: string;
}

interface ErrorResponse {
    error: string;
}

export default function RemoveProtectionPDF() {
    const [file, setFile] = useState<File | null>(null);
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [downloadUrl, setDownloadUrl] = useState('');
    const [attempts, setAttempts] = useState(0);

    const handleFileUpload = (files: FileList) => {
        if (files[0]) {
            setFile(files[0]);
            setError('');
            setDownloadUrl('');
            setAttempts(0);
        }
    };

    const handleRemoveProtection = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) {
            setError('Please select a PDF file');
            return;
        }
        if (!password) {
            setError('Please enter the PDF password');
            return;
        }

        setLoading(true);
        setError('');
        
        const formData = new FormData();
        formData.append('file', file);
        formData.append('password', password);

        try {
            const response = await axios.post<RemoveProtectionResponse>('http://localhost:3001/remove-pdf-protection', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setDownloadUrl(response.data.filePath);
            setAttempts(0);
        } catch (err) {
            if (axios.isAxiosError(err) && err.response?.data?.error) {
                const errorMessage = err.response.data.error;
                setError(errorMessage);
                
                // Increment attempts counter for wrong password
                if (errorMessage.includes('Incorrect password')) {
                    setAttempts(prev => prev + 1);
                }
            } else {
                setError('Failed to remove PDF protection. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const getPasswordHelperText = () => {
        if (attempts === 0) return 'Enter the password that was used to protect this PDF';
        if (attempts === 1) return 'First attempt failed. Please check the password and try again.';
        if (attempts === 2) return 'Second attempt failed. Make sure Caps Lock is off and try again.';
        return `${attempts} failed attempts. Please make sure you have the correct password.`;
    };

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4">
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
                <h1 className="text-2xl font-bold text-center mb-8">Remove PDF Password Protection</h1>
                
                <form onSubmit={handleRemoveProtection} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select Protected PDF File
                        </label>
                        <div className="flex justify-center">
                            <UploadButton 
                                onFileUpload={handleFileUpload}
                                buttonText={file ? file.name : 'Select PDF File'}
                                multiple={false}
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                            PDF Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter the PDF's current password"
                            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 
                                ${attempts > 0 
                                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                                    : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                                }`}
                        />
                        <p className={`mt-1 text-sm ${attempts > 0 ? 'text-red-500' : 'text-gray-500'}`}>
                            {getPasswordHelperText()}
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !file || !password}
                        className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                            ${loading || !file || !password
                                ? 'bg-indigo-400 cursor-not-allowed' 
                                : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                            }`}
                    >
                        {loading ? 'Removing Protection...' : 'Remove Protection'}
                    </button>
                </form>

                {error && (
                    <div className="mt-4 text-red-600 text-sm text-center">
                        {error}
                    </div>
                )}

                {downloadUrl && (
                    <div className="mt-6 text-center space-y-2">
                        <p className="text-sm text-gray-600">
                            Password protection has been removed from your PDF.
                        </p>
                        <a
                            href={downloadUrl}
                            download
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                            Download Unprotected PDF
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
} 