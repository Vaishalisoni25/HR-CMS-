'use client';

import React from 'react';

// Custom Components
import CustomTextField from '@/components/ui/CustomTextField';
import CustomTextArea from '@/components/ui/CustomTextArea';
import CustomSelect from '@/components/ui/CustomSelect';
import CustomRadioGroup from '@/components/ui/CustomRadioGroup';
// import CustomCheckbox from '@/components/ui/CustomCheckbox';
import CustomSwitch from '@/components/ui/CustomSwitch';
import CustomDatePicker from '@/components/ui/CustomDatePicker';
import DateRangePicker from '@/components/ui/DateRangePicker';
import ImageUploadField from '@/components/ui/ImageUploadField';

export default function GlobalInput({
    type = 'text',
    label,
    name,
    value,
    onChange,
    options = [],
    rows = 3,
    control, // for ImageUploadField (react-hook-form)
    placeholder,
    errorMessage,
    ...rest
}) {
    switch (type) {
        case 'text':
            return (
                <CustomTextField
                    label={label}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    error={!!errorMessage}
                    helperText={errorMessage || ''}
                    {...rest}
                />
            );

        case 'textarea':
            return (
                <CustomTextArea
                    label={label}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    error={!!errorMessage}
                    helperText={errorMessage || ''}
                    rows={rows}
                    {...rest}
                />
            );

        case 'select':
            return (
                <CustomSelect
                    label={label}
                    name={name}
                    value={value}
                    onChange={onChange}
                    options={options}
                    error={!!errorMessage}
                    helperText={errorMessage || ''}
                    {...rest}
                />
            );

        case 'radio':
            return (
                <CustomRadioGroup
                    label={label}
                    name={name}
                    value={value}
                    onChange={onChange}
                    options={options}
                    error={!!errorMessage}
                    helperText={errorMessage || ''}
                    {...rest}
                />
            );

        // case 'checkbox':
        //   return (
        //     <CustomCheckbox
        //       label={label}
        //       name={name}
        //       checked={value}
        //       onChange={onChange}
        //       {...rest}
        //     />
        //   );

        case 'switch':
            return (
                <CustomSwitch
                    label={label}
                    defaultChecked={value}
                    onChange={onChange}
                    error={!!errorMessage}
                    helperText={errorMessage || ''}
                    {...rest}
                />
            );

        case 'date':
            return (
                <CustomDatePicker
                    label={label}
                    value={value}
                    onChange={onChange}
                    error={!!errorMessage}
                    helperText={errorMessage || ''}
                    {...rest}
                />
            );

        case 'dateRange':
            return (
                <DateRangePicker
                    startDate={value?.[0] || null}
                    endDate={value?.[1] || null}
                    onChange={onChange}
                    error={!!errorMessage}
                    helperText={errorMessage || ''}
                    {...rest}
                />
            );

case 'image':
  return (
    <ImageUploadField
      label={label}
      value={value}
      onChange={onChange}
      error={!!errorMessage}
      helperText={errorMessage || ''}
      {...rest}
    />
  );


        default:
            // fallback to normal input
            return (
                <input
                    type="text"
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    {...rest}
                />
            );
    }
}
