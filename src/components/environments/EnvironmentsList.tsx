
import React from "react";
import { Environment } from "@/contexts/EnvironmentContext";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface EnvironmentsListProps {
  environments: Environment[];
  onEdit: (env: Environment) => void;
  onDelete: (env: Environment) => void;
}

const EnvironmentsList = ({ environments, onEdit, onDelete }: EnvironmentsListProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Base URL</TableHead>
          <TableHead>GridGain URL</TableHead>
          <TableHead>AMPS URL</TableHead>
          <TableHead>Description</TableHead>
          <TableHead className="w-[100px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {environments.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
              No environments found. Add one to get started.
            </TableCell>
          </TableRow>
        ) : (
          environments.map((env) => (
            <TableRow key={env.id}>
              <TableCell className="font-medium">{env.name}</TableCell>
              <TableCell className="max-w-[150px] truncate" title={env.baseUrl}>
                {env.baseUrl}
              </TableCell>
              <TableCell className="max-w-[150px] truncate" title={env.gridGainUrl}>
                {env.gridGainUrl || "-"}
              </TableCell>
              <TableCell className="max-w-[150px] truncate" title={env.ampsUrl}>
                {env.ampsUrl || "-"}
              </TableCell>
              <TableCell className="max-w-[200px] truncate" title={env.description}>
                {env.description}
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onEdit(env)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => onDelete(env)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default EnvironmentsList;
