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

// Add these arrays after the interfaces but before export default function Home()
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

// Keep all your existing interfaces (Plan, Testimonial, Stat, FAQ, Feature, BlogPost, Integration)

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('standard');
  const [selectedFAQ, setSelectedFAQ] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showChat, setShowChat] = useState(false);
  
  // Add the new carousel state and images array HERE
  const [currentImage, setCurrentImage] = useState(0);
  

  const images = [
    {
        src: '/qsrduo2.png',  // Added comma here
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

  // Add the useEffect hook HERE
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleDemoRequest = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Add your actual form submission logic here
    }, 2000);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100/80">
      {/* Promotional Banner */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white"
      >
      </motion.div>

     {/* Navigation */}
<motion.nav 
  className="fixed top-0 w-full bg-white bg-opacity-90 backdrop-blur-sm shadow-sm z-50"
  initial={{ y: -100 }}
  animate={{ y: 0 }}
  transition={{ duration: 0.5 }}
>
  <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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
      <div className="md:hidden flex items-center">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-gray-600 hover:text-gray-900 focus:outline-none"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Desktop menu */}
      <div className="hidden md:flex items-center space-x-8">
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
    className="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors"
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
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent z-10"></div>
    </div>
  </motion.div>

  {/* Carousel Navigation Dots */}
  <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
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
    <div className="relative max-w-6xl mx-auto px-4 z-20 mt-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-white max-w-xl"
      >
        <motion.h1
          className="text-2xl md:text-3xl font-bold mb-6 text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Affordable Full-Service Credit Card Processing with Proven, Cutting-Edge Technology
        </motion.h1>
        
        <motion.p
          className="text-lg text-white/80 mb-8"
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
    className="bg-amber-500 text-white px-6 py-3 rounded-lg hover:bg-amber-600 transition-colors font-semibold text-sm"
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
    className="border-2 border-white text-white hover:bg-white hover:text-amber-500 px-6 py-3 rounded-lg transition-colors font-semibold text-sm"
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
  <div className="max-w-6xl mx-auto py-3">
    <div className="grid grid-cols-4 gap-2 px-4 md:px-0">
      {[
        {
          icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"/></svg>,
          text: "Overnight Shipping",
          subtext: "Quick Setup"
        },
        {
          icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>,
          text: "Next Day Funding",
          subtext: "Fast Access to Money"
        },
        {
          icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>,
          text: "Dedicated Manager",
          subtext: "Personal Support"
        },
        {
          icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/></svg>,
          text: "Professional Service",
          subtext: "Tailored Solutions"
        }
      ].map((item, index) => (
        <div 
          key={index} 
          className="flex flex-col items-center text-center group"
        >
          <div className="text-amber-500 mb-2">
            {item.icon}
          </div>
          <span className="text-sm font-medium text-gray-800">{item.text}</span>
          <span className="text-xs text-gray-500 hidden md:block">{item.subtext}</span>
        </div>
      ))}
    </div>
  </div>
</motion.div>

      {/* Pricing Section */}
<motion.div className="py-20 px-4 bg-gray-50" id="pricing">
  <div className="max-w-6xl mx-auto">
    <motion.div className="text-center mb-16">
      <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
      <p className="text-gray-600 text-lg"></p>
      
      {/* Pricing Toggle */}
      <div className="mt-6 flex items-center justify-center gap-4">
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
    className="max-w-6xl mx-auto mb-8 mt-4"
  >
    <div className="flex items-center justify-between bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-100 shadow-sm">
      <div className="flex items-center space-x-4">
        <div className="bg-green-500 rounded-full p-2">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <h4 className="text-lg font-semibold text-gray-900">Predictable Monthly Pricing, Zero Processing Fees</h4>
          <p className="text-sm text-gray-600">Replace unpredictable transaction fees with a fixed monthly rate. Each plan includes one complete POS system with all hardware and software.</p>
          <p className="text-xs text-gray-500 mt-1">*Custom and enterprise configurations available. Contact us for multi-terminal and multi-location pricing and specific business needs.</p>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <span className="text-sm font-semibold text-green-600 bg-green-100 px-4 py-2 rounded-full whitespace-nowrap">
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
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
      
     {/* Virtual Terminal */}
<motion.div className="relative bg-white p-6 rounded-xl border border-gray-200 hover:shadow-xl transition-all flex flex-col h-full">
  <div className="absolute -top-px left-0 w-full h-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
  
  <div className="flex-grow">

    <h3 className="text-xl font-semibold mb-4">On The Go</h3>
    <div className="flex items-baseline mb-2">
      <span className="text-3xl font-bold">$29</span>
      <span className="text-sm text-gray-500 ml-2">/mo</span>
    </div>
    <p className="text-sm text-gray-600 mb-4">
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
          <svg className="w-5 h-5 mr-3 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
    className="w-full py-3 rounded-lg bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors font-semibold"
  >
    Get Started
  </motion.button>
</div>
</motion.div>

{/* Advanced Mobile Package */}
<motion.div className="relative bg-white p-6 rounded-xl border border-gray-200 hover:shadow-xl transition-all flex flex-col h-full">
  <div className="absolute -top-px left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-200 to-transparent"></div>
  
  <div className="flex-grow">
    <h3 className="text-xl font-semibold mb-4">Mobile Pro Bundle</h3>
    <div className="flex items-baseline mb-2">
      <span className="text-3xl font-bold">${activeTab === 'zero_processing' ? '99' : '49'}</span>
      <span className="text-sm text-gray-500 ml-2">/mo</span>
    </div>
    <p className="text-sm text-gray-600 mb-4">
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
          <svg className="w-5 h-5 mr-3 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
    className="w-full py-3 rounded-lg bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors font-semibold"
  >
    Get Started
  </motion.button>
</div>
</motion.div>

{/* Clover Station Duo 2 Bundle - Popular Choice */}
<motion.div className="relative bg-white p-6 rounded-xl border-2 border-blue-500 hover:shadow-xl transition-all flex flex-col h-full">
  <div className="absolute -top-px left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
    <span className="bg-gradient-to-r from-blue-600 to-blue-400 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
      Most Popular 
    </span>
  </div>
  
  <div className="flex-grow mt-2">
    <h3 className="text-xl font-semibold mb-4">Retail or Counter-Service Restaurant Bundle</h3>
    <div className="flex items-baseline mb-2">
      <span className="text-3xl font-bold">${activeTab === 'zero_processing' ? '149' : '99'}</span>
      <span className="text-sm text-gray-500 ml-2">/mo</span>
    </div>
    <p className="text-sm text-gray-600 mb-4">
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
          <svg className="w-5 h-5 mr-3 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
    className="w-full py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-semibold"
  >
    Get Started
  </motion.button>
</div>
</motion.div>

{/* Restaurant & Bar Bundle */}
<motion.div className="relative bg-white p-6 rounded-xl border border-gray-200 hover:shadow-xl transition-all flex flex-col h-full">
  <div className="absolute -top-px left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-200 to-transparent"></div>
  <div className="absolute -right-3 top-3 z-10">
    <span className="bg-gradient-to-r from-purple-600 to-purple-400 text-white px-3 py-1 rounded-l-full text-xs font-semibold shadow-lg whitespace-nowrap">
      Full-Service Bar & Restaurant Ready
    </span>
  </div>
  
  <div className="flex-grow mt-8">
    <h3 className="text-xl font-semibold mb-4">Full-Service Restaurant & Bar Bundle</h3>
    <div className="flex items-baseline mb-2">
      <span className="text-3xl font-bold">${activeTab === 'zero_processing' ? '179' : '129'}</span>
      <span className="text-sm text-gray-500 ml-2">/mo</span>
    </div>
    <p className="text-sm text-gray-600 mb-4">
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
          <svg className="w-5 h-5 mr-3 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
    className="w-full py-3 rounded-lg bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors font-semibold"
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
  <div className="max-w-6xl mx-auto px-4">
    {/* Header */}
    <div className="text-center mb-16">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
        Solutions & Integrations
      </h2>
      <p className="text-xl text-gray-600 max-w-3xl mx-auto">
      A glimpse into our ever-expanding ecosystem of possibilities
      </p>
    </div>

    {/* Integration Categories */}
<div className="grid md:grid-cols-3 gap-8 mb-20">
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
      className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
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
      <h3 className="text-xl font-semibold mb-6 text-gray-900">{category.title}</h3>
      <div className="space-y-3">
        {category.solutions.map((solution, i) => (
          <div key={i} className="flex items-center justify-between group">
            <span className="text-gray-800 group-hover:text-blue-600 transition-colors">
              {solution.name}
            </span>
            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
              {solution.tag}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  ))}
</div>

    {/* Features Grid */}
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
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
      className="bg-white p-6 rounded-xl border border-gray-100 hover:shadow-sm transition-all"
    >
      <span className="text-3xl mb-4 block">{feature.icon}</span>
      <h4 className="text-lg font-semibold mb-2 text-gray-900">{feature.title}</h4>
      <p className="text-gray-600">{feature.description}</p>
    </div>
  ))}
