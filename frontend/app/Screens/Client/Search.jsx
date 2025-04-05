import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import colors from '../../styles/colors'
import BottomNavigation from '../../Components/Buttons/BottomNavigation'

const Search = ({ navigation }) => {
  return (
    <SafeAreaView
      style={{
        position: 'relative',
        backgroundColor: colors.primary,
        flex: 1,
        width: '100%',
      }}
    >
      <View style={{ width: '100%', padding: 5, flex: 1 }}>
        <Text>Sample</Text>
      </View>

      <BottomNavigation navigation={navigation} />
    </SafeAreaView>
  )
}

export default Search
