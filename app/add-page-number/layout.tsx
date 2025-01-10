import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Add Page Numbers to PDF - PDF Tools',
    description: 'Add page numbers to your PDF document. Choose the position and style of page numbers to enhance document navigation.',
    openGraph: {
        title: 'Add Page Numbers to PDF - PDF Tools',
        description: 'Add page numbers to your PDF document. Choose the position and style of page numbers to enhance document navigation.',
    },
};

export default function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
} 