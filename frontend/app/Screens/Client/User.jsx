import { Image, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import colors from '../../styles/colors'
import BottomNavigation from '../../Components/Buttons/BottomNavigation'
import { default as Text } from '../../Components/Labels/CustomText'
import hanni from '../../../assets/images/hanni.jpg'
import AntDesign from '@expo/vector-icons/AntDesign'
import Entypo from '@expo/vector-icons/Entypo'
import ItemButton from '../../Components/Buttons/ItemButton'
import Octicons from '@expo/vector-icons/Octicons'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import Divider from '../../Components/Labels/Divider'
import mockUser from '../../Data/UserInfo'
import { useSelector } from 'react-redux'
import Avatar from '../../Components/Layout/Avatar'

const User = ({ navigation }) => {
  const user = useSelector(state => state.user.user)
  // const [user, setUser] = useState({
  //   name: '',
  //   role: '',
  //   phone: '',
  //   email: '',
  // })

  // useEffect(() => {
  //   setUser(mockUser)
  // }, [])

  return (
    <SafeAreaView
      style={{
        position: 'relative',
        backgroundColor: colors.primary,
        flex: 1,
        width: '100%',
      }}
    >
      <View style={{ width: '100%', padding: 10, flex: 1 }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: 10,
            borderRadius: 10,
          }}
        >
          {user?.image ? (
            <View style={{ marginRight: 10 }}>
              <Avatar height={80} width={80} image={{ uri: user?.image }} />
            </View>
          ) : (
            <View
              style={{
                borderWidth: 2,
                width: 80,
                height: 80,
                borderRadius: '100%',
                overflow: 'hidden',
                backgroundColor: colors.quinary,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 10,
              }}
            >
              <Text>
                {`${user?.firstName?.charAt(0)?.toUpperCase() || ''}${user?.lastName?.charAt(0)?.toUpperCase() || ''}`}
              </Text>
            </View>
          )}
          <View>
            <Text style={{ fontSize: 22 }}>
              {user?.firstName + ' ' + user?.lastName || 'No Name'}
            </Text>
            <Text style={{ color: '#5c5c5c' }}>{user?.role}</Text>
          </View>
          <TouchableOpacity
            style={{
              justifyContent: 'center',
              alignItems: 'flex-end',
              flex: 1,
            }}
            onPress={() => navigation.navigate('EditUser')}
          >
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
              }}
            >
              <AntDesign name="edit" size={24} color="black" />
            </View>
          </TouchableOpacity>
        </View>
        <View style={{ marginVertical: 10, gap: 10 }}>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <AntDesign name="phone" size={18} color="black" />
            <Text>{user?.phone || 'Not Set'}</Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <Entypo name="email" size={18} color="black" />
            <Text>{user?.email}</Text>
          </View>
        </View>
        <View
          style={{
            borderTopWidth: 1,
            borderBottomWidth: 1,
            height: 100,
            flexDirection: 'row',
            marginVertical: 10,
          }}
        >
          <View
            style={{
              borderRightWidth: 1,
              width: '50%',
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 18 }}>
              ${user?.wallet ? user.wallet.toFixed(2) : '0.00'}
            </Text>
            <Text style={{ fontSize: 12 }}>Wallet</Text>
          </View>
          <View
            style={{
              width: '50%',
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 18 }}>{user?.orders?.length}</Text>
            <Text style={{ fontSize: 12 }}>Orders</Text>
          </View>
        </View>
        <View>
          <ItemButton
            icon={<AntDesign name="hearto" size={24} color="black" />}
            text="Your Favorites"
          />
          <ItemButton
            onPress={() => navigation.navigate('Orders')}
            text="Your Orders"
            icon={<AntDesign name="shoppingcart" size={24} color="black" />}
          />
          <ItemButton
            text="Promotions"
            icon={
              <MaterialCommunityIcons name="sale" size={24} color="black" />
            }
          />
          <ItemButton
            text="Settings"
            icon={<Octicons name="gear" size={24} color="black" />}
          />
          <View style={{ marginVertical: 20 }}>
            <Divider />
          </View>

          <ItemButton
            onPress={() => navigation.navigate('Login')}
            text="Logout"
            icon={<AntDesign name="logout" size={24} color="black" />}
          />
        </View>
      </View>

      <BottomNavigation navigation={navigation} />
    </SafeAreaView>
  )
}

export default User
