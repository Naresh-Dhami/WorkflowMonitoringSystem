
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { EnvironmentProvider } from "./contexts/EnvironmentContext";
import AmpsViewer from "./pages/AmpsViewer";
import GridGainViewer from "./pages/GridGainViewer";
import TopicDetailsPage from "./pages/TopicDetailsPage";
import AppSidebar from "./components/AppSidebar";
import { SidebarProvider } from "./components/ui/sidebar";
import Header from "./components/Header";

// Custom page component for dynamic navigation
const DynamicPage = ({ url }: { url: string }) => {
  // Decode URL if it's encoded
  const decodedUrl = url.startsWith('http') ? url : decodeURIComponent(url);
  
  return (
    <div className="container mx-auto p-6 pt-24">
      <iframe 
        src={decodedUrl} 
        className="w-full h-[calc(100vh-100px)] border-0 rounded-lg shadow-md"
        title="External content"
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
      />
    </div>
  );
};

const queryClient = new QueryClient();

const App = () => {
  const [navigationRoutes, setNavigationRoutes] = React.useState<{path: string, url: string}[]>([]);

  React.useEffect(() => {
    // Load custom navigation items from localStorage
    try {
      const saved = localStorage.getItem('batchConnector.navigation');
      if (saved) {
        const items = JSON.parse(saved);
        if (Array.isArray(items)) {
          const routes = [];
          
          // Process top-level items
          items.forEach(item => {
            if (item.path) {
              routes.push({
                path: item.path.startsWith('http') ? `/${encodeURIComponent(item.path)}` : item.path,
                url: item.path
              });
            }
            
            // Process children
            if (item.children) {
              item.children.forEach(child => {
                if (child.path) {
                  routes.push({
                    path: child.path.startsWith('http') ? `/${encodeURIComponent(child.path)}` : child.path,
                    url: child.path
                  });
                }
              });
            }
          });
          
          setNavigationRoutes(routes);
        }
      }
    } catch (e) {
      console.error("Error loading navigation routes:", e);
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <EnvironmentProvider>
        <BrowserRouter>
          <TooltipProvider>
            <SidebarProvider defaultOpen={false}>
              <div className="flex w-full min-h-screen">
                <AppSidebar />
                <div className="flex-1 flex flex-col">
                  <Header />
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/amps-viewer" element={<AmpsViewer />} />
                    <Route path="/amps-viewer/topic/:id" element={<TopicDetailsPage />} />
                    <Route path="/grid-gain-viewer" element={<GridGainViewer />} />
                    <Route path="/grid-gain-viewer/topic/:id" element={<TopicDetailsPage />} />
                    
                    {/* Dynamic routes based on user-added navigation */}
                    {navigationRoutes.map((route, index) => (
                      <Route 
                        key={`dynamic-route-${index}`}
                        path={route.path}
                        element={<DynamicPage url={route.url} />}
                      />
                    ))}
                    
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </div>
              </div>
            </SidebarProvider>
            <Toaster />
            <Sonner position="top-right" />
          </TooltipProvider>
        </BrowserRouter>
      </EnvironmentProvider>
    </QueryClientProvider>
  );
};

export default App;
