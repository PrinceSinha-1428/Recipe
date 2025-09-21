import { COLORS } from '@/constants/colors';
import { useAuth } from '@clerk/clerk-expo'
import { Ionicons } from '@expo/vector-icons';
import { Redirect, Tabs } from 'expo-router'
import { useEffect } from 'react';
import { Platform } from 'react-native';


const TabsLayout = () => {


  const { isSignedIn } = useAuth();

  if(!isSignedIn) return <Redirect href={'/(auth)/sign-in'} />

  return (
    <Tabs 
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textLight,
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopColor: COLORS.border,
          borderWidth: 1,
          paddingBottom: 9,
          paddingTop: 8,
          height: Platform.OS === 'ios' ? 90 : 80,
          position: "absolute",   // <-- key
        },
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: "600"
        }
      }}
    >
      <Tabs.Screen 
        name='index'
        options={{
          title: 'Recipes',
          tabBarIcon: ({color, size}) => <Ionicons name='restaurant' size={size} color={color}  />
        }}
      />
      <Tabs.Screen 
        name='search'
        options={{
          title: 'Search',
          tabBarIcon: ({color, size}) => <Ionicons name='search' size={size} color={color}  />
        }}
      />
      <Tabs.Screen 
        name='favorite'
        options={{
          title: 'Favorites',
          tabBarIcon: ({color, size}) => <Ionicons name='heart' size={size} color={color}  />
        }}
      />
    </Tabs>
  )
}
export default TabsLayout