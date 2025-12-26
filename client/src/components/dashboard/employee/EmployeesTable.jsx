'use client';

import { CustomTable } from '@/components/ui/CustomTable';
import { formatEmail, formatPhone, formatEnumText } from '@/utils/formatter';
import dayjs from 'dayjs';
import { Stack, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export function EmployeesTable(props) {
  const { rows = [], loading, onEdit, onDelete, ...rest } = props;

  const columns = [
    {
      key: 'name',
      label: 'Name',
      render: (row) => row.name,
    },
    {
      key: 'email',
      label: 'Email',
      render: (row) => formatEmail(row.email),
    },
    {
      key: 'phone',
      label: 'Phone',
      render: (row) => formatPhone(row.phone),
    },
    {
      key: 'position',
      label: 'Position',
      render: (row) => formatEnumText(row.position),
    },
     { 
        key: 'employmentType', 
        label: 'Employment Type', 
        render: (row) => formatEnumText(row.employmentType), 
    },
     { 
        key: 'status', 
        label: 'Status', 
        render: (row) => formatEnumText(row.status), 
    },
    {
      key: 'joiningDate',
      label: 'Joining Date',
      render: (row) => dayjs(row.joiningDate).format('MMM D, YYYY'),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <Stack direction="row" spacing={1}>
          <IconButton size="small" color='primary' onClick={() => onEdit(row.id)}>
            <EditIcon />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            onClick={() => onDelete(row.id)}
          >
            <DeleteIcon />
          </IconButton>
        </Stack>
      ),
    },
  ];

  return (
    <CustomTable
      rows={rows}
      columns={columns}
      loading={loading}
      {...rest}
    />
  );
}
