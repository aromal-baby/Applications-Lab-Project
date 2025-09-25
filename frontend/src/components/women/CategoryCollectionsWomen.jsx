import React from 'react'
import { Heart } from 'lucide-react'

const CategoryCollectionsWomen = ({ products = [] }) => {
    // Filter products that have 'featured' or 'highlighted' in their featured array, fallback to first 6 if none
    const highlightedProducts = products.filter(product =>
        product.featured && (product.featured.includes('highlighted') || product.featured.includes('featured'))
    );
    const featuredProducts = highlightedProducts.length > 0
        ? highlightedProducts.slice(0, 6)
        : products.slice(0, 6)

    if (!featuredProducts.length) {
        return null // Don't render if no products
    }

    return (
        <section className="py-16 bg-white w-full">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Highlighted Collection
                    </h2>
                    <p className="text-gray-600 text-lg">
                        Discover our handpicked men's essentials
                    </p>
                </div>

                {/* Desktop Grid - Hidden on mobile */}
                <div className="hidden lg:grid lg:grid-cols-3 xl:grid-cols-6 gap-76">
                    {featuredProducts.map((product) => (
                        <CategoryCard key={product.id} product={product} />
                    ))}
                </div>

                {/* Tablet Grid */}
                <div className="hidden md:grid lg:hidden grid-cols-2 gap-6">
                    {featuredProducts.slice(0, 4).map((product) => (
                        <CategoryCard key={product.id} product={product} />
                    ))}
                </div>

                {/* Mobile Horizontal Scroll */}
                <div className="md:hidden">
                    <div className="overflow-x-auto scrollbar-hide">
                        <div className="flex gap-4 pb-4" style={{ width: 'max-content' }}>
                            {featuredProducts.map((product) => (
                                <div key={product.id} className="w-64 flex-shrink-0">
                                    <CategoryCard product={product} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Hide Scrollbar Completely */}
            <style jsx>{`
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </section>
    )
}

// Enhanced Category Card Component
const CategoryCard = ({ product }) => {
    const hasDiscount = product.discount && product.discount > 0
    const displayPrice = product.price
    const originalPrice = product.originalPrice

    return (
        <div className="w-[300px] relative group cursor-pointer outline-black group-hover:outline-1">
            {/* Image Container */}
            <div className="relative overflow-hidden bg-gray-100 transition-all duration-300 group-hover:shadow-xl">
                <div className="h-[400px] w-full relative">
                    {product.image ? (
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl font-light bg-gradient-to-br from-gray-100 to-gray-200 text-gray-400">
                            {product.name ? product.name.charAt(0).toUpperCase() : 'P'}
                        </div>
                    )}

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Discount Badge */}
                    {hasDiscount && (
                        <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                            -{product.discount}%
                        </div>
                    )}

                    {/* Heart Button */}
                    <HeartButton />
                </div>
            </div>

            {/* Product Info */}
            <div className="mt-4 space-y-2">
                <div>
                    <h3 className="text-sm font-medium text-gray-900 truncate group-hover:text-black transition-colors">
                        {product.name}
                    </h3>
                    {product.brand && (
                        <p className="text-xs text-gray-500 uppercase tracking-wider">
                            {product.brand}
                        </p>
                    )}
                </div>

                <div className="flex items-center space-x-2">
                    <span className="text-lg font-semibold text-gray-900">
                        €{displayPrice}
                    </span>
                    {hasDiscount && originalPrice && (
                        <span className="text-sm text-gray-500 line-through">
                            €{originalPrice}
                        </span>
                    )}
                </div>

                {/* Rating */}
                {product.rating > 0 && (
                    <div className="flex items-center space-x-1">
                        <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                                <span key={i} className="text-xs">
                                    {i < Math.floor(product.rating) ? '★' : '☆'}
                                </span>
                            ))}
                        </div>
                        <span className="text-xs text-gray-500">
                            ({product.reviews})
                        </span>
                    </div>
                )}

                {/* Stock Status */}
                {!product.inStock && (
                    <p className="text-xs text-red-500 font-medium">Out of Stock</p>
                )}
            </div>

            {/* Quick View Button - Only show on hover */}
            <button className="w-full mt-3 py-2 bg-black text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 hover:bg-gray-800">
                Quick View
            </button>
        </div>
    )
}

// Enhanced Heart Button Component
const HeartButton = () => {
    const [isLiked, setIsLiked] = React.useState(false)

    return (
        <button
            onClick={(e) => {
                e.stopPropagation()
                setIsLiked(!isLiked)
            }}
            className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110 z-10"
        >
            <Heart
                className={`w-4 h-4 transition-all duration-200 ${
                    isLiked ? 'text-red-500 fill-red-500' : 'text-gray-600'
                }`}
            />
        </button>
    )
}

export default CategoryCollectionsWomen