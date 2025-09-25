import React, { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'

const CartContext = createContext()

export const useCart = () => {
    const context = useContext(CartContext)
    if (!context) {
        throw new Error('useCart must be used within a CartProvider')
    }
    return context
}

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([])
    const [hasLoaded, setHasLoaded] = useState(false)
    const { user } = useAuth()


    useEffect(() => {
        const savedCart = localStorage.getItem('luxe_cart')
        if (savedCart) {
            try {
                const parsedCart = JSON.parse(savedCart)
                setCartItems(parsedCart)
            } catch (error) {
                console.error('Error parsing saved cart:', error)
                setCartItems([])
            }
        }
        setHasLoaded(true)
    }, []) // Empty dependency array - only runs once

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        if (hasLoaded) {
            localStorage.setItem('luxe_cart', JSON.stringify(cartItems))
        }
    }, [cartItems, hasLoaded])


    const addToCart = (product, size, color, quantity = 1) => {
        console.log('=== CART CONTEXT DEBUG ===');
        console.log('addToCart called with:', { product, size, color, quantity });

        if (!size) {
            throw new Error('Please select a size')
        }

        // Fix: Use _id instead of id for product identification
        const productId = product._id || product.id;

        const existingItemIndex = cartItems.findIndex(
            item => item.productId === productId && item.size === size && item.color === color
        )

        if (existingItemIndex > -1) {
            // Update existing item quantity
            setCartItems(prev => {
                const newCart = prev.map((item, index) =>
                    index === existingItemIndex
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                )
                return newCart;
            })
        } else {
            // Add new item with proper product ID
            const cartItem = {
                ...product,
                productId: productId,  // Add this for the backend
                size,
                color,
                quantity,
                cartId: `${productId}-${size}-${color}`, // Use productId for unique identifier
                addedAt: new Date().toISOString()
            }

            setCartItems(prev => [...prev, cartItem])
        }
    }

    /* Functionalities */

    // Removing from the cart
    const removeFromCart = (cartId) => {
        setCartItems(prev => prev.filter(item => item.cartId !== cartId))
    }

    // updating the cart
    const updateQuantity = (cartId, newQuantity) => {
        if (newQuantity < 1) {
            removeFromCart(cartId)
            return
        }

        setCartItems(prev => prev.map(item =>
            item.cartId === cartId ? { ...item, quantity: newQuantity } : item
        ))
    }

    // Clearing the cart
    const clearCart = () => {
        setCartItems([])
    }

    // Getting the total amount for items in cart
    const getCartTotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
    }

    // Getting the item count in cart
    const getCartItemCount = () => {
        return cartItems.reduce((total, item) => total + item.quantity, 0)
    }

    const value = {
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartItemCount
    }

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    )
}