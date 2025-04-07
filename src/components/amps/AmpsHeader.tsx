
import React from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Menu } from "lucide-react";

interface AmpsHeaderProps {
  environmentName: string;
}

const AmpsHeader: React.FC<AmpsHeaderProps> = ({ environmentName }) => {
  return (
    <div className="bg-[#ea384c] py-6 mb-6">
      <div className="max-w-6xl mx-auto px-6 flex items-center">
        <SidebarTrigger className="text-white mr-3 hover:bg-white/10 h-8 w-8" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Amps Message Viewer</h1>
          <div className="text-sm text-white/80 mt-1">
            Environment: <span className="font-medium">{environmentName}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AmpsHeader;
