import React from 'react'
import { Heart } from 'lucide-react'
import { featuredProductsHome } from "../../../constants/index.js";

const CategoryCollectionsAccs = () => {
    return (
        <section className="py-16 bg-white w-full">
            <div className="max-w-7xl mx-auto px-8">
                {/* Horizontal Scrolling Container */}
                <div className="overflow-x-auto scrollbar-hide">
                    <div className="flex gap-0  pb-4" style={{ width: 'max-content' }}>
                        {featuredProductsHome.map((product) => (
                            <CategoryCard key={product.id} product={product} />
                        ))}
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

// Separate component for better organization
const CategoryCard = ({ product }) => {
    return (
        <div className="w-full relative group cursor-pointer">
            {/* Image Container with border space */}
            <div className="p-2 transition-all duration-300 group-hover:p-0">
                <div className="w-full h-[500px] bg-gray-200 overflow-hidden relative border-2 border-transparent group-hover:border-black transition-all duration-300">
                    {product.image ? (
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-6xl bg-gradient-to-br from-gray-100 to-gray-300">
                            {product.placeholder}
                        </div>
                    )}

                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <HeartButton />
                </div>
            </div>

            {/* Button */}
            <button className="w-full mt-2 py-2 bg-black text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Quick View
            </button>
        </div>
    )
}

// Separate Heart component for reusability
const HeartButton = () => {
    const [isLiked, setIsLiked] = React.useState(false)

    return (
        <button
            onClick={(e) => {
                e.stopPropagation() // Prevent card click when clicking heart
                setIsLiked(!isLiked)
            }}
            className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110"
        >
            <Heart
                className={`w-5 h-5 transition-colors duration-200 ${
                    isLiked ? 'text-red-500 fill-red-500' : 'text-gray-600'
                }`}
            />
        </button>
    )
}

export default CategoryCollectionsAccs