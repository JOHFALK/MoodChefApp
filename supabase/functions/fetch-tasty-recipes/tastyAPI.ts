const endpoints = [
  'tags=under_30_minutes',
  'tags=dinner',
  'tags=healthy',
  'tags=comfort_food',
  'tags=desserts',
  'tags=vegetarian',
  'tags=breakfast',
  'tags=lunch',
  'tags=snacks',
  'tags=easy',
  'tags=baking',
  'tags=chocolate',
  'tags=pasta',
  'tags=soup',
  'tags=salad'
];

export async function fetchRecipesFromAPI(apiKey: string): Promise<any[]> {
  let allRecipes = [];
  const fetchPromises = endpoints.map(async (endpoint) => {
    try {
      const response = await fetch(
        `https://tasty.p.rapidapi.com/recipes/list?from=0&size=40&${endpoint}`,
        {
          headers: {
            'x-rapidapi-host': 'tasty.p.rapidapi.com',
            'x-rapidapi-key': apiKey,
          },
        }
      );

      if (!response.ok) {
        console.error(`Tasty API error for ${endpoint}:`, response.statusText);
        return [];
      }

      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.error(`Error fetching recipes for ${endpoint}:`, error);
      return [];
    }
  });

  const results = await Promise.all(fetchPromises);
  allRecipes = results.flat();

  // Remove duplicates based on recipe name
  return Array.from(new Map(allRecipes.map(recipe => [recipe.name, recipe])).values());
}