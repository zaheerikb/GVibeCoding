import React, { useState, useEffect, useRef } from 'react';
import { MagicWandIcon } from './icons/MagicWandIcon';
import { MicrophoneIcon } from './icons/MicrophoneIcon';

// FIX: Add type definitions for the Web Speech API to resolve TypeScript errors.
// These interfaces describe the shape of the objects provided by the browser's SpeechRecognition API.
interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionResult {
  readonly isFinal: boolean;
  readonly [index: number]: SpeechRecognitionAlternative;
  readonly length: number;
}

interface SpeechRecognitionResultList {
  readonly [index: number]: SpeechRecognitionResult;
  readonly length: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  readonly error: string;
}

interface SpeechRecognitionEvent extends Event {
  readonly results: SpeechRecognitionResultList;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onend: () => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
}

// Type for the constructor of SpeechRecognition
type SpeechRecognitionConstructor = new () => SpeechRecognition;

// Augment the window object
declare global {
  interface Window {
    SpeechRecognition: SpeechRecognitionConstructor;
    webkitSpeechRecognition: SpeechRecognitionConstructor;
  }
}

interface PromptInputProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

const PromptInput: React.FC<PromptInputProps> = ({ prompt, setPrompt, onGenerate, isLoading }) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeechSupported, setIsSpeechSupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    // FIX: Use augmented window type to get SpeechRecognition without casting to any.
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setIsSpeechSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0])
          .map((result) => result.transcript)
          .join('');
        setPrompt(transcript);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognitionRef.current = recognition;

      return () => {
        recognitionRef.current?.stop();
      };
    } else {
      console.warn("Speech recognition not supported in this browser.");
    }
  }, [setPrompt]);

  const handleToggleListening = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };


  return (
    <div className="flex flex-col space-y-4">
      <label htmlFor="prompt-input" className="text-lg font-medium text-gray-200 font-mono">
        Describe your app idea
      </label>
      <div className="relative w-full">
        <textarea
          id="prompt-input"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., a modern-looking pomodoro timer with start, stop, and reset buttons."
          className="w-full p-3 pr-12 bg-brand-surface border border-brand-border rounded-md resize-none focus:ring-1 focus:ring-brand-green focus:border-brand-green focus:outline-none placeholder-gray-500"
          rows={10}
        />
        {isSpeechSupported && (
          <button
            onClick={handleToggleListening}
            title={isListening ? 'Stop Listening' : 'Use Voice Input'}
            className={`absolute bottom-3 right-3 p-2 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-surface ${
                isListening
                ? 'bg-red-500 text-white shadow-lg'
                : 'bg-brand-border hover:bg-brand-border/80 text-gray-400'
            }`}
          >
            {isListening && (
                <span className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75"></span>
            )}
            <MicrophoneIcon className="w-5 h-5 relative z-10" />
          </button>
        )}
      </div>
      <button
        onClick={onGenerate}
        disabled={isLoading}
        className="flex items-center justify-center px-6 py-3 bg-brand-green text-black font-bold rounded-md hover:opacity-90 disabled:bg-brand-border disabled:text-gray-400 disabled:cursor-not-allowed transition-all duration-300 disabled:shadow-none hover:shadow-glow-green"
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