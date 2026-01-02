import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: 'http://localhost:8001/api',
  headers: { 'Content-Type': 'application/json' },
});

export const request = async ({ url, method, data, contentType, responseType = 'json' }) => {
  try {
    const headers = {
      Authorization: `${localStorage.getItem('token') || ''}`,
      ...(contentType && { 'Content-Type': contentType }),
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

      if (error.response) {
        let message = 'Request failed';

        switch (status) {
          case 400:
            message = 'Invalid request. Please check your input.';
            break;
          case 401:
            message = 'Unauthorized. Please login again.';
            break;
          case 403:
            message = 'You do not have permission to perform this action.';
            break;
          case 404:
            message = 'Requested resource not found.';
            break;
          case 409:
            message = 'Conflict. Data already exists.';
            break;
          case 422:
            message = 'Validation failed. Please check the form.';
            break;
          case 500:
            message = 'Server error. Please try again later.';
            break;
          default:
            message =
              error.response.data?.message ||
              error.response.data?.error ||
              'Something went wrong';
        }

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
        message: error.message,
      };
    }

    throw {
      success: false,
      message: 'Unexpected error occurred',
    };
  }
};