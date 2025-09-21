import { recipeDetailStyles } from '@/assets/styles/recipe-detail.styles';
import LoadingSpinner from '@/components/LoadingSpinner';
import { apiUrl } from '@/constants/api';
import { MealAPI } from '@/services/mealApi';
import { useUser } from '@clerk/clerk-expo';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient} from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';

interface Recipe {
  youtubeUrl: string;
  id?: string;
  title?: string;
  description?: string;
  image?: string;
  cookingTime?: string;
  servings?: number;
  category?: string;
  area?: string;
  ingredients?: string[];
  instructions?: string;
  originalData?: any;
}


const RecipeDetailScreen = () => {

  const {id: recipeId} = useLocalSearchParams();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const { user } = useUser();
  const userId = user?.id;
  const router = useRouter();

  useEffect(() => {
    const checkIfSaved = async () => {
      try {
        const response = await fetch(`${apiUrl}/favorites/${userId}`);
        const favorites = await response.json();
        const isRecipeSaved = favorites.some((fav: any) => fav.recipeId === parseInt(recipeId as string));
        setIsSaved(isRecipeSaved);
      } catch (error) {
        console.log("Error saving recipe")
      }
    };
    const loadRecipeDetails = async () => {
      setLoading(true);
      try {
        const mealData = await MealAPI.getMealById(recipeId as string);
        if(mealData){
          const transformedRecipe = MealAPI.transformMealData(mealData);
          const recipeWithVideo = {
            ...transformedRecipe,
            youtubeUrl: mealData.strYoutube || null
          }
          setRecipe(recipeWithVideo)
        }
      } catch (error) {
        console.log("Error loading recipe")
      } finally {
        setLoading(false);
      }
    };
    checkIfSaved();
    loadRecipeDetails()
  }, [recipeId, userId]);


  const getYoutubeEmbedUrl =  (url: string) => {
    const videoId = url.split("v=")[1];
    return `https://www.youtube.com/embed/${videoId}`;
  }

  const handleToggleSave = async () => {
    setIsSaving(true);
    try {
      if(isSaved){
        const response = await fetch(`${apiUrl}/favorites/${userId}/${recipeId}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" }
        });
        if(!response.ok){
          console.log(response)
          throw new Error("Error Removing favorites");
        }
        setIsSaved(false);
      } else {
        const response = await fetch(`${apiUrl}/favorite`,{
          method: 'POST',
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            userId,
            recipeId: parseInt(recipeId as string),
            title: recipe?.title,
            image: recipe?.image,
            cookTime: recipe?.cookingTime,
            servings: recipe?.servings
          })
        });
        if(!response.ok) throw new Error("Error adding favorites");
        setIsSaved(true);
      }
    } catch (error) {
      console.log("Error Toggling saving recipe", error);
      Alert.alert("Please Try Again");
    } finally {
      setIsSaving(false);
    }
  };

  if(loading) return <LoadingSpinner message='Loading Recipe Details...' size='large'  />

  return (
    <View style={recipeDetailStyles.container}>
      <ScrollView>
        <View style={recipeDetailStyles.headerContainer} >
          <View style={recipeDetailStyles.imageContainer}>
            <Image 
              source={{ uri: recipe?.image}}
              style={recipeDetailStyles.headerImage}
              contentFit='cover'
            />
          </View>
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.5)","rgba(0,0,0,0.8)"]}
            style={recipeDetailStyles.gradientOverlay}
          />
          <View style={recipeDetailStyles.floatingButtons}>
            <TouchableOpacity
             style={recipeDetailStyles.floatingButton}
             onPress={() => router.back()}
            >
              <Ionicons name='arrow-back' color={COLORS.white} size={24}  />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                recipeDetailStyles.floatingButton,
                { backgroundColor: isSaving ? COLORS.white : COLORS.primary }
              ]}
              onPress={handleToggleSave}
              disabled={isSaving}
            >
              <Ionicons 
                name={isSaving ? "hourglass" : isSaved ? "bookmark" : "bookmark-outline"}
                size={24}
                color={COLORS.white}
              />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}
export default RecipeDetailScreen