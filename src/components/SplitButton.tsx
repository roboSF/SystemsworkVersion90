import { MoreHorizontal, Edit } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";

interface SplitButtonProps {
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

export default function SplitButton({ 
  onMainAction, 
  onFormTypeSelect, 
  onHistoryItemSelect,
  className = ""
}: SplitButtonProps) {
  const handleFormTypeClick = (formType: string) => {
    onFormTypeSelect(formType);
  };

  const handleHistoryItemClick = (item: string) => {
    onHistoryItemSelect(item);
  };

  return (
    <div className={`relative inline-flex ${className}`}>
      {/* Main Create Form Button */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="bg-primary cursor-pointer hover:bg-primary/90 text-primary-foreground px-3 py-1.5 rounded-[3.2px] border border-primary flex items-center gap-2 transition-colors"
          >
            <Edit className="size-4" />
            <span className="text-sm">Create Form</span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
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
    </div>
  );
}