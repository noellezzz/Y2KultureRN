import {
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Alert,
} from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { default as Text } from '../../../Components/Labels/CustomText'
import colors from '../../../styles/colors'
import AntDesign from '@expo/vector-icons/AntDesign'
import LgText from '../../../Components/Labels/LgText'
import Ionicons from '@expo/vector-icons/Ionicons'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import PrimeButton from '../../../Components/Buttons/PrimeButton'
import api from '../../../Utils/axiosInstance'
import { createCartItem, initilizeDatabase } from '../../../Database/Database'
// import { getAll } from '../../../Database/database'

const Index = ({ route, navigation }) => {
  const { id } = route.params || {}
  const [products, setProducts] = useState({})
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedSize, setSelectedSize] = useState(null)
  const [selectedColor, setSelectedColor] = useState(null)
  const [quantity, setQuantity] = useState(1)

  const fetchProducts = async () => {
    try {
      const response = await api.get(`/products/${id}`)
      const data = response.data
      setProducts(data)
      console.log(data)
    } catch (e) {
      console.log('Error fetching products:', e)
    }
  }

  const handleAddToCart = async () => {
    try {
      // Validate selections before adding to cart
      if (!selectedSize || !selectedColor) {
        Alert.alert('Selection Required', 'Please select size and color')
        return
      }

      // Find the specific stock item
      const selectedStockItem = products.stock.find(
        item => item.color === selectedColor && item.size === selectedSize,
      )

      // Check if stock is available
      if (!selectedStockItem || selectedStockItem.quantity < quantity) {
        Alert.alert(
          'Insufficient Stock',
          `Only ${selectedStockItem?.quantity || 0} items available in this size and color`,
        )
        return
      }

      const formData = {
        productId: products._id,
        product: products.name,
        price: products.price,
        image: products.image,
        selectedSize,
        selectedColor,
        quantity,
      }
      // console.log(formData)
      await initilizeDatabase()
      console.log('Creating cart item:', formData)
      createCartItem(formData)
      // Uncomment and implement actual cart addition logic
      // await api.post('/cart', formData)
      navigation.navigate('Cart')
    } catch (e) {
      console.log('Error adding to cart:', e)
      Alert.alert('Error', 'Could not add item to cart')
    }
  }

  const incrementQuantity = () => {
    const selectedStockItem = products.stock.find(
      item => item.color === selectedColor && item.size === selectedSize,
    )

    if (selectedStockItem && quantity < selectedStockItem.quantity) {
      setQuantity(prev => prev + 1)
    } else {
      Alert.alert(
        'Maximum Stock Reached',
        'Cannot add more than available stock',
      )
    }
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1)
    }
  }

  useEffect(() => {
    console.log('Product ID:', id)
    fetchProducts()

    // console.log(getAll())
  }, [])

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
      <View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <View
              style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}
            >
              <AntDesign name="arrowleft" size={24} color="black" />
              <LgText>Products</LgText>
            </View>
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', gap: 10, paddingRight: 10 }}>
            <Ionicons name="bag-handle-outline" size={24} color="black" />
            <AntDesign name="hearto" size={24} color="black" />
          </View>
        </View>
      </View>
      <View style={{ marginVertical: 10, position: 'relative' }}>
        <Image
          source={{ uri: products?.image }}
          style={{
            width: '100%',
            height: 400,
            resizeMode: 'cover',
            borderRadius: 20,
            borderWidth: 2,
          }}
        />
        <View
          style={{
            position: 'absolute',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            zIndex: 10,
            width: '100%',
            height: 60,
            bottom: 10,
            paddingHorizontal: 20,
          }}
        >
          <TouchableOpacity
            style={{
              backgroundColor: 'white',
              padding: 10,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 5,
              borderRadius: 20,
              boxShadow: '1px 1px 0px 2px rgba(0,0,0,1)',
            }}
          >
            <MaterialCommunityIcons
              name="cards-variant"
              size={16}
              color="black"
            />
            <Text style={{ fontSize: 12 }}>Find Similar</Text>
          </TouchableOpacity>
          <View
            style={{
              backgroundColor: 'white',
              padding: 10,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 5,
              borderRadius: 20,
              boxShadow: '1px 1px 0px 2px rgba(0,0,0,1)',
            }}
          >
            <AntDesign name="star" size={14} color={colors.quaternary} />
            <Text style={{ fontSize: 12 }}>
              {products?.reviews?.length > 0
                ? (
                    products?.reviews?.reduce(
                      (sum, review) => sum + review,
                      0,
                    ) / products?.reviews?.length
                  ).toFixed(1)
                : 'No Reviews'}
              | {products?.reviews?.length}
            </Text>
          </View>
        </View>
      </View>
      <View>
        <Text style={{ fontSize: 24 }}>{products?.name}</Text>
        <Text style={{ fontSize: 16 }}>{products?.price}</Text>
        <View style={{ marginVertical: 10 }}>
          <Text>Description</Text>
          <Text style={{ fontSize: 16 }}>{products?.description}</Text>
        </View>
        <View style={{ marginVertical: 10, minHeight: 200 }}>
          <Text>Reviews</Text>
          {products?.reviews?.length === 0 && (
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text
                style={{
                  textAlign: 'center',
                  alignItems: 'center',
                  color: 'gray',
                }}
              >
                No reviews yet. Be the first to review!
              </Text>
            </View>
          )}
          {products?.reviews?.length > 0 && (
            <View>
              {products?.reviews.map((review, index) => (
                <View key={index} style={{ marginVertical: 5 }}>
                  <Text>{review.name}</Text>
                  <Text>{review.comment}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </View>
      <View
        style={{
          position: 'absolute',
          width: '100%',
          height: 80,
          bottom: 0,
          left: 10,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <PrimeButton text="Buy Now" />
        <PrimeButton
          onPress={() => setModalOpen(true)}
          text="Add To Cart"
          icon={<Ionicons name="bag-handle-outline" size={16} color="black" />}
          styles={{ backgroundColor: 'white' }}
        />
      </View>

      {modalOpen && (
        <View
          style={{
            position: 'absolute',
            zIndex: 100,
            backgroundColor: 'rgba(0,0,0,0.3)',
            borderWidth: 1,
            left: 0,
            top: 0,
            flex: 1,
            width: '105%',
            height: '120%',
          }}
        >
          <TouchableWithoutFeedback onPress={() => setModalOpen(false)}>
            <View
              style={{
                borderWidth: 1,
                flexGrow: 1,
                width: '100%',
                zIndex: 100,
              }}
            ></View>
          </TouchableWithoutFeedback>
          <View
            style={{
              width: '100%',
              height: 380, // Increased height to accommodate quantity controls
              position: 'absolute',
              bottom: 0,
              left: 0,
              backgroundColor: 'white',
              padding: 10,
              zIndex: 101,
            }}
          >
            <LgText text="Add to Cart?" />
            <Text>
              {selectedColor && selectedSize
                ? 'In Stock: ' +
                  (products.stock.find(
                    item =>
                      item.color === selectedColor &&
                      item.size === selectedSize,
                  )?.quantity ?? 'Out of Stock')
                : 'Select Color and Size'}
            </Text>

            {/* Size Selection */}
            <View style={{ flexDirection: 'row', gap: 10, marginVertical: 10 }}>
              {products?.stock?.map((stock, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    setSelectedSize(stock.size)
                    // Reset quantity when size changes
                    setQuantity(1)
                  }}
                >
                  <View
                    style={{
                      backgroundColor:
                        selectedSize === stock.size
                          ? colors.quaternary
                          : 'white',
                      padding: 10,
                      paddingHorizontal: 20,
                      borderWidth: 1,
                      borderRadius: 10,
                    }}
                  >
                    <Text>{stock.size}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            {/* Color Selection */}
            <View style={{ flexDirection: 'row', gap: 10, marginBottom: 10 }}>
              {products?.stock?.map((stock, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    setSelectedColor(stock.color)
                    // Reset quantity when color changes
                    setQuantity(1)
                  }}
                >
                  <View
                    style={{
                      backgroundColor:
                        selectedColor === stock.color
                          ? colors.quaternary
                          : 'white',
                      padding: 10,
                      paddingHorizontal: 20,
                      borderWidth: 1,
                      borderRadius: 10,
                    }}
                  >
                    <Text>{stock.color}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            {/* Quantity Control */}
            {selectedColor && selectedSize && (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 10,
                }}
              >
                <TouchableOpacity onPress={decrementQuantity}>
                  <View
                    style={{
                      backgroundColor: 'white',
                      padding: 10,
                      borderWidth: 1,
                      borderRadius: 10,
                    }}
                  >
                    <Text>-</Text>
                  </View>
                </TouchableOpacity>
                <Text style={{ marginHorizontal: 20, fontSize: 18 }}>
                  {quantity}
                </Text>
                <TouchableOpacity onPress={incrementQuantity}>
                  <View
                    style={{
                      backgroundColor: 'white',
                      padding: 10,
                      borderWidth: 1,
                      borderRadius: 10,
                    }}
                  >
                    <Text>+</Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}

            {/* Add to Cart Buttons */}
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <PrimeButton
                text="Yes"
                onPress={() => {
                  handleAddToCart()
                }}
              />
              <PrimeButton
                styles={{ backgroundColor: 'white' }}
                text="No"
                onPress={() => setModalOpen(false)}
              />
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  )
}

export default Index
