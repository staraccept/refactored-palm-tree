"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { FaFilter, FaArrowLeft, FaSearch, FaTimes } from 'react-icons/fa';
import { ThemeProvider, useTheme } from '../components/ThemeProvider';
import { posProducts } from '@/lib/posProducts';

export default function POSLineup() {
  const { darkMode, toggleDarkMode } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // State for image magnification
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Filter categories
  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'pos', name: 'POS Systems' },
    { id: 'mobile', name: 'Mobile Solutions' },
    { id: 'peripheral', name: 'Peripherals' },
    { id: 'selfservice', name: 'Self-Service' },
  ];

  // Filter the products based on search term and category
  const filteredProducts = posProducts.filter(product => {
    const matchesSearch = searchTerm === '' || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.features.some(feature => feature.toLowerCase().includes(searchTerm.toLowerCase())) ||
      product.bestFor.some(target => target.toLowerCase().includes(searchTerm.toLowerCase())) ||
      product.searchTerms.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = filter === 'all' || product.primaryCategory === filter;
    
    return matchesSearch && matchesFilter;
  });

  // Function to open the image modal
  const openImageModal = (imageSrc: string) => {
    setSelectedImage(imageSrc);
  };

  // Function to close the image modal
  const closeImageModal = () => {
    setSelectedImage(null);
  };

  return (
    <ThemeProvider>
      <main className={darkMode ? 'dark' : ''}>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
          <Head>
            <title>POS System Lineup | StarAccept Business Solutions</title>
            <meta
              name="description"
              content="Explore our complete range of POS systems and hardware for restaurants, retail, and service businesses."
            />
          </Head>

          {/* NAVBAR - Matching the main site's navigation */}
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
                        alt="staraccept"
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
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="hidden md:inline-block text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 mr-4"
                    onClick={() => {
                      window.location.href = '/#product-selector';
                    }}
                  >
                    POS Wizard
                  </motion.button>
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
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      ) : (
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
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
                <button
                  className="block w-full text-left px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => {
                    setIsMenuOpen(false);
                    window.location.href = '/#product-selector';
                  }}
                >
                  POS Wizard
                </button>
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

          <div className="pt-24 pb-16 px-4 max-w-6xl mx-auto">
            {/* HEADER */}
            <div className="text-center mb-12">
              <motion.h1 
                className="text-3xl md:text-4xl font-bold mb-4"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                POS System Lineup
              </motion.h1>
              <motion.p 
                className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Explore our complete range of point-of-sale systems and hardware solutions 
                designed for businesses of all sizes and industries.
              </motion.p>
            </div>

            {/* SEARCH AND FILTER CONTROLS */}
            <div className="mb-8">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-1/2">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaSearch className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search for POS systems, features, etc."
                    className="pl-10 pr-4 py-2 w-full border rounded-full dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  />
                </div>
                <div className="flex w-full md:w-auto">
                  <button 
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full"
                  >
                    <FaFilter />
                    <span>Filter</span>
                  </button>
                </div>
              </div>

              {/* FILTER OPTIONS */}
              {showFilters && (
                <motion.div 
                  className="mt-4 p-4 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-md"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setFilter(category.id)}
                        className={`px-3 py-2 rounded-full text-sm transition ${
                          filter === category.id 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* PRODUCT GRID */}
            <div className="mb-12">
              {filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400">No products match your search criteria.</p>
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
                              <li key={i} className="truncate">{feature}</li>
                            ))}
                            {product.features.length > 3 && <li>+ {product.features.length - 3} more features</li>}
                          </ul>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-gray-50 dark:bg-gray-700 mt-auto">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {product.size.charAt(0).toUpperCase() + product.size.slice(1)} Size
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

            {/* DETAILED PRODUCT SECTIONS */}
            <div className="space-y-16 mt-16">
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
                        <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded-full">
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
          </div>

          {/* IMAGE MAGNIFICATION MODAL */}
          <AnimatePresence>
            {selectedImage && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-80"
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
          <footer className="py-12 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
            <div className="max-w-6xl mx-auto px-4 text-center">
              <Image
                src="/staracceptlogo.png"
                alt="StarAccept"
                width={150}
                height={40}
                className="mx-auto mb-4 dark:brightness-150"
              />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                © {new Date().getFullYear()} Star Accept Business Solutions. All rights reserved.
              </p>
              <div className="mt-6 flex justify-center space-x-6">
                <Link 
                  href="/" 
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Home
                </Link>
                <Link 
                  href="/#contact" 
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Contact
                </Link>
                <Link 
                  href="/restaurants" 
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Restaurants
                </Link>
                <Link 
                  href="/retail" 
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Retail
                </Link>
              </div>
            </div>
          </footer>
        </div>
      </main>
    </ThemeProvider>
  );
}