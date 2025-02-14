"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { ThemeProvider, useTheme } from "../components/ThemeProvider";

export default function Retail() {
  const { darkMode, toggleDarkMode } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Scroll to top functionality
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) setShowScrollToTop(true);
      else setShowScrollToTop(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <ThemeProvider>
      <main className={darkMode ? "dark" : ""}>
        <div className="min-h-screen text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-900">
          <Head>
            <title>StarAccept for Retail</title>
            <meta
              name="description"
              content="Streamlined retail payment solutions that let you focus on growing your business."
            />
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
                      className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 cursor-pointer"
                      href="/restaurants"
                    >
                      Restaurants
                    </motion.a>
                    <motion.a
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-blue-600 dark:text-blue-400 font-semibold"
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
                      href="#contact"
                    >
                      Contact
                    </motion.a>
                  </div>
                </div>

                <div className="flex items-center">
                  {/* Back to Home (hidden on small screens) */}
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
                animate={{ height: "auto" }}
              >
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="block w-full text-left px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  href="/restaurants"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Restaurants
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="block w-full text-left px-3 py-2 font-semibold text-blue-600 dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  href="/retail"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Retail
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="block w-full text-left px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  href="/services"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Services
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="block w-full text-left px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  href="/working-capital-funding"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Working Capital
                </motion.a>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="block w-full text-left px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => {
                    setIsMenuOpen(false);
                    window.location.href = "/";
                  }}
                >
                  POS Wizard
                </motion.button>
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="block w-full text-left px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  href="#contact"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact
                </motion.a>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setIsMenuOpen(false);
                    toggleDarkMode();
                  }}
                  className="block w-full text-left px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Toggle Dark Mode
                </motion.button>
              </motion.div>
            )}
          </motion.nav>

          {/* HERO SECTION */}
          <section className="relative flex items-center justify-center w-full h-[75vh] md:h-[80vh] bg-gray-200 dark:bg-gray-700 mt-16">
            <Image
              src="/retailshop.jpg"
              alt="Retail Solutions"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/50" />
            <div className="relative z-10 max-w-4xl px-6 text-center text-white">
              <motion.h1
                className="mb-4 text-4xl md:text-5xl font-extrabold"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
              >
                Retail Payment Solutions that Let You Sell with Confidence
              </motion.h1>
              <motion.p
                className="text-lg md:text-xl mb-8 text-white/90"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                We make it simple for busy store owners, whether it’s your first boutique or your tenth franchise.
              </motion.p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  document.getElementById("details")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="px-8 py-3 bg-amber-500 rounded-full font-semibold hover:bg-amber-600 transition-colors"
              >
                Learn More
              </motion.button>
            </div>
          </section>

          {/* RETAIL FEATURES SECTION */}
          <section
            id="details"
            className="py-20 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
          >
            <div className="max-w-6xl px-4 mx-auto">
              <div className="mb-10 text-center">
                <h2 className="text-3xl font-bold">Let Us Handle the Heavy Lifting</h2>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  We integrate all your sales channels and set up your inventory so everything stays in sync.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <motion.div
                  className="order-2 lg:order-1 space-y-6"
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <h3 className="text-2xl font-semibold">
                    Clothing, Electronics, Convenience, or Multi-Location
                  </h3>
                  <p>
                    We help boutique owners build their first storefront and also assist large retailers expanding into new locations. Our platform ensures real-time updates across in-store and online purchases.
                  </p>
                  <p>
                    We integrate Shopify, WooCommerce, Amazon, and more into your POS and keep your inventory accurate, so you don’t have to.
                  </p>
                  <p>
                    We eliminate the hassle of juggling different systems and bring everything into a single, user-friendly dashboard.
                  </p>
                </motion.div>
                <motion.div
                  className="relative w-full h-[400px] order-1 lg:order-2"
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <Image
                    src="/retailinventory.jpg"
                    alt="Inventory Management"
                    fill
                    className="object-cover rounded-xl"
                  />
                </motion.div>
              </div>
            </div>
          </section>

          {/* ACCOUNTING & BARCODE SECTION */}
          <section className="py-20 bg-gray-50 dark:bg-gray-800">
            <div className="max-w-6xl px-4 mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <motion.div
                  className="relative w-full h-[400px]"
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <Image
                    src="/barcode-label.jpg"
                    alt="Barcode Printing"
                    fill
                    className="object-cover rounded-xl"
                  />
                </motion.div>
                <motion.div
                  className="space-y-6 text-gray-900 dark:text-white"
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <h3 className="text-2xl font-semibold">QuickBooks Sync & Barcode Solutions</h3>
                  <p>
                    Our automated accounting integrations send your sales data to QuickBooks, saving you from manual bookkeeping. We also provide barcode printing and label design tools that keep your store organized and help employees and shoppers find products faster.
                  </p>
                  <p>
                    Whether you’re importing inventory from another system or a simple handwritten ledger, we ensure a smooth transition with zero downtime.
                  </p>
                </motion.div>
              </div>
            </div>
          </section>

          {/* FAST DEPLOYMENT SECTION */}
          <section className="py-20 bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
            <div className="max-w-6xl px-4 mx-auto text-center">
              <h2 className="mb-4 text-3xl font-bold">Get Set Up in 1-2 Business Days</h2>
              <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300">
                From the moment you’re approved, we’ll get your system deployed and ready to run so you can focus on growing your business.
              </p>
              <motion.div
                className="mt-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <Link href="/#contact">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-3 bg-amber-500 rounded-full font-semibold hover:bg-amber-600 transition-colors"
                  >
                    Talk to a Retail Specialist
                  </motion.button>
                </Link>
              </motion.div>
            </div>
          </section>

          {/* CONTACT SECTION */}
          <section
            id="contact"
            className="py-20 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <div className="max-w-6xl px-4 mx-auto text-center">
              <h2 className="mb-4 text-3xl font-bold">Questions?</h2>
              <p className="max-w-2xl mx-auto mb-8 text-lg text-gray-600 dark:text-gray-300">
                Our team is ready to help you integrate StarAccept into your retail business.
              </p>
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="/#contact"
                className="inline-block px-8 py-3 bg-amber-500 rounded-full font-semibold hover:bg-amber-600 transition-colors text-white"
              >
                Contact Us
              </motion.a>
            </div>
          </section>

          {/* SCROLL TO TOP BUTTON */}
          {showScrollToTop && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={scrollToTop}
              className="fixed bottom-24 right-5 p-3 rounded-full bg-amber-500 text-white shadow-lg"
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
                  alt="StarAccept"
                  width={187.5}
                  height={50}
                  className="mx-auto transition-all duration-300 hover:brightness-110 dark:brightness-150"
                />
              </div>
              <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                © {new Date().getFullYear()} Star Accept Business Solutions. All rights reserved.
              </p>
            </div>
            <motion.div
              className="fixed bottom-0 left-0 w-full p-4 bg-amber-500 transition-transform"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ type: "spring", stiffness: 100 }}
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
