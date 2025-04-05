import { Image, View } from 'react-native'
import React from 'react'
import colors from '../../styles/colors'
import { default as Text } from '../Labels/CustomText'
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons'
import AntDesign from '@expo/vector-icons/AntDesign'
import Feather from '@expo/vector-icons/Feather'

const LgTile = ({ text, category, image, sale, best, newItem }) => {
  return (
    <View
      style={{
        boxShadow: '2px 2px 0px 4px rgba(0,0,0,1)',
        width: 270,
        height: 200,
        borderRadius: 20,
        marginRight: 20,
      }}
    >
      <View
        style={{
          borderBottomWidth: 1,
          height: '75%',
          backgroundColor: colors.white,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {newItem && (
          <View
            style={{
              position: 'absolute',
              backgroundColor: colors.quaternary,
              zIndex: 10,
              padding: 10,
              paddingVertical: 5,
              right: 10,
              top: 10,
              borderRadius: 50,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 5,
            }}
          >
            <SimpleLineIcons name="fire" size={12} color="black" />
            <Text style={{ fontSize: 12 }}>New</Text>
          </View>
        )}
        {sale && (
          <View
            style={{
              position: 'absolute',
              backgroundColor: colors.quinary,
              zIndex: 10,
              padding: 10,
              paddingVertical: 5,
              right: 10,
              top: 10,
              borderRadius: 50,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 5,
            }}
          >
            <Feather name="percent" size={12} color="black" />
            <Text style={{ fontSize: 12 }}>Sale</Text>
          </View>
        )}
        {best && (
          <View
            style={{
              position: 'absolute',
              backgroundColor: colors.senary,
              zIndex: 10,
              padding: 10,
              paddingVertical: 5,
              right: 10,
              top: 10,
              borderRadius: 50,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 5,
            }}
          >
            <AntDesign name="staro" size={12} color="black" />
            <Text style={{ fontSize: 12 }}>Best Seller</Text>
          </View>
        )}

        <Image
          source={image}
          style={{ width: '100%', height: '100%', resizeMode: 'cover' }}
        />
      </View>
      <View style={{ padding: 10 }}>
        <Text>{text}</Text>
        <Text style={{ fontSize: 12, color: '#7d7d7d' }}>{category}</Text>
      </View>
    </View>
  )
}

export default LgTile
