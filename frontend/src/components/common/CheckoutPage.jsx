import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
    Elements,
    CardElement,
    useStripe,
    useElements
} from '@stripe/react-stripe-js';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {ordersAPI} from "../../services/api.js";

// Initializing Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_temporary_key');

const CheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const { cartItems, getCartTotal, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentError, setPaymentError] = useState(null);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [clientSecret, setClientSecret] = useState('');

    const total = getCartTotal();
    const shipping = total > 100 ? 0 : 10;
    const finalTotal = total + shipping;

    // Creating payment intent when component mounts
    useEffect(() => {
        if (finalTotal > 0 && user) {
            createPaymentIntent();
        }
    }, [finalTotal, user]);

    const createPaymentIntent = async () => {
        try {
            console.log('Creating payment intent for amount:', finalTotal);

            const response = await fetch('http://localhost:5000/api/payments/create-payment-intent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({
                    amount: parseFloat(finalTotal.toFixed(2)),
                    currency: 'eur',
                    items: cartItems.map(item => ({
                        id: item.id,
                        name: item.name,
                        quantity: item.quantity,
                        price: item.price
                    }))
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Payment initialization failed');
            }

            const data = await response.json();
            console.log('Payment intent created successfully');
            setClientSecret(data.clientSecret);

        } catch (error) {
            console.error('Payment intent error:', error);
            setPaymentError(`Failed to initialize payment: ${error.message}`);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            setPaymentError('Stripe has not loaded yet. Please wait.');
            return;
        }

        if (!clientSecret) {
            setPaymentError('Payment not initialized. Please refresh the page.');
            return;
        }

        setIsProcessing(true);
        setPaymentError(null);

        const card = elements.getElement(CardElement);

        try {
            // Confirm the payment
            const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: card,
                    billing_details: {
                        name: user?.name || 'Customer',
                        email: user?.email || 'customer@example.com',
                    },
                }
            });

            if (error) {
                console.error('Payment failed:', error);
                setPaymentError(error.message);
                setIsProcessing(false);
            } else {
                console.log('Payment successful:', paymentIntent.id);

                // Creating order in the database
                try {
                    const orderResponse = await ordersAPI.createOrder({
                        items: cartItems,
                        totalAmount: finalTotal,
                        subtotal: total,
                        shipping: shipping,
                        paymentIntentId: paymentIntent.id,
                    });
                    console.log('Order created:', orderResponse);
                } catch (orderError) {
                    console.error('Failed to create order:', orderError)
                }

                setPaymentSuccess(true);
                // Clear cart and redirect after showing success message
                setTimeout(() => {
                    clearCart();
                    navigate('/order-success', {
                        state: {
                            paymentIntentId: paymentIntent.id,
                            amount: finalTotal,
                            items: cartItems
                        }
                    });
                }, 2000);
            }
        } catch (error) {
            console.error('Payment processing error:', error);
            setPaymentError('Payment processing failed. Please try again.');
            setIsProcessing(false);
        }
    };

    const cardOptions = {
        style: {
            base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                    color: '#aab7c4',
                },
                padding: '12px',
            },
            invalid: {
                color: '#9e2146',
            },
        },
        hidePostalCode: false,
    };

    if (paymentSuccess) {
        return (
            <div className="text-center py-8">
                <div className="text-6xl mb-4">✅</div>
                <h2 className="text-2xl font-bold text-green-600 mb-2">Payment Successful!</h2>
                <p className="text-gray-600">Processing your order...</p>
                <div className="mt-4">
                    <div className="animate-pulse text-sm text-gray-500">
                        Redirecting to confirmation page...
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Card Details
                    </label>
                    <div className="p-4 border border-gray-300 rounded-md bg-white">
                        <CardElement options={cardOptions} />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                        Test card: 4242 4242 4242 4242, any future date, any CVC
                    </p>
                </div>

                {paymentError && (
                    <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        {paymentError}
                    </div>
                )}

                <div className="bg-gray-50 p-4 rounded-md space-y-2">
                    <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>€{total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Shipping:</span>
                        <span>{shipping === 0 ? 'Free' : `€${shipping.toFixed(2)}`}</span>
                    </div>
                    <hr />
                    <div className="flex justify-between items-center font-bold text-lg">
                        <span>Total:</span>
                        <span>€{finalTotal.toFixed(2)}</span>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={!stripe || isProcessing || !clientSecret}
                    className="w-full py-3 px-4 bg-black text-white font-medium rounded-md hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                    {isProcessing ? 'Processing Payment...' : `Pay €${finalTotal.toFixed(2)}`}
                </button>

                <div className="text-center text-xs text-gray-500 mt-4">
                    🔒 Secure checkout powered by Stripe
                    <br />
                    <span className="text-green-600">✓ Test mode - no real charges</span>
                </div>
            </form>
        </div>
    );
};

const CheckoutPage = () => {
    const { cartItems, getCartTotal } = useCart();
    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        if (cartItems.length === 0) {
            navigate('/cart');
            return;
        }
    }, [isAuthenticated, cartItems, navigate]);

    if (!isAuthenticated || cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-white mt-[140px] flex items-center justify-center">
                <div className="text-center">
                    <div className="text-4xl mb-4">🔄</div>
                    <p>Loading checkout...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white mt-[140px]">
            <div className="max-w-6xl mx-auto px-8 py-8">
                <h1 className="text-3xl font-bold mb-8 text-center">Secure Checkout</h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Order Summary */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

                        <div className="space-y-4">
                            {cartItems.map((item) => (
                                <div key={item.cartId} className="flex gap-4 p-4 border rounded-lg">
                                    <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center">
                                        {item.image ? (
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-full h-full object-cover rounded"
                                            />
                                        ) : (
                                            <span className="text-2xl">👕</span>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-medium">{item.name}</h3>
                                        <p className="text-sm text-gray-600">
                                            Size: {item.size} • Color: {item.color}
                                        </p>
                                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold">€{(item.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="border-t pt-6">
                            <h3 className="font-medium mb-2">Customer Information</h3>
                            <p className="text-sm text-gray-600">{user?.name}</p>
                            <p className="text-sm text-gray-600">{user?.email}</p>
                        </div>
                    </div>

                    {/* Payment Form */}
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Payment Details</h2>
                        <Elements stripe={stripePromise}>
                            <CheckoutForm />
                        </Elements>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;