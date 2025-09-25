import React from 'react'
import ProductGridCard from './ProductGridCard'

const ProductGrid = ({ products = [] }) => {
    if (!products || products.length === 0) {
        return (
            <div className="px-8 py-16 text-center">
                <p className="text-gray-500">No products found</p>
            </div>
        )
    }

    return (
        <div className="px-8 py-8">
            {/* Product Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product) => (
                    <ProductGridCard key={product.id} product={product} />
                ))}
            </div>

            {/* Load More / Pagination can be added here later */}
            <div className="mt-12 text-center">
                <button className="px-8 py-3 border border-black hover:bg-black hover:text-white transition-colors">
                    Load More Products
                </button>
            </div>
        </div>
    )
}

export default ProductGrid