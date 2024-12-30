      
'use client';
import React, { useState, useEffect, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import ContactDialog from '@/app/components/ui/ContactDialog';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'zapier-interfaces-chatbot-embed': any;
    }
  }
}

declare global {
  interface Window {
    $zChat?: {
      open?: () => void;
    };
  }
}

interface Stat {
  value: string;
  label: string;
  icon: ReactNode;
}

interface Feature {
  icon: ReactNode;
  title: string;
  description: string;
}

interface FAQ {
  question: string;
  answer: string;
}

const stats: Stat[] = [
  {
    value: "99.9%",
    label: "Uptime",
    icon: "⚡"
  },
  {
    value: "24/7",
    label: "Support",
    icon: "💬"
  },
  {
    value: "100K+",
    label: "Users",
    icon: "👥"
  },
  {
    value: "4.9/5",
    label: "Rating",
    icon: "⭐"
  }
];

const features: Feature[] = [
  {
    icon: "💳",
    title: "Payment Processing",
    description: "Accept payments from anywhere in the world"
  },
  {
    icon: "📊",
    title: "Analytics",
    description: "Detailed insights about your business"
  },
  {
    icon: "🔒",
    title: "Security",
    description: "Enterprise-grade security for all transactions"
  },
  {
    icon: "🌐",
    title: "Global Support",
    description: "24/7 support in multiple languages"
  }
];

