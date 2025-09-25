import React, { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../services/api.js";

const AuthContext = createContext()

export const useAuth = () => {
    const context = useContext(AuthContext)
    if(!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    // Initializing auth state from localStorage
    useEffect(() => {
        const savedUser = localStorage.getItem('luxe_user')
        if (savedUser) {
            setUser(JSON.parse(savedUser))
        }
        setLoading(false)
    },[]);


    // Login context with backend
    const login = async (credentials) => {
        try {
            const response = await authAPI.login(credentials);
            const userData = { ...response.user, token: response.token };

            setUser(userData);
            localStorage.setItem('luxe_user', JSON.stringify(userData));

            return { success: true };
        } catch (error) {
            console.error('Login error:', error);
            throw new Error(error.message || 'Login failed');
        }
    };


    // Signup
    const signUp = async (userData) => {
        try {
            const response = await authAPI.register(userData);
            const newUser = { ...response.user, token: response.token };

            setUser(newUser);
            localStorage.setItem('luxe_user', JSON.stringify(newUser));

            return { success: true, user: newUser };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }


    // Logout
    const logout = () => {
        setUser(null)
        localStorage.removeItem('luxe_user')
        localStorage.removeItem('luxe_cart')
        localStorage.removeItem('luxe_wishlist')
    }

    // Updating user data
    const updateUser = async (userData) => {
        const newUserData = { ...user, ...userData }
        setUser(newUserData)
        localStorage.setItem('luxe_user', JSON.stringify(newUserData));
    }


    const value = {
        user,
        setUser,
        login,
        logout,
        signUp,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}