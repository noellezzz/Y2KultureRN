import { View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import colors from '../../../styles/colors'
import BottomNavigation from '../../../Components/Buttons/BottomNavigation'
import LgText from '../../../Components/Labels/LgText'
import { default as Text } from '../../../Components/Labels/CustomText'
import Divider from '../../../Components/Labels/Divider'
import CartTile from '../../../Components/Layout/CartTile'
import mockUser from '../../../Data/UserInfo'

const Orders = ({ navigation }) => {
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
        <LgText>Orders</LgText>
        <Text style={{ fontSize: 12 }}>2 Items</Text>
        <View style={{ marginVertical: 10 }}>
          <Divider />
        </View>
        {mockUser.orders.map(order => (
          <View key={order.id}>
            <Text style={{ marginVertical: 10 }}>Order No. {order.id}</Text>
            <View style={{ gap: 10 }}>
              {order.items.map(item => (
                <CartTile
                  key={item.id}
                  text={item?.name}
                  category={item?.category}
                />
              ))}
            </View>
          </View>
        ))}
      </View>

      <BottomNavigation navigation={navigation} />
    </SafeAreaView>
  )
}

export default Orders
