import { TouchableOpacity } from 'react-native'
import React from 'react'
import { default as Text } from '../Labels/CustomText'

const ItemButton = ({ text, icon, onPress }) => {
  return (
    <TouchableOpacity
      style={{
        padding: 10,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
      }}
      onPress={onPress}
    >
      {icon && icon}
      {text && <Text style={{ color: 'black' }}>{text}</Text>}
    </TouchableOpacity>
  )
}

export default ItemButton
