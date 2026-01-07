import { Stack, CircularProgress, Typography, TableRow, TableCell } from '@mui/material';

export default function TableLoading({ colSpan, text = 'Loading...' }) {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} align="center">
        <Stack alignItems="center" py={3}>
          <CircularProgress size={24} />
          <Typography variant="body2" color="text.secondary" mt={1}>
            {text}
          </Typography>
        </Stack>
      </TableCell>
    </TableRow>
  );
}
