'use client';

import { Stack, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { CustomTable } from '@/components/ui/CustomTable';
import { useState } from 'react';

const formatMonth = (date) => {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('en-IN', {
    month: 'short',
    year: 'numeric',
  });
};

export default function SalaryTable({ rows=[], employees=[], onEdit, onDelete }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const mappedRows = rows.map((row) => {
    const employee = employees.find((e) => e._id === row.employeeId);

    return {
      ...row,
      employeeName: employee?.name || '-',
      startMonth: formatMonth(row.startMonth),
      endMonth: formatMonth(row.endMonth),
      salary: `₹ ${row.basicPay?.toLocaleString('en-IN')}`,
    };
  });

   const paginatedRows = mappedRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // reset to first page
  };

  const columns = [
    {
      key: 'employeeName',
      label: 'Employee Name',
    },
    {
      key: 'startMonth',
      label: 'Start Month',
    },
    {
      key: 'endMonth',
      label: 'End Month',
    },
    {
      key: 'salary',
      label: 'Salary',
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <Stack direction="row" spacing={1}>
          <IconButton
            size="small"
            color="primary"
            onClick={() => onEdit(row)}
          >
            <EditIcon fontSize="small" />
          </IconButton>

          <IconButton
            size="small"
            color="error"
            onClick={() => onDelete(row)}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Stack>
      ),
    },
  ];

  return (
    <CustomTable
      columns={columns}
      rows={paginatedRows}       
      count={mappedRows.length}   
      page={page}
      rowsPerPage={rowsPerPage}
      onPageChange={handlePageChange}
      onRowsPerPageChange={handleRowsPerPageChange}
    />
  );
}
