// Navigation structure
export const navLinks = [
    {
        id: 'men',
        title: 'Men',
        miniMenu: {
            categories: ['NEW & TRENDING', 'CLOTHING', 'SHOES', 'ACCESSORIES', 'SPORT', 'BRANDS'],
            items: {
                'NEW & TRENDING': ['New arrivals', 'Trending now', 'Best sellers', 'Limited edition'],
                'CLOTHING': ['T-Shirts', 'Shirts', 'Pants', 'Jackets', 'Suits', 'Casual wear'],
                'SHOES': ['Sneakers', 'Formal shoes', 'Boots', 'Sandals'],
                'ACCESSORIES': ['Watches', 'Belts', 'Wallets', 'Sunglasses'],
                'SPORT': ['Athletic wear', 'Running', 'Training', 'Outdoor'],
                'BRANDS': ['Premium', 'Designer', 'Luxury', 'Sport brands']
            }
        }
    },
    {
        id: 'women',
        title: 'Women',
        miniMenu: {
            categories: ['NEW & TRENDING', 'CLOTHING', 'SHOES', 'ACCESSORIES', 'SPORT', 'BRANDS'],
            items: {
                'NEW & TRENDING': ['New arrivals', 'Trending styles', 'Best sellers', 'Seasonal'],
                'CLOTHING': ['Dresses', 'Tops', 'Pants', 'Jackets', 'Skirts', 'Activewear'],
                'SHOES': ['Heels', 'Flats', 'Sneakers', 'Boots', 'Sandals'],
                'ACCESSORIES': ['Handbags', 'Jewelry', 'Scarves', 'Sunglasses'],
                'SPORT': ['Yoga', 'Running', 'Training', 'Swimwear'],
                'BRANDS': ['Designer', 'Premium', 'Luxury', 'Contemporary']
            }
        }
    },
    {
        id: 'accessories',
        title: 'Accessories',
        miniMenu: {
            categories: ['BAGS', 'JEWELRY', 'TECH', 'LIFESTYLE', 'GIFTS', 'SEASONAL'],
            items: {
                'BAGS': ['Handbags', 'Backpacks', 'Briefcases', 'Travel bags'],
                'JEWELRY': ['Necklaces', 'Earrings', 'Bracelets', 'Rings', 'Watches'],
                'TECH': ['Phone cases', 'Smartwatches', 'Headphones', 'Chargers'],
                'LIFESTYLE': ['Sunglasses', 'Wallets', 'Belts', 'Scarves'],
                'GIFTS': ['Gift sets', 'Gift cards', 'Under $50', 'Luxury gifts'],
                'SEASONAL': ['Summer essentials', 'Winter accessories', 'Holiday special']
            }
        }
    },
    {
        id: 'sale',
        title: 'Sale',
        miniMenu: {
            categories: ['DISCOUNTS', 'CLEARANCE', 'SEASONAL SALE', 'CATEGORIES', 'LIMITED TIME', 'OUTLET'],
            items: {
                'DISCOUNTS': ['Up to 30% off', 'Up to 50% off', 'Up to 70% off', 'Flash deals'],
                'CLEARANCE': ['Final sale', 'Last chance', 'While supplies last', 'End of season'],
                'SEASONAL SALE': ['Summer sale', 'Winter clearance', 'Holiday deals', 'Back to school'],
                'CATEGORIES': ['Clothing sale', 'Shoes sale', 'Accessories sale', 'Brand sale'],
                'LIMITED TIME': ['Today only', 'Weekend deals', 'Weekly specials', 'Member exclusive'],
                'OUTLET': ['Outlet prices', 'Previous season', 'Overstock', 'Sample sale']
            }
        }
    },
];

// Footer and social links
export const footerLinks = {
    customer: {
        title: "Customer Care",
        links: ["Contact Us", "Size Guide", "Shipping & Returns", "FAQ", "Track Order"]
    },
    company: {
        title: "About LUXE",
        links: ["Our Story", "Careers", "Press", "Sustainability", "Store Locator"]
    },
    legal: {
        title: "Legal",
        links: ["Privacy Policy", "Terms of Service", "Cookie Policy", "Accessibility"]
    }
}

export const socialLinks = [
    { name: "Instagram", icon: "📷", url: "#" },
    { name: "Twitter", icon: "🐦", url: "#" },
    { name: "Facebook", icon: "👥", url: "#" },
    { name: "Pinterest", icon: "📌", url: "#" }
]

