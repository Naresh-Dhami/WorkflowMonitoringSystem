
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Index from "./pages/Index"; // Fixed casing to match actual file
import NotFound from "./pages/404";
import AmpsViewer from "./pages/AmpsViewer";
import GridGainViewer from "./pages/GridGainViewer";
import TopicDetailsPage from "./pages/TopicDetailsPage";
import AmpsTopicDetailsPage from "./pages/AmpsTopicDetailsPage";
import { EnvironmentProvider } from "./contexts/EnvironmentContext";
import { Toaster } from "sonner";

function App() {
  return (
    <EnvironmentProvider>
      <Router>
        <div className="app-container">
          <Toaster position="top-right" />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/amps-viewer" element={<AmpsViewer />} />
            <Route path="/grid-gain-viewer" element={<GridGainViewer />} />
            <Route path="/topic-details/:topicId" element={<TopicDetailsPage />} />
            <Route path="/amps-topic/:topicId" element={<AmpsTopicDetailsPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
    </EnvironmentProvider>
  );
}

export default App;
