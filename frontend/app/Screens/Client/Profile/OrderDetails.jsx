import { ScrollView, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { default as Text } from '../../../Components/Labels/CustomText'
import colors from '../../../styles/colors'
import LgText from '../../../Components/Labels/LgText'
import Divider from '../../../Components/Labels/Divider'
import CartTile from '../../../Components/Layout/CartTile'

const statusColors = {
  Pending: '#f39c12',
  Processing: '#3498db',
  Shipped: '#9b59b6',
  Delivered: '#27ae60',
  Cancelled: '#e74c3c',
}

const OrderDetails = ({ route, navigation }) => {
  const { order } = route.params

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.primary }}>
      <ScrollView contentContainerStyle={{ padding: 15 }}>
        <View style={{ marginBottom: 20 }}>
          <LgText style={{ fontSize: 24, fontWeight: 'bold' }}>Order Details</LgText>
          <Text style={{ fontSize: 16, marginTop: 5 }}>Order No: {order._id}</Text>
        </View>

        <Divider />

        <View style={{  marginVertical: 5 }}>
          {order.items.map((item, index) => (
            <View key={index} style={{ borderRadius: 10, padding: 10}}>
              <CartTile
                image={item?.image}
                text={item?.product}
                variant={`${item?.size} ${item?.color}`}
                category={item?.category}
                price={`₱${item?.price}`}
              />
            </View>
          ))}
        </View>

        <Divider />

        <View style={{ marginVertical: 15 }}>
          <Text style={{ fontSize: 14, fontWeight: 'bold' }}>Ordered At: {order.date}</Text>
          <Text style={{ fontSize: 14, fontWeight: 'bold', marginTop: 5 }}>
            Delivery Address: {order.deliveryAddress}
          </Text>
          <Text style={{ color: statusColors[order.status], fontSize: 14, marginTop: 5, fontWeight: 'bold'}}>
            Status: {order.status}
          </Text>
          <Text style={{ fontSize: 20, marginTop: 20, fontWeight: 'bold' }}>
            Total: ₱{order.total}
          </Text>
        </View>

        {order.status === 'Delivered' && (
          <TouchableOpacity
            onPress={() => navigation.navigate('Review', { order })}
            style={{
              backgroundColor: colors.secondary,
              paddingVertical: 12,
              borderRadius: 10,
              alignItems: 'center',
              marginTop: 20,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 5,
              elevation: 5,
            }}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Leave a Review</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

export default OrderDetails
