import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import employeeReducer from './store/employees/employeeSlice';
import salariesReducer from './store/salaries/salarySlice';
import adjustmentReducer from './store/adjustments/adjustmentSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    employees: employeeReducer,
    salaries: salariesReducer,
    adjustments: adjustmentReducer,
  },
});
