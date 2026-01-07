import { TableRow, TableCell, Typography } from '@mui/material';

export default function TableEmpty({
  colSpan,
  text = 'No data found',
}) {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} align="center">
        <Typography variant="body2" color="text.secondary">
          {text}
        </Typography>
      </TableCell>
    </TableRow>
  );
}
