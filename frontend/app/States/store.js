import { configureStore } from '@reduxjs/toolkit'
import nameReducer from './Slice/nameSlice'
import userReducer from './Slice/userSlice'

export default configureStore({
  reducer: {
    name: nameReducer,
    user: userReducer,
  },
})
