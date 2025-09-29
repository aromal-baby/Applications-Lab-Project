const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5175', 'http://localhost:5174'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowHeaders: ['Content-Type', 'Authorization' ]
}));



app.use(express.json({ limit: '10mb' })); // limit for larger payloads
app.use(express.urlencoded({ extended: true })); // URL encoded support

// Static file serving
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Debugging middleware to log all requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`, {
        body: req.body,
        contentType: req.headers['content-type']
    });
    next();
});


// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB Connected to LUXE-Clothing'))
    .catch(err => console.log('MongoDB connection error:', err));

// Routes
app.use('/api/products', require('./routes/products'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/users', require('./routes/users'));
app.use('/uploads', express.static('uploads'));
app.use('/api/admin/upload', require('./routes/upload'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/orders', require('./routes/orders'));

// Basic route
app.get('/', (req, res) => {
    res.json({ message: 'LUXE Clothing API is running!' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Add this to your server.js for testing
app.get('/test-uploads', (req, res) => {
    const uploadsPath = path.join(__dirname, 'uploads');
    const files = fs.readdirSync(uploadsPath).catch(() => []);
    res.json({
        uploadsPath,
        exists: fs.existsSync(uploadsPath),
        files: files
    });
});