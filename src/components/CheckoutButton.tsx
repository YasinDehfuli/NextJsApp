'use client';

import { useTransition } from 'react';
import { processCheckout } from '@/app/cart/actions';
import { CartItem } from '@/types/productTypes';
import { useToast } from '@/context/ToastContext';
import { useCart } from '@/context/CartContext';

interface CheckoutButtonProps {
    cartItems: CartItem[];
    totalPrice: number;
}

export default function CheckoutButton({ cartItems, totalPrice }: CheckoutButtonProps) {
    const [isPending, startTransition] = useTransition();
    const { showToast } = useToast();
    const { clearCart } = useCart();

    const handleCheckout = () => {
        startTransition(async () => {
            const result = await processCheckout(cartItems, totalPrice);

            if (result.success) {
                showToast(`${result.message} Order ID: ${result.orderId}`, {
                    type: 'success',
                    duration: 5000,
                });
                clearCart();
            } else {
                showToast(result.error || 'Checkout failed', {
                    type: 'error',
                });
            }
        });
    };

    return (
        <button
            onClick={handleCheckout}
            disabled={isPending || cartItems.length === 0}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center gap-2"
        >
            {isPending ? (
                <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Processing...</span>
                </>
            ) : (
                'Proceed to Checkout'
            )}
        </button>
    );
}
