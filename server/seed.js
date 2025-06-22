require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Category = require('./models/Category');
const Car = require('./models/Car');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/car_rent_sale';

const cars = [
  {
    title: 'Audi R8',
    brand: 'Audi',
    model: 'R8',
    year: 2023,
    salePrice: 116000,
    rentPrice: 800,
    oldPrice: 200000,
    discount: 25,
    image: 'https://images.unsplash.com/photo-1511918984145-48de785d4c4e?auto=format&fit=crop&w=800&q=80',
    description: 'The Audi R8 is a supercar with a 5.2L V10 engine, delivering 602 horsepower and 413 lb-ft of torque.',
    features: ['V10 Engine', 'Quattro AWD', 'Carbon Fiber Body', 'Bang & Olufsen Sound'],
    status: 'Available',
    mileage: 12000,
    fuel: 'Petrol',
    transmission: 'Automatic',
    color: 'Orange',
    category: 'Luxury',
  },
  {
    title: 'BMW X6',
    brand: 'BMW',
    model: 'X6',
    year: 2022,
    salePrice: 138000,
    rentPrice: 700,
    oldPrice: 145000,
    discount: 5,
    image: 'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=800&q=80',
    description: 'BMW X6 combines luxury and performance with a powerful engine and advanced tech.',
    features: ['TwinPower Turbo', 'xDrive', 'Panoramic Roof', 'Leather Seats'],
    status: 'Available',
    mileage: 8000,
    fuel: 'Diesel',
    transmission: 'Automatic',
    color: 'Red',
    category: 'SUV',
  },
  {
    title: 'Rolls Royce Ghost',
    brand: 'Rolls Royce',
    model: 'Ghost',
    year: 2021,
    salePrice: 438000,
    rentPrice: 2000,
    oldPrice: 445000,
    discount: 2,
    image: 'https://images.unsplash.com/photo-1461632830798-3adb3034e4c8?auto=format&fit=crop&w=800&q=80',
    description: 'The Rolls Royce Ghost is the epitome of luxury, comfort, and prestige.',
    features: ['V12 Engine', 'Starlight Headliner', 'Coach Doors', 'Bespoke Interior'],
    status: 'Available',
    mileage: 5000,
    fuel: 'Petrol',
    transmission: 'Automatic',
    color: 'White',
    category: 'Luxury',
  },
  {
    title: 'Ford Mustang',
    brand: 'Ford',
    model: 'Mustang',
    year: 2022,
    salePrice: 300000,
    rentPrice: 900,
    oldPrice: 350000,
    discount: 14,
    image: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=800&q=80',
    description: 'The Ford Mustang is an iconic muscle car with modern performance.',
    features: ['V8 Engine', 'Rear Wheel Drive', 'Convertible', 'SYNC 3'],
    status: 'Available',
    mileage: 10000,
    fuel: 'Petrol',
    transmission: 'Manual',
    color: 'Red',
    category: 'Sports',
  },
  {
    title: 'Mercedes-Benz G-Class',
    brand: 'Mercedes-Benz',
    model: 'G-Class',
    year: 2023,
    salePrice: 388000,
    rentPrice: 1200,
    oldPrice: 390000,
    discount: 1,
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    description: 'The G-Class is a luxury SUV with off-road capability and iconic design.',
    features: ['4MATIC AWD', 'Luxury Interior', '360 Camera', 'Heated Seats'],
    status: 'Available',
    mileage: 6000,
    fuel: 'Diesel',
    transmission: 'Automatic',
    color: 'Black',
    category: 'SUV',
  },
  {
    title: 'Lamborghini Urus',
    brand: 'Lamborghini',
    model: 'Urus',
    year: 2022,
    salePrice: 538000,
    rentPrice: 2500,
    oldPrice: 545000,
    discount: 1,
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80',
    description: "The Lamborghini Urus is the world's first Super Sport Utility Vehicle.",
    features: ['V8 Twin Turbo', 'AWD', 'Lamborghini Infotainment', 'Carbon Ceramic Brakes'],
    status: 'Available',
    mileage: 4000,
    fuel: 'Petrol',
    transmission: 'Automatic',
    color: 'Yellow',
    category: 'SUV',
  },
  {
    title: 'Toyota Land Cruiser',
    brand: 'Toyota',
    model: 'Land Cruiser',
    year: 2021,
    salePrice: 240000,
    rentPrice: 600,
    oldPrice: 245000,
    discount: 2,
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80',
    description: 'The Toyota Land Cruiser is legendary for its off-road prowess and reliability.',
    features: ['4WD', '7 Seats', 'Crawl Control', 'KDSS Suspension'],
    status: 'Available',
    mileage: 15000,
    fuel: 'Diesel',
    transmission: 'Automatic',
    color: 'Beige',
    category: 'SUV',
  },
  {
    title: 'Audi Q7',
    brand: 'Audi',
    model: 'Q7',
    year: 2023,
    salePrice: 338000,
    rentPrice: 850,
    oldPrice: 345000,
    discount: 2,
    image: 'https://images.unsplash.com/photo-1511391403515-5c8e1f1b8c84?auto=format&fit=crop&w=800&q=80',
    description: 'Audi Q7 is a luxury SUV with advanced technology and comfort.',
    features: ['Quattro AWD', 'Virtual Cockpit', '7 Seats', 'Matrix LED Headlights'],
    status: 'Available',
    mileage: 9000,
    fuel: 'Petrol',
    transmission: 'Automatic',
    color: 'Blue',
    category: 'SUV',
  },
];

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
        description: 'Luxury and premium cars'
      },
      {
        name: 'Sports',
        description: 'High performance sports cars'
      }
    ]);
    console.log('Categories created:', categories.map(c => c.name).join(', '));

    // Map car.category string to category _id
    const carsWithCategory = cars.map(car => {
      const cat = categories.find(c => c.name.toLowerCase() === car.category.toLowerCase());
      return { ...car, category: cat ? cat._id : undefined };
    });

    await Car.insertMany(carsWithCategory);
    console.log('Sample cars created:', carsWithCategory.length);

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
    console.log(`   Cars: ${carsWithCategory.length}`);

  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

seedData(); 