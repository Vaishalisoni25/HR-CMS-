import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import employeeReducer from './store/employees/employeeSlice';
import salariesReducer from './store/salaries/salarySlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    employees: employeeReducer,
    salaries: salariesReducer,
  },
});
