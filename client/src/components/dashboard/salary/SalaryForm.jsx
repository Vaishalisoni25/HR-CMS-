'use client';

import React from 'react';
import { Grid, TextField, MenuItem } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FormModal from '@/components/ui/FormModal';
import DateRangePicker from '@/components/ui/DateRangePicker';
import { salarySchema } from '@/validations/salarySchema';
import { useEffect } from 'react';

export default function SalaryFormModal({ open, onClose, onSubmit, employees, loadingEmployees, initialData,  editSalaryId }) {
  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(salarySchema),
    defaultValues: {
      employeeId: '',
      salary: '',
      dateRange: { startDate: null, endDate: null },
    },
  });

   useEffect(() => {
    console.log("initialData received by form:", initialData);
  }, [initialData]);

  useEffect(() => {
    if (initialData) {
      reset({
        employeeId: initialData.employeeId?._id || initialData.employeeId,
        salary: initialData.basicPay ?? '',
        dateRange: {
          startDate: initialData.startMonth
            ? new Date(initialData.startMonth)
            : null,
          endDate: initialData.endMonth
            ? new Date(initialData.endMonth)
            : null,
        },
      });
    } else {
      reset({
        employeeId: '',
        salary: '',
        dateRange: { startDate: null, endDate: null },
      });
    }
  }, [initialData, reset]);

  const formatDate = (date) => {
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  };

  const submitHandler = (data) => {
    const { employeeId, salary, dateRange } = data;
    const employee = employees.find(emp => emp._id === employeeId);

  if (!employee) {
    console.error("Selected employee not found!");
    return;
  }
    const start = new Date(dateRange.startDate);
      const grossSalary = Number(salary) + 0 + 0;

    const payload = {
      employeeId,
      name: employee.name,
      month: start.getMonth() + 1,
      year: start.getFullYear(),
      basicPay: Number(salary),
      HRA: 0,
       grossSalary,
      specialAllowance: 0,
      startMonth: formatDate(dateRange.startDate),
      endMonth: formatDate(dateRange.endDate),
      status: "active",
    };

    console.log("Submitting salary payload:", payload);
    onSubmit(payload);
    reset(); 
  };

  return (
    <FormModal
      open={open}
      title={editSalaryId ? "Edit Salary" : "Add Salary"}
      subtitle={editSalaryId ? "Update salary details" : "Assign salary to an employee"}
      onClose={onClose}
      onSubmit={handleSubmit(submitHandler)}
      submitText={editSalaryId ? "Update Salary" : "Add Salary"}
      maxWidth='sm'
    >
      <Grid container spacing={2}>

        {/* Employee select */}
        <Grid item xs={12} md={6} sx={{ minWidth: 248 }}>
          <Controller
            name="employeeId"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                select
                fullWidth
                label="Employee Name"
                error={!!errors.employeeId}
                helperText={errors.employeeId?.message}
              >
                <MenuItem value="" disabled>Select Employee</MenuItem>
                {loadingEmployees ? (
                  <MenuItem disabled>Loading...</MenuItem>
                ) : (
                  employees?.map(emp => (
                    <MenuItem key={emp._id} value={emp._id}>{emp.name}</MenuItem>
                  ))
                )}
              </TextField>
            )}
          />
        </Grid>

        {/* Salary input */}
        <Grid item xs={12} md={6}>
          <Controller
            name="salary"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                type="number"
                label="Salary"
                error={!!errors.salary}
                helperText={errors.salary?.message}
              />
            )}
          />
        </Grid>

        {/* Date Range Picker */}
        <Grid item xs={12}>
          <Controller
            name="dateRange"
            control={control}
            render={({ field }) => (
              <>
                <DateRangePicker
                  startDate={field.value.startDate}
                  endDate={field.value.endDate}
                  onChange={(start, end) => field.onChange({ startDate: start, endDate: end })}
                />
                {(errors.dateRange?.startDate || errors.dateRange?.endDate) && (
                  <p style={{ color: 'red', fontSize: 12 }}>
                    {errors.dateRange?.startDate?.message || errors.dateRange?.endDate?.message}
                  </p>
                )}
              </>
            )}
          />
        </Grid>

      </Grid>
    </FormModal>
  );
}
