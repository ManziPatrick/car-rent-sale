import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="bg-white border-t mt-12 pt-12">
    {/* Newsletter */}
    <div className="bg-blue-100 py-8 px-4 flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto rounded-t-xl">
      <div className="text-2xl font-bold mb-4 md:mb-0">Sign up to Newsletter</div>
      <div className="flex-1 flex items-center justify-between gap-4">
        <span className="text-gray-600">...and receive $25 coupon for first shopping.</span>
        <form className="flex gap-2">
          <input type="email" placeholder="Enter your email" className="px-4 py-2 rounded-l border border-gray-300 focus:outline-none" />
          <button type="submit" className="bg-black text-white px-6 py-2 rounded-r font-semibold">Subscribe</button>
        </form>
      </div>
    </div>
    {/* Main Footer */}
    <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8 text-gray-700">
      {/* Contact */}
      <div>
        <div className="font-bold mb-2">Contact</div>
        <div className="mb-1">Address: Kigali , Rwanda</div>
        <div className="mb-1">Phone: +250790706170</div>
        <div className="mb-1">Hours: 90:00 - 18:00, Mon - Sat</div>
        <div className="flex gap-3 mt-2">
          {/* Social icons (use placeholder SVGs or font icons) */}
          <a href="#"><span className="sr-only">Twitter</span><i className="fab fa-twitter"></i></a>
          <a href="#"><span className="sr-only">Facebook</span><i className="fab fa-facebook"></i></a>
          <a href="#"><span className="sr-only">Instagram</span><i className="fab fa-instagram"></i></a>
          <a href="#"><span className="sr-only">Pinterest</span><i className="fab fa-pinterest"></i></a>
          <a href="#"><span className="sr-only">YouTube</span><i className="fab fa-youtube"></i></a>
        </div>
      </div>
      {/* Address */}
      <div>
        <div className="font-bold mb-2">Address</div>
        <div className="mb-1">About Us</div>
        <div className="mb-1">Delivery Information</div>
        <div className="mb-1">Privacy Policy</div>
        <div className="mb-1">Terms & Conditions</div>
        <div className="mb-1">Contact Us</div>
        <div className="mb-1">Support Center</div>
      </div>
      {/* My Account */}
      <div>
        <div className="font-bold mb-2">My Account</div>
        <div className="mb-1">Sign In</div>
        <div className="mb-1">View Cart</div>
        <div className="mb-1">My Wishlist</div>
        <div className="mb-1">Accounts</div>
        <div className="mb-1">Order</div>
        <div className="mb-1">Shop</div>
      </div>
      {/* Payment Icons */}
      <div>
        <div className="font-bold mb-2">Secured Payment Gateways</div>
        <div className="flex gap-3 mt-2">
          {/* Payment icons (use placeholder images or SVGs) */}
          <img src="/images/visa.png" alt="Visa" className="h-8" />
          <img src="/images/mastercard.png" alt="MasterCard" className="h-8" />
          <img src="/images/maestro.png" alt="Maestro" className="h-8" />
          <img src="/images/amex.png" alt="Amex" className="h-8" />
        </div>
      </div>
    </div>
    {/* Copyright */}
    <div className="text-center text-gray-500 py-4 border-t">© 2024 Car Sale. All rights reserved <span className="ml-2">Designed by Munyeshuri Dev</span></div>
  </footer>
);

export default Footer; 