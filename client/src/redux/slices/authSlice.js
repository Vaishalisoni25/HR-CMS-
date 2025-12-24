import { createSlice } from '@reduxjs/toolkit';

// Get token from localStorage if it exists
const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: !!token, // true if token exists
    token: token || null,
  },
  reducers: {
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.token = action.payload;
      localStorage.setItem('token', action.payload); 
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      localStorage.removeItem('token'); 
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
