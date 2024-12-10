import { emotionMappingRules } from './emotionMapping.ts';

export async function processRecipes(recipes: any[], neededRecipes: Map<string, number>) {
  const processedRecipes = [];
  const emotionAssignments = new Map();

  // Sort recipes by their emotion match scores
  recipes.forEach(recipe => {
    const emotionScores = Object.entries(emotionMappingRules).map(([emotion, rule]) => {
      const { match, score } = rule(recipe);
      return { emotion, match, score };
    }).filter(result => result.match)
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
              description: recipe.description || `A delicious ${recipe.name} recipe`,
              ingredients: recipe.sections?.[0]?.components?.map((c: any) => c.raw_text) || [],
              instructions: recipe.instructions?.map((i: any) => i.display_text) || [],
              cooking_time: recipe.total_time_minutes || 30,
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

  return processedRecipes;
}