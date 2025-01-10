"use client";

import { useState } from 'react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import PageContainer from '../components/common/PageContainer';
import PdfOperationForm from '../components/molecules/PdfOperationForm';
import ResultView from '../components/molecules/ResultView';

type Position = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
type Style = 'numeric' | 'roman' | 'roman-upper';

interface PageNumberOptions {
    position: Position;
    style: Style;
    startFrom: number;
    fontSize: number;
}

const toRoman = (num: number, upperCase: boolean = false): string => {
    const roman = {
        M: 1000, CM: 900, D: 500, CD: 400,
        C: 100, XC: 90, L: 50, XL: 40,
        X: 10, IX: 9, V: 5, IV: 4, I: 1
    };
    let str = '';
    for (const [key, value] of Object.entries(roman)) {
        const q = Math.floor(num / value);
        num -= q * value;
        str += key.repeat(q);
    }
    return upperCase ? str : str.toLowerCase();
};

export default function AddPageNumbers() {
    const [downloadUrl, setDownloadUrl] = useState<string>('');
    const [showResult, setShowResult] = useState(false);
    const [options, setOptions] = useState<PageNumberOptions>({
        position: 'bottom-right',
        style: 'numeric',
        startFrom: 1,
        fontSize: 12
    });

    const handleSubmit = async (files: File | File[]) => {
        const file = Array.isArray(files) ? files[0] : files;
        
        try {
            const fileBuffer = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(fileBuffer);
            const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
            
            const pages = pdfDoc.getPages();
            pages.forEach((page, index) => {
                const { width, height } = page.getSize();
                const pageNumber = options.startFrom + index;
                let text = '';
                
                switch (options.style) {
                    case 'roman':
                        text = toRoman(pageNumber);
                        break;
                    case 'roman-upper':
                        text = toRoman(pageNumber, true);
                        break;
                    default:
                        text = pageNumber.toString();
                }

                const textWidth = helveticaFont.widthOfTextAtSize(text, options.fontSize);
                
                let x = 0;
                let y = 0;
                
                // Calculate position
                switch (options.position) {
                    case 'top-left':
                        x = 30;
                        y = height - 30;
                        break;
                    case 'top-center':
                        x = (width - textWidth) / 2;
                        y = height - 30;
                        break;
                    case 'top-right':
                        x = width - textWidth - 30;
                        y = height - 30;
                        break;
                    case 'bottom-left':
                        x = 30;
                        y = 30;
                        break;
                    case 'bottom-center':
                        x = (width - textWidth) / 2;
                        y = 30;
                        break;
                    case 'bottom-right':
                        x = width - textWidth - 30;
                        y = 30;
                        break;
                }

                page.drawText(text, {
                    x,
                    y,
                    size: options.fontSize,
                    font: helveticaFont,
                    color: rgb(0, 0, 0),
                });
            });

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            setDownloadUrl(url);

            // Automatically open download in new tab
            window.open(url, '_blank');
        } catch {
            throw new Error('Failed to add page numbers to PDF. Please try again.');
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

    const PageNumberSettings = (
        <div className="mt-6 space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Position
                </label>
                <select
                    value={options.position}
                    onChange={(e) => setOptions(prev => ({ ...prev, position: e.target.value as Position }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                    <option value="top-left">Top Left</option>
                    <option value="top-center">Top Center</option>
                    <option value="top-right">Top Right</option>
                    <option value="bottom-left">Bottom Left</option>
                    <option value="bottom-center">Bottom Center</option>
                    <option value="bottom-right">Bottom Right</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Style
                </label>
                <select
                    value={options.style}
                    onChange={(e) => setOptions(prev => ({ ...prev, style: e.target.value as Style }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                    <option value="numeric">Numeric (1, 2, 3)</option>
                    <option value="roman">Roman Lowercase (i, ii, iii)</option>
                    <option value="roman-upper">Roman Uppercase (I, II, III)</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start From
                </label>
                <input
                    type="number"
                    min="1"
                    value={options.startFrom}
                    onChange={(e) => setOptions(prev => ({ ...prev, startFrom: parseInt(e.target.value) || 1 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Font Size
                </label>
                <input
                    type="number"
                    min="8"
                    max="72"
                    value={options.fontSize}
                    onChange={(e) => setOptions(prev => ({ ...prev, fontSize: parseInt(e.target.value) || 12 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
            </div>
        </div>
    );

    return (
        <PageContainer
            title="Add Page Numbers"
            description="Add customizable page numbers to your PDF document."
        >
            <div className="space-y-8">
                {showResult ? (
                    <ResultView
                        operationName="Add Page Numbers"
                        downloadUrl={downloadUrl}
                        onBack={handleBack}
                    />
                ) : (
                    <PdfOperationForm
                        onSubmit={handleSubmit}
                        operationName="Add Page Numbers"
                        maxFileSize={50}
                        additionalFields={PageNumberSettings}
                        onComplete={handleComplete}
                    />
                )}

                <div className="mt-8 border-t border-gray-200 pt-8">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        About Adding Page Numbers
                    </h2>
                    <div className="prose prose-indigo max-w-none">
                        <p>
                            Our PDF page numbering tool helps you add customizable page numbers to your documents. Here&apos;s what you can do:
                        </p>
                        <ul>
                            <li>Choose from multiple positions (top/bottom, left/center/right)</li>
                            <li>Select different numbering styles (numeric, Roman numerals)</li>
                            <li>Customize the starting page number</li>
                            <li>Adjust font size for better visibility</li>
                            <li>Process files up to 50MB</li>
                        </ul>
                        <div className="bg-blue-50 p-4 rounded-md mt-4">
                            <p className="text-sm text-blue-700">
                                <strong>Tip:</strong> Choose a position and font size that complements your document&apos;s layout. 
                                Bottom-right with size 12 is a common choice for most documents.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </PageContainer>
    );
}