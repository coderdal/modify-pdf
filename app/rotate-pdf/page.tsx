"use client";

import React, { useState } from 'react';
import UploadButton from '../components/UploadButton';
import { PDFDocument, degrees } from 'pdf-lib';

const RotatePdfPage: React.FC = () => {
    const [isUploaded, setIsUploaded] = useState<boolean>(false);
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [rotateAngle, setRotateAngle] = useState<number>(0);

    const handleFileUpload = (files: FileList) => {
        if (files.length === 1) {
            setIsUploaded(true);
            setPdfFile(files[0]);
        }
    }

    const handleRotatePdf = async () => {
        const fileBuffer = await pdfFile?.arrayBuffer();
        if (!fileBuffer) return;
        const pdf = await PDFDocument.load(fileBuffer);

        for (const page of pdf.getPages()) {
            page.setRotation(degrees(rotateAngle));
        }

        const pdfBytes = await pdf.save();

        downloadPdf(pdfBytes);
    }

    const downloadPdf = async (pdfBytes: Uint8Array) => {
        const url = URL.createObjectURL(new Blob([pdfBytes], { type: 'application/pdf' }));
        const link = document.createElement('a');
        link.style.display = 'none';
        link.href = url;
        link.setAttribute('download', `${pdfFile?.name.split('.')[0] || 'pdf'}-rotated.pdf`);
        document.body.appendChild(link);
        link.click();
        link.parentNode?.removeChild(link);
    }
    
    if (isUploaded) {
        return (
            <main className='w-100 h-screen flex flex-col justify-center items-center'>
                <h1 className='text-3xl font-bold'>Rotate PDF Files</h1>
                <div className="flex flex-col space-y-4 mb-4">
                    <div className="flex items-center space-x-4">
                        <label htmlFor="fontSizePicker" className="text-lg">Rotate Angle:</label>
                        <input 
                            type="number" 
                            id="rotateAnglePicker" 
                            className="w-20 px-2 py-1 border border-gray-300 rounded"
                            min="-360"
                            max="360"
                            value={rotateAngle}
                            onChange={(e) => setRotateAngle(Math.min(360, Math.max(-360, parseInt(e.target.value) || 0)))}
                        />
                    </div>
                </div>
                <button className='bg-blue-500 text-white px-4 py-2 rounded-md mt-4' onClick={handleRotatePdf}>Rotate PDF</button>

            </main>
        );
    }
    
    return (
        <main className='w-100 h-screen flex flex-col justify-center items-center'>
            <h1 className='text-3xl font-bold'>Rotate PDF Files</h1>
            <p className='text-lg mt-1'>Select or drop PDF file to rotate it.</p>
            <UploadButton buttonText='Select PDF File' onFileUpload={handleFileUpload} multiple={false} />
        </main>
    );
};

export default RotatePdfPage;