// Category data for exploration page
export const categoryData = {
    men: {
        title: 'MEN',
        sidebarCategories: [
            { name: 'NEW & TRENDING' },
            { name: 'CLOTHING' },
            { name: 'SHOES' },
            { name: 'ACCESSORIES' },
            { name: 'SPORT' },
            { name: 'BRANDS' }
        ],
        filterTabs: {
            'NEW & TRENDING': ['New Arrival', 'Trending Now', 'Best Sellers', 'Limited Edition'],
            'CLOTHING': ['T-Shirts', 'Shirts', 'Pants', 'Jackets'],
            'SHOES': ['Sneakers', 'Formal Shoes', 'Boots', 'Sandals'],
            'ACCESSORIES': ['Watches', 'Belts', 'Wallets', 'Sunglasses'],
            'SPORT': ['Athletic Wear', 'Running', 'Training', 'Outdoor'],
            'BRANDS': ['Premium', 'Designer', 'Luxury', 'Sport Brands']
        }
    },
    women: {
        title: 'WOMEN',
        sidebarCategories: [
            { name: 'NEW & TRENDING' },
            { name: 'CLOTHING' },
            { name: 'SHOES' },
            { name: 'ACCESSORIES' },
            { name: 'SPORT' },
            { name: 'BRANDS' }
        ],
        filterTabs: {
            'NEW & TRENDING': ['New Arrival', 'Trending Now', 'Best Sellers', 'Limited Edition'],
            'CLOTHING': ['Dresses', 'Tops', 'Pants', 'Jackets', 'Skirts'],
            'SHOES': ['Heels', 'Flats', 'Sneakers', 'Boots', 'Sandals'],
            'ACCESSORIES': ['Handbags', 'Jewelry', 'Scarves', 'Sunglasses'],
            'SPORT': ['Yoga', 'Running', 'Training', 'Swimwear'],
            'BRANDS': ['Designer', 'Premium', 'Luxury', 'Contemporary']
        }
    },
    accessories: {
        title: 'ACCESSORIES',
        sidebarCategories: [
            { name: 'BAGS' },
            { name: 'JEWELRY' },
            { name: 'TECH' },
            { name: 'LIFESTYLE' },
            { name: 'GIFTS' },
            { name: 'SEASONAL' }
        ],
        filterTabs: {
            'BAGS': ['Handbags', 'Backpacks', 'Briefcases', 'Travel Bags'],
            'JEWELRY': ['Necklaces', 'Earrings', 'Bracelets', 'Rings'],
            'TECH': ['Phone Cases', 'Smartwatches', 'Headphones', 'Chargers'],
            'LIFESTYLE': ['Sunglasses', 'Wallets', 'Belts', 'Scarves'],
            'GIFTS': ['Gift Sets', 'Gift Cards', 'Under $50', 'Luxury Gifts'],
            'SEASONAL': ['Summer Essentials', 'Winter Accessories', 'Holiday Special']
        }
    }
}

