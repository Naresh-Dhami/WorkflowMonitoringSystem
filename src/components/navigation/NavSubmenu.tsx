
import React from 'react';
import { Link } from "react-router-dom";
import { NavigationMenuContent, NavigationMenuLink } from "@/components/ui/navigation-menu";
import { Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { NavigationItem } from "@/hooks/useNavigation";

interface NavSubmenuProps {
  items: NavigationItem[];
  onItemClick: (path: string, e: React.MouseEvent) => void;
}

const NavSubmenu: React.FC<NavSubmenuProps> = ({ items, onItemClick }) => {
  return (
    <NavigationMenuContent>
      <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
        {items.map((item) => (
          <li key={item.id}>
            {item.path.startsWith('http') ? (
              <a 
                href={item.path}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => onItemClick(item.path, e)}
              >
                <NavigationMenuLink
                  className={cn(
                    "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                  )}
                >
                  <div className="flex items-center text-sm font-medium leading-none">
                    <Settings className="h-4 w-4 mr-2" />
                    <span>{item.title}</span>
                  </div>
                </NavigationMenuLink>
              </a>
            ) : (
              <Link to={item.path}>
                <NavigationMenuLink
                  className={cn(
                    "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                  )}
                >
                  <div className="flex items-center text-sm font-medium leading-none">
                    <Settings className="h-4 w-4 mr-2" />
                    <span>{item.title}</span>
                  </div>
                </NavigationMenuLink>
              </Link>
            )}
          </li>
        ))}
      </ul>
    </NavigationMenuContent>
  );
};

export default NavSubmenu;
