'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Home, Sparkles, NotebookPen } from 'lucide-react';

import TrueFocus from './components/TrueFocus';
import ShinyText from './components/ShinyText';
import StarBorder from './components/StarBorder';
import Navbar from './components/Navbar';
import { FloatingNav } from './components/FloatingNavbar';

import { StarsBackground } from './backrounds/StarBackround';
import { ShootingStars } from './backrounds/ShootingStar';

export default function HeroSection() {
  const navItems = [
    { name: 'Beranda', link: '#hero', icon: <Home /> },
    { name: 'Fitur', link: '#features', icon: <Sparkles /> },
    { name: 'Preview', link: '#preview', icon: <NotebookPen /> },
  ];

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col overflow-hidden bg-gradient-to-b from-gray-900 via-gray-800 to-purple-200 text-white"
    >
      {/* 🌌 Efek bintang dan shooting star */}
      <StarsBackground className="absolute inset-0 z-0" />
      <ShootingStars className="absolute inset-0 z-0" />

      {/* 🔝 Navbar */}
      <Navbar />
      <FloatingNav navItems={navItems} />

      {/* ✨ Konten Tengah */}
      <div className="flex-grow flex flex-col items-center justify-center text-center px-4 z-10">
        <motion.div
          className="mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <TrueFocus
            sentence="Notes Daily"
            blurAmount={4}
            borderColor="#ffffff"
            glowColor="rgba(255,255,255,0.5)"
            animationDuration={0.6}
            pauseBetweenAnimations={1.2}
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-xl md:text-2xl mb-8 max-w-xl mx-auto"
        >
          <ShinyText text="Kelola catatan harianmu dengan mudah, aman, dan menyenangkan." speed={4} />
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <Link href="/auth/login">
            <StarBorder color="white" speed="5s" thickness={2}>
              Mulai Sekarang
            </StarBorder>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
