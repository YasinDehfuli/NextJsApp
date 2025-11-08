'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, CartContextType } from '@/types/productTypes';
import { useToast } from '@/context/ToastContext';

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cart, setCart] = useState<CartItem[]>([]);
    const toast = useToast();

    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            setCart(JSON.parse(savedCart));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product: Product) => {
        const existingItem = cart.find((item) => item.id === product.id);

        if (existingItem) {
            setCart((prevCart) =>
                prevCart.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                )
            );
            toast.success(`Added one more {${product.title}} to cart!`);
        } else {
            setCart((prevCart) => [...prevCart, { ...product, quantity: 1 }]);
            toast.success(`{${product.title}} added to cart!`);
        }
    };

    const removeFromCart = (productId: number) => {
        const item = cart.find((item) => item.id === productId);
        if (item) {
            toast.info(`{${item.title}} removed from cart`);
        }
        setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
    };

    const updateQuantity = (productId: number, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }
        setCart((prevCart) =>
            prevCart.map((item) =>
                item.id === productId ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => {
        if (cart.length > 0) {
            toast.success('clear all card');
        }
        setCart([]);
    };

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

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