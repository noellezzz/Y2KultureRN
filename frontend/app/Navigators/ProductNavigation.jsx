import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import ProductsScreen from '../Screens/Admin/Products/Index'
import CreateProductScreen from '../Screens/Admin/Products/Create'

const Stack = createStackNavigator()

export default function ProductsNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProductsList" component={ProductsScreen} />
      <Stack.Screen name="CreateProduct" component={CreateProductScreen} />
    </Stack.Navigator>
  )
}
