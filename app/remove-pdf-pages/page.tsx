"use client";

import React, { useState } from 'react';
import UploadButton from '../components/UploadButton';
import RenderPdfPage from '../components/RenderPdfPage';
import { PDFDocument } from 'pdf-lib';

const RemovePdfPagesPage: React.FC = () => {
    const [isUploaded, setIsUploaded] = useState<boolean>(false);
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [pdfPageCount, setPdfPageCount] = useState<number>(0);
    // const [removingPages, setRemovingPages] = useState<number[]>([]);
    
    const handleFileUpload = (files: FileList) => {
        if (files.length === 1) {
            setIsUploaded(true);
            setPdfFile(files[0]);
            (async () => {
                const fileBuffer = await files[0].arrayBuffer();
                const document = await PDFDocument.load(fileBuffer);
                setPdfPageCount(document.getPageCount());
            })()
        }
    }

    // const mergePdf = async (files: FileList) => {
    //     const mergedPdf = await PDFDocument.create();

    //     for (const file of Array.from(files).reverse()) {
    //         const fileBuffer = await file.arrayBuffer();
    //         const document = await PDFDocument.load(fileBuffer);
    //         const copiedPages = await mergedPdf.copyPages(document, document.getPageIndices());
    //         copiedPages.forEach((page) => mergedPdf.addPage(page));
    //     }

    //     const pdfBytes = await mergedPdf.save();

    //     downloadPdf(pdfBytes);
    // }

    // const downloadPdf = async (pdfBytes: Uint8Array) => {
    //     const url = URL.createObjectURL(new Blob([pdfBytes], { type: 'application/pdf' }));
    //     const link = document.createElement('a');
    //     link.style.display = 'none';
    //     link.href = url;
    //     link.setAttribute('download', 'merged.pdf');
    //     document.body.appendChild(link);
    //     link.click();
    //     link.parentNode?.removeChild(link);
    // }
    
    if (isUploaded) {
        return (
            <main className='w-100 h-screen flex flex-col justify-center items-center'>
                <h1 className='text-3xl font-bold'>Select by clicking on pages to Remove</h1>
                <div className='flex flex-row justify-center items-center'>
                    { pdfFile && (
                        <>
                            { Array.from({ length: pdfPageCount }).map((_, index) => (
                                <RenderPdfPage key={index} pageNumber={index + 1} pdfFile={pdfFile} width={200} height={300} />
                            )) }
                        </>
                    ) }
                </div>
                
            </main>
        );
    }
    
    return (
        <main className='w-100 h-screen flex flex-col justify-center items-center'>
            <h1 className='text-3xl font-bold'>Remove PDF Pages</h1>
            <p className='text-lg mt-1'>Select or drop PDF file to remove pages from it.</p>
            <UploadButton buttonText='Select PDF File' onFileUpload={handleFileUpload} multiple={false} />
        </main>
    );
};

export default RemovePdfPagesPage;