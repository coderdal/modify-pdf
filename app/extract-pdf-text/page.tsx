"use client";

import React, { useState } from 'react';
import UploadButton from '../components/UploadButton';
import * as PDFJS from 'pdfjs-dist/legacy/build/pdf.mjs';
import type { TextItem } from 'pdfjs-dist/types/src/display/api';

PDFJS.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
).toString();

const ExtractPdfTextPage: React.FC = () => {
    const [isUploaded, setIsUploaded] = useState<boolean>(false);
    const [pdfText, setPdfText] = useState<string>('');

    const handleFileUpload = (files: FileList) => {
        if (files.length === 1) {
            setIsUploaded(true);
            handleExtractPdfText(files[0]);
        }
    }

    const handleExtractPdfText = async (file: File) => {
        const fileBuffer = await file.arrayBuffer();
        if (!fileBuffer) return;
        const pdf = await PDFJS.getDocument(fileBuffer).promise;
        const numPages = pdf.numPages;
        
        let fullText = '';

        for (let i = 1; i <= numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();

            fullText += textContent.items
                .filter((item): item is TextItem => 'str' in item)
                .map((item) => item.str)
                .join('') + '\n';
        }

        setPdfText(fullText);
    }

    // const downloadPdf = async (pdfBytes: Uint8Array) => {
    //     const url = URL.createObjectURL(new Blob([pdfBytes], { type: 'application/pdf' }));
    //     const link = document.createElement('a');
    //     link.style.display = 'none';
    //     link.href = url;
    //     link.setAttribute('download', `${pdfFile?.name.split('.')[0] || 'pdf'}-rotated.pdf`);
    //     document.body.appendChild(link);
    //     link.click();
    //     link.parentNode?.removeChild(link);
    // }
    
    if (isUploaded) {
        return (
            <main className='w-100 h-screen flex flex-col justify-center items-center'>
                <h1 className='text-3xl font-bold'>Extract PDF Text</h1>
                <div className="flex flex-col space-y-4 mb-4">
                    <div className="flex items-center space-x-4">
                        <label htmlFor="fontSizePicker" className="text-lg">PDF Text:</label>
                        <textarea value={pdfText} readOnly className="w-full h-60 p-2 border border-gray-300 rounded" />
                    </div>
                </div>

            </main>
        );
    }
    
    return (
        <main className='w-100 h-screen flex flex-col justify-center items-center'>
            <h1 className='text-3xl font-bold'>Extract Text from PDF Files</h1>
            <p className='text-lg mt-1'>Select or drop PDF file to extract text from it.</p>
            <UploadButton buttonText='Select PDF File' onFileUpload={handleFileUpload} multiple={false} />
        </main>
    );
};

export default ExtractPdfTextPage;