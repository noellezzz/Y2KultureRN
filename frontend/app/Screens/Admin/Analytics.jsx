import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
  KeyboardAvoidingView,
  Modal,
  FlatList,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Feather from '@expo/vector-icons/Feather'
import Floater from '../../Components/Buttons/Floater'
import colors from '../../styles/colors'

import api from '../../Utils/axiosInstance'
import { useNotification } from '../../Context/NotificationContext'

const CreatePromotion = ({ navigation }) => {
  const { expoPushToken } = useNotification()

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [percentOff, setPercentOff] = useState('')
  const [dateEnd, setDateEnd] = useState(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  )
  const [status, setStatus] = useState('inactive')
  const [loading, setLoading] = useState(false)
  const [showDateModal, setShowDateModal] = useState(false)
  const [productSearch, setProductSearch] = useState('')
  const [showProductModal, setShowProductModal] = useState(false)
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [loadingProducts, setLoadingProducts] = useState(false)

  const statuses = ['active', 'inactive', 'scheduled']

  const [tempYear, setTempYear] = useState(dateEnd.getFullYear())
  const [tempMonth, setTempMonth] = useState(dateEnd.getMonth() + 1)
  const [tempDay, setTempDay] = useState(dateEnd.getDate())

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    if (!products || !Array.isArray(products)) {
      setFilteredProducts([])
      return
    }

    if (
      productSearch?.trim() === '' ||
      productSearch === null ||
      productSearch === undefined
    ) {
      setFilteredProducts(products)
    } else {
      const filtered = products.filter(product =>
        product?.name?.toLowerCase().includes(productSearch.toLowerCase()),
      )
      setFilteredProducts(filtered)
    }
  }, [productSearch, products])

  const fetchProducts = async () => {
    setLoadingProducts(true)
    try {
      const response = await api.get('products')
      const productsData = response?.data || []

      // Transform MongoDB-style data to the format we need
      const transformedProducts = productsData.map(product => ({
        id: product._id, // Use _id as id
        name: product.name,
        price: product.price,
        status: product.status,
        image: product.image,
        category: product.category,
        description: product.description,
        hasPromotion: !!product.promo,
        sku: product.type, // Using type as SKU for display purposes
      }))

      // Filter out any invalid products
      const validProducts = transformedProducts.filter(p => p && p.id)

      setProducts(validProducts)
      setFilteredProducts(validProducts)
    } catch (error) {
      console.error('Error fetching products:', error)
      Alert.alert(
        'Error',
        error?.response?.data?.message || 'Failed to fetch products',
      )
      setProducts([])
      setFilteredProducts([])
    } finally {
      setLoadingProducts(false)
    }
  }

  const formatDate = date => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  }

  const validateForm = () => {
    if (!selectedProduct) {
      Alert.alert('Error', 'Please select a product')
      return false
    }
    if (!name.trim()) {
      Alert.alert('Error', 'Promotion name is required')
      return false
    }
    if (!description.trim()) {
      Alert.alert('Error', 'Promotion description is required')
      return false
    }
    if (!percentOff) {
      Alert.alert('Error', 'Discount percentage is required')
      return false
    }
    const discount = Number(percentOff)
    if (isNaN(discount) || discount < 0 || discount > 100) {
      Alert.alert('Error', 'Discount must be a number between 0 and 100')
      return false
    }
    if (dateEnd <= new Date()) {
      Alert.alert('Error', 'End date must be in the future')
      return false
    }
    return true
  }

  const handleSetDate = () => {
    const newDate = new Date(tempYear, tempMonth - 1, tempDay)
    if (isNaN(newDate.getTime())) {
      Alert.alert('Error', 'Invalid date')
      return
    }

    if (newDate <= new Date()) {
      Alert.alert('Error', 'End date must be in the future')
      return
    }

    setDateEnd(newDate)
    setShowDateModal(false)
  }

  const handleSelectProduct = product => {
    setSelectedProduct(product)
    setShowProductModal(false)
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setLoading(true)
    try {
      if (!selectedProduct || !selectedProduct.id) {
        throw new Error('No product selected')
      }
      const response = await api.post(`products/promo/${selectedProduct.id}/`, {
        name,
        description,
        percentOff: Number(percentOff),
        dateEnd: dateEnd ? dateEnd.toISOString() : new Date().toISOString(),
        status,
        expoPushToken,
      })

      Alert.alert('Success', 'Promotion created successfully', [
        {
          text: 'OK',
        },
      ])
    } catch (error) {
      console.error('Error creating promotion:', error)
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to create promotion',
      )
    } finally {
      setLoading(false)
    }
  }

  const renderProductItem = ({ item }) => {
    if (!item || !item.id) return null

    return (
      <TouchableOpacity
        style={styles.productItem}
        onPress={() => handleSelectProduct(item)}
      >
        <Text style={styles.productName}>
          {item?.name || 'Unnamed Product'}
        </Text>
        <View style={styles.productDetails}>
          <Text style={styles.productPrice}>${item?.price || 0}</Text>
          {item?.category && (
            <Text style={styles.productCategory}>{item.category}</Text>
          )}
          {item?.hasPromotion && (
            <View style={styles.promotionBadge}>
              <Text style={styles.promotionText}>Promo</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <Floater
        icon={<Feather name="menu" size={16} color="black" />}
        onPress={() => navigation.toggleDrawer()}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.title}>Create Promotion</Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Select Product</Text>
            <TouchableOpacity
              style={styles.productSelector}
              onPress={() => setShowProductModal(true)}
            >
              <Text
                style={
                  selectedProduct?.name
                    ? styles.productText
                    : styles.placeholderText
                }
              >
                {selectedProduct?.name || 'Select a product'}
              </Text>
              <Feather name="chevron-down" size={16} color={colors.textDark} />
            </TouchableOpacity>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Promotion Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter promotion name"
              placeholderTextColor="#aaa"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Enter promotion description"
              placeholderTextColor="#aaa"
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Discount Percentage</Text>
            <TextInput
              style={styles.input}
              value={percentOff}
              onChangeText={setPercentOff}
              placeholder="Enter discount percentage"
              placeholderTextColor="#aaa"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>End Date</Text>
            <TouchableOpacity
              style={styles.datePickerButton}
              onPress={() => {
                setTempYear(dateEnd.getFullYear())
                setTempMonth(dateEnd.getMonth() + 1)
                setTempDay(dateEnd.getDate())
                setShowDateModal(true)
              }}
            >
              <Text style={styles.dateText}>{formatDate(dateEnd)}</Text>
              <Feather name="calendar" size={16} color={colors.textDark} />
            </TouchableOpacity>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Status</Text>
            <View style={styles.statusContainer}>
              {statuses.map(statusOption => (
                <TouchableOpacity
                  key={statusOption}
                  style={[
                    styles.statusButton,
                    status === statusOption && styles.statusButtonActive,
                  ]}
                  onPress={() => setStatus(statusOption)}
                >
                  <Text
                    style={[
                      styles.statusText,
                      status === statusOption && styles.statusTextActive,
                    ]}
                  >
                    {statusOption.charAt(0).toUpperCase() +
                      statusOption.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.submitButton,
              loading && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.submitButtonText}>
              {loading ? 'Creating...' : 'Create Promotion'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal
        visible={showDateModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDateModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.dateModal}>
            <Text style={styles.modalTitle}>Select End Date</Text>

            <View style={styles.dateInputContainer}>
              <View style={styles.dateInputGroup}>
                <Text style={styles.dateInputLabel}>Year</Text>
                <TextInput
                  style={styles.dateInput}
                  value={tempYear ? tempYear.toString() : ''}
                  onChangeText={text => setTempYear(parseInt(text) || 2025)}
                  keyboardType="numeric"
                  maxLength={4}
                />
              </View>

              <View style={styles.dateInputGroup}>
                <Text style={styles.dateInputLabel}>Month</Text>
                <TextInput
                  style={styles.dateInput}
                  value={tempMonth ? tempMonth.toString() : ''}
                  onChangeText={text => {
                    const month = parseInt(text) || 1
                    setTempMonth(Math.min(Math.max(month, 1), 12))
                  }}
                  keyboardType="numeric"
                  maxLength={2}
                />
              </View>

              <View style={styles.dateInputGroup}>
                <Text style={styles.dateInputLabel}>Day</Text>
                <TextInput
                  style={styles.dateInput}
                  value={tempDay ? tempDay.toString() : ''}
                  onChangeText={text => {
                    const day = parseInt(text) || 1
                    setTempDay(Math.min(Math.max(day, 1), 31))
                  }}
                  keyboardType="numeric"
                  maxLength={2}
                />
              </View>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowDateModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleSetDate}
              >
                <Text style={styles.confirmButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showProductModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowProductModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.productModal}>
            <Text style={styles.modalTitle}>Select a Product</Text>

            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                value={productSearch}
                onChangeText={setProductSearch}
                placeholder="Search products..."
                placeholderTextColor="#aaa"
              />
              <Feather name="search" size={16} color={colors.textDark} />
            </View>

            {loadingProducts ? (
              <Text style={styles.loadingText}>Loading products...</Text>
            ) : (
              <FlatList
                data={filteredProducts}
                renderItem={renderProductItem}
                keyExtractor={item =>
                  item?.id?.toString() || Math.random().toString()
                }
                style={styles.productList}
                ListEmptyComponent={
                  <Text style={styles.emptyListText}>No products found</Text>
                }
              />
            )}

            <TouchableOpacity
              style={[
                styles.modalButton,
                styles.cancelButton,
                styles.closeModalButton,
              ]}
              onPress={() => setShowProductModal(false)}
            >
              <Text style={styles.cancelButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    padding: 16,
  },
  scrollContainer: {
    paddingTop: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: 20,
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  productSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  productText: {
    fontSize: 16,
    color: colors.textDark,
  },
  placeholderText: {
    fontSize: 16,
    color: '#aaa',
  },
  datePickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  dateText: {
    fontSize: 16,
    color: colors.textDark,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusButton: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  statusButtonActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  statusText: {
    color: colors.textDark,
  },
  statusTextActive: {
    color: colors.white,
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: colors.accent,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateModal: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 20,
    width: '80%',
  },
  productModal: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: 16,
    textAlign: 'center',
  },
  dateInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  dateInputGroup: {
    flex: 1,
    alignItems: 'center',
  },
  dateInputLabel: {
    fontSize: 14,
    color: colors.textDark,
    marginBottom: 8,
  },
  dateInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 6,
    padding: 10,
    width: '80%',
    textAlign: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  confirmButton: {
    backgroundColor: colors.accent,
  },
  cancelButtonText: {
    color: colors.textDark,
    fontWeight: '600',
  },
  confirmButtonText: {
    color: colors.white,
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    marginRight: 10,
  },
  productList: {
    maxHeight: 300,
    marginBottom: 15,
  },
  productItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  productName: {
    fontSize: 16,
    color: colors.textDark,
  },
  productDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  productPrice: {
    fontSize: 14,
    color: colors.textDark,
    fontWeight: '600',
    marginRight: 8,
  },
  productCategory: {
    fontSize: 12,
    color: '#888',
    marginRight: 8,
    textTransform: 'capitalize',
  },
  promotionBadge: {
    backgroundColor: colors.accent,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  promotionText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  emptyListText: {
    textAlign: 'center',
    padding: 20,
    color: '#888',
  },
  loadingText: {
    textAlign: 'center',
    padding: 20,
    color: '#888',
  },
  closeModalButton: {
    marginTop: 10,
  },
})

export default CreatePromotion
