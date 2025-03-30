
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
import { Menu, ExternalLink } from "lucide-react";
import { Button } from "./ui/button";
import { useSidebar } from "./ui/sidebar";
import { useEffect, useState } from "react";
import * as LucideIcons from "lucide-react";

// Define types for navigation items
interface NavigationItem {
  id: string;
  title: string;
  path: string;
  icon: string;
  parentId?: string;
  children?: NavigationItem[];
}

const NavigationMenuComponent = () => {
  const location = useLocation();
  const [customNavItems, setCustomNavItems] = useState<NavigationItem[]>([]);
  
  useEffect(() => {
    // Load custom navigation items from localStorage
    try {
      const saved = localStorage.getItem('batchConnector.navigation');
      if (saved) {
        const items = JSON.parse(saved);
        if (Array.isArray(items)) {
          setCustomNavItems(items.filter(item => !item.parentId)); // Only top-level items
        }
      }
    } catch (e) {
      console.error("Error loading navigation items:", e);
    }
  }, []);
  
  const isActive = (path: string) => location.pathname === path;

  // Dynamic icon component
  const DynamicIcon = ({ iconName }: { iconName: string }) => {
    const IconComponent = (LucideIcons as any)[iconName] || ExternalLink;
    return <IconComponent className="h-4 w-4 mr-1" />;
  };

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
          
          {/* Custom navigation items */}
          {customNavItems.map((item) => (
            <NavigationMenuItem key={item.id}>
              {item.children && item.children.length > 0 ? (
                <>
                  <NavigationMenuTrigger>
                    <div className="flex items-center">
                      <DynamicIcon iconName={item.icon} />
                      <span>{item.title}</span>
                    </div>
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      {item.children.map((child) => (
                        <li key={child.id}>
                          <Link 
                            to={child.path.startsWith('http') ? 
                              `/${child.path.replace(/^https?:\/\//, '')}` : 
                              child.path}
                          >
                            <NavigationMenuLink
                              className={cn(
                                "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                              )}
                            >
                              <div className="flex items-center text-sm font-medium leading-none">
                                <DynamicIcon iconName={child.icon || "ExternalLink"} />
                                <span>{child.title}</span>
                              </div>
                            </NavigationMenuLink>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </>
              ) : (
                <Link 
                  to={item.path.startsWith('http') ? 
                    `/${item.path.replace(/^https?:\/\//, '')}` : 
                    item.path}
                >
                  <NavigationMenuLink 
                    className={cn(
                      "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:bg-accent focus:text-accent-foreground disabled:opacity-50 disabled:pointer-events-none bg-background hover:bg-accent hover:text-accent-foreground h-10 py-2 px-4 group w-max",
                      isActive(item.path) && "bg-accent text-accent-foreground"
                    )}
                  >
                    <div className="flex items-center">
                      <DynamicIcon iconName={item.icon} />
                      <span>{item.title}</span>
                    </div>
                  </NavigationMenuLink>
                </Link>
              )}
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
};

// Mobile navigation menu
export const MobileNav = () => {
  const { toggleSidebar } = useSidebar();

  return (
    <div className="md:hidden">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={toggleSidebar}
        className="text-white"
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle menu</span>
      </Button>
    </div>
  );
};

export default NavigationMenuComponent;
