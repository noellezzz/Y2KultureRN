import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import LayoutScreen from '../Screens/Client/_layout'
import Cart from '../Screens/Client/Cart'
import Search from '../Screens/Client/Search'
import User from '../Screens/Client/User'
import Home from '../Screens/Client/Home'
import Product from '../Screens/Client/Products/Index'
import EditUser from '../Screens/Client/Profile/Edit'
import Orders from '../Screens/Client/Profile/Orders'

const Stack = createStackNavigator()

export default function ClientNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, animation: 'none' }}
      initialRouteName="Layout"
    >
      <Stack.Screen name="Layout" component={LayoutScreen} />
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Cart" component={Cart} />
      <Stack.Screen name="Search" component={Search} />
      <Stack.Screen name="User" component={User} />
      <Stack.Screen name="Product" component={Product} />
      <Stack.Screen name="EditUser" component={EditUser} />
      <Stack.Screen name="Orders" component={Orders} />
    </Stack.Navigator>
  )
}
