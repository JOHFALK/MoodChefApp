import { emotionMappingRules } from './emotionMapping.ts';

function cleanInstructions(instructions: any[]): string[] {
  if (!Array.isArray(instructions)) return [];
  return instructions
    .map(instruction => instruction.display_text)
    .filter(text => text && text.trim().length > 0);
}

function cleanIngredients(sections: any[]): string[] {
  if (!Array.isArray(sections)) return [];
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
  console.log('Processing recipes:', recipes.length);
  const processedRecipes = [];

  // First pass: Calculate emotion matches for all recipes
  for (const recipe of recipes) {
    if (!recipe.name || !recipe.sections || !recipe.instructions) {
      console.log('Skipping invalid recipe:', recipe.name);
      continue;
    }

    // Log recipe details for debugging
    console.log('Processing recipe:', {
      name: recipe.name,
      tags: recipe.tags?.map(t => t.name),
      hasInstructions: Boolean(recipe.instructions),
      hasSections: Boolean(recipe.sections)
    });

    // Calculate matching emotions
    const emotionScores = Object.entries(emotionMappingRules)
      .map(([emotion, rule]) => {
        const { match, score } = rule(recipe);
        return { emotion, match, score };
      })
      .filter(result => result.match)
      .sort((a, b) => b.score - a.score);

    if (emotionScores.length > 0) {
      const selectedEmotion = emotionScores[0].emotion;
      console.log('Recipe matched emotion:', selectedEmotion, 'for recipe:', recipe.name);

      processedRecipes.push({
        title: recipe.name,
        description: generateDescription(recipe),
        ingredients: cleanIngredients(recipe.sections),
        instructions: cleanInstructions(recipe.instructions),
        cooking_time: recipe.total_time_minutes || recipe.prep_time_minutes || 30,
        emotions: [selectedEmotion],
        image_url: recipe.thumbnail_url,
        status: 'approved',
        is_premium: Math.random() < 0.3 // 30% chance of being premium
      });
    } else {
      console.log('No emotion matches found for recipe:', recipe.name);
    }
  }

  // Log distribution statistics
  const emotionCounts = processedRecipes.reduce((acc, recipe) => {
    recipe.emotions.forEach(emotion => {
      acc[emotion] = (acc[emotion] || 0) + 1;
    });
    return acc;
  }, {});

  console.log('Final emotion distribution:', emotionCounts);

  return processedRecipes;
}