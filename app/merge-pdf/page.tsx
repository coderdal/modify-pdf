"use client";

import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import PageContainer from '../components/common/PageContainer';
import PdfOperationForm from '../components/molecules/PdfOperationForm';
import ResultView from '../components/molecules/ResultView';

export default function MergePDF() {
    const [downloadUrl, setDownloadUrl] = useState<string>('');
    const [showResult, setShowResult] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [isValid, setIsValid] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleFileSelect = async (files: File | File[]) => {
        const fileArray = Array.isArray(files) ? files : [files];
        setSelectedFiles(fileArray);
        setIsValid(fileArray.length >= 2);
    };

    const handleSubmit = async (files: File | File[]) => {
        if (!Array.isArray(files) || files.length < 2) {
            throw new Error('Please select at least 2 PDF files to merge');
        }

        setIsLoading(true);
        try {
            // Add a brief delay for better UX
            await new Promise(resolve => setTimeout(resolve, 500));

            // Create a new PDF document
            const mergedPdf = await PDFDocument.create();

            // Process each PDF file
            for (const file of files) {
                const fileBuffer = await file.arrayBuffer();
                const pdf = await PDFDocument.load(fileBuffer);
                const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
                pages.forEach((page) => mergedPdf.addPage(page));
            }

            // Save the merged PDF
            const pdfBytes = await mergedPdf.save();

            // Create a download URL
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            setDownloadUrl(url);

            // Automatically open download in new tab
            window.open(url, '_blank');
        } catch {
            throw new Error('Failed to merge PDFs. Please try again.');
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
        if (downloadUrl) {
            URL.revokeObjectURL(downloadUrl);
        }
        setDownloadUrl('');
        setSelectedFiles([]);
        setIsValid(false);
    };

    const FileUploadInfo = (
        <div className="mt-6 space-y-4">
            <p className="text-sm text-gray-500">
                Select multiple PDF files to combine them into a single document. The files will be merged in the order they are selected.
            </p>
            {selectedFiles.length > 0 && (
                <div className="bg-gray-50 p-4 rounded-md">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Selected Files ({selectedFiles.length})</h3>
                    <ul className="space-y-2">
                        {selectedFiles.map((file, index) => (
                            <li key={index} className="text-sm text-gray-600 flex items-center">
                                <span className="w-6 h-6 flex items-center justify-center bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium mr-2">
                                    {index + 1}
                                </span>
                                {file.name}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            <div className="bg-yellow-50 p-4 rounded-md">
                <p className="text-sm text-yellow-700">
                    <strong>Note:</strong> Make sure your files are in the correct order before uploading. 
                    The first file you select will be the first in the merged document.
                </p>
            </div>
            {selectedFiles.length === 1 && (
                <p className="text-sm text-red-500">
                    Please select at least one more PDF file to merge.
                </p>
            )}
        </div>
    );

    return (
        <PageContainer
            title="Merge PDF Files"
            description="Combine multiple PDF documents into a single file."
        >
            <div className="space-y-8">
                {showResult ? (
                    <ResultView
                        operationName="Merge PDF"
                        downloadUrl={downloadUrl}
                        onBack={handleBack}
                    />
                ) : (
                    <PdfOperationForm
                        onSubmit={handleSubmit}
                        operationName="Merge PDF"
                        maxFileSize={50}
                        additionalFields={FileUploadInfo}
                        onComplete={handleComplete}
                        allowMultiple={true}
                        onFileSelect={handleFileSelect}
                        isValid={isValid}
                        isLoading={isLoading}
                    />
                )}

                <div className="mt-8 border-t border-gray-200 pt-8">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        About PDF Merging
                    </h2>
                    <div className="prose prose-indigo max-w-none">
                        <p>
                            Our PDF merging tool allows you to combine multiple PDF documents into a single file. Here&apos;s what you can do:
                        </p>
                        <ul>
                            <li>Merge multiple PDF files into one document</li>
                            <li>Maintain original formatting and quality</li>
                            <li>Control the order of pages in the final document</li>
                            <li>Process files up to 50MB</li>
                            <li>Download the merged PDF instantly</li>
                        </ul>
                        <div className="bg-blue-50 p-4 rounded-md mt-4">
                            <p className="text-sm text-blue-700">
                                <strong>Tip:</strong> For best results, ensure all your PDF files are properly formatted 
                                and in the order you want them to appear in the final document.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </PageContainer>
    );
}