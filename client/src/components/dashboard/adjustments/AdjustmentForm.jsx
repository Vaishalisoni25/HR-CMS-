'use client';

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Stack, Button, MenuItem, Card, Box, IconButton, Typography } from "@mui/material";
import CustomSelect from "@/components/ui/CustomSelect";
import CustomTextField from "@/components/ui/CustomTextField";
import CustomTextArea from "@/components/ui/CustomTextArea";
import CustomRadioGroup from "@/components/ui/CustomRadioGroup";
import { adjustmentSchema } from "@/validations/adjustmentValidationSchema"; // Yup schema
import ImageUploadField from "@/components/ui/ImageUploadField";

export default function AdjustmentForm({ employees = [], onSubmit, onFormSubmitRef }) {
    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
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

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

    const onFormSubmit = (data) => {
        console.log("Adjustment Form Data:", data);
        if (onSubmit) onSubmit(data);
        reset();
    };

    if (onFormSubmitRef) {
        onFormSubmitRef.current = handleSubmit(onFormSubmit);
    }

    return (
        <Card sx={{ p: 4, borderRadius: 3, boxShadow: 3 }}>
           
                <Stack spacing={2}>

                    {/* Employee */}
                    <Stack direction="row" spacing={2}>
                        <Stack sx={{ flex: 1 }}>
                            <Controller
                                name="employee"
                                control={control}
                                render={({ field }) => (
                                    <CustomSelect
                                        {...field}
                                        label="Employee"
                                        options={employees.map(emp => ({
                                            value: emp.id || emp._id,
                                            label: emp.name
                                        }))}
                                        errorMessage={errors.employee?.message}
                                    />
                                )}
                            />
                        </Stack>
                        {/* Amount */}
                        <Stack sx={{ flex: 1 }}>
                            <Controller
                                name="amount"
                                control={control}
                                render={({ field }) => (
                                    <CustomTextField
                                        {...field}
                                        label="Amount"
                                        type="number"
                                        errorMessage={errors.amount?.message}
                                    />
                                )}
                            />
                        </Stack>
                    </Stack>

                    {/* Year */}
                    <Stack direction="row" spacing={2}>
                        <Stack sx={{ flex: 1 }}>
                            {/* Month */}
                            <Controller
                                name="month"
                                control={control}
                                render={({ field }) => (
                                    <CustomSelect
                                        {...field}
                                        label="Month"
                                        options={months.map(m => ({ value: m, label: m }))}
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
                                    <CustomSelect
                                        {...field}
                                        label="Year"
                                        options={years.map(y => ({ value: y, label: y.toString() }))}
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
                            <CustomRadioGroup
                                // label="Add / Less"
                                options={[
                                    { label: "Add", value: "add" },
                                    { label: "Less", value: "less" },
                                ]}
                                value={field.value || ""}
                                onChange={(e) => field.onChange(e.target.value)}
                                row={true}
                            />
                        )}
                    />

                    {/* Description */}
                    <Controller
                        name="description"
                        control={control}
                        render={({ field }) => (
                            <CustomTextArea
                                {...field}
                                label="Description"
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
