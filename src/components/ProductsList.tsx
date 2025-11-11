import { Suspense } from 'react';
import ProductCard from './ProductCard';
import { getProducts } from '@/app/products/actions';

async function ProductsListContent() {
    const products = await getProducts();

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
}

function ProductsListSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                    <div className="h-48 w-full bg-gray-300"></div>
                    <div className="p-4">
                        <div className="h-6 bg-gray-300 rounded mb-2"></div>
                        <div className="h-4 bg-gray-300 rounded mb-2"></div>
                        <div className="h-4 bg-gray-300 rounded mb-4 w-3/4"></div>
                        <div className="h-12 bg-gray-300 rounded"></div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function ProductsList() {
    return (
        <Suspense fallback={<ProductsListSkeleton />}>
            <ProductsListContent />
        </Suspense>
    );
}
