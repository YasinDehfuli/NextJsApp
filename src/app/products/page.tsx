import ProductsList from '@/components/ProductsList';

export default function ProductsPage() {
    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                <h1 className="text-4xl font-bold text-gray-800 mb-8">Our Products</h1>
                <ProductsList />
            </div>
        </div>
    );
}