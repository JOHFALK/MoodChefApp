import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./ui/use-toast";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { EmotionSelector } from "./EmotionSelector";
import { IngredientInput } from "./IngredientInput";
import { Loader2 } from "lucide-react";

const recipeSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  cookingTime: z.number().min(1, "Cooking time must be at least 1 minute"),
  instructions: z.string().min(20, "Instructions must be at least 20 characters"),
});

export function RecipeSubmissionForm() {
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof recipeSchema>>({
    resolver: zodResolver(recipeSchema),
    defaultValues: {
      title: "",
      description: "",
      cookingTime: 30,
      instructions: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof recipeSchema>) => {
    if (selectedEmotions.length === 0) {
      toast({
        title: "Emotions required",
        description: "Please select at least one emotion for your recipe",
        variant: "destructive",
      });
      return;
    }

    if (ingredients.length === 0) {
      toast({
        title: "Ingredients required",
        description: "Please add at least one ingredient to your recipe",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const { error } = await supabase.from("recipes").insert({
        title: values.title,
        description: values.description,
        cooking_time: values.cookingTime,
        instructions: values.instructions.split('\n').filter(line => line.trim()),
        emotions: selectedEmotions,
        ingredients,
        user_id: session.user.id,
        status: "pending",
      });

      if (error) throw error;

      toast({
        title: "Recipe submitted!",
        description: "Your recipe has been submitted for review.",
      });

      // Reset form
      form.reset();
      setSelectedEmotions([]);
      setIngredients([]);
    } catch (error) {
      console.error("Error submitting recipe:", error);
      toast({
        title: "Error",
        description: "Failed to submit recipe. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6">Submit a New Recipe</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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

          <div className="space-y-4">
            <FormLabel>Recipe Emotions</FormLabel>
            <EmotionSelector
              selectedEmotions={selectedEmotions}
              onEmotionSelect={(emotion) => {
                if (selectedEmotions.includes(emotion)) {
                  setSelectedEmotions(selectedEmotions.filter((e) => e !== emotion));
                } else if (selectedEmotions.length < 2) {
                  setSelectedEmotions([...selectedEmotions, emotion]);
                }
              }}
            />
          </div>

          <div className="space-y-4">
            <FormLabel>Ingredients</FormLabel>
            <IngredientInput
              ingredients={ingredients}
              onIngredientsChange={setIngredients}
            />
          </div>

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

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Recipe"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}