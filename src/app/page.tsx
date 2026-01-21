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
import { ThemeProvider, useTheme } from './components/ThemeProvider';
import { posProducts } from '@/lib/posProducts';
import { findRelatedProducts as localFindProducts } from '@/lib/posProducts';
import Link from 'next/link';

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
// AI Search Overlay (Preserved & Unchanged)
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

  // Cursor blink
  useEffect(() => {
    if (cursorRef.current) {
      cursorRef.current.style.animation = "blink 1s infinite";
    }
  }, []);

  // Typing effect
  useEffect(() => {
    if (userQuery) return; // Skip sample text if user typed something

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
      // Example Worker endpoint
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
        // Local fallback
        const fallbackProducts = localFindProducts(processedQuery, 3);
        if (fallbackProducts.length > 0) {
          setSearchState((prev) => ({
            ...prev,
            isLoading: false,
            recommendations: fallbackProducts
          }));
        } else {
          // Another fallback
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
        // Attempt to match local POS data
        const matchedItems = data.recommendations.map((r: string) =>
          matchRecommendedItem(r)
        );
        // If Worker results are valid
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
          // Fallback to local search
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

      // Another fallback approach
      const query_str = typeof query === 'string' ? query : '';
      const isProfessionalQuery = /lawyer|attorney|legal|accountant|doctor|medical|professional|tax|consultant/i.test(
        query_str
      );
      const isRetailQuery = /retail|shop|store|boutique|merchandise|clothing/i.test(
        query_str
      );
      const isFoodQuery = /restaurant|food|café|cafe|dining|bar|kitchen/i.test(
        query_str
      );

      let fallbackProducts;

      if (isProfessionalQuery) {
        fallbackProducts = posProducts
          .filter((p) => p.identifier === 'mini3' || p.identifier === 'flex4')
          .slice(0, 3);
      } else if (isRetailQuery) {
        fallbackProducts = posProducts
          .filter(
            (p) =>
              p.identifier === 'mini3' ||
              p.identifier === 'solo' ||
              p.identifier === 'kiosk'
          )
          .slice(0, 3);
      } else if (isFoodQuery) {
        fallbackProducts = posProducts
          .filter(
            (p) =>
              p.identifier === 'duo2' ||
              p.identifier === 'solo' ||
              p.identifier === 'kds'
          )
          .slice(0, 3);
      } else {
        fallbackProducts = localFindProducts(processedQuery, 3);
      }

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

  // Debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (userQuery) {
        fetchRecommendations(userQuery);
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [userQuery, fetchRecommendations]);

  // Click outside to close
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
      className="mx-auto mt-8 w-full max-w-3xl bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 relative"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      ref={containerRef}
    >
      <div className="text-gray-700 dark:text-gray-100 mb-2">
        {!userQuery ? (
          <>
            {typedText}
            <span
              ref={cursorRef}
              className="border-r-2 border-gray-900 dark:border-gray-100 ml-1"
              aria-hidden="true"
            />
          </>
        ) : (
          "Type your question or needs..."
        )}
      </div>
      <input
        type="text"
        className="w-full px-4 py-2 border rounded-lg text-gray-900 dark:text-gray-200 dark:bg-gray-700 dark:border-gray-600"
        placeholder="e.g. I want a system that supports Apple Pay..."
        value={userQuery}
        onFocus={handleInputFocus}
        onChange={(e) => setUserQuery(e.target.value)}
        aria-label="Search for POS systems"
      />

      <AnimatePresence>
        {showResults && (userQuery || isLoading || errorMessage) && (
          <motion.div
            className="absolute z-50 left-0 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow p-4 max-h-[50vh] sm:max-h-[60vh] md:max-h-[70vh] overflow-y-auto top-full"
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1, y: 5 }}
            exit={{ opacity: 0, y: 0 }}
          >
            {isLoading && (
              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                <div
                  className="w-4 h-4 border-2 border-t-transparent border-gray-400 rounded-full animate-spin"
                  aria-hidden="true"
                ></div>
                <span>Fetching recommendations...</span>
              </div>
            )}

            {!isLoading && errorMessage && (
              <div
                className="text-red-500 dark:text-red-300 mb-4"
                role="alert"
              >
                {errorMessage}
              </div>
            )}

            {!isLoading && recommendations.length > 0 && (
              <div>
                {recommendations.map((item: PosProduct, idx: number) => (
                  <div
                    key={idx}
                    className="mb-6 flex flex-col md:flex-row md:space-x-4 border-b border-gray-200 dark:border-gray-600 pb-4 last:border-none"
                  >
                    {item.image && (
                      <div className="md:w-1/3 mb-4 md:mb-0 flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={300}
                          height={300}
                          className="rounded object-cover w-full h-auto"
                        />
                      </div>
                    )}
                    <div className="md:w-2/3">
                      <h4 className="font-semibold text-gray-800 dark:text-gray-100 text-lg mb-2">
                        {item.name}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {item.features && item.features.length > 0 && (
                          <div>
                            <h5 className="font-medium">Features</h5>
                            <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-300 mt-1 space-y-1">
                              {item.features.slice(0, 4).map((feat: string, fIdx: number) => (
                                <li key={fIdx}>{feat}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {item.bestFor && item.bestFor.length > 0 && (
                          <div>
                            <h5 className="font-medium">Best For</h5>
                            <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-300 mt-1 space-y-1">
                              {item.bestFor.map((bf: string, bfIdx: number) => (
                                <li key={bfIdx}>{bf}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                      <div className="mt-4">
                        <Link
                          href="/poslineup"
                          className="inline-block px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                        >
                          {item.cta || "Learn More"}
                        </Link>
                      </div>
                    </div>
                  </div>
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
// (Implementing the new consolidated section & removing Testimonials)
// ---------------------------------------------------------
export default function Home() {
  // ------------------------
  // State Management
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

  // ------------------------
  // Hero Images
  // ------------------------
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

  // ------------------------
  // Wizard Validation
  // ------------------------
  const validateForm = useCallback(
    (step: number) => {
      let errors: string[] = [];

      if (step === 1 && !selectorData.businessType) {
        errors.push('Please select a business type.');
      }
      if (step === 2) {
        if (
          selectorData.businessType === 'restaurant' &&
          selectorData.softwareNeeds.length === 0
        ) {
          errors.push(
            'Please select whether your restaurant is Full-Service or Quick-Service.'
          );
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
    },
    [selectorData]
  );

  const validateContactForm = useCallback(() => {
    let errors: string[] = [];
    const requiredFields = ['firstName', 'lastName', 'email', 'phone'];
    for (const field of requiredFields) {
      if (!contactFormData[field as keyof typeof contactFormData]) {
        errors.push(
          `${field.charAt(0).toUpperCase() + field.slice(1)} is required.`
        );
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

  // ------------------------
  // Wizard Step Handlers
  // ------------------------
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

      const finalLocations =
        numLocationsChoice === 'plus' ? numLocationsCustom : numLocationsChoice;

      // Example Zapier hook
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
        submitTime: new Date().toISOString()
      });

      const url = `https://hooks.zapier.com/hooks/catch/17465641/2awchwj/?${params.toString()}`;
      const response = await fetch(url, { method: 'GET' });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      setSelectorSubmission({
        status: 'success',
        message:
          "Thank you! We'll be in touch shortly to assist with your needs.",
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
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) => {
      const { name, value } = e.target;
      dispatchContact({
        type: 'UPDATE_FIELD',
        payload: { name: name as keyof typeof initialContactFormData, value }
      });
    },
    []
  );

  const handleContactSubmit = useCallback(
    async (e: React.FormEvent) => {
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

      const finalLocations =
        contactFormData.numLocationsChoice === 'plus'
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
          formType: 'contactPage'
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
    },
    [contactFormData, validateContactForm]
  );

  // -------------
  // Wizard Steps
  // -------------
  const renderStepContent = useCallback(() => {
    switch (wizardStep) {
      case 1: // Business Type
        return (
          <div className="text-gray-900 dark:text-white">
            <h3 className="mb-4 text-xl font-semibold">
              What type of business do you have?
            </h3>
            <p className="mb-6 text-gray-600 dark:text-gray-400">
              So we can tailor the right POS solution for you.
            </p>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[
                { type: 'retail', title: 'Retail', img: '/retail.jpg' },
                { type: 'restaurant', title: 'Restaurant', img: '/restaurant.jpg' },
                { type: 'services', title: 'Services', img: '/services.jpg' },
                { type: 'other', title: 'Other', img: '/other.jpg' }
              ].map((item) => (
                <motion.button
                  key={item.type}
                  whileHover={{
                    scale: 1.07,
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() =>
                    dispatchSelector({
                      type: 'SET_BUSINESS_TYPE',
                      payload: item.type
                    })
                  }
                  className={`p-4 border transition-colors rounded-3xl shadow-sm ${
                    selectorData.businessType === item.type
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900 dark:border-blue-700'
                      : 'border-gray-200 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800'
                  }`}
                  aria-label={`Select ${item.title} business type`}
                  type="button"
                >
                  <div className="flex justify-center mb-4 relative overflow-hidden rounded-xl aspect-square">
                    <Image
                      src={item.img}
                      alt={item.title}
                      fill
                      style={{ objectFit: 'cover' }}
                      className="rounded transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                  <h4 className="text-lg font-semibold text-center">
                    {item.title}
                  </h4>
                </motion.button>
              ))}
            </div>
          </div>
        );
      case 2: // Restaurant details or Online ordering
        if (selectorData.businessType === 'restaurant') {
          return (
            <div className="text-gray-900 dark:text-white">
              <h3 className="mb-4 text-xl font-semibold">
                What type of restaurant?
              </h3>
              <p className="mb-6 text-gray-600 dark:text-gray-400">
                Select Full-Service and/or Quick-Service as needed.
              </p>
              <div className="space-y-4">
                {[
                  { id: 'full-service', label: 'Full-Service Dining' },
                  { id: 'quick-service', label: 'Quick-Service' }
                ].map((option) => (
                  <motion.div
                    key={option.id}
                    className={`flex items-center p-4 border rounded-3xl cursor-pointer mb-3 shadow-sm transition-all ${
                      selectorData.softwareNeeds.includes(option.id)
                        ? 'bg-blue-50 border-blue-500 dark:bg-blue-900 dark:border-blue-700'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800 dark:border-gray-700'
                    }`}
                    onClick={() =>
                      dispatchSelector({
                        type: 'TOGGLE_SOFTWARE_NEED',
                        payload: option.id
                      })
                    }
                    whileHover={{
                      y: -2,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                    }}
                  >
                    <input
                      type="checkbox"
                      id={`restaurant-type-${option.id}`}
                      className="mr-3 h-5 w-5 accent-blue-600"
                      checked={selectorData.softwareNeeds.includes(option.id)}
                      onChange={() => {}}
                      aria-label={option.label}
                    />
                    <label
                      htmlFor={`restaurant-type-${option.id}`}
                      className="cursor-pointer flex-grow font-medium"
                    >
                      {option.label}
                    </label>
                  </motion.div>
                ))}
              </div>

              <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-xl">
                <h4 className="font-medium mb-2 flex items-center">
                  <FaRegLightbulb className="text-blue-600 dark:text-blue-400 mr-2" />
                  Did you know?
                </h4>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Full-service restaurants typically need more robust table
                  management and ordering systems, while quick-service
                  restaurants benefit from faster checkout options and
                  self-service kiosks.
                </p>
              </div>
            </div>
          );
        }
        return (
          <div className="text-gray-900 dark:text-white">
            <h3 className="mb-4 text-xl font-semibold">
              Do you need online ordering capabilities?
            </h3>
            <p className="mb-6 text-gray-600 dark:text-gray-400">
              Select if you need online ordering for your business.
            </p>
            <motion.div
              className={`flex items-center p-4 border rounded-3xl cursor-pointer shadow-sm mb-6 ${
                selectorData.onlineOrdering
                  ? 'bg-blue-50 border-blue-500 dark:bg-blue-900 dark:border-blue-700'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800 dark:border-gray-700'
              }`}
              onClick={() => dispatchSelector({ type: 'TOGGLE_ONLINE_ORDERING' })}
              whileHover={{
                y: -2,
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
              }}
            >
              <input
                type="checkbox"
                id="online-ordering"
                className="mr-3 h-5 w-5 accent-blue-600"
                checked={selectorData.onlineOrdering}
                onChange={() => {}}
                aria-label="Need online ordering"
              />
              <label
                htmlFor="online-ordering"
                className="cursor-pointer flex-grow font-medium"
              >
                Yes, I need online ordering capabilities
              </label>
            </motion.div>

            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800/30">
              <h4 className="font-medium mb-2 flex items-center">
                <FaBolt className="text-amber-600 dark:text-amber-400 mr-2" />
                Business Growth Tip
              </h4>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Businesses with online ordering capabilities typically see a 30%
                increase in average order value and can reach customers beyond
                their physical location.
              </p>
            </div>
          </div>
        );
      case 3: // POS & Hardware Selection
        return (
          <div className="text-gray-900 dark:text-white">
            <h3 className="mb-4 text-xl font-semibold">Select Your POS & Hardware</h3>
            <p className="mb-6 text-gray-600 dark:text-gray-400">
              How many of each device do you need? (Use plus/minus or type the quantity)
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {posProducts.map((product) => {
                let deviceType: keyof ProductSelectorData | null = null;

                switch (product.identifier) {
                  case "duo2":
                    deviceType = "fullServicePosQty";
                    break;
                  case "solo":
                    deviceType = "barServicePosQty";
                    break;
                  case "mini3":
                    deviceType = "miniPosQty";
                    break;
                  case "flex4":
                    deviceType = "handheldPosQty";
                    break;
                  case "starprinter":
                    deviceType = "kitchenPrinterQty";
                    break;
                  case "kds":
                    deviceType = "kitchenDisplayQty";
                    break;
                  case "kiosk":
                    deviceType = "kioskQty";
                    break;
                }

                if (!deviceType) return null;

                const qtyVal = selectorData[deviceType] as number;

                return (
                  <motion.div
                    key={product.identifier}
                    className="p-6 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl flex flex-col items-center shadow-sm"
                    whileHover={{
                      y: -4,
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    {product.image && (
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={200}
                        height={200}
                        style={{ objectFit: 'contain' }}
                        className="mb-4 rounded h-40 w-auto"
                      />
                    )}
                    <h4 className="text-lg font-semibold mb-2">{product.name}</h4>
                    {product.features && (
                      <p className="mb-4 text-sm text-gray-600 dark:text-gray-300 text-center">
                        {product.features.slice(0, 2).join(", ")}
                      </p>
                    )}
                    <div className="flex items-center mt-auto">
                      <motion.button
                        type="button"
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleQuantityChange(deviceType!, -1)}
                        className="p-3 bg-gray-200 dark:bg-gray-600 rounded-l-full text-gray-700 dark:text-gray-200"
                        aria-label={`Decrease ${product.name} quantity`}
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M20 12H4"
                          />
                        </svg>
                      </motion.button>
                      <input
                        type="number"
                        className="w-16 mx-0 text-center border dark:border-gray-600 dark:bg-gray-800 h-10"
                        value={qtyVal}
                        onChange={(e) =>
                          handleSelectorInputChange(e, deviceType!)
                        }
                        aria-label={`${product.name} quantity`}
                        min="0"
                      />
                      <motion.button
                        type="button"
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleQuantityChange(deviceType!, 1)}
                        className="p-3 bg-gray-200 dark:bg-gray-600 rounded-r-full text-gray-700 dark:text-gray-200"
                        aria-label={`Increase ${product.name} quantity`}
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                      </motion.button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
            <div className="mt-8 text-center">
              <Link
                href="/poslineup"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors shadow-md"
              >
                View All POS Systems
                <svg
                  className="w-4 h-4 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </Link>
            </div>
          </div>
        );
      case 4: // Contact info
        return (
          <div className="text-gray-900 dark:text-white">
            <h3 className="mb-4 text-xl font-semibold">Almost done!</h3>
            <p className="mb-6 text-gray-600 dark:text-gray-400">
              Enter your contact details and business specifics to receive your personalized quote.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="block mb-1 text-sm font-medium"
                >
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={selectorData.firstName}
                  onChange={handleSelectorInputChange}
                  className="w-full px-4 py-3 border rounded-full dark:bg-gray-800 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="block mb-1 text-sm font-medium"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={selectorData.lastName}
                  onChange={handleSelectorInputChange}
                  className="w-full px-4 py-3 border rounded-full dark:bg-gray-800 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  required
                />
              </div>
            </div>
            <div className="mt-4">
              <label htmlFor="email" className="block mb-1 text-sm font-medium">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={selectorData.email}
                onChange={handleSelectorInputChange}
                className="w-full px-4 py-3 border rounded-full dark:bg-gray-800 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                required
              />
            </div>
            <div className="mt-4">
              <label htmlFor="phone" className="block mb-1 text-sm font-medium">
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={selectorData.phone}
                onChange={handleSelectorInputChange}
                className="w-full px-4 py-3 border rounded-full dark:bg-gray-800 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                required
              />
            </div>
            <div className="mt-6">
              <label className="block mb-2 text-sm font-medium">
                Number of Locations
              </label>
              <div className="flex flex-wrap items-center gap-2">
                {['1', '2', '3', '4', '5'].map((opt) => (
                  <motion.button
                    key={opt}
                    type="button"
                    whileTap={{ scale: 0.95 }}
                    onClick={() =>
                      dispatchSelector({
                        type: 'UPDATE_FIELD',
                        payload: { name: 'numLocationsChoice', value: opt }
                      })
                    }
                    className={`px-4 py-2 rounded-full text-sm shadow-sm ${
                      selectorData.numLocationsChoice === opt
                        ? 'bg-blue-600 text-white dark:bg-blue-500'
                        : 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500'
                    }`}
                    aria-label={`${opt} location${opt !== '1' ? 's' : ''}`}
                  >
                    {opt}
                  </motion.button>
                ))}
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.95 }}
                  onClick={() =>
                    dispatchSelector({
                      type: 'UPDATE_FIELD',
                      payload: { name: 'numLocationsChoice', value: 'plus' }
                    })
                  }
                  className={`px-4 py-2 rounded-full text-sm shadow-sm ${
                    selectorData.numLocationsChoice === 'plus'
                      ? 'bg-blue-600 text-white dark:bg-blue-500'
                      : 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500'
                  }`}
                  aria-label="More than 5 locations"
                >
                  6+
                </motion.button>
              </div>
              {selectorData.numLocationsChoice === 'plus' && (
                <div className="mt-3">
                  <label
                    htmlFor="numLocationsCustom"
                    className="block mb-1 text-sm text-gray-600 dark:text-gray-400"
                  >
                    Enter number of locations:
                  </label>
                  <input
                    type="number"
                    id="numLocationsCustom"
                    min="6"
                    name="numLocationsCustom"
                    value={selectorData.numLocationsCustom}
                    onChange={handleSelectorInputChange}
                    className="w-32 px-4 py-2 border rounded-full dark:bg-gray-800 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    aria-label="Custom number of locations"
                  />
                </div>
              )}
            </div>
            <div className="mt-6">
              <label className="block mb-2 text-sm font-medium">
                Monthly Processing Volume
              </label>
              <div className="flex flex-wrap gap-2">
                {['0-50K', '50K-250K', '250K-1MM', '1MM+'].map((range) => (
                  <motion.button
                    key={range}
                    type="button"
                    whileTap={{ scale: 0.95 }}
                    onClick={() =>
                      dispatchSelector({
                        type: 'UPDATE_FIELD',
                        payload: { name: 'monthlyVolume', value: range }
                      })
                    }
                    className={`px-4 py-2 rounded-full border text-sm shadow-sm ${
                      selectorData.monthlyVolume === range
                        ? 'bg-blue-600 text-white border-blue-600 dark:bg-blue-500 dark:border-blue-500'
                        : 'text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                    }`}
                    aria-label={`Monthly volume: ${range}`}
                  >
                    {range === '0-50K' && '$0-50K'}
                    {range === '50K-250K' && '$50K-250K'}
                    {range === '250K-1MM' && '$250K-1MM'}
                    {range === '1MM+' && '$1MM+'}
                  </motion.button>
                ))}
              </div>
            </div>
            {/* Privacy notice */}
            <div className="mt-6 text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
              <p className="flex items-start">
                <FaLock className="text-green-600 dark:text-green-400 mt-0.5 mr-2 flex-shrink-0" />
                <span>
                  Your information is secure and will only be used to provide you with a quote.
                  We respect your privacy and will never share your details with third parties.
                </span>
              </p>
            </div>
          </div>
        );
      case 5: // Review & Submit
        const { status, message, isLoading: selectorIsLoading } = selectorSubmission;
        if (status === 'success') {
          return (
            <div className="text-center py-6">
              <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-green-100 dark:bg-green-900 rounded-full">
                <FaCheckCircle className="text-3xl text-green-600 dark:text-green-400" />
              </div>
              <h3 className="mb-4 text-2xl font-semibold">Thank You!</h3>
              <p className="mb-6 text-gray-600 dark:text-gray-400">{message}</p>
              <div className="flex justify-center gap-4">
                <Link href="/poslineup">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 shadow-md"
                  >
                    View POS Systems
                  </motion.button>
                </Link>
                <Link href="/">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600"
                  >
                    Back to Home
                  </motion.button>
                </Link>
              </div>
            </div>
          );
        }
        if (status === 'error') {
          return (
            <div className="text-center py-6">
              <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-red-100 dark:bg-red-900 rounded-full">
                <svg
                  className="w-8 h-8 text-red-600 dark:text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="mb-4 text-2xl font-semibold text-red-600 dark:text-red-400">
                Error
              </h3>
              <p className="mb-6 text-gray-600 dark:text-gray-400">{message}</p>
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSelectorSubmit}
                className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 shadow-md"
              >
                Try Again
              </motion.button>
            </div>
          );
        }

        const { numLocationsChoice, numLocationsCustom } = selectorData;
        const finalLocations =
          numLocationsChoice === 'plus' ? numLocationsCustom : numLocationsChoice;

        return (
          <div>
            <h3 className="mb-6 text-xl font-semibold dark:text-white">
              Review Your Choices
            </h3>
            <div className="space-y-4 text-gray-700 dark:text-gray-100 bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-lg font-medium mb-3 text-gray-900 dark:text-white">
                    Business Details
                  </h4>
                  <div className="space-y-2">
                    <p className="flex items-center">
                      <span className="w-32 text-gray-500 dark:text-gray-400">
                        Business Type:
                      </span>
                      <span className="font-medium capitalize">
                        {selectorData.businessType}
                      </span>
                    </p>
                    {selectorData.businessType === 'restaurant' && (
                      <p className="flex items-center">
                        <span className="w-32 text-gray-500 dark:text-gray-400">
                          Restaurant Type:
                        </span>
                        <span className="font-medium capitalize">
                          {selectorData.softwareNeeds.join(', ')}
                        </span>
                      </p>
                    )}
                    {selectorData.businessType !== 'restaurant' &&
                      selectorData.onlineOrdering && (
                        <p className="flex items-center">
                          <span className="w-32 text-gray-500 dark:text-gray-400">
                            Online Ordering:
                          </span>
                          <span className="font-medium">Yes</span>
                        </p>
                      )}
                    <p className="flex items-center">
                      <span className="w-32 text-gray-500 dark:text-gray-400">
                        Locations:
                      </span>
                      <span className="font-medium">
                        {finalLocations || 'N/A'}
                      </span>
                    </p>
                    <p className="flex items-center">
                      <span className="w-32 text-gray-500 dark:text-gray-400">
                        Monthly Volume:
                      </span>
                      <span className="font-medium">
                        {selectorData.monthlyVolume}
                      </span>
                    </p>
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-medium mb-3 text-gray-900 dark:text-white">
                    Contact Information
                  </h4>
                  <div className="space-y-2">
                    <p className="flex items-center">
                      <span className="w-24 text-gray-500 dark:text-gray-400">
                        Name:
                      </span>
                      <span className="font-medium">
                        {selectorData.firstName} {selectorData.lastName}
                      </span>
                    </p>
                    <p className="flex items-center">
                      <span className="w-24 text-gray-500 dark:text-gray-400">
                        Email:
                      </span>
                      <span className="font-medium">{selectorData.email}</span>
                    </p>
                    <p className="flex items-center">
                      <span className="w-24 text-gray-500 dark:text-gray-400">
                        Phone:
                      </span>
                      <span className="font-medium">{selectorData.phone}</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700 mt-4">
                <h4 className="text-lg font-medium mb-3 text-gray-900 dark:text-white">
                  Selected Hardware
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {selectorData.fullServicePosQty > 0 && (
                    <div className="flex items-center">
                      <span className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 mr-2">
                        {selectorData.fullServicePosQty}
                      </span>
                      <span>Clover Station Duo 2</span>
                    </div>
                  )}
                  {selectorData.barServicePosQty > 0 && (
                    <div className="flex items-center">
                      <span className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 mr-2">
                        {selectorData.barServicePosQty}
                      </span>
                      <span>Clover Station Solo</span>
                    </div>
                  )}
                  {selectorData.miniPosQty > 0 && (
                    <div className="flex items-center">
                      <span className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 mr-2">
                        {selectorData.miniPosQty}
                      </span>
                      <span>Mini 3</span>
                    </div>
                  )}
                  {selectorData.handheldPosQty > 0 && (
                    <div className="flex items-center">
                      <span className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 mr-2">
                        {selectorData.handheldPosQty}
                      </span>
                      <span>Clover Flex 4</span>
                    </div>
                  )}
                  {selectorData.kitchenPrinterQty > 0 && (
                    <div className="flex items-center">
                      <span className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 mr-2">
                        {selectorData.kitchenPrinterQty}
                      </span>
                      <span>Star Kitchen Printer</span>
                    </div>
                  )}
                  {selectorData.kitchenDisplayQty > 0 && (
                    <div className="flex items-center">
                      <span className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 mr-2">
                        {selectorData.kitchenDisplayQty}
                      </span>
                      <span>Clover Kitchen Display</span>
                    </div>
                  )}
                  {selectorData.kioskQty > 0 && (
                    <div className="flex items-center">
                      <span className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 mr-2">
                        {selectorData.kioskQty}
                      </span>
                      <span>Clover Kiosk</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <motion.button
                type="button"
                whileHover={{
                  scale: 1.05,
                  boxShadow: '0px 4px 20px rgba(59,130,246,0.3)'
                }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSelectorSubmit}
                className="px-8 py-4 text-white transition-colors bg-blue-600 dark:bg-blue-500 rounded-full hover:bg-blue-700 dark:hover:bg-blue-600 shadow-md"
                disabled={selectorIsLoading}
              >
                {selectorIsLoading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="w-5 h-5 mr-3 -ml-1 text-white animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  'Submit & Get Your Quote'
                )}
              </motion.button>
              <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                You'll receive a custom quote within 24 hours
              </p>
            </div>
          </div>
        );
      default:
        return null;
    }
  }, [
    wizardStep,
    selectorData,
    selectorSubmission,
    handleSelectorInputChange,
    handleQuantityChange,
    handleSelectorSubmit
  ]);

  // Wizard progress indicator
  const renderProgressIndicator = useCallback(() => {
    const totalSteps = 5;
    return (
      <div
        className="flex items-center justify-center my-6"
        role="navigation"
        aria-label="Form steps"
      >
        {Array.from({ length: totalSteps }).map((_, index) => {
          const stepNum = index + 1;
          return (
            <React.Fragment key={index}>
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  wizardStep > stepNum
                    ? 'bg-blue-600 text-white dark:bg-blue-700'
                    : wizardStep === stepNum
                    ? 'bg-blue-500 text-white dark:bg-blue-600 ring-4 ring-blue-100 dark:ring-blue-900'
                    : 'bg-gray-200 text-gray-500 dark:bg-gray-600 dark:text-gray-400'
                }`}
                aria-current={wizardStep === stepNum ? 'step' : undefined}
                aria-label={`Step ${stepNum}${
                  wizardStep === stepNum ? ' (current)' : ''
                }`}
              >
                {wizardStep > stepNum ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  stepNum
                )}
              </div>
              {stepNum < totalSteps && (
                <div
                  className={`w-20 h-1 transition-colors ${
                    wizardStep > stepNum
                      ? 'bg-blue-600 dark:bg-blue-700'
                      : 'bg-gray-200 dark:bg-gray-600'
                  }`}
                  aria-hidden="true"
                ></div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  }, [wizardStep]);

  // Scroll helper
  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  // ------------------------
  // Return / Render
  // ------------------------
  return (
    <ThemeProvider>
      <main className={darkMode ? 'dark' : ''}>
        <div className={`min-h-screen text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-900`}>
          <Head>
            <title>StarAccept Business Solutions - Merchant Processing & Payment Systems</title>
            <meta
              name="description"
              content="Get affordable, full-service credit card processing with proven, cutting-edge technology. Our zero-fee solutions transform your business."
            />
            <meta
              name="keywords"
              content="merchant processing, POS systems, credit card processing, payment solutions, Clover, zero-fee processing"
            />
            <meta
              property="og:title"
              content="StarAccept Business Solutions"
            />
            <meta
              property="og:description"
              content="Affordable, full-service credit card processing with proven, cutting-edge technology. Transform your business."
            />
            <meta property="og:image" content="/og-image.jpg" />
            <meta property="og:url" content="https://staraccept.com" />
            <meta name="twitter:card" content="summary_large_image" />
            <link rel="icon" href="/favicon.ico" />
            <link rel="canonical" href="https://staraccept.com" />
            <script
              async
              src="https://www.googletagmanager.com/gtag/js?id=G-2D18CMVZEF"
            ></script>
            <script
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer = window.dataLayer || [];
                      function gtag(){dataLayer.push(arguments);}
                      gtag('js', new Date());
                      gtag('config', 'G-2D18CMVZEF');`,
              }}
            />
          </Head>

          {/** 
           * NAVBAR (unchanged)
           */}
          <motion.nav
            className="fixed top-0 z-50 w-full bg-white dark:bg-gray-800 shadow-sm bg-opacity-90 backdrop-blur-sm"
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ fontFamily: 'Inter, sans-serif' }}
            role="navigation"
            aria-label="Main Navigation"
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
                        alt="StarAccept Logo"
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
                      className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 cursor-pointer"
                      href="/poslineup"
                      aria-label="View All POS Systems"
                    >
                      POS Systems
                    </Link>
                    <Link
                      className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 cursor-pointer"
                      href="#contact"
                      aria-label="Go to Contact section"
                    >
                      Contact
                    </Link>
                  </div>
                </div>
                <div className="flex items-center">
                  {/* Single "business type" prompt button */}
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="hidden md:inline-flex items-center justify-center px=4 py-2 mr-4 text-sm bg-blue-600 text-white rounded-full hover:bg-blue-700 shadow-sm px-4"
                    onClick={() => scrollToSection('product-selector')}
                    aria-label="What's your business type?"
                  >
                    <FaRegLightbulb className="mr-1" />
                    Find Your POS
                  </motion.button>

                  <button
                    onClick={toggleDarkMode}
                    className="hidden md:inline-block p-2 text-gray-600 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none"
                    aria-label={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
                    type="button"
                  >
                    {darkMode ? (
                      <svg
                        className="w-6 h-6"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path d="M12 21a9 9 0 0 1-6.36-2.64C3.09 15.81 2 13 2 9.5 2 5.36 5.36 2 9.5 2c.9 0 1.78.12 2.6.34.82.22 1.6.56 2.28 1.02.68.46 1.24 1.08 1.68 1.8.44.72.78 1.56.98 2.46.2.9.3 1.82.3 2.78 0 3.5-2.54 6.43-5.99 7.6-1.5.53-3.09.8-4.73.8z" />
                      </svg>
                    ) : (
                      <svg
                        className="w-6 h-6"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z" />
                      </svg>
                    )}
                  </button>
                  <div className="md:hidden">
                    <button
                      onClick={() => setIsMenuOpen(!isMenuOpen)}
                      className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 focus:outline-none"
                      aria-label="Toggle mobile menu"
                      aria-expanded={isMenuOpen}
                      type="button"
                    >
                      {isMenuOpen ? (
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          aria-hidden="true"
                        >
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
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                transition={{ duration: 0.3 }}
                role="menu"
                aria-orientation="vertical"
              >
                <Link
                  className="block w-full text-left px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  href="/restaurants"
                  role="menuitem"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Restaurants
                </Link>
                <Link
                  className="block w-full text-left px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  href="/retail"
                  role="menuitem"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Retail
                </Link>
                <Link
                  className="block w-full text-left px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  href="/services"
                  role="menuitem"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Services
                </Link>
                <Link
                  className="block w-full text-left px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  href="/online-ordering"
                  role="menuitem"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Online Ordering
                </Link>
                <Link
                  className="block w-full text-left px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  href="/working-capital-funding"
                  role="menuitem"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Working Capital Funding
                </Link>
                <Link
                  className="block w-full text-left px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  href="/poslineup"
                  role="menuitem"
                  onClick={() => setIsMenuOpen(false)}
                >
                  POS Systems
                </Link>
                <button
                  type="button"
                  className="block w-full text-left px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => {
                    setIsMenuOpen(false);
                    scrollToSection('product-selector');
                  }}
                  role="menuitem"
                >
                  Find Your POS
                </button>
                <Link
                  className="block w-full text-left px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  href="#contact"
                  onClick={() => setIsMenuOpen(false)}
                  role="menuitem"
                >
                  Contact
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    toggleDarkMode();
                  }}
                  className="block w-full text-left px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  role="menuitem"
                >
                  Toggle Dark Mode
                </button>
              </motion.div>
            )}
          </motion.nav>

          {/** 
           * HERO SECTION (Unaltered)
           */}
          <div className="relative h-[70vh] md:h-[75vh] w-full max-w-[1920px] mx-auto pt-24 flex items-center justify-center">
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
            <div className="absolute z-20 flex space-x-2 transform -translate-x-1/2 bottom-8 left-1/2" role="tablist" aria-label="Image carousel controls">
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
            <div className="absolute inset-0 flex items-center max-w-[1920px] mx-auto">
              <div className="relative z-20 max-w-4xl px-4 mx-auto mt-16 text-white">
                <motion.h1
                  className="mb-4 text-4xl font-extrabold tracking-tight text-white md:text-5xl lg:text-6xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                >
                  Simplify Payments.  
                  <br className="hidden md:block" />
                  <span className="text-amber-400">Maximize Savings.</span>
                </motion.h1>
                <motion.p
                  className="mb-6 text-lg md:text-xl text-white/90 font-light leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                >
                  Embrace secure, fast, and <span className="font-semibold">Zero-Fee</span> card processing with next-gen POS systems trusted by thousands of businesses.
                </motion.p>

                <motion.div
                  className="flex flex-wrap gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                >
                  <Link href="/poslineup">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-8 py-4 text-lg font-semibold text-white transition-colors bg-blue-600 rounded-full hover:bg-blue-700 shadow-md"
                      aria-label="View All POS Systems"
                    >
                      View All POS Systems
                    </motion.button>
                  </Link>
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 text-lg font-semibold text-gray-900 transition-colors rounded-full bg-amber-400 hover:bg-amber-300 shadow-md"
                    onClick={() => scrollToSection('contact')}
                    aria-label="Talk to an Expert"
                  >
                    Talk to an Expert
                  </motion.button>
                </motion.div>
              </div>
            </div>
          </div>

          {/**
           * ---------------------------------------------
           * MERGED SECTION:
           * (Why StarAccept + Businesses Of All Sizes + Featured Solutions)
           * ---------------------------------------------
           */}
          <section className="py-16 bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
            <div className="max-w-6xl mx-auto px-4">
              {/* Section Title */}
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Your Strategic Payment Partner
                </h2>
                <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                  Scalable solutions for every business type, backed by next-gen
                  features and zero-fee options. Whether you’re a startup or an
                  established enterprise, here's why we’re the top choice:
                </p>
              </div>

              {/* "Why StarAccept" style bullets + quick stats + featured solution icons in one grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Column 1: "Why StarAccept" bullet highlights */}
                <div className="space-y-6">
                  <motion.div
                    className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-sm"
                    whileHover={{ y: -2 }}
                  >
                    <div className="flex items-center mb-2">
                      <FaShieldAlt className="text-blue-600 dark:text-blue-400 text-2xl mr-3" />
                      <h4 className="text-lg font-semibold">
                        Secure & Compliant
                      </h4>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Enjoy PCI compliance and robust fraud protection,
                      ensuring every transaction is safe.
                    </p>
                  </motion.div>

                  <motion.div
                    className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-sm"
                    whileHover={{ y: -2 }}
                  >
                    <div className="flex items-center mb-2">
                      <FaHeadset className="text-green-600 dark:text-green-400 text-2xl mr-3" />
                      <h4 className="text-lg font-semibold">
                        24/7 Expert Support
                      </h4>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Our specialists are always here to help you resolve any
                      questions or technical challenges.
                    </p>
                  </motion.div>

                  <motion.div
                    className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-sm"
                    whileHover={{ y: -2 }}
                  >
                    <div className="flex items-center mb-2">
                      <FaBolt className="text-amber-500 dark:text-amber-400 text-2xl mr-3" />
                      <h4 className="text-lg font-semibold">
                        Lightning-Fast Setup
                      </h4>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Get your entire payment system running within 24-48 hours
                      without any hassles.
                    </p>
                  </motion.div>
                </div>

                {/* Column 2: "Businesses Of All Sizes" Stats */}
                <div className="space-y-6">
                  <motion.div
                    className="flex flex-col items-center p-6 bg-white dark:bg-gray-700 rounded-xl shadow-md text-center"
                    whileHover={{ y: -5 }}
                  >
                    <FaCheckCircle
                      className="text-green-500 dark:text-green-400 text-3xl mb-2"
                      aria-hidden="true"
                    />
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                      99.99%
                    </h3>
                    <p className="mt-1 text-gray-600 dark:text-gray-300">
                      Uptime
                    </p>
                  </motion.div>
                  <motion.div
                    className="flex flex-col items-center p-6 bg-white dark:bg-gray-700 rounded-xl shadow-md text-center"
                    whileHover={{ y: -5 }}
                  >
                    <FaPuzzlePiece
                      className="text-purple-500 dark:text-purple-400 text-3xl mb-2"
                      aria-hidden="true"
                    />
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                      300+
                    </h3>
                    <p className="mt-1 text-gray-600 dark:text-gray-300">
                      Integrations
                    </p>
                  </motion.div>
                  <motion.div
                    className="flex flex-col items-center p-6 bg-white dark:bg-gray-700 rounded-xl shadow-md text-center"
                    whileHover={{ y: -5 }}
                  >
                    <FaHandshake
                      className="text-orange-500 dark:text-orange-400 text-3xl mb-2"
                      aria-hidden="true"
                    />
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                      Direct Channel
                    </h3>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                      No Middleman, No Hidden Fees
                    </p>
                  </motion.div>
                </div>

                {/* Column 3: "Featured Solutions" icons */}
                <div className="space-y-6">
                  <motion.div
                    className="p-6 bg-white dark:bg-gray-700 rounded-xl shadow-md flex items-start"
                    whileHover={{ y: -2 }}
                  >
                    <div className="mr-4">
                      <FaCreditCard className="text-blue-600 dark:text-blue-400 text-3xl" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold">Payments</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        Accept Apple Pay, Google Pay, QR, etc.
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    className="p-6 bg-white dark:bg-gray-700 rounded-xl shadow-md flex items-start"
                    whileHover={{ y: -2 }}
                  >
                    <div className="mr-4">
                      <FaCog className="text-purple-600 dark:text-purple-400 text-3xl" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold">Software</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        Manage tables, menus, online orders, loyalty, & more.
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    className="p-6 bg-white dark:bg-gray-700 rounded-xl shadow-md flex items-start"
                    whileHover={{ y: -2 }}
                  >
                    <div className="mr-4">
                      <FaLaptop className="text-green-600 dark:text-green-400 text-3xl" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold">Hardware</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        Countertop stations, handhelds, and KDS for any size.
                      </p>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Zero-Fee highlight (from "Featured Solutions" area) */}
              <div className="mt-16 bg-gray-50 dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
                <div className="grid md:grid-cols-2 items-center">
                  <div className="p-8 md:p-12">
                    <span className="inline-block px-4 py-1 mb-4 text-sm font-medium text-amber-600 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400 rounded-full">
                      Most Popular
                    </span>
                    <h3 className="text-2xl font-bold mb-4">
                      Zero-Fee Processing
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      Eliminate processing fees with our surcharging program.
                      Fully compliant, automatically itemized, and saving
                      thousands annually without hidden costs.
                    </p>
                    <ul className="space-y-3 mb-8">
                      {[
                        "Save thousands in processing fees annually",
                        "Fully compliant with card brand rules",
                        "Transparent fee display for customers",
                        "Simple setup—no technical headaches"
                      ].map((item, i) => (
                        <li key={i} className="flex items-start">
                          <svg
                            className="w-5 h-5 text-green-500 mr-2 mt-0.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 13l4 4L19 7"
                            ></path>
                          </svg>
                          <span className="text-gray-700 dark:text-gray-300">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <Link href="#contact">
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-3 bg-amber-500 text-gray-900 rounded-full hover:bg-amber-400 shadow-md"
                        onClick={() => scrollToSection('contact')}
                      >
                        Learn How Much You’ll Save
                      </motion.button>
                    </Link>
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-700 p-8 h-full flex items-center justify-center">
                    <div className="relative h-80 w-full">
                      <Image
                        src="/retailflex3.png"
                        alt="Zero-Fee Processing"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/**
           * ----------------------------------------------------------------------------------
           * REMOVED TESTIMONIALS SECTION COMPLETELY
           * (Replaced with Alternative Engagement-Driving Element)
           * ----------------------------------------------------------------------------------
           */}

          {/**
           * ALTERNATIVE ENGAGEMENT-DRIVING ELEMENT:
           * "Success Stories & Live Chat"
           */}
          <section className="py-16 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
  <div className="max-w-6xl mx-auto px-4">
    <div className="text-center mb-10">
      <h2 className="text-3xl font-bold">Find the Perfect POS System</h2>
      <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mt-2">
        Explore our curated lineup of point-of-sale systems designed to streamline your business operations, or apply now to join our network.
      </p>
    </div>
    <div className="flex flex-col md:flex-row items-center justify-center gap-8">
      <motion.div
        className="p-6 bg-white dark:bg-gray-700 rounded-xl shadow-lg text-center"
        whileHover={{ scale: 1.02 }}
      >
        <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
          Explore POS Systems
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Discover a range of point-of-sale systems and solutions tailored to drive your business forward.
        </p>
        <Link
          href="/poslineup"
          className="inline-block bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors"
        >
          View POS Lineup
        </Link>
      </motion.div>
      <motion.div
        className="p-6 bg-white dark:bg-gray-700 rounded-xl shadow-lg text-center"
        whileHover={{ scale: 1.02 }}
      >
        <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
          Apply Now
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Ready to join us? Complete your application and take the next step.
        </p>
        <a
          href="https://onboarding.tillpayments.com/signup/6748abe55b6362feca0a75f3"
          className="inline-block bg-amber-500 text-gray-900 px-4 py-2 rounded-full hover:bg-amber-400 transition-colors"
        >
          Apply Now
        </a>
      </motion.div>
    </div>
  </div>
</section>


          {/**
           * WIZARD
           */}
          <section
            className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900"
            id="product-selector"
          >
            <div className="max-w-6xl px-4 mx-auto">
              <div className="mb-12 text-center">
                <span className="inline-block px-4 py-1 mb-4 text-sm font-medium text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-300 rounded-full">
                  Personalized Recommendation
                </span>
                <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
                Personalized Payment Solutions
                </h2>
                <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400">
                  Answer a few quick questions and we’ll match you with the ideal
                  system for your specific business needs.
                </p>
              </div>

              <div className="p-8 bg-white dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-2xl shadow-lg">
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
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 19l-7-7 7-7"
                          />
                        </svg>
                        Previous
                      </span>
                    </motion.button>

                    <motion.button
                      type="button"
                      onClick={handleNextStep}
                      disabled={wizardStep === 5}
                      className={`px-6 py-3 text-white bg-blue-600 dark:bg-blue-500 rounded-full transition-colors shadow-md ${
                        wizardStep === 5
                          ? 'opacity-50 cursor-not-allowed'
                          : 'hover:bg-blue-700 dark:hover:bg-blue-600'
                      }`}
                      whileHover={wizardStep !== 5 ? { scale: 1.05 } : undefined}
                      whileTap={wizardStep !== 5 ? { scale: 0.95 } : undefined}
                      aria-label="Go to next step"
                    >
                      <span className="flex items-center">
                        Next
                        <svg
                          className="w-4 h-4 ml-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </span>
                    </motion.button>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/**
           * AI SEARCH OVERLAY
           * (Preserved as requested)
           */}
          <section className="pt-8 pb-16 bg-white dark:bg-gray-900">
            <div className="max-w-6xl mx-auto px-4">
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Still Not Sure? Ask Our AI!
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Type a question about your business or specific POS needs, and
                our AI will suggest the best solutions.
              </p>
              <AiSearchOverlay />
            </div>
          </section>

          {/**
           * FAQ SECTION (No changes needed, but left intact)
           */}
          <section className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
            <div className="max-w-6xl mx-auto px-4">
              <h3 className="mb-8 text-2xl font-bold text-center text-gray-900 dark:text-white">
                Frequently Asked Questions
              </h3>
              <div className="grid gap-6 md:grid-cols-2">
                {[
                  {
                    q: "How quickly can I start processing payments?",
                    a: "Most merchants are approved within 24-48 hours and can begin processing immediately after receiving their equipment."
                  },
                  {
                    q: "Are there any long-term contracts?",
                    a: "No. We believe in earning your business every day. Our solutions come with no long-term contracts or early termination fees."
                  },
                  {
                    q: "Is your zero-fee program compliant with card brand rules?",
                    a: "Yes. Our surcharging program is fully compliant with Visa, Mastercard, Discover, and American Express regulations. We handle all updates automatically."
                  },
                  {
                    q: "Do you offer technical support?",
                    a: "Absolutely. We provide 24/7 technical support via phone, email, and chat to ensure your payment systems are always running smoothly."
                  }
                ].map((faq, index) => (
                  <motion.div
                    key={index}
                    className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl"
                    whileHover={{ y: -2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                  >
                    <h4 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
                      {faq.q}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      {faq.a}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/**
           * CONTACT SECTION
           */}
          <div
            className="relative px-4 py-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800"
            id="contact"
          >
            <div className="max-w-6xl mx-auto">
              <div className="mb-12 text-center">
                <span className="inline-block px-4 py-1 mb-4 text-sm font-medium text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-300 rounded-full">
                  Get in Touch
                </span>
                <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
                  Ready to Get Started?
                </h2>
                <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400">
                  Talk to a payment expert today and discover how we can help
                  your business grow.
                </p>
              </div>

              <div className="grid items-start gap-12 md:grid-cols-2">
                <div className="p-8 bg-white dark:bg-gray-700 border border-gray-100 dark:border-gray-600 shadow-lg rounded-2xl">
                  <form onSubmit={handleContactSubmit} className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      <div>
                        <label
                          htmlFor="contact-firstName"
                          className="block mb-2 text-sm font-medium text-gray-700 dark:text-white"
                        >
                          First Name*
                        </label>
                        <input
                          type="text"
                          id="contact-firstName"
                          name="firstName"
                          value={contactFormData.firstName}
                          onChange={handleContactInputChange}
                          className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-full bg-gray-50 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          placeholder="John"
                          required
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="contact-lastName"
                          className="block mb-2 text-sm font-medium text-gray-700 dark:text-white"
                        >
                          Last Name*
                        </label>
                        <input
                          type="text"
                          id="contact-lastName"
                          name="lastName"
                          value={contactFormData.lastName}
                          onChange={handleContactInputChange}
                          className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-full bg-gray-50 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          placeholder="Doe"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="contact-email"
                        className="block mb-2 text-sm font-medium text-gray-700 dark:text-white"
                      >
                        Business Email*
                      </label>
                      <input
                        type="email"
                        id="contact-email"
                        name="email"
                        value={contactFormData.email}
                        onChange={handleContactInputChange}
                        className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-full bg-gray-50 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="john@yourcompany.com"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="contact-phone"
                        className="block mb-2 text-sm font-medium text-gray-700 dark:text-white"
                      >
                        Phone Number*
                      </label>
                      <input
                        type="tel"
                        id="contact-phone"
                        name="phone"
                        value={contactFormData.phone}
                        onChange={handleContactInputChange}
                        className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-full bg-gray-50 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="(555) 123-4567"
                        required
                      />
                    </div>
                    <div className="grid gap-6 md:grid-cols-2">
                      <div>
                        <label
                          htmlFor="callDate"
                          className="block mb-2 text-sm font-medium text-gray-700 dark:text-white"
                        >
                          Preferred Call Date
                        </label>
                        <input
                          type="date"
                          id="callDate"
                          name="callDate"
                          value={contactFormData.callDate}
                          onChange={handleContactInputChange}
                          className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-full bg-gray-50 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="preferredTime"
                          className="block mb-2 text-sm font-medium text-gray-700 dark:text-white"
                        >
                          Preferred Time
                        </label>
                        <select
                          id="preferredTime"
                          name="preferredTime"
                          value={contactFormData.preferredTime}
                          onChange={handleContactInputChange}
                          className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-full bg-gray-50 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        >
                          <option value="">Select a time</option>
                          <option value="morning">Morning (9AM - 12PM)</option>
                          <option value="afternoon">
                            Afternoon (12PM - 5PM)
                          </option>
                          <option value="evening">Evening (5PM - 8PM)</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">
                        Number of Locations
                      </label>
                      <div className="flex flex-wrap items-center gap-2">
                        {['1', '2', '3', '4', '5'].map((opt) => (
                          <motion.button
                            key={opt}
                            type="button"
                            whileTap={{ scale: 0.95 }}
                            onClick={(ev) => {
                              ev.preventDefault();
                              dispatchContact({
                                type: 'UPDATE_FIELD',
                                payload: { name: 'numLocationsChoice', value: opt }
                              });
                            }}
                            className={`px-4 py-2 rounded-full text-sm shadow-sm ${
                              contactFormData.numLocationsChoice === opt
                                ? 'bg-blue-600 text-white dark:bg-blue-500'
                                : 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500'
                            }`}
                            aria-label={`Select ${opt} location${opt !== '1' ? 's' : ''}`}
                          >
                            {opt}
                          </motion.button>
                        ))}
                        <motion.button
                          type="button"
                          whileTap={{ scale: 0.95 }}
                          onClick={(ev) => {
                            ev.preventDefault();
                            dispatchContact({
                              type: 'UPDATE_FIELD',
                              payload: { name: 'numLocationsChoice', value: 'plus' }
                            });
                          }}
                          className={`px-4 py-2 rounded-full text-sm shadow-sm ${
                            contactFormData.numLocationsChoice === 'plus'
                              ? 'bg-blue-600 text-white dark:bg-blue-500'
                              : 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500'
                          }`}
                          aria-label="More than 5 locations"
                        >
                          6+
                        </motion.button>
                      </div>
                      {contactFormData.numLocationsChoice === 'plus' && (
                        <div className="mt-3">
                          <label
                            htmlFor="numLocationsCustom"
                            className="block mb-1 text-sm text-gray-600 dark:text-gray-400"
                          >
                            Enter number of locations:
                          </label>
                          <input
                            type="number"
                            id="numLocationsCustom"
                            min="6"
                            name="numLocationsCustom"
                            value={contactFormData.numLocationsCustom}
                            onChange={handleContactInputChange}
                            className="w-32 px-4 py-2 border rounded-full dark:bg-gray-800 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            aria-label="Custom number of locations"
                          />
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">
                        Monthly Processing Volume
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {['0-50K', '50K-250K', '250K-1MM', '1MM+'].map((range) => (
                          <motion.button
                            key={range}
                            type="button"
                            whileTap={{ scale: 0.95 }}
                            onClick={(ev) => {
                              ev.preventDefault();
                              dispatchContact({
                                type: 'UPDATE_FIELD',
                                payload: { name: 'monthlyVolume', value: range }
                              });
                            }}
                            className={`px-4 py-2 rounded-full border text-sm shadow-sm ${
                              contactFormData.monthlyVolume === range
                                ? 'bg-blue-600 text-white border-blue-600 dark:bg-blue-500 dark:border-blue-500'
                                : 'text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                            }`}
                            aria-label={`Monthly volume: ${range}`}
                          >
                            {range === '0-50K' && '$0-50K'}
                            {range === '50K-250K' && '$50K-250K'}
                            {range === '250K-1MM' && '$250K-1MM'}
                            {range === '1MM+' && '$1MM+'}
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Privacy notice */}
                    <div className="text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                      <p className="flex items-start">
                        <FaLock className="text-green-600 dark:text-green-400 mt-0.5 mr-2 flex-shrink-0" />
                        <span>
                          By submitting this form, you agree to our{' '}
                          <Link
                            href="/privacy"
                            className="text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            Privacy Policy
                          </Link>
                          . We’ll never share your information with third parties.
                        </span>
                      </p>
                    </div>

                    <div className="space-y-4">
                      <motion.button
                        type="submit"
                        className="w-full py-4 px-6 rounded-full font-semibold text-white bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
                        whileHover={{
                          scale: 1.02,
                          boxShadow: '0px 4px 20px rgba(59,130,246,0.3)'
                        }}
                        whileTap={{ scale: 0.98 }}
                        disabled={contactSubmission.isLoading}
                      >
                        {contactSubmission.isLoading ? (
                          <span className="flex items-center justify-center">
                            <svg
                              className="w-5 h-5 mr-3 -ml-1 text-white animate-spin"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Sending...
                          </span>
                        ) : (
                          'Get Your Free Consultation'
                        )}
                      </motion.button>
                    </div>

                    {contactSubmission.status !== 'idle' && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-4 rounded-lg mt-2 ${
                          contactSubmission.status === 'success'
                            ? 'bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-200'
                        }`}
                        role="alert"
                      >
                        {contactSubmission.message}
                      </motion.div>
                    )}
                  </form>
                </div>

                <div className="space-y-8">
                  <div className="p-8 bg-white dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-2xl shadow-lg">
                    <h3 className="mb-6 text-2xl font-semibold dark:text-white">
                      Why Businesses Choose Us
                    </h3>
                    <div className="space-y-6">
                      {[
                        {
                          title: 'Save on Processing Fees',
                          description:
                            'Our transparent pricing and zero-fee options save merchants up to 100% of their processing costs.',
                          icon: (
                            <FaChartLine className="text-green-500 dark:text-green-400 text-2xl" />
                          )
                        },
                        {
                          title: 'Local Support Team',
                          description:
                            'Get personalized assistance from payment experts who understand your local market and industry.',
                          icon: (
                            <FaUsers className="text-blue-500 dark:text-blue-400 text-2xl" />
                          )
                        },
                        {
                          title: 'Future-Proof Technology',
                          description:
                            'We continually update our systems to support the latest payment methods and security standards.',
                          icon: (
                            <FaMobileAlt className="text-purple-500 dark:text-purple-400 text-2xl" />
                          )
                        }
                      ].map((item, index) => (
                        <motion.div
                          key={index}
                          className="flex items-start space-x-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-800"
                          whileHover={{
                            y: -2,
                            boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                          }}
                        >
                          <div className="flex-shrink-0 p-3 bg-white dark:bg-gray-700 rounded-full shadow-sm">
                            {item.icon}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                              {item.title}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {item.description}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-center p-8 bg-white dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-xl shadow-lg">
                    <Image
                      src="/staracceptlogo.png"
                      alt="Star Accept Business Solutions"
                      width={300}
                      height={80}
                      className="w-auto h-auto"
                      priority
                    />
                  </div>

                  <div className="p-6 bg-white dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-xl shadow-lg">
                    <h3 className="mb-4 text-xl font-semibold dark:text-white">
                      Direct Contact
                    </h3>
                    <div className="space-y-4">
                      <a
                        href="tel:+18888857333"
                        className="flex items-center p-3 space-x-3 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 bg-gray-50 dark:bg-gray-800 rounded-xl transition-colors"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                        <span>(888) 885-7333</span>
                      </a>
                      <a
                        href="mailto:support@staraccept.com"
                        className="flex items-center p-3 space-x-3 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 bg-gray-50 dark:bg-gray-800 rounded-xl transition-colors"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                        <span>support@staraccept.com</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/**
           * FOOTER & Floating “Apply Now”
           */}
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
            {/* Floating "Apply Now" Bar -- full-width at bottom */}
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
        </div>
      </main>
    </ThemeProvider>
  );
}
