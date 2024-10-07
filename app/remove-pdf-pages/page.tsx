"use client";

import React, { useState } from 'react';
import UploadButton from '../components/UploadButton';
import RenderPdfPage from '../components/RenderPdfPage';
import { PDFDocument } from 'pdf-lib';

const RemovePdfPagesPage: React.FC = () => {
    const [isUploaded, setIsUploaded] = useState<boolean>(false);
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [pdfPageCount, setPdfPageCount] = useState<number>(0);
    const [removingPages, setRemovingPages] = useState<number[]>([]);
    
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

    const toggleRemovePage = (pageNumber: number) => {
        if (removingPages.includes(pageNumber)) {
            setRemovingPages((prev) => prev.filter((page) => page !== pageNumber).sort((a, b) => a - b));
        } else {
            setRemovingPages((prev) => [...prev, pageNumber].sort((a, b) => a - b));
        }
    }

    const handleRemovePages = async () => {
        const fileBuffer = await pdfFile?.arrayBuffer();
        if (!fileBuffer) return;

        const pdf = await PDFDocument.load(fileBuffer);
        let removedPageCount = 0;
        removingPages.forEach((page) => {
            pdf.removePage(page - 1 - removedPageCount);
            removedPageCount++;
        });
        const pdfBytes = await pdf.save();

        downloadPdf(pdfBytes);
    }

    const downloadPdf = async (pdfBytes: Uint8Array) => {
        const url = URL.createObjectURL(new Blob([pdfBytes], { type: 'application/pdf' }));
        const link = document.createElement('a');
        link.style.display = 'none';
        link.href = url;
        link.setAttribute('download', `${pdfFile?.name.split('.')[0] || 'pdf'}-removed.pdf`);
        document.body.appendChild(link);
        link.click();
        link.parentNode?.removeChild(link);
    }
    
    if (isUploaded) {
        return (
            <main className='w-100 h-screen flex flex-col justify-center items-center'>
                <h1 className='text-3xl font-bold'>Select by clicking on pages to Remove</h1>
                <p className='text-lg my-1'>Selected Pages: {removingPages.join(', ')}</p>
                <div className='flex flex-row flex-wrap gap-4 justify-center items-center'>
                    { pdfFile && (
                        <>
                            { Array.from({ length: pdfPageCount }).map((_, index) => (
                                <div key={index} className={`border-2 border-gray-300 rounded-md p-2 cursor-pointer ${removingPages.includes(index + 1) ? 'border-red-500' : ''}`} onClick={() => toggleRemovePage(index + 1)}>
                                    <RenderPdfPage pageNumber={index + 1} pdfFile={pdfFile} width={200} height={300} />
                                    <p className='text-sm text-center text-gray-500'>Page {index + 1}</p>
                                </div>
                            )) }
                        </>
                    ) }
                </div>
                <button className='bg-blue-500 text-white px-4 py-2 rounded-md mt-4' onClick={handleRemovePages}>Remove Pages</button>
                
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