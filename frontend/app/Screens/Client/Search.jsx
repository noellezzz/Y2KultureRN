import { View, TextInput, FlatList, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import colors from '../../styles/colors'
import BottomNavigation from '../../Components/Buttons/BottomNavigation'
import { default as Text } from '../../Components/Labels/CustomText'
import ProductTile from '../../Components/Layout/ProductTile'
import AntDesign from '@expo/vector-icons/AntDesign'
import Ionicons from '@expo/vector-icons/Ionicons'
import api from '../../Utils/axiosInstance'
import IconInput from '../../Components/Input/IconInput'
import SectionTitle from '../../Components/Layout/SectionTitle'

const Search = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [products, setProducts] = useState([])
  const [searchResults, setSearchResults] = useState([])

  // Fetch all products
  const fetchProducts = async () => {
    try {
      const response = await api.get('/products')
      setProducts(response.data)
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }

  // Initial fetch of products
  useEffect(() => {
    fetchProducts()
  }, [])

  // Handle search input changes
  const handleSearch = query => {
    setSearchQuery(query)

    // If query is empty, clear results
    if (query.trim() === '') {
      setSearchResults([])
      return
    }

    // Filter products based on name
    const results = products.filter(product =>
      product.name.toLowerCase().includes(query.toLowerCase()),
    )

    setSearchResults(results)
  }

  // Render product item
  const renderProductItem = ({ item }) => (
    <ProductTile
      id={item._id}
      title={item.name}
      price={item.price}
      image={item.image}
      navigation={navigation}
    />
  )

  return (
    <SafeAreaView
      style={{
        backgroundColor: colors.primary,
        flex: 1,
        width: '100%',
      }}
    >
      <View style={{ width: '100%', padding: 10, flex: 1 }}>
        {/* Header with Back Button */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 10,
          }}
        >
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ marginRight: 10 }}
          >
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>

          <View style={{ flex: 1 }}>
            <TextInput
              placeholder="Search products"
              value={searchQuery}
              onChangeText={handleSearch}
              style={{
                backgroundColor: 'white',
                borderRadius: 30,
                borderColor: 'black',
                padding: 10,
                flexDirection: 'row',
                alignItems: 'center',
              }}
            />
          </View>
        </View>

        {/* Search Results Section */}
        {searchQuery.trim() !== '' && (
          <SectionTitle
            text={`${searchResults.length} Product${searchResults.length !== 1 ? 's' : ''} Found`}
          />
        )}

        {searchResults.length > 0 ? (
          <FlatList
            data={searchResults}
            renderItem={renderProductItem}
            keyExtractor={item => item._id}
            numColumns={2}
            columnWrapperStyle={{
              justifyContent: 'space-between',
              marginBottom: 10,
            }}
            contentContainerStyle={{
              paddingBottom: 20,
            }}
          />
        ) : (
          searchQuery.trim() !== '' && (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text style={{ color: 'gray' }}>
                No products found matching "{searchQuery}"
              </Text>
            </View>
          )
        )}
      </View>

      <BottomNavigation navigation={navigation} />
    </SafeAreaView>
  )
}

export default Search
