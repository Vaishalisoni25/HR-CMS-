import React from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';

const DateRangePicker = ({
  startDate,
  endDate,
  onChange,
  minDate,
  maxDate,
  disabled = false,
}) => {
  const handleStartDateChange = (date) => {
    // Ensure startDate is not after endDate
    if (endDate && date > endDate) {
      onChange(date, date);
    } else {
      onChange(date, endDate);
    }
  };

  const handleEndDateChange = (date) => {
    // Ensure endDate is not before startDate
    if (startDate && date < startDate) {
      onChange(date, date);
    } else {
      onChange(startDate, date);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <DatePicker
          label="Start Date"
          value={startDate}
          onChange={handleStartDateChange}
          minDate={minDate}
          maxDate={maxDate}
          disabled={disabled}
          renderInput={(params) => <TextField {...params} fullWidth />}
        />
        <DatePicker
          label="End Date"
          value={endDate}
          onChange={handleEndDateChange}
          minDate={minDate}
          maxDate={maxDate}
          disabled={disabled}
          renderInput={(params) => <TextField {...params} fullWidth />}
        />
      </Box>
    </LocalizationProvider>
  );
};

export default DateRangePicker;
