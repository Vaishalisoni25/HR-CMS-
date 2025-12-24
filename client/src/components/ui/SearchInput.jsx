'use client';
import React from 'react';
import Card from '@mui/material/Card';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import { MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';

export function SearchInput({ value, onChange, placeholder = "Search...", icon, maxWidth = '500px' }) {
  return (
    <Card sx={{ p: 2 }}>
      <OutlinedInput
        value={value}
        onChange={onChange}
        fullWidth
        placeholder={placeholder}
        startAdornment={
          <InputAdornment position="start">
            {icon || <MagnifyingGlassIcon fontSize="var(--icon-fontSize-md)" />}
          </InputAdornment>
        }
        sx={{ maxWidth }}
      />
    </Card>
  );
}
