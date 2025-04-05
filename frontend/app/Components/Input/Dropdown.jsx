import React from 'react'
import { View, StyleSheet, TouchableWithoutFeedback } from 'react-native'
import RNPickerSelect from 'react-native-picker-select'
import { Ionicons } from '@expo/vector-icons'
import colors from '../../styles/colors'
import { default as Text } from '../Labels/CustomText'

const Dropdown = ({ label, items, selectedValue, onValueChange }) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <RNPickerSelect
        onValueChange={onValueChange}
        items={items}
        value={selectedValue}
        style={pickerSelectStyles}
        useNativeAndroidPickerStyle={false}
        placeholder={{ label: 'Select an option...', value: '' }}
        Icon={() => (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              padding: 4,
              borderRadius: 100,
              // backgroundColor: colors.quinary,
            }}
          >
            <Ionicons name="chevron-down" size={14} color={colors.black} />
          </View>
        )}
        touchableWrapper={TouchableWithoutFeedback}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    position: 'absolute',
    top: -8,
    left: 0,
    fontSize: 10,
    fontWeight: '300',
    marginBottom: 5,
    color: colors.black,
    backgroundColor: colors.primary,
    paddingHorizontal: 5,
  },
})

const pickerSelectStyles = {
  inputIOS: {
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderColor: colors.black,
    color: colors.black,
    borderRadius: 8,
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderColor: colors.black,
    borderRadius: 8,
    color: colors.black,
    borderBottomWidth: 1,
  },
  placeholder: {
    color: colors.black, // 🔥 Set the placeholder color explicitly
    fontSize: 16,
    fontFamily: 'DefaultFont',
  },
  iconContainer: {
    top: 10,
    right: 12,
  },
}

export default Dropdown
