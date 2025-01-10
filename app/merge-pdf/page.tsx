"use client";

import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import PageContainer from '../components/common/PageContainer';
import PdfOperationForm from '../components/molecules/PdfOperationForm';
import ResultView from '../components/molecules/ResultView';

export default function MergePDF() {
    const [downloadUrl, setDownloadUrl] = useState<string>('');
    const [showResult, setShowResult] = useState(false);

    const handleSubmit = async (files: File | File[]) => {
        if (!Array.isArray(files) || files.length < 2) {
            throw new Error('Please select at least 2 PDF files to merge');
        }

        try {
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
    };

    const FileUploadInfo = (
        <div className="mt-6">
            <p className="text-sm text-gray-500">
                Select multiple PDF files to combine them into a single document. The files will be merged in the order they are selected.
            </p>
            <div className="bg-yellow-50 p-4 rounded-md mt-4">
                <p className="text-sm text-yellow-700">
                    <strong>Note:</strong> Make sure your files are in the correct order before uploading. 
                    The first file you select will be the first in the merged document.
                </p>
            </div>
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