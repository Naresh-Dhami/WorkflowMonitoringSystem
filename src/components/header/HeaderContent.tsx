
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useSidebar } from "../ui/sidebar";
import EnvironmentSelector from "../EnvironmentSelector";
import HeaderSettingsMenu from "./HeaderSettingsMenu";

interface HeaderContentProps {
  currentPageTitle: string;
  onNewProcess: () => void;
  onAddNavItem: () => void;
  onManageNavItems: () => void;
  onImportNavigation: () => void;
  onExportNavigation: () => void;
}

const HeaderContent = ({
  currentPageTitle,
  onNewProcess,
  onAddNavItem,
  onManageNavItems,
  onImportNavigation,
  onExportNavigation
}: HeaderContentProps) => {
  const { toggleSidebar } = useSidebar();

  return (
    <div className="max-w-6xl mx-auto flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="text-white hover:bg-white/10 z-[70]"
          aria-label="Toggle sidebar"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="font-medium text-xl tracking-tight text-white">
          {currentPageTitle}
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <EnvironmentSelector />
        
        <HeaderSettingsMenu 
          onNewProcess={onNewProcess}
          onAddNavItem={onAddNavItem}
          onManageNavItems={onManageNavItems}
          onImportNavigation={onImportNavigation}
          onExportNavigation={onExportNavigation}
        />
      </div>
    </div>
  );
};

export default HeaderContent;
