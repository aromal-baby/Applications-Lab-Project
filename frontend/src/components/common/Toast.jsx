import React, { useState, useEffect } from 'react';

const Toast = ({ message, type = 'success', duration = 4000, onClose, actionButton }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onClose, 300); // Allow fade animation to complete
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const bgColor = type === 'success' ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-200';
    const textColor = type === 'success' ? 'text-green-800' : 'text-blue-800';

    return (
        <div className={`fixed top-4 right-4 z-50 transition-all duration-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
        }`}>
            <div className={`${bgColor} border rounded-lg p-4 shadow-lg max-w-sm`}>
                <div className="flex items-start justify-between">
                    <div className={`${textColor} text-sm font-medium flex-1`}>
                        {message}
                    </div>
                    <button
                        onClick={() => {
                            setIsVisible(false);
                            setTimeout(onClose, 300);
                        }}
                        className={`${textColor} ml-4 hover:opacity-70`}
                    >
                        ×
                    </button>
                </div>
                {actionButton && (
                    <div className="mt-3">
                        {actionButton}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Toast;