# Car Rent & Sale Backend

A comprehensive Node.js/Express backend for the Car Rent & Sale platform with full CRUD operations, authentication, email notifications, and admin management.

## Features

- **Authentication**: JWT-based authentication with user roles
- **CRUD Operations**: Full CRUD for Cars, Categories, Orders, and Users
- **Admin Dashboard**: Complete admin management system
- **Email Notifications**: Automated email system with templates
- **File Upload**: Cloudinary integration for image uploads
- **PDF Generation**: Contract generation with PDFKit
- **Search & Filtering**: Advanced search and filtering capabilities
- **Pagination**: Efficient data pagination
- **Bulk Operations**: Bulk status updates and deletions

## Environment Variables

Create a `.env` file in the server directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGO_URI=mongodb://localhost:27017/car_rent_sale

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Email Configuration (Gmail)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Optional: For production
# CORS_ORIGIN=https://yourdomain.com
```

## Setup Instructions

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Set up MongoDB**:
   - Install MongoDB locally or use MongoDB Atlas
   - Update MONGO_URI in .env file

3. **Set up Cloudinary**:
   - Create a Cloudinary account
   - Get your cloud name, API key, and secret
   - Update the Cloudinary variables in .env

4. **Set up Email**:
   - Use Gmail with App Password
   - Enable 2-factor authentication
   - Generate an App Password
   - Update EMAIL_USER and EMAIL_PASS in .env

5. **Start the Server**:
   ```bash
   npm start
   # or for development with nodemon
   npx nodemon server.js
   ```

## API Endpoints

### Authentication
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/change-password` - Change password

### Cars
- `GET /api/cars` - Get all cars (with filters)
- `GET /api/cars/:id` - Get car by ID
- `POST /api/cars` - Create new car
- `PUT /api/cars/:id` - Update car
- `DELETE /api/cars/:id` - Delete car
- `POST /api/cars/upload` - Upload car image

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category by ID
- `POST /api/categories` - Create new category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Orders
- `GET /api/orders` - Get all orders (admin)
- `GET /api/orders/my` - Get user orders
- `GET /api/orders/:id` - Get order by ID
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id/status` - Update order status
- `PUT /api/orders/bulk-status` - Bulk update status
- `DELETE /api/orders/:id` - Delete order
- `POST /api/orders/:id/contract` - Generate contract

### Admin
- `GET /api/admin/stats` - Get dashboard stats
- `GET /api/admin/email-templates` - Get email templates
- `POST /api/admin/email-templates` - Create email template
- `PUT /api/admin/email-templates/:id` - Update email template
- `DELETE /api/admin/email-templates/:id` - Delete email template
- `GET /api/admin/notifications` - Get notifications
- `POST /api/admin/send-test-email/:templateId` - Send test email
- `POST /api/admin/send-bulk-email/:templateId` - Send bulk email
- `PUT /api/admin/users/:id` - Update user (admin)
- `DELETE /api/admin/users/:id` - Delete user (admin)

## Models

### User
- name, email, phone, password, isAdmin, timestamps

### Car
- brand, model, year, price, category, status, images, description, timestamps

### Category
- name, description, timestamps

### Order
- user, car, type, status, startDate, endDate, withDriver, contractUrl, timestamps

### EmailTemplate
- name, subject, body, type, variables, timestamps

### Notification
- recipient, subject, body, type, status, templateId, metadata, timestamps

## Middleware

- **auth.js**: JWT authentication and role-based authorization
- **CORS**: Cross-origin resource sharing
- **JSON parsing**: Request body parsing

## Utilities

- **cloudinary.js**: Cloudinary image upload configuration
- **emailService.js**: Nodemailer email service with templates

## Security Features

- JWT token authentication
- Password hashing with bcrypt
- Role-based access control
- Input validation and sanitization
- CORS protection
- Environment variable protection

## Error Handling

- Comprehensive error handling for all endpoints
- Proper HTTP status codes
- Detailed error messages for debugging
- Graceful error recovery

## Performance Features

- Database indexing for efficient queries
- Pagination for large datasets
- Image optimization with Cloudinary
- Efficient bulk operations
- Caching considerations

## Development

- Hot reloading with nodemon
- Environment-specific configurations
- Comprehensive logging
- API documentation 