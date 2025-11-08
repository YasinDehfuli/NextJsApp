'use client';

import React from 'react';
import { useToast } from '@/context/ToastContext';
import Toast from './Toast';

const ToastContainer: React.FC = () => {
    const { toasts, removeToast } = useToast();

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col-reverse gap-2">
            {toasts.map((toast) => (
                <Toast key={toast.id} toast={toast} onRemove={removeToast} />
            ))}
        </div>
    );
};

export default ToastContainer;
