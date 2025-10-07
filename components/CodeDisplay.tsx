
import React, { useState } from 'react';
import type { CodeFile } from '../types';
import { CodeIcon } from './icons/CodeIcon';

interface CodeDisplayProps {
  files: CodeFile[];
  activeFile: string | null;
  setActiveFile: (fileName: string) => void;
}

const CodeDisplay: React.FC<CodeDisplayProps> = ({ files, activeFile, setActiveFile }) => {
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');
  const fileToDisplay = files.find(f => f.name === activeFile);

  const handleCopy = () => {
    if (fileToDisplay?.content) {
      navigator.clipboard.writeText(fileToDisplay.content);
      setCopyStatus('copied');
      setTimeout(() => setCopyStatus('idle'), 2000);
    }
  };

  return (
    <div className="flex h-full">
      <aside className="w-48 bg-slate-800 border-r border-slate-700 p-2 overflow-y-auto">
        <h3 className="text-sm font-semibold text-gray-400 mb-2 px-2">Files</h3>
        <ul>
          {files.map(file => (
            <li key={file.name}>
              <button
                onClick={() => setActiveFile(file.name)}
                className={`w-full text-left px-2 py-1.5 rounded-md text-sm truncate ${
                  activeFile === file.name
                    ? 'bg-cyan-500/20 text-cyan-300'
                    : 'text-gray-300 hover:bg-slate-700'
                }`}
              >
                {file.name}
              </button>
            </li>
          ))}
        </ul>
      </aside>
      <main className="flex-1 flex flex-col bg-gray-900 overflow-hidden">
        <div className="flex items-center justify-between p-2 bg-slate-800 border-b border-slate-700">
           <div className="flex items-center text-gray-300">
                <CodeIcon className="w-5 h-5 mr-2 text-gray-400" />
                <span className="font-mono text-sm">{activeFile || 'Select a file'}</span>
           </div>
          {fileToDisplay && (
            <button
                onClick={handleCopy}
                className="px-3 py-1 text-xs bg-slate-700 hover:bg-slate-600 rounded-md transition-colors"
            >
              {copyStatus === 'idle' ? 'Copy' : 'Copied!'}
            </button>
          )}
        </div>
        <div className="flex-1 overflow-auto p-4">
          {fileToDisplay ? (
            <pre className="text-sm">
              <code>{fileToDisplay.content}</code>
            </pre>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
                Select a file to view its content.
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CodeDisplay;
