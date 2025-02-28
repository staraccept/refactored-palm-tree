"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Head from 'next/head';
import Image from 'next/image';
import {
  FaCheckCircle,
  FaClock,
  FaHandshake,
  FaPuzzlePiece,
  FaGlobe,
  FaCreditCard,
  FaCog,
  FaTools,
  FaLaptop,
  FaRegLightbulb,
  FaShieldAlt,
  FaHeadset,
  FaStar,
  FaChartLine,
  FaUsers,
  FaLock,
  FaBolt,
  FaMobileAlt
} from 'react-icons/fa';
import { ThemeProvider, useTheme } from '../components/ThemeProvider';
import { posProducts } from '@/lib/posProducts';
import { findRelatedProducts as localFindProducts } from '@/lib/posProducts';
import Link from 'next/link';

// Types and Initial Data
interface ProductSelectorData {
  businessType: string;
  softwareNeeds: string[];
  onlineOrdering: boolean;
  fullServicePosQty: number;
  barServicePosQty: number;
  miniPosQty: number;
  handheldPosQty: number;
  kitchenPrinterQty: number;
  kitchenDisplayQty: number;
  kioskQty: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  numLocationsChoice: string;
  numLocationsCustom: string;
  monthlyVolume: string;
}

interface PosProduct {
  name: string;
  image: string | null;
  features: string[];
  bestFor: string[];
  cta: string;
  identifier?: string;
}

const initialSelectorData: ProductSelectorData = {
  businessType: '',
  softwareNeeds: [],
  onlineOrdering: false,
  fullServicePosQty: 0,
  barServicePosQty: 0,
  miniPosQty: 0,
  handheldPosQty: 0,
  kitchenPrinterQty: 0,
  kitchenDisplayQty: 0,
  kioskQty: 0,
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  numLocationsChoice: '1',
  numLocationsCustom: '',
  monthlyVolume: '0-50K',
};

const initialContactFormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  callDate: '',
  preferredTime: '',
  businessType: '',
  numLocationsChoice: '1',
  numLocationsCustom: '',
  monthlyVolume: '0-50K',
};

// ---------------------------------------------------------------------------
// Utility code (no layout changes—same as you have now, just skip to main areas).
// ---------------------------------------------------------------------------

function matchRecommendedItem(recommendation: string): PosProduct {
  const recLower = recommendation.trim().toLowerCase();
  const matched = posProducts.find((p) => p.name.toLowerCase() === recLower) ||
    posProducts.find((p) => p.name.toLowerCase().includes(recLower) || recLower.includes(p.name.toLowerCase()));

  return matched || {
    name: recommendation,
    image: null,
    features: [],
    bestFor: [],
    cta: ''
  };
}

const sampleQueries = [
  "I own a coffee shop and need a fast checkout system",
  "I want a system that supports Apple Pay and QR codes",
  "I have two locations and need real-time inventory sync",
];

function AiSearchOverlay() {
  // ... your entire AiSearchOverlay code unchanged ...
  // (omitted here for brevity)
  return (
    // ...
    <> {/* Your AiSearchOverlay JSX code. */}</>
  );
}


// ---------------------------------------------------------------------------
// Main Page Component
// ---------------------------------------------------------------------------

