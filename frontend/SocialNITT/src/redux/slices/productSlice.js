import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axiosClient from '../../components/utils/axiosClient'

// Async thunk to fetch all products (token auto-attached by axiosClient)
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosClient.get('/api/products')
      return res.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg || err.message)
    }
  }
)

const productSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    clearProducts: (state) => {
      state.items = []
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
  },
})

export const { clearProducts } = productSlice.actions
export default productSlice.reducer
