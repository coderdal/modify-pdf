'use client';

import { useState, useMemo } from 'react';
import api from '@/lib/api';
import PageContainer from '../components/common/PageContainer';
import PdfOperationForm from '../components/molecules/PdfOperationForm';
import ResultView from '../components/molecules/ResultView';
import Alert from '../components/atoms/Alert';

interface ErrorResponse {
    status: string;
    message: string;
    code: string;
}

interface ValidationState {
    isValid: boolean;
    errors: {
        password?: string;
        confirmPassword?: string;
    };
    strength: {
        score: number;
        label: string;
        color: string;
    };
}

const MIN_PASSWORD_LENGTH = 6;
const MAX_PASSWORD_LENGTH = 50;

const PASSWORD_REQUIREMENTS = [
    { id: 'length', label: 'At least 6 characters long' },
    { id: 'uppercase', label: 'Contains uppercase letter' },
    { id: 'lowercase', label: 'Contains lowercase letter' },
    { id: 'number', label: 'Contains number' },
    { id: 'special', label: 'Contains special character' }
];

export default function ProtectPDF() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [downloadUrl, setDownloadUrl] = useState<string>('');
    const [showResult, setShowResult] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const validation = useMemo((): ValidationState => {
        const errors: ValidationState['errors'] = {};
        let strengthScore = 0;

        const hasLength = password.length >= MIN_PASSWORD_LENGTH;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        if (hasLength) strengthScore++;
        if (hasUpperCase) strengthScore++;
        if (hasLowerCase) strengthScore++;
        if (hasNumber) strengthScore++;
        if (hasSpecial) strengthScore++;

        const strength = {
            score: strengthScore,
            label: strengthScore === 0 ? 'Very Weak' :
                   strengthScore === 1 ? 'Weak' :
                   strengthScore === 2 ? 'Fair' :
                   strengthScore === 3 ? 'Good' :
                   strengthScore === 4 ? 'Strong' : 'Very Strong',
            color: strengthScore <= 1 ? 'bg-red-500' :
                   strengthScore === 2 ? 'bg-yellow-500' :
                   strengthScore === 3 ? 'bg-blue-500' :
                   'bg-green-500'
        };

        if (password) {
            if (password.length < MIN_PASSWORD_LENGTH) {
                errors.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters long`;
            } else if (password.length > MAX_PASSWORD_LENGTH) {
                errors.password = `Password cannot be longer than ${MAX_PASSWORD_LENGTH} characters`;
            }
        }

        if (confirmPassword && password !== confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
        }

        return {
            isValid: Object.keys(errors).length === 0 && 
                    password.length >= MIN_PASSWORD_LENGTH && 
                    confirmPassword === password && 
                    confirmPassword.length > 0,
            errors,
            strength
        };
    }, [password, confirmPassword]);

    const getErrorMessage = (error: unknown): string => {
        if (error && typeof error === 'object' && 'response' in error) {
            const err = error as { response?: { status?: number; data?: ErrorResponse } };
            if (err.response?.data) {
                return err.response.data.message;
            }
            switch (err.response?.status) {
                case 400:
                    return 'Invalid request. Please check your file and password.';
                case 413:
                    return 'File size is too large. Please try a smaller file.';
                case 415:
                    return 'Invalid file type. Please upload a PDF file.';
                case 429:
                    return 'Too many requests. Please try again later.';
                case 500:
                    return 'Server error. Please try again later.';
                default:
                    return 'An error occurred while processing your request.';
            }
        }
        return 'An unexpected error occurred.';
    };

    const handleSubmit = async (files: File | File[]): Promise<void> => {
        setError(null);
        setIsLoading(true);
        
        try {
            if (!validation.isValid) {
                throw new Error(validation.errors.password || validation.errors.confirmPassword || 'Invalid password');
            }
            
            const file = Array.isArray(files) ? files[0] : files;
            if (!file) {
                throw new Error('Please select a file');
            }

            const formData = new FormData();
            formData.append('pdf', file);
            formData.append('password', password);

            const response = await api.post<{ status: string; data: { filePath: string } }>(
                '/protect-pdf',
                formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                }
            );

            if (response.data.status === 'success') {
                setDownloadUrl(response.data.data.filePath);
                window.open(response.data.data.filePath, '_blank');
            } else {
                throw new Error('Failed to protect PDF');
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : getErrorMessage(err);
            throw new Error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleComplete = (success: boolean) => {
        if (success) {
            setShowResult(true);
        }
    };

    const handleBack = () => {
        setShowResult(false);
        setDownloadUrl('');
        setError(null);
        setPassword('');
        setConfirmPassword('');
    };

    const PasswordFields = (
        <div className="mt-6 space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                </label>
                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`w-full px-3 py-2 pr-10 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                            validation.errors.password ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter password"
                        maxLength={MAX_PASSWORD_LENGTH}
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                        {showPassword ? (
                            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                            </svg>
                        ) : (
                            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                        )}
                    </button>
                </div>
                {validation.errors.password && (
                    <p className="mt-1 text-sm text-red-500">{validation.errors.password}</p>
                )}
                <div className="mt-2">
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-500">Password Strength:</span>
                        <span className={`text-sm ${validation.strength.color.replace('bg-', 'text-')}`}>
                            {validation.strength.label}
                        </span>
                    </div>
                    <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div 
                            className={`h-full ${validation.strength.color} transition-all duration-300`}
                            style={{ width: `${(validation.strength.score / 5) * 100}%` }}
                        />
                    </div>
                </div>
                <div className="mt-2 space-y-1">
                    {PASSWORD_REQUIREMENTS.map(req => {
                        const isMet = req.id === 'length' ? password.length >= MIN_PASSWORD_LENGTH :
                                    req.id === 'uppercase' ? /[A-Z]/.test(password) :
                                    req.id === 'lowercase' ? /[a-z]/.test(password) :
                                    req.id === 'number' ? /[0-9]/.test(password) :
                                    /[!@#$%^&*(),.?":{}|<>]/.test(password);
                        
                        return (
                            <div key={req.id} className="flex items-center space-x-2">
                                <svg 
                                    className={`h-4 w-4 ${isMet ? 'text-green-500' : 'text-gray-300'}`}
                                    fill="none" 
                                    viewBox="0 0 24 24" 
                                    stroke="currentColor"
                                >
                                    <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth={2} 
                                        d={isMet ? "M5 13l4 4L19 7" : "M6 18L18 6M6 6l12 12"}
                                    />
                                </svg>
                                <span className={`text-xs ${isMet ? 'text-gray-700' : 'text-gray-500'}`}>
                                    {req.label}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                </label>
                <div className="relative">
                    <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={`w-full px-3 py-2 pr-10 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                            validation.errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Confirm password"
                        maxLength={MAX_PASSWORD_LENGTH}
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                        {showConfirmPassword ? (
                            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                            </svg>
                        ) : (
                            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                        )}
                    </button>
                </div>
                {validation.errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-500">{validation.errors.confirmPassword}</p>
                )}
            </div>
        </div>
    );

    return (
        <PageContainer
            title="Protect PDF"
            description="Add password protection to your PDF files with strong encryption."
        >
            <div className="space-y-8">
                {error && (
                    <Alert
                        type="error"
                        message={error}
                        onClose={() => setError(null)}
                    />
                )}

                {showResult ? (
                    <ResultView
                        operationName="Protect PDF"
                        downloadUrl={downloadUrl}
                        onBack={handleBack}
                    />
                ) : (
                    <PdfOperationForm
                        onSubmit={handleSubmit}
                        operationName="Protect PDF"
                        maxFileSize={50}
                        additionalFields={PasswordFields}
                        onComplete={handleComplete}
                        isValid={validation.isValid}
                        isLoading={isLoading}
                    />
                )}

                <div className="mt-8 border-t border-gray-200 pt-8">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        About PDF Protection
                    </h2>
                    <div className="prose prose-indigo max-w-none">
                        <p>
                            Our PDF protection tool allows you to secure your PDF files with password encryption. Features include:
                        </p>
                        <ul>
                            <li><strong>Strong Encryption:</strong> Uses AES-256 encryption for maximum security</li>
                            <li><strong>Password Protection:</strong> Prevent unauthorized access to your documents</li>
                            <li><strong>Secure Process:</strong> Your files are processed securely and deleted after download</li>
                        </ul>
                        <div className="bg-yellow-50 p-4 rounded-md mt-4">
                            <p className="text-sm text-yellow-700">
                                <strong>Important:</strong> Please remember your password! There is no way to recover the PDF if you forget it.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </PageContainer>
    );
} 