const baseURL = "https://www.themealdb.com/api/json/v1/1";

export const MealAPI = {
  // get meal by name
  searchMealsByName: async (query: string) => {
    try {
      const response = await fetch(`${baseURL}/search.php?s=${encodeURIComponent(query)}`);
      const data = await response.json();
      return data.meals || [];
    } catch (error) {
      console.error("Error searching meal by name", error);
      return [];
    }
  },
   // lookup full meal details by id
  getMealById: async (id: string) => {
    try {
      const response = await fetch(`${baseURL}/lookup.php?i=${id}`);
      const data = await response.json();
      return data.meals ? data.meals[0] : null;
    } catch (error) {
      console.error("Error getting meal by id:", error);
      return null;
    }
  },
  // get meal randomly
  getRandomMeal: async () => {
    try {
      const response = await fetch(`${baseURL}/random.php`);
      const data = await response.json();
      return data.meals ? data.meals[0] : null
    } catch (error) {
      console.error("Error getting random meal", error);
      return null;
    }
  },
  // get meal randomly
  getRandomMeals: async (count: number) => {
    try {
      const promises = Array.from({ length: count }, () => MealAPI.getRandomMeal());
      const meals = await Promise.all(promises);
      return meals.filter((meal) => meal !== null)
    } catch (error) {
      console.error("Error getting random meals", error);
      return [];
    }
  },
  // get category
  getCategories: async () => {
    try {
      const response = await fetch(`${baseURL}/categories.php`);
      const data = await response.json();
      return data.categories || [];
    } catch (error) {
      console.error("Error getting categories meal", error);
      return [];
    }
  },
  // filter by ingredient
  filterByIngredient: async (ingredient: string) => {
    try {
      const response = await fetch(`${baseURL}/filter.php?i=${encodeURIComponent(ingredient)}`);
      const data = await response.json();
      return data.meals || [];
    } catch (error) {
      console.error("Error searching meal by ingredient", error);
      return [];
    }
  },
  // filter by category
  filterByCategory: async (category: string) => {
    try {
      const response = await fetch(`${baseURL}/filter.php?c=${encodeURIComponent(category)}`);
      const data = await response.json();
      return data.meals || [];
    } catch (error) {
      console.error("Error filtering by category", error);
      return [];
    }
  },
  // transform meal data
  transformMealData: (meal: any) => {
    if(!meal) return null;
    const ingredients = [];
    for(let i = 1; i<=20 ;i++){
      const ingredient = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];
      if(ingredient && ingredient.trim()){
        const measureText = measure && measure.trim() ? `${measure.trim()} `: "";
        ingredients.push(`${measureText}${ingredient.trim()}`);
      }
    }
    const instructions = meal.strInstructions
    ? meal.strInstructions.split(/\r?\n/).filter((step: string) => step.trim())
    : [];

    return {
      id: meal.idMeal,
      title: meal.strMeal,
      description: meal.strInstructions ? meal.strInstructions.substring(0,120) + "..." : "Delicious Meal from TheMealDB",
      image: meal.strMealThumb,
      cookingTime: `${Math.floor(Math.random() * (90 - 20 + 1) + 20)} minutes`,
      servings: 4,
      category: meal.strCategory || "Main Course",
      area: meal.strArea,
      ingredients,
      instructions,
      originalData: meal
    };
  }
}