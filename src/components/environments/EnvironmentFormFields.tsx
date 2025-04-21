
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface EnvironmentFormFieldsProps {
  name: string;
  setName: (value: string) => void;
  baseUrl: string;
  setBaseUrl: (value: string) => void;
  descriptionText: string;
  setDescriptionText: (value: string) => void;
  gridGainUrl: string;
  setGridGainUrl: (value: string) => void;
  ampsUrl: string;
  setAmpsUrl: (value: string) => void;
}

const EnvironmentFormFields = ({
  name,
  setName,
  baseUrl,
  setBaseUrl,
  descriptionText,
  setDescriptionText,
  gridGainUrl,
  setGridGainUrl,
  ampsUrl,
  setAmpsUrl,
}: EnvironmentFormFieldsProps) => {
  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="env-name" className="text-right">
          Name
        </Label>
        <Input
          id="env-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="col-span-3"
          placeholder="Production"
          autoFocus
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="env-url" className="text-right">
          Base URL
        </Label>
        <Input
          id="env-url"
          value={baseUrl}
          onChange={(e) => setBaseUrl(e.target.value)}
          className="col-span-3"
          placeholder="https://api.example.com"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="gridgain-url" className="text-right">
          GridGain URL
        </Label>
        <Input
          id="gridgain-url"
          value={gridGainUrl}
          onChange={(e) => setGridGainUrl(e.target.value)}
          className="col-span-3"
          placeholder="http://localhost:8095/api/gridgain"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="amps-url" className="text-right">
          AMPS URL
        </Label>
        <Input
          id="amps-url"
          value={ampsUrl}
          onChange={(e) => setAmpsUrl(e.target.value)}
          className="col-span-3"
          placeholder="http://localhost:8095/api/amps"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="env-description" className="text-right">
          Description
        </Label>
        <Input
          id="env-description"
          value={descriptionText}
          onChange={(e) => setDescriptionText(e.target.value)}
          className="col-span-3"
          placeholder="Production environment"
        />
      </div>
    </div>
  );
};

export default EnvironmentFormFields;
