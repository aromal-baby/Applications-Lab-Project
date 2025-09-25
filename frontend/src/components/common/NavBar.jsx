import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { navLinks } from "../../../constants/index.js"
import { useAuth } from '../../contexts/AuthContext'
import { useCart } from '../../contexts/CartContext'
import { useWishlist } from '../../contexts/WishlistContext'

gsap.registerPlugin(ScrollTrigger)

const NavBar = ({ navbarTransform }) => {
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [hoveredMenu, setHoveredMenu] = useState(null)
    const [showUserMenu, setShowUserMenu] = useState(false)

    const location = useLocation()
    const navigate = useNavigate()

    // Context hooks
    const { user, isAuthenticated, isAdmin, logout } = useAuth()
    const { getCartItemCount } = useCart()
    const { wishlistCount } = useWishlist()

    // Animation for the navbar
    useGSAP(() => {
        const currentLocation = window.location.pathname
        const isProductCategoryPage = currentLocation.includes('/men/') ||
            currentLocation.includes('/women/') ||
            currentLocation.includes('/accessories/')

        if (isProductCategoryPage) {
            const handleScroll = () => {
                const currentScrollY = window.scrollY
                if (currentScrollY === 0) {
                    gsap.to('.navbar', {
                        y: 0,
                        duration: 0.3,
                        ease: "power2.out"
                    })
                } else {
                    gsap.to('.navbar', {
                        y: -70,
                        duration: 0.3,
                        ease: "power2.out"
                    })
                }
            }
            window.addEventListener('scroll', handleScroll)
            return () => window.removeEventListener('scroll', handleScroll)
        }

        let lastScrollY = 0
        const handleScroll = () => {
            const currentScrollY = window.scrollY
            if (currentScrollY < lastScrollY) {
                gsap.to('.navbar', {
                    y: 0,
                    duration: 0.3,
                    ease: "power2.out"
                })
            } else if (currentScrollY > 100) {
                gsap.to('.navbar', {
                    y: -70,
                    duration: 0.3,
                    ease: "power2.out"
                })
            }
            lastScrollY = currentScrollY
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const toggleSearch = () => {
        setIsSearchOpen(!isSearchOpen)
        if (isSearchOpen) {
            setSearchQuery('')
        }
    }

    const handleSearchSubmit = (e) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            // Implement search functionality
            console.log('Search for:', searchQuery)
            // Navigate to search results page or filter products
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
        }
    }

    const handleLogout = () => {
        logout()
        setShowUserMenu(false)
        navigate('/')
    }

    const handleAccountClick = () => {
        if (isAuthenticated) {
            setShowUserMenu(!showUserMenu)
        } else {
            navigate('/login')
        }
    }

    return (
        <div className="relative" onMouseLeave={() => {setHoveredMenu(null); setShowUserMenu(false)}}>
            <nav
                className="navbar fixed top-0 left-0 w-full bg-white border-b border-gray-200 shadow-sm z-50 h-[70px]"
                style={{ transform: `translateY(${navbarTransform}px)`}}
            >
                <div className="max-w-full mx-auto px-8 h-full">
                    <div className="flex justify-between items-center h-full relative">
                        {/* Left - LOGO */}
                        <div className="flex-shrink-0">
                            <Link to="/" className="flex items-center">
                                <h1 className="font-bold text-black text-2xl tracking-wide">LUXE</h1>
                            </Link>
                        </div>

                        {/* Center - Navigation Links (hidden when search is open) */}
                        {!isSearchOpen && (
                            <div className="hidden md:flex space-x-8">
                                {navLinks.map((link) => (
                                    <div
                                        key={link.id}
                                        className="relative"
                                        onMouseEnter={() => setHoveredMenu(link.id)}
                                    >
                                        <Link
                                            to={`/${link.id}`}
                                            className={`relative text-gray-700 hover:text-black text-[18px] transition-colors duration-300 py-2 group block ${
                                                location.pathname === `/${link.id}` ? 'text-black font-bold' : ''
                                            }`}
                                        >
                                            {link.title}
                                            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-black opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Expanded Search Bar */}
                        {isSearchOpen && (
                            <div className="flex-1 mx-8 top-1/2 transform translate-y-0.2">
                                <form onSubmit={handleSearchSubmit} className="flex items-center">
                                    <input
                                        type="text"
                                        placeholder="Search products..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full px-4 py-2 border-b-2 border-gray-300 focus:border-black outline-none bg-transparent text-lg"
                                        autoFocus
                                    />
                                </form>
                            </div>
                        )}

                        {/* Right - Icons */}
                        <div className="flex items-center space-x-6">
                            {/* Search Icon */}
                            <button
                                onClick={toggleSearch}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                            >
                                {isSearchOpen ? (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d="M6 18L18 6M6 6l12 12"/>
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                                    </svg>
                                )}
                            </button>

                            {/* Account Icon */}
                            <div className="relative">
                                <button
                                    onClick={handleAccountClick}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 flex items-center"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                                    </svg>
                                </button>

                                {/* User Dropdown Menu */}
                                {showUserMenu && isAuthenticated && (
                                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-2">
                                        <div className="px-4 py-2 border-b border-gray-200">
                                            <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                            <p className="text-xs text-gray-500">{user.email}</p>
                                        </div>

                                        <Link
                                            to="/profile"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            onClick={() => setShowUserMenu(false)}
                                        >
                                            My Profile
                                        </Link>

                                        <Link
                                            to="/profile?tab=orders"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            onClick={() => setShowUserMenu(false)}
                                        >
                                            Order History
                                        </Link>

                                        {isAdmin && (
                                            <Link
                                                to="/admin"
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                onClick={() => setShowUserMenu(false)}
                                            >
                                                Admin Panel
                                            </Link>
                                        )}

                                        <hr className="my-1" />

                                        <button
                                            onClick={handleLogout}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Sign out
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Wishlist Icon */}
                            <Link
                                to="/wishlist"
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 relative"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                                </svg>
                                {wishlistCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                        {wishlistCount}
                                    </span>
                                )}
                            </Link>

                            {/* Cart Icon */}
                            <Link
                                to="/cart"
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 flex items-center relative"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13h10M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z"/>
                                </svg>
                                {getCartItemCount() > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                        {getCartItemCount()}
                                    </span>
                                )}
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mini menu dropdown */}
            {hoveredMenu && !isSearchOpen && (
                <div className="fixed top-[70px] left-0 w-full bg-white border-b border-gray-200 z-40 h-auto shadow-lg">
                    <div className="max-w-7xl mx-auto px-8 py-8">
                        <div className="grid grid-cols-6 gap-8">
                            {navLinks.find(link => link.id === hoveredMenu)?.miniMenu.categories.map((category, index) => (
                                <div key={index} className="space-y-4">
                                    <h3 className="font-bold text-sm text-gray-900 uppercase tracking-wide">
                                        {category}
                                    </h3>
                                    <ul className="space-y-2">
                                        {navLinks.find(link => link.id === hoveredMenu)?.miniMenu.items[category]?.map((item, itemIndex) => (
                                            <li key={itemIndex}>
                                                <Link
                                                    to={`/${hoveredMenu}/${item.toLowerCase().replace(/\s+/g, '-')}`}
                                                    className="relative text-gray-600 hover:text-black transition-colors text-sm group"
                                                    onClick={() => setHoveredMenu(null)}
                                                >
                                                    {item}
                                                    <span className="absolute bottom-0 left-0 w-0 h-0.25 bg-black transition-all duration-300 group-hover:w-full"></span>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 pt-8 border-t border-gray-200">
                            <div className="grid grid-cols-4 gap-6">
                                {['Featured Collections', 'New Arrivals', 'Best Sellers', 'Limited Edition'].map((promo, index) => (
                                    <div key={index} className="text-center">
                                        <div className="aspect-video bg-gray-200 rounded-lg mb-2 flex items-center justify-center hover:bg-gray-300 transition-colors cursor-pointer">
                                            <span className="text-gray-600 font-medium">{promo}</span>
                                        </div>
                                        <p className="text-sm font-medium text-gray-800">{promo}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default NavBar