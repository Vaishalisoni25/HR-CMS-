'use client';

// import React from 'react';
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
// } from '@mui/material';

// const CustomTable = ({ columns = [], rows = [], ...props }) => {
//   return (
//     <TableContainer component={Paper}>
//       <Table {...props}>
//         <TableHead>
//           <TableRow>
//             {columns.map((col) => (
//               <TableCell key={col.field}>{col.label}</TableCell>
//             ))}
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           {rows.map((row, index) => (
//             <TableRow key={index}>
//               {columns.map((col) => (
//                 <TableCell key={col.field}>{row[col.field]}</TableCell>
//               ))}
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//     </TableContainer>
//   );
// };

// export default CustomTable;

import React, { useMemo } from 'react';
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
  Typography,
} from '@mui/material';
import { useSelection } from '@/hooks/use-selection';

const noop = () => {};

export function CustomTable({ columns = [], rows = [], count = 0, page = 0, rowsPerPage = 5 }) {
  // Get all row IDs for selection logic
  const rowIds = useMemo(() => rows.map((row) => row.id), [rows]);
  const { selectAll, deselectAll, selectOne, deselectOne, selected } = useSelection(rowIds);

  // Determine selection states
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
      {/* Table container */}
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: 800 }}>
          {/* Table Header */}
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

          {/* Table Body */}
          <TableBody>
            {rows.map((row) => {
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
            })}
          </TableBody>
        </Table>
      </Box>

      <Divider />

      {/* Pagination */}
      <TablePagination
        component="div"
        count={count}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={noop}
        onRowsPerPageChange={noop}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
}
