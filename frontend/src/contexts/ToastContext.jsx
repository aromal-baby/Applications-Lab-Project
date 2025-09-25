import React, { createContext, useContext, useState } from 'react';
import Toast from '../components/common/Toast';

const ToastContext = createContext();

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = (message, type = 'success', actionButton = null) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type, actionButton }]);
    };

    const removeToast = (id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    const showCartToast = (productName, quantity, onViewCart) => {
        addToast(
            `Added ${quantity} x ${productName} to cart!`,
            'success',
            <button
                onClick={onViewCart}
                className="text-sm bg-green-700 text-white px-3 py-1 rounded hover:bg-green-800"
            >
                View Cart
            </button>
        );
    };

    const value = {
        addToast,
        showCartToast
    };

    return (
        <ToastContext.Provider value={value}>
            {children}
            <div className="fixed top-4 right-4 z-50 space-y-2">
                {toasts.map((toast) => (
                    <Toast
                        key={toast.id}
                        message={toast.message}
                        type={toast.type}
                        actionButton={toast.actionButton}
                        onClose={() => removeToast(toast.id)}
                    />
                ))}
            </div>
        </ToastContext.Provider>
    );
};