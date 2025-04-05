import { View, TouchableOpacity } from 'react-native'
import React from 'react'
import colors from '../../styles/colors'
import { default as Text } from '../Labels/CustomText'

const PrimeButton = ({ text, onPress, styles, icon }) => {
  return (
    <TouchableOpacity onPress={onPress} style={{ flex: 1 }}>
      <View
        style={[
          {
            backgroundColor: colors.quaternary,
            padding: 15,
            boxShadow: '1px 1px 0px 2px rgba(0,0,0,1)',
            borderRadius: 10,
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            gap: 10,
          },
          styles,
        ]}
      >
        {icon && icon}
        {text && <Text style={{ textAlign: 'center' }}>{text}</Text>}
      </View>
    </TouchableOpacity>
  )
}

export default PrimeButton
