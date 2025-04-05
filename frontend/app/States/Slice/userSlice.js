import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserData: (state, action) => {
      state.user = action.payload.user
      state.token = action.payload.token
      state.isAuthenticated = true
      state.error = null
    },
    updateUserData: (state, action) => {
      state.user = { ...state.user, ...action.payload }
      state.error = null
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
      state.loading = false
    },
    clearUserData: state => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.error = null
    },
  },
})

export const {
  setUserData,
  setLoading,
  setError,
  clearUserData,
  updateUserData,
} = userSlice.actions
export default userSlice.reducer
