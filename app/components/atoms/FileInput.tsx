'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface FileInputProps {
    onFileSelect: (files: File | File[]) => void;
    accept?: Record<string, string[]>;
    multiple?: boolean;
    maxFileSize?: number;
}

export default function FileInput({
    onFileSelect,
    accept = {
        'application/pdf': ['.pdf']
    },
    multiple = false,
    maxFileSize = 10
}: FileInputProps) {
    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            const oversizedFiles = acceptedFiles.filter(file => file.size > maxFileSize * 1024 * 1024);
            if (oversizedFiles.length > 0) {
                alert(`File size exceeds ${maxFileSize}MB limit`);
                return;
            }
            onFileSelect(multiple ? acceptedFiles : acceptedFiles[0]);
        }
    }, [multiple, maxFileSize, onFileSelect]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept,
        multiple
    });

    return (
        <div
            {...getRootProps()}
            className={`
                border-2 border-dashed rounded-lg p-6
                flex flex-col items-center justify-center
                cursor-pointer transition-colors duration-200
                ${isDragActive
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }
            `}
        >
            <input {...getInputProps()} />
            <div className="text-center">
                <button
                    type="button"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    Choose File{multiple ? 's' : ''}
                </button>
                <p className="mt-2 text-sm text-gray-500">
                    or drag and drop{multiple ? ' files' : ''}
                </p>
                <p className="mt-1 text-xs text-gray-400">
                    PDF files up to {maxFileSize}MB
                </p>
            </div>
        </div>
    );
} 