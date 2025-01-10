'use client';

import { useState } from 'react';
import Button from '../atoms/Button';

interface RotationSelectorProps {
    onChange: (degrees: number) => void;
}

export default function RotationSelector({ onChange }: RotationSelectorProps) {
    const [rotation, setRotation] = useState<number>(0);

    const handleRotate = (degrees: number) => {
        const newRotation = (rotation + degrees) % 360;
        setRotation(newRotation);
        onChange(newRotation);
    };

    return (
        <div className="mt-6 space-y-4">
            <label className="block text-sm font-medium text-gray-700 mb-4">
                Select Rotation
            </label>
            <div className="flex items-center justify-center space-x-8">
                <Button
                    type="button"
                    variant="secondary"
                    onClick={() => handleRotate(-90)}
                >
                    <svg className="w-5 h-5 transform rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span className="ml-2">Rotate Left</span>
                </Button>
                <div className="relative w-32 h-32 border-2 border-gray-300 rounded-lg flex items-center justify-center bg-white">
                    <div 
                        className="w-20 h-28 bg-indigo-100 rounded transition-transform duration-300 flex items-center justify-center"
                        style={{ transform: `rotate(${rotation}deg)` }}
                    >
                        <span className="text-xs text-indigo-600 transform">PDF</span>
                    </div>
                    <div className="absolute bottom-1 right-1 bg-gray-100 rounded px-2 py-1">
                        <span className="text-xs text-gray-600">{rotation}°</span>
                    </div>
                </div>
                <Button
                    type="button"
                    variant="secondary"
                    onClick={() => handleRotate(90)}
                >
                    <svg className="w-5 h-5 transform -rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span className="ml-2">Rotate Right</span>
                </Button>
            </div>
            <div className="text-center mt-4">
                <Button
                    type="button"
                    variant="secondary"
                    onClick={() => handleRotate(180)}
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 17l-4 4m0 0l-4-4m4 4V3" />
                    </svg>
                    <span className="ml-2">Flip 180°</span>
                </Button>
            </div>
            <p className="text-sm text-gray-500 text-center mt-2">
                Click the buttons to rotate the PDF in 90-degree increments
            </p>
        </div>
    );
} 