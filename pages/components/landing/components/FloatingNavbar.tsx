"use client";
import React, { useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { cn } from "@/lib/utils";

export const FloatingNav = ({
  navItems,
  className,
}: {
  navItems: {
    name: string;
    link: string;
    icon?: React.ReactNode;
  }[];
  className?: string;
}) => {
  const { scrollYProgress } = useScroll();
  const [visible, setVisible] = useState(false);

  useMotionValueEvent(scrollYProgress, "change", (current: number) => {
    if (typeof current === "number") {
      const direction = current - scrollYProgress.getPrevious()!;
      if (scrollYProgress.get() < 0.05) {
        setVisible(false);
      } else {
        setVisible(direction < 0); // Muncul saat scroll ke atas
      }
    }
  });

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 1, y: -100 }}
        animate={{ y: visible ? 0 : -100, opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.25 }}
        className={cn(
          "fixed top-2 inset-x-0 mx-auto z-[9999] flex max-w-fit items-center justify-center space-x-4",
          "px-6 py-2 rounded-full bg-white/80 dark:bg-black/80 backdrop-blur shadow-md",
          className
        )}

      >
        {navItems.map((navItem, idx) => (
          <a
            key={`link-${idx}`}
            href={navItem.link}
            className={cn(
              "text-sm font-medium text-gray-700 dark:text-white hover:text-blue-500 dark:hover:text-blue-400 transition"
            )}
          >
            <span>{navItem.name}</span>
          </a>
        ))}
        <button
          onClick={() => window.location.href = "/auth/login"}
          className="relative border border-neutral-300 dark:border-white/30 text-sm text-black dark:text-white font-medium px-4 py-1.5 rounded-full"
        >
          Login
          <span className="absolute inset-x-0 w-1/2 mx-auto -bottom-px h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
};
