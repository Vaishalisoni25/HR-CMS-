import { createSlice } from '@reduxjs/toolkit';
import { fetchAttendance, addAttendance } from './attendanceThunk';
import { addAsyncThunkCases } from '../reduxBuilderHelper';

const initialState = {
  list: [],        // all attendance records
  loading: false,  // loading state
  error: null,     // error messages
};

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all attendance records
    addAsyncThunkCases(builder, [fetchAttendance], {
      onFulfilled: (state, action) => {
        state.list = action.payload.attendance || [];
      },
    });

    // Add a new attendance record
    addAsyncThunkCases(builder, [addAttendance], {
      onFulfilled: (state, action) => {
        state.list.push(action.payload);
      },
    });
  },
});

export const { clearError } = attendanceSlice.actions;
export default attendanceSlice.reducer;
