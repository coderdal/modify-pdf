import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Rotate PDF - PDF Toolkit',
    description: 'Rotate your PDF pages to the correct orientation. Fast, secure, and easy to use.',
};

export default function RotatePDFLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
} 