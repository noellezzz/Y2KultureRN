import { Image, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { default as Text } from '../../../Components/Labels/CustomText'
import { SafeAreaView } from 'react-native-safe-area-context'
import colors from '../../../styles/colors'
import LgText from '../../../Components/Labels/LgText'
import Divider from '../../../Components/Labels/Divider'
import hanni from '../../../../assets/images/hanni.jpg'
import Feather from '@expo/vector-icons/Feather'
import InputField from '../../../Components/Input/InputField'
import PrimeButton from '../../../Components/Buttons/PrimeButton'
import { useSelector } from 'react-redux'

const Edit = ({ navigation }) => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const user = useSelector(state => state.user.user)

  useEffect(() => {
    setEmail(user?.email || '')
    setFirstName(user?.firstName || '')
    setLastName(user?.lastName || '')
    // setPassword(user?.password || '')
    setName(user?.name || '')
    setPhone(user?.phone || '')
  }, [user])

  return (
    <SafeAreaView
      style={{
        position: 'relative',
        backgroundColor: colors.primary,
        flex: 1,
        width: '100%',
        padding: 10,
      }}
    >
      <LgText>Edit Profile</LgText>
      <View style={{ marginVertical: 10 }}>
        <Divider />
      </View>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          height: 200,
        }}
      >
        <View
          style={{
            height: 170,
            width: 170,
            borderRadius: '100%',
            borderWidth: 2,
            // overflow: 'hidden',
            position: 'relative',
          }}
        >
          <View style={{ borderRadius: '100%', overflow: 'hidden' }}>
            {user?.image ? (
              <Avatar image={user?.image} />
            ) : (
              <View
                style={{
                  borderWidth: 2,
                  width: '100%',
                  height: '100%',
                  borderRadius: '100%',
                  overflow: 'hidden',
                  backgroundColor: colors.quinary,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 10,
                }}
              >
                <Text style={{ fontSize: 40 }}>
                  {`${user?.firstName?.charAt(0)?.toUpperCase() || ''}${user?.lastName?.charAt(0)?.toUpperCase() || ''}`}
                </Text>
              </View>
            )}
          </View>
          <TouchableOpacity>
            <View
              style={{
                position: 'absolute',
                borderWidth: 1,
                zIndex: 10,
                backgroundColor: colors.quaternary,
                height: 45,
                width: 45,
                bottom: 0,
                right: 0,
                borderRadius: '100%',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Feather name="edit-2" size={24} color="black" />
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ marginVertical: 10, gap: 20 }}>
        <View style={{ flexDirection: 'row' }}>
          <View
            style={{
              width: '49%',
              padding: 5,
              paddingLeft: 0,
              paddingVertical: 0,
            }}
          >
            <InputField
              label="First Name"
              value={firstName}
              onChangeText={setFirstName}
              keyboardType="default"
              autoCapitalize="none"
            />
          </View>
          <View
            style={{
              width: '49%',
              padding: 5,
              paddingRight: 0,
              paddingVertical: 0,
            }}
          >
            <InputField
              label="Last Name"
              value={lastName}
              onChangeText={setLastName}
              keyboardType="default"
              autoCapitalize="none"
            />
          </View>
        </View>
        <InputField
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="default"
        />
        <InputField
          label="Phone"
          value={phone}
          onChangeText={setPhone}
          keyboardType="numeric"
        />
      </View>
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          height: 100,
          zIndex: 100,
          width: '105%',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
          padding: 10,
          gap: 10,
        }}
      >
        <PrimeButton text="Update" />
        <PrimeButton
          text="Cancel"
          styles={{ backgroundColor: 'white' }}
          onPress={() => navigation.goBack()}
        />
      </View>
    </SafeAreaView>
  )
}

export default Edit
