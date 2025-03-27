
import { useRef } from "react";
import { importConfigFromFile } from "@/utils/configStorage";
import { toast } from "sonner";

interface FileImportHandlerProps {
  onImportSuccess: () => void;
}

const FileImportHandler = ({ onImportSuccess }: FileImportHandlerProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsedConfig = JSON.parse(content);
        
        // Validate imported config
        if (Array.isArray(parsedConfig) && parsedConfig.every(item => 
          item.id && item.name && Array.isArray(item.steps)
        )) {
          // Reset file input
          if (event.target) {
            event.target.value = '';
          }
          
          // Import all processes at once
          const importedProcesses = importConfigFromFile(content);
          toast.success(`Successfully imported ${importedProcesses.length} processes`);
          onImportSuccess();
        } else {
          toast.error("Invalid configuration format");
        }
      } catch (error) {
        toast.error("Failed to parse configuration file");
        console.error(error);
      }
    };
    reader.readAsText(file);
  };
  
  return (
    <>
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept=".json" 
        className="hidden" 
      />
      <button className="hidden" onClick={handleImportClick}>Import</button>
    </>
  );
};

export default FileImportHandler;
