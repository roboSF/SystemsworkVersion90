import { useState, useEffect } from "react";
import { Plus, PlusCircle, Calendar, Upload, Edit, Menu, X, Trash2, Copy, Split, Check, List, Grid3x3, Save, XIcon } from "lucide-react";
import { BsLayoutSidebarInset, BsLayoutSidebarInsetReverse } from "react-icons/bs";
import ResponsiveDialog from "./ResponsiveDialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import MobileNavbar from "./MobileNavbar";
import svgPaths from "../imports/svg-l12dhogi8o";
import errorSvgPaths from "../imports/svg-ltyjnttfzg";
import warningSvgPaths from "../imports/svg-h8ry7tl3k6";
import imgImagePlaceholderChangeImageHere from "figma:asset/7ff5b46e5f240e6d5e305d752472b445c8d3a2c1.png";
import SystemsWorkTransparentNoEdges1 from "../imports/SystemsWorkTransparentNoEdges1";

interface ExpenseRow {
  id: string;
  category: string;
  date: string;
  description: string;
  amount: string;
  status: 'warning' | 'error' | 'success' | 'neutral';
  badge?: string;
}

const INITIAL_ROWS: ExpenseRow[] = [
  {
    id: "1",
    category: "Accommodation",
    date: "2/6/25",
    description: "Hotel Carlton",
    amount: "1,739.13 GBP",
    status: "warning",
    badge: "Free"
  },
  {
    id: "2",
    category: "Meals",
    date: "2/7/25",
    description: "Champs Elysees",
    amount: "347.83 GBP",
    status: "error"
  },
  {
    id: "3",
    category: "Mobile Phone",
    date: "2/7/25",
    description: "Phone bill",
    amount: "130.43 GBP",
    status: "neutral"
  }
];

const EXPENSE_CATEGORIES = [
  "Accommodation", "Meals", "Transportation", "Mobile Phone", "Office Supplies", "Travel", "Entertainment"
];

type ViewMode = 'stacked' | 'grid';

