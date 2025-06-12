"use client";

// ------------------------
// IMPORTS
// ------------------------
import React, { useState, useRef, useCallback, useMemo, FC } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { 
  FaSearch, FaTimes, FaShoppingCart, FaStore, FaDesktop, FaMobileAlt, FaWifi, 
  FaCheckCircle, FaExchangeAlt, FaSun, FaMoon, FaBars
} from 'react-icons/fa';
import { ThemeProvider, useTheme } from '../components/ThemeProvider';
import { posProducts as allProducts, type PosProduct } from '@/lib/posProducts'; 

// =================================================================
// 
//      PAGE-SPECIFIC COMPONENTS
// 
// =================================================================

const PageHead: FC = () => (
  <Head>
    <title>POS Systems & Hardware Showcase | StarAccept</title>
    <meta name="description" content="Explore our curated showcase of POS systems and payment hardware. Find the perfect solution to grow your business and get a quote today." />
    <meta name="keywords" content="POS systems, point of sale, payment hardware, Clover, restaurant POS, retail POS" />
  </Head>
);

const Navbar: FC = () => {
    // This Navbar component is identical to the one from the previous refactor, ensuring consistency.
    const { darkMode, toggleDarkMode } = useTheme();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navLinks = [
      { href: "/restaurants", label: "Restaurants" },
      { href: "/retail", label: "Retail" },
      { href: "/services", label: "Services" },
      { href: "/online-ordering", label: "Online Ordering" },
      { href: "/working-capital-funding", label: "Working Capital" },
      { href: "/poslineup", label: "POS Systems", active: true },
      { href: "/#contact", label: "Contact" },
    ];
    return (
        <motion.nav className="fixed top-0 z-50 w-full bg-white/80 dark:bg-gray-900/80 shadow-sm backdrop-blur-lg" initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 0.5 }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    <Link href="/" aria-label="StarAccept Home"><Image src="/staracceptlogo.png" alt="StarAccept Logo" width={180} height={48} priority /></Link>
                    <div className="hidden md:flex items-center space-x-6">
                        {navLinks.map(link => (<Link key={link.href} href={link.href} className={`transition-colors font-medium ${link.active ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'}`}>{link.label}</Link>))}
                    </div>
                    <div className="flex items-center space-x-2">
                        <Link href="/#contact" className="hidden md:inline-flex">
                            <motion.button className="items-center gap-2 px-4 py-2 text-sm bg-amber-500 text-white rounded-full hover:bg-amber-600 shadow-sm" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>Request Consultation</motion.button>
                        </Link>
                        <button onClick={toggleDarkMode} className="p-2 text-gray-600 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700" aria-label={`Switch to ${darkMode ? 'light' : 'dark'} mode`}>{darkMode ? <FaSun /> : <FaMoon />}</button>
                        <div className="md:hidden"><button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-gray-600 dark:text-gray-300" aria-label="Toggle mobile menu" aria-expanded={isMenuOpen}>{isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}</button></div>
                    </div>
                </div>
            </div>
            <AnimatePresence>{isMenuOpen && (<motion.div className="md:hidden bg-white dark:bg-gray-900" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}><div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">{navLinks.map(link => (<Link key={link.href} href={link.href} onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800">{link.label}</Link>))}</div></motion.div>)}</AnimatePresence>
        </motion.nav>
    );
};

