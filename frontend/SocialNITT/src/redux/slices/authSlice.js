import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axiosClient from '../../components/utils/axiosClient'

// Async thunk to fetch user info — token auto-injected by axiosClient
export const fetchUser = createAsyncThunk(
  'auth/fetchUser',
  async () => {
    const res = await axiosClient.get('/user/infor')
    return {
      user: res.data,
      isAdmin: res.data.role === 1,
    }
  }
)

const initialState = {
  user: {},
  isLogged: false,
  isAdmin: false,
  token: ''
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state) => {
      state.isLogged = true
    },
    setToken: (state, action) => {
      state.token = action.payload
    },
    logoutUser: (state) => {
      state.isLogged = false
      state.user = {}
      state.isAdmin = false
      state.token = ''
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUser.fulfilled, (state, action) => {
      state.user = action.payload.user
      state.isAdmin = action.payload.isAdmin
      state.isLogged = true
    })
  },
})

export const { login, setToken, logoutUser } = authSlice.actions
export default authSlice.reducer
