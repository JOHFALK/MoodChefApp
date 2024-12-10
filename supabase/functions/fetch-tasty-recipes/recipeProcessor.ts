import { emotionMappingRules } from './emotionMapping.ts';

function cleanInstructions(instructions: any[]): string[] {
  return instructions
    .map(instruction => instruction.display_text)
    .filter(text => text && text.trim().length > 0);
}

function cleanIngredients(sections: any[]): string[] {
  return sections
    .flatMap(section => section.components || [])
    .map(component => component.raw_text)
    .filter(text => text && text.trim().length > 0);
}

function generateDescription(recipe: any): string {
  const baseDescription = recipe.description || '';
  const totalTime = recipe.total_time_minutes ? `Ready in ${recipe.total_time_minutes} minutes. ` : '';
  const difficulty = recipe.difficulty_level ? `Difficulty: ${recipe.difficulty_level}. ` : '';
  const cuisine = recipe.cuisine ? `${recipe.cuisine} cuisine. ` : '';

  return `${baseDescription} ${totalTime}${difficulty}${cuisine}`.trim();
}

export async function processRecipes(recipes: any[], neededRecipes: Map<string, number>) {
  const processedRecipes = [];
  const emotionAssignments = new Map();

  // Sort recipes by their emotion match scores
  recipes.forEach(recipe => {
    if (!recipe.name || !recipe.sections || !recipe.instructions) {
      return; // Skip invalid recipes
    }

    const emotionScores = Object.entries(emotionMappingRules)
      .map(([emotion, rule]) => {
        const { match, score } = rule(recipe);
        return { emotion, match, score };
      })
      .filter(result => result.match)
      .sort((a, b) => b.score - a.score);

    if (emotionScores.length > 0) {
      // Assign recipe to emotions that still need more recipes
      for (const { emotion } of emotionScores) {
        if (neededRecipes.get(emotion) > 0) {
          const currentCount = emotionAssignments.get(emotion) || 0;
          if (currentCount < neededRecipes.get(emotion)) {
            emotionAssignments.set(emotion, currentCount + 1);
            
            processedRecipes.push({
              title: recipe.name,
              description: generateDescription(recipe),
              ingredients: cleanIngredients(recipe.sections),
              instructions: cleanInstructions(recipe.instructions),
              cooking_time: recipe.total_time_minutes || recipe.prep_time_minutes || 30,
              emotions: [emotion],
              image_url: recipe.thumbnail_url,
              status: 'approved',
              is_premium: Math.random() < 0.3 // 30% chance of being premium
            });
            
            break; // Assign recipe to only one emotion
          }
        }
      }
    }
  });

  console.log('Processed recipes count:', processedRecipes.length);
  console.log('Emotion assignments:', Object.fromEntries(emotionAssignments));
  return processedRecipes;
}