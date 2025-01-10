interface PageContainerProps {
    children: React.ReactNode;
    title: string;
    description?: string;
}

export default function PageContainer({ children, title, description }: PageContainerProps) {
    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                        {title}
                    </h1>
                    {description && (
                        <p className="mt-3 text-lg text-gray-500">
                            {description}
                        </p>
                    )}
                </div>
                <div className="bg-white shadow sm:rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
} 