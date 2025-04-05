import { View } from 'react-native'
import React, { useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import colors from '../../styles/colors'
import BottomNavigation from '../../Components/Buttons/BottomNavigation'
import LgText from '../../Components/Labels/LgText'
import { default as Text } from '../../Components/Labels/CustomText'
import Divider from '../../Components/Labels/Divider'
import CartTile from '../../Components/Layout/CartTile'
import { getCartItems } from '../../Database/Database'

const Cart = ({ navigation }) => {
  const [cartItems, setCartItems] = React.useState([])

  const fetchCartItems = async () => {
    try {
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
        <LgText>Shopping Cart</LgText>
        <Text style={{ fontSize: 12 }}>2 Items</Text>
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
