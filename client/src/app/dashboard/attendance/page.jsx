'use client';

import React from "react";
import CustomTypography from "@/components/ui/CustomTypography";
import HRCalendar from "@/components/ui/HrCalendar";
import { Stack } from "@mui/material";

export default function AttendancePage() {
     return (
          <Stack spacing={3}>
          <CustomTypography variant="h4">
               Attendance
          </CustomTypography>

          <HRCalendar/>   
     </Stack>
     );
}