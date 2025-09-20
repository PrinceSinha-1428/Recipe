import { authStyles } from '@/assets/styles/auth.styles';
import { useSignIn } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View, Text, Alert, KeyboardAvoidingView, Platform, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { COLORS } from '@/constants/colors';
import { Ionicons } from "@expo/vector-icons";

interface Data {
  email: string;
  password: string
}


const SignInScreen = () => {

  const router = useRouter();
  const { isLoaded, signIn, setActive } = useSignIn();
  const [data, setData] = useState<Data>({ email: '',  password: '' });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSignIn = async () => {
    const { email, password } = data;
    if(!email || !password){
      Alert.alert("Please fill all the fields");
    }
    if(!isLoaded) return;
    setLoading(true);
    try {
      const signInAttempt = await signIn.create({
        identifier: email,
        password
      })
      if(signInAttempt.status === 'complete'){
        await setActive({ session: signInAttempt.createdSessionId })
      } else {
        Alert.alert("Failed to Sign in")
      }
    } catch (error: any) {
      Alert.alert("Error", error.errors?.[0]?.message || "Sign in failed")
      
    } finally {
      setData({ email: '', password: ''});
      setLoading(false);
    }
  }

  return (
    <View style={authStyles.container}>
     <KeyboardAvoidingView style={authStyles.keyboardView} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}>
      <ScrollView style={authStyles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={authStyles.imageContainer}>
          <Image 
          source={require("../../assets/images/i1.png")}
          style={authStyles.image}
          contentFit='contain'
          />
        </View>
        <Text style={authStyles.title}>Welcome Back</Text>
        {/* Form Container */}
        <View style={authStyles.formContainer}>
          <View style={authStyles.inputContainer}>
            <TextInput
              style={authStyles.textInput}
              placeholder='Enter Email'
              placeholderTextColor={COLORS.textLight}
              value={data.email}
              onChangeText={(text) => setData({...data, email: text})}
              keyboardType='email-address'
              autoCapitalize='none'
            />
          </View>
          <View style={authStyles.inputContainer}>
            <TextInput
              style={authStyles.textInput}
              placeholder='Enter Password'
              placeholderTextColor={COLORS.textLight}
              value={data.password}
              secureTextEntry={!showPassword}
              onChangeText={(text) => setData({...data, password: text})}
              keyboardType='email-address'
              autoCapitalize='none'
            />
            <TouchableOpacity style={authStyles.eyeButton} onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
               name={showPassword ? "eye-outline" : "eye-off-outline" }
               size={20}
               color={COLORS.textLight}
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={[authStyles.authButton , loading && authStyles.buttonDisabled]}
            onPress={handleSignIn}
            disabled={loading}
            activeOpacity={0.8}
          >
          <Text style={authStyles.buttonText}>{loading ? 'Signing in...' : 'Sign In'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
          style={authStyles.linkContainer}
          onPress={() => router.push("/(auth)/sign-up")} 
           >
          <Text style={authStyles.linkText}>Don&apos;t have an account ? <Text style={authStyles.link}>Sign Up</Text> </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
     </KeyboardAvoidingView>
    </View>
  )
}
export default SignInScreen