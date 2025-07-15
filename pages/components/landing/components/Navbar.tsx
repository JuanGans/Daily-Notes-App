'use client';
import React from "react";
import InteractiveLogo from "../../InteractiveLogo/InteractiveLogo";

export default function Navbar() {
  return (
    <header className="bg-white dark:bg-gray-900 w-full z-50">
      <div className="flex items-center justify-between h-16 px-0">
        {/* Logo di pojok kiri */}
        <div className="pl-4 md:pl-8">
          <a href="#hero" className="block text-teal-600 dark:text-teal-600">
            <InteractiveLogo size="5px" className="h-10" isOpen={false} />
          </a>
        </div>

        {/* Tengah: Navigation Links */}
        <div className="hidden md:block">
          <nav>
            <ul className="flex items-center gap-6 text-sm">
              <li>
                <a
                  href="#hero"
                  className="text-gray-500 transition hover:text-gray-700 dark:text-white dark:hover:text-white/75"
                >
                  Beranda
                </a>
              </li>
              <li>
                <a
                  href="#features"
                  className="text-gray-500 transition hover:text-gray-700 dark:text-white dark:hover:text-white/75"
                >
                  Fitur
                </a>
              </li>
              <li>
                <a
                  href="#preview"
                  className="text-gray-500 transition hover:text-gray-700 dark:text-white dark:hover:text-white/75"
                >
                  Preview
                </a>
              </li>
            </ul>
          </nav>
        </div>

        {/* Kanan: Login/Register + Toggle */}
        <div className="flex items-center gap-4 pr-4 md:pr-8">
          <div className="sm:flex sm:gap-4">
            <a
              href="/auth/login"
              className="rounded-md bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm dark:hover:bg-purple-900"
            >
              Login
            </a>
            <div className="hidden sm:flex">
              <a
                href="/auth/register" 
                className="rounded-md bg-gray-100 px-5 py-2.5 text-sm font-medium text-teal-600 dark:bg-gray-800 dark:text-white dark:hover:text-white/75"
              >
                Register
              </a>
            </div>
          </div>

          <div className="block md:hidden">
            <button className="rounded-sm bg-gray-100 p-2 text-gray-600 dark:bg-gray-800 dark:text-white hover:text-gray-600/75">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
