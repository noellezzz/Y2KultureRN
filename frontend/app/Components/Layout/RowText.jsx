import { View, Text } from 'react-native'
import React from 'react'

const RowText = ({ label, name }) => {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <View style={{ width: 60 }}>
        <Text>{label}</Text>
      </View>

      <Text style={{ fontFamily: 'DefaultLightFont', fontSize: 14 }}>
        {name}
      </Text>
    </View>
  )
}

export default RowText
