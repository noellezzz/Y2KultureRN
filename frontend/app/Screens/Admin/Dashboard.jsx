import { View, Text, Button } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Floater from '../../Components/Buttons/Floater'
import Feather from '@expo/vector-icons/Feather'
import colors from '../../styles/colors'

const Dashboard = ({ navigation }) => {
  return (
    <SafeAreaView
      style={{ backgroundColor: colors.primary, height: '100%', padding: 8 }}
    >
      <Floater
        icon={<Feather name="menu" size={16} color="black" />}
        onPress={() => navigation.toggleDrawer()}
      />
    </SafeAreaView>
  )
}

export default Dashboard
