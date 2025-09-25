const express = require('express');
const Order = require('../models/Orders');
const { auth } = require('../middleware/auth'); // Import from your existing auth file
const router = express.Router();

// Create new order (called after successful payment)
router.post('/', auth, async (req, res) => {
    try {
        console.log('=== ORDER CREATION DEBUG ===');
        console.log('User:', req.user._id);
        console.log('Request body:', req.body);
        console.log('Content-Type:', req.headers['content-type']);
        console.log('========================');

        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // Check if req.body exists
        if (!req.body) {
            return res.status(400).json({ error: 'Request body is missing' });
        }

        const {
            items,
            totalAmount,
            subtotal,
            shipping,
            paymentIntentId,
            shippingAddress
        } = req.body;

        // Validate required fields
        if (!items || !items.length || !totalAmount || !paymentIntentId) {
            return res.status(400).json({
                error: 'Missing required fields',
                received: { items: !!items, totalAmount, paymentIntentId }
            });
        }

        // Updating stock for each item BEFORE creating the order
        const Product = require('../models/Product');

        for (let item of items) {
            if (item.productId) { // Make sure you pass productId in the order items
                const product = await Product.findById(item.productId);
                if (product) {
                    // Reduce stock count
                    product.stockCount = Math.max(0, product.stockCount - item.quantity);
                    // Mark as out of stock if count reaches 0
                    if (product.stockCount === 0) {
                        product.inStock = false;
                    }
                    await product.save();
                    console.log(`Updated stock for ${product.name}: ${product.stockCount}`);
                }
            }
        }

        // Creating new order object with explicit field mapping
        const orderData = {
            user: req.user._id,
            items: items.map(item => ({
                product: item.productId,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                size: item.size,
                color: item.color,
                image: item.image
            })),
            totalAmount,
            subtotal: subtotal,
            shipping: shipping || 0,
            paymentIntentId,
            shippingAddress: shippingAddress || {
                name: req.user.name,
                email: req.user.email
            }
        };

        console.log('Creating order with data:', orderData);

        const newOrder = new Order(orderData);
        const savedOrder = await newOrder.save();

        console.log('Order created and stock updated:', savedOrder.orderNumber);

        res.status(201).json({
            success: true,
            order: {
                id: savedOrder._id,
                orderNumber: savedOrder.orderNumber,
                totalAmount: savedOrder.totalAmount,
                status: savedOrder.status,
                estimatedDelivery: savedOrder.estimatedDelivery,
                items: savedOrder.items
            }
        });

    } catch (error) {
        console.error('Order creation error:', error);

        // Handle validation errors specifically
        if (error.name === 'ValidationError') {
            const validationErrors = Object.keys(error.errors).map(key => ({
                field: key,
                message: error.errors[key].message
            }));

            return res.status(400).json({
                error: 'Validation failed',
                details: validationErrors
            });
        }

        res.status(500).json({ error: 'Failed to create order', details: error.message });
    }
});


// Get user's orders
router.get('/', auth, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .populate('items.product', 'name image');

        res.json({
            success: true,
            orders: orders.map(order => ({
                id: order._id,
                orderNumber: order.orderNumber,
                totalAmount: order.totalAmount,
                subtotal: order.subtotal,
                shipping: order.shipping,
                status: order.status,
                createdAt: order.createdAt,
                estimatedDelivery: order.estimatedDelivery,
                items: order.items,
                orderTimeline: order.orderTimeline,
                itemCount: order.items.length
            }))
        });

    } catch (error) {
        console.error('Get orders error:', error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});

// Get specific order by ID
router.get('/:id', auth, async (req, res) => {
    try {
        const order = await Order.findOne({
            _id: req.params.id,
            user: req.user._id
        }).populate('items.product', 'name image');

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.json({
            success: true,
            order: {
                id: order._id,
                orderNumber: order.orderNumber,
                totalAmount: order.totalAmount,
                subtotal: order.subtotal,
                shipping: order.shipping,
                status: order.status,
                paymentIntentId: order.paymentIntentId,
                createdAt: order.createdAt,
                estimatedDelivery: order.estimatedDelivery,
                items: order.items,
                orderTimeline: order.orderTimeline,
                shippingAddress: order.shippingAddress
            }
        });

    } catch (error) {
        console.error('Get order error:', error);
        res.status(500).json({ error: 'Failed to fetch order' });
    }
});

// Update order status (for admin or automatic status updates)
router.put('/:id/status', auth, async (req, res) => {
    try {
        const { status } = req.body;

        const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        const order = await Order.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        order.status = status;
        await order.save();

        res.json({
            success: true,
            message: 'Order status updated',
            status: order.status,
            orderTimeline: order.orderTimeline
        });

    } catch (error) {
        console.error('Update order status error:', error);
        res.status(500).json({ error: 'Failed to update order status' });
    }
});

// Simulate order progression (for demo purposes)
router.post('/:id/simulate-progress', auth, async (req, res) => {
    try {
        const order = await Order.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // Progress order status
        const statusFlow = ['confirmed', 'processing', 'shipped', 'delivered'];
        const currentIndex = statusFlow.indexOf(order.status);

        if (currentIndex < statusFlow.length - 1) {
            order.status = statusFlow[currentIndex + 1];

            // Add tracking number when shipped
            if (order.status === 'shipped') {
                order.orderTimeline.shipped.trackingNumber = `TRK${Date.now().toString().slice(-8)}`;
            }

            await order.save();
        }

        res.json({
            success: true,
            message: 'Order status progressed',
            status: order.status,
            orderTimeline: order.orderTimeline
        });

    } catch (error) {
        console.error('Simulate progress error:', error);
        res.status(500).json({ error: 'Failed to progress order' });
    }
});

module.exports = router;