'use client';

import { CustomTable } from "@/components/ui/CustomTable";
import { SearchInput } from "@/components/ui/SearchInput";
import { Stack, Typography } from "@mui/material";

export default function SalaryPage() {
     const columns = [
    { key: 'employeeName', label: 'Employee Name' },
    { key: 'startMonth', label: 'Start Month' },
    { key: 'endMonth', label: 'End Month' },
    { key: 'salary', label: 'Salary' },
  ];

  // Example rows
  const rows = [
    { id: '1', employeeName: 'John Doe', startMonth: 'Jan 2025', endMonth: 'Dec 2025', salary: '$5000' },
    { id: '2', employeeName: 'Jane Smith', startMonth: 'Feb 2025', endMonth: 'Nov 2025', salary: '$4500' },
    { id: '3', employeeName: 'Alice Johnson', startMonth: 'Mar 2025', endMonth: 'Oct 2025', salary: '$6000' },
  ];
     return (
        <Stack spacing={3}>
           <Stack direction="row" spacing={3}>
                   <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
                     <Typography variant="h4">Salaries</Typography>
                   </Stack>
            </Stack>
            <SearchInput />
            <CustomTable columns={columns} rows={rows} />
        </Stack>
     );
}