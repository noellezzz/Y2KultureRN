import { TouchableWithoutFeedback, View } from 'react-native'
import React from 'react'
import { default as Text } from '../Labels/CustomText'
import colors from '../../styles/colors'

const ToggleButton = ({ items, selectedValue, setSelectedValue }) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignSelf: 'flex-start',
        borderWidth: 1,
        borderRadius: 8,
        borderColor: 'black',
        padding: 2,
      }}
    >
      {items.map((item, index) => (
        <TouchableWithoutFeedback
          onPress={() => setSelectedValue(item)}
          key={index}
        >
          <Text
            style={{
              padding: 10,
              backgroundColor:
                selectedValue === item ? colors.quinary : 'transparent',
              color: selectedValue === item ? 'white' : 'black',
              borderRadius: 8,
              fontSize: 12,
            }}
          >
            {item}
          </Text>
        </TouchableWithoutFeedback>
      ))}
    </View>
  )
}

export default ToggleButton
