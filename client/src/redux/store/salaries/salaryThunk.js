import createApiThunk from '../createApiThunk';

// Fetch all salaries
export const fetchSalaries = createApiThunk(
  'salaries/fetchSalaries',
  () => ({
    url: '/salaryStructure',
    method: 'GET',
    successMessage: 'Salaries loaded successfully',
  })
);

// Add a new salary
export const addSalary = createApiThunk(
  'salaries/addSalary',
  ({ employeeId, ...data }) => ({
    url: `/salaryStructure/${employeeId}`, 
    method: 'POST',
    data: {
        employeeId,
      ...data
    },
    successMessage: 'Salary added successfully',
  })
);

  export const updateSalary = createApiThunk(
  'salaries/updateSalary',
  ({ id, data }) => ({
    url: `/salaryStructure/${id}`,
    method: 'PATCH',
    data,
    successMessage: 'Salary updated successfully',
  })
);

// Delete salary by ID
export const deleteSalary = createApiThunk(
  'salaries/deleteSalary',
  ({id}) => ({
    url: `/salaryStructure/${id}`,
    method: 'DELETE',
    successMessage: 'Salary deleted successfully',
  })
);

export const fetchSalaryById = createApiThunk(
  'salaries/fetchSalaryById',
  (id) => ({
    url: `/salaryStructure/${id}`, 
    method: 'GET',
    successMessage: 'Salary loaded successfully',
  })
);