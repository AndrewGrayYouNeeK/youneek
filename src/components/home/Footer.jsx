import React from 'react';
import { Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 border-t border-white/10 py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-yellow-500 flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">YouNeeK</span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-white/50">
            <a href="#mission" className="hover:text-white transition-colors">Mission</a>
            <a href="#transparency" className="hover:text-white transition-colors">Transparency</a>
            <a href="#impact" className="hover:text-white transition-colors">Impact</a>
            <a href="#apply" className="hover:text-white transition-colors">Apply</a>
            <a href="#how-to-buy" className="hover:text-white transition-colors">Buy</a>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/10 text-center">
          <p className="text-white/40 text-sm">
            © {currentYear} YouNeeK. All rights reserved. Made with <Heart className="w-3 h-3 inline text-orange-400" /> for animals.
          </p>
          <p className="text-white/30 text-xs mt-2">
            Cryptocurrency investments carry risk. Do your own research before investing.
          </p>
        </div>
      </div>
    </footer>
  );
}