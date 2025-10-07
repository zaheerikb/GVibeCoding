
import React from 'react';
import { LightbulbIcon } from './icons/LightbulbIcon';
import { SparklesIcon } from './icons/SparklesIcon';

interface AISuggestionsProps {
  suggestions: string[];
  onEnhance: (prompt: string) => void;
  isLoading: boolean;
}

const AISuggestions: React.FC<AISuggestionsProps> = ({ suggestions, onEnhance, isLoading }) => {
  if (!suggestions || suggestions.length === 0) {
    return null;
  }

  return (
    <div>
      <h3 className="text-lg font-medium text-gray-200 font-mono flex items-center">
        <LightbulbIcon className="w-5 h-5 mr-2 text-yellow-300" />
        AI-Suggested Next Steps
      </h3>
      <div className="space-y-2 mt-2">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => onEnhance(suggestion)}
            disabled={isLoading}
            className="w-full flex items-start text-left p-3 bg-brand-surface border border-brand-border rounded-md hover:border-brand-green/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <SparklesIcon className="w-4 h-4 mr-3 mt-1 flex-shrink-0 text-brand-green/70 group-hover:text-brand-green transition-colors" />
            <span className="text-sm text-gray-300 group-hover:text-gray-100 transition-colors">
              {suggestion}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default AISuggestions;
