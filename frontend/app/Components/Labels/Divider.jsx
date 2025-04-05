import { View, Text } from 'react-native'
import React from 'react'
import colors from '../../styles/colors'

const Divider = ({ text }) => {
  return (
    <View
      style={{
        width: '100%',
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <View
        style={{
          borderBottomWidth: 1,
          borderColor: 'gray',
          position: 'relative',
          width: '100%',
        }}
      ></View>
      {text && (
        <Text
          style={{
            position: 'absolute',
            backgroundColor: 'red',
            backgroundColor: colors.primary,
            padding: 5,
            paddingHorizontal: 10,
            fontSize: 12,
          }}
        >
          {text}
        </Text>
      )}
    </View>
  )
}

export default Divider
