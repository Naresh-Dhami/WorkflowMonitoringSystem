
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NotFound from "./pages/404";
import AmpsViewer from "./pages/AmpsViewer";
import GridGainViewer from "./pages/GridGainViewer";
import TopicDetailsPage from "./pages/TopicDetailsPage";
import AmpsTopicDetailsPage from "./pages/AmpsTopicDetailsPage";
import { EnvironmentProvider } from "./contexts/EnvironmentContext";
import { Toaster } from "sonner";
import { SidebarProvider } from "./components/ui/sidebar";
import { AppSidebar } from "./components/AppSidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import Header from "./components/Header";

function App() {
  return (
    <EnvironmentProvider>
      <TooltipProvider>
        <SidebarProvider>
          <Router>
            <div className="app-container flex w-full">
              <AppSidebar />
              <div className="flex-1 min-h-screen">
                <Header />
                <Toaster position="top-right" />
                <Routes>
                  <Route path="/" element={<AmpsViewer />} />
                  <Route path="/amps-viewer" element={<AmpsViewer />} />
                  <Route path="/grid-gain-viewer" element={<GridGainViewer />} />
                  <Route path="/topic-details/:topicId" element={<TopicDetailsPage />} />
                  <Route path="/amps-topic/:topicId" element={<AmpsTopicDetailsPage />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
            </div>
          </Router>
        </SidebarProvider>
      </TooltipProvider>
    </EnvironmentProvider>
  );
}

export default App;
