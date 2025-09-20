import { searchStyles } from '@/assets/styles/search.styles';
import RecipeCard from '@/components/RecipeCard';
import { COLORS } from '@/constants/colors';
import { useDebounce } from '@/hooks/usedebounce';
import { MealAPI } from '@/services/mealApi';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, FlatList } from 'react-native'
import { Meal } from '.';
import { NoResultsFound } from '@/components/NoResultsFound';
import LoadingSpinner from '@/components/LoadingSpinner';

const SearchScreen = () => {

  const [recipes, setRecipes] = useState<Meal[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [initialLoading, setInitialLoading] = useState<boolean>(true);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const performSearch = async (query:string) => {
    // in case of no query
    if(!query.trim()){
      const randomMeals = await MealAPI.getRandomMeals(12);
      return randomMeals.map((meal) => MealAPI.transformMealData(meal)).filter(meal => meal !== null);
    }
    const nameResults = await MealAPI.searchMealsByName(query);
    let results = nameResults;
    if(results.length === 0){
      const ingredientResult = await MealAPI.filterByIngredient(query);
      results = ingredientResult;
    }
    return results.slice(0, 12)
      .map((meal: any) => MealAPI.transformMealData(meal))
      .filter((meal: any) => meal !== null);
  }

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const results = await performSearch("");
        setRecipes(results);
      } catch (error) {
        console.log(error)
      } finally {
        setInitialLoading(false);
      }
    }
    loadInitialData();
  }, []);

  useEffect(() => {
    if(initialLoading) return;
    const handleSearch = async () => {
      setLoading(true);
      try {
        const results = await performSearch(debouncedSearchQuery);
        setRecipes(results);
      } catch (error) {
        console.error(error);
        setRecipes([]);
      } finally {
        setLoading(false);
      }
    }
    handleSearch();
  }, [ debouncedSearchQuery, initialLoading]);

  if(initialLoading) return <LoadingSpinner message='Loading recipes...' size='large' />


  return (
    <View style={searchStyles.container}>
      <View style={searchStyles.searchSection}>
        <View style={searchStyles.searchContainer}>
          <Ionicons name='search' size={20} color={COLORS.textLight} style={searchStyles.searchIcon} />
          <TextInput
           style={searchStyles.searchInput}
           placeholder='Search Recipes, Ingredients..'
           placeholderTextColor={COLORS.textLight}
           value={searchQuery}
           onChangeText={setSearchQuery}
           returnKeyType={"search"}
           />
           {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery("")}
              style={searchStyles.clearButton}
            >
              <Ionicons name='close-circle' size={20} color={COLORS.textLight}  />
            </TouchableOpacity>
           )}
        </View>
      </View>
      <View style={searchStyles.resultsSection}>
        <View style={searchStyles.resultsHeader}>
          <Text style={searchStyles.resultsTitle}>
           {searchQuery ? `Results for ${searchQuery}`: 'Popular Recipes'}
          </Text>
           <Text style={searchStyles.resultsCount}>{recipes.length} found</Text>
        </View>
      {loading ? (
        <View style={searchStyles.loadingContainer}>
          <LoadingSpinner message='Searching recipes...' size="small" />
        </View>
      ) : (
        <FlatList
        data={recipes}
        renderItem={({item}) => <RecipeCard recipe={item} />}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={searchStyles.row}
        contentContainerStyle={searchStyles.recipesGrid}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<NoResultsFound/>}
        />
      )}
      </View>
    </View>
  )
}
export default SearchScreen;


