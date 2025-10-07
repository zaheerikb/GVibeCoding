
import React from 'react';

export const PaletteIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
    <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
    <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
    <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
    <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.477-1.122-.297-.287-.703-.465-1.17-.465-1.12 0-2.028-.912-2.028-2.042 0-.332.08-.654.23-.942.15-.288.38-.543.66-.75.28-.208.62-.323.98-.323.65 0 1.25.28 1.67.72.42.44.66.99.66 1.61 0 .61-.23 1.16-.62 1.56a2.46 2.46 0 0 1-1.61.62c-1.7 0-3.08-1.39-3.08-3.1 0-1.71 1.38-3.1 3.08-3.1 1.7 0 3.08 1.38 3.08 3.1 0 .85-.35 1.61-.91 2.16-.56.55-1.31.84-2.17.84-1.7 0-3.08-1.39-3.08-3.1 0-.85.35-1.61.91-2.16.56-.55 1.31-.84 2.17.84 1.7 0 3.08 1.38 3.08 3.1z" />
  </svg>
);
