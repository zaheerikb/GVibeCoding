
import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-transparent">
      <div className="w-10 h-10 border-2 border-brand-green border-t-transparent rounded-full animate-spin mb-4"></div>
      <h2 className="text-xl font-bold text-gray-200 font-mono">Generating Your App...</h2>
      <p className="text-gray-400 mt-2">The AI is thinking. This might take a moment.</p>
    </div>
  );
};

export default Loader;