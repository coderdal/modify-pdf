'use client';

import Button from '../atoms/Button';
import Alert from '../atoms/Alert';

interface ResultViewProps {
    operationName: string;
    downloadUrl: string;
    onBack: () => void;
}

export default function ResultView({
    operationName,
    downloadUrl,
    onBack
}: ResultViewProps) {
    const handleDownload = () => {
        window.open(downloadUrl, '_blank');
    };

    return (
        <div className="space-y-6">
            <Alert
                type="success"
                message={`${operationName} completed successfully!`}
            />

            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="text-center space-y-4">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                        <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">Ready to Download</h3>
                    <p className="text-sm text-gray-500">
                        Your file has been processed and is ready to download.
                    </p>
                </div>

                <div className="mt-6 space-y-3">
                    <Button
                        variant="success"
                        fullWidth
                        onClick={handleDownload}
                    >
                        Download File
                    </Button>
                    
                    <Button
                        variant="secondary"
                        fullWidth
                        onClick={onBack}
                    >
                        Process Another File
                    </Button>
                </div>
            </div>

            <div className="text-center text-sm text-gray-500">
                <p>
                    The download should start automatically. If it doesn&apos;t,{' '}
                    <button 
                        onClick={handleDownload}
                        className="text-indigo-600 hover:text-indigo-500 font-medium"
                    >
                        click here
                    </button>
                </p>
            </div>
        </div>
    );
} 