import React from 'react'
import { useState } from 'react'

const ProductCard = ({ product }) => {
    const [isLiked, setIsLiked] = useState(false)
    const [isHovered, setIsHovered] = useState(false)

    return (
        <div
            className="group cursor-pointer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Image Container */}
            <div className="relative bg-gray-100 aspect-square mb-4 overflow-hidden">
                {/* Product Image */}
                {product.image ? (
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl text-gray-400">
                        {product.placeholder || "👟"}
                    </div>
                )}

                {/* Heart Button */}
                <button
                    onClick={(e) => {
                        e.stopPropagation()
                        setIsLiked(!isLiked)
                    }}
                    className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center transition-opacity duration-200"
                >
                    <Heart
                        className={`w-6 h-6 transition-colors ${
                            isLiked
                                ? 'text-black fill-black'
                                : 'text-gray-600 hover:text-black'
                        }`}
                    />
                </button>

                {/* Hover Border Effect */}
                {isHovered && (
                    <div className="absolute inset-0 border-2 border-black pointer-events-none" />
                )}
            </div>

            {/* Product Info */}
            <div className="space-y-1">
                {/* Price */}
                <div className="flex items-center gap-2">
                    <span className="text-lg font-semibold text-black">
                        €{product.price || "120"}
                    </span>
                    {product.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">
                            € {product.originalPrice}
                        </span>
                    )}
                    {product.discount && (
                        <span className="text-sm text-red-600">
                            {product.discount}
                        </span>
                    )}
                </div>

                {/* Product Name */}
                <h3 className="text-black font-medium leading-tight">
                    {product.name || "Handball special shoe"}
                </h3>

                {/* Category */}
                <p className="text-gray-600 text-sm">
                    {product.category || "Originals"}
                </p>
            </div>
        </div>
    )
}

export default ProductCard