'use client';

import * as React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { CircularProgress } from '@mui/material';
import dayjs from 'dayjs';

import FormModal from '@/components/ui/FormModal';
import CustomModal from '@/components/ui/CustomModal';
import { EmployeesFilters } from '@/components/dashboard/employee/employees-filters';
import AddEmployeeForm from '@/components/dashboard/employee/AddEmployeeForm';
import { validateEmployeeForm } from '@/utils/employeeValidations';
import { fetchEmployees, updateEmployee, addEmployee, deleteEmployee, fetchEmployeeById } from '@/redux/store/employees/employeeThunk';
import { EmployeesTable } from '@/components/dashboard/employee/EmployeesTable';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';

const EMPTY_EMPLOYEE = {
  name: '',
  email: '',
  phone: '',
  password: '',
  position: '',
  employmentType: '',
  joiningDate: null,
  status: 'Active',
  tax: '',
  employeeCode: '',
};

export default function EmployeesClient() {
  const dispatch = useAppDispatch();
  const { list: employees, loading, error } = useAppSelector(
    (state) => state.employees
  );

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [search, setSearch] = React.useState('');
  const [openAddModal, setOpenAddModal] = React.useState(false);
  const [errors, setErrors] = React.useState({});
  const [successMessage, setSuccessMessage] = React.useState('');
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [editEmployeeId, setEditEmployeeId] = React.useState(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
  const [employeeToDelete, setEmployeeToDelete] = React.useState(null);

  const [newEmployee, setNewEmployee] = React.useState(EMPTY_EMPLOYEE);

  const mapEmployee = (item) => ({
    id: item?._id,
    name: item?.name || '',
    email: item?.email || '',
    phone: item?.phone || '',
    position: item?.position || '',
    employmentType: item?.employmentType || '',
    status: item?.status || 'Active',
    joiningDate: item?.joiningDate ? new Date(item.joiningDate) : new Date(),
    tax: item?.tax || '',
    employeeCode: item?.employeeCode || '',
  });

  React.useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  const resetForm = () => {
    setOpenAddModal(false);
    setEditEmployeeId(null);
    setNewEmployee(EMPTY_EMPLOYEE);
    setErrors({});
  };

  const handleChange = (name, value) => {
    setNewEmployee((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => {
      const newErrors = { ...prev };
      if (value?.toString().trim()) {
        delete newErrors[name];
      } else {
        newErrors[name] = `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
      }
      return newErrors;
    });
  };

  const handleSubmitEmployee = async () => {
    const validationErrors = validateEmployeeForm(newEmployee, !!editEmployeeId);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setSubmitting(true);

    const payload = {
      ...newEmployee,
      joiningDate: newEmployee.joiningDate
        ? dayjs(newEmployee.joiningDate).format('YYYY-MM-DD')
        : null,
      tax: newEmployee.tax || '',
    };

    if (!payload.password) delete payload.password;

    try {
      if (editEmployeeId) {
        await dispatch(updateEmployee({ id: editEmployeeId, employeeData: payload }));
        setSuccessMessage('Employee updated successfully!');
      } else {
        await dispatch(addEmployee(payload));
        setPage(0);
        setSuccessMessage('Employee created successfully!');
      }
      setOpenSnackbar(true);
      resetForm();
      dispatch(fetchEmployees());
    } catch (err) {
      console.error(err);
      setSuccessMessage('Failed to save employee.');
      setOpenSnackbar(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenDeleteModal = (id) => {
    console.log('Opening delete modal for id:', id);
    setEmployeeToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!employeeToDelete) return;
    console.log('Deleting employee with id:', employeeToDelete);

    try {
      await dispatch(deleteEmployee({ id: employeeToDelete }));
      setSuccessMessage('Employee deleted successfully!');
      setOpenSnackbar(true);
      dispatch(fetchEmployees());
    } catch (err) {
      console.error(err);
      setSuccessMessage('Failed to delete employee.');
      setOpenSnackbar(true);
    } finally {
      setDeleteModalOpen(false);
      setEmployeeToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteModalOpen(false);
    setEmployeeToDelete(null);
  };

  const handleEditEmployee = async (employeeId) => {
    console.log('Fetching employee with ID:', employeeId, typeof employeeId);
    setSubmitting(true);
    try {
      const resultAction = await dispatch(fetchEmployeeById({ id: employeeId }));
      console.log('API response:', resultAction.payload);

      if (fetchEmployeeById.fulfilled.match(resultAction)) {
        const employee = resultAction.payload;

        setEditEmployeeId(employee._id);
        setNewEmployee({
          name: employee.name || '',
          email: employee.email || '',
          phone: employee.phone || '',
          password: '',
          position: employee.position || '',
          employmentType: employee.employmentType || '',
          joiningDate: employee.joiningDate ? dayjs(employee.joiningDate) : null,
          employeeCode: employee.employeeCode || '',
          status: employee.status || 'Active',
          tax: employee.tax || '',
        });

        setErrors({});
        setOpenAddModal(true);
      } else {
        throw new Error(resultAction.error.message);
      }
    } catch (err) {
      console.error(err);
      setSuccessMessage('Failed to load employee data.');
      setOpenSnackbar(true);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredEmployees = React.useMemo(() => {
    return employees
      .map(mapEmployee)
      .filter(
        (emp) =>
          emp.name.toLowerCase().includes(search.toLowerCase()) ||
          emp.email.toLowerCase().includes(search.toLowerCase()) ||
          emp.phone.includes(search)
      );
  }, [employees, search]);

  const paginatedEmployees = React.useMemo(() => {
    const start = page * rowsPerPage;
    return filteredEmployees.slice(start, start + rowsPerPage);
  }, [filteredEmployees, page, rowsPerPage]);

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Employees</Typography>
        </Stack>
        <Button
          variant="contained"
          startIcon={<PlusIcon />}
          onClick={() => {
            resetForm();
            setOpenAddModal(true);
          }}
        >
          Add Employee
        </Button>
      </Stack>

      <EmployeesFilters
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {search && (
        <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
          {filteredEmployees.length} result
          {filteredEmployees.length !== 1 && 's'} found
        </Typography>
      )}

      <EmployeesTable
        rows={paginatedEmployees}
        loading={loading}
        count={filteredEmployees.length}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={(_, newPage) => setPage(newPage)}
        onRowsPerPageChange={handleRowsPerPageChange}
        onEdit={(id) => handleEditEmployee(id)}
        onDelete={(id) => {
          setEmployeeToDelete(id);
          setDeleteModalOpen(true);
        }}
      />

      <FormModal
        open={openAddModal}
        title={editEmployeeId ? 'Edit Employee' : 'Add Employee'}
        subtitle={
          editEmployeeId
            ? 'Update employee details'
            : 'Fill out the form to add a new employee'
        }
        icon={<PersonAddIcon color="primary" />}
        onClose={resetForm}
        onSubmit={handleSubmitEmployee}
        submitText={
          submitting ? 'Saving...' : editEmployeeId ? 'Update' : 'Add'
        }
        cancelText="Cancel"
      >
        <AddEmployeeForm
          values={newEmployee}
          onChange={(e) => handleChange(e.target.name, e.target.value)}
          onDateChange={(name, date) => handleChange(name, date)}
          errors={errors}
        />
      </FormModal>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>

      {error && (
        <Snackbar
          open
          autoHideDuration={4000}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>
      )}

      <CustomModal
        open={deleteModalOpen}
        onClose={handleCancelDelete}
        title="Confirm Deletion"
        actions={[
          { label: 'Cancel', onClick: handleCancelDelete, color: 'primary' },
          { label: 'Delete', onClick: handleConfirmDelete, color: 'error' },
        ]}
      >
        Are you sure you want to delete this employee? This action cannot be
        undone.
      </CustomModal>
    </Stack>
  );
}
