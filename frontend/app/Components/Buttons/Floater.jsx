import { View, Text, TouchableWithoutFeedback } from 'react-native'
import React from 'react'
import colors from '../../styles/colors'

const Floater = ({ onPress, title, icon }) => {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View
        style={{
          backgroundColor: colors.primary,
          borderRadius: 10,
          alignSelf: 'flex-start',
          boxShadow: '1px 1px 0px 2px rgba(0,0,0,1)',
          height: 40,
          width: 40,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {icon}
        {title ? (
          <Text style={{ color: 'white', fontWeight: 'bold' }}>{title}</Text>
        ) : null}
      </View>
    </TouchableWithoutFeedback>
  )
}

export default Floater
