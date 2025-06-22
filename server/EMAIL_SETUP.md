# Email Setup Guide

This guide will help you set up email functionality for the Car Rent & Sale application using Gmail.

## Prerequisites

1. A Gmail account
2. 2-Factor Authentication enabled on your Gmail account
3. An App Password generated for this application

## Step 1: Enable 2-Factor Authentication

1. Go to your Google Account settings: https://myaccount.google.com/
2. Navigate to "Security"
3. Enable "2-Step Verification" if not already enabled

## Step 2: Generate an App Password

1. In your Google Account settings, go to "Security"
2. Under "2-Step Verification", click on "App passwords"
3. Select "Mail" as the app and "Other" as the device
4. Enter a name like "Car Rent & Sale App"
5. Click "Generate"
6. Copy the 16-character password that appears

## Step 3: Create Environment Variables

Create a `.env` file in the `server` directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGO_URI=mongodb://localhost:27017/car_rent_sale

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Email Configuration (Gmail)
EMAIL_USER=your-gmail-address@gmail.com
EMAIL_PASS=your-16-character-app-password

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Cloudinary Configuration (optional)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

## Step 4: Replace Placeholder Values

Replace the following values in your `.env` file:

- `your-gmail-address@gmail.com`: Your actual Gmail address
- `your-16-character-app-password`: The 16-character app password generated in Step 2
- `your-super-secret-jwt-key-change-this-in-production`: A strong random string for JWT signing

## Step 5: Test Email Functionality

1. Start your server: `npm start`
2. Register a new user through the application
3. Check the user's email for the welcome message with login credentials
4. Create an order to test order confirmation emails

## Email Templates

The application includes beautiful, responsive email templates for:

1. **Welcome Email**: Sent when a new user registers
   - Contains login credentials
   - Security reminder to change password
   - Professional design with branding

2. **Order Confirmation**: Sent when an order is created
   - Order details and car information
   - Professional styling with order summary
   - Call-to-action buttons

3. **Order Status Update**: Sent when order status changes
   - Updated status information
   - Order tracking details
   - Professional notification design

## Troubleshooting

### Common Issues

1. **"Invalid login: 535-5.7.8 Username and Password not accepted"**
   - Ensure you're using an App Password, not your regular Gmail password
   - Verify 2-Factor Authentication is enabled
   - Check that the App Password was generated correctly

2. **"Email not sent - transporter not available"**
   - Check that EMAIL_USER and EMAIL_PASS are set in your .env file
   - Verify the .env file is in the correct location (server directory)

3. **Emails not being received**
   - Check spam/junk folder
   - Verify the email address is correct
   - Check server logs for email sending errors

### Security Notes

- Never commit your `.env` file to version control
- Use different App Passwords for different applications
- Regularly rotate your App Passwords
- Use strong, unique JWT secrets in production

## Production Deployment

For production deployment:

1. Use environment variables provided by your hosting platform
2. Consider using a dedicated email service like SendGrid or AWS SES
3. Set up proper DNS records for email deliverability
4. Monitor email sending limits and quotas
5. Implement email queue system for high-volume applications

## Email Service Features

- **Beautiful HTML Templates**: Professional, responsive design
- **Error Handling**: Graceful fallback when email sending fails
- **Security**: Uses App Passwords for secure authentication
- **Logging**: Detailed logs for debugging email issues
- **Modular Design**: Easy to extend with new email types 