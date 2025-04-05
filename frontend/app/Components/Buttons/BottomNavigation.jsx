import { TouchableOpacity, View } from 'react-native'
import React from 'react'
import Ionicons from '@expo/vector-icons/Ionicons'
import { default as Text } from '../Labels/CustomText'
import { useNavigationState } from '@react-navigation/native'
import colors from '../../styles/colors'

const routes = [
  {
    name: 'Home',
    icon: 'home-outline',
  },
  {
    name: 'Search',
    icon: 'search',
  },
  {
    name: 'Cart',
    icon: 'cart-outline',
  },
  {
    name: 'User',
    icon: 'person-outline',
  },
]

const BottomNavigation = ({ navigation }) => {
  const activeRoute = useNavigationState(
    state => state.routes[state.index]?.name,
  )

  return (
    <View
      style={{
        position: 'absolute',
        zIndex: 100,
        width: '100%',
        height: 100,
        bottom: 0,
        left: 0,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
      }}
    >
      <View
        style={{
          borderRadius: 50,
          boxShadow: '0px 1px 0px 2px rgba(0,0,0,1)',
          flexDirection: 'row',
          padding: 5,
          width: '90%',
          height: '90%',
          backgroundColor: colors.primary,
        }}
      >
        {routes.map((route, index) => (
          <TouchableOpacity
            style={{ flex: 1 }}
            key={index}
            onPress={() => navigation.navigate(route.name)}
          >
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                gap: 2,
                paddingVertical: 12,
                paddingHorizontal: 6,
                borderRadius: 50,
                backgroundColor:
                  activeRoute === route.name
                    ? colors.quaternary
                    : colors.primary,
              }}
            >
              <Ionicons name={route.icon} size={16} color="black" />
              <Text style={{ fontSize: 12 }}>{route.name}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )
}

export default BottomNavigation
