import { View } from 'react-native'
import React from 'react'
import colors from '../../styles/colors'
import { default as Text } from '../Labels/CustomText'

const IconButton = ({ text, icon, color }) => {
  return (
    <View
      style={{
        padding: 15,
        backgroundColor: colors.white,
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        borderWidth: 1,
        position: 'relative',
      }}
    >
      <View
        style={{
          position: 'absolute',
          height: 30,
          width: 30,
          borderWidth: 1,
          alignSelf: 'flex-start',
          left: 10,
          borderRadius: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: color || colors.primary,
        }}
      >
        {icon}
      </View>
      <Text>{text}</Text>
    </View>
  )
}

export default IconButton
