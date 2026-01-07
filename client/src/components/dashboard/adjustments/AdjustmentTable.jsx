'use client';

import { Stack, IconButton, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { CustomTable } from '@/components/ui/CustomTable';
import { useState } from 'react';

export default function AdjustmentTable({
  rows = [],
  employees = [],
  onEdit,
  onDelete,
}) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
   const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];


  const mappedRows = rows.map((row) => {
    const employeeId =
    typeof row.employeeId === 'object'
      ? row.employeeId._id
      : row.employeeId;
    const employee = employees.find((e) => e._id === row.employeeId);

    return {
      ...row,
       _id: row._id,
      employeeName: employee?.name || '-',
      month: row.month,
      year: row.year,
      amount: row.amount,
      type: row.type,
      __original: row,
    };
  });

  const paginatedRows = mappedRows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const columns = [
    { key: 'employeeName', label: 'Employee Name' },
    { key: 'month', label: 'Month',  render: (row) => monthNames[row.month - 1] || '-' },
    { key: 'year', label: 'Year' },
    { key: 'amount', label: 'Amount', render: (row) => `₹ ${Number(row.amount).toLocaleString('en-IN')}`, },
    { key: 'type', label: 'Add / Less' },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <Stack direction="row" spacing={1}>
          <IconButton size="small" onClick={() => onEdit(row.__original)} color="primary">
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={() => onDelete(row._id)} color="error">
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
      rowKey="_id" 
      count={mappedRows.length}
      page={page}
      rowsPerPage={rowsPerPage}
      onPageChange={(e, newPage) => setPage(newPage)}
      onRowsPerPageChange={(e) => {
        setRowsPerPage(parseInt(e.target.value, 10));
        setPage(0);
      }}
    />
  );
}
