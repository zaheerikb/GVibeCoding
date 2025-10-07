import React, { useState, useMemo, useEffect } from 'react';
import type { CodeFile } from '../types';
import JSZip from 'jszip';
import { CodeIcon } from './icons/CodeIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import { FolderIcon } from './icons/FolderIcon';
import { FileIcon } from './icons/FileIcon';
import { ChevronRightIcon } from './icons/ChevronRightIcon';

interface CodeDisplayProps {
  files: CodeFile[];
  activeFile: string | null;
  setActiveFile: (fileName: string) => void;
}

// --- File Tree Types ---
interface FileTree {
  [key: string]: FileTreeNode;
}

interface FileTreeNode {
  isFile: boolean;
  children?: FileTree;
}

// --- Helper to build tree from flat file list ---
const buildFileTree = (files: CodeFile[]): FileTree => {
  const root: FileTree = {};
  for (const file of files) {
    const parts = file.name.split('/');
    let node = root;
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const isLastPart = i === parts.length - 1;

      if (!node[part]) {
        node[part] = {
          isFile: isLastPart,
          ...(isLastPart ? {} : { children: {} }),
        };
      }
      if (!isLastPart) {
        node = node[part].children!;
      }
    }
  }
  return root;
};


interface FileTreeViewProps {
  tree: FileTree;
  activeFile: string | null;
  onFileClick: (path: string) => void;
  expandedFolders: Set<string>;
  onToggleFolder: (path: string) => void;
  pathPrefix?: string;
  level?: number;
}

// --- Recursive Tree Rendering Component ---
const FileTreeView: React.FC<FileTreeViewProps> = ({ 
  tree, 
  activeFile, 
  onFileClick,
  expandedFolders,
  onToggleFolder,
  pathPrefix = '',
  level = 0
}) => {
    const sortedKeys = Object.keys(tree).sort((a, b) => {
        const nodeA = tree[a];
        const nodeB = tree[b];
        if (nodeA.isFile !== nodeB.isFile) {
            return nodeA.isFile ? 1 : -1; // folders first
        }
        return a.localeCompare(b); // then sort by name
    });

  return (
    <ul className="space-y-1">
      {sortedKeys.map(name => {
        const node = tree[name];
        const currentPath = pathPrefix ? `${pathPrefix}/${name}` : name;
        
        if (node.isFile) {
          return (
             <li key={currentPath} style={{ paddingLeft: `${level * 1.25}rem` }}>
              <button
                onClick={() => onFileClick(currentPath)}
                className={`w-full flex items-center text-left px-2 py-1.5 rounded-md text-sm truncate font-mono ${
                  activeFile === currentPath
                    ? 'bg-brand-green/10 text-brand-green'
                    : 'text-gray-400 hover:bg-brand-border'
                }`}
              >
                <FileIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                <span>{name}</span>
              </button>
            </li>
          );
        } else {
            const isExpanded = expandedFolders.has(currentPath);
            return (
                <li key={currentPath}>
                    <button
                        onClick={() => onToggleFolder(currentPath)}
                        className="w-full flex items-center text-left px-2 py-1.5 rounded-md text-sm text-gray-300 hover:bg-brand-border font-mono"
                        style={{ paddingLeft: `${level * 1.25}rem` }}
                    >
                        <ChevronRightIcon className={`w-4 h-4 mr-1 flex-shrink-0 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                        <FolderIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span>{name}</span>
                    </button>
                    {isExpanded && node.children && (
                        <FileTreeView 
                            tree={node.children}
                            level={level + 1}
                            pathPrefix={currentPath}
                            activeFile={activeFile}
                            onFileClick={onFileClick}
                            expandedFolders={expandedFolders}
                            onToggleFolder={onToggleFolder}
                        />
                    )}
                </li>
            );
        }
      })}
    </ul>
  );
};


const CodeDisplay: React.FC<CodeDisplayProps> = ({ files, activeFile, setActiveFile }) => {
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');
  const [isExporting, setIsExporting] = useState(false);
  const fileToDisplay = files.find(f => f.name === activeFile);

  const fileTree = useMemo(() => buildFileTree(files), [files]);
  const [expandedFolders, setExpandedFolders] = useState(new Set<string>());

  useEffect(() => {
    // Automatically expand the first level of folders
    // FIX: Replaced Object.entries with Object.keys to avoid a TypeScript type inference issue on line 146.
    // This correctly identifies folders by checking the 'isFile' property on the file tree node.
    const rootFolders = Object.keys(fileTree)
        .filter((name) => !fileTree[name].isFile);
    setExpandedFolders(new Set(rootFolders));
  }, [fileTree]);


  const handleToggleFolder = (path: string) => {
    setExpandedFolders(prev => {
        const newSet = new Set(prev);
        if (newSet.has(path)) {
            // Also collapse all children
            prev.forEach(p => {
                if(p.startsWith(`${path}/`)) {
                    newSet.delete(p);
                }
            });
            newSet.delete(path);
        } else {
            newSet.add(path);
        }
        return newSet;
    });
  };

  const handleCopy = () => {
    if (fileToDisplay?.content) {
      navigator.clipboard.writeText(fileToDisplay.content);
      setCopyStatus('copied');
      setTimeout(() => setCopyStatus('idle'), 2000);
    }
  };

  const handleExportZip = async () => {
    if (!files || files.length === 0) return;
    setIsExporting(true);
    try {
      const zip = new JSZip();
      files.forEach(file => {
        zip.file(file.name, file.content);
      });
      const blob = await zip.generateAsync({ type: 'blob' });

      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'ai-generated-app.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);

    } catch (error) {
        console.error("Failed to export zip:", error);
    } finally {
        setIsExporting(false);
    }
  };

  return (
    <div className="flex h-full">
      <aside className="w-64 bg-brand-surface border-r border-brand-border p-2 overflow-y-auto">
        <h3 className="text-sm font-semibold text-gray-400 mb-2 px-2 font-mono">Files</h3>
        <FileTreeView 
            tree={fileTree}
            activeFile={activeFile}
            onFileClick={setActiveFile}
            expandedFolders={expandedFolders}
            onToggleFolder={handleToggleFolder}
        />
      </aside>
      <main className="flex-1 flex flex-col bg-brand-bg overflow-hidden">
        <div className="flex items-center justify-between p-2 bg-brand-surface border-b border-brand-border">
           <div className="flex items-center text-gray-300">
                <CodeIcon className="w-5 h-5 mr-2 text-gray-400" />
                <span className="font-mono text-sm">{activeFile || 'Select a file'}</span>
           </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleExportZip}
              disabled={isExporting || files.length === 0}
              className="flex items-center px-3 py-1 text-xs bg-brand-border hover:bg-brand-border/80 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <DownloadIcon className="w-3 h-3 mr-1.5" />
              {isExporting ? 'Exporting...' : 'Export ZIP'}
            </button>
            {fileToDisplay && (
              <button
                  onClick={handleCopy}
                  className="px-3 py-1 text-xs bg-brand-border hover:bg-brand-border/80 rounded-md transition-colors w-16 text-center"
              >
                {copyStatus === 'idle' ? 'Copy' : 'Copied!'}
              </button>
            )}
          </div>
        </div>
        <div className="flex-1 overflow-auto p-4">
          {fileToDisplay ? (
            <pre className="text-sm">
              <code>{fileToDisplay.content}</code>
            </pre>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500 font-mono">
                Select a file to view its content.
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CodeDisplay;