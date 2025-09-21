import { COLORS } from "@/constants/colors"
import { Platform, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

const SafeScreen = ({children}: {children: React.ReactNode}) => {
  const insets = useSafeAreaInsets()
  return (
    <View style={{ 
      paddingTop: insets.top, 
      paddingBottom: Platform.OS === 'ios' ? 0 : insets.bottom, 
      flex: 1, 
      backgroundColor: COLORS.background }}>
     {children}
    </View>
  )
}
export default SafeScreen