import createApiThunk from '../createApiThunk';

// Fetch all adjustments
export const fetchAdjustments = createApiThunk(
  'adjustments/fetchAdjustments',
  () => ({
    url: '/adjustment/', 
    method: 'GET',
    successMessage: 'Adjustments loaded successfully',
  })
);

export const fetchAdjustmentById = createApiThunk(
  'adjustments/fetchAdjustmentById',
  (id) => ({
    url: `/adjustment/${id}`, 
    method: 'GET',
    successMessage: 'Adjustment loaded successfully',
  })
);

export const addAdjustment = createApiThunk(
  'adjustments/addAdjustment',
  ({ employeeId, formData }) => ({
    url: `/adjustment/${employeeId}`,
    method: 'POST',
    data: formData,
    contentType: "formData",
    successMessage: 'Adjustment added successfully',
  })
);

export const updateAdjustment = createApiThunk(
  'adjustments/updateAdjustment',
  ({ id, data }) => ({
    url: `/adjustment/${id}`,
    method: 'PATCH',
    data,
    contentType: 'formData',
    successMessage: 'Adjustment updated successfully',
  })
);

export const deleteAdjustment = createApiThunk(
  'adjustments/deleteAdjustment',
  ({ id }) => ({
    url: `/adjustment/${id}`, 
    method: 'DELETE',
    successMessage: 'Adjustment deleted successfully',
  })
);