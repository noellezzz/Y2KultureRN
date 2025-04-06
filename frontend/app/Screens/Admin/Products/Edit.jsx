import {
  View,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native'
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as ImagePicker from 'expo-image-picker'
import { Camera } from 'expo-camera'
import Floater from '../../../Components/Buttons/Floater'
import Feather from '@expo/vector-icons/Feather'
import colors from '../../../styles/colors'
import LgText from '../../../Components/Labels/LgText'
import PrimeButton from '../../../Components/Buttons/PrimeButton'
import Dropdown from '../../../Components/Input/Dropdown'
import ProductTypes from '../../../Data/ProductTypes'
import ProductStatus from '../../../Data/ProductStatus'
import InputField from '../../../Components/Input/InputField'
import AntDesign from '@expo/vector-icons/AntDesign'
import api from '../../../Utils/axiosInstance'

// Add these constants or import them from your data files
const ProductCategories = [
  { label: 'Electronics', value: 'electronics' },
  { label: 'Clothing', value: 'clothing' },
  { label: 'Home & Kitchen', value: 'home' },
  { label: 'Books', value: 'books' },
  { label: 'Other', value: 'other' },
]

const EditProduct = ({ navigation, route }) => {
  const { productId } = route.params

  const [productName, setProductName] = useState('')
  const [productDescription, setProductDescription] = useState('')
  const [productPrice, setProductPrice] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [productImage, setProductImage] = useState(null)
  const [imageChanged, setImageChanged] = useState(false)
  const [stock, setStock] = useState('0')
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [errors, setErrors] = useState({})

  // New state for stock details
  const [stockSize, setStockSize] = useState('')
  const [stockColor, setStockColor] = useState('')
  const [stockItems, setStockItems] = useState([])

  useEffect(() => {
    fetchProductDetails()
  }, [productId])

  const fetchProductDetails = async () => {
    try {
      setIsFetching(true)
      const response = await api.get(`/products/${productId}`)
      const product = response.data

      setProductName(product.name || '')
      setProductDescription(product.description || '')
      setProductPrice(product.price ? product.price.toString() : '')
      setSelectedType(product.type || '')
      setSelectedStatus(product.status || '')
      setSelectedCategory(product.category || '')

      if (product.image) {
        setProductImage(product.image)
      }

      // Handle stock data
      if (product.stock && Array.isArray(product.stock)) {
        if (
          product.stock.length > 0 &&
          (product.stock[0].size || product.stock[0].color)
        ) {
          setStockItems(product.stock)
        } else {
          // Simple stock quantity
          setStock(product.stock[0]?.quantity?.toString() || '0')
        }
      }

      setIsFetching(false)
    } catch (error) {
      setIsFetching(false)
      console.error('Error fetching product details:', error)
      Alert.alert('Error', 'Failed to load product details. Please try again.')
    }
  }

  const validateForm = () => {
    let isValid = true
    const newErrors = {}

    if (!productName.trim()) {
      newErrors.productName = 'Product name is required'
      isValid = false
    }

    if (!productDescription.trim()) {
      newErrors.productDescription = 'Product description is required'
      isValid = false
    }

    if (!productPrice.trim()) {
      newErrors.productPrice = 'Price is required'
      isValid = false
    } else if (!/^\$?\d+(\.\d{1,2})?$/.test(productPrice.replace('$', ''))) {
      newErrors.productPrice = 'Price must be a valid amount'
      isValid = false
    }

    if (!selectedType) {
      newErrors.productType = 'Product type is required'
      isValid = false
    }

    if (!selectedStatus) {
      newErrors.productStatus = 'Product status is required'
      isValid = false
    }

    if (!selectedCategory) {
      newErrors.productCategory = 'Product category is required'
      isValid = false
    }

    // For simple stock management
    if (stockItems.length === 0) {
      if (isNaN(parseInt(stock)) || parseInt(stock) < 0) {
        newErrors.stock = 'Stock must be a valid number'
        isValid = false
      }
    }

    setErrors(newErrors)
    return isValid
  }

  const createFormData = () => {
    const formData = new FormData()

    formData.append('name', productName)
    formData.append('description', productDescription)
    formData.append(
      'price',
      parseFloat(
        productPrice.startsWith('$') ? productPrice.substring(1) : productPrice,
      ),
    )
    formData.append('type', selectedType)
    formData.append('status', selectedStatus)
    formData.append('category', selectedCategory)

    // Handle stock based on whether we have detailed stock items or just a quantity
    if (stockItems.length > 0) {
      formData.append('stock', JSON.stringify(stockItems))
    } else {
      // Create a simple stock item with just quantity
      const simpleStock = [{ quantity: parseInt(stock) }]
      formData.append('stock', JSON.stringify(simpleStock))
    }

    // Only append image if it was changed
    if (productImage && imageChanged) {
      // Get the filename from the uri
      const imageUriParts = productImage.split('/')
      const fileName = imageUriParts[imageUriParts.length - 1]

      // Determine the file type
      const fileType = fileName.split('.').pop()

      formData.append('image', {
        uri: productImage,
        name: fileName,
        type: `image/${fileType}`,
      })
    }

    return formData
  }

  const handleUpdateProduct = async () => {
    if (validateForm()) {
      try {
        setIsLoading(true)

        const formData = createFormData()

        const response = await api.put(`/products/${productId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })

        setIsLoading(false)

        if (response.status === 200) {
          Alert.alert('Success', 'Product updated successfully!', [
            {
              text: 'OK',
              onPress: () => navigation.navigate('ProductsList'),
            },
          ])
        }
      } catch (error) {
        setIsLoading(false)
        console.error('Error updating product:', error)
        Alert.alert('Error', 'Failed to update product. Please try again.', [
          { text: 'OK' },
        ])
      }
    }
  }

  const addStockItem = () => {
    if (!stockSize.trim() && !stockColor.trim()) {
      Alert.alert(
        'Error',
        'Please provide either size or color for the stock item',
      )
      return
    }

    if (isNaN(parseInt(stock)) || parseInt(stock) < 0) {
      Alert.alert('Error', 'Quantity must be a valid number')
      return
    }

    const newStockItem = {
      size: stockSize.trim() || undefined,
      color: stockColor.trim() || undefined,
      quantity: parseInt(stock),
    }

    setStockItems([...stockItems, newStockItem])

    // Reset inputs
    setStockSize('')
    setStockColor('')
    setStock('0')
  }

  const removeStockItem = index => {
    const updatedItems = [...stockItems]
    updatedItems.splice(index, 1)
    setStockItems(updatedItems)
  }

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== 'granted') {
      alert('Permission to access gallery is required!')
      return
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })
    if (!result.canceled) {
      setProductImage(result.assets[0].uri)
      setImageChanged(true)
    }
  }

  const takePhoto = async () => {
    try {
      const permissionResult = await Camera.requestCameraPermissionsAsync()

      if (permissionResult.status !== 'granted') {
        alert('Permission to access camera is required!')
        return
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      })

      if (!result.canceled) {
        setProductImage(result.assets[0].uri)
        setImageChanged(true)
      }
    } catch (error) {
      console.error('Error while requesting camera permissions:', error)
    }
  }

  if (isFetching) {
    return (
      <SafeAreaView style={styles.container}>
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <ActivityIndicator size="large" color={colors.quaternary} />
          <LgText text="Loading product details..." style={{ marginTop: 10 }} />
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <View style={{ marginBottom: 20, zIndex: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Floater
                icon={<Feather name="arrow-left" size={16} color="black" />}
                onPress={() => navigation.goBack()}
              />
              <View style={{ marginLeft: 10 }}>
                <LgText text="Edit Product" />
              </View>
            </View>
          </View>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            style={{ padding: 5 }}
          >
            <View
              style={{
                marginVertical: 10,
                width: '100%',
                flex: 1,
                boxShadow: '1px 1px 0px 2px rgba(0,0,0,1)',
                height: 200,
                borderRadius: 10,
              }}
            >
              <View
                style={{
                  height: '100%',
                  backgroundColor: '#fefefe',
                  borderRadius: 10,
                }}
              >
                <View style={styles.imageContainer}>
                  {productImage && (
                    <Image
                      source={{ uri: productImage }}
                      style={styles.image}
                    />
                  )}
                  {!productImage && (
                    <View style={{ height: '100%', justifyContent: 'center' }}>
                      <LgText
                        text="No Image Selected"
                        style={{ color: 'gray' }}
                      />
                    </View>
                  )}
                </View>
              </View>
              <View style={styles.imageButtons}>
                <TouchableOpacity
                  onPress={pickImage}
                  style={styles.imageButton}
                >
                  <AntDesign name="upload" size={16} color="black" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={takePhoto}
                  style={styles.imageButton}
                >
                  <AntDesign name="camera" size={16} color="black" />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.inputContainer}>
              <InputField
                label="Product Name"
                value={productName}
                onChangeText={setProductName}
                errors={errors}
                keyboardType="default"
              />
            </View>

            <View style={styles.inputContainer}>
              <InputField
                label="Description"
                value={productDescription}
                onChangeText={setProductDescription}
                errors={errors}
                keyboardType="default"
                multiline={true}
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.inputContainer}>
              <InputField
                label="Price"
                value={productPrice}
                onChangeText={setProductPrice}
                errors={errors}
                keyboardType="numeric"
              />
            </View>

            <View style={{ marginTop: 10 }}>
              <Dropdown
                items={ProductTypes}
                selectedValue={selectedType}
                onValueChange={setSelectedType}
                label="Product Type"
              />
              {errors.productType && (
                <LgText text={errors.productType} style={styles.errorText} />
              )}
            </View>

            <View style={styles.dropdownContainer}>
              <Dropdown
                items={ProductStatus}
                selectedValue={selectedStatus}
                onValueChange={setSelectedStatus}
                label="Product Status"
              />
              {errors.productStatus && (
                <LgText text={errors.productStatus} style={styles.errorText} />
              )}
            </View>

            <View style={styles.dropdownContainer}>
              <Dropdown
                items={ProductCategories}
                selectedValue={selectedCategory}
                onValueChange={setSelectedCategory}
                label="Product Category"
              />
              {errors.productCategory && (
                <LgText
                  text={errors.productCategory}
                  style={styles.errorText}
                />
              )}
            </View>

            {/* Stock Management Section */}
            <View style={styles.sectionHeader}>
              <LgText text="Stock Management" style={styles.sectionTitle} />
            </View>

            {/* Add Stock Item Form */}
            <View style={styles.stockForm}>
              <View style={styles.inputContainer}>
                <InputField
                  label="Size (Optional)"
                  value={stockSize}
                  onChangeText={setStockSize}
                  keyboardType="default"
                />
              </View>

              <View style={styles.inputContainer}>
                <InputField
                  label="Color (Optional)"
                  value={stockColor}
                  onChangeText={setStockColor}
                  keyboardType="default"
                />
              </View>

              <View style={styles.inputContainer}>
                <InputField
                  label="Quantity"
                  value={stock}
                  onChangeText={setStock}
                  errors={errors}
                  keyboardType="numeric"
                />
              </View>

              <TouchableOpacity style={styles.addButton} onPress={addStockItem}>
                <AntDesign name="plus" size={16} color="white" />
                <LgText
                  text="Add Stock Item"
                  style={{ color: 'white', marginLeft: 5 }}
                />
              </TouchableOpacity>
            </View>

            {/* Stock Items List */}
            {stockItems.length > 0 && (
              <View style={styles.stockList}>
                <LgText text="Stock Items" style={styles.stockListTitle} />
                {stockItems.map((item, index) => (
                  <View key={index} style={styles.stockItem}>
                    <View style={styles.stockItemInfo}>
                      <LgText
                        text={`Quantity: ${item.quantity}`}
                        style={styles.stockItemText}
                      />
                      {item.size && (
                        <LgText
                          text={`Size: ${item.size}`}
                          style={styles.stockItemText}
                        />
                      )}
                      {item.color && (
                        <LgText
                          text={`Color: ${item.color}`}
                          style={styles.stockItemText}
                        />
                      )}
                    </View>
                    <TouchableOpacity
                      onPress={() => removeStockItem(index)}
                      style={styles.removeButton}
                    >
                      <AntDesign name="close" size={16} color="black" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}

            {/* If no detailed stock items are added, use the simple stock field */}
            {stockItems.length === 0 && (
              <View style={styles.inputContainer}>
                <InputField
                  label="Stock Quantity"
                  value={stock}
                  onChangeText={setStock}
                  errors={errors}
                  keyboardType="numeric"
                />
              </View>
            )}

            <View style={styles.buttonContainer}>
              <PrimeButton
                text="Update Product"
                onPress={handleUpdateProduct}
                disabled={isLoading}
              />
              <PrimeButton
                text="Cancel"
                onPress={() => navigation.goBack()}
                style={styles.cancelButton}
                disabled={isLoading}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
    height: '100%',
    padding: 10,
  },
  inputContainer: {
    marginBottom: 10,
    marginTop: 10,
  },
  input: {
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    borderBottomWidth: 1,
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },
  imageButtons: {
    flexDirection: 'row',
    gap: 8,
    flex: 1,
    padding: 5,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    borderRadius: 10,
    position: 'absolute',
    right: 10,
  },
  imageButton: {
    padding: 5,
    backgroundColor: colors.quaternary,
    borderRadius: 5,
    boxShadow: '1px 1px 0px 2px rgba(0,0,0,1)',
  },
  buttonContainer: {
    gap: 15,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  cancelButton: {
    backgroundColor: '#fefefe',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
  dropdownContainer: {
    marginTop: 10,
    marginBottom: 10,
  },
  sectionHeader: {
    marginTop: 20,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  stockForm: {
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
  },
  addButton: {
    backgroundColor: colors.quaternary,
    padding: 10,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  stockList: {
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
  },
  stockListTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  stockItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 5,
    marginBottom: 5,
    borderLeftWidth: 3,
    borderLeftColor: colors.quaternary,
  },
  stockItemInfo: {
    flex: 1,
  },
  stockItemText: {
    fontSize: 14,
  },
  removeButton: {
    padding: 5,
    backgroundColor: '#f0f0f0',
    borderRadius: 50,
  },
})

export default EditProduct
