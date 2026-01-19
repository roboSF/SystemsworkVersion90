import { useState, useEffect } from "react";
import { Toaster } from "sonner@2.0.3";
import FormsListPage from "./components/FormsListPage";
import AuthorizationPage from "./components/AuthorizationPage";
import EnhancedExpenseForm from "./components/EnhancedExpenseForm";
import FormCreationPage from "./components/FormCreationPage";
import MobilePushMenu from "./components/MobilePushMenu";
import SettingsPage from "./components/SettingsPage";
import { getDeviceCornerRadius } from "./utils/deviceRadius";

// Build cache buster - version 2.0.0 - force complete rebuild
type CurrentPage = 'list' | 'authorization' | 'detail' | 'create' | 'settings';
type ThemeMode = 'light' | 'dark' | 'system';

// Add a unique build identifier
const BUILD_VERSION = '2.0.0-clean-build';

export default function App() {
  const [currentPage, setCurrentPage] = useState<CurrentPage>('list');
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    // Initialize sidebar state based on screen size
    // Open by default on desktop (md breakpoint: 768px+), closed on mobile
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 768;
    }
    return true; // Default to open for SSR
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hasRadius, setHasRadius] = useState(false);
  const [createFormType, setCreateFormType] = useState<string>('');
  const [createFormNumber, setCreateFormNumber] = useState<string>('');
  
  // Register Service Worker for PWA
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      // Check if page is already loaded
      if (document.readyState === 'complete') {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('Service Worker registered successfully:', registration.scope);
          })
          .catch((error) => {
            console.log('Service Worker registration failed:', error);
          });
      } else {
        // Wait for load event
        window.addEventListener('load', () => {
          navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
              console.log('Service Worker registered successfully:', registration.scope);
            })
            .catch((error) => {
              console.log('Service Worker registration failed:', error);
            });
        });
      }
    }
  }, []);
  
  // Set device corner radius as CSS variable
  useEffect(() => {
    const radius = getDeviceCornerRadius();
    document.documentElement.style.setProperty('--device-radius', `${radius}px`);
  }, []);
  
  // Prevent page zoom on mobile (PWA-style behavior)
  useEffect(() => {
    let viewport = document.querySelector('meta[name="viewport"]');
    if (!viewport) {
      viewport = document.createElement('meta');
      viewport.setAttribute('name', 'viewport');
      document.head.appendChild(viewport);
    }
    viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover');
    
    // Set theme-color meta tag to black-translucent for transparent status bar
    let themeColor = document.querySelector('meta[name="theme-color"]');
    if (!themeColor) {
      themeColor = document.createElement('meta');
      themeColor.setAttribute('name', 'theme-color');
      document.head.appendChild(themeColor);
    }
    // Use black-translucent to make status bar transparent and allow content underneath
    themeColor.setAttribute('content', '#000000');
    
    // Set apple-mobile-web-app-capable to enable PWA mode on iOS
    let appleCapable = document.querySelector('meta[name="apple-mobile-web-app-capable"]');
    if (!appleCapable) {
      appleCapable = document.createElement('meta');
      appleCapable.setAttribute('name', 'apple-mobile-web-app-capable');
      document.head.appendChild(appleCapable);
    }
    appleCapable.setAttribute('content', 'yes');
    
    // Also set apple-mobile-web-app-status-bar-style for iOS
    let appleStatusBar = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
    if (!appleStatusBar) {
      appleStatusBar = document.createElement('meta');
      appleStatusBar.setAttribute('name', 'apple-mobile-web-app-status-bar-style');
      document.head.appendChild(appleStatusBar);
    }
    appleStatusBar.setAttribute('content', 'black-translucent');
    
    // Add manifest link for PWA
    let manifestLink = document.querySelector('link[rel="manifest"]');
    if (!manifestLink) {
      manifestLink = document.createElement('link');
      manifestLink.setAttribute('rel', 'manifest');
      manifestLink.setAttribute('href', '/manifest.json');
      document.head.appendChild(manifestLink);
    }
    
    // Lock screen orientation to portrait on mobile
    const lockOrientation = async () => {
      try {
        if (screen.orientation && screen.orientation.lock) {
          await screen.orientation.lock('portrait');
        }
      } catch (error) {
        // Silently fail if orientation lock is not supported or not allowed
        console.log('Orientation lock not supported or not allowed');
      }
    };
    
    lockOrientation();
    
    return () => {
      // Restore default viewport on cleanup
      viewport?.setAttribute('content', 'width=device-width, initial-scale=1.0, viewport-fit=cover');
      
      // Unlock orientation on cleanup
      if (screen.orientation && screen.orientation.unlock) {
        screen.orientation.unlock();
      }
    };
  }, []);
  
  // Theme management with localStorage persistence
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    // Try to get theme from localStorage on initial load
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme-mode') as ThemeMode;
      return savedTheme || 'system';
    }
    return 'system';
  });

  // Apply theme changes to document and save to localStorage
  useEffect(() => {
    const html = document.documentElement;
    
    // Save to localStorage
    localStorage.setItem('theme-mode', themeMode);
    
    // Apply theme to document
    if (themeMode === 'dark') {
      html.classList.add('dark');
    } else if (themeMode === 'light') {
      html.classList.remove('dark');
    } else {
      // System mode - follow system preference
      html.classList.remove('dark');
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        html.classList.add('dark');
      }
    }
  }, [themeMode]);

  // Listen for system theme changes when in system mode
  useEffect(() => {
    if (themeMode === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleChange = (e: MediaQueryListEvent) => {
        const html = document.documentElement;
        if (e.matches) {
          html.classList.add('dark');
        } else {
          html.classList.remove('dark');
        }
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [themeMode]);

  // Update theme-color meta tag for PWA status bar
  useEffect(() => {
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta');
      metaThemeColor.setAttribute('name', 'theme-color');
      document.head.appendChild(metaThemeColor);
    }
    
    // Function to update theme color
    const updateThemeColor = () => {
      if (!metaThemeColor) return;
      
      // Compute isDark the same way as the theme application logic
      let isDark = false;
      if (themeMode === 'dark') {
        isDark = true;
      } else if (themeMode === 'light') {
        isDark = false;
      } else {
        // System mode - follow system preference
        isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      }
      
      // When mobile menu is open, use sidebar color; otherwise use background color
      if (mobileMenuOpen) {
        // Use transparent to let the sidebar background show through
        metaThemeColor.setAttribute('content', 'transparent');
      } else {
        // Main background color: --background
        const backgroundColor = isDark ? '#252525' : '#f5f7fa';
        metaThemeColor.setAttribute('content', backgroundColor);
      }
    };
    
    // Update immediately
    updateThemeColor();
    
    // Also listen for system theme changes to update immediately
    if (themeMode === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleThemeChange = () => {
        updateThemeColor();
      };
      
      mediaQuery.addEventListener('change', handleThemeChange);
      return () => mediaQuery.removeEventListener('change', handleThemeChange);
    }
  }, [mobileMenuOpen, themeMode, currentPage]);

  // Listen for window resize to automatically close sidebar on mobile
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768; // md breakpoint
      if (isMobile && sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [sidebarOpen]);

  // Theme mode functions
  const handleThemeModeClick = () => {
    const modes: ThemeMode[] = ['light', 'dark', 'system'];
    const currentIndex = modes.indexOf(themeMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setThemeMode(modes[nextIndex]);
  };

  const getThemeIcon = () => {
    switch (themeMode) {
      case 'light':
        return 'Sun';
      case 'dark':
        return 'Moon';
      case 'system':
        return 'Monitor';
      default:
        return 'Monitor';
    }
  };

  // Generate unique form number based on timestamp
  const generateFormNumber = () => {
    const now = new Date();
    const timestamp = now.getTime().toString().slice(-5); // Last 5 digits of timestamp
    return `${timestamp}`;
  };

  const handleFormClick = (formId: string) => {
    // Only navigate to detail view for form #63 (our enhanced expense form)
    if (formId === '63') {
      setSelectedFormId(formId);
      setCurrentPage('detail');
    } else {
      // For other forms, you could show a "Coming soon" message or implement other form types
      alert(`Form #${formId} details coming soon!`);
    }
  };

  const handleNavigationClick = (page: string) => {
    // Close sidebar on mobile when navigating
    const isMobile = window.innerWidth < 768; // md breakpoint
    if (isMobile) {
      setSidebarOpen(false);
    }
    
    if (page === 'Entry') {
      setCurrentPage('list');
    } else if (page === 'Authorization') {
      setCurrentPage('authorization');
    } else {
      alert(`${page} page coming soon!`);
    }
  };

  const handleFormTypeSelect = (formType: string) => {
    const formNumber = generateFormNumber();
    setCreateFormType(formType);
    setCreateFormNumber(formNumber);
    setCurrentPage('create');
  };

  const handleMainAction = () => {
    // Default action when main button is clicked - create the default form type
    handleFormTypeSelect('Expenses (Foreign)');
  };

  const handleHistoryItemSelect = (item: string) => {
    // Handle history/menu item selection
    alert(`${item} feature coming soon!`);
    // In a real implementation, you could:
    // - Show history of forms
    // - Load recent templates
    // - Open saved drafts
  };

  const handleBackToList = () => {
    setCurrentPage('list');
    setSelectedFormId(null);
    setCreateFormType('');
    setCreateFormNumber('');
  };

  const handleBackToAuthorization = () => {
    setCurrentPage('authorization');
    setSelectedFormId(null);
    setCreateFormType('');
    setCreateFormNumber('');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleMobileMenu = () => {
    if (!mobileMenuOpen) {
      // Opening: apply radius immediately
      setHasRadius(true);
      setMobileMenuOpen(true);
    } else {
      // Closing: keep radius, remove menu state
      setMobileMenuOpen(false);
    }
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleTransitionEnd = (e: React.TransitionEvent) => {
    // Only react to transform ending, not other properties
    if (e.propertyName === 'transform' && !mobileMenuOpen) {
      setHasRadius(false);
    }
  };

  const handleMobileNavigate = (page: 'list' | 'authorization') => {
    if (page === 'list') {
      setCurrentPage('list');
    } else if (page === 'authorization') {
      setCurrentPage('authorization');
    }
    closeMobileMenu();
  };

  const handleSettingsClick = () => {
    setCurrentPage('settings');
    closeMobileMenu();
  };

  // Theme props to pass to child components
  const themeProps = {
    themeMode,
    handleThemeModeClick,
    getThemeIcon
  };

  // Determine current theme for Toaster
  const currentTheme = themeMode === 'system' 
    ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    : themeMode;

  // Handle form creation page
  if (currentPage === 'create' && createFormType) {
    return (
      <>
        <Toaster theme={currentTheme} richColors position="top-center" />
        <MobilePushMenu 
          isOpen={mobileMenuOpen} 
          onClose={closeMobileMenu} 
          onNavigate={handleMobileNavigate} 
          currentPage="list"
          themeMode={themeMode}
          handleThemeModeClick={handleThemeModeClick}
          getThemeIcon={getThemeIcon}
          onSettingsClick={handleSettingsClick}
        />
        {/* Main content wrapper - slides right with rounded corners */}
        <div 
          className={`
            relative h-full bg-background z-[20] 
            transition-all duration-300 ease-out
            ${hasRadius ? 'max-md:[border-radius:var(--device-radius)] max-md:overflow-hidden' : 'max-md:rounded-none'}
            ${mobileMenuOpen ? 'max-md:translate-x-[280px]' : 'max-md:translate-x-0'}
          `}
          onTransitionEnd={handleTransitionEnd}
        >
          {/* Overlay - covers content and navbar when menu is open */}
          {mobileMenuOpen && (
            <div 
              className="md:hidden fixed inset-0 bg-black/50 z-[70] transition-opacity duration-300"
              onClick={closeMobileMenu}
            />
          )}
          <FormCreationPage 
            formType={createFormType}
            formNumber={createFormNumber}
            onBackToList={handleBackToList}
            sidebarOpen={sidebarOpen}
            onToggleSidebar={toggleSidebar}
            onMobileMenuClick={toggleMobileMenu}
            {...themeProps}
          />
        </div>
      </>
    );
  }

  // Handle existing expense form detail page - back to original component
  if (currentPage === 'detail' && selectedFormId === '63') {
    return (
      <>
        <Toaster theme={currentTheme} richColors position="top-center" />
        <MobilePushMenu 
          isOpen={mobileMenuOpen} 
          onClose={closeMobileMenu} 
          onNavigate={handleMobileNavigate} 
          currentPage="list"
          themeMode={themeMode}
          handleThemeModeClick={handleThemeModeClick}
          getThemeIcon={getThemeIcon}
          onSettingsClick={handleSettingsClick}
        />
        {/* Main content wrapper - slides right with rounded corners */}
        <div 
          className={`
            relative h-full bg-background z-[20] 
            transition-all duration-300 ease-out
            ${hasRadius ? 'max-md:[border-radius:var(--device-radius)] max-md:overflow-hidden' : 'max-md:rounded-none'}
            ${mobileMenuOpen ? 'max-md:translate-x-[280px]' : 'max-md:translate-x-0'}
          `}
          onTransitionEnd={handleTransitionEnd}
        >
          {/* Overlay - covers content and navbar when menu is open */}
          {mobileMenuOpen && (
            <div 
              className="md:hidden fixed inset-0 bg-black/50 z-[70] transition-opacity duration-300"
              onClick={closeMobileMenu}
            />
          )}
          <EnhancedExpenseForm 
            onBackToList={handleBackToList}
            sidebarOpen={sidebarOpen}
            onToggleSidebar={toggleSidebar}
            onMobileMenuClick={toggleMobileMenu}
            {...themeProps}
            sourcePage="Entry"
            onNavigationClick={handleNavigationClick}
          />
        </div>
      </>
    );
  }

  // Handle authorization page
  if (currentPage === 'authorization') {
    return (
      <>
        <Toaster theme={currentTheme} richColors position="top-center" />
        <MobilePushMenu 
          isOpen={mobileMenuOpen} 
          onClose={closeMobileMenu} 
          onNavigate={handleMobileNavigate} 
          currentPage="authorization"
          themeMode={themeMode}
          handleThemeModeClick={handleThemeModeClick}
          getThemeIcon={getThemeIcon}
          onSettingsClick={handleSettingsClick}
        />
        {/* Main content wrapper - slides right with rounded corners */}
        <div 
          className={`
            relative h-full bg-background z-[20] 
            transition-all duration-300 ease-out
            ${hasRadius ? 'max-md:[border-radius:var(--device-radius)] max-md:overflow-hidden' : 'max-md:rounded-none'}
            ${mobileMenuOpen ? 'max-md:translate-x-[280px]' : 'max-md:translate-x-0'}
          `}
          onTransitionEnd={handleTransitionEnd}
        >
          {/* Overlay - covers content and navbar when menu is open */}
          {mobileMenuOpen && (
            <div 
              className="md:hidden fixed inset-0 bg-black/50 z-[70] transition-opacity duration-300"
              onClick={closeMobileMenu}
            />
          )}
          <AuthorizationPage 
            sidebarOpen={sidebarOpen}
            onToggleSidebar={toggleSidebar}
            onMobileMenuClick={toggleMobileMenu}
            {...themeProps}
            onNavigationClick={handleNavigationClick}
          />
        </div>
      </>
    );
  }

  // Handle settings page
  if (currentPage === 'settings') {
    return (
      <>
        <Toaster theme={currentTheme} richColors position="top-center" />
        <MobilePushMenu 
          isOpen={mobileMenuOpen} 
          onClose={closeMobileMenu} 
          onNavigate={handleMobileNavigate} 
          currentPage="settings"
          themeMode={themeMode}
          handleThemeModeClick={handleThemeModeClick}
          getThemeIcon={getThemeIcon}
          onSettingsClick={handleSettingsClick}
        />
        {/* Main content wrapper - slides right with rounded corners */}
        <div 
          className={`
            relative h-full bg-background z-[20] 
            transition-all duration-300 ease-out
            ${hasRadius ? 'max-md:[border-radius:var(--device-radius)] max-md:overflow-hidden' : 'max-md:rounded-none'}
            ${mobileMenuOpen ? 'max-md:translate-x-[280px]' : 'max-md:translate-x-0'}
          `}
          onTransitionEnd={handleTransitionEnd}
        >
          {/* Overlay - covers content and navbar when menu is open */}
          {mobileMenuOpen && (
            <div 
              className="md:hidden fixed inset-0 bg-black/50 z-[70] transition-opacity duration-300"
              onClick={closeMobileMenu}
            />
          )}
          <SettingsPage 
            sidebarOpen={sidebarOpen}
            onToggleSidebar={toggleSidebar}
            onMobileMenuClick={toggleMobileMenu}
            onBackClick={handleBackToList}
            {...themeProps}
          />
        </div>
      </>
    );
  }

  // Default to forms list page
  return (
    <>
      <Toaster theme={currentTheme} richColors position="top-center" />
      <MobilePushMenu 
        isOpen={mobileMenuOpen} 
        onClose={closeMobileMenu} 
        onNavigate={handleMobileNavigate} 
        currentPage="list"
        themeMode={themeMode}
        handleThemeModeClick={handleThemeModeClick}
        getThemeIcon={getThemeIcon}
        onSettingsClick={handleSettingsClick}
      />
      {/* Main content wrapper - slides right with rounded corners */}
      <div 
        className={`
          relative h-full bg-background z-[20] 
          transition-all duration-300 ease-out
          ${hasRadius ? 'max-md:[border-radius:var(--device-radius)] max-md:overflow-hidden' : 'max-md:rounded-none'}
          ${mobileMenuOpen ? 'max-md:translate-x-[280px]' : 'max-md:translate-x-0'}
        `}
        onTransitionEnd={handleTransitionEnd}
      >
        {/* Overlay - covers content and navbar when menu is open */}
        {mobileMenuOpen && (
          <div 
            className="md:hidden fixed inset-0 bg-black/50 z-[70] transition-opacity duration-300"
            onClick={closeMobileMenu}
          />
        )}
        <FormsListPage 
          onFormClick={handleFormClick}
          onFormTypeSelect={handleFormTypeSelect}
          sidebarOpen={sidebarOpen}
          onToggleSidebar={toggleSidebar}
          onMobileMenuClick={toggleMobileMenu}
          onNavigationClick={handleNavigationClick}
          onMainAction={handleMainAction}
          onHistoryItemSelect={handleHistoryItemSelect}
          {...themeProps}
        />
      </div>
    </>
  );
}