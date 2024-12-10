// Enhanced emotion mapping rules based on recipe attributes
export const emotionMappingRules = {
  'Happy': (recipe: any) => ({
    match: recipe.tags?.some((tag: string) => 
      ['dessert', 'chocolate', 'sweet', 'comfort_food', 'party', 'celebration'].includes(tag)) ||
      recipe.description?.toLowerCase().includes('happy') ||
      recipe.name?.toLowerCase().includes('celebration'),
    score: calculateMatchScore(recipe, ['dessert', 'chocolate', 'sweet', 'comfort_food', 'party', 'celebration'])
  }),
    
  'Sad': (recipe: any) => ({
    match: recipe.tags?.some((tag: string) => 
      ['comfort_food', 'soup', 'chocolate', 'warm', 'cozy'].includes(tag)) ||
      recipe.cook_time_minutes < 30,
    score: calculateMatchScore(recipe, ['comfort_food', 'soup', 'chocolate', 'warm', 'cozy'])
  }),
    
  'Energetic': (recipe: any) => ({
    match: recipe.tags?.some((tag: string) => 
      ['healthy', 'high_protein', 'breakfast', 'power_bowl', 'smoothie'].includes(tag)) ||
      recipe.nutrition?.protein > 15,
    score: calculateMatchScore(recipe, ['healthy', 'high_protein', 'breakfast', 'power_bowl', 'smoothie'])
  }),
    
  'Calm': (recipe: any) => ({
    match: recipe.tags?.some((tag: string) => 
      ['tea_time', 'soup', 'vegetarian', 'meditation', 'mindful_eating'].includes(tag)) ||
      recipe.cook_time_minutes > 45,
    score: calculateMatchScore(recipe, ['tea_time', 'soup', 'vegetarian', 'meditation', 'mindful_eating'])
  }),
    
  'Tired': (recipe: any) => ({
    match: recipe.total_time_minutes < 20 ||
      recipe.tags?.some((tag: string) => 
        ['easy', 'quick', 'under_30_minutes', 'simple', '5_ingredients_or_less'].includes(tag)),
    score: calculateMatchScore(recipe, ['easy', 'quick', 'under_30_minutes', 'simple', '5_ingredients_or_less'])
  })
};

function calculateMatchScore(recipe: any, relevantTags: string[]): number {
  let score = 0;
  
  // Score based on matching tags
  recipe.tags?.forEach((tag: string) => {
    if (relevantTags.includes(tag)) score += 2;
  });
  
  // Score based on recipe complexity
  if (recipe.total_time_minutes) {
    score += recipe.total_time_minutes <= 30 ? 1 : 0;
  }
  
  // Score based on ingredients count
  const ingredientsCount = recipe.sections?.[0]?.components?.length || 0;
  score += ingredientsCount <= 8 ? 1 : 0;
  
  return score;
}