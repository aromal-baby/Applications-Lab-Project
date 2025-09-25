const express = require("express");
const Product = require("../models/Product");
const { auth, adminAuth } = require("../middleware/auth");
const router = express.Router();

// Applying the auth middleware to all admin routes
router.use(auth);
router.use(adminAuth);


// To create new Product.     -- C
router.post('/products', async (req, res) => {
    try {
        const product = new Product(req.body);
        const savedProduct = await product.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


// Getting all products (More details 'cause of the admin view).    --R
router.get('/products', async (req, res) => {
    try {
        const products = await  Product.find().sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});


// Updating the product.     --U
router.put('/products/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).json({ mesage: 'Product not found' });
        }

        res.json(product);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
})


// Deleting the Product.    --D
router.delete('/products/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json({ mesage: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// To Get the dashboard statistics
router.get('/stats', async (req, res) => {
    try {
        const totalProducts = await Product.countDocuments();
        const inStockProducts = await Product.countDocuments({ inStock: true });
        const outOfStockProducts = await Product.countDocuments({ inStock: false });
        const featuredProducts = await Product.countDocuments({ featured: { $exists: true, $ne: [] } });

        res.json({
            totalProducts,
            inStockProducts,
            outOfStockProducts,
            featuredProducts
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;