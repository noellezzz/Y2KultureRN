import React, { useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import ClientStack from './app/Navigators/ClientNavigator'
import AdminDrawer from './app/Navigators/AdminNavigation'
import AuthNavigation from './app/Navigators/AuthNavigation'
import Welcome from './app/Screens/Welcome'

import './app/styles/global.css'
import store from './app/States/store'
import { Provider } from 'react-redux'
import { useFonts } from 'expo-font'
import {
  clearCart,
  createCartItem,
  getCartItems,
  initilizeDatabase,
} from './app/Database/Database'

const Stack = createStackNavigator()

export default function App() {
  const [fontsLoaded] = useFonts({
    DefaultFont: require('./assets/fonts/champagne_limousines/champagne_limousines-bold.ttf'),
    DefaultLightFont: require('./assets/fonts/champagne_limousines/champagne_limousines.ttf'),
  })

  useEffect(() => {
    test()
  }, [])

  const test = async () => {
    // await initilizeDatabase()
    // createCartItem({
    //   dateAdded: new Date().toISOString(),
    //   productId: 1,
    //   quantity: 1,
    //   selectedColor: 'red',
    //   selectedSize: 'M',
    // })
    // getCartItems()
    // clearCart()
  }

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{ headerShown: false }}
          initialRouteName="Welcome"
        >
          <Stack.Screen name="ClientStack" component={ClientStack} />
          <Stack.Screen name="AdminDrawer" component={AdminDrawer} />
          <Stack.Screen name="AuthNavigation" component={AuthNavigation} />
          <Stack.Screen name="Welcome" component={Welcome} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  )
}
