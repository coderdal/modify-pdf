'use client';

import { useState } from 'react';
import axios from 'axios';
import type { AxiosError } from 'axios';
import UploadButton from '../components/UploadButton';

interface ProtectResponse {
    filePath: string;
}

interface ErrorResponse {
    error: string;
}

export default function ProtectPDF() {
    const [file, setFile] = useState<File | null>(null);
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [downloadUrl, setDownloadUrl] = useState('');

    const handleFileUpload = (files: FileList) => {
        if (files[0]) {
            setFile(files[0]);
            setError('');
            setDownloadUrl('');
        }
    };

    const handleProtect = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) {
            setError('Please select a PDF file');
            return;
        }
        if (!password) {
            setError('Please enter a password');
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        setLoading(true);
        setError('');
        
        const formData = new FormData();
        formData.append('pdf', file);
        formData.append('password', password);

        try {
            const response = await axios.post<ProtectResponse>('http://localhost:3001/protect-pdf', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setDownloadUrl(response.data.filePath);
        } catch (err) {
            const error = err as AxiosError<ErrorResponse>;
            setError(error.response?.data?.error || 'Failed to protect PDF');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4">
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
                <h1 className="text-2xl font-bold text-center mb-8">Protect PDF with Password</h1>
                
                <form onSubmit={handleProtect} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select PDF File
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

                    <button
                        type="submit"
                        disabled={loading || !file || !password || password.length < 6}
                        className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                            ${loading || !file || !password || password.length < 6
                                ? 'bg-indigo-400 cursor-not-allowed' 
                                : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                            }`}
                    >
                        {loading ? 'Protecting...' : 'Protect PDF'}
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
                            Your PDF has been protected. Make sure to save the password in a secure place.
                        </p>
                        <a
                            href={downloadUrl}
                            download
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                            Download Protected PDF
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
} 