import { ScrollView, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import colors from '../../../styles/colors'
import BottomNavigation from '../../../Components/Buttons/BottomNavigation'
import LgText from '../../../Components/Labels/LgText'
import { default as Text } from '../../../Components/Labels/CustomText'
import Divider from '../../../Components/Labels/Divider'
import CartTile from '../../../Components/Layout/CartTile'
import mockUser from '../../../Data/UserInfo'
import { useSelector } from 'react-redux'

const Orders = ({ navigation }) => {
  const user = useSelector(state => state.user.user)
  console.log(user)
  return (
    <SafeAreaView
      style={{
        position: 'relative',
        backgroundColor: colors.primary,
        flex: 1,
        width: '100%',
      }}
    >
      <ScrollView>
        <View style={{ width: '100%', padding: 10, flex: 1 }}>
          <LgText>Orders</LgText>
          <Text style={{ fontSize: 12 }}>2 Items</Text>
          <View style={{ marginVertical: 10 }}>
            <Divider />
          </View>
          {user?.orders?.map((order, key) => (
            <View key={order._id}>
              <Text style={{ marginVertical: 10 }}>Order No. {order._id}</Text>
              <View style={{ gap: 10 }}>
                {order.items.map((item, key2) => (
                  <CartTile
                    key={(key + 1) * 10 + key2}
                    text={item?.name}
                    category={item?.category}
                  />
                ))}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
      <BottomNavigation navigation={navigation} />
    </SafeAreaView>
  )
}

export default Orders
