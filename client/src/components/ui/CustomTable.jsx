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
import TableLoading from '@/components/ui/TableLoading';
import TableEmpty from '@/components/ui/TableEmpty';

const noop = () => { };

export function CustomTable(props) {
  const {
    columns,
    rows,
    rowKey,
    count,
    page,
    rowsPerPage,
    onPageChange,
    onRowsPerPageChange,
    loading,
  } = props;

  const rowIds = useMemo(
    () => rows.map((row) => row[rowKey]),
    [rows, rowKey]
  );
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
            {loading && (
              <TableLoading colSpan={columns.length + 1} />
            )}

            {!loading && rows.length === 0 && (
              <TableEmpty
                colSpan={columns.length + 1}
                text="No data found"
              />
            )}
            {!loading &&
              rows.map((row) => {
                const isSelected = selected.has(row[rowKey]);
                return (
                  <TableRow key={row[rowKey]} hover selected={isSelected}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isSelected}
                        onChange={(e) => handleSelectOne(row[rowKey], e.target.checked)}
                      />
                    </TableCell>
                    {columns.map((col) => (
                      <TableCell key={col.key}>
                        {col.render ? col.render(row) : row[col.key]}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              }
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

CustomTable.defaultProps = {
  columns: [],
  rows: [],
  rowKey: 'id',
  count: 0,
  page: 0,
  rowsPerPage: 5,
  onPageChange: () => { },
  onRowsPerPageChange: () => { },
  loading: false,
};