// Enhanced emotion mapping rules based on recipe attributes
export const emotionMappingRules = {
  'Happy': (recipe: any) => ({
    match: recipe.tags?.some((tag: any) => 
      ['dessert', 'chocolate', 'sweet', 'comfort_food', 'party', 'celebration', 'cake', 'cookie'].includes(tag.name)) ||
      recipe.description?.toLowerCase().includes('happy') ||
      recipe.name?.toLowerCase().includes('celebration'),
    score: calculateMatchScore(recipe, ['dessert', 'chocolate', 'sweet', 'comfort_food', 'party', 'celebration', 'cake', 'cookie'])
  }),
    
  'Sad': (recipe: any) => ({
    match: recipe.tags?.some((tag: any) => 
      ['comfort_food', 'soup', 'chocolate', 'warm', 'cozy', 'pasta', 'casserole'].includes(tag.name)) ||
      recipe.cook_time_minutes < 30,
    score: calculateMatchScore(recipe, ['comfort_food', 'soup', 'chocolate', 'warm', 'cozy', 'pasta', 'casserole'])
  }),
    
  'Energetic': (recipe: any) => ({
    match: recipe.tags?.some((tag: any) => 
      ['healthy', 'high_protein', 'breakfast', 'power_bowl', 'smoothie', 'salad', 'fresh'].includes(tag.name)) ||
      recipe.nutrition?.protein > 15,
    score: calculateMatchScore(recipe, ['healthy', 'high_protein', 'breakfast', 'power_bowl', 'smoothie', 'salad', 'fresh'])
  }),
    
  'Calm': (recipe: any) => ({
    match: recipe.tags?.some((tag: any) => 
      ['tea_time', 'soup', 'vegetarian', 'meditation', 'mindful_eating', 'herbs', 'light'].includes(tag.name)) ||
      recipe.cook_time_minutes > 45,
    score: calculateMatchScore(recipe, ['tea_time', 'soup', 'vegetarian', 'meditation', 'mindful_eating', 'herbs', 'light'])
  }),
    
  'Tired': (recipe: any) => ({
    match: recipe.total_time_minutes < 20 ||
      recipe.tags?.some((tag: any) => 
        ['easy', 'quick', 'under_30_minutes', 'simple', '5_ingredients_or_less', 'microwave'].includes(tag.name)),
    score: calculateMatchScore(recipe, ['easy', 'quick', 'under_30_minutes', 'simple', '5_ingredients_or_less', 'microwave'])
  }),

  'Stressed': (recipe: any) => ({
    match: recipe.tags?.some((tag: any) => 
      ['comfort_food', 'easy', 'chocolate', 'baking', 'meditation', 'relaxing'].includes(tag.name)) ||
      recipe.description?.toLowerCase().includes('comfort') ||
      recipe.name?.toLowerCase().includes('comfort'),
    score: calculateMatchScore(recipe, ['comfort_food', 'easy', 'chocolate', 'baking', 'meditation', 'relaxing'])
  })
};

function calculateMatchScore(recipe: any, relevantTags: string[]): number {
  let score = 0;
  
  // Score based on matching tags
  recipe.tags?.forEach((tag: any) => {
    if (relevantTags.includes(tag.name)) score += 2;
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