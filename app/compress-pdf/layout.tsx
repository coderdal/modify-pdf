import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Compress PDF - PDF Toolkit',
    description: 'Reduce your PDF file size while maintaining quality. Fast, secure, and free to use.',
};

export default function CompressPDFLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
} 