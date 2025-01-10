import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Convert PDF - PDF Toolkit',
    description: 'Convert your PDF files to various formats including Word documents and images. Fast, secure, and free to use.',
};

export default function ConvertPDFLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
} 