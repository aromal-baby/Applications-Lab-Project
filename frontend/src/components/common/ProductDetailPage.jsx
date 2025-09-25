import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from "react-router-dom";
import BreadCrumb from "./BreadCrumb.jsx";
import { useCart } from "../../contexts/CartContext.jsx";
import { useWishlist } from "../../contexts/WishlistContext.jsx";
import { useToast } from "../../contexts/ToastContext.jsx";
import { productsAPI, getImageUrl } from "../../services/api.js";

const ProductDetailPage = ({ productData }) => {
    const { id } = useParams()
    const { addToCart } = useCart()
    const { toggleWishlist, isInWishlist } = useWishlist()
    const navigate = useNavigate();
    const { showCartToast, addToast } = useToast();

    const [product, setProduct] = useState(productData || null)
    const [loading, setLoading] = useState(!productData)
    const [selectedSize, setSelectedSize] = useState('')
    const [selectedColor, setSelectedColor] = useState('')
    const [quantity, setQuantity] = useState(1)
    const [activeImageIndex, setActiveImageIndex] = useState(0)
    const [isAddingToCart, setIsAddingToCart] = useState(false)

    // Prepare images array
    const images = React.useMemo(() => {
        if (!product) return [];
        if (Array.isArray(product.images) && product.images.length) return product.images;
        if (product.image) return [product.image];
        return [];
    }, [product]);

    // Load product if not provided via props
    useEffect(() => {
        console.log('UseEffect triggered - ID:', id, 'ProductData:', productData)
        if (id) {
            console.log('Calling loadProduct for ID:', id)
            loadProduct()
        }
    }, [id])  // Always call when ID changes


    // Set default color when product loads
    useEffect(() => {
        if (product) {
            if (product.colors && product.colors.length > 0) {
                setSelectedColor(product.colors[0])
            }
            if (product.sizes && product.sizes.length > 0) {
                setSelectedSize(product.sizes[0])
            }
        }
    }, [product])

    const loadProduct = async () => {
        try {
            setLoading(true)
            console.log('Loading product with ID:', id) // Add this
            const productResponse = await productsAPI.getById(id)
            console.log('API Response:', productResponse) // Add this
            setProduct(productResponse)
        } catch (error) {
            console.error('Error loading product:', error)
        } finally {
            setLoading(false)
        }
    }

    // Handle loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-white mt-[140px] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading product...</p>
                </div>
            </div>
        )
    }

    // Handle product not found
    if (!product) {
        return (
            <div className="min-h-screen bg-white mt-[140px] flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
                    <p className="text-gray-600 mb-8">The product you're looking for doesn't exist.</p>
                    <Link
                        to="/"
                        className="inline-block bg-black text-white px-8 py-3 hover:bg-gray-800 transition-colors"
                    >
                        Go Home
                    </Link>
                </div>
            </div>
        )
    }


    const handleAddToCart = () => {
        if (product.sizes && product.sizes.length > 0 && !selectedSize) {
            alert('Please select a size')
            return
        }

        try {
            setIsAddingToCart(true)
            addToCart(product, selectedSize, selectedColor, quantity)
            showCartToast(product.name, quantity, () => navigate('/cart'));
        } catch (error) {
            alert(error.message)
        } finally {
            setIsAddingToCart(false)
        }
    }

    const handleBuyNow = () => {
        if (product.sizes && product.sizes.length > 0 && !selectedSize) {
            alert('Please select a size')
            return
        }

        try {
            addToCart(product, selectedSize, selectedColor, quantity)
            navigate('/cart')
        } catch (error) {
            alert(error.message)
        }
    }

    const handleWishlistToggle = (e) => {
        const added = toggleWishlist(product)
        if (added) {
            addToast(`Added ${product.name} to wishlist!`, 'success');
        } else {
            addToast(`Removed ${product.name} from wishlist!`, 'success');
        }
    }

    const getColorStyle = (color) => {
        const colorMap = {
            'Black': '#000000',
            'White': '#ffffff',
            'Navy': '#1e3a8a',
            'Gray': '#6b7280',
            'Blue': '#3b82f6',
            'Red': '#ef4444',
            'Green': '#22c55e',
            'Yellow': '#eab308',
            'Pink': '#ec4899',
            'Purple': '#a855f7',
            'Silver': '#c0c0c0',
            'Gold': '#ffd700'
        }
        return colorMap[color] || '#94a3b8'
    }

    return (
        <div className="min-h-screen bg-white mt-[140px]">
            <div className="max-w-7xl mx-auto px-8 py-8">
                {/* Breadcrumb */}
                <BreadCrumb />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Product Images */}
                    <div className="space-y-4">
                        {/* Main Image */}
                        <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                            {images.length > 0 ? (
                                <img
                                    src={getImageUrl(images[activeImageIndex])}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.currentTarget.style.display = "none";
                                        e.currentTarget.nextElementSibling.style.display = "flex";
                                    }}
                                />
                            ) : null}
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-6xl">
                                {product.name ? product.name.charAt(0).toUpperCase() : 'P'}
                            </div>
                        </div>

                        {/* Thumbnail Images */}
                        {images.length > 1 && (
                            <div className="grid grid-cols-4 gap-2">
                                {images.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setActiveImageIndex(index)}
                                        className={`aspect-square bg-gray-200 rounded overflow-hidden border-2 ${
                                            activeImageIndex === index ? "border-black" : "border-transparent"
                                        }`}
                                    >
                                        <img
                                            src={getImageUrl(image)}
                                            alt={`${product.name} ${index + 1}`}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.currentTarget.style.display = "none";
                                                e.currentTarget.nextElementSibling.style.display = "flex";
                                            }}
                                        />
                                        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-2xl">
                                            {product.name ? product.name.charAt(0).toUpperCase() : 'P'}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="space-y-6">
                        {/* Title and Price */}
                        <div>
                            <h1 className="text-3xl font-bold text-black mb-2">{product.name}</h1>
                            <p className="text-gray-600 mb-4">{product.brand} • {product.category}</p>

                            <div className="flex items-center gap-4 mb-4">
                                <span className="text-2xl font-bold">€{product.price}</span>
                                {product.originalPrice && (
                                    <>
                                        <span className="text-lg text-gray-500 line-through">€{product.originalPrice}</span>
                                        {product.discount && (
                                            <span className="text-sm bg-red-100 text-red-800 px-2 py-1 rounded">
                                                {product.discount}
                                            </span>
                                        )}
                                    </>
                                )}
                            </div>

                            {/* Rating */}
                            {product.rating > 0 && (
                                <div className="flex items-center gap-2">
                                    <div className="flex text-yellow-400">
                                        {'★'.repeat(Math.floor(product.rating))}{'☆'.repeat(5 - Math.floor(product.rating))}
                                    </div>
                                    <span className="text-sm text-gray-600">({product.reviews || 0} reviews)</span>
                                </div>
                            )}
                        </div>

                        {/* Color Selection */}
                        {product.colors && product.colors.length > 0 && (
                            <div>
                                <h3 className="text-sm font-semibold mb-3">Color: {selectedColor}</h3>
                                <div className="flex gap-2">
                                    {product.colors.map((color) => (
                                        <button
                                            key={color}
                                            onClick={() => setSelectedColor(color)}
                                            className={`w-8 h-8 rounded-full border-2 ${
                                                selectedColor === color ? 'border-black' : 'border-gray-300'
                                            }`}
                                            style={{ backgroundColor: getColorStyle(color) }}
                                            title={color}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Size Selection */}
                        {product.sizes && product.sizes.length > 0 && (
                            <div>
                                <h3 className="text-sm font-semibold mb-3">Size</h3>
                                <div className="grid grid-cols-6 gap-2">
                                    {product.sizes.map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={`py-2 text-sm font-medium border ${
                                                selectedSize === size
                                                    ? 'border-black bg-black text-white'
                                                    : 'border-gray-300 hover:border-black'
                                            }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quantity */}
                        <div>
                            <h3 className="text-sm font-semibold mb-3">Quantity</h3>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="w-8 h-8 border border-gray-300 flex items-center justify-center hover:border-black"
                                >
                                    -
                                </button>
                                <span className="w-12 text-center">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="w-8 h-8 border border-gray-300 flex items-center justify-center hover:border-black"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* Stock Status */}
                        <div className="flex items-center gap-2">
                            {product.inStock ? (
                                <>
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span className="text-sm text-green-600">
                                        In Stock {product.stockCount && `(${product.stockCount} left)`}
                                    </span>
                                </>
                            ) : (
                                <>
                                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                    <span className="text-sm text-red-600">Out of Stock</span>
                                </>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3">
                            <button
                                onClick={handleAddToCart}
                                disabled={!product.inStock || isAddingToCart}
                                className="w-full py-3 bg-black text-white font-semibold hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                            >
                                {isAddingToCart ? 'Adding...' : 'Add to Cart'}
                            </button>

                            <button
                                onClick={handleBuyNow}
                                disabled={!product.inStock}
                                className="w-full py-3 border border-black text-black font-semibold hover:bg-black hover:text-white disabled:border-gray-300 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors"
                            >
                                Buy Now
                            </button>

                            <button
                                onClick={handleWishlistToggle}
                                className={`w-full py-3 border font-semibold transition-colors ${
                                    isInWishlist(product._id || product.id)
                                        ? 'border-red-500 text-red-500 hover:bg-red-50'
                                        : 'border-gray-300 text-gray-700 hover:border-black'
                                }`}
                            >
                                {isInWishlist(product._id || product.id) ? '❤️ Remove from Wishlist' : '♡ Add to Wishlist'}
                            </button>
                        </div>

                        {/* Product Features */}
                        {product.features && product.features.length > 0 && (
                            <div>
                                <h3 className="text-sm font-semibold mb-3">Features</h3>
                                <ul className="space-y-1">
                                    {product.features.map((feature, index) => (
                                        <li key={index} className="text-sm text-gray-600 flex items-center">
                                            <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Description */}
                        {product.description && (
                            <div>
                                <h3 className="text-sm font-semibold mb-3">Description</h3>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    {product.description}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductDetailPage