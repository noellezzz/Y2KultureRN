import { View, TouchableOpacity, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Floater from '../../../Components/Buttons/Floater'
import Feather from '@expo/vector-icons/Feather'
import colors from '../../../styles/colors'
import LgText from '../../../Components/Labels/LgText'
import Ionicons from '@expo/vector-icons/Ionicons'
import PrimeButton from '../../../Components/Buttons/PrimeButton'
import Dropdown from '../../../Components/Input/Dropdown'
import ProductTypes from '../../../Data/ProductTypes'
import ProductStatus from '../../../Data/ProductStatus'
import ToggleButton from '../../../Components/Buttons/ToggleButton'
import RowText from '../../../Components/Layout/RowText'
import DeleteProduct from './Delete'
import api from '../../../Utils/axiosInstance'

const Dashboard = ({ navigation }) => {
  const [selectedType, setSelectedType] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [selectedView, setSelectedView] = useState('Standard View')
  const [selectedItem, setSelectedItem] = useState('')
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSelectedItem = i => {
    setSelectedItem(selectedItem === i ? '' : i)
  }

  const filteredProducts = products?.filter(product => {
    return (
      (selectedType === '' || product.type === selectedType) &&
      (selectedStatus === '' || product.status === selectedStatus)
    )
  })

  const fetchProducts = async () => {
    try {
      setIsLoading(true)
      const response = await api.get('/products')
      setProducts(response.data)
      setIsLoading(false)
    } catch (error) {
      console.error('Error fetching products:', error)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Focus listener to refresh products when navigating back to this screen
    const unsubscribe = navigation.addListener('focus', () => {
      fetchProducts()
    })

    // Initial fetch
    fetchProducts()

    // Cleanup the listener on unmount
    return unsubscribe
  }, [navigation])

  return (
    <SafeAreaView
      style={{ backgroundColor: colors.primary, height: '100%', padding: 10 }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Floater
            icon={<Feather name="menu" size={16} color="black" />}
            onPress={() => navigation.toggleDrawer()}
          />
          <View style={{ marginLeft: 10 }}>
            <LgText text="Products" />
          </View>
        </View>
        <TouchableOpacity>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginRight: 10,
            }}
          >
            <Ionicons name="search" size={24} color="black" />
          </View>
        </TouchableOpacity>
      </View>
      <View style={{ marginVertical: 15, flexDirection: 'row' }}>
        <PrimeButton
          text="Create New"
          onPress={() => navigation.navigate('CreateProduct')}
        />
      </View>
      <View style={{ marginVertical: 5, flexDirection: 'column' }}>
        <Dropdown
          items={ProductTypes}
          selectedValue={selectedType}
          onValueChange={setSelectedType}
          label="Filter by Type"
        />
        <Dropdown
          items={ProductStatus}
          selectedValue={selectedStatus}
          onValueChange={setSelectedStatus}
          label="Filter by Status"
        />
      </View>
      <View
        style={{
          flex: 1,
          boxShadow: '1px 1px 0px 2px rgba(0,0,0,1)',
          borderRadius: 10,
          padding: 10,
        }}
      >
        <View
          style={{
            justifyContent: 'flex-end',
            alignItems: 'flex-end',
            flexDirection: 'row',
          }}
        >
          <ToggleButton
            items={['Standard View', 'Table View']}
            selectedValue={selectedView}
            setSelectedValue={setSelectedView}
          />
        </View>
        <ScrollView style={{ marginVertical: 10 }}>
          {isLoading ? (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                paddingVertical: 50,
              }}
            >
              <LgText text="Loading products..." style={{ color: 'gray' }} />
            </View>
          ) : filteredProducts.length === 0 ? (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                paddingVertical: 50,
              }}
            >
              <LgText text="No products found." style={{ color: 'gray' }} />
            </View>
          ) : (
            filteredProducts.map((product, index) => (
              <View
                key={index}
                style={{
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  marginVertical: 5,
                  padding: 10,
                  borderBottomWidth: 1,
                  borderColor: 'gray',
                }}
              >
                <TouchableOpacity onPress={() => handleSelectedItem(index)}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View
                      style={{
                        width: 30,
                        justifyContent: 'flex-start',
                        alignItems: 'flex-start',
                        alignSelf: 'flex-start',
                      }}
                    >
                      <Ionicons name="caret-down" size={18} color="black" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <RowText label="Name" name={product.name} />
                      {selectedItem === index && (
                        <View>
                          <RowText label="Price" name={`$${product.price}`} />
                          <RowText label="Type" name={product.type} />
                          <RowText label="Status" name={product.status} />

                          {/* Actions Row */}
                          <View
                            style={{
                              flexDirection: 'row',
                              marginTop: 10,
                              justifyContent: 'flex-end',
                            }}
                          >
                            <TouchableOpacity
                              onPress={() =>
                                navigation.navigate('EditProduct', {
                                  productId: product._id,
                                })
                              }
                              style={{
                                backgroundColor: colors.quaternary,
                                padding: 8,
                                borderRadius: 5,
                                marginRight: 10,
                                flexDirection: 'row',
                                alignItems: 'center',
                              }}
                            >
                              <Feather name="edit" size={16} color="white" />
                              <LgText
                                text=" Edit"
                                style={{ color: 'white', fontSize: 14 }}
                              />
                            </TouchableOpacity>

                            <DeleteProduct
                              productId={product._id}
                              onDeleteSuccess={fetchProducts}
                            />
                          </View>
                        </View>
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            ))
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}

export default Dashboard
