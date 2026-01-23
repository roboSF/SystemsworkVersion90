import { useState, useEffect, useRef } from "react";
import { Menu, X, Edit, Copy, Split, Trash2, List, Grid3x3, Check, Upload, Save, XIcon, Calendar, Settings, User, LogOut, Sun, Moon, Monitor, Cog, FileText, PanelRightOpen, PanelRightClose, ChevronRight, Plus } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "./ui/breadcrumb";
import MobileNavbar from "./MobileNavbar";
import svgPaths from "../imports/svg-l12dhogi8o";
import svgPathsContent from "../imports/svg-rexg2ojtfm";
import SystemsWorkTransparentNoEdges1 from "../imports/SystemsWorkTransparentNoEdges1";
import imgAvatarPlaceholderChangeImageHere from "figma:asset/884bf465a905d0cc5a2af7245f6b2211b9596a64.png";

interface FormCreationPageProps {
  formType: string;
  formNumber: string;
  onBackToList: () => void;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  themeMode: 'light' | 'dark' | 'system';
  handleThemeModeClick: () => void;
  getThemeIcon: () => string;
}

interface ExpenseRow {
  id: string;
  category: string;
  date: string;
  description: string;
  amount: string;
  status: 'warning' | 'error' | 'success' | 'neutral';
  badge?: string;
}

const EXPENSE_CATEGORIES = [
  "Accommodation", "Meals", "Transportation", "Mobile Phone", "Office Supplies", "Travel", "Entertainment"
];

type ViewMode = 'stacked' | 'grid';

