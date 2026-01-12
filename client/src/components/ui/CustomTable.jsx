'use client';

import React, { useState, useMemo } from 'react';
import {
  Box,
  Card,
  Checkbox,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Stack,
  Typography,
  Button,
} from '@mui/material';
import { useSelection } from '@/hooks/use-selection';
import TableLoading from '@/components/ui/TableLoading';
import TableEmpty from '@/components/ui/TableEmpty';
import { SearchInput } from '@/components/ui/SearchInput';
import { PlusIcon } from '@phosphor-icons/react';

export function CustomTable({
  columns = [],
  rows = [],
  rowKey = 'id',
  loading = false,
  rowsPerPageOptions = [5, 10, 25],

  title,
  showAddButton = false,
  onAddClick,
  showSearch = false,
  searchPlaceholder = 'Search...',
  headerOnly = false,
}) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);
  const [search, setSearch] = useState('');

  const filteredRows = useMemo(() => {
    if (!search) return rows;
    const lowerSearch = search.toLowerCase();
    return rows.filter((row) =>
      columns.some((col) => String(row[col.key]).toLowerCase().includes(lowerSearch))
    );
  }, [rows, columns, search]);

  const paginatedRows = filteredRows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const rowIds = useMemo(() => filteredRows.map((row) => row[rowKey]), [filteredRows, rowKey]);
  const { selectAll, deselectAll, selectOne, deselectOne, selected } = useSelection(rowIds);

  const selectedCount = selected.size;
  const selectedAll = filteredRows.length > 0 && selectedCount === filteredRows.length;
  const selectedSome = selectedCount > 0 && selectedCount < filteredRows.length;

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleSelectAll = (event) => (event.target.checked ? selectAll() : deselectAll());
  const handleSelectOne = (id, checked) => (checked ? selectOne(id) : deselectOne(id));

  return (
    <>

      <Stack spacing={2} >
        {(title || showAddButton) && (
          <Stack direction="row" spacing={2} alignItems="center">
            {title && <Typography variant="h4" sx={{ flex: 1 }}>{title}</Typography>}
            {showAddButton && (
              <Button
                variant="contained"
                startIcon={<PlusIcon />}
                onClick={onAddClick}
              >
                Add
              </Button>
            )}
          </Stack>
        )}

        {showSearch && (
          <SearchInput
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0); 
            }}
            placeholder={searchPlaceholder}
          />
        )}
      </Stack>

      <Card>

        {/* Table */}
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
              {loading && <TableLoading colSpan={columns.length + 1} />}
              {!loading && filteredRows.length === 0 && (
                <TableEmpty colSpan={columns.length + 1} text="No data found" />
              )}
              {!loading &&
                paginatedRows.map((row) => {
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
                })}
            </TableBody>
          </Table>
        </Box>

        <Divider />

        <TablePagination
          component="div"
          count={filteredRows.length}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={rowsPerPageOptions}
        />
      </Card>
    </>
  );
}
