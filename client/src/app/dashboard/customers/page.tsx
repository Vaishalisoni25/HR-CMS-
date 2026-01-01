import * as React from 'react';
import type { Metadata } from 'next';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';
import dayjs from 'dayjs';

import { config } from '@/config';
import { CustomersFilters } from '@/components/dashboard/customer/customers-filters';
import { CustomersTable } from '@/components/dashboard/customer/customers-table';
import type { Customer } from '@/components/dashboard/customer/customers-table';



export const metadata = { title: `Customers | Dashboard | ${config.site.name}` } satisfies Metadata;

const customers = [
  {
    id: 'EMP-009',
    name: 'Aarav Sharma',
    avatar: '/assets/employee-10.png',
    email: 'aarav.sharma@company.com',
    phone: '987-654-3210',
    jobTitle: 'Senior Software Engineer',
    address: { city: 'Bengaluru', country: 'India', state: 'Karnataka', street: 'MG Road 102' },
    employmentType: 'Full-Time',
    status: 'Active',
    joiningDate: dayjs().subtract(3, 'days').toDate(),
  },
  {
    id: 'EMP-010',
    name: 'Riya Patel',
    avatar: '/assets/employee-9.png',
    email: 'riya.patel@company.com',
    phone: '982-112-3388',
    jobTitle: 'HR Manager',
    address: { city: 'Mumbai', country: 'India', state: 'Maharashtra', street: 'Andheri West 44' },
    employmentType: 'Full-Time',
    status: 'Active',
    joiningDate: dayjs().subtract(1, 'week').toDate(),
  },
  {
  id: 'EMP-011',
  name: 'Neha Singh',
  avatar: '/assets/employee-11.png',
  email: 'neha.singh@company.com',
  phone: '912-543-7788',
  jobTitle: 'UI/UX Designer',
  address: { city: 'Pune', country: 'India', state: 'Maharashtra', street: 'Viman Nagar 12' },
  employmentType: 'Part-Time',
  status: 'Active',
  joiningDate: dayjs().subtract(15, 'day').toDate(),
},
{
  id: 'EMP-012',
  name: 'Kabir Mehta',
  avatar: '/assets/employee-12.png',
  email: 'kabir.mehta@company.com',
  phone: '998-221-5677',
  jobTitle: 'Project Manager',
  address: { city: 'Ahmedabad', country: 'India', state: 'Gujarat', street: 'Satellite Road 56' },
  employmentType: 'Full-Time',
  status: 'Active',
  joiningDate: dayjs().subtract(3, 'week').toDate(),
},
{
  id: 'EMP-013',
  name: 'Ananya Rao',
  avatar: '/assets/employee-13.png',
  email: 'ananya.rao@company.com',
  phone: '981-335-9981',
  jobTitle: 'Backend Developer',
  address: { city: 'Hyderabad', country: 'India', state: 'Telangana', street: 'Gachibowli 21' },
  employmentType: 'Contract',
  status: 'Active',
  joiningDate: dayjs().subtract(4, 'month').toDate(),
},
{
  id: 'EMP-014',
  name: 'Mohit Verma',
  avatar: '/assets/employee-14.png',
  email: 'mohit.verma@company.com',
  phone: '900-440-6652',
  jobTitle: 'QA Engineer',
  address: { city: 'Delhi', country: 'India', state: 'Delhi NCR', street: 'Saket Block C 77' },
  employmentType: 'Full-Time',
  status: 'Inactive',
  joiningDate: dayjs().subtract(6, 'month').toDate(),
},
{
  id: 'EMP-015',
  name: 'Tanya Kapoor',
  avatar: '/assets/employee-15.png',
  email: 'tanya.kapoor@company.com',
  phone: '987-556-2340',
  jobTitle: 'Data Analyst',
  address: { city: 'Chennai', country: 'India', state: 'Tamil Nadu', street: 'Anna Nagar 4th Street' },
  employmentType: 'Full-Time',
  status: 'Active',
  joiningDate: dayjs().subtract(2, 'week').toDate(),
}, 
] satisfies Customer[];

export default function Page(): React.JSX.Element {
  const page = 0;
  const rowsPerPage = 5;
  // const [search, setSearch] = React.useState(''); 
  const paginatedCustomers = applyPagination(customers, page, rowsPerPage);

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Employees</Typography>
          {/* <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Button color="inherit" startIcon={<UploadIcon fontSize="var(--icon-fontSize-md)" />}>
              Import
            </Button>
            <Button color="inherit" startIcon={<DownloadIcon fontSize="var(--icon-fontSize-md)" />}>
              Export
            </Button>
          </Stack> */}
        </Stack>
        <div>
          <Button startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />} variant="contained">
            Add
          </Button>
          
        </div>
      </Stack>
      <CustomersFilters />
      <CustomersTable
        count={paginatedCustomers.length}
        page={page}
        rows={paginatedCustomers}
        rowsPerPage={rowsPerPage}
      />
    </Stack>
  );
}

function applyPagination(rows: Customer[], page: number, rowsPerPage: number): Customer[] {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}
