
import React, { useState } from 'react';
import type { GeneratedCode } from './types';
import Header from './components/Header';
import PromptInput from './components/PromptInput';
import CodeDisplay from './components/CodeDisplay';
import LivePreview from './components/LivePreview';
import Loader from './components/Loader';
import { generateAppCode } from './services/geminiService';
import { MagicWandIcon } from './components/icons/MagicWandIcon';

const App: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [generatedCode, setGeneratedCode] = useState<GeneratedCode | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeFile, setActiveFile] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter an app idea.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedCode(null);
    setActiveFile(null);

    try {
      const result = await generateAppCode(prompt);
      setGeneratedCode(result);
      if (result.files && result.files.length > 0) {
        setActiveFile(result.files[0].name);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to generate code. The model may be unavailable or the request was filtered. Please try a different prompt.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-900 text-gray-200 overflow-hidden">
      <Header />
      <main className="flex flex-1 overflow-hidden">
        <div className="flex flex-col w-1/3 max-w-md p-4 border-r border-slate-700 space-y-4">
          <PromptInput
            prompt={prompt}
            setPrompt={setPrompt}
            onGenerate={handleGenerate}
            isLoading={isLoading}
          />
          {error && <div className="text-red-400 bg-red-900/50 p-3 rounded-md">{error}</div>}
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-px bg-slate-700">
          <div className="bg-slate-800 flex flex-col overflow-hidden">
            {isLoading ? (
              <Loader />
            ) : generatedCode ? (
              <CodeDisplay
                files={generatedCode.files}
                activeFile={activeFile}
                setActiveFile={setActiveFile}
              />
            ) : (
              <WelcomePlaceholder title="Code View" description="Generated source code will appear here." />
            )}
          </div>
          <div className="bg-slate-800 flex flex-col overflow-hidden">
            {isLoading ? (
               <Loader />
            ) : generatedCode ? (
              <LivePreview htmlContent={generatedCode.previewHtml} />
            ) : (
              <WelcomePlaceholder title="Live Preview" description="A live preview of your generated app will render here." />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

interface WelcomePlaceholderProps {
  title: string;
  description: string;
}

const WelcomePlaceholder: React.FC<WelcomePlaceholderProps> = ({ title, description }) => (
  <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-slate-800/50">
      <div className="p-4 bg-slate-700/50 rounded-full mb-4">
          <MagicWandIcon className="w-10 h-10 text-cyan-400" />
      </div>
      <h2 className="text-xl font-bold text-gray-200">{title}</h2>
      <p className="text-gray-400 mt-2">{description}</p>
  </div>
);

export default App;
