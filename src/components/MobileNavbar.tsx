import { ArrowLeft, Settings, LogOut, Sun, Moon, Monitor } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import svgPaths from "../imports/svg-bhzpr3x8cr";
import imgAvatarPlaceholderChangeImageHere from "figma:asset/884bf465a905d0cc5a2af7245f6b2211b9596a64.png";

interface MobileNavbarProps {
  showBackButton?: boolean;
  onBackClick?: () => void;
  onMenuClick?: () => void;
  pageTitle: string;
  formId?: string;
  formType?: string;
  themeMode: 'light' | 'dark' | 'system';
  handleThemeModeClick: () => void;
  getThemeIcon: () => string;
  currentRow?: number;
  totalRows?: number;
  insideModal?: boolean;
}

function HamburgerMenu() {
  return (
    <div className="relative shrink-0 size-6">
      <svg className="block size-full text-muted-foreground" fill="currentColor" preserveAspectRatio="none" role="presentation" viewBox="0 0 24 24">
        <g>
          <path
            clipRule="evenodd"
            d={svgPaths.p18c07780}
            fillRule="evenodd"
          />
        </g>
      </svg>
    </div>
  );
}

function Avatar() {
  return (
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
  );
}

export default function MobileNavbar({ 
  onMenuClick, 
  onBackClick, 
  showBackButton = false, 
  formId, 
  formType, 
  pageTitle,
  themeMode,
  handleThemeModeClick,
  getThemeIcon,
  currentRow,
  totalRows,
  insideModal = false
}: MobileNavbarProps) {
  const showFormInfo = formId && formType;

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
    <div className={insideModal ? "md:hidden relative top-0 left-0 right-0 z-10 bg-background" : "md:hidden fixed top-0 left-0 right-0 z-[60] bg-background"}>
      {/* Safe area top padding */}
      <div className="pt-safe-top">
        <div className="box-border bg-background content-stretch flex flex-row items-center justify-between h-[60px] overflow-hidden px-4 pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] py-0 relative w-full">
          {/* Left side - Navigation button */}
          <div className="flex items-center justify-start relative shrink-0">
            {showBackButton ? (
              <button
                onClick={onBackClick}
                className="relative shrink-0 size-10 p-2 hover:bg-sidebar-accent rounded transition-colors"
                aria-label="Go back"
              >
                <ArrowLeft className="size-6 text-muted-foreground" />
              </button>
            ) : (
              <button
                onClick={onMenuClick}
                className="relative shrink-0 size-6 p-0 hover:bg-sidebar-accent rounded transition-colors"
                aria-label="Open menu"
              >
                <HamburgerMenu />
              </button>
            )}
          </div>

          {/* Center - Form info or Page Title */}
          {showFormInfo ? (
            <div className="flex-1 flex flex-row items-center justify-center px-4 min-w-0 gap-2">
              <div className="text-center font-normal text-foreground truncate">
                #{formId}
              </div>
              <div className="text-muted-foreground text-center text-left text-[16px]">|</div>
              <div className="text-sm text-foreground truncate text-[14px]">
                {formType}
              </div>
            </div>
          ) : currentRow !== undefined && totalRows !== undefined ? (
            <div className="flex-1 flex justify-center px-4">
              <div className="text-center font-medium text-foreground truncate">
                Row {currentRow} / {totalRows}
              </div>
            </div>
          ) : pageTitle ? (
            <div className="flex-1 flex justify-center px-4">
              <div className="text-center font-medium text-foreground truncate">
                {pageTitle}
              </div>
            </div>
          ) : null}

          {/* Right side - Avatar with Dropdown (only show when not displaying form info) */}
          <div className="flex items-center justify-end relative shrink-0">
            {/* Avatar dropdown hidden on mobile - Settings moved to hamburger menu */}
          </div>
        </div>
      </div>
    </div>
  );
}