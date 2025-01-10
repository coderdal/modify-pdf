import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Split PDF - PDF Toolkit',
    description: 'Split your PDF files into smaller documents by selecting page ranges. Fast, secure, and easy to use.',
};

export default function SplitPDFLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
} 