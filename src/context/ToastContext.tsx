'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { Toast, ToastContextType, ToastOptions } from '@/types/toastTypes';

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('Error');
    }
    return context;
};

interface ToastProviderProps {
    children: React.ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const removeToast = useCallback((id: string) => {
        setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
    }, []);

    const showToast = useCallback(
        (message: string, options: ToastOptions = {}) => {
            const id = `${Date.now()}-${Math.random()}`;
            const toast: Toast = {
                id,
                message,
                type: options.type || 'info',
                duration: options.duration || 3000,
            };

            setToasts((prevToasts) => [...prevToasts, toast]);

            if (toast.duration) {
                setTimeout(() => {
                    removeToast(id);
                }, toast.duration);
            }
        },
        [removeToast]
    );

    const success = useCallback(
        (message: string, duration?: number) => {
            showToast(message, { type: 'success', duration });
        },
        [showToast]
    );

    const error = useCallback(
        (message: string, duration?: number) => {
            showToast(message, { type: 'error', duration });
        },
        [showToast]
    );

    const warning = useCallback(
        (message: string, duration?: number) => {
            showToast(message, { type: 'warning', duration });
        },
        [showToast]
    );

    const info = useCallback(
        (message: string, duration?: number) => {
            showToast(message, { type: 'info', duration });
        },
        [showToast]
    );

    const value: ToastContextType = {
        toasts,
        showToast,
        success,
        error,
        warning,
        info,
        removeToast,
    };

    return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
};
