"use client";
import React, { useState, useEffect } from "react";
import { HoveredLink, Menu, MenuItem, MobileMenu, MobileMenuItem, MobileSubmenu } from "@/components/ui/navigation-menu";
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
    <div className="relative w-full flex items-center justify-center">
      <div className="fixed top-4 left-6 z-50">
        <div className="flex items-center">
          <img 
            src="/logo.png" 
            alt="PilaRahan Logo" 
            className="h-10 w-10 mr-2"
          />
          <span className="text-emerald-800 dark:text-emerald-400 font-medium text-lg">PilaRahan</span>
        </div>
      </div>
      
      {/* Tombol hamburger untuk mobile */}
      {isMobile && (
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="fixed top-4 right-6 z-50 p-2 rounded-full bg-white/90 dark:bg-emerald-950/90 shadow-md"
        >
          {isMenuOpen ? (
            <X className="h-6 w-6 text-emerald-800 dark:text-emerald-400" />
          ) : (
            <MenuIcon className="h-6 w-6 text-emerald-800 dark:text-emerald-400" />
          )}
        </button>
      )}
      
      {/* Menu desktop */}
      {!isMobile && <Navbar className="top-2" />}
      
      {/* Menu mobile */}
      {isMobile && (
        <MobileMenu isOpen={isMenuOpen} setIsOpen={setIsMenuOpen}>
          <MobileMenuItem href="/" onClick={() => setIsMenuOpen(false)}>
            Home
          </MobileMenuItem>
          <MobileMenuItem href="/scan" onClick={() => setIsMenuOpen(false)}>
            Scan
          </MobileMenuItem>
          <MobileSubmenu title="Layanan">
            <MobileMenuItem href="/learning" onClick={() => setIsMenuOpen(false)}>
              Learning
            </MobileMenuItem>
            <MobileMenuItem href="/learning-center" onClick={() => setIsMenuOpen(false)}>
              Edukasi
            </MobileMenuItem>
          </MobileSubmenu>
          <MobileMenuItem href="/recycling-centers" onClick={() => setIsMenuOpen(false)}>
            Recycle center
          </MobileMenuItem>
          <MobileMenuItem href="/ai-chat" onClick={() => setIsMenuOpen(false)}>
            AI Assistant
          </MobileMenuItem>
        </MobileMenu>
      )}
    </div>
  );
}

function Navbar({ className }: { className?: string }) {
  const [active, setActive] = useState<string | null>(null);
  return (
    <div
      className={cn("fixed top-10 inset-x-0 max-w-2xl mx-auto z-50", className)}
    >
      <Menu setActive={setActive}>
        <div className="cursor-pointer">
          <a href="/" className="text-emerald-800 hover:text-emerald-600 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors font-medium">
            Home
          </a>
        </div>
        <div className="cursor-pointer">
          <a href="/scan" className="text-emerald-800 hover:text-emerald-600 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors font-medium">
            Scan
          </a>
        </div>
        <div className="cursor-pointer">
          <a href="/ai-chat" className="text-emerald-800 hover:text-emerald-600 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors font-medium">
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
          <a href="/recycling-centers" className="text-emerald-800 hover:text-emerald-600 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors font-medium">
            Recycle center
          </a>
        </div>
      </Menu>
    </div>
  );
}
