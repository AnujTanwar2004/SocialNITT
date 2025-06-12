import { createSlice } from '@reduxjs/toolkit'

const tokenSlice = createSlice({
  name: 'token',
  initialState: '',
  reducers: {
    getToken: (state, action) => action.payload
  }
});

export const { getToken } = tokenSlice.actions;
export default tokenSlice.reducer;