interface EnhancedExpenseFormProps {
  onBackToList?: () => void;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export default function EnhancedExpenseForm({ onBackToList, sidebarOpen, onToggleSidebar }: EnhancedExpenseFormProps) {
  const [rows, setRows] = useState<ExpenseRow[]>(INITIAL_ROWS);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<ViewMode>('stacked');
  const [editingCell, setEditingCell] = useState<{rowId: string, field: string} | null>(null);
  const [editValue, setEditValue] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  // Inline row creation state
  const [isAddingInlineRow, setIsAddingInlineRow] = useState(false);
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
  const [headerDetails, setHeaderDetails] = useState({
    shortDescription: "Trip to Paris",
    chargeTo: "Not Selected",
    colleagues: "John Doe, Sarah Smith",
    dateFrom: "2025-02-05",
    dateTo: "2025-02-10",
    project: "Marketing Campaign Q1",
    status: "In Progress",
    image: imgImagePlaceholderChangeImageHere
  });

  const [showEditRowModal, setShowEditRowModal] = useState(false);
  const [editingRow, setEditingRow] = useState<ExpenseRow | null>(null);
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

  // Selection functions
  const isAllSelected = selectedRows.size === rows.length && rows.length > 0;
  const isPartiallySelected = selectedRows.size > 0 && selectedRows.size < rows.length;

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

  // View mode functions
  const toggleViewMode = () => {
    // Prevent toggling to grid mode on mobile
    if (isMobile) return;
    
    setViewMode(viewMode === 'stacked' ? 'grid' : 'stacked');
    setEditingCell(null); // Clear any editing state when switching views
    setIsAddingInlineRow(false); // Cancel inline row addition when switching views
  };

  // Get current view mode (force stacked on mobile)
  const currentViewMode = isMobile ? 'stacked' : viewMode;

  // Modal functions
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
      status: row.status
    });
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
      status: "neutral"
    });
  };

  const saveEditedRow = () => {
    if (!editingRow || !editFormData.category || !editFormData.description || !editFormData.amount) {
      return; // Basic validation
    }

    const formattedDate = new Date(editFormData.date).toLocaleDateString("en-GB");
    const updatedRow: ExpenseRow = {
      ...editingRow,
      category: editFormData.category,
      date: formattedDate,
      description: editFormData.description,
      amount: `${editFormData.amount} GBP`,
      status: editFormData.status
    };
    
    setRows(rows.map(row => row.id === editingRow.id ? updatedRow : row));
    closeEditRowModal();
  };

  // Bulk action functions
  const handleBulkDelete = () => {
    const newRows = rows.filter(row => !selectedRows.has(row.id));
    setRows(newRows);
    setSelectedRows(new Set());
  };

  const handleBulkCopy = () => {
    const rowsToCopy = rows.filter(row => selectedRows.has(row.id));
    const copiedRows = rowsToCopy.map(row => ({
      ...row,
      id: `${row.id}-copy-${Date.now()}`,
      description: `${row.description} (Copy)`
    }));
    setRows([...rows, ...copiedRows]);
    setSelectedRows(new Set());
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-[#f8f9fa] flex">
        {/* Mobile Navbar */}
        <MobileNavbar
          onMenuClick={onToggleSidebar}
          onBackClick={onBackToList}
          showBackButton={true}
          formNumber="63"
          formType="Expense Report"
        />

        {/* Desktop/Mobile Sidebar - Implementation truncated for brevity */}
        <div className={`${sidebarOpen ? 'w-[280px]' : 'w-[72px]'} transition-all duration-300 ease-in-out ${isMobile ? 'fixed inset-y-0 left-0 z-[55] bg-white shadow-xl transform translate-x-0' : 'flex-shrink-0'} ${isMobile && !sidebarOpen ? '-translate-x-full' : ''}`}>
          {/* Sidebar content implementation would go here */}
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col pt-mobile-nav md:pt-0">
          <div className="p-6 flex-1">
            {/* Form Header */}
            <div className="bg-white rounded-[10px] border border-[#e3e6ed] p-6 mb-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Form Image */}
                <div className="relative size-20 rounded-[10px] border border-[#e3e6ed] flex-shrink-0">
                  <div
                    className="absolute bg-[position:50%_50%] bg-[rgba(0,0,0,0.9)] bg-contain inset-0 rounded-[10px]"
                    style={{ backgroundImage: `url('${headerDetails.image}')` }}
                  />
                </div>

                {/* Form Details */}
                <div className="flex-1 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h1 className="text-xl font-medium text-gray-900">{headerDetails.shortDescription}</h1>
                      <p className="text-sm text-gray-500 mt-1">#{63} • {headerDetails.status}</p>
                    </div>
                    
                    {/* Edit Form Details Button */}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-2 w-full sm:w-auto"
                      onClick={openHeaderModal}
                    >
                      <Edit className="size-4" />
                      <span>Edit Form Details</span>
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Project:</span>
                      <p className="font-medium">{headerDetails.project}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Date Range:</span>
                      <p className="font-medium">{new Date(headerDetails.dateFrom).toLocaleDateString("en-GB")} - {new Date(headerDetails.dateTo).toLocaleDateString("en-GB")}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Colleagues:</span>
                      <p className="font-medium">{headerDetails.colleagues}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Control Bar */}
            <div className="bg-white rounded-[10px] border border-[#e3e6ed] p-4 mb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                {/* Selection Info */}
                <div className="text-sm text-gray-600">
                  {selectedRows.size > 0 ? (
                    `${selectedRows.size} of ${rows.length} expense${rows.length !== 1 ? 's' : ''} selected`
                  ) : (
                    `${rows.length} expense${rows.length !== 1 ? 's' : ''} total`
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                  {selectedRows.size > 0 && (
                    <>
                      <Button size="sm" variant="outline" onClick={handleBulkCopy} className="gap-2">
                        <Copy className="size-4" />
                        Copy
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => alert('Split functionality')} className="gap-2">
                        <Split className="size-4" />
                        Split
                      </Button>
                      <Button size="sm" variant="destructive" onClick={handleBulkDelete} className="gap-2">
                        <Trash2 className="size-4" />
                        Delete
                      </Button>
                    </>
                  )}
                  
                  <Button size="sm" onClick={() => openAddExpenseModal()} className="gap-2">
                    <Plus className="size-4" />
                    Add Expense
                  </Button>

                  {/* View Mode Toggle - Hidden on mobile */}
                  {!isMobile && (
                    <div className="flex rounded-lg border border-gray-200 bg-gray-50">
                      <Button
                        size="sm"
                        variant={currentViewMode === 'stacked' ? 'default' : 'ghost'}
                        onClick={toggleViewMode}
                        className="rounded-r-none border-r"
                      >
                        <List className="size-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant={currentViewMode === 'grid' ? 'default' : 'ghost'}
                        onClick={toggleViewMode}
                        className="rounded-l-none"
                      >
                        <Grid3x3 className="size-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Content Area - Simplified for demo */}
            <div className="space-y-4">
              {rows.map((row) => (
                <div key={row.id} className="bg-white rounded-[10px] border border-[#e3e6ed] p-4 cursor-pointer hover:shadow-md transition-all" onClick={() => openEditRowModal(row)}>
                  <div className="flex items-start gap-4">
                    <div
                      className={`relative rounded size-4 border cursor-pointer flex items-center justify-center ${
                        selectedRows.has(row.id)
                          ? 'bg-blue-600 border-blue-600'
                          : 'bg-white border-[rgba(0,0,0,0.15)] hover:border-blue-400'
                      }`}
                      onClick={(e) => toggleRowSelection(row.id, e)}
                    >
                      {selectedRows.has(row.id) && (
                        <Check className="size-3 text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-blue-600">{row.category}</h3>
                          <p className="text-sm text-gray-600">{row.date} | {row.description}</p>
                        </div>
                        <div className="font-medium">{row.amount}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Header Modal - ResponsiveDialog */}
        <ResponsiveDialog
          open={showHeaderModal}
          onOpenChange={setShowHeaderModal}
          title="Edit Form Details"
          description="Update the form header information including description, dates, colleagues, and project details."
          className="sm:max-w-[500px]"
          footer={
            <div className="flex gap-2 sm:gap-0 sm:flex-row-reverse">
              <Button onClick={saveHeaderDetails} className="flex-1 sm:flex-none">
                Save Changes
              </Button>
              <Button variant="outline" onClick={closeHeaderModal} className="flex-1 sm:flex-none">
                Cancel
              </Button>
            </div>
          }
        >
          <div className="space-y-6">
            {/* Form Image */}
            <div className="space-y-2">
              <Label htmlFor="form-image">Form Image</Label>
              <div className="flex items-center gap-4">
                <div className="relative w-20 h-16 border border-[#e3e6ed] rounded bg-gray-50 flex items-center justify-center overflow-hidden">
                  {headerDetails.image && (
                    <img 
                      src={headerDetails.image} 
                      alt="Form" 
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Upload className="size-4" />
                    <span className="text-sm font-medium">Upload New Image</span>
                  </div>
                  <p className="text-xs text-gray-500">JPG, PNG up to 5MB</p>
                  <input
                    id="form-image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="sr-only"
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                    onClick={() => document.getElementById('form-image')?.click()}
                  >
                    Choose File
                  </Button>
                </div>
              </div>
            </div>

            {/* Short Description */}
            <div className="space-y-2">
              <Label htmlFor="shortDescription">Short Description</Label>
              <Input
                id="shortDescription"
                value={headerDetails.shortDescription}
                onChange={(e) => setHeaderDetails({...headerDetails, shortDescription: e.target.value})}
              />
            </div>

            {/* Charge To */}
            <div className="space-y-2">
              <Label htmlFor="chargeTo">Charge To</Label>
              <Select 
                value={headerDetails.chargeTo} 
                onValueChange={(value) => setHeaderDetails({...headerDetails, chargeTo: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select charge to" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Not Selected">Not Selected</SelectItem>
                  <SelectItem value="Company">Company</SelectItem>
                  <SelectItem value="Department">Department</SelectItem>
                  <SelectItem value="Project">Project</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Project */}
            <div className="space-y-2">
              <Label htmlFor="project">Project</Label>
              <Input
                id="project"
                value={headerDetails.project}
                onChange={(e) => setHeaderDetails({...headerDetails, project: e.target.value})}
              />
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dateFrom">Date From</Label>
                <Input
                  id="dateFrom"
                  type="date"
                  value={headerDetails.dateFrom}
                  onChange={(e) => setHeaderDetails({...headerDetails, dateFrom: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateTo">Date To</Label>
                <Input
                  id="dateTo"
                  type="date"
                  value={headerDetails.dateTo}
                  onChange={(e) => setHeaderDetails({...headerDetails, dateTo: e.target.value})}
                />
              </div>
            </div>

            {/* Colleagues */}
            <div className="space-y-2">
              <Label htmlFor="colleagues">Colleagues</Label>
              <Textarea
                id="colleagues"
                value={headerDetails.colleagues}
                onChange={(e) => setHeaderDetails({...headerDetails, colleagues: e.target.value})}
                rows={2}
              />
            </div>
          </div>
        </ResponsiveDialog>

        {/* Add Expense Modal - ResponsiveDialog */}
        <ResponsiveDialog
          open={showAddExpenseModal}
          onOpenChange={setShowAddExpenseModal}
          title="Add New Expense"
          description="Add a new expense item to your form."
          footer={
            <div className="flex gap-2 sm:gap-0 sm:flex-row-reverse">
              <Button onClick={saveNewExpense} className="flex-1 sm:flex-none">
                Add Expense
              </Button>
              <Button variant="outline" onClick={closeAddExpenseModal} className="flex-1 sm:flex-none">
                Cancel
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={newExpense.category} onValueChange={(value) => setNewExpense({...newExpense, category: value})}>
                <SelectTrigger>
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

            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={newExpense.date}
                onChange={(e) => setNewExpense({...newExpense, date: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={newExpense.description}
                onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                placeholder="Enter expense description"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount (GBP)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={newExpense.amount}
                onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                placeholder="0.00"
              />
            </div>
          </div>
        </ResponsiveDialog>

        {/* Edit Row Modal - ResponsiveDialog */}
        <ResponsiveDialog
          open={showEditRowModal}
          onOpenChange={setShowEditRowModal}
          title="Edit Expense"
          description="Update the expense details."
          footer={
            <div className="flex gap-2 sm:gap-0 sm:flex-row-reverse">
              <Button onClick={saveEditedRow} className="flex-1 sm:flex-none">
                Save Changes
              </Button>
              <Button variant="outline" onClick={closeEditRowModal} className="flex-1 sm:flex-none">
                Cancel
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-category">Category</Label>
              <Select value={editFormData.category} onValueChange={(value) => setEditFormData({...editFormData, category: value})}>
                <SelectTrigger>
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

            <div className="space-y-2">
              <Label htmlFor="edit-date">Date</Label>
              <Input
                id="edit-date"
                type="date"
                value={editFormData.date}
                onChange={(e) => setEditFormData({...editFormData, date: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Input
                id="edit-description"
                value={editFormData.description}
                onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
                placeholder="Enter expense description"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-amount">Amount (GBP)</Label>
              <Input
                id="edit-amount"
                type="number"
                step="0.01"
                value={editFormData.amount}
                onChange={(e) => setEditFormData({...editFormData, amount: e.target.value})}
                placeholder="0.00"
              />
            </div>
          </div>
        </ResponsiveDialog>
      </div>
    </TooltipProvider>
  );
}