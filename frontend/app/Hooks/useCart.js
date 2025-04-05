import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchCart,
  addToCart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart,
} from '../States/Slice/cartSlice'
import { initDatabase } from '../Database/database'

export const useCart = () => {
  const dispatch = useDispatch()
  const { items, status, error } = useSelector(state => state.cart)

  useEffect(() => {
    const setupDatabase = async () => {
      try {
        const dbInitialized = await initDatabase()
        if (dbInitialized) {
          dispatch(fetchCart())
        } else {
          console.error('Database could not be initialized')
        }
      } catch (error) {
        console.error('Failed to initialize database:', error)
      }
    }

    setupDatabase()
  }, [dispatch])

  const addItem = item => {
    dispatch(addToCart(item))
  }

  const increaseItemQuantity = id => {
    dispatch(increaseQuantity(id))
  }

  const decreaseItemQuantity = id => {
    dispatch(decreaseQuantity(id))
  }

  const removeItem = id => {
    dispatch(removeFromCart(id))
  }

  const emptyCart = () => {
    dispatch(clearCart())
  }

  const getCartTotal = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  return {
    cartItems: items,
    status,
    error,
    addItem,
    increaseItemQuantity,
    decreaseItemQuantity,
    removeItem,
    emptyCart,
    getCartTotal,
  }
}
