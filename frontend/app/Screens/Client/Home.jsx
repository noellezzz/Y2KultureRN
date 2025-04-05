import {
  Image,
  ScrollView,
  TextInput,
  View,
  TouchableOpacity,
} from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import colors from '../../styles/colors'
import BottomNavigation from '../../Components/Buttons/BottomNavigation'
import { default as Text } from '../../Components/Labels/CustomText'
import IconButton from '../../Components/Buttons/IconButton'
import LgTile from '../../Components/Layout/LgTile'
import SectionTitle from '../../Components/Layout/SectionTitle'
import AntDesign from '@expo/vector-icons/AntDesign'
import IconInput from '../../Components/Input/IconInput'
import Ionicons from '@expo/vector-icons/Ionicons'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5'
import ProductTile from '../../Components/Layout/ProductTile'
import hanni from '../../../assets/images/hanni.jpg'
import model4 from '../../../assets/images/model4.jpg'
import model5 from '../../../assets/images/model5.jpg'
import model6 from '../../../assets/images/model6.jpg'
import Avatar from '../../Components/Layout/Avatar'
// import Products from '../../Data/Products'
import api from '../../Utils/axiosInstance'
import { useSelector } from 'react-redux'

const Home = ({ navigation }) => {
  const [products, setProducts] = useState([])
  const user = useSelector(state => state.user.user)

  // console.log('User:', user)

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products')
      setProducts(response.data)
    } catch (e) {
      console.log('Error fetching products:', e)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  return (
    <SafeAreaView
      style={{
        position: 'relative',
        backgroundColor: colors.primary,
        flex: 1,
        width: '100%',
      }}
    >
      <ScrollView>
        <View style={{ width: '100%', padding: 10, flex: 1 }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
              gap: 10,
              height: 60,
            }}
          >
            {user?.image ? (
              <Avatar image={{ uri: user?.image }} />
            ) : (
              <View
                style={{
                  borderWidth: 2,
                  width: 50,
                  height: 50,
                  borderRadius: '100%',
                  overflow: 'hidden',
                  backgroundColor: colors.quinary,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Text>
                  {`${user?.firstName?.charAt(0)?.toUpperCase() || ''}${user?.lastName?.charAt(0)?.toUpperCase() || ''}`}
                </Text>
              </View>
            )}

            <View>
              <Text>Hi, {user?.firstName}</Text>
              <Text>Welcome Back!</Text>
            </View>
          </View>
          <View style={{ marginVertical: 10 }}>
            <View style={{ marginVertical: 10 }}>
              <TouchableOpacity
                onPress={() => navigation.navigate('Search')}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  zIndex: 1,
                }}
              />
              <IconInput
                icon={<AntDesign name="search1" size={24} color="black" />}
                placeholder="Search"
                editable={false}
              />
            </View>
          </View>
          <View style={{ marginVertical: 5 }}>
            <SectionTitle text="Categories" />
            <View style={{ marginVertical: 3, flexDirection: 'row', gap: 5 }}>
              <IconButton
                text="Casual"
                color={colors.quinary}
                icon={<Ionicons name="shirt" size={20} color="black" />}
              />
              <IconButton
                text="Formal"
                color={colors.quaternary}
                icon={
                  <MaterialCommunityIcons
                    name="shoe-formal"
                    size={20}
                    color="black"
                  />
                }
              />
            </View>
            <View style={{ marginVertical: 3, flexDirection: 'row', gap: 5 }}>
              <IconButton
                text="Casual"
                color={colors.senary}
                icon={
                  <MaterialIcons
                    name="sports-baseball"
                    size={24}
                    color="black"
                  />
                }
              />
              <IconButton
                text="Others"
                color={colors.septary}
                icon={<FontAwesome5 name="vest" size={20} color="black" />}
              />
            </View>
          </View>
          <View style={{ marginVertical: 5 }}>
            <SectionTitle text="Collections" />
            <ScrollView
              style={{ paddingTop: 5, paddingBottom: 15, paddingHorizontal: 5 }}
              horizontal={true}
            >
              <LgTile
                text="Collection Series"
                category="Formal Wear"
                image={model5}
                newItem={true}
              />
              <LgTile
                text="Collection Series"
                category="Casual Wear"
                image={model6}
                best={true}
              />
              <LgTile
                text="Collection Series"
                category="Sports Wear"
                image={model4}
                sale={true}
              />
            </ScrollView>
          </View>
          <View>
            <SectionTitle text="Top Seller's" />
            <View
              style={{
                flexWrap: 'wrap',
                flexDirection: 'row',
                gap: 10,
                marginTop: 10,
              }}
            >
              {products.map((product, index) => (
                <ProductTile
                  key={index}
                  id={product._id}
                  title={product.name}
                  price={product.price}
                  image={product.image}
                  navigation={navigation}
                />
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
      <BottomNavigation navigation={navigation} />
    </SafeAreaView>
  )
}

export default Home
