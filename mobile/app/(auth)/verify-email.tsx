import { authStyles } from '@/assets/styles/auth.styles';
import { COLORS } from '@/constants/colors';
import { useSignUp } from '@clerk/clerk-expo';
import { Image } from 'expo-image';
import { useState } from 'react';
import { View, Text, Alert, KeyboardAvoidingView, Platform, ScrollView, TextInput, TouchableOpacity } from 'react-native'

interface VerifyEmailProps {
  email: string;
  onBack: () => void;
}

const VerifyEmail = ({email, onBack}: VerifyEmailProps) => {

  const { isLoaded, signUp, setActive } = useSignUp();
  const [loading, setLoading] = useState<boolean>(false);
  const [code, setCode] = useState<string>('');

  const handleVerification = async () => {
    if(!isLoaded) return;
    setLoading(true);
    try {
     const signUpAttempt =  await signUp.attemptEmailAddressVerification({code});
     if(signUpAttempt.status === 'complete'){
       await setActive({session: signUpAttempt.createdSessionId})
     } else {
       Alert.alert("Verification failed");
     }
    } catch (error: any) {
       Alert.alert("Error", error.errors?.[0]?.message || "Sign Up failed");
    } finally {
      setCode('');
      setLoading(false);
    }
  }


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
        source={require('../../assets/images/i3.png')}
        style={authStyles.image}
        contentFit='contain'
      />
      </View>
      <Text style={authStyles.title}>Verify Your Email</Text>
      <Text style={authStyles.subtitle}>We&apos;ve sent a Verification code to your {email}</Text>
      <View style={authStyles.formContainer}>
         <View style={authStyles.inputContainer}>
            <TextInput
              style={authStyles.textInput}
              placeholder='Enter verification code'
              placeholderTextColor={COLORS.textLight}
              value={code}
              onChangeText={setCode}
              keyboardType='number-pad'
              autoCapitalize='none'
              />
            </View>
            <TouchableOpacity
              style={[authStyles.authButton , loading && authStyles.buttonDisabled]}
              onPress={handleVerification}
              disabled={loading}
              activeOpacity={0.8}
            >
            <Text style={authStyles.buttonText}>{loading ? 'Verifying...' : 'Verify Email'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
            style={authStyles.linkContainer}
            onPress={onBack} 
           >
          <Text style={authStyles.linkText}>
            <Text style={authStyles.link}>Back to Sign Up</Text>
          </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
     </KeyboardAvoidingView>
    </View>
  )
}
export default VerifyEmail