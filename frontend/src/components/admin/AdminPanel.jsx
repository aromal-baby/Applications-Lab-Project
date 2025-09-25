import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { adminAPI } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { getImageUrl } from "../../services/api";

const AdminPanel = () => {

    const { user, isAdmin } = useAuth();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [activeTab, setActiveTab] = useState('dashboard');
    const [stats, setStats] = useState({});
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Product form state
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [uploadingImages, setUploadingImages] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [bulkAction, setBulkAction] = useState('');

    const [productForm, setProductForm] = useState({
        name: '',
        price: '',
        originalPrice: '',
        discount: '',
        category: 'men',
        subcategory: '',
        type: '',
        brand: 'LUXE',
        colors: [],
        sizes: [],
        images: [],
        description: '',
        features: [],
        tags: [],
        inStock: true,
        stockCount: 0,
        featured: [],
        rating: 0,
        reviews: 0
    });

    // Filters and search
    const [filters, setFilters] = useState({
        search: '',
        category: '',
        inStock: '',
        featured: ''
    });

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(10);

    // Redirect if not admin
    useEffect(() => {
        if (!isAdmin) {
            navigate('/');
            return;
        }
        loadDashboardData();
    }, [isAdmin, navigate]);

    const loadDashboardData = async () => {
        setLoading(true);
        try {
            const [statsData, productsData] = await Promise.all([
                adminAPI.getStats(),
                adminAPI.getProducts(),
            ]);
            setStats(statsData);
            setProducts(productsData);
        } catch (err) {
            setError('Failed to load dashboard');
            console.error('Dashboard error:', err);
        } finally {
            setLoading(false);
        }
    };

    // To handle image uploads from the panel
    const handleImageUpload = async (files) => {
        if (!files || files.length === 0) return [];

        setUploadingImages(true);
        const uploadedUrls = [];

        try {
            for (let file of files) {
                try {
                    // Use the adminAPI.uploadImage method instead of direct fetch
                    const response = await adminAPI.uploadImage(file);
                    uploadedUrls.push(response.url);
                    console.log('Image uploaded successfully:', response.url);
                } catch (uploadError) {
                    console.error('Upload failed, using placeholder:', uploadError);
                    // Using placeholder image with product name
                    const placeholderUrl = `https://via.placeholder.com/400x600/E5E5E5/9CA3AF?text=${encodeURIComponent(file.name.split('.')[0])}`;
                    uploadedUrls.push(placeholderUrl);
                }
            }
        } catch (error) {
            console.error('General upload error:', error);
            // Fallback to placeholder images for all files
            for (let file of files) {
                const placeholderUrl = `https://via.placeholder.com/400x600/E5E5E5/9CA3AF?text=${encodeURIComponent(file.name.split('.')[0])}`;
                uploadedUrls.push(placeholderUrl);
            }
        } finally {
            setUploadingImages(false);
        }

        return uploadedUrls;
    };


    const handleFileSelect = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            const urls = await handleImageUpload(files);
            setProductForm(prev => ({
                ...prev,
                images: [...prev.images, ...urls]
            }));
        }
    };

    const removeImage = (indexToRemove) => {
        setProductForm(prev => ({
            ...prev,
            images: prev.images.filter((_, index) => index !== indexToRemove)
        }));
    };


    const handleProductSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const productData = {
                ...productForm,
                price: parseFloat(productForm.price),
                originalPrice: productForm.originalPrice ? parseFloat(productForm.originalPrice) : undefined,
                stockCount: parseInt(productForm.stockCount),
                rating: parseFloat(productForm.rating) || 0,
                reviews: parseInt(productForm.reviews) || 0,
                colors: Array.isArray(productForm.colors) ? productForm.colors : productForm.colors.split(',').map(c => c.trim()).filter(c => c),
                sizes: Array.isArray(productForm.sizes) ? productForm.sizes : productForm.sizes.split(',').map(s => s.trim()).filter(s => s),
                features: Array.isArray(productForm.features) ? productForm.features : productForm.features.split(',').map(f => f.trim()).filter(f => f),
                tags: Array.isArray(productForm.tags) ? productForm.tags : productForm.tags.split(',').map(t => t.trim()).filter(t => t),
                featured: Array.isArray(productForm.featured) ? productForm.featured : productForm.featured.split(',').map(f => f.trim()).filter(f => f)
            };

            if (editingProduct) {
                await adminAPI.updateProduct(editingProduct._id, productData);
                setSuccess('Product updated successfully!');
            } else {
                await adminAPI.createProduct(productData);
                setSuccess('Product created successfully!');
            }

            setShowAddForm(false);
            setEditingProduct(null);
            resetForm();
            loadDashboardData();
        } catch (err) {
            setError(`Failed to save product: ${err.message}`);
            console.error('Product save error:', err);
        }
    };


    const handleDeleteProduct = async (productId) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await adminAPI.deleteProduct(productId);
                setSuccess('Product deleted successfully!');
                loadDashboardData();
            } catch (err) {
                setError('Failed to delete product');
                console.error('Delete error:', err);
            }
        }
    };


    const handleBulkAction = async () => {
        if (selectedProducts.length === 0 || !bulkAction) return;

        const confirmMessage = `Are you sure you want to ${bulkAction} ${selectedProducts.length} products?`;
        if (!window.confirm(confirmMessage)) return;

        try {
            switch (bulkAction) {
                case 'delete':
                    await Promise.all(selectedProducts.map(id => adminAPI.deleteProduct(id)));
                    setSuccess(`${selectedProducts.length} products deleted successfully!`);
                    break;
                case 'stock-in':
                    await Promise.all(selectedProducts.map(id =>
                        adminAPI.updateProduct(id, { inStock: true })
                    ));
                    setSuccess(`${selectedProducts.length} products marked as in stock!`);
                    break;
                case 'stock-out':
                    await Promise.all(selectedProducts.map(id =>
                        adminAPI.updateProduct(id, { inStock: false })
                    ));
                    setSuccess(`${selectedProducts.length} products marked as out of stock!`);
                    break;
            }
            setSelectedProducts([]);
            setBulkAction('');
            loadDashboardData();
        } catch (err) {
            setError('Failed to perform bulk action');
            console.error('Bulk action error:', err);
        }
    };


    const handleEditProduct = (product) => {
        setEditingProduct(product);
        setProductForm({
            ...product,
            price: product.price.toString(),
            originalPrice: product.originalPrice.toString() || '',
            stockCount: product.stockCount.toString(),
            rating: product.rating.toString(),
            reviews: product.reviews?.toString(),
            colors: product.colors || [],
            sizes: product.sizes || [],
            features: product.features || [],
            tags: product.tags || [],
            featured: product.featured || [],
        });
        setShowAddForm(true);
    };


    const resetForm = () => {
        setProductForm({
            name: '',
            price: '',
            originalPrice: '',
            discount: '',
            category: 'men',
            subcategory: '',
            type: '',
            brand: 'LUXE',
            colors: [],
            sizes: [],
            images: [],
            description: '',
            features: [],
            tags: [],
            inStock: true,
            stockCount: 0,
            featured: [],
            rating: 0,
            reviews: 0
        });
    };


    const handleArrayInput = (field, value) => {
        const array = typeof value === 'string' ? value.split(',').map(item => item.trim()) : value;
        setProductForm(prev => ({ ...prev, [field]: array }));
    };


    // To filter products based on search and filters
    const filteredProducts = products.filter(product => {
        return (
            (!filters.search || product.name.toLowerCase().includes(filters.search.toLowerCase())) &&
            (!filters.category || product.category === filters.category) &&
            (filters.inStock === '' || product.inStock.toString() === filters.inStock) &&
            (!filters.featured || (product.featured && product.featured.length > 0))
        );
    });


    // Pagination
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    if (!isAdmin) return null;


    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center mt-[70px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading admin panel...</p>
                </div>
            </div>
        );
    }


    return (
        <div className="min-h-screen bg-gray-50 mt-[70px]">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                    <p className="text-gray-600">Welcome back, {user?.name}</p>
                </div>

                {/* Alerts */}
                {error && (
                    <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded flex justify-between items-center">
                        <span>{error}</span>
                        <button onClick={() => setError('')} className="text-red-700 hover:text-red-900">×</button>
                    </div>
                )}
                {success && (
                    <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded flex justify-between items-center">
                        <span>{success}</span>
                        <button onClick={() => setSuccess('')} className="text-green-700 hover:text-green-900">×</button>
                    </div>
                )}

                {/* Tabs */}
                <div className="mb-8">
                    <nav className="flex space-x-8 border-b border-gray-200">
                        {['dashboard', 'products', 'inventory', 'analytics'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                                    activeTab === tab
                                        ? 'border-black text-black'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Dashboard Tab */}
                {activeTab === 'dashboard' && (
                    <div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
                                <div className="flex items-center">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                        </svg>
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-lg font-semibold text-gray-900">Total Products</h3>
                                        <p className="text-3xl font-bold text-blue-600">{stats.totalProducts || 0}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
                                <div className="flex items-center">
                                    <div className="p-2 bg-green-100 rounded-lg">
                                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-lg font-semibold text-gray-900">In Stock</h3>
                                        <p className="text-3xl font-bold text-green-600">{stats.inStockProducts || 0}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
                                <div className="flex items-center">
                                    <div className="p-2 bg-red-100 rounded-lg">
                                        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-lg font-semibold text-gray-900">Out of Stock</h3>
                                        <p className="text-3xl font-bold text-red-600">{stats.outOfStockProducts || 0}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
                                <div className="flex items-center">
                                    <div className="p-2 bg-purple-100 rounded-lg">
                                        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                        </svg>
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-lg font-semibold text-gray-900">Featured</h3>
                                        <p className="text-3xl font-bold text-purple-600">{stats.featuredProducts || 0}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-white rounded-lg shadow">
                            <div className="p-6 border-b border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                            </div>
                            <div className="p-6">
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        <span className="text-sm text-gray-600">New product "Classic White T-Shirt" added</span>
                                        <span className="text-xs text-gray-400">2 hours ago</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                        <span className="text-sm text-gray-600">Inventory updated for 5 products</span>
                                        <span className="text-xs text-gray-400">4 hours ago</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                        <span className="text-sm text-gray-600">Low stock alert for "Denim Jacket"</span>
                                        <span className="text-xs text-gray-400">1 day ago</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Products Tab */}
                {activeTab === 'products' && (
                    <div>
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
                            <h2 className="text-2xl font-bold text-gray-900">Products Management</h2>
                            <button
                                onClick={() => {
                                    setShowAddForm(true);
                                    setEditingProduct(null);
                                    resetForm();
                                }}
                                className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center space-x-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                <span>Add New Product</span>
                            </button>
                        </div>

                        {/* Filters */}
                        <div className="bg-white p-4 rounded-lg shadow mb-6">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={filters.search}
                                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                                    className="border border-gray-300 rounded-lg px-3 py-2"
                                />
                                <select
                                    value={filters.category}
                                    onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                                    className="border border-gray-300 rounded-lg px-3 py-2"
                                >
                                    <option value="">All Categories</option>
                                    <option value="men">Men</option>
                                    <option value="women">Women</option>
                                    <option value="accessories">Accessories</option>
                                </select>
                                <select
                                    value={filters.inStock}
                                    onChange={(e) => setFilters(prev => ({ ...prev, inStock: e.target.value }))}
                                    className="border border-gray-300 rounded-lg px-3 py-2"
                                >
                                    <option value="">All Stock Status</option>
                                    <option value="true">In Stock</option>
                                    <option value="false">Out of Stock</option>
                                </select>
                                <button
                                    onClick={() => setFilters({ search: '', category: '', inStock: '', featured: '' })}
                                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        </div>

                        {/* Bulk Actions */}
                        {selectedProducts.length > 0 && (
                            <div className="bg-blue-50 p-4 rounded-lg mb-6 flex items-center justify-between">
                                <span className="text-blue-800">{selectedProducts.length} products selected</span>
                                <div className="flex items-center space-x-4">
                                    <select
                                        value={bulkAction}
                                        onChange={(e) => setBulkAction(e.target.value)}
                                        className="border border-blue-300 rounded px-3 py-1"
                                    >
                                        <option value="">Select Action</option>
                                        <option value="delete">Delete</option>
                                        <option value="stock-in">Mark In Stock</option>
                                        <option value="stock-out">Mark Out of Stock</option>
                                    </select>
                                    <button
                                        onClick={handleBulkAction}
                                        disabled={!bulkAction}
                                        className="bg-blue-600 text-white px-4 py-1 rounded disabled:bg-gray-400"
                                    >
                                        Apply
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Add/Edit Product Form */}
                        {showAddForm && (
                            <div className="bg-white p-6 rounded-lg shadow mb-6">
                                <h3 className="text-lg font-semibold mb-4">
                                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                                </h3>
                                <form onSubmit={handleProductSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                                            <input
                                                type="text"
                                                value={productForm.name}
                                                onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                                            <input
                                                type="text"
                                                value={productForm.brand}
                                                onChange={(e) => setProductForm(prev => ({ ...prev, brand: e.target.value }))}
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={productForm.price}
                                                onChange={(e) => setProductForm(prev => ({ ...prev, price: e.target.value }))}
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Original Price</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={productForm.originalPrice}
                                                onChange={(e) => setProductForm(prev => ({ ...prev, originalPrice: e.target.value }))}
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                                            <select
                                                value={productForm.category}
                                                onChange={(e) => setProductForm(prev => ({ ...prev, category: e.target.value }))}
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                                required
                                            >
                                                <option value="men">Men</option>
                                                <option value="women">Women</option>
                                                <option value="accessories">Accessories</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Stock Count *</label>
                                            <input
                                                type="number"
                                                value={productForm.stockCount}
                                                onChange={(e) => setProductForm(prev => ({ ...prev, stockCount: e.target.value }))}
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Image Upload Section */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Product Images</label>
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                                            <div className="text-center">
                                                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                <div className="mt-4">
                                                    <button
                                                        type="button"
                                                        onClick={() => fileInputRef.current?.click()}
                                                        className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 disabled:bg-gray-400"
                                                        disabled={uploadingImages}
                                                    >
                                                        {uploadingImages ? 'Uploading...' : 'Choose Images'}
                                                    </button>
                                                    <p className="mt-2 text-sm text-gray-500">PNG, JPG, GIF up to 10MB each</p>
                                                </div>
                                            </div>
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                multiple
                                                accept="image/*"
                                                onChange={handleFileSelect}
                                                className="hidden"
                                            />
                                        </div>

                                        {/* Image Preview */}
                                        {productForm.images.length > 0 && (
                                            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                                                {productForm.images.map((url, index) => (
                                                    <div key={index} className="relative">
                                                        <img
                                                            src={getImageUrl(url)}
                                                            alt={`Product ${index + 1}`}
                                                            className="w-full h-24 object-cover rounded-lg"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => removeImage(index)}
                                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                                                        >
                                                            ×
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Colors (comma separated)</label>
                                            <input
                                                type="text"
                                                value={Array.isArray(productForm.colors) ? productForm.colors.join(', ') : productForm.colors}
                                                onChange={(e) => handleArrayInput('colors', e.target.value)}
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                                placeholder="Red, Blue, Green"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Sizes (comma separated)</label>
                                            <input
                                                type="text"
                                                value={Array.isArray(productForm.sizes) ? productForm.sizes.join(', ') : productForm.sizes}
                                                onChange={(e) => handleArrayInput('sizes', e.target.value)}
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                                placeholder="S, M, L, XL"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Subcategory</label>
                                            <input
                                                type="text"
                                                value={productForm.subcategory}
                                                onChange={(e) => setProductForm(prev => ({ ...prev, subcategory: e.target.value }))}
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                                placeholder="clothing, shoes, accessories"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                            <input
                                                type="text"
                                                value={productForm.type}
                                                onChange={(e) => setProductForm(prev => ({ ...prev, type: e.target.value }))}
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                                placeholder="t-shirt, jeans, sneakers"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                        <textarea
                                            value={productForm.description}
                                            onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                            rows="4"
                                            placeholder="Detailed product description..."
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Features (comma separated)</label>
                                            <input
                                                type="text"
                                                value={Array.isArray(productForm.features) ? productForm.features.join(', ') : productForm.features}
                                                onChange={(e) => handleArrayInput('features', e.target.value)}
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                                placeholder="100% Cotton, Machine Washable"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
                                            <input
                                                type="text"
                                                value={Array.isArray(productForm.tags) ? productForm.tags.join(', ') : productForm.tags}
                                                onChange={(e) => handleArrayInput('tags', e.target.value)}
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                                placeholder="casual, summer, trending"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Featured Collections (comma separated)</label>
                                            <input
                                                type="text"
                                                value={Array.isArray(productForm.featured) ? productForm.featured.join(', ') : productForm.featured}
                                                onChange={(e) => handleArrayInput('featured', e.target.value)}
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                                placeholder="new-arrivals, best-sellers, featured"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Discount Text</label>
                                            <input
                                                type="text"
                                                value={productForm.discount}
                                                onChange={(e) => setProductForm(prev => ({ ...prev, discount: e.target.value }))}
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                                placeholder="25% OFF, SALE"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Rating (0-5)</label>
                                            <input
                                                type="number"
                                                step="0.1"
                                                min="0"
                                                max="5"
                                                value={productForm.rating}
                                                onChange={(e) => setProductForm(prev => ({ ...prev, rating: e.target.value }))}
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Number of Reviews</label>
                                            <input
                                                type="number"
                                                min="0"
                                                value={productForm.reviews}
                                                onChange={(e) => setProductForm(prev => ({ ...prev, reviews: e.target.value }))}
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">In Stock</label>
                                            <select
                                                value={productForm.inStock}
                                                onChange={(e) => setProductForm(prev => ({ ...prev, inStock: e.target.value === 'true' }))}
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                            >
                                                <option value="true">Yes</option>
                                                <option value="false">No</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="flex space-x-4">
                                        <button
                                            type="submit"
                                            className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 flex items-center space-x-2"
                                            disabled={uploadingImages}
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span>{editingProduct ? 'Update Product' : 'Create Product'}</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowAddForm(false);
                                                setEditingProduct(null);
                                                resetForm();
                                            }}
                                            className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* Products List */}
                        <div className="bg-white rounded-lg shadow overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left">
                                            <input
                                                type="checkbox"
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setSelectedProducts(currentProducts.map(p => p._id));
                                                    } else {
                                                        setSelectedProducts([]);
                                                    }
                                                }}
                                                checked={selectedProducts.length === currentProducts.length && currentProducts.length > 0}
                                            />
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Product
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Category
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Price
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Stock
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Rating
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                    {currentProducts.map((product) => (
                                        <tr key={product._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedProducts.includes(product._id)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setSelectedProducts([...selectedProducts, product._id]);
                                                        } else {
                                                            setSelectedProducts(selectedProducts.filter(id => id !== product._id));
                                                        }
                                                    }}
                                                />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="h-12 w-12 flex-shrink-0">
                                                        {product.images && product.images.length > 0 ? (
                                                            <img
                                                                className="h-12 w-12 rounded-lg object-cover"
                                                                src={product.images[0]}
                                                                alt={product.name}
                                                            />
                                                        ) : (
                                                            <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                                                                <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                </svg>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                                        <div className="text-sm text-gray-500">{product.brand}</div>
                                                        {product.featured && product.featured.length > 0 && (
                                                            <div className="flex space-x-1 mt-1">
                                                                {product.featured.slice(0, 2).map((feature, index) => (
                                                                    <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                                                                            {feature}
                                                                        </span>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                        {product.category}
                                                    </span>
                                                {product.type && (
                                                    <div className="text-xs text-gray-500 mt-1">{product.type}</div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900 font-medium">${product.price}</div>
                                                {product.originalPrice && (
                                                    <div className="text-xs text-gray-500 line-through">${product.originalPrice}</div>
                                                )}
                                                {product.discount && (
                                                    <div className="text-xs text-red-600 font-medium">{product.discount}</div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                        product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                    }`}>
                                                        {product.inStock ? `${product.stockCount} in stock` : 'Out of stock'}
                                                    </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex items-center">
                                                        {[...Array(5)].map((_, i) => (
                                                            <svg
                                                                key={i}
                                                                className={`h-4 w-4 ${i < Math.floor(product.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
                                                                fill="currentColor"
                                                                viewBox="0 0 20 20"
                                                            >
                                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                                            </svg>
                                                        ))}
                                                    </div>
                                                    <span className="ml-1 text-xs text-gray-500">({product.reviews || 0})</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleEditProduct(product)}
                                                        className="text-indigo-600 hover:text-indigo-900"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteProduct(product._id)}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
                                    <div className="flex-1 flex justify-between sm:hidden">
                                        <button
                                            onClick={() => setCurrentPage(currentPage - 1)}
                                            disabled={currentPage === 1}
                                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100"
                                        >
                                            Previous
                                        </button>
                                        <button
                                            onClick={() => setCurrentPage(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100"
                                        >
                                            Next
                                        </button>
                                    </div>
                                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                        <div>
                                            <p className="text-sm text-gray-700">
                                                Showing <span className="font-medium">{indexOfFirstProduct + 1}</span> to{' '}
                                                <span className="font-medium">
                                                    {Math.min(indexOfLastProduct, filteredProducts.length)}
                                                </span>{' '}
                                                of <span className="font-medium">{filteredProducts.length}</span> results
                                            </p>
                                        </div>
                                        <div>
                                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                                {[...Array(totalPages)].map((_, index) => (
                                                    <button
                                                        key={index}
                                                        onClick={() => setCurrentPage(index + 1)}
                                                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                            currentPage === index + 1
                                                                ? 'z-10 bg-black border-black text-white'
                                                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                        }`}
                                                    >
                                                        {index + 1}
                                                    </button>
                                                ))}
                                            </nav>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Inventory Tab */}
                {activeTab === 'inventory' && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-900">Inventory Management</h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white p-6 rounded-lg shadow">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Low Stock Alerts</h3>
                                <div className="space-y-3">
                                    {products.filter(p => p.stockCount < 10 && p.inStock).map(product => (
                                        <div key={product._id} className="flex items-center justify-between p-3 bg-yellow-50 rounded">
                                            <div>
                                                <p className="font-medium text-sm">{product.name}</p>
                                                <p className="text-xs text-gray-600">{product.stockCount} remaining</p>
                                            </div>
                                            <button
                                                onClick={() => handleEditProduct(product)}
                                                className="text-yellow-600 hover:text-yellow-800 text-sm"
                                            >
                                                Update
                                            </button>
                                        </div>
                                    ))}
                                    {products.filter(p => p.stockCount < 10 && p.inStock).length === 0 && (
                                        <p className="text-gray-500 text-sm">No low stock items</p>
                                    )}
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-lg shadow">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Out of Stock</h3>
                                <div className="space-y-3">
                                    {products.filter(p => !p.inStock).map(product => (
                                        <div key={product._id} className="flex items-center justify-between p-3 bg-red-50 rounded">
                                            <div>
                                                <p className="font-medium text-sm">{product.name}</p>
                                                <p className="text-xs text-gray-600">{product.category}</p>
                                            </div>
                                            <button
                                                onClick={() => handleEditProduct(product)}
                                                className="text-red-600 hover:text-red-800 text-sm"
                                            >
                                                Restock
                                            </button>
                                        </div>
                                    ))}
                                    {products.filter(p => !p.inStock).length === 0 && (
                                        <p className="text-gray-500 text-sm">All products in stock</p>
                                    )}
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-lg shadow">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                                <div className="space-y-3">
                                    <button
                                        onClick={() => {
                                            setShowAddForm(true);
                                            setEditingProduct(null);
                                            resetForm();
                                        }}
                                        className="w-full bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800"
                                    >
                                        Add New Product
                                    </button>
                                    <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
                                        Export Inventory
                                    </button>
                                    <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700">
                                        Bulk Update Prices
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Analytics Tab */}
                {activeTab === 'analytics' && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-900">Analytics & Reports</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white p-6 rounded-lg shadow">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Distribution</h3>
                                <div className="space-y-3">
                                    {['men', 'women', 'accessories'].map(category => {
                                        const count = products.filter(p => p.category === category).length;
                                        const percentage = products.length > 0 ? (count / products.length * 100).toFixed(1) : 0;
                                        return (
                                            <div key={category} className="flex items-center justify-between">
                                                <span className="capitalize font-medium">{category}</span>
                                                <div className="flex items-center space-x-2">
                                                    <div className="w-20 bg-gray-200 rounded-full h-2">
                                                        <div
                                                            className="bg-blue-600 h-2 rounded-full"
                                                            style={{ width: `${percentage}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className="text-sm text-gray-600">{count} ({percentage}%)</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-lg shadow">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Stock Status</h3>
                                <div className="space-y-4">
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-green-600">
                                            {((stats.inStockProducts / stats.totalProducts) * 100 || 0).toFixed(1)}%
                                        </div>
                                        <div className="text-sm text-gray-600">Products In Stock</div>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-4">
                                        <div
                                            className="bg-green-600 h-4 rounded-full"
                                            style={{ width: `${(stats.inStockProducts / stats.totalProducts) * 100 || 0}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-lg shadow">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Analysis</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span>Average Price:</span>
                                        <span className="font-medium">
                                            ${products.length > 0 ? (products.reduce((sum, p) => sum + p.price, 0) / products.length).toFixed(2) : '0.00'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Highest Price:</span>
                                        <span className="font-medium">
                                            ${products.length > 0 ? Math.max(...products.map(p => p.price)).toFixed(2) : '0.00'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Lowest Price:</span>
                                        <span className="font-medium">
                                            ${products.length > 0 ? Math.min(...products.map(p => p.price)).toFixed(2) : '0.00'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-lg shadow">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Featured Products</h3>
                                <div className="space-y-2">
                                    {products.filter(p => p.featured && p.featured.length > 0).slice(0, 5).map(product => (
                                        <div key={product._id} className="flex items-center justify-between p-2 bg-purple-50 rounded">
                                            <span className="text-sm font-medium">{product.name}</span>
                                            <div className="flex space-x-1">
                                                {product.featured.slice(0, 2).map((feature, index) => (
                                                    <span key={index} className="text-xs bg-purple-200 text-purple-800 px-2 py-1 rounded">
                                                        {feature}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                    {products.filter(p => p.featured && p.featured.length > 0).length === 0 && (
                                        <p className="text-gray-500 text-sm">No featured products</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Reports</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <button className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700">
                                    Export Products CSV
                                </button>
                                <button className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
                                    Export Inventory Report
                                </button>
                                <button className="bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700">
                                    Export Analytics PDF
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminPanel;