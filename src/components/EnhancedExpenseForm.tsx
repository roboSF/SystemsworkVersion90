import { useState, useEffect, useRef } from "react";
import { Plus, PlusCircle, SquarePlus, Calendar, Upload, Edit, Menu, X, Trash2, Copy, Split, Check, List, Grid3x3, Save, XIcon, Settings, User, LogOut, Sun, Moon, Monitor, Cog, FileText, PanelRightOpen, PanelRightClose, ChevronRight, Maximize2, Minimize2, MoreVertical, Download, FileSpreadsheet, Send, MessageSquare, CornerUpLeft, BadgeCheck, Sparkles, ZoomIn, ZoomOut, ChevronLeft, ChevronRight as ChevronRightIcon, File, Image as ImageIcon, FileType, Link2Off, Link2, Paperclip, RotateCcw, RotateCw, Eye, EyeOff, Loader2} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "./ui/sheet";
import ResponsiveDialog from "./ResponsiveDialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";
import { toast } from "sonner@2.0.3";
import MobileNavbar from "./MobileNavbar";
import svgPaths from "../imports/svg-l12dhogi8o";
import errorSvgPaths from "../imports/svg-ltyjnttfzg";
import warningSvgPaths from "../imports/svg-h8ry7tl3k6";
import imgImagePlaceholderChangeImageHere from "figma:asset/7ff5b46e5f240e6d5e305d752472b445c8d3a2c1.png";
import imgAvatarPlaceholderChangeImageHere from "figma:asset/884bf465a905d0cc5a2af7245f6b2211b9596a64.png";
import SystemsWorkTransparentNoEdges1 from "../imports/SystemsWorkTransparentNoEdges1";

interface ExpenseRow {
  id: string;
  category: string;
  date: string;
  description: string;
  amount: string;
  status: 'warning' | 'error' | 'success' | 'neutral';
  badge?: string;
  expenseTotal?: string;
  expenseCurrency?: string;
  expenseFxTotalLocal?: string;
  expenseGbpNet?: string;
  plannedExpenseGbp?: string;
  attachedFiles?: AttachedFile[];
}

interface Message {
  id: string;
  text: string;
  timestamp: string;
  isNew: boolean;
  sender: string;
  isCurrentUser: boolean;
  isNewlyAdded: boolean;
}

interface AttachedFile {
  id: string;
  name: string;
  type: string; // 'image' | 'pdf' | 'other'
  url: string;
  size: number;
  uploadDate: string;
}

const INITIAL_ROWS: ExpenseRow[] = [
  {
    id: "1",
    category: "Accommodation",
    date: "2/6/25",
    description: "Hotel Carlton",
    amount: "1,739.13 GBP",
    status: "warning",
    badge: "Free",
    expenseTotal: "7905.14",
    expenseCurrency: "AED",
    expenseFxTotalLocal: "1739.13",
    expenseGbpNet: "1739.13",
    plannedExpenseGbp: "0.00",
    attachedFiles: [
      {
        id: 'file-1-1',
        name: 'hotel-receipt.jpg',
        type: 'image',
        url: imgImagePlaceholderChangeImageHere,
        size: 245600,
        uploadDate: '2025-02-06T10:30:00Z'
      },
      {
        id: 'file-1-2',
        name: 'invoice.pdf',
        type: 'pdf',
        url: '',
        size: 128400,
        uploadDate: '2025-02-06T11:15:00Z'
      },
      {
        id: 'file-1-3',
        name: 'expense-summary.jpg',
        type: 'image',
        url: imgAvatarPlaceholderChangeImageHere,
        size: 189200,
        uploadDate: '2025-02-06T14:20:00Z'
      }
    ]
  },
  {
    id: "2",
    category: "Meals",
    date: "2/7/25",
    description: "Champs Elysees",
    amount: "347.83 GBP",
    status: "error",
    expenseTotal: "1581.05",
    expenseCurrency: "AED",
    expenseFxTotalLocal: "347.83",
    expenseGbpNet: "347.83",
    plannedExpenseGbp: "0.00",
    attachedFiles: [
      {
        id: 'file-2-1',
        name: 'restaurant-receipt.jpg',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1686581639043-893261d6b43f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWNlaXB0JTIwaW52b2ljZXxlbnwxfHx8fDE3NjgyMjA5Mjd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        size: 156800,
        uploadDate: '2025-02-07T19:30:00Z'
      }
    ]
  },
  {
    id: "3",
    category: "Mobile Phone",
    date: "2/7/25",
    description: "Phone bill",
    amount: "130.43 GBP",
    status: "neutral",
    expenseTotal: "592.86",
    expenseCurrency: "AED",
    expenseFxTotalLocal: "130.43",
    expenseGbpNet: "130.43",
    plannedExpenseGbp: "0.00",
    attachedFiles: []
  }
];

const EXPENSE_CATEGORIES = [
  "Accommodation", "Meals", "Transportation", "Mobile Phone", "Office Supplies", "Travel", "Entertainment"
];

const CURRENCIES = [
  "GBP", "USD", "EUR", "AED", "JPY", "CHF", "CAD", "AUD"
];

// Mock exchange rates to GBP
const EXCHANGE_RATES: { [key: string]: number } = {
  "GBP": 1,
  "USD": 0.79,
  "EUR": 0.85,
  "AED": 0.22,
  "JPY": 0.0053,
  "CHF": 0.90,
  "CAD": 0.57,
  "AUD": 0.51
};

type ViewMode = 'stacked' | 'grid';


interface EnhancedExpenseFormProps {
  onBackToList?: () => void;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  themeMode: 'light' | 'dark' | 'system';
  handleThemeModeClick: () => void;
  getThemeIcon: () => string;
  formId?: string;
  initialRows?: ExpenseRow[];
  sourcePage?: string;
  onNavigationClick?: (page: string) => void;
}

export default function EnhancedExpenseForm({ onBackToList, sidebarOpen, onToggleSidebar, themeMode, handleThemeModeClick, getThemeIcon, formId, initialRows, sourcePage = "Entry", onNavigationClick }: EnhancedExpenseFormProps) {
  const [rows, setRows] = useState<ExpenseRow[]>(initialRows || INITIAL_ROWS);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<ViewMode>('stacked');
  const [editingCell, setEditingCell] = useState<{rowId: string, field: string} | null>(null);
  const [editValue, setEditValue] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false); // Bottom sheet state for mobile
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['forms'])); // Forms expanded by default
  const [isLoadingRows, setIsLoadingRows] = useState(true);
  const [isLoadingHeader, setIsLoadingHeader] = useState(true);
  const [isValidated, setIsValidated] = useState(false); // Track if Save & Validate has been clicked
  const [isValidating, setIsValidating] = useState(false); // Track validation in progress

  // Split modal state
  const [showSplitModal, setShowSplitModal] = useState(false);
  const [splitMethod, setSplitMethod] = useState<'percentage' | 'value'>('percentage');
  const [splitPercentage, setSplitPercentage] = useState('50');
  const [splitValue, setSplitValue] = useState('');
  const [splitMode, setSplitMode] = useState<'field-by-field' | 'simple-rows'>('field-by-field');
  const [numberOfSplits, setNumberOfSplits] = useState('2');
  // State for which field is being split
  const [activeSplitField, setActiveSplitField] = useState<'expenseTotal' | 'expenseFxTotalLocal' | 'expenseGbpNet' | 'plannedExpenseGbp'>('expenseTotal');
  // Individual split values per expense row per field
  const [individualSplits, setIndividualSplits] = useState<{
    [rowId: string]: {
      expenseTotal: { method: 'percentage' | 'value', percentage: string, value: string },
      expenseFxTotalLocal: { method: 'percentage' | 'value', percentage: string, value: string },
      expenseGbpNet: { method: 'percentage' | 'value', percentage: string, value: string },
      plannedExpenseGbp: { method: 'percentage' | 'value', percentage: string, value: string }
    }
  }>({});

  // State for simple split rows
  const [simpleSplitRows, setSimpleSplitRows] = useState<{
    [rowId: string]: Array<{
      expenseTotal: number;
      fxTotal: number;
      gbpNet: number;
      planned: number;
      percentage: number;
    }>
  }>({});

  // State to track which split rows have been manually edited
  const [editedSplitRows, setEditedSplitRows] = useState<{
    [rowId: string]: Set<number>;
  }>({});

  // Initialize simple split rows when number of splits changes
  useEffect(() => {
    const numSplits = parseInt(numberOfSplits) || 2;
    const newSplitRows: typeof simpleSplitRows = {};
    
    rows.filter(row => selectedRows.has(row.id)).forEach((row) => {
      const originalExpenseTotal = parseFloat(row.expenseTotal || row.amount.replace(' GBP', '').replace(/,/g, ''));
      const originalFxTotal = parseFloat(row.expenseFxTotalLocal || '0');
      const originalGbpNet = parseFloat(row.expenseGbpNet || '0');
      const originalPlanned = parseFloat(row.plannedExpenseGbp || '0');
      
      newSplitRows[row.id] = Array.from({ length: numSplits }).map(() => ({
        expenseTotal: originalExpenseTotal / numSplits,
        fxTotal: originalFxTotal / numSplits,
        gbpNet: originalGbpNet / numSplits,
        planned: originalPlanned / numSplits,
        percentage: 100 / numSplits
      }));
    });
    
    setSimpleSplitRows(newSplitRows);
    // Reset edited tracking when splits change
    setEditedSplitRows({});
  }, [numberOfSplits, selectedRows, rows]);

  // Handler for percentage change
  const handlePercentageChange = (rowId: string, splitIndex: number, newPercentage: string) => {
    let percentage = parseFloat(newPercentage) || 0;
    const row = rows.find(r => r.id === rowId);
    if (!row) return;

    const originalExpenseTotal = parseFloat(row.expenseTotal || row.amount.replace(' GBP', '').replace(/,/g, ''));
    const originalFxTotal = parseFloat(row.expenseFxTotalLocal || '0');
    const originalGbpNet = parseFloat(row.expenseGbpNet || '0');
    const originalPlanned = parseFloat(row.plannedExpenseGbp || '0');

    // Auto-cap: Check if this would exceed 100% when combined with locked rows
    const currentSplits = simpleSplitRows[rowId];
    if (currentSplits) {
      const editedRows = editedSplitRows[rowId] || new Set();
      const lockedTotal = currentSplits.reduce((sum, split, idx) => 
        idx !== splitIndex && editedRows.has(idx) ? sum + split.percentage : sum, 0
      );
      
      // Cap percentage to remaining available amount
      const maxPercentage = 100 - lockedTotal;
      if (percentage > maxPercentage) {
        percentage = maxPercentage;
      }
    }

    // Cap percentage to maximum 100%
    if (percentage > 100) {
      percentage = 100;
    }

    // Mark this row as edited
    setEditedSplitRows(prev => ({
      ...prev,
      [rowId]: new Set([...(prev[rowId] || []), splitIndex])
    }));

    setSimpleSplitRows(prev => {
      const currentSplits = prev[rowId];
      if (!currentSplits) return prev;
      
      // Include the current splitIndex in editedRows since we're marking it as edited
      const editedRows = new Set([...(editedSplitRows[rowId] || []), splitIndex]);
      
      // Find unedited rows (excluding the current one being edited)
      const uneditedIndices = currentSplits
        .map((_, idx) => idx)
        .filter(idx => idx !== splitIndex && !editedRows.has(idx));
      
      // If no unedited rows, we don't need to redistribute
      const targetIndices = uneditedIndices;
      
      // Calculate locked percentage (all edited rows except current)
      const lockedPercentageTotal = currentSplits.reduce((sum, split, idx) => 
        idx !== splitIndex && editedRows.has(idx) ? sum + split.percentage : sum, 0
      );
      
      // Calculate remaining percentage after accounting for current and all locked rows
      const remainingPercentage = 100 - percentage - lockedPercentageTotal;
      
      // Calculate the remaining percentage for target rows (for proportional distribution)
      const totalOtherPercentage = currentSplits.reduce((sum, split, idx) => 
        targetIndices.includes(idx) ? sum + split.percentage : sum, 0
      );
      
      // Update all splits
      const updatedSplits = currentSplits.map((split, idx) => {
        if (idx === splitIndex) {
          // Update the changed row
          return {
            expenseTotal: Math.round((originalExpenseTotal * percentage) / 100 * 100) / 100,
            fxTotal: Math.round((originalFxTotal * percentage) / 100 * 100) / 100,
            gbpNet: Math.round((originalGbpNet * percentage) / 100 * 100) / 100,
            planned: Math.round((originalPlanned * percentage) / 100 * 100) / 100,
            percentage: Math.round(percentage * 100) / 100
          };
        } else if (targetIndices.includes(idx)) {
          // Recalculate unedited rows proportionally, or set to 0 if no remaining budget
          const newPercentage = remainingPercentage <= 0 
            ? 0
            : (totalOtherPercentage > 0 
                ? (split.percentage / totalOtherPercentage) * remainingPercentage 
                : remainingPercentage / targetIndices.length);
          
          return {
            expenseTotal: Math.round((originalExpenseTotal * newPercentage) / 100 * 100) / 100,
            fxTotal: Math.round((originalFxTotal * newPercentage) / 100 * 100) / 100,
            gbpNet: Math.round((originalGbpNet * newPercentage) / 100 * 100) / 100,
            planned: Math.round((originalPlanned * newPercentage) / 100 * 100) / 100,
            percentage: Math.round(newPercentage * 100) / 100
          };
        } else {
          // Keep edited rows unchanged
          return split;
        }
      });
      
      return {
        ...prev,
        [rowId]: updatedSplits
      };
    });
  };

  // Handler for value change
  const handleSplitValueChange = (
    rowId: string, 
    splitIndex: number, 
    field: 'expenseTotal' | 'fxTotal' | 'gbpNet' | 'planned', 
    newValue: string
  ) => {
    // Allow empty string for typing
    if (newValue === '') {
      setSimpleSplitRows(prev => ({
        ...prev,
        [rowId]: prev[rowId].map((split, idx) => 
          idx === splitIndex 
            ? { ...split, [field]: 0 }
            : split
        )
      }));
      return;
    }

    const value = parseFloat(newValue);
    if (isNaN(value)) return;
    
    const row = rows.find(r => r.id === rowId);
    if (!row) return;

    const originalValues = {
      expenseTotal: parseFloat(row.expenseTotal || row.amount.replace(' GBP', '').replace(/,/g, '')),
      fxTotal: parseFloat(row.expenseFxTotalLocal || '0'),
      gbpNet: parseFloat(row.expenseGbpNet || '0'),
      planned: parseFloat(row.plannedExpenseGbp || '0')
    };

    // Calculate percentage based on the changed value
    let percentage = (value / originalValues[field]) * 100;

    // Auto-cap: Check if this would exceed 100% when combined with locked rows
    const currentSplits = simpleSplitRows[rowId];
    if (currentSplits) {
      const editedRows = editedSplitRows[rowId] || new Set();
      const lockedTotal = currentSplits.reduce((sum, split, idx) => 
        idx !== splitIndex && editedRows.has(idx) ? sum + split.percentage : sum, 0
      );
      
      // Cap percentage to remaining available amount
      const maxPercentage = 100 - lockedTotal;
      if (percentage > maxPercentage) {
        percentage = maxPercentage;
      }
    }

    // Cap percentage to maximum 100%
    if (percentage > 100) {
      percentage = 100;
    }

    // Calculate the capped value based on capped percentage
    const cappedValue = Math.round((originalValues[field] * percentage) / 100 * 100) / 100;

    // Mark this row as edited
    setEditedSplitRows(prev => ({
      ...prev,
      [rowId]: new Set([...(prev[rowId] || []), splitIndex])
    }));

    setSimpleSplitRows(prev => {
      const currentSplits = prev[rowId];
      if (!currentSplits) return prev;
      
      // Include the current splitIndex in editedRows since we're marking it as edited
      const editedRows = new Set([...(editedSplitRows[rowId] || []), splitIndex]);
      
      // Find unedited rows (excluding the current one being edited)
      const uneditedIndices = currentSplits
        .map((_, idx) => idx)
        .filter(idx => idx !== splitIndex && !editedRows.has(idx));
      
      // If no unedited rows, we don't need to redistribute
      const targetIndices = uneditedIndices;
      
      // Calculate locked percentage (all edited rows except current)
      const lockedPercentageTotal = currentSplits.reduce((sum, split, idx) => 
        idx !== splitIndex && editedRows.has(idx) ? sum + split.percentage : sum, 0
      );
      
      // Calculate remaining percentage after accounting for current and all locked rows
      const remainingPercentage = 100 - percentage - lockedPercentageTotal;
      
      // Calculate the remaining percentage for target rows (for proportional distribution)
      const totalOtherPercentage = currentSplits.reduce((sum, split, idx) => 
        targetIndices.includes(idx) ? sum + split.percentage : sum, 0
      );
      
      // Update all splits
      const updatedSplits = currentSplits.map((split, idx) => {
        if (idx === splitIndex) {
          // Update the changed row - use capped value
          return {
            ...split,
            [field]: cappedValue,
            percentage: Math.round(percentage * 100) / 100
          };
        } else if (targetIndices.includes(idx)) {
          // Recalculate unedited rows proportionally, or set to 0 if no remaining budget
          const newPercentage = remainingPercentage <= 0 
            ? 0
            : (totalOtherPercentage > 0 
                ? (split.percentage / totalOtherPercentage) * remainingPercentage 
                : remainingPercentage / targetIndices.length);
          
          return {
            ...split,
            [field]: Math.round((originalValues[field] * newPercentage) / 100 * 100) / 100,
            percentage: Math.round(newPercentage * 100) / 100
          };
        } else {
          // Keep edited rows unchanged
          return split;
        }
      });
      
      return {
        ...prev,
        [rowId]: updatedSplits
      };
    });
  };

  // Simulate loading rows on mount
  useEffect(() => {
    setIsLoadingRows(true);
    const timer = setTimeout(() => {
      setIsLoadingRows(false);
    }, 1500); // 1.5 second loading simulation
    
    return () => clearTimeout(timer);
  }, []);

  // Simulate loading header on mount
  useEffect(() => {
    setIsLoadingHeader(true);
    const timer = setTimeout(() => {
      setIsLoadingHeader(false);
    }, 1000); // 1 second loading simulation
    
    return () => clearTimeout(timer);
  }, []);

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


  // Inline row creation state
  const [isAddingInlineRow, setIsAddingInlineRow] = useState(false);
  
  // Grid expand state
  const [isGridExpanded, setIsGridExpanded] = useState(false);

  // Delete confirmation dialog state
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // No special handling needed for width-only expansion
  const [inlineRowData, setInlineRowData] = useState({
    category: "",
    date: new Date().toISOString().split('T')[0],
    description: "",
    amount: "",
    status: "neutral" as ExpenseRow['status']
  });

  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [newExpense, setNewExpense] = useState({
    category: "",
    date: new Date().toISOString().split('T')[0],
    description: "",
    amount: ""
  });

  const [showHeaderModal, setShowHeaderModal] = useState(false);
  
  // Set header details based on formId
  const getInitialHeaderDetails = () => {
    if (formId === "64") {
      return {
        shortDescription: "Business trip to Munich",
        chargeTo: "Not Selected",
        colleagues: "John Smith",
        dateFrom: "2025-02-08",
        dateTo: "2025-02-10",
        project: "International Expansion Q1",
        status: "Issued for Authorization",
        image: imgImagePlaceholderChangeImageHere
      };
    }
    return {
      shortDescription: "Trip to Paris",
      chargeTo: "Not Selected",
      colleagues: "John Doe, Sarah Smith",
      dateFrom: "2025-02-05",
      dateTo: "2025-02-10",
      project: "Marketing Campaign Q1",
      status: "In Progress",
      image: imgImagePlaceholderChangeImageHere
    };
  };
  
  const [headerDetails, setHeaderDetails] = useState(getInitialHeaderDetails());

  const [showEditRowModal, setShowEditRowModal] = useState(false);
  const [editingRow, setEditingRow] = useState<ExpenseRow | null>(null);
  const [editFormData, setEditFormData] = useState({
    category: "",
    date: "",
    description: "",
    amount: "",
    status: "neutral" as ExpenseRow['status'],
    receiptImage: "" as string,
    expenseCurrency: "AED",
    expenseTotal: ""
  });

  // File management state
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([
    {
      id: 'mock-1',
      name: 'hotel-receipt.jpg',
      type: 'image',
      url: imgImagePlaceholderChangeImageHere,
      size: 245600,
      uploadDate: '2025-02-06T10:30:00Z'
    },
    {
      id: 'mock-2',
      name: 'invoice.pdf',
      type: 'pdf',
      url: '',
      size: 128400,
      uploadDate: '2025-02-06T11:15:00Z'
    },
    {
      id: 'mock-3',
      name: 'expense-summary.jpg',
      type: 'image',
      url: imgAvatarPlaceholderChangeImageHere,
      size: 189200,
      uploadDate: '2025-02-06T14:20:00Z'
    }
  ]);
  const [unassignedFiles, setUnassignedFiles] = useState<AttachedFile[]>([]);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [isViewingUnassigned, setIsViewingUnassigned] = useState(false);
  const [showAlreadyAssigned, setShowAlreadyAssigned] = useState(false); // Default: hide already assigned files
  const [viewingOnlyOtherRows, setViewingOnlyOtherRows] = useState(false); // Track when viewing ONLY files from other rows
  const [zoomLevel, setZoomLevel] = useState(100);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Touch event handling for pinch-to-zoom
  const touchStartDistance = useRef<number | null>(null);
  const initialZoomLevel = useRef<number>(100);

  // Auto-switch to unassigned view when there are no attached files but unassigned files exist
  useEffect(() => {
    if (attachedFiles.length === 0 && unassignedFiles.length > 0) {
      setIsViewingUnassigned(true);
      setCurrentFileIndex(0);
    } else if (attachedFiles.length > 0 && isViewingUnassigned && !viewingOnlyOtherRows) {
      // Switch back to attached view if we're viewing unassigned but attached files exist
      // UNLESS the user is intentionally viewing files from other rows
      setIsViewingUnassigned(false);
      setCurrentFileIndex(0);
    }
  }, [attachedFiles.length, unassignedFiles.length, viewingOnlyOtherRows]);

  // Reset file index when toggling showAlreadyAssigned to avoid out-of-bounds errors
  useEffect(() => {
    if (isViewingUnassigned) {
      const filteredFiles = getFilteredUnassignedFiles();
      if (currentFileIndex >= filteredFiles.length && filteredFiles.length > 0) {
        setCurrentFileIndex(0);
      }
    }
  }, [showAlreadyAssigned]);

  // Messages state - initialize based on sourcePage
  const [showMessagesModal, setShowMessagesModal] = useState(false);
  const [isReturnAction, setIsReturnAction] = useState(false);
  const [messages, setMessages] = useState<Message[]>(
    sourcePage === "Authorization" ? [
      {
        id: "1",
        text: "Please provide receipt for Hotel Carlton expense.",
        timestamp: "2025-02-08 14:30",
        isNew: false,
        sender: "Sarah Johnson",
        isCurrentUser: false,
        isNewlyAdded: false
      },
      {
        id: "2",
        text: "I'll upload it shortly. Had some trouble with the scanner.",
        timestamp: "2025-02-08 14:45",
        isNew: false,
        sender: "You",
        isCurrentUser: true,
        isNewlyAdded: false
      },
      {
        id: "3",
        text: "Amount exceeds budget limit for Meals category. Please provide justification.",
        timestamp: "2025-02-08 15:20",
        isNew: true,
        sender: "Sarah Johnson",
        isCurrentUser: false,
        isNewlyAdded: false
      }
    ] : []
  );
  const [newMessageText, setNewMessageText] = useState("");
  const [showPartialReturnAlert, setShowPartialReturnAlert] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);

  // File upload and AI processing state
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  
  // Modal-specific drag and drop states
  const [isDraggingModal, setIsDraggingModal] = useState(false);
  const [isProcessingModal, setIsProcessingModal] = useState(false);

  // File handling functions
  const handleFileUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const fileUrl = event.target?.result as string;
        const fileType = file.type.startsWith('image/') ? 'image' : 
                        file.type === 'application/pdf' ? 'pdf' : 'other';
        
        const newFile: AttachedFile = {
          id: `file-${Date.now()}-${Math.random()}`,
          name: file.name,
          type: fileType,
          url: fileUrl,
          size: file.size,
          uploadDate: new Date().toISOString()
        };

        setAttachedFiles(prev => [...prev, newFile]);
        setCurrentFileIndex(attachedFiles.length); // Switch to newly added file
        toast.success(`${file.name} uploaded successfully`);
      };
      reader.readAsDataURL(file);
    });
  };

  // AI-powered file upload for edit modal (when no files attached)
  const handleFileUploadWithAI = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0]; // Process first file with AI
    
    // Check file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a valid file (JPG, PNG, or PDF)');
      return;
    }

    setIsProcessingModal(true);

    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Read file for display
    const reader = new FileReader();
    reader.onload = (event) => {
      const fileUrl = event.target?.result as string;
      const fileType = file.type.startsWith('image/') ? 'image' : 
                      file.type === 'application/pdf' ? 'pdf' : 'other';
      
      const newFile: AttachedFile = {
        id: `file-${Date.now()}-${Math.random()}`,
        name: file.name,
        type: fileType,
        url: fileUrl,
        size: file.size,
        uploadDate: new Date().toISOString()
      };

      // Mock AI extracted data - auto-fill expense fields
      const mockExtractedData = {
        date: new Date().toISOString().split('T')[0], // Format for date input
        category: "Meals",
        expenseTotal: "15.75",
        currency: "GBP",
        description: `Coffee - Extracted from ${file.name}`,
      };

      // Update the editing expense with AI-extracted data
      setEditFormData(prev => ({
        ...prev,
        date: mockExtractedData.date,
        category: mockExtractedData.category,
        expenseTotal: mockExtractedData.expenseTotal,
        expenseCurrency: mockExtractedData.currency,
        description: mockExtractedData.description,
      }));

      // Add file to attached files
      setAttachedFiles([newFile]);
      setCurrentFileIndex(0);
      setIsProcessingModal(false);

      // Show success toast
      toast.success(`AI extracted expense data from ${file.name}`, {
        description: `${mockExtractedData.category} - ${mockExtractedData.currency} ${mockExtractedData.expenseTotal}`
      });
    };
    reader.readAsDataURL(file);
  };

  // Modal drag and drop handlers
  const handleModalDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingModal(true);
  };

  const handleModalDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingModal(false);
  };

  const handleModalDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleModalDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingModal(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileUploadWithAI(files);
    }
  };

  const handleDeleteFile = (fileId: string) => {
    // Try to find the file in both arrays
    const fileToDeleteFromAttached = attachedFiles.find(f => f.id === fileId);
    const fileToDeleteFromUnassigned = unassignedFiles.find(f => f.id === fileId);
    const fileToDelete = fileToDeleteFromAttached || fileToDeleteFromUnassigned;
    
    if (!fileToDelete) return;

    // Remove from the appropriate array
    if (fileToDeleteFromAttached) {
      setAttachedFiles(prev => prev.filter(f => f.id !== fileId));
      // Adjust current index if needed
      if (currentFileIndex >= attachedFiles.length - 1) {
        setCurrentFileIndex(Math.max(0, attachedFiles.length - 2));
      }
    } else if (fileToDeleteFromUnassigned) {
      setUnassignedFiles(prev => prev.filter(f => f.id !== fileId));
      // Adjust current index if needed
      if (currentFileIndex >= unassignedFiles.length - 1) {
        setCurrentFileIndex(Math.max(0, unassignedFiles.length - 2));
      }
      // If no more unassigned files, switch back to assigned view
      if (unassignedFiles.length <= 1 && attachedFiles.length > 0) {
        setIsViewingUnassigned(false);
        setViewingOnlyOtherRows(false);
        setCurrentFileIndex(0);
      }
    }
    
    toast.success(`${fileToDelete.name} deleted`);
  };

  const handleUnassignFile = (fileId: string) => {
    const file = attachedFiles.find(f => f.id === fileId);
    if (!file) return;
    
    // Move file from attached to unassigned
    setAttachedFiles(prev => prev.filter(f => f.id !== fileId));
    setUnassignedFiles(prev => [...prev, file]);
    
    // Switch to viewing the unassigned file
    setIsViewingUnassigned(true);
    setCurrentFileIndex(unassignedFiles.length); // It will be at the end of unassigned array
    
    toast.info(`${file.name} moved to unassigned files`);
  };

  const handleReassignFile = (fileId: string) => {
    // Check if file is in unassigned files
    let file = unassignedFiles.find(f => f.id === fileId);
    let isFromOtherRow = false;
    
    // If not found, check if it's from another row
    if (!file) {
      const filesFromOtherRows = rows
        .filter(r => r.id !== editingRow?.id)
        .flatMap(r => r.attachedFiles || []);
      file = filesFromOtherRows.find(f => f.id === fileId);
      isFromOtherRow = true;
    }
    
    if (!file) return;
    
    if (isFromOtherRow) {
      // Remove from the other row and add to current row
      setRows(prev => prev.map(row => {
        if (row.attachedFiles?.some(f => f.id === fileId)) {
          return {
            ...row,
            attachedFiles: row.attachedFiles.filter(f => f.id !== fileId)
          };
        }
        return row;
      }));
      setAttachedFiles(prev => [...prev, file]);
    } else {
      // Move file from unassigned to attached
      setUnassignedFiles(prev => prev.filter(f => f.id !== fileId));
      setAttachedFiles(prev => [...prev, file]);
    }
    
    // Switch to viewing the newly assigned file
    setIsViewingUnassigned(false);
    setViewingOnlyOtherRows(false);
    setCurrentFileIndex(attachedFiles.length); // It will be at the end of attached array
    
    toast.success(`${file.name} assigned to this expense`);
  };

  const handleDownloadFile = (file: AttachedFile) => {
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Downloading ${file.name}`);
  };

  const handleToggleFullscreen = () => {
    if (!isFullscreen) {
      // Entering fullscreen - close the edit modal
      setShowEditRowModal(false);
    } else {
      // Exiting fullscreen - reopen the edit modal if we had an editing row
      if (editingRow) {
        setShowEditRowModal(true);
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 25, 50));
  };

  // Touch event handlers for pinch-to-zoom
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      touchStartDistance.current = distance;
      initialZoomLevel.current = zoomLevel;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && touchStartDistance.current !== null) {
      e.preventDefault();
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      
      const scale = distance / touchStartDistance.current;
      const newZoom = Math.min(Math.max(initialZoomLevel.current * scale, 50), 200);
      setZoomLevel(Math.round(newZoom));
    }
  };

  const handleTouchEnd = () => {
    touchStartDistance.current = null;
  };

  const handleRotateLeft = () => {
    setRotationAngle(prev => (prev - 90) % 360);
  };

  const handleRotateRight = () => {
    setRotationAngle(prev => (prev + 90) % 360);
  };

  // Helper function to get filtered unassigned files based on showAlreadyAssigned toggle
  const getFilteredUnassignedFiles = () => {
    const attachedFileIds = attachedFiles.map(f => f.id);
    
    // If viewing ONLY files from other rows, just show what's in unassignedFiles (already populated)
    if (viewingOnlyOtherRows) {
      return unassignedFiles.filter(f => f.sourceRowId && !attachedFileIds.includes(f.originalId || f.id));
    }
    
    // Normal mode: only show truly unassigned files (not from other rows)
    return unassignedFiles.filter(f => !f.sourceRowId && !attachedFileIds.includes(f.id));
  };

  const handlePreviousFile = () => {
    const currentFiles = isViewingUnassigned ? getFilteredUnassignedFiles() : attachedFiles;
    setCurrentFileIndex(prev => Math.max(0, prev - 1));
    setRotationAngle(0); // Reset rotation when switching files
  };

  const handleNextFile = () => {
    const currentFiles = isViewingUnassigned ? getFilteredUnassignedFiles() : attachedFiles;
    setCurrentFileIndex(prev => Math.min(currentFiles.length - 1, prev + 1));
    setRotationAngle(0); // Reset rotation when switching files
  };

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

  // Theme is now managed by App.tsx - no local theme management needed

  // Selection functions
  const isAllSelected = selectedRows.size === rows.length && rows.length > 0;
  const isPartiallySelected = selectedRows.size > 0 && selectedRows.size < rows.length;

  // Calculate expense values based on currency and exchange rate
  const calculateExpenseValues = (expenseTotal: string, currency: string) => {
    const total = parseFloat(expenseTotal) || 0;
    const exchangeRate = EXCHANGE_RATES[currency] || 1;
    const fxTotalLocal = total * exchangeRate;
    const gbpNet = fxTotalLocal; // Same as FX total for now
    const plannedExpense = 0; // Default to 0 for now
    
    return {
      expenseFxTotalLocal: fxTotalLocal.toFixed(2),
      expenseGbpNet: gbpNet.toFixed(2),
      plannedExpenseGbp: plannedExpense.toFixed(2)
    };
  };

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(rows.map(row => row.id)));
    }
  };

  const toggleRowSelection = (rowId: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent opening the edit modal
    const newSelection = new Set(selectedRows);
    if (newSelection.has(rowId)) {
      newSelection.delete(rowId);
    } else {
      newSelection.add(rowId);
    }
    setSelectedRows(newSelection);
  };

  // Theme functions are now passed as props from App.tsx

  // View mode functions
  const toggleViewMode = () => {
    // Prevent toggling to grid mode on mobile
    if (isMobile) return;
    
    setViewMode(viewMode === 'stacked' ? 'grid' : 'stacked');
    setEditingCell(null); // Clear any editing state when switching views
    setIsAddingInlineRow(false); // Cancel inline row addition when switching views
    setIsGridExpanded(false); // Close expanded grid when switching views
  };

  // Get current view mode (force stacked on mobile)
  const currentViewMode = isMobile ? 'stacked' : viewMode;

  // Other functions
  const openAddExpenseModal = (preselectedCategory?: string) => {
    if (preselectedCategory) {
      setNewExpense({
        category: preselectedCategory,
        date: new Date().toISOString().split('T')[0],
        description: "",
        amount: ""
      });
    }
    setShowAddExpenseModal(true);
  };

  const closeAddExpenseModal = () => {
    setShowAddExpenseModal(false);
    setNewExpense({
      category: "",
      date: new Date().toISOString().split('T')[0],
      description: "",
      amount: ""
    });
  };

  const saveNewExpense = () => {
    if (!newExpense.category || !newExpense.description || !newExpense.amount) {
      return; // Basic validation
    }

    const formattedDate = new Date(newExpense.date).toLocaleDateString("en-GB");
    const newRow: ExpenseRow = {
      id: Date.now().toString(),
      category: newExpense.category,
      date: formattedDate,
      description: newExpense.description,
      amount: `${newExpense.amount} GBP`,
      status: "neutral"
    };
    
    setRows([...rows, newRow]);
    closeAddExpenseModal();
  };

  const openHeaderModal = () => {
    setShowHeaderModal(true);
  };

  const closeHeaderModal = () => {
    setShowHeaderModal(false);
  };

  const saveHeaderDetails = () => {
    setShowHeaderModal(false);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setHeaderDetails({ ...headerDetails, image: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const openEditRowModal = (row: ExpenseRow) => {
    setEditingRow(row);
    // Convert amount from "XXX.XX GBP" format to just number for editing
    const amountNumber = row.amount.replace(' GBP', '').replace(/,/g, '');
    // Convert date from "2/6/25" format to "YYYY-MM-DD" format for date input
    const dateParts = row.date.split('/');
    const formattedDate = dateParts.length === 3 
      ? `20${dateParts[2]}-${dateParts[1].padStart(2, '0')}-${dateParts[0].padStart(2, '0')}`
      : new Date().toISOString().split('T')[0];
    
    setEditFormData({
      category: row.category,
      date: formattedDate,
      description: row.description,
      amount: amountNumber,
      status: row.status,
      receiptImage: "",
      expenseCurrency: row.expenseCurrency || "AED",
      expenseTotal: row.expenseTotal || amountNumber
    });
    
    // Initialize attachedFiles from the row's attachedFiles
    setAttachedFiles(row.attachedFiles || []);
    setUnassignedFiles([]);
    setCurrentFileIndex(0);
    setIsViewingUnassigned(false);
    setViewingOnlyOtherRows(false);
    setZoomLevel(100);
    setRotationAngle(0);
    
    setShowEditRowModal(true);
  };

  const closeEditRowModal = () => {
    setShowEditRowModal(false);
    setEditingRow(null);
    setEditFormData({
      category: "",
      date: "",
      description: "",
      amount: "",
      status: "neutral",
      receiptImage: "",
      expenseCurrency: "AED",
      expenseTotal: ""
    });
    // Reset file state
    setAttachedFiles([]);
    setUnassignedFiles([]);
    setCurrentFileIndex(0);
    setIsViewingUnassigned(false);
    setViewingOnlyOtherRows(false);
    setZoomLevel(100);
    setRotationAngle(0);
  };

  const saveEditedRow = () => {
    if (!editFormData.category || !editFormData.description || !editFormData.amount) {
      return; // Basic validation
    }

    const formattedDate = new Date(editFormData.date).toLocaleDateString("en-GB");
    const calculatedValues = calculateExpenseValues(editFormData.expenseTotal, editFormData.expenseCurrency);
    
    if (!editingRow) {
      // Creating a new expense
      const newRow: ExpenseRow = {
        id: Date.now().toString(),
        category: editFormData.category,
        date: formattedDate,
        description: editFormData.description,
        amount: `${editFormData.amount} GBP`,
        status: editFormData.status,
        expenseTotal: editFormData.expenseTotal,
        expenseCurrency: editFormData.expenseCurrency,
        expenseFxTotalLocal: calculatedValues.expenseFxTotalLocal,
        expenseGbpNet: calculatedValues.expenseGbpNet,
        plannedExpenseGbp: calculatedValues.plannedExpenseGbp,
        attachedFiles: attachedFiles
      };
      setRows([...rows, newRow]);
    } else {
      // Editing existing expense
      const updatedRow: ExpenseRow = {
        ...editingRow,
        category: editFormData.category,
        date: formattedDate,
        description: editFormData.description,
        amount: `${editFormData.amount} GBP`,
        status: editFormData.status,
        expenseTotal: editFormData.expenseTotal,
        expenseCurrency: editFormData.expenseCurrency,
        expenseFxTotalLocal: calculatedValues.expenseFxTotalLocal,
        expenseGbpNet: calculatedValues.expenseGbpNet,
        plannedExpenseGbp: calculatedValues.plannedExpenseGbp,
        attachedFiles: attachedFiles
      };
      setRows(rows.map(row => row.id === editingRow.id ? updatedRow : row));
    }
    
    closeEditRowModal();
  };

  // Bulk action functions
  const handleBulkUpdate = () => {
    // Open edit modal for first selected row as an example
    // In a real app, this might open a bulk edit dialog
    const firstSelectedRow = rows.find(row => selectedRows.has(row.id));
    if (firstSelectedRow) {
      openEditRowModal(firstSelectedRow);
    }
  };

  const handleBulkCopy = () => {
    const count = selectedRows.size;
    const rowText = count !== 1 ? 'rows' : 'row';
    
    const rowsToCopy = rows.filter(row => selectedRows.has(row.id));
    const copiedRows = rowsToCopy.map(row => ({
      ...row,
      id: `${row.id}-copy-${Date.now()}`,
      description: `${row.description} (Copy)`
    }));
    setRows([...rows, ...copiedRows]);
    setSelectedRows(new Set());
    
    toast.success(`Successfully copied ${count} ${rowText}`);
  };

  const handleBulkSplit = () => {
    // Initialize individual splits for selected rows
    const newIndividualSplits: typeof individualSplits = {};
    rows.filter(row => selectedRows.has(row.id)).forEach(row => {
      newIndividualSplits[row.id] = {
        expenseTotal: { method: 'percentage', percentage: '50', value: '' },
        expenseFxTotalLocal: { method: 'percentage', percentage: '50', value: '' },
        expenseGbpNet: { method: 'percentage', percentage: '50', value: '' },
        plannedExpenseGbp: { method: 'percentage', percentage: '50', value: '' }
      };
    });
    setIndividualSplits(newIndividualSplits);
    setShowSplitModal(true);
  };

  const applySplit = () => {
    const count = selectedRows.size;
    const rowText = count !== 1 ? 'rows' : 'row';
    
    if (splitMode === 'simple-rows') {
      // Simple mode: split into N equal rows
      const numSplits = parseInt(numberOfSplits) || 2;
      const rowsToSplit = rows.filter(row => selectedRows.has(row.id));
      
      // Create N-1 new rows (since we keep 1 original)
      const allNewRows: ExpenseRow[] = [];
      
      rowsToSplit.forEach(row => {
        // Get original values
        const originalExpenseTotal = parseFloat(row.expenseTotal || row.amount.replace(' GBP', '').replace(/,/g, ''));
        const originalFxTotal = parseFloat(row.expenseFxTotalLocal || '0');
        const originalGbpNet = parseFloat(row.expenseGbpNet || '0');
        const originalPlanned = parseFloat(row.plannedExpenseGbp || '0');
        
        // Calculate equal split amounts
        const splitExpenseTotal = originalExpenseTotal / numSplits;
        const splitFxTotal = originalFxTotal / numSplits;
        const splitGbpNet = originalGbpNet / numSplits;
        const splitPlanned = originalPlanned / numSplits;
        
        // Create N-1 new split rows
        for (let i = 1; i < numSplits; i++) {
          allNewRows.push({
            ...row,
            id: `${row.id}-split-${i}-${Date.now()}`,
            description: `${row.description} (${i + 1}/${numSplits})`,
            amount: `${splitGbpNet.toFixed(2)} GBP`,
            expenseTotal: splitExpenseTotal.toFixed(2),
            expenseFxTotalLocal: splitFxTotal.toFixed(2),
            expenseGbpNet: splitGbpNet.toFixed(2),
            plannedExpenseGbp: splitPlanned.toFixed(2)
          });
        }
      });
      
      // Update original rows with split amounts and new description
      const updatedRows = rows.map(row => {
        if (selectedRows.has(row.id)) {
          const numSplits = parseInt(numberOfSplits) || 2;
          const originalExpenseTotal = parseFloat(row.expenseTotal || row.amount.replace(' GBP', '').replace(/,/g, ''));
          const originalFxTotal = parseFloat(row.expenseFxTotalLocal || '0');
          const originalGbpNet = parseFloat(row.expenseGbpNet || '0');
          const originalPlanned = parseFloat(row.plannedExpenseGbp || '0');
          
          const splitExpenseTotal = originalExpenseTotal / numSplits;
          const splitFxTotal = originalFxTotal / numSplits;
          const splitGbpNet = originalGbpNet / numSplits;
          const splitPlanned = originalPlanned / numSplits;
          
          return {
            ...row,
            description: `${row.description} (1/${numSplits})`,
            amount: `${splitGbpNet.toFixed(2)} GBP`,
            expenseTotal: splitExpenseTotal.toFixed(2),
            expenseFxTotalLocal: splitFxTotal.toFixed(2),
            expenseGbpNet: splitGbpNet.toFixed(2),
            plannedExpenseGbp: splitPlanned.toFixed(2)
          };
        }
        return row;
      });
      
      setRows([...updatedRows, ...allNewRows]);
      setSelectedRows(new Set());
      setShowSplitModal(false);
      setNumberOfSplits('2');
      
      toast.success(`Successfully split expense into ${numSplits} rows`);
      return;
    }
    
    // Field-by-field mode: original behavior
    // Helper function to calculate split value for a field
    const getSplitValue = (rowId: string, field: keyof typeof individualSplits[string], originalValue: number) => {
      const fieldSplit = individualSplits[rowId]?.[field];
      if (!fieldSplit) return originalValue / 2;
      
      if (fieldSplit.method === 'percentage') {
        const percentage = parseFloat(fieldSplit.percentage) || 50;
        return (originalValue * percentage) / 100;
      } else {
        return parseFloat(fieldSplit.value) || 0;
      }
    };
    
    // Split selected expenses - create additional row for each selected expense
    const rowsToSplit = rows.filter(row => selectedRows.has(row.id));
    const splitRows = rowsToSplit.map(row => {
      // Get original values
      const originalExpenseTotal = parseFloat(row.expenseTotal || row.amount.replace(' GBP', '').replace(/,/g, ''));
      const originalFxTotal = parseFloat(row.expenseFxTotalLocal || '0');
      const originalGbpNet = parseFloat(row.expenseGbpNet || '0');
      const originalPlanned = parseFloat(row.plannedExpenseGbp || '0');
      
      // Calculate split amounts for each field
      const splitExpenseTotal = getSplitValue(row.id, 'expenseTotal', originalExpenseTotal);
      const splitFxTotal = getSplitValue(row.id, 'expenseFxTotalLocal', originalFxTotal);
      const splitGbpNet = getSplitValue(row.id, 'expenseGbpNet', originalGbpNet);
      const splitPlanned = getSplitValue(row.id, 'plannedExpenseGbp', originalPlanned);
      
      return {
        ...row,
        id: `${row.id}-split-${Date.now()}`,
        description: `${row.description} (Split)`,
        amount: `${splitGbpNet.toFixed(2)} GBP`,
        expenseTotal: splitExpenseTotal.toFixed(2),
        expenseFxTotalLocal: splitFxTotal.toFixed(2),
        expenseGbpNet: splitGbpNet.toFixed(2),
        plannedExpenseGbp: splitPlanned.toFixed(2)
      };
    });
    
    // Update original rows with remaining amounts
    const updatedRows = rows.map(row => {
      if (selectedRows.has(row.id)) {
        // Get original values
        const originalExpenseTotal = parseFloat(row.expenseTotal || row.amount.replace(' GBP', '').replace(/,/g, ''));
        const originalFxTotal = parseFloat(row.expenseFxTotalLocal || '0');
        const originalGbpNet = parseFloat(row.expenseGbpNet || '0');
        const originalPlanned = parseFloat(row.plannedExpenseGbp || '0');
        
        // Calculate split amounts for each field
        const splitExpenseTotal = getSplitValue(row.id, 'expenseTotal', originalExpenseTotal);
        const splitFxTotal = getSplitValue(row.id, 'expenseFxTotalLocal', originalFxTotal);
        const splitGbpNet = getSplitValue(row.id, 'expenseGbpNet', originalGbpNet);
        const splitPlanned = getSplitValue(row.id, 'plannedExpenseGbp', originalPlanned);
        
        // Calculate remaining amounts
        const remainingExpenseTotal = originalExpenseTotal - splitExpenseTotal;
        const remainingFxTotal = originalFxTotal - splitFxTotal;
        const remainingGbpNet = originalGbpNet - splitGbpNet;
        const remainingPlanned = originalPlanned - splitPlanned;
        
        return {
          ...row,
          amount: `${remainingGbpNet.toFixed(2)} GBP`,
          expenseTotal: remainingExpenseTotal.toFixed(2),
          expenseFxTotalLocal: remainingFxTotal.toFixed(2),
          expenseGbpNet: remainingGbpNet.toFixed(2),
          plannedExpenseGbp: remainingPlanned.toFixed(2)
        };
      }
      return row;
    });
    
    setRows([...updatedRows, ...splitRows]);
    setSelectedRows(new Set());
    setShowSplitModal(false);
    setIndividualSplits({});
    setSplitPercentage('50');
    setSplitValue('');
    
    toast.success('Successfully split expense');
  };

  const handleBulkDelete = () => {
    const count = selectedRows.size;
    const rowText = count !== 1 ? 'rows' : 'row';
    
    const newRows = rows.filter(row => !selectedRows.has(row.id));
    setRows(newRows);
    setSelectedRows(new Set());
    setShowDeleteDialog(false);
    
    toast.error(`Deleted ${count} ${rowText}`);
  };

  const handlePartialReturn = () => {
    // Check if all rows are selected
    if (selectedRows.size === rows.length && rows.length > 0) {
      setShowPartialReturnAlert(true);
    } else {
      // Open the messages modal in return action mode for partial return
      setIsReturnAction(true);
      setShowMessagesModal(true);
    }
  };

  // Message handler functions
  const handleEditMessage = (messageId: string, messageText: string) => {
    setEditingMessageId(messageId);
    setNewMessageText(messageText);
  };

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter(m => m.id !== messageId));
    toast.error("Message deleted");
  };

  const handleSaveEditedMessage = () => {
    if (!editingMessageId || !newMessageText.trim()) return;
    
    setMessages(messages.map(m => 
      m.id === editingMessageId 
        ? { ...m, text: newMessageText.trim() }
        : m
    ));
    setEditingMessageId(null);
    setNewMessageText("");
    toast.success("Message updated");
  };

  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setNewMessageText("");
  };

  // Add new row function
  const addNewRow = () => {
    const today = new Date().toLocaleDateString("en-GB");
    const newRow: ExpenseRow = {
      id: Date.now().toString(),
      category: "",
      date: today,
      description: "",
      amount: "",
      status: "success" // Use success status for blue styling
    };
    
    setRows([...rows, newRow]);
    // Ensure inline editing state is cleared
    setIsAddingInlineRow(false);
  };

  // Inline row functions
  const saveInlineRow = () => {
    if (!inlineRowData.category || !inlineRowData.description || !inlineRowData.amount) {
      return; // Basic validation
    }

    const formattedDate = new Date(inlineRowData.date).toLocaleDateString("en-GB");
    const newRow: ExpenseRow = {
      id: Date.now().toString(),
      category: inlineRowData.category,
      date: formattedDate,
      description: inlineRowData.description,
      amount: `${inlineRowData.amount} GBP`,
      status: inlineRowData.status
    };
    
    setRows([...rows, newRow]);
    setIsAddingInlineRow(false);
    setInlineRowData({
      category: "",
      date: new Date().toISOString().split('T')[0],
      description: "",
      amount: "",
      status: "neutral"
    });
  };

  const cancelInlineRow = () => {
    setIsAddingInlineRow(false);
    setInlineRowData({
      category: "",
      date: new Date().toISOString().split('T')[0],
      description: "",
      amount: "",
      status: "neutral"
    });
  };

  // Cell editing functions for grid view
  const startCellEdit = (rowId: string, field: string, currentValue: string) => {
    setEditingCell({ rowId, field });
    setEditValue(currentValue);
  };

  const saveCellEdit = () => {
    if (!editingCell) return;

    const { rowId, field } = editingCell;
    const updatedRows = rows.map(row => {
      if (row.id === rowId) {
        if (field === 'amount') {
          return { ...row, [field]: `${editValue} GBP` };
        } else if (field === 'date') {
          const formattedDate = new Date(editValue).toLocaleDateString("en-GB");
          return { ...row, [field]: formattedDate };
        } else {
          return { ...row, [field]: editValue };
        }
      }
      return row;
    });

    setRows(updatedRows);
    setEditingCell(null);
    setEditValue('');
  };

  const cancelCellEdit = () => {
    setEditingCell(null);
    setEditValue('');
  };

  // File upload and AI processing handlers
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  // Mock AI processing function that simulates extracting expense data from receipt
  const processFile = async (file: File) => {
    // Check file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload a valid file (JPG, PNG, or PDF)');
      return;
    }

    setUploadedFile(file);
    setIsProcessing(true);

    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Mock extracted data - in a real implementation, this would come from an AI service
    const mockExtractedExpenses: ExpenseRow[] = [
      {
        id: Date.now().toString(),
        category: "Meals",
        date: new Date().toLocaleDateString("en-GB"),
        description: `Extracted from ${file.name}`,
        amount: "75.50 GBP",
        status: "success"
      },
      {
        id: (Date.now() + 1).toString(),
        category: "Transportation",
        date: new Date().toLocaleDateString("en-GB"),
        description: "Taxi fare",
        amount: "25.00 GBP",
        status: "success"
      }
    ];

    // Add the extracted expenses to the list
    setRows([...mockExtractedExpenses, ...rows]);
    setIsProcessing(false);
    setUploadedFile(null);

    // Show success toast with number of expenses extracted
    toast.success(`Successfully extracted ${mockExtractedExpenses.length} expense${mockExtractedExpenses.length === 1 ? '' : 's'} from ${file.name}`);
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
        {sidebarOpen && (
          <span className={`text-sm whitespace-nowrap group-hover:text-sidebar-primary ${active ? 'text-sidebar-primary font-medium' : 'text-sidebar-foreground'}`}>
            {label}
          </span>
        )}
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

  const StatusIcon = ({ status }: { status: string }) => {
    const iconProps = "size-4";
    switch (status) {
      case 'warning':
        return (
          <div className={iconProps}>
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
              <path d={warningSvgPaths.p3f03800} fill="var(--color-warning)" />
              <path d="M8.0013 10.9987C7.73624 10.9988 7.48172 11.1043 7.29427 11.2917C7.10684 11.4791 7.00143 11.7337 7.0013 11.9987C7.0013 12.2639 7.10673 12.5192 7.29427 12.7067C7.48171 12.8941 7.73651 12.9987 8.0016 12.9987C8.26632 12.9987 8.52084 12.894 8.70833 12.7067C8.89587 12.5192 9.0016 12.2639 9.0016 11.9987C9.00148 11.7337 8.89606 11.4791 8.70863 11.2917C8.52112 11.1043 8.26669 10.9987 8.0016 10.9987ZM7.99965 3.9987C7.87326 3.99877 7.74797 4.02552 7.63246 4.07683C7.51701 4.12814 7.4135 4.20384 7.32875 4.29753C7.24413 4.39119 7.17972 4.50184 7.14027 4.62175C7.10092 4.74156 7.08677 4.86833 7.09926 4.99382L7.44984 8.50163C7.46171 8.63923 7.52487 8.76759 7.6266 8.86101C7.72841 8.95438 7.8615 9.00651 7.99965 9.00651C8.1378 9.00651 8.27088 8.95438 8.3727 8.86101C8.47443 8.76759 8.53759 8.63923 8.54945 8.50163L8.90004 4.99382C8.95379 4.46099 8.53452 3.9987 7.99965 3.9987Z" fill="white" />
            </svg>
          </div>
        );
      case 'error':
        return (
          <div className={iconProps}>
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
              <path d={errorSvgPaths.p2d472380} fill="var(--color-destructive)" />
              <path d="M8.0016 9.9987C7.7365 9.99871 7.48208 10.1043 7.29457 10.2917C7.10715 10.4791 7.00173 10.7337 7.0016 10.9987C7.0016 11.2639 7.10703 11.5192 7.29457 11.7067C7.48207 11.8941 7.73651 11.9987 8.0016 11.9987C8.26669 11.9987 8.52112 11.8941 8.70863 11.7067C8.89617 11.5192 9.0016 11.2639 9.0016 10.9987C9.00148 10.7337 8.89606 10.4791 8.70863 10.2917C8.52112 10.1043 8.26669 9.9987 8.0016 9.9987ZM7.99965 3.9987C7.87326 3.99877 7.74797 4.02552 7.63246 4.07683C7.51701 4.12814 7.4135 4.20384 7.32875 4.29753C7.24413 4.39119 7.17972 4.50184 7.14027 4.62175C7.10092 4.74156 7.08677 4.86833 7.09926 4.99382L7.44984 8.50163C7.46171 8.63923 7.52487 8.76759 7.6266 8.86101C7.72841 8.95438 7.8615 9.00651 7.99965 9.00651C8.1378 9.00651 8.27088 8.95438 8.3727 8.86101C8.47443 8.76759 8.53759 8.63923 8.54945 8.50163L8.90004 4.99382C8.95379 4.46099 8.53452 3.9987 7.99965 3.9987Z" fill="white" />
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  const SkeletonExpenseRow = () => {
    return (
      <div className="bg-sidebar relative rounded-[10px] w-full border border-sidebar shadow-[0_0_12px_rgba(0,0,0,0.06)]">
        <div className="flex flex-row gap-4 items-start justify-start p-4">
          {/* Checkbox and Status skeleton */}
          <div className="flex flex-col gap-[15px] h-20 items-start justify-start overflow-clip pb-[5px] pt-1 px-1">
            <div className="relative rounded size-4 bg-muted animate-pulse" />
            <div className="relative rounded size-4 bg-muted animate-pulse" />
          </div>

          {/* Image skeleton */}
          <div className="relative rounded-[10px] size-20 border border-border bg-muted animate-pulse" />

          {/* Content skeleton */}
          <div className="basis-0 flex flex-col gap-4 grow items-start justify-start px-0 py-2 self-stretch">
            <div className="flex flex-row items-start justify-between w-full">
              <div className="h-4 bg-muted rounded w-28 animate-pulse" />
              <div className="h-4 bg-muted rounded w-4 animate-pulse" />
            </div>
            <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
            <div className="flex flex-row items-end justify-between w-full">
              <div className="basis-0 grow" />
              <div className="h-4 bg-muted rounded w-24 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const SkeletonHeaderDetails = () => {
    return (
      <div className="w-full inline-flex flex-row gap-3 items-center justify-start border-b py-4">
        {/* Image skeleton */}
        <div className="bg-muted relative rounded-[10px] border border-border shrink-0 size-20 animate-pulse" />
        
        {/* Separator */}
        <div className="bg-border h-full w-px shrink-0" />
        
        {/* Short Description skeleton */}
        <div className="flex flex-col min-w-[130px] shrink-0 gap-2">
          <div className="h-3 bg-muted rounded w-28 animate-pulse" />
          <div className="h-4 bg-muted rounded w-32 animate-pulse" />
        </div>
        
        {/* Separator */}
        <div className="bg-border h-full w-px shrink-0" />
        
        {/* Charge To skeleton */}
        <div className="flex flex-col min-w-[110px] shrink-0 gap-2">
          <div className="h-3 bg-muted rounded w-20 animate-pulse" />
          <div className="h-4 bg-muted rounded w-24 animate-pulse" />
        </div>
        
        {/* Separator */}
        <div className="bg-border h-full w-px shrink-0" />
        
        {/* Colleagues skeleton */}
        <div className="flex flex-col min-w-[140px] shrink-0 gap-2">
          <div className="h-3 bg-muted rounded w-20 animate-pulse" />
          <div className="h-4 bg-muted rounded w-16 animate-pulse" />
        </div>
        
        {/* Separator */}
        <div className="bg-border h-full w-px shrink-0" />
        
        {/* Date From skeleton */}
        <div className="flex flex-col min-w-[90px] shrink-0 gap-2">
          <div className="h-3 bg-muted rounded w-16 animate-pulse" />
          <div className="h-4 bg-muted rounded w-20 animate-pulse" />
        </div>
        
        {/* Separator */}
        <div className="bg-border h-full w-px shrink-0" />
        
        {/* Date To skeleton */}
        <div className="flex flex-col min-w-[90px] shrink-0 gap-2">
          <div className="h-3 bg-muted rounded w-14 animate-pulse" />
          <div className="h-4 bg-muted rounded w-20 animate-pulse" />
        </div>
        
        {/* Separator */}
        <div className="bg-border h-full w-px shrink-0" />
        
        {/* Project skeleton */}
        <div className="flex flex-col min-w-[130px] shrink-0 gap-2">
          <div className="h-3 bg-muted rounded w-12 animate-pulse" />
          <div className="h-4 bg-muted rounded w-28 animate-pulse" />
        </div>
        
        {/* Separator */}
        <div className="bg-border h-full w-px shrink-0" />
        
        {/* Edit Icon space */}
        <div className="ml-auto shrink-0">
          <div className="size-4 bg-muted rounded animate-pulse" />
        </div>
      </div>
    );
  };

  const ExpenseRowComponent = ({ row }: { row: ExpenseRow }) => {
    const borderColor = {
      warning: 'border-warning',
      error: 'border-destructive',
      success: 'border-success',
      neutral: 'border-sidebar'
    }[row.status];

    const isSelected = selectedRows.has(row.id);

    // Only show validation status if Save & Validate has been clicked
    const showValidation = isValidated;
    const effectiveBorderColor = showValidation ? borderColor : 'border-sidebar';
    const effectiveStatus = showValidation ? row.status : 'neutral';

    return (
      <div className={`bg-sidebar relative rounded-[10px] w-full border ${isSelected ? 'border-primary' : effectiveBorderColor} cursor-pointer shadow-[0_0_12px_rgba(0,0,0,0.06)] transition-all group`}>
        <div className="flex flex-row gap-4 p-4">
          {/* Checkbox and Status Column */}
          <div 
            className="flex flex-col gap-[15px] items-start justify-start flex-shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <div 
              className={`relative rounded size-4 border cursor-pointer flex items-center justify-center ${
                isSelected 
                  ? 'bg-primary border-primary' 
                  : 'bg-card border-primary hover:border-2'
              }`}
              onClick={(e) => toggleRowSelection(row.id, e)}
            >
              {isSelected && (
                <Check className="size-4 text-primary-foreground" />
              )}
            </div>
            <StatusIcon status={effectiveStatus} />
          </div>

          {/* Main Content Column */}
          <div className="flex flex-col gap-4 flex-grow" onClick={() => openEditRowModal(row)}>
            {/* Image and Details Row */}
            <div className="flex flex-row gap-4 items-start justify-start">
              {/* Image */}
              <div className="relative rounded-[10px] size-20 border border-border overflow-hidden">
                {!row.attachedFiles || row.attachedFiles.length === 0 ? (
                  /* No files - Show dashed border with upload icon */
                  <div className="absolute inset-0 border-2 border-dashed border-muted-foreground/30 rounded-[10px] flex items-center justify-center bg-muted/20">
                    <Upload className="size-6 text-muted-foreground/50" />
                  </div>
                ) : (
                  /* Has files - Show preview */
                  <>
                    {row.attachedFiles[0].type === 'image' ? (
                      <img
                        src={row.attachedFiles[0].url}
                        alt={row.attachedFiles[0].name}
                        className="absolute inset-0 w-full h-full object-cover rounded-[10px]"
                      />
                    ) : row.attachedFiles[0].type === 'pdf' ? (
                      <div className="absolute inset-0 flex items-center justify-center bg-red-50 rounded-[10px]">
                        <FileType className="h-10 w-10 text-red-500" />
                      </div>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-muted rounded-[10px]">
                        <File className="h-10 w-10 text-muted-foreground" />
                      </div>
                    )}
                    
                    {/* Multiple files overlay */}
                    {row.attachedFiles.length > 1 && (
                      <div className="absolute inset-0 bg-black/60 rounded-[10px] flex items-center justify-center">
                        <span className="text-white font-semibold text-lg">
                          +{row.attachedFiles.length - 1}
                        </span>
                      </div>
                    )}
                  </>
                )}
                
                {/* Edit hover overlay */}
                <div className="absolute inset-0 bg-[rgba(0,0,0,0)] bg-opacity-0 group-hover:bg-opacity-20 rounded-[10px] flex items-center justify-center transition-all">
                </div>
              </div>

              {/* Content */}
              <div className="basis-0 flex flex-col gap-4 grow items-start justify-start px-0 py-0 self-stretch">
                <div className="flex flex-row items-start justify-between w-full">
                  <div className="text-primary text-sm">{row.category || "Click to add category"}</div>
                  <div className="flex items-center gap-2">
                    {row.badge && (
                      <div className="bg-success text-success-foreground text-xs px-2 py-1 rounded">
                        {row.badge}
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-foreground text-sm flex items-center gap-2">
                  <span>{row.date || "Click to add date"}</span>
                  <span className="border-l border-border self-stretch"></span>
                  <span>{row.description || "Click to add description"}</span>
                </div>
              </div>
            </div>
            
            {/* Calculations Row */}
            <div className="flex items-center justify-end gap-2 text-xs flex-wrap">
              <div className="flex flex-col items-end min-w-0 flex-shrink">
                <div className="text-[10px] text-muted-foreground mb-0.5 whitespace-nowrap overflow-hidden text-ellipsis max-w-full">Expense Total</div>
                <div className="font-bold text-foreground whitespace-nowrap overflow-hidden text-ellipsis max-w-full">
                  {row.expenseTotal ? `${row.expenseTotal} ${row.expenseCurrency}` : "0.00 AED"}
                </div>
              </div>
              <span className="border-l border-border self-stretch"></span>
              <div className="flex flex-col items-end min-w-0 flex-shrink">
                <div className="text-[10px] text-muted-foreground mb-0.5 whitespace-nowrap overflow-hidden text-ellipsis max-w-full">Expense FX Total Local</div>
                <div className="font-bold text-foreground whitespace-nowrap overflow-hidden text-ellipsis max-w-full">
                  {row.expenseFxTotalLocal ? `${row.expenseFxTotalLocal} GBP` : "0.00 GBP"}
                </div>
              </div>
              <span className="border-l border-border self-stretch"></span>
              <div className="flex flex-col items-end min-w-0 flex-shrink">
                <div className="text-[10px] text-muted-foreground mb-0.5 whitespace-nowrap overflow-hidden text-ellipsis max-w-full">Expense GBP Net</div>
                <div className="font-bold text-foreground whitespace-nowrap overflow-hidden text-ellipsis max-w-full">
                  {row.expenseGbpNet ? `${row.expenseGbpNet} GBP` : "0.00 GBP"}
                </div>
              </div>
              <span className="border-l border-border self-stretch"></span>
              <div className="flex flex-col items-end min-w-0 flex-shrink">
                <div className="text-[10px] text-muted-foreground mb-0.5 whitespace-nowrap overflow-hidden text-ellipsis max-w-full">Planned Expense GBP</div>
                <div className="font-bold text-foreground whitespace-nowrap overflow-hidden text-ellipsis max-w-full">
                  {row.plannedExpenseGbp ? `${row.plannedExpenseGbp} GBP` : "0.00 GBP"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const InlineAddExpenseRow = () => {
    return (
      <div className="bg-blue-50 border-2 border-dashed border-blue-300 rounded-[10px] p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Label htmlFor="inlineCategory" className="text-xs">Category</Label>
            <Select 
              value={inlineRowData.category} 
              onValueChange={(value) => setInlineRowData({...inlineRowData, category: value})}
            >
              <SelectTrigger className="h-8 text-xs">
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

          <div>
            <Label htmlFor="inlineDate" className="text-xs">Date</Label>
            <Input
              id="inlineDate"
              type="date"
              value={inlineRowData.date}
              onChange={(e) => setInlineRowData({...inlineRowData, date: e.target.value})}
              className="h-8 text-xs"
            />
          </div>

          <div>
            <Label htmlFor="inlineDescription" className="text-xs">Description</Label>
            <Input
              id="inlineDescription"
              value={inlineRowData.description}
              onChange={(e) => setInlineRowData({...inlineRowData, description: e.target.value})}
              placeholder="Enter description"
              className="h-8 text-xs"
            />
          </div>

          <div>
            <Label htmlFor="inlineAmount" className="text-xs">Amount (GBP)</Label>
            <Input
              id="inlineAmount"
              type="number"
              step="0.01"
              value={inlineRowData.amount}
              onChange={(e) => setInlineRowData({...inlineRowData, amount: e.target.value})}
              placeholder="0.00"
              className="h-8 text-xs"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button
            size="sm"
            variant="outline"
            onClick={cancelInlineRow}
            className="h-8 px-3 text-xs"
          >
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={saveInlineRow}
            className="h-8 px-3 text-xs bg-blue-600 hover:bg-blue-700"
          >
            <Save className="size-3 mr-1" />
            Save
          </Button>
        </div>
      </div>
    );
  };

  const AddExpenseButton = () => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleManualAdd = (e: React.MouseEvent) => {
      e.stopPropagation(); // Prevent triggering the file upload
      setEditingRow(null); // Set to null to indicate creating new expense
      setEditFormData({
        category: '',
        date: new Date().toISOString().split('T')[0],
        description: '',
        amount: '',
        status: 'neutral',
        receiptImage: ''
      });
      setShowEditRowModal(true);
    };

    return (
      <div className="relative">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,application/pdf"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        {/* Desktop: Drag & Drop Upload Area */}
        <div 
          className="hidden md:block relative w-full"
        >
          <div className={`w-full flex flex-row items-center justify-center gap-3 pt-4 transition-colors`}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (!isProcessing) {
                  fileInputRef.current?.click();
                }
              }}
              onDragEnter={handleDragEnter}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`w-full h-11 flex flex-row items-center justify-center gap-3 cursor-pointer rounded-lg transition-all ${
                isDragging 
                  ? 'bg-blue-50 dark:bg-blue-950 border-2 border-dashed border-blue-500' 
                  : 'bg-sidebar hover:bg-sidebar-accent shadow-[0_0_12px_rgba(0,0,0,0.06)]'
              }`}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Sparkles className="size-5 animate-pulse" style={{ 
                    animation: 'colorShift 2s ease-in-out infinite',
                    color: 'rgb(147, 51, 234)'
                  }} />
                  <span 
                    className="text-sm"
                    style={{
                      background: 'linear-gradient(90deg, rgb(168, 85, 247), rgb(236, 72, 153), rgb(59, 130, 246), rgb(6, 182, 212), rgb(168, 85, 247))',
                      backgroundSize: '200% 100%',
                      WebkitBackgroundClip: 'text',
                      backgroundClip: 'text',
                      color: 'transparent',
                      animation: 'gradientSlide 3s linear infinite'
                    }}
                  >
                    Processing document...
                  </span>
                  <style>{`
                    @keyframes colorShift {
                      0%, 100% { color: rgb(147, 51, 234); }
                      33% { color: rgb(236, 72, 153); }
                      66% { color: rgb(59, 130, 246); }
                    }
                    @keyframes gradientSlide {
                      0% { background-position: 0% 0%; }
                      100% { background-position: 200% 0%; }
                    }
                  `}</style>
                </>
              ) : (
                <>
                  <Sparkles className={`size-5 ${isDragging ? 'text-blue-600' : 'text-purple-500'}`} />
                  <div className="text-center">
                    <span 
                      className={`text-sm ${isDragging ? 'text-blue-600' : ''}`}
                      style={isDragging ? {} : {
                        background: 'linear-gradient(90deg, rgb(168, 85, 247), rgb(236, 72, 153), rgb(59, 130, 246), rgb(6, 182, 212), rgb(168, 85, 247))',
                        backgroundSize: '200% 100%',
                        WebkitBackgroundClip: 'text',
                        backgroundClip: 'text',
                        color: 'transparent'
                      }}
                    >
                      {isDragging ? 'Drop receipt here' : 'Drop receipt or click to upload'}
                    </span>
                    {!isDragging && (
                      <span className="text-sm text-muted-foreground ml-1">
                        - AI will extract data, or{' '}
                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            handleManualAdd(e);
                          }}
                          className="text-blue-600 hover:text-blue-700 underline cursor-pointer inline"
                        >
                          click here
                        </span>
                        {' '}to add manually
                      </span>
                    )}
                  </div>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Mobile: Two Separate Buttons */}
        <div className="md:hidden pt-4 md:p-2 flex gap-2">
          {/* AI Upload Button */}
          <Button
            onClick={() => !isProcessing && fileInputRef.current?.click()}
            size="lg"
            className="flex-1 cursor-pointer bg-sidebar hover:!bg-sidebar-accent border-0 h-10 shadow-[0_0_12px_rgba(0,0,0,0.06)]"
          >
            {isProcessing ? (
              <>
                <Sparkles className="size-4 text-purple-600 dark:text-purple-400 animate-pulse" />
                <span className="text-sm bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent dark:from-purple-400 dark:to-pink-400">
                  Processing...
                </span>
              </>
            ) : (
              <>
                <Sparkles 
                  className="size-5"
                  style={{ 
                    color: 'rgb(168, 85, 247)'
                  }}
                />
                <span 
                  className="text-sm"
                  style={{ 
                    background: 'linear-gradient(90deg, rgb(168, 85, 247), rgb(236, 72, 153), rgb(59, 130, 246), rgb(6, 182, 212), rgb(168, 85, 247))',
                    backgroundSize: '200% 100%',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    color: 'transparent'
                  }}
                >
                  Upload
                </span>
              </>
            )}
          </Button>

          {/* Manual Entry Button */}
          <Button
            onClick={handleManualAdd}
            disabled={isProcessing}
            size="lg"
            className="flex-1 bg-sidebar hover:!bg-sidebar-accent border-0 shadow-[0_0_12px_rgba(0,0,0,0.06)] h-10"
          >
            <SquarePlus className="size-5 text-foreground" />
            <span className="text-md text-foreground">New Line</span>
          </Button>
        </div>
      </div>
    );
  };

  const GridViewComponent = () => {
    return (
      <div className="w-full">
        <div className={`bg-sidebar border border-border transition-all duration-300 rounded-[10px] ${
          isGridExpanded ? 'shadow-lg' : ''
        }`}>
          {/* Scrollable Content Area */}
          <div className="overflow-x-auto rounded-[10px] custom-scrollbar">
            {/* Header */}
            <div className={`grid border-l-4 border-l-transparent sticky top-0 z-10 transition-all duration-300 min-w-max bg-muted border-b border-border ${
              isGridExpanded 
                ? 'grid-cols-[60px_minmax(200px,1fr)_minmax(120px,150px)_minmax(250px,2fr)_minmax(120px,150px)_minmax(100px,120px)_minmax(150px,180px)_minmax(100px,120px)_minmax(180px,200px)_minmax(180px,200px)_minmax(120px,150px)]' 
                : 'grid-cols-[60px_minmax(180px,200px)_minmax(100px,120px)_minmax(180px,1fr)_minmax(100px,120px)_minmax(80px,100px)_minmax(100px,120px)_80px_150px_150px_100px]'
            }`}>
              <div className="flex items-center justify-center">
                <div className="relative group">
                  <button
                    className="h-4 w-4 text-muted-foreground hover:text-foreground rounded transition-colors flex items-center justify-center"
                    onClick={() => setIsGridExpanded(!isGridExpanded)}
                    title={isGridExpanded ? 'Collapse grid' : 'Expand grid'}
                  >
                    {isGridExpanded ? <Minimize2 className="size-4" /> : <Maximize2 className="size-4" />}
                  </button>
                </div>
              </div>
              <div className="flex items-center px-4 py-4 ">
                <span className="font-medium px-2 py-1 text-sm text-muted-foreground">Category</span>
              </div>
              <div className="flex items-center px-2 py-1 font-medium text-sm text-muted-foreground">Date</div>
              <div className="flex items-center px-2 py-1 font-medium text-sm text-muted-foreground">Attachments</div>
              <div className="flex items-center px-2 py-1 font-medium text-sm text-muted-foreground">Description</div>
              <div className="flex items-center px-2 py-1 font-medium text-sm text-muted-foreground">Amount</div>
              <div className="flex items-center px-2 py-1 font-medium text-sm text-muted-foreground">Status</div>
              <div className="flex items-center px-2 py-1 font-medium text-sm text-muted-foreground">Receipt</div>
              <div className="flex items-center px-2 py-1 font-medium text-sm text-muted-foreground">Vendor</div>
              <div className="flex items-center px-2 py-1 font-medium text-sm text-muted-foreground">Project</div>
              <div className="flex items-center px-2 py-1">
                <span className="font-medium px-2 py-1 text-sm text-muted-foreground">Actions</span>
              </div>
            </div>

            {/* Existing Rows */}
            {rows.map((row, index) => {
              const isSelected = selectedRows.has(row.id);
              const isEditing = editingCell?.rowId === row.id;
              const isLastRow = index === rows.length - 1;

              const leftBorderColor = {
                warning: 'border-l-[#ffc107]',
                error: 'border-l-[#dc3545]', 
                success: 'border-l-[#3b82f6]',
                neutral: 'border-l-transparent'
              }[row.status];

              return (
                <div 
                  key={row.id} 
                  className={`grid border-l-4 min-w-max ${leftBorderColor} ${
                    row.status === 'success' ? 'bg-accent/50' : 
                    isSelected ? 'bg-accent/50' : ''
                  } ${!isLastRow ? 'border-b border-border' : ''} transition-all duration-300 ${
                    isGridExpanded 
                      ? 'grid-cols-[60px_minmax(200px,1fr)_minmax(120px,150px)_minmax(250px,2fr)_minmax(120px,150px)_minmax(100px,120px)_minmax(150px,180px)_minmax(100px,120px)_minmax(180px,200px)_minmax(180px,200px)_minmax(120px,150px)]' 
                      : 'grid-cols-[60px_minmax(180px,200px)_minmax(100px,120px)_minmax(180px,1fr)_minmax(100px,120px)_minmax(80px,100px)_minmax(100px,120px)_80px_150px_150px_100px]'
                  }`}
                >
                  {/* Checkbox Column */}
                  <div className="flex items-center justify-center">
                    <div 
                      className={`relative rounded size-4 border cursor-pointer flex items-center justify-center ${
                        isSelected 
                    ? 'bg-primary border-primary' 
                    : 'bg-card border-primary hover:border-2'
                      }`}
                      onClick={(e) => toggleRowSelection(row.id, e)}
                    >
                      {isSelected && (
                        <Check className="size-3 text-primary-foreground" />
                      )}
                    </div>
                  </div>

                  {/* Category */}
                  <div className="flex items-center px-4 py-4">
                    <div className="flex items-center">
                      {isEditing && editingCell.field === 'category' ? (
                        <Select 
                          value={editValue} 
                          onValueChange={(value) => {
                            setEditValue(value);
                            saveCellEdit();
                          }}
                        >
                          <SelectTrigger className="h-8 text-xs w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {EXPENSE_CATEGORIES.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : row.status === 'success' && !row.category ? (
                        <Select 
                          value={row.category} 
                          onValueChange={(value) => {
                            const updatedRows = rows.map(r => 
                              r.id === row.id ? { ...r, category: value } : r
                            );
                            setRows(updatedRows);
                          }}
                        >
                          <SelectTrigger className="h-8 text-xs w-32 bg-card border-border">
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
                      ) : (
                        <span 
                          className="text-primary text-sm cursor-pointer hover:bg-muted px-2 py-1 rounded"
                          onClick={() => startCellEdit(row.id, 'category', row.category)}
                        >
                          {row.category || "Click to add category"}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Date */}
                  <div className="flex items-center">
                    {isEditing && editingCell.field === 'date' ? (
                      <Input
                        type="date"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={saveCellEdit}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') saveCellEdit();
                          if (e.key === 'Escape') cancelCellEdit();
                        }}
                        className="h-8 text-xs"
                        autoFocus
                      />
                    ) : row.status === 'success' && (!row.date || row.date === new Date().toLocaleDateString("en-GB")) ? (
                      <Input
                        type="date"
                        value={new Date().toISOString().split('T')[0]}
                        onChange={(e) => {
                          const formattedDate = new Date(e.target.value).toLocaleDateString("en-GB");
                          const updatedRows = rows.map(r => 
                            r.id === row.id ? { ...r, date: formattedDate } : r
                          );
                          setRows(updatedRows);
                        }}
                        className="h-8 text-xs bg-card border-border"
                      />
                    ) : (
                      <span 
                        className="text-sm cursor-pointer hover:bg-muted px-2 py-1 rounded"
                        onClick={() => {
                          // Convert date from "2/6/25" format to "YYYY-MM-DD" format for editing
                          const dateParts = row.date.split('/');
                          const formattedDate = dateParts.length === 3 
                            ? `20${dateParts[2]}-${dateParts[1].padStart(2, '0')}-${dateParts[0].padStart(2, '0')}`
                            : row.date;
                          startCellEdit(row.id, 'date', formattedDate);
                        }}
                      >
                        {row.date}
                      </span>
                    )}
                  </div>

                  {/* Attachments */}
                  <div className="flex items-center justify-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditRowModal(row);
                      }}
                      className="relative h-8 w-8 p-0 cursor-pointer"
                    >
                      <Paperclip className="h-4 w-4" />
                      {row.attachedFiles && row.attachedFiles.length > 0 && (
                        <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] font-semibold rounded-full size-4 flex items-center justify-center">
                          {row.attachedFiles.length}
                        </span>
                      )}
                    </Button>
                  </div>

                  {/* Description */}
                  <div className="flex items-center max-w-[150px]">
                    {isEditing && editingCell.field === 'description' ? (
                      <Input
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={saveCellEdit}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') saveCellEdit();
                          if (e.key === 'Escape') cancelCellEdit();
                        }}
                        className="h-8 text-xs"
                        autoFocus
                      />
                    ) : row.status === 'success' && !row.description ? (
                      <Input
                        value={row.description}
                        onChange={(e) => {
                          const updatedRows = rows.map(r => 
                            r.id === row.id ? { ...r, description: e.target.value } : r
                          );
                          setRows(updatedRows);
                        }}
                        placeholder="Enter description"
                        className="h-8 text-xs bg-card border-border"
                      />
                    ) : (
                      <span 
                        className="text-sm cursor-pointer hover:bg-muted px-2 py-1 rounded truncate block"
                        onClick={() => startCellEdit(row.id, 'description', row.description)}
                      >
                        {row.description || "Click to add description"}
                      </span>
                    )}
                  </div>

                  {/* Amount */}
                  <div className="flex items-center">
                    {isEditing && editingCell.field === 'amount' ? (
                      <Input
                        type="number"
                        step="0.01"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={saveCellEdit}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') saveCellEdit();
                          if (e.key === 'Escape') cancelCellEdit();
                        }}
                        className="h-8 text-xs"
                        autoFocus
                      />
                    ) : row.status === 'success' && !row.amount ? (
                      <Input
                        type="number"
                        step="0.01"
                        value={row.amount ? row.amount.replace(' GBP', '').replace(/,/g, '') : ''}
                        onChange={(e) => {
                          const value = e.target.value;
                          const formattedAmount = value ? `${value} GBP` : '';
                          const updatedRows = rows.map(r => 
                            r.id === row.id ? { ...r, amount: formattedAmount } : r
                          );
                          setRows(updatedRows);
                        }}
                        placeholder="0.00"
                        className="h-8 text-xs bg-card border-border"
                      />
                    ) : (
                      <span 
                        className="font-bold text-sm cursor-pointer hover:bg-muted px-2 py-1 rounded"
                        onClick={() => startCellEdit(row.id, 'amount', row.amount.replace(' GBP', '').replace(/,/g, ''))}
                      >
                        {row.amount}
                      </span>
                    )}
                  </div>

                  {/* Status */}
                  <div className="flex items-center">
                    {row.status === 'success' ? (
                      <Select 
                        value="Neutral" 
                        onValueChange={(value) => {
                          const updatedRows = rows.map(r => 
                            r.id === row.id ? { ...r, status: value.toLowerCase() as ExpenseRow['status'] } : r
                          );
                          setRows(updatedRows);
                        }}
                      >
                        <SelectTrigger className="h-8 text-xs w-20 bg-card border-border">
                          <SelectValue placeholder="Neutral" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="neutral">Neutral</SelectItem>
                          <SelectItem value="warning">Warning</SelectItem>
                          <SelectItem value="error">Error</SelectItem>
                          <SelectItem value="success">Success</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="flex items-center gap-2">
                        {row.badge && (
                          <div className="bg-success text-success-foreground text-xs px-2 py-1 rounded">
                            {row.badge}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Receipt */}
                  <div className="flex items-center">
                    <span className="text-sm cursor-pointer hover:bg-muted px-2 py-1 rounded text-muted-foreground">
                      {row.id === '1' ? 'Attached' : row.id === '2' ? 'Missing' : 'Pending'}
                    </span>
                  </div>

                  {/* Vendor */}
                  <div className="flex items-center">
                    <span className="text-sm cursor-pointer hover:bg-muted px-2 py-1 rounded">
                      {row.id === '1' ? 'Starbucks' : row.id === '2' ? 'Uber' : row.id === '3' ? 'Hotel Imperial' : 'Restaurant XYZ'}
                    </span>
                  </div>

                  {/* Project */}
                  <div className="flex items-center">
                    <span className="text-sm cursor-pointer hover:bg-muted px-2 py-1 rounded text-muted-foreground">
                      {row.id === '1' ? 'Marketing' : row.id === '2' ? 'Sales' : 'Operations'}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    {row.status === 'success' ? (
                      <>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Remove the new row
                            const updatedRows = rows.filter(r => r.id !== row.id);
                            setRows(updatedRows);
                          }}
                        >
                          <X className="size-4" />
                        </Button>
                        <Button
                          size="sm"
                          className="h-8 w-8 p-0 bg-primary hover:bg-primary/90"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Convert to normal row by changing status
                            const updatedRows = rows.map(r => 
                              r.id === row.id ? { ...r, status: 'neutral' as ExpenseRow['status'] } : r
                            );
                            setRows(updatedRows);
                          }}
                        >
                          <Check className="size-4 text-primary-foreground" />
                        </Button>
                      </>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 px-3 text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditRowModal(row);
                        }}
                      >
                        <Edit className="size-3 mr-1" />
                        Edit
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Add New Expense Row - Grid View (Inline editing when active) */}
            {isAddingInlineRow && (
              <div className={`grid gap-4 p-4 border-l-4 border-border bg-blue-50 transition-all duration-300 ${
                isGridExpanded 
                  ? 'grid-cols-[60px_minmax(200px,1fr)_minmax(120px,150px)_minmax(250px,2fr)_minmax(120px,150px)_minmax(100px,120px)_minmax(150px,180px)_minmax(100px,120px)_minmax(180px,200px)_minmax(180px,200px)_minmax(120px,150px)]' 
                  : 'grid-cols-[60px_minmax(180px,200px)_minmax(100px,120px)_minmax(180px,1fr)_minmax(100px,120px)_minmax(80px,100px)_minmax(100px,120px)_80px_150px_150px_100px]'
              }`}>
                {/* Checkbox Column */}
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4" />
                </div>
                
                {/* Category */}
                <div className="flex items-center">
                  <Select 
                    value={inlineRowData.category} 
                    onValueChange={(value) => setInlineRowData({...inlineRowData, category: value})}
                  >
                    <SelectTrigger className="h-8 text-xs">
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

                {/* Date */}
                <div className="flex items-center">
                  <Input
                    type="date"
                    value={inlineRowData.date}
                    onChange={(e) => setInlineRowData({...inlineRowData, date: e.target.value})}
                    className="h-8 text-xs"
                  />
                </div>

                {/* Attachments */}
                <div className="flex items-center justify-center">
                  <span className="text-xs text-gray-500">0</span>
                </div>

                {/* Description */}
                <div className="flex items-center">
                  <Input
                    value={inlineRowData.description}
                    onChange={(e) => setInlineRowData({...inlineRowData, description: e.target.value})}
                    placeholder="Enter description"
                    className="h-8 text-xs"
                  />
                </div>

                {/* Amount */}
                <div className="flex items-center">
                  <Input
                    type="number"
                    step="0.01"
                    value={inlineRowData.amount}
                    onChange={(e) => setInlineRowData({...inlineRowData, amount: e.target.value})}
                    placeholder="0.00"
                    className="h-8 text-xs"
                  />
                </div>

                {/* Status */}
                <div className="flex items-center">
                  <span className="text-xs text-gray-500">Neutral</span>
                </div>

                {/* Receipt */}
                <div className="flex items-center">
                  <span className="text-xs text-gray-500">Pending</span>
                </div>

                {/* Vendor */}
                <div className="flex items-center">
                  <Input
                    value=""
                    placeholder="Enter vendor"
                    className="h-8 text-xs"
                  />
                </div>

                {/* Project */}
                <div className="flex items-center">
                  <Input
                    value=""
                    placeholder="Enter project"
                    className="h-8 text-xs"
                  />
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={cancelInlineRow}
                    className="h-8 px-2 text-xs"
                  >
                    <XIcon className="size-3" />
                  </Button>
                  <Button
                    size="sm"
                    onClick={saveInlineRow}
                    className="h-8 px-2 text-xs bg-blue-600 hover:bg-blue-700"
                  >
                    <Check className="size-3" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Fixed Footer - Card Footer Style */}
          {!isAddingInlineRow && sourcePage !== "Authorization" && (
            <div className="border-t border-border p-4 bg-sidebar rounded-b-[10px]">
              <div 
                className={`relative w-full flex flex-row items-center justify-center gap-3 transition-all cursor-pointer ${
                  isDragging 
                    ? 'bg-blue-50 dark:bg-blue-950 border-1 border-dashed border-blue-500 rounded-[9px]' 
                    : isProcessing 
                      ? 'bg-gradient-to-r from-purple-50 via-fuchsia-50 to-pink-50 dark:from-purple-950/30 dark:via-fuchsia-950/30 dark:to-pink-950/30 rounded-[10px]' 
                      : 'bg-background'
                }`}
                style={!isDragging && !isProcessing ? {
                  borderRadius: '10px',
                  padding: '1px',
                  background: 'linear-gradient(90deg, #f43f5e, #ec4899, #a855f7, #8b5cf6, #6366f1, #3b82f6, #06b6d4)',
                } : isProcessing ? {
                  borderRadius: '10px',
                  padding: '1px',
                  background: 'linear-gradient(90deg, #a855f7, #ec4899, #8b5cf6, #6366f1, #3b82f6)',
                } : undefined}
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => {
                  if (!isProcessing) {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'image/jpeg,image/jpg,image/png,application/pdf';
                    input.onchange = (e) => handleFileSelect(e as any);
                    input.click();
                  }
                }}
              >
                <div className={`w-full flex flex-row items-center justify-center gap-3 rounded-[9px] py-3 px-4 ${
                  isDragging 
                    ? '' 
                    : isProcessing 
                      ? 'bg-gradient-to-r from-purple-50 via-fuchsia-50 to-pink-50 dark:from-purple-950/30 dark:via-fuchsia-950/30 dark:to-pink-950/30' 
                      : 'bg-sidebar hover:bg-accent'
                }`}>
                  {isProcessing ? (
                    <>
                      <Sparkles className="size-5 text-purple-600 dark:text-white animate-pulse" />
                      <span className="text-sm bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent dark:bg-none dark:text-white">Processing document...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className={`size-5 ${isDragging ? 'text-blue-600' : 'text-purple-500'}`} />
                      <div className="text-center">
                        <span className={`text-sm ${isDragging ? 'text-blue-600' : 'text-foreground'}`}>
                          {isDragging ? 'Drop receipt here' : 'Drop receipt or click to upload'}
                        </span>
                        {!isDragging && (
                          <span className="text-xs text-muted-foreground ml-1">
                            - AI will extract data, or{' '}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingRow(null);
                                setEditFormData({
                                  category: '',
                                  date: new Date().toISOString().split('T')[0],
                                  description: '',
                                  amount: '',
                                  status: 'neutral',
                                  receiptImage: ''
                                });
                                setShowEditRowModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-700 underline cursor-pointer inline"
                          >
                            click here
                          </button>
                          {' '}to add manually
                        </span>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <TooltipProvider>
      <div className="bg-background size-full relative">
        {/* Mobile Navbar */}
        <MobileNavbar 
          showBackButton={true}
          onBackClick={onBackToList}
          pageTitle="Expenses (Foreign)"
          formId="63"
          formType="Expenses (Foreign)"
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

        <div className="flex size-full relative bg-sidebar">
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
                        <div className="h-[18px] w-[118px] max-w-full transition-colors duration-300 ease-in-out">
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
<div className={`flex flex-row items-center rounded group cursor-default w-full ${sidebarOpen ? 'gap-1' : 'md:justify-center md:p-2'}`}>
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

                            <div className="h-4 shrink-0 w-full flex items-center ">
                <div className="h-px bg-sidebar-border w-full" />
              </div>
              
              {/* Forms Group */}
              <NavigationGroupItem 
                icon={svgPaths.p2973b500} 
                label="Forms" 
                groupId="forms" 
                active={true}
                subItems={[
                  { label: "Entry", active: sourcePage === "Entry" },
                  { label: "Authorization", active: sourcePage === "Authorization" }
                ]}
              />
              {sidebarOpen && expandedGroups.has('forms') && (
                <div className="space-y-1">
                  <NavigationSubItem label="Entry" active={sourcePage === "Entry"} />
                  <NavigationSubItem label="Authorization" active={sourcePage === "Authorization"} />
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

            {/* User Menu - Desktop Only */}
            <div className="mt-4 pt-4 border-t border-sidebar-border hidden md:block">
              <div className="w-full">
                {!isMobile && !sidebarOpen ? (
                  // Collapsed state - show just avatar with dropdown
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button 
                        className="flex items-center justify-center w-full h-9 p-2 hover:bg-sidebar-accent rounded transition-colors duration-300 ease-in-outtext-[14px]"
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
                  // Expanded state - show avatar + name  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button 
                        className="flex items-center gap-3 w-full h-9 p-2 hover:bg-sidebar-accent rounded transition-colors duration-300 ease-in-out"
                        data-no-preview="true"
                        draggable="false"
                        onContextMenu={(e) => e.preventDefault()}
                      >
                        <div className="size-8 rounded-full overflow-hidden border border-sidebar-border shrink-0">
                          <img 
                            src={imgAvatarPlaceholderChangeImageHere} 
                            alt="User avatar"
                            className="w-full h-full object-cover"
                            data-no-preview="true"
                            draggable="false"
                            onContextMenu={(e) => e.preventDefault()}
                          />
                        </div>
                        {sidebarOpen && (
                          <div className="flex-1 text-left transition-colors duration-300 ease-in-out">
                            <div className="text-sm font-medium text-sidebar-foreground leading-tight">Stephen Hill</div>
                          </div>
                        )}
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
          </div>
          

          {/* Main Content */}
          <div className={`bg-background flex-1 transition-all duration-300 ease-in-out overflow-x-hidden ${sidebarOpen ? 'md:ml-[250px]' : 'md:ml-[50px]'} pt-mobile-nav md:pt-0`}>
            <div className={`h-mobile-content md:h-screen flex flex-col overflow-hidden md:pl-[max(1rem,env(safe-area-inset-left))] md:pr-[max(1rem,env(safe-area-inset-right))] ${
              currentViewMode === 'grid' && isGridExpanded ? '' : ''
            }`}>
              {/* Breadcrumb & Title with Action Buttons */}
              <div>
                <div className="hidden md:flex flex-row items-center justify-end md:justify-between md:max-h-[51px] md:py-4 w-full border-b">
                  {/* Breadcrumb - Desktop Only */}
                  <div className="hidden md:flex flex-row items-center gap-3">
                    <div className="flex flex-row items-center gap-1">
                      <button 
                        onClick={onBackToList}
                        className="text-muted-foreground text-base hover:text-foreground cursor-pointer underline p-0 bg-transparent border-0 leading-none flex items-center justify-center"
                      >
                        {sourcePage}
                      </button>
                      <ChevronRight className="text-muted-foreground w-4 h-4 mx-1" />
                      <h1 className="font-semibold text-foreground">#{formId || '63'} | Expenses (Foreign)</h1>
                    </div>
                  </div>
                  
                  {/* Action Buttons - Desktop Only */}
                  <div className="hidden md:flex flex-row items-center gap-1.5 md:gap-2">
                    <Button
                      variant="default"
                      className="md:px-3 px-4 cursor-pointer h-11 md:h-9 md:text-sm"
                      onClick={() => {/* Handle submit/authorize */}}
                    >
                      {sourcePage === "Authorization" ? (
                        <BadgeCheck className="size-5 md:size-4 md:mr-2" />
                      ) : (
                        <Send className="size-5 md:size-4 md:mr-2" />
                      )}
                      <span className="hidden md:inline">{sourcePage === "Authorization" ? "Authorize" : "Submit"}</span>
                    </Button>
                    {sourcePage !== "Authorization" && (
                      <Button
                        variant="outline"
                        className="md:px-3 px-4 cursor-pointer h-11 md:h-9 md:text-sm"
                        onClick={() => {
                          setIsValidating(true);
                          setTimeout(() => {
                            setIsValidating(false);
                            setIsValidated(true);
                          }, 5000);
                        }}
                        disabled={isValidating}
                      >
                        {isValidating ? (
                          <Loader2 className="size-5 md:size-4 md:mr-2 animate-spin" />
                        ) : (
                          <Save className="size-5 md:size-4 md:mr-2" />
                        )}
                        <span className="hidden md:inline">
                          {isValidating ? "Validating..." : "Save & Validate"}
                        </span>
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      className="px-4 md:px-2 relative cursor-pointer h-11 md:h-9 md:text-sm"
                      onClick={() => {
                        setIsReturnAction(false);
                        setShowMessagesModal(true);
                      }}
                    >
                      <MessageSquare className="size-5 md:size-4" />
                      {messages.length > 0 && (
                        <span className={`absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full flex items-center justify-center text-[10px] text-white ${
                          messages.some(m => m.isNew) ? 'bg-destructive' : 'bg-warning'
                        }`}>
                          {messages.length}
                        </span>
                      )}
                    </Button>
                    
                    {/* More Menu - Bottom Sheet on Mobile, Dropdown on Desktop */}
                    {isMobile ? (
                      <>
                        <Button
                          variant="outline"
                          className="px-4 md:px-2 cursor-pointer h-11 md:h-9 md:text-sm"
                          onClick={() => setIsMoreMenuOpen(true)}
                        >
                          <MoreVertical className="size-5 md:size-4" />
                        </Button>
                        
                        <Sheet open={isMoreMenuOpen} onOpenChange={setIsMoreMenuOpen}>
                          <SheetContent side="bottom" className="px-0">
                            <SheetHeader className="px-4 pb-4">
                              <SheetTitle>Actions</SheetTitle>
                              <SheetDescription>
                                Choose an action to perform on this form
                              </SheetDescription>
                            </SheetHeader>
                            <div className="flex flex-col">
                              {sourcePage === "Authorization" ? (
                                <>
                                  <button
                                    onClick={() => {
                                      setIsReturnAction(true);
                                      setShowMessagesModal(true);
                                      setIsMoreMenuOpen(false);
                                    }}
                                    className="flex items-center gap-3 px-4 py-4 text-left hover:bg-accent transition-colors border-b border-border"
                                  >
                                    <CornerUpLeft className="size-5" />
                                    <span className="text-base">Return</span>
                                  </button>
                                  <button
                                    onClick={() => {
                                      /* Handle download PDF */
                                      setIsMoreMenuOpen(false);
                                    }}
                                    className="flex items-center gap-3 px-4 py-4 text-left hover:bg-accent transition-colors"
                                  >
                                    <Download className="size-5" />
                                    <span className="text-base">Download PDF Report</span>
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    onClick={() => {
                                      /* Handle split form */
                                      setIsMoreMenuOpen(false);
                                    }}
                                    className="flex items-center gap-3 px-4 py-4 text-left hover:bg-accent transition-colors border-b border-border"
                                  >
                                    <Split className="size-5" />
                                    <span className="text-base">Split Form</span>
                                  </button>
                                  <button
                                    onClick={() => {
                                      /* Handle import Excel */
                                      setIsMoreMenuOpen(false);
                                    }}
                                    className="flex items-center gap-3 px-4 py-4 text-left hover:bg-accent transition-colors border-b border-border"
                                  >
                                    <Upload className="size-5" />
                                    <span className="text-base">Import from Excel</span>
                                  </button>
                                  <button
                                    onClick={() => {
                                      /* Handle export Excel */
                                      setIsMoreMenuOpen(false);
                                    }}
                                    className="flex items-center gap-3 px-4 py-4 text-left hover:bg-accent transition-colors border-b border-border"
                                  >
                                    <FileSpreadsheet className="size-5" />
                                    <span className="text-base">Export to Excel</span>
                                  </button>
                                  <button
                                    onClick={() => {
                                      /* Handle download PDF */
                                      setIsMoreMenuOpen(false);
                                    }}
                                    className="flex items-center gap-3 px-4 py-4 text-left hover:bg-accent transition-colors border-b border-border"
                                  >
                                    <Download className="size-5" />
                                    <span className="text-base">Download PDF Report</span>
                                  </button>
                                  <button
                                    onClick={() => {
                                      /* Handle delete */
                                      setIsMoreMenuOpen(false);
                                    }}
                                    className="flex items-center gap-3 px-4 py-4 text-left hover:bg-accent transition-colors text-destructive"
                                  >
                                    <Trash2 className="size-5" />
                                    <span className="text-base font-medium">Delete</span>
                                  </button>
                                </>
                              )}
                            </div>
                          </SheetContent>
                        </Sheet>
                      </>
                    ) : (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            className="px-4 md:px-2 cursor-pointer h-11 md:h-9 md:text-sm"
                          >
                            <MoreVertical className="size-5 md:size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {sourcePage === "Authorization" ? (
                            <>
                              <DropdownMenuItem onClick={() => {
                                setIsReturnAction(true);
                                setShowMessagesModal(true);
                              }}>
                                <CornerUpLeft className="size-4 mr-2" />
                                Return
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => {/* Handle download PDF */}}>
                                <Download className="size-4 mr-2" />
                                Download PDF Report
                              </DropdownMenuItem>
                            </>
                          ) : (
                            <>
                              <DropdownMenuItem onClick={() => {/* Handle split form */}}>
                                <Split className="size-5 mr-2" />
                                Split Form
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => {/* Handle import Excel */}}>
                                <Upload className="size-5 mr-2" />
                                Import from Excel
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => {/* Handle export Excel */}}>
                                <FileSpreadsheet className="size-5 mr-2" />
                                Export to Excel
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => {/* Handle download PDF */}}>
                                <Download className="size-5 mr-2" />
                                Download PDF Report
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => {/* Handle delete */}} className="text-destructive hover:bg-destructive hover:text-destructive-foreground focus:bg-destructive focus:text-destructive-foreground data-[highlighted]:bg-destructive data-[highlighted]:text-destructive-foreground [&_svg]:!text-destructive data-[highlighted]:[&_svg]:!text-destructive-foreground">
                                <Trash2 className="size-5" />
                                Delete
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                    <Button
                      variant="outline"
                      className="hidden md:inline-flex px-4 md:px-2 cursor-pointer h-11 md:h-9 md:text-sm"
                      onClick={onBackToList}
                    >
                      <X className="size-5 md:size-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Form Header - Clickable to open offcanvas */}
              <div className="relative mx-auto flex h-full w-full max-w-7xl flex-0 flex-col px-4 md:px-2">
                <div 
                  className="w-full overflow-x-auto cursor-pointer group custom-scrollbar border-b"
                  onClick={openHeaderModal}
                >
                  {isLoadingHeader ? (
                    <SkeletonHeaderDetails />
                  ) : (
                    <div className="w-full flex flex-row gap-3 items-center justify-start py-4">
                      {/* Image */}
                      <div className="bg-card relative rounded-[10px] border border-border shrink-0">
                        <div className="size-20">
                          <div
                            className="absolute bg-[position:50%_50%] bg-contain inset-0 rounded-[10px]"
                            style={{ backgroundImage: `url('${headerDetails.image}')` }}
                          />
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
                    </div>
                  )}
                </div>
              </div>

              {/* Control Bar with Integrated Bulk Actions */}
              <div className={`relative mx-auto flex w-full flex-0 flex-col px-4 md:px-2 ${
                currentViewMode === 'grid' && isGridExpanded ? 'max-w-none' : 'max-w-7xl'
              }`}>
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
                          <span className="md:hidden">{selectedRows.size} Selected</span>
                          <span className="hidden md:inline">Select All</span>
                        </>
                      ) : (
                        "Select All"
                      )}
                    </label>
                  </div>

                  <div className="flex-1" />

                  {/* Bulk Actions - Show when rows are selected */}
                  {selectedRows.size > 0 && (
                    <div className="flex items-center gap-2 h-10">
                      {sourcePage === "Authorization" ? (
                        <Button
                          variant="ghost"
                          onClick={handlePartialReturn}
                          className="cursor-pointer h-10 px-4 text-sm bg-sidebar hover:!bg-sidebar-accent border-0 shadow-[0_0_12px_rgba(0,0,0,0.06)]"
                        >
                          <CornerUpLeft className="size-5 md:mr-1.5 text-primary" />
                          <span className="hidden md:inline">Partial Return</span>
                        </Button>
                      ) : (
                        <>
                          <Button
                            variant="ghost"
                            onClick={handleBulkCopy}
                            className="cursor-pointer h-10 px-4 text-sm bg-sidebar hover:!bg-sidebar-accent border-0 shadow-[0_0_12px_rgba(0,0,0,0.06)]"
                          >
                            <Copy className="size-5 md:mr-1.5 text-primary" />
                            <span className="hidden md:inline">Copy</span>
                          </Button>
                          {selectedRows.size === 1 && (
                            <Button
                              variant="ghost"
                              onClick={handleBulkSplit}
                              className="cursor-pointer h-10 px-4 text-sm bg-sidebar hover:!bg-sidebar-accent border-0 shadow-[0_0_12px_rgba(0,0,0,0.06)]"
                            >
                              <Split className="size-5 md:mr-1.5 text-primary" />
                              <span className="hidden md:inline">Split</span>
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            onClick={() => setShowDeleteDialog(true)}
                            className="cursor-pointer h-10 px-4 text-sm bg-sidebar hover:!bg-sidebar-accent border-0 shadow-[0_0_12px_rgba(0,0,0,0.06)]"
                          >
                            <Trash2 className="size-5 md:mr-1.5 text-destructive" />
                            <span className="hidden md:inline">Delete</span>
                          </Button>
                        </>
                      )}
                    </div>
                  )}
                  
                  {/* Mobile Action Buttons - show when no rows are selected */}
                  {selectedRows.size === 0 && (
                    <div className="md:hidden flex items-center gap-2">
                      <Button
                        variant="ghost"
                        className="cursor-pointer h-10 px-4 bg-sidebar hover:!bg-sidebar-accent border-0 shadow-[0_0_12px_rgba(0,0,0,0.06)]"
                        onClick={() => {/* Handle submit/authorize */}}
                      >
                        {sourcePage === "Authorization" ? (
                          <BadgeCheck className="size-5 text-primary" />
                        ) : (
                          <Send className="size-5 text-primary" />
                        )}
                      </Button>
                      {sourcePage !== "Authorization" && (
                        <div 
                          className={`w-full flex flex-row items-center justify-center gap-3 rounded-[9px] py-3 px-4 cursor-pointer ${
                            isValidating 
                              ? 'bg-gradient-to-r from-purple-50 via-fuchsia-50 to-pink-50 dark:from-purple-950/30 dark:via-fuchsia-950/30 dark:to-pink-950/30' 
                              : 'bg-sidebar hover:bg-accent'
                          }`}
                          onClick={() => {
                            if (!isValidating) {
                              setIsValidating(true);
                              setTimeout(() => {
                                setIsValidating(false);
                                setIsValidated(true);
                              }, 5000);
                            }
                          }}
                        >
                          {isValidating ? (
                            <>
                              <Loader2 className="size-5 text-purple-600 dark:text-white animate-spin" />
                              <span className="text-sm bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent dark:bg-none dark:text-white">Validating...</span>
                            </>
                          ) : (
                            <>
                              <Save className="size-5 text-foreground" />
                              <span className="text-sm text-foreground">Save & Validate</span>
                            </>
                          )}
                        </div>
                      )}
                      <Button
                        variant="ghost"
                        className="px-4 relative cursor-pointer h-10 bg-sidebar hover:!bg-sidebar-accent border-0 shadow-[0_0_12px_rgba(0,0,0,0.06)]"
                        onClick={() => {
                          setIsReturnAction(false);
                          setShowMessagesModal(true);
                        }}
                      >
                        <MessageSquare className="size-5 text-foreground" />
                        {messages.length > 0 && (
                          <span className={`absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full flex items-center justify-center text-[10px] text-white ${
                            messages.some(m => m.isNew) ? 'bg-destructive' : 'bg-warning'
                          }`}>
                            {messages.length}
                          </span>
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        className="px-4 cursor-pointer h-10 bg-sidebar hover:!bg-sidebar-accent border-0 shadow-[0_0_12px_rgba(0,0,0,0.06)]"
                        onClick={() => setIsMoreMenuOpen(true)}
                      >
                        <MoreVertical className="size-5 text-foreground" />
                      </Button>
                    </div>
                  )}
                  
                  {/* View Toggle Buttons - only show on desktop when no rows are selected */}
                  {selectedRows.size === 0 && (
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
                            : 'text-sidebar-foreground hover:text-sidebar-primary'
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
                            : 'text-sidebar-foreground hover:text-sidebar-primary'
                        }`}
                      >
                        <Grid3x3 className="size-5" />
                        Grid
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Expenses List */}
              <div className={`relative flex h-full w-full flex-1 flex-col pb-4 overflow-y-auto ${
                currentViewMode === 'grid' && isGridExpanded ? 'max-w-none mx-0' : 'max-w-7xl mx-auto'
              }`}>
                {currentViewMode === 'stacked' ? (
                  <div className="space-y-4 overflow-y-auto flex-1 min-h-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pb-[calc(env(safe-area-inset-bottom)+4rem)] px-4 md:px-2">
                    {/* Add New Expense - Stacked View */}
                    {sourcePage !== "Authorization" && <AddExpenseButton />}
                    
                    {/* Existing Expenses */}
                    {isLoadingRows ? (
                      /* Skeleton Rows */
                      [...Array(3)].map((_, index) => (
                        <SkeletonExpenseRow key={index} />
                      ))
                    ) : (
                      rows.map((row) => (
                        <ExpenseRowComponent key={row.id} row={row} />
                      ))
                    )}
                  </div>
                ) : (
                  <div className="mt-1 pb-[calc(env(safe-area-inset-bottom)+4rem)]">
                    <GridViewComponent />
                  </div>
                )}
                
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

        {/* Header Edit Modal - Changed from offcanvas to modal */}
        <ResponsiveDialog 
          open={showHeaderModal} 
          onOpenChange={setShowHeaderModal}
          title="Edit Form Details"
          size="7xl"
          showMobileNavbar={true}
          onBackClick={closeHeaderModal}
          pageTitle="Edit Form Details"
          themeMode={themeMode}
          handleThemeModeClick={handleThemeModeClick}
          getThemeIcon={getThemeIcon}
          footer={
            <div className="flex flex-row md:justify-end gap-3 w-full md:border-t md:border-border md:pt-4">
              <Button variant="outline" onClick={closeHeaderModal} className="flex-1 md:flex-initial md:w-auto">
                Cancel
              </Button>
              <Button onClick={saveHeaderDetails} className="flex-1 md:flex-initial md:w-auto">
                Save Changes
              </Button>
            </div>
          }
        >
          {/* Main content with two columns */}
          <div className="flex flex-col lg:flex-row gap-6 flex-1">
            {/* Left Column - Form Attachment Gallery */}
            <div className="lg:w-2/3">
              <div className="space-y-3">
                <Label>Form Attachment</Label>
                
                {/* Image Viewer */}
                <div className="relative mt-2">
                  <div className="bg-white dark:bg-muted relative rounded-lg border border-gray-200 dark:border-border w-full aspect-[4/3] overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center p-4">
                      <img
                        src={headerDetails.image}
                        alt="Form attachment"
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                    
                    {/* Hover overlay for upload */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-center justify-center cursor-pointer group">
                      <div className="text-center text-white">
                        <Upload className="size-8 mx-auto mb-2" />
                        <p className="text-sm font-medium">Upload New Image</p>
                        <p className="text-xs opacity-75">JPG, PNG up to 5MB</p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Gallery Thumbnail */}
                <div className="mt-3">
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {/* Add New File Button */}
                    <div className="relative flex-shrink-0">
                      <div className="w-20 h-20 rounded-lg border-2 border-dashed border-border hover:border-primary hover:bg-muted/50 transition-colors flex items-center justify-center cursor-pointer group">
                        <Plus className="h-6 w-6 text-muted-foreground group-hover:text-primary" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                      </div>
                    </div>

                    {/* Current Image Thumbnail */}
                    <div className="relative w-20 h-20 rounded-lg border-2 overflow-hidden cursor-pointer flex-shrink-0 transition-all border-primary ring-2 ring-primary/20">
                      <img
                        src={headerDetails.image}
                        alt="Form attachment"
                        className="w-full h-full object-cover"
                      />
                      
                      {/* Active indicator */}
                      <div className="absolute top-1 right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                        <Check className="h-3 w-3 text-primary-foreground" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Form Fields */}
            <div className="lg:w-1/3 space-y-4 overflow-y-auto max-h-[calc(80vh-200px)]">
              <div>
                <Label htmlFor="shortDescription">Short Description</Label>
                <Input
                  id="shortDescription"
                  value={headerDetails.shortDescription}
                  onChange={(e) => setHeaderDetails({...headerDetails, shortDescription: e.target.value})}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="chargeTo">Charge To</Label>
                <Input
                  id="chargeTo"
                  value={headerDetails.chargeTo}
                  onChange={(e) => setHeaderDetails({...headerDetails, chargeTo: e.target.value})}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="colleagues">Colleagues</Label>
                <Input
                  id="colleagues"
                  value={headerDetails.colleagues}
                  onChange={(e) => setHeaderDetails({...headerDetails, colleagues: e.target.value})}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="dateFrom">Date From</Label>
                <Input
                  id="dateFrom"
                  type="date"
                  value={headerDetails.dateFrom}
                  onChange={(e) => setHeaderDetails({...headerDetails, dateFrom: e.target.value})}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="dateTo">Date To</Label>
                <Input
                  id="dateTo"
                  type="date"
                  value={headerDetails.dateTo}
                  onChange={(e) => setHeaderDetails({...headerDetails, dateTo: e.target.value})}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="project">Project</Label>
                <Input
                  id="project"
                  value={headerDetails.project}
                  onChange={(e) => setHeaderDetails({...headerDetails, project: e.target.value})}
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        </ResponsiveDialog>

        {/* Add Expense Modal - Remains as ResponsiveDialog */}
        <ResponsiveDialog 
          open={showAddExpenseModal} 
          onOpenChange={setShowAddExpenseModal}
          title="Add New Expense"
        >
          <div className="space-y-4">
            <div>
              <Label htmlFor="category">Category</Label>
              <Select 
                value={newExpense.category} 
                onValueChange={(value) => setNewExpense({...newExpense, category: value})}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select a category" />
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

            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={newExpense.date}
                onChange={(e) => setNewExpense({...newExpense, date: e.target.value})}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={newExpense.description}
                onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                placeholder="Enter expense description"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="amount">Amount (GBP)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={newExpense.amount}
                onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                placeholder="0.00"
                className="mt-1"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={closeAddExpenseModal}>
              Cancel
            </Button>
            <Button onClick={saveNewExpense}>
              Add Expense
            </Button>
          </div>
        </ResponsiveDialog>

        {/* Edit Row Modal - Remains as ResponsiveDialog */}
        <ResponsiveDialog 
          open={showEditRowModal} 
          onOpenChange={setShowEditRowModal}
          title="Edit Expense"
          size="7xl"
          showMobileNavbar={true}
          onBackClick={closeEditRowModal}
          pageTitle="Edit Expense"
          themeMode={themeMode}
          handleThemeModeClick={handleThemeModeClick}
          getThemeIcon={getThemeIcon}
          currentRow={editingRow ? rows.findIndex(r => r.id === editingRow.id) + 1 : undefined}
          totalRows={rows.length}
          footer={
            <div className="flex flex-row md:justify-end gap-3 w-full md:border-t md:border-border md:pt-4">
              <Button variant="outline" onClick={closeEditRowModal} className="flex-1 md:flex-initial md:w-auto">
                Cancel
              </Button>
              <Button onClick={saveEditedRow} className="flex-1 md:flex-initial md:w-auto">
                Save Changes
              </Button>
            </div>
          }
        >
          {/* Header with title already handled by ResponsiveDialog props */}
          
          {/* Main content with two columns */}
          <div className="flex flex-col lg:flex-row gap-6 flex-1">
            {/* Left Column - Receipt Attachment with File Management */}
            <div className="lg:w-2/3">
              <div className="space-y-3">
                <Label>Receipt Attachments</Label>
                
                {attachedFiles.length === 0 && unassignedFiles.length === 0 ? (
                  /* Drag & Drop Area with AI - Only shown when no files */
                  <div className="relative mt-2">
                    <div 
                      className={`relative w-full aspect-[4/3] transition-all cursor-pointer ${
                        isDraggingModal 
                          ? 'bg-blue-50 dark:bg-blue-950 border-1 border-dashed border-blue-500 rounded-[9px]' 
                          : isProcessingModal 
                            ? 'bg-gradient-to-r from-purple-50 via-fuchsia-50 to-pink-50 dark:from-purple-950/30 dark:via-fuchsia-950/30 dark:to-pink-950/30 rounded-[10px]' 
                            : 'bg-background'
                      }`}
                      style={!isDraggingModal && !isProcessingModal ? {
                        borderRadius: '10px',
                        padding: '1px',
                        background: 'linear-gradient(90deg, #f43f5e, #ec4899, #a855f7, #8b5cf6, #6366f1, #3b82f6, #06b6d4)',
                      } : isProcessingModal ? {
                        borderRadius: '10px',
                        padding: '1px',
                        background: 'linear-gradient(90deg, #a855f7, #ec4899, #8b5cf6, #6366f1, #3b82f6)',
                      } : undefined}
                      onDragEnter={handleModalDragEnter}
                      onDragOver={handleModalDragOver}
                      onDragLeave={handleModalDragLeave}
                      onDrop={handleModalDrop}
                      onClick={() => !isProcessingModal && document.getElementById('modal-file-input')?.click()}
                    >
                      <div className={`w-full h-full flex flex-col items-center justify-center gap-3 rounded-[9px] transition-colors relative ${
                        isDraggingModal 
                          ? '' 
                          : 'bg-background hover:bg-accent'
                      }`}>
                        {/* Floating Control Bar */}
                        <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between gap-2 bg-background/95 backdrop-blur-sm border border-border rounded-lg px-3 py-2 shadow-sm">
                          <div className="flex items-center gap-2">
                            <Paperclip className="size-4 text-muted-foreground" />
                            <span className="text-sm font-medium">
                              {(() => {
                                const filesFromOtherRows = rows
                                  .filter(r => r.id !== editingRow?.id)
                                  .flatMap(r => r.attachedFiles || []);
                                const totalOther = unassignedFiles.length + filesFromOtherRows.length;
                                
                                return `${totalOther} available file${totalOther !== 1 ? 's' : ''}`;
                              })()}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            {(() => {
                              const filesFromOtherRows = rows
                                .filter(r => r.id !== editingRow?.id)
                                .flatMap(r => r.attachedFiles || []);
                              const totalOther = unassignedFiles.length + filesFromOtherRows.length;
                              
                              return totalOther > 0 && (
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          // Get files from other expense rows and create copies with unique IDs
                                          const filesFromOtherRows = rows
                                            .filter(r => r.id !== editingRow?.id)
                                            .flatMap(r => (r.attachedFiles || []).map(file => ({
                                              ...file,
                                              id: `unassigned-${r.id}-${file.id}`,
                                              originalId: file.id,
                                              sourceRowId: r.id
                                            })));
                                          
                                          // Add files from other rows to existing unassigned files
                                          setUnassignedFiles(prev => [...prev, ...filesFromOtherRows]);
                                          
                                          // Don't switch views - keep focus on current attached file
                                          setShowAlreadyAssigned(true);
                                          setViewingOnlyOtherRows(true);
                                        }}
                                        className="h-7 px-2"
                                      >
                                        <Eye className="size-4" />
                                        <span className="ml-1.5 text-xs">
                                          View Files
                                        </span>
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      View unassigned and other files
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              );
                            })()}
                          </div>
                        </div>

                        {isProcessingModal ? (
                          <>
                            <Sparkles className="size-12" style={{ 
                              animation: 'colorShift 2s ease-in-out infinite',
                              color: 'rgb(147, 51, 234)'
                            }} />
                            <div className="text-center">
                              <p className="text-base font-medium text-muted-foreground">Processing receipt...</p>
                              <p className="text-sm text-muted-foreground mt-1">Extracting expense data with AI</p>
                            </div>
                            <style>{`
                              @keyframes colorShift {
                                0%, 100% { color: rgb(147, 51, 234); }
                                33% { color: rgb(236, 72, 153); }
                                66% { color: rgb(59, 130, 246); }
                              }
                            `}</style>
                          </>
                        ) : (
                          <>
                            <Sparkles className={`size-12 ${isDraggingModal ? 'text-blue-600' : 'text-purple-500'}`} />
                            <div className="text-center">
                              <p className={`text-base font-medium ${isDraggingModal ? 'text-blue-600' : 'text-foreground'}`}>
                                {isDraggingModal ? 'Drop receipt here' : 'Drop receipt or click to upload'}
                              </p>
                              <p className="text-sm text-muted-foreground mt-1">AI will extract expense details automatically</p>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const input = document.createElement('input');
                                  input.type = 'file';
                                  input.accept = 'image/*,.pdf';
                                  input.multiple = true;
                                  input.onchange = (e) => {
                                    const files = Array.from((e.target as HTMLInputElement).files || []);
                                    handleModalFileSelect(files, true);
                                  };
                                  input.click();
                                }}
                                className="text-xs text-blue-600 dark:text-blue-400 hover:underline mt-2"
                              >
                                or click here to add manually
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                      
                      {/* Hidden file input */}
                      <input
                        id="modal-file-input"
                        type="file"
                        accept="image/*,.pdf"
                        capture="environment"
                        onChange={(e) => handleFileUploadWithAI(e.target.files)}
                        className="hidden"
                      />
                    </div>
                  </div>
                ) : attachedFiles.length === 1 && unassignedFiles.length === 0 ? (
                  /* Single File View - Only shown when exactly 1 file and no unassigned */
                  <>
                    {/* File Viewer */}
                    <div className="relative mt-2">
                      <div className="bg-white dark:bg-muted relative rounded-lg border border-gray-200 dark:border-border w-full aspect-[4/3] overflow-hidden">
                        <div 
                          className="absolute inset-0 flex items-center justify-center overflow-auto p-4 pb-20"
                          onTouchStart={handleTouchStart}
                          onTouchMove={handleTouchMove}
                          onTouchEnd={handleTouchEnd}
                        >
                          {(() => {
                            const currentFile = attachedFiles[0];
                            
                            if (currentFile.type === 'image') {
                              return (
                                <img
                                  src="https://images.unsplash.com/photo-1686581639043-893261d6b43f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWNlaXB0JTIwaW52b2ljZXxlbnwxfHx8fDE3NjgyMjA5Mjd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                                  alt={currentFile.name}
                                  className="max-w-full max-h-full object-contain transition-transform"
                                  style={{ transform: `scale(${zoomLevel / 100}) rotate(${rotationAngle}deg)` }}
                                />
                              );
                            } else if (currentFile.type === 'pdf') {
                              return (
                                <div className="text-center">
                                  <FileType className="h-16 w-16 mx-auto mb-4 text-red-500" />
                                  <p className="text-sm font-medium">{currentFile.name}</p>
                                  <p className="text-xs text-muted-foreground mt-1">PDF Preview</p>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDownloadFile(currentFile)}
                                    className="mt-3"
                                  >
                                    <Download className="h-4 w-4 mr-2" />
                                    Download to View
                                  </Button>
                                </div>
                              );
                            } else {
                              return (
                                <div className="text-center">
                                  <File className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                                  <p className="text-sm font-medium">{currentFile.name}</p>
                                  <p className="text-xs text-muted-foreground mt-1">File Preview</p>
                                </div>
                              );
                            }
                          })()}
                        </div>
                        
                        {/* Floating Control Bar */}
                        <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2 p-2 bg-background/80 dark:bg-background/90 backdrop-blur-md rounded-lg border border-border shadow-lg">
                          {/* Navigation Controls - Show 1/1 for single file */}
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={true}
                              className="h-8 w-8 p-0"
                            >
                              <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <span className="text-xs text-muted-foreground px-2 min-w-[60px] text-center">
                              1 / 1
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={true}
                              className="h-8 w-8 p-0"
                            >
                              <ChevronRightIcon className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="h-6 w-px bg-border hidden md:block" />

                          {/* Zoom Controls - Hidden on mobile, use pinch-to-zoom instead */}
                          <div className="hidden md:flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={handleZoomOut}
                              disabled={zoomLevel <= 50}
                              className="h-8 w-8 p-0"
                            >
                              <ZoomOut className="h-4 w-4" />
                            </Button>
                            <span className="text-xs text-muted-foreground px-2 min-w-[50px] text-center">
                              {zoomLevel}%
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={handleZoomIn}
                              disabled={zoomLevel >= 200}
                              className="h-8 w-8 p-0"
                            >
                              <ZoomIn className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="h-6 w-px bg-border hidden md:block" />

                          {/* Rotation Controls */}
                          <div className="flex items-center gap-1">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={handleRotateLeft}
                                  className="h-8 w-8 p-0"
                                >
                                  <RotateCcw className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Rotate left</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={handleRotateRight}
                                  className="h-8 w-8 p-0"
                                >
                                  <RotateCw className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Rotate right</TooltipContent>
                            </Tooltip>
                          </div>

                          <div className="flex-1" />

                          {/* File Actions */}
                          <div className="flex items-center gap-1">
                            {/* Fullscreen Toggle */}
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={handleToggleFullscreen}
                                  disabled={attachedFiles[0]?.type !== 'image'}
                                  className="h-8 w-8 p-0"
                                >
                                  <Maximize2 className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                {attachedFiles[0]?.type === 'image' ? 'View fullscreen' : 'Fullscreen only available for images'}
                              </TooltipContent>
                            </Tooltip>

                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDownloadFile(attachedFiles[0])}
                                  className="h-8 w-8 p-0"
                                >
                                  <Download className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Download file</TooltipContent>
                            </Tooltip>

                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleUnassignFile(attachedFiles[0].id)}
                                  className="h-8 w-8 p-0"
                                >
                                  <Link2Off className="h-4 w-4 text-yellow-500" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Unassign file</TooltipContent>
                            </Tooltip>

                            {/* Show/Hide Files from Other Rows Toggle */}
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    if (showAlreadyAssigned) {
                                      // Hide files from other rows - keep only truly unassigned files
                                      setUnassignedFiles(prev => prev.filter(f => !f.sourceRowId));
                                      setShowAlreadyAssigned(false);
                                      setViewingOnlyOtherRows(false);
                                    } else {
                                      // Get files from other expense rows and create copies with unique IDs
                                      const filesFromOtherRows = rows
                                        .filter(r => r.id !== editingRow?.id)
                                        .flatMap(r => (r.attachedFiles || []).map(file => ({
                                          ...file,
                                          id: `unassigned-${r.id}-${file.id}`,
                                          originalId: file.id,
                                          sourceRowId: r.id
                                        })));
                                      
                                      // Add files from other rows to existing unassigned files
                                      setUnassignedFiles(prev => [...prev, ...filesFromOtherRows]);
                                      
                                      // Don't switch views - keep focus on current attached file
                                      setShowAlreadyAssigned(true);
                                      setViewingOnlyOtherRows(true);
                                    }
                                  }}
                                  className="h-8 w-8 p-0"
                                >
                                  {showAlreadyAssigned ? (
                                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                                  ) : (
                                    <Eye className="h-4 w-4 text-blue-500" />
                                  )}
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                {showAlreadyAssigned ? 'Hide files from other rows' : 'Show files from other rows'}
                              </TooltipContent>
                            </Tooltip>

                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteFile(attachedFiles[0].id)}
                                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Delete file</TooltipContent>
                            </Tooltip>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* File Gallery */}
                    <div className="mt-3">
                      <div className="flex gap-2 overflow-x-auto pb-2">
                        {/* Add New File Button */}
                        <div className="relative flex-shrink-0">
                          <div className="w-20 h-20 rounded-lg border-2 border-dashed border-border hover:border-primary hover:bg-muted/50 transition-colors flex items-center justify-center cursor-pointer group">
                            <Plus className="h-6 w-6 text-muted-foreground group-hover:text-primary" />
                            <input
                              type="file"
                              accept="image/*,.pdf"
                              multiple
                              onChange={(e) => handleFileUpload(e.target.files)}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                          </div>
                        </div>

                        {/* Single File Thumbnail - Only show if file exists */}
                        {attachedFiles.length > 0 && (
                          <div
                            className="relative w-20 h-20 rounded-lg border-2 overflow-hidden cursor-pointer flex-shrink-0 transition-all border-primary ring-2 ring-primary/20"
                          >
                            {attachedFiles[0].type === 'image' ? (
                              <img
                                src="https://images.unsplash.com/photo-1686581639043-893261d6b43f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWNlaXB0JTIwaW52b2ljZXxlbnwxfHx8fDE3NjgyMjA5Mjd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                                alt={attachedFiles[0].name}
                                className="w-full h-full object-cover"
                              />
                            ) : attachedFiles[0].type === 'pdf' ? (
                              <div className="w-full h-full flex items-center justify-center bg-red-50">
                                <FileType className="h-8 w-8 text-red-500" />
                              </div>
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-muted">
                                <File className="h-8 w-8 text-muted-foreground" />
                              </div>
                            )}
                            
                            {/* Active indicator */}
                            <div className="absolute top-1 right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                              <Check className="h-3 w-3 text-primary-foreground" />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  /* File Management UI - Only shown when 2+ files exist */
                  <>
                    {/* File Viewer */}
                    <div className="relative mt-2">
                      <div className="bg-white dark:bg-muted relative rounded-lg border border-gray-200 dark:border-border w-full aspect-[4/3] overflow-hidden">
                        <div 
                          className="absolute inset-0 flex items-center justify-center overflow-auto p-4 pb-20"
                          onTouchStart={handleTouchStart}
                          onTouchMove={handleTouchMove}
                          onTouchEnd={handleTouchEnd}
                        >
                          {(() => {
                            const currentFiles = isViewingUnassigned ? getFilteredUnassignedFiles() : attachedFiles;
                            const currentFile = currentFiles[currentFileIndex];
                            
                            if (!currentFile) {
                              return <div className="text-muted-foreground">No file to display</div>;
                            }
                            
                            if (currentFile.type === 'image') {
                              return (
                                <img
                                  src={currentFile.url}
                                  alt={currentFile.name}
                                  className="max-w-full max-h-full object-contain transition-transform"
                                  style={{ transform: `scale(${zoomLevel / 100}) rotate(${rotationAngle}deg)` }}
                                />
                              );
                            } else if (currentFile.type === 'pdf') {
                              return (
                                <div className="text-center">
                                  <FileType className="h-16 w-16 mx-auto mb-4 text-red-500" />
                                  <p className="text-sm font-medium">{currentFile.name}</p>
                                  <p className="text-xs text-muted-foreground mt-1">PDF Preview</p>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDownloadFile(currentFile)}
                                    className="mt-3"
                                  >
                                    <Download className="h-4 w-4 mr-2" />
                                    Download to View
                                  </Button>
                                </div>
                              );
                            } else {
                              return (
                                <div className="text-center">
                                  <File className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                                  <p className="text-sm font-medium">{currentFile.name}</p>
                                  <p className="text-xs text-muted-foreground mt-1">File Preview</p>
                                </div>
                              );
                            }
                          })()}
                          
                          {/* Fullscreen Button */}
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  onClick={handleToggleFullscreen}
                                  className="absolute top-3 right-3 h-8 w-8 p-0 bg-background/80 dark:bg-background/90 backdrop-blur-md hover:bg-background border border-border shadow-lg"
                                >
                                  <Maximize2 className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>View fullscreen</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        
                        {/* Floating Control Bar */}
                        <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2 p-2 bg-background/80 dark:bg-background/90 backdrop-blur-md rounded-lg border border-border shadow-lg">
                          {/* Navigation Controls */}
                          {/* Navigation arrows hidden - use gallery to navigate between attachments */}
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={handlePreviousFile}
                              disabled={currentFileIndex === 0}
                              className="h-8 w-8 p-0 hidden"
                            >
                              <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <span className="text-xs text-muted-foreground px-2 min-w-[60px] text-center">
                              {currentFileIndex + 1} / {isViewingUnassigned ? getFilteredUnassignedFiles().length : attachedFiles.length}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={handleNextFile}
                              disabled={currentFileIndex >= (isViewingUnassigned ? getFilteredUnassignedFiles().length : attachedFiles.length) - 1}
                              className="h-8 w-8 p-0 hidden"
                            >
                              <ChevronRightIcon className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="h-6 w-px bg-border hidden md:block" />

                          {/* Zoom Controls - Hidden on mobile, use pinch-to-zoom instead */}
                          <div className="hidden md:flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={handleZoomOut}
                              disabled={zoomLevel <= 50}
                              className="h-8 w-8 p-0"
                            >
                              <ZoomOut className="h-4 w-4" />
                            </Button>
                            <span className="text-xs text-muted-foreground px-2 min-w-[50px] text-center">
                              {zoomLevel}%
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={handleZoomIn}
                              disabled={zoomLevel >= 200}
                              className="h-8 w-8 p-0"
                            >
                              <ZoomIn className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="h-6 w-px bg-border hidden md:block" />

                          {/* Rotation Controls */}
                          <div className="flex items-center gap-1">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={handleRotateLeft}
                                  className="h-8 w-8 p-0"
                                >
                                  <RotateCcw className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Rotate left</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={handleRotateRight}
                                  className="h-8 w-8 p-0"
                                >
                                  <RotateCw className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Rotate right</TooltipContent>
                            </Tooltip>
                          </div>

                          <div className="flex-1" />

                          {/* File Actions */}
                          <div className="flex items-center gap-1">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    const currentFiles = isViewingUnassigned ? unassignedFiles : attachedFiles;
                                    handleDownloadFile(currentFiles[currentFileIndex]);
                                  }}
                                  className="h-8 w-8 p-0"
                                >
                                  <Download className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Download file</TooltipContent>
                            </Tooltip>

                            {isViewingUnassigned ? (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      const filteredFiles = getFilteredUnassignedFiles();
                                      if (filteredFiles[currentFileIndex]) {
                                        handleReassignFile(filteredFiles[currentFileIndex].id);
                                      }
                                    }}
                                    className="h-8 w-8 p-0"
                                  >
                                    <Link2 className="h-4 w-4 text-green-500" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Assign file</TooltipContent>
                              </Tooltip>
                            ) : (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleUnassignFile(attachedFiles[currentFileIndex].id)}
                                    className="h-8 w-8 p-0"
                                  >
                                    <Link2Off className="h-4 w-4 text-yellow-500" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Unassign file</TooltipContent>
                              </Tooltip>
                            )}

                            {/* Show/Hide Files from Other Rows Toggle - Always visible */}
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    if (showAlreadyAssigned) {
                                      // Hide files from other rows - keep only truly unassigned files
                                      setUnassignedFiles(prev => prev.filter(f => !f.sourceRowId));
                                      setShowAlreadyAssigned(false);
                                      setViewingOnlyOtherRows(false);
                                    } else {
                                      // Get files from other expense rows and create copies with unique IDs
                                      const filesFromOtherRows = rows
                                        .filter(r => r.id !== editingRow?.id)
                                        .flatMap(r => (r.attachedFiles || []).map(file => ({
                                          ...file,
                                          id: `unassigned-${r.id}-${file.id}`,
                                          originalId: file.id,
                                          sourceRowId: r.id
                                        })));
                                      
                                      // Add files from other rows to existing unassigned files
                                      setUnassignedFiles(prev => [...prev, ...filesFromOtherRows]);
                                      
                                      // Don't switch views - keep focus on current attached file
                                      setShowAlreadyAssigned(true);
                                      setViewingOnlyOtherRows(true);
                                    }
                                  }}
                                  className="h-8 w-8 p-0"
                                >
                                  {showAlreadyAssigned ? (
                                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                                  ) : (
                                    <Eye className="h-4 w-4 text-blue-500" />
                                  )}
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                {showAlreadyAssigned ? 'Hide files from other rows' : 'Show files from other rows'}
                              </TooltipContent>
                            </Tooltip>

                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    const currentFiles = isViewingUnassigned ? unassignedFiles : attachedFiles;
                                    handleDeleteFile(currentFiles[currentFileIndex].id);
                                  }}
                                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Delete file</TooltipContent>
                            </Tooltip>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* File Gallery */}
                    <div className="mt-3">
                      <div className="flex gap-2 overflow-x-auto pb-2">
                        {/* Add New File Button */}
                        <div className="relative flex-shrink-0">
                          <div className="w-20 h-20 rounded-lg border-2 border-dashed border-border hover:border-primary hover:bg-muted/50 transition-colors flex items-center justify-center cursor-pointer group">
                            <Plus className="h-6 w-6 text-muted-foreground group-hover:text-primary" />
                            <input
                              type="file"
                              accept="image/*,.pdf"
                              multiple
                              onChange={(e) => handleFileUpload(e.target.files)}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                          </div>
                        </div>

                        {/* Assigned File Thumbnails */}
                        {attachedFiles.map((file, index) => (
                          <div
                            key={file.id}
                            onClick={() => {
                              setCurrentFileIndex(index);
                              setIsViewingUnassigned(false);
                              setViewingOnlyOtherRows(false);
                            }}
                            className={`relative w-20 h-20 rounded-lg border-2 overflow-hidden cursor-pointer flex-shrink-0 transition-all ${
                              index === currentFileIndex && !isViewingUnassigned
                                ? 'border-primary ring-2 ring-primary/20' 
                                : 'border-border hover:border-primary/50'
                            }`}
                          >
                            {file.type === 'image' ? (
                              <img
                                src={file.url}
                                alt={file.name}
                                className="w-full h-full object-cover"
                              />
                            ) : file.type === 'pdf' ? (
                              <div className="w-full h-full flex items-center justify-center bg-red-50">
                                <FileType className="h-8 w-8 text-red-500" />
                              </div>
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-muted">
                                <File className="h-8 w-8 text-muted-foreground" />
                              </div>
                            )}
                            
                            {/* Active indicator */}
                            {index === currentFileIndex && !isViewingUnassigned && (
                              <div className="absolute top-1 right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                                <Check className="h-3 w-3 text-primary-foreground" />
                              </div>
                            )}
                          </div>
                        ))}

                        {/* Divider - Only show if there are unassigned files */}
                        {unassignedFiles.length > 0 && (
                          <div className="flex items-center flex-shrink-0 px-2">
                            <div className="h-16 w-px bg-border" />
                          </div>
                        )}

                        {/* Unassigned File Thumbnails */}
                        {(() => {
                          // Filter unassigned files based on showAlreadyAssigned toggle
                          const attachedFileIds = attachedFiles.map(f => f.id);
                          
                          let filteredUnassigned;
                          
                          // If viewing files from other rows, show BOTH truly unassigned AND files from other rows
                          if (viewingOnlyOtherRows) {
                            filteredUnassigned = unassignedFiles.filter(f => !attachedFileIds.includes(f.originalId || f.id));
                          } else {
                            // Normal mode: only show truly unassigned files (not from other rows)
                            filteredUnassigned = unassignedFiles.filter(f => !f.sourceRowId && !attachedFileIds.includes(f.id));
                          }
                          
                          // Get files from other rows for badge detection
                          const filesFromOtherRows = rows
                            .filter(r => r.id !== editingRow?.id)
                            .flatMap(r => r.attachedFiles || []);
                          
                          return filteredUnassigned.map((file, index) => (
                          <div
                            key={file.id}
                            onClick={() => {
                              setCurrentFileIndex(index);
                              setIsViewingUnassigned(true);
                            }}
                            className={`relative w-20 h-20 rounded-lg border-2 border-dashed overflow-visible cursor-pointer flex-shrink-0 transition-all ${
                              index === currentFileIndex && isViewingUnassigned
                                ? 'border-primary ring-2 ring-primary/20 opacity-100'
                                : 'border-muted-foreground/30 hover:border-primary/50 opacity-60 hover:opacity-100'
                            }`}
                          >
                            <div className="w-full h-full overflow-hidden rounded-lg relative">
                              {file.type === 'image' ? (
                                <img
                                  src={file.url}
                                  alt={file.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : file.type === 'pdf' ? (
                                <div className="w-full h-full flex items-center justify-center bg-red-50">
                                  <FileType className="h-8 w-8 text-red-500" />
                                </div>
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-muted">
                                  <File className="h-8 w-8 text-muted-foreground" />
                                </div>
                              )}
                              
                              {/* Unassigned or Other Row overlay */}
                              <div className="absolute inset-0 bg-background/40 flex items-center justify-center">
                                <div className={`rounded px-1.5 py-0.5 flex items-center justify-center ${
                                  file.sourceRowId
                                    ? 'bg-blue-500/90'
                                    : 'bg-muted/90'
                                }`}>
                                  <span className={`text-[10px] font-medium ${
                                    file.sourceRowId
                                      ? 'text-white'
                                      : 'text-muted-foreground'
                                  }`}>
                                    {file.sourceRowId ? 'Other Row' : 'Unassigned'}
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            {/* Action buttons - only show when selected */}
                            {/* COMMENTED OUT - Delete and Assign buttons
                            {index === currentFileIndex && isViewingUnassigned && (
                              <>
                                <div className="absolute -bottom-2 -left-2 z-10">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleReassignFile(file.id);
                                    }}
                                    className="w-6 h-6 bg-primary rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors shadow-sm"
                                    title="Assign to expense"
                                  >
                                    <Plus className="h-3.5 w-3.5 text-primary-foreground" />
                                  </button>
                                </div>
                                
                                <div className="absolute -bottom-2 -right-2 z-10">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteFile(file.id);
                                    }}
                                    className="w-6 h-6 bg-destructive rounded-full flex items-center justify-center hover:bg-destructive/90 transition-colors shadow-sm"
                                    title="Delete file"
                                  >
                                    <Trash2 className="h-3.5 w-3.5 text-destructive-foreground" />
                                  </button>
                                </div>
                              </>
                            )}
                            */}
                            
                            {/* Active indicator */}
                            {index === currentFileIndex && isViewingUnassigned && (
                              <div className="absolute top-1 right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                                <Check className="h-3 w-3 text-primary-foreground" />
                              </div>
                            )}
                          </div>
                        ));
                        })()}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Right Column - Form Controls */}
            <div className="lg:w-1/3">
              <div className="space-y-4 pb-20">
                <div>
                  <Label htmlFor="editCategory">Category</Label>
                  <Select 
                    value={editFormData.category} 
                    onValueChange={(value) => setEditFormData({...editFormData, category: value})}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select a category" />
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

                <div className="min-w-0">
                  <Label htmlFor="editDate">Date</Label>
                  <Input
                    id="editDate"
                    type="date"
                    value={editFormData.date}
                    onChange={(e) => setEditFormData({...editFormData, date: e.target.value})}
                    className="mt-1 w-full max-w-full h-9 [&::-webkit-date-and-time-value]:text-left [&::-webkit-date-and-time-value]:min-h-0 max-md:[&::-webkit-calendar-picker-indicator]:hidden max-md:[&::-webkit-calendar-picker-indicator]:w-0 max-md:[&::-webkit-calendar-picker-indicator]:m-0 cursor-pointer"
                    style={{ minWidth: 0, WebkitAppearance: 'none', MozAppearance: 'textfield' }}
                  />
                </div>

                <div>
                  <Label htmlFor="editDescription">Description</Label>
                  <Input
                    id="editDescription"
                    value={editFormData.description}
                    onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
                    placeholder="Enter expense description"
                    className="mt-1"
                  />
                </div>

                {/* Expense Total with Currency Selector */}
                <div>
                  <Label htmlFor="editExpenseTotal">Expense Total</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      id="editExpenseTotal"
                      type="number"
                      step="0.01"
                      value={editFormData.expenseTotal}
                      onChange={(e) => setEditFormData({...editFormData, expenseTotal: e.target.value})}
                      placeholder="0.00"
                      className="flex-1"
                    />
                    <Select 
                      value={editFormData.expenseCurrency} 
                      onValueChange={(value) => setEditFormData({...editFormData, expenseCurrency: value})}
                    >
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CURRENCIES.map((currency) => (
                          <SelectItem key={currency} value={currency}>
                            {currency}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Calculated Fields - Read Only */}
                <div>
                  <Label htmlFor="editExpenseFxTotal">Expense FX Total Local</Label>
                  <div className="relative mt-1">
                    <Input
                      id="editExpenseFxTotal"
                      type="text"
                      value={calculateExpenseValues(editFormData.expenseTotal, editFormData.expenseCurrency).expenseFxTotalLocal}
                      readOnly
                      className="pr-12 bg-muted"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                      GBP
                    </span>
                  </div>
                </div>

                <div>
                  <Label htmlFor="editExpenseGbpNet">Expense GBP Net</Label>
                  <div className="relative mt-1">
                    <Input
                      id="editExpenseGbpNet"
                      type="text"
                      value={calculateExpenseValues(editFormData.expenseTotal, editFormData.expenseCurrency).expenseGbpNet}
                      readOnly
                      className="pr-12 bg-muted"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                      GBP
                    </span>
                  </div>
                </div>

                <div>
                  <Label htmlFor="editPlannedExpense">Planned Expense GBP</Label>
                  <div className="relative mt-1">
                    <Input
                      id="editPlannedExpense"
                      type="text"
                      value={calculateExpenseValues(editFormData.expenseTotal, editFormData.expenseCurrency).plannedExpenseGbp}
                      readOnly
                      className="pr-12 bg-muted"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                      GBP
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ResponsiveDialog>

        {/* Messages Modal */}
        {isMobile ? (
          // Mobile: Bottom Sheet
          <Sheet 
            open={showMessagesModal} 
            onOpenChange={(open) => {
              setShowMessagesModal(open);
              // Mark all messages as read when modal closes
              if (!open) {
                setMessages(messages.map(m => ({ ...m, isNew: false })));
                setIsReturnAction(false);
                setEditingMessageId(null);
                setNewMessageText("");
              }
            }}
          >
            <SheetContent side="bottom" className="h-[90vh] flex flex-col p-0">
              <SheetHeader className="px-4 pt-4 pb-3 border-b">
                <SheetTitle>{isReturnAction ? "Return Form" : "Messages"}</SheetTitle>
                <SheetDescription>
                  {isReturnAction 
                    ? "Please provide a reason for returning this form"
                    : "View and send messages about this form"
                  }
                </SheetDescription>
              </SheetHeader>
              
              <div className="flex flex-col flex-1 px-4 overflow-hidden">
                {/* Return Info Banner */}
                {isReturnAction && (
                  <div className="mt-4 mb-4 p-3 bg-warning/10 border border-warning/20 rounded-lg">
                    <p className="text-sm text-foreground">
                      Please provide a reason for returning this form. A message is required to complete the return action.
                    </p>
                  </div>
                )}

                {/* Messages Area - Scrollable */}
                <div className="flex-1 overflow-y-auto custom-scrollbar px-1 -mx-1">
                  {messages.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground h-full flex flex-col items-center justify-center">
                      <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No messages</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {messages.map((message, index) => {
                        // Find the last message from the current user
                        const userMessages = messages.filter(m => m.isCurrentUser);
                        const isLastUserMessage = message.isCurrentUser && 
                                                 userMessages.length > 0 && 
                                                 userMessages[userMessages.length - 1].id === message.id;
                        
                        return (
                          <div 
                            key={message.id}
                            className={`flex ${message.isCurrentUser ? 'justify-end' : 'justify-start'}`}
                          >
                            <div className={`max-w-[75%] ${message.isCurrentUser ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                              {/* Sender name - only show for non-current user */}
                              {!message.isCurrentUser && (
                                <div className="flex items-center gap-2 px-1">
                                  <span className="text-xs text-muted-foreground">{message.sender}</span>
                                  {message.isNew && (
                                    <span className="px-1.5 py-0.5 text-xs bg-destructive text-destructive-foreground rounded">
                                      New
                                    </span>
                                  )}
                                </div>
                              )}
                              
                              {/* Message bubble */}
                              <div 
                                className={`px-4 py-2.5 rounded-lg ${
                                  message.isCurrentUser
                                    ? 'bg-primary text-primary-foreground'
                                    : message.isNew
                                      ? 'bg-destructive/10 border border-destructive/20'
                                      : 'bg-muted'
                                }`}
                              >
                                <p className={message.isCurrentUser ? 'text-primary-foreground' : 'text-foreground'}>
                                  {message.text}
                                </p>
                              </div>
                              
                              {/* Timestamp with Edit/Delete buttons */}
                              <div className="flex items-center gap-2 px-1">
                                <span className="text-xs text-muted-foreground">
                                  {message.timestamp}
                                </span>
                                
                                {/* Edit/Delete buttons for newly added user messages only */}
                                {isLastUserMessage && message.isNewlyAdded && (
                                  <div className="flex items-center gap-1">
                                    <span className="text-xs text-muted-foreground">|</span>
                                    <button
                                      onClick={() => handleEditMessage(message.id, message.text)}
                                      className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                      Edit
                                    </button>
                                    <span className="text-xs text-muted-foreground">|</span>
                                    <button
                                      onClick={() => handleDeleteMessage(message.id)}
                                      className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                      Remove
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Reply Section - Fixed at bottom */}
                <div className="pt-4 border-t mt-4 pb-4">
                  <div className="relative">
                    <Textarea
                      value={newMessageText}
                      onChange={(e) => setNewMessageText(e.target.value)}
                      placeholder={
                        editingMessageId 
                          ? "Edit your message..." 
                          : isReturnAction 
                            ? "Enter reason for return..." 
                            : "Type your message..."
                      }
                      className="resize-none min-h-[80px] pr-12"
                      onKeyDown={(e) => {
                        // Handle Enter key for both editing and sending new messages
                        if (e.key === 'Enter' && !e.shiftKey && newMessageText.trim()) {
                          e.preventDefault();
                          
                          if (editingMessageId) {
                            // Save edited message
                            handleSaveEditedMessage();
                          } else if (!isReturnAction) {
                            // Send new message
                            const newMessage: Message = {
                              id: String(messages.length + 1),
                              text: newMessageText,
                              timestamp: new Date().toLocaleString('en-GB', { 
                                day: '2-digit', 
                                month: '2-digit', 
                                year: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: false
                              }).replace(',', ''),
                              isNew: false,
                              sender: "You",
                              isCurrentUser: true,
                              isNewlyAdded: true
                            };
                            setMessages([...messages, newMessage]);
                            setNewMessageText("");
                          }
                        }
                      }}
                    />
                    {/* Send/Save button */}
                    {newMessageText.trim() && !isReturnAction && (
                      <Button
                        onClick={() => {
                          if (editingMessageId) {
                            // Save edited message
                            handleSaveEditedMessage();
                          } else if (newMessageText.trim()) {
                            // Send new message
                            const newMessage: Message = {
                              id: String(messages.length + 1),
                              text: newMessageText,
                              timestamp: new Date().toLocaleString('en-GB', { 
                                day: '2-digit', 
                                month: '2-digit', 
                                year: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: false
                              }).replace(',', ''),
                              isNew: false,
                              sender: "You",
                              isCurrentUser: true,
                              isNewlyAdded: true
                            };
                            setMessages([...messages, newMessage]);
                            setNewMessageText("");
                          }
                        }}
                        size="sm"
                        className="absolute bottom-2 right-2 h-8 w-8 p-0"
                      >
                        {editingMessageId ? <Check className="w-4 h-4" /> : <Send className="w-4 h-4" />}
                      </Button>
                    )}
                  </div>

                  {/* Action Buttons for Return Mode */}
                  {isReturnAction && (
                    <div className="flex justify-end gap-3 mt-4">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowMessagesModal(false);
                          setIsReturnAction(false);
                          setNewMessageText("");
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() => {
                          if (newMessageText.trim()) {
                            // Add the return message
                            const returnMessage: Message = {
                              id: String(messages.length + 1),
                              text: newMessageText,
                              timestamp: new Date().toLocaleString('en-GB', { 
                                day: '2-digit', 
                                month: '2-digit', 
                                year: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: false
                              }).replace(',', ''),
                              isNew: false,
                              sender: "You",
                              isCurrentUser: true,
                              isNewlyAdded: true
                            };
                            setMessages([...messages, returnMessage]);
                            setNewMessageText("");
                            
                            // Complete the return action
                            setShowMessagesModal(false);
                            setIsReturnAction(false);
                            
                            // Show success message
                            alert("Form returned successfully!");
                            
                            // Optionally navigate back to list
                            // onBackToList();
                          }
                        }}
                        disabled={!newMessageText.trim()}
                        className="bg-warning hover:bg-warning/90"
                      >
                        <CornerUpLeft className="w-4 h-4 mr-2" />
                        Return Form
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        ) : (
          // Desktop: ResponsiveDialog
          <ResponsiveDialog 
            open={showMessagesModal} 
            onOpenChange={(open) => {
              setShowMessagesModal(open);
              // Mark all messages as read when modal closes
              if (!open) {
                setMessages(messages.map(m => ({ ...m, isNew: false })));
                setIsReturnAction(false);
                setEditingMessageId(null);
                setNewMessageText("");
              }
            }}
            title={isReturnAction ? "Return Form" : "Messages"}
            size="3xl"
          >
          <div className="flex flex-col h-[500px]">
            {/* Return Info Banner */}
            {isReturnAction && (
              <div className="mb-4 p-3 bg-warning/10 border border-warning/20 rounded-lg">
                <p className="text-sm text-foreground">
                  Please provide a reason for returning this form. A message is required to complete the return action.
                </p>
              </div>
            )}

            {/* Messages Area - Scrollable */}
            <div className="flex-1 overflow-y-auto custom-scrollbar px-1 -mx-1">
              {messages.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground h-full flex flex-col items-center justify-center">
                  <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No messages</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message, index) => {
                    // Find the last message from the current user
                    const userMessages = messages.filter(m => m.isCurrentUser);
                    const isLastUserMessage = message.isCurrentUser && 
                                             userMessages.length > 0 && 
                                             userMessages[userMessages.length - 1].id === message.id;
                    
                    return (
                      <div 
                        key={message.id}
                        className={`flex ${message.isCurrentUser ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[75%] ${message.isCurrentUser ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                          {/* Sender name - only show for non-current user */}
                          {!message.isCurrentUser && (
                            <div className="flex items-center gap-2 px-1">
                              <span className="text-xs text-muted-foreground">{message.sender}</span>
                              {message.isNew && (
                                <span className="px-1.5 py-0.5 text-xs bg-destructive text-destructive-foreground rounded">
                                  New
                                </span>
                              )}
                            </div>
                          )}
                          
                          {/* Message bubble */}
                          <div 
                            className={`px-4 py-2.5 rounded-lg ${
                              message.isCurrentUser
                                ? 'bg-primary text-primary-foreground'
                                : message.isNew
                                  ? 'bg-destructive/10 border border-destructive/20'
                                  : 'bg-muted'
                            }`}
                          >
                            <p className={message.isCurrentUser ? 'text-primary-foreground' : 'text-foreground'}>
                              {message.text}
                            </p>
                          </div>
                          
                          {/* Timestamp with Edit/Delete buttons */}
                          <div className="flex items-center gap-2 px-1">
                            <span className="text-xs text-muted-foreground">
                              {message.timestamp}
                            </span>
                            
                            {/* Edit/Delete buttons for newly added user messages only */}
                            {isLastUserMessage && message.isNewlyAdded && (
                              <div className="flex items-center gap-1">
                                <span className="text-xs text-muted-foreground">|</span>
                                <button
                                  onClick={() => handleEditMessage(message.id, message.text)}
                                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                                >
                                  Edit
                                </button>
                                <span className="text-xs text-muted-foreground">|</span>
                                <button
                                  onClick={() => handleDeleteMessage(message.id)}
                                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                                >
                                  Remove
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Reply Section - Fixed at bottom */}
            <div className="pt-4 border-t mt-4">
              <div className="relative">
                <Textarea
                  value={newMessageText}
                  onChange={(e) => setNewMessageText(e.target.value)}
                  placeholder={
                    editingMessageId 
                      ? "Edit your message..." 
                      : isReturnAction 
                        ? "Enter reason for return..." 
                        : "Type your message..."
                  }
                  className="resize-none min-h-[80px] pr-12"
                  onKeyDown={(e) => {
                    // Handle Enter key for both editing and sending new messages
                    if (e.key === 'Enter' && !e.shiftKey && newMessageText.trim()) {
                      e.preventDefault();
                      
                      if (editingMessageId) {
                        // Save edited message
                        handleSaveEditedMessage();
                      } else if (!isReturnAction) {
                        // Send new message
                        const newMessage: Message = {
                          id: String(messages.length + 1),
                          text: newMessageText,
                          timestamp: new Date().toLocaleString('en-GB', { 
                            day: '2-digit', 
                            month: '2-digit', 
                            year: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false
                          }).replace(',', ''),
                          isNew: false,
                          sender: "You",
                          isCurrentUser: true,
                          isNewlyAdded: true
                        };
                        setMessages([...messages, newMessage]);
                        setNewMessageText("");
                      }
                    }
                  }}
                />
                {/* Send/Save button */}
                {newMessageText.trim() && !isReturnAction && (
                  <Button
                    onClick={() => {
                      if (editingMessageId) {
                        // Save edited message
                        handleSaveEditedMessage();
                      } else if (newMessageText.trim()) {
                        // Send new message
                        const newMessage: Message = {
                          id: String(messages.length + 1),
                          text: newMessageText,
                          timestamp: new Date().toLocaleString('en-GB', { 
                            day: '2-digit', 
                            month: '2-digit', 
                            year: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false
                          }).replace(',', ''),
                          isNew: false,
                          sender: "You",
                          isCurrentUser: true,
                          isNewlyAdded: true
                        };
                        setMessages([...messages, newMessage]);
                        setNewMessageText("");
                      }
                    }}
                    size="sm"
                    className="absolute bottom-2 right-2 h-8 w-8 p-0"
                  >
                    {editingMessageId ? <Check className="w-4 h-4" /> : <Send className="w-4 h-4" />}
                  </Button>
                )}
              </div>

              {/* Action Buttons for Return Mode */}
              {isReturnAction && (
                <div className="flex justify-end gap-3 mt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowMessagesModal(false);
                      setIsReturnAction(false);
                      setNewMessageText("");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      if (newMessageText.trim()) {
                        // Add the return message
                        const returnMessage: Message = {
                          id: String(messages.length + 1),
                          text: newMessageText,
                          timestamp: new Date().toLocaleString('en-GB', { 
                            day: '2-digit', 
                            month: '2-digit', 
                            year: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false
                          }).replace(',', ''),
                          isNew: false,
                          sender: "You",
                          isCurrentUser: true,
                          isNewlyAdded: true
                        };
                        setMessages([...messages, returnMessage]);
                        setNewMessageText("");
                        
                        // Complete the return action
                        setShowMessagesModal(false);
                        setIsReturnAction(false);
                        
                        // Show success message
                        alert("Form returned successfully!");
                        
                        // Optionally navigate back to list
                        // onBackToList();
                      }
                    }}
                    disabled={!newMessageText.trim()}
                    className="bg-warning hover:bg-warning/90"
                  >
                    <CornerUpLeft className="w-4 h-4 mr-2" />
                    Return Form
                  </Button>
                </div>
              )}
            </div>
          </div>
        </ResponsiveDialog>
        )}

        {/* Partial Return Alert Dialog */}
        <AlertDialog open={showPartialReturnAlert} onOpenChange={setShowPartialReturnAlert}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>All Rows Selected</AlertDialogTitle>
              <AlertDialogDescription>
                All rows are selected, please use Return instead of Partial return.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={() => setShowPartialReturnAlert(false)}>
                OK
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete {selectedRows.size === 1 ? 'Row' : 'Rows'}?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete {selectedRows.size} {selectedRows.size === 1 ? 'row' : 'rows'}? This action cannot be undone.
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

        {/* Split Modal */}
        <ResponsiveDialog 
          open={showSplitModal} 
          onOpenChange={setShowSplitModal}
          title={
            <div className="flex items-center gap-2">
              <span>Split Row:</span>
              {selectedRows.size === 1 && (() => {
                const selectedRow = rows.find(row => selectedRows.has(row.id));
                return selectedRow ? (
                  <>
                    <span className="font-medium">{selectedRow.description}</span>
                    <span className="text-md text-muted-foreground">({selectedRow.category})</span>
                  </>
                ) : null;
              })()}
            </div>
          }
          size="5xl"
          footer={
            <div className="flex justify-end gap-3">
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowSplitModal(false);
                  setSplitPercentage('50');
                  setSplitValue('');
                }}
              >
                Cancel
              </Button>
              <Button 
                onClick={applySplit}
                disabled={
                  splitMode === 'simple-rows' 
                    ? (!numberOfSplits || parseInt(numberOfSplits) < 2)
                    : (splitMethod === 'value' && (!splitValue || parseFloat(splitValue) <= 0))
                }
              >
                <Split className="size-4 mr-2" />
                Apply Split
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            {/* Split Mode Toggle */}
            <div className="inline-flex items-center rounded-lg bg-muted p-1 gap-1">
              <button
                onClick={() => setSplitMode('field-by-field')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  splitMode === 'field-by-field'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Simple
              </button>
              <button
                onClick={() => setSplitMode('simple-rows')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  splitMode === 'simple-rows'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                To Multiple Rows
              </button>
            </div>

            {/* Field Selector */}
            <div className="space-y-2">
              <Label className="text-sm">Calculation to split by:</Label>
              <Select
                value={activeSplitField}
                onValueChange={(value: 'expenseTotal' | 'expenseFxTotalLocal' | 'expenseGbpNet' | 'plannedExpenseGbp') => setActiveSplitField(value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="expenseTotal">Expense Total</SelectItem>
                  <SelectItem value="expenseFxTotalLocal">Expense FX Total Local</SelectItem>
                  <SelectItem value="expenseGbpNet">Expense GBP Net</SelectItem>
                  <SelectItem value="plannedExpenseGbp">Planned Expense GBP</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Conditional rendering based on split mode */}
            {splitMode === 'simple-rows' ? (
              // Multiple mode: Split into N rows with table interface
              <div className="space-y-4 min-h-[500px] max-h-[500px] overflow-y-auto">
                {rows.filter(row => selectedRows.has(row.id)).map((row) => {
                  const originalExpenseTotal = parseFloat(row.expenseTotal || row.amount.replace(' GBP', '').replace(/,/g, ''));
                  const originalFxTotal = parseFloat(row.expenseFxTotalLocal || '0');
                  const originalGbpNet = parseFloat(row.expenseGbpNet || '0');
                  const originalPlanned = parseFloat(row.plannedExpenseGbp || '0');
                  const currency = row.expenseCurrency || "AED";
                  const numSplits = parseInt(numberOfSplits) || 2;

                  return (
                    <div key={row.id} className="p-4 border border-border rounded-lg bg-background">
                      <div className="space-y-4">
                        {/* Split table */}
                        <div className="border border-border rounded-lg overflow-hidden">
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="bg-muted/50">
                                  <th className="px-3 py-2 text-left font-medium border-r border-border w-20"></th>
                                  <th className={`px-3 py-2 text-left font-medium border-r border-border ${activeSplitField !== 'expenseTotal' ? 'opacity-40' : ''}`}>Expense Total</th>
                                  <th className={`px-3 py-2 text-left font-medium border-r border-border ${activeSplitField !== 'expenseFxTotalLocal' ? 'opacity-40' : ''}`}>FX Total Local</th>
                                  <th className={`px-3 py-2 text-left font-medium border-r border-border ${activeSplitField !== 'expenseGbpNet' ? 'opacity-40' : ''}`}>GBP Net</th>
                                  <th className={`px-3 py-2 text-left font-medium border-r border-border ${activeSplitField !== 'plannedExpenseGbp' ? 'opacity-40' : ''}`}>Planned GBP</th>
                                  <th className="px-3 py-2 text-left font-medium">%</th>
                                </tr>
                              </thead>
                              <tbody>
                                {/* Original value row */}
                                <tr className="border-t border-border bg-muted/30">
                                  <td className="px-3 py-2 border-r border-border font-medium">Value</td>
                                  <td className={`px-3 py-2 border-r border-border ${activeSplitField !== 'expenseTotal' ? 'opacity-40' : ''}`}>{originalExpenseTotal.toFixed(2)}</td>
                                  <td className={`px-3 py-2 border-r border-border ${activeSplitField !== 'expenseFxTotalLocal' ? 'opacity-40' : ''}`}>{originalFxTotal.toFixed(2)}</td>
                                  <td className={`px-3 py-2 border-r border-border ${activeSplitField !== 'expenseGbpNet' ? 'opacity-40' : ''}`}>{originalGbpNet.toFixed(2)}</td>
                                  <td className={`px-3 py-2 border-r border-border ${activeSplitField !== 'plannedExpenseGbp' ? 'opacity-40' : ''}`}>{originalPlanned.toFixed(2)}</td>
                                  <td className="px-3 py-2">100.00</td>
                                </tr>
                                
                                {/* Split rows */}
                                {simpleSplitRows[row.id]?.map((split, index) => {
                                  // Check if this row is zeroed out due to budget exhaustion
                                  const isZeroedOut = split.percentage <= 0.01 && !(editedSplitRows[row.id]?.has(index));
                                  
                                  return (
                                  <tr key={index} className="border-t border-border hover:bg-muted/20">
                                    <td className="px-3 py-2 border-r border-border font-medium">{index + 1}</td>
                                    <td className={`px-3 py-2 border-r border-border ${activeSplitField !== 'expenseTotal' ? 'opacity-40' : ''}`}>
                                      <Input
                                        type="number"
                                        step="0.01"
                                        value={split.expenseTotal}
                                        onChange={(e) => handleSplitValueChange(row.id, index, 'expenseTotal', e.target.value)}
                                        className="h-8 w-full bg-background"
                                        disabled={activeSplitField !== 'expenseTotal' || isZeroedOut}
                                      />
                                    </td>
                                    <td className={`px-3 py-2 border-r border-border ${activeSplitField !== 'expenseFxTotalLocal' ? 'opacity-40' : ''}`}>
                                      <Input
                                        type="number"
                                        step="0.01"
                                        value={split.fxTotal}
                                        onChange={(e) => handleSplitValueChange(row.id, index, 'fxTotal', e.target.value)}
                                        className="h-8 w-full bg-background"
                                        disabled={activeSplitField !== 'expenseFxTotalLocal' || isZeroedOut}
                                      />
                                    </td>
                                    <td className={`px-3 py-2 border-r border-border ${activeSplitField !== 'expenseGbpNet' ? 'opacity-40' : ''}`}>
                                      <Input
                                        type="number"
                                        step="0.01"
                                        value={split.gbpNet}
                                        onChange={(e) => handleSplitValueChange(row.id, index, 'gbpNet', e.target.value)}
                                        className="h-8 w-full bg-background"
                                        disabled={activeSplitField !== 'expenseGbpNet' || isZeroedOut}
                                      />
                                    </td>
                                    <td className={`px-3 py-2 border-r border-border ${activeSplitField !== 'plannedExpenseGbp' ? 'opacity-40' : ''}`}>
                                      <Input
                                        type="number"
                                        step="0.01"
                                        value={split.planned}
                                        onChange={(e) => handleSplitValueChange(row.id, index, 'planned', e.target.value)}
                                        className="h-8 w-full bg-background"
                                        disabled={activeSplitField !== 'plannedExpenseGbp' || isZeroedOut}
                                      />
                                    </td>
                                    <td className="px-3 py-2">
                                      <Input
                                        type="number"
                                        step="0.01"
                                        value={split.percentage}
                                        onChange={(e) => handlePercentageChange(row.id, index, e.target.value)}
                                        className="h-8 w-full bg-background"
                                        disabled={isZeroedOut}
                                      />
                                    </td>
                                  </tr>
                                  );
                                })}
                              </tbody>
                              <tfoot>
                                <tr className="border-t-2 border-border">
                                  <td colSpan={6} className="px-3 py-3">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => setNumberOfSplits(String(Math.min(10, parseInt(numberOfSplits) + 1)))}
                                      className="w-full justify-center gap-2"
                                      disabled={parseInt(numberOfSplits) >= 10}
                                    >
                                      <Plus className="h-4 w-4" />
                                      Add more lines
                                    </Button>
                                  </td>
                                </tr>
                              </tfoot>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              // Single mode: Field-by-field controls
              <div className="space-y-4 min-h-[500px] max-h-[500px] overflow-y-auto">
                {rows.filter(row => selectedRows.has(row.id)).map((row, index) => {
                    const rowSplits = individualSplits[row.id];
                    if (!rowSplits) return null;
                    
                    // Helper to get split value
                    const getSplitValue = (field: keyof typeof rowSplits, originalValue: number) => {
                      const fieldSplit = rowSplits[field];
                      if (fieldSplit.method === 'percentage') {
                        const percentage = parseFloat(fieldSplit.percentage) || 50;
                        return (originalValue * percentage) / 100;
                      } else {
                        return parseFloat(fieldSplit.value) || 0;
                      }
                    };
                    
                    const originalExpenseTotal = parseFloat(row.expenseTotal || row.amount.replace(' GBP', '').replace(/,/g, ''));
                    const originalFxTotal = parseFloat(row.expenseFxTotalLocal || '0');
                    const originalGbpNet = parseFloat(row.expenseGbpNet || '0');
                    const originalPlanned = parseFloat(row.plannedExpenseGbp || '0');
                    const currency = row.expenseCurrency || "AED";
                    
                    return (
                      <div key={row.id}>
                        <div className="space-y-4">
                          {/* Expense Total */}
                          <div className={`bg-muted/30 rounded-lg p-3 border border-border ${activeSplitField !== 'expenseTotal' ? 'opacity-40' : ''}`}>
                            <div className="flex items-center justify-between mb-2">
                              <Label className="text-sm">Expense Total</Label>
                            </div>
                            <div className="flex gap-2">
                              <Select
                                value={rowSplits.expenseTotal.method}
                                onValueChange={(value: 'percentage' | 'value') => {
                                  setIndividualSplits({
                                    ...individualSplits,
                                    [row.id]: {
                                      ...rowSplits,
                                      expenseTotal: { ...rowSplits.expenseTotal, method: value }
                                    }
                                  });
                                }}
                                disabled={activeSplitField !== 'expenseTotal'}
                              >
                                <SelectTrigger className="w-[120px]">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="percentage">%</SelectItem>
                                  <SelectItem value="value">Value</SelectItem>
                                </SelectContent>
                              </Select>
                              {rowSplits.expenseTotal.method === 'percentage' ? (
                                <div className="flex items-center gap-2 flex-1">
                                  <Input
                                    type="number"
                                    min="0"
                                    max="100"
                                    step="1"
                                    value={rowSplits.expenseTotal.percentage}
                                    onChange={(e) => {
                                      setIndividualSplits({
                                        ...individualSplits,
                                        [row.id]: {
                                          ...rowSplits,
                                          expenseTotal: { ...rowSplits.expenseTotal, percentage: e.target.value }
                                        }
                                      });
                                    }}
                                    className="flex-1"
                                    disabled={activeSplitField !== 'expenseTotal'}
                                  />
                                  <span className="text-sm text-muted-foreground">Current: {getSplitValue('expenseTotal', originalExpenseTotal).toFixed(2)} | New: {(originalExpenseTotal - getSplitValue('expenseTotal', originalExpenseTotal)).toFixed(2)} {currency}</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2 flex-1">
                                  <Input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={rowSplits.expenseTotal.value}
                                    onChange={(e) => {
                                      setIndividualSplits({
                                        ...individualSplits,
                                        [row.id]: {
                                          ...rowSplits,
                                          expenseTotal: { ...rowSplits.expenseTotal, value: e.target.value }
                                        }
                                      });
                                    }}
                                    className="flex-1"
                                    disabled={activeSplitField !== 'expenseTotal'}
                                  />
                                  <span className="text-sm text-muted-foreground">Current: {parseFloat(rowSplits.expenseTotal.value || '0').toFixed(2)} | New: {(originalExpenseTotal - parseFloat(rowSplits.expenseTotal.value || '0')).toFixed(2)} {currency}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Expense FX Total Local */}
                          <div className={`bg-muted/30 rounded-lg p-3 ${activeSplitField !== 'expenseFxTotalLocal' ? 'opacity-40' : ''}`}>
                            <div className="flex items-center justify-between mb-2">
                              <Label className="text-sm">Expense FX Total Local</Label>
                            </div>
                            <div className="flex gap-2">
                              <Select
                                value={rowSplits.expenseFxTotalLocal.method}
                                onValueChange={(value: 'percentage' | 'value') => {
                                  setIndividualSplits({
                                    ...individualSplits,
                                    [row.id]: {
                                      ...rowSplits,
                                      expenseFxTotalLocal: { ...rowSplits.expenseFxTotalLocal, method: value }
                                    }
                                  });
                                }}
                                disabled={activeSplitField !== 'expenseFxTotalLocal'}
                              >
                                <SelectTrigger className="w-[120px]">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="percentage">%</SelectItem>
                                  <SelectItem value="value">Value</SelectItem>
                                </SelectContent>
                              </Select>
                              {rowSplits.expenseFxTotalLocal.method === 'percentage' ? (
                                <div className="flex items-center gap-2 flex-1">
                                  <Input
                                    type="number"
                                    min="0"
                                    max="100"
                                    step="1"
                                    value={rowSplits.expenseFxTotalLocal.percentage}
                                    onChange={(e) => {
                                      setIndividualSplits({
                                        ...individualSplits,
                                        [row.id]: {
                                          ...rowSplits,
                                          expenseFxTotalLocal: { ...rowSplits.expenseFxTotalLocal, percentage: e.target.value }
                                        }
                                      });
                                    }}
                                    className="flex-1"
                                    disabled={activeSplitField !== 'expenseFxTotalLocal'}
                                  />
                                  <span className="text-sm text-muted-foreground">Current: {getSplitValue('expenseFxTotalLocal', originalFxTotal).toFixed(2)} | New: {(originalFxTotal - getSplitValue('expenseFxTotalLocal', originalFxTotal)).toFixed(2)}</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2 flex-1">
                                  <Input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={rowSplits.expenseFxTotalLocal.value}
                                    onChange={(e) => {
                                      setIndividualSplits({
                                        ...individualSplits,
                                        [row.id]: {
                                          ...rowSplits,
                                          expenseFxTotalLocal: { ...rowSplits.expenseFxTotalLocal, value: e.target.value }
                                        }
                                      });
                                    }}
                                    className="flex-1"
                                    disabled={activeSplitField !== 'expenseFxTotalLocal'}
                                  />
                                  <span className="text-sm text-muted-foreground">Current: {parseFloat(rowSplits.expenseFxTotalLocal.value || '0').toFixed(2)} | New: {(originalFxTotal - parseFloat(rowSplits.expenseFxTotalLocal.value || '0')).toFixed(2)}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Expense GBP Net */}
                          <div className={`bg-muted/30 rounded-lg p-3 ${activeSplitField !== 'expenseGbpNet' ? 'opacity-40' : ''}`}>
                            <div className="flex items-center justify-between mb-2">
                              <Label className="text-sm">Expense GBP Net</Label>
                            </div>
                            <div className="flex gap-2">
                              <Select
                                value={rowSplits.expenseGbpNet.method}
                                onValueChange={(value: 'percentage' | 'value') => {
                                  setIndividualSplits({
                                    ...individualSplits,
                                    [row.id]: {
                                      ...rowSplits,
                                      expenseGbpNet: { ...rowSplits.expenseGbpNet, method: value }
                                    }
                                  });
                                }}
                                disabled={activeSplitField !== 'expenseGbpNet'}
                              >
                                <SelectTrigger className="w-[120px]">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="percentage">%</SelectItem>
                                  <SelectItem value="value">Value</SelectItem>
                                </SelectContent>
                              </Select>
                              {rowSplits.expenseGbpNet.method === 'percentage' ? (
                                <div className="flex items-center gap-2 flex-1">
                                  <Input
                                    type="number"
                                    min="0"
                                    max="100"
                                    step="1"
                                    value={rowSplits.expenseGbpNet.percentage}
                                    onChange={(e) => {
                                      setIndividualSplits({
                                        ...individualSplits,
                                        [row.id]: {
                                          ...rowSplits,
                                          expenseGbpNet: { ...rowSplits.expenseGbpNet, percentage: e.target.value }
                                        }
                                      });
                                    }}
                                    className="flex-1"
                                    disabled={activeSplitField !== 'expenseGbpNet'}
                                  />
                                  <span className="text-sm text-muted-foreground">Current: {getSplitValue('expenseGbpNet', originalGbpNet).toFixed(2)} | New: {(originalGbpNet - getSplitValue('expenseGbpNet', originalGbpNet)).toFixed(2)}</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2 flex-1">
                                  <Input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={rowSplits.expenseGbpNet.value}
                                    onChange={(e) => {
                                      setIndividualSplits({
                                        ...individualSplits,
                                        [row.id]: {
                                          ...rowSplits,
                                          expenseGbpNet: { ...rowSplits.expenseGbpNet, value: e.target.value }
                                        }
                                      });
                                    }}
                                    className="flex-1"
                                    disabled={activeSplitField !== 'expenseGbpNet'}
                                  />
                                  <span className="text-sm text-muted-foreground">Current: {parseFloat(rowSplits.expenseGbpNet.value || '0').toFixed(2)} | New: {(originalGbpNet - parseFloat(rowSplits.expenseGbpNet.value || '0')).toFixed(2)}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Planned Expense GBP */}
                          <div className={`bg-muted/30 rounded-lg p-3 ${activeSplitField !== 'plannedExpenseGbp' ? 'opacity-40' : ''}`}>
                            <div className="flex items-center justify-between mb-2">
                              <Label className="text-sm">Planned Expense GBP</Label>
                              <span className="text-xs text-muted-foreground">Current: {originalPlanned.toFixed(2)}</span>
                            </div>
                            <div className="flex gap-2">
                              <Select
                                value={rowSplits.plannedExpenseGbp.method}
                                onValueChange={(value: 'percentage' | 'value') => {
                                  setIndividualSplits({
                                    ...individualSplits,
                                    [row.id]: {
                                      ...rowSplits,
                                      plannedExpenseGbp: { ...rowSplits.plannedExpenseGbp, method: value }
                                    }
                                  });
                                }}
                                disabled={activeSplitField !== 'plannedExpenseGbp'}
                              >
                                <SelectTrigger className="w-[120px]">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="percentage">%</SelectItem>
                                  <SelectItem value="value">Value</SelectItem>
                                </SelectContent>
                              </Select>
                              {rowSplits.plannedExpenseGbp.method === 'percentage' ? (
                                <div className="flex items-center gap-2 flex-1">
                                  <Input
                                    type="number"
                                    min="0"
                                    max="100"
                                    step="1"
                                    value={rowSplits.plannedExpenseGbp.percentage}
                                    onChange={(e) => {
                                      setIndividualSplits({
                                        ...individualSplits,
                                        [row.id]: {
                                          ...rowSplits,
                                          plannedExpenseGbp: { ...rowSplits.plannedExpenseGbp, percentage: e.target.value }
                                        }
                                      });
                                    }}
                                    className="flex-1"
                                    disabled={activeSplitField !== 'plannedExpenseGbp'}
                                  />
                                  <span className="text-sm text-muted-foreground">= {getSplitValue('plannedExpenseGbp', originalPlanned).toFixed(2)}</span>
                                </div>
                              ) : (
                                <Input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  value={rowSplits.plannedExpenseGbp.value}
                                  onChange={(e) => {
                                    setIndividualSplits({
                                      ...individualSplits,
                                      [row.id]: {
                                        ...rowSplits,
                                        plannedExpenseGbp: { ...rowSplits.plannedExpenseGbp, value: e.target.value }
                                      }
                                    });
                                  }}
                                  className="flex-1"
                                  disabled={activeSplitField !== 'plannedExpenseGbp'}
                                />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                })}
              </div>
            )}
          </div>
        </ResponsiveDialog>

        {/* Fullscreen File Viewer Dialog */}
        <ResponsiveDialog
          open={isFullscreen}
          onOpenChange={setIsFullscreen}
          title="File Viewer"
          fullscreen={true}
        >
          <div className="absolute inset-0 bg-black overflow-hidden" style={{ margin: 0, padding: 0 }}>
            <div 
              className="absolute inset-0 flex items-center justify-center overflow-auto"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {(() => {
                const currentFiles = isViewingUnassigned ? getFilteredUnassignedFiles() : attachedFiles;
                const currentFile = currentFiles[currentFileIndex];
                
                if (!currentFile) {
                  return <div className="text-muted-foreground">No file to display</div>;
                }
                
                if (currentFile.type === 'image') {
                  return (
                    <img
                      src={currentFile.url}
                      alt={currentFile.name}
                      className="max-w-full max-h-full object-contain transition-transform touch-none"
                      style={{ transform: `scale(${zoomLevel / 100}) rotate(${rotationAngle}deg)` }}
                    />
                  );
                } else if (currentFile.type === 'pdf') {
                  return (
                    <div className="text-center">
                      <FileType className="h-20 w-20 mx-auto mb-4 text-red-500" />
                      <p className="text-base font-medium">{currentFile.name}</p>
                      <p className="text-sm text-muted-foreground mt-2">PDF Preview</p>
                      <Button
                        variant="outline"
                        size="default"
                        onClick={() => handleDownloadFile(currentFile)}
                        className="mt-4"
                      >
                        <Download className="h-5 w-5 mr-2" />
                        Download to View
                      </Button>
                    </div>
                  );
                } else {
                  return (
                    <div className="text-center">
                      <File className="h-20 w-20 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-base font-medium">{currentFile.name}</p>
                      <p className="text-sm text-muted-foreground mt-2">File Preview</p>
                    </div>
                  );
                }
              })()}
            </div>

            {/* Fullscreen Control Bar */}
            <div 
              className="absolute left-4 right-4 flex items-center gap-2 p-3 bg-background/90 dark:bg-background/95 backdrop-blur-md rounded-lg border border-border shadow-xl"
              style={{
                bottom: 'calc(env(safe-area-inset-bottom, 0px) + 1rem)'
              }}
            >
              {/* Navigation Controls */}
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handlePreviousFile}
                  disabled={currentFileIndex === 0}
                  className="h-9 w-9 p-0"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <span className="text-sm text-muted-foreground px-3 min-w-[70px] text-center font-medium">
                  {currentFileIndex + 1} / {isViewingUnassigned ? getFilteredUnassignedFiles().length : attachedFiles.length}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleNextFile}
                  disabled={currentFileIndex >= (isViewingUnassigned ? getFilteredUnassignedFiles().length : attachedFiles.length) - 1}
                  className="h-9 w-9 p-0"
                >
                  <ChevronRightIcon className="h-5 w-5" />
                </Button>
              </div>

              <div className="h-8 w-px bg-border hidden md:block" />

              {/* Zoom Controls - Hidden on mobile, use pinch-to-zoom instead */}
              <div className="hidden md:flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleZoomOut}
                  disabled={zoomLevel <= 50}
                  className="h-9 w-9 p-0"
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="text-xs text-muted-foreground px-2 min-w-[50px] text-center">
                  {zoomLevel}%
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleZoomIn}
                  disabled={zoomLevel >= 200}
                  className="h-9 w-9 p-0"
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>

              <div className="h-8 w-px bg-border" />

              {/* Rotation Controls */}
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRotateLeft}
                  className="h-9 w-9 p-0"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRotateRight}
                  className="h-9 w-9 p-0"
                >
                  <RotateCw className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex-1" />

              {/* Download */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const currentFiles = isViewingUnassigned ? getFilteredUnassignedFiles() : attachedFiles;
                  handleDownloadFile(currentFiles[currentFileIndex]);
                }}
                className="h-9 w-9 p-0"
              >
                <Download className="h-4 w-4" />
              </Button>

              {/* Exit Fullscreen */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleToggleFullscreen}
                className="h-9 w-9 p-0"
              >
                <Minimize2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </ResponsiveDialog>
      </div>
    </TooltipProvider>
  );
}