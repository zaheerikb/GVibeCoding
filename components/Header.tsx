
import React from 'react';
import { MagicWandIcon } from './icons/MagicWandIcon';

const Header: React.FC = () => {
  return (
    <header className="flex items-center p-4 border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
      <MagicWandIcon className="w-8 h-8 text-cyan-400 mr-3" />
      <h1 className="text-2xl font-bold tracking-tight text-gray-100">
        AI Vibe Coding Platform
      </h1>
    </header>
  );
};

export default Header;
