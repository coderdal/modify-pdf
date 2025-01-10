import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Remove PDF Protection - PDF Toolkit',
    description: 'Remove password protection and restrictions from your PDF files securely. Fast and easy to use.',
};

export default function RemovePDFProtectionLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
} 