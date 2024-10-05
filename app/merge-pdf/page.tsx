"use client";

import React from 'react';
import UploadButton from '../components/UploadButton';
import { PDFDocument } from 'pdf-lib';

const MergePdfPage: React.FC = () => {

    const handleFileUpload = (files: FileList) => {
        if (files.length > 0) {
            mergePdf(files);
        }
    }

    const mergePdf = async (files: FileList) => {
        const mergedPdf = await PDFDocument.create();

        for (const file of Array.from(files).reverse()) {
            const fileBuffer = await file.arrayBuffer();
            const document = await PDFDocument.load(fileBuffer);
            const copiedPages = await mergedPdf.copyPages(document, document.getPageIndices());
            copiedPages.forEach((page) => mergedPdf.addPage(page));
        }

        const pdfBytes = await mergedPdf.save();

        downloadPdf(pdfBytes);
    }

    const downloadPdf = async (pdfBytes: Uint8Array) => {
        const url = URL.createObjectURL(new Blob([pdfBytes], { type: 'application/pdf' }));
        const link = document.createElement('a');
        link.style.display = 'none';
        link.href = url;
        link.setAttribute('download', 'merged.pdf');
        document.body.appendChild(link);
        link.click();
        link.parentNode?.removeChild(link);
    }
    return (
        <main className='w-100 h-screen flex flex-col justify-center items-center'>
            <h1 className='text-3xl font-bold'>Merge PDF Files</h1>
            <p className='text-lg mt-1'>Select or drop PDF files to merge them into a single document.</p>
            <UploadButton buttonText='Select PDF Files' onFileUpload={handleFileUpload} multiple={true} />
        </main>
    );
};

export default MergePdfPage;