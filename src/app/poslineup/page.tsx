"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import {
  FaFilter,
  FaArrowLeft,
  FaSearch,
  FaTimes,
  FaChevronDown,
  FaShoppingCart,
  FaStore,
  FaUtensils,
  FaCut,
  FaClipboardCheck,
  FaStar,
  FaCheckCircle,
  FaMobileAlt,
  FaDesktop,
  FaWifi,
  FaTag,
} from 'react-icons/fa';
import { ThemeProvider, useTheme } from '../components/ThemeProvider';
import { posProducts } from '@/lib/posProducts';

export default function POSLineup() {
  const { darkMode, toggleDarkMode } = useTheme();

  // Basic state for search, filter, etc.
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<string>('all');

  // <-- REMOVED the "industry" state entirely
  // const [industry, setIndustry] = useState<string>('all');

  // For image magnification (modal)
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // For mobile nav menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // ----------------------------------------------------------------
  // CATEGORIES (these used to be hidden behind "Filter Options" only)
  // ----------------------------------------------------------------
  const categories = [
    { id: 'all', name: 'All Products', icon: <FaShoppingCart className="mr-2" /> },
    { id: 'pos', name: 'POS Systems', icon: <FaDesktop className="mr-2" /> },
    { id: 'mobile', name: 'Mobile Solutions', icon: <FaMobileAlt className="mr-2" /> },
    { id: 'peripheral', name: 'Peripherals', icon: <FaWifi className="mr-2" /> },
    { id: 'selfservice', name: 'Self-Service', icon: <FaClipboardCheck className="mr-2" /> },
  ];

  // ----------------------------------------------------------------
  // Instead of "industries," we just do the same search logic
  // for categories, ignoring the old "industry" filter entirely.
  // ----------------------------------------------------------------

  const filteredProducts = posProducts.filter((product) => {
    // Matches search
    const matchesSearch =
      searchTerm === '' ||
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.features.some((feature) =>
        feature.toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      product.bestFor.some((target) =>
        target.toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      (product.searchTerms &&
        product.searchTerms.keywords &&
        product.searchTerms.keywords.some((keyword) =>
          keyword.toLowerCase().includes(searchTerm.toLowerCase())
        ));

    // Matches category
    const matchesFilter = filter === 'all' || product.primaryCategory === filter;

    return matchesSearch && matchesFilter;
  });

  // Image modal open/close
  const openImageModal = (imageSrc: string) => {
    setSelectedImage(imageSrc);
  };
  const closeImageModal = () => {
    setSelectedImage(null);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setFilter('all');
  };

  return (
    <ThemeProvider>
      <main className={darkMode ? 'dark' : ''}>
        {/* Match the same general BG and text colors from home page */}
        <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200">
          <Head>
            <title>POS Systems & Hardware | StarAccept Business Solutions</title>
            <meta
              name="description"
              content="Explore our comprehensive range of POS systems and payment hardware for restaurants, retail, and service businesses. Find the perfect solution to grow your business."
            />
            <meta
              name="keywords"
              content="POS systems, point of sale, payment hardware, Clover, restaurant POS, retail POS, service business POS"
            />
          </Head>

          {/* NAVBAR - Tweaked styling to match home page */}
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
                    <Link href="/" aria-label="StarAccept Home">
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
                    <Link
                      className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 cursor-pointer"
                      href="/restaurants"
                      aria-label="Go to Restaurants page"
                    >
                      Restaurants
                    </Link>
                    <Link
                      className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 cursor-pointer"
                      href="/retail"
                      aria-label="Go to Retail page"
                    >
                      Retail
                    </Link>
                    <Link
                      className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 cursor-pointer"
                      href="/services"
                      aria-label="Go to Services page"
                    >
                      Services
                    </Link>
                    <Link
                      className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 cursor-pointer"
                      href="/online-ordering"
                      aria-label="Go to Online Ordering page"
                    >
                      Online Ordering
                    </Link>
                    <Link
                      className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 cursor-pointer"
                      href="/working-capital-funding"
                      aria-label="Go to Working Capital Funding page"
                    >
                      Working Capital
                    </Link>
                    <Link
                      className="text-blue-600 dark:text-blue-400 font-semibold"
                      href="/poslineup"
                      aria-label="View All POS Systems"
                    >
                      POS Systems
                    </Link>
                    <Link
                      className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 cursor-pointer"
                      href="/#contact"
                      aria-label="Go to Contact section"
                    >
                      Contact
                    </Link>
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
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 21a9 9 0 0 1-6.36-2.64C3.09 15.81 2 13 2 9.5 2 5.36 5.36 2 9.5 2c.9 0 1.78.12 2.6.34.82.22 1.6.56 2.28 1.02.68.46 1.24 1.08 1.68 1.8.44.72.78 1.56.98 2.46.2.9.3 1.82.3 2.78 0 3.5-2.54 6.43-5.99 7.6-1.5.53-3.09.8-4.73.8z" />
                      </svg>
                    ) : (
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
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
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      ) : (
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                  className="block w-full text-left px-3 py-2 font-semibold text-blue-600 dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700"
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
          <div className="pt-20">
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
                    Find the perfect point-of-sale system for your business. Streamline operations, boost sales, and deliver exceptional customer experiences.
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
                        'Industry-specific solutions for every business type',
                        'Zero-fee processing options save you thousands',
                        'Seamless integration with all major payment platforms',
                        '24/7 local support from POS experts',
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

          {/*
            --------------------------------------------------------------------
            REPLACED the old "industry" row + "Filter Options" button with the
            categories row from your filter, displayed inline. This matches
            your request: "replace the 'All Industries' button section (as well
            as the 3 buttons to the right of it) with the filter's hidden buttons."
            --------------------------------------------------------------------
          */}
          <div className="bg-white dark:bg-gray-800 py-6 border-b border-gray-200 dark:border-gray-700 sticky top-16 z-30 mt-2">
            <div className="max-w-6xl mx-auto px-4">
              {/* Horizontal scroll, same style as your old industry row */}
              <div className="flex overflow-x-auto pb-2 gap-2 -mx-2 px-2 scrollbar-hide">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setFilter(cat.id)}
                    className={`flex items-center whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      filter === cat.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {cat.icon}
                    {cat.name}
                  </button>
                ))}
                {/* 
                  We REMOVE the filter toggle entirely since you no longer want
                  them "hidden" behind a button. The next lines are commented out.
                  
                  <div className="ml-auto flex items-center">
                    <button ...>Filter Options</button>
                  </div> 
                */}
              </div>
            </div>
          </div>

          {/* SEARCH BAR (Optional - Keep if you want people to search by name/features) */}
          <div className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 py-4">
            <div className="max-w-6xl mx-auto px-4">
              <div className="max-w-md mb-4">
                <label
                  htmlFor="search"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
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

              {/* Clear Filter Button if anything is active */}
              {(filter !== 'all' || searchTerm) && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Clear all filters
                </button>
              )}
            </div>
          </div>

      
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
                  POS System Lineup
                </motion.h2>
                <motion.p
                  className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  Explore our complete range of point-of-sale systems and hardware solutions designed for businesses of
                  all sizes.
                </motion.p>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
                  <p className="text-gray-500 dark:text-gray-400 mb-4">No products match your search criteria.</p>
                  <button
                    onClick={clearFilters}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full"
                  >
                    Clear All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredProducts.map((product, index) => (
                    <motion.div
                      key={product.identifier}
                      className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 flex flex-col"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.5 }}
                      whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    >
                      {/* Image */}
                      {product.image && (
                        <div className="relative h-48 w-full">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-contain p-2 cursor-pointer hover:opacity-90 transition-opacity"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            onClick={() => openImageModal(product.image!)}
                          />
                        </div>
                      )}
                      {/* Card Body */}
                      <div className="p-6 flex-grow">
                        <div className="flex justify-between items-start mb-2">
                          <h2 className="text-xl font-bold">{product.name}</h2>
                          <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 rounded-full">
                            {product.primaryCategory}
                          </span>
                        </div>

                        <div className="mb-4">
                          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Best For:</h3>
                          <ul className="text-sm text-gray-600 dark:text-gray-300 list-disc list-inside">
                            {product.bestFor.slice(0, 2).map((item, i) => (
                              <li key={i}>{item}</li>
                            ))}
                            {product.bestFor.length > 2 && <li>+ {product.bestFor.length - 2} more</li>}
                          </ul>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Key Features:</h3>
                          <ul className="text-sm text-gray-600 dark:text-gray-300 list-disc list-inside">
                            {product.features.slice(0, 3).map((feature, i) => (
                              <li key={i}>{feature}</li>
                            ))}
                            {product.features.length > 3 && (
                              <li>+ {product.features.length - 3} more features</li>
                            )}
                          </ul>
                        </div>
                      </div>
                      {/* Card Footer */}
                      <div className="p-4 bg-gray-50 dark:bg-gray-700 mt-auto">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500 dark:text-gray-300 capitalize">
                            {product.size} size
                          </span>
                          <button
                            onClick={() => {
                              const element = document.getElementById(`product-detail-${product.identifier}`);
                              element?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-sm transition"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* DETAILED PRODUCT INFORMATION */}
          <div className="max-w-6xl mx-auto px-4 space-y-16 mt-16">
            <h2 className="text-2xl font-bold text-center mb-8">Detailed Product Information</h2>
            {filteredProducts.map((product) => (
              <motion.div
                key={product.identifier}
                id={`product-detail-${product.identifier}`}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="md:flex">
                  {product.image && (
                    <div className="md:w-2/5 p-6">
                      <div className="relative h-64 md:h-80 w-full rounded-lg overflow-hidden">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-contain p-2 cursor-pointer hover:opacity-90 transition-opacity"
                          sizes="(max-width: 768px) 100vw, 40vw"
                          onClick={() => openImageModal(product.image!)}
                        />
                      </div>
                    </div>
                  )}

                  <div className="md:w-3/5 p-6">
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      <h2 className="text-2xl font-bold">{product.name}</h2>
                      <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 rounded-full">
                        {product.primaryCategory}
                      </span>
                      <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded-full capitalize">
                        {product.size} size
                      </span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 mb-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Best For</h3>
                        <ul className="space-y-1 text-gray-600 dark:text-gray-300 list-disc list-inside">
                          {product.bestFor.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-2">Key Features</h3>
                        <ul className="space-y-1 text-gray-600 dark:text-gray-300 list-disc list-inside">
                          {product.features.map((feature, i) => (
                            <li key={i}>{feature}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3 mt-6">
                      <Link
                        href="/#contact"
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition"
                      >
                        Request Information
                      </Link>
                      <Link
                        href="/"
                        className="px-6 py-3 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition"
                      >
                        Back to Home
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* EDUCATIONAL SECTION */}
          <section className="py-16 bg-gray-50 dark:bg-gray-900 overflow-hidden mt-16">
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
                  We understand that selecting a POS system is a significant decision. Here's what to consider when
                  making your choice.
                </motion.p>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  {
                    title: 'Business Type & Size',
                    content:
                      'Different industries have different POS needs. Restaurants need table management and kitchen display systems, while retail businesses need inventory management and loyalty programs.',
                    icon: <FaStore className="text-3xl text-blue-600 dark:text-blue-400" />,
                  },
                  {
                    title: 'Hardware Requirements',
                    content:
                      'Consider the physical environment of your business. Do you need countertop stations, mobile devices, or self-service kiosks? The right hardware can streamline operations and enhance customer experience.',
                    icon: <FaDesktop className="text-3xl text-blue-600 dark:text-blue-400" />,
                  },
                  {
                    title: 'Integration Capabilities',
                    content:
                      'Your POS should work seamlessly with your existing tools and software. Look for systems that integrate with accounting software, inventory management, and CRM tools.',
                    icon: <FaTag className="text-3xl text-blue-600 dark:text-blue-400" />,
                  },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.2 }}
                  >
                    <div className="mb-4">{item.icon}</div>
                    <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400">{item.content}</p>
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
                    Our team of POS experts is ready to help you find the perfect system. Get a personalized demo and quote tailored to your needs.
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

          {/* FOOTER */}
          <footer className="py-12 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-16">
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
                    StarAccept provides cutting-edge POS systems and payment processing solutions for businesses of all
                    sizes.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Industry Solutions</h3>
                  <ul className="space-y-2">
                    <li>
                      <Link
                        href="/restaurants"
                        className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm"
                      >
                        Restaurant POS Systems
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/retail"
                        className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm"
                      >
                        Retail POS Systems
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/services"
                        className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm"
                      >
                        Service Business Solutions
                      </Link>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Products</h3>
                  <ul className="space-y-2">
                    <li>
                      <Link
                        href="/poslineup"
                        className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm"
                      >
                        POS Systems
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/online-ordering"
                        className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm"
                      >
                        Online Ordering
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/working-capital-funding"
                        className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm"
                      >
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
