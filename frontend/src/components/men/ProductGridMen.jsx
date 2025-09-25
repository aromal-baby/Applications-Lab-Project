import React, {useRef, useState} from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import ProductGridCard from "../common/ProductGridCard.jsx";

const ProductGridMen = ({ products, title, description, showLearnMore = true }) => {
    const [showNavigation, setShowNavigation] = useState(false)
    const [canScrollLeft, setCanScrollLeft] = useState(false)
    const [canScrollRight, setCanScrollRight] = useState(true)
    const scrollContainerRef = useRef(null);

    const handleScroll = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
            setCanScrollLeft(scrollLeft > 0)
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1)
        }
    }

    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: -320, behavior: 'smooth' })
        }
    }

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: 320, behavior: 'smooth' })
        }
    }

    return (
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-8">
                {/* Header Section */}
                <div className="mb-12">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-4xl font-bold text-black mb-4 tracking-tight">
                                {title || "ONLY AT LUXE"}
                            </h2>
                            <p className="text-gray-700 max-w-2xl leading-relaxed">
                                {description || "Discover unique LUXE products available only in the LUXE online shop and LUXE stores. Special collections, one-off drops, limited-edition colorways, and more—you won't find these products anywhere else."}
                            </p>
                        </div>
                        {showLearnMore && (
                            <button className="border-b-2 border-black text-black font-medium hover:border-gray-400 transition-colors">
                                LEARN MORE
                            </button>
                        )}
                    </div>
                </div>

                {/* Product Grid */}
                <div
                    className="relative mb-8"
                    onMouseEnter={() => setShowNavigation(true)}
                    onMouseLeave={() => setShowNavigation(false)}
                >
                    {/* Left Arrow */}
                    {showNavigation && canScrollLeft && (
                        <button
                            onClick={scrollLeft}
                            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white border border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors shadow-lg"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                    )}

                    {/* Right Arrow */}
                    {showNavigation && (
                        <button
                            onClick={scrollRight}
                            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white border border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors shadow-lg"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    )}

                    {/* Scrollable Container */}
                    <div
                        ref={scrollContainerRef}
                        className="overflow-x-auto scrollbar-hide scroll-smooth"
                        onScroll={handleScroll}
                    >
                        <div className="flex gap-6 pb-4" style={{ width: 'max-content' }}>
                            {products?.map((product) => (
                                <div key={product.id} className="w-80 flex-shrink-0">
                                    <ProductGridCard product={product} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </section>
    )
}

export default ProductGridMen