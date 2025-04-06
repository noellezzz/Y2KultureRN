import React, { useState } from 'react'
import { View, TextInput, TouchableOpacity, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { default as Text } from '../../../Components/Labels/CustomText'
import LgText from '../../../Components/Labels/LgText'
import Divider from '../../../Components/Labels/Divider'
import colors from '../../../styles/colors'
import { Ionicons } from '@expo/vector-icons'
import CartTile from '../../../Components/Layout/CartTile'

const Reviews = ({ route, navigation }) => {
  const { item } = route.params
  const [rating, setRating] = useState(0)
  const [review, setReview] = useState('')

  const handleSubmit = () => {
    console.log('Product:', item?.product)
    console.log('Rating:', rating)
    console.log('Review:', review)


    navigation.goBack()
  }

  const renderStars = () => {
    return [...Array(5)].map((_, index) => (
      <TouchableOpacity key={index} onPress={() => setRating(index + 1)}>
        <Ionicons
          name={index < rating ? 'star' : 'star-outline'}
          size={24}
          color="#f1c40f"
          style={{ marginRight: 4 }}
        />
      </TouchableOpacity>
    ))
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.primary }}>
      <ScrollView contentContainerStyle={{ padding: 15 }}>
        <LgText style={{ fontSize: 24, fontWeight: 'bold', marginVertical: 10 }}>Rate Product</LgText>
        <Divider />

        <View style={{ marginVertical: 10 }}>
        <CartTile
          image={item?.image}
          text={item?.product}
          variant={`${item?.size} ${item?.color}`}
          category={item?.category}
          price={`₱${item?.price}`}
          count={item?.quantity}
        />
        </View>

        <View style={{ flexDirection: 'row', marginVertical: 10 }}>
          {renderStars()}
        </View>

        <TextInput
          style={{
            borderWidth: 1,
            borderColor: '#000',
            borderRadius: 10,
            padding: 10,
            height: 100,
            textAlignVertical: 'top',
          }}
          multiline
          numberOfLines={4}
          placeholder="Write a review (optional)"
          value={review}
          onChangeText={setReview}
        />

        <TouchableOpacity
          style={{
            backgroundColor: '#27ae60',
            paddingVertical: 12,
            borderRadius: 10,
            alignItems: 'center',
            marginTop: 20,
          }}
          onPress={handleSubmit}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>
            Submit Review
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Reviews
