import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { RecipeInteractionForm } from "./RecipeInteractionForm";
import { Button } from "./ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./ui/use-toast";
import { Link, useNavigate } from "react-router-dom";
import { useSubscription } from "@/hooks/use-subscription";
import { RecipeHeader } from "./recipe/RecipeHeader";
import { RecipeDetails } from "./recipe/RecipeDetails";
import { PremiumDialog } from "./recipe/PremiumDialog";

interface Recipe {
  id: string;
  title: string;
  description: string;
  cookingTime: number;
  servings: number;
  emotions: string[];
  ingredients: string[];
  votes?: number;
  is_premium?: boolean;
}

interface RecipeCardProps {
  recipe: Recipe;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  const [showInteractionForm, setShowInteractionForm] = useState(false);
  const [votes, setVotes] = useState(recipe.votes || 0);
  const [hasVoted, setHasVoted] = useState(false);
  const [showPremiumDialog, setShowPremiumDialog] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { data: subscription } = useSubscription();
  const isPremium = subscription?.isSubscribed ?? false;

  useEffect(() => {
    checkUserVote();
  }, [recipe.id]);

  const checkUserVote = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data, error } = await supabase
      .from('recipe_votes')
      .select('id')
      .eq('recipe_id', recipe.id)
      .eq('user_id', session.user.id)
      .maybeSingle();

    if (error) {
      console.error('Error checking vote:', error);
      return;
    }

    setHasVoted(!!data);
  };

  const handleVote = async (e: React.MouseEvent) => {
    e.preventDefault();
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
        await supabase
          .from('recipe_votes')
          .insert({
            recipe_id: recipe.id,
            user_id: session.user.id,
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

  const handleRecipeClick = (e: React.MouseEvent) => {
    if (recipe.is_premium && !isPremium) {
      e.preventDefault();
      setShowPremiumDialog(true);
    }
  };

  return (
    <>
      <Card 
        className={`h-full flex flex-col transition-all hover:shadow-lg relative ${
          recipe.is_premium && !isPremium ? 'cursor-pointer' : ''
        }`}
        onClick={handleRecipeClick}
      >
        <Link 
          to={`/recipe/${recipe.id}`} 
          className={`h-full flex flex-col ${recipe.is_premium && !isPremium ? 'pointer-events-none' : ''}`}
        >
          <RecipeHeader 
            title={recipe.title}
            emotions={recipe.emotions}
            isPremium={recipe.is_premium || false}
          />
          
          <CardContent className={`flex-1 flex flex-col ${recipe.is_premium && !isPremium ? 'blur-[2px]' : ''}`}>
            <p className="text-muted-foreground line-clamp-3 flex-1">{recipe.description}</p>
            
            <RecipeDetails 
              cookingTime={recipe.cookingTime}
              servings={recipe.servings}
              votes={votes}
              hasVoted={hasVoted}
              onVote={handleVote}
            />
            
            {showInteractionForm ? (
              <RecipeInteractionForm 
                recipeId={recipe.id}
                onSuccess={() => setShowInteractionForm(false)}
              />
            ) : (
              <Button 
                variant="outline" 
                className="w-full mt-4"
                onClick={(e) => {
                  e.preventDefault();
                  setShowInteractionForm(true);
                }}
              >
                I Cooked This!
              </Button>
            )}
          </CardContent>
        </Link>
      </Card>

      <PremiumDialog 
        open={showPremiumDialog}
        onOpenChange={setShowPremiumDialog}
        onUpgrade={() => navigate("/pricing")}
      />
    </>
  );
}