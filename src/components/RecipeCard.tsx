import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Users } from "lucide-react";
import { RecipeInteractionForm } from "./RecipeInteractionForm";
import { Button } from "./ui/button";

interface Recipe {
  id: string;
  title: string;
  description: string;
  cookingTime: number;
  servings: number;
  emotions: string[];
  ingredients: string[];
}

interface RecipeCardProps {
  recipe: Recipe;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  const [showInteractionForm, setShowInteractionForm] = useState(false);

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