import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: 'http://localhost:8001/api',
  headers: { 'Content-Type': 'application/json' },
});

export const request = async ({ url, method, data, contentType, responseType = 'json' }) => {
  console.log(contentType,'contentType')
  try {
    const headers = {
      Authorization: `${localStorage.getItem('token') || ''}`,
      ...(contentType && { 'Content-Type': contentType==='formData'?'multipart/form-data' : contentType, }),
    };

    const response = await axiosInstance({
      url,
      method,
      data,
      headers,
      responseType,
    });

    return {
      success: true,
      message: response.data?.message || 'Request successful',
      data: response.data?.data ?? response.data,
      status: response.status,
    };
  } catch (error) {

    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const serverMessage = error.response?.data?.message || error.response?.data?.error;
      // Use server message 
      let message =
        serverMessage ||
        (status === 400
          ? 'Invalid request. Please check your input.'
          : status === 401
          ? 'Unauthorized. Please login again.'
          : status === 403
          ? 'You do not have permission to perform this action.'
          : status === 404
          ? 'Requested resource not found.'
          : status === 409
          ? 'Conflict. Data already exists.'
          : status === 422
          ? 'Validation failed. Please check the form.'
          : status === 500
          ? 'Server error. Please try again later.'
          : 'Something went wrong');

        throw {
          success: false,
          status,
          message,
          errors: error.response.data?.errors || null,
        };
      }

      if (error.request) {
        throw {
          success: false,
          message: 'Server not responding. Please try again.',
        };
      }

      throw {
        success: false,
        message: error.message || "Unexpected error occured",
      };
    }
};