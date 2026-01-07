"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Head from 'next/head';
import Image from 'next/image';
import {
  FaCheckCircle,
  FaHandshake,
  FaPuzzlePiece,
  FaCreditCard,
  FaCog,
  FaLaptop,
  FaRegLightbulb,
  FaShieldAlt,
  FaHeadset,
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

// ------------------------
// Scroll Reveal Component (The "Gruvpay" Effect)
// ------------------------
const ScrollReveal = ({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string, delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-60px" }} // Triggers when element is 60px inside viewport
    transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98], delay: delay }} // Custom "spring-like" ease
    className={className}
  >
    {children}
  </motion.div>
);

// ------------------------
// Types and Initial Data
// ------------------------
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

// ------------------------
// Utility functions
// ------------------------
function matchRecommendedItem(recommendation: string): PosProduct {
  const recLower = recommendation.trim().toLowerCase();
  const matched =
    posProducts.find((p) => p.name.toLowerCase() === recLower) ||
    posProducts.find(
      (p) =>
        p.name.toLowerCase().includes(recLower) ||
        recLower.includes(p.name.toLowerCase())
    );

  return (
    matched || {
      name: recommendation,
      image: null,
      features: [],
      bestFor: [],
      cta: ''
    }
  );
}

const sampleQueries = [
  "I own a coffee shop and need a fast checkout system",
  "I want a system that supports Apple Pay and QR codes",
  "I have two locations and need real-time inventory sync",
];

