# LUXE - Premium Fashion E-commerce Platform

A modern, full-stack e-commerce platform specializing in premium fashion for men, women, and accessories. Built with React.js, Node.js, and MongoDB.

## Features

### 🛍️ Shopping Experience
- **Product Browsing**: Responsive product grids with filtering and search
- **Dynamic Collections**: Featured products, new arrivals, and category-specific collections
- **Product Details**: Comprehensive product pages with multiple images and specifications
- **Wishlist**: Save favorite items with size selection and toast notifications
- **Shopping Cart**: Full cart management with quantity updates and item removal

### 👤 User Management
- **Authentication**: Secure login/register with JWT tokens
- **User Profiles**: Personal profile management and order history
- **Address Management**: Multiple shipping addresses with default selection
- **Order Tracking**: Real-time order status updates and progress simulation

### 🎨 Modern UI/UX
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Interactive Components**: Hover effects, animations, and micro-interactions
- **Toast Notifications**: User feedback for actions and errors
- **Loading States**: Skeleton screens and loading indicators

### ⚡ Performance
- **Image Optimization**: Lazy loading and error handling
- **API Integration**: RESTful API with error handling and loading states
- **Context Management**: React Context for global state (auth, cart, wishlist)

### 🔧 Admin Panel
- **Product Management**: CRUD operations for products with image upload
- **Inventory Tracking**: Stock management and low-stock alerts
- **Analytics Dashboard**: Sales metrics and product performance
- **Bulk Operations**: Mass updates and batch processing

## Tech Stack

### Frontend
- **React 18** - UI framework
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **React Context** - State management

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **Multer** - File upload handling

### Development Tools
- **Vite** - Build tool and dev server
- **ESLint** - Code linting
- **Git** - Version control

## Project Structure

```
luxe-ecommerce/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── common/     # Shared components
│   │   │   ├── home/       # Homepage components
│   │   │   └── men/        # Category-specific components
│   │   ├── contexts/       # React Context providers
│   │   ├── services/       # API calls and utilities
│   │   ├── pages/          # Route components
│   │   └── styles/         # Global styles
│   ├── package.json
│   └── vite.config.js
├── server/                 # Node.js backend
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API endpoints
│   ├── middleware/        # Custom middleware
│   ├── uploads/           # File storage
│   ├── package.json
│   └── server.js
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (v5.0 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/aromal-baby/Luxe-Clothing.git
cd Luxe-Clothng
```

2. **Install dependencies**
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd frontend
npm install
```

3. **Environment Setup**
```bash
# Copy environment template
cp .env.example .env
```

4. **Configure environment variables**
```env
# Server (.env in root)
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/luxe
JWT_SECRET=your-super-secret-jwt-key
UPLOAD_DIR=uploads

# Client (.env in client folder)
VITE_API_BASE_URL=http://localhost:5000
```

5. **Start MongoDB**
```bash
# Using MongoDB service
sudo systemctl start mongod

# Or using MongoDB Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

6. **Start the application**
```bash
# Start server (from server directory)
cd backend
npm run dev

# Start client (from client directory)
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - Get all products with filters
- `GET /api/products/:id` - Get single product
- `GET /api/products/search` - Search products

### User Management
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users/addresses` - Get user addresses

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get specific order

### Admin (Protected)
- `GET /api/admin/products` - Get all products (admin view)
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product

## Available Scripts

### Server
```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm run seed       # Seed database with sample data
```

### Client
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

## Features in Detail

### Product Management
- Dynamic product filtering by category, price, and features
- Featured product collections (new-arrivals, best-sellers, trending)
- Image upload and management
- Inventory tracking with low-stock alerts

### Shopping Experience
- Responsive product grids with hover effects
- Wishlist with size selection modal
- Shopping cart with persistent storage
- Order tracking with status updates

### User Experience
- Toast notifications for user feedback
- Loading states and error handling
- Mobile-responsive design
- Accessibility features

## Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy dist/ folder
```

### Backend (Heroku/Railway)
```bash
# Add Procfile
echo "web: node server.js" > Procfile

# Set environment variables in hosting platform
```

### Database (MongoDB Atlas)
1. Create MongoDB Atlas cluster
2. Update MONGODB_URI in environment variables
3. Whitelist deployment server IPs

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Environment Variables

### Required Server Variables
```env
NODE_ENV=production|development
PORT=5000
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-jwt-secret-key
UPLOAD_DIR=uploads
```

### Required Client Variables
```env
VITE_API_BASE_URL=your-backend-url
```

## Security Notes

- JWT tokens are stored in localStorage (consider httpOnly cookies for production)
- File uploads are limited to images only
- API routes are protected with authentication middleware
- Input validation on all endpoints
- CORS configured for frontend domain

## Known Issues

- Image uploads limited to local storage (consider cloud storage for production)
- Email notifications not implemented
- Search functionality is basic (consider Elasticsearch for advanced search)

## Roadmap

- [ ] Payment integration (Stripe/PayPal)
- [ ] Email notifications
- [ ] Advanced search with Elasticsearch
- [ ] Cloud image storage (Cloudinary/AWS S3)
- [ ] Review and rating system
- [ ] Social media integration
- [ ] Multi-language support
- [ ] PWA features

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@luxe-store.com or join our Slack channel.

## Acknowledgments

- Design inspiration from modern fashion e-commerce sites
- Tailwind CSS for the utility-first CSS framework
- React community for excellent documentation and resources
- MongoDB team for the flexible NoSQL database


## Demo & Preview

### Screenshots 
####(Client - side) :


<p align="center">
  <img src="https://github.com/aromal-baby/Applications-Lab-Project/blob/main/frontend/public/images/Screenshot1.png" width="30%" />
  <img src="https://github.com/aromal-baby/Applications-Lab-Project/blob/main/frontend/public/images/Screenshot2.png" width="30%" />
  <img src="https://github.com/aromal-baby/Applications-Lab-Project/blob/main/frontend/public/images/Screenshot3.png" width="30%" />
</p>


<p align="center">
  <img src="https://github.com/aromal-baby/Applications-Lab-Project/blob/main/frontend/public/images/Screenshot4.png" width="30%" />
  <img src="https://github.com/aromal-baby/Applications-Lab-Project/blob/main/frontend/public/images/Screenshot5.png" width="30%" />
  <img src="https://github.com/aromal-baby/Applications-Lab-Project/blob/main/frontend/public/images/Screenshot6.png" width="30%" />
</p>


####(Admin - side) 

<p align="center">
  <img src="https://github.com/aromal-baby/Applications-Lab-Project/blob/main/frontend/public/images/Screenshot7.png" width="30%" />
  <img src="https://github.com/aromal-baby/Applications-Lab-Project/blob/main/frontend/public/images/Screenshot8.png" width="30%" />
  <img src="https://github.com/aromal-baby/Applications-Lab-Project/blob/main/frontend/public/images/Screenshot9.png" width="30%" />
</p>




