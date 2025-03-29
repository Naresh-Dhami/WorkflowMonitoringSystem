
import { Link, useLocation } from "react-router-dom";
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { useSidebar } from "./ui/sidebar";

const NavigationMenuComponent = () => {
  const location = useLocation();
  const { toggleSidebar } = useSidebar();
  
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="hidden md:block">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link to="/">
              <NavigationMenuLink 
                className={cn(
                  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:bg-accent focus:text-accent-foreground disabled:opacity-50 disabled:pointer-events-none bg-background hover:bg-accent hover:text-accent-foreground h-10 py-2 px-4 group w-max",
                  isActive("/") && "bg-accent text-accent-foreground"
                )}
              >
                Batch Dashboard
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link to="/amps-viewer">
              <NavigationMenuLink 
                className={cn(
                  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:bg-accent focus:text-accent-foreground disabled:opacity-50 disabled:pointer-events-none bg-background hover:bg-accent hover:text-accent-foreground h-10 py-2 px-4 group w-max",
                  isActive("/amps-viewer") && "bg-accent text-accent-foreground"
                )}
              >
                Amps Viewer
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link to="/grid-gain-viewer">
              <NavigationMenuLink 
                className={cn(
                  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:bg-accent focus:text-accent-foreground disabled:opacity-50 disabled:pointer-events-none bg-background hover:bg-accent hover:text-accent-foreground h-10 py-2 px-4 group w-max",
                  isActive("/grid-gain-viewer") && "bg-accent text-accent-foreground"
                )}
              >
                Grid Gain Viewer
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
};

// Mobile navigation menu
export const MobileNav = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { toggleSidebar } = useSidebar();

  return (
    <div className="md:hidden">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={toggleSidebar}
        className="text-white"
      >
        <Menu />
        <span className="sr-only">Toggle menu</span>
      </Button>
    </div>
  );
};

export default NavigationMenuComponent;
