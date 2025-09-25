import React from 'react'
import { useState } from "react";
import { useCart } from "../../contexts/CartContext.jsx";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import Button from "./Button.jsx";

const Cart = () => {

    //Cart context elements for the basic functionalities
    const{
        cartItems,
        removeFromCart,
        updateQuantity,
        getCartTotal,
        clearCart
    } = useCart()
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate()


    const [promoCode, setPromoCode] = useState('')
    const [appliedPromo, setAppliedPromo] = useState(null)


    const applyPromoCode = () => {
        if (promoCode.toUpperCase() === 'LUXE10') {
            setAppliedPromo({ code: 'LUXE10', discount: 10, type: 'percentage' })
            alert('Promo code applied! 10% off')
        } else if (promoCode.toUpperCase() === 'SAVE20') {
            setAppliedPromo({ code: 'SAVE20', discount: 20, type: 'fixed' })
            alert('Promo code applied! €20 off')
        } else {
            alert('Invalid promo code')
        }
        setPromoCode('')
    }

    // Calculate totals
    const subtotal = getCartTotal()
    const shipping = subtotal > 100 ? 0 : 10
    const promoDiscount = appliedPromo
        ? appliedPromo.type === 'percentage'
            ? subtotal * (appliedPromo.discount / 100)
            : appliedPromo.discount
        : 0
    const total = subtotal + shipping - promoDiscount

    const handleCheckout = () => {
        const outOfStockItems = cartItems.filter(item => !item.inStock)
        if (outOfStockItems.length > 0) {
            alert('Please remove out of stock items before checkout')
            return
        }

        // Checking if user is logged in
        if (!isAuthenticated) {
            navigate('/login')
            return
        }

        // Proceed to checkout
        navigate('/checkout')
    }

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-white mt-[140px]">
                <div className="max-w-4xl mx-auto px-8 py-16 text-center">
                    <div className="text-6xl mb-6">🛒</div>
                    <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
                    <p className="text-gray-600 mb-8">Looks like you haven't added anything to your cart yet.</p>
                    <div onClick={() => navigate('/')}>
                        <Button
                            containerClass=" translate-y-2 text-white bg-black !h-[44.41px]"
                            title="Continue Shopping"
                            borderOffsetX="translate-x-1"
                            borderOffsetY="translate-y-3"
                            borderColor='border-black'
                        />
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white mt-[140px]">
            <div className="max-w-6xl mx-auto px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Shopping Cart</h1>
                    <p className="text-gray-600">{cartItems.length} items in your cart</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-6">
                        {cartItems.map((item) => (
                            <div key={item.cartId} className="border border-gray-200 rounded-lg p-6">
                                <div className="flex gap-6">
                                    {/* Product Image */}
                                    <div className="w-24 h-24 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                                        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-2xl">
                                            👕
                                        </div>
                                    </div>

                                    {/* Product Info */}
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-semibold text-lg">{item.name}</h3>
                                            <button
                                                onClick={() => removeFromCart(item.cartId)}
                                                className="text-gray-400 hover:text-red-500 text-xl"
                                            >
                                                ×
                                            </button>
                                        </div>

                                        <div className="text-sm text-gray-600 mb-2">
                                            <span>Size: {item.size}</span> • <span>Color: {item.color}</span>
                                        </div>

                                        {!item.inStock && (
                                            <div className="text-red-600 text-sm font-medium mb-2">
                                                Out of Stock
                                            </div>
                                        )}

                                        <div className="flex justify-between items-center">
                                            {/* Price */}
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-lg">€{item.price}</span>
                                                {item.originalPrice && (
                                                    <span className="text-gray-500 line-through">€{item.originalPrice}</span>
                                                )}
                                            </div>

                                            {/* Quantity Controls */}
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                                                    className="w-8 h-8 border border-gray-300 flex items-center justify-center hover:border-black"
                                                >
                                                    -
                                                </button>
                                                <span className="w-12 text-center">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                                                    className="w-8 h-8 border border-gray-300 flex items-center justify-center hover:border-black"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Continue Shopping */}
                        <button onClick={() => navigate('/')} className="text-sm text-gray-600 hover:text-black flex items-center gap-2">
                            ← Continue Shopping
                        </button>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-gray-50 rounded-lg p-6 sticky top-8">
                            <h2 className="text-xl font-bold mb-6">Order Summary</h2>

                            {/* Promo Code */}
                            <div className="mb-6">
                                <div className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        placeholder="Promo code"
                                        value={promoCode}
                                        onChange={(e) => setPromoCode(e.target.value)}
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
                                    />
                                    <button
                                        onClick={applyPromoCode}
                                        className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
                                    >
                                        Apply
                                    </button>
                                </div>
                                {appliedPromo && (
                                    <div className="text-green-600 text-sm">
                                        ✓ {appliedPromo.code} applied
                                    </div>
                                )}
                            </div>

                            {/* Totals */}
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span>€{subtotal.toFixed(2)}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span>Shipping</span>
                                    <span>{shipping === 0 ? 'Free' : `€${shipping.toFixed(2)}`}</span>
                                </div>

                                {shipping === 0 && (
                                    <div className="text-green-600 text-sm">
                                        ✓ Free shipping on orders over €100
                                    </div>
                                )}

                                {promoDiscount > 0 && (
                                    <div className="flex justify-between text-green-600">
                                        <span>Discount ({appliedPromo.code})</span>
                                        <span>-€{promoDiscount.toFixed(2)}</span>
                                    </div>
                                )}

                                <hr className="border-gray-300" />

                                <div className="flex justify-between font-bold text-lg">
                                    <span>Total</span>
                                    <span>€{total.toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Checkout Button */}
                            <button
                                onClick={handleCheckout}
                                className="w-full bg-black text-white py-3 rounded font-semibold hover:bg-gray-800 transition-colors mb-4"
                            >
                                Proceed to Checkout
                            </button>

                            {/* Payment Methods */}
                            <div className="text-center">
                                <p className="text-sm text-gray-600 mb-2">We accept:</p>
                                <div className="flex justify-center gap-2">
                                    <div className="w-8 h-5 bg-gray-200 rounded flex items-center justify-center text-xs">💳</div>
                                    <div className="w-8 h-5 bg-gray-200 rounded flex items-center justify-center text-xs">PP</div>
                                    <div className="w-8 h-5 bg-gray-200 rounded flex items-center justify-center text-xs">🍎</div>
                                </div>
                            </div>

                            {/* Security */}
                            <div className="mt-4 text-center text-xs text-gray-500">
                                🔒 Secure checkout with SSL encryption
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recently Viewed */}
                <div className="mt-16">
                    <h2 className="text-2xl font-bold mb-8">Recently Viewed</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {Array.from({ length: 4 }, (_, i) => (
                            <div key={i} className="group cursor-pointer">
                                <div className="aspect-square bg-gray-200 mb-3 rounded overflow-hidden group-hover:shadow-lg transition-shadow">
                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-4xl">
                                        👕
                                    </div>
                                </div>
                                <h3 className="font-medium text-sm mb-1">Product {i + 1}</h3>
                                <p className="text-sm text-gray-600 mb-1">Category</p>
                                <p className="font-semibold">€{Math.floor(Math.random() * 100 + 50)}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Cart
