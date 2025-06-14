import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axiosClient from '../../components/utils/axiosClient'

export const fetchFoods = createAsyncThunk(
  'food/fetchFoods',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken')
      const res = await axiosClient.get('/api/foods', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      return res.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg || "Failed to fetch food")
    }
  }
)

const foodSlice = createSlice({
  name: 'foods',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    clearFoods: (state) => {
      state.items = []
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFoods.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchFoods.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(fetchFoods.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
  },
})

export const { clearFoods } = foodSlice.actions
export default foodSlice.reducer