</div>

    {/* Payment Methods Section */}
    <div className="bg-white rounded-xl p-8 border border-gray-100 mb-20">
      <h3 className="text-xl font-semibold mb-6 text-center text-gray-900">
        Supported Payment Methods
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
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
          <div key={index} className="px-4 py-3 bg-gray-50 rounded-lg text-gray-700 text-sm">
            {method}
          </div>
        ))}
      </div>
    </div>

    {/* Call to Action */}
    <div className="text-center">
      <p className="text-gray-600 mb-6">
        Looking for a specific integration? We're constantly expanding our capabilities.
      </p>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          const contactSection = document.getElementById('contact');
          contactSection?.scrollIntoView({ behavior: 'smooth' });
        }}
        className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center space-x-2 group"
      >
        <span>Discuss Your Integration Needs</span>
        <svg 
          className="w-5 h-5 group-hover:translate-x-1 transition-transform" 
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
<div className="relative py-20 px-4 bg-gradient-to-b from-gray-50 to-white" id="contact">
  <div className="max-w-6xl mx-auto">
    <div className="text-center mb-12">
      <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Local Comes First</h2>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto">
        Ready to transform your business? Fill out the form below and a local team member will get back to you within 24 hours.
      </p>
    </div>

    <div className="grid md:grid-cols-2 gap-12 items-start">
      {/* Contact Form */}
      <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
        <form onSubmit={handleDemoRequest} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
              <input
                type="text"
                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="John"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
              <input
                type="text"
                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Doe"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Business Email</label>
            <input
              type="email"
              className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="john@yourcompany.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            <input
              type="tel"
              className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="(555) 123-4567"
            />
          </div>

          {/* New Callback Schedule Fields */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Call Date</label>
              <input
                type="date"
                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Time</label>
              <select className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="">Select a time</option>
                <option value="morning">Morning (9AM - 12PM)</option>
                <option value="afternoon">Afternoon (12PM - 5PM)</option>
                <option value="evening">Evening (5PM - 8PM)</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Pricing Plan Preference?</label>
            <select className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="">Do you have a preferred pricing plan?</option>
              <option value="onthego">0-On The Go</option>
              <option value="mobilepro">Mobile Pro Bundle</option>
              <option value="retailorcounterservicerestaurantbundle">Retail or Counter-Service Restaurant Bundle</option>
              <option value="fullservicerestaurantandbarbundle">Full-Service Restaurant & Bar Bundle</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Business Type</label>
            <select className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="">Select a business type</option>
              <option value="retail">Retail</option>
              <option value="restaurant">Restaurant</option>
              <option value="service">Service Business</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Monthly Volume</label>
            <select className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="">Select estimated monthly volume</option>
              <option value="0-50,000">0-50,000</option>
              <option value="50000-250000">50000-250000</option>
              <option value="250000-1000000">250000-1000000</option>
              <option value="1000000+">1000000+</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
            <textarea
              className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32 resize-none"
              placeholder="Tell us about your business needs..."
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Send Message
          </button>
        </form>
      </div>

      {/* Right Side Content */}
      <div className="space-y-8">
        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <h3 className="text-xl font-semibold mb-4">Why Choose Star Accept?</h3>
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
              <div key={index} className="flex items-start space-x-4 p-4 rounded-lg bg-gray-50">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <h4 className="font-semibold text-gray-900">{item.title}</h4>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Logo Section */}
<div className="bg-white rounded-xl p-8 border border-gray-100 flex items-center justify-center">
  <Image
    src="/staracceptlogo.png"
    alt="Star Accept Business Solutions"
    width={300} // Adjust this value based on your preferred size
    height={80}  // Adjust this value based on your preferred size
    className="h-auto w-auto" // This allows the image to maintain its aspect ratio
    priority
  />
</div>

        {/* Direct Contact Info */}
        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <h3 className="text-xl font-semibold mb-4">Direct Contact</h3>
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
