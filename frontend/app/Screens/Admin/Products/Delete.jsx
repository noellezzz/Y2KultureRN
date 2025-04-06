import React from 'react'
import { TouchableOpacity, Alert } from 'react-native'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import LgText from '../../../Components/Labels/LgText'
import api from '../../../Utils/axiosInstance'

const DeleteProduct = ({
  productId,
  onDeleteSuccess,
  style = {},
  textStyle = {},
  iconSize = 16,
  iconColor = 'white',
}) => {
  const handleDeleteProduct = async () => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this product?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/products/${productId}`)
              // Call the success callback
              onDeleteSuccess && onDeleteSuccess()
              Alert.alert('Success', 'Product deleted successfully')
            } catch (error) {
              console.error('Error deleting product:', error)
              Alert.alert('Error', 'Failed to delete product')
            }
          },
        },
      ],
    )
  }

  return (
    <TouchableOpacity
      onPress={handleDeleteProduct}
      style={{
        backgroundColor: '#ff6b6b',
        padding: 8,
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
        ...style,
      }}
    >
      <MaterialIcons name="delete" size={iconSize} color={iconColor} />
      <LgText
        text=" Delete"
        style={{
          color: 'white',
          fontSize: 14,
          ...textStyle,
        }}
      />
    </TouchableOpacity>
  )
}

export default DeleteProduct
