
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

const NavigationMenuComponent = () => {
  const location = useLocation();
  
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

  return (
    <div className="md:hidden">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => setOpen(!open)}
        className="text-white"
      >
        <Menu />
        <span className="sr-only">Toggle menu</span>
      </Button>
      
      {open && (
        <div className="absolute top-16 left-0 right-0 z-50 bg-white border-b shadow-lg">
          <div className="flex flex-col p-4 space-y-2">
            <Link 
              to="/" 
              className={cn(
                "px-4 py-2 rounded-md", 
                location.pathname === "/" ? "bg-accent text-accent-foreground" : "hover:bg-accent/50"
              )}
              onClick={() => setOpen(false)}
            >
              Batch Dashboard
            </Link>
            <Link 
              to="/amps-viewer" 
              className={cn(
                "px-4 py-2 rounded-md", 
                location.pathname === "/amps-viewer" ? "bg-accent text-accent-foreground" : "hover:bg-accent/50"
              )}
              onClick={() => setOpen(false)}
            >
              Amps Viewer
            </Link>
            <Link 
              to="/grid-gain-viewer" 
              className={cn(
                "px-4 py-2 rounded-md", 
                location.pathname === "/grid-gain-viewer" ? "bg-accent text-accent-foreground" : "hover:bg-accent/50"
              )}
              onClick={() => setOpen(false)}
            >
              Grid Gain Viewer
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavigationMenuComponent;
