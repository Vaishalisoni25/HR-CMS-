import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: { 'Content-Type': 'application/json' },
});

export const request = async ({ url, method, data, contentType, responseType = 'json' }) => {
  try {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
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
      data: response.data,
      headers: response.headers,
      status: response.status,
    };
  } catch (error) {
    if (axios.isAxiosError && axios.isAxiosError(error)) {
      if (error.response) {
        console.error('API Request Error:', error.response.data);
        throw error.response.data;
      } else if (error.request) {
        console.error('No response received:', error.request);
        throw { message: 'No response from server' };
      } else {
        console.error('Axios Error:', error.message);
        throw { message: error.message };
      }
    } else {
      console.error('Unexpected Error:', error);
      throw { message: 'Something went wrong' };
    }
  }
};
