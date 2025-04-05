import { View, Text, Image } from 'react-native'
import React from 'react'

const Avatar = ({ image }) => {
  return (
    <View
      style={{
        borderWidth: 2,
        width: 50,
        height: 50,
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
