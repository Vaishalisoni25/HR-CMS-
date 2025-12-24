'use client';

import * as React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import dayjs from 'dayjs';
import FormModal from '@/components/ui/FormModal';
import { EmployeesFilters } from '@/components/dashboard/employee/employees-filters';
import { EmployeesTable } from '@/components/dashboard/employee/employees-table';
import type { Employee } from '@/components/dashboard/employee/employees-table';
import AddEmployeeForm from '@/components/dashboard/employee/AddEmployeeForm';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { addEmployee } from '@/services/employeeService';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { getEmployees, deleteEmployee, updateEmployee } from '@/services/employeeService';
import CustomModal from '@/components/ui/CustomModal';
import { validateEmployeeForm } from '@/utils/employeeValidations';
import { CircularProgress } from '@mui/material';

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

const mapEmployee = (item: any): Employee => ({
  id: item?._id,
  name: item?.name ?? '',
  email: item?.email ?? '',
  phone: item?.phone ?? '',
  position: item?.position ?? '',
  employmentType: item?.employmentType ?? '',
  status: item?.status ?? 'Active',
  joiningDate: item?.joiningDate
    ? new Date(item.joiningDate)
    : new Date(),
  avatar: item?.avatar,
  tax: item?.tax ?? '',
  employeeCode: item?.employeeCode ?? '',
});

export default function EmployeesClient() {
  const [employees, setEmployees] = React.useState<Employee[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [openAddModal, setOpenAddModal] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = React.useState('');
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [editEmployeeId, setEditEmployeeId] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
  const [employeeToDelete, setEmployeeToDelete] = React.useState<string | null>(null);

  const fetchEmployees = React.useCallback(async () => {
    setLoading(true);

    try {
      const response = await getEmployees();
      const data = response?.data?.data ?? [];

      setEmployees(data.map(mapEmployee));
    } catch (err: any) {
      setError(err?.message ?? 'Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const [newEmployee, setNewEmployee] = React.useState(EMPTY_EMPLOYEE);

  const resetForm = () => {
    setOpenAddModal(false);
    setEditEmployeeId(null);
    setNewEmployee(EMPTY_EMPLOYEE);
    setErrors({});
  };

  const handleChange = (name: string, value: any) => {
    setNewEmployee(prev => ({ ...prev, [name]: value }));
    setErrors(prev => {
      const newErrors = { ...prev };
      if (value?.toString().trim() !== '') {
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

    const payload: any = {
      ...newEmployee,
      joiningDate: newEmployee.joiningDate
        ? newEmployee.joiningDate.format('YYYY-MM-DD')
        : null,
      tax: newEmployee.tax ?? '',
    };

    if (!payload.password) {
      delete payload.password;
    }

    try {
      if (editEmployeeId) {
        // UPDATE
        await updateEmployee(editEmployeeId, payload);
        console.log(`Updating Employee ID: ${editEmployeeId}`);
        console.log('Updated Fields:', newEmployee);
        await fetchEmployees();
        setSuccessMessage('Employee updated successfully!');
      } else {
        // ADD
        const result = await addEmployee(payload);
        console.log('Add Employee API response:', result.data);
        console.log('Joining Date from API:', result.data.joiningDate);
        await fetchEmployees();
        setPage(0);
        setSuccessMessage('Employee created successfully!');
      }

      setOpenSnackbar(true);
      setOpenAddModal(false);
      setEditEmployeeId(null);
    } catch (error: any) {
      console.error(error);
      setError(error?.message ?? 'An error occurred while submitting the employee.');
    } finally {
      setSubmitting(false);
    }
  };

  React.useEffect(() => {
    setPage(0);
  }, [search]);

  const filteredEmployees = React.useMemo(() => {
    return employees.filter((employee) =>
      (employee.name || '').toLowerCase().includes((search || '').toLowerCase()) ||
      (employee.email || '').toLowerCase().includes((search || '').toLowerCase()) ||
      (employee.phone || '').includes(search || '')
    );
  }, [employees, search]);

  const paginatedEmployees = React.useMemo(() => {
    const start = page * rowsPerPage;
    return filteredEmployees.slice(start, start + rowsPerPage);
  }, [filteredEmployees, page, rowsPerPage]);

  const handleOpenDeleteModal = (id: string) => {
    setEmployeeToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!employeeToDelete) return;

    try {
      await deleteEmployee(employeeToDelete);
      await fetchEmployees();
      setSuccessMessage('Employee deleted successfully!');
      setOpenSnackbar(true);
    } catch (error) {
      console.error('Error deleting employee:', error);
      setError('Failed to delete employee.');
    } finally {
      setDeleteModalOpen(false);
      setEmployeeToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteModalOpen(false);
    setEmployeeToDelete(null);
  };


  const handleEditEmployee = (employee: Employee) => {
    setEditEmployeeId(employee.id);

    setNewEmployee({
      name: employee?.name ?? '',
      email: employee?.email ?? '',
      phone: employee?.phone ?? '',
      password: '',
      position: employee?.position ?? '',
      employmentType: employee?.employmentType ?? '',
      joiningDate: employee?.joiningDate ? dayjs(employee.joiningDate) : null,
      employeeCode: employee?.employeeCode ?? '',
      status: employee?.status ?? 'Active',
      tax: employee?.tax ?? '',
    });

    setErrors({});
    setOpenAddModal(true);
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

      <EmployeesFilters value={search} onChange={(e) => setSearch(e.target.value)} />

      {search && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ ml: 1 }}
        >
          {filteredEmployees.length} result
          {filteredEmployees.length !== 1 && 's'} found
        </Typography>
      )}

      {loading ? (
        <Stack alignItems="center" mt={4}>
          <CircularProgress />
          <Typography variant="body2" color="text.secondary" mt={1}>
            Loading employees...
          </Typography>
        </Stack>
      ) : (
        <EmployeesTable
          count={filteredEmployees.length}
          page={page}
          rows={paginatedEmployees}
          rowsPerPage={rowsPerPage}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={handleRowsPerPageChange}
          onDelete={(id) => handleOpenDeleteModal(id)}
          onEdit={handleEditEmployee}
        />
      )}

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
        submitText={submitting ? 'Saving...' : editEmployeeId ? 'Update' : 'Add'}
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
        <Alert onClose={() => setOpenSnackbar(false)} severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>
      {error && (
        <Snackbar
          open
          autoHideDuration={4000}
          onClose={() => setError('')}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert
            onClose={() => setError('')}
            severity="error"
            sx={{ width: '100%' }}
          >
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
        Are you sure you want to delete this employee? This action cannot be undone.
      </CustomModal>
    </Stack>
  );
}
