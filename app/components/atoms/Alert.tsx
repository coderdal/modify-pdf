'use client';

import React from 'react';
import { XCircleIcon, CheckCircleIcon, ExclamationTriangleIcon, InformationCircleIcon } from '@heroicons/react/24/solid';

type AlertType = 'error' | 'success' | 'warning' | 'info';

interface AlertProps {
    type: AlertType;
    message: string;
    onClose?: () => void;
}

const alertStyles = {
    error: {
        bg: 'bg-red-50',
        text: 'text-red-700',
        icon: XCircleIcon,
        iconColor: 'text-red-400'
    },
    success: {
        bg: 'bg-green-50',
        text: 'text-green-700',
        icon: CheckCircleIcon,
        iconColor: 'text-green-400'
    },
    warning: {
        bg: 'bg-yellow-50',
        text: 'text-yellow-700',
        icon: ExclamationTriangleIcon,
        iconColor: 'text-yellow-400'
    },
    info: {
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        icon: InformationCircleIcon,
        iconColor: 'text-blue-400'
    }
};

const Alert: React.FC<AlertProps> = ({ type, message, onClose }) => {
    const style = alertStyles[type];

    return (
        <div className={`rounded-md p-4 ${style.bg} mb-4`}>
            <div className="flex">
                <div className="flex-shrink-0">
                    <style.icon className={`h-5 w-5 ${style.iconColor}`} aria-hidden="true" />
                </div>
                <div className="ml-3 flex-1">
                    <p className={`text-sm font-medium ${style.text}`}>{message}</p>
                </div>
                {onClose && (
                    <div className="ml-auto pl-3">
                        <button
                            type="button"
                            className={`inline-flex rounded-md ${style.bg} p-1.5 ${style.text} hover:${style.bg} focus:outline-none focus:ring-2 focus:ring-offset-2`}
                            onClick={onClose}
                        >
                            <span className="sr-only">Dismiss</span>
                            <XCircleIcon className="h-5 w-5" aria-hidden="true" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Alert; 