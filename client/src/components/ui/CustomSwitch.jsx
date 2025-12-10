'use client';

import React, { useState } from 'react';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';

const CustomSwitch = ({ label = '', defaultChecked = false, onChange, ...props }) => {
  const [checked, setChecked] = useState(defaultChecked);

  const handleChange = (event) => {
    setChecked(event.target.checked);
    if (onChange) onChange(event.target.checked);
  };

  return (
    <FormControlLabel
      control={<Switch checked={checked} onChange={handleChange} {...props} />}
      label={label}
    />
  );
};

export default CustomSwitch;
