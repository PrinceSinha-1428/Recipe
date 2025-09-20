import { useLocalSearchParams } from 'expo-router'
import { View, Text } from 'react-native'


const RecipeDetailScreen = () => {
  const {id: recipeId} = useLocalSearchParams();
  return (
    <View>
      <Text>RecipeDetailScreen</Text>
    </View>
  )
}
export default RecipeDetailScreen