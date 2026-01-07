import { createSlice } from '@reduxjs/toolkit';
import { 
  fetchAdjustments, 
  addAdjustment, 
  updateAdjustment, 
  deleteAdjustment, 
  fetchAdjustmentById 
} from './adjustmentThunk';
import { addAsyncThunkCases } from '../reduxBuilderHelper';

const initialState = {
  list: [],        // all adjustments
  current: null,   
  loading: false,
  error: null,
};

const adjustmentSlice = createSlice({
  name: 'adjustments',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrent: (state) => {
      state.current = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all adjustments
    addAsyncThunkCases(builder, [fetchAdjustments], {
      onFulfilled: (state, action) => {
        state.list = action.payload;
      },
    });

    // Fetch adjustment by ID
    addAsyncThunkCases(builder, [fetchAdjustmentById], {
      onFulfilled: (state, action) => {
        state.current = action.payload;
      },
    });

    // Add a new adjustment
    addAsyncThunkCases(builder, [addAdjustment], {
      onFulfilled: (state, action) => {
        state.list.push(action.payload);
      },
    });

    // Update adjustment by ID
    addAsyncThunkCases(builder, [updateAdjustment], {
      onFulfilled: (state, action) => {
        const index = state.list.findIndex(a => a.id === action.payload.id);
        if (index !== -1) state.list[index] = action.payload;
      },
    });

    // Delete adjustment by ID
    addAsyncThunkCases(builder, [deleteAdjustment], {
      onFulfilled: (state, action) => {
        state.list = state.list.filter(a => a.id !== action.payload);
      },
    });
  },
});

export const { clearError, clearCurrent } = adjustmentSlice.actions;
export default adjustmentSlice.reducer;
