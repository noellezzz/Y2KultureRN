import { TouchableOpacity, View } from 'react-native'
import React, { useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import colors from '../../styles/colors'
import BottomNavigation from '../../Components/Buttons/BottomNavigation'
import LgText from '../../Components/Labels/LgText'
import { default as Text } from '../../Components/Labels/CustomText'
import Divider from '../../Components/Labels/Divider'
import CartTile from '../../Components/Layout/CartTile'
import {
  clearCart,
  getCartItems,
  initilizeDatabase,
} from '../../Database/Database'
import { useSelector, useDispatch } from 'react-redux'
import { updateUserData } from '../../States/Slice/userSlice'
import api from '../../Utils/axiosInstance'

const Cart = ({ navigation }) => {
  const [cartItems, setCartItems] = React.useState([])
  const user = useSelector(state => state.user.user)
  const dispatch = useDispatch()

  const fetchCartItems = async () => {
    try {
      await initilizeDatabase()
      const items = await getCartItems()
      setCartItems(items)
      console.log('Fetched cart items:', items)
    } catch (error) {
      console.error('Error fetching cart items:', error)
    }
  }
  useEffect(() => {
    fetchCartItems()
  }, [])

  const handleCheckout = async () => {
    const formData = {
      date: new Date().toLocaleDateString(),
      total: cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0,
      ),
      status: 'Pending',
      deliveryAddress: '123 Main St, City, Country',
      items: cartItems,
    }
    try {
      const response = await api.put(`/auth/${user._id}`, {
        newOrder: formData,
      })
      console.log(response.data)
      dispatch(updateUserData(response.data.user))
      clearCart()
      navigation.navigate('Orders')
    } catch (e) {
      console.log(e)
    }
  }

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
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <LgText>Shopping Cart</LgText>
          <TouchableOpacity onPress={() => handleCheckout()}>
            <Text>Checkout</Text>
          </TouchableOpacity>
        </View>

        <Text style={{ fontSize: 12 }}>{cartItems?.length} Items</Text>
        <View style={{ marginVertical: 10 }}>
          <Divider />
        </View>
        <View style={{ gap: 10 }}>
          {cartItems.map((item, index) => (
            <CartTile
              key={index}
              text={item.product}
              price={`$${item.price}`}
              count={item.quantity}
              category={item.category}
              image={item.image}
            />
          ))}
        </View>
      </View>

      <BottomNavigation navigation={navigation} />
    </SafeAreaView>
  )
}

export default Cart
