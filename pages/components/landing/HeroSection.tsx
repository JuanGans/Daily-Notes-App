'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Home, Sparkles, NotebookPen } from 'lucide-react';
import ShinyText from './components/ShinyText';
import TrueFocus from './components/TrueFocus';
import StarBorder from './components/StarBorder';
import { FloatingNav } from './components/FloatingNavbar';

export default function HeroSection() {
  const navItems = [
    { name: 'Beranda', link: '#hero', icon: <Home className="h-4 w-4" /> },
    { name: 'Fitur', link: '#features', icon: <Sparkles className="h-4 w-4" /> },
    { name: 'Preview', link: '#preview', icon: <NotebookPen className="h-4 w-4" /> },
  ];

  return (
    <section
      id="hero"
      className="min-h-screen flex flex-col justify-start items-center text-center overflow-hidden bg-gradient-to-br from-indigo-900 to-blue-600 text-white relative"
    >
      {/* Static Navbar (from navbar.tsx) */}
      <header className="bg-white dark:bg-gray-900 w-full z-40">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="md:flex md:items-center md:gap-12">
              <a className="block text-teal-600 dark:text-teal-600" href="#">
                <span className="sr-only">Home</span>
                <svg className="h-8" viewBox="0 0 28 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M0.41 10.3847C1.14777..."
                    fill="currentColor"
                  />
                </svg>
              </a>
            </div>

            <div className="hidden md:block">
              <nav aria-label="Global">
                <ul className="flex items-center gap-6 text-sm">
                  {['About', 'Careers', 'History', 'Services', 'Projects', 'Blog'].map((item) => (
                    <li key={item}>
                      <a
                        href="#"
                        className="text-gray-500 transition hover:text-gray-500/75 dark:text-white dark:hover:text-white/75"
                      >
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            <div className="flex items-center gap-4">
              <div className="sm:flex sm:gap-4">
                <a
                  className="rounded-md bg-teal-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm dark:hover:bg-teal-500"
                  href="#"
                >
                  Login
                </a>
                <div className="hidden sm:flex">
                  <a
                    className="rounded-md bg-gray-100 px-5 py-2.5 text-sm font-medium text-teal-600 dark:bg-gray-800 dark:text-white dark:hover:text-white/75"
                    href="#"
                  >
                    Register
                  </a>
                </div>
              </div>
              <div className="block md:hidden">
                <button className="rounded-sm bg-gray-100 p-2 text-gray-600 transition hover:text-gray-600/75 dark:bg-gray-800 dark:text-white dark:hover:text-white/75">
                  <svg xmlns="http://www.w3.org/2000/svg" className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* FloatingNav (scroll-up navbar) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 z-50">
        <FloatingNav navItems={navItems} />
      </div>

      {/* Konten hero */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mt-32 mb-4"
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
        <ShinyText
          text="Kelola catatan harianmu dengan mudah, aman, dan menyenangkan."
          speed={4}
        />
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
    </section>
  );
}
