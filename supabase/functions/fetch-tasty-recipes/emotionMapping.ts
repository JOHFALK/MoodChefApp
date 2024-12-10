export const emotionMappingRules = {
  'Happy': (recipe) => ({
    match: recipe.tags?.some((tag) =>
      ['dessert', 'sweet', 'celebration', 'cake', 'fruit', 'vibrant', 'chocolate', 'colorful'].includes(tag.name)) ||
      recipe.description?.toLowerCase().includes('joy') ||
      recipe.name?.toLowerCase().includes('celebrate'),
    score: calculateMatchScore(recipe, ['dessert', 'sweet', 'celebration', 'cake', 'fruit', 'vibrant', 'chocolate', 'colorful'])
  }),

  'Angry': (recipe) => ({
    match: recipe.tags?.some((tag) =>
      ['spicy', 'hot', 'fiery', 'intense', 'bold', 'chili', 'pepper'].includes(tag.name)) ||
      recipe.description?.toLowerCase().includes('spicy') ||
      recipe.name?.toLowerCase().includes('hot'),
    score: calculateMatchScore(recipe, ['spicy', 'hot', 'fiery', 'intense', 'bold', 'chili', 'pepper'])
  }),

  'Sad': (recipe) => ({
    match: recipe.tags?.some((tag) =>
      ['comfort_food', 'warm', 'hearty', 'cozy', 'pasta', 'baked', 'cheese', 'soupy'].includes(tag.name)) ||
      recipe.total_time_minutes <= 30,
    score: calculateMatchScore(recipe, ['comfort_food', 'warm', 'hearty', 'cozy', 'pasta', 'baked', 'cheese', 'soupy'])
  }),

  'Energetic': (recipe) => ({
    match: recipe.tags?.some((tag) =>
      ['protein', 'breakfast', 'smoothie', 'power', 'salad', 'refreshing', 'grilled', 'nuts'].includes(tag.name)) ||
      recipe.nutrition?.protein > 15,
    score: calculateMatchScore(recipe, ['protein', 'breakfast', 'smoothie', 'power', 'salad', 'refreshing', 'grilled', 'nuts'])
  }),

  'Calm': (recipe) => ({
    match: recipe.tags?.some((tag) =>
      ['tea', 'herbal', 'soup', 'slow_cooking', 'light', 'vegetarian', 'baked', 'aromatic'].includes(tag.name)) ||
      recipe.cook_time_minutes > 40,
    score: calculateMatchScore(recipe, ['tea', 'herbal', 'soup', 'slow_cooking', 'light', 'vegetarian', 'baked', 'aromatic'])
  }),

  'Tired': (recipe) => ({
    match: recipe.tags?.some((tag) =>
      ['quick', 'easy', 'minimal', 'microwave', 'simple', 'under_30_minutes', '5_ingredients'].includes(tag.name)) ||
      recipe.total_time_minutes <= 20,
    score: calculateMatchScore(recipe, ['quick', 'easy', 'minimal', 'microwave', 'simple', 'under_30_minutes', '5_ingredients'])
  }),

  'Anxious': (recipe) => ({
    match: recipe.tags?.some((tag) =>
      ['comfort_food', 'soothing', 'chocolate', 'baking', 'warming', 'relaxing', 'slow'].includes(tag.name)) ||
      recipe.description?.toLowerCase().includes('relax') ||
      recipe.name?.toLowerCase().includes('calming'),
    score: calculateMatchScore(recipe, ['comfort_food', 'soothing', 'chocolate', 'baking', 'warming', 'relaxing', 'slow'])
  }),

  'Excited': (recipe) => ({
    match: recipe.tags?.some((tag) =>
      ['party', 'finger_food', 'colorful', 'spicy', 'fun', 'cocktails', 'grilled'].includes(tag.name)),
    score: calculateMatchScore(recipe, ['party', 'finger_food', 'colorful', 'spicy', 'fun', 'cocktails', 'grilled'])
  }),

  'Bored': (recipe) => ({
    match: recipe.tags?.some((tag) =>
      ['challenging', 'exotic', 'fusion', 'unique', 'creative', 'experimental'].includes(tag.name)),
    score: calculateMatchScore(recipe, ['challenging', 'exotic', 'fusion', 'unique', 'creative', 'experimental'])
  }),

  'Motivated': (recipe) => ({
    match: recipe.tags?.some((tag) =>
      ['meal_prep', 'healthy', 'high_protein', 'balanced', 'fitness', 'keto', 'paleo'].includes(tag.name)),
    score: calculateMatchScore(recipe, ['meal_prep', 'healthy', 'high_protein', 'balanced', 'fitness', 'keto', 'paleo'])
  }),

  'Confident': (recipe) => ({
    match: recipe.tags?.some((tag) =>
      ['gourmet', 'restaurant_quality', 'impressive', 'date_night', 'plated'].includes(tag.name)),
    score: calculateMatchScore(recipe, ['gourmet', 'restaurant_quality', 'impressive', 'date_night', 'plated'])
  }),

  'Stressed': (recipe) => ({
    match: recipe.tags?.some((tag) =>
      ['comfort_food', 'simple', 'quick', 'no_bake', 'familiar', 'easy'].includes(tag.name)),
    score: calculateMatchScore(recipe, ['comfort_food', 'simple', 'quick', 'no_bake', 'familiar', 'easy'])
  }),
};

function calculateMatchScore(recipe, relevantTags) {
  let score = 0;

  // Score for matching tags
  recipe.tags?.forEach((tag) => {
    if (relevantTags.includes(tag.name)) score += 3;
  });

  // Score based on time
  if (recipe.total_time_minutes) {
    score += recipe.total_time_minutes <= 30 ? 1 : 0;
  }

  // Score based on ingredient count
  const ingredientCount = recipe.sections?.[0]?.components?.length || 0;
  score += ingredientCount <= 8 ? 1 : 0;

  return score;
}
