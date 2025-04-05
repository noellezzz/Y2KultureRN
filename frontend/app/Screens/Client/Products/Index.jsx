import {
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { default as Text } from '../../../Components/Labels/CustomText'
import colors from '../../../styles/colors'
import AntDesign from '@expo/vector-icons/AntDesign'
// import Productss from '../../../Data/Products'
import LgText from '../../../Components/Labels/LgText'
import Ionicons from '@expo/vector-icons/Ionicons'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import PrimeButton from '../../../Components/Buttons/PrimeButton'
import api from '../../../Utils/axiosInstance'

const Index = ({ route, navigation }) => {
  const { id } = route.params || {}
  // const product = Products.find(product => product.id === id)
  const [products, setProducts] = useState({})
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedSize, setSelectedSize] = useState(null)
  const [selectedColor, setSelectedColor] = useState(null)

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

  useEffect(() => {
    console.log('Product ID:', id)
    fetchProducts()
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
              height: 300,
              position: 'absolute',
              bottom: 0,
              left: 0,
              backgroundColor: 'white',
              padding: 10,
              zIndex: 101,
            }}
          >
            <LgText text="Add to Cart?" />
            <View style={{ flexDirection: 'row', gap: 10, marginVertical: 10 }}>
              {products?.stock?.map((stock, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setSelectedSize(stock.size)}
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
            <View style={{ flexDirection: 'row', gap: 10, marginBottom: 10 }}>
              {products?.stock?.map((stock, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setSelectedColor(stock.color)}
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
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <PrimeButton
                text="Yes"
                onPress={() => {
                  setModalOpen(false)
                  navigation.navigate('Cart')
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
