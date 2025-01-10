"use client";

import { useState } from 'react';
import { PDFDocument, degrees } from 'pdf-lib';
import PageContainer from '../components/common/PageContainer';
import PdfOperationForm from '../components/molecules/PdfOperationForm';
import ResultView from '../components/molecules/ResultView';
import RotationSelector from '../components/molecules/RotationSelector';

export default function RotatePDF() {
    const [rotation, setRotation] = useState<number>(0);
    const [downloadUrl, setDownloadUrl] = useState<string>('');
    const [showResult, setShowResult] = useState(false);

    const handleSubmit = async (files: File | File[]) => {
        const file = Array.isArray(files) ? files[0] : files;
        
        if (rotation === 0) {
            throw new Error('Please select a rotation angle');
        }

        try {
            // Load the PDF document
            const fileBuffer = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(fileBuffer);

            // Rotate all pages
            const pages = pdfDoc.getPages();
            pages.forEach(page => {
                page.setRotation(degrees(rotation));
            });

            // Save the modified PDF
            const pdfBytes = await pdfDoc.save();

            // Create a download URL
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            setDownloadUrl(url);

            // Automatically open download in new tab
            window.open(url, '_blank');
        } catch {
            throw new Error('Failed to rotate PDF. Please try again.');
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
        setRotation(0);
    };

    const RotationControl = (
        <RotationSelector onChange={setRotation} />
    );

    return (
        <PageContainer
            title="Rotate PDF"
            description="Rotate your PDF pages to the correct orientation."
        >
            <div className="space-y-8">
                {showResult ? (
                    <ResultView
                        operationName="Rotate PDF"
                        downloadUrl={downloadUrl}
                        onBack={handleBack}
                    />
                ) : (
                    <PdfOperationForm
                        onSubmit={handleSubmit}
                        operationName="Rotate PDF"
                        maxFileSize={50}
                        additionalFields={RotationControl}
                        onComplete={handleComplete}
                    />
                )}

                <div className="mt-8 border-t border-gray-200 pt-8">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        About PDF Rotation
                    </h2>
                    <div className="prose prose-indigo max-w-none">
                        <p>
                            Our PDF rotation tool helps you fix page orientations in your PDF documents. Here&apos;s what you can do:
                        </p>
                        <ul>
                            <li>Rotate pages in 90-degree increments</li>
                            <li>Preview the rotation before applying</li>
                            <li>Maintain original PDF quality</li>
                            <li>Process files up to 50MB</li>
                            <li>Download the rotated PDF instantly</li>
                        </ul>
                        <div className="bg-blue-50 p-4 rounded-md mt-4">
                            <p className="text-sm text-blue-700">
                                <strong>Tip:</strong> Use the visual rotation controls to preview how your PDF will look after rotation. 
                                You can rotate left, right, or flip 180 degrees.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </PageContainer>
    );
}