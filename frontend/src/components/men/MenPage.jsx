import React, {useEffect, useState} from 'react'
import CategoryCollectionsMen from "./CategoryCollectionsMen.jsx";
import HeroMen from "./HeroMen.jsx";
import FeaturedCollectionMen from "./FeaturedCollectionMen.jsx";
import ProductGridMen from "./ProductGridMen.jsx";
import { productsAPI, getImageUrl } from "../../services/api.js";

const MenPage = () => {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadMenProducts()
    }, [])

    const loadMenProducts = async () => {
        try {
            const allProducts = await productsAPI.getByCategory('men')

            console.log('Raw API response for men products:', allProducts);

            const transformedProducts = allProducts.map(product => ({
                id: product._id,
                _id: product._id,
                name: product.name,
                brand: product.brand,
                price: product.price,
                originalPrice: product.originalPrice,
                discount: product.discount,
                category: product.category,
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
                featured: product.featured || []
            }))

            // DEBUG: Log transformed products
            console.log('Transformed products:', transformedProducts);
            console.log('Products with featured field:', transformedProducts.map(p => ({
                name: p.name,
                featured: p.featured,
                featuredType: typeof p.featured
            })));

            setProducts(transformedProducts)
        } catch (err) {
            console.error('Error loading men products:', err)
        } finally {
            setLoading(false)
        }
    }

    // Show loading state
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
            </div>
        )
    }


    return (
        <>
            <div id="hero-section">
                <HeroMen />

            </div>
            <CategoryCollectionsMen products={products} />
            <FeaturedCollectionMen />
            <ProductGridMen
                products={products}
                title="MEN'S COLLECTION"
                description="Discover our latest men's fashion.."
            />
        </>
    )
}
export default MenPage
