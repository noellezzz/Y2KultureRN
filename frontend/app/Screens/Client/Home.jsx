import {
  Image,
  ScrollView,
  TextInput,
  View,
  TouchableOpacity,
  Animated,
  Dimensions,
  StyleSheet,
} from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
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
import Slider from '@react-native-community/slider'
import api from '../../Utils/axiosInstance'
import { useSelector } from 'react-redux'

const { width, height } = Dimensions.get('window')

const Home = ({ navigation }) => {
  const [products, setProducts] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 })
  const user = useSelector(state => state.user.user)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const slideAnim = useRef(new Animated.Value(-width * 0.7)).current

  const toggleDrawer = () => {
    if (drawerOpen) {
      // Close drawer
      Animated.timing(slideAnim, {
        toValue: -width * 0.7,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setDrawerOpen(false))
    } else {
      // Open drawer
      setDrawerOpen(true)
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start()
    }
  }

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

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory
      ? product.type === selectedCategory
      : true
    const matchesPrice =
      product.price >= priceRange.min && product.price <= priceRange.max
    return matchesCategory && matchesPrice
  })

  return (
    <SafeAreaView
      style={{
        position: 'relative',
        backgroundColor: colors.primary,
        flex: 1,
        width: '100%',
      }}
    >
      {/* Side Drawer */}
      {drawerOpen && (
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={toggleDrawer}
        />
      )}

      <Animated.View
        style={[styles.drawer, { transform: [{ translateX: slideAnim }] }]}
      >
        <View style={styles.drawerHeader}>
          {user?.image ? (
            <Avatar image={{ uri: user?.image }} size={80} />
          ) : (
            <View
              style={{
                borderWidth: 2,
                width: 80,
                height: 80,
                borderRadius: 40,
                overflow: 'hidden',
                backgroundColor: colors.quinary,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: 20 }}>
                {`${user?.firstName?.charAt(0)?.toUpperCase() || ''}${user?.lastName?.charAt(0)?.toUpperCase() || ''}`}
              </Text>
            </View>
          )}
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 10 }}>
            {user?.firstName} {user?.lastName}
          </Text>
          <Text style={{ fontSize: 14, marginBottom: 20 }}>Hello!</Text>
        </View>

        <View style={styles.drawerContent}>
          <TouchableOpacity
            style={styles.drawerItem}
            onPress={() => {
              toggleDrawer()
              navigation.navigate('Home')
            }}
          >
            <Ionicons name="home" size={24} color="black" />
            <Text style={styles.drawerItemText}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.drawerItem}
            onPress={() => {
              toggleDrawer()
              navigation.navigate('Cart')
            }}
          >
            <Ionicons name="cart" size={24} color="black" />
            <Text style={styles.drawerItemText}>Cart</Text>
          </TouchableOpacity>

          {/* <TouchableOpacity
            style={styles.drawerItem}
            onPress={() => {
              toggleDrawer()
              navigation.navigate('Search')
            }}
          >
            <AntDesign name="search1" size={24} color="black" />
            <Text style={styles.drawerItemText}>Search</Text>
          </TouchableOpacity> */}

          <TouchableOpacity
            style={styles.drawerItem}
            onPress={() => {
              toggleDrawer()
              navigation.navigate('User')
            }}
          >
            <FontAwesome5 name="user" size={24} color="black" />
            <Text style={styles.drawerItemText}>Profile</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

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
            <TouchableOpacity onPress={toggleDrawer}>
              {user?.image ? (
                <Avatar image={{ uri: user?.image }} />
              ) : (
                <View
                  style={{
                    borderWidth: 2,
                    width: 50,
                    height: 50,
                    borderRadius: 25,
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
            </TouchableOpacity>

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
                text="Casual Wear"
                color={
                  selectedCategory === 'Casual Wear'
                    ? colors.secondary
                    : colors.quinary
                }
                onPress={() => {
                  setSelectedCategory(
                    selectedCategory === 'Casual Wear' ? '' : 'Casual Wear',
                  )
                }}
                icon={<Ionicons name="shirt" size={20} color="black" />}
              />
              <IconButton
                text="Formal Wear"
                color={
                  selectedCategory === 'Formal Wear'
                    ? colors.secondary
                    : colors.quaternary
                }
                onPress={() => {
                  setSelectedCategory(
                    selectedCategory === 'Formal Wear' ? '' : 'Formal Wear',
                  )
                }}
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
                text="Sportswear"
                color={
                  selectedCategory === 'Sportswear'
                    ? colors.secondary
                    : colors.senary
                }
                onPress={() => {
                  setSelectedCategory(
                    selectedCategory === 'Sportswear' ? '' : 'Sportswear',
                  )
                }}
                icon={
                  <MaterialIcons
                    name="sports-baseball"
                    size={24}
                    color="black"
                  />
                }
              />
            </View>
          </View>

          <View style={{ marginVertical: 10 }}>
            <SectionTitle text="Price Range" />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Text>Min: ₱{priceRange.min}</Text>
              <Text>Max: ₱{priceRange.max}</Text>
            </View>
            <Slider
              style={{ width: '100%', height: 40 }}
              minimumValue={0}
              maximumValue={1000}
              step={10}
              value={priceRange.max}
              minimumTrackTintColor={colors.secondary}
              maximumTrackTintColor={colors.quinary}
              onSlidingComplete={value =>
                setPriceRange({ ...priceRange, max: value })
              }
            />
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
              {filteredProducts.map((product, index) => (
                <ProductTile
                  key={index}
                  id={product._id}
                  title={product.name}
                  price={product.price}
                  type={product.type}
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

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 10,
  },
  drawer: {
    position: 'absolute',
    width: width * 0.7,
    height: '100%',
    backgroundColor: colors.primary,
    zIndex: 20,
    shadowColor: '#000',
    shadowOffset: { width: 5, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
  },
  drawerHeader: {
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.secondary,
  },
  drawerContent: {
    padding: 15,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  drawerItemText: {
    fontSize: 16,
    marginLeft: 15,
  },
})

export default Home
