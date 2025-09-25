import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

const OrderSuccessPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const paymentIntentId = location.state?.paymentIntentId;

    useEffect(() => {
        // Auto redirecting to the homePage after 10 seconds
        const timer = setTimeout(() => {
            navigate('/');
        }, 10000);

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="min-h-screen bg-white mt-[140px]">
            <div className="max-w-2xl mx-auto px-8 py-16 text-center">
                {/* Success Icon */}
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
                    <svg
                        className="w-12 h-12 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                        />
                    </svg>
                </div>

                {/* Success Message */}
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    Order Confirmed!
                </h1>

                <p className="text-lg text-gray-600 mb-2">
                    Thank you for your purchase from LUXE Clothing
                </p>

                {paymentIntentId && (
                    <p className="text-sm text-gray-500 mb-8">
                        Order ID: {paymentIntentId}
                    </p>
                )}

                {/* Order Details */}
                <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
                    <h2 className="text-xl font-semibold mb-4">What's Next?</h2>

                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-xs font-semibold text-blue-600">1</span>
                            </div>
                            <div>
                                <p className="font-medium">Order Processing</p>
                                <p className="text-sm text-gray-600">We're preparing your items for shipment</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-xs font-semibold text-gray-600">2</span>
                            </div>
                            <div>
                                <p className="font-medium">Shipping Notification</p>
                                <p className="text-sm text-gray-600">You'll receive an email with tracking details</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-xs font-semibold text-gray-600">3</span>
                            </div>
                            <div>
                                <p className="font-medium">Delivery</p>
                                <p className="text-sm text-gray-600">Your order will arrive in 3-5 business days</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={() => navigate('/')}
                        className="px-6 py-3 bg-black text-white font-medium rounded-md hover:bg-gray-800 transition-colors"
                    >
                        Continue Shopping
                    </button>

                    <button
                        onClick={() => navigate('/profile')}
                        className="px-6 py-3 border border-black text-black font-medium rounded-md hover:bg-gray-50 transition-colors"
                    >
                        View Orders
                    </button>
                </div>

                {/* Auto redirect notice */}
                <p className="text-xs text-gray-500 mt-8">
                    You'll be automatically redirected to the homepage in 10 seconds
                </p>

                {/* Contact Support */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                    <p className="text-sm text-gray-600 mb-2">Need help with your order?</p>
                    <p className="text-sm text-gray-500">
                        Contact us at{' '}
                        <a
                            href="mailto:support@luxeclothing.com"
                            className="text-black hover:underline"
                        >
                            support@luxeclothing.com
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccessPage;