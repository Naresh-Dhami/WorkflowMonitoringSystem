
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { NavigationItem } from "@/hooks/useNavigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

const navigationItemSchema = z.object({
  title: z.string().min(1, "Title is required"),
  path: z.string().min(1, "Path is required"),
  icon: z.string().default("Settings"),
  parentId: z.string().optional()
});

type NavigationFormData = z.infer<typeof navigationItemSchema>;

interface NavigationItemFormProps {
  initialData?: NavigationItem;
  onSubmit: (data: NavigationFormData) => void;
  onCancel: () => void;
  mode?: 'create' | 'edit';
}

const NavigationItemForm = ({
  initialData,
  onSubmit,
  onCancel,
  mode = 'create'
}: NavigationItemFormProps) => {
  const form = useForm<NavigationFormData>({
    resolver: zodResolver(navigationItemSchema),
    defaultValues: {
      title: initialData?.title || "",
      path: initialData?.path || "",
      icon: initialData?.icon || "Settings",
      parentId: initialData?.parentId || ""
    }
  });

  const title = mode === 'create' ? 'Add Navigation Item' : 'Edit Navigation Item';

  return (
    <Dialog open={true} onOpenChange={() => onCancel()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Navigation item title" />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="path"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Path</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="/local-path or https://external-url" />
                  </FormControl>
                  <FormDescription>
                    Use full URL for external links or path for local routes
                  </FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="parentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parent ID (Optional)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Leave empty for top level" />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button variant="outline" onClick={onCancel} type="button">
                Cancel
              </Button>
              <Button type="submit">
                {initialData ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default NavigationItemForm;
