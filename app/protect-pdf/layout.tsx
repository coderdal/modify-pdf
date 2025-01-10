import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Protect PDF - PDF Toolkit',
    description: 'Secure your PDF files with password protection. Fast, secure, and easy to use.',
};

export default function ProtectPDFLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
} 