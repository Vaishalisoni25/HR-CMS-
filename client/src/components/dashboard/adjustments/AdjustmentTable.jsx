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

  const mappedRows = rows.map((row) => {
    const employee = employees.find((e) => e._id === row.employeeId);

    return {
      ...row,
      employeeName: employee?.name || '-',
      month: row.month,
      year: row.year,
      amount: row.amount,
      type: row.type,
    };
  });

  const paginatedRows = mappedRows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const columns = [
    { key: 'employeeName', label: 'Employee Name' },
    { key: 'month', label: 'Month' },
    { key: 'year', label: 'Year' },
    { key: 'amount', label: 'Amount' },
    { key: 'type', label: 'Add / Less' },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <Stack direction="row" spacing={1}>
          <IconButton size="small" onClick={() => onEdit(row)}>
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={() => onDelete(row)}>
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
      onPageChange={(e, newPage) => setPage(newPage)}
      onRowsPerPageChange={(e) => {
        setRowsPerPage(parseInt(e.target.value, 10));
        setPage(0);
      }}
    />
  );
}
