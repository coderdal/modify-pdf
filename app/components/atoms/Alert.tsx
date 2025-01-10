'use client';

import { useEffect, useState } from 'react';

interface AlertProps {
    type: 'success' | 'error' | 'info' | 'warning';
    message: React.ReactNode;
    autoHide?: boolean;
    duration?: number;
    onClose?: () => void;
}

const alertStyles = {
    success: 'bg-green-50 text-green-800 ring-green-600/20',
    error: 'bg-red-50 text-red-800 ring-red-600/20',
    warning: 'bg-yellow-50 text-yellow-800 ring-yellow-600/20',
    info: 'bg-blue-50 text-blue-800 ring-blue-600/20',
};

const iconStyles = {
    success: (
        <svg className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
        </svg>
    ),
    error: (
        <svg className="h-5 w-5 text-red-600" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
        </svg>
    ),
    warning: (
        <svg className="h-5 w-5 text-yellow-600" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
        </svg>
    ),
    info: (
        <svg className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
        </svg>
    ),
};

export default function Alert({ 
    type, 
    message, 
    autoHide = false, 
    duration = 5000,
    onClose 
}: AlertProps) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        if (autoHide && isVisible) {
            const timer = setTimeout(() => {
                setIsVisible(false);
                onClose?.();
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [autoHide, duration, isVisible, onClose]);

    if (!isVisible) return null;

    return (
        <div className={`rounded-md ring-1 p-4 ${alertStyles[type]}`}>
            <div className="flex">
                <div className="flex-shrink-0">
                    {iconStyles[type]}
                </div>
                <div className="ml-3">
                    <p className="text-sm font-medium">
                        {message}
                    </p>
                </div>
                {onClose && (
                    <div className="ml-auto pl-3">
                        <button
                            type="button"
                            className="inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2"
                            onClick={() => {
                                setIsVisible(false);
                                onClose();
                            }}
                        >
                            <span className="sr-only">Dismiss</span>
                            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
} 