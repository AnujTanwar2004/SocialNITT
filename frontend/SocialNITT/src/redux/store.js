import { configureStore } from '@reduxjs/toolkit'
import authSlice from './slices/authSlice'
import productSlice from './slices/productSlice'
import serviceSlice from './slices/serviceSlice' // Add this import
import foodSlice from './slices/foodSlice'

const store = configureStore({
  reducer: {
    auth: authSlice,
    products: productSlice,
    services: serviceSlice, // Add this line
    foods : foodSlice
  }
})

export default store