export default function FormCreationPage({ 
  formType, 
  formNumber, 
  onBackToList, 
  sidebarOpen, 
  onToggleSidebar,
  themeMode,
  handleThemeModeClick,
  getThemeIcon
}: FormCreationPageProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('stacked');
  const [isMobile, setIsMobile] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['forms'])); // Forms expanded by default
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  // Header details state
  const [headerDetails, setHeaderDetails] = useState({
    image: imgAvatarPlaceholderChangeImageHere,
    shortDescription: "Not Selected",
    chargeTo: "Not Selected", 
    colleagues: "Not Selected",
    dateFrom: new Date().toISOString().split('T')[0],
    dateTo: new Date().toISOString().split('T')[0],
    project: "Not Selected",
    status: "Draft"
  });

  // Header modal state
  const [showHeaderModal, setShowHeaderModal] = useState(false);
  const [editHeaderData, setEditHeaderData] = useState(headerDetails);

  // Form data state for the empty row
  const [formData, setFormData] = useState({
    category: "",
    date: new Date().toISOString().split('T')[0],
    description: "",
    amount: "",
    status: "neutral" as ExpenseRow['status']
  });

  // Inline editing state for grid view
  const [editingCell, setEditingCell] = useState<{field: string} | null>(null);
  const [editValue, setEditValue] = useState('');

  // Modal editing state
  const [showEditRowModal, setShowEditRowModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    category: "",
    date: "",
    description: "",
    amount: "",
    status: "neutral" as ExpenseRow['status']
  });

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

  // View mode functions
  const toggleViewMode = () => {
    // Prevent toggling to grid mode on mobile
    if (isMobile) return;
    
    setViewMode(viewMode === 'stacked' ? 'grid' : 'stacked');
    setEditingCell(null); // Clear any editing state when switching views
  };

  const toggleRowSelection = (rowId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const newSelection = new Set(selectedRows);
    if (newSelection.has(rowId)) {
      newSelection.delete(rowId);
    } else {
      newSelection.add(rowId);
    }
    setSelectedRows(newSelection);
  };

  const isAllSelected = selectedRows.size === 1; // Only one empty row
  const isPartiallySelected = selectedRows.size > 0 && selectedRows.size < 1;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(['empty-row-1']));
    }
  };

  // Grid editing functions
  const startEditing = (field: string, currentValue: string) => {
    setEditingCell({ field });
    // For amount field, just use the current value without formatting
    if (field === 'date') {
      // Use the ISO date format for date input
      setEditValue(formData.date);
    } else {
      setEditValue(currentValue);
    }
  };

  const saveEdit = () => {
    if (!editingCell) return;
    
    const { field } = editingCell;
    let newValue = editValue;
    
    // Update the form data
    setFormData(prev => ({
      ...prev,
      [field]: newValue
    }));
    
    setEditingCell(null);
    setEditValue('');
  };

  const cancelEdit = () => {
    setEditingCell(null);
    setEditValue('');
  };

  // Header modal functions
  const openHeaderModal = () => {
    setEditHeaderData(headerDetails);
    setShowHeaderModal(true);
  };

  const closeHeaderModal = () => {
    setShowHeaderModal(false);
    setEditHeaderData(headerDetails);
  };

  const saveHeaderDetails = () => {
    setHeaderDetails(editHeaderData);
    closeHeaderModal();
  };

  // Modal functions
  const openEditRowModal = () => {
    // Convert date from ISO format to YYYY-MM-DD format for date input
    setEditFormData({
      category: formData.category,
      date: formData.date,
      description: formData.description,
      amount: formData.amount,
      status: formData.status
    });
    setShowEditRowModal(true);
  };

  const closeEditRowModal = () => {
    setShowEditRowModal(false);
    setEditFormData({
      category: "",
      date: "",
      description: "",
      amount: "",
      status: "neutral"
    });
  };

  const saveEditedRow = () => {
    // Update the main form data with edited values
    setFormData({
      category: editFormData.category,
      date: editFormData.date,
      description: editFormData.description,
      amount: editFormData.amount,
      status: editFormData.status
    });
    closeEditRowModal();
  };

  // Form data update functions
  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Bulk action functions
  const handleBulkCopy = () => {
    const count = selectedRows.size;
    const rowText = count !== 1 ? 'rows' : 'row';
    toast.success(`Successfully copied ${count} ${rowText}`);
  };

  const handleBulkSplit = () => {
    const count = selectedRows.size;
    const rowText = count !== 1 ? 'rows' : 'row';
    toast.success(`Successfully split ${count} ${rowText}`);
  };

  const handleBulkDelete = () => {
    const count = selectedRows.size;
    const rowText = count !== 1 ? 'rows' : 'row';
    toast.error(`Deleted ${count} ${rowText}`);
    // Clear selection after delete
    setSelectedRows(new Set());
  };

  const handleBulkUpdate = () => {
    alert(`Update ${selectedRows.size} selected row${selectedRows.size !== 1 ? 's' : ''}`);
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
      <div className={`flex flex-row items-center hover:bg-sidebar-accent rounded group cursor-pointer w-full ${sidebarOpen ? 'gap-2.5 p-2.5 pl-12' : 'md:justify-center md:p-2'}`}>
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

  // Form field component
  const FormField = ({ label, value = "Not Selected", hasTooltip = false }: { 
    label: string; 
    value?: string; 
    hasTooltip?: boolean;
  }) => (
    <div className="bg-[rgba(255,255,255,0)] box-border content-stretch flex flex-col h-full isolate items-start justify-center p-0 relative shrink-0">
      <div className="bg-[rgba(255,255,255,0)] box-border content-stretch flex flex-row gap-1 items-end justify-start pb-2 pt-0 px-0 relative shrink-0 w-full z-[3]">
        <div className="bg-[rgba(255,255,255,0)] box-border content-stretch flex flex-col items-start justify-center overflow-clip p-0 relative shrink-0">
          <div className="font-['Roboto:Regular',_sans-serif] font-normal leading-[0] relative shrink-0 text-[#495057] text-[14px] text-left text-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
            <p className="block leading-[1.5] whitespace-pre">{label}</p>
          </div>
        </div>
        {hasTooltip && (
          <div className="box-border content-stretch flex flex-row h-6 items-center justify-start px-0 py-[5px] relative shrink-0">
            <div className="box-border content-stretch flex flex-col items-center justify-center p-0 relative shrink-0">
              <div className="bg-[rgba(255,255,255,0)] box-border content-stretch flex flex-col items-center justify-start overflow-clip p-0 relative shrink-0">
                <div className="basis-0 grow h-full min-h-px min-w-px relative shrink-0">
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
                    <g clipPath="url(#clip0_40_103491)">
                      <path d={svgPathsContent.p2a986830} fill="var(--fill-0, #6C757D)" />
                    </g>
                    <defs>
                      <clipPath id="clip0_40_103491">
                        <rect fill="white" height="14" width="14" />
                      </clipPath>
                    </defs>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="box-border content-stretch flex flex-row items-start justify-start overflow-clip p-0 relative rounded-[3.2px] shrink-0 w-full z-[2]">
        <div className="basis-0 box-border content-stretch flex flex-row grow items-center justify-start min-h-px min-w-px overflow-clip px-0 py-1 relative rounded-[3.2px] shrink-0">
          <div className="basis-0 grow min-h-px min-w-px relative shrink-0">
            <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-row gap-1 items-center justify-start overflow-clip p-0 relative">
              <div className="flex flex-col font-['Roboto:Medium',_sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#212529] text-[14px] text-left text-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
                <p className="block leading-[1.5] whitespace-pre">{value}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Image upload component
  const ImageUploadComponent = () => (
    <div className="bg-[rgba(255,255,255,0)] relative rounded-[10px] shrink-0 size-20 cursor-pointer hover:bg-gray-50 transition-colors group">
      <div className="box-border content-stretch flex flex-row gap-2 items-center justify-center overflow-clip px-1 py-0 relative size-20">
        <div className="bg-[rgba(255,255,255,0)] box-border content-stretch flex flex-col items-center justify-center overflow-clip p-0 relative shrink-0">
          <div className="relative shrink-0 size-8">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
              <g id="wrapper">
                <path d={svgPathsContent.pe1fba00} fill="var(--fill-0, #495057)" />
              </g>
            </svg>
          </div>
        </div>
      </div>
      <div className="absolute border border-[#e3e6ed] border-solid inset-0 pointer-events-none rounded-[10px] group-hover:border-blue-400 transition-colors" />
      <input
        type="file"
        accept="image/*"
        className="absolute inset-0 opacity-0 cursor-pointer"
        onChange={(e) => {
          // Handle image upload
          console.log('Image uploaded:', e.target.files?.[0]);
        }}
      />
    </div>
  );

  // Add New Expense Button - matches EnhancedExpenseForm style
  const AddExpenseButton = () => {
    return (
      <div 
        className="border-1 border-dashed border-gray-300 rounded-[10px] cursor-pointer hover:border-blue-400 text-gray-600 hover:text-blue-600 py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors group"
        onClick={() => {
          // Reset form data for new expense creation
          setEditFormData({
            category: '',
            date: new Date().toISOString().split('T')[0],
            description: '',
            amount: '',
            status: 'neutral'
          });
          setShowEditRowModal(true);
        }}
      >
        <Plus className="size-4" />
        <span>New Line</span>
      </div>
    );
  };

  // Stacked row component - clickable to open modal (no inline editing)
  const StackedRowComponent = () => {
    const isSelected = selectedRows.has('empty-row-1');
    
    return (
      <div className="relative rounded-[10px] shrink-0 w-full cursor-pointer transition-all group">
        <div 
          className="relative size-full"
          onClick={() => openEditRowModal()}
        >
              <div className="px-4 py-4">
                {currentViewMode === 'stacked' ? (
                  <div className="space-y-4">
                    {/* Add New Expense - Stacked View */}
                    <AddExpenseButton />
                    
                    {/* Existing Single Empty Row */}
                    <div className="bg-sidebar relative rounded-[10px] shrink-0 w-full border border-border cursor-pointer hover:shadow-md transition-all group">
                      <div 
                        className="relative size-full"
                        onClick={() => openEditRowModal()}
                      >
                        <div className="box-border content-stretch flex flex-row gap-4 items-start justify-start p-[16px] relative w-full">
                          {/* Checkbox */}
                          <div className="box-border content-stretch flex flex-col gap-[15px] h-20 items-top justify-start overflow-clip pb-[5px] pt-1 px-1 relative shrink-0">
                            <div className="box-border content-stretch flex flex-col items-center justify-center p-0 relative shrink-0">
                              <div 
                                className={`relative rounded size-4 border cursor-pointer flex items-center justify-center ${
                                  isSelected 
                                    ? 'bg-primary border-primary' 
                                    : 'bg-card border-border hover:border-primary'
                                }`}
                                onClick={(e) => toggleRowSelection('empty-row-1', e)}
                              >
                                {isSelected && (
                                  <Check className="size-3 text-primary-foreground" />
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Image */}
                          <ImageUploadComponent />

                          {/* Content */}
                          <div className="basis-0 box-border content-stretch flex flex-col gap-4 grow items-start justify-start min-h-px min-w-px px-0 py-0 relative self-stretch shrink-0">
                            <div className="box-border content-stretch flex flex-row items-start justify-between p-0 relative shrink-0 w-full">
                              {/* Expense Type Display */}
                              <div className="flex flex-col font-['Roboto:Regular',_sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-primary text-[14px] text-left text-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
                                <p className="block leading-[normal] whitespace-pre">{formData.category || "Expense Type not selected"}</p>
                              </div>
                              <div className="basis-0 grow min-h-px min-w-px self-stretch shrink-0" />
                              <div className="flex items-center gap-2">
                                {/*<div className="bg-success box-border content-stretch flex flex-row items-center justify-center overflow-clip px-[7.8px] py-[4.2px] relative rounded shrink-0">
                                  <div className="flex flex-col font-['Roboto:Bold',_sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-success-foreground text-[12px] text-center text-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
                                    <p className="block leading-none whitespace-pre">Free</p>
                                  </div>
                                </div> */}
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Edit className="size-4 text-muted-foreground" />
                                </div>
                              </div>
                            </div>
                            
                            {/* Date and Description Display */}
                            <div className="box-border content-stretch flex flex-row gap-2.5 items-center justify-start p-0 relative shrink-0">
                              <div className="flex flex-col font-['Roboto:Regular',_sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-foreground text-[14px] text-left text-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
                                <p className="leading-[normal] whitespace-pre">
                                  <span className="font-['Roboto:Regular',_sans-serif] font-normal" style={{ fontVariationSettings: "'wdth' 100" }}>
                                    {formData.date ? new Date(formData.date).toLocaleDateString('en-GB') : "---"}
                                  </span>
                                  {` | ${formData.description || "---"}`}
                                </p>
                              </div>
                            </div>
                            
                            {/* Amount Display */}
                            <div className="box-border content-stretch flex flex-row items-end justify-between p-0 relative shrink-0 w-full">
                              <div className="basis-0 flex flex-row grow items-end self-stretch shrink-0">
                                <div className="basis-0 grow h-full min-h-px min-w-px shrink-0" />
                              </div>
                              <div className="flex flex-col font-['Roboto:Bold',_sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-foreground text-[12px] text-center text-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
                                <p className="block leading-none whitespace-pre">{formData.amount ? `${formData.amount} GBP` : "---"}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="px-4">
                    <GridViewComponent />
                  </div>
                )}
              </div>
        </div>
      </div>
    );
  };

  // Grid view component with editable fields
  const GridViewComponent = () => {
    return (
      <div className="w-full">
        <div className="bg-sidebar rounded-[10px] border border-border overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-6 gap-4 p-4 bg-muted border-b border-border">
            <div className="flex items-center">
              <span className="font-medium text-sm text-muted-foreground">Type</span>
            </div>
            <div className="font-medium text-sm text-muted-foreground">Date</div>
            <div className="font-medium text-sm text-muted-foreground">Description</div>
            <div className="font-medium text-sm text-muted-foreground">Amount</div>
            <div className="font-medium text-sm text-muted-foreground">Status</div>
            <div className="font-medium text-sm text-muted-foreground">Actions</div>
          </div>

          {/* Editable Row */}
          <div className="grid grid-cols-6 gap-4 p-4 border-b border-border hover:bg-muted transition-colors">
            {/* Type */}
            <div className="flex items-center">
              <div 
                className={`relative rounded size-4 border cursor-pointer flex items-center justify-center mr-3 ${
                  selectedRows.has('empty-row-1') 
                    ? 'bg-primary border-primary' 
                    : 'bg-card border-border hover:border-primary'
                }`}
                onClick={(e) => toggleRowSelection('empty-row-1', e)}
              >
                {selectedRows.has('empty-row-1') && (
                  <Check className="size-3 text-primary-foreground" />
                )}
              </div>
              {editingCell?.field === 'category' ? (
                <div className="flex items-center gap-2 flex-1">
                  <Select 
                    value={editValue} 
                    onValueChange={setEditValue}
                  >
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {EXPENSE_CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button size="sm" variant="outline" className="h-8 w-8 p-0" onClick={saveEdit}>
                    <Save className="size-3" />
                  </Button>
                  <Button size="sm" variant="outline" className="h-8 w-8 p-0" onClick={cancelEdit}>
                    <XIcon className="size-3" />
                  </Button>
                </div>
              ) : (
                <span 
                  className="text-primary text-sm cursor-pointer hover:underline whitespace-nowrap"
                  onClick={() => startEditing('category', formData.category)}
                >
                  {formData.category || "Expense Type not selected"}
                </span>
              )}
            </div>

            {/* Date */}
            <div>
              {editingCell?.field === 'date' ? (
                <div className="flex items-center gap-2">
                  <Input
                    type="date"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="h-8 text-sm"
                  />
                  <Button size="sm" variant="outline" className="h-8 w-8 p-0" onClick={saveEdit}>
                    <Save className="size-3" />
                  </Button>
                  <Button size="sm" variant="outline" className="h-8 w-8 p-0" onClick={cancelEdit}>
                    <XIcon className="size-3" />
                  </Button>
                </div>
              ) : (
                <span 
                  className="text-sm text-foreground cursor-pointer hover:underline"
                  onClick={() => startEditing('date', formData.date)}
                >
                  {formData.date ? new Date(formData.date).toLocaleDateString('en-GB') : "---"}
                </span>
              )}
            </div>

            {/* Description */}
            <div>
              {editingCell?.field === 'description' ? (
                <div className="flex items-center gap-2">
                  <Input
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="h-8 text-sm"
                    placeholder="Description"
                  />
                  <Button size="sm" variant="outline" className="h-8 w-8 p-0" onClick={saveEdit}>
                    <Save className="size-3" />
                  </Button>
                  <Button size="sm" variant="outline" className="h-8 w-8 p-0" onClick={cancelEdit}>
                    <XIcon className="size-3" />
                  </Button>
                </div>
              ) : (
                <span 
                  className="text-sm text-foreground cursor-pointer hover:underline"
                  onClick={() => startEditing('description', formData.description)}
                >
                  {formData.description || "---"}
                </span>
              )}
            </div>

            {/* Amount */}
            <div>
              {editingCell?.field === 'amount' ? (
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    step="0.01"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="h-8 text-sm"
                    placeholder="0.00"
                  />
                  <Button size="sm" variant="outline" className="h-8 w-8 p-0" onClick={saveEdit}>
                    <Save className="size-3" />
                  </Button>
                  <Button size="sm" variant="outline" className="h-8 w-8 p-0" onClick={cancelEdit}>
                    <XIcon className="size-3" />
                  </Button>
                </div>
              ) : (
                <span 
                  className="font-bold text-sm text-foreground cursor-pointer hover:underline"
                  onClick={() => startEditing('amount', formData.amount)}
                >
                  {formData.amount ? `${formData.amount} GBP` : "---"}
                </span>
              )}
            </div>

            {/* Status */}
            <div className="flex items-center gap-2">
              <div className="bg-success text-success-foreground text-xs px-2 py-1 rounded">
                Free
              </div>
            </div>

            {/* Actions */}
            <div>
              <Button
                size="sm"
                variant="outline"
                className="h-8 px-3 text-xs"
                onClick={() => openEditRowModal()}
              >
                <Edit className="size-3 mr-1" />
                Edit
              </Button>
            </div>
          </div>

          {/* New Line Button - Add at the end of grid */}
          <div className="p-4">
            <button 
              className="w-full border-1 border-dashed border-gray-300 hover:border-blue-400 text-foreground hover:text-blue-600 py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
              onClick={() => {
                // Reset form data for new expense creation
                setEditFormData({
                  category: '',
                  date: new Date().toISOString().split('T')[0],
                  description: '',
                  amount: '',
                  status: 'neutral'
                });
                setShowEditRowModal(true);
              }}
            >
              <Plus className="size-4" />
              <span>New Line</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Total field component
  const TotalField = ({ label }: { label: string }) => (
    <div className="box-border content-stretch flex flex-row gap-4 h-[61px] items-center justify-start p-0 relative shrink-0">
      <div className="bg-[rgba(255,255,255,0)] box-border content-stretch flex flex-col h-full isolate items-start justify-center p-0 relative shrink-0">
        <div className="bg-[rgba(255,255,255,0)] box-border content-stretch flex flex-row gap-1 items-end justify-start pb-2 pt-0 px-0 relative shrink-0 w-full z-[3]">
          <div className="bg-[rgba(255,255,255,0)] box-border content-stretch flex flex-col items-start justify-center overflow-clip p-0 relative shrink-0">
            <div className="font-['Roboto:Regular',_sans-serif] font-normal leading-[0] relative shrink-0 text-[#495057] text-[14px] text-left text-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
              <p className="block leading-[1.5] whitespace-pre">{label}</p>
            </div>
          </div>
        </div>
        <div className="box-border content-stretch flex flex-row items-center justify-center p-0 relative rounded-[3.2px] shrink-0 w-full z-[2]">
          <div className="box-border content-stretch flex flex-row items-center justify-start overflow-clip px-0 py-1 relative rounded-[3.2px] shrink-0">
            <div className="relative shrink-0">
              <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-row gap-1 items-center justify-start overflow-clip p-0 relative">
                <div className="flex flex-col font-['Roboto:Medium',_sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#212529] text-[14px] text-left text-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
                  <p className="block leading-[1.5] whitespace-pre">{formData.amount ? `${formData.amount} GBP` : "---"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <TooltipProvider>
      <div className="bg-background size-full relative">
        {/* Mobile Navbar */}
        <MobileNavbar 
          showBackButton={true}
          onMenuClick={onToggleSidebar}
          onBackClick={onBackToList}
          pageTitle={`Creating ${formType}`}
          formId={formNumber}
          formType={formType}
          themeMode={themeMode}
          handleThemeModeClick={handleThemeModeClick}
          getThemeIcon={getThemeIcon}
        />

        {/* Mobile Overlay - Only show when sidebar is open */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-[rgba(0,0,0,0.25)] bg-opacity-50 z-[45] md:hidden"
            onClick={() => onToggleSidebar()}
          />
        )}

        {/* Edit Row Modal */}
        <Dialog open={showEditRowModal} onOpenChange={setShowEditRowModal}>
          <DialogContent className="sm:max-w-[425px] md:max-h-[90vh] max-h-screen overflow-hidden flex flex-col">
            <DialogHeader className="flex-shrink-0">
              <DialogTitle>Edit Expense</DialogTitle>
              <DialogDescription>
                Make changes to your expense details here. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            
            <div className="flex-1 overflow-y-auto px-1 -mx-1">
              <div className="grid gap-6 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Select 
                    value={editFormData.category} 
                    onValueChange={(value) => setEditFormData({ ...editFormData, category: value })}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {EXPENSE_CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={editFormData.date}
                    onChange={(e) => setEditFormData({ ...editFormData, date: e.target.value })}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={editFormData.description}
                    onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                    placeholder="Describe your expense"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="amount">Amount (GBP)</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={editFormData.amount}
                    onChange={(e) => setEditFormData({ ...editFormData, amount: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>
            
            <DialogFooter className="flex-shrink-0 gap-2 pt-4">
              <Button variant="outline" onClick={closeEditRowModal} className="flex-1">
                Cancel
              </Button>
              <Button onClick={saveEditedRow} className="flex-1">
                Save changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Header Details Modal */}
        <Dialog open={showHeaderModal} onOpenChange={setShowHeaderModal}>
          <DialogContent className="sm:max-w-[600px] md:max-h-[90vh] max-h-screen overflow-hidden flex flex-col">
            <DialogHeader className="flex-shrink-0">
              <DialogTitle>Edit Form Details</DialogTitle>
              <DialogDescription>
                Make changes to your form header details here. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            
            <div className="flex-1 overflow-y-auto px-1 -mx-1">
              <div className="grid gap-6 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="headerShortDescription">Short Description</Label>
                  <Input
                    id="headerShortDescription"
                    value={editHeaderData.shortDescription}
                    onChange={(e) => setEditHeaderData({ ...editHeaderData, shortDescription: e.target.value })}
                    placeholder="Short description..."
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="headerChargeTo">Charge To</Label>
                  <Select 
                    value={editHeaderData.chargeTo} 
                    onValueChange={(value) => setEditHeaderData({ ...editHeaderData, chargeTo: value })}
                  >
                    <SelectTrigger id="headerChargeTo">
                      <SelectValue placeholder="Select charge to" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Project Alpha">Project Alpha</SelectItem>
                      <SelectItem value="Project Beta">Project Beta</SelectItem>
                      <SelectItem value="Project Gamma">Project Gamma</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="headerColleagues">Colleagues</Label>
                  <Input
                    id="headerColleagues"
                    value={editHeaderData.colleagues}
                    onChange={(e) => setEditHeaderData({ ...editHeaderData, colleagues: e.target.value })}
                    placeholder="Colleagues..."
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="headerDateFrom">Date From</Label>
                    <Input
                      id="headerDateFrom"
                      type="date"
                      value={editHeaderData.dateFrom}
                      onChange={(e) => setEditHeaderData({ ...editHeaderData, dateFrom: e.target.value })}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="headerDateTo">Date To</Label>
                    <Input
                      id="headerDateTo"
                      type="date"
                      value={editHeaderData.dateTo}
                      onChange={(e) => setEditHeaderData({ ...editHeaderData, dateTo: e.target.value })}
                    />
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="headerProject">Project</Label>
                  <Input
                    id="headerProject"
                    value={editHeaderData.project}
                    onChange={(e) => setEditHeaderData({ ...editHeaderData, project: e.target.value })}
                    placeholder="Project name..."
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="headerStatus">Status</Label>
                  <Select 
                    value={editHeaderData.status} 
                    onValueChange={(value) => setEditHeaderData({ ...editHeaderData, status: value })}
                  >
                    <SelectTrigger id="headerStatus">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Draft">Draft</SelectItem>
                      <SelectItem value="Submitted">Submitted</SelectItem>
                      <SelectItem value="Approved">Approved</SelectItem>
                      <SelectItem value="Rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            <DialogFooter className="flex-shrink-0 gap-2 pt-4">
              <Button variant="outline" onClick={closeHeaderModal} className="flex-1">
                Cancel
              </Button>
              <Button onClick={saveHeaderDetails} className="flex-1">
                Save changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <div className="flex size-full relative">
          {/* Sidebar */}
          <div className={`
            bg-sidebar flex flex-col justify-between border border-sidebar-border z-50 transition-colors duration-300 ease-in-out custom-scrollbar
            ${sidebarOpen ? 'translate-y-0' : '-translate-y-full'}
            ${sidebarOpen ? 'md:w-[250px]' : 'md:w-[50px]'}
            md:translate-y-0 md:translate-x-0
            md:fixed md:left-0 md:top-0 md:h-full md:border-l-0 md:border-t-0 md:border-b-0 md:rounded-none
            fixed left-0 right-0 w-full shrink-0 top-mobile-nav h-mobile-sidebar
            p-4 md:px-2.5 md:py-2.5 overflow-y-auto
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

              <div className="h-4 shrink-0 w-full hidden md:flex items-center">
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
                        
                        <DropdownMenuItem className="flex items-center gap-3 px-4 py-2 cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50">
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
                            <div className="text-xs text-muted-foreground leading-tight">stephen.hill@pso.com</div>
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
                        
                        <DropdownMenuItem className="flex items-center gap-3 px-4 py-2 cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50">
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
          <div className={`flex-1 flex flex-col h-full overflow-y-auto transition-all duration-300 pt-mobile-nav md:pt-0 ${
            sidebarOpen ? 'md:ml-[250px]' : 'md:ml-[50px]'
          }`}>
            <div className="flex-1 overflow-y-auto bg-background pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))]">
              {/* Breadcrumb & Title - Desktop Only */}
              <div className="px-4 hidden md:block">
                <div className="flex flex-row items-center justify-between max-h-[51px] py-4.5 w-full border-b">
                  <div className="flex flex-row items-center gap-3">
                    <div className="flex flex-row items-center gap-1">
                      <button 
                        onClick={onBackToList}
                        className="text-muted-foreground text-base hover:text-foreground cursor-pointer underline p-0 bg-transparent border-0 leading-none flex items-center justify-center"
                      >
                        Entry
                      </button>
                      <ChevronRight className="text-muted-foreground w-4 h-4 mx-1" />
                      <h1 className="font-semibold text-foreground">#{formNumber} | {formType}</h1>
                    </div>
                  </div>
                </div>
              </div>


                  {/* Form Header - Clickable to open offcanvas */}
                  <div className="px-4">
                    <div 
                      className="border-b py-4 cursor-pointer group overflow-x-auto custom-scrollbar"
                      onClick={openHeaderModal}
                    >
                      <div className="flex flex-row gap-3 items-center justify-start min-w-max">
                        {/* Image */}
                        <div className="bg-card relative rounded-[10px] border border-border shrink-0">
                          <div className="size-20">
                            <div className="absolute inset-0 bg-[rgba(0,0,0,0)] bg-opacity-0 group-hover:bg-opacity-20 rounded-[10px] flex items-center justify-center transition-all">
                              <Edit className="size-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          </div>
                        </div>
                        
                        {/* Separator */}
                        <div className="bg-border h-full w-px shrink-0" />
                        
                        {/* Short Description */}
                        <div className="flex flex-col min-w-[130px] shrink-0">
                          <label className="text-muted-foreground text-sm pb-2">Short Description</label>
                          <div className="text-foreground text-sm font-medium">{headerDetails.shortDescription}</div>
                        </div>
                        
                        {/* Separator */}
                        <div className="bg-border h-full w-px shrink-0" />
                        
                        {/* Charge To */}
                        <div className="flex flex-col min-w-[110px] shrink-0">
                          <label className="text-muted-foreground text-sm pb-2">Charge To...</label>
                          <div className="text-foreground text-sm font-medium">{headerDetails.chargeTo}</div>
                        </div>
                        
                        {/* Separator */}
                        <div className="bg-border h-full w-px shrink-0" />
                        
                        {/* Colleagues */}
                        <div className="flex flex-col min-w-[140px] shrink-0">
                          <label className="text-muted-foreground text-sm pb-2">Colleagues</label>
                          <div className="text-foreground text-sm font-medium">{headerDetails.colleagues}</div>
                        </div>
                        
                        {/* Separator */}
                        <div className="bg-border h-full w-px shrink-0" />
                        
                        {/* Date From */}
                        <div className="flex flex-col min-w-[90px] shrink-0">
                          <label className="text-muted-foreground text-sm pb-2">Date From</label>
                          <div className="text-foreground text-sm font-medium">
                            {new Date(headerDetails.dateFrom).toLocaleDateString("en-GB")}
                          </div>
                        </div>
                        
                        {/* Separator */}
                        <div className="bg-border h-full w-px shrink-0" />
                        
                        {/* Date To */}
                        <div className="flex flex-col min-w-[90px] shrink-0">
                          <label className="text-muted-foreground text-sm pb-2">Date To</label>
                          <div className="text-foreground text-sm font-medium">
                            {new Date(headerDetails.dateTo).toLocaleDateString("en-GB")}
                          </div>
                        </div>
                        
                        {/* Separator */}
                        <div className="bg-border h-full w-px shrink-0" />
                        
                        {/* Project */}
                        <div className="flex flex-col min-w-[130px] shrink-0">
                          <label className="text-muted-foreground text-sm pb-2">Project</label>
                          <div className="text-foreground text-sm font-medium">{headerDetails.project}</div>
                        </div>
                        
                        {/* Separator */}
                        <div className="bg-border h-full w-px shrink-0" />
                        
                        {/* Status */}
                        <div className="flex flex-col min-w-[90px] shrink-0">
                          <label className="text-muted-foreground text-sm pb-2">Status</label>
                          <div className="text-foreground text-sm font-medium">{headerDetails.status}</div>
                        </div>
                        
                        {/* Edit Icon */}
                        <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                          <Edit className="size-4 text-muted-foreground" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Row Header with Editable Fields */}
                  <div className="relative rounded-[10px] shrink-0 w-full">
                    <div className="relative size-full">
                    </div>
                  </div>

                  {/* Control Bar */}

              
                                          {/* Control Bar with Integrated Bulk Actions */}
              <div className="px-4">
                <div className="flex flex-row items-center justify-between py-4.5 w-full border-b">
                  <div className="flex items-center gap-2 bg-sidebar rounded-lg px-3 h-[34px]">
                    <div 
                      className={`relative rounded size-4 border cursor-pointer flex items-center justify-center ${
                        isAllSelected 
                          ? 'bg-primary border-primary' 
                          : isPartiallySelected
                          ? 'bg-accent border-primary'
                          : 'bg-card border-border hover:border-primary'
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
                    {!isAllSelected && !isPartiallySelected && (
                      <label 
                        className="text-xs text-sidebar-foreground cursor-pointer select-none"
                        onClick={toggleSelectAll}
                      >
                        Select All
                      </label>
                    )}
                  </div>

                  {/* Bulk Actions - Show when rows are selected */}
                  {selectedRows.size > 0 && (
                    <div className="flex items-center gap-3 h-[34px] ml-4 px-0 py-2.5">
                      <span className="text-sm text-primary font-medium">
                        {selectedRows.size}
                        <span className="hidden md:inline"> selected</span>
                      </span>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleBulkUpdate}
                          className="h-8 px-3 text-xs"
                        >
                          <Edit className="size-3 mr-1" />
                          Update
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleBulkCopy}
                          className="h-8 px-3 text-xs"
                        >
                          <Copy className="size-3 mr-1" />
                          Copy
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleBulkSplit}
                          className="h-8 px-3 text-xs"
                        >
                          <Split className="size-3 mr-1" />
                          Split
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleBulkDelete}
                          className="h-8 px-3 text-xs border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                        >
                          <Trash2 className="size-3 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="flex-1" />
                  
                  {/* View Toggle Buttons - only show on desktop when no rows are selected */}
                  {selectedRows.size === 0 && (
                    <div className="hidden md:flex flex-row gap-1 h-[34px] items-center justify-center px-1 py-1 bg-sidebar rounded-lg">
                      <button
                        onClick={toggleViewMode}
                        className={`px-3 py-1.5 rounded text-xs transition-colors flex items-center gap-1.5 ${
                          currentViewMode === 'stacked' 
                            ? 'bg-sidebar-accent text-sidebar-primary font-medium' 
                            : 'hover:bg-sidebar-accent text-sidebar-foreground'
                        }`}
                      >
                        <List className="size-3.5" />
                        List
                      </button>
                      <button
                        onClick={toggleViewMode}
                        className={`px-3 py-1.5 rounded text-xs transition-colors flex items-center gap-1.5 ${
                          currentViewMode === 'grid' 
                            ? 'bg-sidebar-accent text-sidebar-primary font-medium' 
                            : 'hover:bg-sidebar-accent text-sidebar-foreground'
                        }`}
                      >
                        <Grid3x3 className="size-3.5" />
                        Grid
                      </button>
                    </div>
                  )}
                </div>
              </div>

                  {/* Conditional Content - Stacked or Grid View */}
                  {currentViewMode === 'stacked' ? (
                    <StackedRowComponent />
                  ) : (
                    <div className="px-4 py-4">
                      <GridViewComponent />
                    </div>
                  )}

                  {/* Total Footer */}
                  <div className="px-4 py-4 relative rounded-[10px] shrink-0 w-full">
                    <div className="flex flex-col items-end relative size-full">
                      <div className="box-border content-stretch flex flex-row gap-4 items-center justify-end px-1 py-1 relative shrink-0 w-full">
                        <div className="shrink-0 size-20" />
                        <TotalField label="Total" />
                        <div className="bg-[#e3e6ed] h-[61px] shrink-0 w-px" />
                        <TotalField label="Total Local" />
                        <div className="bg-[#e3e6ed] h-[61px] shrink-0 w-px" />
                        <TotalField label="Reimbursement" />
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
    </TooltipProvider>
  );
}