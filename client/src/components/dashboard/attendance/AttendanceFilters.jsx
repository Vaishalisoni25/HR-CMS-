'use client';

import React, { useEffect, useState } from "react";
import { Button, IconButton, Stack } from "@mui/material";
import CustomSelect from "@/components/ui/CustomSelect";
import { useSelector, useDispatch } from "react-redux";
import { fetchEmployees } from "@/redux/store/employees/employeeThunk";
import CustomDatePicker from "@/components/ui/CustomDatePicker";
import dayjs from "dayjs";
import EmployeeDetailsCard from "./EmployeeDetailsCard";
import HRCalendar from "@/components/ui/HrCalendar";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

export default function AttendanceFilters({
  employee,
  setEmployee,
  month,
  setMonth,
  year,
  setYear,
}) {
  const dispatch = useDispatch();

  const employees = useSelector(state => state.employees?.list || []);
  const loadingEmployees = useSelector(state => state.employees?.loading);
  const [showAttendance, setShowAttendance] = useState(false);

  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    dispatch(fetchEmployees()).unwrap().catch(err => console.error(err));
  }, [dispatch]);

  const employeeOptions = [
    { value: "", label: "Select Employee", disabled: true },
    ...(loadingEmployees
      ? [{ value: "", label: "Loading...", disabled: true }]
      : employees.length === 0
        ? [{ value: "", label: "No employees found", disabled: true }]
        : employees.map(emp => ({ value: emp._id, label: emp.name })))
  ];
  const fieldWidth = 200;

  const selectedEmployee = employees.find(emp => emp._id === employee) || null;

  const currentYear = new Date().getFullYear();

  const handleShowAttendance = () => {
    if (!employee || !month || !year) return; 
    setShowAttendance(true);
  };

   const handleBack = () => {
    setShowAttendance(false);
  };

  return (
    <Stack spacing={3}>
  {showAttendance ? (
    <>
      <EmployeeDetailsCard employee={selectedEmployee} onBack={handleBack} />

      <HRCalendar
        selectedEmployee={employee}
        selectedMonth={month}
        selectedYear={year}
      />
    </>
  ) : (
    <Stack direction="row" spacing={2}>
      <CustomSelect
        label="Employee"
        value={employee}
        onChange={e => {
          setEmployee(e.target.value);
          setShowDetails(false);
        }}
        options={employeeOptions}
        sx={{ width: fieldWidth }}
      />

      <CustomDatePicker
        label="Year"
        views={['year']}
        value={year ? dayjs(`${year}-01-01`) : null}
        onChange={newValue => {
          if (newValue) setYear(newValue.year().toString());
          setShowDetails(false);
        }}
        width={fieldWidth}
        size="medium"
      />

      <CustomDatePicker
        label="Month"
        views={['month']}
        value={month && year ? dayjs(`${year}-${month}-01`) : null}
        onChange={newValue => {
          if (newValue) setMonth((newValue.month() + 1).toString());
          setShowDetails(false);
        }}
        width={fieldWidth}
        size="medium"
      />

      <Button
        variant="contained"
        color="primary"
        onClick={handleShowAttendance}
        disabled={!employee || !month || !year}
        sx={{ height: 56 }}
      >
        View Attendance
      </Button>
    </Stack>
  )}
</Stack>

  );
}
