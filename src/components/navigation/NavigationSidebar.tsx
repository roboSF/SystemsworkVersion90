import { TooltipProvider } from "../ui/tooltip";
import { NavigationCollapseButton, NavigationGroupItem, NavigationSubItem } from "./NavigationComponents";
import { getNavigationGroups } from "./navigationData";
import { useNavigation } from "./useNavigation";

interface NavigationSidebarProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  svgPaths: any;
}

export const NavigationSidebar = ({ sidebarOpen, onToggleSidebar, svgPaths }: NavigationSidebarProps) => {
  const { expandedGroups, isMobile, toggleGroup } = useNavigation();
  const navigationGroups = getNavigationGroups(svgPaths);

  return (
    <TooltipProvider>
      <div className={`
        bg-white flex flex-col justify-between border border-[#e3e6ed] z-50 transition-all duration-300 ease-in-out
        ${sidebarOpen ? 'translate-y-0' : '-translate-y-full'}
        ${sidebarOpen ? 'md:w-[250px]' : 'md:w-[60px]'}
        md:translate-y-0 md:translate-x-0
        md:fixed md:left-0 md:top-0 md:h-full md:border-l-0 md:border-t-0 md:border-b-0 md:rounded-none
        fixed left-0 right-0 w-full shrink-0 top-mobile-nav h-mobile-sidebar
        p-4 md:px-3 md:py-2.5
      `}>
        {/* Navigation Items */}
        <div className="space-y-2 w-full">
          {/* Collapse Button with Logo - Desktop Only */}
          <NavigationCollapseButton 
            sidebarOpen={sidebarOpen} 
            onToggleSidebar={onToggleSidebar} 
          />
          
          {navigationGroups.map((group, index) => (
            <div key={group.id}>
              <NavigationGroupItem
                icon={group.icon}
                label={group.label}
                groupId={group.id}
                active={group.active}
                subItems={group.subItems}
                sidebarOpen={sidebarOpen}
                isMobile={isMobile}
                isExpanded={expandedGroups.has(group.id)}
                onToggleGroup={toggleGroup}
              />
              
              {sidebarOpen && expandedGroups.has(group.id) && (
                <div className="space-y-1">
                  {group.subItems.map((item) => (
                    <NavigationSubItem 
                      key={item.label}
                      label={item.label} 
                      active={item.active} 
                    />
                  ))}
                </div>
              )}
              
              {index < navigationGroups.length - 1 && (
                <div className="h-4 shrink-0 w-full" />
              )}
            </div>
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
};