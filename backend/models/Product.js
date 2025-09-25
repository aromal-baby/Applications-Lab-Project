const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    originalPrice: Number,
    discount: String,
    category: {
        type: String,
        required: true,
        enum: ['men', 'women', 'accessories']
    },
    subcategory: String,
    type: String,
    brand: {
        type: String,
        default: 'LUXE'
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },
    reviews: {
        type: Number,
        default: 0
    },
    colors: [String],
    sizes: [String],
    images: [String],
    description: String,
    features: [String],
    tags: [String],
    inStock: {
        type: Boolean,
        default: true
    },
    stockCount: {
        type: Number,
        default: 0
    },
    featured: [String]
}, {
    timestamps: true
});

module.exports = mongoose.model('Product', productSchema);