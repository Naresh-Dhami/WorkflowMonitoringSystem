
import { Button } from "@/components/ui/button";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigation } from "@/hooks/useNavigation";
import { toast } from "sonner";
import HeaderContent from "./header/HeaderContent";
import NavigationManager from "./header/NavigationManager";
import { usePageTitle } from "@/hooks/usePageTitle";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const [showNavDialog, setShowNavDialog] = useState(false);
  const [showNavManager, setShowNavManager] = useState(false);
  const { currentPageTitle } = usePageTitle();
  
  // Add scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle process creation by redirecting to main dashboard with dialog open
  const handleNewProcess = () => {
    // If we're not on the dashboard, navigate to it
    if (location.pathname !== '/') {
      window.location.href = '/?newProcess=true';
    } else {
      // Dispatch a custom event that Index.tsx can listen for
      const event = new CustomEvent('open-process-modal');
      window.dispatchEvent(event);
    }
    toast.info("Opening process creation dialog...");
  };

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4 
          ${isScrolled 
            ? "bg-[#ea384c]/95 backdrop-blur-md shadow-sm" 
            : "bg-[#ea384c] border-b-4 border-[#FEF7CD]"
          }`}
      >
        <HeaderContent 
          currentPageTitle={currentPageTitle}
          onNewProcess={handleNewProcess}
          onAddNavItem={() => setShowNavDialog(true)}
          onManageNavItems={() => setShowNavManager(true)}
          onImportNavigation={() => {
            const { importNavigationItems } = useNavigation();
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';
            input.onchange = (e: Event) => {
              const target = e.target as HTMLInputElement;
              if (!target.files?.length) return;
              
              const file = target.files[0];
              const reader = new FileReader();
              
              reader.onload = (event) => {
                try {
                  const content = event.target?.result as string;
                  const items = JSON.parse(content);
                  importNavigationItems(items);
                  toast.success('Navigation imported successfully');
                  
                  // Force reload to update routes
                  window.location.reload();
                } catch (error) {
                  console.error('Failed to import navigation:', error);
                  toast.error('Failed to import navigation');
                }
              };
              
              reader.readAsText(file);
            };
            input.click();
          }}
          onExportNavigation={() => {
            const { exportNavigationItems } = useNavigation();
            const items = exportNavigationItems();
            const dataStr = JSON.stringify(items, null, 2);
            const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
            
            const exportFileDefaultName = 'navigation.json';
            const linkElement = document.createElement('a');
            linkElement.setAttribute('href', dataUri);
            linkElement.setAttribute('download', exportFileDefaultName);
            linkElement.click();
            
            toast.success('Navigation exported successfully');
          }}
        />
      </header>

      <NavigationManager 
        showNavDialog={showNavDialog}
        setShowNavDialog={setShowNavDialog}
        showNavManager={showNavManager}
        setShowNavManager={setShowNavManager}
      />
    </>
  );
};

export default Header;
