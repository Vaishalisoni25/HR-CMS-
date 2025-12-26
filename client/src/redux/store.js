import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import employeeReducer from './store/employees/employeeSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    employees: employeeReducer,
  },
});
