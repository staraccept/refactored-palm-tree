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

  /**
   * --------------------------------------------
   * State for the Interactive Fee Comparison
   * --------------------------------------------
   */
  // Default average order: $25
  const [orderAmount, setOrderAmount] = useState<number>(25);
  // Default aggregator fee: 30%
  const [aggregatorFee, setAggregatorFee] = useState<number>(30);

  // For display convenience:
  // "Traditional Third-Party" => Restaurant retains (100% - aggregatorFee%)
  // "StarAccept Strategy" => Restaurant recaptures 100% of the aggregator fee (implied pass-through).
  // So we show the difference visually.
  const aggregatorRetained = 100 - aggregatorFee; // e.g., 70% if fee is 30
  const starAcceptRetained = 100;                // 100% in the new strategy

  // Convert to actual dollar values for a single average order
  const aggregatorDollarRetained = (orderAmount * aggregatorRetained) / 100;
  const starAcceptDollarRetained = (orderAmount * starAcceptRetained) / 100;

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

          {/* NAVBAR (Unchanged) */}
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

          {/* HERO SECTION (Unchanged) */}
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
                From full service to coffee shops, we handle the heavy lifting—turning a napkin idea 
                into a thriving business or scaling your 10th location seamlessly.
              </motion.p>
              <motion.button
                className="px-8 py-3 bg-amber-500 rounded-full font-semibold hover:bg-amber-600 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => document.getElementById('restaurant-solutions')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Learn More
              </motion.button>
            </div>
          </section>

          {/* MERGED: All-in-One Restaurant Solutions */}
          <section
            id="restaurant-solutions"
            className="py-16 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <div className="max-w-6xl mx-auto px-4">
              <div className="mb-12 text-center">
                <h2 className="text-3xl font-bold mb-4">
                  All-in-One Restaurant Solutions
                </h2>
                <p className="text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
                  From robust dine-in features and quick counter service 
                  to seamless third-party delivery integration, StarAccept 
                  has everything you need to go live in as little as 1-2 days.
                </p>
              </div>
              {/* Key Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
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
                    Streamlined ordering, table mapping, and staff management for dine-in restaurants.
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
                    Speedy checkouts, easy menu customization, and integrated online ordering 
                    for busy counters.
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
                    Customized label printing, loyalty programs, 
                    and efficient inventory tracking for drinks.
                  </p>
                </motion.div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-12">
                <motion.div
                  className="order-2 md:order-1"
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="text-2xl font-bold mb-4">
                    Third-Party Delivery & QuickBooks Sync
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    No more juggling multiple tablets. We unify delivery services into a single POS, 
                    automatically syncing sales and expenses with QuickBooks for a real-time overview. 
                    Manage your entire restaurant operation under one system.
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    We also provide custom label printing for takeout and beverages, ensuring brand 
                    consistency and organization at all times.
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

              <div className="text-center bg-white dark:bg-gray-700 p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4">
                  Go Live in 1-2 Business Days
                </h2>
                <p className="max-w-3xl mx-auto text-gray-600 dark:text-gray-300 mb-4">
                  Get your restaurant’s system approved, deployed, and operational 
                  in as little as 1-2 days. Whether transferring from an older system 
                  or starting from scratch, our team ensures a seamless transition.
                </p>
                <motion.button
                  className="px-8 py-3 bg-amber-500 rounded-full font-semibold hover:bg-amber-600 transition-colors mt-4"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Get Started
                </motion.button>
              </div>
            </div>
          </section>

          {/* NEW: Take Control of Third-Party Costs */}
          <section className="py-16 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
            <div className="max-w-6xl mx-auto px-4">
              <div className="mb-10 text-center">
                <h2 className="text-3xl font-bold mb-2">Take Control of Third-Party Costs</h2>
                <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  Many popular online ordering and delivery platforms charge up to <strong>30%</strong> per order, 
                  eroding your margins. StarAccept’s integrated strategy can help you 
                  <strong> recapture that revenue entirely</strong>—all while keeping the ordering process 
                  convenient and transparent.
                </p>
              </div>

              {/*
                Side-by-Side Bar Comparison:
                "Traditional Third-Party" vs. "StarAccept Strategy"
                We'll use a slider input to represent the aggregator fee and order amount.
              */}
              <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                {/* User Inputs */}
                <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-md w-full md:w-1/2">
                  <label
                    className="block mb-2 text-sm font-semibold"
                    htmlFor="orderAmount"
                  >
                    Average Online Order Amount ($):
                  </label>
                  <input
                    id="orderAmount"
                    type="number"
                    value={orderAmount}
                    onChange={(e) => setOrderAmount(Number(e.target.value))}
                    className="w-full p-2 mb-4 rounded bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none"
                  />

                  <label
                    className="block mb-2 text-sm font-semibold"
                    htmlFor="aggregatorFee"
                  >
                    Typical Third-Party Fee (%):
                  </label>
                  <input
                    id="aggregatorFee"
                    type="number"
                    value={aggregatorFee}
                    onChange={(e) => setAggregatorFee(Number(e.target.value))}
                    className="w-full p-2 mb-4 rounded bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none"
                  />
                </div>

                {/* Visual Bars */}
                <div className="w-full md:w-1/2 flex flex-col space-y-6">
                  {/* Traditional Third-Party Bar */}
                  <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-md">
                    <h3 className="text-lg font-semibold mb-2">Traditional Third-Party</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                      You keep <strong>{aggregatorRetained}%</strong> of each order.
                    </p>

                    <div className="relative w-full bg-gray-300 dark:bg-gray-600 h-6 rounded-full overflow-hidden">
                      <motion.div
                        className="bg-red-500 h-6"
                        initial={{ width: 0 }}
                        animate={{ width: `${aggregatorRetained}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                      On an <strong>${orderAmount}</strong> order, you’d keep around 
                      <strong> ${aggregatorDollarRetained.toFixed(2)}</strong>.
                    </p>
                  </div>

                  {/* StarAccept Strategy Bar */}
                  <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-md">
                    <h3 className="text-lg font-semibold mb-2">StarAccept Strategy</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                      You recapture <strong>100%</strong> of your revenue.
                    </p>

                    <div className="relative w-full bg-gray-300 dark:bg-gray-600 h-6 rounded-full overflow-hidden">
                      <motion.div
                        className="bg-amber-500 h-6"
                        initial={{ width: 0 }}
                        animate={{ width: `100%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                      On an <strong>${orderAmount}</strong> order, you keep 
                      <strong> ${starAcceptDollarRetained.toFixed(2)}</strong>.
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-center mt-8">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-amber-500 rounded-full font-semibold hover:bg-amber-600 transition-colors"
                  onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Learn How
                </motion.button>
              </div>
            </div>
          </section>

          {/* CONTACT SECTION (Unchanged) */}
          <div
            className="relative px-4 py-20 bg-gradient-to-b from-gray-50 dark:from-gray-800 to-white dark:to-gray-900"
            id="contact"
          >
            <div className="max-w-6xl mx-auto">
              <div className="mb-12 text-center">
                <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
                  Talk to Our Restaurant Experts
                </h2>
                <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400">
                  Ready to optimize your restaurant’s workflow? Fill out our form or call us directly, 
                  and we’ll be in touch within 24 hours.
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

          <footer className="py-12 bg-white dark:bg-gray-900">
  <div className="max-w-6xl px-4 mx-auto">
    <div className="grid gap-8 md:grid-cols-4 mb-8">
      <div>
        <div className="mb-6">
          <Image
            src="/staracceptlogo.png"
            alt="StarAccept Logo"
            width={187.5}
            height={50}
            className="transition-all duration-300 hover:brightness-110 dark:brightness-150"
          />
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            StarAccept provides cutting-edge POS systems and payment
            processing solutions for businesses of all sizes.
          </p>
        </div>
      </div>
      <div>
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
          Industry Solutions
        </h3>
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
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
          Products
        </h3>
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
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
          Contact Us
        </h3>
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
            href="#contact"
            className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-sm transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>

    <div className="pt-8 mt-8 border-t border-gray-200 dark:border-gray-700 text-center md:flex md:justify-between md:text-left">
      <p className="text-sm text-gray-600 dark:text-gray-400">
        © {new Date().getFullYear()} Star Accept. Star Accept is a trade name of Star Network LLC. All rights reserved.
      </p>
      <div className="mt-4 md:mt-0">
        <p className="text-sm text-gray-500 dark:text-gray-500">
          Terms • Privacy Policy • Accessibility
        </p>
      </div>
    </div>
  </div>
  {/* Floating "Apply Now" Bar */}
  <motion.div
    className="fixed bottom-0 left-0 w-full p-4 bg-amber-500 transition-transform z-40"
    initial={{ y: '100%' }}
    animate={{ y: 0 }}
    transition={{ type: 'spring', stiffness: 100 }}
    whileHover={{ scale: 1.02 }}
  >
    <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between">
      <p className="text-gray-900 font-medium mb-2 md:mb-0">
        Ready to eliminate credit card processing fees? Apply now and
        start saving!
      </p>
      <a
        href="https://onboarding.tillpayments.com/signup/6748abe55b6362feca0a75f3"
        target="_blank"
        rel="noopener noreferrer"
      >
        <motion.button
          type="button"
          whileTap={{ scale: 0.95 }}
          className="px-6 py-2 text-lg font-semibold text-white transition-colors rounded-full bg-gray-900 hover:bg-gray-800 shadow-md"
        >
          Apply Now
        </motion.button>
      </a>
    </div>
  </motion.div>
</footer>

          {/* Scroll-to-Top Button (preserved functionality) */}
          {showScrollToTop && (
            <button
              onClick={scrollToTop}
              className="fixed bottom-24 right-4 p-3 bg-amber-500 text-white rounded-full shadow-lg hover:bg-amber-600 transition-colors"
            >
              ↑
            </button>
          )}
        </div>
      </main>
    </ThemeProvider>
  );
}
