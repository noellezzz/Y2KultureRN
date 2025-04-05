import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer'
import AnalyticsScreen from '../Screens/Admin/Analytics'
import ProductsScreen from '../Navigators/ProductNavigation'
import DashboardScreen from '../Screens/Admin/Dashboard'
import SettingsScreen from '../Screens/Admin/Settings'
import UsersScreen from '../Screens/Admin/Users'
import Ionicons from 'react-native-vector-icons/Ionicons'
import colors from '../styles/colors'

const Drawer = createDrawerNavigator()

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        drawerStyle: {
          backgroundColor: colors.primary,
          width: 250,
        },
        drawerLabelStyle: {
          fontFamily: 'DefaultFont',
        },
        drawerActiveTintColor: colors.tertiary,
        drawerInactiveTintColor: colors.lightGray,
        drawerActiveBackgroundColor: colors.secondary,
        drawerIcon: ({ focused, color, size }) => {
          let iconName

          switch (route.name) {
            case 'Dashboard':
              iconName = focused ? 'home' : 'home-outline'
              break
            case 'Analytics':
              iconName = focused ? 'analytics' : 'analytics-outline'
              break
            case 'Products':
              iconName = focused ? 'clipboard' : 'clipboard-outline'
              break
            case 'Users':
              iconName = focused ? 'people' : 'people-outline'
              break
            case 'Settings':
              iconName = focused ? 'settings' : 'settings-outline'
              break
            default:
              iconName = 'help-circle-outline'
          }

          return <Ionicons name={iconName} size={size} color={color} />
        },
      })}
    >
      <Drawer.Screen name="Dashboard" component={DashboardScreen} />
      <Drawer.Screen name="Products" component={ProductsScreen} />
      <Drawer.Screen name="Analytics" component={AnalyticsScreen} />
      <Drawer.Screen name="Users" component={UsersScreen} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
    </Drawer.Navigator>
  )
}
