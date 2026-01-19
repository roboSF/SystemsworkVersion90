import { MoreHorizontal, Edit } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";

interface MobileSplitButtonProps {
  onMainAction: () => void;
  onFormTypeSelect: (formType: string) => void;
  onHistoryItemSelect: (item: string) => void;
  className?: string;
}

const FORM_TYPES = [
  "Expenses (Foreign)",
  "Expenses (Local)",
  "Travel Request",
  "Reimbursement",
  "Purchase Order",
  "Invoice"
];

const HISTORY_ITEMS = [
  "History"
];

export default function MobileSplitButton({ 
  onMainAction, 
  onFormTypeSelect, 
  onHistoryItemSelect,
  className = ""
}: MobileSplitButtonProps) {
  const handleFormTypeClick = (formType: string) => {
    onFormTypeSelect(formType);
  };

  const handleHistoryItemClick = (item: string) => {
    onHistoryItemSelect(item);
  };

  return (
    <div className={`relative w-full ${className}`}>
      {/* Main Button Group - Full Width on Mobile */}
      <div className="flex w-full">
        {/* Main Create Form Button */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-3 rounded-l-[3.2px] border border-primary flex items-center gap-2 transition-colors flex-1 justify-center"
            >
              <Edit className="size-4" />
              <span className="text-sm font-medium">Create Form</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            {FORM_TYPES.map((formType) => (
              <DropdownMenuItem
                key={formType}
                onClick={() => handleFormTypeClick(formType)}
                className="cursor-pointer"
              >
                {formType}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* Separator */}
        <div className="w-px bg-primary/90" />
        
        {/* History/More Button */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-3 py-3 rounded-r-[3.2px] border border-primary border-l-0 flex items-center justify-center transition-colors"
            >
              <MoreHorizontal className="size-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {HISTORY_ITEMS.map((item) => (
              <DropdownMenuItem
                key={item}
                onClick={() => handleHistoryItemClick(item)}
                className="cursor-pointer"
              >
                {item}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}