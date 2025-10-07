
import React from 'react';
import { MagicWandIcon } from './icons/MagicWandIcon';

const Header: React.FC = () => {
  return (
    <header className="flex items-center p-4 border-b border-brand-border bg-brand-bg/80 backdrop-blur-sm z-10 flex-shrink-0">
      <MagicWandIcon className="w-6 h-6 text-brand-green mr-3" />
      <h1 className="text-xl font-medium tracking-tight text-gray-100 font-mono">
        AI Vibe Coding Platform
      </h1>
    </header>
  );
};

export default Header;