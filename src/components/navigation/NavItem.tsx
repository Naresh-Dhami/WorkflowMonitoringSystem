
import React from 'react';
import { Link } from "react-router-dom";
import { NavigationMenuLink } from "@/components/ui/navigation-menu";
import { Settings } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItemProps {
  path: string;
  title: string;
  isActive: boolean;
  isExternal?: boolean;
  icon?: string;
  onClick?: (path: string, e: React.MouseEvent) => void;
}

const NavItem: React.FC<NavItemProps> = ({ path, title, isActive, isExternal, icon, onClick }) => {
  const commonClasses = cn(
    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:bg-accent focus:text-accent-foreground disabled:opacity-50 disabled:pointer-events-none bg-background hover:bg-accent hover:text-accent-foreground h-10 py-2 px-4 group w-max",
    isActive && "bg-accent text-accent-foreground"
  );

  if (isExternal) {
    return (
      <a 
        href={path}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => onClick?.(path, e)}
      >
        <NavigationMenuLink className={commonClasses}>
          <div className="flex items-center">
            <Settings className="h-4 w-4 mr-2" />
            <span>{title}</span>
          </div>
        </NavigationMenuLink>
      </a>
    );
  }

  return (
    <Link to={path}>
      <NavigationMenuLink className={commonClasses}>
        <div className="flex items-center">
          <Settings className="h-4 w-4 mr-2" />
          <span>{title}</span>
        </div>
      </NavigationMenuLink>
    </Link>
  );
};

export default NavItem;
