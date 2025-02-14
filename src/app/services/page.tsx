"use client";
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ThemeProvider, useTheme } from '../components/ThemeProvider';
import Link from 'next/link';

export default function Retail() {
  const { darkMode, toggleDarkMode } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) setShowScrollToTop(true);
      else setShowScrollToTop(false);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <ThemeProvider>
      <main className={darkMode ? 'dark' : ''}>
        <div className="min-h-screen text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-900">
          <Head>
            <title>StarAccept for Retail</title>
            <meta
              name="description"
              content="Point-of-sale systems, inventory management, and seamless eCommerce integration for any retail environment."
            />
            <link rel="icon" href="/favicon.ico" />
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
                        alt="staraccept"
                        width={187.5}
                        height={50}
                        className="transition-all duration-300 hover:brightness-110 dark:brightness-150 cursor-pointer"
                        priority
                      />
                    </Link>
                  </motion.div>
                  <div className="hidden md:flex items-center text-sm space-x-4 ml-6">
                    <motion.a
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      href="/restaurants"
                      className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
                    >
                      Restaurants
                    </motion.a>
                    <motion.a
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      href="/retail"
                      className="text-blue-600 dark:text-blue-400 font-semibold"
                    >
                      Retail
                    </motion.a>
                    <motion.a
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      href="/services"
                      className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
                    >
                      Services
                    </motion.a>
                    <motion.a
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      href="/online-ordering"
                      className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
                    >
                      Online Ordering
                    </motion.a>
                    <motion.a
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      href="/working-capital-funding"
                      className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
                    >
                      Working Capital
                    </motion.a>
                    <motion.a
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      href="#contact"
                      className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
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
                  >
                    <Link href="/">Back to Home</Link>
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
              >
                <a
                  href="/restaurants"
                  className="block w-full text-left px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Restaurants
                </a>
                <a
                  href="/retail"
                  className="block w-full text-left px-3 py-2 text-blue-600 dark:text-blue-400 font-semibold"
                >
                  Retail
                </a>
                <a
                  href="/services"
                  className="block w-full text-left px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Services
                </a>
                <a
                  href="/online-ordering"
                  className="block w-full text-left px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Online Ordering
                </a>
                <a
                  href="/working-capital-funding"
                  className="block w-full text-left px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Working Capital
                </a>
                <a
                  href="#contact"
                  className="block w-full text-left px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Contact
                </a>
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
          <div className="relative h-[70vh] w-full max-w-[1920px] mx-auto pt-24 flex items-center justify-center">
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              <Image
                src="/retail-hero.jpg"
                alt="Retail Hero"
                fill
                priority
                className="object-cover"
                quality={90}
              />
              <div className="absolute inset-0 z-10 bg-black/40"></div>
            </motion.div>
            <div className="absolute inset-0 flex items-center">
              <div className="relative z-20 max-w-4xl mx-auto px-4 text-white">
                <motion.h1
                  className="mb-6 text-4xl font-extrabold md:text-5xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  StarAccept for Retail
                </motion.h1>
                <motion.p
                  className="mb-8 text-lg md:text-2xl text-white/90"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Streamlined POS systems, inventory tracking, and online integration for any retail shop.
                </motion.p>
                <motion.a
                  href="#features"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-amber-500 text-white rounded-full font-semibold hover:bg-amber-600 transition-colors"
                >
                  Learn More
                </motion.a>
              </div>
            </div>
          </div>

          {/* FEATURES SECTION */}
          <section id="features" className="py-16 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white">
            <div className="max-w-6xl mx-auto px-4">
              <div className="max-w-3xl mx-auto mb-12 text-center">
                <h2 className="text-3xl font-bold mb-4">Built for Boutiques, Clothing Stores, and More</h2>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  Manage your entire product catalog, handle returns, and sync online with in-store sales for a seamless experience.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <motion.div
                  className="p-6 bg-white dark:bg-gray-700 rounded-xl shadow-sm"
                  whileHover={{ scale: 1.02 }}
                >
                  <Image
                    src="/retail-pos.jpg"
                    alt="POS System"
                    width={500}
                    height={300}
                    className="rounded w-full h-auto mb-4"
                  />
                  <h3 className="text-xl font-semibold mb-2">Intuitive POS</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Speedy checkout, custom receipts, and multiple payment options all in one place.
                  </p>
                </motion.div>
                <motion.div
                  className="p-6 bg-white dark:bg-gray-700 rounded-xl shadow-sm"
                  whileHover={{ scale: 1.02 }}
                >
                  <Image
                    src="/retail-inventory.jpg"
                    alt="Inventory Management"
                    width={500}
                    height={300}
                    className="rounded w-full h-auto mb-4"
                  />
                  <h3 className="text-xl font-semibold mb-2">Real-Time Inventory</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Track stock levels across multiple locations and sync seamlessly with eCommerce sites.
                  </p>
                </motion.div>
                <motion.div
                  className="p-6 bg-white dark:bg-gray-700 rounded-xl shadow-sm"
                  whileHover={{ scale: 1.02 }}
                >
                  <Image
                    src="/retail-ecommerce.jpg"
                    alt="Online Integration"
                    width={500}
                    height={300}
                    className="rounded w-full h-auto mb-4"
                  />
                  <h3 className="text-xl font-semibold mb-2">eCommerce Ready</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Connect with Shopify, WooCommerce, or custom online stores to unify all your sales data.
                  </p>
                </motion.div>
              </div>
            </div>
          </section>

          {/* SETUP SECTION */}
          <section className="py-16 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
            <div className="max-w-6xl mx-auto px-4 text-center">
              <h2 className="text-3xl font-bold mb-6">Deploy in 1-2 Days</h2>
              <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300 mb-6">
                Our team will have you set up quickly, whether you’re transitioning from an outdated system or starting new.
              </p>
            </div>
          </section>

          {/* CONTACT SECTION */}
          <section id="contact" className="py-16 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white">
            <div className="max-w-6xl mx-auto px-4">
              <div className="max-w-3xl mx-auto mb-8 text-center">
                <h2 className="text-3xl font-bold mb-4">Ready to Elevate Your Retail?</h2>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  Get in touch, and we’ll help tailor the perfect solution for your store.
                </p>
              </div>
              <div className="flex justify-center">
                <motion.a
                  href="/#contact"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-amber-500 text-white rounded-full font-semibold hover:bg-amber-600 transition-colors"
                >
                  Contact Us
                </motion.a>
              </div>
            </div>
          </section>

          {/* SCROLL TO TOP BUTTON */}
          {showScrollToTop && (
            <motion.button
              className="fixed bottom-24 right-4 p-3 bg-amber-500 text-white rounded-full shadow-md hover:bg-amber-600 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={scrollToTop}
            >
              ↑
            </motion.button>
          )}

          {/* FOOTER */}
          <footer className="py-12 bg-white dark:bg-gray-900 relative">
            <div className="max-w-6xl px-4 mx-auto text-center">
              <div className="mb-6">
                <Image
                  src="/staracceptlogo.png"
                  alt="staraccept"
                  width={187.5}
                  height={50}
                  className="mx-auto transition-all duration-300 hover:brightness-110 dark:brightness-150"
                />
              </div>
              <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                © {new Date().getFullYear()} StarAccept Business Solutions. All rights reserved.
              </p>
            </div>
            <motion.div
              className="fixed bottom-0 left-0 w-full p-4 bg-amber-500 transition-transform"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              transition={{ type: 'spring', stiffness: 100 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="max-w-6xl mx-auto flex items-center justify-center">
                <a
                  href="https://onboarding.tillpayments.com/signup/6748abe55b6362feca0a75f3"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-2 text-lg font-semibold text-white transition-colors rounded-full bg-gray-900 hover:bg-gray-800"
                  >
                    Apply Now
                  </motion.button>
                </a>
              </div>
            </motion.div>
          </footer>
        </div>
      </main>
    </ThemeProvider>
  );
}
