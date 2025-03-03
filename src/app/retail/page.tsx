"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { ThemeProvider, useTheme } from "../components/ThemeProvider";

/**
 * Retail Page – Optimized for Enhanced Digital Marketing
 *
 * Primary Changes:
 * - Consolidated three separate sections into one "All-in-One Retail Solutions" section.
 * - Introduced an interactive ROI Calculator to showcase potential savings and engage users.
 * - Removed repetitive or redundant elements, preserving key messaging in a streamlined layout.
 * - Maintained Hero, Navbar, and Footer sections per requirements.
 */

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

  // --- START: ROI Calculator State & Logic ---
  const [averageMonthlySales, setAverageMonthlySales] = useState<number>(5000);
  const [estimatedSavings, setEstimatedSavings] = useState<number>(0);

  // Simple ROI calculation: 
  // e.g., ~2% improved efficiency and additional cost savings in labor
  const calculateROI = () => {
    const savings = averageMonthlySales * 0.0399; // 3.99% assumption for demonstration
    setEstimatedSavings(parseFloat(savings.toFixed(2)));
  };

  useEffect(() => {
    calculateROI();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [averageMonthlySales]);
  // --- END: ROI Calculator State & Logic ---

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

          {/* NAVBAR (Preserved) */}
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
                  href="/#contact"
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

          {/* HERO SECTION (Preserved) */}
          <section className="relative w-full min-h-[60vh] flex items-center justify-center pt-24">
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

          {/*
            ----------------------------------------------------------------
            NEW CONSOLIDATED SECTION
            Combines:
              1) Let Us Handle the Heavy Lifting
              2) QuickBooks Sync & Barcode Solutions
              3) Get Set Up in 1-2 Business Days
            ----------------------------------------------------------------
          */}
          <section
            id="details"
            className="py-20 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
          >
            <div className="max-w-6xl px-4 mx-auto">
              {/* Top Heading & Subtext */}
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold">All-in-One Retail Solutions</h2>
                <p className="mt-2 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  Boost your store’s efficiency with streamlined inventory management, 
                  automated accounting, barcode solutions, and a rapid setup to get you 
                  selling faster than ever.
                </p>
              </div>

              {/* Benefits and Image Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <motion.div
                  className="space-y-6 order-2 lg:order-1"
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <h3 className="text-2xl font-semibold">We Handle the Heavy Lifting</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                    <li>
                      <strong>Seamless Integrations:</strong> From Shopify to Amazon, keep all sales 
                      channels in sync and up to date.
                    </li>
                    <li>
                      <strong>Barcode & Label Printing:</strong> Improve checkout speed and reduce errors 
                      with professional-grade barcode solutions.
                    </li>
                    <li>
                      <strong>QuickBooks Sync:</strong> Automate your bookkeeping and eliminate manual data entry.
                    </li>
                    <li>
                      <strong>1-2 Business Day Deployment:</strong> Our experts will have you up and running 
                      with minimal downtime, so you can focus on growing your business.
                    </li>
                  </ul>
                  <motion.div
                    className="mt-4"
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
                </motion.div>

                {/* Image Display */}
                <motion.div
                  className="relative w-full h-[400px] order-1 lg:order-2"
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <Image
                    src="/retailinventory.jpg"
                    alt="Consolidated Retail Solutions"
                    fill
                    className="object-cover rounded-xl"
                  />
                </motion.div>
              </div>

              {/* ROI Calculator Section */}
              <div className="mt-20 max-w-3xl mx-auto bg-gray-100 dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                <h3 className="text-2xl font-semibold text-center mb-4">
                  Calculate Your Potential ROI
                </h3>
                <p className="text-center text-gray-700 dark:text-gray-300 mb-4">
                  Estimate how much you could save every month with StarAccept's 
                  integrated retail solutions.
                </p>
                <div className="flex flex-col items-center space-y-4">
                  <label className="flex flex-col w-full sm:w-2/3 text-gray-600 dark:text-gray-300">
                    Average Monthly Sales ($)
                    <input
                      type="number"
                      value={averageMonthlySales}
                      onChange={(e) => setAverageMonthlySales(+e.target.value)}
                      className="mt-1 px-4 py-2 border border-gray-300 rounded focus:outline-none 
                                 dark:text-gray-900"
                      min={0}
                      step={100}
                    />
                  </label>

                  <motion.div
                    className="text-center bg-white dark:bg-gray-700 p-4 rounded-xl w-full sm:w-2/3"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                  >
                    <p className="text-lg text-gray-700 dark:text-gray-200">
                      <strong>Estimated Monthly Savings:</strong> ${estimatedSavings}
                    </p>
                  </motion.div>
                </div>
              </div>
            </div>
          </section>

          {/* CONTACT SECTION (Preserved) */}
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
        © {new Date().getFullYear()} Star Accept Business Solutions.
        All rights reserved.
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
