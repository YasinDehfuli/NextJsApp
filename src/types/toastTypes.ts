export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
    id: string;
    message: string;
    type: ToastType;
    duration?: number;
}

export interface ToastOptions {
    type?: ToastType;
    duration?: number;
}

export interface ToastContextType {
    toasts: Toast[];
    showToast: (message: string, options?: ToastOptions) => void;
    success: (message: string, duration?: number) => void;
    error: (message: string, duration?: number) => void;
    warning: (message: string, duration?: number) => void;
    info: (message: string, duration?: number) => void;
    removeToast: (id: string) => void;
}
