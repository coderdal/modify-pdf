import React, { useRef } from 'react';

interface UploadButtonProps {
    onFileUpload: (files: FileList) => void;
    buttonText?: string;
}

const UploadButton: React.FC<UploadButtonProps> = ({ onFileUpload, buttonText = 'Select PDF File' }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const uploadFile = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            onFileUpload(files);
        }
    };

    return (
        <div>
            <input
                type="file"
                onChange={handleFileChange}
                style={{ display: 'none' }}
                accept='application/pdf'
                ref={fileInputRef}
                multiple
            />
            <button onClick={uploadFile} className='bg-blue-500 text-slate-50 py-3 px-7 cursor-pointer font-semibold rounded-xl mt-3'>{buttonText}</button>
        </div>
    );
};

export default UploadButton;