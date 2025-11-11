'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('Cart page error:', error);
    }, [error]);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center max-w-md px-4">
                <h2 className="text-2xl font-bold text-red-600 mb-4">Cart Error!!!!</h2>
                <p className="text-gray-600 mb-6">
                    SomeThing wrong!!
                </p>
                <div className="flex gap-4 justify-center">
                    <button
                        onClick={reset}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
                    >
                        Try again
                    </button>
                    <Link
                        href="/products"
                        className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 inline-block"
                    >
                        Back to Products
                    </Link>
                </div>
            </div>
        </div>
    );
}
