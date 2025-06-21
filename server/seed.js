require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Category = require('./models/Category');
const Car = require('./models/Car');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/car_rent_sale';

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Category.deleteMany({});
    await Car.deleteMany({});
    console.log('Cleared existing data');

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@carrentsale.com',
      phone: '+1234567890',
      password: adminPassword,
      isAdmin: true
    });
    console.log('Admin user created:', admin.email);

    // Create regular user
    const userPassword = await bcrypt.hash('user123', 10);
    const user = await User.create({
      name: 'John Doe',
      email: 'user@carrentsale.com',
      phone: '+1987654321',
      password: userPassword,
      isAdmin: false
    });
    console.log('Regular user created:', user.email);

    // Create categories
    const categories = await Category.create([
      {
        name: 'Sedan',
        description: 'Comfortable family cars'
      },
      {
        name: 'SUV',
        description: 'Sport utility vehicles'
      },
      {
        name: 'Luxury',
        description: 'Premium luxury vehicles'
      },
      {
        name: 'Sports',
        description: 'High-performance sports cars'
      }
    ]);
    console.log('Categories created:', categories.length);

    // Create sample cars
    const cars = await Car.create([
      {
        title: 'Toyota Camry 2022',
        brand: 'Toyota',
        model: 'Camry',
        year: 2022,
        fuel: 'Gasoline',
        mileage: 15000,
        transmission: 'Automatic',
        image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=500',
        salePrice: 25000,
        rentPrice: 50,
        category: categories[0]._id,
        status: 'Available',
        description: 'Reliable family sedan with great fuel economy'
      },
      {
        title: 'Honda CR-V 2023',
        brand: 'Honda',
        model: 'CR-V',
        year: 2023,
        fuel: 'Gasoline',
        mileage: 8000,
        transmission: 'Automatic',
        image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=500',
        salePrice: 32000,
        rentPrice: 65,
        category: categories[1]._id,
        status: 'Available',
        description: 'Spacious SUV perfect for families'
      },
      {
        title: 'BMW X5 2023',
        brand: 'BMW',
        model: 'X5',
        year: 2023,
        fuel: 'Gasoline',
        mileage: 5000,
        transmission: 'Automatic',
        image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=500',
        salePrice: 65000,
        rentPrice: 120,
        category: categories[2]._id,
        status: 'Available',
        description: 'Luxury SUV with premium features'
      },
      {
        title: 'Porsche 911 2023',
        brand: 'Porsche',
        model: '911',
        year: 2023,
        fuel: 'Gasoline',
        mileage: 2000,
        transmission: 'Manual',
        image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=500',
        salePrice: 120000,
        rentPrice: 250,
        category: categories[3]._id,
        status: 'Available',
        description: 'Iconic sports car with incredible performance'
      }
    ]);
    console.log('Sample cars created:', cars.length);

    console.log('\n🎉 Seed data created successfully!');
    console.log('\n📋 Test Accounts:');
    console.log('👑 Admin Account:');
    console.log('   Email: admin@carrentsale.com');
    console.log('   Password: admin123');
    console.log('\n👤 Regular User Account:');
    console.log('   Email: user@carrentsale.com');
    console.log('   Password: user123');
    console.log('\n🚗 Sample Data:');
    console.log(`   Categories: ${categories.length}`);
    console.log(`   Cars: ${cars.length}`);

  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

seedData(); 