'use client';

import { useState, useEffect } from 'react';
import Button from '../atoms/Button';

interface RotationSelectorProps {
    onChange: (degrees: number) => void;
    initialRotation?: number;
}

export default function RotationSelector({ onChange, initialRotation = 0 }: RotationSelectorProps) {
    const [rotation, setRotation] = useState<number>(initialRotation);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            switch (e.key) {
                case 'ArrowLeft':
                    handleRotate(-90);
                    break;
                case 'ArrowRight':
                    handleRotate(90);
                    break;
                case 'ArrowDown':
                    handleRotate(180);
                    break;
                case 'r':
                case 'R':
                    handleReset();
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [rotation]);

    const handleRotate = (degrees: number) => {
        const newRotation = (rotation + degrees) % 360;
        setRotation(newRotation);
        onChange(newRotation);
    };

    const handleReset = () => {
        setRotation(0);
        onChange(0);
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
                    title="Rotate Left (←)"
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
                    title="Rotate Right (→)"
                >
                    <svg className="w-5 h-5 transform -rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span className="ml-2">Rotate Right</span>
                </Button>
            </div>
            <div className="text-center mt-4 space-y-2">
                <Button
                    type="button"
                    variant="secondary"
                    onClick={() => handleRotate(180)}
                    title="Flip 180° (↓)"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 17l-4 4m0 0l-4-4m4 4V3" />
                    </svg>
                    <span className="ml-2">Flip 180°</span>
                </Button>
                <Button
                    type="button"
                    variant="secondary"
                    onClick={handleReset}
                    title="Reset Rotation (R)"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span className="ml-2">Reset</span>
                </Button>
            </div>
            <div className="text-sm text-gray-500 text-center mt-2 space-y-1">
                <p>Click the buttons or use keyboard arrows to rotate:</p>
                <p className="text-xs">
                    <span className="bg-gray-100 px-1 py-0.5 rounded">←</span> Left,{' '}
                    <span className="bg-gray-100 px-1 py-0.5 rounded">→</span> Right,{' '}
                    <span className="bg-gray-100 px-1 py-0.5 rounded">↓</span> Flip,{' '}
                    <span className="bg-gray-100 px-1 py-0.5 rounded">R</span> Reset
                </p>
            </div>
        </div>
    );
} 