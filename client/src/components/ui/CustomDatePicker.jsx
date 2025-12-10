import React from 'react';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';

const CustomDatePicker = ({
  label = 'Select Date',
  value,
  onChange,
  minDate,
  maxDate,
  fullWidth = true,
  disabled = false,
}) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        label={label}
        value={value}
        onChange={onChange}
        minDate={minDate}
        maxDate={maxDate}
        disabled={disabled}
        renderInput={(params) => <TextField {...params} fullWidth={fullWidth} />}
      />
    </LocalizationProvider>
  );
};

export default CustomDatePicker;
