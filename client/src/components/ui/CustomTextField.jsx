'use client';

import React from 'react';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';

// Styled wrapper for consistent design
const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.shape.borderRadius,
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.body1.fontSize,
    backgroundColor: theme.palette.background.paper,
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
    },
  },
  '& .MuiFormHelperText-root': {
    fontSize: '0.8rem',
  },
}));

const CustomTextField = ({
  label = '',
  errorMessage = '',
  helperTextMessage = '',
  ...props
}) => {
  return (
    <StyledTextField
      label={label}
      variant="outlined"
      error={!!errorMessage}
      helperText={
        <>
          {errorMessage && (
            <span style={{ color: 'red', display: 'block' }}>{errorMessage}</span>
          )}
          {helperTextMessage && (
            <span style={{ color: '#6b7280', display: 'block' }}>{helperTextMessage}</span>
          )}
        </>
      }
      {...props}
    />
  );
};

export default CustomTextField;
