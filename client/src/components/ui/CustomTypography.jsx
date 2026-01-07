'use client';

import React from 'react';
import { Typography, useTheme } from '@mui/material';

const CustomTypography = ({
  variant = 'body1',
  fontWeight = 400,
  align = 'left',
  sx = {},
  color,
  children,
  ...props
}) => {
  const theme = useTheme(); // Get current theme

  return (
    <Typography
      variant={variant}
      align={align}
      color={color || theme.palette.text.primary} 
      sx={{ fontWeight, ...sx }} 
      {...props}
    >
      {children}
    </Typography>
  );
};

export default CustomTypography;
