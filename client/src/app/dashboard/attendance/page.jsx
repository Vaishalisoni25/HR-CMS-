'use client';

import React, { useState } from "react";
import HRCalendar from "@/components/ui/HrCalendar";
import { Stack, Divider, Typography } from "@mui/material";
import AttendanceFilters from "@/components/dashboard/attendance/AttendanceFilters";

export default function AttendancePage() {
  const [employee, setEmployee] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  return (
    <Stack spacing={4}>
      <Typography variant="h4">Attendance</Typography>
      
      <AttendanceFilters
        employee={employee}
        setEmployee={setEmployee}
        month={month}
        setMonth={setMonth}
        year={year}
        setYear={setYear}
      />
    </Stack>
  );
}