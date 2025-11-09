'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { Product, CartItem, CartContextType } from '@/types/productTypes';
import { useToast } from '@/context/ToastContext';
import { cartService } from '@/services/cartService';

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isInitialized, setIsInitialized] = useState(false);
    const toast = useToast();

    useEffect(() => {
        const savedCart = cartService.getCart();
        setCart(savedCart);
        setIsInitialized(true);
    }, []);

    useEffect(() => {
        if (isInitialized) {
            cartService.saveCart(cart);
        }
    }, [cart, isInitialized]);

    const addToCart = useCallback((product: Product) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find((item) => item.id === product.id);

            if (existingItem) {
                return prevCart.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                return [...prevCart, { ...product, quantity: 1 }];
            }
        });

        const existingItem = cart.find((item) => item.id === product.id);
        if (existingItem) {
            toast.success(`Added one more ${product.title} to cart!`);
        } else {
            toast.success(`${product.title} added to cart!`);
        }
    }, [toast, cart]);

    const removeFromCart = useCallback((productId: number) => {
        const item = cart.find((item) => item.id === productId);

        setCart((prevCart) => prevCart.filter((item) => item.id !== productId));

        if (item) {
            toast.info(`${item.title} removed from cart`);
        }
    }, [toast, cart]);

    const updateQuantity = useCallback((productId: number, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }
        setCart((prevCart) =>
            prevCart.map((item) =>
                item.id === productId ? { ...item, quantity } : item
            )
        );
    }, [removeFromCart]);

    const clearCart = useCallback(() => {
        const hadItems = cart.length > 0;

        setCart([]);
        cartService.clearCart();

        if (hadItems) {
            toast.success('Cart cleared');
        }
    }, [toast, cart]);

    const totalItems = useMemo(() =>
        cart.reduce((sum, item) => sum + item.quantity, 0),
        [cart]
    );

    const totalPrice = useMemo(() =>
        cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
        [cart]
    );

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                totalItems,
                totalPrice,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};