import { useClerk, useUser } from '@clerk/clerk-expo'
import { useEffect, useState } from 'react';
import { View, Text, Alert, ScrollView, TouchableOpacity, FlatList } from 'react-native'
import { Meal } from '.';
import { apiUrl } from '@/constants/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import { favoritesStyles } from '@/assets/styles/favorites.styles';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';
import RecipeCard from '@/components/RecipeCard';
import NoFavoritesFound from '@/components/NoFavoritesFound';

const FavoriteScreen = () => {


  const { signOut } = useClerk();
  const { user } = useUser();
  const [favoriteRecipes, setFavoriteRecipes] = useState<Meal[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const loadFavorites = async () => {
        try {
          setLoading(true);
          const response = await fetch(`${apiUrl}/favorite/${user?.id}`);
          if(!response.ok) throw new Error("Failed to fetch favorites");
          const favorites = await response.json();
          const transformedFavorites = favorites.map((favorite: any) => ({
            ...favorite,
            id: favorite.recipeId
          }))
          setFavoriteRecipes(transformedFavorites);
        } catch (error) {
          console.error(error);
          Alert.alert("Failed to load favorites");
        } finally {
          setLoading(false);
        }
    }
    loadFavorites()
  }, [user?.id]);

  const handleSignOut = async () => {
     Alert.alert("Logout", "Are you sure you want to logout?", [
       { text: "Cancel", style: "cancel" },
       { text: "Logout", style: "destructive", onPress: () => signOut },
    ]);
  }

  if(loading) return <LoadingSpinner message='Loading your favorites...' size='large'  />

  return (
    <View style={favoritesStyles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={favoritesStyles.header}>
          <Text style={favoritesStyles.title}>Favorites</Text>
          <TouchableOpacity style={favoritesStyles.logoutButton} onPress={handleSignOut}>
            <Ionicons name="log-out-outline" size={22} color={COLORS.text} />
          </TouchableOpacity>
        </View>

        <View style={favoritesStyles.recipesSection}>
          <FlatList
            data={favoriteRecipes}
            renderItem={({ item }) => <RecipeCard recipe={item} />}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            columnWrapperStyle={favoritesStyles.row}
            contentContainerStyle={favoritesStyles.recipesGrid}
            scrollEnabled={false}
            ListEmptyComponent={<NoFavoritesFound />}
          />
        </View>
      </ScrollView>
    </View>
  )
}
export default FavoriteScreen