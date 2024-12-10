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
      ['tea_time', 'soup', 'vegetarian', 'herbs', 'light'].includes(tag.name)) ||
      recipe.cook_time_minutes > 45,
    score: calculateMatchScore(recipe, ['tea_time', 'soup', 'vegetarian', 'herbs', 'light'])
  }),
    
  'Tired': (recipe: any) => ({
    match: recipe.total_time_minutes < 20 ||
      recipe.tags?.some((tag: any) => 
        ['easy', 'quick', 'under_30_minutes', 'simple', '5_ingredients_or_less', 'microwave'].includes(tag.name)),
    score: calculateMatchScore(recipe, ['easy', 'quick', 'under_30_minutes', 'simple', '5_ingredients_or_less', 'microwave'])
  }),

  'Anxious': (recipe: any) => ({
    match: recipe.tags?.some((tag: any) => 
      ['comfort_food', 'easy', 'chocolate', 'baking', 'relaxing'].includes(tag.name)) ||
      recipe.description?.toLowerCase().includes('comfort') ||
      recipe.name?.toLowerCase().includes('comfort'),
    score: calculateMatchScore(recipe, ['comfort_food', 'easy', 'chocolate', 'baking', 'relaxing'])
  }),

  'Excited': (recipe: any) => ({
    match: recipe.tags?.some((tag: any) => 
      ['party', 'celebration', 'appetizer', 'finger_food', 'fun'].includes(tag.name)),
    score: calculateMatchScore(recipe, ['party', 'celebration', 'appetizer', 'finger_food', 'fun'])
  }),

  'Bored': (recipe: any) => ({
    match: recipe.tags?.some((tag: any) => 
      ['challenging', 'advanced', 'unique', 'exotic', 'fusion'].includes(tag.name)),
    score: calculateMatchScore(recipe, ['challenging', 'advanced', 'unique', 'exotic', 'fusion'])
  }),

  'Motivated': (recipe: any) => ({
    match: recipe.tags?.some((tag: any) => 
      ['meal_prep', 'healthy', 'high_protein', 'keto', 'paleo'].includes(tag.name)),
    score: calculateMatchScore(recipe, ['meal_prep', 'healthy', 'high_protein', 'keto', 'paleo'])
  }),

  'Confident': (recipe: any) => ({
    match: recipe.tags?.some((tag: any) => 
      ['gourmet', 'advanced', 'impressive', 'date_night'].includes(tag.name)),
    score: calculateMatchScore(recipe, ['gourmet', 'advanced', 'impressive', 'date_night'])
  }),

  'Stressed': (recipe: any) => ({
    match: recipe.tags?.some((tag: any) => 
      ['comfort_food', 'easy', 'quick', 'simple', 'no_bake'].includes(tag.name)),
    score: calculateMatchScore(recipe, ['comfort_food', 'easy', 'quick', 'simple', 'no_bake'])
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