const HeroSection: FC = () => (
    <div className="relative w-full h-[60vh] flex items-center justify-center text-white overflow-hidden pt-20">
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-blue-900/90 to-blue-700/80" />
        <Image src="/pos-hero-bg.jpg" alt="POS System background" fill className="object-cover" priority />
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                Modern POS for Every Business
            </motion.h1>
            <motion.p className="mt-4 max-w-3xl mx-auto text-lg md:text-xl text-blue-100" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }}>
                Explore industry-leading hardware designed to streamline operations, boost sales, and deliver an exceptional customer experience.
            </motion.p>
            <motion.div className="mt-8 flex flex-wrap gap-4 justify-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.6 }}>
                {/* CHANGED: Main CTA now uses the brand's accent color for consistency */}
                <a href="#pos-systems" className="px-8 py-3 text-lg font-semibold text-gray-900 bg-amber-400 rounded-full hover:bg-amber-300 shadow-lg">
                    Explore Systems
                </a>
                <Link href="/#contact" className="px-8 py-3 text-lg font-semibold text-white bg-white/20 rounded-full hover:bg-white/30 backdrop-blur-sm">
                    Request Expert Advice
                </Link>
            </motion.div>
        </div>
    </div>
);

interface ProductCardProps {
  product: PosProduct;
  isInCompare: boolean;
  onToggleCompare: (id: string) => void;
  onImageClick: (src: string) => void;
}

// CHANGED: This component is now a pure "Showcase" card.
const ProductCard: FC<ProductCardProps> = ({ product, isInCompare, onToggleCompare, onImageClick }) => (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 flex flex-col transition-all duration-300"
      whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.08)' }}
      layout
    >
        <div className="relative h-56 w-full bg-gray-50 dark:bg-gray-700/50 p-4 group">
            <button onClick={() => onToggleCompare(product.identifier)} className={`absolute top-3 right-3 z-10 p-2 rounded-full transition-colors ${isInCompare ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-600'}`} aria-label="Toggle Compare">
                <FaExchangeAlt />
            </button>
            {product.image && <Image src={product.image} alt={product.name} fill className="object-contain p-2 cursor-pointer group-hover:scale-105 transition-transform" onClick={() => onImageClick(product.image!)} />}
        </div>
        <div className="p-6 flex-grow flex flex-col">
            <h3 className="text-xl font-bold mb-2">{product.name}</h3>
            {/* CHANGED: Now showing more key features directly on the card */}
            <div className="flex-grow">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Key Features:</h4>
              <ul className="space-y-1.5 text-sm text-gray-600 dark:text-gray-400">
                  {product.features.slice(0, 3).map((item, i) => (
                      <li key={i} className="flex items-center gap-2"><FaCheckCircle className="text-green-500 flex-shrink-0" /> <span>{item}</span></li>
                  ))}
              </ul>
            </div>
        </div>
        {/* CHANGED: Single, clear Call to Action */}
        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700/50">
            <Link href="/#contact" className="w-full">
                <button className="w-full text-center px-4 py-3 bg-amber-500 text-white font-semibold rounded-full hover:bg-amber-600 transition-colors shadow-sm hover:shadow-md">
                    Get a Quote
                </button>
            </Link>
        </div>
    </motion.div>
);

// =================================================================
// 
//      MAIN PAGE COMPONENT
// 
// =================================================================

