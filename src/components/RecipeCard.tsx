import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, ThumbsUp, Lock } from "lucide-react";
import { RecipeInteractionForm } from "./RecipeInteractionForm";
import { Button } from "./ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./ui/use-toast";
import { Link, useNavigate } from "react-router-dom";
import { useSubscription } from "@/hooks/use-subscription";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";

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

    try {
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
    } catch (error) {
      console.error('Error checking vote:', error);
    }
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
        const { error: deleteError } = await supabase
          .from('recipe_votes')
          .delete()
          .eq('recipe_id', recipe.id)
          .eq('user_id', session.user.id);

        if (deleteError) throw deleteError;

        const { error: updateError } = await supabase
          .from('recipes')
          .update({ votes: votes - 1 })
          .eq('id', recipe.id);

        if (updateError) throw updateError;

        setVotes(prev => prev - 1);
        setHasVoted(false);
      } else {
        // Add vote
        const { error: insertError } = await supabase
          .from('recipe_votes')
          .insert({
            recipe_id: recipe.id,
            user_id: session.user.id,
            created_at: new Date().toISOString()
          });

        if (insertError) throw insertError;

        const { error: updateError } = await supabase
          .from('recipes')
          .update({ votes: votes + 1 })
          .eq('id', recipe.id);

        if (updateError) throw updateError;

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
        className={`w-full transition-all hover:shadow-lg relative ${
          recipe.is_premium && !isPremium ? 'cursor-pointer' : ''
        }`}
        onClick={handleRecipeClick}
      >
        <Link to={`/recipe/${recipe.id}`} className={recipe.is_premium && !isPremium ? 'pointer-events-none' : ''}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">{recipe.title}</CardTitle>
              {recipe.is_premium && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  Premium
                </Badge>
              )}
            </div>
            <CardDescription className="flex flex-wrap gap-2">
              {recipe.emotions.map((emotion) => (
                <Badge key={emotion} variant="secondary">
                  {emotion}
                </Badge>
              ))}
            </CardDescription>
          </CardHeader>
          <CardContent className={`space-y-4 ${recipe.is_premium && !isPremium ? 'blur-[2px]' : ''}`}>
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
                onClick={(e) => {
                  e.preventDefault();
                  handleVote();
                }}
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

      <Dialog open={showPremiumDialog} onOpenChange={setShowPremiumDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Premium Recipe</DialogTitle>
            <DialogDescription>
              This delicious recipe is available exclusively to our premium members. Upgrade your account to unlock this and many other premium recipes!
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-4 mt-4">
            <Button variant="outline" onClick={() => setShowPremiumDialog(false)}>
              Maybe Later
            </Button>
            <Button onClick={() => navigate("/pricing")}>
              Upgrade to Premium
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}