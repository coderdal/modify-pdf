'use client';

import React, { useState } from 'react';
import UploadButton from '../components/UploadButton';

const SplitPDF = () => {
    const [file, setFile] = useState<File | null>(null);
    const [fromPage, setFromPage] = useState('');
    const [toPage, setToPage] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [resultUrl, setResultUrl] = useState('');

    const handleFileUpload = (files: FileList) => {
        if (files.length > 0) {
            setFile(files[0]);
            setError('');
            setResultUrl('');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) {
            setError('Please select a PDF file');
            return;
        }

        if (!fromPage || !toPage) {
            setError('Please enter both from and to page numbers');
            return;
        }

        if (parseInt(fromPage) > parseInt(toPage)) {
            setError('From page cannot be greater than to page');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('fromPage', fromPage);
        formData.append('toPage', toPage);

        try {
            setLoading(true);
            setError('');
            const response = await fetch('http://localhost:3001/split-pdf', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to split PDF');
            }

            const data = await response.json();
            setResultUrl(data.filePath);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An error occurred while splitting the PDF');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen p-8">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Split PDF</h1>
                
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <div className="mb-6">
                        <UploadButton onFileUpload={handleFileUpload} />
                        {file && (
                            <p className="mt-2 text-sm text-gray-600">
                                Selected file: {file.name}
                            </p>
                        )}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="flex space-x-4">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700">
                                    From Page
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    value={fromPage}
                                    onChange={(e) => setFromPage(e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700">
                                    To Page
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    value={toPage}
                                    onChange={(e) => setToPage(e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="text-red-500 text-sm mt-2">{error}</div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                        >
                            {loading ? 'Processing...' : 'Split PDF'}
                        </button>

                        {resultUrl && (
                            <div className="mt-4">
                                <a
                                    href={resultUrl}
                                    className="text-blue-500 hover:text-blue-600"
                                    download
                                >
                                    Download Split PDF
                                </a>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </main>
    );
};

export default SplitPDF; 