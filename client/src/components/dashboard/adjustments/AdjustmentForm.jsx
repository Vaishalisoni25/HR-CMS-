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

  const optionsMap = {
    employees: employees.map(emp => ({
      value: emp._id,
      label: emp.name,
    })),
    months,
    years,
  };

  const formRows = [
    {
      fields: [
        {
          name: "employee",
          label: "Employee",
          type: "select",
          optionsKey: "employees",
        },
        {
          name: "amount",
          label: "Amount",
          type: "text",
        },
      ],
    },
    {
      fields: [
        {
          name: "month",
          label: "Month",
          type: "select",
          optionsKey: "months",
        },
        {
          name: "year",
          label: "Year",
          type: "select",
          optionsKey: "years",
        },
      ],
    },
  ];

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

        {formRows.map((row, rowIndex) => (
          <Stack key={rowIndex} direction="row" spacing={2}>
            {row.fields.map(field => (
              <Stack key={field.name} sx={{ flex: 1 }}>
                <Controller
                  name={field.name}
                  control={control}
                  render={({ field: controllerField }) => (
                    <GlobalInput
                      type={field.type}
                      label={field.label}
                      value={controllerField.value}
                      onChange={controllerField.onChange}
                      options={
                        field.optionsKey
                          ? optionsMap[field.optionsKey]
                          : undefined
                      }
                      errorMessage={errors[field.name]?.message}
                    />
                  )}
                />
              </Stack>
            ))}
          </Stack>
        ))}

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
