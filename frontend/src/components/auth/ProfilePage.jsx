import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate, useLocation } from 'react-router-dom'
import {ordersAPI, userAPI} from '../../services/api'

const ProfilePage = () => {
    const { user, logout, setUser } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const [isEditing, setIsEditing] = useState(false)
    const [orders, setOrders] = useState([])
    const [loadingOrders, setLoadingOrders] = useState(false)
    const [ordersError, setOrdersError] = useState(null)

    // Profile form data
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        address: user?.address || ''
    })

    // Password change states
    const [showPasswordModal, setShowPasswordModal] = useState(false)
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    })
    const [passwordLoading, setPasswordLoading] = useState(false)
    const [passwordError, setPasswordError] = useState('')
    const [passwordSuccess, setPasswordSuccess] = useState('')


    // Address management states
    const [addresses, setAddresses] = useState([])
    const [showAddressModal, setShowAddressModal] = useState(false)
    const [editingAddress, setEditingAddress] = useState(null)
    const [addressData, setAddressData] = useState({
        title: '',
        fullName: '',
        phone: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        isDefault: false
    })
    const [addressLoading, setAddressLoading] = useState(false)
    const [addressError, setAddressError] = useState('')


    // For navigation purpose
    const getInitialTab = () => {
        const params = new URLSearchParams(location.search);
        return params.get('tab') || 'profile';
    };

    const [activeTab, setActiveTab] = useState(getInitialTab());

    // keep in sync if URL changes (e.g., user navigates back/forward)
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const tab = params.get('tab') || 'profile';
        setActiveTab(tab);
    }, [location.search]);

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    const handleSave = async () => {
        // Update user profile logic
        try {
            const response = await userAPI.updateProfile({
                name: formData.name,
                phone: formData.phone,
            })
            if (response.success) {
                // Updating the user in context and local storage
                const updatedUser = {
                    ...user,
                    ...response.data,
                }
                setUser(updatedUser)
                localStorage.setItem('user', JSON.stringify(updatedUser))
                setIsEditing(false)
            }
        } catch (error) {
            console.error('Profile update error:', error)
            alert('Failed to update profile: ' + error.message)
        }
    }


    // Password change handlers
    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setPasswordError('')
        setPasswordSuccess('')

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordError('New passwords do not match')
            return
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordError('New passwords do not match')
            return
        }

        setPasswordLoading(true)
        try {
            const response = await userAPI.changePassword({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword,
            })

            if (response.success) {
                setPasswordSuccess('Password changed successfully!')
                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
                setTimeout(() => {
                    setShowPasswordModal(false)
                    setPasswordSuccess('')
                }, 2000)
            }
        } catch (error) {
            setPasswordError(error.message)
        } finally {
            setPasswordLoading(false)
        }
    }


    const resetAddressForm = () => {
        setAddressData({
            title: '',
            fullName: '',
            phone: '',
            addressLine1: '',
            addressLine2: '',
            city: '',
            state: '',
            zipCode: '',
            country: '',
            isDefault: false
        })
        setEditingAddress(null)
        setAddressError('')
    }

    const handleAddressSubmit = async (e) => {
        e.preventDefault()
        setAddressError('')
        setAddressLoading(true)

        try {
            let response
            if (editingAddress) {
                response = await userAPI.updateAddress(editingAddress.id, addressData)
            } else {
                response = await userAPI.addAddress(addressData)
            }

            if (response.success) {
                await fetchAddresses()
                setShowAddressModal(false)
                resetAddressForm()
            }
        } catch (error) {
            setAddressError(error.message)
        } finally {
            setAddressLoading(false)
        }
    }

    const handleEditAddress = (address) => {
        setEditingAddress(address)
        setAddressData({ ...address })
        setShowAddressModal(true)
    }

    const handleDeleteAddress = async (addressId) => {
        if (window.confirm('Are you sure you want to delete this address?')) {
            try {
                const response = await userAPI.deleteAddress(addressId)
                if (response.success) {
                    await fetchAddresses()
                }
            } catch (error) {
                alert('Failed to delete address: ' + error.message)
            }
        }
    }

    const handleSetDefaultAddress = async (addressId) => {
        try {
            const response = await userAPI.setDefaultAddress(addressId)
            if (response.success) {
                await fetchAddresses()
            }
        } catch (error) {
            alert('Failed to set default address: ' + error.message)
        }
    }


    // Fetch orders when the order's tab is active
    useEffect(() => {
        if (activeTab === 'orders') {
            fetchOrders()
        }
    }, [activeTab])

    const fetchOrders = async () => {
        setLoadingOrders(true)
        setOrdersError(null)
        try {
            const response = await ordersAPI.getOrders()
            console.log('Orders fetched:', response)
            if (response.success) {
                setOrders(response.orders)
            }
        } catch (error) {
            console.error('Failed to fetch orders:', error)
            setOrdersError('Failed to load orders')
        } finally {
            setLoadingOrders(false)
        }
    }

    // Add this useEffect after the orders useEffect
    useEffect(() => {
        if (activeTab === 'addresses') {
            fetchAddresses()
        }
    }, [activeTab])


    // Address management handlers
    const fetchAddresses = async () => {
        try {
            const response = await userAPI.getAddresses()
            if (response.success) {
                setAddresses(response.addresses)
            }
        } catch (error) {
            console.error('Failed to fetch addresses:', error)
        }
    }


    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800',
            confirmed: 'bg-blue-100 text-blue-800',
            processing: 'bg-orange-100 text-orange-800',
            shipped: 'bg-purple-100 text-purple-800',
            delivered: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800'
        }
        return colors[status] || 'bg-gray-100 text-gray-800'
    }

    const viewOrderDetails = (orderId) => {
        navigate(`/orders/${orderId}`)
    }

    const tabs = [
        { id: 'profile', name: 'Profile', icon: '👤' },
        { id: 'orders', name: 'Orders', icon: '📦' },
        { id: 'addresses', name: 'Addresses', icon: '📍' },
        { id: 'security', name: 'Security', icon: '🔒' }
    ]

    return (
        <div className="min-h-screen bg-gray-50 mt-[140px]">
            <div className="max-w-4xl mx-auto px-8 py-8">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-2xl">
                                👤
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">{user?.name}</h1>
                                <p className="text-gray-600">{user?.email}</p>
                                <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                    {user?.role === 'admin' ? 'Administrator' : 'Customer'}
                                </span>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Sign out
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <nav className="bg-white rounded-lg shadow-sm p-4">
                            <ul className="space-y-2">
                                {tabs.map((tab) => (
                                    <li key={tab.id}>
                                        <button
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`w-full flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                                                activeTab === tab.id
                                                    ? 'bg-black text-white'
                                                    : 'text-gray-700 hover:bg-gray-100'
                                            }`}
                                        >
                                            <span>{tab.icon}</span>
                                            <span>{tab.name}</span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>

                    {/* Content */}
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            {activeTab === 'profile' && (
                                <div>
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-xl font-bold">Profile Information</h2>
                                        {!isEditing ? (
                                            <button
                                                onClick={() => setIsEditing(true)}
                                                className="px-4 py-2 bg-black text-white rounded-md text-sm font-medium hover:bg-gray-800"
                                            >
                                                Edit Profile
                                            </button>
                                        ) : (
                                            <div className="space-x-2">
                                                <button
                                                    onClick={() => setIsEditing(false)}
                                                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={handleSave}
                                                    className="px-4 py-2 bg-black text-white rounded-md text-sm font-medium hover:bg-gray-800"
                                                >
                                                    Save
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                                                />
                                            ) : (
                                                <p className="text-gray-900">{user?.name}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                            <p className="text-gray-900">{user?.email}</p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                            {isEditing ? (
                                                <input
                                                    type="tel"
                                                    value={formData.phone}
                                                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                                                />
                                            ) : (
                                                <p className="text-gray-900">{user?.phone || 'Not provided'}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'orders' && (
                                <div>
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-xl font-bold">Order History</h2>
                                        <button
                                            onClick={fetchOrders}
                                            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                                        >
                                            Refresh
                                        </button>
                                    </div>

                                    {loadingOrders ? (
                                        <div className="text-center py-8">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                                            <p className="mt-2 text-gray-600">Loading orders...</p>
                                        </div>
                                    ) : ordersError ? (
                                        <div className="text-center py-8">
                                            <p className="text-red-600 mb-2">{ordersError}</p>
                                            <button
                                                onClick={fetchOrders}
                                                className="px-4 py-2 bg-black text-white rounded-md text-sm font-medium hover:bg-gray-800"
                                            >
                                                Try Again
                                            </button>
                                        </div>
                                    ) : orders.length === 0 ? (
                                        <div className="text-center py-8">
                                            <div className="text-4xl mb-4">📦</div>
                                            <p className="text-gray-500 mb-2">No orders yet</p>
                                            <p className="text-sm text-gray-400 mb-4">When you place orders, they'll appear here</p>
                                            <button
                                                onClick={() => navigate('/products')}
                                                className="px-4 py-2 bg-black text-white rounded-md text-sm font-medium hover:bg-gray-800"
                                            >
                                                Start Shopping
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {orders.map((order) => (
                                                <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div>
                                                            <h3 className="font-medium">Order #{order.orderNumber}</h3>
                                                            <p className="text-sm text-gray-600">Placed on {formatDate(order.createdAt)}</p>
                                                            {order.estimatedDelivery && (
                                                                <p className="text-sm text-gray-600">
                                                                    Est. delivery: {formatDate(order.estimatedDelivery)}
                                                                </p>
                                                            )}
                                                        </div>
                                                        <span className={`px-2 py-1 text-xs rounded capitalize ${getStatusColor(order.status)}`}>
                                                            {order.status}
                                                        </span>
                                                    </div>

                                                    <div className="mb-3">
                                                        <p className="text-sm text-gray-600">
                                                            {order.itemCount || order.items?.length} {(order.itemCount || order.items?.length) === 1 ? 'item' : 'items'} • €{order.totalAmount.toFixed(2)}
                                                        </p>

                                                        {/* Show first few items */}
                                                        {order.items && order.items.length > 0 && (
                                                            <div className="mt-2">
                                                                <div className="flex flex-wrap gap-2">
                                                                    {order.items.slice(0, 3).map((item, index) => (
                                                                        <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">
                                                                            {item.name} x{item.quantity}
                                                                        </span>
                                                                    ))}
                                                                    {order.items.length > 3 && (
                                                                        <span className="text-xs text-gray-500">
                                                                            +{order.items.length - 3} more
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => viewOrderDetails(order.id)}
                                                            className="text-sm text-black hover:underline"
                                                        >
                                                            View Details
                                                        </button>
                                                        {order.status === 'delivered' && (
                                                            <button className="text-sm text-black hover:underline">
                                                                Reorder
                                                            </button>
                                                        )}
                                                        {order.status === 'shipped' && order.orderTimeline?.shipped?.trackingNumber && (
                                                            <button className="text-sm text-blue-600 hover:underline">
                                                                Track Package
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'addresses' && (
                                <div>
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-xl font-bold">Shipping Addresses</h2>
                                        <button
                                            onClick={() => {
                                                resetAddressForm();
                                                setShowAddressModal(true);
                                            }}
                                            className="px-4 py-2 bg-black text-white rounded-md text-sm font-medium hover:bg-gray-800"
                                        >
                                            Add Address
                                        </button>
                                    </div>

                                    {addresses.length === 0 ? (
                                        <div className="text-center py-8">
                                            <div className="text-4xl mb-4">📍</div>
                                            <p className="text-gray-500">No addresses saved yet</p>
                                            <p className="text-sm text-gray-400 mt-2">Add an address to speed up checkout</p>
                                        </div>
                                    ) : (
                                        <div className="grid gap-4">
                                            {addresses.map((address) => (
                                                <div key={address.id} className="border border-gray-200 rounded-lg p-4 relative">
                                                    {address.isDefault && (
                                                        <span className="absolute top-2 right-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                                                            Default
                                                        </span>
                                                    )}
                                                    <div className="mb-2">
                                                        <h3 className="font-medium">{address.title}</h3>
                                                        <p className="text-sm text-gray-600">{address.fullName}</p>
                                                    </div>
                                                    <div className="text-sm text-gray-600 mb-3">
                                                        <p>{address.addressLine1}</p>
                                                        {address.addressLine2 && <p>{address.addressLine2}</p>}
                                                        <p>{address.city}, {address.state} {address.zipCode}</p>
                                                        <p>{address.country}</p>
                                                        <p>Phone: {address.phone}</p>
                                                    </div>
                                                    <div className="flex space-x-2 text-sm">
                                                        <button
                                                            onClick={() => handleEditAddress(address)}
                                                            className="text-black hover:underline"
                                                        >
                                                            Edit
                                                        </button>
                                                        {!address.isDefault && (
                                                            <button
                                                                onClick={() => handleSetDefaultAddress(address.id)}
                                                                className="text-blue-600 hover:underline"
                                                            >
                                                                Set as Default
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => handleDeleteAddress(address.id)}
                                                            className="text-red-600 hover:underline"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'security' && (
                                <div>
                                    <h2 className="text-xl font-bold mb-6">Security Settings</h2>
                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-lg font-medium mb-2">Password</h3>
                                            <p className="text-gray-600 mb-4">Change your password to keep your account secure</p>
                                            <button
                                                onClick={() => setShowPasswordModal(true)}
                                                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                                            >
                                                Change Password
                                            </button>
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-medium mb-2">Two-Factor Authentication</h3>
                                            <p className="text-gray-600 mb-4">Add an extra layer of security to your account</p>
                                            <button className="px-4 py-2 bg-black text-white rounded-md text-sm font-medium hover:bg-gray-800">
                                                Enable 2FA
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Password Change Modal */}
            {showPasswordModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-lg font-bold mb-4">Change Password</h3>

                        {passwordError && (
                            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                                {passwordError}
                            </div>
                        )}

                        {passwordSuccess && (
                            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                                {passwordSuccess}
                            </div>
                        )}

                        <form onSubmit={handlePasswordSubmit}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Current Password
                                    </label>
                                    <input
                                        type="password"
                                        required
                                        value={passwordData.currentPassword}
                                        onChange={(e) => setPasswordData({
                                            ...passwordData,
                                            currentPassword: e.target.value
                                        })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        New Password
                                    </label>
                                    <input
                                        type="password"
                                        required
                                        minLength="6"
                                        value={passwordData.newPassword}
                                        onChange={(e) => setPasswordData({
                                            ...passwordData,
                                            newPassword: e.target.value
                                        })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Confirm New Password
                                    </label>
                                    <input
                                        type="password"
                                        required
                                        value={passwordData.confirmPassword}
                                        onChange={(e) => setPasswordData({
                                            ...passwordData,
                                            confirmPassword: e.target.value
                                        })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                                    />
                                </div>
                            </div>

                            <div className="flex space-x-2 mt-6">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowPasswordModal(false);
                                        setPasswordData({
                                            currentPassword: '',
                                            newPassword: '',
                                            confirmPassword: ''
                                        });
                                        setPasswordError('');
                                        setPasswordSuccess('');
                                    }}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={passwordLoading}
                                    className="flex-1 px-4 py-2 bg-black text-white rounded-md text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
                                >
                                    {passwordLoading ? 'Changing...' : 'Change Password'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Address Modal */}
            {showAddressModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <h3 className="text-lg font-bold mb-4">
                            {editingAddress ? 'Edit Address' : 'Add New Address'}
                        </h3>

                        {addressError && (
                            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                                {addressError}
                            </div>
                        )}

                        <form onSubmit={handleAddressSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Address Title *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g., Home, Office"
                                        value={addressData.title}
                                        onChange={(e) => setAddressData({
                                            ...addressData,
                                            title: e.target.value
                                        })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={addressData.fullName}
                                        onChange={(e) => setAddressData({
                                            ...addressData,
                                            fullName: e.target.value
                                        })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Phone *
                                    </label>
                                    <input
                                        type="tel"
                                        required
                                        value={addressData.phone}
                                        onChange={(e) => setAddressData({
                                            ...addressData,
                                            phone: e.target.value
                                        })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Address Line 1 *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={addressData.addressLine1}
                                        onChange={(e) => setAddressData({
                                            ...addressData,
                                            addressLine1: e.target.value
                                        })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Address Line 2
                                    </label>
                                    <input
                                        type="text"
                                        value={addressData.addressLine2}
                                        onChange={(e) => setAddressData({
                                            ...addressData,
                                            addressLine2: e.target.value
                                        })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        City *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={addressData.city}
                                        onChange={(e) => setAddressData({
                                            ...addressData,
                                            city: e.target.value
                                        })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        State *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={addressData.state}
                                        onChange={(e) => setAddressData({
                                            ...addressData,
                                            state: e.target.value
                                        })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        ZIP Code *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={addressData.zipCode}
                                        onChange={(e) => setAddressData({
                                            ...addressData,
                                            zipCode: e.target.value
                                        })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Country *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={addressData.country}
                                        onChange={(e) => setAddressData({
                                            ...addressData,
                                            country: e.target.value
                                        })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={addressData.isDefault}
                                            onChange={(e) => setAddressData({
                                                ...addressData,
                                                isDefault: e.target.checked
                                            })}
                                            className="mr-2"
                                        />
                                        <span className="text-sm text-gray-700">Set as default address</span>
                                    </label>
                                </div>
                            </div>

                            <div className="flex space-x-2 mt-6">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowAddressModal(false);
                                        resetAddressForm();
                                    }}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={addressLoading}
                                    className="flex-1 px-4 py-2 bg-black text-white rounded-md text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
                                >
                                    {addressLoading ? 'Saving...' : editingAddress ? 'Update Address' : 'Add Address'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ProfilePage