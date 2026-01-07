'use client';

import React, { useRef } from 'react';
import { Box, Typography } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Controller } from 'react-hook-form';
import './styles.scss'; 

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
        <div className="image-upload-field">
          
          <Typography variant="subtitle2" className="upload-label">
            {label}
          </Typography>

          <div className="upload-box" onClick={() => inputRef.current?.click()}>
            <CloudUploadIcon className="upload-icon" />

            <Typography variant="body2" className="upload-text">
              Click to upload image
            </Typography>

            <Typography variant="caption" className="upload-caption">
              PNG, JPG, JPEG
            </Typography>

            <input
              ref={inputRef}
              type="file"
              hidden
              accept={accept}
              onChange={(e) => field.onChange(e.target.files?.[0] || null)}
            />

            {/* Preview */}
            {field.value && (
              <img
                src={
                  field.value instanceof File
                    ? URL.createObjectURL(field.value)
                    : field.value
                }
                alt="Preview"
                className="preview-image"
                style={{ maxHeight: height }} 
              />
            )}
          </div>
        </div>
      )}
    />
  );
};

export default ImageUploadField;
