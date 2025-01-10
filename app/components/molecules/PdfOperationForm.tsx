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
}

export default function PdfOperationForm({
    onSubmit,
    operationName,
    maxFileSize = 10,
    additionalFields,
    onComplete,
    onFileSelect,
    allowMultiple = false
}: PdfOperationFormProps) {
    const [files, setFiles] = useState<File[]>([]);
    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (files.length === 0) {
            setError('Please select PDF file(s)');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            await onSubmit(allowMultiple ? files : files[0]);
            onComplete?.(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            onComplete?.(false);
        } finally {
            setIsLoading(false);
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

            <button
                type="submit"
                disabled={isLoading || files.length === 0}
                className={`
                    w-full px-4 py-2 text-sm font-medium text-white rounded-md
                    ${isLoading || files.length === 0
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }
                    transition-colors duration-200
                `}
            >
                {isLoading ? 'Processing...' : `Process ${operationName}`}
            </button>
        </form>
    );
} 