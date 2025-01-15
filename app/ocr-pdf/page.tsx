'use client';

import { useState } from 'react';
import api from '@/lib/api';
import PageContainer from '../components/common/PageContainer';
import PdfOperationForm from '../components/molecules/PdfOperationForm';
import ResultView from '../components/molecules/ResultView';
import Alert from '../components/atoms/Alert';

interface ErrorResponse {
    status: string;
    message: string;
    code: string;
}

const SUPPORTED_LANGUAGES = [
    { value: 'en-US', label: 'English (US)' },
    { value: 'en-GB', label: 'English (UK)' },
    { value: 'fr-FR', label: 'French' },
    { value: 'de-DE', label: 'German' },
    { value: 'de-CH', label: 'German (Switzerland)' },
    { value: 'it-IT', label: 'Italian' },
    { value: 'es-ES', label: 'Spanish' },
    { value: 'pt-BR', label: 'Portuguese (Brazil)' },
    { value: 'nl-NL', label: 'Dutch' },
    { value: 'da-DK', label: 'Danish' },
    { value: 'tr-TR', label: 'Turkish' },
    { value: 'fi-FI', label: 'Finnish' },
    { value: 'nb-NO', label: 'Norwegian (Bokmål)' },
    { value: 'no-NO', label: 'Norwegian' },
    { value: 'sv-SE', label: 'Swedish' },
    { value: 'bg-BG', label: 'Bulgarian' },
    { value: 'cs-CZ', label: 'Czech' },
    { value: 'et-EE', label: 'Estonian' },
    { value: 'hr-HR', label: 'Croatian' },
    { value: 'hu-HU', label: 'Hungarian' },
    { value: 'lt-LT', label: 'Lithuanian' },
    { value: 'lv-LV', label: 'Latvian' },
    { value: 'pl-PL', label: 'Polish' },
    { value: 'ro-RO', label: 'Romanian' },
    { value: 'sk-SK', label: 'Slovak' },
    { value: 'sl-SI', label: 'Slovenian' },
    { value: 'sr-SR', label: 'Serbian' },
    { value: 'el-GR', label: 'Greek' },
    // { value: 'mt-MT', label: 'Maltese' },
    { value: 'mk-MK', label: 'Macedonian' },
    { value: 'ru-RU', label: 'Russian' },
    { value: 'uk-UA', label: 'Ukrainian' },
    // { value: 'iw-IL', label: 'Hebrew' },
    { value: 'ja-JP', label: 'Japanese' },
    { value: 'ko-KR', label: 'Korean' },
    { value: 'zh-CN', label: 'Chinese (Simplified)' },
    { value: 'zh-HK', label: 'Chinese (Hong Kong)' }
];

export default function OcrPDF() {
    const [language, setLanguage] = useState('en-US');
    const [downloadUrl, setDownloadUrl] = useState<string>('');
    const [showResult, setShowResult] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const getErrorMessage = (error: unknown): string => {
        if (error && typeof error === 'object' && 'response' in error) {
            const err = error as { response?: { status?: number; data?: ErrorResponse } };
            if (err.response?.data) {
                return err.response.data.message;
            }
            switch (err.response?.status) {
                case 400:
                    return 'Invalid request. Please check your file and language selection.';
                case 413:
                    return 'File size is too large. Please try a smaller file.';
                case 415:
                    return 'Invalid file type. Please upload a PDF file.';
                case 429:
                    return 'Too many requests. Please try again later.';
                case 500:
                    return 'Server error. Please try again later.';
                default:
                    return 'An error occurred while processing your request.';
            }
        }
        return 'An unexpected error occurred.';
    };

    const handleSubmit = async (files: File | File[]) => {
        setError(null);
        setIsLoading(true);
        
        try {
            const file = Array.isArray(files) ? files[0] : files;
            if (!file) {
                throw new Error('Please select a file');
            }

            const formData = new FormData();
            formData.append('pdf', file);
            formData.append('ocrLocale', language);

            const response = await api.post<{ status: string; data: { filePath: string } }>(
                '/ocr-pdf',
                formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                }
            );

            if (response.data.status === 'success') {
                setDownloadUrl(response.data.data.filePath);
                window.open(response.data.data.filePath, '_blank');
            } else {
                throw new Error('Failed to perform OCR on PDF');
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : getErrorMessage(err);
            throw new Error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleComplete = (success: boolean) => {
        if (success) {
            setShowResult(true);
        }
    };

    const handleBack = () => {
        setShowResult(false);
        setDownloadUrl('');
        setError(null);
        setLanguage('en-US');
    };

    const LanguageSelector = (
        <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Document Language
            </label>
            <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
                {SUPPORTED_LANGUAGES.map(({ value, label }) => (
                    <option key={value} value={value}>
                        {label}
                    </option>
                ))}
            </select>
            <p className="mt-1 text-sm text-gray-500">
                Select the primary language of the text in your PDF
            </p>
        </div>
    );

    return (
        <PageContainer
            title="OCR PDF"
            description="Convert scanned documents and images into searchable, selectable PDFs."
        >
            <div className="space-y-8">
                {error && (
                    <Alert
                        type="error"
                        message={error}
                        onClose={() => setError(null)}
                    />
                )}

                {showResult ? (
                    <ResultView
                        operationName="OCR PDF"
                        downloadUrl={downloadUrl}
                        onBack={handleBack}
                    />
                ) : (
                    <PdfOperationForm
                        onSubmit={handleSubmit}
                        operationName="OCR PDF"
                        maxFileSize={50}
                        additionalFields={LanguageSelector}
                        onComplete={handleComplete}
                        isLoading={isLoading}
                    />
                )}

                <div className="mt-8 border-t border-gray-200 pt-8">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        About OCR (Optical Character Recognition)
                    </h2>
                    <div className="prose prose-indigo max-w-none">
                        <p>
                            Our OCR tool converts scanned documents and image-based PDFs into fully searchable, selectable text PDFs. Features include:
                        </p>
                        <ul>
                            <li><strong>Multiple Languages:</strong> Support for over 35 languages including European, Asian, and more</li>
                            <li><strong>High Accuracy:</strong> Advanced OCR technology for precise text recognition</li>
                            <li><strong>Maintains Layout:</strong> Preserves the original document&apos;s appearance</li>
                            <li><strong>Easy to Use:</strong> Simple upload and convert process</li>
                        </ul>
                        <div className="bg-blue-50 p-4 rounded-md mt-4">
                            <p className="text-sm text-blue-700">
                                <strong>Tip:</strong> For best results, ensure your scanned document is clear and the text is well-aligned.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </PageContainer>
    );
} 