'use client';

import { useState } from 'react';
import { Toolbar } from './Toolbar';
import { Menu, X } from 'lucide-react';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="flex items-center justify-between px-4 py-2 gap-4">
        <h1 className="whitespace-nowrap">
          <a 
            href="https://roberthc.dev" 
            className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-mono text-sm font-bold"
          >
            $ roberthc.dev/json
          </a>
        </h1>
        
        {/* Hamburger button - visible on mobile */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Desktop toolbar - always visible on desktop */}
        <div className="hidden md:flex flex-1">
          <Toolbar />
        </div>
      </div>

      {/* Mobile toolbar - toggleable */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-700 p-2 bg-gray-50 dark:bg-gray-800">
          <Toolbar />
        </div>
      )}
    </header>
  );
}