function POSLineupPage() {
  const { darkMode } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<string>('all');
  const [compareList, setCompareList] = useState<string[]>([]);

  const categories = [
    { id: 'all', name: 'All', icon: <FaShoppingCart /> },
    { id: 'pos', name: 'POS Systems', icon: <FaDesktop /> },
    { id: 'mobile', name: 'Mobile', icon: <FaMobileAlt /> },
    { id: 'peripheral', name: 'Peripherals', icon: <FaWifi /> },
  ];

  const filteredProducts = useMemo(() => {
    return allProducts.filter(product => {
        const lowerSearch = searchTerm.toLowerCase();
        const matchesSearch = searchTerm === '' ||
            product.name.toLowerCase().includes(lowerSearch) ||
            product.features.some(f => f.toLowerCase().includes(lowerSearch)) ||
            product.bestFor.some(b => b.toLowerCase().includes(lowerSearch)) ||
            product.searchTerms?.keywords?.some(k => k.toLowerCase().includes(lowerSearch));
        
        const matchesFilter = filter === 'all' || product.primaryCategory === filter;
        return matchesSearch && matchesFilter;
    });
  }, [searchTerm, filter]);

  const toggleCompare = (productId: string) => {
    setCompareList(prev => 
      prev.includes(productId) 
      ? prev.filter(id => id !== productId) 
      : prev.length < 3 ? [...prev, productId] : prev
    );
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilter('all');
  };

  return (
    <main className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 selection:bg-amber-500 selection:text-white">
        <PageHead />
        <Navbar />
        <HeroSection />

        {/* Filters and Search Bar */}
        <div className="sticky top-20 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-grow">
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search for products or features..." className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-full bg-white dark:bg-gray-800 focus:ring-2 focus:ring-amber-500 focus:outline-none"/>
                    </div>
                    <div className="flex gap-2 justify-center">
                        {categories.map((cat) => (
                          <button key={cat.id} onClick={() => setFilter(cat.id)} className={`flex items-center gap-2 px-4 py-3 rounded-full font-medium transition-colors ${filter === cat.id ? 'bg-amber-500 text-white' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'}`}>
                              {cat.icon} {cat.name}
                          </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>

        <div id="pos-systems" className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold">Our POS Showcase</h2>
                  <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                    Find the perfect hardware to power your business, from all-in-one systems to mobile solutions.
                  </p>
              </div>

              {filteredProducts.length > 0 ? (
                  <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AnimatePresence>
                      {filteredProducts.map((product) => (
                          <ProductCard
                            key={product.identifier}
                            product={product}
                            isInCompare={compareList.includes(product.identifier)}
                            onToggleCompare={toggleCompare}
                            onImageClick={() => {}} // Can be re-enabled if modal is needed
                          />
                      ))}
                    </AnimatePresence>
                  </motion.div>
              ) : (
                  <div className="text-center py-16">
                      <p className="text-xl text-gray-500 dark:text-gray-400 mb-4">No products match your criteria.</p>
                      <button onClick={clearFilters} className="px-6 py-2 bg-amber-500 text-white rounded-full">Clear Filters</button>
                  </div>
              )}
          </div>
        </div>
        
        {/* CTA Section */}
        <section className="bg-blue-600">
            <div className="max-w-7xl mx-auto text-center py-16 px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-extrabold text-white">Not Sure What You Need?</h2>
                <p className="mt-4 text-lg text-blue-100">Let our payment experts guide you to the perfect solution for your business.</p>
                <Link href="/#contact" className="mt-8 inline-block px-8 py-4 bg-amber-400 text-gray-900 font-bold rounded-full hover:bg-amber-300 transition shadow-lg">
                    Request a Free Consultation
                </Link>
            </div>
        </section>

        {/* FOOTER */}
        <footer className="py-12 bg-gray-800 dark:bg-black text-gray-300">
             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <p>© {new Date().getFullYear()} Star Accept Business Solutions. All rights reserved.</p>
            </div>
        </footer>

        {/* Comparison Drawer */}
        <AnimatePresence>
            {compareList.length > 0 && (
                <motion.div className="fixed bottom-0 left-0 w-full bg-white dark:bg-gray-800 shadow-2xl border-t border-gray-200 dark:border-gray-700 z-40" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-lg">Compare Products ({compareList.length}/3)</h3>
                            <div className="flex items-center gap-2">
                                {compareList.length >= 2 && (
                                    <Link href={`/compare?ids=${compareList.join(',')}`}><button className="px-4 py-2 bg-amber-500 text-white rounded-full text-sm font-semibold">Compare Now</button></Link>
                                )}
                                <button onClick={() => setCompareList([])} className="p-2 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white" aria-label="Clear Comparison"><FaTimes /></button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
        
      </div>
    </main>
  );
}

// Final wrapper to provide the theme context
export default function POSLineup() {
  return (
    <ThemeProvider>
      <POSLineupPage />
    </ThemeProvider>
  );
}
