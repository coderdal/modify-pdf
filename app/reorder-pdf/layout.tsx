import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Reorder PDF Pages - PDF Tools',
    description: 'Rearrange the pages in your PDF document using our intuitive drag-and-drop interface. Preview pages and reorder them with ease.',
    openGraph: {
        title: 'Reorder PDF Pages - PDF Tools',
        description: 'Rearrange the pages in your PDF document using our intuitive drag-and-drop interface. Preview pages and reorder them with ease.',
    },
};

export default function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
} 