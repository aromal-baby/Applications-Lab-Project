import React, { useState, useEffect } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'
import ProductCategoryLayout from './ProductCategoryLayout.jsx'
import { productsAPI, getImageUrl } from '../../services/api.js'

const CategoryExplorationPage = () => {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchParams] = useSearchParams()
    const location = useLocation()

    // Get category from URL params or state
    const category = searchParams.get('category') || location.state?.category || 'all'
    const subcategory = searchParams.get('subcategory') || location.state?.subcategory
    const type = searchParams.get('type') || location.state?.type

    useEffect(() => {
        loadProducts()
    }, [category, subcategory, type])

    const loadProducts = async () => {
        try {
            setLoading(true)
            let allProducts = []

            if (category === 'all') {
                allProducts = await productsAPI.getAll()
            } else {
                allProducts = await productsAPI.getByCategory(category)
            }

            // Filter by subcategory and type if specified
            let filteredProducts = allProducts
            if (subcategory) {
                filteredProducts = filteredProducts.filter(p => p.subcategory === subcategory)
            }
            if (type) {
                filteredProducts = filteredProducts.filter(p => p.type === type)
            }

            // Transform to frontend format
            const transformedProducts = filteredProducts.map(product => ({
                id: product._id,
                name: product.name,
                brand: product.brand,
                price: product.price,
                originalPrice: product.originalPrice,
                discount: product.discount,
                category: product.category,
                subcategory: product.subcategory,
                type: product.type,
                image: product.images && product.images.length > 0 ? getImageUrl(product.images[0]) : null,
                images: product.images ? product.images.map(img => getImageUrl(img)) : [],
                colors: product.colors || [],
                sizes: product.sizes || [],
                rating: product.rating || 0,
                reviews: product.reviews || 0,
                inStock: product.inStock,
                stockCount: product.stockCount,
                description: product.description,
                features: product.features || []
            }))

            setProducts(transformedProducts)
        } catch (err) {
            console.error('Error loading products:', err)
        } finally {
            setLoading(false)
        }
    }

    const getTitle = () => {
        if (type) return type.toUpperCase()
        if (subcategory) return subcategory.toUpperCase()
        if (category !== 'all') return category.toUpperCase()
        return 'ALL PRODUCTS'
    }

    const featuredCategories = [
        { name: 'NEW & TRENDING', category: category, featured: 'new-arrivals' },
        { name: 'CLOTHING', subcategory: 'clothing' },
        { name: 'SHOES', subcategory: 'shoes' },
        { name: 'ACCESSORIES', subcategory: 'accessories' },
        { name: 'SPORT', subcategory: 'sport' }
    ]

    const filterTabs = [
        'New Arrival',
        'Trending Now',
        'Best Sellers',
        'Limited Edition'
    ]

    if (loading) {
        return (
            <div className="min-h-screen bg-white mt-[140px] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading products...</p>
                </div>
            </div>
        )
    }

    return (
        <ProductCategoryLayout
            title={getTitle()}
            productCount={products.length}
            featuredCategories={featuredCategories}
            filterTabs={filterTabs}
            products={products}
        />
    )
}

export default CategoryExplorationPage