// UNIFIED PRODUCT DATA - All products in one place
export const allProducts = [
    // Men's T-Shirts
    {
        id: 1,
        name: "Basic Cotton T-Shirt",
        price: 25,
        originalPrice: 35,
        discount: "29% off",
        category: "men",
        subcategory: "clothing",
        type: "t-shirts",
        brand: "LUXE",
        rating: 4.3,
        reviews: 127,
        colors: ['Black', 'White', 'Gray'],
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        image: "/images/men/tshirts/basic-tee-1.jpg",
        images: ["/images/men/tshirts/basic-tee-1.jpg", "/images/men/tshirts/basic-tee-2.jpg"],
        description: "Classic cotton t-shirt perfect for everyday wear. Soft, comfortable, and durable.",
        features: ["100% Cotton", "Machine Washable", "Classic Fit"],
        tags: ["basic", "cotton", "casual"],
        inStock: true,
        stockCount: 45
    },
    {
        id: 2,
        name: "Graphic Print Tee",
        price: 30,
        category: "men",
        subcategory: "clothing",
        type: "t-shirts",
        brand: "LUXE",
        rating: 4.5,
        reviews: 89,
        colors: ['Black', 'Navy'],
        sizes: ['S', 'M', 'L', 'XL'],
        image: "/images/men/tshirts/graphic-tee-1.jpg",
        images: ["/images/men/tshirts/graphic-tee-1.jpg"],
        description: "Trendy graphic t-shirt with modern design. Perfect for casual outings.",
        features: ["Graphic Print", "Soft Cotton", "Regular Fit"],
        tags: ["graphic", "trendy", "casual"],
        inStock: true,
        stockCount: 23
    },
    {
        id: 3,
        name: "Premium Polo Shirt",
        price: 45,
        originalPrice: 60,
        discount: "25% off",
        category: "men",
        subcategory: "clothing",
        type: "shirts",
        brand: "LUXE",
        rating: 4.7,
        reviews: 203,
        colors: ['Navy', 'White', 'Black'],
        sizes: ['S', 'M', 'L', 'XL'],
        image: "/images/men/shirts/polo-1.jpg",
        images: ["/images/men/shirts/polo-1.jpg"],
        description: "Elegant polo shirt crafted from premium materials for sophisticated casual wear.",
        features: ["Premium Cotton", "Collar Design", "Slim Fit"],
        tags: ["polo", "premium", "smart-casual"],
        inStock: true,
        stockCount: 31
    },

    // Men's Shoes
    {
        id: 4,
        name: "Classic Sneakers",
        price: 89,
        category: "men",
        subcategory: "shoes",
        type: "sneakers",
        brand: "LUXE",
        rating: 4.4,
        reviews: 156,
        colors: ['White', 'Black', 'Gray'],
        sizes: ['40', '41', '42', '43', '44', '45'],
        image: "/images/men/shoes/sneakers-1.jpg",
        images: ["/images/men/shoes/sneakers-1.jpg"],
        description: "Comfortable classic sneakers for everyday wear and light sports activities.",
        features: ["Cushioned Sole", "Breathable Material", "Durable"],
        tags: ["sneakers", "comfortable", "casual"],
        inStock: true,
        stockCount: 18
    },

    // Women's Clothing
    {
        id: 5,
        name: "Elegant Summer Dress",
        price: 85,
        originalPrice: 120,
        discount: "29% off",
        category: "women",
        subcategory: "clothing",
        type: "dresses",
        brand: "LUXE",
        rating: 4.8,
        reviews: 94,
        colors: ['Floral', 'Solid Blue', 'Black'],
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        image: "/images/women/dresses/summer-dress-1.jpg",
        images: ["/images/women/dresses/summer-dress-1.jpg"],
        description: "Beautiful summer dress perfect for warm weather occasions and casual outings.",
        features: ["Lightweight Fabric", "Flowy Design", "Comfortable Fit"],
        tags: ["dress", "summer", "elegant"],
        inStock: true,
        stockCount: 27
    },
    {
        id: 6,
        name: "Casual Blouse",
        price: 42,
        category: "women",
        subcategory: "clothing",
        type: "tops",
        brand: "LUXE",
        rating: 4.3,
        reviews: 73,
        colors: ['White', 'Pink', 'Light Blue'],
        sizes: ['XS', 'S', 'M', 'L'],
        image: "/images/women/tops/blouse-1.jpg",
        images: ["/images/women/tops/blouse-1.jpg"],
        description: "Versatile casual blouse that pairs well with jeans or skirts for any occasion.",
        features: ["Soft Fabric", "Versatile Style", "Easy Care"],
        tags: ["blouse", "casual", "versatile"],
        inStock: true,
        stockCount: 38
    },

    // Women's Shoes
    {
        id: 7,
        name: "Comfort Heels",
        price: 75,
        category: "women",
        subcategory: "shoes",
        type: "heels",
        brand: "LUXE",
        rating: 4.2,
        reviews: 112,
        colors: ['Black', 'Nude', 'Red'],
        sizes: ['36', '37', '38', '39', '40', '41'],
        image: "/images/women/shoes/heels-1.jpg",
        images: ["/images/women/shoes/heels-1.jpg"],
        description: "Comfortable heels designed for all-day wear without compromising on style.",
        features: ["Cushioned Insole", "Stable Heel", "Premium Leather"],
        tags: ["heels", "comfortable", "elegant"],
        inStock: true,
        stockCount: 22
    },

    // Accessories
    {
        id: 8,
        name: "Luxury Watch",
        price: 299,
        originalPrice: 450,
        discount: "34% off",
        category: "accessories",
        subcategory: "jewelry",
        type: "watches",
        brand: "LUXE",
        rating: 4.9,
        reviews: 67,
        colors: ['Silver', 'Gold', 'Black'],
        sizes: ['Adjustable'],
        image: "/images/accessories/watches/luxury-watch-1.jpg",
        images: ["/images/accessories/watches/luxury-watch-1.jpg"],
        description: "Sophisticated luxury watch combining classic design with modern functionality.",
        features: ["Swiss Movement", "Water Resistant", "Leather Strap"],
        tags: ["watch", "luxury", "timepiece"],
        inStock: true,
        stockCount: 15
    },
    {
        id: 9,
        name: "Designer Handbag",
        price: 180,
        category: "accessories",
        subcategory: "bags",
        type: "handbags",
        brand: "LUXE",
        rating: 4.6,
        reviews: 143,
        colors: ['Black', 'Brown', 'Navy'],
        sizes: ['Medium'],
        image: "/images/accessories/bags/handbag-1.jpg",
        images: ["/images/accessories/bags/handbag-1.jpg"],
        description: "Stylish designer handbag perfect for work and weekend occasions.",
        features: ["Genuine Leather", "Multiple Compartments", "Adjustable Strap"],
        tags: ["handbag", "designer", "leather"],
        inStock: true,
        stockCount: 12
    },

    // Featured/Homepage products
    {
        id: 10,
        name: "Luxury Blazer",
        price: 450,
        category: "men",
        subcategory: "clothing",
        type: "jackets",
        brand: "LUXE Premium",
        rating: 4.8,
        reviews: 89,
        colors: ['Navy', 'Charcoal', 'Black'],
        sizes: ['S', 'M', 'L', 'XL'],
        image: "/images/featured/blazer-1.jpg",
        images: ["/images/featured/blazer-1.jpg"],
        description: "Premium luxury blazer crafted from finest materials for sophisticated occasions.",
        features: ["Premium Wool", "Tailored Fit", "Designer Cut"],
        tags: ["blazer", "luxury", "formal"],
        inStock: true,
        stockCount: 8
    }
]

