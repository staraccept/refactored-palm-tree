"use client";
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ThemeProvider, useTheme } from '../components/ThemeProvider'; // adjust path if needed
import Link from 'next/link';

export default function Restaurants() {
  const { darkMode, toggleDarkMode } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Scroll to top functionality
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show "Scroll to top" after scrolling 300px
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
            <title>StarAccept for Restaurants</title>
            <meta
              name="description"
              content="From napkin ideas to multiple locations, StarAccept streamlines ordering, third-party integrations, and accounting for restaurants."
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

                  <div className="hidden md:flex items-center text-sm space-x-4">
                    <motion.a
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-blue-600 dark:text-blue-400 font-semibold"
                      href="/restaurants"
                    >
                      Restaurants
                    </motion.a>
                    <motion.a
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 cursor-pointer"
                      href="/retail"
                    >
                      Retail
                    </motion.a>
                    <motion.a
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 cursor-pointer"
                      href="/services"
                    >
                      Services
                    </motion.a>
                    <motion.a
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 cursor-pointer"
                      href="/online-ordering"
                    >
                      Online Ordering
                    </motion.a>
                    <motion.a
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 cursor-pointer"
                      href="/working-capital-funding"
                    >
                      Working Capital
                    </motion.a>
                    <motion.a
                                                              whileHover={{ scale: 1.05 }}
                                                              whileTap={{ scale: 0.95 }}
                                                              className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 cursor-pointer"
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
                <a
                  href="/poslineup"
                  className="block w-full text-left px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  POS Systems
                </a>
                <a
                  className="block w-full text-left px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  href="/#contact"
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
          <section className="relative w-full min-h-[60vh] flex items-center justify-center pt-24">
            <Image
              src="/restaurant.jpg"
              alt="Restaurant Hero"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/50"></div>
            <div className="relative z-10 max-w-4xl mx-auto text-center text-white px-4">
              <motion.h1
                className="text-4xl md:text-5xl font-extrabold mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                StarAccept for Restaurants
              </motion.h1>
              <motion.p
                className="text-lg md:text-2xl text-white/90 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                From full service to coffee shops, we handle the heavy lifting—turning a napkin idea into a thriving business or scaling your 10th location seamlessly.
              </motion.p>
              <motion.button
                className="px-8 py-3 bg-amber-500 rounded-full font-semibold hover:bg-amber-600 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Learn More
              </motion.button>
            </div>
          </section>

          {/* FEATURES SECTION */}
          <section className="py-16 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white" id="features">
            <div className="max-w-6xl mx-auto px-4">
              <div className="mb-12 text-center">
                <h2 className="text-3xl font-bold mb-4">Built for Restaurants, Cafés, & Quick-Service</h2>
                <p className="text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
                  We integrate with Grubhub, Uber Eats, and DoorDash to unify all your orders in a single POS, sync sales and expenses with QuickBooks, and offer custom label printing for takeout cups, boba teas, or coffee cups.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <motion.div
                  className="p-6 bg-white dark:bg-gray-700 rounded-xl shadow-md"
                  whileHover={{ scale: 1.02 }}
                >
                  <Image
                    src="/table-service.jpg"
                    alt="Full Table Service"
                    width={400}
                    height={300}
                    className="rounded w-full h-auto mb-4"
                  />
                  <h3 className="text-xl font-semibold mb-2">Full Table Service</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Streamlined ordering, table mapping, and staff management for traditional dine-in restaurants.
                  </p>
                </motion.div>
                <motion.div
                  className="p-6 bg-white dark:bg-gray-700 rounded-xl shadow-md"
                  whileHover={{ scale: 1.02 }}
                >
                  <Image
                    src="/fast-counter.jpg"
                    alt="Fast Counter Service"
                    width={400}
                    height={300}
                    className="rounded w-full h-auto mb-4"
                  />
                  <h3 className="text-xl font-semibold mb-2">Quick/Counter Service</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Speedy checkouts, easy menu customization, and integrated online ordering for busy counters.
                  </p>
                </motion.div>
                <motion.div
                  className="p-6 bg-white dark:bg-gray-700 rounded-xl shadow-md"
                  whileHover={{ scale: 1.02 }}
                >
                  <Image
                    src="/coffee-shop.jpg"
                    alt="Coffee Shop"
                    width={400}
                    height={300}
                    className="rounded w-full h-auto mb-4"
                  />
                  <h3 className="text-xl font-semibold mb-2">Coffee Shops & Teahouses</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Customized label printing, loyalty programs, and efficient inventory tracking for drinks.
                  </p>
                </motion.div>
              </div>
            </div>
          </section>

          {/* INTEGRATION & LABELING SECTION */}
          <section className="py-16 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
            <div className="max-w-6xl mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <motion.div
                  className="order-2 md:order-1"
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="text-3xl font-bold mb-4">Third-Party Delivery & QuickBooks Sync</h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    No more juggling multiple tablets. We unify delivery services into our POS, and automatically sync sales and expenses with QuickBooks for a real-time business overview.
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    We also provide custom label printing options for takeout and beverages, ensuring brand consistency while keeping orders organized.
                  </p>
                </motion.div>
                <motion.div
                  className="order-1 md:order-2 relative w-full h-full"
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <Image
                    src="/online-ordering-integration.jpg"
                    alt="Online Ordering Integration"
                    width={800}
                    height={600}
                    className="rounded w-full h-auto"
                  />
                </motion.div>
              </div>
            </div>
          </section>

          {/* QUICK SETUP SECTION */}
          <section className="py-16 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white">
            <div className="max-w-6xl mx-auto px-4 text-center">
              <h2 className="text-3xl font-bold mb-6">Go Live in 1-2 Business Days</h2>
              <p className="max-w-3xl mx-auto text-lg text-gray-600 dark:text-gray-300 mb-6">
                We’ll get your restaurant’s system approved, deployed, and operational in as little as 1-2 days. Whether transferring from an older system or starting from scratch, our team ensures a smooth transition.
              </p>
            
            </div>
          </section>

          {/* NEW TESTIMONIALS SECTION */}
          <section className="py-16 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
            <div className="max-w-6xl mx-auto px-4">
              <div className="mb-10 text-center">
                <h2 className="text-3xl font-bold mb-2">What People Are Saying</h2>
                <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  Real restaurateurs share their experience with StarAccept.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <motion.div
                  className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-md"
                  whileHover={{ scale: 1.02 }}
                >
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    “StarAccept integrated all our online orders in one place, saving us hours of confusion. Our staff loves how straightforward it is.”
                  </p>
                  <div className="flex items-center space-x-3">
                   
                    <div>
                      <p className="text-sm font-semibold">Sarah Johnson</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Owner, Bella Bistro</p>
                    </div>
                  </div>
                </motion.div>
                <motion.div
                  className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-md"
                  whileHover={{ scale: 1.02 }}
                >
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    “I never imagined the setup would be so fast. In two days, we were fully operational, and the QuickBooks sync is a game-changer.”
                  </p>
                  <div className="flex items-center space-x-3">
                   
                    <div>
                      <p className="text-sm font-semibold">James Rodriguez</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Manager, Midtown Cafe</p>
                    </div>
                  </div>
                </motion.div>
                <motion.div
                  className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-md"
                  whileHover={{ scale: 1.02 }}
                >
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    “We run a busy coffee shop with crazy morning rushes. StarAccept’s label printing saves us from messed-up orders, and customers love the quick service!”
                  </p>
                  <div className="flex items-center space-x-3">
        
                    <div>
                      <p className="text-sm font-semibold">Linda W.</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Owner, Brew & Bloom</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* CONTACT SECTION */}
          <div
            className="relative px-4 py-20 bg-gradient-to-b from-gray-50 dark:from-gray-800 to-white dark:to-gray-900"
            id="contact"
          >
            <div className="max-w-6xl mx-auto">
              <div className="mb-12 text-center">
                <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">Talk to Our Restaurant Experts</h2>
                <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400">
                  Ready to optimize your restaurant’s workflow? Fill out our form or call us directly, and we’ll be in touch within 24 hours.
                </p>
              </div>
              <div className="flex justify-center">
                <motion.a
                  href="/#contact"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-4 px-8 py-3 bg-amber-500 text-white rounded-full font-semibold hover:bg-amber-600 transition-colors"
                >
                  Contact Us Today
                </motion.a>
              </div>
            </div>
          </div>

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
              <div className="flex flex-wrap items-center justify-center space-x-4">
                {/* Add any social links or disclaimers here */}
              </div>
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
