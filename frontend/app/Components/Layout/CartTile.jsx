import { Image, View } from 'react-native'
import React from 'react'
import { default as Text } from '../Labels/CustomText'
import hanni from '../../../assets/images/hanni.jpg'

const CartTile = ({
  text = 'Sample',
  price = '$9.99',
  count = 1,
  category = 'Formal Wear',
}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        height: 100,
        borderWidth: 1,
        borderRadius: 20,
        overflow: 'hidden',
        padding: 10,
      }}
    >
      <View
        style={{
          width: 80,
          height: 80,
          marginRight: 10,
          overflow: 'hidden',
          borderRadius: 20,
        }}
      >
        <Image
          source={hanni}
          style={{ height: '100%', width: '100%', resizeMode: 'cover' }}
        />
      </View>
      <View
        style={{
          flexDirection: 'column',
          justifyContent: 'space-between',
          flex: 1,
        }}
      >
        <View>
          <Text style={{ fontSize: 18 }}>{text}</Text>
          <Text style={{ fontSize: 14 }}>{category}</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text>{price}</Text>
          <Text>{count}</Text>
        </View>
      </View>
    </View>
  )
}

export default CartTile
