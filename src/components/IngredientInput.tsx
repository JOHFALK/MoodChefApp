import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";

interface IngredientInputProps {
  ingredients: string[];
  onIngredientsChange: (ingredients: string[]) => void;
}

export function IngredientInput({ ingredients, onIngredientsChange }: IngredientInputProps) {
  const [currentIngredient, setCurrentIngredient] = useState("");

  const addIngredient = () => {
    if (currentIngredient.trim() && !ingredients.includes(currentIngredient.trim())) {
      onIngredientsChange([...ingredients, currentIngredient.trim()]);
      setCurrentIngredient("");
    }
  };

  const removeIngredient = (ingredient: string) => {
    onIngredientsChange(ingredients.filter((i) => i !== ingredient));
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-8">
      <h2 className="text-2xl font-semibold mb-6 text-center">What ingredients do you have?</h2>
      <div className="flex gap-2 mb-4">
        <Input
          type="text"
          value={currentIngredient}
          onChange={(e) => setCurrentIngredient(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && addIngredient()}
          placeholder="Enter an ingredient"
          className="flex-1"
        />
        <Button onClick={addIngredient} variant="outline">
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {ingredients.map((ingredient) => (
          <div
            key={ingredient}
            className="bg-secondary px-3 py-1 rounded-full flex items-center gap-2 animate-fade-in"
          >
            <span className="text-sm">{ingredient}</span>
            <button
              onClick={() => removeIngredient(ingredient)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}