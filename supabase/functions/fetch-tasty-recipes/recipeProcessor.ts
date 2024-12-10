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
  const emotionCounts = new Map();

  // Initialize emotion counts
  Object.keys(emotionMappingRules).forEach(emotion => {
    emotionCounts.set(emotion, 0);
  });

  // First pass: Calculate emotion matches for all recipes
  const recipesWithScores = recipes
    .filter(recipe => recipe.name && recipe.sections && recipe.instructions)
    .map(recipe => {
      const emotionScores = Object.entries(emotionMappingRules)
        .map(([emotion, rule]) => {
          const { match, score } = rule(recipe);
          return { emotion, match, score };
        })
        .filter(result => result.match)
        .sort((a, b) => b.score - a.score);

      return {
        recipe,
        scores: emotionScores
      };
    })
    .filter(item => item.scores.length > 0);

  console.log('Valid recipes with emotion matches:', recipesWithScores.length);

  // Calculate target count per emotion
  const targetPerEmotion = Math.ceil(recipes.length / Object.keys(emotionMappingRules).length);
  console.log('Target recipes per emotion:', targetPerEmotion);

  // Second pass: Distribute recipes evenly across emotions
  for (const { recipe, scores } of recipesWithScores) {
    // Try each matching emotion in order of score
    let assigned = false;
    for (const { emotion, score } of scores) {
      const currentCount = emotionCounts.get(emotion);
      
      // If this emotion needs more recipes
      if (currentCount < targetPerEmotion) {
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

        emotionCounts.set(emotion, currentCount + 1);
        assigned = true;
        break;
      }
    }

    // If we couldn't assign to preferred emotions, find the emotion with lowest count
    if (!assigned) {
      const [lowestEmotion] = [...emotionCounts.entries()].sort(([,a], [,b]) => a - b)[0];
      processedRecipes.push({
        title: recipe.name,
        description: generateDescription(recipe),
        ingredients: cleanIngredients(recipe.sections),
        instructions: cleanInstructions(recipe.instructions),
        cooking_time: recipe.total_time_minutes || recipe.prep_time_minutes || 30,
        emotions: [lowestEmotion],
        image_url: recipe.thumbnail_url,
        status: 'approved',
        is_premium: Math.random() < 0.3
      });
      emotionCounts.set(lowestEmotion, emotionCounts.get(lowestEmotion) + 1);
    }
  }

  // Log final distribution
  console.log('Final emotion distribution:', Object.fromEntries(emotionCounts));
  console.log('Total processed recipes:', processedRecipes.length);

  return processedRecipes;
}