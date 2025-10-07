
import React from 'react';

export const WorkspaceIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        {...props}
    >
        <path d="M12 22a7 7 0 0 0 7-7h-4a3 3 0 0 0-3-3v-4a3 3 0 0 0-3 3H5a7 7 0 0 0 7 7z" />
        <path d="M5 15V9a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v6" />
        <path d="M2 9h3" />
        <path d="M19 9h3" />
    </svg>
);
