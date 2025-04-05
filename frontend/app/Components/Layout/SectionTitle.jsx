import { View } from 'react-native'
import React from 'react'
import LgText from '../Labels/LgText'

const SectionTitle = ({ text }) => {
  return (
    <View style={{ marginVertical: 5 }}>
      <LgText>{text}</LgText>
    </View>
  )
}

export default SectionTitle
