import { useState, useEffect, useRef } from "react";
import { Menu, X, Plus, Edit, Copy, Split, Trash2, List, Grid3x3, Check, Settings, User, LogOut, Sun, Moon, Monitor, Cog, FileText, PanelRightOpen, PanelRightClose, ChevronRight, MoreVertical, Download } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "./ui/sheet";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";
import MobileNavbar from "./MobileNavbar";
import SplitButton from "./SplitButton";
import MobileSplitButton from "./MobileSplitButton";
import AvatarGroup, { Avatar } from "./AvatarGroup";
import svgPaths from "../imports/svg-l12dhogi8o";
import imgImagePlaceholderChangeImageHere from "figma:asset/35a2ff583f0f16721866de96ef15f9a7d62cc53f.png";
import imgAvatarPlaceholderChangeImageHere from "figma:asset/884bf465a905d0cc5a2af7245f6b2211b9596a64.png";
import imgAvatarPlaceholderChangeImageHere1 from "figma:asset/e9ac067c06a35f0460fb270303652f5b84caffb7.png";
import imgAvatarPlaceholderChangeImageHere2 from "figma:asset/a7d1d64dbc57696f9bf595c7e9eca97455c77caf.png";
import imgImagePlaceholderChangeImageHere1 from "figma:asset/7ff5b46e5f240e6d5e305d752472b445c8d3a2c1.png";
import SystemsWorkTransparentNoEdges1 from "../imports/SystemsWorkTransparentNoEdges1";

interface FormsListPageProps {
  onFormClick: (formId: string) => void;
  onFormTypeSelect: (formType: string) => void;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  themeMode: 'light' | 'dark' | 'system';
  handleThemeModeClick: () => void;
  getThemeIcon: () => string;
  onNavigationClick?: (page: string) => void;
  onMainAction?: () => void;
  onHistoryItemSelect?: (item: string) => void;
  onMobileMenuClick?: () => void;
}

type ViewMode = 'stacked' | 'grid';

