import React from 'react';
import TextField from '@mui/material/TextField';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DatePicker, DesktopDatePicker } from '@mui/x-date-pickers';

const CustomDatePicker = ({
  label = 'Select Date',
  value,
  onChange,
  minDate,
  maxDate,
  fullWidth = true,
  disabled = false,
  error,
  helperText,
}) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DesktopDatePicker
        label={label}
        value={value}
        onChange={onChange}
        minDate={minDate}
        maxDate={maxDate}
        disabled={disabled}
        slotProps={{
          textField: {
            fullWidth,
            size: 'small',
            error,
            helperText,
            placeholder: 'Select date',
            InputLabelProps: {
              shrink: true,                  
            },
          },
        }}
      />
    </LocalizationProvider>
  );
};

export default CustomDatePicker;
