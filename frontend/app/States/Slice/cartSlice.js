import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
  getCartItems,
  addItemToDb,
  updateQuantityInDb,
  removeItemFromDb,
  clearCartFromDb,
} from '../../Database/database'

// Initial state
const initialState = {
  items: [],
  status: 'idle',
  error: null,
}

// Async thunks
export const fetchCart = createAsyncThunk('cart/fetchCart', async () => {
  try {
    const cartItems = await getCartItems()
    return cartItems
  } catch (error) {
    throw error
  }
})

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (item, { getState }) => {
    try {
      const { cart } = getState()
      const existingItem = cart.items.find(cartItem => cartItem.id === item.id)

      if (existingItem) {
        const updatedQuantity = existingItem.quantity + 1
        await updateQuantityInDb(item.id, updatedQuantity)
        return { ...item, quantity: updatedQuantity }
      } else {
        const itemWithQuantity = { ...item, quantity: 1 }
        await addItemToDb(itemWithQuantity)
        return itemWithQuantity
      }
    } catch (error) {
      throw error
    }
  },
)

export const increaseQuantity = createAsyncThunk(
  'cart/increaseQuantity',
  async (id, { getState }) => {
    try {
      const { cart } = getState()
      const item = cart.items.find(item => item.id === id)

      if (item) {
        const newQuantity = item.quantity + 1
        await updateQuantityInDb(id, newQuantity)
        return { id, quantity: newQuantity }
      }
    } catch (error) {
      throw error
    }
  },
)

export const decreaseQuantity = createAsyncThunk(
  'cart/decreaseQuantity',
  async (id, { getState }) => {
    try {
      const { cart } = getState()
      const item = cart.items.find(item => item.id === id)

      if (item && item.quantity > 1) {
        const newQuantity = item.quantity - 1
        await updateQuantityInDb(id, newQuantity)
        return { id, quantity: newQuantity }
      } else if (item && item.quantity === 1) {
        await removeItemFromDb(id)
        return { id, remove: true }
      }
    } catch (error) {
      throw error
    }
  },
)

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async id => {
    try {
      await removeItemFromDb(id)
      return id
    } catch (error) {
      throw error
    }
  },
)

export const clearCart = createAsyncThunk('cart/clearCart', async () => {
  try {
    await clearCartFromDb()
    return true
  } catch (error) {
    throw error
  }
})

// Cart slice
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      // Fetch cart cases
      .addCase(fetchCart.pending, state => {
        state.status = 'loading'
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = Array.isArray(action.payload) ? action.payload : []
        state.error = null
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })

      // Add to cart cases
      .addCase(addToCart.pending, state => {
        state.status = 'loading'
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.status = 'succeeded'
        const existingItemIndex = state.items.findIndex(
          item => item.id === action.payload.id,
        )

        if (existingItemIndex !== -1) {
          state.items[existingItemIndex].quantity = action.payload.quantity
        } else {
          state.items.push(action.payload)
        }
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })

      // Increase quantity cases
      .addCase(increaseQuantity.fulfilled, (state, action) => {
        state.status = 'succeeded'
        const index = state.items.findIndex(
          item => item.id === action.payload.id,
        )
        if (index !== -1) {
          state.items[index].quantity = action.payload.quantity
        }
      })

      // Decrease quantity cases
      .addCase(decreaseQuantity.fulfilled, (state, action) => {
        state.status = 'succeeded'
        if (action.payload.remove) {
          state.items = state.items.filter(
            item => item.id !== action.payload.id,
          )
        } else {
          const index = state.items.findIndex(
            item => item.id === action.payload.id,
          )
          if (index !== -1) {
            state.items[index].quantity = action.payload.quantity
          }
        }
      })

      // Remove from cart cases
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = state.items.filter(item => item.id !== action.payload)
      })

      // Clear cart cases
      .addCase(clearCart.fulfilled, state => {
        state.status = 'succeeded'
        state.items = []
      })
  },
})

export default cartSlice.reducer
