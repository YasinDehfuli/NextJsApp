'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function Navbar() {
    const { totalItems } = useCart();

    return (
        <nav className="bg-gray-800 text-white shadow-lg">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-8">
                        <Link href="/" className="text-xl font-bold hover:text-gray-300">
                            Store
                        </Link>
                        <div className="flex space-x-4">
                            <Link href="/products" className="hover:text-gray-300">
                                Products
                            </Link>
                            <Link href="/about" className="hover:text-gray-300">
                                About
                            </Link>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <Link href="/cart" className="relative hover:text-gray-300">
                            <div className="flex items-center space-x-2">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                    />
                                </svg>
                                <span>Cart</span>
                                {totalItems > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold">
                                        {totalItems}
                                    </span>
                                )}
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}