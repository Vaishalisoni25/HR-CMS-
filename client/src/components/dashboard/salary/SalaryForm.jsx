'use client';

import React, { useEffect } from 'react';
import { Grid } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FormModal from '@/components/ui/FormModal';
import GlobalInput from '@/components/ui/GlobalInput';
import { salarySchema } from '@/validations/salarySchema';

export default function SalaryFormModal({
  open,
  onClose,
  onSubmit,
  employees = [],
  loadingEmployees = false,
  initialData = null,
  editSalaryId = null,
}) {
  const defaultFormValues = {
    employeeId: '',
    salary: '',
    dateRange: { startDate: null, endDate: null },
  };

  const { control, handleSubmit, reset, clearErrors, formState: { errors } } = useForm({
    resolver: yupResolver(salarySchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: defaultFormValues,
  });

  useEffect(() => {
    if (open) clearErrors();
  }, [open, clearErrors]);

  useEffect(() => {
    reset(
      initialData
        ? {
            employeeId: initialData.employeeId?._id || initialData.employeeId,
            salary: initialData.basicPay ?? '',
            dateRange: {
              startDate: initialData.startMonth ? new Date(initialData.startMonth) : null,
              endDate: initialData.endMonth ? new Date(initialData.endMonth) : null,
            },
          }
        : defaultFormValues
    );
  }, [initialData, reset]);

  const formatDate = (date) => {
    if (!date) return null;
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const handleModalClose = () => {
    reset(defaultFormValues);
    clearErrors();
    onClose();
  };

  const submitHandler = ({ employeeId, salary, dateRange }) => {
    const employee = employees.find(emp => emp._id === employeeId);
    if (!employee) return console.error("Selected employee not found!");

    const { startDate, endDate } = dateRange || {};
    if (!startDate) return console.error("Start date missing");

    const basicPay = Number(salary);
    const grossSalary = basicPay;

    const payload = {
      employeeId,
      name: employee.name,
      month: startDate.getMonth() + 1,
      year: startDate.getFullYear(),
      basicPay,
      HRA: 0,
      grossSalary,
      specialAllowance: 0,
      startMonth: formatDate(startDate),
      endMonth: formatDate(endDate),
      status: "active",
    };

    console.log("Submitting salary payload:", payload);
    onSubmit(payload);
    reset(defaultFormValues);
  };

  // array for input fields
  const inputFields = [
    {
      name: 'employeeId',
      label: 'Employee Name',
      type: 'select',
      options: [
        { label: 'Select Employee', value: '', disabled: true },
        ...(loadingEmployees
          ? [{ label: 'Loading...', value: '', disabled: true }]
          : employees.map(emp => ({ label: emp.name, value: emp._id }))),
      ],
      gridProps: { xs: 12, md: 6, sx: { minWidth: 248 } },
    },
    {
      name: 'salary',
      label: 'Salary',
      type: 'text',
      gridProps: { xs: 12, md: 6 },
    },
    {
      name: 'dateRange',
      label: 'Date Range',
      type: 'dateRange',
      gridProps: { xs: 12 },
    },
  ];

  return (
    <FormModal
      open={open}
      title={editSalaryId ? "Edit Salary" : "Add Salary"}
      subtitle={editSalaryId ? "Update salary details" : "Assign salary to an employee"}
      onClose={handleModalClose}
      onSubmit={handleSubmit(submitHandler)}
      submitText={editSalaryId ? "Update Salary" : "Add Salary"}
      maxWidth='sm'
    >
      <Grid container spacing={2}>
        {inputFields.map(field => (
          <Grid key={field.name} {...field.gridProps}>
            <Controller
              name={field.name}
              control={control}
              render={({ field: controllerField }) => (
                <GlobalInput
                  type={field.type}
                  label={field.label}
                  value={
                    field.type === 'dateRange'
                      ? [controllerField.value.startDate, controllerField.value.endDate]
                      : controllerField.value
                  }
                  onChange={
                    field.type === 'dateRange'
                      ? (start, end) => controllerField.onChange({ startDate: start, endDate: end })
                      : controllerField.onChange
                  }
                  options={field.options || []}
                  errorMessage={
                    field.type === 'dateRange'
                      ? errors.dateRange?.startDate?.message || errors.dateRange?.endDate?.message || errors.dateRange?.message
                      : errors[field.name]?.message
                  }
                />
              )}
            />
          </Grid>
        ))}
      </Grid>
    </FormModal>
  );
}
