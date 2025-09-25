const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

// Sample products from your frontend constants
const sampleProducts = [
    {
        name: "Basic Cotton T-Shirt",
        price: 25,
        originalPrice: 35,
        discount: "29% off",
        category: "men",
        subcategory: "clothing",
        type: "t-shirts",
        brand: "LUXE",
        rating: 4.3,
        reviews: 127,
        colors: ['Black', 'White', 'Gray'],
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        images: ["/images/men/tshirts/basic-tee-1.jpg"],
        description: "Classic cotton t-shirt perfect for everyday wear. Soft, comfortable, and durable.",
        features: ["100% Cotton", "Machine Washable", "Classic Fit"],
        tags: ["basic", "cotton", "casual"],
        inStock: true,
        stockCount: 45,
        featured: ["men"]
    },
    {
        name: "Elegant Summer Dress",
        price: 85,
        originalPrice: 120,
        discount: "29% off",
        category: "women",
        subcategory: "clothing",
        type: "dresses",
        brand: "LUXE",
        rating: 4.8,
        reviews: 94,
        colors: ['Floral', 'Solid Blue', 'Black'],
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        images: ["/images/women/dresses/summer-dress-1.jpg"],
        description: "Beautiful summer dress perfect for warm weather occasions.",
        features: ["Lightweight Fabric", "Flowy Design", "Comfortable Fit"],
        tags: ["dress", "summer", "elegant"],
        inStock: true,
        stockCount: 27,
        featured: ["women", "homepage"]
    },
    {
        name: "Luxury Watch",
        price: 299,
        originalPrice: 450,
        discount: "34% off",
        category: "accessories",
        subcategory: "jewelry",
        type: "watches",
        brand: "LUXE",
        rating: 4.9,
        reviews: 67,
        colors: ['Silver', 'Gold', 'Black'],
        sizes: ['Adjustable'],
        images: ["/images/accessories/watches/luxury-watch-1.jpg"],
        description: "Sophisticated luxury watch combining classic design with modern functionality.",
        features: ["Swiss Movement", "Water Resistant", "Leather Strap"],
        tags: ["watch", "luxury", "timepiece"],
        inStock: true,
        stockCount: 15,
        featured: ["homepage", "accessories"]
    }
];

async function seedDatabase() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Clear existing products
        await Product.deleteMany({});
        console.log('Cleared existing products');

        // Insert sample products
        const createdProducts = await Product.insertMany(sampleProducts);
        console.log(`Inserted ${createdProducts.length} products`);

        console.log('Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

seedDatabase();