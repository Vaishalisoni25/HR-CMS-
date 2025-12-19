'use client';

import React, { useState } from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import { Box } from '@mui/material';

const CustomRadioGroup = ({
  label = '',
  name = '',
  options = [],
  defaultValue = '',
  onChange,
  value='',
  row = true,
  size = 'medium', 
  ...props
}) => {
  // const [value, setValue] = useState(defaultValue);

  // const handleChange = (event) => {
  //   setValue(event.target.value);
  //   if (onChange) onChange(event.target.value);
  // };

  return (
    <FormControl fullWidth {...props}>
     
      {label && <FormLabel>{label}</FormLabel>}
      <RadioGroup row={row} name={name} value={value} onChange={onChange}>
        {options.map((option) => (
          <FormControlLabel
            key={option.value}
            value={option.value}
            control={<Radio size={size || 'medium'}/>}
            label={option.label}
            sx={{
              cursor: 'pointer',        
            }}
          />
        ))}
      </RadioGroup>
      
    </FormControl>
  );
};

export default CustomRadioGroup;
