import React from 'react'
import { useState } from 'react'
import { Heart, X, ShoppingBag } from "lucide-react";
import {useWishlist} from "../../contexts/WishlistContext.jsx";
import {useCart} from "../../contexts/CartContext.jsx";
import {Link, useNavigate} from "react-router-dom";
import Button from "./Button.jsx";

const WishList = () => {

    const {
        wishlistItems,
        removeFromWishlist,
        clearWishlist
    } = useWishlist()
    const { addToCart } = useCart()
    const navigate = useNavigate();

    const moveToCart = (item) => {
        try {
            // For wishlist items, we need to ask for size selection or use a default
            // This is a simplified version - in a real app, you'd show a size selector modal
            const defaultSize = item.sizes && item.sizes.length > 0 ? item.sizes[0] : 'M'
            const defaultColor = item.colors && item.colors.length > 0 ? item.colors[0] : 'Black'

            addToCart(item, defaultSize, defaultColor, 1)
            removeFromWishlist(item.id)
            alert(`${item.name} added to cart!`)
        } catch (error) {
            alert(error.message)
        }
    }

    const handleProductClick = (id) => {
        // Navigating to product detail page
        console.log('Navigate to product:', id)
        window.location.href = `/product/${id}`
    }

    if (wishlistItems.length === 0) {
        return (
            <div className="min-h-screen bg-white mt-[140px]">
                <div className="max-w-4xl mx-auto px-8 py-16 text-center">
                    <div className="text-6xl mb-6">♡</div>
                    <h1 className="text-3xl font-bold mb-4">Your wishlist is empty</h1>
                    <p className="text-gray-600 mb-8">Save items you love by clicking the heart icon.</p>
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
                    <h1 className="text-3xl font-bold mb-2">My Wishlist</h1>
                    <p className="text-gray-600">{wishlistItems.length} items saved</p>
                </div>

                {/* Wishlist Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {wishlistItems.map((item) => (
                        <div key={item.id} className="group relative border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                            {/* Remove Button */}
                            <button
                                onClick={() => removeFromWishlist(item.id)}
                                className="absolute top-3 right-3 z-10 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors"
                            >
                                <X className="w-4 h-4 text-gray-600 hover:text-red-500" />
                            </button>

                            {/* Product Image */}
                            <div
                                className="aspect-[3/4] bg-gray-200 cursor-pointer relative overflow-hidden"
                                onClick={() => handleProductClick(item.id)}
                            >
                                {item.image ? (
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-6xl">
                                        👕
                                    </div>
                                )}

                                {/* Overlay */}
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />

                                {/* Out of Stock Overlay */}
                                {!item.inStock && (
                                    <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                                        <span className="bg-red-100 text-red-800 px-3 py-1 rounded text-sm font-medium">
                                            Out of Stock
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Product Info */}
                            <div className="p-4">
                                <div className="mb-2">
                                    <h3 className="font-semibold text-sm mb-1 line-clamp-2">{item.name}</h3>
                                    <p className="text-xs text-gray-500">{item.brand} • {item.category}</p>
                                </div>

                                {/* Price */}
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="font-bold text-lg">€{item.price}</span>
                                    {item.originalPrice && (
                                        <>
                                            <span className="text-sm text-gray-500 line-through">€{item.originalPrice}</span>
                                            <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                                                {item.discount}
                                            </span>
                                        </>
                                    )}
                                </div>

                                {/* Colors */}
                                <div className="mb-3">
                                    <p className="text-xs text-gray-600 mb-1">Colors:</p>
                                    <div className="flex gap-1">
                                        {item.colors?.slice(0, 3).map((color, index) => (
                                            <div
                                                key={index}
                                                className="w-4 h-4 rounded-full border border-gray-300"
                                                style={{
                                                    backgroundColor: color === 'Black' ? '#000' :
                                                        color === 'White' ? '#fff' :
                                                            color === 'Navy' ? '#1e3a8a' :
                                                                color === 'Silver' ? '#c0c0c0' :
                                                                    color === 'Gold' ? '#ffd700' : '#94a3b8'
                                                }}
                                            />
                                        ))}
                                        {item.colors?.length > 3 && (
                                            <span className="text-xs text-gray-500">+{item.colors.length - 3}</span>
                                        )}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="space-y-2">
                                    <button
                                        onClick={() => moveToCart(item)}
                                        disabled={!item.inStock}
                                        className="w-full bg-black text-white py-2 text-sm font-medium hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                                    >
                                        <ShoppingBag className="w-4 h-4" />
                                        {item.inStock ? 'Add to Cart' : 'Out of Stock'}
                                    </button>

                                    <button
                                        onClick={() => handleProductClick(item.id)}
                                        className="w-full border border-gray-300 text-gray-700 py-2 text-sm font-medium hover:border-black hover:text-black transition-colors"
                                    >
                                        View Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Continue Shopping */}
                <div className="mt-12 text-center">
                    <Link
                        to='/'
                        className="text-sm text-gray-600 hover:text-black transition-colors"
                    >
                        ← Continue Shopping
                    </Link>
                </div>

                {/* Recommendations */}
                <div className="mt-16">
                    <h2 className="text-2xl font-bold mb-8">You might also like</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {Array.from({ length: 4 }, (_, i) => (
                            <div key={i} className="group cursor-pointer">
                                <div className="aspect-[3/4] bg-gray-200 mb-3 overflow-hidden group-hover:shadow-lg transition-shadow">
                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-4xl">
                                        👕
                                    </div>
                                </div>
                                <h3 className="font-medium text-sm mb-1">Recommended Product {i + 1}</h3>
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
export default WishList
