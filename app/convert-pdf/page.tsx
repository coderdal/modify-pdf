'use client';

import { useState } from 'react';
import axios from 'axios';
import type { AxiosError } from 'axios';
import UploadButton from '../components/UploadButton';

interface ConvertResponse {
    filePath: string;
}

interface ErrorResponse {
    error: string;
}

const EXPORT_FORMATS = {
    docx: { label: 'Word Document (DOCX)', value: 'docx' },
    jpeg: { label: 'JPEG Images (ZIP)', value: 'jpeg' },
    png: { label: 'PNG Images (ZIP)', value: 'png' }
} as const;

export default function ConvertPDF() {
    const [file, setFile] = useState<File | null>(null);
    const [exportFormat, setExportFormat] = useState<keyof typeof EXPORT_FORMATS>('docx');
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

    const handleConvert = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) {
            setError('Please select a PDF file');
            return;
        }

        setLoading(true);
        setError('');
        
        const formData = new FormData();
        formData.append('pdf', file);
        formData.append('inputFormat', 'pdf');
        formData.append('exportFormat', exportFormat);

        try {
            const response = await axios.post<ConvertResponse>('http://localhost:3001/convert-pdf', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setDownloadUrl(response.data.filePath);
        } catch (err) {
            const error = err as AxiosError<ErrorResponse>;
            setError(error.response?.data?.error || 'Failed to convert PDF');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4">
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
                <h1 className="text-2xl font-bold text-center mb-8">Convert PDF</h1>
                
                <form onSubmit={handleConvert} className="space-y-6">
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
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Convert To
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

                    <button
                        type="submit"
                        disabled={loading || !file}
                        className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                            ${loading || !file 
                                ? 'bg-indigo-400 cursor-not-allowed' 
                                : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                            }`}
                    >
                        {loading ? 'Converting...' : 'Convert PDF'}
                    </button>
                </form>

                {error && (
                    <div className="mt-4 text-red-600 text-sm text-center">
                        {error}
                    </div>
                )}

                {downloadUrl && (
                    <div className="mt-6 text-center">
                        <a
                            href={downloadUrl}
                            download
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                            Download Converted File
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
} 