export const productDetail = allProducts[0]

// Legacy arrays for backward compatibility (filter from allProducts)
export const tshirtsMenData = allProducts.filter(p => p.category === 'men' && p.type === 't-shirts')
export const productDataWomen = allProducts.filter(p => p.category === 'women')
export const featuredProductsHome = allProducts.filter(p => p.tags?.includes('luxury') || p.price > 200)

// Filter tabs for specific categories
export const tshirtFilterTabs = [
    "Basic Tees",
    "Graphic Tees",
    "Polo Shirts",
    "Tank Tops",
    "Long Sleeve",
    "Premium",
    "Vintage",
    "Athletic"
]

export const tshirtFeaturedCategories = [
    {
        name: "Gym Wear",
        description: "For breaking limits",
        image: "/images/categories/gym-wear.jpg",
        placeholder: "💪"
    },
    {
        name: "Casual Wear",
        description: "For everyday style",
        image: "/images/categories/casual-wear.jpg",
        placeholder: "👕"
    },
    {
        name: "Athletic Wear",
        description: "For peak performance",
        image: "/images/categories/athletic-wear.jpg",
        placeholder: "🏃"
    }
]

// HELPER FUNCTIONS FOR SEARCH AND FILTERING

// Find product by ID (works across all products)
export const findProductById = (id) => {
    const productId = typeof id === 'string' ? parseInt(id) : id
    return allProducts.find(product => product.id === productId)
}

// Search products by query
export const searchProducts = (query, products = allProducts) => {
    if (!query) return products

    const searchTerm = query.toLowerCase()
    return products.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.brand.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm) ||
        product.type.toLowerCase().includes(searchTerm) ||
        product.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
    )
}

// Filter products by criteria
export const filterProducts = (filters, products = allProducts) => {
    return products.filter(product => {
        return (!filters.category || product.category === filters.category) &&
            (!filters.subcategory || product.subcategory === filters.subcategory) &&
            (!filters.type || product.type === filters.type) &&
            (!filters.priceMin || product.price >= filters.priceMin) &&
            (!filters.priceMax || product.price <= filters.priceMax) &&
            (!filters.colors || filters.colors.some(color => product.colors?.includes(color))) &&
            (!filters.sizes || filters.sizes.some(size => product.sizes?.includes(size))) &&
            (!filters.inStock || product.inStock === filters.inStock)
    })
}

// Navigation Helpers
export const navigateToCategory = (navigate, category = 'women') => {
    const validCategories = ['men', 'women', 'accessories']
    const targetCategory = validCategories.includes(category) ? category : 'women'
    navigate(`/category-explore?category=${targetCategory}`)
}

// To get the category exploration URL
export const getCategoryExploreUrl = (category = 'women') => {
    const validCategories = ['men', 'women', 'accessories']
    const targetCategory = validCategories.includes(category) ? category : 'women'
    return `/category-explore?category=${targetCategory}`
}

// Get products by category
export const getProductsByCategory = (category) => {
    return allProducts.filter(product => product.category === category)
}

// Get products by subcategory
export const getProductsBySubcategory = (category, subcategory) => {
    return allProducts.filter(product =>
        product.category === category && product.subcategory === subcategory
    )
}

// Get products by type
export const getProductsByType = (category, type) => {
    return allProducts.filter(product =>
        product.category === category && product.type === type
    )
}