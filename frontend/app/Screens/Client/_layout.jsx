import { createStackNavigator } from '@react-navigation/stack'
import HomeScreen from './Home'
import CartScreen from './Cart'
import SearchScreen from './Search'
import UserScreen from './User'

import ProductScreen from './Products/Index'
import BottomNavigation from '../../Components/Buttons/BottomNavigation'
import { View } from 'react-native'

const Stack = createStackNavigator()

export default function Layout({ navigation }) {
  return (
    <View style={{ flex: 1 }}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animationEnabled: false,
          animation: 'none',
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Cart" component={CartScreen} />
        <Stack.Screen name="Search" component={SearchScreen} />
        <Stack.Screen name="User" component={UserScreen} />
        <Stack.Screen name="Product" component={ProductScreen} />
      </Stack.Navigator>

      {/* Add Bottom Navigation */}
      {/* <BottomNavigation navigation={navigation} /> */}
    </View>
  )
}
