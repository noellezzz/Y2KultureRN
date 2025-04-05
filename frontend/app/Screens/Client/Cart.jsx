import { View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import colors from '../../styles/colors'
import BottomNavigation from '../../Components/Buttons/BottomNavigation'
import LgText from '../../Components/Labels/LgText'
import { default as Text } from '../../Components/Labels/CustomText'
import Divider from '../../Components/Labels/Divider'
import CartTile from '../../Components/Layout/CartTile'

const Cart = ({ navigation }) => {
  return (
    <SafeAreaView
      style={{
        position: 'relative',
        backgroundColor: colors.primary,
        flex: 1,
        width: '100%',
      }}
    >
      <View style={{ width: '100%', padding: 10, flex: 1 }}>
        <LgText>Shopping Cart</LgText>
        <Text style={{ fontSize: 12 }}>2 Items</Text>
        <View style={{ marginVertical: 10 }}>
          <Divider />
        </View>
        <View style={{ gap: 10 }}>
          <CartTile />
          <CartTile />
          <CartTile />
        </View>
      </View>

      <BottomNavigation navigation={navigation} />
    </SafeAreaView>
  )
}

export default Cart
