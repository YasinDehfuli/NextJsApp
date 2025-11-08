'use client';

import Image from 'next/image';
import { Product } from '@/types/productTypes';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const { addToCart } = useCart();

    const handleAddToCart = () => {
        addToCart(product);
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full">
            <div className="relative h-48 w-full bg-gray-200">
                <Image
                    src={product.thumbnailUrl}
                    alt={product.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
            </div>
            <div className="p-4 flex-1 flex flex-col">
                <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2 min-h-[3.5rem]">
                    {product.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">
                    {product.description}
                </p>
            </div>
            <div className="p-4 pt-0 mt-auto">
                <button
                    onClick={handleAddToCart}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-colors duration-200 font-semibold flex items-center justify-between"
                >
                    <span>Add to Cart</span>
                    <span className="text-lg font-bold">${product.price.toFixed(2)}</span>
                </button>
            </div>
        </div>
    );
}