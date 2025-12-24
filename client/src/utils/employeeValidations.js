/**
 * Validates employee form data.
 * @param {Object} values - Employee form values
 * @param {boolean} isEditMode - true if editing, false if adding new employee
 * @returns {Object} errors - Record of errors keyed by field name
 */
export const validateEmployeeForm = (values, isEditMode = false) => {
  const errors = {};

  // Required fields
  const requiredFields = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'password', label: 'Password', condition: !isEditMode }, // only for new employee
    { key: 'position', label: 'Position' },
    { key: 'employmentType', label: 'Employment Type' },
    { key: 'employeeCode', label: 'Employee Code' },
    { key: 'status', label: 'Status' },
    { key: 'joiningDate', label: 'Joining Date' },
    { key: 'tax', label: 'Tax' },
  ];

  requiredFields.forEach((field) => {
    const value = values[field.key];
    if ((field.condition ?? true) && (value === null || value === undefined || value === '')) {
      errors[field.key] = `${field.label} is required`;
    }
  });
  
  if (values.email && !/^\S+@\S+\.\S+$/.test(values.email)) {
    errors.email = 'Email is invalid';
  }
  
  if (values.phone && !/^\d{10}$/.test(values.phone)) {
    errors.phone = 'Phone must be 10 digits';
  }
  
  if (values.password && !isEditMode) {
    const password = values.password;
    const passwordErrors = [];

    if (password.length < 8) passwordErrors.push('at least 8 characters');
    if (!/[A-Z]/.test(password)) passwordErrors.push('one uppercase letter');
    if (!/[a-z]/.test(password)) passwordErrors.push('one lowercase letter');
    if (!/[0-9]/.test(password)) passwordErrors.push('one number');
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) passwordErrors.push('one special character');

    if (passwordErrors.length > 0) {
      errors.password = `Password must contain ${passwordErrors.join(', ')}`;
    }
  }

  return errors;
};
