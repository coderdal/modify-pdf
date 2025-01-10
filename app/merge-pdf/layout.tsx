import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Merge PDF - PDF Toolkit',
    description: 'Combine multiple PDF files into a single document. Fast, secure, and easy to use.',
};

export default function MergePDFLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
} 