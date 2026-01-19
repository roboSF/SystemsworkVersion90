import { useState, useRef, useEffect } from "react";
import { MoreHorizontal, SquareCheckBig } from "lucide-react";

interface MobileAuthorizationSplitButtonProps {
  onMainAction: () => void;
  onHistoryItemSelect: (item: string) => void;
  className?: string;
}

const AUTHORIZATION_ACTIONS = [
  "Approve",
  "Reject", 
  "Request Changes",
  "Forward",
  "Defer"
];

const HISTORY_ITEMS = [
  "History",
  "Recent Decisions",
  "Saved Templates"
];

export default function MobileAuthorizationSplitButton({ 
  onMainAction, 
  onHistoryItemSelect,
  className = ""
}: MobileAuthorizationSplitButtonProps) {
  const [showAuthorizationDropdown, setShowAuthorizationDropdown] = useState(false);
  const [showHistoryDropdown, setShowHistoryDropdown] = useState(false);
  
  const splitButtonRef = useRef<HTMLDivElement>(null);
  const authorizationDropdownRef = useRef<HTMLDivElement>(null);
  const historyDropdownRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        splitButtonRef.current && 
        !splitButtonRef.current.contains(event.target as Node) &&
        authorizationDropdownRef.current && 
        !authorizationDropdownRef.current.contains(event.target as Node)
      ) {
        setShowAuthorizationDropdown(false);
      }
      
      if (
        splitButtonRef.current && 
        !splitButtonRef.current.contains(event.target as Node) &&
        historyDropdownRef.current && 
        !historyDropdownRef.current.contains(event.target as Node)
      ) {
        setShowHistoryDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMainButtonClick = () => {
    setShowAuthorizationDropdown(!showAuthorizationDropdown);
    setShowHistoryDropdown(false);
  };

  const handleHistoryButtonClick = () => {
    setShowHistoryDropdown(!showHistoryDropdown);
    setShowAuthorizationDropdown(false);
  };

  const handleAuthorizationActionClick = (action: string) => {
    onMainAction(); // For now, all actions trigger the same handler
    setShowAuthorizationDropdown(false);
  };

  const handleHistoryItemClick = (item: string) => {
    onHistoryItemSelect(item);
    setShowHistoryDropdown(false);
  };

  return (
    <div className={`relative w-full ${className}`} ref={splitButtonRef}>
      {/* Main Button Group - Full Width on Mobile */}
      <div className="flex w-full">
        {/* Main Authorization Button */}
        <button
          onClick={handleMainButtonClick}
          className="bg-[#0d6efd] hover:bg-[#0b5ed7] text-white px-4 py-3 rounded-l-[3.2px] border border-[#0d6efd] flex items-center gap-2 transition-colors flex-1 justify-center"
        >
          <SquareCheckBig className="size-4" />
          <span className="text-sm font-medium">Authorize</span>
        </button>
        
        {/* Separator */}
        <div className="w-px bg-[#0b5ed7]" />
        
        {/* History/More Button */}
        <button
          onClick={handleHistoryButtonClick}
          className="bg-[#0d6efd] hover:bg-[#0b5ed7] text-white px-3 py-3 rounded-r-[3.2px] border border-[#0d6efd] border-l-0 flex items-center justify-center transition-colors"
        >
          <MoreHorizontal className="size-4" />
        </button>
      </div>

      {/* Authorization Actions Dropdown - Full Width on Mobile */}
      {showAuthorizationDropdown && (
        <div 
          ref={authorizationDropdownRef}
          className="absolute top-full left-0 right-0 z-50 mt-1 bg-popover border border-sidebar-border rounded-lg shadow-lg py-1"
        >
          {AUTHORIZATION_ACTIONS.map((action) => (
            <button
              key={action}
              onClick={() => handleAuthorizationActionClick(action)}
              className="w-full text-left px-4 py-3 text-sm text-popover-foreground hover:bg-accent transition-colors"
            >
              {action}
            </button>
          ))}
        </div>
      )}

      {/* History Dropdown - Aligned to Right on Mobile */}
      {showHistoryDropdown && (
        <div 
          ref={historyDropdownRef}
          className="absolute top-full right-0 z-50 mt-1 min-w-[180px] bg-popover border border-sidebar-border rounded-lg shadow-lg py-1"
        >
          {HISTORY_ITEMS.map((item) => (
            <button
              key={item}
              onClick={() => handleHistoryItemClick(item)}
              className="w-full text-left px-4 py-3 text-sm text-popover-foreground hover:bg-accent transition-colors"
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}