export default function FormsListPage({ onFormClick, onFormTypeSelect, sidebarOpen, onToggleSidebar, themeMode, handleThemeModeClick, getThemeIcon, onNavigationClick, onMainAction, onHistoryItemSelect, onMobileMenuClick }: FormsListPageProps) {
  const [selectedForms, setSelectedForms] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<ViewMode>('stacked');
  const [isMobile, setIsMobile] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['forms'])); // Forms expanded by default
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateFormSheetOpen, setIsCreateFormSheetOpen] = useState(false);
  const [isHistorySheetOpen, setIsHistorySheetOpen] = useState(false);

  // Forms data with avatar groups
  const formsData = [
    { 
      id: "63", 
      type: "Expenses (Foreign)", 
      date: "2/5/2025", 
      description: "Trip to Paris", 
      amount: "2,217.39 GBP", 
      badge: "Returned",
      image: imgImagePlaceholderChangeImageHere,
      hasMultipleImages: true,
      avatars: [
        { type: 'image' as const, value: imgAvatarPlaceholderChangeImageHere  },
        { type: 'image' as const, value: imgAvatarPlaceholderChangeImageHere1 },
        { type: 'image' as const, value: imgAvatarPlaceholderChangeImageHere2 },
        { type: 'image' as const, value: imgAvatarPlaceholderChangeImageHere  }
      ]
    },
    { 
      id: "62", 
      type: "Expenses (Foreign)", 
      date: "2/1/2025", 
      description: "London meeting with Oil International", 
      amount: "150.00 EUR", 
      badge: null,
      image: imgImagePlaceholderChangeImageHere1,
      hasMultipleImages: false,
      avatars: [
        { type: 'image' as const, value: imgAvatarPlaceholderChangeImageHere },
      ]
    },
    { 
      id: "61", 
      type: "Expenses (Local)", 
      date: "1/31/2025", 
      description: "Dinner with Chiesi CEO", 
      amount: "150.00 EUR", 
      badge: "Returned",
      image: imgImagePlaceholderChangeImageHere,
      hasMultipleImages: false,
      avatars: [
        { type: 'image' as const, value: imgAvatarPlaceholderChangeImageHere },
        { type: 'initial' as const, value: 'TM', backgroundColor: '#198754', textColor: 'white' },
        { type: 'initial' as const, value: 'SS', backgroundColor: '#6610f2', textColor: 'white' },
        { type: 'image' as const, value: imgAvatarPlaceholderChangeImageHere }
      ]
    },
    { 
      id: "60", 
      type: "Expenses (Foreign)", 
      date: "1/26/2025", 
      description: "", 
      amount: "150.00 EUR", 
      badge: null,
      image: imgImagePlaceholderChangeImageHere1,
      hasMultipleImages: false,
      avatars: [
        { type: 'image' as const, value: imgAvatarPlaceholderChangeImageHere }
      ]
    },
    { 
      id: "59", 
      type: "Expenses (Foreign)", 
      date: "1/15/2025", 
      description: "", 
      amount: "150.00 EUR", 
      badge: null,
      image: imgImagePlaceholderChangeImageHere,
      hasMultipleImages: false,
      avatars: [
        { type: 'image' as const, value: imgAvatarPlaceholderChangeImageHere  }
      ]
    },
    { 
      id: "58", 
      type: "Expenses (Local)", 
      date: "1/12/2025", 
      description: "Office supplies and equipment", 
      amount: "350.00 EUR", 
      badge: null,
      image: imgImagePlaceholderChangeImageHere1,
      hasMultipleImages: true,
      avatars: [
        { type: 'image' as const, value: imgAvatarPlaceholderChangeImageHere },
        { type: 'initial' as const, value: 'JD', backgroundColor: '#0d6efd', textColor: 'white' }
      ]
    },
    { 
      id: "57", 
      type: "Expenses (Foreign)", 
      date: "1/8/2025", 
      description: "Conference in Berlin", 
      amount: "1,850.00 EUR", 
      badge: "Returned",
      image: imgImagePlaceholderChangeImageHere,
      hasMultipleImages: true,
      avatars: [
        { type: 'image' as const, value: imgAvatarPlaceholderChangeImageHere1 },
        { type: 'image' as const, value: imgAvatarPlaceholderChangeImageHere2 },
        { type: 'initial' as const, value: 'AB', backgroundColor: '#dc3545', textColor: 'white' }
      ]
    },
    { 
      id: "56", 
      type: "Expenses (Local)", 
      date: "1/5/2025", 
      description: "Team lunch and catering", 
      amount: "420.00 EUR", 
      badge: null,
      image: imgImagePlaceholderChangeImageHere1,
      hasMultipleImages: false,
      avatars: [
        { type: 'initial' as const, value: 'MK', backgroundColor: '#fd7e14', textColor: 'white' },
        { type: 'initial' as const, value: 'LC', backgroundColor: '#20c997', textColor: 'white' },
        { type: 'image' as const, value: imgAvatarPlaceholderChangeImageHere }
      ]
    }
  ];

  // Simulate loading on mount
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000); // 3 second loading simulation
    
    return () => clearTimeout(timer);
  }, []);

  // Check if device is mobile on mount and window resize
  useEffect(() => {
    const checkIsMobile = () => {
      const mobile = window.innerWidth < 768; // md breakpoint
      setIsMobile(mobile);
      // Force stacked view on mobile
      if (mobile && viewMode === 'grid') {
        setViewMode('stacked');
      }
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, [viewMode]);

  // Get current view mode (force stacked on mobile)
  const currentViewMode = isMobile ? 'stacked' : viewMode;

  // View mode functions
  const toggleViewMode = () => {
    // Prevent toggling to grid mode on mobile
    if (isMobile) return;
    
    setViewMode(viewMode === 'stacked' ? 'grid' : 'stacked');
  };

  const toggleFormSelection = (formId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const newSelection = new Set(selectedForms);
    if (newSelection.has(formId)) {
      newSelection.delete(formId);
    } else {
      newSelection.add(formId);
    }
    setSelectedForms(newSelection);
  };

  const isAllSelected = selectedForms.size === 8; // Total number of forms
  const isPartiallySelected = selectedForms.size > 0 && selectedForms.size < 8;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedForms(new Set());
    } else {
      setSelectedForms(new Set(['63', '62', '61', '60', '59', '58', '57', '56']));
    }
  };

  // Split button handlers
  const handleMainAction = () => {
    // Default action when main button is clicked without dropdown
    // Navigate to create the first form type
    onFormTypeSelect('Expenses (Foreign)');
  };

  const handleHistoryItemSelect = (item: string) => {
    alert(`Selected: ${item}`);
    // In a real implementation, this would handle the history/menu item action
  };

  // Bulk action functions
  const handleBulkUpdate = () => {
    alert(`Bulk update ${selectedForms.size} selected form${selectedForms.size !== 1 ? 's' : ''}`);
  };

  const handleBulkCopy = () => {
    const count = selectedForms.size;
    const formText = count !== 1 ? 'forms' : 'form';
    toast.success(`Successfully copied ${count} ${formText}`);
  };

  const handleBulkSplit = () => {
    const count = selectedForms.size;
    const formText = count !== 1 ? 'forms' : 'form';
    toast.success(`Successfully split ${count} ${formText}`);
  };

  const handleBulkDelete = () => {
    const count = selectedForms.size;
    const formText = count !== 1 ? 'forms' : 'form';
    toast.error(`Deleted ${count} ${formText}`);
    // Clear selection after delete
    setSelectedForms(new Set());
    setShowDeleteDialog(false);
  };

  const toggleGroup = (groupId: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupId)) {
      newExpanded.delete(groupId);
    } else {
      newExpanded.add(groupId);
    }
    setExpandedGroups(newExpanded);
  };

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

  const NavigationGroupItem = ({ icon, label, groupId, active = false, subItems = [] }: { 
    icon: string, 
    label: string, 
    groupId: string, 
    active?: boolean,
    subItems?: { label: string, active?: boolean }[]
  }) => {
    const isExpanded = expandedGroups.has(groupId);
    // Check if any sub-item is active
    const hasActiveSubItem = subItems.some(item => item.active);
    // Highlight master node only when sidebar is collapsed and group is active
    // In expanded state, always use foreground color even if sub-item is active
    const shouldHighlightMaster = active && !sidebarOpen;
    
    // Get the appropriate icon component based on groupId
    const IconComponent = groupId === 'forms' ? FileText : Cog;
    
    const content = (
      <div 
        className={`flex flex-row items-center hover:bg-sidebar-accent rounded group cursor-pointer w-full h-9 ${sidebarOpen ? 'gap-2.5 p-2.5' : 'md:justify-center md:p-2'}`}
        onClick={() => sidebarOpen && toggleGroup(groupId)}
      >
        <div className="size-5 shrink-0">
          <IconComponent className={`size-full group-hover:text-sidebar-primary transition-all ${shouldHighlightMaster ? 'drop-shadow-sm text-sidebar-primary' : 'text-sidebar-foreground'}`} />
        </div>
        {sidebarOpen && (
          <span className={`text-sm whitespace-nowrap flex-1 group-hover:text-sidebar-primary ${shouldHighlightMaster ? 'text-sidebar-primary font-medium' : 'text-sidebar-foreground'}`}>
            {label}
          </span>
        )}
        {sidebarOpen && (
          <div className={`transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}>
<ChevronRight className="size-4" />
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
            sideOffset={6}
            showArrow={false}
            className="bg-popover border border-sidebar-border shadow-lg rounded-lg p-0 min-w-[200px]"
          >
            <div className="py-2">
              <div className="px-3 py-2 font-medium text-sidebar-foreground border-b border-sidebar-border">
                {label}
              </div>
              <div className="py-1">
                {subItems.map((item) => (
                  <div 
                    key={item.label}
                    className={`px-3 py-2 pl-6 cursor-pointer transition-colors hover:bg-sidebar-accent ${
                      item.active 
                        ? 'text-sidebar-primary font-medium hover:text-sidebar-primary' 
                        : 'text-sidebar-foreground hover:text-sidebar-primary'
                    }`}
                    onClick={() => onNavigationClick?.(item.label)}
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

  const NavigationSubItem = ({ label, active = false }: { label: string, active?: boolean }) => {
    const content = (
      <div 
        className={`flex flex-row items-center hover:bg-sidebar-accent rounded group cursor-pointer w-full ${sidebarOpen ? 'gap-2.5 p-2.5 pl-12' : 'md:justify-center md:p-2'}`}
        onClick={() => onNavigationClick?.(label)}
      >
        <span className={`text-sm whitespace-nowrap transition-opacity duration-300 group-hover:text-sidebar-primary ${
          sidebarOpen ? 'opacity-100' : 'md:opacity-0 md:w-0 md:overflow-hidden'
        } ${active ? 'text-sidebar-primary font-medium' : 'text-sidebar-foreground'}`}>
          {label}
        </span>
      </div>
    );

    // On desktop, wrap with tooltip when collapsed
    if (!isMobile && !sidebarOpen) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            {content}
          </TooltipTrigger>
          <TooltipContent 
            side="right" 
            showArrow={false}
            className="bg-popover border border-sidebar-border shadow-lg text-popover-foreground"
          >
            <p>{label}</p>
          </TooltipContent>
        </Tooltip>
      );
    }

    return content;
  };

  const SkeletonCard = () => {
    return (
      <div className="bg-sidebar relative rounded-[10px] w-full border border-sidebar shadow-[0_0_12px_rgba(0,0,0,0.06)]">
        <div className="flex flex-row gap-4 items-top justify-start p-4">
          {/* Checkbox skeleton */}
          <div className="flex flex-col gap-[15px] h-20 items-start justify-start overflow-clip pb-[5px] pt-1 px-1">
            <div className="relative rounded size-4 bg-muted animate-pulse" />
          </div>

          {/* Image skeleton */}
          <div className="relative rounded-[10px] size-20 border border-border bg-muted animate-pulse" />

          {/* Content skeleton */}
          <div className="basis-0 flex flex-col gap-4 grow items-start justify-start px-0 py-0 self-stretch">
            <div className="flex flex-row items-start justify-between w-full">
              <div className="h-4 bg-muted rounded w-32 animate-pulse" />
              <div className="h-5 bg-muted rounded w-16 animate-pulse" />
            </div>
            <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
            <div className="flex flex-row items-end justify-between w-full">
              <div className="flex flex-row gap-1">
                <div className="size-8 rounded-full bg-muted animate-pulse" />
                <div className="size-8 rounded-full bg-muted animate-pulse" />
                <div className="size-8 rounded-full bg-muted animate-pulse" />
              </div>
              <div className="h-4 bg-muted rounded w-20 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const SkeletonGridView = () => {
    return (
      <div className="w-full">
        <div className="bg-sidebar rounded-[10px] border border-border overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-7 gap-4 p-4 bg-muted border-b border-border">
            <div className="flex items-center">
              <span className="font-medium text-sm text-muted-foreground">Type</span>
            </div>
            <div className="font-medium text-sm text-muted-foreground">Form ID</div>
            <div className="font-medium text-sm text-muted-foreground">Date</div>
            <div className="font-medium text-sm text-muted-foreground">Description</div>
            <div className="font-medium text-sm text-muted-foreground">Workflow</div>
            <div className="font-medium text-sm text-muted-foreground">Amount</div>
            <div className="font-medium text-sm text-muted-foreground">Actions</div>
          </div>

          {/* Skeleton Rows */}
          {[...Array(6)].map((_, index) => (
            <div key={index} className="grid grid-cols-7 gap-4 p-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="size-4 rounded bg-muted animate-pulse" />
                <div className="h-4 bg-muted rounded w-24 animate-pulse" />
              </div>
              <div className="flex items-center">
                <div className="h-4 bg-muted rounded w-12 animate-pulse" />
              </div>
              <div className="flex items-center">
                <div className="h-4 bg-muted rounded w-16 animate-pulse" />
              </div>
              <div className="flex items-center">
                <div className="h-4 bg-muted rounded w-32 animate-pulse" />
              </div>
              <div className="flex items-center gap-1">
                <div className="size-8 rounded-full bg-muted animate-pulse" />
                <div className="size-8 rounded-full bg-muted animate-pulse" />
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 bg-muted rounded w-20 animate-pulse" />
              </div>
              <div className="flex items-center">
                <div className="h-8 bg-muted rounded w-16 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const FormCard = ({ 
    id, 
    type, 
    date, 
    description, 
    amount, 
    avatars, 
    badge, 
    image, 
    hasMultipleImages 
  }: {
    id: string;
    type: string;
    date: string;
    description: string;
    amount: string;
    avatars: Avatar[];
    badge?: string;
    image: string;
    hasMultipleImages?: boolean;
  }) => {
    const isSelected = selectedForms.has(id);
    
    return (
      <div 
        className={`bg-sidebar relative rounded-[10px] w-full border ${isSelected ? 'border-primary' : 'border-sidebar'} cursor-pointer shadow-[0_0_12px_rgba(0,0,0,0.06)] transition-all`}
        onClick={() => onFormClick(id)}
      >
        <div className="flex flex-row gap-4 p-4 overflow-hidden">
          {/* Checkbox */}
          <div 
            className={`rounded size-4 border cursor-pointer flex items-center justify-center mt-1 flex-shrink-0 ${
              isSelected 
                ? 'bg-primary border-primary' 
                : 'bg-card border-primary hover:border-2'
            }`}
            onClick={(e) => toggleFormSelection(id, e)}
          >
            {isSelected && <Check className="size-4 text-primary-foreground" />}
          </div>

          <div className="flex flex-col gap-4 flex-grow min-w-0">
            <div className="flex flex-row gap-4 items-start justify-start min-w-0">
              {/* Image */}
              <div className="relative rounded-[10px] size-20 border border-border flex-shrink-0">
                <div
                  className="absolute bg-[position:50%_50%] bg-[rgba(0,0,0,0.9)] bg-contain inset-0 rounded-[10px]"
                  style={{ backgroundImage: `url('${image}')` }}
                />
                {hasMultipleImages && (
                  <div className="absolute flex flex-col font-['Roboto:Regular',_sans-serif] font-normal justify-center leading-[0] left-1/2 top-1/2 size-20 text-[#ffffff] text-[16px] text-center -translate-x-1/2 -translate-y-1/2">
                    <p className="block leading-[1.5]">+1</p>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="basis-0 flex flex-col gap-4 grow items-start justify-start px-0 py-0 self-stretch min-w-0">
                <div className="flex flex-row items-start justify-between w-full min-w-0 gap-2">
                  <div className="text-primary text-sm flex-shrink-0">{type}</div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {badge && (
                      <div className="bg-destructive text-destructive-foreground text-xs px-2 py-1 rounded whitespace-nowrap">
                        {badge}
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-foreground text-sm flex items-center gap-2 flex-nowrap overflow-hidden min-w-0 w-full">
                  <span className="whitespace-nowrap flex-shrink-0">#{id}</span>
                  {date && (
                    <>
                      <span className="border-l border-border self-stretch flex-shrink-0"></span>
                      <span className="whitespace-nowrap flex-shrink-0">{date}</span>
                    </>
                  )}
                  {description && (
                    <>
                      <span className="border-l border-border self-stretch flex-shrink-0"></span>
                      <span className="truncate min-w-0 block">{description}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            {/* Avatars and Amount - Full Width Row */}
            <div className="flex flex-row items-center justify-between w-full min-w-0 gap-2">
              <div className="flex flex-row items-center justify-start min-w-0">
                <AvatarGroup avatars={avatars} size="md" uniquePrefix={`form-${id}`} />
              </div>
              <div className="font-bold text-foreground text-xs text-center flex-shrink-0 whitespace-nowrap">
                {amount}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const GridViewComponent = () => {
    return (
      <div className="w-full">
        <div className="bg-sidebar rounded-[10px] border border-border overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-7 gap-4 p-4 bg-muted border-b border-border">
            <div className="flex items-center">
              <span className="font-medium text-sm text-muted-foreground">Type</span>
            </div>
            <div className="font-medium text-sm text-muted-foreground">Form ID</div>
            <div className="font-medium text-sm text-muted-foreground">Date</div>
            <div className="font-medium text-sm text-muted-foreground">Description</div>
            <div className="font-medium text-sm text-muted-foreground">Workflow</div>
            <div className="font-medium text-sm text-muted-foreground">Amount</div>
            <div className="font-medium text-sm text-muted-foreground">Actions</div>
          </div>

          {/* Rows */}
          {formsData.map((form) => {
            const isSelected = selectedForms.has(form.id);

            return (
              <div 
                key={form.id} 
                className={`grid grid-cols-7 gap-4 p-4 border-b border-border ${isSelected ? 'bg-accent' : 'hover:bg-muted'} transition-colors cursor-pointer`}
                onClick={() => onFormClick(form.id)}
              >
                {/* Type */}
                <div className="flex items-center">
                  <div 
                    className={`relative rounded size-4 border cursor-pointer flex items-center justify-center mr-3 ${
                      isSelected 
                  ? 'bg-primary border-primary' 
                  : 'bg-card border-primary hover:border-2'
                    }`}
                    onClick={(e) => toggleFormSelection(form.id, e)}
                  >
                    {isSelected && (
                      <Check className="size-3 text-primary-foreground" />
                    )}
                  </div>
                  <span className="text-primary text-sm">{form.type}</span>
                </div>

                {/* Form ID */}
                <div className="flex items-center">
                  <span className="text-sm text-foreground">#{form.id}</span>
                </div>

                {/* Date */}
                <div className="flex items-center">
                  <span className="text-sm text-foreground">{form.date}</span>
                </div>

                {/* Description */}
                <div className="flex items-center">
                  <span className="text-sm text-foreground">{form.description || "-"}</span>
                </div>

                {/* Avatars */}
                <div className="flex items-center">
                  <AvatarGroup avatars={form.avatars} size="md" uniquePrefix={`grid-form-${form.id}`} />
                </div>

                {/* Amount */}
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-foreground">{form.amount}</span>
                  {form.badge && (
                    <div className="bg-destructive text-destructive-foreground text-xs px-2 py-1 rounded">
                      {form.badge}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 px-3 text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      onFormClick(form.id);
                    }}
                  >
                    <Edit className="size-3 mr-1" />
                    Open
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <TooltipProvider>
      <div className="bg-background size-full relative">
        {/* Mobile Navbar */}
        <MobileNavbar 
          showBackButton={false}
          onMenuClick={onMobileMenuClick || onToggleSidebar}
          pageTitle="Entry"
          themeMode={themeMode}
          handleThemeModeClick={handleThemeModeClick}
          getThemeIcon={getThemeIcon}
        />

        {/* Mobile Overlay - Only show when sidebar is open */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/25 z-[45] md:hidden"
            onClick={() => onToggleSidebar()}
          />
        )}

        <div className="flex size-full relative bg-background">
          {/* Sidebar */}
          <div className={`
            bg-sidebar flex flex-col justify-between border border-sidebar-border z-50 transition-colors duration-300 ease-in-out
            ${sidebarOpen ? 'translate-y-0' : '-translate-y-full'}
            ${sidebarOpen ? 'md:w-[250px]' : 'md:w-[50px]'}
            md:translate-y-0 md:translate-x-0
            md:fixed md:left-0 md:top-0 md:h-full md:border-l-0 md:border-t-0 md:border-b-0 md:rounded-none
            fixed left-0 right-0 w-full shrink-0 top-mobile-nav h-mobile-sidebar
            p-4 md:px-2.5 md:py-2.5
          `}>
            {/* Navigation Items */}
            <div className="space-y-1.5 w-full">
              {/* Collapse Button with Logo - Desktop Only */}
              <div className="hidden md:block mb-1">
                {!isMobile && !sidebarOpen ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={onToggleSidebar}
                        className={`flex flex-row items-center hover:bg-sidebar-accent rounded group cursor-pointer transition-colors duration-300 ease-in-out h-9 ${sidebarOpen ? 'gap-2.5 p-2.5' : 'md:justify-center md:p-2'}`}
                        data-no-preview="true"
                        draggable="false"
                        onContextMenu={(e) => e.preventDefault()}
                      >
                        <div className="size-5 shrink-0">
                          {sidebarOpen ? (
                            <PanelRightClose className="size-5 text-sidebar-foreground group-hover:text-sidebar-primary" />
                          ) : (
                            <PanelRightClose className="size-5 text-sidebar-foreground group-hover:text-sidebar-primary" />
                          )}
                        </div>
                        {sidebarOpen ? (
                          <div className="h-[18px] w-[118px] max-w-full">
                            <SystemsWorkTransparentNoEdges1 />
                          </div>
                        ) : (
                          <span className="opacity-0 w-0 overflow-hidden">
                            Expand
                          </span>
                        )}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent 
                      side="right"
                      align="center"
                      alignOffset={0}
                      sideOffset={6}
                      showArrow={false}
                      className="bg-popover border border-sidebar-border shadow-lg text-popover-foreground"
                    >
                      <p>Expand sidebar</p>
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <div className={`flex flex-row items-center rounded group cursor-default transition-colors duration-300 ease-in-out ${sidebarOpen ? 'gap-1' : 'md:justify-center md:p-2'}`}>
                    <button
                      onClick={onToggleSidebar}
                      className={`flex flex-row items-center hover:bg-sidebar-accent rounded group cursor-pointer transition-colors duration-300 ease-in-out h-9 ${sidebarOpen ? 'gap-2.5 p-2.5' : 'md:justify-center md:p-2'}`}
                      data-no-preview="true"
                      draggable="false"
                      onContextMenu={(e) => e.preventDefault()}
                    >
                      <div className="size-5 shrink-0">
                        {sidebarOpen ? (
                          <PanelRightOpen className="size-5 text-sidebar-foreground group-hover:text-sidebar-primary" />
                        ) : (
                          <PanelRightOpen className="size-5 text-sidebar-foreground group-hover:text-sidebar-primary" />
                        )}
                      </div>
                    </button>
                    <span className="overflow-hidden">
                      expense@work
                    </span>
                  </div>
                )}
              </div>

              <div className="h-4 shrink-0 w-full hidden md:flex items-center ">
                <div className="h-px bg-sidebar-border w-full" />
              </div>
              
              {/* Forms Group */}
              <NavigationGroupItem 
                icon={svgPaths.p2973b500} 
                label="Forms" 
                groupId="forms" 
                active={true}
                subItems={[
                  { label: "Entry", active: true },
                  { label: "Authorization" }
                ]}
              />
              {sidebarOpen && expandedGroups.has('forms') && (
                <div className="space-y-1">
                  <NavigationSubItem label="Entry" active={true} />
                  <NavigationSubItem label="Authorization" />
                </div>
              )}
              

              
              {/* Admin Group */}
              <NavigationGroupItem 
                icon={svgPaths.p3ad82f80} 
                label="Admin" 
                groupId="admin"
                subItems={[
                  { label: "Approval Profiles" },
                  { label: "Status Inquiry/Purge" },
                  { label: "Ledger Modification" },
                  { label: "Planning" },
                  { label: "Ledger Export" },
                  { label: "Inquiry Profiles" },
                  { label: "Employees" },
                  { label: "Exp.Groups/Exp.Types/Reasons" },
                  { label: "Analysis" },
                  { label: "Data Import" },
                  { label: "Archiving" }
                ]}
              />
              {sidebarOpen && expandedGroups.has('admin') && (
                <div className="space-y-1">
                  <NavigationSubItem label="Approval Profiles" />
                  <NavigationSubItem label="Status Inquiry/Purge" />
                  <NavigationSubItem label="Ledger Modification" />
                  <NavigationSubItem label="Planning" />
                  <NavigationSubItem label="Ledger Export" />
                  <NavigationSubItem label="Inquiry Profiles" />
                  <NavigationSubItem label="Employees" />
                  <NavigationSubItem label="Exp.Groups/Exp.Types/Reasons" />
                  <NavigationSubItem label="Analysis" />
                  <NavigationSubItem label="Data Import" />
                  <NavigationSubItem label="Archiving" />
                </div>
              )}
            </div>

            {/* User Menu - Hidden on mobile */}
            {!isMobile && (
              <div className="mt-4 pt-4 border-t border-sidebar-border">
                <div className="w-full">
                  {!isMobile && !sidebarOpen ? (
                    // Collapsed state - show just avatar with dropdown
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button 
                          className="flex items-center justify-center w-full h-9 p-2 hover:bg-sidebar-accent rounded transition-colors duration-300 easy-in-out"
                          data-no-preview="true"
                          draggable="false"
                          onContextMenu={(e) => e.preventDefault()}
                        >
                          <div className="size-8 rounded-full overflow-hidden border border-sidebar-border flex-shrink-0">
                            <img 
                              src={imgAvatarPlaceholderChangeImageHere} 
                              alt="User avatar"
                              className="w-full h-full object-cover"
                              data-no-preview="true"
                              draggable="false"
                              onContextMenu={(e) => e.preventDefault()}
                            />
                          </div>
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent 
                        side="top" 
                        align="start"
                        sideOffset={8}
                        className="w-56 bg-popover border border-sidebar-border shadow-lg"
                      >
                        <DropdownMenuLabel className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div>
                              <div className="text-sm font-medium text-popover-foreground">Stephen Hill</div>
                              <div className="text-xs text-muted-foreground">stephen.hill@pso.com</div>
                            </div>
                          </div>
                        </DropdownMenuLabel>
                        
                        <DropdownMenuSeparator />
                        
                        <DropdownMenuItem 
                          className="flex items-center justify-between px-4 py-2 cursor-pointer"
                          onClick={handleThemeModeClick}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-sm">Switch Mode</span>
                          </div>
                          {(() => {
                            const IconComponent = getThemeIconComponent();
                            return <IconComponent className="size-4" />;
                          })()}
                        </DropdownMenuItem>
                        
                        <DropdownMenuSeparator />
                        
                        <DropdownMenuItem className="flex items-center gap-3 px-4 py-2 cursor-pointer">
                          <span className="text-sm">Sign Out</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    // Expanded state - show full user info
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button 
                          className="flex items-center gap-3 w-full h-9 p-2 hover:bg-sidebar-accent rounded transition-colors duration-300 easy-in-out"
                          data-no-preview="true"
                          draggable="false"
                          onContextMenu={(e) => e.preventDefault()}
                        >
                          <div className="size-8 rounded-full overflow-hidden border border-sidebar-border flex-shrink-0">
                            <img 
                              src={imgAvatarPlaceholderChangeImageHere} 
                              alt="User avatar"
                              className="w-full h-full object-cover"
                              data-no-preview="true"
                              draggable="false"
                              onContextMenu={(e) => e.preventDefault()}
                            />
                          </div>
                            <div className="flex-1 text-left transition-colors duration-300 easy-in-out">
                              <div className="text-sm font-medium text-sidebar-foreground leading-tight">Stephen Hill</div>
                          </div>
                        </button>
                      </DropdownMenuTrigger>
                     <DropdownMenuContent 
                        side="top" 
                        align="start"
                        sideOffset={8}
                        className="w-56 bg-popover border border-sidebar-border shadow-lg"
                      >
                        <DropdownMenuLabel className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div>
                              <div className="text-sm font-medium text-popover-foreground">Stephen Hill</div>
                              <div className="text-xs text-muted-foreground">stephen.hill@pso.com</div>
                            </div>
                          </div>
                        </DropdownMenuLabel>
                        
                        <DropdownMenuSeparator />
                        
                        <DropdownMenuItem 
                          className="flex items-center justify-between px-4 py-2 cursor-pointer"
                          onClick={handleThemeModeClick}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-sm">Switch Mode</span>
                          </div>
                          {(() => {
                            const IconComponent = getThemeIconComponent();
                            return <IconComponent className="size-4" />;
                          })()}
                        </DropdownMenuItem>
                        
                        <DropdownMenuSeparator />
                        
                        <DropdownMenuItem className="flex items-center gap-3 px-4 py-2 cursor-pointer">
                          <span className="text-sm">Sign Out</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className={`flex-1 h-screen overflow-x-hidden transition-all duration-300 ease-in-out ${sidebarOpen ? 'md:ml-[250px]' : 'md:ml-[50px]'} pt-mobile-nav md:pt-0`}>
            <div className="pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] md:px-4 md:pl-[max(1rem,env(safe-area-inset-left))] md:pr-[max(1rem,env(safe-area-inset-right))] h-full flex flex-col overflow-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden bg-background">
              {/* Header */}
              <div className="hidden md:block">
                <div className="flex flex-row items-center justify-between max-h-[51px] py-4.5 w-full border-b">
                  {/* Title */}
                  <div>
                    <h1 className="font-semibold text-foreground">Entry</h1>
                  </div>

                  {/* Desktop Action Buttons */}
                  <div className="flex flex-row items-center gap-2">
                    <div className="hidden md:block">
                      <SplitButton 
                        onMainAction={onMainAction}
                        onFormTypeSelect={onFormTypeSelect}
                        onHistoryItemSelect={onHistoryItemSelect}
                      />
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          className="px-2 cursor-pointer hidden md:flex h-9 md:text-sm"
                        >
                          <MoreVertical className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel className="text-xs text-muted-foreground px-2 py-1.5">
                          Recent Forms
                        </DropdownMenuLabel>
                        {formsData.slice(0, 3).map((form) => (
                          <DropdownMenuItem
                            key={form.id}
                            onClick={() => onHistoryItemSelect?.(form.id)}
                            className="cursor-pointer flex flex-col items-start px-3 py-2"
                          >
                            <div className="flex items-center justify-between w-full">
                              <span className="text-sm">#{form.id} {form.type}</span>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {form.description || 'No description'} • {form.date}
                            </span>
                          </DropdownMenuItem>
                        ))}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer justify-center">
                          Full Forms History
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>

              {/* Mobile Header */}
              <div className="hidden">
                <div className="flex flex-row items-center justify-end py-4 md:max-h-[51px] border-b">
                  <div className="flex items-center gap-2">
                    {/* Mobile Create Form Button - Bottom Sheet */}
                    <>
                      <Button
                        className="bg-primary cursor-pointer hover:bg-primary/90 text-primary-foreground px-4 h-11"
                        onClick={() => setIsCreateFormSheetOpen(true)}
                      >
                        <Edit className="size-5" />
                      </Button>
                      
                      <Sheet open={isCreateFormSheetOpen} onOpenChange={setIsCreateFormSheetOpen}>
                        <SheetContent side="bottom" className="px-0">
                          <SheetHeader className="px-4 pb-4">
                            <SheetTitle>Create New Form</SheetTitle>
                            <SheetDescription>
                              Select the type of form you want to create
                            </SheetDescription>
                          </SheetHeader>
                          <div className="flex flex-col">
                            {["Expenses (Foreign)", "Expenses (Local)", "Travel Request", "Reimbursement", "Purchase Order", "Invoice"].map((formType) => (
                              <button
                                key={formType}
                                onClick={() => {
                                  onFormTypeSelect(formType);
                                  setIsCreateFormSheetOpen(false);
                                }}
                                className="flex items-center px-4 py-4 text-left hover:bg-accent transition-colors border-b border-border last:border-b-0"
                              >
                                <span className="text-base">{formType}</span>
                              </button>
                            ))}
                          </div>
                        </SheetContent>
                      </Sheet>
                    </>
                    
                    {/* Mobile History Button - Bottom Sheet */}
                    <>
                      <Button
                        variant="outline"
                        className="px-4 cursor-pointer h-11"
                        onClick={() => setIsHistorySheetOpen(true)}
                      >
                        <MoreVertical className="size-5" />
                      </Button>
                      
                      <Sheet open={isHistorySheetOpen} onOpenChange={setIsHistorySheetOpen}>
                        <SheetContent side="bottom" className="px-0">
                          <SheetHeader className="px-4 pb-4">
                            <SheetTitle>Recent Forms</SheetTitle>
                            <SheetDescription>
                              View your recently accessed forms
                            </SheetDescription>
                          </SheetHeader>
                          <div className="flex flex-col">
                            {formsData.slice(0, 3).map((form) => (
                              <button
                                key={form.id}
                                onClick={() => {
                                  onHistoryItemSelect?.(form.id);
                                  setIsHistorySheetOpen(false);
                                }}
                                className="flex flex-col items-start px-4 py-4 text-left hover:bg-accent transition-colors border-b border-border"
                              >
                                <div className="flex items-center justify-between w-full">
                                  <span className="text-base">#{form.id} {form.type}</span>
                                </div>
                                <span className="text-sm text-muted-foreground mt-1">
                                  {form.description || 'No description'} • {form.date}
                                </span>
                              </button>
                            ))}
                            <button
                              onClick={() => {
                                // Handle full history view
                                setIsHistorySheetOpen(false);
                              }}
                              className="flex items-center justify-center px-4 py-4 text-left hover:bg-accent transition-colors"
                            >
                              <span className="text-base font-medium">Full Forms History</span>
                            </button>
                          </div>
                        </SheetContent>
                      </Sheet>
                    </>
                  </div>
                </div>
              </div>

              {/* Controls Bar */}
              <div className="relative mx-auto flex h-full w-full max-w-7xl px-4 md:px-2 flex-0 flex-col">
                <div className="flex flex-row items-center justify-between py-4.5 w-full border-b">
                  <div className="flex items-center gap-2 bg-sidebar hover:bg-sidebar-accent rounded-lg px-3 h-10 border-0 shadow-[0_0_12px_rgba(0,0,0,0.06)]">
                    <div 
                      className={`relative rounded size-4 border cursor-pointer flex items-center justify-center ${
                        isAllSelected 
                          ? 'bg-primary border-primary' 
                          : isPartiallySelected
                          ? 'bg-accent border-primary'
                          : 'bg-card border-primary hover:border-2'
                      }`}
                      onClick={toggleSelectAll}
                    >
                      {isAllSelected && (
                        <Check className="size-4 text-primary-foreground" />
                      )}
                      {isPartiallySelected && !isAllSelected && (
                        <div className="size-2 bg-primary" />
                      )}
                    </div>
                    <label 
                      className="text-sm cursor-pointer select-none"
                      onClick={toggleSelectAll}
                    >
                      {isAllSelected || isPartiallySelected ? (
                        <>
                          <span className="md:hidden">{selectedForms.size} Selected</span>
                          <span className="hidden md:inline">Select All</span>
                        </>
                      ) : (
                        "Select All"
                      )}
                    </label>
                  </div>

                  <div className="flex-1" />

                  {/* Bulk Actions - Show when forms are selected */}
                  {selectedForms.size > 0 && (
                    <div className="flex items-center gap-2 h-10">
                      <Button
                        variant="ghost"
                        onClick={() => setShowDeleteDialog(true)}
                        className="cursor-pointer h-10 px-4 text-sm bg-sidebar hover:!bg-sidebar-accent border-0 shadow-[0_0_12px_rgba(0,0,0,0.06)]"
                      >
                        <Trash2 className="size-5 md:mr-1.5 text-destructive" />
                        <span className="hidden md:inline">Delete</span>
                      </Button>
                    </div>
                  )}
                  
                  {/* Mobile Action Buttons - show when no forms are selected */}
                  {selectedForms.size === 0 && (
                    <div className="md:hidden flex items-center gap-2">
                      <Button
                        className="bg-sidebar cursor-pointer hover:!bg-sidebar-accent px-4 h-10 border-0 shadow-[0_0_12px_rgba(0,0,0,0.06)]"
                        onClick={() => setIsCreateFormSheetOpen(true)}
                      >
                        <Edit className="size-5 text-primary" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        className="px-4 cursor-pointer h-10 bg-sidebar hover:!bg-sidebar-accent border-0 shadow-[0_0_12px_rgba(0,0,0,0.06)]"
                        onClick={() => setIsHistorySheetOpen(true)}
                      >
                        <MoreVertical className="size-5" />
                      </Button>
                    </div>
                  )}
                  
                  {/* View Toggle Buttons - only show on desktop when no forms are selected */}
                  {selectedForms.size === 0 && (
                    <div className="hidden md:flex flex-row h-9 items-center justify-center bg-sidebar-accent rounded-lg relative shadow-[0_0_12px_rgba(0,0,0,0.06)]">
                      <div 
                        className="absolute h-9 bg-sidebar rounded-lg transition-transform duration-200 ease-in-out left-0 shadow-[0_0_12px_rgba(0,0,0,0.06)]"
                        style={{
                          width: '50%',
                          transform: currentViewMode === 'stacked' ? 'translateX(0)' : 'translateX(100%)'
                        }}
                      />
                      <button
                        onClick={toggleViewMode}
                        className={`h-9 px-3 rounded-lg text-sm cursor-pointer transition-colors duration-200 flex items-center gap-1.5 relative z-10 flex-1 justify-center ${
                          currentViewMode === 'stacked' 
                                ? 'text-sidebar-primary font-medium' 
                                : 'text-sidebar-foreground font-normal hover:text-sidebar-primary'
                        }`}
                      >
                        <List className="size-5" />
                        List
                      </button>
                      <button
                        onClick={toggleViewMode}
                        className={`h-9 px-3 rounded-lg cursor-pointer text-sm transition-colors duration-200 flex items-center gap-1.5 relative z-10 flex-1 justify-center ${
                          currentViewMode === 'grid' 
                                ? 'text-sidebar-primary font-medium' 
                                : 'text-sidebar-foreground font-normal hover:text-sidebar-primary'
                        }`}
                      >
                        <Grid3x3 className="size-5" />
                        Grid
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="relative mx-auto flex w-full max-w-7xl flex-1 overflow-hidden">
                {/* Scrollable content */}
                <div className="h-full w-full overflow-y-auto pt-4 px-4 md:px-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {isLoading ? (
                    currentViewMode === 'stacked' ? (
                      <div className="space-y-4 pb-[calc(env(safe-area-inset-bottom)+1rem)]">
                        {/* Skeleton Cards */}
                        {[...Array(6)].map((_, index) => (
                          <SkeletonCard key={index} />
                        ))}
                      </div>
                    ) : (
                      <div className="pb-[calc(env(safe-area-inset-bottom)+1rem)]">
                        <SkeletonGridView />
                      </div>
                    )
                  ) : (
                    currentViewMode === 'stacked' ? (
                      <div className="space-y-4 pb-[calc(env(safe-area-inset-bottom)+4rem)]">
                        {/* Forms */}
                        {formsData.map((form) => (
                          <FormCard 
                            key={form.id}
                            id={form.id}
                            type={form.type}
                            date={form.date}
                            description={form.description}
                            amount={form.amount}
                            avatars={form.avatars}
                            badge={form.badge}
                            image={form.image}
                            hasMultipleImages={form.hasMultipleImages}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="pb-[calc(env(safe-area-inset-bottom)+4rem)]">
                        <GridViewComponent />
                      </div>
                    )
                  )}
                </div>
                
                {/* Gradient overlay */}
                <div 
                  className="absolute bottom-0 inset-x-0 pointer-events-none z-10"
                  style={{
                    height: 'calc(env(safe-area-inset-bottom) + 48px)',
                    background: `linear-gradient(
                      to bottom,
                      transparent 0%,
                      color-mix(in srgb, var(--background) 60%, transparent) 25%,
                      color-mix(in srgb, var(--background) 90%, transparent) 50%,
                      var(--background) 75%
                    )`
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {selectedForms.size === 1 ? 'Form' : 'Forms'}?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedForms.size} {selectedForms.size === 1 ? 'form' : 'forms'}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleBulkDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </TooltipProvider>
  );
}