import { View, Text, Image } from 'react-native'
import React from 'react'

const Avatar = ({ image, width = 50, height = 50 }) => {
  return (
    <View
      style={{
        borderWidth: 2,
        width: width,
        height: height,
        borderRadius: '100%',
        overflow: 'hidden',
      }}
    >
      <Image
        source={image}
        style={{ width: '100%', height: '100%', resizeMode: 'contain' }}
      />
    </View>
  )
}

export default Avatar
