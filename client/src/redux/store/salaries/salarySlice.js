import { createSlice } from '@reduxjs/toolkit';
import { fetchSalaries, addSalary, updateSalary, deleteSalary } from './salaryThunk';
import { addAsyncThunkCases } from '../reduxBuilderHelper';

const initialState = {
  list: [],
  loading: false,
  error: null,
};

const salarySlice = createSlice({
  name: 'salaries',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all salaries
    addAsyncThunkCases(builder, [fetchSalaries], {
      onFulfilled: (state, action) => {
        state.list = action.payload;
      },
    });

    // Add a new salary
    addAsyncThunkCases(builder, [addSalary], {
      onFulfilled: (state, action) => {
        state.list.push(action.payload);
      },
    });

    // Update salary by ID
    addAsyncThunkCases(builder, [updateSalary], {
      onFulfilled: (state, action) => {
        const index = state.list.findIndex(s => s.id === action.payload.id);
        if (index !== -1) state.list[index] = action.payload;
      },
    });

    // Delete salary by ID
    addAsyncThunkCases(builder, [deleteSalary], {
      onFulfilled: (state, action) => {
        state.list = state.list.filter(s => s.id !== action.payload);
      },
    });
  },
});

export const { clearError } = salarySlice.actions;
export default salarySlice.reducer;
