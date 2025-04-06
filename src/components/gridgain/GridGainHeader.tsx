
import React from "react";

interface GridGainHeaderProps {
  environmentName: string;
}

const GridGainHeader: React.FC<GridGainHeaderProps> = ({ environmentName }) => {
  return (
    <div className="bg-[#ea384c] py-6 mb-6">
      <div className="max-w-6xl mx-auto px-6">
        <h1 className="text-2xl font-bold tracking-tight text-white">Grid Gain Message Viewer</h1>
        <div className="text-sm text-white/80 mt-1">
          Environment: <span className="font-medium">{environmentName}</span>
        </div>
      </div>
    </div>
  );
};

export default GridGainHeader;
