import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import LoginScreen from '../Screens/Auth/Login'
import RegisterScreen from '../Screens/Auth/Register'

const Stack = createStackNavigator()

export default function ProductsNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  )
}
