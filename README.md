# Car Rent & Sale Platform

A full-stack web application for car rental and sales, built with React, Node.js, Express, and MongoDB. Features a modern admin dashboard, email notifications, and comprehensive CRUD operations.

## 🚀 Features

### Frontend (React + Tailwind CSS)
- **Modern UI/UX**: Beautiful, responsive design with Tailwind CSS
- **Authentication**: JWT-based login/register system
- **Car Management**: Browse, search, and filter cars
- **Order System**: Complete booking and checkout process
- **Admin Dashboard**: Comprehensive admin panel with:
  - Dashboard overview with real-time stats
  - Car management (CRUD operations)
  - Category management
  - User management
  - Order management with bulk operations
  - Email template management
  - Notification system
- **Responsive Design**: Mobile-first approach
- **Protected Routes**: Role-based access control

### Backend (Node.js + Express + MongoDB)
- **RESTful API**: Complete CRUD operations
- **Authentication**: JWT token-based authentication
- **File Upload**: Cloudinary integration for images
- **Email System**: Nodemailer with customizable templates
- **PDF Generation**: Contract generation with PDFKit
- **Search & Filtering**: Advanced search capabilities
- **Pagination**: Efficient data handling
- **Bulk Operations**: Mass updates and deletions
- **Admin Features**: Complete admin management system

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Axios** - HTTP client
- **Context API** - State management

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Nodemailer** - Email service
- **Cloudinary** - Image upload
- **PDFKit** - PDF generation
- **Multer** - File upload handling

## 📁 Project Structure

```
car-rent-sale/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context
│   │   ├── services/       # API services
│   │   └── assets/         # Static assets
│   ├── package.json
│   └── README.md
├── server/                  # Node.js backend
│   ├── controllers/        # Route controllers
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   ├── utils/             # Utility functions
│   ├── package.json
│   └── README.md
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Cloudinary account
- Gmail account (for email notifications)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd car-rent-sale
```

### 2. Backend Setup
```bash
cd server
npm install

# Create .env file
cp .env.example .env
# Edit .env with your configuration

# Start the server
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install

# Start the development server
npm run dev
```

### 4. Environment Variables

#### Backend (.env)
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/car_rent_sale
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

## 📋 API Endpoints

### Authentication
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `GET /api/users/profile` - Get profile
- `PUT /api/users/profile` - Update profile

### Cars
- `GET /api/cars` - Get all cars
- `POST /api/cars` - Create car
- `PUT /api/cars/:id` - Update car
- `DELETE /api/cars/:id` - Delete car

### Orders
- `GET /api/orders` - Get all orders (admin)
- `POST /api/orders` - Create order
- `PUT /api/orders/:id/status` - Update status

### Admin
- `GET /api/admin/stats` - Dashboard stats
- `GET /api/admin/email-templates` - Email templates
- `POST /api/admin/send-bulk-email` - Send bulk emails

## 🎯 Key Features

### Admin Dashboard
- **Real-time Statistics**: Cars, users, orders, revenue
- **CRUD Operations**: Full management of all resources
- **Bulk Operations**: Mass updates and deletions
- **Search & Filtering**: Advanced search capabilities
- **Email Management**: Template creation and bulk sending
- **Order Management**: Status updates with email notifications

### User Features
- **Car Browsing**: Search, filter, and view car details
- **Booking System**: Complete checkout process
- **Order History**: View past orders
- **Profile Management**: Update personal information
- **Contract Generation**: Automatic PDF contract creation

### Email System
- **Template Management**: Create and edit email templates
- **Automatic Notifications**: Order confirmations and status updates
- **Bulk Emailing**: Send emails to multiple users
- **Test Emails**: Preview emails before sending

## 🔧 Development

### Running in Development
```bash
# Backend
cd server
npm run dev

# Frontend (in new terminal)
cd frontend
npm run dev
```

### Building for Production
```bash
# Frontend
cd frontend
npm run build

# Backend
cd server
npm start
```

## 🚀 Deployment

### Backend Deployment
1. Set up MongoDB Atlas
2. Configure environment variables
3. Deploy to Heroku/Vercel/Railway

### Frontend Deployment
1. Build the project: `npm run build`
2. Deploy to Netlify/Vercel/GitHub Pages

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email support@carrentsale.com or create an issue in the repository.

## 🔮 Future Enhancements

- [ ] Real-time chat support
- [ ] Payment gateway integration
- [ ] Advanced analytics dashboard
- [ ] Mobile app development
- [ ] Multi-language support
- [ ] Advanced search filters
- [ ] Review and rating system
- [ ] Push notifications 