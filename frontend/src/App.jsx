import React, {useEffect, useState} from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'


// Context providers
import { AuthProvider } from './contexts/AuthContext.jsx'
import { CartProvider } from './contexts/CartContext.jsx'
import { WishlistProvider } from './contexts/WishlistContext.jsx'

// Common Components
import NavBar from "./components/common/NavBar.jsx";
import Announcement from "./components/common/Announcement.jsx";
import Footer from "./components/common/Footer.jsx";
import { useParams } from 'react-router-dom'

/// Homepage
import Hero from "./components/homepage/Hero.jsx";
import NewInSection from "./components/homepage/NewInSection.jsx";
import About from "./components/homepage/About.jsx";
import FeaturedCollections from "./components/homepage/FeaturedCollections.jsx";
import ShowCase from "./components/homepage/ShowCase.jsx";

// MEN
import MenPage from "./components/men/MenPage.jsx";
//WOMEN
import WomenPage from "./components/women/WomenPage.jsx";
//ACCESSORIES
import AccessoriesPage from "./components/accessories/AccessoriesPage.jsx";

import { productDataWomen,tshirtsMenData, productDetail } from "../constants/index.js";

// Mega Menu Components
import CategoryExplorationPage from "./components/common/CategoryExplorationPage.jsx";
import Cart from "./components/common/Cart.jsx";
import ProductDetailPage from "./components/common/ProductDetailPage.jsx";
import WishList from "./components/common/WishList.jsx";
import ProfilePage from "./components/auth/ProfilePage.jsx";
import LoginPage from "./components/auth/LoginPage.jsx";
import SignupPage from "./components/auth/SignupPage.jsx";
import AdminPanel from "./components/admin/AdminPanel.jsx";
import CategoryLayout from "./components/common/Categorylayout.jsx";
import SpecificItemPage from "./components/common/SpecificItemPage.jsx";
import OrderSuccessPage from "./components/common/OrderSuccesspage.jsx";
import CheckoutPage from "./components/common/CheckoutPage.jsx";
import {ToastProvider} from "./contexts/ToastContext.jsx";
import HomePage from "./components/homepage/HomePage.jsx";



const App = () => {
    return (
        <Router>
            <AuthProvider>
                <CartProvider>
                    <WishlistProvider>
                        <ToastProvider>
                            <main>
                                <NavBar/>
                                <Announcement/>

                                <Routes>
                                    <Route element={<CategoryLayout/>}>
                                        {/* Homepage */}
                                        <Route path="/" element={<HomePage/>}/>

                                        {/* Men's Page */}
                                        <Route path="/men" element={<MenPage/>}/>

                                        {/* Women's Page */}
                                        <Route path="/women" element={<WomenPage/>}/>

                                        {/* Accessories Page */}
                                        <Route path="/accessories" element={<AccessoriesPage/>}/>

                                        {/* Sale Page */}
                                        <Route path="/sale" element={<SalePage/>}/>
                                    </Route>

                                    {/* For specific Items for navbar mini menu*/}
                                    <Route path="/men/:subcategory" element={<SpecificItemPage/>}/>
                                    <Route path="/women/:subcategory" element={<SpecificItemPage/>}/>
                                    <Route path="/accessories/:subcategory" element={<SpecificItemPage/>}/>

                                    {/* Other Pages */}
                                    <Route path="/cart" element={<Cart/>}/>
                                    <Route path="/wishlist" element={<WishList/>}/>
                                    <Route path="/profile" element={<ProfilePage/>}/>
                                    {/* Admin Panel */}
                                    <Route path="/admin" element={<AdminPanel/>}/>

                                    {/* Authentication */}
                                    <Route path="/login" element={<LoginPage/>}/>
                                    <Route path="/signup" element={<SignupPage/>}/>


                                    {/* Centralized page for categories */}
                                    <Route path="/category-explore" element={<CategoryExplorationPage/>}/>

                                    {/* Product Details */}
                                    <Route path="/product/:id" element={<ProductWrapper/>}/>

                                    {/* Checking Out */}
                                    <Route path="/checkout" element={<CheckoutPage/>}/>
                                    <Route path="/order-success" element={<OrderSuccessPage/>}/>
                                </Routes>
                                <Footer/>
                            </main>
                        </ToastProvider>
                    </WishlistProvider>
                </CartProvider>
            </AuthProvider>
        </Router>
    )
}

// Page components
/*const HomePage = () => (
    <>
        <div id="hero-section">
            <Hero />
        </div>
        <NewInSection />
        <About />
        <FeaturedCollections showPrices={false} />
        <ShowCase />
    </>
)*/

/*const MenPage = () => (
    <>
        <div id="hero-section">
            <HeroMen />
        </div>
        <CategoryCollectionsMen />
        <FeaturedCollectionMen />
        <ProductGridMen />
    </>
)

const WomenPage = () => (
    <>
        <div id="hero-section">
            <HeroWomen />
        </div>
        <CategoryCollectionsWomen />
        <FeaturedCollectionWomen />
        <ProductGridWomen
            products={productDataWomen}
            title="WOMEN'S COLLECTION"
            description="Discover our latest women's fashion.."
        />
    </>
)*/


const SalePage = () => (
    <>
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-4xl font-bold mb-4">Sale</h1>
                <p className="text-gray-600">Amazing deals coming soon...</p>
            </div>
        </div>
    </>
)


const ProductWrapper = () => {
    const { id } = useParams()
    const productId = parseInt(id)

    // To find any product from any array
    const product = tshirtsMenData.find(p => p.id === productId) ||
        productDataWomen.find(p => p.id === productId) ||
        productDetail // Fallback

    return <ProductDetailPage productData={product} />
}


export default App
