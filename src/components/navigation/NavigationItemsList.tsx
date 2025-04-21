
import React from "react";
import { NavigationItem } from "@/hooks/useNavigation";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Settings } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface NavigationItemsListProps {
  items: NavigationItem[];
  onEdit: (item: NavigationItem) => void;
  onDelete: (item: NavigationItem) => void;
}

const NavigationItemsList = ({ items, onEdit, onDelete }: NavigationItemsListProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Path</TableHead>
          <TableHead>Icon</TableHead>
          <TableHead className="w-[100px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.length === 0 ? (
          <TableRow>
            <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
              No navigation items found. Add one to get started.
            </TableCell>
          </TableRow>
        ) : (
          items.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.title}</TableCell>
              <TableCell className="max-w-[150px] truncate" title={item.path}>
                {item.path}
              </TableCell>
              <TableCell>
                <Settings className="h-4 w-4" />
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onEdit(item)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => onDelete(item)}
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

export default NavigationItemsList;
