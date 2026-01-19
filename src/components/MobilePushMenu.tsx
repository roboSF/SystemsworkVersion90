import { getNavigationGroups } from "./navigation/navigationData";
import { useNavigation } from "./navigation/useNavigation";
import { NavigationGroupItem, NavigationSubItem } from "./navigation/NavigationComponents";
import { TooltipProvider } from "./ui/tooltip";
import svgPaths from "../imports/svg-bhzpr3x8cr";
import SystemsWorkTransparentNoEdges1 from "../imports/SystemsWorkTransparentNoEdges1";
import { useEffect } from "react";
import imgAvatarPlaceholderChangeImageHere from "figma:asset/884bf465a905d0cc5a2af7245f6b2211b9596a64.png";
import { Settings, LogOut, Sun, Moon, Monitor } from "lucide-react";

interface MobilePushMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: 'list' | 'authorization') => void;
  currentPage: 'list' | 'authorization' | 'settings';
  themeMode?: 'light' | 'dark' | 'system';
  handleThemeModeClick?: () => void;
  getThemeIcon?: () => string;
  onSettingsClick?: () => void;
}

export default function MobilePushMenu({ isOpen, onClose, onNavigate, currentPage, themeMode, handleThemeModeClick, getThemeIcon, onSettingsClick }: MobilePushMenuProps) {
  const { expandedGroups, toggleGroup } = useNavigation();
  const navigationGroups = getNavigationGroups(svgPaths);

  // Lock body scroll on mobile when menu is open
  useEffect(() => {
    const isMobile = window.innerWidth < 768; // md breakpoint
    
    if (isMobile && isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Helper function to get theme icon component from string name
  const getThemeIconComponent = () => {
    if (!getThemeIcon) return Monitor;
    const iconName = getThemeIcon();
    switch (iconName) {
      case 'Sun':
        return Sun;
      case 'Moon':
        return Moon;
      case 'Monitor':
        return Monitor;
      default:
        return Monitor;
    }
  };

  return (
    <>
      {/* Sidebar - background visible underneath content */}
      <div 
        className={`
          md:hidden fixed inset-0 bg-sidebar z-[10]
          transition-all duration-300 ease-in-out origin-left
          ${isOpen 
            ? 'translate-x-0 scale-100' 
            : '-translate-x-full scale-[0.98]'
          }
        `}
      >
        {/* Menu content constrained to 280px width */}
        <div className="w-[280px] h-full pt-safe-top pb-safe-bottom">
          {/* Header */}
          <div className="flex items-center justify-between px-4 h-[60px]">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full overflow-hidden border border-sidebar-border flex-shrink-0">
                <img 
                  src={imgAvatarPlaceholderChangeImageHere} 
                  alt="User avatar"
                  className="w-full h-full object-cover"
                  data-no-preview="true"
                  draggable="false"
                  onContextMenu={(e) => e.preventDefault()}
                />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-sidebar-foreground leading-tight">Stephen Hill</span>
              </div>
            </div>
          </div>

          {/* Navigation Content */}
          <TooltipProvider>
            <div className="h-[calc(100vh-60px-env(safe-area-inset-top)-env(safe-area-inset-bottom))]">
              <div className="p-4 flex flex-col h-full">
                {/* Navigation Items - takes up available space */}
                <div className="flex-1 space-y-6 overflow-y-auto overflow-x-hidden">
                  {navigationGroups
                    .filter((group) => group.id !== 'admin') // Hide Admin section on mobile
                    .map((group) => (
                      <div key={group.id} className="space-y-3 items-start">
                        {/* Show sub-items directly as flat navigation items */}
                        {group.subItems.map((item) => {
                          const pageMapping: { [key: string]: 'list' | 'authorization' } = {
                            'Entry': 'list',
                            'Authorization': 'authorization'
                          };
                          
                          const isActive = pageMapping[item.label] === currentPage;
                          
                          return (
                            <NavigationSubItem 
                              key={item.label}
                              label={item.label} 
                              active={isActive}
                              icon={item.icon}
                              isMobile={true}
                              onClick={() => onNavigate(pageMapping[item.label])}
                            />
                          );
                        })}
                      </div>
                    ))}
                </div>
                
                {/* Settings Section - pinned to bottom */}
                <div className="pt-4 border-t border-sidebar-border space-y-3 flex-shrink-0">
                  {/* Settings Item */}
                  <button
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-sidebar-accent transition-colors text-left"
                    onClick={onSettingsClick}
                  >
                    <Settings className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-sidebar-foreground">Settings</span>
                  </button>
                </div>
              </div>
            </div>
          </TooltipProvider>
        </div>
      </div>
    </>
  );
}