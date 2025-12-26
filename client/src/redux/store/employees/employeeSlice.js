import { createSlice } from '@reduxjs/toolkit';
import { fetchEmployees, addEmployee, updateEmployee, deleteEmployee } from './employeeThunk';
import { addAsyncThunkCases } from '../reduxBuilderHelper';

const initialState = {
  list: [],
  loading: false,
  error: null,
};

const employeeSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    addAsyncThunkCases(builder, [fetchEmployees], {
      onFulfilled: (state, action) => {
        state.list = action.payload;
      },
    });

    addAsyncThunkCases(builder, [addEmployee], {
      onFulfilled: (state, action) => {
        state.list.push(action.payload);
      },
    });

    addAsyncThunkCases(builder, [updateEmployee], {
      onFulfilled: (state, action) => {
        const index = state.list.findIndex(emp => emp.id === action.payload.id);
        if (index !== -1) state.list[index] = action.payload;
      },
    });

    addAsyncThunkCases(builder, [deleteEmployee], {
      onFulfilled: (state, action) => {
        state.list = state.list.filter(emp => emp.id !== action.payload);
      },
    });
  },
});

export const { clearError } = employeeSlice.actions;
export default employeeSlice.reducer;
