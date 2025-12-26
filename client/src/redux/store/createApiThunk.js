import { createAsyncThunk } from '@reduxjs/toolkit';
import { request } from '@/services/apiService';
import { useSnackbar } from './SnackbarProvider';

const createApiThunk = (type, apiConfigFn) => {
  return createAsyncThunk(type, async (arg, { rejectWithValue }) => {
    try {
      const { snackbar, ...rest } = arg || {};
      const config = apiConfigFn(rest);

      const response = await request({
        url: config.url,
        method: config.method,
        data: config.data,
        contentType: config.contentType,
        responseType: config.responseType,
      });

      if (snackbar) {
        const successMsg = config.successMessage || response.message;
        if (successMsg) snackbar(successMsg, 'success');
      }

      return response.data;

    } catch (error) {
      if (arg?.snackbar) {
        snackbar(error.message || 'Something went wrong', 'error');
      }
      return rejectWithValue(error);
    }
  });
};

export default createApiThunk;
