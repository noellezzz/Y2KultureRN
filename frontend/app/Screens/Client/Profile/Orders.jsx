import { ScrollView, View, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import colors from '../../../styles/colors'
import BottomNavigation from '../../../Components/Buttons/BottomNavigation'
import LgText from '../../../Components/Labels/LgText'
import { default as Text } from '../../../Components/Labels/CustomText'
import Divider from '../../../Components/Labels/Divider'
import CartTile from '../../../Components/Layout/CartTile'
import { useSelector } from 'react-redux'

const statusColors = {
  Pending: '#f39c12',
  Processing: '#3498db',
  Shipped: '#9b59b6',
  Delivered: '#27ae60',
  Cancelled: '#e74c3c',
}

const statusOptions = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']

const Orders = ({ navigation }) => {
  const user = useSelector(state => state.user.user)
  const [selectedStatus, setSelectedStatus] = useState('All')

  const filteredOrders =
    selectedStatus === 'All'
      ? user?.orders
      : user?.orders?.filter(order => order.status === selectedStatus)

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
          <Text style={{ fontSize: 12 }}>{filteredOrders?.length || 0} Items</Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 10 }}>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              {statusOptions.map(status => (
                <TouchableOpacity
                  key={status}
                  onPress={() => setSelectedStatus(status)}
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 20,
                    backgroundColor:
                      selectedStatus === status ? colors.secondary : '#ccc',
                  }}
                >
                  <Text style={{ color: selectedStatus === status ? '#fff' : '#000' }}>
                    {status}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          <Divider />

          {filteredOrders?.map((order, key) => (
            <TouchableOpacity
              key={order._id}
              onPress={() => navigation.navigate('OrderDetails', { order })}
              style={{ marginBottom: 20 }}
            >
              <Text style={{ marginVertical: 10, fontWeight: 'bold' }}>
                Order No. {order._id}
              </Text>
              <Text
                style={{
                  marginBottom: 10,
                  color: statusColors[order.status] || 'gray',
                  fontWeight: '600',
                }}
              >
                Status: {order.status}
              </Text>
              <View style={{ gap: 10 }}>
                {order.items.map((item, key2) => (
                  <CartTile
                    image={item?.image}
                    key={(key + 1) * 10 + key2}
                    text={item?.product}
                    variant={item?.size + ' ' + item?.color}
                    category={item?.category}
                    price={`₱${item?.price}`}
                  />
                ))}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <BottomNavigation navigation={navigation} />
    </SafeAreaView>
  )
}

export default Orders
