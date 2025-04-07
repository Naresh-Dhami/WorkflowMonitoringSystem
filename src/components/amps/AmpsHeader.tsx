
import React from "react";

interface AmpsHeaderProps {
  environmentName: string;
}

const AmpsHeader: React.FC<AmpsHeaderProps> = ({ environmentName }) => {
  return (
    <div className="bg-[#ea384c] py-6 mb-6">
      <div className="max-w-6xl mx-auto px-6">
        <h1 className="text-2xl font-bold tracking-tight text-white">Amps Message Viewer</h1>
        <div className="text-sm text-white/80 mt-1">
          Environment: <span className="font-medium">{environmentName}</span>
        </div>
      </div>
    </div>
  );
};

export default AmpsHeader;
