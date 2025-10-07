
import React from 'react';
import Header from './components/Header';
import PromptInput from './components/PromptInput';
import CodeDisplay from './components/CodeDisplay';
import LivePreview from './components/LivePreview';
import Loader from './components/Loader';
import ErrorModal from './components/ErrorModal';
import VersionControl from './components/VersionControl';
import EnhancementInput from './components/EnhancementInput';
import GuidedEnhancements from './components/GuidedEnhancements';
import AISuggestions from './components/AISuggestions';
import { useAppStore, useDisplayCode } from './store/appStore';
import { MagicWandIcon } from './components/icons/MagicWandIcon';

const App: React.FC = () => {
  // --- Get state from the store ---
  const {
    prompt,
    enhancementPrompt,
    commits,
    selectedCommitId,
    activeFile,
    isLoading,
    error,
    generatedCode,
    followUpSuggestions,
  } = useAppStore();

  // --- Get actions from the store ---
  const {
    setPrompt,
    setEnhancementPrompt,
    setActiveFile,
    setError,
    generateCode,
    enhanceCode,
    commitChanges,
    selectCommit,
    retry
  } = useAppStore();

  // --- Get derived state ---
  const displayCode = useDisplayCode();
  
  const handleRequestEnhancement = () => {
    enhanceCode(enhancementPrompt);
  };

  const handleSuggestionEnhancement = (suggestionPrompt: string) => {
    // Optionally show the prompt in the textarea before running
    setEnhancementPrompt(suggestionPrompt); 
    enhanceCode(suggestionPrompt);
  };

  return (
    <div className="flex flex-col h-screen text-gray-200 overflow-hidden">
      <Header />
      <main className="flex flex-1 overflow-hidden">
        <div className="flex flex-col w-1/3 max-w-md border-r border-brand-border bg-brand-bg/80 backdrop-blur-sm">
            <div className="p-4">
                <PromptInput
                    prompt={prompt}
                    setPrompt={setPrompt}
                    onGenerate={generateCode}
                    isLoading={isLoading}
                />
            </div>
            <div className="px-4">
              <div className="w-full h-px bg-brand-border"></div>
            </div>
            <div className="flex-1 p-4 flex flex-col min-h-0 overflow-y-auto">
                 <VersionControl
                    commits={commits}
                    generatedCode={generatedCode}
                    selectedCommitId={selectedCommitId}
                    onCommit={commitChanges}
                    onSelectCommit={selectCommit}
                />
                {generatedCode && !selectedCommitId && (
                  <>
                    <div className="w-full h-px bg-brand-border my-4"></div>
                    <div className="space-y-4">
                      {followUpSuggestions && followUpSuggestions.length > 0 && (
                        <AISuggestions
                          suggestions={followUpSuggestions}
                          onEnhance={handleSuggestionEnhancement}
                          isLoading={isLoading}
                        />
                      )}
                      <GuidedEnhancements
                        onEnhance={handleSuggestionEnhancement}
                        isLoading={isLoading}
                      />
                      <EnhancementInput
                        prompt={enhancementPrompt}
                        setPrompt={setEnhancementPrompt}
                        onEnhance={handleRequestEnhancement}
                        isLoading={isLoading}
                      />
                    </div>
                  </>
                )}
            </div>
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-px bg-brand-border">
          <div className="bg-brand-surface flex flex-col overflow-hidden">
            {isLoading ? (
              <Loader />
            ) : displayCode ? (
              <CodeDisplay
                files={displayCode.files}
                activeFile={activeFile}
                setActiveFile={setActiveFile}
              />
            ) : (
              <WelcomePlaceholder title="Code View" description="Generated source code will appear here." />
            )}
          </div>
          <div className="bg-brand-surface flex flex-col overflow-hidden">
            {isLoading ? (
               <Loader />
            ) : displayCode ? (
              <LivePreview htmlContent={displayCode.previewHtml} />
            ) : (
              <WelcomePlaceholder title="Live Preview" description="A live preview of your generated app will render here." />
            )}
          </div>
        </div>
      </main>

      {error && (
        <ErrorModal
          error={error}
          onClose={() => setError(null)}
          onRetry={retry}
        />
      )}
    </div>
  );
};

interface WelcomePlaceholderProps {
  title: string;
  description: string;
}

const WelcomePlaceholder: React.FC<WelcomePlaceholderProps> = ({ title, description }) => (
  <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-transparent">
      <div className="p-3 border border-brand-border rounded-full mb-4 bg-brand-surface">
          <MagicWandIcon className="w-8 h-8 text-brand-green" />
      </div>
      <h2 className="text-xl font-mono font-medium text-gray-200">{title}</h2>
      <p className="text-gray-400 mt-2">{description}</p>
  </div>
);

export default App;
