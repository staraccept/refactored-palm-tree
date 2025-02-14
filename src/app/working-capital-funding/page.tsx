"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { ThemeProvider, useTheme } from "../components/ThemeProvider"; // Adjust if needed
import {
  FaMoneyBillWave,
  FaCheckCircle,
  FaArrowRight,
  FaHandHoldingUsd
} from "react-icons/fa";

export default function WorkingCapitalFunding() {
  const { darkMode, toggleDarkMode } = useTheme();
  const [monthlyProcessing, setMonthlyProcessing] = useState(25000);
  const maxFunding = Math.round(monthlyProcessing * 2.5);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <ThemeProvider>
      <main className={darkMode ? "dark" : ""}>
        <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200">
          <Head>
            <title>Working Capital Funding | StarAccept</title>
            <meta
              name="description"
              content="Access up to 250% of your monthly processing volume with minimal requirements."
            />
            <link rel="icon" href="/favicon.ico" />
          </Head>

          {/* NAVBAR */}
          <motion.nav
            className="fixed top-0 z-50 w-full bg-white dark:bg-gray-800 shadow-sm bg-opacity-90 backdrop-blur-sm"
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ fontFamily: "Inter, sans-serif" }}
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

                  {/* Left Navigation Items */}
                  <div className="hidden md:flex items-center text-sm space-x-4">
                    <motion.a
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
                      href="/restaurants"
                    >
                      Restaurants
                    </motion.a>
                    <motion.a
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
                      href="/retail"
                    >
                      Retail
                    </motion.a>
                    <motion.a
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
                      href="/services"
                    >
                      Services
                    </motion.a>
                    <motion.a
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
                      href="/#online-ordering"
                    >
                      Online Ordering
                    </motion.a>
                    <motion.a
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-blue-600 dark:text-blue-400 font-semibold"
                      href="/working-capital-funding"
                    >
                      Working Capital
                    </motion.a>
                    <motion.a
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
                      href="/#contact"
                    >
                      Contact
                    </motion.a>
                  </div>
                </div>

                {/* Right side */}
                <div className="flex items-center">
                  {/* Dark Mode Toggle */}
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

                  {/* Mobile Menu Toggle */}
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
                  onClick={() => setIsMenuOpen(false)}
                >
                  Restaurants
                </Link>
                <Link
                  className="block w-full text-left px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  href="/retail"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Retail
                </Link>
                <Link
                  className="block w-full text-left px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  href="/services"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Services
                </Link>
                <a
                  className="block w-full text-left px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  href="/#online-ordering"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Online Ordering
                </a>
                <Link
                  className="text-blue-600 dark:text-blue-400 font-semibold"
                  href="/working-capital-funding"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Working Capital
                </Link>
                <a
                  className="block w-full text-left px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  href="/#contact"
                  onClick={() => setIsMenuOpen(false)}
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

          {/* HERO / INTRO */}
          <section className="relative w-full pt-24 pb-16 bg-gradient-to-br from-blue-50 to-white dark:from-gray-800 dark:to-gray-900">
            <div className="max-w-6xl px-4 mx-auto">
              <div className="text-center">
                <motion.h1
                  className="text-4xl md:text-5xl font-extrabold mb-6 text-gray-900 dark:text-white"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  Working Capital Funding
                </motion.h1>
                <motion.p
                  className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  Get up to 250% of your monthly processing volume, with no collateral and no minimum FICO. All you need is one month of processing history with us to get started.
                </motion.p>
              </div>

              <div className="mt-10 flex flex-wrap justify-center gap-8">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-col items-center text-center p-6 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl shadow-md"
                >
                  <FaHandHoldingUsd className="text-green-500 dark:text-green-400 text-5xl mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    No Collateral
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    Quick approvals without tying up your assets. We’ve made it hassle-free.
                  </p>
                </motion.div>
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex flex-col items-center text-center p-6 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl shadow-md"
                >
                  <FaCheckCircle className="text-blue-500 dark:text-blue-400 text-5xl mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    No Minimum FICO
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    We focus on your business performance, not a credit score.
                  </p>
                </motion.div>
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-col items-center text-center p-6 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl shadow-md"
                >
                  <FaArrowRight className="text-orange-500 dark:text-orange-400 text-5xl mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Just 1 Month History
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    Start building your eligibility in 30 days of processing with us.
                  </p>
                </motion.div>
              </div>
            </div>
          </section>

          {/* INTERACTIVE CALCULATOR */}
          <section className="py-16 bg-gray-100 dark:bg-gray-800">
            <div className="max-w-4xl mx-auto px-4 text-center">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                Funding Calculator
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                We base our funding on your monthly credit card processing. Enter or slide to see what you could qualify for.
              </p>

              <div className="flex flex-col items-center">
                <div className="mb-8 w-full max-w-xl">
                  <label
                    htmlFor="processingVolume"
                    className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Your Monthly Processing
                  </label>
                  <input
                    type="range"
                    id="processingVolume"
                    min="5000"
                    max="100000"
                    step="1000"
                    value={monthlyProcessing}
                    onChange={(e) => setMonthlyProcessing(Number(e.target.value))}
                    className="w-full cursor-pointer accent-blue-600"
                  />
                  <div className="mt-2 text-gray-900 dark:text-white font-semibold">
                    ${monthlyProcessing.toLocaleString()}
                  </div>
                </div>

                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="p-8 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl shadow-md w-full max-w-xl"
                >
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Up to 250% of Your Monthly Volume
                  </h3>
                  <div className="text-4xl font-bold text-amber-500">
                    ${maxFunding.toLocaleString()}
                  </div>
                  <p className="mt-2 text-gray-600 dark:text-gray-300">
                    This is an estimate of how much working capital you might access based on the slider above.
                  </p>
                </motion.div>
              </div>
            </div>
          </section>

          {/* CTA SECTION */}
          <section className="py-16 bg-white dark:bg-gray-900">
            <div className="max-w-5xl mx-auto px-4 text-center">
              <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-6">
                Ready to secure the funding your business deserves?
              </h2>
              <p className="text-xl text-gray-700 dark:text-gray-300 mb-8">
                Reach out to us directly. We’ll get the ball rolling so you can focus on growing your business.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <a href="/#contact" className="inline-block">
                  <motion.a
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  href="/#contact"
                                  className="inline-block px-8 py-3 bg-amber-500 rounded-full font-semibold hover:bg-amber-600 transition-colors text-white"
                                >
                                  Contact Us
                                </motion.a>
                </a>
              </div>
            </div>
          </section>

          {/* FOOTER */}
          <footer className="py-12 bg-gray-50 dark:bg-gray-800">
            <div className="max-w-6xl px-4 mx-auto text-center">
              <div className="mb-6 flex justify-center">
                <Image
                  src="/staracceptlogo.png"
                  alt="StarAccept"
                  width={187.5}
                  height={50}
                  className="transition-all duration-300 hover:brightness-110 dark:brightness-150"
                />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                © {new Date().getFullYear()} Star Accept Business Solutions. All rights reserved.
              </p>
            </div>

            {/* Optional pinned CTA for visual consistency, feel free to remove if undesired */}
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
