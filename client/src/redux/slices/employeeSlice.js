import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { request } from '@/services/apiService';

// Async Thunks
export const fetchEmployees = createAsyncThunk(
  'employees/fetchEmployees',
  async () => {
    const response = await request({ url: '/employees', method: 'GET' });
    console.log("response data:", response.data);
    return (response.data.data ?? []).map(emp => ({ ...emp, id: emp._id }));
  }
);

export const addEmployee = createAsyncThunk(
  'employees/addEmployee',
  async (employeeData) => {
    const response = await request({ url: '/employees', method: 'POST', data: employeeData });
    return { ...response.data, id: response.data._id };
  }
);

export const updateEmployee = createAsyncThunk(
  'employees/updateEmployee',
  async ({ id, employeeData }) => {
    const response = await request({ url: `/employees/${id}`, method: 'PATCH', data: employeeData });
    return { ...response.data, id: response.data._id };
  }
);

export const deleteEmployee = createAsyncThunk(
  'employees/deleteEmployee',
  async (id) => {
    await request({ url: `/employees/${id}`, method: 'DELETE' });
    return id;
  }
);

// Slice
const employeeSlice = createSlice({
  name: 'employees',
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
     
      .addCase(fetchEmployees.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch employees';
      })
      
      .addCase(addEmployee.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(addEmployee.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to add employee';
      })
      
      .addCase(updateEmployee.fulfilled, (state, action) => {
        const index = state.list.findIndex(emp => emp.id === action.payload.id);
        if (index !== -1) state.list[index] = action.payload;
      })
      .addCase(updateEmployee.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to update employee';
      })
      
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.list = state.list.filter(emp => emp.id !== action.payload);
      })
      .addCase(deleteEmployee.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to delete employee';
      });
  }
});

export default employeeSlice.reducer;
