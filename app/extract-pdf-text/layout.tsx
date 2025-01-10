import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Extract Text from PDF | PDF Tools',
    description: 'Extract text content from your PDF documents. Copy or download the extracted text in a clean, readable format.',
    keywords: 'PDF text extraction, extract text from PDF, PDF to text, PDF content extraction, PDF tools',
};

export default function ExtractPDFTextLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
} 