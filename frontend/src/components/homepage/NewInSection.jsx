import React, { useState } from 'react'
import Button from "../common/Button.jsx"
import SizeSelectionModal from "../common/SizeSelectionModal.jsx";
import { useWishlist } from "../../contexts/WishlistContext.jsx";
import { useToast } from "../../contexts/ToastContext.jsx";
import { Link } from "react-router-dom";
import { Heart } from 'lucide-react'

const NewInSection = ({ products }) => {

    // Filtering for the newIn section on data if not falling back on the latest product data
    const newArrivalProducts = products.filter(p =>
        p.featured && p.featured.includes('new-arrivals')
    )

    // Using the new arrivals if available, else using the latest in-stock products
    const sourceProducts = newArrivalProducts.length > 0 ? newArrivalProducts : products;

    const newProducts = sourceProducts
        .filter(product => product.inStock) // Only show in-stock products
        .slice(0, 9)
        .map((product, i) => ({
            id: product._id || product.id,
            _id: product._id || product.id,
            image: product.image,
            name: product.name,
            price: product.price,
            originalPrice: product.originalPrice,
            discount: product.discount,
            brand: product.brand,
            sizes: product.sizes,
            rating: product.rating,
            reviews: product.reviews,
            inStock: product.inStock
        }))

    const [currentSet, setCurrentSet] = useState(0)
    const productsPerSet = 3
    const totalSets = Math.ceil(newProducts.length / productsPerSet)

    // Get current 3 products to display
    const getCurrentProducts = () => {
        const start = currentSet * productsPerSet
        const end = start + productsPerSet
        return newProducts.slice(start, end)
    }

    const nextSet = () => {
        setCurrentSet((prev) => (prev + 1) % totalSets)
    }

    const prevSet = () => {
        setCurrentSet((prev) => (prev - 1 + totalSets) % totalSets)
    }

    // Don't render if no products
    if (!newProducts.length) {
        return null
    }

    const displayCount = newArrivalProducts.length > 0 ? newArrivalProducts.length : products.filter(p => p.inStock).length;

    return (
        <section className="py-16 px-10 bg-white items-center justify-center">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    {/* Left Content */}
                    <div className="space-y-4">
                        <p className="text-gray-500">{displayCount} new Items</p>
                        <h1 className="text-4xl font-bold text-gray-900">New In</h1>
                        <p className="text-gray-600 max-w-md">
                            New arrivals, now dropping five days a week — discover
                            the latest launches onsite from Monday to Friday
                        </p>
                        <Button
                            containerClass="text-white bg-black !h-[48px] !w-[314.64px]"
                            borderColor="border-black"
                            title="Explore New In"
                        />
                    </div>

                    {/* Right Product Carousel */}
                    <div className="flex items-center space-x-4">
                        {/* Products Grid */}
                        <div className="flex space-x-4 flex-1">
                            {getCurrentProducts().map((product, index) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    index={index}
                                />
                            ))}
                        </div>

                        {/* Navigation Button */}
                        <button
                            onClick={nextSet}
                            className="p-2 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50"
                            disabled={totalSets <= 1}
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    )
}

const ProductCard = ({ product, index }) => {

    const [showSizeModal, setShowSizeModal] = useState(false)
    const { toggleWishlist, isInWishlist } = useWishlist()
    const { addToast } = useToast()

    const handleWishlistClick = (e) => {
        e.stopPropagation()
        e.preventDefault()

        if (product.sizes && product.sizes.length > 0) {
            setShowSizeModal(true)
        } else {
            const added = toggleWishlist(product)
            if (added) {
                addToast(`Added ${product.name} to wishlist!`, 'success')
            } else {
                addToast(`Removed ${product.name} from wishlist!`, 'success')
            }
        }
    }

    const handleWishlistAdd = (product, size) => {
        const added = toggleWishlist(product)
        if (added) {
            addToast(`Added ${product.name} to wishlist!`, 'success')
        }
    }

    return (
        <>
            <Link
                to={`/product/${product._id || product.id}`}
                className="group block shrink-0 w-[300px] md:w-[280px] lg:w-[300px]"
            >
                <div className="aspect-[3/4] bg-gray-200 overflow-hidden mb-3 rounded relative group-hover:shadow-lg transition-shadow">
                    {product.image ? (
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                                e.currentTarget.style.display = "none";
                                e.currentTarget.nextElementSibling.style.display = "flex";
                            }}
                        />
                    ) : null}

                    {/* Placeholder shown only if image fails */}
                    <div className="hidden w-full h-full bg-gradient-to-br from-gray-100 to-gray-300 items-center justify-center">
                        <div className="text-center">
                            <div className="text-4xl mb-2">{product.name?.[0]?.toUpperCase() ?? "👗"}</div>
                            <p className="text-gray-600 text-sm">{product.name}</p>
                        </div>
                    </div>
                </div>

                {/* Heart Button - Only visible on hover */}
                <button
                    onClick={handleWishlistClick}
                    className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110 z-10"
                >
                    <Heart
                        className={`w-4 h-4 transition-all duration-200 ${
                            isInWishlist(product.id || product._id)
                                ? 'text-red-500 fill-red-500'
                                : 'text-gray-600'
                        }`}
                    />
                </button>

                {/* Discount Badge */}
                {product.discount && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                        {product.discount}
                    </div>
                )}
            </Link>

            {showSizeModal && (
                <SizeSelectionModal
                    product={product}
                    isOpen={showSizeModal}
                    onClose={() => setShowSizeModal(false)}
                    onAddToWishlist={handleWishlistAdd}
                />
            )}
        </>
    )
}

export default NewInSection