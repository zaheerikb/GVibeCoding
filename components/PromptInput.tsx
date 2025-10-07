
import React from 'react';
import { MagicWandIcon } from './icons/MagicWandIcon';

interface PromptInputProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

const PromptInput: React.FC<PromptInputProps> = ({ prompt, setPrompt, onGenerate, isLoading }) => {
  return (
    <div className="flex flex-col space-y-4 flex-1">
      <label htmlFor="prompt-input" className="text-lg font-semibold text-gray-200">
        Describe your app idea
      </label>
      <textarea
        id="prompt-input"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="e.g., a modern-looking pomodoro timer with start, stop, and reset buttons."
        className="flex-1 p-3 bg-slate-800 border border-slate-600 rounded-md resize-none focus:ring-2 focus:ring-cyan-500 focus:outline-none placeholder-gray-500"
        rows={10}
      />
      <button
        onClick={onGenerate}
        disabled={isLoading}
        className="flex items-center justify-center px-6 py-3 bg-cyan-600 text-white font-bold rounded-md hover:bg-cyan-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-cyan-600/30 hover:shadow-cyan-500/50 disabled:shadow-none"
      >
        {isLoading ? (
          'Generating...'
        ) : (
          <>
            <MagicWandIcon className="w-5 h-5 mr-2" />
            Generate App
          </>
        )}
      </button>
    </div>
  );
};

export default PromptInput;
