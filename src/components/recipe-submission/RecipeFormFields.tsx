import { RecipeFormValues } from "./schema";
import { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface RecipeFormFieldsProps {
  form: UseFormReturn<RecipeFormValues>;
}

export function RecipeFormFields({ form }: RecipeFormFieldsProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Recipe Title</FormLabel>
            <FormControl>
              <Input placeholder="Enter recipe title" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Briefly describe your recipe"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="cookingTime"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Cooking Time (minutes)</FormLabel>
            <FormControl>
              <Input
                type="number"
                {...field}
                onChange={(e) => field.onChange(parseInt(e.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="instructions"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Cooking Instructions</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Enter step-by-step instructions (one step per line)"
                className="min-h-[200px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}