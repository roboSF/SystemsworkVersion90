import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Menu, X, Plus, Edit, Copy, Split, Trash2, List, Grid3x3, Check, Settings, User, LogOut, Sun, Moon, Monitor, Cog, FileText, PanelRightOpen, PanelRightClose, ChevronRight } from "lucide-react";
import MobileNavbar from "./MobileNavbar";

type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | 'full';

interface ResponsiveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  variant?: 'default' | 'bottom-sheet';
  size?: ModalSize;
  fullscreen?: boolean;
  onBackClick?: () => void;
  showMobileNavbar?: boolean;
  pageTitle?: string;
  themeMode?: 'light' | 'dark' | 'system';
  handleThemeModeClick?: () => void;
  getThemeIcon?: () => React.ReactNode;
  currentRow?: number;
  totalRows?: number;
}

const sizeClasses: Record<ModalSize, string> = {
  'sm': 'sm:max-w-sm',      // 384px
  'md': 'sm:max-w-md',      // 448px  
  'lg': 'sm:max-w-lg',      // 512px
  'xl': 'sm:max-w-xl',      // 576px
  '2xl': 'sm:max-w-2xl',    // 672px
  '3xl': 'sm:max-w-3xl',    // 768px
  '4xl': 'sm:max-w-4xl',    // 896px
  '5xl': 'sm:max-w-5xl',    // 1024px
  '6xl': 'sm:max-w-6xl',    // 1152px
  '7xl': 'sm:max-w-7xl',    // 1280px
  'full': 'sm:max-w-[90vw]', // 90% of viewport width
};

export default function ResponsiveDialog({
  open,
  onOpenChange,
  title,
  children,
  footer,
  className = "",
  variant = 'default',
  size = 'lg',
  fullscreen = false,
  onBackClick,
  showMobileNavbar,
  pageTitle,
  themeMode,
  handleThemeModeClick,
  getThemeIcon,
  currentRow,
  totalRows
}: ResponsiveDialogProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // For mobile, render custom fullscreen modal
  if (isMobile || fullscreen) {
    if (!open) return null;

    return (
      <div className="fixed inset-0 z-[70]">
        {/* Overlay */}
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          onClick={() => onOpenChange(false)}
        />
        
        {/* Modal Content */}
        <div 
          className={`fixed flex flex-col ${fullscreen ? 'bg-black' : 'bg-background'}`}
          style={{
            top: fullscreen ? '0' : showMobileNavbar ? '0' : '60px',
            bottom: '0',
            left: '0',
            right: '0',
            width: '100vw',
            height: fullscreen ? '100vh' : showMobileNavbar ? '100vh' : 'calc(100vh - 60px)',
            maxHeight: fullscreen ? '100vh' : showMobileNavbar ? '100vh' : 'calc(100vh - 60px)',
            margin: '0',
            padding: '0',
            borderRadius: '0',
            transform: 'none',
            position: 'fixed',
            zIndex: 71,
            paddingBottom: footer ? 'env(safe-area-inset-bottom)' : '0'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Mobile Navbar - Show if showMobileNavbar prop is true */}
          {showMobileNavbar && onBackClick && (
            <MobileNavbar 
              showBackButton={true}
              onBackClick={onBackClick}
              pageTitle={pageTitle || title}
              formId=""
              formType=""
              themeMode={themeMode || 'system'}
              handleThemeModeClick={handleThemeModeClick || (() => {})}
              getThemeIcon={getThemeIcon || (() => null)}
              currentRow={currentRow}
              totalRows={totalRows}
              insideModal={true}
            />
          )}
          
          {/* Header - Only show if not using MobileNavbar */}
          {!showMobileNavbar && (
            <div className="responsive-dialog-header px-4 ">
                <div className="flex justify-between py-4 border-b border-border">
                  <h2 className="text-lg font-semibold text-foreground">
                    {title}
                  </h2>
                    <button
                  onClick={() => onOpenChange(false)}
                  className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-sidebar-accent p-2"
                >
                  <X className="size-4" />
                </button>
                </div>
            </div>
          )}

          {/* Content */}
          <div 
            className={fullscreen ? "flex-1 overflow-hidden" : "flex-1 overflow-y-auto bg-background [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"} 
            style={{ 
              overscrollBehavior: 'none',
              paddingBottom: footer ? '80px' : '0', // Add space for fixed footer
              paddingTop: fullscreen ? '0' : undefined, // No top padding in fullscreen
              margin: fullscreen ? '0' : undefined // No margin in fullscreen
            }}
          >
            <div className={fullscreen ? "" : `p-4 pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] pt-4 ${footer ? 'pb-4' : 'pb-4'}`}>
              {children}
            </div>
          </div>

          {/* Footer */}
          {footer && (
            <div 
              className="fixed bottom-0 left-0 right-0 border-t border-border bg-background z-50"
            >
              <div 
                className="p-4 flex justify-between items-center w-full gap-3 [&>*]:flex-1"
                style={{
                  paddingBottom: 'max(1rem, env(safe-area-inset-bottom))',
                  paddingLeft: 'max(1rem, env(safe-area-inset-left))',
                  paddingRight: 'max(1rem, env(safe-area-inset-right))'
                }}
              >
                {footer}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // For desktop, use regular Dialog with size classes
  const sizeClass = sizeClasses[size];
  const combinedClassName = `${sizeClass} ${className}`.trim();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={combinedClassName} aria-describedby={undefined}>
        <DialogHeader className="responsive-dialog-header border-b border-border pb-4">
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          {children}
        </div>
        
        {footer && (
          <DialogFooter>
            {footer}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}