import React, { useState } from 'react'
import { View, Text, Pressable } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons' // Expo Icons

const CustomCheckbox = ({ label, checked, onChange }) => {
  return (
    <Pressable
      onPress={onChange}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
      }}
    >
      <View
        style={{
          width: 16,
          height: 16,
          borderRadius: 5,
          borderWidth: 1,
          borderColor: checked ? 'black' : 'gray',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 5,
        }}
      >
        {checked && <Ionicons name="checkmark" size={12} color="black" />}
      </View>
      <Text style={{ fontSize: 12 }}>{label}</Text>
    </Pressable>
  )
}

const Checkbox = ({ text }) => {
  const [isChecked, setIsChecked] = useState(false)

  return (
    <View>
      <CustomCheckbox
        label={text}
        checked={isChecked}
        onChange={() => setIsChecked(!isChecked)}
      />
    </View>
  )
}

export default Checkbox
