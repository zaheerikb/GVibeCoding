import React, { useState, useEffect, useRef } from 'react';
import { EyeIcon } from './icons/EyeIcon';
import { ReloadIcon } from './icons/ReloadIcon';
import { DesktopIcon } from './icons/DesktopIcon';
import { TabletIcon } from './icons/TabletIcon';
import { MobileIcon } from './icons/MobileIcon';

interface LivePreviewProps {
  htmlContent: string;
}

type Device = 'desktop' | 'tablet' | 'mobile';

const deviceConfig = {
    desktop: {
        classes: 'w-full h-full bg-white',
        icon: DesktopIcon,
        label: 'Desktop'
    },
    tablet: {
        classes: 'w-[768px] h-[1024px] max-w-full max-h-full bg-white rounded-[24px] border-8 border-slate-800 shadow-2xl overflow-hidden',
        icon: TabletIcon,
        label: 'Tablet'
    },
    mobile: {
        classes: 'w-[375px] h-[667px] max-w-full max-h-full bg-white rounded-[24px] border-8 border-slate-800 shadow-2xl overflow-hidden',
        icon: MobileIcon,
        label: 'Mobile'
    },
}

const LivePreview: React.FC<LivePreviewProps> = ({ htmlContent }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isReloading, setIsReloading] = useState(true);
  const [device, setDevice] = useState<Device>('desktop');
  const displayedContentRef = useRef(htmlContent);

  useEffect(() => {
    if (htmlContent && htmlContent !== displayedContentRef.current) {
      handleReload();
    } else if (!htmlContent) {
        setIsReloading(false);
    }
  }, [htmlContent]);

  const handleIframeLoad = () => {
    setIsReloading(false);
    displayedContentRef.current = htmlContent;
  };

  const handleReload = () => {
    if (iframeRef.current) {
        setIsReloading(true);
        iframeRef.current.srcdoc = 'about:blank'; // Clear first
        setTimeout(() => {
            if(iframeRef.current) {
                iframeRef.current.srcdoc = htmlContent;
            }
        }, 50); // Small delay to ensure it reloads
    }
  };

  return (
    <div className="flex flex-col h-full bg-brand-surface">
      <div className="flex items-center justify-between p-2 bg-brand-surface border-b border-brand-border text-sm text-gray-300">
        <div className="flex items-center font-mono">
            <EyeIcon className="w-5 h-5 mr-2 text-gray-400" />
            <h2 className="font-medium">Live Preview</h2>
        </div>
        <div className="flex items-center space-x-4">
            {/* Device Toggles */}
            <div className="flex items-center rounded-md bg-brand-border/50 p-1">
                 {(Object.keys(deviceConfig) as Device[]).map((key) => {
                    const Icon = deviceConfig[key].icon;
                    return (
                        <button 
                            key={key}
                            onClick={() => setDevice(key)}
                            className={`p-1.5 rounded-md transition-colors ${device === key ? 'bg-brand-green/20 text-brand-green' : 'text-gray-400 hover:bg-brand-border'}`}
                            aria-label={`Switch to ${deviceConfig[key].label} view`}
                            title={`Switch to ${deviceConfig[key].label} view`}
                        >
                            <Icon className="w-4 h-4" />
                        </button>
                    )
                 })}
            </div>

            <button onClick={handleReload} className="p-1.5 rounded-md hover:bg-brand-border transition-colors" aria-label="Reload Preview" title="Reload Preview">
                <ReloadIcon className="w-4 h-4 text-gray-400" />
            </button>
        </div>
      </div>
      <div className="flex-1 bg-brand-bg flex items-center justify-center p-4 overflow-auto">
        <div className={`relative transition-all duration-300 ease-in-out ${deviceConfig[device].classes}`}>
            {/* Loading overlay for a smooth "hot-reload" effect */}
            <div
                aria-hidden="true"
                className={`absolute inset-0 bg-white flex items-center justify-center transition-opacity duration-200 ease-in-out z-10 ${
                isReloading ? 'opacity-100' : 'opacity-0 pointer-events-none'
                } ${device !== 'desktop' ? 'rounded-[16px]' : ''}`}
            >
                <div className="w-8 h-8 border-4 border-slate-300 border-t-brand-green rounded-full animate-spin"></div>
            </div>

            <iframe
                ref={iframeRef}
                srcDoc={displayedContentRef.current} // Set initial content
                onLoad={handleIframeLoad}
                title="Live Preview"
                sandbox="allow-scripts allow-modals"
                className={`w-full h-full border-none ${device !== 'desktop' ? 'rounded-[16px]' : ''}`}
            />
        </div>
      </div>
    </div>
  );
};

export default LivePreview;