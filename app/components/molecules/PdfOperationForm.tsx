'use client';

import { useState } from 'react';
import FileInput from '../atoms/FileInput';

interface PdfOperationFormProps {
    onSubmit: (files: File | File[]) => Promise<void>;
    operationName: string;
    maxFileSize?: number;
    additionalFields?: React.ReactNode;
    onComplete?: (success: boolean) => void;
    onFileSelect?: (files: File | File[]) => Promise<void>;
    allowMultiple?: boolean;
    isLoading?: boolean;
}

export default function PdfOperationForm({
    onSubmit,
    operationName,
    maxFileSize = 10,
    additionalFields,
    onComplete,
    onFileSelect,
    allowMultiple = false,
    isLoading = false
}: PdfOperationFormProps) {
    const [files, setFiles] = useState<File[]>([]);
    const [error, setError] = useState<string>('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (files.length === 0) {
            setError('Please select PDF file(s)');
            return;
        }

        setError('');

        try {
            await onSubmit(allowMultiple ? files : files[0]);
            onComplete?.(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            onComplete?.(false);
        }
    };

    const handleFileSelect = async (selectedFiles: File | File[]) => {
        const fileArray = Array.isArray(selectedFiles) ? selectedFiles : [selectedFiles];
        setFiles(fileArray);
        setError('');
        if (onFileSelect) {
            await onFileSelect(selectedFiles);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <FileInput
                onFileSelect={handleFileSelect}
                accept=".pdf"
                maxFileSize={maxFileSize}
                multiple={allowMultiple}
            />

            {error && (
                <div className="text-red-500 text-sm mt-2">
                    {error}
                </div>
            )}

            {additionalFields}

            <div className="mt-6">
                <button
                    type="submit"
                    disabled={!files.length || isLoading}
                    className={`
                        w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white
                        ${!files.length || isLoading
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                        }
                    `}
                >
                    {isLoading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                        </>
                    ) : (
                        `Process ${operationName}`
                    )}
                </button>
            </div>
        </form>
    );
} 