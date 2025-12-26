'use client';

import React, { useMemo, useState } from 'react';
import {
  Box,
  Card,
  Checkbox,
  CircularProgress,
  Divider,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';
import { useSelection } from '@/hooks/use-selection';

const noop = () => { };

export function CustomTable({
  columns = [],
  rows = [],
  count = 0,
  page = 0,
  rowsPerPage = 5,
  onPageChange = () => { },
  onRowsPerPageChange = () => { },
  loading = false,
}) {
  const rowIds = useMemo(() => rows.map((row) => row.id), [rows]);
  const { selectAll, deselectAll, selectOne, deselectOne, selected } = useSelection(rowIds);

  const selectedCount = selected.size;
  const selectedAll = rows.length > 0 && selectedCount === rows.length;
  const selectedSome = selectedCount > 0 && selectedCount < rows.length;

  const handleSelectAll = (event) => {
    event.target.checked ? selectAll() : deselectAll();
  };

  const handleSelectOne = (id, checked) => {
    checked ? selectOne(id) : deselectOne(id);
  };

  return (
    <Card>
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedAll}
                  indeterminate={selectedSome}
                  onChange={handleSelectAll}
                />
              </TableCell>
              {columns.map((col) => (
                <TableCell key={col.key}>{col.label}</TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length + 1} align="center">
                  <Stack alignItems="center" py={3}>
                    <CircularProgress size={24} />
                    <Typography variant="body2" color="text.secondary" mt={1}>
                      Loading...
                    </Typography>
                  </Stack>
                </TableCell>
              </TableRow>
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + 1} align="center">
                  <Typography variant="body2" color="text.secondary">
                    No data found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => {
                const isSelected = selected.has(row.id);
                return (
                  <TableRow key={row.id} hover selected={isSelected}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isSelected}
                        onChange={(e) => handleSelectOne(row.id, e.target.checked)}
                      />
                    </TableCell>
                    {columns.map((col) => (
                      <TableCell key={col.key}>
                        {col.render ? col.render(row) : row[col.key]}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </Box>

      <Divider />

      <TablePagination
        component="div"
        count={count}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
}
