'use client';

import React, { useRef } from 'react';
import { Box, Typography } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Controller } from 'react-hook-form';

const ImageUploadField = ({
  name,
  control,
  label = 'Upload Image',
  accept = 'image/*',
  height = 120,
}) => {
  const inputRef = useRef(null);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Box>
          {/* Label */}
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            {label}
          </Typography>

          {/* Upload Box */}
          <Box
            onClick={() => inputRef.current?.click()}
            sx={{
              border: '2px dashed',
              borderColor: 'divider',
              borderRadius: 2,
              p: 3,
              textAlign: 'center',
              cursor: 'pointer',
              transition: '0.2s',
              '&:hover': {
                borderColor: 'primary.main',
                backgroundColor: 'action.hover',
              },
            }}
          >
            <CloudUploadIcon color="primary" sx={{ fontSize: 40 }} />

            <Typography variant="body2" sx={{ mt: 1 }}>
              Click to upload image
            </Typography>

            <Typography variant="caption" color="text.secondary">
              PNG, JPG, JPEG
            </Typography>

            {/* Hidden Input */}
            <input
              ref={inputRef}
              type="file"
              hidden
              accept={accept}
              onChange={(e) => field.onChange(e.target.files?.[0] || null)}
            />

            {/* Preview */}
            {field.value && (
              <Box
                component="img"
                src={URL.createObjectURL(field.value)}
                alt="Preview"
                sx={{
                  mt: 2,
                  maxHeight: height,
                  borderRadius: 2,
                  objectFit: 'cover',
                }}
              />
            )}
          </Box>
        </Box>
      )}
    />
  );
};

export default ImageUploadField;
