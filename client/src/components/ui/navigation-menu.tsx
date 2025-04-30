"use client";
import React, { useState } from "react";
import { motion } from "motion/react";
import { Menu as MenuIcon, X } from "lucide-react";

const transition = {
  type: "spring",
  mass: 0.5,
  damping: 11.5,
  stiffness: 100,
  restDelta: 0.001,
  restSpeed: 0.001,
};

export const MenuItem = ({
  setActive,
  active,
  item,
  children,
}: {
  setActive: (item: string) => void;
  active: string | null;
  item: string;
  children?: React.ReactNode;
}) => {
  return (
    <div onMouseEnter={() => setActive(item)} className="relative">
      <motion.p
        transition={{ duration: 0.3 }}
        className="cursor-pointer font-medium text-emerald-800 hover:text-emerald-600 dark:text-emerald-400 dark:hover:text-emerald-300"
      >
        {item}
      </motion.p>
      {active !== null && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={transition}
        >
          {active === item && (
            <div className="absolute top-[calc(100%_+_1.2rem)] left-1/2 transform -translate-x-1/2 pt-4">
              <motion.div
                transition={transition}
                layoutId="active"
                className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-900 backdrop-blur-sm rounded-2xl overflow-hidden border border-emerald-200 dark:border-emerald-800 shadow-lg shadow-emerald-100/20 dark:shadow-emerald-900/30"
              >
                <motion.div
                  layout
                  className="w-max h-full p-4"
                >
                  {children}
                </motion.div>
              </motion.div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export const Menu = ({
  setActive,
  children,
}: {
  setActive: (item: string | null) => void;
  children: React.ReactNode;
}) => {
  return (
    <nav
      onMouseLeave={() => setActive(null)}
      className="relative rounded-full border border-emerald-200 dark:border-emerald-800 bg-white/90 dark:bg-emerald-950/90 backdrop-blur-sm shadow-md shadow-emerald-100/20 dark:shadow-emerald-900/30 flex justify-center space-x-6 px-8 py-4"
    >
      {children}
    </nav>
  );
};

export const ProductItem = ({
  title,
  description,
  href,
  src,
}: {
  title: string;
  description: string;
  href: string;
  src: string;
}) => {
  return (
    <a href={href} className="flex space-x-2 group">
      <img
        src={src}
        width={140}
        height={70}
        alt={title}
        className="shrink-0 rounded-md shadow-md transition-transform group-hover:scale-105"
      />
      <div>
        <h4 className="text-xl font-bold mb-1 text-emerald-800 dark:text-emerald-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition-colors">
          {title}
        </h4>
        <p className="text-emerald-700 text-sm max-w-[10rem] dark:text-emerald-300/80">
          {description}
        </p>
      </div>
    </a>
  );
};

export const HoveredLink = ({ children, ...rest }: any) => {
  return (
    <a
      {...rest}
      className="text-emerald-700 dark:text-emerald-300 hover:text-emerald-500 dark:hover:text-emerald-200 transition-colors font-medium"
    >
      {children}
    </a>
  );
};

// Komponen MobileMenu baru
export const MobileMenu = ({
  isOpen,
  setIsOpen,
  children,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  children: React.ReactNode;
}) => {
  // Fungsi untuk menangani swipe down
  const handleDragEnd = (event: any, info: any) => {
    if (info.offset.y > 50) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Overlay latar belakang */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Menu mobile yang muncul dari bawah */}
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: isOpen ? 0 : "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-emerald-950 rounded-t-3xl shadow-lg overflow-hidden"
      >
        {/* Indikator swipe */}
        <div className="w-full flex justify-center pt-2 pb-4">
          <div className="w-12 h-1.5 bg-gray-300 dark:bg-emerald-800 rounded-full" />
        </div>
        
        {/* Konten menu */}
        <div className="max-h-[80vh] overflow-y-auto px-6 pb-10">
          {children}
        </div>
      </motion.div>
    </>
  );
};

// Komponen MobileMenuItem untuk menu mobile
export const MobileMenuItem = ({
  href,
  children,
  onClick,
}: {
  href?: string;
  children: React.ReactNode;
  onClick?: () => void;
}) => {
  if (href) {
    return (
      <a
        href={href}
        className="block py-4 border-b border-emerald-100 dark:border-emerald-800 text-emerald-800 dark:text-emerald-400 font-medium text-lg"
        onClick={onClick}
      >
        {children}
      </a>
    );
  }
  
  return (
    <div className="py-4 border-b border-emerald-100 dark:border-emerald-800 text-emerald-800 dark:text-emerald-400 font-medium text-lg">
      {children}
    </div>
  );
};

// Komponen MobileSubmenu untuk submenu pada menu mobile
export const MobileSubmenu = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="border-b border-emerald-100 dark:border-emerald-800">
      <div 
        className="flex justify-between items-center py-4 text-emerald-800 dark:text-emerald-400 font-medium text-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{title}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </motion.div>
      </div>
      
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ 
          height: isOpen ? "auto" : 0,
          opacity: isOpen ? 1 : 0
        }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="pl-4 pb-2 space-y-3">
          {children}
        </div>
      </motion.div>
    </div>
  );
};
