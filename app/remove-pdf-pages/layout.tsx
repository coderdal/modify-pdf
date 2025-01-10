import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Remove PDF Pages - PDF Tools',
    description: 'Select and remove specific pages from your PDF document. Preview pages before removing them and maintain the original quality of your PDF.',
    openGraph: {
        title: 'Remove PDF Pages - PDF Tools',
        description: 'Select and remove specific pages from your PDF document. Preview pages before removing them and maintain the original quality of your PDF.',
    },
};

export default function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
} 