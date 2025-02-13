"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Head from 'next/head';
import Image from 'next/image';
import {
    FaCheckCircle,
    FaClock,
    FaHandshake,
    FaPuzzlePiece,
    FaGlobe
} from 'react-icons/fa';
import { ThemeProvider, useTheme } from './components/ThemeProvider'; // adjust path if needed
import { posProducts } from '@/lib/posProducts'; // adjust path if needed
import { findRelatedProducts as localFindProducts } from '@/lib/posProducts';

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
    const sampleQueries = [
        "I own a coffee shop and need a fast checkout system",
        "I want a system that supports Apple Pay and QR codes",
        "I have two locations and need real-time inventory sync",
    ];
    const [currentSampleIndex, setCurrentSampleIndex] = useState(0);
    const [typedText, setTypedText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const [userQuery, setUserQuery] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [recommendations, setRecommendations] = useState<any[]>([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [showResults, setShowResults] = useState(false);
    const typingSpeed = 80;
    const pauseAtEndOfSample = 2000;
    const cursorRef = useRef<HTMLSpanElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (cursorRef.current) {
            cursorRef.current.style.animation = "blink 1s infinite";
        }
    }, []);

    // Typewriter effect for sample queries
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
    }, [typedText, isDeleting, currentSampleIndex, sampleQueries, typingSpeed, userQuery, pauseAtEndOfSample]);

    // Fetch logic
    useEffect(() => {
        if (!userQuery) {
            setRecommendations([]);
            setErrorMessage("");
            setShowResults(false);
            return;
        }
        setShowResults(true);
        const timer = setTimeout(async () => {
            setIsLoading(true);
            setErrorMessage("");
            setRecommendations([]);

            try {
                const res = await fetch("https://cold-bush-ec7b.pauljash.workers.dev/", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ query: userQuery }),
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
                    const fallbackProducts = localFindProducts(userQuery, 3);
                    if (fallbackProducts.length > 0) {
                        setRecommendations(fallbackProducts.map((p) => p));
                    } else {
                        setErrorMessage("No recommendations found for your query.");
                    }
                } else {
                    const matchedItems = data.recommendations.map((r: string) =>
                        matchRecommendedItem(r)
                    );
                    setRecommendations(matchedItems);
                }
            } catch (error: any) {
                console.error("Error fetching recommendations:", error);
                const fallbackProducts = localFindProducts(userQuery, 3);
                if (fallbackProducts.length > 0) {
                    setRecommendations(fallbackProducts);
                } else {
                    setErrorMessage("Could not fetch recommendations. Please try again.");
                }
            } finally {
                setIsLoading(false);
            }
        }, 600);
        return () => clearTimeout(timer);
    }, [userQuery]);

    // Click outside / Esc to close
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (
                containerRef.current &&
                !containerRef.current.contains(e.target as Node)
            ) {
                setShowResults(false);
            }
        }
        function handleEsc(e: KeyboardEvent) {
            if (e.key === 'Escape') {
                setShowResults(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEsc);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEsc);
        };
    }, []);

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
                onFocus={() => {
                    if (userQuery || isLoading || errorMessage) {
                        setShowResults(true);
                    }
                }}
                onChange={(e) => setUserQuery(e.target.value)}
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
                                <div className="w-4 h-4 border-2 border-t-transparent border-gray-400 rounded-full animate-spin"></div>
                                <span>Fetching recommendations...</span>
                            </div>
                        )}

                        {!isLoading && errorMessage && (
                            <div className="text-red-500 dark:text-red-300">{errorMessage}</div>
                        )}

                        {!isLoading && !errorMessage && recommendations.length > 0 && (
                            <div>
                                {recommendations.map((item: any, idx: number) => (
                                    <div
                                        key={idx}
                                        className="mb-6 flex flex-col md:flex-row md:space-x-4 border-b border-gray-200 dark:border-gray-600 pb-4 last:border-none"
                                    >
                                        {/* Left column: image */}
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
                                        {/* Right column: name and details */}
                                        <div className="md:w-2/3">
                                            <h4 className="font-semibold text-gray-800 dark:text-gray-100 text-lg mb-2">
                                                {item.name}
                                            </h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {/* Features */}
                                                {item.features && item.features.length > 0 && (
                                                    <div>
                                                        <h5 className="font-medium">Features</h5>
                                                        <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-300 mt-1 space-y-1">
                                                            {item.features.map((feat: string, fIdx: number) => (
                                                                <li key={fIdx}>{feat}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                                {/* Best For */}
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
                                                <button className="text-blue-600 dark:text-blue-400 hover:underline">
                                                    {item.cta || "View"}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {recommendations.length === 0 && (
                                    <div className="text-sm text-gray-600 dark:text-gray-300">
                                        No recommendations found.
                                    </div>
                                )}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

export default function Home() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [currentImage, setCurrentImage] = useState(0);
    const [wizardStep, setWizardStep] = useState(1);
    const [selectorData, setSelectorData] = useState<ProductSelectorData>(initialSelectorData);
    const [isLoading, setIsLoading] = useState(false);
    const [selectorSubmitStatus, setSelectorSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [selectorSubmitMessage, setSelectorSubmitMessage] = useState('');
    const [contactFormData, setContactFormData] = useState({
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
    });
    const [contactSubmitStatus, setContactSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [contactSubmitMessage, setContactSubmitMessage] = useState('');
    const { darkMode, toggleDarkMode } = useTheme();

    const images = [
        { src: '/retailflex3.png', alt: 'Flexible Payment Terminal' },
        { src: '/qsrduo2.png', alt: 'QSR Duo POS System' },
        { src: '/retailmini3.png', alt: 'Retail Mini POS' },
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentImage((prev) => (prev + 1) % images.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [images]);

    const scrollWizardToTop = () => {
        const wizardSection = document.getElementById('product-selector');
        wizardSection?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleNextStep = () => {
        if (wizardStep === 1 && !selectorData.businessType) {
            alert('Please select a business type.');
            return;
        }
        if (
            wizardStep === 2 &&
            selectorData.businessType === 'restaurant' &&
            selectorData.softwareNeeds.length === 0
        ) {
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
    };

    const handlePreviousStep = () => {
        setWizardStep((prev) => {
            const newStep = Math.max(prev - 1, 1);
            setTimeout(scrollWizardToTop, 50);
            return newStep;
        });
    };

    const handleSelectorInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
        deviceType?: keyof ProductSelectorData
    ) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            if (name === 'onlineOrdering') {
                setSelectorData((prev) => ({ ...prev, onlineOrdering: !prev.onlineOrdering }));
                return;
            }
            const checkValue = value;
            setSelectorData((prevData) => ({
                ...prevData,
                softwareNeeds: prevData.softwareNeeds.includes(checkValue)
                    ? prevData.softwareNeeds.filter((item) => item !== checkValue)
                    : [...prevData.softwareNeeds, checkValue],
            }));
            return;
        }
        if (deviceType) {
            const qty = parseInt(value, 10) || 0;
            setSelectorData((prevData) => ({ ...prevData, [deviceType]: qty }));
            return;
        }
        setSelectorData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleQuantityChange = (deviceType: keyof ProductSelectorData, increment: number) => {
        setSelectorData((prevData) => {
            const newQty = Math.max(0, (prevData[deviceType] as number) + increment);
            return { ...prevData, [deviceType]: newQty };
        });
    };

    const handleSelectorSubmit = async () => {
        setIsLoading(true);
        setSelectorSubmitStatus('idle');
        setSelectorSubmitMessage('');
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
                setSelectorSubmitStatus('success');
                setSelectorSubmitMessage("Thank you! We'll be in touch shortly to assist with your needs.");
                setSelectorData(initialSelectorData);
                setWizardStep(1);
                setTimeout(scrollWizardToTop, 50);
            } else {
                const errorBody = await response.text();
                console.error(`Failed to send data: ${response.status} ${errorBody}`);
                setSelectorSubmitStatus('error');
                setSelectorSubmitMessage(
                    `Error. Please try again or contact us. Status: ${response.status}`
                );
            }
        } catch (error) {
            console.error('Submission error:', error);
            setSelectorSubmitStatus('error');
            setSelectorSubmitMessage('Error. Please try again or contact us.');
        } finally {
            setIsLoading(false);
        }
    };

    function renderStepContent() {
        // Replace or update with your actual step content
        return <div>Wizard Steps Go Here...</div>;
    }

    function renderProgressIndicator() {
        const totalSteps = 5;
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
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                ) : (
                                    stepNum
                                )}
                            </div>
                            {stepNum < totalSteps && (
                                <div
                                    className={`w-16 h-1 transition-colors ${
                                        wizardStep > stepNum
                                            ? 'bg-blue-600 dark:bg-blue-700'
                                            : 'bg-gray-200 dark:bg-gray-600'
                                    }`}
                                ></div>
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        );
    }

    const handleContactInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setContactFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleContactSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setContactSubmitStatus('idle');
        setContactSubmitMessage('');
        const requiredFields = ['firstName', 'lastName', 'email', 'phone'];
        const missingFields = requiredFields.filter((field) => !contactFormData[field as keyof typeof contactFormData]);
        if (missingFields.length > 0) {
            setContactSubmitStatus('error');
            setContactSubmitMessage('Please fill in all required fields: ' + missingFields.join(', '));
            setIsLoading(false);
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(contactFormData.email)) {
            setContactSubmitStatus('error');
            setContactSubmitMessage('Please enter a valid email address.');
            setIsLoading(false);
            return;
        }
        let finalLocations =
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
                numLocations: finalLocations || '',
                monthlyVolume: contactFormData.monthlyVolume,
                submitTime: new Date().toISOString(),
                formType: 'contactPage',
            });
            const url = `https://hooks.zapier.com/hooks/catch/17465641/2awchwj/?${params.toString()}`;
            const response = await fetch(url, { method: 'GET' });
            if (response.ok) {
                setContactSubmitStatus('success');
                setContactSubmitMessage("Thank you! We'll be in touch shortly to assist with your needs.");
                setContactFormData({
                    firstName: '',
                    lastName: '',
                    email: '',
                    phone: '',
                    callDate: '',
                    preferredTime: '',
                    businessType: '',
                    numLocationsChoice: '1',
                    numLocationsCustom: '',
                    monthlyVolume: '0-50K'
                });
            } else {
                const errorBody = await response.text();
                console.error(`Failed: ${response.status} ${errorBody}`);
                setContactSubmitStatus('error');
                setContactSubmitMessage(
                    `Error sending message. Please try again or contact us. Status: ${response.status}`
                );
            }
        } catch (error) {
            console.error('Submission error:', error);
            setContactSubmitStatus('error');
            setContactSubmitMessage('Error sending message. Please try again or contact us.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ThemeProvider>
            <main className={darkMode ? 'dark' : ''}>
                <div className={darkMode ? 'min-h-screen text-gray-200 bg-gray-900' : 'min-h-screen text-gray-800 bg-white'}>
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
                                __html: `
                                    window.dataLayer = window.dataLayer || [];
                                    function gtag(){dataLayer.push(arguments);}
                                    gtag('js', new Date());
                                    gtag('config', 'G-2D18CMVZEF');
                                `,
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
                                            className="transition-all duration-300 hover:brightness-110 dark:brightness-125"
                                            priority
                                        />
                                    </motion.div>
                                </div>
                                <div className="flex items-center md:hidden">
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
                                <div className="items-center hidden space-x-8 md:flex">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
                                        onClick={() => {
                                            document.getElementById('product-selector')?.scrollIntoView({ behavior: 'smooth' });
                                        }}
                                    >
                                        POS Wizard
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
                                        onClick={() => {
                                            document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
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
                                                <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                        {isMenuOpen && (
                            <motion.div
                                className="md:hidden bg-white dark:bg-gray-800 px-4 pt-2 pb-3 space-y-1"
                                initial={{ height: 0 }}
                                animate={{ height: 'auto' }}
                            >
                                <button
                                    className="block w-full text-left px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                    onClick={() => {
                                        setIsMenuOpen(false);
                                        document.getElementById('product-selector')?.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                >
                                    POS Wizard
                                </button>
                                <button
                                    className="block w-full text-left px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                    onClick={() => {
                                        setIsMenuOpen(false);
                                        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                >
                                    Contact
                                </button>
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
                                                whileHover={{
                                                    scale: 1.05,
                                                    boxShadow: '0px 4px 8px rgba(0,0,0,0.2)',
                                                }}
                                                whileTap={{ scale: 0.95 }}
                                                className="px-8 py-4 text-lg font-semibold text-white transition-colors rounded-full bg-amber-500 hover:bg-amber-600"
                                            >
                                                Get Started Now
                                            </motion.button>
                                        </motion.a>
                                        <motion.button
                                            whileHover={{
                                                scale: 1.05,
                                                boxShadow: '0px 4px 8px rgba(0,0,0,0.2)',
                                            }}
                                            whileTap={{ scale: 0.95 }}
                                            className="px-8 py-4 text-lg font-semibold text-white transition-colors border-2 border-white rounded-full hover:bg-white hover:text-amber-500"
                                            onClick={() => {
                                                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                                            }}
                                        >
                                            Talk to an Expert
                                        </motion.button>
                                    </motion.div>
                                    <AiSearchOverlay />
                                </motion.div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Section */}
                    <section className="py-16 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white">
                        <div className="max-w-6xl mx-auto px-4">
                            <h2 className="text-3xl font-bold text-center mb-12">
                                Proven Results, Trusted Service
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
                                <div className="flex flex-col items-center p-6 bg-white dark:bg-gray-700 rounded-xl shadow-md text-center">
                                    <FaCheckCircle className="text-green-500 dark:text-green-400 text-4xl mb-2" />
                                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white">99.99%</h3>
                                    <p className="mt-2 text-gray-600 dark:text-gray-300">Uptime</p>
                                </div>
                                <div className="flex flex-col items-center p-6 bg-white dark:bg-gray-700 rounded-xl shadow-md text-center">
                                    <FaClock className="text-blue-500 dark:text-blue-400 text-4xl mb-2" />
                                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white">24/7</h3>
                                    <p className="mt-2 text-gray-600 dark:text-gray-300">Support</p>
                                </div>
                                <div className="flex flex-col items-center p-6 bg-white dark:bg-gray-700 rounded-xl shadow-md text-center">
                                    <FaHandshake className="text-orange-500 dark:text-orange-400 text-4xl mb-2" />
                                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                                        Direct Channel
                                    </h3>
                                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">No Middleman, No Hidden Fees</p>
                                </div>
                                <div className="flex flex-col items-center p-6 bg-white dark:bg-gray-700 rounded-xl shadow-md text-center">
                                    <FaPuzzlePiece className="text-purple-500 dark:text-purple-400 text-4xl mb-2" />
                                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white">300+</h3>
                                    <p className="mt-2 text-gray-600 dark:text-gray-300">Integrations</p>
                                </div>
                                <div className="flex flex-col items-center p-6 bg-white dark:bg-gray-700 rounded-xl shadow-md text-center">
                                    <FaGlobe className="text-green-600 dark:text-green-400 text-4xl mb-2" />
                                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white">Global</h3>
                                    <p className="mt-2 text-gray-600 dark:text-gray-300">Coverage</p>
                                </div>
                            </div>
                        </div>
                    </section>

                   {/* Wizard Section */}
                   <section className="py-20 bg-gray-50 dark:bg-gray-800" id="product-selector">
                        <div className="max-w-6xl px-4 mx-auto">
                            <div className="mb-12 text-center">
                                <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
                                    Find Your Perfect POS Solution
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
                                            className={`px-6 py-2 text-gray-600 dark:text-gray-300 rounded-lg transition-colors ${wizardStep === 1
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
                                            disabled={wizardStep === 5}
                                            className={`px-6 py-2 text-white bg-blue-600 dark:bg-blue-400 rounded-lg transition-colors ${wizardStep === 5 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700 dark:hover:bg-blue-300'
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

                    {/* Contact Section */}
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
                                                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">
                                                    First Name
                                                </label>
                                                <input
                                                    type="text"
                                                    name="firstName"
                                                    value={contactFormData.firstName}
                                                    onChange={handleContactInputChange}
                                                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-white"
                                                    placeholder="John"
                                                />
                                            </div>
                                            <div>
                                                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">Last Name</label>
                                                <input
                                                    type="text"
                                                    name="lastName"
                                                    value={contactFormData.lastName}
                                                    onChange={handleContactInputChange}
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
                                                value={contactFormData.email}
                                                onChange={handleContactInputChange}
                                                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-white"
                                                placeholder="john@yourcompany.com"
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">Phone Number</label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={contactFormData.phone}
                                                onChange={handleContactInputChange}
                                                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-white"
                                                placeholder="(555) 123-4567"
                                            />
                                        </div>
                                        <div className="grid gap-6 md:grid-cols-2">
                                            <div>
                                                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">
                                                    Preferred Call Date
                                                </label>
                                                <input
                                                    type="date"
                                                    name="callDate"
                                                    value={contactFormData.callDate}
                                                    onChange={handleContactInputChange}
                                                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-white"
                                                />
                                            </div>
                                            <div>
                                                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">
                                                    Preferred Time
                                                </label>
                                                <select
                                                    name="preferredTime"
                                                    value={contactFormData.preferredTime}
                                                    onChange={handleContactInputChange}
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
                                                            setContactFormData((prev) => ({
                                                                ...prev,
                                                                numLocationsChoice: opt,
                                                                numLocationsCustom: '',
                                                            }));
                                                        }}
                                                        className={`px-3 py-2 rounded ${contactFormData.numLocationsChoice === opt
                                                            ? 'bg-blue-600 text-white dark:bg-blue-500'
                                                            : 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200'
                                                        }`}
                                                    >
                                                        {opt}
                                                    </motion.button>
                                                ))}
                                                <motion.button
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={(ev) => {
                                                        ev.preventDefault();
                                                        setContactFormData((prev) => ({ ...prev, numLocationsChoice: 'plus' }));
                                                    }}
                                                    className={`px-3 py-2 rounded ${contactFormData.numLocationsChoice === 'plus'
                                                        ? 'bg-blue-600 text-white dark:bg-blue-500'
                                                        : 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200'
                                                    }`}
                                                >
                                                    +
                                                </motion.button>
                                            </div>
                                            {contactFormData.numLocationsChoice === 'plus' && (
                                                <div className="mt-3">
                                                    <label className="block mb-1 text-sm text-gray-600 dark:text-gray-400">Enter custom number:</label>
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        name="numLocationsCustom"
                                                        value={contactFormData.numLocationsCustom}
                                                        onChange={(e) => setContactFormData((prev) => ({ ...prev, numLocationsCustom: e.target.value }))}
                                                        className="w-32 px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
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
                                                            setContactFormData((prev) => ({ ...prev, monthlyVolume: range }));
                                                        }}
                                                        className={`px-4 py-2 rounded border ${contactFormData.monthlyVolume === range
                                                            ? 'bg-blue-600 text-white border-blue-600 dark:bg-blue-500 dark:border-blue-500'
                                                            : 'text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700'
                                                        }`}
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
                                                className="w-full py-4 px-6 rounded-lg font-semibold text-white bg-blue-600 dark:bg-blue-400 hover:bg-blue-700 dark:hover:bg-blue-300 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                disabled={isLoading}
                                            >
                                                {isLoading ? 'Sending...' : 'Send Message'}
                                            </motion.button>
                                        </div>
                                        {contactSubmitStatus !== 'idle' && (
                                            <div
                                                className={`p-4 rounded-lg mt-2 ${contactSubmitStatus === 'success'
                                                    ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200'
                                                    : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200'
                                                }`}
                                            >
                                                {contactSubmitMessage}
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