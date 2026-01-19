import { FilePenLine, Stamp } from 'lucide-react';

export interface NavigationItem {
  label: string;
  active?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface NavigationGroup {
  id: string;
  label: string;
  icon: string;
  active?: boolean;
  subItems: NavigationItem[];
}

export const getNavigationGroups = (svgPaths: any): NavigationGroup[] => [
  {
    id: 'forms',
    label: 'Forms',
    icon: svgPaths.p2973b500,
    active: true,
    subItems: [
      { 
        label: "Entry", 
        active: true,
        icon: FilePenLine
      },
      { 
        label: "Authorization",
        icon: Stamp
      }
    ]
  },
  {
    id: 'admin',
    label: 'Admin',
    icon: svgPaths.p3ad82f80,
    subItems: [
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
    ]
  }
];