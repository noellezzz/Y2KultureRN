import { View, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { Dimensions } from 'react-native'
import Feather from '@expo/vector-icons/Feather'
import { default as Text } from '../Labels/CustomText'

const screenWidth = Dimensions.get('window').width

const ProductTile = ({ title, price, image, navigation, id }) => {
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('Product', { id: id })}
    >
      <View
        style={{
          height: 220,
          width: screenWidth * 0.5 - 20,
        }}
      >
        <View
          style={{
            borderWidth: 2,
            borderRadius: 20,
            height: '80%',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <View
            style={{
              position: 'absolute',
              right: 10,
              top: 10,
              zIndex: 10,
              backgroundColor: 'black',
              padding: 5,
              borderRadius: 50,
            }}
          >
            <Feather name="heart" size={20} color="white" />
          </View>
          <Image
            source={{ uri: image }}
            style={{ width: '100%', height: '100%', resizeMode: 'cover' }}
          />
        </View>
        <View style={{ padding: 5 }}>
          <Text style={{ fontSize: 16 }}>{title}</Text>
          <Text style={{ fontSize: 12 }}>{price}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default ProductTile
