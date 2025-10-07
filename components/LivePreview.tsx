
import React from 'react';
import { EyeIcon } from './icons/EyeIcon';

interface LivePreviewProps {
  htmlContent: string;
}

const LivePreview: React.FC<LivePreviewProps> = ({ htmlContent }) => {
  return (
    <div className="flex flex-col h-full bg-slate-800">
      <div className="flex items-center p-2 bg-slate-800 border-b border-slate-700">
        <EyeIcon className="w-5 h-5 mr-2 text-gray-400" />
        <h2 className="text-sm font-semibold text-gray-300">Live Preview</h2>
      </div>
      <div className="flex-1 bg-white">
        <iframe
          srcDoc={htmlContent}
          title="Live Preview"
          sandbox="allow-scripts allow-modals"
          className="w-full h-full border-none"
        />
      </div>
    </div>
  );
};

export default LivePreview;
