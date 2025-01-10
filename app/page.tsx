import Link from 'next/link';

const features = [
    {
        title: 'Convert PDF',
        description: 'Convert PDFs to various formats including Word, Images, and more',
        href: '/convert-pdf',
        icon: '📄'
    },
    {
        title: 'Compress PDF',
        description: 'Reduce PDF file size while maintaining quality',
        href: '/compress-pdf',
        icon: '🗜️'
    },
    {
        title: 'Protect PDF',
        description: 'Secure your PDFs with password protection',
        href: '/protect-pdf',
        icon: '🔒'
    },
    {
        title: 'Split PDF',
        description: 'Split your PDF into multiple documents',
        href: '/split-pdf',
        icon: '✂️'
    },
    {
        title: 'Merge PDFs',
        description: 'Combine multiple PDFs into a single document',
        href: '/merge-pdf',
        icon: '🔗'
    },
    {
        title: 'Remove Protection',
        description: 'Remove password protection from PDFs',
        href: '/remove-pdf-protection',
        icon: '🔓'
    },
    {
        title: 'Rotate PDF',
        description: 'Rotate PDF pages to any angle',
        href: '/rotate-pdf',
        icon: '🔄'
    },
    {
        title: 'Remove Pages',
        description: 'Delete specific pages from your PDF',
        href: '/remove-pdf-pages',
        icon: '🗑️'
    },
    {
        title: 'Add Page Numbers',
        description: 'Add custom page numbers to your PDF',
        href: '/add-page-number',
        icon: '📝'
    },
    {
        title: 'Extract Text',
        description: 'Extract text content from PDF documents',
        href: '/extract-pdf-text',
        icon: '📋'
    },
    {
        title: 'Reorder Pages',
        description: 'Rearrange pages in your PDF document',
        href: '/reorder-pdf',
        icon: '📑'
    }
];

export default function Home() {
    return (
        <div className="bg-white">
            {/* Hero section */}
            <div className="relative isolate overflow-hidden bg-gradient-to-b from-indigo-100/20">
                <div className="mx-auto max-w-7xl pb-12 pt-10 sm:pb-32 lg:grid lg:grid-cols-2 lg:gap-x-8 lg:px-8 lg:py-32">
                    <div className="px-6 lg:px-0 lg:pt-4">
                        <div className="mx-auto max-w-2xl">
                            <div className="max-w-lg">
                                <h1 className="mt-10 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                                    Powerful PDF Tools at Your Fingertips
                                </h1>
                                <p className="mt-6 text-lg leading-8 text-gray-600">
                                    Transform, protect, and manage your PDF documents with our comprehensive suite of tools.
                                    Simple, fast, and secure.
                                </p>
                                <div className="mt-10 flex items-center gap-x-6">
                                    <Link
                                        href="/convert-pdf"
                                        className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                    >
                                        Get Started
                                    </Link>
                                    <Link href="#features" className="text-sm font-semibold leading-6 text-gray-900">
                                        View all tools <span aria-hidden="true">→</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-20 sm:mt-24 md:mx-auto md:max-w-2xl lg:mx-0 lg:mt-0 lg:w-screen">
                        <div className="absolute inset-y-0 right-1/2 -z-10 -mr-10 w-[200%] skew-x-[-30deg] bg-white shadow-xl shadow-indigo-600/10 ring-1 ring-indigo-50 md:-mr-20 lg:-mr-36" />
                        <div className="shadow-lg md:rounded-3xl">
                            <div className="bg-indigo-500 [clip-path:inset(0)] md:[clip-path:inset(0_round_theme(borderRadius.3xl))]">
                                <div className="absolute -inset-y-px left-1/2 -z-10 ml-10 w-[200%] skew-x-[-30deg] bg-indigo-100 opacity-20 ring-1 ring-inset ring-white md:ml-20 lg:ml-36" />
                                <div className="relative px-6 pt-8 sm:pt-16 md:pl-16 md:pr-0">
                                    <div className="mx-auto max-w-2xl md:mx-0 md:max-w-none">
                                        <div className="w-screen overflow-hidden rounded-tl-xl bg-gray-900">
                                            <div className="flex bg-gray-800/40 ring-1 ring-white/5">
                                                <div className="-mb-px flex text-sm font-medium leading-6 text-gray-400">
                                                    <div className="border-b border-r border-b-white/20 border-r-white/10 bg-white/5 px-4 py-2 text-white">
                                                        PDF Tools
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features section */}
            <div id="features" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
                <div className="mx-auto max-w-2xl lg:text-center">
                    <h2 className="text-base font-semibold leading-7 text-indigo-600">Complete PDF Solution</h2>
                    <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        Everything you need for your PDFs
                    </p>
                    <p className="mt-6 text-lg leading-8 text-gray-600">
                        Choose from our wide range of PDF tools to handle any document task quickly and efficiently.
                    </p>
                </div>
                <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
                    <dl className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                        {features.map((feature) => (
                            <Link key={feature.title} href={feature.href} className="group">
                                <div className="relative flex flex-col rounded-2xl border border-gray-200 p-6 hover:border-indigo-600 hover:shadow-md transition-all duration-200">
                                    <dt className="flex items-center gap-x-3 text-lg font-semibold leading-7 text-gray-900">
                                        <span className="text-2xl flex-none">{feature.icon}</span>
                                        {feature.title}
                                    </dt>
                                    <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                                        <p className="flex-auto">{feature.description}</p>
                                        <p className="mt-6 text-sm font-semibold text-indigo-600 group-hover:text-indigo-500">
                                            Use tool →
                                        </p>
                                    </dd>
                                </div>
                            </Link>
                        ))}
                    </dl>
                </div>
            </div>
        </div>
    );
}
