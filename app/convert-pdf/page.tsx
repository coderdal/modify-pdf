'use client';

import { useState } from 'react';
import axios from 'axios';
import PageContainer from '../components/common/PageContainer';
import PdfOperationForm from '../components/molecules/PdfOperationForm';
import ResultView from '../components/molecules/ResultView';

const EXPORT_FORMATS = {
    docx: { label: 'Word Document (DOCX)', value: 'docx' },
    jpeg: { label: 'JPEG Images (ZIP)', value: 'jpeg' },
    png: { label: 'PNG Images (ZIP)', value: 'png' }
} as const;

export default function ConvertPDF() {
    const [exportFormat, setExportFormat] = useState<keyof typeof EXPORT_FORMATS>('docx');
    const [downloadUrl, setDownloadUrl] = useState<string>('');
    const [showResult, setShowResult] = useState(false);

    const handleSubmit = async (file: File) => {
        const formData = new FormData();
        formData.append('pdf', file);
        formData.append('inputFormat', 'pdf');
        formData.append('exportFormat', exportFormat);

        const response = await axios.post<{ status: string; data: { filePath: string } }>(
            'http://localhost:3001/convert-pdf',
            formData,
            {
                headers: { 'Content-Type': 'multipart/form-data' },
            }
        );

        if (response.data.status !== 'success') {
            throw new Error('Failed to convert PDF');
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
    };

    const FormatSelector = (
        <div className="mt-6">
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
    );

    return (
        <PageContainer
            title="Convert PDF"
            description="Convert your PDF files to various formats including Word documents and images. Our tool ensures high-quality conversion while maintaining the original formatting."
        >
            <div className="space-y-8">
                {showResult ? (
                    <ResultView
                        operationName="Convert PDF"
                        downloadUrl={downloadUrl}
                        onBack={handleBack}
                    />
                ) : (
                    <PdfOperationForm
                        onSubmit={handleSubmit}
                        operationName="Convert PDF"
                        maxFileSize={20}
                        additionalFields={FormatSelector}
                        onComplete={handleComplete}
                    />
                )}

                <div className="mt-8 border-t border-gray-200 pt-8">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        About PDF Conversion
                    </h2>
                    <div className="prose prose-indigo max-w-none">
                        <p>
                            Our PDF conversion tool allows you to convert your PDF files to various formats while maintaining the highest quality possible. Here&apos;s what you can do:
                        </p>
                        <ul>
                            <li>Convert PDF to Word (DOCX) - Perfect for editing text</li>
                            <li>Convert PDF to Images (JPEG/PNG) - Ideal for sharing on social media</li>
                            <li>Maintain original formatting and layout</li>
                            <li>Process files up to 20MB</li>
                            <li>Secure and private conversion</li>
                        </ul>
                    </div>
                </div>
            </div>
        </PageContainer>
    );
} 