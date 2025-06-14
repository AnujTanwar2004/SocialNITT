import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axiosClient from '../../components/utils/axiosClient'

export const fetchServices = createAsyncThunk(
  'services/fetchServices',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken')
      const res = await axiosClient.get('/api/services', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      return res.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg || "Failed to fetch services")
    }
  }
)

const serviceSlice = createSlice({
  name: 'services',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    clearServices: (state) => {
      state.items = []
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchServices.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
  },
})

export const { clearServices } = serviceSlice.actions
export default serviceSlice.reducer