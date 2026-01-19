// utils/deviceRadius.ts
export function getDeviceCornerRadius(): number {
  // Only apply in standalone PWA mode
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches 
    || (window.navigator as any).standalone === true;
  
  if (!isStandalone) return 0;
  
  const ua = navigator.userAgent;
  
  // Android - always return 0 (too much variation)
  if (/Android/i.test(ua)) return 0;
  
  // Check for iPhone
  if (/iPhone/.test(ua)) {
    const screenHeight = window.screen.height;
    
    // iPhones WITH rounded corners (X and later)
    // These are identified by screen height in points
    const roundedIphones: Record<number, number> = {
      812: 47,  // iPhone X, XS, 11 Pro, 12 Mini, 13 Mini
      844: 47,  // iPhone 12, 12 Pro, 13, 13 Pro, 14
      852: 55,  // iPhone 14 Pro, 15, 15 Pro
      874: 55,  // iPhone 16, 16 Pro
      896: 47,  // iPhone XR, XS Max, 11, 11 Pro Max
      926: 47,  // iPhone 12 Pro Max, 13 Pro Max, 14 Plus
      932: 55,  // iPhone 14 Pro Max, 15 Plus, 15 Pro Max
      956: 55,  // iPhone 16 Pro Max
    };
    
    return roundedIphones[screenHeight] ?? 0;
  }
  
  // Check for iPad with rounded corners (2018+)
  const isIpad = /iPad/.test(ua) || 
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  
  if (isIpad) {
    // Modern iPads (2018+) have rounded corners
    // Detect by checking for Face ID support or screen size
    const screenWidth = Math.min(window.screen.width, window.screen.height);
    const screenHeight = Math.max(window.screen.width, window.screen.height);
    
    // iPad Pro 11" and 12.9" (2018+), iPad Air 4+, iPad mini 6
    // These have ~18pt corner radius
    const hasModernDimensions = 
      (screenWidth >= 744) ||  // iPad mini 6+ portrait width
      (screenHeight >= 1133);  // iPad Pro 11"+ height
    
    // Additional check: older iPads don't support certain APIs
    const hasModernAPIs = 'ontouchend' in document && 
      CSS.supports('padding', 'env(safe-area-inset-top)');
    
    if (hasModernDimensions && hasModernAPIs) {
      return 18;
    }
    
    return 0;
  }
  
  // Desktop and everything else - no radius
  return 0;
}
