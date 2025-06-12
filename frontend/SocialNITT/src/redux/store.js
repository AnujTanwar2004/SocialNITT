import { configureStore } from '@reduxjs/toolkit'
import productReducer from './slices/productSlice'
import authReducer from './slices/authSlice'

const store = configureStore({
  reducer: {
    products: productReducer,  // <-- correct key
    auth: authReducer
  }
})

export default store
