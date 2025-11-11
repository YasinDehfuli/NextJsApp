'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import CheckoutButton from '@/components/CheckoutButton';

export default function CartPage() {
    const { cart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice } = useCart();

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-24 w-24 mx-auto text-gray-400 mb-4"
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
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
                    <p className="text-gray-600 mb-6">Add some products to get started!</p>
                    <Link
                        href="/products"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg inline-block transition-colors duration-200"
                    >
                        Browse Products
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-800">Shopping Cart</h1>
                    <button
                        onClick={clearCart}
                        className="text-red-600 hover:text-red-700 font-semibold"
                    >
                        Clear Cart
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-4">
                        {cart.map((item) => (
                            <div key={item.id} className="bg-white rounded-lg shadow-md p-6">
                                <div className="flex gap-6">
                                    <div className="relative h-24 w-24 flex-shrink-0 bg-gray-200 rounded-lg overflow-hidden">
                                        <Image
                                            src={item.thumbnailUrl}
                                            alt={item.title}
                                            fill
                                            className="object-cover"
                                            sizes="96px"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                            {item.title}
                                        </h3>
                                        <p className="text-gray-600 text-sm line-clamp-2">
                                            {item.description}
                                        </p>
                                        <p className="text-xl font-bold text-gray-900 mt-2">
                                            ${item.price.toFixed(2)}
                                        </p>
                                    </div>
                                    <div className="flex flex-col justify-between items-end">
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-red-600 hover:text-red-700"
                                        >
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
                                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                />
                                            </svg>
                                        </button>
                                        <div className="flex items-center gap-3 bg-gray-100 rounded-lg px-3 py-2">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="text-gray-600 hover:text-gray-800 font-bold text-xl"
                                            >
                                                -
                                            </button>
                                            <span className="font-semibold text-gray-800 min-w-[2rem] text-center">
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="text-gray-600 hover:text-gray-800 font-bold text-xl"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Summary</h2>
                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-gray-600">
                                    <span>Total Items:</span>
                                    <span className="font-semibold">{totalItems}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal:</span>
                                    <span className="font-semibold">${totalPrice.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping:</span>
                                    <span className="font-semibold">Free</span>
                                </div>
                                <div className="border-t pt-4 flex justify-between text-xl font-bold text-gray-800">
                                    <span>Total:</span>
                                    <span>${totalPrice.toFixed(2)}</span>
                                </div>
                            </div>
                            <CheckoutButton cartItems={cart} totalPrice={totalPrice} />
                            <Link
                                href="/products"
                                className="block text-center text-blue-600 hover:text-blue-700 mt-4 font-semibold"
                            >
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}