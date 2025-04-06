import { ScrollView, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { default as Text } from '../../../Components/Labels/CustomText'
import colors from '../../../styles/colors'
import LgText from '../../../Components/Labels/LgText'
import Divider from '../../../Components/Labels/Divider'
import CartTile from '../../../Components/Layout/CartTile'
import { Ionicons } from '@expo/vector-icons'
import { useSelector } from 'react-redux'

const statusColors = {
  Pending: '#f39c12',
  Processing: '#3498db',
  Shipped: '#9b59b6',
  Delivered: '#27ae60',
  Cancelled: '#e74c3c',
}

const OrderDetails = ({ route, navigation }) => {
  const { order } = route.params
  const { user } = useSelector((state) => state.user)

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Ionicons
        key={index}
        name={index < rating ? 'star' : 'star-outline'}
        size={24}
        color="#f1c40f"
        style={{ marginRight: 4 }}
      />
    ))
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.primary }}>
      <ScrollView contentContainerStyle={{ padding: 15 }}>
        <View style={{ marginBottom: 20 }}>
          <LgText style={{ fontSize: 24, fontWeight: 'bold' }}>Order Details</LgText>
          <Text style={{ fontSize: 16, marginTop: 5 }}>Order No: {order._id}</Text>
        </View>

        <Divider />
        
        <View style={{ marginVertical: 5 }}>
          {order.items.map((item, index) => (
            <View key={index} style={{ borderRadius: 10, padding: 10 }}>
              <View style={{ position: 'relative' }}>
                {/* Check if the current user has reviewed the product */}
                {order.status === 'Delivered' && (!item.reviews || !Array.isArray(item.reviews) || !item.reviews.find(review => review.user === user._id)) && (
                  <TouchableOpacity
                    style={{
                      position: 'absolute',
                      top: 10,
                      right: 10,
                      zIndex: 1,
                      backgroundColor: 'green',
                      paddingVertical: 4,
                      paddingHorizontal: 8,
                      borderRadius: 20,
                    }}
                    onPress={() => navigation.navigate('Reviews', { item, orderId: order._id })} 
                  >
                    <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#fff' }}>Rate Product</Text>
                  </TouchableOpacity>
                )}

                {/* Display the rating stars if the user has reviewed */}
                {item.reviews && Array.isArray(item.reviews) && item.reviews.find(review => review.user === user._id) && (
                  <View
                    style={{
                      position: 'absolute',
                      top: 10,
                      right: 10,
                      zIndex: 1,
                      backgroundColor: '#f39c12',
                      paddingVertical: 4,
                      paddingHorizontal: 8,
                      borderRadius: 20,
                    }}
                  >
                    <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#fff' }}>
                      {renderStars(item.reviews.find(review => review.user === user._id).rating)}
                    </Text>
                  </View>
                )}

                <CartTile
                  image={item?.image}
                  text={item?.product}
                  variant={`${item?.size} ${item?.color}`}
                  category={item?.category}
                  price={`₱${item?.price}`}
                  count={item?.quantity}
                />
              </View>
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
      </ScrollView>
    </SafeAreaView>
  )
}

export default OrderDetails
