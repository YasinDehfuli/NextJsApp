'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Toast as ToastType } from '@/types/toastTypes';

interface ToastProps {
    toast: ToastType;
    onRemove: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ toast, onRemove }) => {
    const [isExiting, setIsExiting] = useState(false);

    const handleClose = useCallback(() => {
        setIsExiting(true);
        setTimeout(() => {
            onRemove(toast.id);
        }, 300);
    }, [onRemove, toast.id]);

    useEffect(() => {
        if (toast.duration) {
            const timer = setTimeout(() => {
                handleClose();
            }, toast.duration - 300);

            return () => clearTimeout(timer);
        }
    }, [toast.duration, handleClose]);

    const getIcon = () => {
        switch (toast.type) {
            case 'success':
                return (
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                );
            case 'error':
                return (
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                );
            case 'warning':
                return (
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                    </svg>
                );
            case 'info':
                return (
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                );
        }
    };

    const getStyles = () => {
        const baseStyles = 'flex items-center gap-3 p-4 rounded-lg shadow-lg min-w-[300px] max-w-[500px]';

        switch (toast.type) {
            case 'success':
                return `${baseStyles} bg-green-50 border-l-4 border-green-500 text-green-800`;
            case 'error':
                return `${baseStyles} bg-red-50 border-l-4 border-red-500 text-red-800`;
            case 'warning':
                return `${baseStyles} bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800`;
            case 'info':
                return `${baseStyles} bg-blue-50 border-l-4 border-blue-500 text-blue-800`;
        }
    };

    const getIconColor = () => {
        switch (toast.type) {
            case 'success':
                return 'text-green-500';
            case 'error':
                return 'text-red-500';
            case 'warning':
                return 'text-yellow-500';
            case 'info':
                return 'text-blue-500';
        }
    };

    return (
        <div
            className={`
                ${getStyles()}
                transition-all duration-300 ease-in-out
                ${isExiting
                    ? 'opacity-0 translate-x-full'
                    : 'opacity-100 translate-x-0'
                }
            `}
        >
            <div className={`flex-shrink-0 ${getIconColor()}`}>
                {getIcon()}
            </div>
            <p className="flex-1 text-sm font-medium">{toast.message}</p>
            <button
                onClick={handleClose}
                className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close"
            >
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                    />
                </svg>
            </button>
        </div>
    );
};

export default Toast;
