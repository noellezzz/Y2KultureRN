import { PixelRatio } from 'react-native'
import React from 'react'
import { default as Text } from './CustomText'

const scaleFont = size => size * PixelRatio.getFontScale()

const LgText = ({ text, style, children }) => {
  return (
    <Text style={[{ fontSize: scaleFont(20), fontWeight: 500 }, style]}>
      {text || children}
    </Text>
  )
}

export default LgText
