const API_BASE_URL =  'http://localhost:5000/api';

// Getting the auth token from the localStorage mount
const getAuthToken = () => {
    const user = localStorage.getItem('luxe_user');
    if (user) {
        const userData = JSON.parse(user);
        return userData.token;
    }
    return null;
};

// API request helper
const apiRequest = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = getAuthToken();

    const config = {
        headers: {
            'content-type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options.headers,
        },
        ...options,
    };

    const response = await fetch(url, config);

    if (!response.ok) {
        // Try to parse the error message from response
        let errorMessage;
        try {
            const errorData = await response.json();
            errorMessage = errorData.message || `API Error: ${response.status}`;
        } catch (parseError) {
            errorMessage = `API Error: ${response.status}`;
        }
        throw new Error(errorMessage);
    }

    return response.json();
};

// Helper for file/image uploads
const apiRequestFile = async (endpoint, formData) => {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = getAuthToken();

    const config = {
        method: 'POST',
        headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
            // Not setting Content-Type for FormData, let browser set it with boundary
        },
        body: formData,
    };

    const response = await fetch(url, config);

    if (!response.ok) {
        let errorMessage;
        try {
            const errorData = await response.json();
            errorMessage = errorData.message || `Upload Error: ${response.status}`;
        } catch (parseError) {
            errorMessage = `Upload Error: ${response.status}`;
        }
        throw new Error(errorMessage);
    }

    return response.json();
};

// Auth API
export const authAPI = {
    register: (userdata) => apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userdata),
    }),

    login: (credentials) => apiRequest(`/auth/login`, {
        method: 'POST',
        body: JSON.stringify(credentials),
    }),

    getCurrentUser: () => apiRequest('/auth/me'),
};

// User API
export const userAPI = {
    getProfile: () => apiRequest('/users/profile'),

    updateProfile: (profileData) => apiRequest('/users/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData),
    }),

    changePassword: (passwordData) => apiRequest(`/users/change-password`, {
        method: 'PUT',
        body: JSON.stringify(passwordData),
    }),

    // Address management
    getAddresses: () => apiRequest('/users/addresses'),

    addAddress: (addressData) => apiRequest('/users/addresses', {
        method: 'POST',
        body: JSON.stringify(addressData),
    }),

    updateAddress: (addressId, addressData) => apiRequest(`/users/addresses/${addressId}`, {
        method: 'PUT',
        body: JSON.stringify(addressData),
    }),

    deleteAddress: (addressId) => apiRequest(`/users/addresses/${addressId}`, {
        method: 'DELETE',
    }),

    setDefaultAddress: (addressId) => apiRequest(`/users/addresses/${addressId}/default`, {
        method: 'PUT',
    }),
}

// Products API
export const productsAPI = {
    getAll: () => apiRequest('/products'),
    getById: (id) => apiRequest(`/products/${id}`),
    getFeatured: (section) => apiRequest(`/products?featured=${section}`),
    search: (query) => apiRequest(`/products/search?q=${encodeURIComponent(query)}`),

    // New method for category filtering
    getByCategory: (category) => apiRequest(`/products?category=${category}`),

    // Method for subcategory filtering
    getBySubcategory: (category, subcategory) =>
        apiRequest(`/products?category=${category}&subcategory=${subcategory}`),

    // Method for type filtering
    getByType: (category, type) =>
        apiRequest(`/products?category=${category}&type=${type}`),

    // Combined filtering
    getFiltered: (filters) => {
        const params = new URLSearchParams()
        Object.entries(filters).forEach(([key, value]) => {
            if (value) params.append(key, value)
        })
        return apiRequest(`/products?${params.toString()}`)
    }
}

