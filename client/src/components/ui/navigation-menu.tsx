"use client";
import React, { useState, useCallback, memo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu as MenuIcon, X, ChevronDown } from "lucide-react";

// Konstanta untuk transisi yang digunakan di beberapa komponen
const transition = {
  type: "spring",
  mass: 0.5,
  damping: 11.5,
  stiffness: 100,
  restDelta: 0.001,
  restSpeed: 0.001,
};

// Menggunakan memo untuk mencegah render ulang yang tidak perlu
export const MenuItem = memo(({
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
  // Menggunakan useCallback untuk fungsi event handler
  const handleMouseEnter = useCallback(() => {
    setActive(item);
  }, [setActive, item]);

  return (
    <div onMouseEnter={handleMouseEnter} className="relative">
      <motion.p
        transition={{ duration: 0.3 }}
        className="cursor-pointer font-medium text-emerald-800 hover:text-emerald-600 dark:text-emerald-400 dark:hover:text-emerald-300"
      >
        {item}
      </motion.p>
      <AnimatePresence>
        {active !== null && active === item && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 10 }}
            transition={transition}
          >
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

// Nama tampilan untuk debugging
MenuItem.displayName = "MenuItem";

// Menggunakan memo untuk Menu
export const Menu = memo(({
  setActive,
  children,
}: {
  setActive: (item: string | null) => void;
  children: React.ReactNode;
}) => {
  // Menggunakan useCallback untuk fungsi event handler
  const handleMouseLeave = useCallback(() => {
    setActive(null);
  }, [setActive]);

  return (
    <nav
      onMouseLeave={handleMouseLeave}
      className="relative rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-white/95 dark:bg-emerald-950/95 backdrop-blur-md shadow-lg shadow-emerald-100/30 dark:shadow-emerald-900/40 flex justify-center space-x-12 px-10 py-4 z-50"
    >
      {children}
    </nav>
  );
});

Menu.displayName = "Menu";

// Menggunakan memo untuk ProductItem
export const ProductItem = memo(({
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
        loading="lazy" // Menambahkan lazy loading untuk gambar
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
});

ProductItem.displayName = "ProductItem";

// Menggunakan memo untuk HoveredLink
export const HoveredLink = memo(({ children, ...rest }: any) => {
  return (
    <a
      {...rest}
      className="text-emerald-700 dark:text-emerald-300 hover:text-emerald-500 dark:hover:text-emerald-200 transition-colors font-medium"
    >
      {children}
    </a>
  );
});

HoveredLink.displayName = "HoveredLink";

// Komponen MobileMenu dengan optimasi
export const MobileMenu = memo(({
  isOpen,
  setIsOpen,
  children,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  children: React.ReactNode;
}) => {
  // Menggunakan useCallback untuk fungsi event handler
  const handleDragEnd = useCallback((event: any, info: any) => {
    if (info.offset.y > 50) {
      setIsOpen(false);
    }
  }, [setIsOpen]);

  const handleOverlayClick = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  return (
    <>
      <AnimatePresence>
        {/* Overlay latar belakang */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black z-40 border-4 border-emerald-500/30 backdrop-blur-sm"
            onClick={handleOverlayClick}
          />
        )}
      </AnimatePresence>
      
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
});

MobileMenu.displayName = "MobileMenu";

// Komponen MobileMenuItem dengan optimasi
export const MobileMenuItem = memo(({
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
        className="block py-4 border-b border-emerald-100 dark:border-emerald-800 text-emerald-800 dark:text-emerald-400 font-medium text-lg transition-colors hover:text-emerald-600 dark:hover:text-emerald-300"
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
});

MobileMenuItem.displayName = "MobileMenuItem";

// Komponen MobileSubmenu dengan optimasi
export const MobileSubmenu = memo(({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const handleToggle = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  return (
    <div className="border-b border-emerald-100 dark:border-emerald-800">
      <div 
        className="flex justify-between items-center py-4 text-emerald-800 dark:text-emerald-400 font-medium text-lg cursor-pointer transition-colors hover:text-emerald-600 dark:hover:text-emerald-300"
        onClick={handleToggle}
      >
        <span>{title}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="h-5 w-5" />
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
});

MobileSubmenu.displayName = "MobileSubmenu";