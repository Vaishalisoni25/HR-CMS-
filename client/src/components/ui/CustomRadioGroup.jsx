'use client';

import React, { useState } from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';

const CustomRadioGroup = ({
  label = '',
  options = [],
  defaultValue = '',
  onChange,
  ...props
}) => {
  const [value, setValue] = useState(defaultValue);

  const handleChange = (event) => {
    setValue(event.target.value);
    if (onChange) onChange(event.target.value);
  };

  return (
    <FormControl {...props}>
      {label && <FormLabel>{label}</FormLabel>}
      <RadioGroup value={value} onChange={handleChange}>
        {options.map((option) => (
          <FormControlLabel
            key={option.value}
            value={option.value}
            control={<Radio />}
            label={option.label}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
};

export default CustomRadioGroup;
