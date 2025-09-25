const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: false
    },

    name: {
        type: String,
        required: true
    },

    price: {
        type: Number,
        required: true
    },

    quantity: {
        type: Number,
        required: true,
        min: 1
    },

    size: String,
    color: String,
    image: String
});

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    orderNumber: {
        type: String,
        unique: true,
        required: false // Make it not required since we generate it in pre-save
    },

    items: [orderItemSchema],

    totalAmount: {
        type: Number,
        required: true,
        min: 0
    },

    subtotal: {
        type: Number,
        required: true,
        min: 0
    },

    shipping: {
        type: Number,
        default: 0
    },

    status: {
        type: String,
        enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'confirmed'
    },

    paymentIntentId: {
        type: String,
        required: true
    },

    paymentStatus: {
        type: String,
        enum: ['pending', 'succeeded', 'failed'],
        default: 'succeeded'
    },

    shippingAddress: {
        name: String,
        email: String,
        address: String,
        city: String,
        postalCode: String,
        country: String
    },

    orderTimeline: {
        ordered: {
            date: { type: Date, default: Date.now },
            status: { type: String, default: 'Order placed successfully' }
        },
        confirmed: {
            date: Date,
            status: String
        },
        processing: {
            date: Date,
            status: String
        },
        shipped: {
            date: Date,
            status: String,
            trackingNumber: String
        },
        delivered: {
            date: Date,
            status: String
        }
    },

    estimatedDelivery: {
        type: Date
    },

    notes: String
}, {
    timestamps: true
});

// Generate order numbers and set estimated delivery before saving
orderSchema.pre('save', function (next) {
    console.log('Pre-save hook running for order');

    // Generate order number if it doesn't exist
    if (!this.orderNumber) {
        const timeStamp = Date.now().toString();
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        this.orderNumber = `LX${timeStamp.slice(-6)}${random}`;
        console.log('Generated order number:', this.orderNumber);
    }

    // Set estimated delivery (3-5 business days)
    if (!this.estimatedDelivery) {
        const deliveryDate = new Date();
        deliveryDate.setDate(deliveryDate.getDate() + Math.floor(Math.random() * 3) + 3); // 3-5 days
        this.estimatedDelivery = deliveryDate;
        console.log('Set estimated delivery:', this.estimatedDelivery);
    }

    next();
});

// Update timeline when status changes
orderSchema.pre('save', function (next) {
    if (this.isModified('status')) {
        const now = new Date();
        const statusMessage = {
            confirmed: 'Order confirmed.',
            processing: 'Your order is being prepared',
            shipped: 'Your order has been shipped',
            delivered: 'Order delivered successfully.'
        };

        if (this.orderTimeline[this.status]) {
            this.orderTimeline[this.status].date = now;
            this.orderTimeline[this.status].status = statusMessage[this.status];
        }
    }
    next();
});

module.exports = mongoose.model('Order', orderSchema);