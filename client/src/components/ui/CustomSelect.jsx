'use client';

import React from 'react';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { styled } from '@mui/material/styles';

const StyledSelect = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.shape.borderRadius,
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.body1.fontSize,
    backgroundColor: theme.palette.background.paper,
  },
}));

const CustomSelect = ({
  label = '',
  options = [],
  errorMessage = '',
  helperTextMessage = '',
  ...props
}) => {
  return (
    <StyledSelect
      select
      fullWidth
       InputLabelProps={{ shrink: true }}
      label={label}
      error={!!errorMessage}
      helperText={
        <>
          {errorMessage && <span style={{ color: 'red' }}>{errorMessage}</span>}
          {helperTextMessage && <span style={{ color: '#6b7280' }}>{helperTextMessage}</span>}
        </>
      }
      {...props}
    >
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value} disabled={option.disabled || false}>
          {option.label}
        </MenuItem>
      ))}
    </StyledSelect>
  );
};

export default CustomSelect;
