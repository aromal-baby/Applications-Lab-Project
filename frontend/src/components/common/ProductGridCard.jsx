import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { useWishlist } from '../../contexts/WishlistContext'
import {useToast} from "../../contexts/ToastContext.jsx";
import SizeSelectionModal from "./SizeSelectionModal.jsx";
import { getImageUrl } from "../../services/api.js";

const ProductGridCard = ({ product }) => {

    console.log('Product ID:', product._id, 'Product Name:', product.name);

    const [isLiked, setIsLiked] = useState(false)
    const [isHovered, setIsHovered] = useState(false)
    const [showSizeModal, setShowSizeModal] = useState(false)
    const { addToast } = useToast()

    const firstImage = getImageUrl(product?.images?.[0] || product?.image);



    const { toggleWishlist, isInWishlist } = useWishlist()

    const handleWishlistClick = (e) => {
        e.stopPropagation() // To stop navigation
        e.preventDefault(); // To stop event bubbling

        if (product.sizes && product.sizes.length > 0) {
            // Product has sizes so, should show the modal
            setShowSizeModal(true)
        } else {
            // No size, no modal
            const added = toggleWishlist(product)
            if (added) {
                addToast(`Added ${product.name} to wishlist!`, 'success')
            } else {
                addToast(`Removed ${product.name} from wishlist!`, 'success')
            }
        }
    }

    // Function for modal callback
    const handleWishlistAdd = (product, size) => {
        const added = toggleWishlist(product)
        if (added) {
            addToast(`Added ${product.name} to wishlist!`, 'success')
        }
    }

    return (
        <>
            <Link to={`/product/${product._id || 'no-id'}`} state={{ product }}>
                <div
                    className="group cursor-pointer relative" // Add relative here
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    {/* Hover Border Effect */}
                    {isHovered && (
                        <div className="absolute inset-0 border-1 border-black pointer-events-none z-10"/>
                    )}
                    {/* Product Image */}
                    <div
                        className="aspect-[3/4] bg-gray-200 mb-3 overflow-hidden group-hover:shadow-lg transition-shadow relative">
                        {product.image ? (
                            <img
                                src={firstImage || getImageUrl(product.image)}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                onError={(e) => {
                                    e.target.style.display = 'none'
                                    e.target.nextElementSibling.style.display = 'flex'
                                }}
                            />
                        ) : null}
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-4xl">
                            👕
                        </div>

                        {/* Wishlist Heart */}
                        <button
                            onClick={handleWishlistClick}
                            className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white"
                        >
                            <Heart
                                className={`w-4 h-4 ${
                                    isInWishlist(product.id)
                                        ? 'text-red-500 fill-red-500'
                                        : 'text-gray-600'
                                }`}
                            />
                        </button>

                        {/* Discount Badge */}
                        {product.discount && (
                            <div
                                className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 text-xs font-medium rounded">
                                {product.discount}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="space-y-1 p-2">
                        <h3 className="font-medium text-sm group-hover:underline">
                            {product.name}
                        </h3>
                        <p className="text-sm text-gray-600">{product.brand}</p>
                        <div className="flex items-center gap-2">
                            <p className="font-semibold">€{product.price}</p>
                            {product.originalPrice && (
                                <p className="text-sm text-gray-500 line-through">€{product.originalPrice}</p>
                            )}
                        </div>
                        {product.rating && (
                            <div className="flex items-center gap-1">
                                <div className="flex text-yellow-400 text-xs">
                                    {'★'.repeat(Math.floor(product.rating))}
                                </div>
                                <span className="text-xs text-gray-500">({product.reviews})</span>
                            </div>
                        )}
                    </div>
                </div>
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

export default ProductGridCard