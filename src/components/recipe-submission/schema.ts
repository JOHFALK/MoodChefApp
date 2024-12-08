import * as z from "zod";

export const recipeSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  cookingTime: z.number().min(1, "Cooking time must be at least 1 minute"),
  instructions: z.string().min(20, "Instructions must be at least 20 characters"),
});

export type RecipeFormValues = z.infer<typeof recipeSchema>;