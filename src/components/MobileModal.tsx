import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';

interface MobileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export default function MobileModal({ open, onOpenChange, children, title, description }: MobileModalProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (open && isMobile) {
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [open, isMobile]);

  if (!mounted || !isMobile || !open) {
    return null;
  }

  const modal = (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60]"
        onClick={() => onOpenChange(false)}
      />
      
      {/* Modal Content */}
      <div className="fixed inset-0 z-[70] flex flex-col">
        {/* Account for mobile navbar */}
        <div 
          className="flex-1 bg-white mt-[var(--mobile-navbar-height)] overflow-hidden"
          style={{
            marginTop: `calc(60px + env(safe-area-inset-top, 0px))`,
            height: `calc(100vh - 60px - env(safe-area-inset-top, 0px))`
          }}
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
            <div className="flex-1">
              {title && (
                <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
              )}
              {description && (
                <p className="text-sm text-gray-500 mt-1">{description}</p>
              )}
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="ml-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          
          {/* Modal Body - Scrollable */}
          <div className="flex-1 overflow-y-auto p-6">
            {children}
          </div>
        </div>
      </div>
    </>
  );

  return createPortal(modal, document.body);
}