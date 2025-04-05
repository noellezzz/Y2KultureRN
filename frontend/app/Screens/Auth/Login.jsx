import { View, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import colors from '../../styles/colors'
import LgText from '../../Components/Labels/LgText'
import InputField from '../../Components/Input/InputField'
import Checkbox from '../../Components/Input/Checkbox'
import { default as Text } from '../../Components/Labels/CustomText'
import PrimeButton from '../../Components/Buttons/PrimeButton'
import Divider from '../../Components/Labels/Divider'
import AntDesign from '@expo/vector-icons/AntDesign'
import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithCredential,
  signInWithPopup,
  signInAnonymously,
} from 'firebase/auth'
import app from '../../Utils/firebaseConfig'
import api from '../../Utils/axiosInstance'
import { useDispatch } from 'react-redux'

import { setUserData, updateUserData } from '../../States/Slice/userSlice'
const Login = ({ navigation }) => {
  const [email, setEmail] = useState('marktest@gmail.com')
  const [password, setPassword] = useState('secret123')
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useDispatch()

  // Initialize Firebase Auth
  const auth = getAuth(app)

  // Handle email/password login
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password')
      return
    }

    setIsLoading(true)
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      )
      console.log('User logged in:', userCredential.user)
      console.log(userCredential.user.accessToken)
      // navigation.navigate('Layout')
      const response = await api.post('/auth/', {
        token: userCredential.user.accessToken,
      })
      console.log('User registered in backend:', response.data)
      dispatch(setUserData(response.data))
      // dispatch(updateUserData(response.data.orders))
      navigation.navigate('ClientStack')
    } catch (error) {
      console.error('Login error:', error)
      Alert.alert('Login Failed', error.message)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle Google Sign-in
  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      // Note: In React Native, you'll need to use a library like
      // expo-auth-session or react-native-google-signin for Google Auth
      // This is a simplified example
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      navigation.navigate('ClientStack')
    } catch (error) {
      console.error('Google sign-in error:', error)
      Alert.alert('Google Sign-in Failed', error.message)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle Facebook Sign-in
  const handleFacebookSignIn = async () => {
    setIsLoading(true)
    try {
      // Note: In React Native, you'll need to use a library like
      // expo-facebook or react-native-fbsdk-next for Facebook Auth
      // This is a simplified example
      const provider = new FacebookAuthProvider()
      const result = await signInWithPopup(auth, provider)
      navigation.navigate('ClientStack')
    } catch (error) {
      console.error('Facebook sign-in error:', error)
      Alert.alert('Facebook Sign-in Failed', error.message)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle Phone Sign-in
  const handlePhoneSignIn = async () => {
    // For phone authentication in React Native,
    // you'll need to implement firebase phone auth flow
    // which requires additional setup
    Alert.alert(
      'Phone Sign-in',
      'Phone authentication requires additional implementation',
    )
  }

  // Handle Forgot Password
  const handleForgotPassword = () => {
    // Navigate to forgot password screen or show modal
    Alert.alert('Forgot Password', 'This feature will be implemented soon')
  }

  return (
    <View style={{ backgroundColor: colors.primary, flex: 1, padding: 10 }}>
      <SafeAreaView
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      >
        <LgText style={{ fontSize: 32 }}>Welcome</LgText>
        <View style={{ marginVertical: 10, width: '80%', gap: 20 }}>
          <InputField
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <InputField
            label="Password"
            value={password}
            onChangeText={setPassword}
            keyboardType="default"
            secureEntry={true}
            autoCapitalize="none"
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '80%',
          }}
        >
          <Checkbox text="Remember Me?" />
          <Text style={{ fontSize: 12 }} onPress={handleForgotPassword}>
            Forgot Password?
          </Text>
        </View>
        <View
          style={{
            width: '80%',
            marginVertical: 10,
            flexDirection: 'row',
            gap: 10,
          }}
        >
          <PrimeButton text="Login" onPress={handleLogin} loading={isLoading} />
          <PrimeButton
            styles={{ backgroundColor: 'white' }}
            text="Register"
            onPress={() => navigation.navigate('Register')}
            disabled={isLoading}
          />
        </View>
        <View style={{ width: '80%', marginVertical: 20 }}>
          <Divider text="Or continue with" />
        </View>
        <View style={{ width: '80%', flexDirection: 'row', gap: 10 }}>
          <PrimeButton
            styles={{ backgroundColor: 'white' }}
            icon={<AntDesign name="google" size={16} color="black" />}
            onPress={handleGoogleSignIn}
            disabled={isLoading}
          />
          <PrimeButton
            styles={{ backgroundColor: 'white' }}
            icon={<AntDesign name="facebook-square" size={16} color="black" />}
            onPress={handleFacebookSignIn}
            disabled={isLoading}
          />
          <PrimeButton
            styles={{ backgroundColor: 'white' }}
            icon={<AntDesign name="phone" size={16} color="black" />}
            onPress={handlePhoneSignIn}
            disabled={isLoading}
          />
        </View>
      </SafeAreaView>
    </View>
  )
}

export default Login
