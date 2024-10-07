"use client";

import React, { useState } from 'react';
import UploadButton from '../components/UploadButton';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { hexToRgb } from '../helper';

const RemovePdfPagesPage: React.FC = () => {
    const [isUploaded, setIsUploaded] = useState<boolean>(false);
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [pageNumberColor, setPageNumberColor] = useState<string>('#000000');
    const [pageNumberFontSize, setPageNumberFontSize] = useState<number>(12);

    const handleFileUpload = (files: FileList) => {
        if (files.length === 1) {
            setIsUploaded(true);
            setPdfFile(files[0]);
        }
    }

    const handleAddPageNumber = async () => {
        const fileBuffer = await pdfFile?.arrayBuffer();
        if (!fileBuffer) return;
        const pdf = await PDFDocument.load(fileBuffer);
        const font = await pdf.embedFont(StandardFonts.TimesRoman);
        let pageNumber = 1;
        const rgbColor = hexToRgb(pageNumberColor);

        for (const page of pdf.getPages()) {
            const { width, height } = page.getSize()
            page.drawText(`${pageNumber}`, {
                x: width - 40,
                y: height - 40,
                size: pageNumberFontSize,
                font: font,
                color: rgb((rgbColor?.r || 0) / 255, (rgbColor?.g || 0) / 255, (rgbColor?.b || 0) / 255),
            });
            pageNumber++;
        }

        const pdfBytes = await pdf.save();

        downloadPdf(pdfBytes);
    }

    const downloadPdf = async (pdfBytes: Uint8Array) => {
        const url = URL.createObjectURL(new Blob([pdfBytes], { type: 'application/pdf' }));
        const link = document.createElement('a');
        link.style.display = 'none';
        link.href = url;
        link.setAttribute('download', `${pdfFile?.name.split('.')[0] || 'pdf'}-page_numbers.pdf`);
        document.body.appendChild(link);
        link.click();
        link.parentNode?.removeChild(link);
    }
    
    if (isUploaded) {
        return (
            <main className='w-100 h-screen flex flex-col justify-center items-center'>
                <h1 className='text-3xl font-bold'>Add Page Number to PDF Files</h1>
                <div className="flex flex-col space-y-4 mb-4">
                    <div className="flex items-center space-x-4">
                        <label htmlFor="colorPicker" className="text-lg">Page Number Color:</label>
                        <input 
                            type="color" 
                            id="colorPicker" 
                            className="w-10 h-10 border border-gray-300 rounded cursor-pointer"
                            value={pageNumberColor}
                            onChange={(e) => setPageNumberColor(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center space-x-4">
                        <label htmlFor="fontSizePicker" className="text-lg">Font Size:</label>
                        <input 
                            type="number" 
                            id="fontSizePicker" 
                            className="w-20 px-2 py-1 border border-gray-300 rounded"
                            min="8"
                            max="36"
                            value={pageNumberFontSize}
                            onChange={(e) => setPageNumberFontSize(Math.min(36, Math.max(8, parseInt(e.target.value) || 8)))}
                        />
                    </div>
                </div>
                <button className='bg-blue-500 text-white px-4 py-2 rounded-md mt-4' onClick={handleAddPageNumber}>Add Page Number</button>

            </main>
        );
    }
    
    return (
        <main className='w-100 h-screen flex flex-col justify-center items-center'>
            <h1 className='text-3xl font-bold'>Add Page Number to PDF Files</h1>
            <p className='text-lg mt-1'>Select or drop PDF file to add page numbers to it.</p>
            <UploadButton buttonText='Select PDF File' onFileUpload={handleFileUpload} multiple={false} />
        </main>
    );
};

export default RemovePdfPagesPage;