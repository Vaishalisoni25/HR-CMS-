'use client';

import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Stack, Card } from "@mui/material";

import GlobalInput from "@/components/ui/GlobalInput";
import ImageUploadField from "@/components/ui/ImageUploadField";
import { adjustmentSchema } from "@/validations/adjustmentValidationSchema";

export default function AdjustmentForm({
  employees = [],
  onSubmit,
  onFormSubmitRef,
  initialValues = null,
  isEditMode = false,
}) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(adjustmentSchema),
    defaultValues: {
      employee: "",
      month: "",
      year: "",
      amount: "",
      type: "add",
      description: "",
      image: null,
    },
    mode: "onSubmit",
  });

  useEffect(() => {
    if (isEditMode && initialValues) {
      reset({
        employee: initialValues.employeeId,
        month: initialValues.month,
        year: initialValues.year,
        amount: initialValues.amount,
        type: initialValues.type.toLowerCase(),
        description: initialValues.description || "",
        image: initialValues.image || null,
      });
    }
  }, [isEditMode, initialValues, reset]);

  const months = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => ({
    value: currentYear - i,
    label: (currentYear - i).toString(),
  }));

  const onFormSubmit = (data) => {
    const payload = {
      employeeId: data.employee,
      month: data.month,
      year: data.year,
      type: data.type.toUpperCase(),
      amount: data.amount,
      description: data.description,
      image: data.image,
    };

    onSubmit?.(payload, reset);
  };

  useEffect(() => {
    if (onFormSubmitRef) {
      onFormSubmitRef.current = handleSubmit(onFormSubmit);
    }
  }, [onFormSubmitRef, handleSubmit]);

  return (
    <Card sx={{ p: 4, borderRadius: 3, boxShadow: 3 }}>
      <Stack spacing={2}>

        {/* Employee + Amount */}
        <Stack direction="row" spacing={2}>
          <Stack sx={{ flex: 1 }}>
            <Controller
              name="employee"
              control={control}
              render={({ field }) => (
                <GlobalInput
                  type="select"
                  label="Employee"
                  value={field.value}
                  onChange={field.onChange}
                  options={employees.map(emp => ({
                    value: emp._id,
                    label: emp.name,
                  }))}
                  errorMessage={errors.employee?.message}
                />
              )}
            />
          </Stack>

          <Stack sx={{ flex: 1 }}>
            <Controller
              name="amount"
              control={control}
              render={({ field }) => (
                <GlobalInput
                  type="text"
                  label="Amount"
                  value={field.value}
                  onChange={field.onChange}
                  errorMessage={errors.amount?.message}
                />
              )}
            />
          </Stack>
        </Stack>

        {/* Month + Year */}
        <Stack direction="row" spacing={2}>
          <Stack sx={{ flex: 1 }}>
            <Controller
              name="month"
              control={control}
              render={({ field }) => (
                <GlobalInput
                  type="select"
                  label="Month"
                  value={field.value}
                  onChange={field.onChange}
                  options={months}
                  errorMessage={errors.month?.message}
                />
              )}
            />
          </Stack>

          <Stack sx={{ flex: 1 }}>
            <Controller
              name="year"
              control={control}
              render={({ field }) => (
                <GlobalInput
                  type="select"
                  label="Year"
                  value={field.value}
                  onChange={field.onChange}
                  options={years}
                  errorMessage={errors.year?.message}
                />
              )}
            />
          </Stack>
        </Stack>

        {/* Add / Less */}
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <GlobalInput
              type="radio"
              value={field.value}
              onChange={field.onChange}
              options={[
                { label: "Add", value: "add" },
                { label: "Less", value: "less" },
              ]}
              errorMessage={errors.type?.message}
            />
          )}
        />

        {/* Description */}
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <GlobalInput
              type="textarea"
              label="Description"
              value={field.value}
              onChange={field.onChange}
              rows={4}
              errorMessage={errors.description?.message}
            />
          )}
        />

        <ImageUploadField
          name="image"
          control={control}
          label="Upload Image"
        />

      </Stack>
    </Card>
  );
}