export default function Home() {
  // 1) State & reducers for Wizard and Contact forms
  //    (unchanged - same as your original code)
  // -------------------------------------------------------------------------
  type SelectorAction =
    | { type: 'SET_BUSINESS_TYPE', payload: string }
    | { type: 'TOGGLE_SOFTWARE_NEED', payload: string }
    | { type: 'TOGGLE_ONLINE_ORDERING' }
    | { type: 'SET_QUANTITY', payload: { deviceType: keyof ProductSelectorData, value: number } }
    | { type: 'UPDATE_FIELD', payload: { name: keyof ProductSelectorData, value: string } }
    | { type: 'RESET_FORM' };

  const selectorReducer = (state: ProductSelectorData, action: SelectorAction): ProductSelectorData => {
    // ...unchanged logic...
    switch (action.type) {
      case 'SET_BUSINESS_TYPE':
        return {
          ...state,
          businessType: action.payload,
          softwareNeeds: action.payload === 'restaurant' ? ['full-service'] : [],
          onlineOrdering: false
        };
      case 'TOGGLE_SOFTWARE_NEED':
        return {
          ...state,
          softwareNeeds: state.softwareNeeds.includes(action.payload)
            ? state.softwareNeeds.filter(item => item !== action.payload)
            : [...state.softwareNeeds, action.payload]
        };
      case 'TOGGLE_ONLINE_ORDERING':
        return {
          ...state,
          onlineOrdering: !state.onlineOrdering
        };
      case 'SET_QUANTITY':
        return {
          ...state,
          [action.payload.deviceType]: Math.max(0, action.payload.value)
        };
      case 'UPDATE_FIELD':
        return {
          ...state,
          [action.payload.name]: action.payload.value
        };
      case 'RESET_FORM':
        return initialSelectorData;
      default:
        return state;
    }
  };

  type ContactAction =
    | { type: 'UPDATE_FIELD', payload: { name: keyof typeof initialContactFormData, value: string } }
    | { type: 'RESET_FORM' };

  const contactReducer = (state: typeof initialContactFormData, action: ContactAction) => {
    switch (action.type) {
      case 'UPDATE_FIELD':
        return {
          ...state,
          [action.payload.name]: action.payload.value
        };
      case 'RESET_FORM':
        return initialContactFormData;
      default:
        return state;
    }
  };

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [wizardStep, setWizardStep] = useState(1);
  const [selectorData, dispatchSelector] = React.useReducer(selectorReducer, initialSelectorData);
  const [contactFormData, dispatchContact] = React.useReducer(contactReducer, initialContactFormData);
  const [selectorSubmission, setSelectorSubmission] = useState({
    isLoading: false,
    status: 'idle' as 'idle' | 'success' | 'error',
    message: '',
  });
  const [contactSubmission, setContactSubmission] = useState({
    isLoading: false,
    status: 'idle' as 'idle' | 'success' | 'error',
    message: '',
  });

  const { darkMode, toggleDarkMode } = useTheme();

  // 2) Hero images carousel
  // -------------------------------------------------------------------------
  const images = [
    {
      src: '/retailflex3.png',
      alt: 'Flexible Payment Terminal',
      priority: true,
      quality: 85
    },
    {
      src: '/qsrduo2.png',
      alt: 'QSR Duo POS System',
      quality: 85
    },
    {
      src: '/retailmini3.png',
      alt: 'Retail Mini POS',
      quality: 85
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [images.length]);


  // 3) Form validations & helpers (unchanged)
  // -------------------------------------------------------------------------
  const validateForm = useCallback((step: number) => {
    // ...unchanged...
    let errors: string[] = [];
    if (step === 1 && !selectorData.businessType) {
      errors.push('Please select a business type.');
    }
    if (step === 2) {
      if (selectorData.businessType === 'restaurant' && selectorData.softwareNeeds.length === 0) {
        errors.push('Please select whether your restaurant is Full-Service or Quick-Service.');
      }
    }
    if (step === 3) {
      const totalDevices =
        selectorData.fullServicePosQty +
        selectorData.barServicePosQty +
        selectorData.miniPosQty +
        selectorData.handheldPosQty +
        selectorData.kitchenPrinterQty +
        selectorData.kitchenDisplayQty +
        selectorData.kioskQty;
      if (totalDevices === 0) {
        errors.push('Please select at least one device or hardware option.');
      }
    }
    if (step === 4) {
      const { firstName, lastName, email, phone } = selectorData;
      if (!firstName) errors.push('First Name is required.');
      if (!lastName) errors.push('Last Name is required.');
      if (!email) errors.push('Email is required.');
      if (!phone) errors.push('Phone is required.');
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (email && !emailRegex.test(email)) {
        errors.push('Please enter a valid email address.');
      }
    }
    return {
      valid: errors.length === 0,
      message: errors.join(' ')
    };
  }, [selectorData]);

  const validateContactForm = useCallback(() => {
    // ...unchanged...
    let errors: string[] = [];
    const requiredFields = ['firstName', 'lastName', 'email', 'phone'];
    for (const field of requiredFields) {
      if (!contactFormData[field as keyof typeof contactFormData]) {
        errors.push(`${field.charAt(0).toUpperCase() + field.slice(1)} is required.`);
      }
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (contactFormData.email && !emailRegex.test(contactFormData.email)) {
      errors.push('Please enter a valid email address.');
    }
    return {
      valid: errors.length === 0,
      message: errors.join(' ')
    };
  }, [contactFormData]);


  // 4) Wizard step handlers
  // -------------------------------------------------------------------------
  const handleNextStep = useCallback(() => {
    const validation = validateForm(wizardStep);
    if (!validation.valid) {
      alert(validation.message);
      return;
    }
    setWizardStep((prev) => Math.min(prev + 1, 5));
  }, [wizardStep, validateForm]);

  const handlePreviousStep = useCallback(() => {
    setWizardStep((prev) => Math.max(prev - 1, 1));
  }, []);

  const handleSelectorInputChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    deviceType?: keyof ProductSelectorData
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    if (type === 'checkbox') {
      if (name === 'onlineOrdering') {
        dispatchSelector({ type: 'TOGGLE_ONLINE_ORDERING' });
        return;
      }
      dispatchSelector({ type: 'TOGGLE_SOFTWARE_NEED', payload: value });
      return;
    }
    if (deviceType) {
      dispatchSelector({
        type: 'SET_QUANTITY',
        payload: { deviceType, value: parseInt(value, 10) || 0 }
      });
      return;
    }
    dispatchSelector({
      type: 'UPDATE_FIELD',
      payload: { name: name as keyof ProductSelectorData, value }
    });
  }, []);

  const handleQuantityChange = useCallback((
    deviceType: keyof ProductSelectorData,
    increment: number
  ) => {
    const currentValue = selectorData[deviceType] as number;
    dispatchSelector({
      type: 'SET_QUANTITY',
      payload: { deviceType, value: Math.max(0, currentValue + increment) }
    });
  }, [selectorData]);

  const handleSelectorSubmit = useCallback(async () => {
    // ...unchanged...
    setSelectorSubmission({ isLoading: true, status: 'idle', message: '' });
    try {
      // Build query
      const {
        businessType,
        softwareNeeds,
        onlineOrdering,
        fullServicePosQty,
        barServicePosQty,
        miniPosQty,
        handheldPosQty,
        kitchenPrinterQty,
        kitchenDisplayQty,
        kioskQty,
        firstName,
        lastName,
        email,
        phone,
        numLocationsChoice,
        numLocationsCustom,
        monthlyVolume
      } = selectorData;
      const finalLocations = numLocationsChoice === 'plus' ? numLocationsCustom : numLocationsChoice;

      const params = new URLSearchParams({
        formType: 'contactPage',
        businessType,
        softwareNeeds: softwareNeeds.join(','),
        onlineOrdering: onlineOrdering ? 'yes' : 'no',
        fullServicePosQty: fullServicePosQty.toString(),
        barServicePosQty: barServicePosQty.toString(),
        miniPosQty: miniPosQty.toString(),
        handheldPosQty: handheldPosQty.toString(),
        kitchenPrinterQty: kitchenPrinterQty.toString(),
        kitchenDisplayQty: kitchenDisplayQty.toString(),
        kioskQty: kioskQty.toString(),
        firstName,
        lastName,
        email,
        phone,
        numLocations: finalLocations,
        monthlyVolume,
        submitTime: new Date().toISOString(),
      });

      const url = `https://hooks.zapier.com/hooks/catch/17465641/2awchwj/?${params.toString()}`;
      const response = await fetch(url, { method: 'GET' });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      setSelectorSubmission({
        status: 'success',
        message: "Thank you! We'll be in touch shortly to assist with your needs.",
        isLoading: false
      });
      dispatchSelector({ type: 'RESET_FORM' });
      setWizardStep(1);

    } catch (error) {
      console.error('Submission error:', error);
      setSelectorSubmission({
        status: 'error',
        message: 'Error submitting. Please try again or contact us.',
        isLoading: false,
      });
    }
  }, [selectorData]);

  // 5) Contact form submit
  // -------------------------------------------------------------------------
  const handleContactInputChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    dispatchContact({
      type: 'UPDATE_FIELD',
      payload: { name: name as keyof typeof initialContactFormData, value }
    });
  }, []);

  const handleContactSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmission({ isLoading: true, status: 'idle', message: '' });

    const validation = validateContactForm();
    if (!validation.valid) {
      setContactSubmission({
        isLoading: false,
        status: 'error',
        message: validation.message
      });
      return;
    }

    const finalLocations = contactFormData.numLocationsChoice === 'plus'
      ? contactFormData.numLocationsCustom
      : contactFormData.numLocationsChoice;

    try {
      const params = new URLSearchParams({
        firstName: contactFormData.firstName,
        lastName: contactFormData.lastName,
        email: contactFormData.email,
        phone: contactFormData.phone,
        callDate: contactFormData.callDate,
        preferredTime: contactFormData.preferredTime,
        businessType: contactFormData.businessType,
        numLocations: finalLocations,
        monthlyVolume: contactFormData.monthlyVolume,
        submitTime: new Date().toISOString(),
        formType: 'contactPage',
      });

      const url = `https://hooks.zapier.com/hooks/catch/17465641/2awchwj/?${params.toString()}`;
      const response = await fetch(url, { method: 'GET' });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      setContactSubmission({
        status: 'success',
        message: "Thank you! We'll be in touch shortly.",
        isLoading: false
      });
      dispatchContact({ type: 'RESET_FORM' });

    } catch (error) {
      console.error('Submission error:', error);
      setContactSubmission({
        status: 'error',
        message: 'Error submitting. Please try again or contact us.',
        isLoading: false
      });
    }
  }, [contactFormData, validateContactForm]);


  // 6) Wizard steps content
  // -------------------------------------------------------------------------
  const renderStepContent = useCallback(() => {
    // (Same wizard code you had, only difference is that the FAQ is no longer stuffed inside the wizard.)
    // ...unchanged content of steps 1-5...
    // (omitted here for brevity; keep all your step forms & logic the same)
    return (
      <> 
        {/* Insert your original switch/wizard steps code here */}
      </>
    );
  }, [
    // dependencies
  ]);

  const renderProgressIndicator = useCallback(() => {
    // ...unchanged code to display wizard steps progress...
    return (
      // your progress bar
      <></>
    );
  }, [wizardStep]);

  // 7) Smooth scroll function
  // -------------------------------------------------------------------------
  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  // -------------------------------------------------------------------------
  // RENDER
  // -------------------------------------------------------------------------

  return (
    <ThemeProvider>
      <main className={darkMode ? 'dark' : ''}>
        <div className={darkMode ? 'dark bg-gray-900 text-gray-100' : 'bg-white text-gray-800'}>
          <Head>
            <title>StarAccept Business Solutions - Merchant Processing & Payment Systems</title>
            <meta
              name="description"
              content="Get affordable, full-service credit card processing with proven, cutting-edge technology. Our zero-fee solutions transform your business with simplified payment processing."
            />
            <meta name="keywords" content="merchant processing, POS systems, credit card processing, payment solutions, Clover, zero-fee processing" />
            <meta property="og:title" content="StarAccept Business Solutions" />
            <meta property="og:description" content="Affordable, full-service credit card processing with proven, cutting-edge technology. Transform your business." />
            <meta property="og:image" content="/og-image.jpg" />
            <meta property="og:url" content="https://staraccept.com" />
            <meta name="twitter:card" content="summary_large_image" />
            <link rel="icon" href="/favicon.ico" />
          </Head>

          {/* 1) NAVBAR (unchanged) */}
          <motion.nav
            className="fixed top-0 z-50 w-full bg-white dark:bg-gray-800 shadow-sm bg-opacity-90 backdrop-blur-sm"
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ fontFamily: 'Inter, sans-serif' }}
            role="navigation"
            aria-label="Main Navigation"
          >
            {/* ...Your existing navbar content here (unchanged)... */}
            <div className="max-w-6xl px-2 mx-auto sm:px-4 lg:px-6">
              {/* ... */}
            </div>
            {/* Mobile menu if open, etc... */}
          </motion.nav>


          {/* 2) HERO (slightly simplified CTAs, removing the AI overlay) */}
          <div className="relative h-[85vh] w-full max-w-[1920px] mx-auto pt-24 flex items-center justify-center">
            {/* Carousel background */}
            <motion.div
              className="absolute inset-0 overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              <div className="relative w-full h-full max-w-[1920px] mx-auto">
                <Image
                  src={images[currentImage].src}
                  alt={images[currentImage].alt}
                  fill
                  priority={images[currentImage].priority}
                  className="object-cover"
                  quality={images[currentImage].quality}
                  sizes="100vw"
                />
                <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>
              </div>
            </motion.div>

            {/* Carousel pagination dots */}
            <div
              className="absolute z-20 flex space-x-2 transform -translate-x-1/2 bottom-8 left-1/2"
              role="tablist"
              aria-label="Image carousel controls"
            >
              {images.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all ${
                    currentImage === index ? 'bg-white w-8' : 'bg-white/50'
                  }`}
                  onClick={() => setCurrentImage(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  aria-selected={currentImage === index}
                  role="tab"
                  type="button"
                />
              ))}
            </div>

            {/* Hero text & CTAs */}
            <div className="absolute inset-0 flex items-center max-w-[1920px] mx-auto">
              <div className="relative z-20 max-w-6xl px-4 mx-auto mt-16">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="max-w-3xl text-white"
                >
                  <motion.h1
                    className="mb-6 text-4xl font-extrabold tracking-tight text-white md:text-5xl lg:text-6xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                  >
                    <span className="text-amber-400">Transform</span> Your Business <br />
                    With Next-Gen Payment Solutions
                  </motion.h1>
                  <motion.p
                    className="mb-6 text-xl text-white/90 md:text-2xl font-light leading-relaxed"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                  >
                    Seamless, Secure, and <span className="text-amber-400 font-semibold">Zero-Fee</span> Processing.
                    <br className="hidden md:block" />
                    Trusted by businesses globally.
                  </motion.p>

                  <motion.div
                    className="flex flex-wrap gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                  >
                    {/* Primary CTA → Wizard (a single big CTA) */}
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-8 py-4 text-lg font-semibold text-gray-900 bg-amber-500 rounded-full shadow-lg hover:bg-amber-400"
                      aria-label="Get Your Personalized Quote"
                      onClick={() => scrollToSection('product-selector')}
                    >
                      Get Your Personalized Quote
                    </motion.button>

                    {/* Secondary CTA → Contact */}
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-8 py-4 text-lg font-semibold text-white border-2 border-white rounded-full hover:bg-white/10"
                      onClick={() => scrollToSection('contact')}
                      aria-label="Talk to an Expert"
                    >
                      Talk to an Expert
                    </motion.button>
                  </motion.div>
                  {/* AI overlay REMOVED from here */}
                </motion.div>
              </div>
            </div>
          </div>


          {/* 3) SHORT INTRO / "Why StarAccept?" right under the Hero */}
          <section className="py-12 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
            <div className="max-w-6xl mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-6">Why StarAccept?</h2>
              <p className="max-w-3xl mx-auto text-center text-gray-600 dark:text-gray-400 mb-8">
                Our mission is simple: Empower businesses of all sizes with cutting-edge payment technology
                and transparent, affordable processing. Here’s why thousands choose us:
              </p>

              <div className="grid gap-8 md:grid-cols-3">
                {/* Example bullet points */}
                <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl shadow flex flex-col items-center text-center">
                  <FaShieldAlt className="text-4xl text-green-500 mb-4" />
                  <h3 className="font-semibold text-lg">Secure, Reliable Systems</h3>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                    99.99% uptime, top-tier encryption & round-the-clock monitoring.
                  </p>
                </div>
                <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl shadow flex flex-col items-center text-center">
                  <FaHeadset className="text-4xl text-blue-500 mb-4" />
                  <h3 className="font-semibold text-lg">24/7 Support</h3>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                    Always-on technical help. We’re here whenever you need us.
                  </p>
                </div>
                <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl shadow flex flex-col items-center text-center">
                  <FaRegLightbulb className="text-4xl text-amber-500 mb-4" />
                  <h3 className="font-semibold text-lg">Zero-Fee Option</h3>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                    Keep more of your revenue & reduce overhead with our popular surcharging program.
                  </p>
                </div>
              </div>
            </div>
          </section>


          {/* 4) AI SEARCH OVERLAY (moved below the short intro) */}
          <section className="py-8 bg-gray-100 dark:bg-gray-800">
            <div className="max-w-3xl mx-auto px-4">
              <AiSearchOverlay />
            </div>
          </section>


          {/* 5) STATS SECTION (“Businesses of All Sizes”) */}
          <section className="py-16 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 text-gray-900 dark:text-white">
            <div className="max-w-6xl mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-4">Businesses Of All Sizes</h2>
              <p className="text-center text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-12">
                Join thousands of merchants who’ve upgraded to our simpler, more affordable payment platform.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
                {/* ... your 5 stats blocks exactly as before ... */}
                <motion.div
                  className="flex flex-col items-center p-6 bg-white dark:bg-gray-700 rounded-xl shadow-md text-center"
                  whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <FaCheckCircle className="text-green-500 dark:text-green-400 text-4xl mb-2" aria-hidden="true" />
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white">99.99%</h3>
                  <p className="mt-2 text-gray-600 dark:text-gray-300">Uptime</p>
                </motion.div>
                {/* ... repeat for the other stats ... */}
              </div>
            </div>
          </section>


          {/* 6) FEATURED SOLUTIONS (formerly "Flexible Solutions") */}
          <section className="py-16 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-gray-100">
            <div className="max-w-6xl mx-auto px-4">
              <div className="mb-12 text-center">
                <span className="inline-block px-4 py-1 mb-4 text-sm font-medium text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-300 rounded-full">
                  All-in-One Platform
                </span>
                <h2 className="text-3xl font-bold mb-4">Flexible Solutions for Every Business</h2>
                <p className="mt-2 text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                  Powerful features and hardware options tailored to your unique business needs and growth stage.
                </p>
              </div>

              {/* Main grid with 5 icons */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                {/* ... same blocks: Payments, Software, Hardware, Applications, Tailored Solutions ... */}
                <motion.div
                  className="flex flex-col items-center text-center"
                  whileHover={{ y: -5 }}
                >
                  <div className="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4 shadow-sm">
                    <FaCreditCard className="text-blue-600 dark:text-blue-400 text-3xl" aria-hidden="true" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Payments</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Accept Apple Pay, Google Pay, QR codes, & more.
                  </p>
                </motion.div>
                {/* ... the others ... */}
              </div>

              {/* Zero-fee highlight (same code as your "Most Popular" block) */}
              <div className="mt-16 bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
                {/* ...the content for Zero-Fee Processing highlight... */}
              </div>
            </div>
          </section>


          {/* 7) TESTIMONIALS / SOCIAL PROOF */}
          <section className="py-20 bg-white dark:bg-gray-900">
            <div className="max-w-6xl mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">What Our Clients Say</h2>
                <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                  Don’t just take our word for it. Here’s what businesses like yours have experienced.
                </p>
              </div>

              {/* ...same 3 testimonial cards ... */}
              {/* Then a call-to-action button linking to wizard anchor */}
              <div className="text-center mt-12">
                <Link href="#product-selector">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.05, boxShadow: '0px 4px 20px rgba(59,130,246,0.3)' }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 text-lg font-semibold text-white bg-blue-600 rounded-full hover:bg-blue-700 shadow-md"
                    onClick={() => scrollToSection('product-selector')}
                  >
                    Personalized Payment Solution
                  </motion.button>
                </Link>
              </div>
            </div>
          </section>


          {/* 8) WIZARD (“Find Your Perfect Payment Solution”) */}
          <section className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900" id="product-selector">
            <div className="max-w-6xl px-4 mx-auto">
              <div className="mb-12 text-center">
                <span className="inline-block px-4 py-1 mb-4 text-sm font-medium text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-300 rounded-full">
                  Personalized Recommendation
                </span>
                <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
                  Find Your Perfect Payment Solution
                </h2>
                <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400">
                  Answer a few quick questions and we’ll match you with the ideal system for your specific needs.
                </p>
              </div>

              <div className="p-8 bg-white dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-2xl shadow-lg">
                {/* Wizard progress bar */}
                {renderProgressIndicator()}

                <AnimatePresence initial={false} mode="wait">
                  <motion.div
                    key={wizardStep}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.4, ease: 'easeInOut' }}
                    className="min-h-[400px]" 
                  >
                    {selectorSubmission.isLoading ? (
                      <div className="flex items-center justify-center h-64">
                        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    ) : (
                      renderStepContent()
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Prev/Next buttons (hide if at final step) */}
                {wizardStep < 5 && (
                  <div className="flex justify-between mt-8">
                    <motion.button
                      type="button"
                      onClick={handlePreviousStep}
                      disabled={wizardStep === 1}
                      className={`px-6 py-3 text-gray-600 dark:text-gray-300 rounded-full transition-colors ${
                        wizardStep === 1
                          ? 'opacity-50 cursor-not-allowed bg-gray-200 dark:bg-gray-600'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-600 bg-gray-100 dark:bg-gray-600'
                      }`}
                      whileHover={wizardStep !== 1 ? { scale: 1.05 } : undefined}
                      whileTap={wizardStep !== 1 ? { scale: 0.95 } : undefined}
                      aria-label="Go to previous step"
                    >
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                        Previous
                      </span>
                    </motion.button>

                    <motion.button
                      type="button"
                      onClick={handleNextStep}
                      disabled={wizardStep === 5}
                      className={`px-6 py-3 text-white bg-blue-600 dark:bg-blue-500 rounded-full transition-colors shadow-md ${
                        wizardStep === 5 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700 dark:hover:bg-blue-600'
                      }`}
                      whileHover={wizardStep !== 5 ? { scale: 1.05 } : undefined}
                      whileTap={wizardStep !== 5 ? { scale: 0.95 } : undefined}
                      aria-label="Go to next step"
                    >
                      <span className="flex items-center">
                        Next
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </motion.button>
                  </div>
                )}
              </div>
            </div>
          </section>


          {/* 9) FAQ SECTION (placed after Wizard to address objections) */}
          <section className="py-20 bg-white dark:bg-gray-900">
            <div className="max-w-6xl mx-auto px-4">
              <h3 className="mb-8 text-2xl font-bold text-center text-gray-900 dark:text-white">
                Frequently Asked Questions
              </h3>
              <div className="grid gap-6 md:grid-cols-2">
                {/* ... your 4 FAQ items ... */}
                <motion.div
                  className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl"
                  whileHover={{ y: -2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                >
                  <h4 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">How quickly can I start processing payments?</h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    Most merchants are approved within 24-48 hours and can begin processing immediately.
                  </p>
                </motion.div>
                {/* repeat the rest FAQ items */}
              </div>
            </div>
          </section>


          {/* 10) CONTACT SECTION */}
          <div className="relative px-4 py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800" id="contact">
            {/* ... your existing contact form code ... */}
            <div className="max-w-6xl mx-auto">
              {/* Title, form, direct contact info, etc... */}
              <div className="mb-12 text-center">
                <span className="inline-block px-4 py-1 mb-4 text-sm font-medium text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-300 rounded-full">
                  Get in Touch
                </span>
                <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">Ready to Get Started?</h2>
                <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400">
                  Talk to a payment expert today and discover how we can help your business grow.
                </p>
              </div>

              {/* Grid with form on left, "Why businesses choose us" on right, etc. */}
              {/* ... (same contact form logic + handleContactSubmit) ... */}
            </div>
          </div>


          {/* 11) FOOTER + pinned CTA */}
          <footer className="py-12 bg-white dark:bg-gray-900">
            <div className="max-w-6xl px-4 mx-auto">
              {/* Footer columns, disclaimers, etc. */}
              {/* ...same footer content ... */}

              <div className="pt-8 mt-8 border-t border-gray-200 dark:border-gray-700 text-center md:flex md:justify-between md:text-left">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  © {new Date().getFullYear()} Star Accept Business Solutions. All rights reserved.
                </p>
                <div className="mt-4 md:mt-0">
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    Terms • Privacy Policy • Accessibility
                  </p>
                </div>
              </div>
            </div>

            {/* Pinned CTA bar, full width at bottom (just keep your existing code) */}
            <motion.div
              className="fixed bottom-0 left-0 w-full p-4 bg-amber-500 transition-transform z-40"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              transition={{ type: 'spring', stiffness: 100 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between">
                <p className="text-gray-900 font-medium mb-2 md:mb-0">
                  Ready to eliminate credit card processing fees? Apply now and start saving!
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
        </div>
      </main>
    </ThemeProvider>
  );
}
