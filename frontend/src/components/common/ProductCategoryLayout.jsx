import React from 'react'
import BreadCrumb from './BreadCrumb'
import FeaturedCategories from './FeaturedCategories'
import FilterTabs from './FilterTabs'
import ProductGrid from './ProductGrid'

const ProductCategoryLayout = ({
                                   title,
                                   productCount,
                                   featuredCategories,
                                   filterTabs,
                                   products
                               }) => {
    return (
        <div className="min-h-screen bg-white mt-30">
            {/* Auto Breadcrumb */}
            <BreadCrumb />

            {/* Page Title */}
            <div className="px-8 py-6">
                <h1 className="text-3xl font-bold uppercase tracking-wide">
                    {title} <span className="text-base font-normal text-gray-500">({productCount})</span>
                </h1>
            </div>

            {/* Featured Categories - Only show if provided */}
            {featuredCategories && (
                <FeaturedCategories categories={featuredCategories} />
            )}

            {/* Filter Tabs */}
            <FilterTabs tabs={filterTabs} />

            {/* Product Grid */}
            <ProductGrid products={products} />
        </div>
    )
}

export default ProductCategoryLayout