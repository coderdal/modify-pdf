'use client';

import { useState } from 'react';
import UploadButton from '../UploadButton';

interface PdfUploadFormProps {
    onSubmit: (formData: FormData) => Promise<void>;
    buttonText: string;
    additionalFields?: React.ReactNode;
    loading?: boolean;
}

export default function PdfUploadForm({ 
    onSubmit, 
    buttonText, 
    additionalFields,
    loading = false 
}: PdfUploadFormProps) {
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState('');

    const handleFileUpload = (files: FileList) => {
        if (files[0]) {
            if (!files[0].type.includes('pdf')) {
                setError('Please select a PDF file');
                return;
            }
            setFile(files[0]);
            setError('');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) {
            setError('Please select a PDF file');
            return;
        }

        const formData = new FormData();
        formData.append('pdf', file);
        
        try {
            await onSubmit(formData);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
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

            {additionalFields}

            {error && (
                <div className="text-red-600 text-sm text-center">
                    {error}
                </div>
            )}

            <button
                type="submit"
                disabled={loading || !file}
                className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                    ${loading || !file 
                        ? 'bg-indigo-400 cursor-not-allowed' 
                        : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                    }`}
            >
                {loading ? 'Processing...' : buttonText}
            </button>
        </form>
    );
} 