'use server';

import { revalidatePath } from 'next/cache';
import { CartItem } from '@/types/productTypes';

export async function processCheckout(cartItems: CartItem[], totalPrice: number) {
    try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        if (!cartItems || cartItems.length === 0) {
            return {
                success: false,
                error: 'Cart is empty',
            };
        }

        if (totalPrice <= 0) {
            return {
                success: false,
                error: 'Invalid total price',
            };
        }

        const orderId = `ORDER-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const order = {
            orderId,
            items: cartItems,
            totalPrice,
            status: 'confirmed',
            createdAt: new Date().toISOString(),
        };

        console.log('Order created:', order);
        revalidatePath('/cart');
        revalidatePath('/orders');

        return {
            success: true,
            orderId,
            message: 'Order placed successfully!',
        };
    } catch (error) {
        console.error('Checkout error:', error);
        return {
            success: false,
            error: 'Failed to process checkout. Please try again.',
        };
    }
}