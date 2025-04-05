import { View, TextInput } from 'react-native'
import React from 'react'
import colors from '../../styles/colors'

const IconInput = ({ icon, placeholder }) => {
  return (
    <View
      style={{
        borderRadius: 20,
        boxShadow: '1px 1px 0px 2px rgba(0,0,0,1)',
        backgroundColor: colors.white,
        padding: 10,
        paddingVertical: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}
    >
      <TextInput style={{ width: '85%' }} placeholder={placeholder} />

      {icon && (
        <View
          style={{
            borderWidth: 1,
            width: 40,
            height: 40,
            borderRadius: '100%',
            alignSelf: 'flex-end',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: colors.quaternary,
          }}
        >
          {icon}
        </View>
      )}
    </View>
  )
}

export default IconInput
