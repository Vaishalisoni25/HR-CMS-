import { createSlice } from '@reduxjs/toolkit';

const token =
  typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  console.log("Initial Redux Auth State:", {
  isAuthenticated: !!token,
  token: token
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: !!token,
    token: token,
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
