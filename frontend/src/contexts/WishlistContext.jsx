import React, { createContext, useContext, useState, useEffect } from "react";

const WishlistContext = createContext()

export const useWishlist = () => {
    const context = useContext(WishlistContext)
    if (!context) {
        throw new Error('useWishlist must be used within a WishlistProvider')
    }
    return context
}

export const WishlistProvider = ({ children }) => {

    const [wishlistItems, setWishlistItems] = useState([])

    // Loading wishlist from the localStorage mount
    useEffect(() => {
        const savedWishlist = localStorage.getItem('luxe_wishlist')
        if (savedWishlist) {
            setWishlistItems(JSON.parse(savedWishlist))
        }
    }, [])

    // Saving the wishlist to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('luxe_wishlist', JSON.stringify(wishlistItems))
    }, [wishlistItems])

    const addToWishlist = (product) => {
        const exists = wishlistItems.find(item => item.id === product.id)
        if (!exists) {
            setWishlistItems(prev => [...prev, { ...product, addedAt: new Date().toISOString() }])
            return true // Saved successfully
        }
        return false // Already exists
    }

    const removeFromWishlist = (productId) => {
        setWishlistItems(prev => prev.filter(item => item.id !== productId))
    }

    const isInWishlist = (productId) => {
        return wishlistItems.some(item => item.id === productId)
    }

    const toggleWishlist = (product) => {
        if (isInWishlist(product.id)) {
            removeFromWishlist(product.id)
            return false // Removed
        } else {
            addToWishlist(product)
            return true // Added
        }
    }

    const clearWishlist = () => {
        setWishlistItems([])
    }

    const value = {
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        toggleWishlist,
        clearWishlist,
        wishlistCount: wishlistItems.length
    }

    return (
        <WishlistContext.Provider value={value}>
            {children}
        </WishlistContext.Provider>
    )
}