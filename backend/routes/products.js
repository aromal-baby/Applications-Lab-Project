const express = require('express');
const Product = require('../models/Product');
const router = express.Router();

// Get all products with optional filtering
router.get('/', async (req, res) => {
    try {
        const { category, subcategory, type, featured, search, limit, skip } = req.query;

        // Building filter object
        let filter = {};

        if (category) {
            filter.category = category;
        }

        if (subcategory) {
            filter.subcategory = subcategory;
        }

        if (type) {
            filter.type = type;
        }

        if (featured) {
            filter.featured = { $in: [featured] };
        }

        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { tags: { $in: [new RegExp(search, 'i')] } }
            ];
        }

        // Executing queries with optional pagination
        let query = Product.find(filter);

        if (skip) {
            query = query.skip(parseInt(skip));
        }

        if (limit) {
            query = query.limit(parseInt(limit));
        }

        const products = await query.sort({ createdAt: -1 });

        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Getting product by ID
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Searching products
router.get('/search', async (req, res) => {
    try {
        const { q, category, limit = 20 } = req.query;

        if (!q) {
            return res.status(400).json({ message: 'Search query is required' });
        }

        let filter = {
            $or: [
                { name: { $regex: q, $options: 'i' } },
                { description: { $regex: q, $options: 'i' } },
                { tags: { $in: [new RegExp(q, 'i')] } },
                { brand: { $regex: q, $options: 'i' } }
            ]
        };

        if (category) {
            filter.category = category;
        }

        const products = await Product.find(filter)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });

        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;