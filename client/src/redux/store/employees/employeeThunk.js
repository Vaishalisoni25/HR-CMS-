import createApiThunk from '../createApiThunk';

export const fetchEmployees = createApiThunk(
  'employees/fetchEmployees',
  () => ({
    url: '/employees',
    method: 'GET',
    successMessage: 'Employees loaded successfully', 
  })
);

export const addEmployee = createApiThunk(
  'employees/addEmployee',
  (employeeData) => ({
    url: '/employees',
    method: 'POST',
    data: employeeData,
    successMessage: 'Employee added successfully',
  })
);

export const updateEmployee = createApiThunk(
  'employees/updateEmployee',
  ({ id, employeeData }) => ({
    url: `/employees/${id}`,
    method: 'PATCH',
    data: employeeData,
    successMessage: 'Employee updated successfully',
  })
);

export const deleteEmployee = createApiThunk(
  'employees/deleteEmployee',
  ({id}) => ({
    url: `/employees/${id}`,
    method: 'DELETE',
    successMessage: 'Employee deleted successfully',
  })
);

export const fetchEmployeeById = createApiThunk(
  'employees/fetchEmployeeById',
  ({id}) => ({
    url: `/employees/${id}`,
    method: 'GET',
    successMessage: 'Employee loaded successfully',
  })
);