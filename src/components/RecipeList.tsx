import { RecipeCard } from "./RecipeCard";

// Mock data for recipes - in a real app, this would come from an API
const mockRecipes = [
  {
    id: "1",
    title: "Calming Chamomile Pasta",
    description: "A soothing pasta dish with chamomile-infused sauce, perfect for anxiety relief.",
    cookingTime: 30,
    servings: 2,
    emotions: ["Anxious", "Tired"],
    ingredients: ["pasta", "chamomile", "cream", "garlic"],
  },
  {
    id: "2",
    title: "Energizing Berry Smoothie Bowl",
    description: "A vibrant smoothie bowl packed with antioxidants and energy-boosting ingredients.",
    cookingTime: 15,
    servings: 1,
    emotions: ["Happy", "Energetic"],
    ingredients: ["berries", "banana", "yogurt", "honey"],
  },
  {
    id: "3",
    title: "Comfort Mac and Cheese",
    description: "A warm, comforting classic with a mood-lifting twist.",
    cookingTime: 45,
    servings: 4,
    emotions: ["Sad", "Tired"],
    ingredients: ["macaroni", "cheese", "milk", "butter"],
  },
];

interface RecipeListProps {
  selectedEmotions: string[];
  ingredients: string[];
}

export function RecipeList({ selectedEmotions, ingredients }: RecipeListProps) {
  // Filter recipes based on emotions and ingredients
  const filteredRecipes = mockRecipes.filter((recipe) => {
    // Check if the recipe matches at least one selected emotion
    const hasMatchingEmotion = selectedEmotions.length === 0 || 
      recipe.emotions.some((emotion) => selectedEmotions.includes(emotion));

    // Check if the recipe uses at least some of the available ingredients
    const hasMatchingIngredients = ingredients.length === 0 ||
      recipe.ingredients.some((ingredient) => 
        ingredients.some((userIngredient) => 
          ingredient.toLowerCase().includes(userIngredient.toLowerCase())
        )
      );

    return hasMatchingEmotion && hasMatchingIngredients;
  });

  if (filteredRecipes.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          No recipes found matching your mood and ingredients. Try adjusting your selections!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredRecipes.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}
    </div>
  );
}