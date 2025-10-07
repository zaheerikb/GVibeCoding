
import React, { useState } from 'react';
import type { Commit, GeneratedCode } from '../types';
import { GitCommitIcon } from './icons/GitCommitIcon';
import { HistoryIcon } from './icons/HistoryIcon';
import { WorkspaceIcon } from './icons/WorkspaceIcon';

interface VersionControlProps {
  commits: Commit[];
  generatedCode: GeneratedCode | null;
  selectedCommitId: string | null;
  onCommit: (message: string) => void;
  onSelectCommit: (commitId: string | null) => void;
}

const VersionControl: React.FC<VersionControlProps> = ({
  commits,
  generatedCode,
  selectedCommitId,
  onCommit,
  onSelectCommit,
}) => {
  const [commitMessage, setCommitMessage] = useState('');

  const handleCommit = () => {
    if (commitMessage.trim()) {
      onCommit(commitMessage.trim());
      setCommitMessage('');
    }
  };

  const isWorkspaceView = selectedCommitId === null;

  return (
    <div className="flex flex-col h-full">
      {/* Commit Section */}
      {generatedCode && isWorkspaceView && (
        <div className="mb-4">
          <label htmlFor="commit-message" className="text-lg font-medium text-gray-200 font-mono">
            Commit Changes
          </label>
          <div className="mt-2 flex space-x-2">
            <input
              id="commit-message"
              type="text"
              value={commitMessage}
              onChange={(e) => setCommitMessage(e.target.value)}
              placeholder="e.g., Implement dark mode"
              className="flex-1 p-2 bg-brand-surface border border-brand-border rounded-md focus:ring-1 focus:ring-brand-green focus:border-brand-green focus:outline-none placeholder-gray-500"
            />
            <button
              onClick={handleCommit}
              disabled={!commitMessage.trim()}
              className="flex items-center justify-center px-4 py-2 bg-brand-green text-black font-bold rounded-md hover:opacity-90 disabled:bg-brand-border disabled:text-gray-400 disabled:cursor-not-allowed transition-opacity"
            >
              <GitCommitIcon className="w-5 h-5 mr-2" />
              Commit
            </button>
          </div>
        </div>
      )}

      {/* History Section */}
      <div className="flex-1 flex flex-col min-h-0">
        <h3 className="text-lg font-medium text-gray-200 flex items-center mb-2 font-mono">
          <HistoryIcon className="w-5 h-5 mr-2" />
          History
        </h3>

        {!isWorkspaceView && (
             <button
                onClick={() => onSelectCommit(null)}
                className="w-full flex items-center justify-center text-left px-3 py-2 rounded-md text-sm font-semibold mb-2 bg-brand-surface border border-brand-border text-brand-green hover:bg-brand-border"
              >
                <WorkspaceIcon className="w-4 h-4 mr-2" />
                Return to Workspace
             </button>
        )}

        <ul className="space-y-2 overflow-y-auto pr-1 flex-1">
          {commits.length > 0 ? (
            [...commits].reverse().map((commit) => (
              <li key={commit.id}>
                <button
                  onClick={() => onSelectCommit(commit.id)}
                  className={`w-full text-left p-3 rounded-md border transition-colors ${
                    selectedCommitId === commit.id
                      ? 'bg-brand-green/10 border-brand-green'
                      : 'bg-brand-surface border-brand-border hover:border-gray-700'
                  }`}
                >
                  <p className="font-semibold text-gray-100 truncate font-mono">{commit.message}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(commit.createdAt).toLocaleString()}
                  </p>
                </button>
              </li>
            ))
          ) : (
            <div className="flex items-center justify-center h-full">
                <p className="text-sm text-gray-500 text-center py-4">No commits yet.</p>
            </div>
          )}
        </ul>
      </div>
    </div>
  );
};

export default VersionControl;