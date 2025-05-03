
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { callApi } from "@/utils/api/apiUtils";

interface GridGainRecordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  topic: string;
}

// Updated schema to make most fields optional
const formSchema = z.object({
  typeId: z.string().optional(),
  typeName: z.string().optional(),
  typePfx: z.string().optional(),
  typeRunDate: z.string().optional(),
  topic: z.string().min(1, "Topic is required"),
});

type FormValues = z.infer<typeof formSchema>;

const GridGainRecordDialog: React.FC<GridGainRecordDialogProps> = ({
  open,
  onOpenChange,
  topic,
}) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      typeId: "",
      typeName: "",
      typePfx: "",
      typeRunDate: "",
      topic: topic || "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      // Call the API with the form data
      await callApi(
        "http://localhost:8095/api/gridgain/dcrecord",
        "POST",
        data,
        "Record submitted successfully"
      );
      
      // Close the dialog
      onOpenChange(false);
      
      // Reset the form
      form.reset();
    } catch (error) {
      console.error("Error submitting record:", error);
      toast.error("Failed to submit record");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Grid Gain Record</DialogTitle>
          <DialogDescription>
            Enter the details for the new Grid Gain record.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="typeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type ID (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter type ID" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="typeName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type Name (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter type name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="typePfx"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type Prefix (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter type prefix" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="typeRunDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type Run Date (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="YYYYMMDD" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Topic</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter topic" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="submit">Submit Record</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default GridGainRecordDialog;
