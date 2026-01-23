import { BsLayoutSidebarInset, BsLayoutSidebarInsetReverse } from "react-icons/bs";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import SystemsWorkTransparentNoEdges1 from "../../imports/SystemsWorkTransparentNoEdges1";

interface NavigationCollapseButtonProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export const NavigationCollapseButton = ({ sidebarOpen, onToggleSidebar }: NavigationCollapseButtonProps) => (
  <div className="hidden md:block mb-4">
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={onToggleSidebar}
          className={`flex flex-row items-center hover:bg-gray-50 rounded w-full transition-colors ${sidebarOpen ? 'gap-2.5 p-2.5' : 'md:justify-center md:p-2.5'}`}
          title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          <div className="size-[18px] shrink-0">
            {sidebarOpen ? (
              <BsLayoutSidebarInset className="size-[18px] text-[#212529]" />
            ) : (
              <BsLayoutSidebarInsetReverse className="size-[18px] text-[#212529]" />
            )}
          </div>
          {sidebarOpen ? (
            <div className="h-[20px] w-[118px] max-w-full transition-opacity duration-300">
              <SystemsWorkTransparentNoEdges1 />
            </div>
          ) : (
            <span className="opacity-0 w-0 overflow-hidden">
              Expand
            </span>
          )}
        </button>
      </TooltipTrigger>
      {!sidebarOpen && (
        <TooltipContent side="right">
          <p>Expand sidebar</p>
        </TooltipContent>
      )}
    </Tooltip>
  </div>
);

interface NavigationGroupItemProps {
  icon: string;
  label: string;
  groupId: string;
  active?: boolean;
  subItems?: { label: string; active?: boolean }[];
  sidebarOpen: boolean;
  isMobile: boolean;
  isExpanded: boolean;
  onToggleGroup: (groupId: string) => void;
}

export const NavigationGroupItem = ({ 
  icon, 
  label, 
  groupId, 
  active = false, 
  subItems = [], 
  sidebarOpen, 
  isMobile, 
  isExpanded,
  onToggleGroup 
}: NavigationGroupItemProps) => {
  // Only highlight master node when sidebar is collapsed, not when expanded
  const shouldHighlightMaster = active && !sidebarOpen;
  
  const content = (
    <div 
      className={`flex flex-row items-center hover:bg-sidebar-accent rounded group cursor-pointer w-full ${sidebarOpen ? 'gap-2.5 p-2.5' : 'md:justify-center md:p-2.5'}`}
      onClick={() => sidebarOpen && onToggleGroup(groupId)}
    >
      <div className="size-[18px] shrink-0">
        <svg className="block size-full" fill={shouldHighlightMaster ? "var(--color-sidebar-primary)" : "var(--color-sidebar-foreground)"} viewBox="0 0 18 18">
          <path d={icon} />
        </svg>
      </div>
      <span className={`text-xs whitespace-nowrap transition-opacity duration-300 flex-1 ${
        sidebarOpen ? 'opacity-100' : 'md:opacity-0 md:w-0 md:overflow-hidden'
      } ${shouldHighlightMaster ? 'text-sidebar-primary' : 'text-sidebar-foreground'}`}>
        {label}
      </span>
      {sidebarOpen && (
        <div className={`size-3 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}>
          <svg className="block size-full" fill={shouldHighlightMaster ? "var(--color-sidebar-primary)" : "var(--color-sidebar-foreground)"} viewBox="0 0 16 16">
            <path d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
          </svg>
        </div>
      )}
    </div>
  );

  // On desktop, wrap with tooltip when collapsed - show sub-items in tooltip
  if (!isMobile && !sidebarOpen) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          {content}
        </TooltipTrigger>
        <TooltipContent 
          side="right" 
          align="start"
          alignOffset={0}
          sideOffset={8}
          showArrow={false}
          className="bg-popover border border-sidebar-border shadow-lg text-popover-foreground rounded-lg p-0 min-w-[200px]"
        >
          <div className="py-2">
            <div className="px-3 py-2 text-sm font-medium text-muted-foreground border-b border-sidebar-border">
              {label}
            </div>
            <div className="py-1">
              {subItems.map((item) => (
                <div 
                  key={item.label}
                  className={`px-3 py-2 text-sm cursor-pointer transition-colors ${
                    item.active 
                      ? 'text-sidebar-primary font-medium' 
                      : 'text-sidebar-foreground hover:bg-sidebar-accent'
                  }`}
                >
                  {item.label}
                </div>
              ))}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    );
  }

  return content;
};

interface NavigationSubItemProps {
  label: string;
  active?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
  isMobile?: boolean;
  onClick?: () => void;
}

export const NavigationSubItem = ({ label, active = false, icon: Icon, isMobile = false, onClick }: NavigationSubItemProps) => (
  <div 
    className={`flex flex-row items-center rounded group cursor-pointer w-full gap-2.5 p-2.5 ${isMobile ? 'pl-2.5' : 'pl-8'} ${active ? 'bg-sidebar-accent' : 'hover:bg-sidebar-accent'}`}
    onClick={onClick}
  >
    {isMobile && Icon && (
      <Icon className={`w-5 h-5 shrink-0 ${active ? 'text-sidebar-primary' : 'text-sidebar-foreground'}`} />
    )}
    <span className={`whitespace-nowrap ${active ? 'text-sidebar-primary font-medium' : 'text-sidebar-foreground'} ${isMobile ? 'text-sm' : 'text-xs'}`}>
      {label}
    </span>
  </div>
);