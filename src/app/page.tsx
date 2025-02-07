'use client';
import React, { useState, useEffect, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Head from 'next/head';
import { FaCheckCircle, FaClock, FaUsers, FaStar } from 'react-icons/fa';
import { ThemeProvider, useTheme } from './components/ThemeProvider'; // Make sure this path is correct or adjust as needed.

interface FAQ {
  question: string;
  answer: string;
}

interface ProductSelectorData {
  pricingModel: 'standard' | 'zero_processing' | '';
  chosenPlan: 'onTheGo' | 'mobilePro' | 'retailCounter' | 'fullService' | '';
  businessType: string;
  numDevices: number;
  softwareNeeds: string[];
  onlineOrdering: boolean;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

const initialSelectorData: ProductSelectorData = {
  pricingModel: '',
  chosenPlan: '',
  businessType: '',
  numDevices: 1,
  softwareNeeds: [],
  onlineOrdering: false,
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
};

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '', callDate: '',
    preferredTime: '', pricingPlan: '', businessType: '', monthlyVolume: '', message: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  // Wizard-related states
  const [wizardStep, setWizardStep] = useState(1);
  const [selectorData, setSelectorData] = useState<ProductSelectorData>(initialSelectorData);
  const [selectorSubmitStatus, setSelectorSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [selectorSubmitMessage, setSelectorSubmitMessage] = useState('');

  // Theme
  const { darkMode, toggleDarkMode } = useTheme();

  // Images for hero carousel
  const images = [
    { src: '/retailflex3.png', alt: 'Flexible Payment Terminal' },
    { src: '/qsrduo2.png', alt: 'QSR Duo POS System' },
    { src: '/retailmini3.png', alt: 'Retail Mini POS' }
  ];

  // Hero carousel effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // -------------------- Contact Form (right side contact) --------------------
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDemoRequest = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setSubmitStatus('idle');
    setSubmitMessage('');

    const requiredFields = ['firstName', 'lastName', 'email', 'phone'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);

    if (missingFields.length > 0) {
      setSubmitStatus('error');
      setSubmitMessage('Please fill in all required fields: ' + missingFields.join(', '));
      setIsLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setSubmitStatus('error');
      setSubmitMessage('Please enter a valid email address.');
      setIsLoading(false);
      return;
    }

    try {
      const params = new URLSearchParams({
        ...formData,
        submitTime: new Date().toISOString()
      });
      const url = `https://hooks.zapier.com/hooks/catch/17465641/28qqau0/?${params.toString()}`;
      const response = await fetch(url, { method: 'GET' });
      if (response.ok) {
        setSubmitStatus('success');
        setSubmitMessage('Thank you! We will contact you soon.');
        setFormData({
          firstName: '', lastName: '', email: '', phone: '', callDate: '',
          preferredTime: '', pricingPlan: '', businessType: '', monthlyVolume: '', message: ''
        });
      } else {
        const errorBody = await response.text();
        console.error(`Failed: ${response.status} ${errorBody}`);
        setSubmitStatus('error');
        setSubmitMessage(`Error sending message. Please try again or contact us. Status: ${response.status}`);
      }
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitStatus('error');
      setSubmitMessage('Error sending message. Please try again or contact us.');
    } finally {
      setIsLoading(false);
    }
  };

  // -------------------- Merged Wizard + Pricing in Steps --------------------
  // Steps:
  // 1) Choose Pricing Model (standard vs zero)
  // 2) Choose One of 4 Plans
  // 3) Business Type
  // 4) Number of Devices
  // 5) Restaurant Type or Online Ordering
  // 6) Contact Info
  // 7) Summary & Submit

  const handleSelectorInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      // For multi-check fields
      if (name === 'onlineOrdering') {
        setSelectorData(prev => ({ ...prev, onlineOrdering: !prev.onlineOrdering }));
      } else {
        // For softwareNeeds
        const checkboxValue = e.target.value;
        setSelectorData(prevData => ({
          ...prevData,
          softwareNeeds: prevData.softwareNeeds.includes(checkboxValue)
            ? prevData.softwareNeeds.filter(item => item !== checkboxValue)
            : [...prevData.softwareNeeds, checkboxValue]
        }));
      }
    } else if (name === 'numDevices') {
      const numValue = parseInt(value, 10);
      setSelectorData(prevData => ({
        ...prevData,
        numDevices: isNaN(numValue) ? 0 : numValue,
      }));
    } else {
      setSelectorData(prevData => ({ ...prevData, [name]: value }));
    }
  };

  const handleNextStep = () => {
    // Simple validation for each step
    if (wizardStep === 1 && !selectorData.pricingModel) {
      alert('Please select a pricing model.');
      return;
    }
    if (wizardStep === 2 && !selectorData.chosenPlan) {
      alert('Please select a plan.');
      return;
    }
    if (wizardStep === 3 && !selectorData.businessType) {
      alert('Please select a business type.');
      return;
    }
    if (wizardStep === 4 && selectorData.numDevices <= 0) {
      alert('Please select at least one device.');
      return;
    }
    if (
      wizardStep === 5 &&
      selectorData.businessType === 'restaurant' &&
      selectorData.softwareNeeds.length === 0
    ) {
      alert('Please select a restaurant type (Full-Service or Quick-Service).');
      return;
    }
    if (wizardStep === 6) {
      // check name/email/phone
      const { firstName, lastName, email, phone } = selectorData;
      if (!firstName || !lastName || !email || !phone) {
        alert('Please fill in all required contact fields.');
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        alert('Please enter a valid email address.');
        return;
      }
    }
    setWizardStep(prev => Math.min(prev + 1, 7));
  };

  const handlePreviousStep = () => {
    setWizardStep(prev => Math.max(prev - 1, 1));
  };

  const handleSelectorSubmit = async () => {
    setIsLoading(true);
    setSelectorSubmitStatus('idle');
    setSelectorSubmitMessage('');

    try {
      const params = new URLSearchParams({
        pricingModel: selectorData.pricingModel,
        chosenPlan: selectorData.chosenPlan,
        businessType: selectorData.businessType,
        numDevices: selectorData.numDevices.toString(),
        softwareNeeds: selectorData.softwareNeeds.join(','),
        onlineOrdering: selectorData.onlineOrdering ? 'yes' : 'no',
        firstName: selectorData.firstName,
        lastName: selectorData.lastName,
        email: selectorData.email,
        phone: selectorData.phone,
        submitTime: new Date().toISOString(),
        formType: 'productSelector',
      });

      const url = `https://hooks.zapier.com/hooks/catch/17465641/28qqau0/?${params.toString()}`;
      const response = await fetch(url, { method: 'GET' });

      if (response.ok) {
        setSelectorSubmitStatus('success');
        setSelectorSubmitMessage('Thank you! We will contact you soon.');
        setSelectorData(initialSelectorData);
        setWizardStep(1);
      } else {
        const errorBody = await response.text();
        console.error(`Failed to send data: ${response.status} ${errorBody}`);
        setSelectorSubmitStatus('error');
        setSelectorSubmitMessage(`Error. Please try again or contact us. Status: ${response.status}`);
      }
    } catch (error) {
      console.error('Submission error:', error);
      setSelectorSubmitStatus('error');
      setSelectorSubmitMessage('Error. Please try again or contact us.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (wizardStep) {
      // STEP 1: Pricing Model
      case 1:
        return (
          <div className="text-gray-900 dark:text-white">
            <h3 className="mb-4 text-xl font-semibold">Choose Your Pricing Model</h3>
            <p className="mb-6 text-gray-600 dark:text-gray-400">
              Traditional processing or Zero-fee plan with fixed monthly price.
            </p>
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectorData({ ...selectorData, pricingModel: 'standard' })}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectorData.pricingModel === 'standard'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-600'
                }`}
              >
                Traditional
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectorData({ ...selectorData, pricingModel: 'zero_processing' })}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectorData.pricingModel === 'zero_processing'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-600'
                }`}
              >
                Zero-Fee Processing
              </motion.button>
            </div>
          </div>
        );

      // STEP 2: Choose One of 4 Plans
      case 2:
        return (
          <div className="text-gray-900 dark:text-white">
            <h3 className="mb-4 text-xl font-semibold">Select Your Preferred Plan</h3>
            <p className="mb-6 text-gray-600 dark:text-gray-400">
              Hardware and software bundles are based on the chosen pricing model.
            </p>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {/* On The Go */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectorData({ ...selectorData, chosenPlan: 'onTheGo' })}
                className={`relative flex flex-col p-6 border rounded-xl cursor-pointer ${
                  selectorData.chosenPlan === 'onTheGo'
                    ? 'border-blue-600 bg-blue-50 dark:bg-gray-700'
                    : 'border-gray-200 dark:border-gray-600 hover:shadow-md'
                }`}
              >
                <h4 className="mb-2 text-lg font-semibold">
                  On The Go
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {selectorData.pricingModel === 'zero_processing'
                    ? '$29/mo - 0% Processing'
                    : 'Basic hardware optional, pay normal card fees'}
                </p>
              </motion.div>

              {/* Mobile Pro */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectorData({ ...selectorData, chosenPlan: 'mobilePro' })}
                className={`relative flex flex-col p-6 border rounded-xl cursor-pointer ${
                  selectorData.chosenPlan === 'mobilePro'
                    ? 'border-blue-600 bg-blue-50 dark:bg-gray-700'
                    : 'border-gray-200 dark:border-gray-600 hover:shadow-md'
                }`}
              >
                <h4 className="mb-2 text-lg font-semibold">
                  Mobile Pro Bundle
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {selectorData.pricingModel === 'zero_processing'
                    ? '$99/mo - 0% Processing'
                    : '$49/mo plus normal card fees'}
                </p>
              </motion.div>

              {/* Retail / Counter */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectorData({ ...selectorData, chosenPlan: 'retailCounter' })}
                className={`relative flex flex-col p-6 border rounded-xl cursor-pointer ${
                  selectorData.chosenPlan === 'retailCounter'
                    ? 'border-blue-600 bg-blue-50 dark:bg-gray-700'
                    : 'border-gray-200 dark:border-gray-600 hover:shadow-md'
                }`}
              >
                <h4 className="mb-2 text-lg font-semibold">
                  Retail or Counter-Service Bundle
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {selectorData.pricingModel === 'zero_processing'
                    ? '$149/mo - 0% Processing'
                    : '$99/mo plus normal card fees'}
                </p>
                <span className="absolute top-3 right-3 text-xs font-semibold px-2 py-1 bg-blue-600 text-white rounded-full">
                  Popular
                </span>
              </motion.div>

              {/* Full-Service */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectorData({ ...selectorData, chosenPlan: 'fullService' })}
                className={`relative flex flex-col p-6 border rounded-xl cursor-pointer ${
                  selectorData.chosenPlan === 'fullService'
                    ? 'border-blue-600 bg-blue-50 dark:bg-gray-700'
                    : 'border-gray-200 dark:border-gray-600 hover:shadow-md'
                }`}
              >
                <h4 className="mb-2 text-lg font-semibold">
                  Full-Service Restaurant & Bar
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {selectorData.pricingModel === 'zero_processing'
                    ? '$179/mo - 0% Processing'
                    : '$129/mo plus normal card fees'}
                </p>
              </motion.div>
            </div>
          </div>
        );

      // STEP 3: Business type
      case 3:
        return (
          <div className="text-gray-900 dark:text-white">
            <h3 className="mb-4 text-xl font-semibold">What type of business do you have?</h3>
            <p className="mb-6 text-gray-600 dark:text-gray-400">So we can tailor the right POS solution for you.</p>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              {/* Retail */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectorData({ ...selectorData, businessType: 'retail', softwareNeeds: [] })}
                className={`p-4 border rounded-lg transition-colors ${
                  selectorData.businessType === 'retail'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900 dark:border-blue-700'
                    : 'border-gray-200 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800'
                }`}
              >
                <div className="mb-2 flex justify-center">
                  <Image src="/storefront.svg" alt="Retail" width={40} height={40} />
                </div>
                <h4 className="text-lg font-semibold">Retail</h4>
              </motion.button>

              {/* Full-Service Restaurant */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectorData({ ...selectorData, businessType: 'restaurant', softwareNeeds: ['full-service'] })}
                className={`p-4 border rounded-lg transition-colors ${
                  selectorData.businessType === 'restaurant' && selectorData.softwareNeeds.includes('full-service')
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900 dark:border-blue-700'
                    : 'border-gray-200 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800'
                }`}
              >
                <div className="mb-2 flex justify-center">
                  <Image src="/restaurant-table.svg" alt="Restaurant" width={40} height={40} />
                </div>
                <h4 className="text-lg font-semibold">Full-Service Restaurant</h4>
              </motion.button>

              {/* Quick-Service Restaurant */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectorData({ ...selectorData, businessType: 'restaurant', softwareNeeds: ['quick-service'] })}
                className={`p-4 border rounded-lg transition-colors ${
                  selectorData.businessType === 'restaurant' && selectorData.softwareNeeds.includes('quick-service')
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900 dark:border-blue-700'
                    : 'border-gray-200 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800'
                }`}
              >
                <div className="mb-2 flex justify-center">
                  <Image src="/coffee-shop.svg" alt="QSR" width={40} height={40} />
                </div>
                <h4 className="text-lg font-semibold">Quick-Service</h4>
              </motion.button>

              {/* Services */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectorData({ ...selectorData, businessType: 'services', softwareNeeds: [] })}
                className={`p-4 border rounded-lg transition-colors ${
                  selectorData.businessType === 'services'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900 dark:border-blue-700'
                    : 'border-gray-200 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800'
                }`}
              >
                <div className="mb-2 flex justify-center">
                  <Image src="/toolbox.svg" alt="Services" width={40} height={40} />
                </div>
                <h4 className="text-lg font-semibold">Services</h4>
              </motion.button>
            </div>
          </div>
        );

      // STEP 4: Number of Devices
      case 4:
        return (
          <div className="text-gray-900 dark:text-white">
            <h3 className="mb-4 text-xl font-semibold">How many devices do you need?</h3>
            <p className="mb-6 text-gray-600 dark:text-gray-400">Select the number of POS terminals.</p>
            <div className="flex items-center">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() =>
                  setSelectorData(prev => ({ ...prev, numDevices: Math.max(1, prev.numDevices - 1) }))
                }
                className="p-2 text-gray-600 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                </svg>
              </motion.button>
              <input
                type="number"
                name="numDevices"
                min="1"
                value={selectorData.numDevices}
                onChange={handleSelectorInputChange}
                className="w-20 p-2 mx-4 text-center border rounded-lg dark:bg-gray-800 dark:border-gray-700"
              />
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() =>
                  setSelectorData(prev => ({ ...prev, numDevices: prev.numDevices + 1 }))
                }
                className="p-2 text-gray-600 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </motion.button>
            </div>
          </div>
        );

      // STEP 5: Restaurant Type or Online Ordering
      case 5:
        if (selectorData.businessType === 'restaurant') {
          return (
            <div className="text-gray-900 dark:text-white">
              <h3 className="mb-4 text-xl font-semibold">What type of restaurant?</h3>
              <p className="mb-6 text-gray-600 dark:text-gray-400">
                Select Full-Service and/or Quick-Service if needed.
              </p>
              <div className="space-y-4">
                <motion.div
                  className={`flex items-center p-3 border rounded-lg cursor-pointer ${
                    selectorData.softwareNeeds.includes('full-service')
                      ? 'bg-blue-50 border-blue-500 dark:bg-blue-900 dark:border-blue-700'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800 dark:border-gray-700'
                  }`}
                  onClick={() => {
                    const updatedNeeds = selectorData.softwareNeeds.includes('full-service')
                      ? selectorData.softwareNeeds.filter(need => need !== 'full-service')
                      : [...selectorData.softwareNeeds, 'full-service'];
                    setSelectorData({ ...selectorData, softwareNeeds: updatedNeeds });
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <input
                    type="checkbox"
                    id="full-service"
                    name="softwareNeeds"
                    value="full-service"
                    checked={selectorData.softwareNeeds.includes('full-service')}
                    className="mr-3"
                  />
                  <label htmlFor="full-service" className="cursor-pointer">
                    Full-Service Dining
                  </label>
                </motion.div>

                <motion.div
                  className={`flex items-center p-3 border rounded-lg cursor-pointer ${
                    selectorData.softwareNeeds.includes('quick-service')
                      ? 'bg-blue-50 border-blue-500 dark:bg-blue-900 dark:border-blue-700'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800 dark:border-gray-700'
                  }`}
                  onClick={() => {
                    const updatedNeeds = selectorData.softwareNeeds.includes('quick-service')
                      ? selectorData.softwareNeeds.filter(need => need !== 'quick-service')
                      : [...selectorData.softwareNeeds, 'quick-service'];
                    setSelectorData({ ...selectorData, softwareNeeds: updatedNeeds });
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <input
                    type="checkbox"
                    id="quick-service"
                    name="softwareNeeds"
                    value="quick-service"
                    checked={selectorData.softwareNeeds.includes('quick-service')}
                    className="mr-3"
                  />
                  <label htmlFor="quick-service" className="cursor-pointer">
                    Quick-Service
                  </label>
                </motion.div>
              </div>
            </div>
          );
        }
        return (
          <div className="text-gray-900 dark:text-white">
            <h3 className="mb-4 text-xl font-semibold">Do you need online ordering capabilities?</h3>
            <p className="mb-6 text-gray-600 dark:text-gray-400">Select if you need online ordering.</p>
            <div className="space-y-4">
              <motion.div
                className={`flex items-center p-3 border rounded-lg cursor-pointer ${
                  selectorData.onlineOrdering
                    ? 'bg-blue-50 border-blue-500 dark:bg-blue-900 dark:border-blue-700'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 dark:border-gray-700'
                }`}
                onClick={() => setSelectorData({ ...selectorData, onlineOrdering: !selectorData.onlineOrdering })}
                whileTap={{ scale: 0.98 }}
              >
                <input
                  type="checkbox"
                  id="onlineOrdering"
                  name="onlineOrdering"
                  checked={selectorData.onlineOrdering}
                  className="mr-3"
                  onChange={() => null} // handled above
                />
                <label htmlFor="onlineOrdering" className="cursor-pointer">
                  Yes, I need online ordering
                </label>
              </motion.div>
            </div>
          </div>
        );

      // STEP 6: Contact Info
      case 6:
        return (
          <div className="text-gray-900 dark:text-white">
            <h3 className="mb-4 text-xl font-semibold">Almost done!</h3>
            <p className="mb-6 text-gray-600 dark:text-gray-400">
              Enter your contact details to receive your personalized quote.
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
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
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
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
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
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
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
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                required
              />
            </div>
          </div>
        );

      // STEP 7: Summary & Submit
      case 7:
        return (
          <div className="text-gray-900 dark:text-white">
            {selectorSubmitStatus === 'success' ? (
              <div className="text-center">
                <h3 className="mb-4 text-2xl font-semibold">Thank You!</h3>
                <p className="mb-4">{selectorSubmitMessage}</p>
              </div>
            ) : selectorSubmitStatus === 'error' ? (
              <div className="text-center">
                <h3 className="mb-4 text-2xl font-semibold text-red-600">Error</h3>
                <p className="mb-4">{selectorSubmitMessage}</p>
              </div>
            ) : (
              <>
                <h3 className="mb-4 text-xl font-semibold">Review Your Choices</h3>
                <div className="space-y-2 text-gray-700 dark:text-gray-100">
                  <p><strong>Pricing Model:</strong> {selectorData.pricingModel}</p>
                  <p><strong>Plan:</strong> {selectorData.chosenPlan}</p>
                  <p><strong>Business Type:</strong> {selectorData.businessType}</p>
                  <p><strong>Devices:</strong> {selectorData.numDevices}</p>
                  {selectorData.businessType === 'restaurant' && (
                    <p>
                      <strong>Restaurant Type:</strong>{' '}
                      {selectorData.softwareNeeds.join(', ')}
                    </p>
                  )}
                  {selectorData.businessType !== 'restaurant' && selectorData.onlineOrdering && (
                    <p><strong>Online Ordering:</strong> Yes</p>
                  )}
                  <p>
                    <strong>Name:</strong> {selectorData.firstName} {selectorData.lastName}
                  </p>
                  <p><strong>Email:</strong> {selectorData.email}</p>
                  <p><strong>Phone:</strong> {selectorData.phone}</p>
                </div>
                <div className="mt-6 text-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSelectorSubmit}
                    className="px-8 py-3 text-white transition-colors bg-blue-600 dark:bg-blue-400 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-300"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Submitting...' : 'Submit'}
                  </motion.button>
                </div>
              </>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  const renderProgressIndicator = () => {
    const totalSteps = 7;
    return (
      <div className="flex items-center justify-center my-6">
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
              >
                {wizardStep > stepNum ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                ></div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  return (
    <ThemeProvider>
      <main className={darkMode ? 'dark' : ''}>
        <div className="min-h-screen text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-900">
          <Head>
            <title>StarAccept Business Solutions</title>
            <meta name="description" content="Affordable, full-service credit card processing with proven, cutting-edge technology. Transform your business."/>
            <link rel="icon" href="/favicon.ico"/>
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

          {/* NAVBAR */}
          <motion.nav
            className="fixed top-0 z-50 w-full bg-white dark:bg-gray-800 shadow-sm bg-opacity-90 backdrop-blur-sm"
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
                      className="transition-all duration-187.5 hover:brightness-110 dark:brightness-125"
                      priority
                    />
                  </motion.div>
                </div>

                {/* Mobile menu button */}
                <div className="flex items-center md:hidden">
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 focus:outline-none"
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

                {/* Desktop menu & Dark Mode Toggle */}
                <div className="items-center hidden space-x-8 md:flex">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
                    onClick={() => {
                      document.getElementById('product-selector')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    Wizard
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
                    onClick={() => {
                      const contactSection = document.getElementById('contact');
                      contactSection?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    Contact
                  </motion.button>
                  <button
                    onClick={toggleDarkMode}
                    className="p-2 text-gray-600 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none"
                    aria-label="Toggle Dark Mode"
                  >
                    {darkMode ? (
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 21a9 9 0 0 1-6.36-2.64C3.09 15.81 2 13 2 9.5 2 5.36 5.36 2 9.5 2c.9 0 1.78.12 2.6.34.82.22 1.6.56 2.28 1.02.68.46 1.24 1.08 1.68 1.8.44.72.78 1.56.98 2.46.2.9.3 1.82.3 2.78 0 3.5-2.54 6.43-5.99 7.6-1.5.53-3.09.8-4.73.8z" />
                      </svg>
                    ) : (
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.nav>

          {/* HERO */}
          <div className="relative h-[70vh] md:h-[80vh] lg:h-[90vh] w-full max-w-[1920px] mx-auto pt-16 flex items-center justify-center">
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
                <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/60 via-black/40 to-transparent"></div>
              </div>
            </motion.div>
            {/* Carousel Dots */}
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
            <div className="absolute inset-0 flex items-center max-w-[1920px] mx-auto">
              <div className="relative z-20 max-w-6xl px-4 mx-auto mt-16">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="max-w-3xl text-white"
                >
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
                      >
                        Get Started Now
                      </motion.button>
                    </motion.a>
                    <motion.button
                      whileHover={{ scale: 1.05, boxShadow: '0px 4px 8px rgba(0,0,0,0.2)' }}
                      whileTap={{ scale: 0.95 }}
                      className="px-8 py-4 text-lg font-semibold text-white transition-colors border-2 border-white rounded-full hover:bg-white hover:text-amber-500"
                      onClick={() => {
                        const contactSection = document.getElementById('contact');
                        contactSection?.scrollIntoView({ behavior: 'smooth' });
                      }}
                    >
                      Talk to an Expert
                    </motion.button>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Example Stats Section */}
          <section className="py-16 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white">
            <div className="max-w-6xl mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-12">Proven Results, Trusted Service</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {/* Uptime */}
                <div className="flex flex-col items-center p-6 bg-white dark:bg-gray-700 rounded-xl shadow-md text-center">
                  <FaCheckCircle className="text-green-500 dark:text-green-400 text-4xl mb-2" />
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white">99.99%</h3>
                  <p className="mt-2 text-gray-600 dark:text-gray-300">Uptime</p>
                </div>
                {/* 24/7 Support */}
                <div className="flex flex-col items-center p-6 bg-white dark:bg-gray-700 rounded-xl shadow-md text-center">
                  <FaClock className="text-blue-500 dark:text-blue-400 text-4xl mb-2" />
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white">24/7</h3>
                  <p className="mt-2 text-gray-600 dark:text-gray-300">Support</p>
                </div>
                {/* 100k+ Users */}
                <div className="flex flex-col items-center p-6 bg-white dark:bg-gray-700 rounded-xl shadow-md text-center">
                  <FaUsers className="text-purple-500 dark:text-purple-400 text-4xl mb-2" />
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white">100K+</h3>
                  <p className="mt-2 text-gray-600 dark:text-gray-300">Users</p>
                </div>
                {/* 4.9 Rating */}
                <div className="flex flex-col items-center p-6 bg-white dark:bg-gray-700 rounded-xl shadow-md text-center">
                  <FaStar className="text-yellow-500 dark:text-yellow-400 text-4xl mb-2" />
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white">4.9/5</h3>
                  <p className="mt-2 text-gray-600 dark:text-gray-300">Rating</p>
                </div>
              </div>
            </div>
          </section>

          {/* PRODUCT SELECTOR (MERGED WIZARD/PRICING) */}
          <section className="py-20 bg-gray-50 dark:bg-gray-800" id="product-selector">
            <div className="max-w-6xl px-4 mx-auto">
              <div className="mb-12 text-center">
                <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">Find Your Perfect POS & Pricing</h2>
                <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400">
                  Combine your hardware, software, and preferred processing into a single, seamless solution.
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
                {wizardStep < 7 && (
                  <div className="flex justify-between mt-8">
                    <motion.button
                      type="button"
                      onClick={handlePreviousStep}
                      disabled={wizardStep === 1}
                      className={`px-6 py-2 text-gray-600 dark:text-gray-300 rounded-lg transition-colors ${
                        wizardStep === 1
                          ? 'opacity-50 cursor-not-allowed bg-gray-200 dark:bg-gray-600'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-600 bg-gray-100 dark:bg-gray-600'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Previous
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={handleNextStep}
                      disabled={wizardStep === 7}
                      className={`px-6 py-2 text-white bg-blue-600 dark:bg-blue-400 rounded-lg transition-colors ${
                        wizardStep === 7 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700 dark:hover:bg-blue-300'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Next
                    </motion.button>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* CONTACT SECTION */}
          <div className="relative px-4 py-20 bg-gradient-to-b from-gray-50 dark:from-gray-800 to-white dark:to-gray-900" id="contact">
            <div className="max-w-6xl mx-auto">
              <div className="mb-12 text-center">
                <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">Local Comes First</h2>
                <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400">
                  Ready to transform your business? Fill out the form below and a local team member will reach out within 24 hours.
                </p>
              </div>
              <div className="grid items-start gap-12 md:grid-cols-2">
                {/* Left: Contact Form */}
                <div className="p-8 bg-white dark:bg-gray-700 border border-gray-100 dark:border-gray-600 shadow-sm rounded-xl">
                  <form onSubmit={handleDemoRequest} className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">First Name</label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-white"
                          placeholder="John"
                        />
                      </div>
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">Last Name</label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-white"
                          placeholder="Doe"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">Business Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-white"
                        placeholder="john@yourcompany.com"
                      />
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-white"
                        placeholder="(555) 123-4567"
                      />
                    </div>

                    {/* New Callback Schedule Fields */}
                    <div className="grid gap-6 md:grid-cols-2">
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">Preferred Call Date</label>
                        <input
                          type="date"
                          name="callDate"
                          value={formData.callDate}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">Preferred Time</label>
                        <select
                          name="preferredTime"
                          value={formData.preferredTime}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-white"
                        >
                          <option value="">Select a time</option>
                          <option value="morning">Morning (9AM - 12PM)</option>
                          <option value="afternoon">Afternoon (12PM - 5PM)</option>
                          <option value="evening">Evening (5PM - 8PM)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">Select plan</label>
                      <select
                        name="pricingPlan"
                        value={formData.pricingPlan}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-white"
                      >
                        <option value="">Select Plan</option>
                        <option value="onthego">On The Go</option>
                        <option value="mobilepro">Mobile Pro Bundle</option>
                        <option value="retailorcounterservicerestaurantbundle">Retail / Counter-Service</option>
                        <option value="fullservicerestaurantandbarbundle">Full-Service & Bar</option>
                      </select>
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">Business Type</label>
                      <select
                        name="businessType"
                        value={formData.businessType}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-white"
                      >
                        <option value="">Select a business type</option>
                        <option value="retail">Retail</option>
                        <option value="restaurant">Restaurant</option>
                        <option value="service">Service Business</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">Estimated Monthly Volume</label>
                      <select
                        name="monthlyVolume"
                        value={formData.monthlyVolume}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-white"
                      >
                        <option value="">Select estimated monthly volume</option>
                        <option value="0-50,000">0-50,000</option>
                        <option value="50000-250000">50,000-250,000</option>
                        <option value="250000-1000000">250,000-1,000,000</option>
                        <option value="1000000+">1,000,000+</option>
                      </select>
                    </div>

                    <div className="space-y-4">
                      <motion.button
                        type="submit"
                        className="w-full py-4 px-6 rounded-lg font-semibold text-white bg-blue-600 dark:bg-blue-400 hover:bg-blue-700 dark:hover:bg-blue-300 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={isLoading}
                      >
                        {isLoading ? 'Sending...' : 'Send Message'}
                      </motion.button>
                    </div>
                    {submitStatus !== 'idle' && (
                      <div
                        className={`p-4 rounded-lg mt-2 ${
                          submitStatus === 'success'
                            ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200'
                        }`}
                      >
                        {submitMessage}
                      </div>
                    )}
                  </form>
                </div>

                {/* Right side extras */}
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
                          <span className="text-2xl">{item.icon}</span>
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
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  alt="staraccept"
                  width={187.5}
                  height={50}
                  className="mx-auto transition-all duration-300 hover:brightness-110 dark:brightness-125"
                />
              </div>
              <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                © {new Date().getFullYear()} Star Accept Business Solutions. All rights reserved.
              </p>
              <div className="flex flex-wrap items-center justify-center space-x-4">
                <a
                  href="#"
                  className="text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                >
                  Terms of Service
                </a>
                <a
                  href="#"
                  className="text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                >
                  Privacy Policy
                </a>
                <a
                  href="#"
                  className="text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                >
                  Contact Us
                </a>
              </div>
              <div className="mt-4">
                <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                  Star Accept is a registered ISO of Fifth Third Bank, N.A., Cincinnati, OH and Wells Fargo Bank, N.A., Concord, CA
                </p>
              </div>
            </div>

            {/* Sticky CTA */}
            <motion.div
              className="fixed bottom-0 left-0 w-full p-4 bg-amber-500 transition-transform"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              transition={{ type: 'spring', stiffness: 100 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="max-w-6xl mx-auto flex items-center justify-center">
                <a href="https://onboarding.tillpayments.com/signup/6748abe55b6362feca0a75f3" target="_blank" rel="noopener noreferrer">
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
