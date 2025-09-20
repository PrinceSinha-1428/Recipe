import { useSignUp } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View, Text, Alert, KeyboardAvoidingView, Platform, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { Data } from './sign-in';
import { authStyles } from '@/assets/styles/auth.styles';
import { Image } from 'expo-image';
import { COLORS } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import VerifyEmail from './verify-email';


const SignUpScreen = () => {

  const router = useRouter();
  const { isLoaded, signUp } = useSignUp();
  const [data, setData] = useState<Data>({ email: '',  password: '' });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [pendingVerification, setPendingVerification] = useState<boolean>(false);

  const handleSignUp = async () => {
    const { email, password } = data;
    
    if(!email || !password) return Alert.alert("Please fill all the fields");
    if(password.length < 6) return Alert.alert("Password must be at least 6 characters");
    if(!isLoaded) return;
    setLoading(true);
    try {
      await signUp.create({emailAddress: email, password});
      await signUp.prepareEmailAddressVerification({strategy: "email_code"});
      setPendingVerification(true);
    } catch (error: any) {
       Alert.alert("Error", error.errors?.[0]?.message || "Sign Up failed");
    } finally {
      setLoading(false);
    }
  }

  if(pendingVerification) return <VerifyEmail email={data.email} onBack={() => setPendingVerification(false)} />

  return (
    <View style={authStyles.container}>
     <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
        style={authStyles.keyboardView}>
      <ScrollView 
        style={authStyles.scrollContent}
        showsVerticalScrollIndicator={false} >
      <View style={authStyles.imageContainer}>
      <Image 
        source={require('../../assets/images/i2.png')}
        style={authStyles.image}
        contentFit='contain'
      />
      </View>
      <Text style={authStyles.title}>Create an account</Text>
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
            onPress={handleSignUp}
            disabled={loading}
            activeOpacity={0.8}
          >
          <Text style={authStyles.buttonText}>{loading ? 'Creating an account...' : 'Sign Up'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={authStyles.linkContainer}
            onPress={() => router.back()} 
           >
          <Text style={authStyles.linkText}>Already have an account ? <Text style={authStyles.link}>Sign In</Text> </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
     </KeyboardAvoidingView>
    </View>
  )
}
export default SignUpScreen