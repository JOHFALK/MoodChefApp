import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { recipeSchema } from "@/components/recipe-submission/schema";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form } from "@/components/ui/form";

interface BattleSubmissionFormProps {
  battleId: string;
  onClose: () => void;
}

export function BattleSubmissionForm({ battleId, onClose }: BattleSubmissionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const form = useForm({
    resolver: zodResolver(recipeSchema),
  });

  const onSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Please log in to submit recipes",
          variant: "destructive",
        });
        return;
      }

      // First create the recipe
      const { data: recipe, error: recipeError } = await supabase
        .from('recipes')
        .insert({
          title: data.title,
          description: data.description,
          cooking_time: data.cookingTime,
          instructions: data.instructions.split('\n'),
          ingredients: [],
          emotions: [],
          user_id: user.id,
        })
        .select()
        .single();

      if (recipeError) throw recipeError;

      // Then create the battle submission
      const { error: submissionError } = await supabase
        .from('battle_submissions')
        .insert({
          battle_id: battleId,
          recipe_id: recipe.id,
          user_id: user.id,
        });

      if (submissionError) throw submissionError;

      toast({
        title: "Recipe submitted successfully!",
        description: "Your recipe has been entered into the battle.",
      });
      onClose();
    } catch (error) {
      console.error("Error submitting recipe:", error);
      toast({
        title: "Error submitting recipe",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Submit Your Recipe</DialogTitle>
          <DialogDescription>
            Enter your recipe details below to join the battle!
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="title">Recipe Title</label>
              <Input
                id="title"
                {...form.register("title")}
                placeholder="Enter your recipe title"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="description">Description</label>
              <Textarea
                id="description"
                {...form.register("description")}
                placeholder="Describe your recipe"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="cookingTime">Cooking Time (minutes)</label>
              <Input
                id="cookingTime"
                type="number"
                {...form.register("cookingTime", { valueAsNumber: true })}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="instructions">Instructions</label>
              <Textarea
                id="instructions"
                {...form.register("instructions")}
                placeholder="Enter your recipe instructions (one per line)"
                rows={5}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Recipe"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}