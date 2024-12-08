import { RecipeCard } from "./RecipeCard";
import { MindfulPrompt } from "./MindfulPrompt";

// Enhanced mock data with emotion-specific recipes
const mockRecipes = [
  {
    id: "1",
    title: "Calming Chamomile Pasta",
    description: "A soothing pasta dish with chamomile-infused sauce, perfect for anxiety relief.",
    cookingTime: 30,
    servings: 2,
    emotions: ["Anxious", "Tired"],
    ingredients: ["pasta", "chamomile tea", "cream", "garlic", "lavender"],
  },
  {
    id: "2",
    title: "Energizing Berry Smoothie Bowl",
    description: "A vibrant smoothie bowl packed with antioxidants and energy-boosting ingredients.",
    cookingTime: 15,
    servings: 1,
    emotions: ["Happy", "Energetic"],
    ingredients: ["berries", "banana", "yogurt", "honey", "chia seeds"],
  },
  {
    id: "3",
    title: "Comfort Mac and Cheese",
    description: "A warm, comforting classic with mood-lifting spices.",
    cookingTime: 45,
    servings: 4,
    emotions: ["Sad", "Stressed"],
    ingredients: ["macaroni", "cheese", "milk", "nutmeg", "black pepper"],
  },
  {
    id: "4",
    title: "Mindful Mediterranean Bowl",
    description: "A balanced bowl of goodness to promote focus and calm.",
    cookingTime: 25,
    servings: 2,
    emotions: ["Calm", "Confident"],
    ingredients: ["quinoa", "chickpeas", "olive oil", "vegetables", "herbs"],
  },
  {
    id: "5",
    title: "Spicy Satisfaction Stir-Fry",
    description: "A quick and engaging dish perfect for channeling energy.",
    cookingTime: 20,
    servings: 2,
    emotions: ["Angry", "Bored"],
    ingredients: ["rice", "vegetables", "tofu", "chili", "ginger"],
  },
  {
    id: "6",
    title: "Achievement Avocado Toast",
    description: "A nutrient-rich, brain-boosting breakfast to fuel your goals.",
    cookingTime: 10,
    servings: 1,
    emotions: ["Motivated", "Excited"],
    ingredients: ["bread", "avocado", "eggs", "seeds", "microgreens"],
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

  if (selectedEmotions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          Select your current mood to discover perfectly matched recipes.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <MindfulPrompt emotions={selectedEmotions} />
      
      {filteredRecipes.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            No recipes found matching your mood and ingredients. Try adjusting your selections!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  );
}