// --------------------------------------------
// AI Search Overlay
// --------------------------------------------
function AiSearchOverlay() {
  const [currentSampleIndex, setCurrentSampleIndex] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [userQuery, setUserQuery] = useState("");
  const [searchState, setSearchState] = useState<{
    isLoading: boolean;
    recommendations: PosProduct[];
    errorMessage: string;
    showResults: boolean;
  }>({
    isLoading: false,
    recommendations: [],
    errorMessage: "",
    showResults: false
  });

  const typingSpeed = 80;
  const pauseAtEndOfSample = 2000;
  const cursorRef = useRef<HTMLSpanElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (cursorRef.current) {
      cursorRef.current.style.animation = "blink 1s infinite";
    }
  }, []);

  useEffect(() => {
    if (userQuery) return; 

    const text = sampleQueries[currentSampleIndex];

    const handleTyping = () => {
      if (!isDeleting && typedText.length < text.length) {
        setTypedText((prev) => prev + text.charAt(prev.length));
      } else if (isDeleting && typedText.length > 0) {
        setTypedText((prev) => prev.slice(0, -1));
      } else if (!isDeleting && typedText.length === text.length) {
        setTimeout(() => setIsDeleting(true), pauseAtEndOfSample);
      } else if (isDeleting && typedText.length === 0) {
        setIsDeleting(false);
        setCurrentSampleIndex((prev) => (prev + 1) % sampleQueries.length);
      }
    };

    const timer = setTimeout(
      handleTyping,
      isDeleting ? typingSpeed / 2 : typingSpeed
    );

    return () => clearTimeout(timer);
  }, [typedText, isDeleting, currentSampleIndex, userQuery]);

  const preprocessQuery = (query: string): string => {
    return query
      .toLowerCase()
      .replace(
        /i am a|i'm a|i need a|looking for|we are a|we need|i want|we want|i have a|we have a/gi,
        ''
      )
      .trim();
  };

  const fetchRecommendations = useCallback(async (query: string) => {
    if (!query) {
      setSearchState({
        isLoading: false,
        recommendations: [],
        errorMessage: "",
        showResults: false
      });
      return;
    }

    const processedQuery = preprocessQuery(query);

    setSearchState((prev) => ({
      ...prev,
      isLoading: true,
      errorMessage: "",
      showResults: true
    }));

    try {
      const res = await fetch("https://cold-bush-ec7b.pauljash.workers.dev/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: processedQuery }),
      });

      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`);
      }

      const data = await res.json();
      if (
        !data.recommendations ||
        !Array.isArray(data.recommendations) ||
        data.recommendations.length === 0
      ) {
        const fallbackProducts = localFindProducts(processedQuery, 3);
        if (fallbackProducts.length > 0) {
          setSearchState((prev) => ({
            ...prev,
            isLoading: false,
            recommendations: fallbackProducts
          }));
        } else {
          const genericFallback = localFindProducts('pos', 3);
          if (genericFallback.length > 0) {
            setSearchState((prev) => ({
              ...prev,
              isLoading: false,
              recommendations: genericFallback,
              errorMessage: "No exact matches. Here are our most popular systems:"
            }));
          } else {
            setSearchState((prev) => ({
              ...prev,
              isLoading: false,
              errorMessage: "No recommendations found for your query."
            }));
          }
        }
      } else {
        const matchedItems = data.recommendations.map((r: string) =>
          matchRecommendedItem(r)
        );
        if (
          matchedItems.every(
            (item: { name: string; features: string[] }) =>
              item.name && item.features.length > 0
          )
        ) {
          setSearchState((prev) => ({
            ...prev,
            isLoading: false,
            recommendations: matchedItems
          }));
        } else {
          const fallbackProducts = localFindProducts(processedQuery, 3);
          if (fallbackProducts.length > 0) {
            setSearchState((prev) => ({
              ...prev,
              isLoading: false,
              recommendations: fallbackProducts
            }));
          } else {
            const validMatchedItems = matchedItems.filter(
              (item: { name: string }) => item.name
            );
            if (validMatchedItems.length > 0) {
              setSearchState((prev) => ({
                ...prev,
                isLoading: false,
                recommendations: validMatchedItems
              }));
            } else {
              setSearchState((prev) => ({
                ...prev,
                isLoading: false,
                errorMessage: "Could not find suitable recommendations."
              }));
            }
          }
        }
      }
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      const query_str = typeof query === 'string' ? query : '';
      const fallbackProducts = localFindProducts(processedQuery, 3);

      if (fallbackProducts.length > 0) {
        setSearchState((prev) => ({
          ...prev,
          isLoading: false,
          recommendations: fallbackProducts
        }));
      } else {
        const defaultFallbacks = posProducts
          .filter((p) => p.identifier === 'mini3' || p.identifier === 'flex4')
          .slice(0, 2);

        setSearchState((prev) => ({
          ...prev,
          isLoading: false,
          recommendations: defaultFallbacks,
          errorMessage:
            "We couldn't process your request. Here are our most versatile options:"
        }));
      }
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (userQuery) {
        fetchRecommendations(userQuery);
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [userQuery, fetchRecommendations]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setSearchState((prev) => ({ ...prev, showResults: false }));
      }
    }
    function handleEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setSearchState((prev) => ({ ...prev, showResults: false }));
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  const handleInputFocus = useCallback(() => {
    if (userQuery || searchState.isLoading || searchState.errorMessage) {
      setSearchState((prev) => ({ ...prev, showResults: true }));
    }
  }, [userQuery, searchState.isLoading, searchState.errorMessage]);

  const { isLoading, recommendations, errorMessage, showResults } = searchState;

  return (
    <motion.div
      className="mx-auto mt-8 w-full max-w-3xl bg-white dark:bg-gray-800 rounded-2xl shadow-xl shadow-blue-900/10 p-6 relative border border-gray-100 dark:border-gray-700"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      ref={containerRef}
    >
      <div className="text-gray-500 dark:text-gray-400 mb-3 text-sm font-medium tracking-wide uppercase">
        AI Recommendation Engine
      </div>
      <div className="relative">
        <div className="absolute top-0 left-0 h-full flex items-center pl-4 pointer-events-none">
          <FaRegLightbulb className="text-amber-500" />
        </div>
        <input
          type="text"
          className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-100 rounded-xl text-gray-900 dark:text-gray-200 dark:bg-gray-700 dark:border-gray-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
          placeholder=""
          value={userQuery}
          onFocus={handleInputFocus}
          onChange={(e) => setUserQuery(e.target.value)}
          aria-label="Search for POS systems"
        />
        {!userQuery && (
          <div className="absolute top-0 left-12 h-full flex items-center pointer-events-none text-gray-400 dark:text-gray-500 text-lg truncate">
             {typedText}
            <span
              ref={cursorRef}
              className="border-r-2 border-blue-500 h-6 ml-1"
              aria-hidden="true"
            />
          </div>
        )}
      </div>

      <AnimatePresence>
        {showResults && (userQuery || isLoading || errorMessage) && (
          <motion.div
            className="absolute z-50 left-0 w-full mt-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl shadow-2xl p-6 max-h-[60vh] overflow-y-auto"
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            {isLoading && (
              <div className="flex items-center justify-center space-x-3 text-blue-600 py-8">
                <div
                  className="w-6 h-6 border-2 border-t-transparent border-blue-600 rounded-full animate-spin"
                  aria-hidden="true"
                ></div>
                <span className="font-medium">Analyzing your needs...</span>
              </div>
            )}

            {!isLoading && errorMessage && (
              <div
                className="text-amber-600 bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg mb-4"
                role="alert"
              >
                {errorMessage}
              </div>
            )}

            {!isLoading && recommendations.length > 0 && (
              <div className="space-y-6">
                {recommendations.map((item: PosProduct, idx: number) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex flex-col md:flex-row md:space-x-6 border-b border-gray-100 dark:border-gray-700 pb-6 last:border-none last:pb-0"
                  >
                    {item.image && (
                      <div className="md:w-1/4 mb-4 md:mb-0 flex-shrink-0 bg-gray-50 dark:bg-gray-700 rounded-lg p-2 flex items-center justify-center">
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={300}
                          height={300}
                          className="rounded object-contain h-32 w-auto"
                        />
                      </div>
                    )}
                    <div className="md:w-3/4">
                      <h4 className="font-bold text-gray-900 dark:text-white text-xl mb-2">
                        {item.name}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        {item.features && item.features.length > 0 && (
                          <div>
                            <h5 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Key Features</h5>
                            <ul className="space-y-1">
                              {item.features.slice(0, 3).map((feat: string, fIdx: number) => (
                                <li key={fIdx} className="text-sm text-gray-600 dark:text-gray-300 flex items-start">
                                  <FaCheckCircle className="text-green-500 mt-1 mr-2 flex-shrink-0 text-xs" />
                                  {feat}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                      <Link
                        href="/poslineup"
                        className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800 dark:text-blue-400"
                      >
                        {item.cta || "View Details"} &rarr;
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ---------------------------------------------------------
// MAIN HOME COMPONENT
// ---------------------------------------------------------
export default function Home() {
  // ------------------------
  // State Management (Unchanged)
  // ------------------------
  type SelectorAction =
    | { type: 'SET_BUSINESS_TYPE'; payload: string }
    | { type: 'TOGGLE_SOFTWARE_NEED'; payload: string }
    | { type: 'TOGGLE_ONLINE_ORDERING' }
    | { type: 'SET_QUANTITY'; payload: { deviceType: keyof ProductSelectorData; value: number } }
    | { type: 'UPDATE_FIELD'; payload: { name: keyof ProductSelectorData; value: string } }
    | { type: 'RESET_FORM' };

  const selectorReducer = (
    state: ProductSelectorData,
    action: SelectorAction
  ): ProductSelectorData => {
    switch (action.type) {
      case 'SET_BUSINESS_TYPE':
        return {
          ...state,
          businessType: action.payload,
          softwareNeeds:
            action.payload === 'restaurant' ? ['full-service'] : [],
          onlineOrdering: false
        };
      case 'TOGGLE_SOFTWARE_NEED':
        return {
          ...state,
          softwareNeeds: state.softwareNeeds.includes(action.payload)
            ? state.softwareNeeds.filter((item) => item !== action.payload)
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
    | {
        type: 'UPDATE_FIELD';
        payload: { name: keyof typeof initialContactFormData; value: string };
      }
    | { type: 'RESET_FORM' };

  const contactReducer = (
    state: typeof initialContactFormData,
    action: ContactAction
  ) => {
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
  const [selectorData, dispatchSelector] = React.useReducer(
    selectorReducer,
    initialSelectorData
  );
  const [contactFormData, dispatchContact] = React.useReducer(
    contactReducer,
    initialContactFormData
  );
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

  // Validation & Handlers (Unchanged logic)
  const validateForm = useCallback(
    (step: number) => {
      let errors: string[] = [];
      if (step === 1 && !selectorData.businessType) errors.push('Please select a business type.');
      if (step === 2 && selectorData.businessType === 'restaurant' && selectorData.softwareNeeds.length === 0) {
        errors.push('Please select whether your restaurant is Full-Service or Quick-Service.');
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
        if (totalDevices === 0) errors.push('Please select at least one device or hardware option.');
      }
      if (step === 4) {
        const { firstName, lastName, email, phone } = selectorData;
        if (!firstName) errors.push('First Name is required.');
        if (!lastName) errors.push('Last Name is required.');
        if (!email) errors.push('Email is required.');
        if (!phone) errors.push('Phone is required.');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email && !emailRegex.test(email)) errors.push('Please enter a valid email address.');
      }
      return { valid: errors.length === 0, message: errors.join(' ') };
    },
    [selectorData]
  );

  const validateContactForm = useCallback(() => {
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
    return { valid: errors.length === 0, message: errors.join(' ') };
  }, [contactFormData]);

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

  const handleSelectorInputChange = useCallback(
    (
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
    },
    []
  );

  const handleQuantityChange = useCallback(
    (deviceType: keyof ProductSelectorData, increment: number) => {
      const currentValue = selectorData[deviceType] as number;
      dispatchSelector({
        type: 'SET_QUANTITY',
        payload: { deviceType, value: Math.max(0, currentValue + increment) }
      });
    },
    [selectorData]
  );

  const handleSelectorSubmit = useCallback(async () => {
    setSelectorSubmission({ isLoading: true, status: 'idle', message: '' });
    try {
      const { numLocationsChoice, numLocationsCustom, ...rest } = selectorData;
      const finalLocations = numLocationsChoice === 'plus' ? numLocationsCustom : numLocationsChoice;
      const params = new URLSearchParams({
        formType: 'contactPage',
        ...rest as any,
        softwareNeeds: rest.softwareNeeds.join(','),
        onlineOrdering: rest.onlineOrdering ? 'yes' : 'no',
        numLocations: finalLocations,
        submitTime: new Date().toISOString()
      });

      const url = `https://hooks.zapier.com/hooks/catch/17465641/2awchwj/?${params.toString()}`;
      const response = await fetch(url, { method: 'GET' });

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

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
        isLoading: false
      });
    }
  }, [selectorData]);

  const handleContactInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      dispatchContact({
        type: 'UPDATE_FIELD',
        payload: { name: name as keyof typeof initialContactFormData, value }
      });
    },
    []
  );

  const handleContactSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmission({ isLoading: true, status: 'idle', message: '' });

    const validation = validateContactForm();
    if (!validation.valid) {
      setContactSubmission({ isLoading: false, status: 'error', message: validation.message });
      return;
    }

    const finalLocations = contactFormData.numLocationsChoice === 'plus' ? contactFormData.numLocationsCustom : contactFormData.numLocationsChoice;

    try {
      const params = new URLSearchParams({
        ...contactFormData,
        numLocations: finalLocations,
        submitTime: new Date().toISOString(),
        formType: 'contactPage'
      });

      const url = `https://hooks.zapier.com/hooks/catch/17465641/2awchwj/?${params.toString()}`;
      const response = await fetch(url, { method: 'GET' });

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

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

  // Wizard Steps & UI (Modified for Styling)
  const renderStepContent = useCallback(() => {
    switch (wizardStep) {
      case 1:
        return (
          <div className="text-gray-900 dark:text-white">
            <h3 className="mb-6 text-2xl font-bold">What type of business do you have?</h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {[
                { type: 'retail', title: 'Retail', img: '/retail.jpg', icon: FaCreditCard },
                { type: 'restaurant', title: 'Restaurant', img: '/restaurant.jpg', icon: FaCreditCard }, // Replace with specific icons if desired
                { type: 'services', title: 'Services', img: '/services.jpg', icon: FaHandshake },
                { type: 'other', title: 'Other', img: '/other.jpg', icon: FaPuzzlePiece }
              ].map((item) => (
                <motion.button
                  key={item.type}
                  whileHover={{ scale: 1.03, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => dispatchSelector({ type: 'SET_BUSINESS_TYPE', payload: item.type })}
                  className={`p-6 border-2 transition-all rounded-2xl flex flex-col items-center justify-center text-center h-full ${
                    selectorData.businessType === item.type
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:border-blue-500'
                      : 'border-gray-100 bg-white dark:bg-gray-800 dark:border-gray-700 hover:border-blue-200'
                  }`}
                  type="button"
                >
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 text-2xl ${
                      selectorData.businessType === item.type ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-300'
                  }`}>
                    {/* Placeholder icons since images might be missing */}
                    <item.icon />
                  </div>
                  <h4 className="text-lg font-bold">{item.title}</h4>
                </motion.button>
              ))}
            </div>
          </div>
        );
      case 2:
        if (selectorData.businessType === 'restaurant') {
          return (
            <div className="text-gray-900 dark:text-white">
              <h3 className="mb-6 text-2xl font-bold">What type of restaurant?</h3>
              <div className="space-y-4">
                {[
                  { id: 'full-service', label: 'Full-Service Dining', desc: 'Table management, coursing, tips.' },
                  { id: 'quick-service', label: 'Quick-Service', desc: 'Fast checkout, kiosk, counter service.' }
                ].map((option) => (
                  <motion.div
                    key={option.id}
                    className={`flex items-start p-6 border-2 rounded-2xl cursor-pointer transition-all ${
                      selectorData.softwareNeeds.includes(option.id)
                        ? 'bg-blue-50 border-blue-600 dark:bg-blue-900/30 dark:border-blue-500'
                        : 'bg-white border-gray-100 hover:border-gray-300 dark:bg-gray-800 dark:border-gray-700'
                    }`}
                    onClick={() => dispatchSelector({ type: 'TOGGLE_SOFTWARE_NEED', payload: option.id })}
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className={`mt-1 w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center ${
                        selectorData.softwareNeeds.includes(option.id) ? 'border-blue-600 bg-blue-600' : 'border-gray-300'
                    }`}>
                        {selectorData.softwareNeeds.includes(option.id) && <FaCheckCircle className="text-white text-sm"/>}
                    </div>
                    <div>
                        <h4 className="font-bold text-lg">{option.label}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{option.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          );
        }
        return (
          <div className="text-gray-900 dark:text-white">
            <h3 className="mb-6 text-2xl font-bold">Do you need online ordering?</h3>
            <motion.div
              className={`flex items-center p-6 border-2 rounded-2xl cursor-pointer transition-all ${
                selectorData.onlineOrdering
                  ? 'bg-blue-50 border-blue-600 dark:bg-blue-900/30 dark:border-blue-500'
                  : 'bg-white border-gray-100 hover:border-gray-300 dark:bg-gray-800 dark:border-gray-700'
              }`}
              onClick={() => dispatchSelector({ type: 'TOGGLE_ONLINE_ORDERING' })}
              whileHover={{ scale: 1.01 }}
            >
               <div className={`w-6 h-6 rounded border-2 mr-4 flex items-center justify-center ${
                    selectorData.onlineOrdering ? 'border-blue-600 bg-blue-600' : 'border-gray-300'
                }`}>
                    {selectorData.onlineOrdering && <FaCheckCircle className="text-white text-sm"/>}
                </div>
              <label className="cursor-pointer flex-grow font-bold text-lg">
                Yes, enable online ordering capabilities
              </label>
            </motion.div>
          </div>
        );
      case 3:
        return (
            <div className="text-gray-900 dark:text-white">
            <h3 className="mb-2 text-2xl font-bold">Select Your Hardware</h3>
            <p className="mb-6 text-gray-500">Configure your setup quantity.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {posProducts.map((product) => {
                let deviceType: keyof ProductSelectorData | null = null;
                switch (product.identifier) {
                  case "duo2": deviceType = "fullServicePosQty"; break;
                  case "solo": deviceType = "barServicePosQty"; break;
                  case "mini3": deviceType = "miniPosQty"; break;
                  case "flex4": deviceType = "handheldPosQty"; break;
                  case "starprinter": deviceType = "kitchenPrinterQty"; break;
                  case "kds": deviceType = "kitchenDisplayQty"; break;
                  case "kiosk": deviceType = "kioskQty"; break;
                }
                if (!deviceType) return null;
                const qtyVal = selectorData[deviceType] as number;

                return (
                  <motion.div
                    key={product.identifier}
                    className={`p-6 rounded-2xl border transition-all flex flex-col items-center ${
                        qtyVal > 0 ? 'border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/50 dark:bg-blue-900/20' : 'border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700'
                    }`}
                  >
                    <div className="h-40 w-full relative mb-4 flex items-center justify-center">
                        {/* Fallback if image fails or for design */}
                        {product.image ? (
                             <Image src={product.image} alt={product.name} width={200} height={200} className="object-contain max-h-full" />
                        ) : (
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center"><FaLaptop className="text-gray-300 text-3xl"/></div>
                        )}
                    </div>
                    <h4 className="text-lg font-bold mb-1 text-center">{product.name}</h4>
                    <div className="flex items-center mt-auto bg-gray-100 dark:bg-gray-700 rounded-full p-1">
                      <button type="button" onClick={() => handleQuantityChange(deviceType!, -1)} className="w-8 h-8 flex items-center justify-center bg-white dark:bg-gray-600 rounded-full shadow-sm text-gray-600 dark:text-gray-200 hover:text-blue-600">-</button>
                      <input
                        type="number"
                        className="w-12 text-center bg-transparent border-none font-bold text-lg"
                        value={qtyVal}
                        readOnly
                      />
                      <button type="button" onClick={() => handleQuantityChange(deviceType!, 1)} className="w-8 h-8 flex items-center justify-center bg-white dark:bg-gray-600 rounded-full shadow-sm text-gray-600 dark:text-gray-200 hover:text-blue-600">+</button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        );
      case 4:
         return (
             // Standard Contact Form Inputs... (simplified for brevity in this view, logic same as before)
             <div className="text-gray-900 dark:text-white max-w-2xl mx-auto">
                 <h3 className="mb-6 text-2xl font-bold text-center">Your Details</h3>
                 <div className="grid grid-cols-2 gap-4">
                     <input type="text" placeholder="First Name" name="firstName" value={selectorData.firstName} onChange={handleSelectorInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-800 dark:border-gray-700" />
                     <input type="text" placeholder="Last Name" name="lastName" value={selectorData.lastName} onChange={handleSelectorInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-800 dark:border-gray-700" />
                 </div>
                 <input type="email" placeholder="Email Address" name="email" value={selectorData.email} onChange={handleSelectorInputChange} className="w-full mt-4 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-800 dark:border-gray-700" />
                 <input type="tel" placeholder="Phone Number" name="phone" value={selectorData.phone} onChange={handleSelectorInputChange} className="w-full mt-4 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-800 dark:border-gray-700" />
                 
                 <div className="mt-6">
                     <label className="block text-sm font-bold mb-2">Number of Locations</label>
                     <div className="flex gap-2 flex-wrap">
                         {['1','2','3','4','5+'].map(opt => (
                              <button
                              key={opt}
                              type="button"
                              onClick={() => dispatchSelector({type: 'UPDATE_FIELD', payload: {name: 'numLocationsChoice', value: opt === '5+' ? 'plus' : opt}})}
                              className={`px-4 py-2 rounded-full border ${selectorData.numLocationsChoice === (opt === '5+' ? 'plus' : opt) ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 hover:border-blue-300'}`}
                             >{opt}</button>
                         ))}
                     </div>
                 </div>

                 <div className="mt-6">
                     <label className="block text-sm font-bold mb-2">Monthly Volume</label>
                     <div className="flex gap-2 flex-wrap">
                         {['0-50K', '50K-250K', '250K+'].map(vol => (
                              <button
                              key={vol}
                              type="button"
                              onClick={() => dispatchSelector({type: 'UPDATE_FIELD', payload: {name: 'monthlyVolume', value: vol}})}
                              className={`px-4 py-2 rounded-full border ${selectorData.monthlyVolume === vol ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 hover:border-blue-300'}`}
                             >{vol}</button>
                         ))}
                     </div>
                 </div>
             </div>
         );
      case 5:
        // Review Screen
        if (selectorSubmission.status === 'success') {
            return (
                <div className="text-center py-10">
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl"><FaCheckCircle /></div>
                    <h3 className="text-3xl font-bold mb-2">Request Received!</h3>
                    <p className="text-gray-500 mb-8">We are analyzing your needs and will contact you shortly.</p>
                    <button onClick={() => setWizardStep(1)} className="px-6 py-3 bg-gray-100 rounded-full font-bold">Start Over</button>
                </div>
            )
        }
        return (
            <div className="text-center py-10">
                <h3 className="text-2xl font-bold mb-4">Ready to Submit?</h3>
                <p className="text-gray-500 mb-8 max-w-md mx-auto">We have gathered your requirements. Click submit to receive your personalized quote.</p>
                <motion.button
                 whileHover={{ scale: 1.05 }}
                 whileTap={{ scale: 0.95 }}
                 onClick={handleSelectorSubmit}
                 disabled={selectorSubmission.isLoading}
                 className="px-8 py-4 bg-blue-600 text-white text-lg font-bold rounded-full shadow-lg hover:shadow-blue-500/30 transition-all"
                >
                    {selectorSubmission.isLoading ? 'Processing...' : 'Submit Request'}
                </motion.button>
            </div>
        )
      default:
        return null;
    }
  }, [wizardStep, selectorData, selectorSubmission, handleSelectorInputChange, handleQuantityChange, handleSelectorSubmit]);

  const renderProgressIndicator = useCallback(() => {
     return (
         <div className="flex justify-center mb-8 space-x-2">
             {[1,2,3,4,5].map(step => (
                 <div key={step} className={`h-2 rounded-full transition-all duration-300 ${step <= wizardStep ? 'w-8 bg-blue-600' : 'w-2 bg-gray-200'}`} />
             ))}
         </div>
     )
  }, [wizardStep]);

  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return (
    <ThemeProvider>
      <main className={darkMode ? 'dark' : ''}>
        <div className={`min-h-screen text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-900 font-sans selection:bg-blue-100`}>
          <Head>
            <title>StarAccept | Modern Payment Solutions</title>
            <meta name="description" content="Next-gen POS systems with zero fees." />
          </Head>

          {/* NAVBAR */}
          <motion.nav
  // Changed bg-white/80 to bg-white/90 for better contrast when scrolling down
  // But added specific logic for top of page if you want it transparent initially (optional)
  className="fixed top-0 z-50 w-full bg-white/95 dark:bg-slate-900/95 shadow-sm backdrop-blur-md border-b border-gray-100 dark:border-gray-800"
  initial={{ y: -100 }}
  animate={{ y: 0 }}
  transition={{ duration: 0.6 }}
>
            <div className="max-w-7xl px-4 mx-auto sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-20">
                <div className="flex items-center cursor-pointer" onClick={() => window.scrollTo(0,0)}>
                  <Image src="/staracceptlogo.png" alt="StarAccept" width={160} height={40} className="dark:brightness-200" />
                </div>
                <div className="hidden md:flex space-x-8 font-medium text-sm text-gray-600 dark:text-gray-300">
                    <Link href="/restaurants" className="hover:text-blue-600 transition-colors">Restaurants</Link>
                    <Link href="/retail" className="hover:text-blue-600 transition-colors">Retail</Link>
                    <Link href="/services" className="hover:text-blue-600 transition-colors">Services</Link>
                    <Link href="/poslineup" className="hover:text-blue-600 transition-colors">POS Hardware</Link>
                </div>
                <div className="flex items-center space-x-4">
                    <button onClick={toggleDarkMode} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                        {darkMode ? <FaRegLightbulb /> : <FaRegLightbulb className="text-gray-400"/>}
                    </button>
                    <button onClick={() => scrollToSection('contact')} className="hidden md:block px-5 py-2.5 bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold rounded-full text-sm hover:scale-105 transition-transform">
                        Get Started
                    </button>
                </div>
              </div>
            </div>
          </motion.nav>

          {/* HERO SECTION - REVISED (Vibrant & Immersive) */}
          <div className="relative h-screen w-full flex items-center justify-center overflow-hidden">
             
             {/* Background Image with Dark Overlay for Contrast */}
             <div className="absolute inset-0 z-0">
                <Image
                  src={images[currentImage].src} // This keeps your rotating images
                  alt="Hero"
                  fill
                  className="object-cover"
                  priority
                />
                {/* Dark Gradient Overlay: Makes text pop while keeping image visible */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent"></div>
             </div>

             <div className="relative z-10 w-full max-w-7xl px-6 pt-20">
                <motion.div
                    initial={{ opacity: 0, x: -30 }} // Slide in from left
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="max-w-3xl"
                >
                    <span className="inline-block py-1 px-3 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/50 text-sm font-bold tracking-wide mb-6 backdrop-blur-sm">
                        TRUSTED BY 10,000+ MERCHANTS
                    </span>
                    
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-white leading-tight drop-shadow-lg">
                        Simplify Payments. <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500">
                            Maximize Savings.
                        </span>
                    </h1>
                    
                    <p className="text-xl md:text-2xl text-gray-200 mb-10 max-w-2xl leading-relaxed drop-shadow-md">
                        Embrace secure, fast, and <span className="text-white font-bold">Zero-Fee</span> card processing with next-gen POS systems trusted by thousands of businesses.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row items-start gap-4">
                        <button 
                             onClick={() => scrollToSection('contact')}
                            className="px-8 py-4 bg-amber-500 text-slate-900 rounded-full font-bold text-lg shadow-xl shadow-amber-500/20 hover:bg-amber-400 hover:scale-105 transition-all transform"
                        >
                            Talk to an Expert
                        </button>
                        <button 
                            onClick={() => scrollToSection('product-selector')}
                            className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/30 text-white rounded-full font-bold text-lg hover:bg-white/20 transition-all"
                        >
                            View POS Systems
                        </button>
                    </div>
                </motion.div>
             </div>
          </div>

          {/* FEATURES GRID (The Scroll Reveal Section) */}
          <section className="py-24 bg-white dark:bg-slate-900">
             <div className="max-w-7xl mx-auto px-6">
                <ScrollReveal className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">Everything you need to grow</h2>
                    <p className="text-lg text-slate-500 max-w-2xl mx-auto">We handle the payments so you can focus on the passion.</p>
                </ScrollReveal>

                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        { icon: FaShieldAlt, title: "Bank-Grade Security", desc: "End-to-end encryption and PCI compliance keep your data safe." },
                        { icon: FaBolt, title: "Instant Setup", desc: "Get up and running in 24-48 hours with our plug-and-play systems." },
                        { icon: FaHandshake, title: "Zero Fees", desc: "Keep 100% of your profits with our compliant surcharge program." },
                        { icon: FaHeadset, title: "24/7 Support", desc: "Real humans, ready to help whenever you need us." },
                        { icon: FaPuzzlePiece, title: "300+ Integrations", desc: "Connects seamlessly with the tools you already use." },
                        { icon: FaChartLine, title: "Real-Time Data", desc: "Track sales, inventory, and staff performance from anywhere." }
                    ].map((feature, i) => (
                        <ScrollReveal key={i} delay={i * 0.1} className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-800/50 hover:bg-white border border-transparent hover:border-slate-100 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-300 group dark:hover:bg-slate-800 dark:hover:border-slate-700">
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 text-xl mb-6 group-hover:scale-110 transition-transform">
                                <feature.icon />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">{feature.title}</h3>
                            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{feature.desc}</p>
                        </ScrollReveal>
                    ))}
                </div>
             </div>
          </section>

          {/* ZERO FEE HIGHLIGHT - LARGE REVEAL */}
          <section className="py-24 bg-slate-50 dark:bg-slate-800 overflow-hidden">
              <div className="max-w-7xl mx-auto px-6">
                  <div className="grid lg:grid-cols-2 gap-16 items-center">
                      <ScrollReveal className="relative h-[500px] w-full bg-white dark:bg-slate-700 rounded-3xl shadow-2xl overflow-hidden p-8 flex items-center justify-center">
                          {/* Abstract decorative circles */}
                          <div className="absolute top-[-20%] right-[-20%] w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-3xl"></div>
                          <div className="absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-3xl"></div>
                          <Image src="/retailflex3.png" alt="Zero Fee" width={400} height={400} className="relative z-10 object-contain drop-shadow-2xl" />
                      </ScrollReveal>
                      
                      <ScrollReveal delay={0.2}>
                          <div className="inline-block px-4 py-1 rounded-full bg-amber-100 text-amber-700 font-bold text-sm mb-6">MOST POPULAR</div>
                          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
                              Stop paying for <br/> <span className="text-blue-600">credit card fees.</span>
                          </h2>
                          <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
                              Merchants lose 3-4% of their revenue to processing fees. Our Dual Pricing program automatically adjusts card prices to cover the cost, so you take home 100% of the sale price.
                          </p>
                          <ul className="space-y-4 mb-10">
                              {['Fully compliant with Visa/Mastercard', 'Transparent pricing for customers', 'Save $12,000+ per year on average'].map((item, i) => (
                                  <li key={i} className="flex items-center text-slate-700 dark:text-slate-200 font-medium">
                                      <FaCheckCircle className="text-green-500 mr-3 text-xl"/> {item}
                                  </li>
                              ))}
                          </ul>
                          <button onClick={() => scrollToSection('contact')} className="px-8 py-4 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-full font-bold hover:bg-slate-800 transition-colors">
                              Calculate Your Savings
                          </button>
                      </ScrollReveal>
                  </div>
              </div>
          </section>

          {/* WIZARD SECTION */}
          <section id="product-selector" className="py-24 bg-white dark:bg-slate-900 relative">
              <div className="max-w-4xl mx-auto px-6">
                  <ScrollReveal className="text-center mb-12">
                      <h2 className="text-3xl font-bold mb-4">Build Your Perfect Setup</h2>
                      <p className="text-slate-500">Answer 4 simple questions to get a custom quote.</p>
                  </ScrollReveal>
                  
                  <ScrollReveal delay={0.1}>
                    <div className="bg-white dark:bg-slate-800 rounded-[2rem] shadow-2xl shadow-blue-900/10 border border-slate-100 dark:border-slate-700 p-8 md:p-12">
                        {renderProgressIndicator()}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={wizardStep}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="min-h-[300px]"
                            >
                                {renderStepContent()}
                            </motion.div>
                        </AnimatePresence>

                        {wizardStep < 5 && (
                            <div className="flex justify-between mt-12 pt-8 border-t border-slate-100 dark:border-slate-700">
                                <button 
                                    onClick={handlePreviousStep}
                                    disabled={wizardStep === 1}
                                    className={`font-bold text-slate-500 hover:text-slate-800 disabled:opacity-30 disabled:cursor-not-allowed`}
                                >
                                    Back
                                </button>
                                <button
                                    onClick={handleNextStep}
                                    className="px-8 py-3 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all"
                                >
                                    Continue
                                </button>
                            </div>
                        )}
                    </div>
                  </ScrollReveal>
              </div>
          </section>

          {/* AI SEARCH */}
          <section className="py-24 bg-slate-50 dark:bg-slate-800/50">
              <div className="max-w-4xl mx-auto px-6 text-center">
                  <ScrollReveal>
                    <h2 className="text-3xl font-bold mb-4">Not sure what you need?</h2>
                    <p className="text-slate-500 mb-8">Ask our AI assistant to find the perfect hardware for your business.</p>
                    <AiSearchOverlay />
                  </ScrollReveal>
              </div>
          </section>

           {/* FAQ */}
           <section className="py-24 bg-white dark:bg-slate-900">
            <div className="max-w-5xl mx-auto px-6">
                <ScrollReveal className="text-center mb-16">
                    <h2 className="text-3xl font-bold">Common Questions</h2>
                </ScrollReveal>
                <div className="grid md:grid-cols-2 gap-8">
                    {[
                        { q: "How fast is funding?", a: "Next-day funding is standard. Same-day options available for eligible merchants." },
                        { q: "Is there a contract?", a: "No long-term contracts. We believe in earning your business every single month." },
                        { q: "Can I use my own iPad?", a: "Yes! For certain setups like Clover, you can integrate existing tablets." },
                        { q: "How does support work?", a: "You get a dedicated account manager plus 24/7 technical support." }
                    ].map((faq, i) => (
                        <ScrollReveal key={i} delay={i * 0.1} className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-800">
                            <h4 className="font-bold text-lg mb-2 text-slate-900 dark:text-white">{faq.q}</h4>
                            <p className="text-slate-600 dark:text-slate-400">{faq.a}</p>
                        </ScrollReveal>
                    ))}
                </div>
            </div>
           </section>

           {/* CONTACT SECTION */}
           <section id="contact" className="py-24 bg-slate-900 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-blue-600/10"></div>
                <div className="max-w-6xl mx-auto px-6 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16">
                        <ScrollReveal>
                            <h2 className="text-4xl md:text-5xl font-bold mb-6">Let's grow your business.</h2>
                            <p className="text-xl text-slate-300 mb-10">Fill out the form or give us a call. We'll analyze your current statement and show you exactly how much you'll save.</p>
                            
                            <div className="space-y-6">
                                <div className="flex items-center">
                                    <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 mr-4 text-xl"><FaMobileAlt/></div>
                                    <div>
                                        <p className="text-sm text-slate-400 font-bold uppercase tracking-wider">Call Us</p>
                                        <p className="text-xl font-bold">(888) 885-7333</p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 mr-4 text-xl"><FaLock/></div>
                                    <div>
                                        <p className="text-sm text-slate-400 font-bold uppercase tracking-wider">Secure & Private</p>
                                        <p className="text-lg">Your data is never shared.</p>
                                    </div>
                                </div>
                            </div>
                        </ScrollReveal>

                        <ScrollReveal delay={0.2}>
                            <form onSubmit={handleContactSubmit} className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-2xl text-slate-900 dark:text-white">
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="block text-sm font-bold mb-2">First Name</label>
                                        <input type="text" name="firstName" onChange={handleContactInputChange} value={contactFormData.firstName} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 rounded-xl border-none focus:ring-2 focus:ring-blue-500" required />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold mb-2">Last Name</label>
                                        <input type="text" name="lastName" onChange={handleContactInputChange} value={contactFormData.lastName} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 rounded-xl border-none focus:ring-2 focus:ring-blue-500" required />
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-bold mb-2">Email</label>
                                    <input type="email" name="email" onChange={handleContactInputChange} value={contactFormData.email} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 rounded-xl border-none focus:ring-2 focus:ring-blue-500" required />
                                </div>
                                <div className="mb-6">
                                    <label className="block text-sm font-bold mb-2">Phone</label>
                                    <input type="tel" name="phone" onChange={handleContactInputChange} value={contactFormData.phone} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 rounded-xl border-none focus:ring-2 focus:ring-blue-500" required />
                                </div>
                                <button disabled={contactSubmission.isLoading} className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-lg transition-colors">
                                    {contactSubmission.isLoading ? 'Sending...' : 'Get My Free Quote'}
                                </button>
                                {contactSubmission.status === 'success' && <p className="mt-4 text-green-600 text-center font-bold">Message Sent!</p>}
                            </form>
                        </ScrollReveal>
                    </div>
                </div>
           </section>

           {/* FOOTER */}
           <footer className="py-12 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 text-center">
               <p className="text-slate-500">© {new Date().getFullYear()} StarAccept. Built for growth.</p>
           </footer>

           {/* STICKY CTA */}
           <motion.div 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            transition={{ delay: 2 }}
            className="fixed bottom-0 w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur border-t border-slate-200 dark:border-slate-800 p-4 z-40 flex justify-between items-center md:hidden"
           >
               <span className="font-bold text-sm">Get Zero Fees Today</span>
               <button onClick={() => scrollToSection('contact')} className="px-4 py-2 bg-blue-600 text-white rounded-full font-bold text-sm">Apply Now</button>
           </motion.div>

        </div>
      </main>
    </ThemeProvider>
  );
}
