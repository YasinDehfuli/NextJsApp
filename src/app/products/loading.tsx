export default function Loading() {
    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                <div className="h-10 w-64 bg-gray-300 rounded animate-pulse mb-8"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {Array.from({ length: 12 }).map((_, i) => (
                        <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
                            <div className="h-48 w-full bg-gray-300 animate-pulse"></div>
                            <div className="p-4">
                                <div className="h-6 bg-gray-300 rounded animate-pulse mb-2"></div>
                                <div className="h-4 bg-gray-300 rounded animate-pulse mb-2"></div>
                                <div className="h-4 bg-gray-300 rounded animate-pulse mb-4 w-3/4"></div>
                                <div className="h-12 bg-gray-300 rounded animate-pulse"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}