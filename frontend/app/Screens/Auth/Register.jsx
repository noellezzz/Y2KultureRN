import { View, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import colors from '../../styles/colors'
import LgText from '../../Components/Labels/LgText'
import InputField from '../../Components/Input/InputField'
import Checkbox from '../../Components/Input/Checkbox'
import { default as Text } from '../../Components/Labels/CustomText'
import PrimeButton from '../../Components/Buttons/PrimeButton'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
import app from '../../Utils/firebaseConfig'
import api from '../../Utils/axiosInstance'
import { useDispatch } from 'react-redux'
import { setUserData } from '../../States/Slice/userSlice'

const Register = ({ navigation }) => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useDispatch()

  // Initialize Firebase Auth
  const auth = getAuth(app)

  // Handle user registration
  const handleRegister = async () => {
    // Basic validation
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields')
      return
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match')
      return
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password should be at least 6 characters long')
      return
    }

    setIsLoading(true)
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      )
      console.log(
        'User registered:',
        userCredential.user.stsTokenManager.accessToken,
      )
      const firebaseToken = userCredential.user.stsTokenManager.accessToken
      const response = await api.post('/auth/', {
        token: firebaseToken,
        firstName,
        lastName,
      })
      console.log('User registered in backend:', response.data)
      dispatch(setUserData(response.data))
      Alert.alert(
        'Registration Successful',
        'Your account has been created successfully!',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('ClientStack'),
          },
        ],
      )
    } catch (error) {
      console.error('Registration error:', error)
      let errorMessage = 'Registration failed'

      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'That email address is already in use!'
          break
        case 'auth/invalid-email':
          errorMessage = 'That email address is invalid!'
          break
        case 'auth/weak-password':
          errorMessage = 'Password is too weak!'
          break
        default:
          errorMessage = error.message
      }

      Alert.alert('Registration Failed', errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <View style={{ backgroundColor: colors.primary, flex: 1, padding: 10 }}>
      <SafeAreaView
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      >
        <LgText style={{ fontSize: 32 }}>Create an Account</LgText>
        <View style={{ marginVertical: 10, width: '80%', gap: 20 }}>
          <View style={{ flexDirection: 'row' }}>
            <View
              style={{
                width: '49%',
                padding: 5,
                paddingLeft: 0,
                paddingVertical: 0,
              }}
            >
              <InputField
                label="First Name"
                value={firstName}
                onChangeText={setFirstName}
                keyboardType="default"
                autoCapitalize="none"
              />
            </View>
            <View
              style={{
                width: '49%',
                padding: 5,
                paddingRight: 0,
                paddingVertical: 0,
              }}
            >
              <InputField
                label="Last Name"
                value={lastName}
                onChangeText={setLastName}
                keyboardType="default"
                autoCapitalize="none"
              />
            </View>
          </View>
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
          <InputField
            label="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
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
          <Checkbox text="I agree to the Terms of Service" />
        </View>
        <View
          style={{
            width: '80%',
            marginVertical: 10,
            flexDirection: 'row',
            gap: 10,
          }}
        >
          <PrimeButton
            text="Register"
            onPress={handleRegister}
            loading={isLoading}
          />
          <PrimeButton
            styles={{ backgroundColor: 'white' }}
            text="Go Back"
            onPress={() => navigation.goBack()}
            disabled={isLoading}
          />
        </View>
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontSize: 14 }}>
            Already have an account?{' '}
            <Text
              style={{ color: 'blue', fontWeight: 'bold' }}
              onPress={() => navigation.navigate('Login')}
            >
              Login
            </Text>
          </Text>
        </View>
      </SafeAreaView>
    </View>
  )
}

export default Register
