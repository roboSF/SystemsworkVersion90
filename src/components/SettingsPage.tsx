import MobileNavbar from "./MobileNavbar";
import { Settings, LogOut, Sun, Moon, Monitor, ChevronRight } from "lucide-react";
import imgAvatarPlaceholderChangeImageHere from "figma:asset/884bf465a905d0cc5a2af7245f6b2211b9596a64.png";

interface SettingsPageProps {
  onBackClick: () => void;
  onMobileMenuClick: () => void;
  themeMode: 'light' | 'dark' | 'system';
  handleThemeModeClick: () => void;
  getThemeIcon: () => string;
}

export default function SettingsPage({
  onBackClick,
  onMobileMenuClick,
  themeMode,
  handleThemeModeClick,
  getThemeIcon
}: SettingsPageProps) {
  
  // Helper function to get theme icon component from string name
  const getThemeIconComponent = () => {
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

  // Get theme mode display text
  const getThemeModeText = () => {
    switch (themeMode) {
      case 'light':
        return 'Light';
      case 'dark':
        return 'Dark';
      case 'system':
        return 'System';
      default:
        return 'System';
    }
  };

  return (
    <div className="h-screen w-full bg-background flex flex-col overflow-hidden pt-safe-top pb-safe-bottom">
      {/* Mobile Navbar */}
      <div className="md:hidden">
        <MobileNavbar
          showBackButton={false}
          onBackClick={onBackClick}
          onMenuClick={onMobileMenuClick}
          pageTitle="Settings"
          themeMode={themeMode}
          handleThemeModeClick={handleThemeModeClick}
          getThemeIcon={getThemeIcon}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto pt-[60px] md:pt-0">
        <div className="max-w-2xl mx-auto px-4 py-6 space-y-6 pb-safe-bottom">
          
          {/* Profile Section */}
          <div className="bg-card rounded-lg border border-sidebar-border p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Profile</h2>
            <div className="flex items-center gap-4">
              <div className="size-16 rounded-full overflow-hidden border-2 border-sidebar-border flex-shrink-0">
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
                <span className="text-base font-medium text-foreground">Stephen Hill</span>
                <span className="text-sm text-muted-foreground">stephen.hill@pso.com</span>
              </div>
            </div>
          </div>

          {/* Appearance Section */}
          <div className="bg-card rounded-lg border border-sidebar-border overflow-hidden">
            <div className="p-4 border-b border-sidebar-border">
              <h2 className="text-lg font-semibold text-foreground">Appearance</h2>
            </div>
            
            {/* Theme Mode Setting */}
            <button
              onClick={handleThemeModeClick}
              className="w-full flex items-center justify-between px-4 py-4 hover:bg-sidebar-accent transition-colors active:scale-[0.98]"
            >
              <div className="flex items-center gap-3">
                {(() => {
                  const IconComponent = getThemeIconComponent();
                  return <IconComponent className="h-5 w-5 text-muted-foreground" />;
                })()}
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium text-foreground">Theme</span>
                  <span className="text-xs text-muted-foreground">{getThemeModeText()} mode</span>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>

          {/* Account Section */}
          <div className="bg-card rounded-lg border border-sidebar-border overflow-hidden">
            <div className="p-4 border-b border-sidebar-border">
              <h2 className="text-lg font-semibold text-foreground">Account</h2>
            </div>
            
            {/* Settings Item */}
            <button
              onClick={() => alert('Settings feature coming soon!')}
              className="w-full flex items-center justify-between px-4 py-4 hover:bg-sidebar-accent transition-colors active:scale-[0.98]"
            >
              <div className="flex items-center gap-3">
                <Settings className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">Account Settings</span>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </button>

            {/* Sign Out Item */}
            <button
              onClick={() => alert('Sign out feature coming soon!')}
              className="w-full flex items-center justify-between px-4 py-4 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors active:scale-[0.98] border-t border-sidebar-border"
            >
              <div className="flex items-center gap-3">
                <LogOut className="h-5 w-5 text-red-600 dark:text-red-500" />
                <span className="text-sm font-medium text-red-600 dark:text-red-500">Sign Out</span>
              </div>
              <ChevronRight className="h-5 w-5 text-red-600 dark:text-red-500" />
            </button>
          </div>

          {/* App Info */}
          <div className="text-center py-4">
            <p className="text-xs text-muted-foreground">Version 9.0.0</p>
            <p className="text-xs text-muted-foreground mt-1">© 2026 systems@work</p>
          </div>

        </div>
      </div>
    </div>
  );
}