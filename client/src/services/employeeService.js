import {request} from './apiService';

//Add Employee
export const addEmployee = async (employeeData) => {
   const token = localStorage.getItem('token');
  console.log('Token before API request:', token); 
  
  return request({
    url: '/employees',
    method: 'POST',
    data: employeeData,
  });
};

export const getEmployees = () => {
  return request({
    url: '/employees',
    method: 'GET',
    data: null,
  });
};

export const deleteEmployee = (id) => {
  return request({
    url: `/employees/${id}`,
    method: 'DELETE',
  });
};

export const updateEmployee = (id, employeeData) => {
  return request({
    url: `/employees/${id}`, 
    method: 'PATCH',        
    data: employeeData,
  });
};