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
  'tags=easy'
];

export async function fetchRecipesFromAPI(apiKey: string): Promise<any[]> {
  let allRecipes = [];
  
  for (const endpoint of endpoints) {
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
        continue;
      }

      const data = await response.json();
      allRecipes = [...allRecipes, ...data.results];
    } catch (error) {
      console.error(`Error fetching recipes for ${endpoint}:`, error);
    }
  }

  // Remove duplicates based on recipe name
  return Array.from(new Map(allRecipes.map(recipe => [recipe.name, recipe])).values());
}