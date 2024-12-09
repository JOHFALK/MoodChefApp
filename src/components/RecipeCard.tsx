import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, ThumbsUp } from "lucide-react";
import { RecipeInteractionForm } from "./RecipeInteractionForm";
import { Button } from "./ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./ui/use-toast";

interface Recipe {
  id: string;
  title: string;
  description: string;
  cookingTime: number;
  servings: number;
  emotions: string[];
  ingredients: string[];
  votes?: number;
}

interface RecipeCardProps {
  recipe: Recipe;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  const [showInteractionForm, setShowInteractionForm] = useState(false);
  const [votes, setVotes] = useState(recipe.votes || 0);
  const [hasVoted, setHasVoted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkUserVote();
  }, [recipe.id]);

  const checkUserVote = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data } = await supabase
      .from('recipe_votes')
      .select('id')
      .eq('recipe_id', recipe.id)
      .eq('user_id', session.user.id)
      .single();

    setHasVoted(!!data);
  };

  const handleVote = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast({
        title: "Please log in to vote",
        variant: "destructive",
      });
      return;
    }

    try {
      if (hasVoted) {
        // Remove vote
        await supabase
          .from('recipe_votes')
          .delete()
          .eq('recipe_id', recipe.id)
          .eq('user_id', session.user.id);

        await supabase
          .from('recipes')
          .update({ votes: votes - 1 })
          .eq('id', recipe.id);

        setVotes(prev => prev - 1);
        setHasVoted(false);
      } else {
        // Add vote
        await supabase
          .from('recipe_votes')
          .insert({
            recipe_id: recipe.id,
            user_id: session.user.id,
            created_at: new Date().toISOString()
          });

        await supabase
          .from('recipes')
          .update({ votes: votes + 1 })
          .eq('id', recipe.id);

        setVotes(prev => prev + 1);
        setHasVoted(true);
      }

      toast({
        title: hasVoted ? "Vote removed" : "Vote added",
        description: hasVoted ? "Your vote has been removed" : "Thanks for voting!",
      });
    } catch (error) {
      console.error('Error voting:', error);
      toast({
        title: "Error voting",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full transition-all hover:shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl">{recipe.title}</CardTitle>
        <CardDescription className="flex flex-wrap gap-2">
          {recipe.emotions.map((emotion) => (
            <Badge key={emotion} variant="secondary">
              {emotion}
            </Badge>
          ))}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">{recipe.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{recipe.cookingTime} mins</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{recipe.servings} servings</span>
            </div>
          </div>
          <Button
            variant={hasVoted ? "secondary" : "outline"}
            size="sm"
            onClick={handleVote}
            className="flex items-center gap-2"
          >
            <ThumbsUp className={`w-4 h-4 ${hasVoted ? "fill-current" : ""}`} />
            <span>{votes}</span>
          </Button>
        </div>
        
        {showInteractionForm ? (
          <RecipeInteractionForm 
            recipeId={recipe.id}
            onSuccess={() => setShowInteractionForm(false)}
          />
        ) : (
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => setShowInteractionForm(true)}
          >
            I Cooked This!
          </Button>
        )}
      </CardContent>
    </Card>
  );
}