'use client';

import React from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

export interface CustomInputProps {
  label?: string;
  placeholder?: string;
  type?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fullWidth?: boolean;
  required?: boolean;
  disabled?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  sx?: object;
  name?: string;
}

const CustomInput: React.FC<CustomInputProps> = ({
  label,
  placeholder,
  type = 'text',
  value,
  onChange,
  fullWidth = true,
  required = false,
  disabled = false,
  startIcon,
  endIcon,
  sx = {},
  name,
}) => {
  return (
    <TextField
      label={label}
      placeholder={placeholder}
      type={type}
      value={value}
      onChange={onChange}
      fullWidth={fullWidth}
      required={required}
      disabled={disabled}
      name={name}
      InputProps={{
        startAdornment: startIcon ? (
          <InputAdornment position="start">{startIcon}</InputAdornment>
        ) : undefined,
        endAdornment: endIcon ? (
          <InputAdornment position="end">{endIcon}</InputAdornment>
        ) : undefined,
      }}
      sx={{
        '& .MuiInputBase-root': {
          borderRadius: '8px', // matches your theme shape
        },
        ...sx,
      }}
    />
  );
};

export default CustomInput;
