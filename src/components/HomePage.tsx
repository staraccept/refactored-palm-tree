'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import NavBar from './NavBar';
import Image from 'next/image';

interface HomePageProps {
  setShowChat: (show: boolean) => void;
}

export default function HomePage({ setShowChat }: HomePageProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('monthly');
  const [selectedFAQ, setSelectedFAQ] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

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

  const handleDemoRequest = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100/80">
      <NavBar setShowChat={setShowChat} />
      {/* Your existing promotional banner */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white"
      >
      </motion.div>

      {/* Copy all your existing sections here (hero, features, pricing, etc.) */}
    </main>
  );
}