// admin API
export const adminAPI = {
    // Dashboard stats
    getStats: () => apiRequest(`/admin/stats`),

    // Product management
    getProducts: () => apiRequest(`/admin/products`),

    createProduct: (productData) => apiRequest('/admin/products', {
        method: 'POST',
        body: JSON.stringify(productData),
    }),

    updateProduct: (id, productData) => apiRequest(`/admin/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(productData),
    }),

    deleteProduct: (id) => apiRequest(`/admin/products/${id}`, {
        method: 'DELETE',
    }),

    // Bulk operations
    bulkUpdateProducts: (productIds, updateData) => apiRequest('/admin/products/bulk', {
        method: 'PUT',
        body: JSON.stringify({ productIds, updateData }),
    }),

    bulkDeleteProducts: (productIds) => apiRequest('/admin/products/bulk', {
        method: 'DELETE',
        body: JSON.stringify({ productIds }),
    }),

    // Image upload - FIXED: Use apiRequestFile instead of direct fetch
    uploadImage: async (file) => {
        const formData = new FormData();
        formData.append('image', file);
        return apiRequestFile('/admin/upload/image', formData);
    },

    uploadImages: async (files) => {
        const formData = new FormData();
        files.forEach(file => {
            formData.append('images', file);
        });
        return apiRequestFile('/admin/upload/images', formData);
    },


    deleteImage: (filename) => apiRequest(`/admin/upload/image/${filename}`, {
        method: 'DELETE',
    }),

    // Analytics
    getAnalytics: () => apiRequest('/admin/analytics'),

    // Inventory management
    getLowStockProducts: () => apiRequest('/admin/inventory/low-stock'),
    updateInventory: (productId, stockData) => apiRequest(`/admin/inventory/${productId}`, {
        method: 'PUT',
        body: JSON.stringify(stockData),
    }),

    // Export functions
    exportProducts: () => {
        const token = getAuthToken();
        const url = `${API_BASE_URL}/admin/export/products`;

        // For file downloads, we need to handle differently
        return fetch(url, {
            headers: {
                ...(token && { Authorization: `Bearer ${token}` }),
            }
        }).then(response => {
            if (!response.ok) throw new Error('Export failed');
            return response.blob();
        });
    },

    exportInventory: () => {
        const token = getAuthToken();
        const url = `${API_BASE_URL}/admin/export/inventory`;

        return fetch(url, {
            headers: {
                ...(token && { Authorization: `Bearer ${token}` }),
            }
        }).then(response => {
            if (!response.ok) throw new Error('Export failed');
            return response.blob();
        });
    },
};


// Orders API
export const ordersAPI = {
    createOrder: (orderData, options = {}) => apiRequest('/orders', {
        method: 'POST',
        body: JSON.stringify(orderData)
    }),
    getOrders: () => apiRequest('/orders'),
    getOrderById: (id) => apiRequest(`/orders/${id}`),
    updateOrderStatus: (id, status) => apiRequest(`/orders/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
    }),
    simulateProgress: (id) => apiRequest(`/orders/${id}/simulate-progress`, {
        method: 'POST',
    }),
};


// Cart API (for future implementation)
export const cartAPI = {
    getCart: () => apiRequest('/cart'),
    addToCart: (productId, quantity, options) => apiRequest('/cart/add', {
        method: 'POST',
        body: JSON.stringify({ productId, quantity, options }),
    }),
    updateCartItem: (itemId, quantity) => apiRequest(`/cart/item/${itemId}`, {
        method: 'PUT',
        body: JSON.stringify({ quantity }),
    }),
    removeFromCart: (itemId) => apiRequest(`/cart/item/${itemId}`, {
        method: 'DELETE',
    }),
    clearCart: () => apiRequest('/cart', {
        method: 'DELETE',
    }),
};

// Wishlist API (for future implementation)
export const wishlistAPI = {
    getWishlist: () => apiRequest('/wishlist'),
    addToWishlist: (productId) => apiRequest('/wishlist/add', {
        method: 'POST',
        body: JSON.stringify({ productId }),
    }),
    removeFromWishlist: (productId) => apiRequest(`/wishlist/remove/${productId}`, {
        method: 'DELETE',
    }),
};

// Utility function to generate image URL
// services/api.js
export const getImageUrl = (p) => {
    if (!p) return '';
    if (/^https?:\/\//i.test(p)) return p;

    // remove an accidentally inlined host
    const cleaned = p.replace(/^http:\/\/localhost:5000/i, '');

    // already correct
    if (cleaned.startsWith('/uploads/')) return `http://localhost:5000${cleaned}`;
    if (cleaned.startsWith('uploads/'))   return `http://localhost:5000/${cleaned}`;

    // came from /images/... or just "file.jpg" → force /uploads/<filename>
    const file = cleaned.split('/').pop();
    return `http://localhost:5000/uploads/${file}`;
};


// Error handling utility
export const handleApiError = (error) => {
    console.error('API Error:', error);

    if (error.message.includes('401')) {
        // Unauthorized - redirect to login
        localStorage.removeItem('luxe_user');
        window.location.href = '/login';
        return;
    }

    if (error.message.includes('403')) {
        // Forbidden - insufficient permissions
        return 'You do not have permission to perform this action.';
    }

    if (error.message.includes('404')) {
        return 'The requested resource was not found.';
    }

    if (error.message.includes('500')) {
        return 'Server error. Please try again later.';
    }

    return error.message || 'An unexpected error occurred.';
};

