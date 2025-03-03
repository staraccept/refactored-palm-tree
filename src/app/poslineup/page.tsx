"use client";
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { 
  FaFilter, FaArrowLeft, FaSearch, FaTimes, FaChevronDown, FaShoppingCart, 
  FaStore, FaUtensils, FaCut, FaClipboardCheck, FaStar, FaCheckCircle, 
  FaMobileAlt, FaDesktop, FaWifi, FaExchangeAlt, FaTag 
} from 'react-icons/fa';
import { ThemeProvider, useTheme } from '../components/ThemeProvider';
import { posProducts } from '@/lib/posProducts';

export default function POSLineup() {
  const { darkMode, toggleDarkMode } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<string>('all');
  const [industry, setIndustry] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [compareList, setCompareList] = useState<string[]>([]);
  const [showCompare, setShowCompare] = useState(false);
  const productDetailRef = useRef<HTMLDivElement>(null);

  // Filter categories
  const categories = [
    { id: 'all', name: 'All Products', icon: <FaShoppingCart className="mr-2" /> },
    { id: 'pos', name: 'POS Systems', icon: <FaDesktop className="mr-2" /> },
    { id: 'mobile', name: 'Mobile Solutions', icon: <FaMobileAlt className="mr-2" /> },
    { id: 'peripheral', name: 'Peripherals', icon: <FaWifi className="mr-2" /> },
    { id: 'selfservice', name: 'Self-Service', icon: <FaClipboardCheck className="mr-2" /> },
  ];

  // Industry filters
  const industries = [
    { id: 'all', name: 'All Industries', icon: <FaStore className="mr-2" /> },
    { id: 'restaurant', name: 'Restaurants', icon: <FaUtensils className="mr-2" /> },
    { id: 'retail', name: 'Retail', icon: <FaTag className="mr-2" /> },
    { id: 'service', name: 'Service Business', icon: <FaCut className="mr-2" /> },
  ];

  // Filter the products based on search term, category, and industry
  const filteredProducts = posProducts.filter(product => {
    const matchesSearch =
      searchTerm === '' ||
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.features.some(feature =>
        feature.toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      product.bestFor.some(target =>
        target.toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      (product.searchTerms && product.searchTerms.keywords && 
       product.searchTerms.keywords.some(keyword =>
        keyword.toLowerCase().includes(searchTerm.toLowerCase())
      ));

    const matchesFilter =
      filter === 'all' || product.primaryCategory === filter;
      
    const matchesIndustry = 
      industry === 'all' || 
      (product.searchTerms && product.searchTerms.industries && 
       product.searchTerms.industries.includes(industry));

    return matchesSearch && matchesFilter && matchesIndustry;
  });

  // Function to open the image modal
  const openImageModal = (imageSrc: string) => {
    setSelectedImage(imageSrc);
  };

  // Function to close the image modal
  const closeImageModal = () => {
    setSelectedImage(null);
  };

  // Toggle product in compare list
  const toggleCompare = (productId: string) => {
    setCompareList(prev => {
      let newList: string[];
      if (prev.includes(productId)) {
        newList = prev.filter(id => id !== productId);
      } else {
        newList = prev.length >= 3 ? [...prev.slice(1), productId] : [...prev, productId];
      }
      setShowCompare(newList.length >= 2);
      return newList;
    });
  };

  // Scroll to product detail section
  const scrollToProduct = useCallback((identifier: string) => {
    setSelectedProduct(identifier);
    setTimeout(() => {
      if (productDetailRef.current) {
        productDetailRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }, []);

  // Clear search and filters
  const clearFilters = () => {
    setSearchTerm('');
    setFilter('all');
    setIndustry('all');
  };
  
  // Determine featured products for comparison section
  const featuredProducts = posProducts.filter(product => 
    product.primaryCategory === 'pos' && 
    (product.size === 'standard' || product.size === 'large')
  ).slice(0, 3);

  return (
    <ThemeProvider>
      <main className={darkMode ? 'dark' : ''}>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
          <Head>
            <title>POS Systems & Hardware | StarAccept Business Solutions</title>
            <meta
              name="description"
              content="Explore our comprehensive range of POS systems and payment hardware for restaurants, retail, and service businesses. Find the perfect solution to grow your business."
            />
            <meta name="keywords" content="POS systems, point of sale, payment hardware, Clover, restaurant POS, retail POS, service business POS" />
          </Head>

          {/* NAVBAR */}
          <motion.nav
            className="fixed top-0 z-50 w-full bg-white dark:bg-gray-800 shadow-sm bg-opacity-90 backdrop-blur-sm"
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            <div className="max-w-6xl px-2 mx-auto sm:px-4 lg:px-6">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center space-x-3">
                  <motion.div
                    className="flex items-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link href="/">
                      <Image
                        src="/staracceptlogo.png"
                        alt="StarAccept"
                        width={187.5}
                        height={50}
                        className="transition-all duration-300 hover:brightness-110 dark:brightness-150"
                        priority
                      />
                    </Link>
                  </motion.div>
                  <div className="hidden md:flex items-center text-sm space-x-4">
                    <motion.a
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 cursor-pointer"
                      href="/restaurants"
                      aria-label="Go to Restaurants page"
                    >
                      Restaurants
                    </motion.a>
                    <motion.a
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 cursor-pointer"
                      href="/retail"
                      aria-label="Go to Retail page"
                    >
                      Retail
                    </motion.a>
                    <motion.a
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 cursor-pointer"
                      href="/services"
                      aria-label="Go to Services page"
                    >
                      Services
                    </motion.a>
                    <motion.a
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 cursor-pointer"
                      href="/online-ordering"
                      aria-label="Go to Online Ordering page"
                    >
                      Online Ordering
                    </motion.a>
                    <motion.a
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 cursor-pointer"
                      href="/working-capital-funding"
                      aria-label="Go to Working Capital Funding page"
                    >
                      Working Capital
                    </motion.a>
                    <motion.a
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-blue-600 dark:text-blue-400 font-semibold"
                      href="/poslineup"
                      aria-label="View All POS Systems"
                    >
                      POS Systems
                    </motion.a>
                    <motion.a
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 cursor-pointer"
                      href="/#contact"
                      aria-label="Go to Contact section"
                    >
                      Contact
                    </motion.a>
                  </div>
                </div>
                <div className="flex items-center">
                  <motion.a
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="hidden md:inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 mr-4 shadow-sm"
                    href="/#contact"
                  >
                    <span className="text-sm font-medium">Request Consultation</span>
                  </motion.a>
                  <button
                    onClick={toggleDarkMode}
                    className="hidden md:inline-block p-2 text-gray-600 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none"
                    aria-label="Toggle Dark Mode"
                  >
                    {darkMode ? (
                      <svg
                        className="w-6 h-6"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 21a9 9 0 0 1-6.36-2.64C3.09 15.81 2 13 2 9.5 2 5.36 5.36 2 9.5 2c.9 0 1.78.12 2.6.34.82.22 1.6.56 2.28 1.02.68.46 1.24 1.08 1.68 1.8.44.72.78 1.56.98 2.46.2.9.3 1.82.3 2.78 0 3.5-2.54 6.43-5.99 7.6-1.5.53-3.09.8-4.73.8z" />
                      </svg>
                    ) : (
                      <svg
                        className="w-6 h-6"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z" />
                      </svg>
                    )}
                  </button>
                  <div className="md:hidden">
                    <button
                      onClick={() => setIsMenuOpen(!isMenuOpen)}
                      className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 focus:outline-none"
                      aria-label="Toggle mobile menu"
                    >
                      {isMenuOpen ? (
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 6h16M4 12h16M4 18h16"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {isMenuOpen && (
              <motion.div
                className="md:hidden bg-white dark:bg-gray-800 px-4 pt-2 pb-3 space-y-1"
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                transition={{ duration: 0.3 }}
              >
                <Link
                  className="block w-full text-left px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  href="/restaurants"
                >
                  Restaurants
                </Link>
                <Link
                  className="block w-full text-left px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  href="/retail"
                >
                  Retail
                </Link>
                <Link
                  className="block w-full text-left px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  href="/services"
                >
                  Services
                </Link>
                <Link
                  className="block w-full text-left px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  href="/online-ordering"
                >
                  Online Ordering
                </Link>
                <Link
                  className="block w-full text-left px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  href="/working-capital-funding"
                >
                  Working Capital Funding
                </Link>
                <Link
                  className="block w-full text-left px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  href="/poslineup"
                >
                  POS Systems
                </Link>
                <Link
                  className="block w-full text-left px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  href="/#contact"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact
                </Link>
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    toggleDarkMode();
                  }}
                  className="block w-full text-left px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Toggle Dark Mode
                </button>
              </motion.div>
            )}
          </motion.nav>

          {/* HERO SECTION */}
          <div className="pt-16">
            <div className="relative w-full h-[60vh] md:h-[65vh] flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-800/80 z-10"></div>
              <div className="absolute inset-0">
                <Image
                  src="/pos-hero-bg.jpg" 
                  alt="POS System in use"
                  fill
                  className="object-cover object-center"
                  priority
                />
              </div>
              <div className="relative z-20 max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">
                <div className="text-white">
                  <motion.span 
                    className="inline-block px-3 py-1 text-xs font-semibold bg-amber-500 text-gray-900 rounded-full mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                  >
                    CUTTING-EDGE TECHNOLOGY
                  </motion.span>
                  <motion.h1
                    className="text-3xl md:text-5xl font-bold mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    Transform Your Business with Modern POS Solutions
                  </motion.h1>
                  <motion.p
                    className="text-lg text-gray-100 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    Find the perfect point-of-sale system for your industry. Streamline operations, boost sales, and deliver exceptional customer experiences.
                  </motion.p>
                  <motion.div 
                    className="flex flex-wrap gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                  >
                    <a 
                      href="#pos-systems" 
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full shadow-lg transition-all"
                    >
                      Explore Systems
                    </a>
                    <Link 
                      href="/#contact" 
                      className="px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-medium rounded-full transition-all"
                    >
                      Request Expert Advice
                    </Link>
                  </motion.div>
                </div>
                <motion.div 
                  className="hidden md:block"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20">
                    <h3 className="text-white text-xl font-bold mb-4">Why Choose StarAccept POS?</h3>
                    <ul className="space-y-3">
                      {[
                        "Industry-specific solutions for every business type",
                        "Zero-fee processing options save you thousands",
                        "Seamless integration with all major payment platforms",
                        "24/7 local support from POS experts"
                      ].map((benefit, i) => (
                        <li key={i} className="flex items-start text-white">
                          <FaCheckCircle className="text-green-400 mt-1 mr-2 flex-shrink-0" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* INDUSTRY TABS */}
          <div className="bg-white dark:bg-gray-800 py-6 border-b border-gray-200 dark:border-gray-700 sticky top-16 z-30">
            <div className="max-w-6xl mx-auto px-4">
              <div className="flex overflow-x-auto pb-2 gap-2 -mx-2 px-2 scrollbar-hide">
                {industries.map((ind) => (
                  <button
                    key={ind.id}
                    onClick={() => setIndustry(ind.id)}
                    className={`flex items-center whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      industry === ind.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {ind.icon}
                    {ind.name}
                  </button>
                ))}
                <div className="ml-auto flex items-center">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                      showFilters 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    <FaFilter className="mr-2" />
                    Filter Options
                    <FaChevronDown className={`ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* SEARCH AND FILTERS */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 py-4"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="max-w-6xl mx-auto px-4">
                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Search Products
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaSearch className="text-gray-400" />
                        </div>
                        <input
                          id="search"
                          type="text"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          placeholder="Search for features, products..."
                          className="pl-10 pr-4 py-2 w-full border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        {searchTerm && (
                          <button 
                            onClick={() => setSearchTerm('')}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                          >
                            <FaTimes />
                          </button>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Product Category
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {categories.map((category) => (
                          <button
                            key={category.id}
                            onClick={() => setFilter(category.id)}
                            className={`flex items-center px-3 py-2 rounded-lg text-sm transition ${
                              filter === category.id
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                            }`}
                          >
                            {category.icon}
                            {category.name}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Active Filters
                      </label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {filter !== 'all' && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                            Category: {categories.find(c => c.id === filter)?.name}
                            <button 
                              onClick={() => setFilter('all')}
                              className="ml-1 text-blue-700 dark:text-blue-300 hover:text-blue-900 dark:hover:text-blue-100"
                            >
                              <FaTimes />
                            </button>
                          </span>
                        )}
                        {industry !== 'all' && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                            Industry: {industries.find(i => i.id === industry)?.name}
                            <button 
                              onClick={() => setIndustry('all')}
                              className="ml-1 text-blue-700 dark:text-blue-300 hover:text-blue-900 dark:hover:text-blue-100"
                            >
                              <FaTimes />
                            </button>
                          </span>
                        )}
                        {searchTerm && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                            Search: "{searchTerm}"
                            <button 
                              onClick={() => setSearchTerm('')}
                              className="ml-1 text-blue-700 dark:text-blue-300 hover:text-blue-900 dark:hover:text-blue-100"
                            >
                              <FaTimes />
                            </button>
                          </span>
                        )}
                      </div>
                      {(filter !== 'all' || industry !== 'all' || searchTerm) && (
                        <button
                          onClick={clearFilters}
                          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          Clear all filters
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* INDUSTRY-SPECIFIC VALUE PROPOSITIONS */}
          {industry !== 'all' && (
            <section className="relative w-full min-h-[60vh] flex items-center justify-center pt-24">
              <div className="max-w-6xl mx-auto px-4">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <motion.span 
                      className="inline-block px-3 py-1 text-xs font-semibold bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full mb-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {industries.find(i => i.id === industry)?.name} SOLUTIONS
                    </motion.span>
                    <motion.h2 
                      className="text-3xl font-bold mb-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      {industry === 'restaurant' && 'POS Systems Designed for Modern Restaurants'}
                      {industry === 'retail' && 'Retail POS Solutions That Drive Sales'}
                      {industry === 'service' && 'Service Business Solutions That Simplify Operations'}
                    </motion.h2>
                    <motion.p 
                      className="text-gray-600 dark:text-gray-400 mb-6"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      {industry === 'restaurant' && 'From quick-service to fine dining, our restaurant POS systems help you manage tables, split checks, process online orders, and keep your kitchen running smoothly.'}
                      {industry === 'retail' && 'Inventory management, customer loyalty programs, and fast checkout options that give your retail business the competitive edge it needs.'}
                      {industry === 'service' && 'Appointment scheduling, client management, and flexible payment options tailored to service-based businesses like salons, spas, and professional services.'}
                    </motion.p>
                    <motion.div 
                      className="grid md:grid-cols-2 gap-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      {industry === 'restaurant' && [
                        "Table Management",
                        "Kitchen Display Systems", 
                        "Online Ordering",
                        "Menu Management"
                      ].map((feature, i) => (
                        <div key={i} className="flex items-start">
                          <FaCheckCircle className="text-green-500 dark:text-green-400 mt-1 mr-2 flex-shrink-0" />
                          <span className="text-gray-800 dark:text-gray-200">{feature}</span>
                        </div>
                      ))}
                      {industry === 'retail' && [
                        "Inventory Management",
                        "Customer Loyalty", 
                        "Multi-Location Control",
                        "Sales Reporting"
                      ].map((feature, i) => (
                        <div key={i} className="flex items-start">
                          <FaCheckCircle className="text-green-500 dark:text-green-400 mt-1 mr-2 flex-shrink-0" />
                          <span className="text-gray-800 dark:text-gray-200">{feature}</span>
                        </div>
                      ))}
                      {industry === 'service' && [
                        "Appointment Scheduling",
                        "Client Profiles", 
                        "Service Packages",
                        "Staff Management"
                      ].map((feature, i) => (
                        <div key={i} className="flex items-start">
                          <FaCheckCircle className="text-green-500 dark:text-green-400 mt-1 mr-2 flex-shrink-0" />
                          <span className="text-gray-800 dark:text-gray-200">{feature}</span>
                        </div>
                      ))}
                    </motion.div>
                    <motion.div 
                      className="mt-8"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <Link
                        href="/#contact"
                        className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full shadow-md transition-all"
                      >
                        Get Industry-Specific Advice
                        <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </Link>
                    </motion.div>
                  </div>
                  <motion.div
                    className="relative h-80 bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                  >
                    <Image
                      src={
                        industry === 'restaurant' ? '/restaurant-pos.jpg' : 
                        industry === 'retail' ? '/retail-pos.jpg' : 
                        '/service-pos.jpg'
                      }
                      alt={`${industry} POS system`}
                      fill
                      className="object-cover"
                    />
                  </motion.div>
                </div>
              </div>
            </section>
          )}

          {/* SOCIAL PROOF */}
          <section className="py-16 bg-white dark:bg-gray-800">
            <div className="max-w-6xl mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Trusted by Thousands of Businesses</h2>
                <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                  Our POS systems help businesses of all sizes streamline operations, increase revenue, and deliver exceptional customer experiences.
                </p>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  {
                    name: "Michael Rodriguez",
                    business: "Urban Grill Restaurant",
                    image: "/testimonial1.jpg",
                    quote: "The restaurant POS system from StarAccept has transformed how we operate. Table management is seamless, and the kitchen display system has cut our ticket times by 30%.",
                    industry: "restaurant"
                  },
                  {
                    name: "Sarah Johnson",
                    business: "Boutique Retail Shop",
                    image: "/testimonial2.jpg",
                    quote: "Inventory management used to be our biggest headache until we switched to StarAccept. Now we can track everything in real-time across all our locations.",
                    industry: "retail"
                  },
                  {
                    name: "David Wilson",
                    business: "Executive Barber Shop",
                    image: "/testimonial3.jpg",
                    quote: "The appointment scheduling and client management features have allowed us to focus on our clients instead of paperwork. Our rebooking rate has increased by 40%.",
                    industry: "service"
                  }
                ].map((testimonial, index) => (
                  <motion.div
                    key={index}
                    className={`bg-gray-50 dark:bg-gray-700 p-6 rounded-xl shadow-sm ${
                      industry !== 'all' && testimonial.industry !== industry ? 'opacity-50' : ''
                    }`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: industry !== 'all' && testimonial.industry !== industry ? 0.5 : 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-600 overflow-hidden mr-4">
                        <div className="w-full h-full bg-blue-600 flex items-center justify-center text-white">
                          {testimonial.name.charAt(0)}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold">{testimonial.name}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.business}</p>
                      </div>
                    </div>
                    <div className="flex mb-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar key={star} className="text-amber-400 mr-1" />
                      ))}
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 italic">"{testimonial.quote}"</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* MAIN PRODUCT SECTION */}
          <div className="py-16 bg-gray-50 dark:bg-gray-900" id="pos-systems">
            <div className="max-w-6xl mx-auto px-4">
              <div className="text-center mb-12">
                <motion.span 
                  className="inline-block px-3 py-1 text-xs font-semibold bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  OUR PRODUCT LINEUP
                </motion.span>
                <motion.h2
                  className="text-3xl font-bold mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  What's your business type?
                </motion.h2>
                <motion.p
                  className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  Compare our comprehensive range of point-of-sale solutions designed to meet the unique needs of your business.
                </motion.p>
                {filteredProducts.length === 0 ? (
                  <div className="py-12 bg-white dark:bg-gray-800 rounded-xl">
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                      No products match your search criteria.
                    </p>
                    <button
                      onClick={clearFilters}
                      className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full"
                    >
                      Clear All Filters
                    </button>
                  </div>
                ) : (
                  <>
                    {filter === 'all' && industry === 'all' && !searchTerm && (
                      <div className="mb-16">
                        <h3 className="text-xl font-semibold mb-6">Popular POS System Comparison</h3>
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                            <thead>
                              <tr className="bg-gray-100 dark:bg-gray-700">
                                <th className="p-4 text-left">Features</th>
                                {featuredProducts.map(product => (
                                  <th key={product.identifier} className="p-4 text-center">
                                    <div className="flex flex-col items-center">
                                      <Image 
                                        src={product.image || '/default-pos.jpg'} 
                                        alt={product.name}
                                        width={80}
                                        height={80}
                                        className="object-contain mb-2"
                                      />
                                      <span className="font-semibold">{product.name}</span>
                                    </div>
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="border-t border-gray-200 dark:border-gray-700">
                                <td className="p-4 font-medium">Business Size</td>
                                {featuredProducts.map(product => (
                                  <td key={product.identifier} className="p-4 text-center">
                                    <span className="capitalize">{product.size}</span>
                                  </td>
                                ))}
                              </tr>
                              <tr className="border-t border-gray-200 dark:border-gray-700">
                                <td className="p-4 font-medium">Top Feature</td>
                                {featuredProducts.map(product => (
                                  <td key={product.identifier} className="p-4 text-center">
                                    {product.features[0]}
                                  </td>
                                ))}
                              </tr>
                              <tr className="border-t border-gray-200 dark:border-gray-700">
                                <td className="p-4 font-medium">Best For</td>
                                {featuredProducts.map(product => (
                                  <td key={product.identifier} className="p-4 text-center">
                                    {product.bestFor[0]}
                                  </td>
                                ))}
                              </tr>
                              <tr className="border-t border-gray-200 dark:border-gray-700">
                                <td className="p-4 font-medium">Action</td>
                                {featuredProducts.map(product => (
                                  <td key={product.identifier} className="p-4 text-center">
                                    <button
                                      onClick={() => scrollToProduct(product.identifier)}
                                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-sm"
                                    >
                                      View Details
                                    </button>
                                  </td>
                                ))}
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {filteredProducts.map((product, index) => (
                        <motion.div
                          key={product.identifier}
                          className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700 flex flex-col ${selectedProduct === product.identifier ? 'ring-2 ring-blue-500' : ''}`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05, duration: 0.5 }}
                          whileHover={{
                            y: -5,
                            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                            transition: { duration: 0.2 },
                          }}
                        >
                          {product.image && (
                            <div className="relative h-48 w-full bg-gray-50 dark:bg-gray-700 p-4">
                              <div className="absolute top-2 right-2 flex space-x-2 z-10">
                                <button
                                  onClick={() => toggleCompare(product.identifier)}
                                  className={`p-2 rounded-full ${compareList.includes(product.identifier) ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'}`}
                                  aria-label={`${compareList.includes(product.identifier) ? 'Remove from' : 'Add to'} comparison`}
                                >
                                  <FaExchangeAlt />
                                </button>
                              </div>
                              <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-contain p-2 cursor-pointer hover:scale-105 transition-transform"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                onClick={() => openImageModal(product.image!)}
                              />
                            </div>
                          )}
                          <div className="p-6 flex-grow">
                            <div className="flex justify-between items-start mb-3">
                              <h3 className="text-xl font-bold">{product.name}</h3>
                              <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                                {product.primaryCategory}
                              </span>
                            </div>
                            <div className="mb-1">
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                Size: <span className="capitalize font-medium">{product.size}</span>
                              </span>
                            </div>
                            <div className="mb-4">
                              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Best For:
                              </h4>
                              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                {product.bestFor.slice(0, 2).map((item, i) => (
                                  <li key={i} className="flex items-start">
                                    <FaCheckCircle className="text-green-500 dark:text-green-400 mt-1 mr-2 flex-shrink-0" />
                                    <span>{item}</span>
                                  </li>
                                ))}
                                {product.bestFor.length > 2 && (
                                  <li className="text-blue-600 dark:text-blue-400 pl-6">
                                    + {product.bestFor.length - 2} more
                                  </li>
                                )}
                              </ul>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Key Features:
                              </h4>
                              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                {product.features.slice(0, 3).map((feature, i) => (
                                  <li key={i} className="flex items-start">
                                    <FaCheckCircle className="text-green-500 dark:text-green-400 mt-1 mr-2 flex-shrink-0" />
                                    <span className="line-clamp-1">{feature}</span>
                                  </li>
                                ))}
                                {product.features.length > 3 && (
                                  <li className="text-blue-600 dark:text-blue-400 pl-6">
                                    + {product.features.length - 3} more features
                                  </li>
                                )}
                              </ul>
                            </div>
                          </div>
                          <div className="p-4 bg-gray-50 dark:bg-gray-700 mt-auto">
                            <div className="flex justify-between items-center">
                              <button
                                onClick={() => scrollToProduct(product.identifier)}
                                className="text-blue-600 dark:text-blue-400 text-sm hover:underline"
                              >
                                View Specifications
                              </button>
                              <button
                                onClick={() => window.location.href = '/#contact'}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-sm transition"
                              >
                                Request Quote
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* DETAILED PRODUCT INFORMATION SECTION */}
          <div ref={productDetailRef} className="scroll-mt-24 py-16 bg-white dark:bg-gray-800" id="product-details">
            {selectedProduct && (
              <div className="max-w-6xl mx-auto px-4">
                <h2 className="text-2xl font-bold mb-8 flex items-center">
                  <button 
                    onClick={() => setSelectedProduct(null)}
                    className="mr-2 p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    <FaArrowLeft />
                  </button>
                  Product Details
                </h2>
                {filteredProducts
                  .filter(product => product.identifier === selectedProduct)
                  .map(product => (
                    <motion.div
                      key={product.identifier}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4 }}
                      className="bg-gray-50 dark:bg-gray-700 rounded-xl overflow-hidden shadow-md"
                    >
                      <div className="md:flex">
                        <div className="md:w-2/5 p-6 bg-white dark:bg-gray-800 flex items-center justify-center">
                          {product.image && (
                            <div className="relative h-72 w-full">
                              <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-contain cursor-pointer hover:scale-105 transition-transform"
                                sizes="(max-width: 768px) 100vw, 40vw"
                                onClick={() => openImageModal(product.image!)}
                              />
                            </div>
                          )}
                        </div>
                        <div className="md:w-3/5 p-8">
                          <div className="flex flex-wrap gap-2 mb-4 items-center">
                            <h2 className="text-2xl font-bold">{product.name}</h2>
                            <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                              {product.primaryCategory}
                            </span>
                            <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded-full capitalize">
                              {product.size} size
                            </span>
                          </div>
                          <p className="text-gray-600 dark:text-gray-400 mb-6">
                            A versatile POS solution designed for {product.size}-sized businesses,
                            perfect for {product.bestFor.join(', ')}.
                          </p>
                          <div className="grid md:grid-cols-2 gap-8 mb-6">
                            <div>
                              <h3 className="text-lg font-semibold mb-3">
                                Best For
                              </h3>
                              <ul className="space-y-2">
                                {product.bestFor.map((item, i) => (
                                  <li key={i} className="flex items-start">
                                    <FaCheckCircle className="text-green-500 dark:text-green-400 mt-1 mr-2 flex-shrink-0" />
                                    <span className="text-gray-700 dark:text-gray-300">{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold mb-3">
                                Key Features
                              </h3>
                              <ul className="space-y-2">
                                {product.features.map((feature, i) => (
                                  <li key={i} className="flex items-start">
                                    <FaCheckCircle className="text-green-500 dark:text-green-400 mt-1 mr-2 flex-shrink-0" />
                                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                          <div className="mb-8">
                            <h3 className="text-lg font-semibold mb-3">
                              Industry Fit
                            </h3>
                            <div className="flex flex-wrap gap-2">
                              {product.searchTerms && product.searchTerms.industries ? (
                                product.searchTerms.industries.map((ind, i) => (
                                  <span 
                                    key={i} 
                                    className="px-3 py-1 bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-full text-sm"
                                  >
                                    {ind === 'restaurant' && 'Restaurants'}
                                    {ind === 'retail' && 'Retail'}
                                    {ind === 'service' && 'Service Businesses'}
                                  </span>
                                ))
                              ) : (
                                <span className="px-3 py-1 bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-full text-sm">
                                  All Industries
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                              href="/#contact"
                              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full transition-colors flex-1 text-center"
                            >
                              Request a Demo
                            </Link>
                            <button
                              onClick={() => toggleCompare(product.identifier)}
                              className={`px-6 py-3 rounded-full font-medium flex-1 flex items-center justify-center ${
                                compareList.includes(product.identifier)
                                  ? 'bg-gray-800 dark:bg-gray-600 text-white'
                                  : 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500'
                              }`}
                            >
                              <FaExchangeAlt className="mr-2" />
                              {compareList.includes(product.identifier) ? 'Remove from Compare' : 'Add to Compare'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* EDUCATIONAL SECTION */}
          <section className="py-16 bg-gray-50 dark:bg-gray-900 overflow-hidden">
            <div className="max-w-6xl mx-auto px-4">
              <div className="text-center mb-12">
                <motion.h2 
                  className="text-3xl font-bold mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  Choosing the Right POS System
                </motion.h2>
                <motion.p 
                  className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  We understand that selecting a POS system is a significant decision. Here's what to consider when making your choice.
                </motion.p>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  {
                    title: "Business Type & Size",
                    content: "Different industries have different POS needs. Restaurants need table management and kitchen display systems, while retail businesses need inventory management and customer loyalty programs.",
                    icon: <FaStore className="text-3xl text-blue-600 dark:text-blue-400" />
                  },
                  {
                    title: "Hardware Requirements",
                    content: "Consider the physical environment of your business. Do you need countertop stations, mobile devices, or self-service kiosks? The right hardware can streamline operations and enhance customer experience.",
                    icon: <FaDesktop className="text-3xl text-blue-600 dark:text-blue-400" />
                  },
                  {
                    title: "Integration Capabilities",
                    content: "Your POS should work seamlessly with your existing tools and software. Look for systems that integrate with accounting software, inventory management, and customer relationship management tools.",
                    icon: <FaExchangeAlt className="text-3xl text-blue-600 dark:text-blue-400" />
                  }
                ].map((item, index) => (
                  <motion.div 
                    key={index}
                    className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.2 }}
                  >
                    <div className="mb-4">
                      {item.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {item.content}
                    </p>
                  </motion.div>
                ))}
              </div>
              <div className="mt-12 text-center">
                <Link
                  href="/#contact"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full"
                >
                  Get Expert Advice
                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </section>

          {/* CALL TO ACTION */}
          <section className="py-16 bg-gradient-to-r from-blue-800 to-blue-600 text-white">
            <div className="max-w-6xl mx-auto px-4">
              <div className="md:flex items-center justify-between">
                <div className="mb-8 md:mb-0 md:w-2/3">
                  <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Business?</h2>
                  <p className="text-blue-100 max-w-xl">
                    Our team of POS experts is ready to help you find the perfect system for your business. 
                    Get a personalized demonstration and quote tailored to your specific needs.
                  </p>
                </div>
                <div>
                  <Link
                    href="/#contact"
                    className="inline-block px-8 py-4 bg-white text-blue-800 font-bold rounded-full hover:bg-blue-50 transition-colors shadow-lg"
                  >
                    Request Your Free Consultation
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* IMAGE MODAL */}
          <AnimatePresence>
            {selectedImage && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-90"
                onClick={closeImageModal}
              >
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.8 }}
                  className="relative max-w-4xl w-full max-h-[90vh] flex items-center justify-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={closeImageModal}
                    className="absolute top-4 right-4 z-10 text-white p-2 rounded-full bg-gray-800 hover:bg-gray-700"
                    aria-label="Close modal"
                  >
                    <FaTimes size={20} />
                  </button>
                  <div className="relative w-full h-full flex items-center justify-center">
                    <Image
                      src={selectedImage}
                      alt="Enlarged view"
                      width={800}
                      height={800}
                      className="max-w-full max-h-[80vh] object-contain"
                    />
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* COMPARISON DRAWER */}
          <AnimatePresence>
            {showCompare && compareList.length > 0 && (
              <motion.div
                className="fixed bottom-0 left-0 w-full bg-white dark:bg-gray-800 shadow-lg border-t border-gray-200 dark:border-gray-700 z-40"
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              >
                <div className="max-w-6xl mx-auto px-4 py-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold">Compare Products ({compareList.length}/3)</h3>
                    <div className="flex space-x-2">
                      {compareList.length >= 2 && (
                        <button
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
                          onClick={() => window.location.href = '/compare?ids=' + compareList.join(',')}
                        >
                          Compare Now
                        </button>
                      )}
                      <button
                        className="p-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg"
                        onClick={() => setShowCompare(false)}
                        aria-label="Close comparison drawer"
                      >
                        <FaTimes size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="flex space-x-4 overflow-x-auto pb-2">
                    {compareList.map(id => {
                      const product = posProducts.find(p => p.identifier === id);
                      if (!product) return null;
                      return (
                        <div key={id} className="flex-shrink-0 w-40 bg-gray-50 dark:bg-gray-700 rounded-lg p-3 relative">
                          <button
                            className="absolute -top-2 -right-2 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 rounded-full p-1"
                            onClick={() => toggleCompare(id)}
                            aria-label={`Remove ${product.name} from comparison`}
                          >
                            <FaTimes size={12} />
                          </button>
                          {product.image && (
                            <div className="relative h-24 w-full mb-2">
                              <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-contain"
                              />
                            </div>
                          )}
                          <h4 className="font-medium text-sm mb-1 line-clamp-1">{product.name}</h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                            {product.features[0]}
                          </p>
                        </div>
                      );
                    })}
                    {compareList.length < 3 && (
                      <div className="flex-shrink-0 w-40 bg-gray-50 dark:bg-gray-700 rounded-lg p-3 flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600">
                        <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                          Add {3 - compareList.length} more product{compareList.length === 2 ? '' : 's'} to compare
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* FOOTER */}
          <footer className="py-12 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
            <div className="max-w-6xl mx-auto px-4">
              <div className="grid md:grid-cols-4 gap-8 mb-8">
                <div>
                  <Image
                    src="/staracceptlogo.png"
                    alt="StarAccept"
                    width={150}
                    height={40}
                    className="mb-4 dark:brightness-150"
                  />
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    StarAccept provides cutting-edge POS systems and payment processing solutions for businesses of all sizes.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Industry Solutions</h3>
                  <ul className="space-y-2">
                    <li>
                      <Link href="/restaurants" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm">
                        Restaurant POS Systems
                      </Link>
                    </li>
                    <li>
                      <Link href="/retail" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm">
                        Retail POS Systems
                      </Link>
                    </li>
                    <li>
                      <Link href="/services" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm">
                        Service Business Solutions
                      </Link>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Products</h3>
                  <ul className="space-y-2">
                    <li>
                      <Link href="/poslineup" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm">
                        POS Systems
                      </Link>
                    </li>
                    <li>
                      <Link href="/online-ordering" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm">
                        Online Ordering
                      </Link>
                    </li>
                    <li>
                      <Link href="/working-capital-funding" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm">
                        Working Capital Funding
                      </Link>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Contact Us</h3>
                  <ul className="space-y-2">
                    <li className="text-gray-600 dark:text-gray-400 text-sm">
                      <strong>Phone:</strong> (888) 885-7333
                    </li>
                    <li className="text-gray-600 dark:text-gray-400 text-sm">
                      <strong>Email:</strong> support@staraccept.com
                    </li>
                  </ul>
                  <div className="mt-4">
                    <Link
                      href="/#contact"
                      className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-sm transition-colors"
                    >
                      Contact Us
                    </Link>
                  </div>
                </div>
              </div>
              <div className="pt-8 border-t border-gray-200 dark:border-gray-700 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  © {new Date().getFullYear()} Star Accept Business Solutions. All rights reserved.
                </p>
              </div>
            </div>
          </footer>
        </div>
      </main>
    </ThemeProvider>
  );
}
