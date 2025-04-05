import { View, TextInput } from 'react-native'
import React from 'react'
import { default as Text } from '../Labels/CustomText'
import colors from '../../styles/colors'

const InputField = ({
  value,
  onChangeText,
  errors,
  label = 'Name',
  keyboardType,
  secureEntry = false,
}) => {
  return (
    <View style={{ position: 'relative', width: '100%' }}>
      <View
        style={{
          position: 'absolute',
          paddingHorizontal: 8,
          backgroundColor: colors.primary,
          top: -8,
          left: 10,
          zIndex: 10,
        }}
      >
        <Text style={{ fontSize: 12 }}>{label}</Text>
      </View>
      <TextInput
        style={{
          borderRadius: 10,
          padding: 10,
          paddingVertical: 15,
          fontSize: 16,
          borderWidth: 1,
        }}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        secureTextEntry={secureEntry}
      />
      {errors && errors.productName && <Text text={errors.productName} />}
    </View>
  )
}

export default InputField
