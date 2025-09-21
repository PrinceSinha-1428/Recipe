import { homeStyles } from '@/assets/styles/home.styles';
import CategoryFilter from '@/components/CategoryFilter';
import LoadingSpinner from '@/components/LoadingSpinner';
import RecipeCard from '@/components/RecipeCard';
import { COLORS } from '@/constants/colors';
import { MealAPI } from '@/services/mealApi';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, FlatList, RefreshControl } from 'react-native';


export interface Meal {
  id: string;
  title: string;
  description: string;
  image: string;
  cookingTime: string;
  servings: number;
  category: string;
  area: string;
  ingredients: string[];
  instructions: string;
  originalData: any;
}



const HomeScreen = () => {

  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [recipes, setRecipes] = useState<Meal[]>([]);
  const [categories, setCategories] = useState<[]>([]);
  const [featuredRecipe, setFeaturedRecipe] = useState<Meal | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const loadData = async () => {
    try {
      setLoading(true)
      const [ categoryMeal, randomMeals, featuredMeal ] = await Promise.all([
        MealAPI.getCategories(),
        MealAPI.getRandomMeals(20),
        MealAPI.getRandomMeal()
      ]);
      const transformedCategories = categoryMeal.map((cat: any, index: any) => ({
        id: index + 1,
        name: cat.strCategory,
        image: cat.strCategoryThumb,
        description: cat.strCategoryDescription
      }));
      setCategories(transformedCategories);
      if(!selectedCategory) setSelectedCategory(transformedCategories[0].name)
      const transformedMeal = randomMeals.map((meal) => MealAPI.transformMealData(meal)).filter(meal => meal !== null);
      setRecipes(transformedMeal)
      const transformedFeatured = MealAPI.transformMealData(featuredMeal);
      setFeaturedRecipe(transformedFeatured)
    } catch (error) {
      console.log("Error loading the meal")
    } finally {
      setLoading(false);
    }
  };

  const loadCategoryData = async (category:string) => {
    try {
      const meals = await MealAPI.filterByCategory(category);
      const transformedMeals = meals
        .map((meal: any) => MealAPI.transformMealData(meal))
        .filter((meal: any) => meal !== null);
      setRecipes(transformedMeals);
    } catch (error) {
      console.log("Error loading the meal");
      setRecipes([]);
    }
  };

  const handleCategorySelect = async (category: string) => {
      setSelectedCategory(category);
      await loadCategoryData(category);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  if(loading && !refreshing) return <LoadingSpinner message='Loading meals...' size='large' />


  return (
    <View style={homeStyles.container}>
      <ScrollView 
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary}/>
      }
      contentContainerStyle={homeStyles.scrollContent}
       >
        <View style={homeStyles.welcomeSection} >
          <Image source={require("../../assets/images/meal.png")} style={{
            width: 100,
            height: 100
          }}  />
          <Image source={require("../../assets/images/chicken.png")} style={{
            width: 100,
            height: 100
          }}  />
          <Image source={require("../../assets/images/wrap.png")} style={{
            width: 100,
            height: 100
          }}  />
        </View>
        {featuredRecipe && <View style={homeStyles.featuredSection}>
            <TouchableOpacity
              style={homeStyles.featuredCard}
              activeOpacity={0.9}
              onPress={() => router.push(`/recipe/${featuredRecipe.id}`)}
            >
              <View style={homeStyles.featuredImageContainer}>
                <Image
                  source={{ uri: featuredRecipe.image}}
                  style={homeStyles.featuredImage}
                  contentFit='cover'
                  transition={500}
                />
                <View style={homeStyles.featuredOverlay}>
                  <View style={homeStyles.featuredBadge}>
                    <Text style={homeStyles.featuredBadgeText}>Featured</Text>
                  </View>
                  <View style={homeStyles.featuredContent}>
                    <Text style={homeStyles.featuredTitle} numberOfLines={2}>
                      {featuredRecipe.title}
                    </Text>
                    <View style={homeStyles.featuredMeta}>
                      <View style={homeStyles.metaItem}>
                        <Ionicons name='time-outline' size={16} color={COLORS.white} />
                        <Text style={homeStyles.metaText}>{featuredRecipe.cookingTime}</Text>
                      </View>
                      <View style={homeStyles.metaItem}>
                        <Ionicons name='people-outline' size={16} color={COLORS.white} />
                        <Text style={homeStyles.metaText}>{featuredRecipe.servings}</Text>
                      </View>
                      <View style={homeStyles.metaItem}>
                        <Ionicons name='location-outline' size={16} color={COLORS.white} />
                        <Text style={homeStyles.metaText}>{featuredRecipe.area}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
        </View>}
        {categories.length > 0 && (
         <CategoryFilter 
         categories={categories}
         selectedCategory={selectedCategory}
         onSelectCategory={handleCategorySelect}
         />
        )}
        <View style={homeStyles.recipesSection}>
          <View style={homeStyles.sectionHeader}>
            <Text style={homeStyles.sectionTitle}>{selectedCategory}</Text>
          </View>
        
        {recipes.length > 0 ? (
          <FlatList 
            data={recipes}
            renderItem={({item}) => <RecipeCard recipe={item} />}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            columnWrapperStyle={homeStyles.row}
            contentContainerStyle={homeStyles.recipesGrid}
            scrollEnabled={false}
          />
        ): (
          <View style={homeStyles.emptyState}>
            <Ionicons name='restaurant-outline' size={64} color={COLORS.textLight} />
            <Text style={homeStyles.emptyTitle}>No Recipe Found</Text>
            <Text style={homeStyles.emptyDescription}>Try a different category</Text>
          </View>
        )}
        </View>
      </ScrollView>
    </View>
  )
}
export default HomeScreen