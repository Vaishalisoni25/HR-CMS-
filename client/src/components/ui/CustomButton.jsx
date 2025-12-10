'use client';

import React from 'react';
import PropTypes from 'prop-types';
import { Button, CircularProgress } from '@mui/material';

const CustomButton = ({
  children,
  variant = 'contained',
  color = 'primary',
  size = 'medium',
  fullWidth = false,
  startIcon = null,
  endIcon = null,
  disabled = false,
  loading = false,
  type = 'button',
  onClick,
  sx = {},
}) => {
  return (
    <Button
      variant={variant}
      color={color}
      size={size}
      fullWidth={fullWidth}
      startIcon={startIcon}
      endIcon={endIcon}
      disabled={disabled || loading}
      type={type}
      onClick={onClick}
      sx={sx}
    >
      {loading ? <CircularProgress size={20} color="inherit" /> : children}
    </Button>
  );
};

CustomButton.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['text', 'outlined', 'contained']),
  color: PropTypes.oneOf([
    'inherit', 'primary', 'secondary', 'success', 'error', 'info', 'warning'
  ]),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  fullWidth: PropTypes.bool,
  startIcon: PropTypes.node,
  endIcon: PropTypes.node,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  type: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  sx: PropTypes.object,
};

export default CustomButton;
