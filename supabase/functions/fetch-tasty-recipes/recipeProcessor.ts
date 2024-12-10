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
  const maxRecipesPerEmotion = 15; // Set a maximum cap per emotion
  const minRecipesPerEmotion = 10; // Set a minimum threshold per emotion

  // First pass: Calculate emotion matches for all recipes
  const recipeEmotions = recipes.map(recipe => {
    if (!recipe.name || !recipe.sections || !recipe.instructions) {
      return null;
    }

    const emotionScores = Object.entries(emotionMappingRules)
      .map(([emotion, rule]) => {
        const { match, score } = rule(recipe);
        return { emotion, match, score };
      })
      .filter(result => result.match)
      .sort((a, b) => b.score - a.score);

    return { recipe, emotionScores };
  }).filter(Boolean);

  // Second pass: Distribute recipes evenly
  const validEmotions = ['Happy', 'Sad', 'Energetic', 'Calm', 'Tired', 'Anxious', 'Excited', 'Bored', 'Motivated', 'Angry', 'Confident', 'Stressed'];
  
  // Initialize counters for each emotion
  const emotionCounts = new Map(validEmotions.map(emotion => [emotion, 0]));

  // Distribute recipes while maintaining balance
  for (const recipeData of recipeEmotions) {
    if (!recipeData) continue;

    const { recipe, emotionScores } = recipeData;
    
    // Find the emotion with the lowest count that matches this recipe
    const eligibleEmotions = emotionScores
      .filter(({ emotion }) => 
        validEmotions.includes(emotion) && 
        emotionCounts.get(emotion)! < maxRecipesPerEmotion
      )
      .sort((a, b) => 
        (emotionCounts.get(a.emotion) || 0) - (emotionCounts.get(b.emotion) || 0)
      );

    if (eligibleEmotions.length > 0) {
      const selectedEmotion = eligibleEmotions[0].emotion;
      emotionCounts.set(selectedEmotion, (emotionCounts.get(selectedEmotion) || 0) + 1);

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
    }
  }

  // Log distribution statistics
  console.log('Final emotion distribution:');
  for (const [emotion, count] of emotionCounts) {
    console.log(`${emotion}: ${count} recipes`);
  }

  // Verify balance
  const counts = Array.from(emotionCounts.values());
  const maxCount = Math.max(...counts);
  const minCount = Math.min(...counts);
  console.log(`Distribution ratio (max/min): ${maxCount/minCount}`);

  return processedRecipes;
}