const faqs: FAQ[] = [
  {
    question: "How do I get started?",
    answer: "Sign up for an account and follow our simple setup guide."
  },
  {
    question: "What are the fees?",
    answer: "We offer competitive rates starting at 2.9% + $0.30 per transaction."
  },
  {
    question: "Is it secure?",
    answer: "Yes, we use bank-level encryption and are PCI compliant."
  }
];

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('standard');
  const [selectedFAQ, setSelectedFAQ] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    callDate: '',
    preferredTime: '',
    pricingPlan: '',
    businessType: '',
    monthlyVolume: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const images = [
    {
      src: '/qsrduo2.png',
      alt: 'QSR Duo POS System'
    },
    {
      src: '/retailduo2.jpg',
      alt: 'Advanced POS Terminal'
    },
    {
      src: '/qsrmini3.png',
      alt: 'Compact POS Solution'
    },
    {
      src: '/retailflex3.png',
      alt: 'Flexible Payment Terminal'
    },
    {
      src: '/retailmini3.png',
      alt: 'Retail Mini POS'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleDemoRequest = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setSubmitStatus('idle');
    setSubmitMessage('');

    // Basic validation
    const requiredFields = ['firstName', 'lastName', 'email', 'phone'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);

    if (missingFields.length > 0) {
      setSubmitStatus('error');
      setSubmitMessage('Please fill in all required fields: ' + missingFields.join(', '));
      setIsLoading(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setSubmitStatus('error');
      setSubmitMessage('Please enter a valid email address');
      setIsLoading(false);
      return;
    }
    try {
      const response = await fetch('https://hooks.zapier.com/hooks/catch/17465641/28qqau0/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
        })
      });
         
      if (response.ok) {
        setSubmitStatus('success');
        setSubmitMessage('Thank you! Your message has been sent successfully. We will contact you soon.');
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          callDate: '',
          preferredTime: '',
          pricingPlan: '',
          businessType: '',
          monthlyVolume: '',
          message: ''
        });
      } else {
        // Log the full response if the fetch fails
         const errorBody = await response.text();
         console.error(`Failed to send message: ${response.status} ${errorBody}`);
  
        setSubmitStatus('error');
        setSubmitMessage(`Sorry, there was an error sending your message. Please try again or contact us directly. Status code: ${response.status}`);
          }
      
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitStatus('error');
      setSubmitMessage('Sorry, there was an error sending your message. Please try again or contact us directly.');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <main>
      {/* Navigation */}
      <motion.nav
        className="fixed top-0 z-50 w-full bg-white shadow-sm bg-opacity-90 backdrop-blur-sm"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-6xl px-4 mx-auto sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <motion.div
                className="flex items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Image
                  src="/staracceptlogo.png"
                  alt="staraccept"
                  width={187.5}
                  height={50}
                  className="transition-all duration-187.5 hover:brightness-110"
                />
              </motion.div>
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-600 hover:text-gray-900 focus:outline-none"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>

            {/* Desktop menu */}
            <div className="items-center hidden space-x-8 md:flex">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-gray-700 hover:text-gray-900"
                onClick={() => {
                  const solutionsSection = document.getElementById('solutions');
                  solutionsSection?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Solutions & Integrations
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-gray-700 hover:text-gray-900"
                onClick={() => {
                  const pricingSection = document.getElementById('pricing');
                  pricingSection?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Pricing
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 text-white transition-colors rounded-lg bg-amber-500 hover:bg-amber-600"
                onClick={() => {
                  const contactSection = document.getElementById('contact');
                  contactSection?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Contact sales
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <div className="relative h-[600px] w-full max-w-[1920px] mx-auto pt-16">
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
            />
            <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/60 to-transparent"></div>
          </div>
        </motion.div>

        {/* Carousel Navigation Dots */}
        <div className="absolute z-20 flex space-x-2 transform -translate-x-1/2 bottom-8 left-1/2">
          {images.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all ${
                currentImage === index ? 'bg-white w-4' : 'bg-white/50'
              }`}
              onClick={() => setCurrentImage(index)}
            />
          ))}
        </div>

        {/* Hero Content */}
        <div className="absolute inset-0 flex items-center max-w-[1920px] mx-auto">
          <div className="relative z-20 max-w-6xl px-4 mx-auto mt-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-xl text-white"
            >
              <motion.h1
                className="mb-6 text-2xl font-bold text-white md:text-3xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Affordable Full-Service Credit Card Processing with Proven, Cutting-Edge Technology
              </motion.h1>

              <motion.p
                className="mb-8 text-lg text-white/80"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Transform your business with seamless payment solutions designed for modern commerce
              </motion.p>

              <motion.div className="flex flex-wrap gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 text-sm font-semibold text-white transition-colors rounded-lg bg-amber-500 hover:bg-amber-600"
                  onClick={() => {
                    const contactSection = document.getElementById('contact');
                    contactSection?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Get Started
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 text-sm font-semibold text-white transition-colors border-2 border-white rounded-lg hover:bg-white hover:text-amber-500"
                  onClick={() => {
                    const pricingSection = document.getElementById('pricing');
                    pricingSection?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  See Pricing
                </motion.button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border-b border-gray-100 shadow-sm"
      >
        <div className="max-w-6xl py-3 mx-auto">
          <div className="grid grid-cols-4 gap-2 px-4 md:px-0">
            {[
              {
                icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>,
                text: "Overnight Shipping",
                subtext: "Quick Setup"
              },
              {
                icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
                text: "Next Day Funding",
                subtext: "Fast Access to Money"
              },
              {
                icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
                text: "Dedicated Manager",
                subtext: "Personal Support"
              },
              {
                icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>,
                text: "Professional Service",
                subtext: "Tailored Solutions"
              }
            ].map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center group"
              >
                <div className="mb-2 text-amber-500">
                  {item.icon}
                </div>
                <span className="text-sm font-medium text-gray-800">{item.text}</span>
                <span className="hidden text-xs text-gray-500 md:block">{item.subtext}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Pricing Section */}
      <motion.div className="px-4 py-20 bg-gray-50" id="pricing">
        <div className="max-w-6xl mx-auto">
          <motion.div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">Simple, Transparent Pricing</h2>
            <p className="text-lg text-gray-600"></p>

            {/* Pricing Toggle */}
            <div className="flex items-center justify-center gap-4 mt-6">
              <motion.button
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'standard'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                onClick={() => setActiveTab('standard')}
              >
                Traditional Pricing
              </motion.button>
              <motion.button
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'zero_processing'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                onClick={() => setActiveTab('zero_processing')}
              >
                ZERO PROCESSING FEES<span className="text-sm text-green-500"></span>
              </motion.button>
            </div>
          </motion.div>
          {/* Add this right after the pricing toggle buttons and before the pricing cards */}
          {activeTab === 'zero_processing' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-6xl mx-auto mt-4 mb-8"
            >
              <div className="flex items-center justify-between p-4 border border-green-100 rounded-lg shadow-sm bg-gradient-to-r from-green-50 to-emerald-50">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-green-500 rounded-full">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">Predictable Monthly Pricing, Zero Processing Fees</h4>
                    <p className="text-sm text-gray-600">Replace unpredictable transaction fees with a fixed monthly rate. Each plan includes one complete POS system with all hardware and software.</p>
                    <p className="mt-1 text-xs text-gray-500">*Custom and enterprise configurations available. Contact us for multi-terminal and multi-location pricing and specific business needs.</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="px-4 py-2 text-sm font-semibold text-green-600 bg-green-100 rounded-full whitespace-nowrap">
                    ALL-INCLUSIVE PRICING
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-green-600 hover:text-green-700"
                    onClick={() => {
                      const contactSection = document.getElementById('contact');
                      contactSection?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">

            {/* Virtual Terminal */}
            <motion.div className="relative flex flex-col h-full p-6 transition-all bg-white border border-gray-200 rounded-xl hover:shadow-xl">
              <div className="absolute left-0 w-full h-1 -top-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>

              <div className="flex-grow">

                <h3 className="mb-4 text-xl font-semibold">On The Go</h3>
                <div className="flex items-baseline mb-2">
                  <span className="text-3xl font-bold">$29</span>
                  <span className="ml-2 text-sm text-gray-500">/mo</span>
                </div>
                <p className="mb-4 text-sm text-gray-600">
                  {activeTab === 'zero_processing'
                    ? '0% Card Processing Plan'
                    : 'with Flat Rate Or Interchange Pricing'}
                </p>
                <ul className="space-y-4">
                  {[
                    'Hardware optional',
                    'Basic transaction processing',
                    'Simple reporting tools',
                    'Perfect for getting started'
                  ].map((feature, index) => (
                    <motion.li
                      key={index}
                      className="flex items-center text-gray-600"
                    >
                      <svg className="flex-shrink-0 w-5 h-5 mr-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </motion.li>
                  ))}
                </ul>
              </div>

              <div className="mt-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    const contactSection = document.getElementById('contact');
                    contactSection?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full py-3 font-semibold text-gray-800 transition-colors bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Get Started
                </motion.button>
              </div>
            </motion.div>

            {/* Advanced Mobile Package */}
            <motion.div className="relative flex flex-col h-full p-6 transition-all bg-white border border-gray-200 rounded-xl hover:shadow-xl">
              <div className="absolute left-0 w-full h-1 -top-px bg-gradient-to-r from-transparent via-cyan-200 to-transparent"></div>

              <div className="flex-grow">
                <h3 className="mb-4 text-xl font-semibold">Mobile Pro Bundle</h3>
                <div className="flex items-baseline mb-2">
                  <span className="text-3xl font-bold">${activeTab === 'zero_processing' ? '99' : '49'}</span>
                  <span className="ml-2 text-sm text-gray-500">/mo</span>
                </div>
                <p className="mb-4 text-sm text-gray-600">
                  {activeTab === 'zero_processing'
                    ? '0% Card Processing Plan'
                    : 'with Flat Rate Or Interchange Pricing'}
                </p>
                <ul className="space-y-4">
                  {[
                    'Portable, handheld or stationary POS system',
                    'Wireless-ready (WiFi & 4G LTE)',
                    'Smart inventory tracking',
                    'All payment types accepted',
                    'Online-ordering',
                    'Next-day deposits'
                  ].map((feature, index) => (
                    <motion.li
                      key={index}
                      className="flex items-center text-gray-600"
                    >
                      <svg className="flex-shrink-0 w-5 h-5 mr-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </motion.li>
                  ))}
                </ul>
              </div>

              <div className="mt-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    const contactSection = document.getElementById('contact');
                    contactSection?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full py-3 font-semibold text-gray-800 transition-colors bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Get Started
                </motion.button>
              </div>
            </motion.div>

            {/* Clover Station Duo 2 Bundle - Popular Choice */}
            <motion.div className="relative flex flex-col h-full p-6 transition-all bg-white border-2 border-blue-500 rounded-xl hover:shadow-xl">
              <div className="absolute left-0 w-full h-1 -top-px bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
              <div className="absolute z-10 transform -translate-x-1/2 -top-4 left-1/2">
                <span className="px-4 py-1 text-sm font-semibold text-white rounded-full shadow-lg bg-gradient-to-r from-blue-600 to-blue-400">
                  Most Popular
                </span>
              </div>

              <div className="flex-grow mt-2">
                <h3 className="mb-4 text-xl font-semibold">Retail or Counter-Service Restaurant Bundle</h3>
                <div className="flex items-baseline mb-2">
                  <span className="text-3xl font-bold">${activeTab === 'zero_processing' ? '149' : '99'}</span>
                  <span className="ml-2 text-sm text-gray-500">/mo</span>
                </div>
                <p className="mb-4 text-sm text-gray-600">
                  {activeTab === 'zero_processing'
                    ? '0% Card Processing Plan'
                    : 'with Flat Rate Or Interchange Pricing'}
                </p>
                <ul className="space-y-4">
                  {[
                    'Full POS system with cash drawer & printer',
                    'Dual displays for staff & customers',
                    'Advanced inventory control',
                    'All payment types accepted',
                    'Online-ordering',
                    'Next-day deposits'
                  ].map((feature, index) => (
                    <motion.li
                      key={index}
                      className="flex items-center text-gray-600"
                    >
                      <svg className="flex-shrink-0 w-5 h-5 mr-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Special styling for the "Most Popular" button */}
              <div className="mt-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    const contactSection = document.getElementById('contact');
                    contactSection?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full py-3 font-semibold text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  Get Started
                </motion.button>
              </div>
            </motion.div>

            {/* Restaurant & Bar Bundle */}
            <motion.div className="relative flex flex-col h-full p-6 transition-all bg-white border border-gray-200 rounded-xl hover:shadow-xl">
              <div className="absolute left-0 w-full h-1 -top-px bg-gradient-to-r from-transparent via-purple-200 to-transparent"></div>
              <div className="absolute z-10 -right-3 top-3">
                <span className="px-3 py-1 text-xs font-semibold text-white rounded-l-full shadow-lg bg-gradient-to-r from-purple-600 to-purple-400 whitespace-nowrap">
                  Full-Service Bar & Restaurant Ready
                </span>
              </div>

              <div className="flex-grow mt-8">
                <h3 className="mb-4 text-xl font-semibold">Full-Service Restaurant & Bar Bundle</h3>
                <div className="flex items-baseline mb-2">
                  <span className="text-3xl font-bold">${activeTab === 'zero_processing' ? '179' : '129'}</span>
                  <span className="ml-2 text-sm text-gray-500">/mo</span>
                </div>
                <p className="mb-4 text-sm text-gray-600">
                  {activeTab === 'zero_processing'
                    ? '0% Card Processing Plan'
                    : 'with Flat Rate Or Interchange Pricing'}
                </p>
                <ul className="space-y-4">
                  {[
                    'Full POS system with cash drawer & printer',
                    'Restaurant-optimized interface',
                    'Advanced inventory control',
                    'Built-in payment processing',
                    'Next-day deposits'
                  ].map((feature, index) => (
                    <motion.li
                      key={index}
                      className="flex items-center text-gray-600"
                    >
                      <svg className="flex-shrink-0 w-5 h-5 mr-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </motion.li>
                  ))}
                </ul>
              </div>
              <div className="mt-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    const contactSection = document.getElementById('contact');
                    contactSection?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full py-3 font-semibold text-gray-800 transition-colors bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Get Started
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
      <section id="solutions" className="py-20 bg-gradient-to-b from-white to-gray-50">
      </section>

      {/* Solutions & Integrations Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-6xl px-4 mx-auto">
          {/* Header */}
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
              Solutions & Integrations
            </h2>
            <p className="max-w-3xl mx-auto text-xl text-gray-600">
              A glimpse into our ever-expanding ecosystem of possibilities
            </p>
          </div>

          {/* Integration Categories */}
          <div className="grid gap-8 mb-20 md:grid-cols-3">
            {[
              {
                title: "Food Service & Delivery",
                solutions: [
                  { name: "GrubHub", tag: "Delivery" },
                  { name: "Uber Eats", tag: "Delivery" },
                  { name: "DoorDash", tag: "Delivery" },
                  { name: "Samsung Kiosk", tag: "POS" }
                ]
              },
              {
                title: "Financial & Operations",
                solutions: [
                  { name: "QuickBooks", tag: "Accounting" },
                  { name: "Paychex", tag: "Payroll" },
                  { name: "ADP", tag: "HR" },
                  { name: "Gusto", tag: "Payroll" },
                  { name: "DAVO", tag: "Tax" }
                ]
              },
              {
                title: "E-Commerce & Retail",
                solutions: [
                  { name: "Shopify", tag: "E-commerce" },
                  { name: "BigCommerce", tag: "E-commerce" },
                  { name: "Shopventory", tag: "Inventory" },
                  { name: "SKU IQ", tag: "Inventory" }
                ]
              }
            ].map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.2,
                  ease: "easeOut"
                }}
                className="p-8 transition-all duration-300 bg-white border border-gray-100 shadow-sm rounded-xl hover:shadow-md"
              >
                {/* Replace emoji with checkmark */}
                <div className="mb-6">
                  <svg
                    className="w-12 h-12 text-amber-500"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 6L9 17L4 12" />
                  </svg>
                </div>
                <h3 className="mb-6 text-xl font-semibold text-gray-900">{category.title}</h3>
                <div className="space-y-3">
                  {category.solutions.map((solution, i) => (
                    <div key={i} className="flex items-center justify-between group">
                      <span className="text-gray-800 transition-colors group-hover:text-blue-600">
                        {solution.name}
                      </span>
                      <span className="px-2 py-1 text-xs text-gray-600 bg-gray-100 rounded-full">
                        {solution.tag}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Features Grid */}
          <div className="grid gap-8 mb-20 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: "⚡",
                title: "Quick Integration",
                description: "Most integrations ready in minutes, not days"
              },
              {
                icon: "🔄",
                title: "Real-Time Sync",
                description: "Automatic data synchronization across platforms"
              },
              {
                icon: "🛡️",
                title: "Enterprise Security",
                description: "Bank-level encryption for all connections"
              },
              {
                icon: "🔧",
                title: "Custom Solutions",
                description: "Tailored integrations for unique needs"
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="p-6 transition-all bg-white border border-gray-100 rounded-xl hover:shadow-sm"
              >
                <span className="block mb-4 text-3xl">{feature.icon}</span>
                <h4 className="mb-2 text-lg font-semibold text-gray-900">{feature.title}</h4>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Payment Methods Section */}
          <div className="p-8 mb-20 bg-white border border-gray-100 rounded-xl">
            <h3 className="mb-6 text-xl font-semibold text-center text-gray-900">
              Supported Payment Methods
            </h3>
            <div className="grid grid-cols-2 gap-4 text-center md:grid-cols-4">
              {[
                "Credit & Debit Cards",
                "Mobile Payments",
                "Digital Wallets",
                "Contactless",
                "Apple Pay",
                "Google Pay",
                "Samsung Pay",
                "Gift Cards"
              ].map((method, index) => (
                <div key={index} className="px-4 py-3 text-sm text-gray-700 rounded-lg bg-gray-50">
                  {method}
                </div>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <p className="mb-6 text-gray-600">
              Looking for a specific integration? We're constantly expanding our capabilities.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                const contactSection = document.getElementById('contact');
                contactSection?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center px-8 py-3 space-x-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 group"
            >
              <span>Discuss Your Integration Needs</span>
              <svg
                className="w-5 h-5 transition-transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </motion.button>
          </div>
        </div>
      </section>
      {/* Contact Section */}
            
<div className="relative px-4 py-20 bg-gradient-to-b from-gray-50 to-white" id="contact">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">Local Comes First</h2>
            <p className="max-w-2xl mx-auto text-lg text-gray-600">
              Ready to transform your business? Fill out the form below and a local team member will get back to you within 24 hours.
            </p>
          </div>

          <div className="grid items-start gap-12 md:grid-cols-2">
            {/* Contact Form */}
            <div className="p-8 bg-white border border-gray-100 shadow-sm rounded-xl">
              <form onSubmit={handleDemoRequest} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Business Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="john@yourcompany.com"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="(555) 123-4567"
                  />
                </div>

                {/* New Callback Schedule Fields */}
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Preferred Call Date</label>
                    <input
                      type="date"
                      name="callDate"
                      value={formData.callDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Preferred Time</label>
                    <select
                      name="preferredTime"
                      value={formData.preferredTime}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select a time</option>
                      <option value="morning">Morning (9AM - 12PM)</option>
                      <option value="afternoon">Afternoon (12PM - 5PM)</option>
                      <option value="evening">Evening (5PM - 8PM)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Pricing Plan Preference?</label>
                  <select
                    name="pricingPlan"
                    value={formData.pricingPlan}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Do you have a preferred pricing plan?</option>
                    <option value="onthego">0-On The Go</option>
                    <option value="mobilepro">Mobile Pro Bundle</option>
                    <option value="retailorcounterservicerestaurantbundle">Retail or Counter-Service Restaurant Bundle</option>
                    <option value="fullservicerestaurantandbarbundle">Full-Service Restaurant & Bar Bundle</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Business Type</label>
                  <select
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select a business type</option>
                    <option value="retail">Retail</option>
                    <option value="restaurant">Restaurant</option>
                    <option value="service">Service Business</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Estimated Monthly Volume</label>
                  <select
                    name="monthlyVolume"
                    value={formData.monthlyVolume}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select estimated monthly volume</option>
                    <option value="0-50,000">0-50,000</option>
                    <option value="50000-250000">50000-250000</option>
                    <option value="250000-1000000">250000-1000000</option>
                    <option value="1000000+">1000000+</option>
                  </select>
                </div>

                <div className="space-y-4">
                  {/* Form submission status message */}
                  {isLoading && (
                    <div className="flex items-center justify-center p-4 text-blue-600 rounded-lg bg-blue-50">
                      <svg className="w-5 h-5 mr-3 -ml-1 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing your request...
                    </div>
                  )}

                  {submitStatus === 'success' && (
                    <div className="p-4 text-green-600 rounded-lg bg-green-50">
                      {submitMessage}
                    </div>
                  )}

                  {submitStatus === 'error' && (
                    <div className="p-4 text-red-600 rounded-lg bg-red-50">
                      {submitMessage}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all duration-300 flex items-center justify-center
                      ${isLoading
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg transform hover:-translate-y-0.5'
                      }`}
                  >
                    {isLoading ? (
                      <span className="flex items-center">
                        <svg className="w-5 h-5 mr-3 -ml-1 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </span>
                    ) : (
                      'Send Message'
                    )}
                  </button>
                </div>
              </form>
            </div>
              {/* Right Side Content */}
            <div className="space-y-8">
              <div className="p-6 bg-white border border-gray-100 rounded-xl">
                <h3 className="mb-4 text-xl font-semibold">Why Choose Star Accept?</h3>
                <div className="space-y-4">
                  {[
                    {
                      title: 'Enterprise-Grade Security',
                      description: 'Your data is protected with industry-leading encryption',
                      icon: '🔒'
                    },
                    {
                      title: 'Quick Integration',
                      description: 'Get up and running in days, not weeks',
                      icon: '⚡'
                    },
                    {
                      title: '24/7 Support',
                      description: 'Our team is always here to help you succeed',
                      icon: '💬'
                    }
                  ].map((item, index) => (
                    <div key={index} className="flex items-start p-4 space-x-4 rounded-lg bg-gray-50">
                      <span className="text-2xl">{item.icon}</span>
                      <div>
                        <h4 className="font-semibold text-gray-900">{item.title}</h4>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Logo Section */}
              <div className="flex items-center justify-center p-8 bg-white border border-gray-100 rounded-xl">
                <Image
                  src="/staracceptlogo.png"
                  alt="Star Accept Business Solutions"
                  width={300} // Adjust this value based on your preferred size
                  height={80}  // Adjust this value based on your preferred size
                  className="w-auto h-auto" // This allows the image to maintain its aspect ratio
                  priority
                />
              </div>

              {/* Direct Contact Info */}
              <div className="p-6 bg-white border border-gray-100 rounded-xl">
                <h3 className="mb-4 text-xl font-semibold">Direct Contact</h3>
                <div className="space-y-4">
                  <a href="tel:+18888857333" className="flex items-center space-x-3 text-gray-600 hover:text-blue-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>(888) 885-7333</span>
                  </a>
                  <a href="mailto:support@staraccept.com" className="flex items-center space-x-3 text-gray-600 hover:text-blue-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>support@staraccept.com</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
