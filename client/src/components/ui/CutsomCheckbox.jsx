'use client';

import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox, FormControlLabel } from '@mui/material';

const CustomCheckbox = ({
  label,
  checked,
  onChange,
  color = 'primary',
  size = 'medium',
  disabled = false,
}) => {
  return (
    <FormControlLabel
      control={
        <Checkbox
          checked={checked}
          onChange={onChange}
          color={color}
          size={size}
          disabled={disabled}
        />
      }
      label={label}
    />
  );
};

CustomCheckbox.propTypes = {
  label: PropTypes.string,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  color: PropTypes.string,
  size: PropTypes.oneOf(['small', 'medium']),
  disabled: PropTypes.bool,
};

export default CustomCheckbox;

