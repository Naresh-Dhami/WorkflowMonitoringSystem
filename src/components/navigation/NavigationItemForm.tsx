
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

const navigationItemSchema = z.object({
  title: z.string().min(1, "Title is required"),
  path: z.string().min(1, "Path is required"),
  icon: z.string().default("ExternalLink"),
  parentId: z.string().optional()
});

type NavigationFormData = z.infer<typeof navigationItemSchema>;

interface NavigationItemFormProps {
  initialData?: NavigationItem;
  onSubmit: (data: NavigationFormData) => void;
  onCancel: () => void;
}

const NavigationItemForm = ({
  initialData,
  onSubmit,
  onCancel
}: NavigationItemFormProps) => {
  const form = useForm<NavigationFormData>({
    resolver: zodResolver(navigationItemSchema),
    defaultValues: {
      title: initialData?.title || "",
      path: initialData?.path || "",
      icon: initialData?.icon || "ExternalLink",
      parentId: initialData?.parentId || ""
    }
  });

  return (
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
          name="icon"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Icon</FormLabel>
              <FormControl>
                <Input {...field} placeholder="ExternalLink" />
              </FormControl>
              <FormDescription>
                Use Lucide icon names (defaults to ExternalLink)
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

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onCancel} type="button">
            Cancel
          </Button>
          <Button type="submit">
            {initialData ? "Update" : "Create"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default NavigationItemForm;
