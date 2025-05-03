"use client";
import React, { useState, useEffect } from "react";
import {
  HoveredLink,
  Menu,
  MenuItem,
  MobileMenu,
  MobileMenuItem,
  MobileSubmenu,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { Menu as MenuIcon, X } from "lucide-react";
import { useMobile } from "@/hooks/use-mobile";

export function NavbarWrapper() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useMobile();

  // Menutup menu saat ukuran layar berubah dari mobile ke desktop
  useEffect(() => {
    if (!isMobile) {
      setIsMenuOpen(false);
    }
  }, [isMobile]);

  // Mencegah scrolling pada body saat menu mobile terbuka
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <>
      {/* Tampilan Mobile */}
      {isMobile && (
        <div className="fixed top-0 left-0 right-0 z-50 px-4 py-3">
          <div className="flex items-center justify-between w-full bg-white/90 dark:bg-emerald-950/90 backdrop-blur-md rounded-full border border-emerald-200 dark:border-emerald-800 shadow-lg shadow-emerald-100/30 dark:shadow-emerald-900/40 px-4 py-2 transition-all duration-300 hover:shadow-emerald-200/50 dark:hover:shadow-emerald-800/60">
            {/* Logo */}
            <a href="/" className="flex items-center group">
              <div className="relative overflow-hidden rounded-full p-1 bg-gradient-to-r from-emerald-100 to-emerald-50 dark:from-emerald-900 dark:to-emerald-800 transition-transform duration-300 group-hover:scale-105">
                <img
                  src="/src/data/picture/Pilarahan.png"
                  alt="PilaRahan Logo"
                  className="h-8 w-8"
                />
              </div>
              <span className="ml-2 text-emerald-800 dark:text-emerald-400 font-medium text-lg transition-colors duration-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-300">
                PilaRahan
              </span>
            </a>
            
            {/* Hamburger Menu Button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="p-2 rounded-full bg-emerald-50 dark:bg-emerald-900 hover:bg-emerald-100 dark:hover:bg-emerald-800 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-sm"
              aria-label="Menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6 text-emerald-800 dark:text-emerald-400" />
              ) : (
                <MenuIcon className="h-6 w-6 text-emerald-800 dark:text-emerald-400" />
              )}
            </button>
          </div>
          
          {/* Menu mobile */}
          <MobileMenu isOpen={isMenuOpen} setIsOpen={setIsMenuOpen}>
            <MobileMenuItem href="/" onClick={() => setIsMenuOpen(false)}>
              Home
            </MobileMenuItem>
            <MobileMenuItem href="/scan" onClick={() => setIsMenuOpen(false)}>
              Scan
            </MobileMenuItem>
            <MobileSubmenu title="Layanan">
              <MobileMenuItem
                href="/learning"
                onClick={() => setIsMenuOpen(false)}
              >
                Learning
              </MobileMenuItem>
              <MobileMenuItem
                href="/learning-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Edukasi
              </MobileMenuItem>
            </MobileSubmenu>
            <MobileMenuItem
              href="/recycling-centers"
              onClick={() => setIsMenuOpen(false)}
            >
              Recycle center
            </MobileMenuItem>
            <MobileMenuItem href="/ai-chat" onClick={() => setIsMenuOpen(false)}>
              AI Assistant
            </MobileMenuItem>
          </MobileMenu>
        </div>
      )}

      {/* Tampilan Desktop */}
      {!isMobile && (
        <div className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
          {/* Logo untuk desktop - posisi absolute */}
          <div className="absolute top-4 left-6 z-50">
            <a href="/" className="flex items-center group">
              <div className="relative overflow-hidden rounded-full p-1.5 bg-gradient-to-r from-emerald-100 to-emerald-50 dark:from-emerald-900 dark:to-emerald-800 transition-transform duration-300 group-hover:scale-105 shadow-md">
                <img
                  src="/src/data/picture/Pilarahan.png"
                  alt="PilaRahan Logo"
                  className="h-10 w-10"
                />
              </div>
              <span className="ml-3 text-emerald-800 dark:text-emerald-400 font-medium text-xl transition-colors duration-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-300">
                PilaRahan
              </span>
            </a>
          </div>
          
          {/* Menu desktop - posisi tengah */}
          <div className="flex justify-center">
            <DesktopNavbar />
          </div>
        </div>
      )}
    </>
  );
}

// Komponen navbar desktop yang dipisahkan
function DesktopNavbar() {
  const [active, setActive] = useState<string | null>(null);
  
  return (
    <div className="z-50">
      <Menu setActive={setActive}>
        <div className="cursor-pointer">
          <a
            href="/"
            className="text-emerald-800 hover:text-emerald-600 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors font-medium"
          >
            Home
          </a>
        </div>
        <div className="cursor-pointer">
          <a
            href="/scan"
            className="text-emerald-800 hover:text-emerald-600 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors font-medium"
          >
            Scan
          </a>
        </div>
        <div className="cursor-pointer">
          <a
            href="/ai-chat"
            className="text-emerald-800 hover:text-emerald-600 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors font-medium"
          >
            AI Assistant
          </a>
        </div>
        <MenuItem setActive={setActive} active={active} item="Layanan">
          <div className="flex flex-col space-y-4 text-sm">
            <HoveredLink href="/learning">Learning</HoveredLink>
            <HoveredLink href="/learning-center">Edukasi</HoveredLink>
          </div>
        </MenuItem>
        <div className="cursor-pointer">
          <a
            href="/recycling-centers"
            className="text-emerald-800 hover:text-emerald-600 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors font-medium"
          >
            Recycle center
          </a>
        </div>
      </Menu>
    </div>
  );
}