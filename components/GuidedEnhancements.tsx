
import React from 'react';
import { MoonIcon } from './icons/MoonIcon';
import { PaletteIcon } from './icons/PaletteIcon';
import { DollarSignIcon } from './icons/DollarSignIcon';
import { SmartphoneIcon } from './icons/SmartphoneIcon';
import { AnimationIcon } from './icons/AnimationIcon';
import { TypeIcon } from './icons/TypeIcon';
import { MailIcon } from './icons/MailIcon';
import { ImageIcon } from './icons/ImageIcon';
import { LayoutTemplateIcon } from './icons/LayoutTemplateIcon';
import { ColumnsIcon } from './icons/ColumnsIcon';


interface GuidedEnhancementsProps {
  onEnhance: (prompt: string) => void;
  isLoading: boolean;
}

const enhancementCategories = [
  {
    title: 'Appearance',
    suggestions: [
      {
        label: 'Implement Dark Mode',
        prompt: 'Implement a fully functional dark mode toggle button that switches between a light and dark theme. The themes should be aesthetically pleasing and have good contrast.',
        icon: MoonIcon,
      },
      {
        label: 'Change Theme to Blue',
        prompt: 'Change the primary color theme of the application to a modern blue palette. Update buttons, headers, and other key UI elements to use shades of blue.',
        icon: PaletteIcon,
      },
      {
        label: 'Add Animations',
        prompt: 'Add subtle animations to buttons and on-scroll reveals for sections to make the app feel more dynamic.',
        icon: AnimationIcon,
      },
      {
        label: 'Update Typography',
        prompt: 'Update the typography to use a more modern and readable font combination. Use a sans-serif font for body text and a slightly more stylized font for headings.',
        icon: TypeIcon,
      },
    ]
  },
  {
    title: 'Features',
    suggestions: [
      {
        label: 'Add a Pricing Section',
        prompt: 'Add a new section to the app that displays pricing plans. It should include three distinct tiers (e.g., Basic, Pro, Enterprise) with different features and prices.',
        icon: DollarSignIcon,
      },
      {
        label: 'Add a Contact Form',
        prompt: 'Add a new "Contact Us" section with a form that includes fields for Name, Email, and Message, along with a submit button.',
        icon: MailIcon,
      },
       {
        label: 'Add an Image Gallery',
        prompt: 'Create a new section that displays a responsive image gallery. Use placeholder images for now.',
        icon: ImageIcon,
      },
    ]
  },
   {
    title: 'Layout',
    suggestions: [
       {
        label: 'Improve Responsiveness',
        prompt: 'Make the application fully responsive for mobile, tablet, and desktop screens. Ensure all elements are well-aligned and usable on smaller viewports.',
        icon: SmartphoneIcon,
      },
      {
        label: 'Add a Footer',
        prompt: 'Add a footer to the application with columns for social media links and copyright information.',
        icon: LayoutTemplateIcon,
      },
      {
        label: 'Convert to 3 Columns',
        prompt: 'Change the main content area to a three-column layout.',
        icon: ColumnsIcon,
      },
    ]
  }
];

const SuggestionButton: React.FC<{
    suggestion: typeof enhancementCategories[0]['suggestions'][0];
    onClick: () => void;
    disabled: boolean;
}> = ({ suggestion, onClick, disabled }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className="flex flex-col items-center justify-center text-center p-3 bg-brand-surface border border-brand-border rounded-md hover:border-brand-green/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-brand-surface disabled:hover:border-brand-border"
    >
        <suggestion.icon className="w-5 h-5 mb-2 text-brand-green" />
        <span className="text-xs font-medium text-gray-300">{suggestion.label}</span>
    </button>
);


const GuidedEnhancements: React.FC<GuidedEnhancementsProps> = ({ onEnhance, isLoading }) => {
  return (
    <div>
      <h3 className="text-lg font-medium text-gray-200 font-mono">Guided Enhancements</h3>
      <div className="space-y-4 mt-2">
        {enhancementCategories.map((category) => (
            <div key={category.title}>
                <h4 className="text-sm font-semibold text-gray-400 mb-2 font-mono">{category.title}</h4>
                <div className="grid grid-cols-2 gap-3">
                    {category.suggestions.map((suggestion) => (
                        <SuggestionButton 
                            key={suggestion.label}
                            suggestion={suggestion}
                            onClick={() => onEnhance(suggestion.prompt)}
                            disabled={isLoading}
                        />
                    ))}
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};

export default GuidedEnhancements;