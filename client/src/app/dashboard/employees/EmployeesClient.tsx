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
import { TextField } from '@mui/material';
import AddEmployeeForm from '@/components/dashboard/employee/AddEmployeeForm';

const employees: Employee[] = [
  {
    id: 'EMP-01',
    name: 'Aarav Sharma',
    avatar: '/assets/avatar-1.png',
    email: 'aarav.sharma@company.com',
    phone: '987-654-3210',
    jobTitle: 'Senior Software Engineer',
    employmentType: 'Full-Time',
    status: 'Active',
    joiningDate: dayjs().subtract(3, 'days').toDate(),
  },
  {
    id: 'EMP-02',
    name: 'Riya Patel',
    avatar: '/assets/avatar-2.png',
    email: 'riya.patel@company.com',
    phone: '982-112-3388',
    jobTitle: 'HR Manager',
    employmentType: 'Full-Time',
    status: 'Active',
    joiningDate: dayjs().subtract(1, 'week').toDate(),
  },
  {
    id: 'EMP-03',
    name: 'Neha Singh',
    avatar: '/assets/avatar-3.png',
    email: 'neha.singh@company.com',
    phone: '912-543-7788',
    jobTitle: 'UI/UX Designer',
    employmentType: 'Part-Time',
    status: 'Active',
    joiningDate: dayjs().subtract(15, 'day').toDate(),
  },
  {
    id: 'EMP-04',
    name: 'Kabir Mehta',
    avatar: '/assets/avatar-4.png',
    email: 'kabir.mehta@company.com',
    phone: '998-221-5677',
    jobTitle: 'Project Manager',
    employmentType: 'Full-Time',
    status: 'Active',
    joiningDate: dayjs().subtract(3, 'week').toDate(),
  },
  {
    id: 'EMP-05',
    name: 'Ananya Rao',
    avatar: '/assets/avatar-5.png',
    email: 'ananya.rao@company.com',
    phone: '981-335-9981',
    jobTitle: 'Backend Developer',
    employmentType: 'Contract',
    status: 'Active',
    joiningDate: dayjs().subtract(4, 'month').toDate(),
  },
  {
    id: 'EMP-06',
    name: 'Mohit Verma',
    avatar: '/assets/avatar-6.png',
    email: 'mohit.verma@company.com',
    phone: '900-440-6652',
    jobTitle: 'QA Engineer',
    employmentType: 'Full-Time',
    status: 'Inactive',
    joiningDate: dayjs().subtract(6, 'month').toDate(),
  },
  {
    id: 'EMP-07',
    name: 'Tanya Kapoor',
    avatar: '/assets/avatar-7.png',
    email: 'tanya.kapoor@company.com',
    phone: '987-556-2340',
    jobTitle: 'Data Analyst',
    employmentType: 'Full-Time',
    status: 'Active',
    joiningDate: dayjs().subtract(2, 'week').toDate(),
  },
];

export default function EmployeesClient() {
  const [page, setPage] = React.useState(0);
  const rowsPerPage = 5;
  const [openAddModal, setOpenAddModal] = React.useState(false);
  const [search, setSearch] = React.useState('');

  const [newEmployee, setNewEmployee] = React.useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    employmentType: '',
    joiningDate: dayjs(),
    salary: '', 
    status: 'Active',
  });

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewEmployee((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (name: string, date: dayjs.Dayjs | null) => {
    if (!date) return;
    setNewEmployee((prev) => ({ ...prev, [name]: date }));
  };

  // Handle Add Employee submission
  const handleAddEmployee = () => {
    const payload = {
      ...newEmployee,
      joiningDate: newEmployee.joiningDate.format('YYYY-MM-DD'),
    };
    console.log('New Employee:', newEmployee);
    // Here you can push to your employees array or call an API
    setOpenAddModal(false);
    setNewEmployee({
      name: '',
      email: '',
      phone: '',
      position: '',
      employmentType: '',
      joiningDate: dayjs(),
      salary: '',
  status: 'Active',
    });
  };

  const filteredEmployees = employees.filter((employee) =>
    employee.name.toLowerCase().includes(search.toLowerCase()) ||
    employee.email.toLowerCase().includes(search.toLowerCase()) ||
    employee.phone.includes(search)
  );

  const paginatedEmployees = filteredEmployees.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Employees</Typography>
        </Stack>
        <Button
          variant="contained"
          startIcon={<PlusIcon />}
          onClick={() => setOpenAddModal(true)}
        >
          Add
        </Button>
      </Stack>

      <EmployeesFilters value={search} onChange={(e) => setSearch(e.target.value)} />

      <EmployeesTable
        count={employees.length}
        page={page}
        rows={paginatedEmployees}
        rowsPerPage={rowsPerPage}
        onPageChange={(_, newPage) => setPage(newPage)}
      />

      <FormModal
        open={openAddModal}
        title="Add Employee"
        onClose={() => setOpenAddModal(false)}
        onSubmit={handleAddEmployee}
        submitText="Add"
        cancelText="Cancel"
      >
        <AddEmployeeForm
          values={newEmployee}
          onChange={handleFormChange}
          onDateChange={handleDateChange}
        />
      </FormModal>
    </Stack>
  );
}
