
import React from 'react';
import { SparklesIcon } from './icons/SparklesIcon';

interface EnhancementInputProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  onEnhance: () => void;
  isLoading: boolean;
}

const EnhancementInput: React.FC<EnhancementInputProps> = ({ prompt, setPrompt, onEnhance, isLoading }) => {
  return (
    <div>
      <label htmlFor="enhancement-prompt" className="text-lg font-medium text-gray-200 font-mono">
        Or Type a Custom Request
      </label>
      <p className="text-sm text-gray-400 mt-1 mb-2">Describe a change or new feature to add to the current code.</p>
      <textarea
        id="enhancement-prompt"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="e.g., add a dark mode toggle button."
        className="w-full p-3 bg-brand-surface border border-brand-border rounded-md resize-none focus:ring-1 focus:ring-brand-green focus:border-brand-green focus:outline-none placeholder-gray-500"
        rows={4}
      />
      <button
        onClick={onEnhance}
        disabled={isLoading || !prompt.trim()}
        className="mt-2 w-full flex items-center justify-center px-6 py-3 bg-transparent text-brand-green border-2 border-brand-green font-bold rounded-md hover:bg-brand-green/10 disabled:border-brand-border disabled:text-gray-500 disabled:cursor-not-allowed transition-all duration-300 disabled:shadow-none hover:shadow-glow-green"
      >
        {isLoading ? (
          'Applying...'
        ) : (
          <>
            <SparklesIcon className="w-5 h-5 mr-2" />
            Apply Enhancement
          </>
        )}
      </button>
    </div>
  );
};

export default EnhancementInput;