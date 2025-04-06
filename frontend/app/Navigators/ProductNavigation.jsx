import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import ProductsScreen from '../Screens/Admin/Products/Index'
import CreateProductScreen from '../Screens/Admin/Products/Create'
import EditProductScreen from '../Screens/Admin/Products/Edit'
import DeleteProduct from '../Screens/Admin/Products/Delete'

const Stack = createStackNavigator()

export default function ProductsNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProductsList" component={ProductsScreen} />
      <Stack.Screen name="CreateProduct" component={CreateProductScreen} />
      <Stack.Screen name="EditProduct" component={EditProductScreen} />
      <Stack.Screen name="DeleteProduct" component={DeleteProduct} />
    </Stack.Navigator>
  )
}
