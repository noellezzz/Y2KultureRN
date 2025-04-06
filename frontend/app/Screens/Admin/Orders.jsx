import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
  ActivityIndicator,
} from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Floater from '../../Components/Buttons/Floater'
import Feather from '@expo/vector-icons/Feather'
import Ionicons from '@expo/vector-icons/Ionicons'
import colors from '../../styles/colors'
import api from '../../Utils/axiosInstance'
import LgText from '../../Components/Labels/LgText'
import Dropdown from '../../Components/Input/Dropdown'
import ToggleButton from '../../Components/Buttons/ToggleButton'
import RowText from '../../Components/Layout/RowText'
import Divider from '../../Components/Labels/Divider'
import { useNotification } from '../../Context/NotificationContext'

const Orders = ({ navigation }) => {
  const [allOrders, setAllOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusOptions] = useState([
    'Pending',
    'Processing',
    'Shipped',
    'Delivered',
    'Canceled',
  ])
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [statusModalVisible, setStatusModalVisible] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [selectedView, setSelectedView] = useState('Standard View')
  const [selectedItem, setSelectedItem] = useState('')
  const [filterStatus, setFilterStatus] = useState('')

  const { expoPushToken } = useNotification()

  const handleSelectedItem = i => {
    setSelectedItem(selectedItem === i ? '' : i)
  }

  const fetchAllOrders = async () => {
    try {
      setLoading(true)
      const response = await api.get('/auth/orders')
      setAllOrders(response.data.orders)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching orders:', error)
      setLoading(false)
    }
  }

  useEffect(() => {
    // Focus listener to refresh orders when navigating back to this screen
    const unsubscribe = navigation.addListener('focus', () => {
      fetchAllOrders()
    })

    // Initial fetch
    fetchAllOrders()

    // Cleanup the listener on unmount
    return unsubscribe
  }, [navigation])

  const updateOrderStatus = async (orderId, userId, newStatus) => {
    try {
      setUpdatingStatus(true)
      await api.put(`/auth/${userId}/orders/${orderId}/status`, {
        status: newStatus,
        expoPushToken,
      })
      // Refresh the orders list
      await fetchAllOrders()
      setStatusModalVisible(false)
      setUpdatingStatus(false)
    } catch (error) {
      console.error('Error updating order status:', error)
      setUpdatingStatus(false)
    }
  }

  const getStatusColor = status => {
    switch (status) {
      case 'Pending':
        return '#FFC107'
      case 'Processing':
        return '#2196F3'
      case 'Shipped':
        return '#9C27B0'
      case 'Delivered':
        return '#4CAF50'
      case 'Canceled':
        return '#F44336'
      default:
        return '#FFC107'
    }
  }

  const filteredOrders = allOrders.filter(order => {
    return filterStatus === '' || order.status === filterStatus
  })

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
            <LgText text="Orders" />
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

      <View style={{ marginVertical: 5, flexDirection: 'column' }}>
        <Dropdown
          items={[
            { label: 'All Statuses', value: '' },
            { label: 'Pending', value: 'Pending' },
            { label: 'Processing', value: 'Processing' },
            { label: 'Shipped', value: 'Shipped' },
            { label: 'Delivered', value: 'Delivered' },
            { label: 'Canceled', value: 'Canceled' },
          ]}
          selectedValue={filterStatus}
          onValueChange={setFilterStatus}
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
          {loading ? (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                paddingVertical: 50,
              }}
            >
              <LgText text="Loading orders..." style={{ color: 'gray' }} />
            </View>
          ) : filteredOrders.length === 0 ? (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                paddingVertical: 50,
              }}
            >
              <LgText text="No orders found." style={{ color: 'gray' }} />
            </View>
          ) : (
            filteredOrders.map((order, index) => (
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
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <Text>Order #{order._id}</Text>
                        <View
                          style={[
                            styles.statusBadge,
                            {
                              backgroundColor: getStatusColor(
                                order.status || 'Pending',
                              ),
                            },
                          ]}
                        >
                          <Text style={styles.statusText}>
                            {order.status || 'Pending'}
                          </Text>
                        </View>
                      </View>

                      <RowText
                        label="Customer"
                        name={`${order.userInfo.firstName} ${order.userInfo.lastName}`}
                      />
                      <RowText label="Total" name={`$${order.total}`} />

                      {selectedItem === index && (
                        <View style={{ marginTop: 10 }}>
                          <Divider />
                          <Text style={styles.sectionTitle}>
                            Customer Information
                          </Text>
                          <RowText label="Email" name={order.userInfo.email} />
                          <RowText label="Date" name={order.date} />
                          <RowText
                            label="Delivery Address"
                            name={order.deliveryAddress}
                          />

                          <Divider />
                          <Text style={styles.sectionTitle}>Items</Text>
                          {order.items.map((item, itemIndex) => (
                            <View key={itemIndex} style={{ marginBottom: 10 }}>
                              <RowText label="Product" name={item.product} />
                              <RowText label="Category" name={item.category} />
                              <RowText
                                label="Variant"
                                name={`${item.size}, ${item.color}`}
                              />
                              <RowText label="Price" name={`$${item.price}`} />
                              <RowText label="Quantity" name={item.quantity} />
                              {itemIndex < order.items.length - 1 && (
                                <Divider />
                              )}
                            </View>
                          ))}

                          {/* Actions */}
                          <View
                            style={{
                              flexDirection: 'row',
                              marginTop: 15,
                              justifyContent: 'flex-end',
                            }}
                          >
                            <TouchableOpacity
                              onPress={() => {
                                setSelectedOrder(order)
                                setStatusModalVisible(true)
                              }}
                              style={{
                                backgroundColor: colors.secondary,
                                padding: 8,
                                borderRadius: 5,
                                flexDirection: 'row',
                                alignItems: 'center',
                              }}
                            >
                              <Feather name="edit" size={16} color="white" />
                              <LgText
                                text=" Update Status"
                                style={{ color: 'white', fontSize: 14 }}
                              />
                            </TouchableOpacity>
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

      <Modal
        visible={statusModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setStatusModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Update Order Status</Text>
            {selectedOrder && (
              <>
                <Text>Order ID: {selectedOrder._id}</Text>
                <Text style={{ marginBottom: 10 }}>
                  Current Status:
                  <Text style={{ fontWeight: 'bold' }}>
                    {' '}
                    {selectedOrder.status || 'Pending'}
                  </Text>
                </Text>

                {updatingStatus ? (
                  <ActivityIndicator size="large" color={colors.secondary} />
                ) : (
                  <View style={styles.statusOptions}>
                    {statusOptions.map(status => (
                      <TouchableOpacity
                        key={status}
                        style={[
                          styles.statusOption,
                          { backgroundColor: getStatusColor(status) },
                        ]}
                        onPress={() =>
                          updateOrderStatus(
                            selectedOrder._id,
                            selectedOrder.userInfo.userId,
                            status,
                          )
                        }
                      >
                        <Text style={styles.statusOptionText}>{status}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </>
            )}

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setStatusModalVisible(false)}
            >
              <Text>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontWeight: 'bold',
    marginVertical: 8,
    fontSize: 16,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  statusText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  statusOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginVertical: 15,
  },
  statusOption: {
    margin: 5,
    padding: 10,
    borderRadius: 5,
  },
  statusOptionText: {
    color: 'white',
    fontWeight: 'bold',
  },
  cancelButton: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#E0E0E0',
    borderRadius: 5,
  },
})

export default Orders
