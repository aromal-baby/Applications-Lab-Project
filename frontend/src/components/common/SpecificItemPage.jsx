import React, { useState, useEffect } from 'react'
import { useParams, useSearchParams, Link } from 'react-router-dom'
import { productsAPI, getImageUrl } from '../../services/api.js'
import ProductGridCard from '../common/ProductGridCard.jsx'

const SpecificItemPage = () => {

    const pathParts = window.location.pathname.split('/').filter(part => part)
    const category = pathParts[0] // 'accessories'
    const subcategory = pathParts[1] // 'sunglasses'

    console.log('Manual URL parsing:', { category, subcategory })

    const [searchParams, setSearchParams] = useSearchParams()
    const [products, setProducts] = useState([])
    const [filteredProducts, setFilteredProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    // Dynamic data based on products
    const [featuredSections, setFeaturedSections] = useState([])
    const [filterTabs, setFilterTabs] = useState([])
    const [activeFilter, setActiveFilter] = useState(searchParams.get('filter') || 'all')

    useEffect(() => {
        loadProducts()
    }, [category, subcategory])

    useEffect(() => {
        applyFilter()
    }, [products, activeFilter])

    const loadProducts = async () => {
        try {
            setLoading(true)

            // Get all products for this category and subcategory
            const allProducts = await productsAPI.getAll()
            const categoryProducts = allProducts.filter(product => {
                if (category && product.category !== category) return false
                if (subcategory && product.type !== subcategory) return false
                return true
            })

            // Transform to frontend format
            const transformedProducts = categoryProducts.map(product => ({
                id: product._id,
                _id: product._id,
                productId: product._id,
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
                features: product.features || [],
                tags: product.tags || [],
                featured: product.featured || []
            }))

            setProducts(transformedProducts)

            // Generate dynamic sections and filters
            generateFeaturedSections(transformedProducts)
            generateFilterTabs(transformedProducts)

        } catch (err) {
            setError('Failed to load products')
            console.error('Error loading products:', err)
        } finally {
            setLoading(false)
        }
    }

    const generateFeaturedSections = (products) => {
        const sections = []

        // Define potential featured sections based on tags/types
        const sectionMap = {
            'gym': { title: 'GYM WEAR', subtitle: 'For breaking limits', icon: '💪' },
            'casual': { title: 'CASUAL WEAR', subtitle: 'For everyday style', icon: '👕' },
            'athletic': { title: 'ATHLETIC WEAR', subtitle: 'For peak performance', icon: '🏃' },
            'formal': { title: 'FORMAL WEAR', subtitle: 'For professional style', icon: '👔' },
            'winter': { title: 'WINTER WEAR', subtitle: 'For cold weather', icon: '🧥' },
            'summer': { title: 'SUMMER WEAR', subtitle: 'For warm weather', icon: '☀️' },
            'luxury': { title: 'LUXURY COLLECTION', subtitle: 'For premium style', icon: '✨' },
            'sport': { title: 'SPORT COLLECTION', subtitle: 'For active lifestyle', icon: '⚽' }
        }

        // Check which sections have products
        Object.entries(sectionMap).forEach(([key, config]) => {
            const sectionProducts = products.filter(product =>
                product.tags.some(tag => tag.toLowerCase().includes(key)) ||
                product.type?.toLowerCase().includes(key) ||
                product.featured.some(f => f.toLowerCase().includes(key))
            )

            if (sectionProducts.length > 0) {
                sections.push({
                    id: key,
                    ...config,
                    productCount: sectionProducts.length
                })
            }
        })

        setFeaturedSections(sections.slice(0, 3)) // Show max 3 sections
    }

    const generateFilterTabs = (products) => {
        const tabs = new Set(['all']) // Always include 'all'

        // Extract unique types and tags
        products.forEach(product => {
            if (product.type) {
                tabs.add(product.type.toLowerCase())
            }
            product.tags.forEach(tag => {
                tabs.add(tag.toLowerCase())
            })
        })

        // Convert to formatted tab names
        const formattedTabs = Array.from(tabs).map(tab => {
            if (tab === 'all') return { id: 'all', label: 'All Products' }
            return {
                id: tab,
                label: tab.split('-').map(word =>
                    word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ')
            }
        })

        setFilterTabs(formattedTabs.slice(0, 8)) // Limit to 8 tabs
    }

    const applyFilter = () => {
        if (activeFilter === 'all') {
            setFilteredProducts(products)
        } else {
            const filtered = products.filter(product =>
                product.type?.toLowerCase() === activeFilter ||
                product.tags.some(tag => tag.toLowerCase() === activeFilter) ||
                product.featured.some(f => f.toLowerCase() === activeFilter)
            )
            setFilteredProducts(filtered)
        }
    }

    const handleFilterClick = (filterId) => {
        setActiveFilter(filterId)
        const newParams = new URLSearchParams(searchParams)
        if (filterId === 'all') {
            newParams.delete('filter')
        } else {
            newParams.set('filter', filterId)
        }
        setSearchParams(newParams)
    }

    const getPageTitle = () => {
        // Parse URL manually since useParams isn't working correctly
        const pathParts = window.location.pathname.split('/').filter(part => part)
        const urlCategory = pathParts[0] // 'accessories'
        const urlSubcategory = pathParts[1] // 'sunglasses'

        if (urlSubcategory && urlCategory) {
            return `${urlSubcategory.toUpperCase()} FOR ${urlCategory.toUpperCase()}`
        }
        if (urlSubcategory) {
            return `${urlSubcategory.toUpperCase()}`
        }
        if (urlCategory) {
            return `${urlCategory.toUpperCase()} COLLECTION`
        }
        return 'PRODUCTS'
    }

    const getBreadcrumb = () => {
        const parts = ['Home']
        if (category) parts.push(category.charAt(0).toUpperCase() + category.slice(1))
        if (subcategory) parts.push(subcategory.charAt(0).toUpperCase() + subcategory.slice(1))
        return parts
    }

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

    if (error) {
        return (
            <div className="min-h-screen bg-white mt-[140px] flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
                    <p className="text-gray-600">{error}</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white mt-[140px]">
            <div className="max-w-7xl mx-auto px-8 py-8">
                {/* Breadcrumb */}
                <div className="flex items-center text-sm text-gray-600 mb-6">
                    <Link to="/" className="hover:text-black">← BACK</Link>
                    <span className="mx-2">/</span>
                    {getBreadcrumb().map((crumb, index) => (
                        <React.Fragment key={index}>
                            {index > 0 && <span className="mx-2">/</span>}
                            <span className={index === getBreadcrumb().length - 1 ? 'text-black' : 'hover:text-black cursor-pointer'}>
                                {crumb}
                            </span>
                        </React.Fragment>
                    ))}
                </div>

                {/* Page Title */}
                <h1 className="text-4xl font-bold text-black mb-8 tracking-tight">
                    {getPageTitle()} <span className="text-lg font-normal text-gray-500">({filteredProducts.length})</span>
                </h1>

                {/* Featured Sections - Only show if there are sections */}
                {featuredSections.length > 0 && (
                    <div className="mb-12">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {featuredSections.map((section) => (
                                <div key={section.id} className="relative bg-gray-200 aspect-video rounded-lg overflow-hidden group cursor-pointer">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-6">
                                        <div className="text-4xl mb-2">{section.icon}</div>
                                        <div className="bg-black/80 px-4 py-2 rounded">
                                            <h3 className="text-lg font-bold">{section.title}</h3>
                                            <p className="text-sm opacity-90">{section.subtitle}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Filter Tabs */}
                {filterTabs.length > 1 && (
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex space-x-8 overflow-x-auto">
                            {filterTabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => handleFilterClick(tab.id)}
                                    className={`whitespace-nowrap pb-2 border-b-2 font-medium text-sm transition-colors ${
                                        activeFilter === tab.id
                                            ? 'border-black text-black'
                                            : 'border-transparent text-gray-500 hover:text-black'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Filter & Sort Button */}
                        <button className="border border-black px-4 py-2 text-sm font-medium hover:bg-black hover:text-white transition-colors">
                            FILTER & SORT ≡
                        </button>
                    </div>
                )}

                {/* Products Grid */}
                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {filteredProducts.map((product) => (
                            <ProductGridCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-xl font-semibold mb-2">No products found</h3>
                        <p className="text-gray-600 mb-6">Try adjusting your filters or browse other categories</p>
                        <Link
                            to={`/category-explore?category=${category}`}
                            className="inline-block bg-black text-white px-8 py-3 hover:bg-gray-800 transition-colors"
                        >
                            Browse All {category.charAt(0).toUpperCase() + category.slice(1)}
                        </Link>
                    </div>
                )}

                {/* Load More Button */}
                {filteredProducts.length > 12 && (
                    <div className="text-center mt-12">
                        <button className="border border-black px-8 py-3 font-medium hover:bg-black hover:text-white transition-colors">
                            Load More Products
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default SpecificItemPage