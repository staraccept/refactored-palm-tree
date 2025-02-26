"use client";

import React, { useState, useEffect, useRef, useCallback, useReducer, useMemo } from 'react';
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
  FaLaptop,
  FaRegLightbulb,
  FaTools
} from 'react-icons/fa';
import { ThemeProvider, useTheme } from './components/ThemeProvider';
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

// Utility functions
function matchRecommendedItem(recommendation: string) {
  const recLower = recommendation.trim().toLowerCase();
  let matched = posProducts.find((p) => p.name.toLowerCase() === recLower);
  if (!matched) {
    matched = posProducts.find(
      (p) =>
        p.name.toLowerCase().includes(recLower) ||
        recLower.includes(p.name.toLowerCase())
    );
  }
  if (!matched) {
    return {
      name: recommendation,
      image: null,
      features: [],
      bestFor: [],
      cta: ''
    };
  }
  return matched;
}

function AiSearchOverlay() {
  const sampleQueries = useMemo(() => [
    "I own a coffee shop and need a fast checkout system",
    "I want a system that supports Apple Pay and QR codes",
    "I have two locations and need real-time inventory sync",
  ], []);
  
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

  // Set cursor animation only once
  useEffect(() => {
    if (cursorRef.current) {
      cursorRef.current.style.animation = "blink 1s infinite";
    }
  }, []);

  // Optimized typing effect
  useEffect(() => {
    if (userQuery) return; // Skip when user has entered something
    
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
  }, [typedText, isDeleting, currentSampleIndex, sampleQueries, userQuery, pauseAtEndOfSample, typingSpeed]);

  // Clean user query to improve matching
  const preprocessQuery = (query: string): string => {
    // Remove common filler phrases
    return query
      .toLowerCase()
      .replace(/i am a|i'm a|i need a|looking for|we are a|we need|i want|we want|i have a|we have a/gi, '')
      .trim();
  };

  // Optimized search functionality
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

    // Preprocess query for better matching
    const processedQuery = preprocessQuery(query);

    setSearchState(prev => ({
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
      
      if (!data.recommendations || !Array.isArray(data.recommendations) || data.recommendations.length === 0) {
        // Enhanced local search
        const fallbackProducts = localFindProducts(processedQuery, 3);
        
        if (fallbackProducts.length > 0) {
          setSearchState(prev => ({
            ...prev,
            isLoading: false,
            recommendations: fallbackProducts
          }));
        } else {
          // If even the enhanced local search finds nothing, try a more generic fallback
          const genericFallback = localFindProducts('pos', 3);
          
          if (genericFallback.length > 0) {
            setSearchState(prev => ({
              ...prev,
              isLoading: false,
              recommendations: genericFallback,
              errorMessage: "No exact matches. Here are our most popular systems:"
            }));
          } else {
            setSearchState(prev => ({
              ...prev,
              isLoading: false,
              errorMessage: "No recommendations found for your query."
            }));
          }
        }
      } else {
        // Process API recommendations
        const matchedItems = data.recommendations.map((r: string) => matchRecommendedItem(r));
        
        // If matched items are all valid, use them
        if (matchedItems.every((item: { name: any; features: string | any[]; }) => item.name && item.features.length > 0)) {
          setSearchState(prev => ({
            ...prev,
            isLoading: false,
            recommendations: matchedItems
          }));
        } else {
          // Some API-matched items are invalid, fall back to local search
          const fallbackProducts = localFindProducts(processedQuery, 3);
          
          if (fallbackProducts.length > 0) {
            setSearchState(prev => ({
              ...prev,
              isLoading: false,
              recommendations: fallbackProducts
            }));
          } else {
            // If all fails, return the valid API results (even if incomplete)
            const validMatchedItems = matchedItems.filter((item: { name: any; }) => item.name);
            
            if (validMatchedItems.length > 0) {
              setSearchState(prev => ({
                ...prev,
                isLoading: false,
                recommendations: validMatchedItems
              }));
            } else {
              setSearchState(prev => ({
                ...prev,
                isLoading: false,
                errorMessage: "Could not find suitable recommendations."
              }));
            }
          }
        }
      }
    } catch (error: any) {
      console.error("Error fetching recommendations:", error);
      
      // Context-aware fallback: check for professional terms
      const isProfessionalQuery = /lawyer|attorney|legal|accountant|doctor|medical|professional|tax|consultant/i.test(query);
      const isRetailQuery = /retail|shop|store|boutique|merchandise|clothing/i.test(query);
      const isFoodQuery = /restaurant|food|café|cafe|dining|bar|kitchen/i.test(query);
      
      let fallbackProducts;
      
      if (isProfessionalQuery) {
        // For professional services, recommend Mini and Flex
        fallbackProducts = posProducts
          .filter(p => p.identifier === 'mini3' || p.identifier === 'flex4')
          .slice(0, 3);
      } else if (isRetailQuery) {
        // For retail, recommend Mini, Solo, or Kiosk
        fallbackProducts = posProducts
          .filter(p => p.identifier === 'mini3' || p.identifier === 'solo' || p.identifier === 'kiosk')
          .slice(0, 3);
      } else if (isFoodQuery) {
        // For food service, recommend Duo 2, Solo, or kitchen products
        fallbackProducts = posProducts
          .filter(p => p.identifier === 'duo2' || p.identifier === 'solo' || p.identifier === 'kds')
          .slice(0, 3);
      } else {
        // Generic fallback using enhanced local search
        fallbackProducts = localFindProducts(processedQuery, 3);
      }
      
      if (fallbackProducts.length > 0) {
        setSearchState(prev => ({
          ...prev,
          isLoading: false,
          recommendations: fallbackProducts
        }));
      } else {
        // As a final fallback, just return versatile products
        const defaultFallbacks = posProducts
          .filter(p => p.identifier === 'mini3' || p.identifier === 'flex4')
          .slice(0, 2);
        
        setSearchState(prev => ({
          ...prev,
          isLoading: false,
          recommendations: defaultFallbacks,
          errorMessage: "We couldn't process your request. Here are our most versatile options:"
        }));
      }
    }
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (userQuery) {
        fetchRecommendations(userQuery);
      }
    }, 600);
    
    return () => clearTimeout(timer);
  }, [userQuery, fetchRecommendations]);

  // Handle click outside to close results
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setSearchState(prev => ({ ...prev, showResults: false }));
      }
    }
    
    function handleEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setSearchState(prev => ({ ...prev, showResults: false }));
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
      setSearchState(prev => ({ ...prev, showResults: true }));
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
                <div className="w-4 h-4 border-2 border-t-transparent border-gray-400 rounded-full animate-spin" aria-hidden="true"></div>
                <span>Fetching recommendations...</span>
              </div>
            )}

            {!isLoading && errorMessage && (
              <div className="text-red-500 dark:text-red-300 mb-4" role="alert">{errorMessage}</div>
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

// Main component
export default function Home() {
  // State management - using reducer for complex state
  type SelectorAction = 
    | { type: 'SET_BUSINESS_TYPE', payload: string }
    | { type: 'TOGGLE_SOFTWARE_NEED', payload: string }
    | { type: 'TOGGLE_ONLINE_ORDERING' }
    | { type: 'SET_QUANTITY', payload: { deviceType: keyof ProductSelectorData, value: number } }
    | { type: 'UPDATE_FIELD', payload: { name: string, value: string } }
    | { type: 'RESET_FORM' };

  const selectorReducer = (state: ProductSelectorData, action: SelectorAction): ProductSelectorData => {
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
    | { type: 'UPDATE_FIELD', payload: { name: string, value: string } }
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
  const [selectorData, dispatchSelector] = useReducer(selectorReducer, initialSelectorData);
  const [contactFormData, dispatchContact] = useReducer(contactReducer, initialContactFormData);
  const [submissionState, setSubmissionState] = useState({
    isLoading: false,
    selectorStatus: 'idle' as 'idle' | 'success' | 'error',
    selectorMessage: '',
    contactStatus: 'idle' as 'idle' | 'success' | 'error',
    contactMessage: ''
  });

  const { darkMode, toggleDarkMode } = useTheme();

  // Memoized values
  const images = useMemo(() => [
    { src: '/retailflex3.png', alt: 'Flexible Payment Terminal' },
    { src: '/qsrduo2.png', alt: 'QSR Duo POS System' },
    { src: '/retailmini3.png', alt: 'Retail Mini POS' },
  ], []);

  // Image carousel with cleanup
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [images.length]);

  // Optimized scroll function
  const scrollWizardToTop = useCallback(() => {
    const wizardSection = document.getElementById('product-selector');
    wizardSection?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Optimized form handlers with useCallback
  const handleNextStep = useCallback(() => {
    // Form validation
    if (wizardStep === 1 && !selectorData.businessType) {
      alert('Please select a business type.');
      return;
    }
    
    if (wizardStep === 2 && selectorData.businessType === 'restaurant' && selectorData.softwareNeeds.length === 0) {
      alert('Please select whether your restaurant is Full-Service or Quick-Service.');
      return;
    }
    
    if (wizardStep === 3) {
      const totalDevices =
        selectorData.fullServicePosQty +
        selectorData.barServicePosQty +
        selectorData.miniPosQty +
        selectorData.handheldPosQty +
        selectorData.kitchenPrinterQty +
        selectorData.kitchenDisplayQty +
        selectorData.kioskQty;
        
      if (totalDevices === 0) {
        alert('Please select at least one device or hardware option.');
        return;
      }
    }
    
    if (wizardStep === 4) {
      const { firstName, lastName, email, phone } = selectorData;
      
      if (!firstName || !lastName || !email || !phone) {
        alert('Please fill in your contact information.');
        return;
      }
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        alert('Please enter a valid email address.');
        return;
      }
    }
    
    setWizardStep((prev) => {
      const newStep = Math.min(prev + 1, 5);
      setTimeout(scrollWizardToTop, 50);
      return newStep;
    });
  }, [wizardStep, selectorData, scrollWizardToTop]);

  const handlePreviousStep = useCallback(() => {
    setWizardStep((prev) => {
      const newStep = Math.max(prev - 1, 1);
      setTimeout(scrollWizardToTop, 50);
      return newStep;
    });
  }, [scrollWizardToTop]);

  const handleSelectorInputChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    deviceType?: keyof ProductSelectorData
  ) => {
    const { name, value, type } = e.target;
    
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
      payload: { name, value } 
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
    setSubmissionState(prev => ({ 
      ...prev, 
      isLoading: true, 
      selectorStatus: 'idle', 
      selectorMessage: '' 
    }));
    
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
      
      let finalLocations = numLocationsChoice === 'plus' ? numLocationsCustom : numLocationsChoice;
      
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
      
      if (response.ok) {
        setSubmissionState(prev => ({
          ...prev,
          selectorStatus: 'success',
          selectorMessage: "Thank you! We'll be in touch shortly to assist with your needs."
        }));
        
        dispatchSelector({ type: 'RESET_FORM' });
        setWizardStep(1);
        setTimeout(scrollWizardToTop, 50);
      } else {
        const errorBody = await response.text();
        console.error(`Failed to send data: ${response.status} ${errorBody}`);
        
        setSubmissionState(prev => ({
          ...prev,
          selectorStatus: 'error',
          selectorMessage: `Error. Please try again or contact us. Status: ${response.status}`
        }));
      }
    } catch (error) {
      console.error('Submission error:', error);
      
      setSubmissionState(prev => ({
        ...prev,
        selectorStatus: 'error',
        selectorMessage: 'Error. Please try again or contact us.'
      }));
    } finally {
      setSubmissionState(prev => ({ ...prev, isLoading: false }));
    }
  }, [selectorData, scrollWizardToTop]);

  const handleContactInputChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    dispatchContact({ 
      type: 'UPDATE_FIELD', 
      payload: { name, value } 
    });
  }, []);

  const handleContactSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    setSubmissionState(prev => ({ 
      ...prev, 
      isLoading: true, 
      contactStatus: 'idle', 
      contactMessage: '' 
    }));

    const requiredFields = ['firstName', 'lastName', 'email', 'phone'];
    const missingFields = requiredFields.filter(
      field => !contactFormData[field as keyof typeof contactFormData]
    );
    
    if (missingFields.length > 0) {
      setSubmissionState(prev => ({
        ...prev,
        isLoading: false,
        contactStatus: 'error',
        contactMessage: 'Please fill in all required fields: ' + missingFields.join(', ')
      }));
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactFormData.email)) {
      setSubmissionState(prev => ({
        ...prev,
        isLoading: false,
        contactStatus: 'error',
        contactMessage: 'Please enter a valid email address.'
      }));
      return;
    }

    let finalLocations = contactFormData.numLocationsChoice === 'plus'
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
        numLocations: finalLocations || '',
        monthlyVolume: contactFormData.monthlyVolume,
        submitTime: new Date().toISOString(),
        formType: 'contactPage',
      });
      
      const url = `https://hooks.zapier.com/hooks/catch/17465641/2awchwj/?${params.toString()}`;
      const response = await fetch(url, { method: 'GET' });
      
      if (response.ok) {
        setSubmissionState(prev => ({
          ...prev,
          contactStatus: 'success',
          contactMessage: "Thank you! We'll be in touch shortly to assist with your needs."
        }));
        
        dispatchContact({ type: 'RESET_FORM' });
      } else {
        const errorBody = await response.text();
        console.error(`Failed: ${response.status} ${errorBody}`);
        
        setSubmissionState(prev => ({
          ...prev,
          contactStatus: 'error',
          contactMessage: `Error sending message. Please try again or contact us. Status: ${response.status}`
        }));
      }
    } catch (error) {
      console.error('Submission error:', error);
      
      setSubmissionState(prev => ({
        ...prev,
        contactStatus: 'error',
        contactMessage: 'Error sending message. Please try again or contact us.'
      }));
    } finally {
      setSubmissionState(prev => ({ ...prev, isLoading: false }));
    }
  }, [contactFormData]);

  // Memoized wizard step rendering
  const renderStepContent = useCallback(() => {
    switch (wizardStep) {
      case 1: // Business Type Selection
        return (
          <div className="text-gray-900 dark:text-white">
            <h3 className="mb-4 text-xl font-semibold">What type of business do you have?</h3>
            <p className="mb-6 text-gray-600 dark:text-gray-400">So we can tailor the right POS solution for you.</p>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[
                { type: 'retail', title: 'Retail', img: '/retail.jpg' },
                { type: 'restaurant', title: 'Restaurant', img: '/restaurant.jpg' },
                { type: 'services', title: 'Services', img: '/services.jpg' },
                { type: 'other', title: 'Other', img: '/other.jpg' }
              ].map(item => (
                <motion.button
                  key={item.type}
                  whileHover={{ scale: 1.07 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => dispatchSelector({ type: 'SET_BUSINESS_TYPE', payload: item.type })}
                  className={`p-4 border transition-colors rounded-3xl ${
                    selectorData.businessType === item.type
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900 dark:border-blue-700'
                      : 'border-gray-200 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800'
                  }`}
                  aria-label={`Select ${item.title} business type`}
                >
                  <div className="flex justify-center mb-4">
                    <Image
                      src={item.img}
                      alt={item.title}
                      width={200}
                      height={200}
                      style={{ objectFit: 'cover' }}
                      className="rounded"
                    />
                  </div>
                  <h4 className="text-lg font-semibold text-center">{item.title}</h4>
                </motion.button>
              ))}
            </div>
          </div>
        );
        
      case 2: // Restaurant type or online ordering
        if (selectorData.businessType === 'restaurant') {
          return (
            <div className="text-gray-900 dark:text-white">
              <h3 className="mb-4 text-xl font-semibold">What type of restaurant?</h3>
              <p className="mb-6 text-gray-600 dark:text-gray-400">
                Select Full-Service and/or Quick-Service as needed.
              </p>
              <div className="space-y-4">
                {[
                  { id: 'full-service', label: 'Full-Service Dining' },
                  { id: 'quick-service', label: 'Quick-Service' }
                ].map(option => (
                  <motion.div
                    key={option.id}
                    className={`flex items-center p-3 border rounded-3xl cursor-pointer mb-2 ${
                      selectorData.softwareNeeds.includes(option.id)
                        ? 'bg-blue-50 border-blue-500 dark:bg-blue-900 dark:border-blue-700'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800 dark:border-gray-700'
                    }`}
                    onClick={() => dispatchSelector({ type: 'TOGGLE_SOFTWARE_NEED', payload: option.id })}
                  >
                    <input
                      type="checkbox"
                      id={`restaurant-type-${option.id}`}
                      className="mr-3"
                      checked={selectorData.softwareNeeds.includes(option.id)}
                      onChange={() => {}}
                      aria-label={option.label}
                    />
                    <label htmlFor={`restaurant-type-${option.id}`} className="cursor-pointer flex-grow">{option.label}</label>
                  </motion.div>
                ))}
              </div>
            </div>
          );
        }
        
        return (
          <div className="text-gray-900 dark:text-white">
            <h3 className="mb-4 text-xl font-semibold">Do you need online ordering capabilities?</h3>
            <p className="mb-6 text-gray-600 dark:text-gray-400">
              Select if you need online ordering for your business.
            </p>
            <motion.div
              className={`flex items-center p-3 border rounded-3xl cursor-pointer ${
                selectorData.onlineOrdering
                  ? 'bg-blue-50 border-blue-500 dark:bg-blue-900 dark:border-blue-700'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800 dark:border-gray-700'
              }`}
              onClick={() => dispatchSelector({ type: 'TOGGLE_ONLINE_ORDERING' })}
            >
              <input
                type="checkbox"
                id="online-ordering"
                className="mr-3"
                checked={selectorData.onlineOrdering}
                onChange={() => {}}
                aria-label="Need online ordering"
              />
              <label htmlFor="online-ordering" className="cursor-pointer flex-grow">Yes, I need online ordering</label>
            </motion.div>
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
                  <div
                    key={product.identifier}
                    className="p-4 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl flex flex-col items-center"
                  >
                    {product.image && (
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={200}
                        height={200}
                        style={{ objectFit: 'cover' }}
                        className="mb-4 rounded"
                      />
                    )}
                    <h4 className="text-lg font-semibold mb-2">{product.name}</h4>
                    {product.features && (
                      <p className="mb-4 text-sm text-gray-600 dark:text-gray-300 text-center">
                        {product.features.join(", ")}
                      </p>
                    )}
                    <div className="flex items-center">
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleQuantityChange(deviceType!, -1)}
                        className="px-3 py-2 bg-gray-200 dark:bg-gray-600 rounded-l-full"
                        aria-label={`Decrease ${product.name} quantity`}
                      >
                        -
                      </motion.button>
                      <input
                        type="number"
                        className="w-16 mx-0 text-center border dark:border-gray-600 dark:bg-gray-800"
                        value={qtyVal}
                        onChange={(e) => handleSelectorInputChange(e, deviceType!)}
                        aria-label={`${product.name} quantity`}
                        min="0"
                      />
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleQuantityChange(deviceType!, 1)}
                        className="px-3 py-2 bg-gray-200 dark:bg-gray-600 rounded-r-full"
                        aria-label={`Increase ${product.name} quantity`}
                      >
                        +
                      </motion.button>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-6 text-center">
              <Link
                href="/poslineup"
                className="inline-block px-5 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
              >
                View All POS Systems
              </Link>
            </div>
          </div>
        );
        
      case 4: // Contact Information
        return (
          <div className="text-gray-900 dark:text-white">
            <h3 className="mb-4 text-xl font-semibold">Almost done!</h3>
            <p className="mb-6 text-gray-600 dark:text-gray-400">
              Enter your contact details and business specifics to receive your personalized quote.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block mb-1 text-sm font-medium">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={selectorData.firstName}
                  onChange={handleSelectorInputChange}
                  className="w-full px-4 py-2 border rounded-full dark:bg-gray-800 dark:border-gray-700"
                  required
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block mb-1 text-sm font-medium">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={selectorData.lastName}
                  onChange={handleSelectorInputChange}
                  className="w-full px-4 py-2 border rounded-full dark:bg-gray-800 dark:border-gray-700"
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
                className="w-full px-4 py-2 border rounded-full dark:bg-gray-800 dark:border-gray-700"
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
                className="w-full px-4 py-2 border rounded-full dark:bg-gray-800 dark:border-gray-700"
                required
              />
            </div>
            <div className="mt-6">
              <label className="block mb-1 text-sm font-medium">Number of Locations</label>
              <div className="flex items-center gap-2">
                {['1', '2', '3', '4', '5'].map((opt) => (
                  <motion.button
                    key={opt}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => dispatchSelector({ 
                      type: 'UPDATE_FIELD', 
                      payload: { name: 'numLocationsChoice', value: opt } 
                    })}
                    className={`px-3 py-2 rounded-full text-sm ${
                      selectorData.numLocationsChoice === opt
                        ? 'bg-blue-600 text-white dark:bg-blue-500'
                        : 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200'
                    }`}
                    aria-label={`${opt} location${opt !== '1' ? 's' : ''}`}
                  >
                    {opt}
                  </motion.button>
                ))}
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => dispatchSelector({ 
                    type: 'UPDATE_FIELD', 
                    payload: { name: 'numLocationsChoice', value: 'plus' } 
                  })}
                  className={`px-3 py-2 rounded-full text-sm ${
                    selectorData.numLocationsChoice === 'plus'
                      ? 'bg-blue-600 text-white dark:bg-blue-500'
                      : 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200'
                  }`}
                  aria-label="More than 5 locations"
                >
                  +
                </motion.button>
              </div>
              {selectorData.numLocationsChoice === 'plus' && (
                <div className="mt-3">
                  <label htmlFor="numLocationsCustom" className="block mb-1 text-sm text-gray-600 dark:text-gray-400">
                    Enter custom number:
                  </label>
                  <input
                    type="number"
                    id="numLocationsCustom"
                    min="1"
                    name="numLocationsCustom"
                    value={selectorData.numLocationsCustom}
                    onChange={handleSelectorInputChange}
                    className="w-32 px-4 py-2 border rounded-full dark:bg-gray-800 dark:border-gray-700"
                    aria-label="Custom number of locations"
                  />
                </div>
              )}
            </div>
            <div className="mt-6">
              <label className="block mb-1 text-sm font-medium">Monthly Processing Volume</label>
              <div className="flex flex-wrap gap-2">
                {['0-50K', '50K-250K', '250K-1MM', '1MM+'].map((range) => (
                  <motion.button
                    key={range}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => dispatchSelector({ 
                      type: 'UPDATE_FIELD', 
                      payload: { name: 'monthlyVolume', value: range } 
                    })}
                    className={`px-4 py-2 rounded-full border text-sm ${
                      selectorData.monthlyVolume === range
                        ? 'bg-blue-600 text-white border-blue-600 dark:bg-blue-500 dark:border-blue-500'
                        : 'text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700'
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
          </div>
        );
        
      case 5: // Review & Submit
        const { selectorStatus, selectorMessage, isLoading } = submissionState;
        
        if (selectorStatus === 'success') {
          return (
            <div className="text-center">
              <h3 className="mb-4 text-2xl font-semibold">Thank You!</h3>
              <p className="mb-4">{selectorMessage}</p>
            </div>
          );
        }
        
        if (selectorStatus === 'error') {
          return (
            <div className="text-center">
              <h3 className="mb-4 text-2xl font-semibold text-red-600">Error</h3>
              <p className="mb-4">{selectorMessage}</p>
            </div>
          );
        }
        
        const { numLocationsChoice, numLocationsCustom } = selectorData;
        const finalLocations = numLocationsChoice === 'plus' ? numLocationsCustom : numLocationsChoice;
        
        return (
          <>
            <h3 className="mb-4 text-xl font-semibold dark:text-white">Review Your Choices</h3>
            <div className="space-y-2 text-gray-700 dark:text-gray-100">
              <p>
                <strong>Business Type:</strong> {selectorData.businessType}
              </p>
              {selectorData.businessType === 'restaurant' && (
                <p>
                  <strong>Restaurant Type:</strong> {selectorData.softwareNeeds.join(', ')}
                </p>
              )}
              {selectorData.businessType !== 'restaurant' && selectorData.onlineOrdering && (
                <p>
                  <strong>Online Ordering:</strong> Yes
                </p>
              )}
              <p>
                <strong>Clover Station Duo 2:</strong> {selectorData.fullServicePosQty}
              </p>
              <p>
                <strong>Clover Station Solo:</strong> {selectorData.barServicePosQty}
              </p>
              <p>
                <strong>Mini 3:</strong> {selectorData.miniPosQty}
              </p>
              <p>
                <strong>Clover Flex 4:</strong> {selectorData.handheldPosQty}
              </p>
              <p>
                <strong>Star Kitchen Printer:</strong> {selectorData.kitchenPrinterQty}
              </p>
              <p>
                <strong>Clover Kitchen Display:</strong> {selectorData.kitchenDisplayQty}
              </p>
              <p>
                <strong>Clover Kiosk:</strong> {selectorData.kioskQty}
              </p>
              <hr className="my-2 border-gray-300 dark:border-gray-600" />
              <p>
                <strong>Name:</strong> {selectorData.firstName} {selectorData.lastName}
              </p>
              <p>
                <strong>Email:</strong> {selectorData.email}
              </p>
              <p>
                <strong>Phone:</strong> {selectorData.phone}
              </p>
              <p>
                <strong>Number of Locations:</strong> {finalLocations || 'N/A'}
              </p>
              <p>
                <strong>Monthly Volume:</strong> {selectorData.monthlyVolume}
              </p>
            </div>
            <div className="mt-6 text-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSelectorSubmit}
                className="px-8 py-3 text-white transition-colors bg-blue-600 dark:bg-blue-400 rounded-full hover:bg-blue-700 dark:hover:bg-blue-300"
                disabled={isLoading}
              >
                {isLoading ? 'Submitting...' : 'Send Message'}
              </motion.button>
            </div>
          </>
        );
      
      default:
        return null;
    }
  }, [wizardStep, selectorData, submissionState, handleSelectorInputChange, handleQuantityChange, handleSelectorSubmit]);

  // Memoized progress indicator
  const renderProgressIndicator = useCallback(() => {
    const totalSteps = 5;
    return (
      <div className="flex items-center justify-center my-6" role="navigation" aria-label="Form steps">
        {Array.from({ length: totalSteps }).map((_, index) => {
          const stepNum = index + 1;
          return (
            <React.Fragment key={index}>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                  wizardStep > stepNum
                    ? 'bg-blue-600 text-white dark:bg-blue-700'
                    : wizardStep === stepNum
                      ? 'bg-blue-300 text-white dark:bg-blue-500'
                      : 'bg-gray-200 text-gray-500 dark:bg-gray-600 dark:text-gray-400'
                }`}
                aria-current={wizardStep === stepNum ? "step" : undefined}
                aria-label={`Step ${stepNum}${wizardStep === stepNum ? ' (current)' : ''}`}
              >
                {wizardStep > stepNum ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  stepNum
                )}
              </div>
              {stepNum < totalSteps && (
                <div
                  className={`w-16 h-1 transition-colors ${
                    wizardStep > stepNum ? 'bg-blue-600 dark:bg-blue-700' : 'bg-gray-200 dark:bg-gray-600'
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

  // Return the complete component
  return (
    <ThemeProvider>
      <main className={darkMode ? 'dark' : ''}>
        <div className={`min-h-screen text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-900`}>
          <Head>
            <title>StarAccept Business Solutions</title>
            <meta
              name="description"
              content="Affordable, full-service credit card processing with proven, cutting-edge technology. Transform your business."
            />
            <link rel="icon" href="/favicon.ico" />
            <script async src="https://www.googletagmanager.com/gtag/js?id=G-2D18CMVZEF"></script>
            <script
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer = window.dataLayer || [];
                      function gtag(){dataLayer.push(arguments);}
                      gtag('js', new Date());
                      gtag('config', 'G-2D18CMVZEF');`,
              }}
            />
          </Head>

          {/* NAVBAR - With accessibility improvements */}
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
                      href="#contact"
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
                      document.getElementById('product-selector')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    aria-label="Go to POS Wizard"
                  >
                    POS Wizard
                  </motion.button>
                  <button
                    onClick={toggleDarkMode}
                    className="hidden md:inline-block p-2 text-gray-600 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none"
                    aria-label={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
                  >
                    {darkMode ? (
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M12 21a9 9 0 0 1-6.36-2.64C3.09 15.81 2 13 2 9.5 2 5.36 5.36 2 9.5 2c.9 0 1.78.12 2.6.34.82.22 1.6.56 2.28 1.02.68.46 1.24 1.08 1.68 1.8.44.72.78 1.56.98 2.46.2.9.3 1.82.3 2.78 0 3.5-2.54 6.43-5.99 7.6-1.5.53-3.09.8-4.73.8z" />
                      </svg>
                    ) : (
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
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
                    >
                      {isMenuOpen ? (
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      ) : (
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
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
                >
                  Restaurants
                </Link>
                <Link
                  className="block w-full text-left px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  href="/retail"
                  role="menuitem"
                >
                  Retail
                </Link>
                <Link
                  className="block w-full text-left px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  href="/services"
                  role="menuitem"
                >
                  Services
                </Link>
                <Link
                  className="block w-full text-left px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  href="/online-ordering"
                  role="menuitem"
                >
                  Online Ordering
                </Link>
                <Link
                  className="block w-full text-left px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  href="/working-capital-funding"
                  role="menuitem"
                >
                  Working Capital Funding
                </Link>
                <Link
                  className="block w-full text-left px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  href="/poslineup"
                  role="menuitem"
                >
                  POS Systems
                </Link>
                <button
                  className="block w-full text-left px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => {
                    setIsMenuOpen(false);
                    document.getElementById('product-selector')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  role="menuitem"
                >
                  POS Wizard
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

          {/* HERO - Optimized image loading */}
          <div className="relative h-[75vh] md:h-[80vh] lg:h-[90vh] w-full max-w-[1920px] mx-auto pt-24 flex items-center justify-center">
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
                  priority
                  className="object-cover"
                  quality={90}
                  sizes="100vw"
                />
                <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/60 via-black/40 to-transparent"></div>
              </div>
            </motion.div>
            <div className="absolute z-20 flex space-x-2 transform -translate-x-1/2 bottom-8 left-1/2" role="tablist" aria-label="Image carousel controls">
              {images.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all ${currentImage === index ? 'bg-white w-4' : 'bg-white/50'}`}
                  onClick={() => setCurrentImage(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  aria-selected={currentImage === index}
                  role="tab"
                />
              ))}
            </div>
            <div className="absolute inset-0 flex items-center max-w-[1920px] mx-auto">
              <div className="relative z-20 max-w-6xl px-4 mx-auto mt-16">
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl text-white">
                  <motion.h1
                    className="mb-6 text-4xl font-extrabold tracking-tight text-white md:text-5xl lg:text-6xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    Revolutionizing Payments for Modern Businesses
                  </motion.h1>
                  <motion.p
                    className="mb-8 text-xl text-white/80 md:text-2xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    Seamless, Secure, and <span className="text-amber-400 font-semibold">Zero-Fee</span> Processing.
                  </motion.p>
                  <motion.div className="flex flex-wrap gap-4">
                    <motion.a
                      href="https://onboarding.tillpayments.com/signup/6748abe55b6362feca0a75f3"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <motion.button
                        whileHover={{ scale: 1.05, boxShadow: '0px 4px 8px rgba(0,0,0,0.2)' }}
                        whileTap={{ scale: 0.95 }}
                        className="px-8 py-4 text-lg font-semibold text-white transition-colors rounded-full bg-amber-500 hover:bg-amber-600"
                        aria-label="Get Started Now"
                      >
                        Get Started Now
                      </motion.button>
                    </motion.a>
                    <motion.button
                      whileHover={{ scale: 1.05, boxShadow: '0px 4px 8px rgba(0,0,0,0.2)' }}
                      whileTap={{ scale: 0.95 }}
                      className="px-8 py-4 text-lg font-semibold text-white transition-colors border-2 border-white rounded-full hover:bg-white hover:text-amber-500"
                      onClick={() => {
                        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      aria-label="Talk to an Expert"
                    >
                      Talk to an Expert
                    </motion.button>
                    <Link href="/poslineup">
                      <motion.button
                        whileHover={{ scale: 1.05, boxShadow: '0px 4px 8px rgba(0,0,0,0.2)' }}
                        whileTap={{ scale: 0.95 }}
                        className="px-8 py-4 text-lg font-semibold text-white transition-colors bg-blue-600 rounded-full hover:bg-blue-700"
                        aria-label="View All POS Systems"
                      >
                        View All POS Systems
                      </motion.button>
                    </Link>
                  </motion.div>
                  <AiSearchOverlay />
                </motion.div>
              </div>
            </div>
          </div>

          {/* Stats Section - Accessibility and semantic improvements */}
          <section className="py-16 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white">
            <div className="max-w-6xl mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-12">Proven Results, Trusted Service</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
                <div className="flex flex-col items-center p-6 bg-white dark:bg-gray-700 rounded-xl shadow-md text-center">
                  <FaCheckCircle className="text-green-500 dark:text-green-400 text-4xl mb-2" aria-hidden="true" />
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white">99.99%</h3>
                  <p className="mt-2 text-gray-600 dark:text-gray-300">Uptime</p>
                </div>
                <div className="flex flex-col items-center p-6 bg-white dark:bg-gray-700 rounded-xl shadow-md text-center">
                  <FaClock className="text-blue-500 dark:text-blue-400 text-4xl mb-2" aria-hidden="true" />
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white">24/7</h3>
                  <p className="mt-2 text-gray-600 dark:text-gray-300">Support</p>
                </div>
                <div className="flex flex-col items-center p-6 bg-white dark:bg-gray-700 rounded-xl shadow-md text-center">
                  <FaHandshake className="text-orange-500 dark:text-orange-400 text-4xl mb-2" aria-hidden="true" />
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                    Direct Channel
                  </h3>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">No Middleman, No Hidden Fees</p>
                </div>
                <div className="flex flex-col items-center p-6 bg-white dark:bg-gray-700 rounded-xl shadow-md text-center">
                  <FaPuzzlePiece className="text-purple-500 dark:text-purple-400 text-4xl mb-2" aria-hidden="true" />
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white">300+</h3>
                  <p className="mt-2 text-gray-600 dark:text-gray-300">Integrations</p>
                </div>
                <div className="flex flex-col items-center p-6 bg-white dark:bg-gray-700 rounded-xl shadow-md text-center">
                  <FaGlobe className="text-green-600 dark:text-green-400 text-4xl mb-2" aria-hidden="true" />
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white">Global</h3>
                  <p className="mt-2 text-gray-600 dark:text-gray-300">Coverage</p>
                </div>
              </div>
            </div>
          </section>

          {/* Flexible Solutions Section */}
          <section className="py-16 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
            <div className="max-w-6xl mx-auto px-4">
              <div className="mb-12 text-center">
                <h2 className="text-3xl font-bold">Flexible Solutions for Every Business</h2>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  Powerful features and hardware options for wherever you are in your journey
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                {[
                  { icon: FaCreditCard, title: "Payments", desc: "Accept Apple Pay, Google Pay, Android Pay, Samsung Pay, Tap To Pay, and more." },
                  { icon: FaCog, title: "Software", desc: "Manage tables, customize orders, control menus, handle online ordering, and more." },
                  { icon: FaTools, title: "Hardware", desc: "Countertop stations, handheld devices, and KDS options for restaurants of any size." },
                  { icon: FaLaptop, title: "Applications", desc: "Streamline online orders, reservations, loyalty programs, and more." },
                  { icon: FaRegLightbulb, title: "Tailored Solutions", desc: "From ideas on a napkin to your 25th location, we'll find the perfect fit for you." }
                ].map((item, index) => (
                  <div key={index} className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center mb-4">
                      <item.icon className="text-blue-600 dark:text-blue-300 text-3xl" aria-hidden="true" />
                    </div>
                    <h3 className="font-semibold text-lg">{item.title}</h3>
                    <p className="mt-2 text-sm">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Wizard Section - Enhanced with accessibility and optimized rendering */}
          <section className="py-20 bg-gray-50 dark:bg-gray-800" id="product-selector">
            <div className="max-w-6xl px-4 mx-auto">
              <div className="mb-12 text-center">
                <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
                  What's your business type?
                </h2>
                <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400">
                  Answer a few questions to get a personalized recommendation.
                </p>
              </div>
              <div className="p-8 bg-white dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-xl shadow-sm">
                {renderProgressIndicator()}
                <AnimatePresence initial={false} mode="wait">
                  <motion.div
                    key={wizardStep}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  >
                    {renderStepContent()}
                  </motion.div>
                </AnimatePresence>
                {wizardStep < 5 && (
                  <div className="flex justify-between mt-8">
                    <motion.button
                      type="button"
                      onClick={handlePreviousStep}
                      disabled={wizardStep === 1}
                      className={`px-6 py-2 text-gray-600 dark:text-gray-300 rounded-full transition-colors ${wizardStep === 1
                        ? 'opacity-50 cursor-not-allowed bg-gray-200 dark:bg-gray-600'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-600 bg-gray-100 dark:bg-gray-600'
                      }`}
                      whileHover={wizardStep !== 1 ? { scale: 1.05 } : undefined}
                      whileTap={wizardStep !== 1 ? { scale: 0.95 } : undefined}
                      aria-label="Go to previous step"
                    >
                      Previous
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={handleNextStep}
                      disabled={wizardStep === 5}
                      className={`px-6 py-2 text-white bg-blue-600 dark:bg-blue-400 rounded-full transition-colors ${wizardStep === 5 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700 dark:hover:bg-blue-300'
                        }`}
                      whileHover={wizardStep !== 5 ? { scale: 1.05 } : undefined}
                      whileTap={wizardStep !== 5 ? { scale: 0.95 } : undefined}
                      aria-label="Go to next step"
                    >
                      Next
                    </motion.button>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Contact Section - With improved form handling and error states */}
          <div
            className="relative px-4 py-20 bg-gradient-to-b from-gray-50 dark:from-gray-800 to-white dark:to-gray-900"
            id="contact"
          >
            <div className="max-w-6xl mx-auto">
              <div className="mb-12 text-center">
                <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">Local Comes First</h2>
                <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400">
                  Ready to transform your business? Fill out the form below and a local team member will reach out within
                  24 hours.
                </p>
              </div>
              <div className="grid items-start gap-12 md:grid-cols-2">
                <div className="p-8 bg-white dark:bg-gray-700 border border-gray-100 dark:border-gray-600 shadow-sm rounded-xl">
                  <form onSubmit={handleContactSubmit} className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      <div>
                        <label htmlFor="contact-firstName" className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">
                          First Name
                        </label>
                        <input
                          type="text"
                          id="contact-firstName"
                          name="firstName"
                          value={contactFormData.firstName}
                          onChange={handleContactInputChange}
                          className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-full bg-gray-50 dark:bg-gray-800 dark:text-white"
                          placeholder="John"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="contact-lastName" className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">
                          Last Name
                        </label>
                        <input
                          type="text"
                          id="contact-lastName"
                          name="lastName"
                          value={contactFormData.lastName}
                          onChange={handleContactInputChange}
                          className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-full bg-gray-50 dark:bg-gray-800 dark:text-white"
                          placeholder="Doe"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="contact-email" className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">
                        Business Email
                      </label>
                      <input
                        type="email"
                        id="contact-email"
                        name="email"
                        value={contactFormData.email}
                        onChange={handleContactInputChange}
                        className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-full bg-gray-50 dark:bg-gray-800 dark:text-white"
                        placeholder="john@yourcompany.com"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="contact-phone" className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="contact-phone"
                        name="phone"
                        value={contactFormData.phone}
                        onChange={handleContactInputChange}
                        className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-full bg-gray-50 dark:bg-gray-800 dark:text-white"
                        placeholder="(555) 123-4567"
                        required
                      />
                    </div>
                    <div className="grid gap-6 md:grid-cols-2">
                      <div>
                        <label htmlFor="callDate" className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">
                          Preferred Call Date
                        </label>
                        <input
                          type="date"
                          id="callDate"
                          name="callDate"
                          value={contactFormData.callDate}
                          onChange={handleContactInputChange}
                          className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-full bg-gray-50 dark:bg-gray-800 dark:text-white"
                        />
                      </div>
                      <div>
                        <label htmlFor="preferredTime" className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">
                          Preferred Time
                        </label>
                        <select
                          id="preferredTime"
                          name="preferredTime"
                          value={contactFormData.preferredTime}
                          onChange={handleContactInputChange}
                          className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-full bg-gray-50 dark:bg-gray-800 dark:text-white"
                        >
                          <option value="">Select a time</option>
                          <option value="morning">Morning (9AM - 12PM)</option>
                          <option value="afternoon">Afternoon (12PM - 5PM)</option>
                          <option value="evening">Evening (5PM - 8PM)</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">
                        Number of Locations
                      </label>
                      <div className="flex items-center gap-2">
                        {['1', '2', '3', '4', '5'].map((opt) => (
                          <motion.button
                            key={opt}
                            whileTap={{ scale: 0.95 }}
                            onClick={(ev) => {
                              ev.preventDefault();
                              dispatchContact({ 
                                type: 'UPDATE_FIELD',
                                payload: { name: 'numLocationsChoice', value: opt }
                              });
                            }}
                            className={`px-3 py-2 rounded-full text-sm ${contactFormData.numLocationsChoice === opt
                              ? 'bg-blue-600 text-white dark:bg-blue-500'
                              : 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200'
                            }`}
                            aria-label={`Select ${opt} location${opt !== '1' ? 's' : ''}`}
                            type="button"
                          >
                            {opt}
                          </motion.button>
                        ))}
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={(ev) => {
                            ev.preventDefault();
                            dispatchContact({ 
                              type: 'UPDATE_FIELD',
                              payload: { name: 'numLocationsChoice', value: 'plus' }
                            });
                          }}
                          className={`px-3 py-2 rounded-full text-sm ${contactFormData.numLocationsChoice === 'plus'
                            ? 'bg-blue-600 text-white dark:bg-blue-500'
                            : 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200'
                          }`}
                          aria-label="More than 5 locations"
                          type="button"
                        >
                          +
                        </motion.button>
                      </div>
                      {contactFormData.numLocationsChoice === 'plus' && (
                        <div className="mt-3">
                          <label htmlFor="numLocationsCustom" className="block mb-1 text-sm text-gray-600 dark:text-gray-400">
                            Enter custom number:
                          </label>
                          <input
                            type="number"
                            id="numLocationsCustom"
                            min="1"
                            name="numLocationsCustom"
                            value={contactFormData.numLocationsCustom}
                            onChange={handleContactInputChange}
                            className="w-32 px-4 py-2 border rounded-full dark:bg-gray-800 dark:border-gray-700"
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
                            whileTap={{ scale: 0.95 }}
                            onClick={(ev) => {
                              ev.preventDefault();
                              dispatchContact({ 
                                type: 'UPDATE_FIELD',
                                payload: { name: 'monthlyVolume', value: range }
                              });
                            }}
                            className={`px-4 py-2 rounded-full border text-sm ${contactFormData.monthlyVolume === range
                              ? 'bg-blue-600 text-white border-blue-600 dark:bg-blue-500 dark:border-blue-500'
                              : 'text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700'
                            }`}
                            aria-label={`Monthly volume: ${range}`}
                            type="button"
                          >
                            {range === '0-50K' && '$0-50K'}
                            {range === '50K-250K' && '$50K-250K'}
                            {range === '250K-1MM' && '$250K-1MM'}
                            {range === '1MM+' && '$1MM+'}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-4">
                      <motion.button
                        type="submit"
                        className="w-full py-4 px-6 rounded-full font-semibold text-white bg-blue-600 dark:bg-blue-400 hover:bg-blue-700 dark:hover:bg-blue-300 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={submissionState.isLoading}
                      >
                        {submissionState.isLoading ? 'Sending...' : 'Send Message'}
                      </motion.button>
                    </div>
                    {submissionState.contactStatus !== 'idle' && (
                      <div
                        className={`p-4 rounded-lg mt-2 ${submissionState.contactStatus === 'success'
                          ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200'
                        }`}
                        role="alert"
                      >
                        {submissionState.contactMessage}
                      </div>
                    )}
                  </form>
                </div>
                <div className="space-y-8">
                  <div className="p-6 bg-white dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-xl">
                    <h3 className="mb-4 text-xl font-semibold dark:text-white">Why Choose Star Accept?</h3>
                    <div className="space-y-4">
                      {[
                        {
                          title: 'Enterprise-Grade Security',
                          description: 'Your data is protected with industry-leading encryption',
                          icon: '🔒',
                        },
                        {
                          title: 'Quick Integration',
                          description: 'Get up and running in days, not weeks',
                          icon: '⚡',
                        },
                        {
                          title: '24/7 Support',
                          description: 'Our team is always here to help you succeed',
                          icon: '💬',
                        },
                      ].map((item, index) => (
                        <div
                          key={index}
                          className="flex items-start p-4 space-x-4 rounded-lg bg-gray-50 dark:bg-gray-800"
                        >
                          <span className="text-2xl" aria-hidden="true">{item.icon}</span>
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white">{item.title}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-center p-8 bg-white dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-xl">
                    <Image
                      src="/staracceptlogo.png"
                      alt="Star Accept Business Solutions"
                      width={300}
                      height={80}
                      className="w-auto h-auto"
                      priority
                    />
                  </div>
                  <div className="p-6 bg-white dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-xl">
                    <h3 className="mb-4 text-xl font-semibold dark:text-white">Direct Contact</h3>
                    <div className="space-y-4">
                      <a
                        href="tel:+18888857333"
                        className="flex items-center space-x-3 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
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
                        className="flex items-center space-x-3 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
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

          {/* FOOTER */}
          <footer className="py-12 bg-white dark:bg-gray-900">
            <div className="max-w-6xl px-4 mx-auto text-center">
              <div className="mb-6">
                <Image
                  src="/staracceptlogo.png"
                  alt="StarAccept Logo"
                  width={187.5}
                  height={50}
                  className="mx-auto transition-all duration-300 hover:brightness-110 dark:brightness-150"
                />
              </div>
              <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                © {new Date().getFullYear()} Star Accept Business Solutions. All rights reserved.
              </p>
              <div className="flex flex-wrap items-center justify-center space-x-4">
                {/* Additional quick links or social icons can go here */}
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