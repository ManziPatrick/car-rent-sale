import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import CarCard from '../components/CarCard';
import { carsAPI, categoriesAPI } from '../services/api';
import heroCar1 from '../assets/pexels-hyundaimotorgroup-15116059-removebg-preview.png';
import heroCar2 from '../assets/lava4.png';
import heroCar3 from '../assets/suzuki3.png';
import heroCar4 from '../assets/lava2.jpg';
// import heroCar5 from '../assets/suzuki.png';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaWhatsapp } from 'react-icons/fa';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState('Featured');
  const [currentHeroCar, setCurrentHeroCar] = useState(0);
  const controls = useAnimation();
  const heroCars = [heroCar1, heroCar2, heroCar3,heroCar4];
  const heroIntervalRef = useRef(null);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        when: "beforeChildren"
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: false
  });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    } else {
      controls.start("hidden");
    }
  }, [controls, inView]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [categoriesRes, carsRes] = await Promise.all([
          categoriesAPI.getAll(),
          carsAPI.getAll({ limit: 8 })
        ]);
        setCategories(categoriesRes.data);
        setCars(carsRes.data.cars || carsRes.data);
      } catch (err) {
        setError('Failed to load data');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Hero car rotation effect
  useEffect(() => {
    heroIntervalRef.current = setInterval(() => {
      setCurrentHeroCar((prev) => (prev + 1) % heroCars.length);
    }, 5000);

    return () => {
      if (heroIntervalRef.current) {
        clearInterval(heroIntervalRef.current);
      }
    };
  }, [heroCars.length]);

  const getFilteredCars = () => {
    switch (tab) {
      case 'Featured':
        return cars.slice(0, 4);
      case 'Popular':
        return cars.filter(car => car.discount > 10).slice(0, 4);
      case 'New added':
        return cars.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 4);
      default:
        return cars.slice(0, 4);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"
          ></motion.div>
          <motion.p 
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            transition={{ repeat: Infinity, repeatType: "reverse", duration: 1 }}
            className="text-gray-600"
          >
            Loading...
          </motion.p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-red-500 text-xl mb-2"
          >
            ⚠️
          </motion.div>
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen overflow-x-hidden">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between px-8 pt-12 pb-4 max-w-7xl mx-auto">
        <div className="flex-1 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-sm text-gray-500 mb-2 font-semibold"
          >
            Hot promotions
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold mb-4 text-black leading-tight"
          >
            Car Trending <br />
            <motion.span 
              className="text-blue-700"
              animate={{ 
                textShadow: ["0 0 0px rgba(29,78,216,0.5)", "0 0 10px rgba(29,78,216,0.5)", "0 0 0px rgba(29,78,216,0.5)"] 
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              Luxurious Car
            </motion.span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-gray-600 mb-6 max-w-md"
          >
            Save more with coupons & up to 20% off
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link 
              to="/buy-sell" 
              className="relative overflow-hidden bg-blue-700 text-white px-8 py-3 rounded font-semibold shadow hover:bg-blue-800 transition inline-block text-center"
            >
              <motion.span 
                className="relative z-10"
                whileHover={{ scale: 1.05 }}
              >
                Buy & Rent Cars
              </motion.span>
              <motion.div 
                className="absolute inset-0 bg-blue-800 opacity-0"
                whileHover={{ opacity: 0.2, scale: 1.5 }}
                transition={{ duration: 0.5 }}
              />
            </Link>
            <Link 
              to="/shop" 
              className="relative overflow-hidden bg-gray-100 text-gray-700 px-8 py-3 rounded font-semibold hover:bg-gray-200 transition inline-block text-center"
            >
              <motion.span 
                className="relative z-10"
                whileHover={{ scale: 1.05 }}
              >
                Browse All
              </motion.span>
              <motion.div 
                className="absolute inset-0 bg-gray-300 opacity-0"
                whileHover={{ opacity: 0.2, scale: 1.5 }}
                transition={{ duration: 0.5 }}
              />
            </Link>
          </motion.div>
        </div>
        
        <div className="flex-1 flex justify-end relative h-64 md:h-96 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentHeroCar}
              className="relative w-full max-w-lg"
              initial={{ x: 100, opacity: 0 }}
              animate={{
                x: 0,
                opacity: 1,
                transition: { duration: 0.8, ease: "easeOut" }
              }}
              exit={{
                x: -100,
                opacity: 0,
                transition: { duration: 0.5, ease: "easeIn" }
              }}
            >
              <motion.img
                src={heroCars[currentHeroCar]}
                alt="Hero Car"
                className="w-full object-contain absolute"
                animate={{
                  x: [0, 15, -15, 0],
                  rotateY: [0, 3, -3, 0],
                  scale: [1, 1.02, 0.98, 1]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                whileHover={{
                  scale: 1.05,
                  transition: { duration: 0.3 }
                }}
              />

              {/* Racing speed lines for hero car */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                animate={{
                  opacity: [0, 0.4, 0]
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <div className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent transform -translate-y-1/2 opacity-60"></div>
                <div className="absolute top-1/3 left-0 w-4/5 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent transform -translate-y-1/2 opacity-40"></div>
                <div className="absolute top-2/3 left-0 w-3/5 h-0.5 bg-gradient-to-r from-transparent via-blue-300 to-transparent transform -translate-y-1/2 opacity-30"></div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
          
          {/* Floating elements */}
          <motion.div 
            className="absolute top-0 right-0 w-16 h-16 bg-yellow-400 rounded-full opacity-20"
            animate={{
              y: [0, 20, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="absolute bottom-0 left-0 w-24 h-24 bg-blue-400 rounded-full opacity-10"
            animate={{
              y: [0, -30, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
          />
        </div>
      </section>

      {/* Popular Categories - Centered */}
      <motion.section 
        ref={ref}
        initial="hidden"
        animate={controls}
        variants={containerVariants}
        className="max-w-7xl mx-auto px-8 py-8"
      >
        <motion.h2 variants={itemVariants} className="text-2xl font-bold mb-6 text-center">
          <span className="text-blue-700">Popular</span> Categories
        </motion.h2>
        
        <motion.div 
          variants={containerVariants}
          className="flex gap-6 overflow-x-auto pb-2 scrollbar-hide justify-center"
        >
          {categories.map((category, index) => (
            <motion.div 
              key={category._id}
              variants={itemVariants}
              custom={index}
              whileHover={{ y: -5 }}
            >
              <Link 
                to={`/shop?category=${category._id}`}
                className="flex flex-col items-center min-w-[140px] bg-white border border-blue-100 rounded-xl p-4 shadow-sm hover:shadow-md transition"
              >
                <motion.img 
                  src={category.image || "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=200&q=80"} 
                  alt={category.name} 
                  className="w-24 h-20 object-contain mb-2"
                  whileHover={{ scale: 1.1 }}
                />
                <div className="font-semibold text-gray-700 text-sm">{category.name}</div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Car Tabs */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true, amount: 0.2 }}
        className="max-w-7xl mx-auto px-8 py-12 relative"
      >

        <div className="flex gap-2 mb-6">
          {['Featured', 'Popular', 'New added'].map((t, i) => (
            <motion.button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded font-semibold ${tab === t ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'} transition`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              {t}
            </motion.button>
          ))}
        </div>
        
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6"
        >
          {getFilteredCars().map((car, index) => (
            <motion.div
              key={car._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{
                y: -5,
                transition: { duration: 0.2 }
              }}
            >
              <CarCard car={car} />
            </motion.div>
          ))}
        </motion.div>
        
        {getFilteredCars().length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8 text-gray-500"
          >
            No cars found in this category
          </motion.div>
        )}
      </motion.section>

      {/* Deal of the Day & Luxury Car */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true, amount: 0.2 }}
        className="max-w-7xl mx-auto px-8 py-12 grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-blue-100 rounded-xl p-8 flex flex-col justify-between relative overflow-hidden"
        >
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-2">Deal of the Day</h3>
            <p className="text-gray-600 mb-4">Limited quantities. End of year Collection.</p>
          </div>
          
          <motion.img 
            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80" 
            alt="Deal Car" 
            className="w-full h-40 object-contain mb-4 relative z-10"
            whileHover={{ scale: 1.05 }}
          />
          
          <Link 
            to="/shop" 
            className="relative z-10 bg-blue-700 text-white px-6 py-2 rounded font-semibold shadow hover:bg-blue-800 transition self-start inline-block"
          >
            <motion.span whileHover={{ scale: 1.05 }}>
              Shop Now
            </motion.span>
          </Link>
          
          <motion.div 
            className="absolute -bottom-20 -right-20 w-40 h-40 bg-blue-200 rounded-full opacity-20"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </motion.div>
        
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-blue-50 rounded-xl p-8 flex flex-col justify-between relative overflow-hidden"
        >
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-2">Luxury Car</h3>
            <p className="text-gray-600 mb-4">Try something new on wheels. Limited quantities.</p>
          </div>
          
          <motion.img 
            src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=600&q=80" 
            alt="Luxury Car" 
            className="w-full h-40 object-contain mb-4 relative z-10"
            whileHover={{ scale: 1.05 }}
          />
          
          <Link 
            to="/shop" 
            className="relative z-10 bg-blue-700 text-white px-6 py-2 rounded font-semibold shadow hover:bg-blue-800 transition self-start inline-block"
          >
            <motion.span whileHover={{ scale: 1.05 }}>
              Shop Now
            </motion.span>
          </Link>
          
          <motion.div 
            className="absolute -top-20 -left-20 w-40 h-40 bg-blue-300 rounded-full opacity-20"
            animate={{
              scale: [1, 1.3, 1],
              rotate: [360, 180, 0]
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </motion.div>
      </motion.section>
      
      {/* WhatsApp Floating CTA */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        viewport={{ once: true }}
        className="fixed bottom-6 right-6 z-50"
      >
        <a 
          href="https://wa.me/250790706170" 
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-500 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:bg-green-600 transition flex items-center gap-2"
        >
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity
            }}
          >
            <FaWhatsapp className="text-xl" />
          </motion.div>
          <span>Chat on WhatsApp</span>
        </a>
      </motion.div>
    </div>
  );
};

export default Home;