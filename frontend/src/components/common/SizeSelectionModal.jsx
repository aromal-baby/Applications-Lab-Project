import React, { useState } from 'react';

const SizeSelectionModal = ({ product, isOpen, onClose, onAddToWishlist }) => {
    const [selectedSize, setSelectedSize] = useState('');

    if (!isOpen) return null;

    const handleSubmit = () => {
        if (!selectedSize) {
            alert('Please select a size');
            return;
        }

        onAddToWishlist(product, selectedSize);
        onClose();
        setSelectedSize('');
    };

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Select Size</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 text-xl"
                    >
                        ×
                    </button>
                </div>

                <div className="mb-4">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                            {product.image ? (
                                <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded" />
                            ) : (
                                <span className="text-2xl">👕</span>
                            )}
                        </div>
                        <div>
                            <h4 className="font-medium">{product.name}</h4>
                            <p className="text-gray-600">€{product.price}</p>
                        </div>
                    </div>

                    {product.sizes && product.sizes.length > 0 && (
                        <div>
                            <h4 className="text-sm font-semibold mb-3">Size</h4>
                            <div className="grid grid-cols-4 gap-2">
                                {product.sizes.map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`py-2 text-sm font-medium border ${
                                            selectedSize === size
                                                ? 'border-black bg-black text-white'
                                                : 'border-gray-300 hover:border-black'
                                        }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={onClose}
                        className="flex-1 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="flex-1 py-2 bg-black text-white rounded hover:bg-gray-800"
                    >
                        Add to Wishlist
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SizeSelectionModal;