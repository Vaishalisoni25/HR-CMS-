'use client';

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';
import { useSelection } from '@/hooks/use-selection';
import { IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { capitalizeText, formatPhone, formatEmail, formatStatus, formatEnumText } from '@/utils/formatter';


export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  position:string;
  employmentType: string;
  status: 'Active' | 'On Leave' | 'Inactive';
  joiningDate: Date;
   employeeCode: string;
  avatar?: string;
   tax?: string;
}

interface EmployeesTableProps {
  count: number;
  rows: Employee[];
  page: number;
  rowsPerPage: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement> | null,
    page: number
  ) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void; 
   onDelete: (id: string) => void;
   onEdit: (employee: Employee) => void; 
}

export function EmployeesTable({
  count = 0,
  rows = [],
  page = 0,
  rowsPerPage = 0,
  onPageChange,
  onRowsPerPageChange,
  onDelete,
  onEdit
}: EmployeesTableProps) {
  const rowIds = React.useMemo(() => {
    return rows.map((employee) => employee.id);
  }, [rows]);

  const { selectAll, deselectAll, selectOne, deselectOne, selected } = useSelection(rowIds);

  const selectedSome = (selected?.size ?? 0) > 0 && (selected?.size ?? 0) < rows.length;
  const selectedAll = rows.length > 0 && selected?.size === rows.length;

  return (
    <Card>
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: '800px' }}>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedAll}
                  indeterminate={selectedSome}
                  onChange={(event) => {
                    if (event.target.checked) {
                      selectAll();
                    } else {
                      deselectAll();
                    }
                  }}
                />
              </TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Position</TableCell>
              <TableCell>Employment Type</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Joining Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => {
              const isSelected = selected?.has(row.id);

              return (
                <TableRow hover key={row.id ?? index} selected={isSelected}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isSelected}
                      onChange={(event) => {
                        if (event.target.checked) {
                          selectOne(row.id);
                        } else {
                          deselectOne(row.id);
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
                      <Avatar src={row.avatar} />
                      <Typography variant="subtitle2">{capitalizeText(row.name)}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>{formatEmail(row.email)}</TableCell>
                  <TableCell>{formatPhone(row.phone)}</TableCell>
                  <TableCell>{formatEnumText(row.position)}</TableCell>
                  <TableCell>{formatEnumText(row.employmentType)}</TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{
                        color:
                          row.status === 'Active'
                            ? 'var(--mui-palette-success-main)'
                            : row.status === 'On Leave'
                              ? 'var(--mui-palette-warning-main)'
                              : 'var(--mui-palette-error-main)',
                        fontWeight: 600,
                      }}
                    >
                      {formatStatus(row.status)}
                    </Typography>
                  </TableCell>
                  <TableCell>{dayjs(row.joiningDate).format('MMM D, YYYY')}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <IconButton
                        color="primary"
                        size="small"
                        onClick={() => onEdit(row)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => onDelete(row.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
      <Divider />
      <TablePagination
        component="div"
        count={count}
        onPageChange={onPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={onRowsPerPageChange}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
}
